from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.Enums.LogAction import LogAction


class EmployeeAuditLogCreate(BaseModel):
    action: LogAction
    action_by: Optional[int] = None  # employee_id of employee performing action (who created)
    action_on: Optional[int] = None  # employee_id of target employee (to whom)
    report_to: Optional[int] = None  # employee_id of manager (creator/target report to)
    date_and_time: Optional[datetime] = None


class EmployeeAuditLogResponse(BaseModel):
    id: int
    action: LogAction
    action_by: Optional[int] = None  # employee_id of employee performing action
    action_on: Optional[int] = None  # employee_id of target employee
    report_to: Optional[int] = None  # employee_id of manager
    date_and_time: datetime
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
