# backend/app/schemas/api/attendance/attendance_schema.py

from datetime import date, datetime

from pydantic import BaseModel, Field


class AttendanceActionRequest(BaseModel):
    """
    Request data used for lunch in and lunch out.

    The employee is identified from the authenticated JWT.
    """

    latitude: float | None = Field(
        default=None,
        description="Current device latitude.",
    )

    longitude: float | None = Field(
        default=None,
        description="Current device longitude.",
    )


class AttendanceResponse(BaseModel):
    """
    Common response returned by all attendance APIs.

    Used by:
    - Punch In
    - Punch Out
    - Lunch Out
    - Lunch In
    """

    message: str

    attendance_id: int

    employee_id: int

    date: date

    check_in: datetime | None = None

    lunch_out: datetime | None = None

    lunch_in: datetime | None = None

    check_out: datetime | None = None

    is_wfh: bool

    face_status: str | None = None

    face_similarity: float | None = None

    matched_capture_type: str | None = None


# ------------------------------------------------------------------------
# ATTENDANCE HISTORY SCHEMAS
# ------------------------------------------------------------------------

class AttendanceHistoryRecord(BaseModel):
    """
    Formatted attendance history record for an employee.
    """

    id: int

    employee_id: int

    date: date

    work_mode: str = Field(
        description="Work mode: 'WFH' or 'Office'",
    )

    checkIn: str | None = Field(
        default=None,
        description="Punch in time (e.g. '11:46 AM')",
    )

    checkOut: str | None = Field(
        default=None,
        description="Punch out time (e.g. '06:00 PM')",
    )

    lunchIn: str | None = Field(
        default=None,
        description="Lunch in time (e.g. '01:45 PM')",
    )

    lunchOut: str | None = Field(
        default=None,
        description="Lunch out time (e.g. '01:00 PM')",
    )

    checkInImage: str | None = Field(
        default=None,
        description="Check-in image URL (e.g. '/uploads/attendance/...')",
    )

    checkOutImage: str | None = Field(
        default=None,
        description="Check-out image URL (e.g. '/uploads/attendance/...')",
    )



class AttendanceHistoryPaginationResponse(BaseModel):
    """
    Paginated response for attendance history.
    """

    total: int

    page: int

    limit: int

    total_pages: int

    month: int | None = None

    year: int

    data: list[AttendanceHistoryRecord]
