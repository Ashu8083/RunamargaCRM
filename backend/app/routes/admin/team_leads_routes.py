# app/routes/team_leads_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.schemas.team_lead_schema import (
    TeamLeadCreate,
    TeamLeadUpdate,
    TeamLeadStatusUpdate,
)

from app.controllers.team_lead_controller import TeamLeadController


router = APIRouter(
    prefix="/team-leads",
    tags=["Team Leads"],
)


# ============================================================================
# GET TEAM LEADS
# ============================================================================

@router.get("")
def get_team_leads(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        return TeamLeadController.get_team_leads(db=db)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================================
# CREATE TEAM LEAD
# ============================================================================

@router.post("")
def create_team_lead(
    payload: TeamLeadCreate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        result = TeamLeadController.create_team_lead(
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
# UPDATE TEAM LEAD
# ============================================================================

@router.put("/{team_lead_id}")
def update_team_lead(
    team_lead_id: int,
    payload: TeamLeadUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        result = TeamLeadController.update_team_lead(
            db=db,
            team_lead_id=team_lead_id,
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
# DELETE TEAM LEAD
# ============================================================================

@router.delete("/{team_lead_id}")
def delete_team_lead(
    team_lead_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        result = TeamLeadController.delete_team_lead(
            db=db,
            team_lead_id=team_lead_id,
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
# UPDATE TEAM LEAD STATUS
# ============================================================================

@router.patch("/{team_lead_id}/status")
def update_team_lead_status(
    team_lead_id: int,
    payload: TeamLeadStatusUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        result = TeamLeadController.update_team_lead_status(
            db=db,
            team_lead_id=team_lead_id,
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
# GET ASSIGNED AGENTS
# ============================================================================

@router.get("/{team_lead_id}/agents")
def get_assigned_agents(
    team_lead_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        return TeamLeadController.get_assigned_agents(
            db=db,
            team_lead_id=team_lead_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception:
        raise