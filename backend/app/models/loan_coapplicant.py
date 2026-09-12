# app/models/loan_coapplicant.py
from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.models.base import Base

class LoanCoApplicant(Base):
    __tablename__ = "loan_coapplicants"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loan_applications.id", ondelete="CASCADE"), nullable=True)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    cur_addr = Column(String, nullable=True)
    per_addr = Column(String, nullable=True)
    pancard_no = Column(String, nullable=True)
    adharr_no = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)
