# backend/app/schemas/AgentAnalytics/performance_schema.py

from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field


AnalyticsType = Literal["agent", "rm"]


# =========================================================
# FILTERS
# =========================================================

class AgentAnalyticsPerformanceFilters(BaseModel):
    type: AnalyticsType = "agent"

    team_lead_context_id: Optional[int] = None
    agent_context_id: Optional[int] = None
    rm_context_id: Optional[int] = None
    loan_type_id: Optional[int] = None

    from_date: date
    to_date: date


# =========================================================
# PERFORMANCE COUNTS
# =========================================================

class AgentAnalyticsPerformanceCounts(BaseModel):
    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0
    disbursed_amount: float = 0


# =========================================================
# AGENT / RM OVERVIEW
# =========================================================

class AgentAnalyticsPerformanceOverviewRow(BaseModel):
    context_id: int
    name: str = "Unknown"

    team_lead_context_id: Optional[int] = None
    team_lead_name: str = "-"

    team_id: Optional[int] = None
    team_name: str = "-"

    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0

    disbursed_amount: float = 0


# =========================================================
# LOAN WISE PERFORMANCE
# =========================================================

class AgentAnalyticsLoanWisePerformanceRow(BaseModel):
    loan_type_id: Optional[int] = None
    loan_type_name: str = "Unknown"

    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0

    disbursed_amount: float = 0


# =========================================================
# TOP PERFORMER
# =========================================================

class AgentAnalyticsTopPerformerRow(BaseModel):
    rank: int = 0

    context_id: int
    name: str = "Unknown"

    team_lead_context_id: Optional[int] = None
    team_lead_name: str = "-"

    team_id: Optional[int] = None
    team_name: str = "-"

    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0

    disbursed_amount: float = 0


# =========================================================
# TOP PERFORMERS BY LOAN TYPE
# =========================================================

class AgentAnalyticsTopPerformerLoanTypeRow(BaseModel):
    loan_type_id: Optional[int] = None
    loan_type_name: str = "Unknown"

    context_id: int
    name: str = "Unknown"

    count: int = 0
    disbursed_amount: float = 0


class AgentAnalyticsTopPerformerLoanTypeGroup(BaseModel):
    loan_type_id: Optional[int] = None
    loan_type_name: str = "Unknown"

    rows: list[AgentAnalyticsTopPerformerLoanTypeRow] = Field(
        default_factory=list
    )


# =========================================================
# VISIBILITY
# =========================================================

class AgentAnalyticsPerformanceVisibility(BaseModel):
    team_lead_context_ids: list[int] = Field(
        default_factory=list
    )

    agent_context_ids: list[int] = Field(
        default_factory=list
    )

    rm_context_ids: list[int] = Field(
        default_factory=list
    )


# =========================================================
# RESPONSE
# =========================================================

class AgentAnalyticsPerformanceResponse(BaseModel):
    type: AnalyticsType

    filters: AgentAnalyticsPerformanceFilters

    overview: list[
        AgentAnalyticsPerformanceOverviewRow
    ] = Field(
        default_factory=list
    )

    loan_wise: list[
        AgentAnalyticsLoanWisePerformanceRow
    ] = Field(
        default_factory=list
    )

    top_performers: list[
        AgentAnalyticsTopPerformerRow
    ] = Field(
        default_factory=list
    )

    top_performers_by_loan_type: list[
        AgentAnalyticsTopPerformerLoanTypeGroup
    ] = Field(
        default_factory=list
    )

    visibility: AgentAnalyticsPerformanceVisibility