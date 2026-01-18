from core.database import Base
from sqlalchemy import Column, Date, Float, Integer


class Profit_predictions(Base):
    __tablename__ = "profit_predictions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    prediction_date = Column(Date, nullable=False)
    predicted_profit = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)