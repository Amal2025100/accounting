from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Purchase_order_items(Base):
    __tablename__ = "purchase_order_items"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    po_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)
    product_name = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=True)
    received_quantity = Column(Integer, nullable=True)
    created_at = Column(String, nullable=True)