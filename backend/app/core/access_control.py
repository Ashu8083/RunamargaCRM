# backend/app/core/access_control.py

from typing import Optional
from sqlalchemy import or_, func
from sqlalchemy.orm import Session, Query

from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.permissions import Permission
from app.models.employee_context_permissions import (
    EmployeeContextPermission,
)

class AccessControl:

    _CONTEXT_FAMILY_PATTERNS = {
        "AGENT": ("AGENT", "AGENT_%"),
        "RM": ("RM", "RM_%"),
        "TEAMLEAD": (
            "TEAMLEAD",
            "TEAMLEAD_%",
            "TEAM_LEAD",
            "TEAM_LEAD_%",
        ),
        "MANAGER": ("MANAGER", "MANAGER_%"),
    }
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
    # =========================================================
    # CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def get_context_family(
        context_code: Optional[str],
    ) -> Optional[str]:
        """
        Convert a concrete context code into its operational family.
        """

        if not context_code:
            return None

        code = str(context_code).strip().upper()

        if code == "GLOBAL":
            return "GLOBAL"

        for family, patterns in AccessControl._CONTEXT_FAMILY_PATTERNS.items():
            for pattern in patterns:
                if pattern.endswith("%"):
                    if code.startswith(pattern[:-1]):
                        return family
                elif code == pattern:
                    return family

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
    # =========================================================
    # CONTEXT FAMILY QUERY HELPERS
    # =========================================================

    @staticmethod
    def _context_family_filter(family: str):
        """
        Build the Context.code SQL filter for a context family.
        """

        family = (family or "").upper()

        patterns = AccessControl._CONTEXT_FAMILY_PATTERNS.get(
            family
        )

        if not patterns:
            return None

        return or_(
            *[
                (
                    func.upper(Context.code) == pattern
                    if not pattern.endswith("%")
                    else func.upper(Context.code).like(pattern)
                )
                for pattern in patterns
            ]
        )

    @staticmethod
    def _employee_context_query_by_family(
        db: Session,
        family: str,
    ) -> Optional[Query]:
        """
        Return a query for active EmployeeContexts belonging to
        the requested context family.

        All concrete Context.code matching is centralized in
        _context_family_filter().
        """

        context_filter = AccessControl._context_family_filter(family)

        if context_filter is None:
            return None

        return (
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
                context_filter,
            )
        )

    @staticmethod
    def _visible_contexts(
        db: Session,
        family: str,
        reports_to_id: Optional[int] = None,
    ) -> list[EmployeeContext]:
        """
        Return active EmployeeContexts for a family, optionally
        restricted to a parent EmployeeContext.
        """

        query = AccessControl._employee_context_query_by_family(
            db=db,
            family=family,
        )

        if query is None:
            return []

        if reports_to_id is not None:
            query = query.filter(
                EmployeeContext.reports_to_id == reports_to_id
            )

        return query.order_by(Employee.name.asc()).all()

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

        Rules:

        GLOBAL:
            all active RMs.

        MANAGER:
            all active RMs.

        TEAMLEAD:
            RMs reporting to the current Team Lead context.

        AGENT:
            the RM referenced by the Agent's reports_to_id.

        RM:
            no RM filter.

        When team_lead_context_id is supplied, only GLOBAL and
        MANAGER may use the Team Lead filter. RMs directly
        reporting to that selected Team Lead are returned.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return []

        family = AccessControl.get_context_family(
            context.context.code
        )

        if team_lead_context_id is not None:
            if family not in {"GLOBAL", "MANAGER"}:
                return []

            return AccessControl._visible_contexts(
                db=db,
                family="RM",
                reports_to_id=team_lead_context_id,
            )

        if family in {"GLOBAL", "MANAGER"}:
            return AccessControl._visible_contexts(
                db=db,
                family="RM",
            )

        if family == "RM":
            return []

        if family == "TEAMLEAD":
            return AccessControl._visible_contexts(
                db=db,
                family="RM",
                reports_to_id=context.id,
            )

        if family == "AGENT":
            if not context.reports_to_id:
                return []

            rm = (
                AccessControl._employee_context_query_by_family(
                    db=db,
                    family="RM",
                )
                .filter(
                    EmployeeContext.id == context.reports_to_id
                )
                .first()
            )

            return [rm] if rm else []

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

        Rules:

        GLOBAL:
            all active Agents.

        MANAGER:
            all active Agents.

        RM:
            Agents reporting to the current RM context.

        TEAMLEAD:
            Agents reporting to the current Team Lead context.

        AGENT:
            no Agent filter.

        When team_lead_context_id is supplied, only GLOBAL and
        MANAGER may use the Team Lead filter.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return []

        family = AccessControl.get_context_family(
            context.context.code
        )

        if team_lead_context_id is not None:
            if family not in {"GLOBAL", "MANAGER"}:
                return []

            return AccessControl._visible_contexts(
                db=db,
                family="AGENT",
                reports_to_id=team_lead_context_id,
            )

        if family in {"GLOBAL", "MANAGER"}:
            return AccessControl._visible_contexts(
                db=db,
                family="AGENT",
            )

        if family == "AGENT":
            return []

        if family in {"RM", "TEAMLEAD"}:
            return AccessControl._visible_contexts(
                db=db,
                family="AGENT",
                reports_to_id=context.id,
            )

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

        Only GLOBAL and MANAGER may see Team Leads.
        """

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return []

        family = AccessControl.get_context_family(
            context.context.code
        )

        if family not in {"GLOBAL", "MANAGER"}:
            return []

        return AccessControl._visible_contexts(
            db=db,
            family="TEAMLEAD",
        )
    @staticmethod
    def can_assign_call_to_employee(
        db: Session,
        employee: Employee,
        target_employee: Employee,
        permission: str = "calls:number:assign",
    ) -> bool:
        """
        Check whether the employee can assign a call
        to the target employee.
        """

        if not employee or not target_employee:
            return False

        if not AccessControl.has_permission(
            db=db,
            employee=employee,
            permission=permission,
        ):
            return False

        context_family = AccessControl.get_active_context_family(
            db=db,
            employee=employee,
        )

        if context_family in {"GLOBAL", "MANAGER"}:
            return True

        if context_family == "RM":
            return target_employee.id == employee.id

        if context_family in {"AGENT", "TEAMLEAD"}:
            visible_rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
            )

            visible_rm_employee_ids = {
                rm.employee_id
                for rm in visible_rms
            }

            return target_employee.id in visible_rm_employee_ids

        return False