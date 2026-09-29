# backend/app/models/loan_type_change_log.py

from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    String,
)
from sqlalchemy.orm import relationship

from app.models.base import Base


class LoanTypeChangeLog(Base):
    __tablename__ = "loan_type_change_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    loan_id = Column(
        Integer,
        ForeignKey("loan_applications.id"),
        nullable=False,
        index=True,
    )

    changed_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id"),
        nullable=False,
        index=True,
    )

    changed_by_role = Column(
        String(100),
        nullable=False,
    )

    reports_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id"),
        nullable=True,
        index=True,
    )

    from_loan_type_id = Column(
        Integer,
        ForeignKey("loan_types.id"),
        nullable=True,
        index=True,
    )

    to_loan_type_id = Column(
        Integer,
        ForeignKey("loan_types.id"),
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    deleted_at = Column(
        DateTime,
        nullable=True,
        index=True,
    )

    loan = relationship(
        "LoanApplication",
        foreign_keys=[loan_id],
        lazy="joined",
    )

    changed_by = relationship(
        "EmployeeContext",
        foreign_keys=[changed_by_id],
        lazy="joined",
    )

    reports_to = relationship(
        "EmployeeContext",
        foreign_keys=[reports_to_id],
        lazy="joined",
    )

    from_loan_type = relationship(
        "LoanType",
        foreign_keys=[from_loan_type_id],
        lazy="joined",
    )

    to_loan_type = relationship(
        "LoanType",
        foreign_keys=[to_loan_type_id],
        lazy="joined",
    )