# backend\app\models\bank_processings.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DECIMAL,
    Text,
    DateTime,
    Index,
)
from sqlalchemy.sql import func
from app.models.base import Base


class BankProcessing(Base):
    __tablename__ = "bank_processings"

    id = Column(Integer, primary_key=True, index=True)

    # Loan relationship
    loan_id = Column(
        Integer, ForeignKey("loan_applications.id", ondelete="CASCADE"), nullable=True
    )

    # Bank
    bank_id = Column(
        Integer, ForeignKey("banks.id", ondelete="CASCADE"), nullable=False
    )

    # Status
    status = Column(
        String,
        default="pending",
        comment="pending, login, sanctioned, disbursed, rejected, under_review",
    )

    # Loan Type
    loan_type_id = Column(
        Integer, ForeignKey("loan_types.id", ondelete="SET NULL"), nullable=True
    )

    offered_amount = Column(DECIMAL(12, 2), nullable=True)
    disbursement_amount = Column(DECIMAL(12, 2), nullable=True)

    interest_rate = Column(DECIMAL(5, 2), nullable=True)
    tenure_months = Column(Integer, nullable=True)
    processing_fees = Column(DECIMAL(10, 2), nullable=True)

    remarks = Column(Text, nullable=True)
    insurance = Column(Text, nullable=True)

    loggedin_at = Column(DateTime, nullable=True)
    sanctioned_at = Column(DateTime, nullable=True)
    disbursed_at = Column(DateTime, nullable=True)
    rejected_at = Column(DateTime, nullable=True)

    # DSA Details
    dsa_id = Column(String(100), nullable=True)
    dsa_code = Column(String(100), nullable=True)
    dsa_name = Column(String(150), nullable=True)
    approved_by = Column(Integer, nullable=True)
    application_reference_id = Column(String(150), nullable=True)
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Indexes
    __table_args__ = (
        Index("idx_loan_bank", "loan_id", "bank_id"),
        Index("idx_status", "status"),
        Index("idx_bank_processing_loan_id", "loan_id"),
    )

