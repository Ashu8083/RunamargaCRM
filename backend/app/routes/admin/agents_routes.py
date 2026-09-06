# app/routes/admin/agents_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.schemas.agent_schema import (
    AgentCreate,
    AgentUpdate,
    AgentStatusUpdate,
    AgentTeamLeadAssignment,
)

from app.controllers.agent_controller import AgentController


router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)


# ============================================================================
# GET AGENTS
# ============================================================================
#
# Returns EmployeeContexts belonging to:
#
#     AGENT
#     AGENT_*
#     RM
#     RM_*
#
# Role filtering is handled by AgentService.
#
# ============================================================================

@router.get("")
def get_agents(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        return AgentController.get_agents(
            db=db,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================================
# GET AGENT ROLES
# ============================================================================
#
# Returns dynamic roles from the contexts table.
#
# Included:
#
#     AGENT
#     AGENT_*
#     RM
#     RM_*
#
# Only active Context records are returned.
#
# Used by the Agent Add/Edit Role dropdown.
#
# ============================================================================

@router.get("/roles")
def get_agent_roles(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        return AgentController.get_agent_roles(
            db=db,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        raise


# ============================================================================
# CREATE AGENT
# ============================================================================
#
# Required:
#
#     employee_id
#     context_id
#     status
#
# Team Lead assignment is handled separately.
#
# ============================================================================

@router.post("")
def create_agent(
    payload: AgentCreate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AgentController.create_agent(
            db=db,
            payload=payload,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# UPDATE AGENT
# ============================================================================
#
# Only context / role can be changed.
#
# Employee cannot be changed.
#
# Team Lead assignment is handled separately.
#
# Status is handled separately.
#
# ============================================================================

@router.put("/{agent_id}")
def update_agent(
    agent_id: int,
    payload: AgentUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AgentController.update_agent(
            db=db,
            agent_id=agent_id,
            payload=payload,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# DELETE AGENT
# ============================================================================

@router.delete("/{agent_id}")
def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AgentController.delete_agent(
            db=db,
            agent_id=agent_id,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# UPDATE AGENT STATUS
# ============================================================================
#
# Allowed:
#
#     Active
#     Inactive
#
# Backend stores:
#
#     is_active = True / False
#
# ============================================================================

@router.patch("/{agent_id}/status")
def update_agent_status(
    agent_id: int,
    payload: AgentStatusUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AgentController.update_agent_status(
            db=db,
            agent_id=agent_id,
            payload=payload,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# GET AVAILABLE TEAM LEADS
# ============================================================================
#
# IMPORTANT:
#
# This fixed route is declared before:
#
#     /{agent_id}/team-leads
#
# Returns all active EmployeeContexts whose Context code is:
#
#     TEAMLEAD
#     TEAMLEAD_*
#
# The returned "id" is:
#
#     employee_contexts.id
#
# ============================================================================

@router.get("/team-leads")
def get_available_team_leads(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        return AgentController.get_available_team_leads(
            db=db,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception:

        raise


# ============================================================================
# GET ASSIGNED TEAM LEAD
# ============================================================================
#
# Returns the Team Lead currently assigned to the Agent.
#
# Agent EmployeeContext.reports_to_id contains:
#
#     Team Lead EmployeeContext.id
#
# ============================================================================

@router.get("/{agent_id}/team-leads")
def get_assigned_team_leads(
    agent_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        return AgentController.get_assigned_team_leads(
            db=db,
            agent_id=agent_id,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception:

        raise


# ============================================================================
# ASSIGN / REMOVE TEAM LEAD
# ============================================================================
#
# Assign:
#
# {
#     "team_lead_id": 25
# }
#
# where 25 is:
#
#     Team Lead EmployeeContext.id
#
# The backend stores:
#
#     Agent EmployeeContext.reports_to_id = 25
#
# Remove:
#
# {
#     "team_lead_id": null
# }
#
# ============================================================================

@router.put("/{agent_id}/team-lead")
def assign_team_lead(
    agent_id: int,
    payload: AgentTeamLeadAssignment,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AgentController.assign_team_lead(
            db=db,
            agent_id=agent_id,
            payload=payload,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise