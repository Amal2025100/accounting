from core.database import Base
from sqlalchemy import Boolean, Column, Integer, String


class Locations(Base):
    __tablename__ = "locations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    location_code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    manager_name = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)