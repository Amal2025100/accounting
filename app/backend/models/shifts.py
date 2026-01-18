from core.database import Base
from sqlalchemy import Column, Integer, String


class Shifts(Base):
    __tablename__ = "shifts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    employee_id = Column(Integer, nullable=False)
    employee_name = Column(String, nullable=True)
    shift_date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    clock_in = Column(String, nullable=True)
    clock_out = Column(String, nullable=True)
    status = Column(String, nullable=True)
    created_at = Column(String, nullable=True)