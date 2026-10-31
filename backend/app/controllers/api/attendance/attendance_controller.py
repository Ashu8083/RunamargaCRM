# backend/app/controllers/api/attendance/attendance_controller.py

from datetime import date
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.api.attendance.attendance_schema import (
    AttendanceActionRequest,
    AttendanceHistoryPaginationResponse,
    AttendanceResponse,
)
from app.services.api.attendance.attendance_service import (
    get_attendance_history,
    punch_in,
    punch_out,
    lunch_out,
    lunch_in,
)


async def punch_in_controller(
    db: Session,
    employee: Employee,
    image: UploadFile,
    attendance_data: AttendanceActionRequest,
) -> AttendanceResponse:
    """
    Controller for employee punch-in.

    Punch-in requires:
    - Authenticated employee
    - Face image
    - GPS information
    - Face verification against registered face profiles
    """

    if image is None:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "IMAGE_REQUIRED",
                "message": "Face image is required for punch in.",
            },
        )

    if not image.filename:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_IMAGE",
                "message": "Invalid face image file.",
            },
        )

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "EMPTY_IMAGE",
                "message": "Face image cannot be empty.",
            },
        )

    result = await punch_in(
        db=db,
        employee=employee,
        image_bytes=image_bytes,
        latitude=attendance_data.latitude,
        longitude=attendance_data.longitude,
    )

    return AttendanceResponse(**result)


async def punch_out_controller(
    db: Session,
    employee: Employee,
    image: UploadFile,
    attendance_data: AttendanceActionRequest,
) -> AttendanceResponse:
    """
    Controller for employee punch-out.

    Punch-out requires:
    - Authenticated employee
    - Face image
    - GPS information
    - Face verification against registered face profiles
    - Existing punch-in for today
    """

    if image is None:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "IMAGE_REQUIRED",
                "message": "Face image is required for punch out.",
            },
        )

    if not image.filename:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_IMAGE",
                "message": "Invalid face image file.",
            },
        )

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "EMPTY_IMAGE",
                "message": "Face image cannot be empty.",
            },
        )

    result = await punch_out(
        db=db,
        employee=employee,
        image_bytes=image_bytes,
        latitude=attendance_data.latitude,
        longitude=attendance_data.longitude,
    )

    return AttendanceResponse(**result)


async def lunch_out_controller(
    db: Session,
    employee: Employee,
    attendance_data: AttendanceActionRequest,
) -> AttendanceResponse:
    """
    Controller for employee lunch-out.

    Lunch-out does NOT require face recognition.
    The employee is identified using the authenticated JWT.
    """

    result = lunch_out(
        db=db,
        employee=employee,
        latitude=attendance_data.latitude,
        longitude=attendance_data.longitude,
    )

    return AttendanceResponse(**result)


async def lunch_in_controller(
    db: Session,
    employee: Employee,
    attendance_data: AttendanceActionRequest,
) -> AttendanceResponse:
    """
    Controller for employee lunch-in.

    Lunch-in does NOT require face recognition.
    The employee is identified using the authenticated JWT.
    """

    result = lunch_in(
        db=db,
        employee=employee,
        latitude=attendance_data.latitude,
        longitude=attendance_data.longitude,
    )

    return AttendanceResponse(**result)


async def get_attendance_history_controller(
    db: Session,
    employee: Employee,
    month: int | None = None,
    year: int | None = None,
    page: int = 1,
    limit: int = 10,
    start_date: date | None = None,
    end_date: date | None = None,
    status: str | None = None,
    work_mode: str | None = None,
) -> AttendanceHistoryPaginationResponse:
    """
    Controller for employee attendance history.

    - Authenticated employee fetches their own attendance history (ID from JWT token).
    - Admin use: call get_attendance_history() service directly with any employee_id.
    """

    result = get_attendance_history(
        db=db,
        employee_id=employee.id,
        month=month,
        year=year,
        page=page,
        limit=limit,
        start_date=start_date,
        end_date=end_date,
        status=status,
        work_mode=work_mode,
    )

    return AttendanceHistoryPaginationResponse(**result)
