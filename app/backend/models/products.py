from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    cost_price = Column(Float, nullable=False)
    sell_price = Column(Float, nullable=False)
    low_stock_threshold = Column(Integer, nullable=False)