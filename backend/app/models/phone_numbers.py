# app/models/phone_numbers.py

import enum

from sqlalchemy import (
    Column,
    Integer,
    Text,
    TIMESTAMP,
    ForeignKey,
    Enum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.base import Base


class PhoneNumberStatus(str, enum.Enum):
    inactive = "0"
    active = "1"


class PhoneNumber(Base):
    __tablename__ = "phone_numbers"

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

    phone = Column(
        Text,
        nullable=True,
    )

    status = Column(
        Enum(PhoneNumberStatus),
        default=PhoneNumberStatus.inactive,
        nullable=False,
    )

    trackable = Column(
        Enum(PhoneNumberStatus),
        default=PhoneNumberStatus.inactive,
        nullable=False,
    )

    reports_to_id = Column(
        Integer,
        ForeignKey(
            "employees.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    reports_to = relationship(
        "Employee",
        foreign_keys=[reports_to_id],
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now(),
    )

    deleted_at = Column(
        TIMESTAMP,
        nullable=True,
    )

    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
    )