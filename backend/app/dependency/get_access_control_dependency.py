# backend\app\dependency\get_access_control_dependency.py


from app.config.database import get_db
from app.models.employees import Employee
from app.core.access_control import AccessControl
from app.core.security import get_current_employee

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session


def check_permission(permission: str):

    def permission_dependency(
        request: Request,
        employee: Employee = Depends(get_current_employee),
        db: Session = Depends(get_db),
    ) -> Employee:

        # -------------------------------------------------
        # GET SELECTED EMPLOYEE CONTEXT ID
        # -------------------------------------------------

        raw_context_id = (
            request.headers.get("X-Employee-Context-ID")
            or request.query_params.get("context_id")
        )

        context_id = None

        if raw_context_id:

            try:
                context_id = int(raw_context_id)

                if context_id <= 0:
                    raise ValueError("Context ID must be positive")

            except (ValueError, TypeError):

                raise HTTPException(
                    status_code=400,
                    detail="Invalid employee context ID",
                )

        # -------------------------------------------------
        # RESOLVE SELECTED CONTEXT
        # -------------------------------------------------

        selected_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not selected_context:

            raise HTTPException(
                status_code=403,
                detail="No valid active employee context",
            )

        # -------------------------------------------------
        # CHECK REQUESTED PERMISSION
        # -------------------------------------------------

        allowed = AccessControl.has_permission(
            db=db,
            employee=employee,
            permission=permission,
            context_id=selected_context.id,
        )

        if not allowed:

            raise HTTPException(
                status_code=403,
                detail="Permission denied",
            )

        return employee

    return permission_dependency
