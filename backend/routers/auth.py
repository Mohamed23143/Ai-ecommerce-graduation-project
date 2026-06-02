from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import verify_clerk_token

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


class SyncUserRequest(BaseModel):
    email: str


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
