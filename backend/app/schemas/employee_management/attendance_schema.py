# backend/app/schemas/employee_management/attendance_schema.py

from datetime import date

from pydantic import BaseModel, Field


# ============================================================================
# ATTENDANCE LOCATION
# ============================================================================

class AttendanceLocation(BaseModel):
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    accuracy: float | None = None
    isOffice: bool = False


# ============================================================================
# ATTENDANCE PUNCH
# ============================================================================

class AttendancePunch(BaseModel):
    time: str | None = None
    location: AttendanceLocation | None = None
    image: str | None = None
    confidence: float | None = None


# ============================================================================
# ATTENDANCE LIST RESPONSE
# ============================================================================

class AttendanceListResponse(BaseModel):
    id: int
    employeeId: int
    name: str
    email: str | None = None
    gender: str | None = None
    profileImage: str | None = None
    date: date
    checkIn: AttendancePunch | None = None
    checkOut: AttendancePunch | None = None
    status: str


# ============================================================================
# ATTENDANCE PAGINATION RESPONSE
# ============================================================================

class AttendancePaginationResponse(BaseModel):
    items: list[AttendanceListResponse]

    total: int

    page: int = Field(
        ...,
        ge=1,
    )

    limit: int = Field(
        ...,
        ge=1,
    )

    totalPages: int = Field(
        ...,
        ge=0,
    )


# ============================================================================
# ATTENDANCE HISTORY DAY
# ============================================================================

class AttendanceHistoryDay(BaseModel):
    id: int | None = None
    date: date
    day: int
    month: str
    status: str
    checkIn: AttendancePunch | None = None
    checkOut: AttendancePunch | None = None


# ============================================================================
# ATTENDANCE HISTORY RESPONSE
# ============================================================================

class AttendanceHistoryResponse(BaseModel):
    employeeId: int
    name: str
    email: str | None = None
    gender: str | None = None
    profileImage: str | None = None

    currentStatus: str

    currentCheckIn: AttendancePunch | None = None
    currentCheckOut: AttendancePunch | None = None

    history: list[AttendanceHistoryDay]


# ============================================================================
# SELECTED-DATE ATTENDANCE RESPONSE
# ============================================================================
#
# This response is used by the "Today's Attendance" modal.
#
# The endpoint will later accept any selected date.
# So if the user selects:
#
# 2026-09-11
#
# the response date will be 2026-09-11.
#
# If the user selects:
#
# 2026-09-05
#
# the same endpoint will return attendance for 2026-09-05.
#
# Existing functionality is preserved.
# ============================================================================

class TodayAttendanceResponse(BaseModel):
    id: int | None = None

    employeeId: int

    name: str

    email: str | None = None

    gender: str | None = None

    profileImage: str | None = None

    date: date

    punchIn: str | None = None

    lunchOut: str | None = None

    lunchIn: str | None = None

    punchOut: str | None = None

    status: str