# backend/app/routes/admin/employee_management/attendance_routes.py

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.employee_management.attendance_controller import (
    AttendanceController,
)
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.schemas.employee_management.attendance_schema import (
    AttendanceHistoryResponse,
    AttendancePaginationResponse,
    TodayAttendanceResponse,
)


router = APIRouter(
    prefix="/employee-management/attendance",
    tags=["Employee Management - Attendance"],
)


# ============================================================================
# GET ATTENDANCE
# ============================================================================

@router.get(
    "",
    response_model=AttendancePaginationResponse,
)
def get_attendance(
    search: str | None = Query(
        default=None,
    ),

    employee_id: int | None = Query(
        default=None,
    ),

    from_date: date | None = Query(
        default=None,
    ),

    to_date: date | None = Query(
        default=None,
    ),

    status: str | None = Query(
        default=None,
    ),

    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=30,
        ge=1,
    ),

    db: Session = Depends(get_db),

    current_employee: Employee = Depends(
        get_current_employee,
    ),
):
    try:

        return AttendanceController.get_attendance(
            db=db,

            search=search,

            employee_id=employee_id,

            from_date=from_date,

            to_date=to_date,

            status=status,

            page=page,

            limit=limit,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================================
# GET ATTENDANCE FOR SELECTED DATE
# ============================================================================
#
# If date is not provided:
#
#     /employee-management/attendance/today
#
# returns today's attendance.
#
#
# If date is provided:
#
#     /employee-management/attendance/today?selected_date=2026-09-05
#
# returns attendance for 2026-09-05.
#
# ============================================================================

@router.get(
    "/today",
    response_model=list[TodayAttendanceResponse],
)
def get_today_attendance(
    selected_date: date | None = Query(
        default=None,
    ),

    db: Session = Depends(get_db),

    current_employee: Employee = Depends(
        get_current_employee,
    ),
):
    try:

        return AttendanceController.get_today_attendance(
            db=db,

            selected_date=selected_date,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================================
# GET EMPLOYEE ATTENDANCE HISTORY
# ============================================================================

@router.get(
    "/employee/{employee_id}/history",
    response_model=AttendanceHistoryResponse,
)
def get_employee_attendance_history(
    employee_id: int,

    from_date: date | None = Query(
        default=None,
    ),

    to_date: date | None = Query(
        default=None,
    ),

    db: Session = Depends(get_db),

    current_employee: Employee = Depends(
        get_current_employee,
    ),
):
    try:

        return AttendanceController.get_employee_history(
            db=db,

            employee_id=employee_id,

            from_date=from_date,

            to_date=to_date,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )