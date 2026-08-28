# app/models/employee_details.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    ForeignKey,
    TIMESTAMP,
    DateTime,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base


class EmployeeDetails(Base):
    __tablename__ = "employee_details"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        unique=True,
        index=True,
    )

    # Personal details
    gender = Column(
        Enum(
            "male",
            "female",
            "others",
            name="gender_enum",
        ),
        nullable=True,
    )

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

    dob = Column(
        DateTime,
        nullable=True,
    )

    # Employment details
    joining_date = Column(
        DateTime,
        nullable=True,
    )

    designation = Column(
        String,
        nullable=True,
    )

    shift_type = Column(
        String,
        nullable=True,
    )

    # Location / contact details
    address = Column(
        Text,
        nullable=True,
    )

    state_id = Column(
        Integer,
        ForeignKey("states.id"),
        nullable=True,
    )

    city_id = Column(
        Integer,
        ForeignKey("cities.id"),
        nullable=True,
    )

    language_id = Column(
        Integer,
        ForeignKey("languages.id"),
        nullable=True,
    )

    # Financial / employment details
    current_ctc = Column(
        String,
        nullable=True,
    )

    previous_ctc = Column(
        String,
        nullable=True,
    )

    bank_passbook = Column(
        Text,
        nullable=True,
    )

    salary_slip = Column(
        JSONB,
        nullable=True,
    )

    # Identity / verification documents
    blood_group = Column(
        String,
        nullable=True,
    )

    pan_no = Column(
        String,
        nullable=True,
    )

    aadhar_no = Column(
        String,
        nullable=True,
    )

    pan_card = Column(
        Text,
        nullable=True,
    )

    aadhar_card = Column(
        Text,
        nullable=True,
    )

    # Profile
    profile_image = Column(
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

    deleted_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    # Relationships

    employee = relationship(
        "Employee",
        back_populates="details",
    )

    state = relationship(
        "State",
        lazy="joined",
    )

    city = relationship(
        "City",
        lazy="joined",
    )

    language = relationship(
        "Language",
        lazy="joined",
    )