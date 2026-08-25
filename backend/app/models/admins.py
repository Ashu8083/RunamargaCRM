# app/models/admins.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    ForeignKey,
    TIMESTAMP,
    DateTime,
    Boolean,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=True)
    phone = Column(String, unique=True, nullable=True)

    gender = Column(Enum("male", "female", "others", name="gender_enum"), nullable=True)

    marital_status = Column(
        Enum(
            "married",
            "single",
            "divorced",
            "die hard single",
            "live in",
            name="marital_status_enum",
        ),
        nullable=True,
    )

    email_verified_at = Column(TIMESTAMP, nullable=True)
    password = Column(String, nullable=True)
    password_hint = Column(String, nullable=True)
    image = Column(String, nullable=True)

    manager_id = Column(String, nullable=True)
    loan_type = Column(String, nullable=True)

    state_id = Column(Integer, ForeignKey("states.id"))
    city_id = Column(Integer, ForeignKey("cities.id"))
    language_id = Column(Integer, ForeignKey("languages.id"))

    state = relationship("State", lazy="joined")
    city = relationship("City", lazy="joined")
    language = relationship("Language", lazy="joined")

    status = Column(
        Enum("active", "inactive", name="admin_status_enum"), default="active"
    )
    role = Column(String, nullable=True)

    # ✅ NEW: OTP fields
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    # 👇 ADD THIS
    deactivate = Column(
        Boolean,
        nullable=False,
        server_default="false",
    )
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, onupdate=func.now())
    deleted_at = Column(TIMESTAMP, nullable=True)

    # ✅ NEW: Add relationship for remarks
    loan_remarks = relationship(
        "LoanApplicationRemark",
        foreign_keys="LoanApplicationRemark.sender_admin_id",
        back_populates="sender",
    )

    admin_details = relationship(
        "AdminDetails",
        back_populates="admin",
        uselist=False  # if one-to-one
    )
    loan_notes = relationship(
        "LoanNote",
        back_populates="admin",
        cascade="all, delete-orphan"
    )
    reverted_loans = relationship(
    "RevertedLoan",
    back_populates="admin",
    lazy="select",
    cascade="all, delete-orphan"
    )