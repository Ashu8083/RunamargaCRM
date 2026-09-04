# app/models/dsa_details.py
from sqlalchemy import (
    Column, Integer, String, Enum, ForeignKey, TIMESTAMP, Boolean
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

import enum


class DSAStatus(str, enum.Enum):
    inactive = "0"
    active = "1"


class DSADetail(Base):
    __tablename__ = "d_s_a_details"

    id = Column(Integer, primary_key=True, index=True)

    dsa_name = Column(String, nullable=True)
    dsa_code = Column(String, nullable=True)

    loan_type_id = Column(
        Integer,
        ForeignKey("loan_types.id", ondelete="SET NULL"),
        nullable=True
    )

    bank_id = Column(
        Integer,
        ForeignKey("banks.id", ondelete="SET NULL"),
        nullable=True
    )

    status = Column(Enum(DSAStatus), default=DSAStatus.inactive)
    is_default = Column(Boolean, default=False, nullable=False)
    # Timestamps
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    # Relationships
    loan_type = relationship("LoanType", backref="dsa_details")
    bank = relationship("Bank", backref="dsa_details")
