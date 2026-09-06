from app.config.database import get_db
from app.models.employees import Employee
from app.core.access_control import AccessControl
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session


def check_permission(permission: str):
    def permission_dependency(
        request: Request,
        db: Session = Depends(get_db),
    ):
        employee: Employee = request.state.employee

        if not AccessControl.has_permission(
            db,
            employee,
            permission,
        ):
            raise HTTPException(
                status_code=403,
                detail="Permission denied",
            )

    return permission_dependency