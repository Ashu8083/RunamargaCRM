from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.Enums.LogAction import LogAction


class AdminLogCreate(BaseModel):
    action: LogAction
    action_by: Optional[int] = None  # employee_context_id of admin performing action
    action_on: Optional[int] = None  # employee_context_id of target admin
    date_and_time: Optional[datetime] = None


class AdminLogResponse(BaseModel):
    id: int
    action: LogAction
    action_by: Optional[int] = None  # employee_context_id of admin performing action
    action_on: Optional[int] = None  # employee_context_id of target admin
    date_and_time: datetime

    model_config = ConfigDict(from_attributes=True)
