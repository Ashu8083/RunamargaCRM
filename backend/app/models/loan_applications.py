# app/models/loan_application.py

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

    # =====================================================
    # OWNERSHIP / ASSIGNMENT
    # =====================================================

    applied_by_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=True,
    )

    agent_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=True,
    )

    rm_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=True,
    )

    # -----------------------------------------------------
    # Employee relationships
    # -----------------------------------------------------

    applied_by = relationship(
        "Employee",
        foreign_keys=[applied_by_id],
    )

    agent = relationship(
        "Employee",
        foreign_keys=[agent_id],
    )

    rm = relationship(
        "Employee",
        foreign_keys=[rm_id],
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

    # reverted_loans = relationship(
    #     "RevertedLoan",
    #     back_populates="loan",
    #     lazy="select",
    #     cascade="all, delete-orphan",
    # )

    # =====================================================
    # INDEXES
    # =====================================================

    __table_args__ = (

        Index(
            "idx_loan_applied_date",
            "applied_date",
        ),

        Index(
            "idx_loan_agent_id",
            "agent_id",
        ),

        Index(
            "idx_loan_rm_id",
            "rm_id",
        ),

        Index(
            "idx_loan_type_id",
            "loan_type_id",
        ),

        Index(
            "idx_loan_deleted_at",
            "deleted_at",
        ),

        Index(
            "idx_dashboard_main",
            "deleted_at",
            "applied_date",
            "agent_id",
            "rm_id",
            "loan_type_id",
        ),
    )