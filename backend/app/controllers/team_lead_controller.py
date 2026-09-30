# app/controllers/team_lead_controller.py

from sqlalchemy.orm import Session

from app.schemas.team_lead_schema import (
    TeamLeadCreate,
    TeamLeadUpdate,
    TeamLeadStatusUpdate,
)

from app.services.team_lead_service import TeamLeadService


class TeamLeadController:

    @staticmethod
    def get_team_leads(db: Session):
        return TeamLeadService.get_team_leads(db)

    @staticmethod
    def create_team_lead(
        db: Session,
        action_by_ctx: int,
        payload: TeamLeadCreate,
    ):
        return TeamLeadService.create_team_lead(
            db=db,
            action_by_ctx=action_by_ctx,
            employee_id=payload.employee_id,
            context_id=payload.context_id,
            status=payload.status,

        )

    @staticmethod
    def update_team_lead(
        db: Session,
        team_lead_id: int,
        action_by_ctx: int,
        payload: TeamLeadUpdate,
    ):
        return TeamLeadService.update_team_lead(
            db=db,
            team_lead_id=team_lead_id,
            context_id=payload.context_id,
            action_by_ctx=action_by_ctx,
        )

    @staticmethod
    def delete_team_lead(
        db: Session,
        action_by_ctx: int,
        team_lead_id: int,
    ):
        return TeamLeadService.delete_team_lead(
            db=db,
            team_lead_id=team_lead_id,
            action_by_ctx=action_by_ctx,
        )

    @staticmethod
    def update_team_lead_status(
        db: Session,
        team_lead_id: int,
        action_by_ctx: int,
        payload: TeamLeadStatusUpdate,
    ):
        return TeamLeadService.update_team_lead_status(
            db=db,
            team_lead_id=team_lead_id,
            status=payload.status,
            action_by_ctx=action_by_ctx,
        )

    @staticmethod
    def get_assigned_agents(
        db: Session,
        team_lead_id: int,
    ):
        return TeamLeadService.get_assigned_agents(
            db=db,
            team_lead_id=team_lead_id,
        )