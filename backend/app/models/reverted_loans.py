# app/models/reverted_loans.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    ForeignKey,
    Text,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base


class RevertedLoan(Base):
    __tablename__ = "reverted_loans"

    id = Column(Integer, primary_key=True, index=True)

    remarks = Column(Text, nullable=True)

    loan_id = Column(
        Integer,
        ForeignKey("loan_applications.id"),
        nullable=False,
    )

    reverted_by_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False,
    )

    reverted_by_name = Column(
        String(150),
        nullable=False,
    )

    rejection_type = Column(
        String(50),
        nullable=False,
    )

    reverted_by_role = Column(
        String(50),
        nullable=False,
    )

    reverted_at = Column(
        TIMESTAMP,
        server_default=func.now(),
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP,
        onupdate=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP,
        nullable=True,
    )

    loan = relationship(
        "LoanApplication",
        back_populates="reverted_loans",
    )

    employee = relationship(
        "Employee",
        foreign_keys=[reverted_by_id],
    )