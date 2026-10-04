# backend/app/schemas/call_reassignment_audit_log_schema.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CallReassignmentAuditLogCreate(BaseModel):
    action: str
    customer_phone: Optional[str] = None
    reassigned_by: Optional[int] = None       # employee_context_id performing reassignment
    from_assigned_to: Optional[int] = None    # employee_context_id of previous assignee
    from_report_to: Optional[int] = None      # report_to of previous assignee
    to_assigned_to: Optional[int] = None      # employee_context_id of new assignee
    to_report_to: Optional[int] = None        # report_to of new assignee
    assigned_to_phone: Optional[int] = None   # phone_numbers.id
    date_and_time: Optional[datetime] = None


class CallReassignmentAuditLogResponse(BaseModel):
    id: int
    action: str
    customer_phone: Optional[str] = None
    reassigned_by_id: Optional[int] = None       # employee_context_id performing reassignment
    from_assigned_to_id: Optional[int] = None    # employee_context_id of previous assignee
    from_report_to_id: Optional[int] = None      # report_to of previous assignee
    to_assigned_to_id: Optional[int] = None      # employee_context_id of new assignee
    to_report_to_id: Optional[int] = None        # report_to of new assignee
    assigned_to_phone: Optional[int] = None      # phone_numbers.id
    date_and_time: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
