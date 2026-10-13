# backend\app\models\loan_assignments.py

from sqlalchemy import (
    Column,
    Integer,
    Enum,
    ForeignKey,
    TIMESTAMP,
    UniqueConstraint,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.models.base import Base


class LoanAssignmentStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class LoanAssignment(Base):
    __tablename__ = "loan_assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Employee receiving the loan assignment.
    employee_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Loan type being assigned.
    loan_type_id = Column(
        Integer,
        ForeignKey(
            "loan_types.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Employee context performing the action.
    action_by = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    status = Column(
        Enum(
            LoanAssignmentStatus,
            name="loan_assignment_status_enum",
        ),
        nullable=False,
        default=LoanAssignmentStatus.inactive,
        server_default="inactive",
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    # EmployeeContext receiving the assignment.
    # Explicitly use employee_context_id.
    employee_context = relationship(
        "EmployeeContext",
        back_populates="loan_assignments",
        foreign_keys=[employee_context_id],
    )

    # EmployeeContext performing the action.
    # Explicitly use action_by.
    action_by_context = relationship(
        "EmployeeContext",
        foreign_keys=[action_by],
    )

    # Loan type relationship.
    loan_type = relationship(
        "LoanType",
        back_populates="loan_assignments",
    )

    __table_args__ = (
        UniqueConstraint(
            "employee_context_id",
            "loan_type_id",
            name="uix_loan_assignment_employee_context_loan_type",
        ),
    )