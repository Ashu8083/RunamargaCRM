# backend/app/controllers/attendance_controller.py

from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employees import Employee


def my_attendance(
    db_session: Session,
    employee: Employee,
):
    attendance_records = (
        db_session.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.deleted_at.is_(None),
        )
        .order_by(Attendance.date.desc())
        .all()
    )

    return {
        "success": True,
        "data": attendance_records,
    }