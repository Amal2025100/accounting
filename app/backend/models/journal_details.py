from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Journal_details(Base):
    __tablename__ = "journal_details"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    entry_id = Column(Integer, nullable=False)
    account_id = Column(Integer, nullable=False)
    account_name = Column(String, nullable=False)
    debit = Column(Float, nullable=False)
    credit = Column(Float, nullable=False)