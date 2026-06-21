from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db
from models import Product
from schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def list_products(
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    size: Optional[str] = None,
    color: Optional[str] = None,
    db: Session = Depends(get_db),
):
    stmt = select(Product)
    if category:
        stmt = stmt.where(Product.category == category)
    if min_price is not None:
        stmt = stmt.where(Product.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Product.price <= max_price)
    if size:
        stmt = stmt.where(Product.sizes.contains([size]))
    if color:
        stmt = stmt.where(Product.colors.contains([color]))
    stmt = stmt.order_by(Product.created_at.desc())
    return db.execute(stmt).scalars().all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(body: ProductCreate, db: Session = Depends(get_db)):
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
