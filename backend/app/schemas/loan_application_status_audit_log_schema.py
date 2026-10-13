# backend/app/schemas/loan_application_status_audit_log_schema.py

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class LoanApplicationStatusAuditLogCreate(BaseModel):
    action: str
    action_by: Optional[int] = None
    action_on: Optional[int] = None
    report_to: Optional[int] = None
    from_status: Optional[str] = None
    to_status: Optional[str] = None
    date_and_time: Optional[datetime] = None


class LoanApplicationStatusAuditLogResponse(BaseModel):
    id: int
    action: str

    action_by_id: Optional[int] = None
    loan_application_id: Optional[int] = None
    report_to_id: Optional[int] = None

    # Employee information
    performer_name: Optional[str] = None
    performer_phone: Optional[str] = None
    report_to_name: Optional[str] = None

    # Application status information
    from_status: Optional[str] = None
    to_status: Optional[str] = None

    date_and_time: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)