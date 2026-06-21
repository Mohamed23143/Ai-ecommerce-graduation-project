from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from models import User
from auth import verify_clerk_token
import os
import logging

logger = logging.getLogger("nasseg.auth")

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").lower()


class SyncUserRequest(BaseModel):
    email: str


@router.get("/me")
def auth_me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header required")

    claims = verify_clerk_token(credentials.credentials)
    clerk_id = claims.get("sub")
    email_from_token = (claims.get("email") or "").lower()
    logger.info(f"/auth/me — clerk_id={clerk_id} email_from_token={email_from_token}")

    role = "customer"

    # 1) Try to find user by email (most reliable identifier)
    user = None
    if email_from_token:
        user = db.query(User).filter(text("LOWER(email) = :email"), email=email_from_token).first()
        if user:
            logger.info(f"/auth/me — found user by email: id={user.id} db_role={user.role}")
        else:
            logger.info(f"/auth/me — no user found by email {email_from_token}")

    # 2) Fallback: find or create by Clerk ID
    if not user:
        user = db.query(User).filter(User.clerk_user_id == clerk_id).first()
        if user:
            logger.info(f"/auth/me — found existing user by clerk_id: id={user.id} email={user.email} db_role={user.role}")
            # Update email if token has one and db is stale
            if email_from_token and user.email != email_from_token:
                user.email = email_from_token
                db.commit()
                logger.info(f"/auth/me — updated user email to {email_from_token}")
        else:
            user = User(clerk_user_id=clerk_id, email=email_from_token or "", role="customer")
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"/auth/me — created new user: id={user.id} email={user.email}")

    # 3) Determine role: DB role column > email-based admin check
    db_role = (user.role or "").strip().lower()
    if db_role == "admin":
        role = "admin"
    elif db_role == "customer":
        role = "customer"
    elif email_from_token and email_from_token == ADMIN_EMAIL:
        role = "admin"
        user.role = "admin"
        db.commit()
        logger.info(f"/auth/me — upgraded user {user.id} to admin via email match")
    else:
        role = "customer"

    logger.info(f"/auth/me — resolved role={role} for user id={user.id} email={user.email}")
    return {"id": user.id, "email": user.email, "role": role}


@router.post("/sync-user")
def sync_user(
    body: SyncUserRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header required")

    claims = verify_clerk_token(credentials.credentials)
    clerk_id = claims.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="Token missing subject")

    user = db.query(User).filter(User.clerk_user_id == clerk_id).first()
    if user:
        if body.email and user.email != body.email:
            user.email = body.email
            db.commit()
    else:
        user = User(clerk_user_id=clerk_id, email=body.email)
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"id": user.id, "clerk_user_id": user.clerk_user_id, "email": user.email}
