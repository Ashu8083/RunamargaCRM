# backend/app/schemas/loan_application_audit_log_schema.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class LoanApplicationAuditLogCreate(BaseModel):
    action: str
    action_by: Optional[int] = None  # employee_context_id performing action
    action_on: Optional[int] = None  # loan_application_id target
    report_to: Optional[int] = None  # employee_context_id of reporting manager
    date_and_time: Optional[datetime] = None


class LoanApplicationAuditLogResponse(BaseModel):
    id: int
    action: str
    action_by_id: Optional[int] = None  # employee_context_id performing action
    loan_application_id: Optional[int] = None  # target loan_application_id
    report_to_id: Optional[int] = None  # employee_context_id of reporting manager
    date_and_time: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
