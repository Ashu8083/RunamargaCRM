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
        if not AccessControl.has_permission(
            db,
            employee,
            permission,
        ):
            raise HTTPException(
                status_code=403,
                detail="Permission denied",
            )
        return employee

    return permission_dependency