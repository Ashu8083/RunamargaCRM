# app/models/loan_applications.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    Date,
    DECIMAL,
    ForeignKey,
    TIMESTAMP,
    Index,
    Text,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base

import enum


# =========================================================
# LOAN STATUS
# =========================================================

class LoanStatus(str, enum.Enum):
    inprocess = "inprocess"
    docspending = "docspending"
    rejected = "rejected"
    sanctioned = "sanctioned"
    disbursed = "disbursed"
    login = "login"
    revert_rejected = "revert_rejected"


# =========================================================
# LOAN APPLICATION
# =========================================================

class LoanApplication(Base):

    __tablename__ = "loan_applications"

    # =====================================================
    # BASIC FIELDS
    # =====================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    unique_id = Column(
        String,
        nullable=True,
    )

    name = Column(
        String,
        nullable=True,
    )

    email = Column(
        String,
        nullable=True,
    )

    phone = Column(
        String,
        nullable=True,
    )

    gender = Column(
        String,
        nullable=True,
    )

    alternate_phone = Column(
        String,
        nullable=True,
    )

    alternate_email = Column(
        String,
        nullable=True,
    )

    marital_status = Column(
        String,
        nullable=True,
    )

    dob = Column(
        Date,
        nullable=True,
    )

    pancard_no = Column(
        String,
        nullable=True,
    )

    aadhar_no = Column(
        String,
        nullable=True,
    )

    bank_acc_no = Column(
        String,
        nullable=True,
    )

    ifsc_code = Column(
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

    loan_tenure = Column(
        String,
        nullable=True,
    )

    loan_purpose = Column(
        String,
        nullable=True,
    )

    credit_score = Column(
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

    loan_type = relationship(
        "LoanType",
        foreign_keys=[loan_type_id],
    )

    # =====================================================
    # OWNERSHIP / ASSIGNMENT
    # =====================================================

    # -----------------------------------------------------
    # Application created/performed by
    #
    # Points to the EmployeeContext that performed the
    # operation, rather than directly to employees.id.
    # -----------------------------------------------------

    applied_by_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    # -----------------------------------------------------
    # Agent assignment
    #
    # Points to the EmployeeContext representing the
    # employee operating as AGENT.
    # -----------------------------------------------------

    agent_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    # -----------------------------------------------------
    # RM assignment
    #
    # Points to the EmployeeContext representing the
    # employee operating as RM.
    # -----------------------------------------------------

    rm_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    # -----------------------------------------------------
    # Employee Context relationships
    # -----------------------------------------------------

    applied_by_context = relationship(
        "EmployeeContext",
        foreign_keys=[applied_by_context_id],
    )

    agent_context = relationship(
        "EmployeeContext",
        foreign_keys=[agent_context_id],
    )

    rm_context = relationship(
        "EmployeeContext",
        foreign_keys=[rm_context_id],
    )

    # =====================================================
    # STATUS & DATES
    # =====================================================

    applied_date = Column(
        Date,
        nullable=True,
    )

    status = Column(
        Enum(LoanStatus),
        default=LoanStatus.inprocess,
        nullable=True,
    )

    sanction_date = Column(
        Date,
        nullable=True,
    )

    rejection_date = Column(
        Date,
        nullable=True,
    )

    loggedin_date = Column(
        Date,
        nullable=True,
    )

    docspending_date = Column(
        Date,
        nullable=True,
    )

    reverted_status = Column(
        String,
        nullable=True,
    )

    # =====================================================
    # LOCATION / META
    # =====================================================

    state_id = Column(
        Integer,
        nullable=True,
    )

    city_id = Column(
        Integer,
        nullable=True,
    )

    language_id = Column(
        Integer,
        nullable=True,
    )

    ivr_id = Column(
        Integer,
        nullable=True,
    )

    rejected_remarks = Column(
        Text,
        nullable=True,
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    # =====================================================
    # CHILD RELATIONS
    # =====================================================

    # remarks = relationship(
    #     "LoanApplicationRemark",
    #     back_populates="loan_application",
    # )

    # customer_remarks = relationship(
    #     "CustomerRemark",
    #     back_populates="loan",
    #     cascade="all, delete-orphan",
    # )

    # loan_notes = relationship(
    #     "LoanNote",
    #     back_populates="loan",
    #     cascade="all, delete-orphan",
    # )

    reverted_loans = relationship(
        "RevertedLoan",
        back_populates="loan",
        lazy="select",
        cascade="all, delete-orphan",
    )

    # =====================================================
    # INDEXES
    # =====================================================

    __table_args__ = (

        # -------------------------------------------------
        # Application date
        # -------------------------------------------------

        Index(
            "idx_loan_applied_date",
            "applied_date",
        ),

        # -------------------------------------------------
        # Assignment indexes
        # -------------------------------------------------

        Index(
            "idx_loan_agent_context_id",
            "agent_context_id",
        ),

        Index(
            "idx_loan_rm_context_id",
            "rm_context_id",
        ),

        Index(
            "idx_loan_applied_by_context_id",
            "applied_by_context_id",
        ),

        # -------------------------------------------------
        # Loan type
        # -------------------------------------------------

        Index(
            "idx_loan_type_id",
            "loan_type_id",
        ),

        # -------------------------------------------------
        # Soft deletion
        # -------------------------------------------------

        Index(
            "idx_loan_deleted_at",
            "deleted_at",
        ),

        # -------------------------------------------------
        # Dashboard query optimization
        # -------------------------------------------------

        Index(
            "idx_dashboard_main",
            "deleted_at",
            "applied_date",
            "agent_context_id",
            "rm_context_id",
            "loan_type_id",
        ),
    )