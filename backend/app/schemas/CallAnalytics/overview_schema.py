# backend/app/schemas/CallAnalytics/overview_schema.py

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CallAnalyticsSummary(BaseModel):
    total: int = 0
    answered: int = 0
    missed: int = 0
    unknown: int = 0
    assigned: int = 0
    converted: int = 0

    model_config = ConfigDict(from_attributes=True)


class CallAnalyticsCallRecord(BaseModel):
    id: int

    employee_id: Optional[int] = None
    employee: Optional[str] = None
    employee_context_id: Optional[int] = None

    phone_number: Optional[str] = None

    call_type: Optional[str] = None
    mobile_status: Optional[str] = None

    call_started_at: Optional[datetime] = None
    call_ended_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class CallAnalyticsOverviewResponse(BaseModel):
    summary: CallAnalyticsSummary = Field(
        default_factory=CallAnalyticsSummary
    )

    calls: List[CallAnalyticsCallRecord] = Field(
        default_factory=list
    )

    model_config = ConfigDict(from_attributes=True)