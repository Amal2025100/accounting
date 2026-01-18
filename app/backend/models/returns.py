from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Returns(Base):
    __tablename__ = "returns"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    return_number = Column(String, nullable=False)
    sale_id = Column(Integer, nullable=False)
    customer_id = Column(Integer, nullable=True)
    return_amount = Column(Float, nullable=False)
    reason = Column(String, nullable=True)
    processed_by = Column(String, nullable=True)
    return_date = Column(String, nullable=False)
    status = Column(String, nullable=True)
    created_at = Column(String, nullable=True)