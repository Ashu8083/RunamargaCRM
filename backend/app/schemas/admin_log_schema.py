from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict
from app.Enums.LogAction import LogAction


class AdminLogCreate(BaseModel):
    action: LogAction
    action_by: Optional[int] = None
    action_on: Optional[int] = None
    date_and_time: Optional[datetime] = None


class AdminLogResponse(BaseModel):
    id: int
    action: LogAction

    action_by: Optional[int] = None
    action_on: Optional[int] = None

    performed_by_name: Optional[str] = None
    employee_name: Optional[str] = None

    date_and_time: datetime

    model_config = ConfigDict(from_attributes=True)