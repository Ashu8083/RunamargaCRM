# backend/app/schemas/phone_number_audit_log_schema.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PhoneNumberAuditLogCreate(BaseModel):
    action: str
    phone_number_id: Optional[int] = None
    phone: Optional[str] = None
    action_by: Optional[int] = None  # employee_context_id of employee performing action
    action_on: Optional[int] = None  # employee_context_id of target assigned employee
    report_to: Optional[int] = None  # employee_context_id of reporting manager
    date_and_time: Optional[datetime] = None


class PhoneNumberAuditLogResponse(BaseModel):
    id: int
    action: str
    phone_number_id: Optional[int] = None
    phone: Optional[str] = None
    action_by_id: Optional[int] = None  # employee_context_id performing action
    employee_context_id: Optional[int] = None  # employee_context_id target employee
    report_to_id: Optional[int] = None  # employee_context_id of reporting manager
    date_and_time: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
