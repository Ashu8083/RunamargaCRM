# backend/app/models/duplicate_approvals.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DECIMAL,
    ForeignKey,
    TIMESTAMP,
    Index,
    Enum,
    Text,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

import enum


# =========================================================
# DUPLICATE APPROVAL STATUS
# =========================================================

class DuplicateApprovalStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


# =========================================================
# DUPLICATE APPROVAL
# =========================================================

class DuplicateApproval(Base):

    __tablename__ = "duplicate_approvals"

    # =====================================================
    # BASIC FIELDS
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=True,
    )

    phone = Column(
        String,
        nullable=True,
    )

    # =====================================================
    # LOAN DETAILS
    # =====================================================

    loan_amt = Column(
        DECIMAL(15, 2),
        nullable=True,
    )

    loan_purpose = Column(
        String,
        nullable=True,
    )

    referral = Column(
        String,
        nullable=True,
    )

    # =====================================================
    # LOAN TYPE
    # =====================================================

    loan_type_id = Column(
        Integer,
        ForeignKey("loan_types.id"),
        nullable=True,
    )

    # =====================================================
    # OWNERSHIP
    # =====================================================

    applied_by_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=True,
    )

    applied_by = relationship(
        "Employee",
        foreign_keys=[applied_by_id],
    )

    # =====================================================
    # APPROVAL
    # =====================================================

    status = Column(
        Enum(
            DuplicateApprovalStatus,
            name="duplicate_approval_status",
        ),
        nullable=False,
        default=DuplicateApprovalStatus.pending,
    )

    approved_by_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=True,
    )

    approved_by = relationship(
        "Employee",
        foreign_keys=[approved_by_id],
    )

    rejected_remarks = Column(
        Text,
        nullable=True,
    )

    # =====================================================
    # STATUS & DATES
    # =====================================================

    applied_date = Column(
        Date,
        nullable=True,
    )

    approved_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    # =====================================================
    # LOAN APPLICATION
    # =====================================================

    # NULL while approval is pending.
    # Populated with the newly created loan application ID
    # after the duplicate request is approved.
    loan_id = Column(
        Integer,
        ForeignKey("loan_applications.id"),
        nullable=True,
    )

    loan_application = relationship(
        "LoanApplication",
        foreign_keys=[loan_id],
    )

    # =====================================================
    # RELATIONSHIP MANAGER
    # =====================================================

    # RM is optional.
    rm_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=True,
    )

    rm = relationship(
        "Employee",
        foreign_keys=[rm_id],
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    # =====================================================
    # INDEXES
    # =====================================================

    __table_args__ = (

        Index(
            "idx_duplicate_approval_applied_date",
            "applied_date",
        ),

        Index(
            "idx_duplicate_approval_type_id",
            "loan_type_id",
        ),

        Index(
            "idx_duplicate_approval_rm_id",
            "rm_id",
        ),

        Index(
            "idx_duplicate_approval_status",
            "status",
        ),

        Index(
            "idx_duplicate_approval_approved_by_id",
            "approved_by_id",
        ),

        Index(
            "idx_duplicate_approval_deleted_at",
            "deleted_at",
        ),

        Index(
            "idx_duplicate_approval_dashboard",
            "deleted_at",
            "applied_date",
            "status",
            "loan_type_id",
        ),
    )