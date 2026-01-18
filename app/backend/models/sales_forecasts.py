from core.database import Base
from sqlalchemy import Column, Date, Float, Integer


class Sales_forecasts(Base):
    __tablename__ = "sales_forecasts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    forecast_date = Column(Date, nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)