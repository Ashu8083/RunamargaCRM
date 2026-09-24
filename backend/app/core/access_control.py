# backend/app/core/access_control.py

from typing import Optional
from sqlalchemy import or_, func
from sqlalchemy.orm import Session, Query

from app.models.loan_applications import LoanApplication
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.permissions import Permission
from app.models.call_assignments import CallAssignment
from app.models.call_logs import CallLog
from app.models.loan_applications import LoanApplication
from app.models.employee_context_permissions import (
    EmployeeContextPermission,
)


class AccessControl:
    """
    Central authorization and data-access control service.

    Responsibilities:

    1. Resolve an employee's active context
    2. Resolve permissions for that context
    3. Check / require permissions
    4. Determine context family
    5. Determine visible RMs
    6. Determine visible Agents
    7. Determine visible Team Leads
    8. Apply application data scope

    Context family is derived from Context.code.

    Examples:

        GLOBAL
        AGENT
        AGENT_PERSONAL
        AGENT_BUSINESS
        RM
        RM_SENIOR
        RM_JUNIOR
        TEAMLEAD
        TEAMLEAD_MUMBAI
        TEAM_LEAD_NORTH

    No database IDs are hardcoded here.
    """

    # =========================================================
    # CONTEXT
    # =========================================================

    @staticmethod
    def get_active_context(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[EmployeeContext]:
        """
        Return the employee's active EmployeeContext.

        If context_id is provided:
            return that context only if it belongs to the employee.

        Otherwise:
            prefer the employee's default active context.

        Finally:
            fall back to any active context.
        """

        if not employee:
            return None

        query = (
            db.query(EmployeeContext)
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.employee_id == employee.id,
                EmployeeContext.is_active.is_(True),
                Context.is_active.is_(True),
            )
        )

        # -----------------------------------------------------
        # Explicit context
        # -----------------------------------------------------

        if context_id is not None:
            return query.filter(EmployeeContext.id == context_id).first()

        # -----------------------------------------------------
        # Default context
        # -----------------------------------------------------

        default_context = query.filter(EmployeeContext.is_default.is_(True)).first()

        if default_context:
            return default_context

        # -----------------------------------------------------
        # Fallback
        # -----------------------------------------------------

        return query.first()

    # =========================================================
    # CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def get_context_family(
        context_code: Optional[str],
    ) -> Optional[str]:
        """
        Convert a concrete context code into its operational
        family.

        Examples:

            GLOBAL              -> GLOBAL
            AGENT               -> AGENT
            AGENT_PERSONAL      -> AGENT
            AGENT_BUSINESS      -> AGENT

            RM                  -> RM
            RM_SENIOR           -> RM

            TEAMLEAD             -> TEAMLEAD
            TEAMLEAD_MUMBAI      -> TEAMLEAD
            TEAM_LEAD_NORTH     -> TEAMLEAD

            MANAGER             -> MANAGER
            MANAGER_OPERATIONS  -> MANAGER

        This is intentionally based on the code prefix, not
        the database ID.
        """

        if not context_code:
            return None

        code = str(context_code).strip().upper()

        # -----------------------------------------------------
        # Global
        # -----------------------------------------------------

        if code == "GLOBAL":
            return "GLOBAL"

        # -----------------------------------------------------
        # Agent
        # -----------------------------------------------------

        if code == "AGENT" or code.startswith("AGENT_"):
            return "AGENT"

        # -----------------------------------------------------
        # Relationship Manager
        # -----------------------------------------------------

        if code == "RM" or code.startswith("RM_"):
            return "RM"

        # -----------------------------------------------------
        # Team Lead
        # -----------------------------------------------------

        if (
            code == "TEAMLEAD"
            or code.startswith("TEAMLEAD_")
            or code == "TEAM_LEAD"
            or code.startswith("TEAM_LEAD_")
        ):
            return "TEAMLEAD"

        # -----------------------------------------------------
        # Manager
        # -----------------------------------------------------

        if code == "MANAGER" or code.startswith("MANAGER_"):
            return "MANAGER"

        return None

    # =========================================================
    # ACTIVE CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def get_active_context_family(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[str]:
        """
        Return the operational family of the employee's
        active context.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return None

        return AccessControl.get_context_family(context.context.code)

    # =========================================================
    # ACTIVE CONTEXT CODE
    # =========================================================

    @staticmethod
    def get_active_context_code(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[str]:
        """
        Return the actual Context.code for the active context.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return None

        return context.context.code

    # =========================================================
    # PERMISSIONS
    # =========================================================

    @staticmethod
    def get_context_permissions(
        db: Session,
        employee_context: EmployeeContext,
    ) -> list[str]:
        """
        Return permissions assigned to an EmployeeContext.
        """

        if not employee_context:
            return []

        permissions = (
            db.query(Permission.code)
            .join(
                EmployeeContextPermission,
                EmployeeContextPermission.permission_id == Permission.id,
            )
            .filter(
                EmployeeContextPermission.employee_context_id == employee_context.id,
                Permission.is_active.is_(True),
            )
            .all()
        )

        return [permission.code for permission in permissions]

    # =========================================================
    # EMPLOYEE PERMISSIONS
    # =========================================================

    @staticmethod
    def get_permissions(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> list[str]:
        """
        Return permissions for the employee's active context.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context:
            return []

        return AccessControl.get_context_permissions(
            db=db,
            employee_context=context,
        )

    # =========================================================
    # HAS PERMISSION
    # =========================================================

    @staticmethod
    def has_permission(
        db: Session,
        employee: Employee,
        permission: str,
        context_id: Optional[int] = None,
    ) -> bool:
        """
        Check whether the employee has a permission in the
        selected active context.
        """

        if not employee or not permission:
            return False

        permissions = AccessControl.get_permissions(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if "*" in permissions:
            return True

        return permission in permissions

    # =========================================================
    # HAS ANY PERMISSION
    # =========================================================

    @staticmethod
    def has_any_permission(
        db: Session,
        employee: Employee,
        permissions: list[str],
        context_id: Optional[int] = None,
    ) -> bool:
        """
        Return True if the employee has at least one requested
        permission.
        """

        if not permissions:
            return True

        user_permissions = AccessControl.get_permissions(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if "*" in user_permissions:
            return True

        return any(permission in user_permissions for permission in permissions)

    # =========================================================
    # HAS ALL PERMISSIONS
    # =========================================================

    @staticmethod
    def has_all_permissions(
        db: Session,
        employee: Employee,
        permissions: list[str],
        context_id: Optional[int] = None,
    ) -> bool:
        """
        Return True if the employee has all requested
        permissions.
        """

        if not permissions:
            return True

        user_permissions = AccessControl.get_permissions(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if "*" in user_permissions:
            return True

        return all(permission in user_permissions for permission in permissions)

    # =========================================================
    # REQUIRE PERMISSION
    # =========================================================

    @staticmethod
    def require_permission(
        db: Session,
        employee: Employee,
        permission: str,
        context_id: Optional[int] = None,
    ) -> None:
        """
        Raise PermissionError when the permission is missing.
        """

        if not AccessControl.has_permission(
            db=db,
            employee=employee,
            permission=permission,
            context_id=context_id,
        ):
            raise PermissionError(f"Permission denied: {permission}")

    # =========================================================
    # REQUIRE ANY PERMISSION
    # =========================================================

    @staticmethod
    def require_any_permission(
        db: Session,
        employee: Employee,
        permissions: list[str],
        context_id: Optional[int] = None,
    ) -> None:
        """
        Raise PermissionError when none of the permissions
        are available.
        """

        if not AccessControl.has_any_permission(
            db=db,
            employee=employee,
            permissions=permissions,
            context_id=context_id,
        ):
            raise PermissionError("Permission denied")

    # =========================================================
    # HAS CONTEXT
    # =========================================================

    @staticmethod
    def has_context(
        db: Session,
        employee: Employee,
        context_code: str,
    ) -> bool:
        """
        Check whether an employee has a particular exact
        context code.
        """

        if not employee or not context_code:
            return False

        return (
            db.query(EmployeeContext)
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.employee_id == employee.id,
                EmployeeContext.is_active.is_(True),
                Context.is_active.is_(True),
                func.upper(Context.code) == context_code.upper(),
            )
            .first()
            is not None
        )

    # =========================================================
    # EMPLOYEE QUERY BY CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def _employee_query_by_family(
        db: Session,
        family: str,
    ):
        """
        Build a query for active employees whose active
        EmployeeContext belongs to the requested family.

        This is the central dynamic discovery mechanism.

        No context IDs are used.
        """

        family = family.upper()

        if family == "AGENT":

            context_filter = or_(
                func.upper(Context.code) == "AGENT",
                func.upper(Context.code).like("AGENT_%"),
            )

        elif family == "RM":

            context_filter = or_(
                func.upper(Context.code) == "RM",
                func.upper(Context.code).like("RM_%"),
            )

        elif family == "TEAMLEAD":

            context_filter = or_(
                func.upper(Context.code) == "TEAMLEAD",
                func.upper(Context.code).like("TEAMLEAD_%"),
                func.upper(Context.code) == "TEAM_LEAD",
                func.upper(Context.code).like("TEAM_LEAD_%"),
            )

        elif family == "MANAGER":

            context_filter = or_(
                func.upper(Context.code) == "MANAGER",
                func.upper(Context.code).like("MANAGER_%"),
            )

        else:
            return None

        return (
            db.query(Employee)
            .join(
                EmployeeContext,
                EmployeeContext.employee_id == Employee.id,
            )
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                Employee.status == "active",
                EmployeeContext.is_active.is_(True),
                Context.is_active.is_(True),
                context_filter,
            )
            .distinct()
        )

    # =========================================================
    # VISIBLE RMs
    # =========================================================

    @staticmethod
    def get_visible_rms(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:
        """
        Determine which RM EmployeeContexts the current employee
        can use as an application filter.

        Hierarchy:

            TEAMLEAD
                |
                +---- RM
                +---- RM
                +---- RM

        Therefore:

            RM.reports_to_id == TEAMLEAD EmployeeContext.id

        When team_lead_context_id is provided:

            GLOBAL / MANAGER:
                Return RMs whose reports_to_id matches the
                selected Team Lead EmployeeContext.id.

            Other families:
                Team Lead filtering is not available, so return [].

        When team_lead_context_id is None:

            GLOBAL:
                all active RM contexts.

            RM:
                return [].

            AGENT:
                return the RM context referenced by reports_to_id.

            TEAMLEAD:
                return all RMs whose reports_to_id is the
                current Team Lead EmployeeContext.id.

            MANAGER:
                all active RM contexts.
        """

        if not employee:
            return []

        # ---------------------------------------------------------
        # CURRENT LOGGED-IN USER CONTEXT
        # ---------------------------------------------------------

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return []

        # ---------------------------------------------------------
        # DETERMINE CURRENT USER FAMILY
        # ---------------------------------------------------------

        family = AccessControl.get_context_family(context.context.code)

        # =========================================================
        # TEAM LEAD FILTER SELECTED
        # =========================================================
        #
        # We DO NOT call get_visible_team_leads() here.
        #
        # The frontend already received the available Team Lead
        # IDs from /common/team-leads.
        #
        # We directly use the selected EmployeeContext.id.
        #
        # =========================================================

        if team_lead_context_id is not None:

            # -----------------------------------------------------
            # Only users who can see Team Lead filter can use it.
            # -----------------------------------------------------

            if family not in {"GLOBAL", "MANAGER"}:
                return []

            # -----------------------------------------------------
            # Find RMs directly under the selected Team Lead.
            #
            # RM.reports_to_id == TeamLead EmployeeContext.id
            #
            # If the frontend sends an invalid ID such as 999,
            # this simply returns [].
            # -----------------------------------------------------

            rm_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    EmployeeContext.reports_to_id == team_lead_context_id,
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return rm_contexts

        # =========================================================
        # ORIGINAL FUNCTIONALITY
        # =========================================================

        # ---------------------------------------------------------
        # GLOBAL
        # ---------------------------------------------------------

        if family == "GLOBAL":

            rm_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return rm_contexts

        # ---------------------------------------------------------
        # RM
        # ---------------------------------------------------------

        if family == "RM":
            return []

        # ---------------------------------------------------------
        # TEAM LEAD
        #
        # Team Lead is the parent.
        #
        # RM.reports_to_id == current Team Lead context.id
        # ---------------------------------------------------------

        if family == "TEAMLEAD":

            rm_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    EmployeeContext.reports_to_id == context.id,
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return rm_contexts

        # ---------------------------------------------------------
        # AGENT
        # ---------------------------------------------------------

        if family == "AGENT":

            if not context.reports_to_id:
                return []

            rm_context = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    EmployeeContext.id == context.reports_to_id,
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .first()
            )

            if not rm_context:
                return []

            return [rm_context]

        # ---------------------------------------------------------
        # MANAGER
        # ---------------------------------------------------------

        if family == "MANAGER":

            rm_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return rm_contexts

        return []

    # =========================================================
    # VISIBLE AGENTS
    # =========================================================

    @staticmethod
    def get_visible_agents(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:
        """
        Determine which Agent EmployeeContexts the current employee
        can use as an application filter.

        Normal behavior when team_lead_context_id is None:

            GLOBAL:
                all active Agent contexts.

            RM:
                Agent contexts whose reports_to_id is the current
                RM EmployeeContext.id.

            TEAMLEAD:
                Agent contexts whose reports_to_id is the current
                Team Lead EmployeeContext.id.

            AGENT:
                Agent filter is hidden, therefore return [].

            MANAGER:
                all active Agent contexts.

        When team_lead_context_id is provided:

            GLOBAL / MANAGER:
                Return active Agent contexts whose reports_to_id
                equals the selected Team Lead EmployeeContext.id.

            Other families:
                Team Lead filtering is not available, so return [].

        No repeated call to get_visible_team_leads() is performed.
        """

        if not employee:
            return []

        # ---------------------------------------------------------
        # CURRENT LOGGED-IN USER CONTEXT
        # ---------------------------------------------------------

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return []

        # ---------------------------------------------------------
        # DETERMINE CURRENT USER FAMILY
        # ---------------------------------------------------------

        family = AccessControl.get_context_family(context.context.code)

        # =========================================================
        # TEAM LEAD FILTER
        # =========================================================
        #
        # We do NOT call get_visible_team_leads().
        #
        # The frontend already has the available Team Lead IDs.
        #
        # We directly use the selected EmployeeContext.id.
        #
        # =========================================================

        if team_lead_context_id is not None:

            # -----------------------------------------------------
            # Only users who can see Team Lead filter can use it.
            # -----------------------------------------------------

            if family not in {"GLOBAL", "MANAGER"}:
                return []

            # -----------------------------------------------------
            # Find Agents using the selected Team Lead ID.
            #
            # If team_lead_context_id = 999 and there are no Agents
            # reporting to 999, this returns [].
            #
            # No Team Lead lookup is performed.
            # -----------------------------------------------------

            agent_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    EmployeeContext.reports_to_id == team_lead_context_id,
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return agent_contexts

        # =========================================================
        # ORIGINAL FUNCTIONALITY
        # =========================================================

        # ---------------------------------------------------------
        # GLOBAL
        # ---------------------------------------------------------

        if family == "GLOBAL":

            agent_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return agent_contexts

        # ---------------------------------------------------------
        # AGENT
        # ---------------------------------------------------------

        if family == "AGENT":
            return []

        # ---------------------------------------------------------
        # RM / TEAM LEAD
        # ---------------------------------------------------------

        if family in {"RM", "TEAMLEAD"}:

            agent_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                    EmployeeContext.reports_to_id == context.id,
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return agent_contexts

        # ---------------------------------------------------------
        # MANAGER
        # ---------------------------------------------------------

        if family == "MANAGER":

            agent_contexts = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    Employee.status == "active",
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .order_by(Employee.name.asc())
                .all()
            )

            return agent_contexts

        return []

    # =========================================================
    # VISIBLE TEAM LEADS
    # =========================================================

    @staticmethod
    def get_visible_team_leads(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:
        """
        Determine which Team Lead EmployeeContexts the current
        employee can use as an application filter.

        Visibility rules:

            GLOBAL:
                all active Team Leads.

            MANAGER:
                all active Team Leads.

            RM:
                no Team Lead filter.

            TEAMLEAD:
                no Team Lead filter.

            AGENT:
                no Team Lead filter.

        Returns:
            list[EmployeeContext]

        The returned ID is EmployeeContext.id,
        NOT Employee.id.
        """

        if not employee:
            return []

        # ---------------------------------------------------------
        # CURRENT LOGGED-IN USER CONTEXT
        # ---------------------------------------------------------

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return []

        # ---------------------------------------------------------
        # DETERMINE USER FAMILY
        # ---------------------------------------------------------

        family = AccessControl.get_context_family(context.context.code)

        # ---------------------------------------------------------
        # ONLY GLOBAL AND MANAGER CAN SEE TEAM LEAD FILTER
        # ---------------------------------------------------------

        if family not in {"GLOBAL", "MANAGER"}:
            return []

        # ---------------------------------------------------------
        # GET ALL ACTIVE TEAM LEAD CONTEXTS
        # ---------------------------------------------------------

        team_lead_contexts = (
            db.query(EmployeeContext)
            .join(
                Employee,
                EmployeeContext.employee_id == Employee.id,
            )
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                # Employee must be active
                Employee.status == "active",
                # EmployeeContext must be active
                EmployeeContext.is_active.is_(True),
                # Context must be active
                Context.is_active.is_(True),
                # Team Lead context
                or_(
                    func.upper(Context.code) == "TEAMLEAD",
                    func.upper(Context.code).like("TEAMLEAD_%"),
                    func.upper(Context.code) == "TEAM_LEAD",
                    func.upper(Context.code).like("TEAM_LEAD_%"),
                ),
            )
            .order_by(Employee.name.asc())
            .all()
        )

        return team_lead_contexts

    # =========================================================
    # APPLICATION FILTER VISIBILITY
    # =========================================================

    @staticmethod
    def get_application_filter_options(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> dict:
        """
        Return all application filter options visible to the
        current employee.

        This is the backend source of truth for the frontend.

        The frontend does not need to know:

            context IDs
            employee IDs
            AGENT IDs
            RM IDs
            TEAM LEAD IDs

        It only consumes this response.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return {
                "context": None,
                "visibility": {
                    "show_rm": False,
                    "show_agent": False,
                    "show_team_lead": False,
                },
                "rms": [],
                "agents": [],
                "team_leads": [],
            }

        family = AccessControl.get_context_family(context.context.code)

        # -----------------------------------------------------
        # Visibility
        # -----------------------------------------------------

        visibility = {
            "show_rm": family != "RM",
            "show_agent": family != "AGENT",
            "show_team_lead": family != "TEAMLEAD",
        }

        # -----------------------------------------------------
        # Data
        # -----------------------------------------------------

        rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        team_leads = AccessControl.get_visible_team_leads(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        return {
            "context": {
                "id": context.id,
                "context_id": context.context.id,
                "code": context.context.code,
                "name": context.context.name,
            },
            "visibility": visibility,
            "rms": [
                {
                    "id": item.id,
                    "name": item.name,
                }
                for item in rms
            ],
            "agents": [
                {
                    "id": item.id,
                    "name": item.name,
                }
                for item in agents
            ],
            "team_leads": [
                {
                    "id": item.id,
                    "name": item.name,
                }
                for item in team_leads
            ],
        }
        # =========================================================

    # CALL LOG VISIBILITY
    # =========================================================

    @staticmethod
    def apply_call_log_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """
        Restrict CallLog records according to the employee's
        active context.

        GLOBAL:
            all call logs.

        AGENT:
            own call logs.

        RM:
            own call logs.

        TEAMLEAD:
            call logs belonging to the RM(s) reporting to
            the current Team Lead.

        MANAGER:
            all call logs.

        Unknown:
            no call logs.
        """

        if not employee:
            return query.filter(False)

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return query.filter(False)

        family = AccessControl.get_context_family(context.context.code)

        # -----------------------------------------------------
        # GLOBAL
        # -----------------------------------------------------

        if family == "GLOBAL":
            return query

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        if family == "AGENT":
            return query.filter(CallLog.employee_id == employee.id)

        # -----------------------------------------------------
        # RM
        # -----------------------------------------------------

        if family == "RM":
            return query.filter(CallLog.employee_id == employee.id)

        # -----------------------------------------------------
        # TEAM LEAD
        # -----------------------------------------------------

        if family == "TEAMLEAD":

            rm_query = AccessControl._employee_query_by_family(
                db=db,
                family="RM",
            )

            if rm_query is None:
                return query.filter(False)

            rm_ids = [
                rm.id
                for rm in rm_query.filter(
                    EmployeeContext.reports_to_id == context.id
                ).all()
            ]

            if not rm_ids:
                return query.filter(False)

            return query.filter(CallLog.employee_id.in_(rm_ids))

        # -----------------------------------------------------
        # MANAGER
        # -----------------------------------------------------

        if family == "MANAGER":
            return query

        # -----------------------------------------------------
        # Unknown
        # -----------------------------------------------------

        return query.filter(False)

    # =========================================================
    # CALL ASSIGNMENT VISIBILITY
    # =========================================================

    @staticmethod
    def apply_call_assignment_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """
        Restrict CallAssignment records according to the
        employee's active context.

        GLOBAL:
            all assignments.

        AGENT:
            assignments assigned to the current employee.

        RM:
            assignments assigned to the current employee.

        TEAMLEAD:
            assignments assigned to the RM referenced by
            the Team Lead's reports_to_id.

        MANAGER:
            all assignments.

        Unknown:
            no assignments.
        """

        if not employee:
            return query.filter(False)

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return query.filter(False)

        family = AccessControl.get_context_family(context.context.code)

        # -----------------------------------------------------
        # GLOBAL
        # -----------------------------------------------------

        if family == "GLOBAL":
            return query

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        if family == "AGENT":
            return query.filter(CallAssignment.assigned_to_id == employee.id)

        # -----------------------------------------------------
        # RM
        # -----------------------------------------------------

        if family == "RM":
            return query.filter(CallAssignment.assigned_to_id == employee.id)

        # -----------------------------------------------------
        # TEAM LEAD
        # -----------------------------------------------------

        if family == "TEAMLEAD":

            rm_query = AccessControl._employee_query_by_family(
                db=db,
                family="RM",
            )

        if rm_query is None:
            return query.filter(False)

        rm_ids = [
            rm.id
            for rm in rm_query.filter(EmployeeContext.reports_to_id == context.id).all()
        ]

        if not rm_ids:
            return query.filter(False)

        return query.filter(CallAssignment.assigned_to_id.in_(rm_ids))

        # -----------------------------------------------------
        # MANAGER
        # -----------------------------------------------------

        if family == "MANAGER":
            return query

        # -----------------------------------------------------
        # Unknown
        # -----------------------------------------------------

        return query.filter(False)

    # =========================================================
    # APPLICATION VISIBILITY
    # =========================================================

    @staticmethod
    def apply_application_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """
        Restrict LoanApplication records according to the
        employee's active context.

        GLOBAL:
            all applications.

        AGENT:
            applications assigned to the current employee.

        RM:
            applications belonging to the current employee.

        TEAMLEAD:
            not guessed until the actual Team Lead hierarchy
            is confirmed.

        Unknown:
            no applications.
        """

        if not employee:
            return query.filter(False)

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return query.filter(False)

        family = AccessControl.get_context_family(context.context.code)

        # -----------------------------------------------------
        # GLOBAL
        # -----------------------------------------------------

        if family == "GLOBAL":
            # print(query)
            return query

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        if family == "AGENT":

            return query.filter(LoanApplication.agent_context_id == context.id)

        # -----------------------------------------------------
        # RM
        # -----------------------------------------------------

        if family == "RM":

            return query.filter(LoanApplication.rm_context_id == context.id)

        # -----------------------------------------------------
        # TEAM LEAD
        # -----------------------------------------------------
        #
        # We intentionally do not guess this.
        #
        # Once the Team Lead hierarchy is confirmed, this
        # section can filter applications through the Team
        # Lead's subordinate Agents/RMs.
        # -----------------------------------------------------

        if family == "TEAMLEAD":

            agent_context_ids = (
                db.query(EmployeeContext.id)
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    EmployeeContext.reports_to_id == context.id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .all()
            )

            agent_context_ids = [context_id for (context_id,) in agent_context_ids]

            if not agent_context_ids:
                return query.filter(False)

            return query.filter(LoanApplication.agent_context_id.in_(agent_context_ids))

        # -----------------------------------------------------
        # MANAGER
        # -----------------------------------------------------

        if family == "MANAGER":

            return query

        # -----------------------------------------------------
        # Unknown
        # -----------------------------------------------------

        return query.filter(False)

    # =========================================================
    # DUPLICATE APPROVAL VISIBILITY
    # =========================================================

    @staticmethod
    def apply_duplicate_approval_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """
        Restrict DuplicateApproval records according to the
        employee's active EmployeeContext.

        GLOBAL:
            all duplicate approvals.

        AGENT:
            duplicate approvals created by the current Agent context.

        RM:
            duplicate approvals created by Agent contexts
            reporting to the current RM context.

        TEAMLEAD:
            duplicate approvals created by subordinate
            Agent contexts.

        MANAGER:
            all duplicate approvals.

        Unknown:
            no duplicate approvals.
        """

        if not employee:
            return query.filter(False)

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return query.filter(False)

        family = AccessControl.get_context_family(context.context.code)

        # ---------------------------------------------------------
        # GLOBAL
        # ---------------------------------------------------------

        if family == "GLOBAL":
            return query

        # ---------------------------------------------------------
        # AGENT
        # ---------------------------------------------------------

        if family == "AGENT":

            return query.filter(DuplicateApproval.applied_by_context_id == context.id)

        # ---------------------------------------------------------
        # RM
        # ---------------------------------------------------------

        if family == "RM":

            agent_context_ids = (
                db.query(EmployeeContext.id)
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    EmployeeContext.reports_to_id == context.id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .all()
            )

            agent_context_ids = [
                agent_context_id for (agent_context_id,) in agent_context_ids
            ]

            if not agent_context_ids:
                return query.filter(False)

            return query.filter(
                DuplicateApproval.applied_by_context_id.in_(agent_context_ids)
            )

        # ---------------------------------------------------------
        # TEAM LEAD
        # ---------------------------------------------------------

        if family == "TEAMLEAD":

            subordinate_context_ids = (
                db.query(EmployeeContext.id)
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    EmployeeContext.reports_to_id == context.id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .all()
            )

            subordinate_context_ids = [
                subordinate_context_id
                for (subordinate_context_id,) in subordinate_context_ids
            ]

            if not subordinate_context_ids:
                return query.filter(False)

            return query.filter(
                DuplicateApproval.applied_by_context_id.in_(subordinate_context_ids)
            )

        # ---------------------------------------------------------
        # MANAGER
        # ---------------------------------------------------------

        if family == "MANAGER":
            return query

        # ---------------------------------------------------------
        # UNKNOWN
        # ---------------------------------------------------------

        return query.filter(False)

    @staticmethod
    def can_assign_call_to_employee(
        db: Session,
        employee: Employee,
        target_employee: Employee,
        permission: str = "calls:number:assign",
    ) -> bool:
        """
        Check whether the current employee has permission to assign/exchange
        a call to the target employee.

        Permission decides whether the action is allowed.
        Context scope decides whether the target employee is allowed.
        """

        if not employee or not target_employee:
            return False

        # ---------------------------------------------------------
        # PERMISSION CHECK
        # ---------------------------------------------------------

        if not AccessControl.has_permission(
            db=db,
            employee=employee,
            permission=permission,
        ):
            return False

        # ---------------------------------------------------------
        # TARGET SCOPE CHECK
        # ---------------------------------------------------------

        visible_rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
        )

        visible_rm_ids = {rm.id for rm in visible_rms}

        context_family = AccessControl.get_active_context_family(
            db=db,
            employee=employee,
        )

        if context_family == "GLOBAL":
            return True

        if context_family == "RM":
            return target_employee.id == employee.id

        if context_family in {"AGENT", "TEAMLEAD"}:
            return target_employee.id in visible_rm_ids

        if context_family == "MANAGER":
            return True

        return False
