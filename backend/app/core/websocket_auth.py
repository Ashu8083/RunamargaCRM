# backend/app/core/websocket_auth.py

from fastapi import WebSocket
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.core.security import get_employee_id_from_token


async def get_current_employee_websocket(
    websocket: WebSocket,
    db: Session,
) -> Employee | None:

    print(
        "WEBSOCKET COOKIES:",
        websocket.cookies
    )

    access_token = websocket.cookies.get(
        "access_token"
    )

    print(
        "WEBSOCKET ACCESS TOKEN:",
        bool(access_token)
    )

    if not access_token:
        return None

    try:
        employee_id = get_employee_id_from_token(
            access_token
        )
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

    if not employee:
        return None

    if employee.deactivate:
        return None

    if employee.status != "active":
        return None

    return employee