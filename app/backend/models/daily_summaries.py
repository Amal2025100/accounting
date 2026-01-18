from core.database import Base
from sqlalchemy import Column, Date, Float, Integer


class Daily_summaries(Base):
    __tablename__ = "daily_summaries"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    summary_date = Column(Date, nullable=False)
    total_sales = Column(Float, nullable=False)
    total_expenses = Column(Float, nullable=False)
    profit = Column(Float, nullable=False)
    cash_balance = Column(Float, nullable=False)