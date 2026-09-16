# backend/app/schemas/CallAnalytics/overview_schema.py

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


# =============================================================
# CALL ANALYTICS SUMMARY
# =============================================================

class CallAnalyticsSummary(BaseModel):
    """
    KPI counts displayed on the Call Analytics Overview page.
    """

    total: int = 0

    answered: int = 0

    missed: int = 0

    unknown: int = 0

    assigned: int = 0

    converted: int = 0


# =============================================================
# CALL ANALYTICS CALL RECORD
# =============================================================

class CallAnalyticsCallRecord(BaseModel):
    """
    Individual call-log record used by the Call Activity graph
    and frontend analytics processing.
    """

    id: int

    employee_id: Optional[int] = None

    employee: Optional[str] = None

    phone_number: Optional[str] = None

    call_type: Optional[str] = None

    mobile_status: Optional[str] = None

    call_started_at: Optional[datetime] = None

    call_ended_at: Optional[datetime] = None

    duration_seconds: Optional[int] = None


    model_config = ConfigDict(
        from_attributes=True
    )


# =============================================================
# CALL ANALYTICS OVERVIEW RESPONSE
# =============================================================

class CallAnalyticsOverviewResponse(BaseModel):
    """
    Complete response returned by the Call Analytics
    Overview API.
    """

    summary: CallAnalyticsSummary

    calls: List[CallAnalyticsCallRecord] = []


    model_config = ConfigDict(
        from_attributes=True
    )