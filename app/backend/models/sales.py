from core.database import Base
from sqlalchemy import Column, DateTime, Float, Integer, String


class Sales(Base):
    __tablename__ = "sales"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    sale_date = Column(DateTime(timezone=True), nullable=False)
    total_amount = Column(Float, nullable=False)
    cashier_name = Column(String, nullable=False)