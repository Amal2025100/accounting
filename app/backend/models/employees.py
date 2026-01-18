from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Employees(Base):
    __tablename__ = "employees"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    employee_code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(String, nullable=False)
    department = Column(String, nullable=True)
    hire_date = Column(String, nullable=True)
    salary = Column(Float, nullable=True)
    status = Column(String, nullable=True)
    created_at = Column(String, nullable=True)