from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.employees import Employee
from app.core.access_control import AccessControl
from app.core.security import  get_current_employee


def check_permission(permission: str):
    def dependency(
        db: Session = Depends(get_db),
        employee: Employee = Depends(get_current_employee),
    ):
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
    return dependency