import os
from typing import Optional
import requests
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from database import get_db
from models import User, Product, Order, OrderItem, OrderStatus
from schemas import (
    ProductCreate,
    ProductResponse,
    AdminStatsResponse,
    AdminOrderResponse,
    AdminOrderItemDetail,
    AdminUserInfo,
    StatusUpdate,
    ProductUpdate,
    AIGenerateDescriptionRequest,
    AIGenerateDescriptionResponse,
    AdminUserResponse,
    AdminCategoryResponse,
    MonthlyAnalyticsResponse,
    TopProductResponse,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Stats ──────────────────────────────────────────────────


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar()
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0

    rows = (
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    orders_by_status = {s.value: c for s, c in rows}

    return AdminStatsResponse(
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        total_products=total_products,
        total_users=total_users,
        orders_by_status=orders_by_status,
    )


# ── Orders ──────────────────────────────────────────────────


def _build_admin_order(order: Order) -> dict:
    return {
        "id": order.id,
        "total_amount": order.total_amount,
        "status": order.status.value if order.status else "pending",
        "created_at": order.created_at,
        "user": {
            "id": order.user.id,
            "clerk_user_id": order.user.clerk_user_id,
            "email": order.user.email,
        },
        "items": [
            {
                "id": oi.id,
                "product_id": oi.product_id,
                "quantity": oi.quantity,
                "price_at_purchase": oi.price_at_purchase,
                "product_name": oi.product.name if oi.product else "Deleted",
                "product_image": oi.product.image if oi.product else "",
            }
            for oi in order.items
        ],
    }


@router.get("/orders", response_model=list[AdminOrderResponse])
def list_admin_orders(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(Order)
        .options(
            joinedload(Order.user),
            joinedload(Order.items).joinedload(OrderItem.product),
        )
        .order_by(Order.created_at.desc())
    )
    if status:
        q = q.where(Order.status == status)
    orders = q.all()
    return [_build_admin_order(o) for o in orders]


@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    try:
        new_status = OrderStatus(body.status)
    except ValueError:
        valid = [s.value for s in OrderStatus]
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid: {valid}")

    order.status = new_status
    db.commit()
    return {"detail": f"Order {order_id} updated to '{new_status.value}'"}


# ── Products ────────────────────────────────────────────────


@router.post("/products", response_model=ProductResponse, status_code=201)
def admin_create_product(body: ProductCreate, db: Session = Depends(get_db)):
    data = body.model_dump()
    if data.get("sizes") is None:
        data["sizes"] = []
    if data.get("colors") is None:
        data["colors"] = []
    product = Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
def admin_update_product(product_id: int, body: ProductUpdate, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def admin_delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        db.delete(product)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Cannot delete product — it has associated order items. Remove or archive instead.",
        )

    return {"detail": f"Product {product_id} deleted"}


# ── Users ────────────────────────────────────────────────


@router.get("/users", response_model=list[AdminUserResponse])
def list_admin_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        order_data = db.query(
            func.count(Order.id),
            func.coalesce(func.sum(Order.total_amount), 0),
        ).filter(Order.user_id == u.id).first()
        result.append(AdminUserResponse(
            id=u.id,
            clerk_user_id=u.clerk_user_id,
            email=u.email,
            order_count=order_data[0] or 0,
            total_spent=float(order_data[1] or 0),
            created_at=u.created_at,
        ))
    return result


# ── Categories ────────────────────────────────────────────


@router.get("/categories", response_model=list[AdminCategoryResponse])
def list_admin_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(Product.category, func.count(Product.id))
        .group_by(Product.category)
        .order_by(Product.category)
        .all()
    )
    return [
        AdminCategoryResponse(
            name=name,
            slug=name.lower().replace(" ", "-"),
            product_count=count,
        )
        for name, count in rows
    ]


# ── Analytics ─────────────────────────────────────────────


@router.get("/analytics/monthly", response_model=list[MonthlyAnalyticsResponse])
def get_monthly_analytics(db: Session = Depends(get_db)):
    rows = (
        db.query(
            extract("year", Order.created_at),
            extract("month", Order.created_at),
            func.count(Order.id),
            func.coalesce(func.sum(Order.total_amount), 0),
        )
        .group_by(extract("year", Order.created_at), extract("month", Order.created_at))
        .order_by(extract("year", Order.created_at), extract("month", Order.created_at))
        .all()
    )
    MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [
        MonthlyAnalyticsResponse(
            month=f"{MONTHS[int(m)]}" if int(year) == 2026 else f"{MONTHS[int(m)]} '{str(year)[2:]}",
            revenue=float(rev),
            orders=count,
        )
        for year, m, count, rev in rows
    ]


@router.get("/analytics/top-products", response_model=list[TopProductResponse])
def get_top_products(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Product.name,
            func.count(OrderItem.id),
            func.coalesce(func.sum(OrderItem.price_at_purchase * OrderItem.quantity), 0),
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.price_at_purchase * OrderItem.quantity).desc())
        .limit(10)
        .all()
    )
    return [
        TopProductResponse(name=name, sales=sales, revenue=float(rev))
        for name, sales, rev in rows
    ]


# ── AI Description Generator ───────────────────────────


@router.post("/ai/generate-description", response_model=AIGenerateDescriptionResponse)
def ai_generate_description(body: AIGenerateDescriptionRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    prompt = (
        f"Write a luxurious, elegant product description for a {body.category} product "
        f"named '{body.name}'. Keep it 2-4 sentences, luxury boutique tone, no markdown."
    )

    try:
        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "poolside/laguna-m.1:free",
                "max_tokens": 200,
                "temperature": 0.7,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=15,
        )
        res.raise_for_status()
        data = res.json()
        description = data["choices"][0]["message"]["content"].strip()
        return AIGenerateDescriptionResponse(description=description)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
