# app/core/access_control.py
from typing import Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session, Query
from app.models.loan_applications import LoanApplication
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.permissions import Permission
from app.models.employee_context_permissions import (
    EmployeeContextPermission,
)


class AccessControl:
    """
    Central authorization and access-control service.

    Responsibilities:

    1. Determine the employee's active context
    2. Read permissions belonging to that context
    3. Check permissions
    4. Enforce permissions
    5. Provide common hierarchy helpers

    Feature-specific data filtering will be added here only
    after the corresponding models are confirmed.
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
        # Explicitly requested context
        # -----------------------------------------------------

        if context_id is not None:

            return (
                query
                .filter(
                    EmployeeContext.context_id == context_id
                )
                .first()
            )

        # -----------------------------------------------------
        # Default context
        # -----------------------------------------------------

        default_context = (
            query
            .filter(
                EmployeeContext.is_default.is_(True)
            )
            .first()
        )

        if default_context:
            return default_context

        # -----------------------------------------------------
        # Fallback
        # -----------------------------------------------------

        return query.first()

    # =========================================================
    # PERMISSIONS
    # =========================================================

    @staticmethod
    def get_context_permissions(
        db: Session,
        employee_context: EmployeeContext,
    ) -> list[str]:

        if not employee_context:
            return []

        permissions = (
            db.query(Permission.code)
            .join(
                EmployeeContextPermission,
                EmployeeContextPermission.permission_id
                == Permission.id,
            )
            .filter(
                EmployeeContextPermission.employee_context_id
                == employee_context.id,
                Permission.is_active.is_(True),
            )
            .all()
        )

        return [
            permission.code
            for permission in permissions
        ]

    # =========================================================
    # EMPLOYEE PERMISSIONS
    # =========================================================

    @staticmethod
    def get_permissions(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> list[str]:

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

        if not employee or not permission:
            return False

        permissions = AccessControl.get_permissions(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        # -----------------------------------------------------
        # Super-admin support
        # -----------------------------------------------------

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

        if not permissions:
            return True

        user_permissions = AccessControl.get_permissions(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if "*" in user_permissions:
            return True

        return any(
            permission in user_permissions
            for permission in permissions
        )

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

        if not permissions:
            return True

        user_permissions = AccessControl.get_permissions(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if "*" in user_permissions:
            return True

        return all(
            permission in user_permissions
            for permission in permissions
        )

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

        if not AccessControl.has_permission(
            db=db,
            employee=employee,
            permission=permission,
            context_id=context_id,
        ):
            raise PermissionError(
                f"Permission denied: {permission}"
            )

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

        if not AccessControl.has_any_permission(
            db=db,
            employee=employee,
            permissions=permissions,
            context_id=context_id,
        ):
            raise PermissionError(
                "Permission denied"
            )

    # =========================================================
    # EMPLOYEE CONTEXT CHECK
    # =========================================================

    @staticmethod
    def has_context(
        db: Session,
        employee: Employee,
        context_code: str,
    ) -> bool:

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
                Context.code == context_code,
            )
            .first()
            is not None
        )

    # =========================================================
    # ACTIVE CONTEXT CODE
    # =========================================================

    @staticmethod
    def get_active_context_code(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[str]:

        context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not context or not context.context:
            return None

        return context.context.code
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
        Restrict LoanApplication records according to
        the employee's active context.

        AGENT:
            sees applications assigned to this employee.

        RM:
            sees applications belonging to this employee.

        GLOBAL / TEAM_LEAD:
            handled separately once their hierarchy rules
            are confirmed.
        """

        if not employee:
            return query.filter(False)

        context_code = AccessControl.get_active_context_code(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        if context_code == "AGENT":

            return query.filter(
                LoanApplication.agent_id == employee.id
            )

        # -----------------------------------------------------
        # RM
        # -----------------------------------------------------

        if context_code == "RM":

            return query.filter(
                LoanApplication.rm_id == employee.id
            )

        # -----------------------------------------------------
        # GLOBAL
        # -----------------------------------------------------

        if context_code == "GLOBAL":

            return query

        # -----------------------------------------------------
        # TEAM LEAD
        # -----------------------------------------------------
        #
        # DO NOT guess the hierarchy yet.
        #
        # We will add this after checking how the new CRM
        # represents Team Lead → Agent/RM relationships.
        # -----------------------------------------------------

        if context_code == "TEAM_LEAD":

            raise NotImplementedError(
                "Team Lead application visibility is not "
                "implemented yet."
            )

        # -----------------------------------------------------
        # Unknown context
        # -----------------------------------------------------

        return query.filter(False)