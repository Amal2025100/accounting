from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Receipts(Base):
    __tablename__ = "receipts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    receipt_number = Column(String, nullable=False)
    sale_id = Column(Integer, nullable=False)
    customer_id = Column(Integer, nullable=True)
    total_amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=True)
    cashier_name = Column(String, nullable=True)
    receipt_date = Column(String, nullable=False)
    created_at = Column(String, nullable=True)