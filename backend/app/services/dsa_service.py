# app/services/agent_service.py

from datetime import datetime

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context


class AgentService:

    # ========================================================================
    # HELPERS
    # ========================================================================

    @staticmethod
    def _validate_status(
        status: str,
    ) -> bool:

        if not isinstance(status, str):
            raise ValueError(
                "Status must be Active or Inactive"
            )

        normalized = status.strip().lower()

        if normalized == "active":
            return True

        if normalized == "inactive":
            return False

        raise ValueError(
            "Status must be Active or Inactive"
        )

    # ========================================================================
    # AGENT / RM CONTEXT FILTER
    # ========================================================================

    @staticmethod
    def _is_agent_or_rm_context():

        return or_(
            Context.code == "AGENT",
            Context.code.like("AGENT_%"),
            Context.code == "RM",
            Context.code.like("RM_%"),
        )

    # ========================================================================
    # TEAM LEAD CONTEXT FILTER
    # ========================================================================

    @staticmethod
    def _is_team_lead_context():

        return or_(
            Context.code == "TEAMLEAD",
            Context.code.like("TEAMLEAD_%"),
        )

    # ========================================================================
    # GET AGENT CONTEXT
    # ========================================================================
    #
    # agent_id = EmployeeContext.id
    #
    # The EmployeeContext itself may be inactive because inactive Agents
    # must still be manageable from the Agent table.
    #
    # ========================================================================

    @staticmethod
    def _get_agent_context(
        db: Session,
        agent_id: int,
    ) -> EmployeeContext:

        agent = (
            db.query(EmployeeContext)
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.id == agent_id,
                EmployeeContext.deleted_at.is_(None),
                AgentService._is_agent_or_rm_context(),
            )
            .first()
        )

        if not agent:
            raise ValueError(
                "Agent not found"
            )

        return agent

    # ========================================================================
    # VALIDATE AGENT / RM CONTEXT
    # ========================================================================

    @staticmethod
    def _validate_agent_context(
        db: Session,
        context_id: int,
    ) -> Context:

        context = (
            db.query(Context)
            .filter(
                Context.id == context_id,
                Context.is_active.is_(True),
                AgentService._is_agent_or_rm_context(),
            )
            .first()
        )

        if not context:
            raise ValueError(
                "Invalid or inactive Agent/RM role"
            )

        return context

    # ========================================================================
    # GET TEAM LEAD CONTEXT
    # ========================================================================
    #
    # team_lead_id = EmployeeContext.id
    #
    # IMPORTANT:
    #
    # This ID is stored directly in:
    #
    #     Agent EmployeeContext.reports_to_id
    #
    # ========================================================================

    @staticmethod
    def _get_team_lead_context(
        db: Session,
        team_lead_id: int,
    ) -> EmployeeContext:

        team_lead = (
            db.query(EmployeeContext)
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.id == team_lead_id,
                EmployeeContext.deleted_at.is_(None),
                EmployeeContext.is_active.is_(True),
                Context.is_active.is_(True),
                AgentService._is_team_lead_context(),
            )
            .first()
        )

        if not team_lead:
            raise ValueError(
                "Active Team Lead not found"
            )

        return team_lead

    # ========================================================================
    # FORMAT DATETIME
    # ========================================================================

    @staticmethod
    def _format_datetime(
        value,
    ):

        if not value:
            return None

        return value.strftime(
            "%d %b %Y, %I:%M %p"
        )

    # ========================================================================
    # BUILD AGENT RESPONSE
    # ========================================================================

    @staticmethod
    def _build_agent_response(
        employee_context: EmployeeContext,
        employee: Employee,
        context: Context,
    ):

        return {
            "id":
                employee_context.id,

            "employee_id":
                employee_context.employee_id,

            "context_id":
                employee_context.context_id,

            "name":
                getattr(
                    employee,
                    "name",
                    None,
                ),

            "email":
                getattr(
                    employee,
                    "email",
                    None,
                ),

            "phone":
                getattr(
                    employee,
                    "phone",
                    None,
                ),

            "role":
                context.name,

            "role_code":
                context.code,

            "status":
                (
                    "Active"
                    if employee_context.is_active
                    else "Inactive"
                ),

            "is_active":
                employee_context.is_active,

            "is_default":
                employee_context.is_default,

            # This is now EmployeeContext.id of the Team Lead.
            "reports_to_id":
                employee_context.reports_to_id,

            "created_at":
                AgentService._format_datetime(
                    employee_context.created_at
                ),

            "updated_at":
                AgentService._format_datetime(
                    employee_context.updated_at
                ),
        }

    # ========================================================================
    # GET AGENT ROLES
    # ========================================================================
    #
    # Returns dynamic roles for the Agent Add/Edit dropdown.
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
    # ========================================================================

    @staticmethod
    def get_agent_roles(
        db: Session,
    ):

        roles = (
            db.query(Context)
            .filter(
                Context.is_active.is_(True),
                AgentService._is_agent_or_rm_context(),
            )
            .order_by(
                Context.name.asc(),
                Context.id.asc(),
            )
            .all()
        )

        result = []

        for context in roles:

            result.append(
                {
                    "id":
                        context.id,

                    "name":
                        context.name,

                    "code":
                        context.code,

                    "description":
                        context.description,

                    "is_active":
                        context.is_active,
                }
            )

        return result

    # ========================================================================
    # GET AGENTS
    # ========================================================================

    @staticmethod
    def get_agents(
        db: Session,
    ):

        rows = (
            db.query(
                EmployeeContext,
                Employee,
                Context,
            )
            .join(
                Employee,
                EmployeeContext.employee_id == Employee.id,
            )
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.deleted_at.is_(None),
                Context.is_active.is_(True),
                AgentService._is_agent_or_rm_context(),
            )
            .order_by(
                EmployeeContext.id.desc()
            )
            .all()
        )

        result = []

        for (
            employee_context,
            employee,
            context,
        ) in rows:

            result.append(
                AgentService._build_agent_response(
                    employee_context=employee_context,
                    employee=employee,
                    context=context,
                )
            )

        return result

    # ========================================================================
    # CREATE AGENT
    # ========================================================================
    #
    # Creates an EmployeeContext using:
    #
    #     employee_id
    #     context_id
    #     is_active
    #
    # Team Lead assignment is handled separately.
    #
    # ========================================================================

    @staticmethod
    def create_agent(
        db: Session,
        employee_id: int,
        context_id: int,
        status: str = "Active",
    ):

        is_active = (
            AgentService._validate_status(
                status
            )
        )

        # --------------------------------------------------------------------
        # VALIDATE EMPLOYEE
        # --------------------------------------------------------------------

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == employee_id,
            )
            .first()
        )

        if not employee:
            raise ValueError(
                "Employee not found"
            )

        # --------------------------------------------------------------------
        # VALIDATE ROLE
        # --------------------------------------------------------------------

        AgentService._validate_agent_context(
            db=db,
            context_id=context_id,
        )

        # --------------------------------------------------------------------
        # CHECK EXISTING EMPLOYEE CONTEXT
        # --------------------------------------------------------------------

        existing = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id
                == employee_id,

                EmployeeContext.context_id
                == context_id,
            )
            .first()
        )

        if existing:

            if existing.deleted_at is None:
                raise ValueError(
                    "Employee already has this Agent/RM role"
                )

            # ---------------------------------------------------------------
            # RESTORE SOFT-DELETED CONTEXT
            # ---------------------------------------------------------------

            existing.deleted_at = None

            existing.is_active = is_active

            db.flush()

            return {
                "id":
                    existing.id,

                "employee_id":
                    existing.employee_id,

                "context_id":
                    existing.context_id,

                "status":
                    (
                        "Active"
                        if existing.is_active
                        else "Inactive"
                    ),

                "is_active":
                    existing.is_active,

                "reports_to_id":
                    existing.reports_to_id,
            }

        # --------------------------------------------------------------------
        # CREATE EMPLOYEE CONTEXT
        # --------------------------------------------------------------------

        agent = EmployeeContext(
            employee_id=employee_id,

            context_id=context_id,

            reports_to_id=None,

            is_default=False,

            is_active=is_active,
        )

        db.add(agent)

        db.flush()

        return {
            "id":
                agent.id,

            "employee_id":
                agent.employee_id,

            "context_id":
                agent.context_id,

            "status":
                (
                    "Active"
                    if agent.is_active
                    else "Inactive"
                ),

            "is_active":
                agent.is_active,

            "reports_to_id":
                agent.reports_to_id,
        }

    # ========================================================================
    # UPDATE AGENT
    # ========================================================================
    #
    # Employee cannot be changed.
    #
    # Only context_id / role changes.
    #
    # Existing Team Lead assignment remains untouched.
    #
    # ========================================================================

    @staticmethod
    def update_agent(
        db: Session,
        agent_id: int,
        context_id: int,
    ):

        agent = (
            AgentService._get_agent_context(
                db=db,
                agent_id=agent_id,
            )
        )

        # --------------------------------------------------------------------
        # VALIDATE NEW ROLE
        # --------------------------------------------------------------------

        AgentService._validate_agent_context(
            db=db,
            context_id=context_id,
        )

        # --------------------------------------------------------------------
        # CHECK DUPLICATE
        # --------------------------------------------------------------------

        duplicate = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id
                == agent.employee_id,

                EmployeeContext.context_id
                == context_id,

                EmployeeContext.id
                != agent_id,

                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if duplicate:
            raise ValueError(
                "Employee already has this Agent/RM role"
            )

        # --------------------------------------------------------------------
        # UPDATE ROLE
        # --------------------------------------------------------------------

        agent.context_id = context_id

        db.flush()

        return {
            "id":
                agent.id,

            "employee_id":
                agent.employee_id,

            "context_id":
                agent.context_id,

            "status":
                (
                    "Active"
                    if agent.is_active
                    else "Inactive"
                ),

            "is_active":
                agent.is_active,

            "reports_to_id":
                agent.reports_to_id,
        }

    # ========================================================================
    # DELETE AGENT
    # ========================================================================

    @staticmethod
    def delete_agent(
        db: Session,
        agent_id: int,
    ):

        agent = (
            AgentService._get_agent_context(
                db=db,
                agent_id=agent_id,
            )
        )

        agent.deleted_at = datetime.utcnow()

        agent.is_active = False

        # Remove Team Lead relationship when Agent is deleted.
        agent.reports_to_id = None

        db.flush()

        return {
            "message":
                "Agent deleted successfully",

            "id":
                agent.id,
        }

    # ========================================================================
    # UPDATE AGENT STATUS
    # ========================================================================

    @staticmethod
    def update_agent_status(
        db: Session,
        agent_id: int,
        status: str,
    ):

        is_active = (
            AgentService._validate_status(
                status
            )
        )

        agent = (
            AgentService._get_agent_context(
                db=db,
                agent_id=agent_id,
            )
        )

        agent.is_active = is_active

        db.flush()

        return {
            "id":
                agent.id,

            "employee_id":
                agent.employee_id,

            "context_id":
                agent.context_id,

            "status":
                (
                    "Active"
                    if agent.is_active
                    else "Inactive"
                ),

            "is_active":
                agent.is_active,

            "reports_to_id":
                agent.reports_to_id,
        }

    # ========================================================================
    # GET AVAILABLE TEAM LEADS
    # ========================================================================
    #
    # Team Leads are NOT hardcoded.
    #
    # Context table determines which contexts are Team Lead contexts:
    #
    #     TEAMLEAD
    #     TEAMLEAD_*
    #
    # EmployeeContexts using those contexts become selectable Team Leads.
    #
    # ========================================================================

    @staticmethod
    def get_available_team_leads(
        db: Session,
    ):

        rows = (
            db.query(
                EmployeeContext,
                Employee,
                Context,
            )
            .join(
                Employee,
                EmployeeContext.employee_id == Employee.id,
            )
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.deleted_at.is_(None),

                EmployeeContext.is_active.is_(True),

                Context.is_active.is_(True),

                AgentService._is_team_lead_context(),
            )
            .order_by(
                EmployeeContext.id.desc()
            )
            .all()
        )

        result = []

        for (
            employee_context,
            employee,
            context,
        ) in rows:

            result.append(
                {
                    # Team Lead EmployeeContext.id
                    "id":
                        employee_context.id,

                    # Employee.id
                    "employee_id":
                        employee_context.employee_id,

                    # Context.id
                    "context_id":
                        employee_context.context_id,

                    # Employee information
                    "name":
                        getattr(
                            employee,
                            "name",
                            None,
                        ),

                    "email":
                        getattr(
                            employee,
                            "email",
                            None,
                        ),

                    "phone":
                        getattr(
                            employee,
                            "phone",
                            None,
                        ),

                    # Context information
                    "role":
                        context.name,

                    "role_code":
                        context.code,

                    "status":
                        "Active",

                    "is_active":
                        True,
                }
            )

        return result

    # ========================================================================
    # GET ASSIGNED TEAM LEAD
    # ========================================================================
    #
    # IMPORTANT:
    #
    # Agent.reports_to_id is now:
    #
    #     Team Lead EmployeeContext.id
    #
    # Therefore NO employee_id conversion is required.
    #
    # ========================================================================

    @staticmethod
    def get_assigned_team_leads(
        db: Session,
        agent_id: int,
    ):

        agent = (
            AgentService._get_agent_context(
                db=db,
                agent_id=agent_id,
            )
        )

        if agent.reports_to_id is None:
            return []

        rows = (
            db.query(
                EmployeeContext,
                Employee,
                Context,
            )
            .join(
                Employee,
                EmployeeContext.employee_id == Employee.id,
            )
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                # Direct EmployeeContext relationship
                EmployeeContext.id
                == agent.reports_to_id,

                EmployeeContext.deleted_at.is_(None),

                EmployeeContext.is_active.is_(True),

                Context.is_active.is_(True),

                AgentService._is_team_lead_context(),
            )
            .all()
        )

        result = []

        for (
            team_lead_context,
            employee,
            context,
        ) in rows:

            result.append(
                {
                    # Team Lead EmployeeContext.id
                    "id":
                        team_lead_context.id,

                    "employee_id":
                        team_lead_context.employee_id,

                    "context_id":
                        team_lead_context.context_id,

                    "name":
                        getattr(
                            employee,
                            "name",
                            None,
                        ),

                    "email":
                        getattr(
                            employee,
                            "email",
                            None,
                        ),

                    "phone":
                        getattr(
                            employee,
                            "phone",
                            None,
                        ),

                    "role":
                        context.name,

                    "role_code":
                        context.code,

                    "status":
                        "Active",

                    "is_active":
                        True,

                    # This is Team Lead EmployeeContext.id
                    "reports_to_id":
                        agent.reports_to_id,
                }
            )

        return result

    # ========================================================================
    # ASSIGN TEAM LEAD
    # ========================================================================
    #
    # team_lead_id:
    #
    #     Team Lead EmployeeContext.id
    #
    # Stored directly as:
    #
    #     Agent EmployeeContext.reports_to_id
    #
    # ========================================================================

    @staticmethod
    def assign_team_lead(
        db: Session,
        agent_id: int,
        team_lead_id=None,
    ):

        # --------------------------------------------------------------------
        # GET AGENT
        # --------------------------------------------------------------------

        agent = (
            AgentService._get_agent_context(
                db=db,
                agent_id=agent_id,
            )
        )

        # --------------------------------------------------------------------
        # REMOVE TEAM LEAD
        # --------------------------------------------------------------------

        if team_lead_id is None:

            agent.reports_to_id = None

            db.flush()

            return {
                "id":
                    agent.id,

                "employee_id":
                    agent.employee_id,

                "context_id":
                    agent.context_id,

                "reports_to_id":
                    None,

                "team_lead_id":
                    None,

                "message":
                    "Team Lead assignment removed successfully",
            }

        # --------------------------------------------------------------------
        # GET SELECTED TEAM LEAD
        # --------------------------------------------------------------------

        team_lead = (
            AgentService._get_team_lead_context(
                db=db,
                team_lead_id=team_lead_id,
            )
        )

        # --------------------------------------------------------------------
        # PREVENT SELF ASSIGNMENT
        # --------------------------------------------------------------------

        if (
            team_lead.employee_id
            == agent.employee_id
        ):

            raise ValueError(
                "An Agent cannot be assigned to itself"
            )

        # --------------------------------------------------------------------
        # SAVE TEAM LEAD EMPLOYEE CONTEXT ID
        # --------------------------------------------------------------------

        agent.reports_to_id = team_lead.id

        db.flush()

        return {
            "id":
                agent.id,

            "employee_id":
                agent.employee_id,

            "context_id":
                agent.context_id,

            # Agent's reports_to_id
            # = Team Lead EmployeeContext.id
            "reports_to_id":
                agent.reports_to_id,

            # Team Lead EmployeeContext.id
            "team_lead_id":
                team_lead.id,

            # Team Lead Employee.id
            "team_lead_employee_id":
                team_lead.employee_id,

            # Team Lead Context.id
            "team_lead_context_id":
                team_lead.context_id,

            "team_lead_name":
                getattr(
                    team_lead.employee,
                    "name",
                    None,
                ),

            "message":
                "Team Lead assigned successfully",
        }