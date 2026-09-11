# backend/app/controllers/employee_management/attendance_controller.py

from datetime import date

from sqlalchemy.orm import Session

from app.schemas.employee_management.attendance_schema import (
    AttendanceHistoryResponse,
    AttendancePaginationResponse,
    TodayAttendanceResponse,
)
from app.services.employee_management.attendance_service import AttendanceService


class AttendanceController:

    # =========================================================================
    # GET ATTENDANCE
    # =========================================================================

    @staticmethod
    def get_attendance(
        db: Session,
        search: str | None = None,
        employee_id: int | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
        status: str | None = None,
        page: int = 1,
        limit: int = 30,
    ) -> AttendancePaginationResponse:
        return AttendanceService.get_attendance(
            db=db,
            search=search,
            employee_id=employee_id,
            from_date=from_date,
            to_date=to_date,
            status=status,
            page=page,
            limit=limit,
        )


    # =========================================================================
    # GET EMPLOYEE HISTORY
    # =========================================================================

    @staticmethod
    def get_employee_history(
        db: Session,
        employee_id: int,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> AttendanceHistoryResponse:
        return AttendanceService.get_employee_history(
            db=db,
            employee_id=employee_id,
            from_date=from_date,
            to_date=to_date,
        )


    # =========================================================================
    # GET ATTENDANCE FOR SELECTED DATE
    # =========================================================================

    @staticmethod
    def get_today_attendance(
        db: Session,
        selected_date: date | None = None,
    ) -> list[TodayAttendanceResponse]:
        return AttendanceService.get_today_attendance(
            db=db,
            selected_date=selected_date,
        )