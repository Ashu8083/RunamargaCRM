# backend/app/schemas/TeamLogAudit.py

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TeamLogAuditResponse(BaseModel):
    id: int
    action: str

    agent_id: Optional[int] = None
    action_by_id: Optional[int] = None
    report_to_id: Optional[int] = None

    agent_name: Optional[str] = None
    performer_name: Optional[str] = None
    report_to_name: Optional[str] = None

    date_and_time: datetime

    model_config = ConfigDict(from_attributes=True)