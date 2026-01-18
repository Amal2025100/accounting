from core.database import Base
from sqlalchemy import Boolean, Column, Float, Integer, String


class Tax_rates(Base):
    __tablename__ = "tax_rates"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)