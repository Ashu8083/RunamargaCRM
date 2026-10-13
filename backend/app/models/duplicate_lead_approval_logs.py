# backend/app/models/duplicate_lead_approval_logs.py

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    TIMESTAMP,
    Index,
    Enum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base
import enum


class DuplicateLeadApprovalLogStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class DuplicateLeadApprovalLog(Base):
    __tablename__ = "duplicate_lead_approval_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Original duplicate approval record
    duplicate_approval_id = Column(
        Integer,
        ForeignKey("duplicate_approvals.id", ondelete="SET NULL"),
        nullable=True,
    )

    duplicate_approval = relationship(
        "DuplicateApproval",
        foreign_keys=[duplicate_approval_id],
    )

    # Loan application created after approval
    loan_id = Column(
        Integer,
        ForeignKey("loan_applications.id", ondelete="SET NULL"),
        nullable=True,
    )

    loan_application = relationship(
        "LoanApplication",
        foreign_keys=[loan_id],
    )

    # Employee context that submitted the request
    submitted_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
    )

    submitted_by = relationship(
        "EmployeeContext",
        foreign_keys=[submitted_by_id],
    )

    # Reporting manager's employee context
    reports_to_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
    )

    reports_to = relationship(
        "EmployeeContext",
        foreign_keys=[reports_to_id],
    )

    # Employee who reviewed the request
    reviewed_by_id = Column(
        Integer,
        ForeignKey("employee_contexts.id", ondelete="SET NULL"),
        nullable=True,
    )

    reviewed_by = relationship(
    "EmployeeContext",
        foreign_keys=[reviewed_by_id],
    )

    # Status at the time of the event
    status = Column(
        Enum(
            DuplicateLeadApprovalLogStatus,
            name="duplicate_lead_approval_log_status",
        ),
        nullable=False,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    __table_args__ = (
        Index(
            "idx_duplicate_lead_approval_logs_duplicate_approval_id",
            "duplicate_approval_id",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_loan_id",
            "loan_id",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_submitted_by_id",
            "submitted_by_id",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_reports_to_id",
            "reports_to_id",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_reviewed_by_id",
            "reviewed_by_id",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_status",
            "status",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_deleted_at",
            "deleted_at",
        ),
        Index(
            "idx_duplicate_lead_approval_logs_dashboard",
            "deleted_at",
            "created_at",
            "status",
        ),
    )