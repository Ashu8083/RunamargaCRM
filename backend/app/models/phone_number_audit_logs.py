# app/models/phone_number_audit_logs.py

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class PhoneNumberAuditLog(Base):
    __tablename__ = "phone_number_audit_logs"

    id = Column(
        Integer,
        autoincrement=True,
        primary_key=True,
        index=True,
    )

    action = Column(
        String(100),
        nullable=False,
        index=True,
    )

    phone_number_id = Column(
        Integer,
        ForeignKey("phone_numbers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    phone = Column(
        String(255),
        nullable=True,
    )

    action_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    employee_context_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    report_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    date_and_time = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        default=func.now(),
        nullable=False,
        index=True,
    )

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    phone_number = relationship(
        "PhoneNumber",
        foreign_keys=[phone_number_id],
        lazy="select",
    )

    performer = relationship(
        "EmployeeContext",
        foreign_keys=[action_by_id],
        lazy="select",
    )

    target = relationship(
        "EmployeeContext",
        foreign_keys=[employee_context_id],
        lazy="select",
    )

    reporting_manager = relationship(
        "EmployeeContext",
        foreign_keys=[report_to_id],
        lazy="select",
    )
