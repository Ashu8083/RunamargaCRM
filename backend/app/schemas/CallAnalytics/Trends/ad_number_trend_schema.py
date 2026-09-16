# Path: backend/app/schemas/CallAnalytics/Trends/ad_number_trend_schema.py

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# =============================================================
# AD NUMBER / PHONE NUMBER TREND ITEM
# =============================================================

class CallAnalyticsAdNumberTrendItem(BaseModel):
    phone_id: int
    phone_number: Optional[str] = None

    date: date

    total: int = 0
    received: int = 0
    called: int = 0
    missed: int = 0
    unique: int = 0

    model_config = ConfigDict(
        from_attributes=True
    )


# =============================================================
# AD NUMBER SUMMARY
# =============================================================

class CallAnalyticsAdNumberTrendSummary(BaseModel):
    total: int = 0
    received: int = 0
    called: int = 0
    missed: int = 0
    unique: int = 0


# =============================================================
# AD NUMBER TREND RESPONSE
# =============================================================

class CallAnalyticsAdNumberTrendResponse(BaseModel):
    summary: CallAnalyticsAdNumberTrendSummary

    trends: List[CallAnalyticsAdNumberTrendItem] = Field(
        default_factory=list
    )

    model_config = ConfigDict(
        from_attributes=True
    )