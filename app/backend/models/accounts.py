from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Accounts(Base):
    __tablename__ = "accounts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    account_type = Column(String, nullable=False)
    balance = Column(Float, nullable=False)