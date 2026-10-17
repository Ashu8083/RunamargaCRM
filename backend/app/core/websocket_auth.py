# backend/app/core/websocket_auth.py

from fastapi import WebSocket
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.core.security import get_employee_id_from_refresh_token


async def get_current_employee_websocket(
    websocket: WebSocket,
    db: Session,
) -> Employee | None:
    # Never log cookie values or JWTs.
    refresh_token = websocket.cookies.get("refresh_token")

    if not refresh_token:
        return None

    try:
        employee_id = get_employee_id_from_refresh_token(refresh_token)
    except ValueError:
        return None

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if employee is None:
        return None

    if employee.deactivate or employee.status != "active":
        return None

    return employee
