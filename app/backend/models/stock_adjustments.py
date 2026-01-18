from core.database import Base
from sqlalchemy import Column, Integer, String


class Stock_adjustments(Base):
    __tablename__ = "stock_adjustments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    product_id = Column(Integer, nullable=False)
    product_name = Column(String, nullable=True)
    adjustment_type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    reason = Column(String, nullable=True)
    adjusted_by = Column(String, nullable=True)
    adjustment_date = Column(String, nullable=False)
    created_at = Column(String, nullable=True)