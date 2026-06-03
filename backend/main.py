from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import engine, Base
import models  # noqa: F401 — registers models with Base
from routers.products import router as products_router
from routers.orders import router as orders_router
from routers.admin import router as admin_router
from routers.webhooks import router as webhooks_router
from routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
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
