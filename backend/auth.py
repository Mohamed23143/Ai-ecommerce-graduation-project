import os
import json
import time
import base64
from pathlib import Path
from dotenv import load_dotenv
import jwt
import requests
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

security = HTTPBearer()

CLERK_PUBLISHABLE_KEY = os.getenv("VITE_CLERK_PUBLISHABLE_KEY")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY", "")
CLERK_DOMAIN = None
JWKS_URL = None

if CLERK_PUBLISHABLE_KEY:
    raw = CLERK_PUBLISHABLE_KEY.replace("pk_test_", "").replace("pk_live_", "")
    try:
        padding = 4 - len(raw) % 4
        if padding != 4:
            raw += "=" * padding
        domain = base64.b64decode(raw).decode("utf-8")
        # Strip any non-domain characters (e.g. trailing version byte)
        domain = domain.strip().rstrip("$")
        CLERK_DOMAIN = domain
        JWKS_URL = f"https://{CLERK_DOMAIN}/.well-known/jwks.json"
    except Exception:
        pass

_jwks_cache: dict = {"keys": None, "expires_at": 0.0}


def _get_jwks() -> list[dict]:
    now = time.time()
    if now < _jwks_cache["expires_at"] and _jwks_cache["keys"]:
        return _jwks_cache["keys"]
    if not JWKS_URL:
        raise HTTPException(status_code=500, detail="Clerk JWKS URL not configured")
    resp = requests.get(JWKS_URL, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    _jwks_cache["keys"] = data.get("keys", [])
    _jwks_cache["expires_at"] = now + 300
    return _jwks_cache["keys"]


def _fetch_clerk_user_email(clerk_user_id: str) -> str:
    """Try to fetch user email from Clerk Backend API."""
    if not CLERK_SECRET_KEY:
        return ""
    try:
        resp = requests.get(
            f"https://api.clerk.com/v1/users/{clerk_user_id}",
            headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"},
            timeout=5,
        )
        if resp.status_code == 200:
            data = resp.json()
            addrs = data.get("email_addresses", [])
            if addrs:
                return addrs[0].get("email_address", "")
    except Exception:
        pass
    return ""


def verify_clerk_token(token: str) -> dict:
    keys = _get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")

    key_data = None
    for k in keys:
        if k.get("kid") == kid:
            key_data = k
            break

    if not key_data:
        raise HTTPException(status_code=401, detail="Invalid token key ID")

    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key_data))

    try:
        claims = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            issuer=f"https://{CLERK_DOMAIN}",
            options={"verify_aud": False, "verify_exp": False},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    return claims

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    claims = verify_clerk_token(credentials.credentials)
    clerk_id = claims.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="Token missing subject")

    user = db.query(User).filter(User.clerk_user_id == clerk_id).first()
    if not user:
        # New user — try to get their email from Clerk API
        email = _fetch_clerk_user_email(clerk_id)
        user = User(clerk_user_id=clerk_id, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.email:
        # Existing user with empty email — try to fill it
        email = _fetch_clerk_user_email(clerk_id)
        if email:
            user.email = email
            db.commit()
            db.refresh(user)

    return user

