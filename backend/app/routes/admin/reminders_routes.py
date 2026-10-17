# backend/app/routes/admin/reminders.routes.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.api_security import get_current_api_employee
from app.models.employees import Employee
from app.controllers.reminders_controller import (
    create_reminder,
    get_reminders,
    get_reminders_management,
    complete_reminder,
    cancel_reminder,
)
from app.schemas.reminders_schema import ReminderCreateSchema


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"],
)


# ============================================================
# CREATE REMINDER
# ============================================================

@router.post("")
def create_reminder_route(
    data: ReminderCreateSchema,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(
        get_current_api_employee
    ),
):
    return create_reminder(
        data=data,
        db=db,
        current_employee=current_employee,
    )


# ============================================================
# GET REMINDERS
# ============================================================
#
# EXISTING API
#
# IMPORTANT:
# Do not change this endpoint's behaviour.
# The reminder drawer depends on it.
# ============================================================

@router.get("")
def get_reminders_route(
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(
        get_current_api_employee
    ),
):
    return get_reminders(
        db=db,
        current_employee=current_employee,
    )


# ============================================================
# NEW - REMINDERS MANAGEMENT PAGE
# ============================================================
#
# Dedicated API for:
#
#   - Server-side pagination
#   - Server-side search
#   - Employee filter
#   - Status filter
#
# Example:
#
# GET /reminders/management
#
# GET /reminders/management?page=1&page_size=25
#
# GET /reminders/management?search=Rahul
#
# GET /reminders/management?employee_id=59
#
# GET /reminders/management?status=pending
#
# GET /reminders/management?page=1&page_size=25&search=31446
#
# ============================================================

@router.get("/management")
def get_reminders_management_route(
    page: int = Query(
        default=1,
        ge=1,
        description="Page number",
    ),
    page_size: int = Query(
        default=25,
        ge=1,
        le=100,
        description="Number of reminders per page",
    ),
    search: str | None = Query(
        default=None,
        max_length=100,
        description=(
            "Search application ID, application number, "
            "application name, application phone, "
            "employee name, employee code or employee phone"
        ),
    ),
    employee_id: int | None = Query(
        default=None,
        gt=0,
        description="Filter reminders by employee ID",
    ),
    status: str | None = Query(
        default=None,
        description=(
            "Filter by pending, completed or cancelled"
        ),
    ),
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(
        get_current_api_employee
    ),
):
    return get_reminders_management(
        db=db,
        current_employee=current_employee,
        page=page,
        page_size=page_size,
        search=search,
        employee_id=employee_id,
        status=status,
    )


# ============================================================
# UPDATE REMINDER STATUS
# ============================================================

@router.patch("/{reminder_id}")
def update_reminder_status_route(
    reminder_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_employee: Employee = Depends(
        get_current_api_employee
    ),
):
    status = data.get("status")

    if status == "completed":
        return complete_reminder(
            reminder_id=reminder_id,
            db=db,
            current_employee=current_employee,
        )

    if status == "cancelled":
        return cancel_reminder(
            reminder_id=reminder_id,
            db=db,
            current_employee=current_employee,
        )

    from fastapi import HTTPException

    raise HTTPException(
        status_code=422,
        detail=(
            "Status must be "
            "'completed' or 'cancelled'"
        ),
    )