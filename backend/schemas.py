from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    category: str
    image: Optional[str] = ""
    sizes: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    stock_quantity: Optional[int] = 0


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    image: str
    sizes: list[str]
    colors: list[str]
    stock_quantity: int
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderItemInput(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    email: str
    items: list[OrderItemInput]


class AuthOrderCreate(BaseModel):
    email: str
    items: list[OrderItemInput]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float

    model_config = {"from_attributes": True}


class OrderItemDetailResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    product_name: str
    product_image: str


class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}


class OrderWithItemsResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemDetailResponse]


# ── Admin schemas ──────────────────────────────────────────

class AdminStatsResponse(BaseModel):
    total_orders: int
    total_revenue: float
    total_products: int
    total_users: int
    orders_by_status: dict[str, int]


class AdminUserInfo(BaseModel):
    id: int
    clerk_user_id: str
    email: str


class AdminOrderItemDetail(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    product_name: str
    product_image: str


class AdminOrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    user: AdminUserInfo
    items: list[AdminOrderItemDetail]


class StatusUpdate(BaseModel):
    status: str


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image: Optional[str] = None
    sizes: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    stock_quantity: Optional[int] = None


class AIGenerateDescriptionRequest(BaseModel):
    name: str
    category: str


class AIGenerateDescriptionResponse(BaseModel):
    description: str


# ── Admin Users ─────────────────────────────────────────

class AdminUserResponse(BaseModel):
    id: int
    clerk_user_id: str
    email: str
    order_count: int
    total_spent: float
    created_at: datetime


# ── Admin Categories ─────────────────────────────────────

class AdminCategoryResponse(BaseModel):
    name: str
    slug: str
    product_count: int


# ── Admin Analytics ──────────────────────────────────────

class MonthlyAnalyticsResponse(BaseModel):
    month: str
    revenue: float
    orders: int


class TopProductResponse(BaseModel):
    name: str
    sales: int
    revenue: float
