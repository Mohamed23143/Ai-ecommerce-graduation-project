from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import User, Product, Order, OrderItem, OrderStatus
from schemas import AuthOrderCreate, OrderResponse, OrderWithItemsResponse, OrderItemDetailResponse
from auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(body: AuthOrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user

    order = Order(user_id=user.id, total_amount=0.0, status=OrderStatus.pending)
    db.add(order)
    db.flush()

    total = 0.0
    order_items = []

    for item in body.items:
        product = db.get(Product, item.product_id)
        if not product:
            db.rollback()
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

        if product.stock_quantity < item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}': {product.stock_quantity} available, {item.quantity} requested",
            )

        product.stock_quantity -= item.quantity
        line_total = product.price * item.quantity
        total += line_total

        order_items.append(
            OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_purchase=product.price,
            )
        )

    db.bulk_save_objects(order_items)
    order.total_amount = total
    db.commit()
    db.refresh(order)
    return order


@router.get("/me", response_model=list[OrderWithItemsResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user

    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.created_at.desc())
        .all()
    )

    def _build(order: Order) -> dict:
        return {
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status.value if order.status else "pending",
            "created_at": order.created_at,
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

    return [_build(o) for o in orders]
