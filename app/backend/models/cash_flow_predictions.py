from core.database import Base
from sqlalchemy import Column, Date, Float, Integer


class Cash_flow_predictions(Base):
    __tablename__ = "cash_flow_predictions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    prediction_date = Column(Date, nullable=False)
    predicted_balance = Column(Float, nullable=False)