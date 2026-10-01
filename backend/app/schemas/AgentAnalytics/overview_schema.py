# backend/app/schemas/AgentAnalytics/overview_schema.py

from datetime import date
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


# =============================================================
# AGENT ANALYTICS FILTERS
# =============================================================

class AgentAnalyticsFilters(BaseModel):
    """
    Filters accepted by the Agent Analytics Overview API.

    type:

        agent
            Analytics scoped using visible Agent contexts.

        rm
            Analytics scoped using visible RM contexts.

    Hierarchy IDs refer to EmployeeContext.id.

    Date filters have two interpretations depending on the
    response section:

        counts
            -> event/date analytics

        pipeline
            -> LoanApplication.applied_date cohort
    """

    # =========================================================
    # ANALYTICS TYPE
    # =========================================================

    type: Literal["agent", "rm"] = Field(
        description=(
            "Analytics scope: "
            "'agent' for Agent analytics or "
            "'rm' for RM analytics."
        ),
    )

    # =========================================================
    # HIERARCHY FILTERS
    # =========================================================

    team_lead_context_id: Optional[int] = None

    agent_context_id: Optional[int] = None

    rm_context_id: Optional[int] = None

    # =========================================================
    # LOAN TYPE
    # =========================================================

    loan_type_id: Optional[int] = None

    # =========================================================
    # DATE FILTERS
    # =========================================================

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

    Bank-processing metrics count individual
    BankProcessing rows.
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
    Application Pipeline counts for the selected
    application cohort.

    First:

        LoanApplication.applied_date

    selects the applications.

    Then the application status and BankProcessing
    rows are evaluated.

    Categories are NOT mutually exclusive.

    An application may contribute to multiple
    BankProcessing categories.

    Example:

        One application has:

            Login row
            Sanctioned row
            Disbursed row

        Result:

            login      = 1
            sanctioned = 1
            disbursed  = 1

    Bank-processing categories count individual rows.

    Application status categories count individual
    LoanApplication rows.
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

    The lists represent the visibility returned by
    AccessControl for the authenticated employee.

    Depending on `filters.type`:

        agent
            agent_context_ids are the primary analytics
            visibility scope.

        rm
            rm_context_ids are the primary analytics
            visibility scope.

    The other visibility lists are still returned because
    they are required by the dashboard filters.
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
           Application cohort based analytics.

    filters
        -> The requested analytics type and filters.

    visibility
        -> EmployeeContext IDs available through
           AccessControl.

    No application detail rows are returned.
    """

    # =========================================================
    # PIPELINE INSIGHTS
    # =========================================================

    counts: AgentAnalyticsCounts = Field(
        default_factory=AgentAnalyticsCounts,
    )

    # =========================================================
    # APPLICATION PIPELINE
    # =========================================================

    pipeline: AgentAnalyticsPipelineCounts = Field(
        default_factory=AgentAnalyticsPipelineCounts,
    )

    # =========================================================
    # FILTERS
    # =========================================================

    filters: AgentAnalyticsFilters

    # =========================================================
    # VISIBILITY
    # =========================================================

    visibility: AgentAnalyticsVisibility = Field(
        default_factory=AgentAnalyticsVisibility,
    )

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )