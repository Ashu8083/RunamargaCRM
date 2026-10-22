# backend/app/controllers/attendance_controller.py

from datetime import date, datetime, timezone, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employees import Employee
from app.models.leave_managements import LeaveManagement
from app.models.holidays import Holiday
from app.models.employee_details import EmployeeDetails


# =============================================================
# ATTENDANCE HELPERS
# =============================================================

def _get_active_holidays(
    db_session: Session,
    start_date: date,
    end_date: date,
) -> list[Holiday]:
    """Return active company holidays within the date range."""

    if end_date < start_date:
        return []

    return (
        db_session.query(Holiday)
        .filter(
            Holiday.is_active.is_(True),
            Holiday.date >= start_date,
            Holiday.date <= end_date,
        )
        .order_by(Holiday.date)
        .all()
    )


def _get_holiday_dates(
    db_session: Session,
    start_date: date,
    end_date: date,
) -> set[date]:
    """Return distinct dates of active company holidays."""

    return {
        holiday.date
        for holiday in _get_active_holidays(
            db_session,
            start_date,
            end_date,
        )
    }


def _calculate_worked_hours(record: Attendance) -> float:
    """Calculate worked hours, deducting lunch when both times exist."""

    if record.check_in is None or record.check_out is None:
        return 0.0

    duration = record.check_out - record.check_in

    if record.lunch_out is not None and record.lunch_in is not None:
        lunch_duration = record.lunch_in - record.lunch_out

        if lunch_duration.total_seconds() > 0:
            duration -= lunch_duration

    return round(max(0, duration.total_seconds()) / 3600, 2)


def _classify_attendance(
    record: Attendance | None,
) -> tuple[str, str, float]:
    """Return (status, day_type, worked_hours)."""

    if (
        record is None
        or record.check_in is None
        or record.check_out is None
    ):
        return "Absent", "Absent", 0.0

    worked_hours = _calculate_worked_hours(record)

    if worked_hours <= 0:
        return "Absent", "Absent", 0.0

    if worked_hours > 5:
        return "Present", "Full Day", worked_hours

    return "Present", "Half Day", worked_hours


def _get_month_bounds(
    month: str | None,
) -> tuple[date, date, date]:
    """
    Return (month_start, month_end, report_end).

    Historical months cover the full month.
    The current month reports through today.
    Future months are rejected.
    """

    today = date.today()

    if month is None:
        selected_month = today.replace(day=1)
    else:
        try:
            selected_month = datetime.strptime(
                month,
                "%Y-%m",
            ).date()

            if selected_month.strftime("%Y-%m") != month:
                raise ValueError("Invalid month format")

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid month. Use YYYY-MM format.",
            )

    month_start = selected_month.replace(day=1)

    if month_start > today:
        raise HTTPException(
            status_code=400,
            detail="Future months are not available.",
        )

    if month_start.month == 12:
        next_month_start = date(
            month_start.year + 1,
            1,
            1,
        )
    else:
        next_month_start = date(
            month_start.year,
            month_start.month + 1,
            1,
        )

    month_end = next_month_start - timedelta(days=1)
    report_end = min(month_end, today)

    return month_start, month_end, report_end


# =============================================================
# MY ATTENDANCE
# GET /attendance?month=YYYY-MM
# =============================================================

def my_attendance(
    db_session: Session,
    employee: Employee,
    month: str | None = None,
):
    """
    Return attendance, daily/monthly statistics, overlapping leave
    requests, and the employee's current paid-leave balance.

    Working days = calendar days minus distinct active holidays.
    Sundays are not automatically excluded.
    """

    month_start, month_end, report_end = _get_month_bounds(month)

    attendance_records = (
        db_session.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.deleted_at.is_(None),
            Attendance.date >= month_start,
            Attendance.date <= report_end,
        )
        .order_by(Attendance.date.desc())
        .all()
    )

    attendance_by_date = {
        record.date: record
        for record in attendance_records
    }

    # Count holidays across the full month for monthly summary.
    all_month_holiday_dates = _get_holiday_dates(
        db_session,
        month_start,
        month_end,
    )

    # Daily attendance only needs holidays through report_end.
    holidays = _get_active_holidays(
        db_session,
        month_start,
        report_end,
    )

    holidays_by_date = {
        holiday.date: holiday
        for holiday in holidays
    }

    total_calendar_days = (month_end - month_start).days + 1

    working_days = max(
        0,
        total_calendar_days - len(all_month_holiday_dates),
    )

    elapsed_holiday_dates = _get_holiday_dates(
        db_session,
        month_start,
        report_end,
    )

    elapsed_calendar_days = (report_end - month_start).days + 1

    elapsed_working_days = max(
        0,
        elapsed_calendar_days - len(elapsed_holiday_dates),
    )

    daily_summary = []

    present_days = 0
    absent_days = 0
    half_days = 0
    full_days = 0
    total_worked_hours = 0.0

    current_date = month_start

    while current_date <= report_end:
        record = attendance_by_date.get(current_date)
        holiday = holidays_by_date.get(current_date)

        if holiday is not None:
            status = "Holiday"
            day_type = "Holiday"
            worked_hours = 0.0
            holiday_name = holiday.name
        else:
            holiday_name = None

            status, day_type, worked_hours = _classify_attendance(
                record
            )

            if status == "Present":
                present_days += 1
                total_worked_hours += worked_hours

                if day_type == "Half Day":
                    half_days += 1
                elif day_type == "Full Day":
                    full_days += 1
            else:
                absent_days += 1

        daily_summary.append(
            {
                "date": current_date,
                "status": status,
                "day_type": day_type,
                "worked_hours": worked_hours,
                "check_in": record.check_in if record else None,
                "check_out": record.check_out if record else None,
                "is_wfh": record.is_wfh if record else False,
                "holiday_name": holiday_name,
            }
        )

        current_date += timedelta(days=1)

    # Average hours per elapsed working day, including absences.
    average_hours = (
        round(total_worked_hours / elapsed_working_days, 2)
        if elapsed_working_days > 0
        else 0.0
    )

    average_total_minutes = round(average_hours * 60)

    average_hours_formatted = (
        f"{average_total_minutes // 60}h "
        f"{average_total_minutes % 60}m"
    )

    monthly_summary = {
        "month": month_start.strftime("%Y-%m"),
        "present_days": present_days,
        "absent_days": absent_days,
        "working_days": working_days,
        "elapsed_working_days": elapsed_working_days,
        "half_days": half_days,
        "full_days": full_days,
        "total_worked_hours": round(total_worked_hours, 2),
        "average_hours": average_hours,
        "average_hours_formatted": average_hours_formatted,
    }

    # Return all leave requests overlapping the selected month.
    # This includes Pending, Approved, Rejected, and Cancelled.
    leave_data = (
        db_session.query(LeaveManagement)
        .filter(
            LeaveManagement.applied_by == employee.id,
            LeaveManagement.from_date <= month_end,
            LeaveManagement.to_date >= month_start,
        )
        .order_by(
            LeaveManagement.from_date.asc(),
            LeaveManagement.created_at.desc(),
        )
        .all()
    )

    # The balance is current even when viewing a historical month.
    balance = _get_leave_balance(db_session, employee)

    leave_balance = {
        "monthly_accrual": 1,
        "total_accrued": balance["accrued"],
        "approved_days": balance["approved_days"],
        "pending_days": balance["pending_days"],
        "available_days": balance["available"],
    }

    return {
        "success": True,
        "selected_month": month_start.strftime("%Y-%m"),
        "data": attendance_records,
        "daily_summary": daily_summary,
        "monthly_summary": monthly_summary,
        "leave_data": leave_data,
        "leave_balance": leave_balance,
    }


# =============================================================
# LEAVE CALCULATION HELPERS
# =============================================================

def _month_number(value: date) -> int:
    """Convert a date to a continuous calendar-month number."""

    return value.year * 12 + value.month


def _get_joining_date(
    db_session: Session,
    employee: Employee,
) -> date:
    """
    Use employee_details.joining_date when available.
    Fall back to employee.created_at.
    """

    details = (
        db_session.query(EmployeeDetails)
        .filter(EmployeeDetails.id == employee.id)
        .first()
    )

    joining_date = getattr(details, "joining_date", None)

    if joining_date:
        return (
            joining_date.date()
            if isinstance(joining_date, datetime)
            else joining_date
        )

    created_at = getattr(employee, "created_at", None)

    if created_at:
        return (
            created_at.date()
            if isinstance(created_at, datetime)
            else created_at
        )

    raise HTTPException(
        status_code=400,
        detail="Employee joining date is not available",
    )


def _get_monthly_entitlement(
    db_session: Session,
    employee: Employee,
    as_of: date | None = None,
) -> int:
    """
    Accrue one paid leave per calendar month, starting in the
    employee's joining month. Unused entitlement carries forward.
    """

    as_of = as_of or date.today()
    joining_date = _get_joining_date(db_session, employee)

    if joining_date > as_of:
        return 0

    return (
        _month_number(as_of)
        - _month_number(joining_date)
        + 1
    )


def _get_eligible_working_days(
    db_session: Session,
    employee_id: int,
    start_date: date,
    end_date: date,
    exclude_attended_days: bool = False,
) -> list[date]:
    """
    Return dates excluding active holidays.

    If exclude_attended_days=True, also exclude dates with
    completed check-in and check-out.
    Sundays are not excluded unless they are active holidays.
    """

    if end_date < start_date:
        return []

    holiday_dates = _get_holiday_dates(
        db_session,
        start_date,
        end_date,
    )

    completed_attendance_dates = set()

    if exclude_attended_days:
        rows = (
            db_session.query(
                Attendance.date,
                Attendance.check_in,
                Attendance.check_out,
            )
            .filter(
                Attendance.employee_id == employee_id,
                Attendance.deleted_at.is_(None),
                Attendance.date >= start_date,
                Attendance.date <= end_date,
            )
            .all()
        )

        completed_attendance_dates = {
            row.date
            for row in rows
            if row.check_in is not None
            and row.check_out is not None
        }

    eligible_days = []
    current_date = start_date

    while current_date <= end_date:
        if current_date not in holiday_dates:
            if not (
                exclude_attended_days
                and current_date in completed_attendance_dates
            ):
                eligible_days.append(current_date)

        current_date += timedelta(days=1)

    return eligible_days


def _count_leave_days(
    db_session: Session,
    employee_id: int,
    leave: LeaveManagement,
    as_of: date | None = None,
) -> int:
    """
    Count elapsed eligible days for approved Full Day Leave only.

    Future leave dates do not count as leave already taken.
    Active holidays are excluded.
    """

    if leave.leave_type != "Full Day Leave":
        return 0

    as_of = as_of or date.today()
    effective_end_date = min(leave.to_date, as_of)

    if effective_end_date < leave.from_date:
        return 0

    return len(
        _get_eligible_working_days(
            db_session,
            employee_id,
            leave.from_date,
            effective_end_date,
        )
    )


def _get_leave_balance(
    db_session: Session,
    employee: Employee,
    exclude_leave_id: int | None = None,
) -> dict:
    """
    Available paid leave =
        accrued entitlement
        - approved Full Day Leave days already elapsed.

    Pending, rejected, and cancelled requests do not reduce
    available leave. Attendance absences alone do not consume
    paid leave. Unused entitlement carries forward.
    """

    today = date.today()

    joining_date = _get_joining_date(db_session, employee)

    accrued = _get_monthly_entitlement(
        db_session,
        employee,
        today,
    )

    # Count only approved leave requests. Do not deduct pending,
    # rejected, or cancelled requests.
    approved_requests = (
        db_session.query(LeaveManagement)
        .filter(
            LeaveManagement.applied_by == employee.id,
            LeaveManagement.status == "Approved",
        )
        .all()
    )

    approved_days = 0

    for leave in approved_requests:
        if (
            exclude_leave_id is not None
            and leave.id == exclude_leave_id
        ):
            continue

        # Do not deduct leave dates that precede employment.
        effective_start_date = max(
            leave.from_date,
            joining_date,
        )

        if effective_start_date > today:
            continue

        # _count_leave_days clips the end date to today.
        # Use a temporary date range for any leave beginning
        # before the employee's joining date.
        if effective_start_date == leave.from_date:
            approved_days += _count_leave_days(
                db_session,
                employee.id,
                leave,
                today,
            )
        elif leave.leave_type == "Full Day Leave":
            effective_end_date = min(leave.to_date, today)

            if effective_start_date <= effective_end_date:
                approved_days += len(
                    _get_eligible_working_days(
                        db_session,
                        employee.id,
                        effective_start_date,
                        effective_end_date,
                    )
                )

    # Pending days are returned for display only.
    pending_requests = (
        db_session.query(LeaveManagement)
        .filter(
            LeaveManagement.applied_by == employee.id,
            LeaveManagement.status == "Pending",
        )
        .all()
    )

    pending_days = sum(
        _count_leave_days(
            db_session,
            employee.id,
            leave,
        )
        for leave in pending_requests
    )

    available = max(0, accrued - approved_days)

    return {
        "accrued": accrued,
        "approved_days": approved_days,
        "pending_days": pending_days,
        "available": available,
    }


def _validate_leave_request(
    db_session: Session,
    employee: Employee,
    data: dict,
    exclude_leave_id: int | None = None,
) -> int:
    """Validate leave dates, attendance conflicts, and balance."""

    from_date = data["from_date"]
    to_date = data["to_date"]
    leave_type = data["leave_type"]
    reason = data["reason"]

    if to_date < from_date:
        raise HTTPException(
            status_code=400,
            detail="to_date cannot be before from_date",
        )

    if not reason or not reason.strip():
        raise HTTPException(
            status_code=400,
            detail="Reason cannot be empty",
        )

    eligible_days = _get_eligible_working_days(
        db_session,
        employee.id,
        from_date,
        to_date,
        exclude_attended_days=(leave_type == "Full Day Leave"),
    )

    if not eligible_days:
        raise HTTPException(
            status_code=400,
            detail=(
                "The selected dates contain no eligible "
                "working days. Check holidays and attendance."
            ),
        )

    if leave_type == "Full Day Leave":
        attendance_records = (
            db_session.query(
                Attendance.date,
                Attendance.check_in,
                Attendance.check_out,
            )
            .filter(
                Attendance.employee_id == employee.id,
                Attendance.deleted_at.is_(None),
                Attendance.date >= from_date,
                Attendance.date <= to_date,
            )
            .all()
        )

        holiday_dates = _get_holiday_dates(
            db_session,
            from_date,
            to_date,
        )

        conflicting_dates = [
            row.date
            for row in attendance_records
            if row.check_in is not None
            and row.check_out is not None
            and row.date not in holiday_dates
        ]

        if conflicting_dates:
            formatted_dates = ", ".join(
                day.isoformat()
                for day in sorted(set(conflicting_dates))
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    "Completed attendance already exists "
                    f"for these dates: {formatted_dates}"
                ),
            )

        balance = _get_leave_balance(
            db_session,
            employee,
            exclude_leave_id=exclude_leave_id,
        )

        requested_days = len(eligible_days)

        if requested_days > balance["available"]:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Insufficient leave balance. "
                    f"Available: {balance['available']} day(s); "
                    f"requested: {requested_days} day(s)."
                ),
            )

        return requested_days

    # Other supported leave types do not consume paid leave.
    return len(eligible_days)


# =============================================================
# APPLY FOR LEAVE
# =============================================================

def apply_leave(
    db_session: Session,
    employee: Employee,
    data: dict,
):
    try:
        _validate_leave_request(
            db_session,
            employee,
            data,
        )

        leave = LeaveManagement(
            applied_by=employee.id,
            from_date=data["from_date"],
            to_date=data["to_date"],
            leave_type=data["leave_type"],
            reason=data["reason"].strip(),
            status="Pending",
        )

        db_session.add(leave)
        db_session.commit()
        db_session.refresh(leave)

        return {
            "success": True,
            "message": "Leave request submitted successfully.",
            "data": leave,
        }

    except Exception:
        db_session.rollback()
        raise


# =============================================================
# VIEW MY LEAVE REQUESTS
# =============================================================

def view_leave(
    db_session: Session,
    employee: Employee,
):
    leave_records = (
        db_session.query(LeaveManagement)
        .filter(
            LeaveManagement.applied_by == employee.id,
        )
        .order_by(LeaveManagement.created_at.desc())
        .all()
    )

    balance = _get_leave_balance(
        db_session,
        employee,
    )

    return {
        "success": True,
        "data": leave_records,
        "leave_balance": {
            "monthly_accrual": 1,
            "total_accrued": balance["accrued"],
            "approved_days": balance["approved_days"],
            "pending_days": balance["pending_days"],
            "available_days": balance["available"],
        },
    }


# =============================================================
# UPDATE PENDING LEAVE
# =============================================================

def update_leave(
    db_session: Session,
    employee: Employee,
    leave_id: int,
    data: dict,
):
    try:
        leave = (
            db_session.query(LeaveManagement)
            .filter(
                LeaveManagement.id == leave_id,
                LeaveManagement.applied_by == employee.id,
            )
            .with_for_update()
            .first()
        )

        if not leave:
            raise HTTPException(
                status_code=404,
                detail="Leave request not found",
            )

        if leave.status != "Pending":
            raise HTTPException(
                status_code=400,
                detail="Only pending leave requests can be updated",
            )

        _validate_leave_request(
            db_session,
            employee,
            data,
            exclude_leave_id=leave.id,
        )

        leave.from_date = data["from_date"]
        leave.to_date = data["to_date"]
        leave.leave_type = data["leave_type"]
        leave.reason = data["reason"].strip()

        db_session.commit()
        db_session.refresh(leave)

        return {
            "success": True,
            "message": "Leave request updated successfully.",
            "data": leave,
        }

    except Exception:
        db_session.rollback()
        raise


# =============================================================
# CANCEL PENDING LEAVE
# =============================================================

def cancel_leave(
    db_session: Session,
    employee: Employee,
    leave_id: int,
):
    try:
        leave = (
            db_session.query(LeaveManagement)
            .filter(
                LeaveManagement.id == leave_id,
                LeaveManagement.applied_by == employee.id,
            )
            .with_for_update()
            .first()
        )

        if not leave:
            raise HTTPException(
                status_code=404,
                detail="Leave request not found",
            )

        if leave.status != "Pending":
            raise HTTPException(
                status_code=400,
                detail="Only pending leave requests can be cancelled",
            )

        leave.status = "Cancelled"
        leave.reviewed_at = datetime.now(timezone.utc)
        leave.review_remarks = "Cancelled by employee"

        db_session.commit()
        db_session.refresh(leave)

        return {
            "success": True,
            "message": "Leave request cancelled successfully.",
            "data": leave,
        }

    except Exception:
        db_session.rollback()
        raise