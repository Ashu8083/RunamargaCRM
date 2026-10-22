# backend/app/models/leave_managements.py

from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
    Text,
    TIMESTAMP,
    CheckConstraint,
    Index,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class LeaveManagement(Base):
    __tablename__ = "leave_managements"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Employee who applied for the leave
    applied_by = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    from_date = Column(
        Date,
        nullable=False,
    )

    to_date = Column(
        Date,
        nullable=False,
    )

    # Examples: Full Day Leave, WFH
    leave_type = Column(
        String(50),
        nullable=False,
    )

    reason = Column(
        Text,
        nullable=False,
    )

    # Pending, Approved, Rejected
    status = Column(
        String(20),
        nullable=False,
        default="Pending",
        server_default="Pending",
        index=True,
    )

    # EmployeeContext that reviewed the request
    approved_by = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    reviewed_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    review_remarks = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    # Relationships
    applicant = relationship(
        "Employee",
        foreign_keys=[applied_by],
    )

    approver_context = relationship(
        "EmployeeContext",
        foreign_keys=[approved_by],
    )

    __table_args__ = (
        CheckConstraint(
            "to_date >= from_date",
            name="ck_leave_managements_date_range",
        ),
        CheckConstraint(
            "status IN ('Pending', 'Approved', 'Rejected')",
            name="ck_leave_managements_status",
        ),
        Index(
            "ix_leave_managements_applied_by_dates",
            "applied_by",
            "from_date",
            "to_date",
        ),
    )