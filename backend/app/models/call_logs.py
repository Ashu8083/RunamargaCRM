# app\models\call_logs.py


from sqlalchemy import Column, Integer, String, Enum, ForeignKey, TIMESTAMP, Text, BigInteger, Index, desc
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.employees import Employee
import enum

# Define Enums for better type safety
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
            "idx_call_logs_phone_employee_started_at_id",
            "phone_number",
            "employee_id",
            desc("call_started_at"),
            desc("id"),
        ),
        Index(
            "idx_call_logs_started_at",
            desc("call_started_at")
        ),
        Index(
            "idx_call_logs_employee_started_at",
            "employee_id",
            desc("call_started_at")
        ),
        Index(
            "idx_call_logs_employee_id_lookup",
            "employee_id"
        ),
        Index(
            "idx_call_logs_phone_number_lookup",
            "phone_number"
        ),
    )
    id = Column(BigInteger, primary_key=True, index=True)
    employee_id = Column(
        BigInteger,
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False
    )
    phone_number = Column(String(255), nullable=False)
    call_type = Column(Enum(CallTypeEnum), nullable=False)
    mobile_status = Column(Enum(MobileStatusEnum), nullable=True)
    call_started_at = Column(TIMESTAMP(timezone=True), nullable=False)  
    call_ended_at = Column(TIMESTAMP(timezone=True), nullable=True)  # Note: fixed typo from "call_endred_at"
    duration_seconds = Column(Integer, nullable=True)
    recording_path = Column(String(255), nullable=True)
    recording_size_kb = Column(Integer, nullable=True)
    recording_duration_seconds = Column(Integer, nullable=True)
    attended_at = Column(TIMESTAMP(timezone=True), nullable=True)
    attended_by = Column(BigInteger, ForeignKey("employees.id"), nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship(
        "Employee",
        foreign_keys=[employee_id],
        backref="call_logs_created",
        lazy="joined"
    )

    attended_employee = relationship(
        "Employee",
        foreign_keys=[attended_by],
        backref="call_logs_attended",
        lazy="joined"
    )