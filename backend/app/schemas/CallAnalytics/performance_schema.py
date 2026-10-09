# backend/app/schemas/CallAnalytics/performance_schema.py

from typing import List, Optional

from pydantic import BaseModel, ConfigDict


# ============================================================================
# PERFORMANCE — AGENT / RM
# ============================================================================

class CallAnalyticsPerformanceAgent(BaseModel):
    id: int
    name: str

    # ------------------------------------------------------------------------
    # Team
    # ------------------------------------------------------------------------

    teamId: Optional[int] = None
    team: Optional[str] = None

    # ------------------------------------------------------------------------
    # RM
    # ------------------------------------------------------------------------

    rmId: Optional[int] = None
    rmName: Optional[str] = None

    # ------------------------------------------------------------------------
    # CALL COUNTS
    # ------------------------------------------------------------------------

    incoming: int = 0
    outgoing: int = 0

    answered: int = 0
    missed: int = 0

    totalCalls: int = 0

    callsHandled: int = 0

    # ------------------------------------------------------------------------
    # LOAN / LEAD COUNTS
    # ------------------------------------------------------------------------

    applications: int = 0
    converted: int = 0
    assignments: int = 0

    # ------------------------------------------------------------------------
    # TALK TIME
    # ------------------------------------------------------------------------

    avgTalkSeconds: float = 0

    # ------------------------------------------------------------------------
    # EMPLOYEE STATUS
    # ------------------------------------------------------------------------

    status: Optional[str] = "active"

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================================
# PERFORMANCE SUMMARY
# ============================================================================

class CallAnalyticsPerformanceSummary(BaseModel):
    # ------------------------------------------------------------------------
    # EMPLOYEES
    # ------------------------------------------------------------------------

    totalAgents: int = 0

    # ------------------------------------------------------------------------
    # ASSIGNMENTS
    # ------------------------------------------------------------------------

    totalAssignments: int = 0

    # ------------------------------------------------------------------------
    # CALLS
    # ------------------------------------------------------------------------

    totalCalls: int = 0

    totalIncoming: int = 0
    totalOutgoing: int = 0

    totalAnswered: int = 0
    totalMissed: int = 0

    # ------------------------------------------------------------------------
    # APPLICATIONS
    # ------------------------------------------------------------------------

    totalApplications: int = 0
    totalConverted: int = 0

    # ------------------------------------------------------------------------
    # TALK TIME
    # ------------------------------------------------------------------------

    avgTalkSeconds: float = 0


# ============================================================================
# PERFORMANCE RESPONSE
# ============================================================================

class CallAnalyticsPerformanceResponse(BaseModel):
    summary: CallAnalyticsPerformanceSummary

    agents: List[CallAnalyticsPerformanceAgent] = []

    model_config = ConfigDict(
        from_attributes=True
    )