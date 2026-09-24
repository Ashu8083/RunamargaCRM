# app/services/team_lead_service.py

from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context


class TeamLeadService:

    # ========================================================================
    # HELPERS
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
                or_(
                    Context.code == "TEAMLEAD",
                    Context.code.like("TEAMLEAD_%"),
                ),
            )
            .first()
        )

        if not team_lead:
            raise ValueError("Team Lead not found")

        return team_lead

    @staticmethod
    def _validate_status(status: str) -> bool:

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

    @staticmethod
    def _validate_team_lead_context(
        db: Session,
        context_id: int,
    ) -> Context:

        context = (
            db.query(Context)
            .filter(
                Context.id == context_id,
                Context.is_active.is_(True),
                or_(
                    Context.code == "TEAMLEAD",
                    Context.code.like("TEAMLEAD_%"),
                ),
            )
            .first()
        )

        if not context:
            raise ValueError(
                "Invalid or inactive Team Lead context"
            )

        return context

    # ========================================================================
    # GET TEAM LEADS
    # ========================================================================

    @staticmethod
    def get_team_leads(db: Session):

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
                or_(
                    Context.code == "TEAMLEAD",
                    Context.code.like("TEAMLEAD_%"),
                ),
            )
            .order_by(
                EmployeeContext.id.desc()
            )
            .all()
        )

        # ====================================================================
        # FORMAT DATETIME
        # ====================================================================

        def format_datetime(value):

            if not value:
                return None

            return value.strftime(
                "%d %b %Y, %I:%M %p"
            )

        # ====================================================================
        # BUILD RESPONSE
        # ====================================================================

        result = []

        for employee_context, employee, context in rows:

            result.append(
                {
                    # EmployeeContext.id
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

                    "status": (
                        "Active"
                        if employee_context.is_active
                        else "Inactive"
                    ),

                    "is_active":
                        employee_context.is_active,

                    "is_default":
                        employee_context.is_default,

                    "reports_to_id":
                        employee_context.reports_to_id,

                    "created_at":
                        format_datetime(
                            employee_context.created_at
                        ),

                    "updated_at":
                        format_datetime(
                            employee_context.updated_at
                        ),
                }
            )

        return result

    # ========================================================================
    # CREATE TEAM LEAD
    # ========================================================================

    @staticmethod
    def create_team_lead(
        db: Session,
        employee_id: int,
        context_id: int,
        status: str = "Active",
    ):

        is_active = TeamLeadService._validate_status(
            status
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
        # VALIDATE ACTIVE TEAM LEAD CONTEXT
        # --------------------------------------------------------------------

        TeamLeadService._validate_team_lead_context(
            db=db,
            context_id=context_id,
        )

        # --------------------------------------------------------------------
        # CHECK EXISTING EMPLOYEE CONTEXT
        # --------------------------------------------------------------------

        existing = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id == employee_id,
                EmployeeContext.context_id == context_id,
            )
            .first()
        )

        if existing:

            if existing.deleted_at is None:

                raise ValueError(
                    "Employee already has this Team Lead role"
                )

            # ----------------------------------------------------------------
            # RESTORE SOFT-DELETED TEAM LEAD
            # ----------------------------------------------------------------

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

                "status": (
                    "Active"
                    if existing.is_active
                    else "Inactive"
                ),

                "is_active":
                    existing.is_active,
            }

        # --------------------------------------------------------------------
        # CREATE EMPLOYEE CONTEXT
        # --------------------------------------------------------------------

        team_lead = EmployeeContext(
            employee_id=employee_id,
            context_id=context_id,
            reports_to_id=None,
            is_default=False,
            is_active=is_active,
        )

        db.add(team_lead)
        db.flush()

        return {
            "id":
                team_lead.id,

            "employee_id":
                team_lead.employee_id,

            "context_id":
                team_lead.context_id,

            "status": (
                "Active"
                if team_lead.is_active
                else "Inactive"
            ),

            "is_active":
                team_lead.is_active,
        }

    # ========================================================================
    # UPDATE TEAM LEAD
    # ========================================================================

    @staticmethod
    def update_team_lead(
        db: Session,
        team_lead_id: int,
        context_id: int,
    ):

        # --------------------------------------------------------------------
        # FIND EXISTING TEAM LEAD
        # --------------------------------------------------------------------

        team_lead = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == team_lead_id,
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not team_lead:
            raise ValueError(
                "Team Lead not found"
            )

        # --------------------------------------------------------------------
        # VALIDATE NEW ACTIVE TEAM LEAD CONTEXT
        # --------------------------------------------------------------------

        TeamLeadService._validate_team_lead_context(
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
                == team_lead.employee_id,

                EmployeeContext.context_id
                == context_id,

                EmployeeContext.id
                != team_lead_id,

                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if duplicate:
            raise ValueError(
                "Employee already has this Team Lead role"
            )

        # --------------------------------------------------------------------
        # UPDATE ONLY CONTEXT
        # --------------------------------------------------------------------

        team_lead.context_id = context_id

        db.flush()

        return {
            "id":
                team_lead.id,

            "employee_id":
                team_lead.employee_id,

            "context_id":
                team_lead.context_id,

            "status": (
                "Active"
                if team_lead.is_active
                else "Inactive"
            ),

            "is_active":
                team_lead.is_active,
        }

    # ========================================================================
    # DELETE TEAM LEAD
    # ========================================================================

    @staticmethod
    def delete_team_lead(
        db: Session,
        team_lead_id: int,
    ):

        team_lead = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == team_lead_id,
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not team_lead:
            raise ValueError(
                "Team Lead not found"
            )

        team_lead.deleted_at = datetime.utcnow()
        team_lead.is_active = False

        db.flush()

        return {
            "message":
                "Team Lead deleted successfully",

            "id":
                team_lead.id,
        }

    # ========================================================================
    # UPDATE TEAM LEAD STATUS
    # ========================================================================

    @staticmethod
    def update_team_lead_status(
        db: Session,
        team_lead_id: int,
        status: str,
    ):

        is_active = TeamLeadService._validate_status(
            status
        )

        team_lead = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == team_lead_id,
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not team_lead:
            raise ValueError(
                "Team Lead not found"
            )

        team_lead.is_active = is_active

        db.flush()

        return {
            "id":
                team_lead.id,

            "employee_id":
                team_lead.employee_id,

            "context_id":
                team_lead.context_id,

            "status": (
                "Active"
                if team_lead.is_active
                else "Inactive"
            ),

            "is_active":
                team_lead.is_active,
        }

    # ========================================================================
    # GET ASSIGNED AGENTS
    # ========================================================================

    @staticmethod
    def get_assigned_agents(
        db: Session,
        team_lead_id: int,
    ):
        """
        Get all RM and Agent EmployeeContexts assigned under a Team Lead.

        Hierarchy is determined entirely by:

            EmployeeContext.id
            EmployeeContext.reports_to_id

        Example:

            TEAMLEAD
            EmployeeContext.id = 89
                    |
                    +---- RM
                    |     EmployeeContext.id = 73
                    |             |
                    |             +---- AGENT
                    |             +---- AGENT
                    |
                    +---- RM
                    |     EmployeeContext.id = 74
                    |             |
                    |             +---- AGENT
                    |
                    +---- RM
                        EmployeeContext.id = 88
                                |
                                +---- AGENT

        The method returns both RM and Agent descendants.

        Important:
            reports_to_id references EmployeeContext.id in the
            hierarchy shown by the current database structure.
        """

        # ====================================================================
        # VALIDATE TEAM LEAD
        # ====================================================================

        team_lead = (
            TeamLeadService._get_team_lead_context(
                db=db,
                team_lead_id=team_lead_id,
            )
        )

        # ====================================================================
        # TEAM LEAD CONTEXT ID
        # ====================================================================

        root_context_id = team_lead.id

        # ====================================================================
        # GET ALL ACTIVE RM / AGENT EMPLOYEE CONTEXTS
        # ====================================================================
        #
        # IMPORTANT:
        #
        # Do NOT join Employee here.
        #
        # The hierarchy is determined by:
        #
        #     EmployeeContext.id
        #     EmployeeContext.reports_to_id
        #
        # Employee details are only needed when building the response.
        #
        # ====================================================================

        hierarchy_rows = (
            db.query(
                EmployeeContext.id,
                EmployeeContext.employee_id,
                EmployeeContext.context_id,
                EmployeeContext.reports_to_id,
            )
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.deleted_at.is_(None),
                EmployeeContext.is_active.is_(True),
                Context.is_active.is_(True),
                or_(
                    Context.code == "RM",
                    Context.code.like("RM_%"),
                    Context.code == "AGENT",
                    Context.code.like("AGENT_%"),
                ),
            )
            .all()
        )

        # ====================================================================
        # BUILD CHILDREN MAP
        # ====================================================================
        #
        # Example result:
        #
        # {
        #     89: [73, 69, 74, 88],
        #     73: [101, 102],
        #     74: [103],
        #     88: [104],
        # }
        #
        # Key:
        #     Parent EmployeeContext.id
        #
        # Value:
        #     Child EmployeeContext IDs
        #
        # ====================================================================

        children_map = {}

        for (
            context_id,
            employee_id,
            child_context_id,
            reports_to_id,
        ) in hierarchy_rows:

            if reports_to_id is None:
                continue

            children_map.setdefault(
                reports_to_id,
                []
            ).append(
                context_id
            )

        # ====================================================================
        # WALK THE HIERARCHY
        # ====================================================================
        #
        # Start:
        #
        #     89
        #
        # Then:
        #
        #     89 -> 73, 69, 74, 88
        #
        # Then:
        #
        #     73 -> Agents under RM 73
        #     69 -> Agents under RM 69
        #     74 -> Agents under RM 74
        #     88 -> Agents under RM 88
        #
        # ====================================================================

        assigned_context_ids = []

        pending_ids = [root_context_id]

        visited_ids = set()

        while pending_ids:

            parent_id = pending_ids.pop(0)

            if parent_id in visited_ids:
                continue

            visited_ids.add(parent_id)

            child_ids = children_map.get(
                parent_id,
                []
            )

            for child_id in child_ids:

                if child_id in visited_ids:
                    continue

                assigned_context_ids.append(
                    child_id
                )

                pending_ids.append(
                    child_id
                )

        # ====================================================================
        # NO CHILDREN
        # ====================================================================

        if not assigned_context_ids:
            return []

        # ====================================================================
        # GET COMPLETE DATA FOR RESULT
        # ====================================================================

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
                EmployeeContext.id.in_(
                    assigned_context_ids
                ),

                EmployeeContext.deleted_at.is_(None),

                EmployeeContext.is_active.is_(True),

                Context.is_active.is_(True),

                or_(
                    Context.code == "RM",
                    Context.code.like("RM_%"),
                    Context.code == "AGENT",
                    Context.code.like("AGENT_%"),
                ),
            )
            .all()
        )

        # ====================================================================
        # KEEP HIERARCHY ORDER
        # ====================================================================

        rows_by_context_id = {
            employee_context.id: (
                employee_context,
                employee,
                context,
            )
            for (
                employee_context,
                employee,
                context,
            ) in rows
        }

        # ====================================================================
        # BUILD RESPONSE
        # ====================================================================

        result = []

        for context_id in assigned_context_ids:

            row = rows_by_context_id.get(
                context_id
            )

            if not row:
                continue

            (
                employee_context,
                employee,
                context,
            ) = row

            result.append(
                {
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

                    "status":
                        "Active",

                    "reports_to_id":
                        employee_context.reports_to_id,
                }
            )
        print(result)
        return result