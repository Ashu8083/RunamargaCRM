# app/controllers/agent_controller.py

from sqlalchemy.orm import Session

from app.schemas.agent_schema import (
    AgentCreate,
    AgentUpdate,
    AgentStatusUpdate,
    AgentTeamLeadAssignment,
)

from app.services.agent_service import AgentService


class AgentController:

    # ========================================================================
    # GET AGENTS
    # ========================================================================

    @staticmethod
    def get_agents(
        db: Session,
    ):
        return AgentService.get_agents(
            db=db,
        )

    # ========================================================================
    # GET AGENT ROLES
    # ========================================================================
    #
    # Returns dynamic roles from the contexts table.
    #
    # Included context codes:
    #
    #     AGENT
    #     AGENT_*
    #     RM
    #     RM_*
    #
    # Only active contexts are returned.
    #
    # Used by the Agent Add/Edit Role dropdown.
    #
    # ========================================================================

    @staticmethod
    def get_agent_roles(
        db: Session,
    ):
        return AgentService.get_agent_roles(
            db=db,
        )

    # ========================================================================
    # CREATE AGENT
    # ========================================================================
    #
    # Uses:
    #
    #     employee_id
    #     context_id
    #     status
    #
    # Team Lead assignment is handled separately.
    #
    # ========================================================================

    @staticmethod
    def create_agent(
        db: Session,
        payload: AgentCreate,
    ):
        return AgentService.create_agent(
            db=db,
            employee_id=payload.employee_id,
            context_id=payload.context_id,
            status=payload.status,
        )

    # ========================================================================
    # UPDATE AGENT
    # ========================================================================
    #
    # Employee cannot be changed.
    #
    # Only context_id / role is updated.
    #
    # Team Lead assignment is handled separately.
    #
    # Status is handled separately.
    #
    # ========================================================================

    @staticmethod
    def update_agent(
        db: Session,
        agent_id: int,
        payload: AgentUpdate,
    ):
        return AgentService.update_agent(
            db=db,
            agent_id=agent_id,
            context_id=payload.context_id,
        )

    # ========================================================================
    # DELETE AGENT
    # ========================================================================

    @staticmethod
    def delete_agent(
        db: Session,
        agent_id: int,
    ):
        return AgentService.delete_agent(
            db=db,
            agent_id=agent_id,
        )

    # ========================================================================
    # UPDATE AGENT STATUS
    # ========================================================================

    @staticmethod
    def update_agent_status(
        db: Session,
        agent_id: int,
        payload: AgentStatusUpdate,
    ):
        return AgentService.update_agent_status(
            db=db,
            agent_id=agent_id,
            status=payload.status,
        )

    # ========================================================================
    # GET AVAILABLE TEAM LEADS
    # ========================================================================
    #
    # Returns active EmployeeContexts whose Context is:
    #
    #     TEAMLEAD
    #     TEAMLEAD_*
    #
    # The returned id is:
    #
    #     EmployeeContext.id
    #
    # ========================================================================

    @staticmethod
    def get_available_team_leads(
        db: Session,
    ):
        return AgentService.get_available_team_leads(
            db=db,
        )

    # ========================================================================
    # GET ASSIGNED TEAM LEAD
    # ========================================================================
    #
    # Agent EmployeeContext.reports_to_id contains:
    #
    #     Team Lead EmployeeContext.id
    #
    # ========================================================================

    @staticmethod
    def get_assigned_team_leads(
        db: Session,
        agent_id: int,
    ):
        return AgentService.get_assigned_team_leads(
            db=db,
            agent_id=agent_id,
        )

    # ========================================================================
    # ASSIGN / REMOVE TEAM LEAD
    # ========================================================================
    #
    # payload.team_lead_id:
    #
    #     Team Lead EmployeeContext.id
    #
    # Service stores that same EmployeeContext.id in:
    #
    #     Agent EmployeeContext.reports_to_id
    #
    # If team_lead_id is null, the assignment is removed.
    #
    # ========================================================================

    @staticmethod
    def assign_team_lead(
        db: Session,
        agent_id: int,
        payload: AgentTeamLeadAssignment,
    ):
        return AgentService.assign_team_lead(
            db=db,
            agent_id=agent_id,
            team_lead_id=payload.team_lead_id,
        )