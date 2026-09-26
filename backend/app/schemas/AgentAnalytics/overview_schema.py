# backend/app/schemas/AgentAnalytics/overview_schema.py

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# =============================================================
# AGENT ANALYTICS FILTERS
# =============================================================

class AgentAnalyticsFilters(BaseModel):
    """
    Filters accepted by the Agent Analytics Overview API.

    Hierarchy IDs refer to EmployeeContext.id.

    Date filters have two interpretations depending on the
    response section:

        counts
            -> event/date analytics

        pipeline
            -> LoanApplication.applied_date cohort
    """

    team_lead_context_id: Optional[int] = None

    agent_context_id: Optional[int] = None

    rm_context_id: Optional[int] = None

    loan_type_id: Optional[int] = None

    from_date: Optional[date] = None

    to_date: Optional[date] = None


# =============================================================
# PIPELINE INSIGHTS COUNTS
# =============================================================

class AgentAnalyticsCounts(BaseModel):
    """
    Event-date based analytics counts.

    These counts answer:

        "What happened during the selected date range?"

    Date sources:

        total_leads
            -> LoanApplication.applied_date

        in_process
            -> applications relevant to the selected period
               whose status is in process

        login
            -> BankProcessing.loggedin_at

        sanctioned
            -> BankProcessing.sanctioned_at

        disbursed
            -> BankProcessing.disbursed_at

        rejected
            -> LoanApplication.rejection_date
    """

    total_leads: int = Field(
        default=0,
        alias="totalLeads",
    )

    in_process: int = Field(
        default=0,
        alias="inProcess",
    )

    login: int = Field(
        default=0,
    )

    sanctioned: int = Field(
        default=0,
    )

    disbursed: int = Field(
        default=0,
    )

    rejected: int = Field(
        default=0,
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


# =============================================================
# APPLICATION PIPELINE COUNTS
# =============================================================

class AgentAnalyticsPipelineCounts(BaseModel):
    """
    Current-status counts for the selected APPLICATION COHORT.

    First:

        LoanApplication.applied_date

    selects the applications.

    Then the current/latest status of those applications is
    evaluated.

    IMPORTANT:

        These are mutually exclusive current-status buckets.

    Therefore one application is counted in ONLY ONE of:

        In Process
        Login
        Sanctioned
        Disbursed
        Rejected

    Example:

        Bank A -> Login
        Bank B -> Sanctioned
        Bank C -> Disbursed

    Result:

        Disbursed = 1

        Login = 0
        Sanctioned = 0

    Another example:

        Bank A -> Login
        Bank B -> Sanctioned

    Result:

        Sanctioned = 1
    """

    total_leads: int = Field(
        default=0,
        alias="totalLeads",
    )

    in_process: int = Field(
        default=0,
        alias="inProcess",
    )

    login: int = Field(
        default=0,
    )

    sanctioned: int = Field(
        default=0,
    )

    disbursed: int = Field(
        default=0,
    )

    rejected: int = Field(
        default=0,
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


# =============================================================
# VISIBILITY
# =============================================================

class AgentAnalyticsVisibility(BaseModel):
    """
    Visibility information returned by the backend.

    All IDs are EmployeeContext IDs.
    """

    team_lead_context_ids: List[int] = Field(
        default_factory=list,
        alias="teamLeadContextIds",
    )

    agent_context_ids: List[int] = Field(
        default_factory=list,
        alias="agentContextIds",
    )

    rm_context_ids: List[int] = Field(
        default_factory=list,
        alias="rmContextIds",
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


# =============================================================
# OVERVIEW RESPONSE
# =============================================================

class AgentAnalyticsOverviewResponse(BaseModel):
    """
    Complete Agent Analytics Overview response.

    counts
        -> Pipeline Insights
           Event/date based analytics.

    pipeline
        -> Application Pipeline
           Current status of applications from the selected
           applied-date cohort.

    No application rows are returned.
    """

    counts: AgentAnalyticsCounts = Field(
        default_factory=AgentAnalyticsCounts,
    )

    pipeline: AgentAnalyticsPipelineCounts = Field(
        default_factory=AgentAnalyticsPipelineCounts,
    )

    filters: AgentAnalyticsFilters

    visibility: AgentAnalyticsVisibility = Field(
        default_factory=AgentAnalyticsVisibility,
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )