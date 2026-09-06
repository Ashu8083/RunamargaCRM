# app/schemas/agent_schema.py

from typing import Optional

from pydantic import BaseModel, Field


# ============================================================================
# CREATE AGENT
# ============================================================================
#
# Creates an Agent EmployeeContext.
#
# employee_id:
#     employees.id
#
# context_id:
#     contexts.id
#
# status:
#     Active / Inactive
#
# Team Lead assignment is NOT handled during Agent creation.
#
# Team Lead assignment is a separate operation through:
#
#     PUT /agents/{agent_id}/team-lead
#
# ============================================================================

class AgentCreate(BaseModel):

    employee_id: int = Field(
        ...,
        gt=0,
    )

    context_id: int = Field(
        ...,
        gt=0,
    )

    status: str = "Active"


# ============================================================================
# UPDATE AGENT
# ============================================================================
#
# Employee cannot be changed.
#
# Only the Agent/RM context (role) can be changed.
#
# employee_id remains unchanged.
#
# Team Lead assignment is handled separately.
#
# Status is handled separately.
#
# ============================================================================

class AgentUpdate(BaseModel):

    context_id: int = Field(
        ...,
        gt=0,
    )


# ============================================================================
# UPDATE AGENT STATUS
# ============================================================================
#
# Allowed values:
#
#     Active
#     Inactive
#
# Backend converts this into:
#
#     is_active = True / False
#
# ============================================================================

class AgentStatusUpdate(BaseModel):

    status: str


# ============================================================================
# TEAM LEAD ASSIGNMENT
# ============================================================================
#
# team_lead_id is:
#
#     employee_contexts.id
#
# of the selected Team Lead.
#
# The backend will save that EmployeeContext.id directly into:
#
#     Agent EmployeeContext.reports_to_id
#
# Sending null removes the Team Lead assignment.
#
# ============================================================================

class AgentTeamLeadAssignment(BaseModel):

    team_lead_id: Optional[int] = Field(
        default=None,
        gt=0,
    )