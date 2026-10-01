# backend/app/models/bank_processing_logs.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base


class BankProcessingLog(Base):
    __tablename__ = "bank_processing_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Loan Application
    loan_id = Column(
        Integer,
        ForeignKey(
            "loan_applications.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Bank Processing
    bp_id = Column(
        Integer,
        ForeignKey(
            "bank_processings.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Event
    # LOGIN / SANCTIONED / REJECTED / DISBURSED
    event = Column(
        String(100),
        nullable=False,
        index=True,
    )

    # EmployeeContext who performed the action
    employee_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    # Relationships

    loan = relationship(
        "LoanApplication",
        foreign_keys=[loan_id],
        lazy="joined",
    )

    bank_processing = relationship(
        "BankProcessing",
        foreign_keys=[bp_id],
        lazy="joined",
    )

    employee_context = relationship(
        "EmployeeContext",
        foreign_keys=[employee_context_id],
        lazy="joined",
    )