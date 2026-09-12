# app/services/admins_service.py

from datetime import datetime

from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context


class AdminsService:

    # ========================================================================
    # HELPERS
    # ========================================================================

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

    # ========================================================================
    # GET GLOBAL CONTEXT
    # ========================================================================
    #
    # Admin role is always determined by:
    #
    #     contexts.code == "GLOBAL"
    #
    # The frontend never supplies context_id.
    #
    # ========================================================================

    @staticmethod
    def _get_global_context(
        db: Session,
    ) -> Context:

        context = (
            db.query(Context)
            .filter(
                Context.code == "GLOBAL",
                Context.is_active.is_(True),
            )
            .first()
        )

        if not context:
            raise ValueError(
                "GLOBAL context not found or inactive"
            )

        return context

    # ========================================================================
    # GET ADMIN CONTEXT
    # ========================================================================
    #
    # admin_id is:
    #
    #     EmployeeContext.id
    #
    # The selected EmployeeContext must belong to GLOBAL.
    #
    # ========================================================================

    @staticmethod
    def _get_admin_context(
        db: Session,
        admin_id: int,
    ) -> EmployeeContext:

        global_context = AdminsService._get_global_context(
            db=db,
        )

        admin = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == admin_id,
                EmployeeContext.context_id == global_context.id,
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not admin:
            raise ValueError(
                "Admin not found"
            )

        return admin

    # ========================================================================
    # FORMAT DATETIME
    # ========================================================================

    @staticmethod
    def _format_datetime(value):

        if not value:
            return None

        return value.strftime(
            "%d %b %Y, %I:%M %p"
        )

    # ========================================================================
    # BUILD ADMIN RESPONSE
    # ========================================================================
    #
    # Role is intentionally fixed to:
    #
    #     Admin
    #
    # role_code comes from:
    #
    #     Context.code
    #
    # which must be:
    #
    #     GLOBAL
    #
    # ========================================================================

    @staticmethod
    def _build_admin_response(
        employee_context: EmployeeContext,
        employee: Employee,
        context: Context,
    ):

        return {
            # EmployeeContext.id
            "id": employee_context.id,

            # Employee.id
            "employee_id": employee_context.employee_id,

            # Context.id
            "context_id": employee_context.context_id,

            # Employee details
            "name": getattr(
                employee,
                "name",
                None,
            ),

            "email": getattr(
                employee,
                "email",
                None,
            ),

            "phone": getattr(
                employee,
                "phone",
                None,
            ),

            # Admin role
            "role": "Admin",

            # Actual Context code
            "role_code": context.code,

            # Status
            "status": (
                "Active"
                if employee_context.is_active
                else "Inactive"
            ),

            "is_active": employee_context.is_active,

            "is_default": employee_context.is_default,

            # Admins have no hierarchy assignment.
            "reports_to_id": None,

            # Date / Time
            "created_at": AdminsService._format_datetime(
                employee_context.created_at
            ),

            "updated_at": AdminsService._format_datetime(
                employee_context.updated_at
            ),
        }

    # ========================================================================
    # GET ADMINS
    # ========================================================================
    #
    # Only EmployeeContexts whose Context.code is GLOBAL are returned.
    #
    # ========================================================================

    @staticmethod
    def get_admins(
        db: Session,
    ):

        global_context = AdminsService._get_global_context(
            db=db,
        )

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
                Context.id == global_context.id,
                Context.code == "GLOBAL",
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
                AdminsService._build_admin_response(
                    employee_context=employee_context,
                    employee=employee,
                    context=context,
                )
            )

        return result

    # ========================================================================
    # CREATE ADMIN
    # ========================================================================
    #
    # Required:
    #
    #     employee_id
    #     status
    #
    # Context is ALWAYS GLOBAL.
    #
    # ========================================================================

    @staticmethod
    def create_admin(
        db: Session,
        employee_id: int,
        status: str = "Active",
    ):

        is_active = AdminsService._validate_status(
            status
        )

        # --------------------------------------------------------------------
        # GET GLOBAL CONTEXT
        # --------------------------------------------------------------------

        global_context = AdminsService._get_global_context(
            db=db,
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
        # CHECK EXISTING GLOBAL CONTEXT
        # --------------------------------------------------------------------

        existing = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id == employee_id,
                EmployeeContext.context_id == global_context.id,
            )
            .first()
        )

        if existing:

            # ---------------------------------------------------------------
            # ACTIVE / NON-DELETED ADMIN ALREADY EXISTS
            # ---------------------------------------------------------------

            if existing.deleted_at is None:

                raise ValueError(
                    "Employee is already an Admin"
                )

            # ---------------------------------------------------------------
            # RESTORE SOFT-DELETED ADMIN
            # ---------------------------------------------------------------

            existing.deleted_at = None

            existing.is_active = is_active

            existing.reports_to_id = None

            db.flush()

            return {
                "id": existing.id,
                "employee_id": existing.employee_id,
                "context_id": existing.context_id,
                "role": "Admin",
                "role_code": global_context.code,
                "status": (
                    "Active"
                    if existing.is_active
                    else "Inactive"
                ),
                "is_active": existing.is_active,
                "reports_to_id": None,
            }

        # --------------------------------------------------------------------
        # CREATE ADMIN EMPLOYEE CONTEXT
        # --------------------------------------------------------------------

        admin = EmployeeContext(
            employee_id=employee_id,
            context_id=global_context.id,

            # Admin has no reporting relationship.
            reports_to_id=None,

            is_default=False,

            is_active=is_active,
        )

        db.add(admin)

        db.flush()

        return {
            "id": admin.id,
            "employee_id": admin.employee_id,
            "context_id": admin.context_id,
            "role": "Admin",
            "role_code": global_context.code,
            "status": (
                "Active"
                if admin.is_active
                else "Inactive"
            ),
            "is_active": admin.is_active,
            "reports_to_id": None,
        }

    # ========================================================================
    # UPDATE ADMIN
    # ========================================================================
    #
    # Admin role is fixed to GLOBAL.
    #
    # Employee cannot be changed.
    #
    # Therefore this operation validates that the EmployeeContext is still
    # a valid GLOBAL Admin and returns the current Admin information.
    #
    # ========================================================================

    @staticmethod
    def update_admin(
        db: Session,
        admin_id: int,
    ):

        admin = AdminsService._get_admin_context(
            db=db,
            admin_id=admin_id,
        )

        global_context = AdminsService._get_global_context(
            db=db,
        )

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == admin.employee_id,
            )
            .first()
        )

        if not employee:
            raise ValueError(
                "Admin employee not found"
            )

        db.flush()

        return AdminsService._build_admin_response(
            employee_context=admin,
            employee=employee,
            context=global_context,
        )

    # ========================================================================
    # DELETE ADMIN
    # ========================================================================
    #
    # Soft delete.
    #
    # The Employee record itself is NOT deleted.
    #
    # The GLOBAL EmployeeContext is marked deleted and inactive.
    #
    # ========================================================================

    @staticmethod
    def delete_admin(
        db: Session,
        admin_id: int,
    ):

        admin = AdminsService._get_admin_context(
            db=db,
            admin_id=admin_id,
        )

        admin.deleted_at = datetime.utcnow()

        admin.is_active = False

        # Admin has no assignment.
        admin.reports_to_id = None

        db.flush()

        return {
            "message": "Admin deleted successfully",
            "id": admin.id,
        }

    # ========================================================================
    # UPDATE ADMIN STATUS
    # ========================================================================
    #
    # Allowed:
    #
    #     Active
    #     Inactive
    #
    # Only the Admin EmployeeContext status changes.
    #
    # ========================================================================

    @staticmethod
    def update_admin_status(
        db: Session,
        admin_id: int,
        status: str,
    ):

        is_active = AdminsService._validate_status(
            status
        )

        admin = AdminsService._get_admin_context(
            db=db,
            admin_id=admin_id,
        )

        admin.is_active = is_active

        db.flush()

        return {
            "id": admin.id,

            "employee_id": admin.employee_id,

            "context_id": admin.context_id,

            "role": "Admin",

            "role_code": "GLOBAL",

            "status": (
                "Active"
                if admin.is_active
                else "Inactive"
            ),

            "is_active": admin.is_active,

            "reports_to_id": None,
        }