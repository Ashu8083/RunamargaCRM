# app/models/call_logs.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    ForeignKey,
    TIMESTAMP,
    BigInteger,
    Index,
    desc,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum


class CallTypeEnum(str, enum.Enum):
    INCOMING = "incoming"
    OUTGOING = "outgoing"


class MobileStatusEnum(str, enum.Enum):
    RECEIVED = "received"
    MISSED = "missed"
    REJECTED = "rejected"
    NOT_REACHED = "not_reached..."


class CallLog(Base):
    __tablename__ = "call_logs"

    __table_args__ = (
        Index(
            "idx_call_logs_phone_context_started_at_id",
            "phone_number",
            "employee_context_id",
            desc("call_started_at"),
            desc("id"),
        ),
        Index(
            "idx_call_logs_started_at",
            desc("call_started_at"),
        ),
        Index(
            "idx_call_logs_context_started_at",
            "employee_context_id",
            desc("call_started_at"),
        ),
        Index(
            "idx_call_logs_context_id_lookup",
            "employee_context_id",
        ),
        Index(
            "idx_call_logs_phone_number_lookup",
            "phone_number",
        ),
    )

    id = Column(
        BigInteger,
        primary_key=True,
        index=True,
    )

    employee_context_id = Column(
        Integer,
        ForeignKey(
            "employee_contexts.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    phone_id = Column(
        Integer,
        ForeignKey(
            "phone_numbers.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    phone_number = Column(
        String(255),
        nullable=False,
    )

    call_type = Column(
        Enum(CallTypeEnum),
        nullable=False,
    )

    mobile_status = Column(
        Enum(MobileStatusEnum),
        nullable=True,
    )

    call_started_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
    )

    call_ended_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    duration_seconds = Column(
        Integer,
        nullable=True,
    )

    attended_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        onupdate=func.now(),
    )

    phone = relationship(
        "PhoneNumber",
        foreign_keys=[phone_id],
        backref="call_logs",
    )

    employee_context = relationship(
        "EmployeeContext",
        foreign_keys=[employee_context_id],
        backref="call_logs",
        lazy="joined",
    )