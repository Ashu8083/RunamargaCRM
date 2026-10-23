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