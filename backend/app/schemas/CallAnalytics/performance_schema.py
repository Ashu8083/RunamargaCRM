# backend/app/schemas/CallAnalytics/performance_schema.py

from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class CallAnalyticsPerformanceAgent(BaseModel):
    id: int
    name: str

    teamId: Optional[int] = None
    team: Optional[str] = None

    rmId: Optional[int] = None
    rmName: Optional[str] = None

    incoming: int = 0
    outgoing: int = 0
    answered: int = 0
    missed: int = 0

    applications: int = 0
    converted: int = 0

    assignments: int = 0
    callsHandled: int = 0
    totalCalls: int = 0

    avgTalkSeconds: float = 0

    status: Optional[str] = "active"

    model_config = ConfigDict(from_attributes=True)


class CallAnalyticsPerformanceSummary(BaseModel):
    totalAgents: int = 0
    totalAssignments: int = 0
    totalCalls: int = 0
    totalIncoming: int = 0
    totalOutgoing: int = 0
    totalAnswered: int = 0
    totalMissed: int = 0
    totalApplications: int = 0
    totalConverted: int = 0
    avgTalkSeconds: float = 0


class CallAnalyticsPerformanceResponse(BaseModel):
    summary: CallAnalyticsPerformanceSummary
    agents: List[CallAnalyticsPerformanceAgent] = []

    model_config = ConfigDict(from_attributes=True)