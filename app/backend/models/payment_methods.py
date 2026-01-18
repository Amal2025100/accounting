from core.database import Base
from sqlalchemy import Boolean, Column, Integer, String


class Payment_methods(Base):
    __tablename__ = "payment_methods"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)