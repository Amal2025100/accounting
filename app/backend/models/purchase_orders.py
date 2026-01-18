from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Purchase_orders(Base):
    __tablename__ = "purchase_orders"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    po_number = Column(String, nullable=False)
    supplier_id = Column(Integer, nullable=False)
    supplier_name = Column(String, nullable=True)
    order_date = Column(String, nullable=False)
    expected_delivery = Column(String, nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(String, nullable=True)