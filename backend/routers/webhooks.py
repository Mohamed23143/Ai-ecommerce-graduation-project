import os
from fastapi import APIRouter, Request, HTTPException
from svix.webhooks import Webhook, WebhookVerificationError
from database import SessionLocal
from models import User

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/clerk")
async def clerk_webhook(request: Request):
    secret = os.getenv("CLERK_WEBHOOK_SIGNING_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    body = await request.body()
    headers = dict(request.headers)

    wh = Webhook(secret)
    try:
        payload = wh.verify(body, headers)
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event_type = payload.get("type")
    data = payload.get("data", {})

    db = SessionLocal()
    try:
        if event_type == "user.created":
            clerk_id = data.get("id")
            email_addr = data.get("email_addresses") or []
            email = email_addr[0].get("email_address", "") if email_addr else ""
            existing = db.query(User).filter(User.clerk_user_id == clerk_id).first()
            if existing:
                if email and existing.email != email:
                    existing.email = email
                    db.commit()
            else:
                db.add(User(clerk_user_id=clerk_id, email=email))
                db.commit()

        elif event_type == "user.updated":
            clerk_id = data.get("id")
            email_addr = data.get("email_addresses") or []
            email = email_addr[0].get("email_address", "") if email_addr else ""
            user = db.query(User).filter(User.clerk_user_id == clerk_id).first()
            if user:
                user.email = email
                db.commit()

        elif event_type == "user.deleted":
            clerk_id = data.get("id")
            db.query(User).filter(User.clerk_user_id == clerk_id).delete()
            db.commit()

    finally:
        db.close()

    return {"received": True}
