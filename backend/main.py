from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import engine, Base
from sqlalchemy import text
import models  # noqa: F401 — registers models with Base
from routers.products import router as products_router
from routers.orders import router as orders_router
from routers.admin import router as admin_router
from routers.webhooks import router as webhooks_router
from routers.auth import router as auth_router
import logging

logger = logging.getLogger("nasseg")

MIGRATIONS = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'customer';",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        for stmt in MIGRATIONS:
            try:
                conn.execute(text(stmt))
                logger.info(f"Migration OK: {stmt[:60]}...")
            except Exception as e:
                logger.warning(f"Migration skipped ({e}): {stmt[:60]}...")
    yield


app = FastAPI(title="NASSEG API", version="1.0.0", lifespan=lifespan)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(admin_router)
app.include_router(webhooks_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "NASSEG API is running"}
