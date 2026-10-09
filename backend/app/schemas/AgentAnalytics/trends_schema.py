# backend\app\schemas\AgentAnalytics\trends_schema.py
from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field


AnalyticsType = Literal["agent", "rm"]


class AgentAnalyticsTrendsFilters(BaseModel):
    type: AnalyticsType = "agent"

    team_lead_context_id: Optional[int] = None
    agent_context_id: Optional[int] = None
    rm_context_id: Optional[int] = None
    loan_type_id: Optional[int] = None

    from_date: date
    to_date: date


class AgentAnalyticsTrendRow(BaseModel):
    date: date

    application_created: int = 0
    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0


class AgentAnalyticsLoanTypeTrend(BaseModel):
    loan_type_id: Optional[int] = None
    loan_type_name: str = "Unknown"

    application_created: int = 0
    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0


class AgentAnalyticsStageDistribution(BaseModel):
    total_leads: int = 0

    in_process: int = 0
    login: int = 0
    sanctioned: int = 0
    disbursed: int = 0
    rejected: int = 0


class AgentAnalyticsSanctionDisbursementTrend(BaseModel):
    date: date

    sanctioned: int = 0
    disbursed: int = 0


class AgentAnalyticsRejectionTrend(BaseModel):
    date: date

    rejected: int = 0


class AgentAnalyticsTrendsVisibility(BaseModel):
    team_lead_context_ids: list[int] = Field(
        default_factory=list
    )

    agent_context_ids: list[int] = Field(
        default_factory=list
    )

    rm_context_ids: list[int] = Field(
        default_factory=list
    )


class AgentAnalyticsTrendsResponse(BaseModel):
    type: AnalyticsType

    filters: AgentAnalyticsTrendsFilters

    trend: list[AgentAnalyticsTrendRow] = Field(
        default_factory=list
    )

    loan_type_trend: list[AgentAnalyticsLoanTypeTrend] = Field(
        default_factory=list
    )

    stage_distribution: AgentAnalyticsStageDistribution

    sanction_disbursement_trend: list[
        AgentAnalyticsSanctionDisbursementTrend
    ] = Field(
        default_factory=list
    )

    rejection_trend: list[AgentAnalyticsRejectionTrend] = Field(
        default_factory=list
    )

    visibility: AgentAnalyticsTrendsVisibility