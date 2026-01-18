from core.database import Base
from sqlalchemy import Column, Date, Integer, String


class Journal_entries(Base):
    __tablename__ = "journal_entries"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    entry_date = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    created_by = Column(String, nullable=False)