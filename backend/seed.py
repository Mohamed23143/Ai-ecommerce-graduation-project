"""Seed script — bulk inserts all frontend products into Supabase.
Run with: python backend/seed.py  (from project root)
"""

import sys
sys.path.insert(0, "backend")

from sqlalchemy import text
from database import engine, Base, SessionLocal
import models  # noqa: F401 — registers models so Base creates the right tables
from models import Product

PRODUCTS = [
    {"name": "Oversized Wool Coat",       "price": 720,  "image": "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&h=650&fit=crop&crop=top", "category": "women"},
    {"name": "Silk Blend Blazer",          "price": 540,  "image": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=650&fit=crop&crop=center", "category": "women"},
    {"name": "Merino Knit Dress",          "price": 310,  "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=650&fit=crop&crop=top", "category": "women"},
    {"name": "Tailored Wide Trousers",     "price": 420,  "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=650&fit=crop&crop=center", "category": "women"},
    {"name": "Double-Breasted Suit",       "price": 1200, "image": "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&h=650&fit=crop&crop=center", "category": "men"},
    {"name": "Cashmere V-Neck",            "price": 280,  "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&fit=crop&crop=top", "category": "men"},
    {"name": "Linen Summer Shirt",         "price": 195,  "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=650&fit=crop&crop=center", "category": "men"},
    {"name": "Slim Chino Pants",           "price": 240,  "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=650&fit=crop&crop=center", "category": "men"},
    {"name": "Leather Crossbody Bag",      "price": 480,  "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=650&fit=crop&crop=center", "category": "accessories"},
    {"name": "Silk Scarf",                 "price": 120,  "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=650&fit=crop&crop=center", "category": "accessories"},
    {"name": "Gold Chain Necklace",        "price": 350,  "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=650&fit=crop&crop=center", "category": "accessories"},
    {"name": "Leather Belt",               "price": 145,  "image": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&h=650&fit=crop&crop=center", "category": "accessories"},
    {"name": "Aviator Sunglasses",         "price": 290,  "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=650&fit=crop&crop=center", "category": "eyewear"},
    {"name": "Round Frame Glasses",        "price": 220,  "image": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=650&fit=crop&crop=center", "category": "eyewear"},
    {"name": "Cat-Eye Frames",             "price": 310,  "image": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=650&fit=crop&crop=center", "category": "eyewear"},
    {"name": "Square Tortoise Frames",     "price": 260,  "image": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=650&fit=crop&crop=center", "category": "eyewear"},
    {"name": "Belted Cashmere Overcoat",   "price": 890,  "image": "/product-main.png",                      "category": "women"},
    {"name": "Cashmere Turtleneck",        "price": 310,  "image": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&h=650&fit=crop&crop=top", "category": "women"},
    {"name": "Wide-Leg Trousers",          "price": 420,  "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop&crop=center", "category": "women"},
    {"name": "Ankle Boots",               "price": 560,  "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=650&fit=crop&crop=center", "category": "footwear"},
]

SIZES_BY_CATEGORY = {
    "women": ["XS", "S", "M", "L", "XL"],
    "men": ["S", "M", "L", "XL", "XXL"],
    "accessories": ["One Size"],
    "eyewear": ["One Size"],
    "footwear": ["36", "37", "38", "39", "40", "41", "42"],
}

COLORS = ["Black", "Ivory", "Charcoal", "Camel", "Navy"]


def seed():
    with engine.connect() as conn:
        conn.execute(text("TRUNCATE TABLE products CASCADE"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    rows = []
    for p in PRODUCTS:
        rows.append(Product(
            name=p["name"],
            description=f"A premium {p['name'].lower()} from the NASSEG {p['category']} collection.",
            price=p["price"],
            category=p["category"],
            image=p["image"],
            sizes=SIZES_BY_CATEGORY.get(p["category"], ["One Size"]),
            colors=COLORS,
            stock_quantity=15,
        ))

    db.bulk_save_objects(rows)
    db.commit()
    db.close()

    print(f"Seeded {len(rows)} products into Supabase.")


if __name__ == "__main__":
    seed()
