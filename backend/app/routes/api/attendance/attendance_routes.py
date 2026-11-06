# backend/app/routes/api/attendance/attendance_routes.py

from datetime import date

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.api_security import get_current_api_employee
from app.controllers.api.attendance.attendance_controller import (
    get_attendance_history_controller,
    lunch_in_controller,
    lunch_out_controller,
    punch_in_controller,
    punch_out_controller,
)
from app.models.employees import Employee
from app.schemas.api.attendance.attendance_schema import (
    AttendanceActionRequest,
    AttendanceHistoryPaginationResponse,
    AttendanceResponse,
)


router = APIRouter(
    prefix="/attendance",
    tags=["Android Attendance"],
)


# ------------------------------------------------------------------------
# PUNCH IN
# ------------------------------------------------------------------------

@router.post(
    "/punch-in",
    response_model=AttendanceResponse,
)
async def punch_in(
    image: UploadFile = File(...),
    latitude: float | None = Form(default=None),
    longitude: float | None = Form(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_api_employee),
):
    """
    Punch in the authenticated employee.

    Authentication:
        Access JWT through api_security.py

    Requirements:
        - Valid authenticated employee
        - Face image
        - GPS information
        - Face verification against registered
          FRONT, LEFT and RIGHT face embeddings
    """

    attendance_data = AttendanceActionRequest(
        latitude=latitude,
        longitude=longitude,
    )

    return await punch_in_controller(
        db=db,
        employee=employee,
        image=image,
        attendance_data=attendance_data,
    )


# ------------------------------------------------------------------------
# PUNCH OUT
# ------------------------------------------------------------------------

@router.post(
    "/punch-out",
    response_model=AttendanceResponse,
)
async def punch_out(
    image: UploadFile = File(...),
    latitude: float | None = Form(default=None),
    longitude: float | None = Form(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_api_employee),
):
    """
    Punch out the authenticated employee.

    Authentication:
        Access JWT through api_security.py

    Requirements:
        - Valid authenticated employee
        - Existing punch-in for today
        - Face image
        - GPS information
        - Face verification against registered
          FRONT, LEFT and RIGHT face embeddings
    """

    attendance_data = AttendanceActionRequest(
        latitude=latitude,
        longitude=longitude,
    )

    return await punch_out_controller(
        db=db,
        employee=employee,
        image=image,
        attendance_data=attendance_data,
    )


# ------------------------------------------------------------------------
# LUNCH OUT
# ------------------------------------------------------------------------

@router.post(
    "/lunch-out",
    response_model=AttendanceResponse,
)
async def lunch_out(
    attendance_data: AttendanceActionRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_api_employee),
):
    """
    Mark lunch-out for the authenticated employee.

    No face recognition is performed.

    Requirements:
        - Valid authenticated employee
        - Employee must have punched in today
        - Employee must not have punched out
        - Lunch-out must not already exist
    """

    return await lunch_out_controller(
        db=db,
        employee=employee,
        attendance_data=attendance_data,
    )


# ------------------------------------------------------------------------
# LUNCH IN
# ------------------------------------------------------------------------

@router.post(
    "/lunch-in",
    response_model=AttendanceResponse,
)
async def lunch_in(
    attendance_data: AttendanceActionRequest,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_api_employee),
):
    """
    Mark lunch-in for the authenticated employee.

    No face recognition is performed.

    Requirements:
        - Valid authenticated employee
        - Employee must have punched in today
        - Lunch-out must already exist
        - Lunch-in must not already exist
        - Employee must not have punched out
    """

    return await lunch_in_controller(
        db=db,
        employee=employee,
        attendance_data=attendance_data,
    )


# ------------------------------------------------------------------------
# ATTENDANCE HISTORY
# ------------------------------------------------------------------------

@router.get(
    "/history",
    response_model=AttendanceHistoryPaginationResponse,

)
async def get_attendance_history(
    month: int | None = Query(
        default=None,
        ge=1,
        le=12,
        description="Month (1-12). Defaults to current month if omitted.",
    ),
    year: int | None = Query(
        default=None,
        ge=2000,
        le=2100,
        description="Year (e.g. 2026). Defaults to current year.",
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Page number (1-indexed).",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Number of records per page.",
    ),
    start_date: date | None = Query(
        default=None,
        description="Optional start date filter (YYYY-MM-DD).",
    ),
    end_date: date | None = Query(
        default=None,
        description="Optional end date filter (YYYY-MM-DD).",
    ),
    status: str | None = Query(
        default=None,
        description="Filter by attendance status ('Present' or 'Absent').",
    ),
    work_mode: str | None = Query(
        default=None,
        description="Filter by work mode ('WFH' or 'Office').",
    ),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_api_employee),
):
    """
    Fetch paginated attendance history for the employee.

    - By default, fetches attendance for the current month and year.
    - If user specifies 'month', fetches for that month of the current year.
    - If user specifies 'month' and 'year', fetches for that month and year.
    - Returns each event's datetime (check_in, lunch_out, lunch_in, check_out),
      events list with status and formatted time, work mode (WFH / Office, is_wfh),
      working hours, and pagination metadata.
    """

    return await get_attendance_history_controller(
        db=db,
        employee=employee,
        month=month,
        year=year,
        page=page,
        limit=limit,
        start_date=start_date,
        end_date=end_date,
        status=status,
        work_mode=work_mode,
    )
