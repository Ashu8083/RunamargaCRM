# app/models/call_assignments.py

from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Enum,
    ForeignKey,
    TIMESTAMP,
    DateTime,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum

from app.models.employees import Employee


class StatusEnum(str, enum.Enum):
    RECEIVED = "received"
    MISSED = "missed"
    REJECTED = "rejected"
    IN_PROGRESS = "in_progress"


class CallAssignment(Base):
    __tablename__ = "call_assignments"

    id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    phone_number = Column(
        String(255),
        nullable=False,
    )

    assigned_to_id = Column(
        BigInteger,
        ForeignKey("employees.id"),
        nullable=True,
    )

    assigned_by_id = Column(
        BigInteger,
        ForeignKey("employees.id"),
        nullable=True,
    )

    status = Column(
        Enum(
            StatusEnum,
            name="call_status_enum",
        ),
        nullable=False,
        default=StatusEnum.RECEIVED,
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
        DateTime(timezone=True),
        nullable=True,
    )

    assigned_to = relationship(
        "Employee",
        foreign_keys=[assigned_to_id],
        backref="call_assignments_received",
    )

    assigned_by = relationship(
        "Employee",
        foreign_keys=[assigned_by_id],
        backref="call_assignments_created",
    )