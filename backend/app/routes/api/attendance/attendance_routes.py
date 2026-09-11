# backend/app/routes/api/attendance/attendance_routes.py

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.api_security import get_current_api_employee
from app.controllers.api.attendance.attendance_controller import (
    lunch_in_controller,
    lunch_out_controller,
    punch_in_controller,
    punch_out_controller,
)
from app.models.employees import Employee
from app.schemas.api.attendance.attendance_schema import (
    AttendanceActionRequest,
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
    accuracy: float | None = Form(default=None),
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
        accuracy=accuracy,
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
    accuracy: float | None = Form(default=None),
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
        accuracy=accuracy,
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