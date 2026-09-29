import os
from datetime import datetime, timedelta, timezone
import hashlib  
import jwt
from fastapi import Cookie, Depends, HTTPException,Request
from sqlalchemy.orm import Session
from app.models.employees import Employee
from app.config.database import get_db
from app.services.employee_face_profile_service import logger

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-secret-in-production",
)

JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def create_access_token(employee_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    logger.info("access_token called for {}".format(employee_id))
    payload = {
        "sub": str(employee_id),
        "type": "access",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def create_refresh_token(employee_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = {
        "sub": str(employee_id),
        "type": "refresh",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )
def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

    return payload


def get_employee_id_from_token(token: str) -> int:
    payload = decode_token(token)

    if payload.get("type") != "access":
        raise ValueError("Invalid access token")

    employee_id = payload.get("sub")

    if not employee_id:
        raise ValueError("Invalid access token")

    try:
        return int(employee_id)
    except (TypeError, ValueError):
        raise ValueError("Invalid employee ID in token")

def get_current_employee(
    request: Request,
    db: Session = Depends(get_db),
    access_token: str | None = Cookie(default=None),
) -> Employee:
    print(access_token)

    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    try:
        employee_id = get_employee_id_from_token(access_token)
    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=401,
            detail="Employee not found",
        )

    if employee.deactivate:
        raise HTTPException(
            status_code=401,
            detail="Account is deactivated",
        )

    if employee.status != "active":
        raise HTTPException(
            status_code=401,
            detail="Account is inactive",
        )
    request.state.employee = employee

    # Check for x-employee-context-id or x-context-id header
    context_header = request.headers.get("x-employee-context-id") or request.headers.get("x-context-id")

    if context_header and context_header.isdigit():
        request.state.employee_context_id = int(context_header)
    else:
        default_context = next((ctx for ctx in getattr(employee, "contexts", []) if getattr(ctx, "is_default", False)), None)
        request.state.employee_context_id = default_context.id if default_context else None

    return employee