from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Ai_alerts(Base):
    __tablename__ = "ai_alerts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    alert_date = Column(DateTime(timezone=True), nullable=False)
    alert_type = Column(String, nullable=False)
    message = Column(String, nullable=False)
    risk_score = Column(Integer, nullable=False)