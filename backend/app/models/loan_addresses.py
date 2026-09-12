# app/models/loan_addresses.py
from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.models.base import Base

class LoanAddress(Base):
    __tablename__ = "loan_addresses"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loan_applications.id", ondelete="CASCADE"), nullable=True)
    address = Column(String, nullable=True)
    address_type = Column(String, nullable=True)  # permanent / current / office

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)
