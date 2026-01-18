from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Customers(Base):
    __tablename__ = "customers"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    customer_code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    loyalty_points = Column(Integer, nullable=True)
    total_purchases = Column(Float, nullable=True)
    last_purchase_date = Column(String, nullable=True)
    created_at = Column(String, nullable=True)