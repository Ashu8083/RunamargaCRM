from datetime import date, datetime
from math import ceil

from sqlalchemy import String, cast, or_
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employees import Employee


class AttendanceService:

    # =========================================================================
    # FORMAT TIME
    # =========================================================================

    @staticmethod
    def _format_time(value):
        if not value:
            return None

        if isinstance(value, datetime):
            return value.strftime("%I:%M %p")

        return str(value)


    # =========================================================================
    # FORMAT DATETIME
    # =========================================================================

    @staticmethod
    def _format_datetime(value):
        if not value:
            return None

        if isinstance(value, datetime):
            return value.isoformat()

        return str(value)


    # =========================================================================
    # STATUS
    # =========================================================================

    @staticmethod
    def _get_status(attendance, employee):
        """
        Attendance status is based only on whether the employee
        has punched in.

        Punched in  -> Present
        Not punched -> Absent
        """

        if not attendance or not attendance.check_in:
            return "Absent"

        return "Present"


    # =========================================================================
    # PROFILE DATA
    # =========================================================================

    @staticmethod
    def _get_profile_data(employee):
        gender = None
        profile_image = None

        if employee.details:
            gender = getattr(
                employee.details,
                "gender",
                None,
            )

            profile_image = getattr(
                employee.details,
                "profile_image",
                None,
            )

        return gender, profile_image


    # =========================================================================
    # BUILD PUNCH DATA
    # =========================================================================

    @staticmethod
    def _build_punch_data(
        punch_time,
        latitude=None,
        longitude=None,
        accuracy=None,
        image=None,
        confidence=None,
    ):
        if not punch_time:
            return None

        location = {
            "address": None,
            "latitude": latitude,
            "longitude": longitude,
            "accuracy": accuracy,
            "isOffice": False,
        }

        return {
            "time": AttendanceService._format_time(
                punch_time
            ),
            "location": location,
            "image": image,
            "confidence": confidence,
        }


    # =========================================================================
    # BUILD ATTENDANCE RESPONSE
    # =========================================================================

    @staticmethod
    def _build_attendance_response(
        attendance,
        employee,
    ):
        gender, profile_image = (
            AttendanceService._get_profile_data(
                employee
            )
        )

        return {
            "id": attendance.id,

            "employeeId": employee.id,

            "name": employee.name,

            "email": employee.email,

            "gender": gender,

            "profileImage": profile_image,

            "date": attendance.date,

            "checkIn": AttendanceService._build_punch_data(
                punch_time=attendance.check_in,
                latitude=attendance.check_in_latitude,
                longitude=attendance.check_in_longitude,
                accuracy=attendance.check_in_accuracy,
                image=attendance.check_in_image,
                confidence=attendance.check_in_confidence,
            ),

            "checkOut": AttendanceService._build_punch_data(
                punch_time=attendance.check_out,
                latitude=attendance.check_out_latitude,
                longitude=attendance.check_out_longitude,
                accuracy=attendance.check_out_accuracy,
                image=attendance.check_out_image,
                confidence=attendance.check_out_confidence,
            ),

            "status": AttendanceService._get_status(
                attendance,
                employee,
            ),
        }


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
    ):
        # ---------------------------------------------------------------------
        # VALIDATE PAGINATION
        # ---------------------------------------------------------------------

        if page < 1:
            raise ValueError(
                "Page must be greater than or equal to 1."
            )

        if limit < 1:
            raise ValueError(
                "Limit must be greater than or equal to 1."
            )


        # ---------------------------------------------------------------------
        # VALIDATE DATE RANGE
        # ---------------------------------------------------------------------

        if (
            from_date is not None
            and to_date is not None
            and from_date > to_date
        ):
            raise ValueError(
                "From date cannot be greater than to date."
            )


        # ---------------------------------------------------------------------
        # BASE QUERY
        # ---------------------------------------------------------------------
        #
        # IMPORTANT:
        #
        # Search and filters are applied to the DATABASE query itself.
        #
        # We do NOT fetch one page and then filter it in Python.
        #
        # The flow is:
        #
        # DATABASE
        #     ↓
        # SEARCH
        #     ↓
        # FILTERS
        #     ↓
        # COUNT
        #     ↓
        # PAGINATION
        #     ↓
        # CURRENT PAGE
        #
        # ---------------------------------------------------------------------

        query = (
            db.query(
                Attendance,
                Employee,
            )
            .join(
                Employee,
                Employee.id == Attendance.employee_id,
            )
            .filter(
                Employee.deleted_at.is_(None),
                Attendance.deleted_at.is_(None),
            )
        )


        # ---------------------------------------------------------------------
        # EMPLOYEE FILTER
        # ---------------------------------------------------------------------

        if employee_id is not None:
            query = query.filter(
                Attendance.employee_id == employee_id,
            )


        # ---------------------------------------------------------------------
        # DATE FILTER - FROM
        # ---------------------------------------------------------------------

        if from_date is not None:
            query = query.filter(
                Attendance.date >= from_date,
            )


        # ---------------------------------------------------------------------
        # DATE FILTER - TO
        # ---------------------------------------------------------------------

        if to_date is not None:
            query = query.filter(
                Attendance.date <= to_date,
            )


        # ---------------------------------------------------------------------
        # SEARCH FULL DATABASE
        # ---------------------------------------------------------------------
        #
        # Search fields:
        #
        #   Employee name
        #   Employee email
        #   Employee ID
        #   Attendance employee ID
        #   Attendance date
        #
        # Example:
        #
        # search = "sharath"
        #
        # searches Employee.name / Employee.email
        #
        #
        # search = "123"
        #
        # searches employee ID as well.
        #
        #
        # search = "2026-09-11"
        #
        # searches attendance date.
        #
        # ---------------------------------------------------------------------

        if search:
            search_value = search.strip()

            if search_value:

                search_pattern = (
                    f"%{search_value}%"
                )

                query = query.filter(
                    or_(
                        Employee.name.ilike(
                            search_pattern
                        ),

                        Employee.email.ilike(
                            search_pattern
                        ),

                        cast(
                            Employee.id,
                            String,
                        ).ilike(
                            search_pattern
                        ),

                        cast(
                            Attendance.employee_id,
                            String,
                        ).ilike(
                            search_pattern
                        ),

                        cast(
                            Attendance.date,
                            String,
                        ).ilike(
                            search_pattern
                        ),
                    )
                )


        # ---------------------------------------------------------------------
        # STATUS FILTER
        # ---------------------------------------------------------------------
        #
        # Only:
        #
        #   Present
        #   Absent
        #
        # are supported.
        #
        # Present = check_in exists
        # Absent  = check_in does not exist
        #
        # ---------------------------------------------------------------------

        if status:

            normalized_status = (
                status.strip().lower()
            )

            if normalized_status == "present":

                query = query.filter(
                    Attendance.check_in.is_not(None)
                )

            elif normalized_status == "absent":

                query = query.filter(
                    Attendance.check_in.is_(None)
                )

            elif normalized_status in {
                "all",
                "all status",
            }:

                pass

            else:

                raise ValueError(
                    "Status must be Present or Absent."
                )


        # ---------------------------------------------------------------------
        # TOTAL COUNT
        # ---------------------------------------------------------------------
        #
        # Count happens AFTER search + filters.
        #
        # Therefore total represents the complete number of matching
        # database records, not just the current page.
        #
        # ---------------------------------------------------------------------

        total = query.count()


        # ---------------------------------------------------------------------
        # TOTAL PAGES
        # ---------------------------------------------------------------------

        total_pages = (
            ceil(total / limit)
            if total > 0
            else 0
        )


        # ---------------------------------------------------------------------
        # ORDER
        # ---------------------------------------------------------------------

        query = query.order_by(
            Attendance.date.desc(),
            Attendance.id.desc(),
        )


        # ---------------------------------------------------------------------
        # PAGINATION
        # ---------------------------------------------------------------------

        offset = (
            (page - 1) * limit
        )


        rows = (
            query
            .offset(offset)
            .limit(limit)
            .all()
        )


        # ---------------------------------------------------------------------
        # BUILD RESPONSE
        # ---------------------------------------------------------------------

        items = []

        for attendance, employee in rows:

            items.append(
                AttendanceService._build_attendance_response(
                    attendance,
                    employee,
                )
            )


        # ---------------------------------------------------------------------
        # RETURN
        # ---------------------------------------------------------------------

        return {
            "items": items,

            "total": total,

            "page": page,

            "limit": limit,

            "totalPages": total_pages,
        }


    # =========================================================================
    # GET ATTENDANCE FOR SELECTED DATE
    # =========================================================================

    @staticmethod
    def get_today_attendance(
        db: Session,
        selected_date: date | None = None,
    ):
        # ---------------------------------------------------------------------
        # DATE
        # ---------------------------------------------------------------------
        #
        # No date supplied:
        #
        #     use today
        #
        # Date supplied:
        #
        #     use selected date
        #
        # ---------------------------------------------------------------------

        attendance_date = (
            selected_date
            if selected_date is not None
            else date.today()
        )


        # ---------------------------------------------------------------------
        # GET ACTIVE + WFH EMPLOYEES
        # ---------------------------------------------------------------------

        employees = (
            db.query(Employee)
            .filter(
                Employee.deleted_at.is_(None),

                Employee.deactivate.is_(False),

                Employee.status.in_(
                    [
                        "active",
                        "WFH",
                    ]
                ),
            )
            .order_by(
                Employee.name.asc()
            )
            .all()
        )


        # ---------------------------------------------------------------------
        # GET ATTENDANCE FOR SELECTED DATE
        # ---------------------------------------------------------------------
        #
        # IMPORTANT:
        #
        # This is no longer hard-coded to date.today().
        #
        # The selected calendar date will be used here.
        #
        # ---------------------------------------------------------------------

        attendance_map = {
            attendance.employee_id: attendance
            for attendance in (
                db.query(Attendance)
                .filter(
                    Attendance.date == attendance_date,

                    Attendance.deleted_at.is_(None),
                )
                .all()
            )
        }


        # ---------------------------------------------------------------------
        # BUILD RESPONSE
        # ---------------------------------------------------------------------

        results = []

        for employee in employees:

            attendance = attendance_map.get(
                employee.id
            )


            # -----------------------------------------------------------------
            # PROFILE
            # -----------------------------------------------------------------

            gender, profile_image = (
                AttendanceService._get_profile_data(
                    employee
                )
            )


            # -----------------------------------------------------------------
            # STATUS
            # -----------------------------------------------------------------

            status = AttendanceService._get_status(
                attendance,
                employee,
            )


            # -----------------------------------------------------------------
            # DEFAULT TIMES
            # -----------------------------------------------------------------

            punch_in = None

            lunch_out = None

            lunch_in = None

            punch_out = None


            # -----------------------------------------------------------------
            # ATTENDANCE TIMES
            # -----------------------------------------------------------------

            if attendance:

                if attendance.check_in:

                    punch_in = (
                        AttendanceService._format_time(
                            attendance.check_in
                        )
                    )


                if attendance.lunch_out:

                    lunch_out = (
                        AttendanceService._format_time(
                            attendance.lunch_out
                        )
                    )


                if attendance.lunch_in:

                    lunch_in = (
                        AttendanceService._format_time(
                            attendance.lunch_in
                        )
                    )


                if attendance.check_out:

                    punch_out = (
                        AttendanceService._format_time(
                            attendance.check_out
                        )
                    )


            # -----------------------------------------------------------------
            # RESULT
            # -----------------------------------------------------------------

            results.append(
                {
                    "id": (
                        attendance.id
                        if attendance
                        else None
                    ),

                    "employeeId": employee.id,

                    "name": employee.name,

                    "email": employee.email,

                    "gender": gender,

                    "profileImage": profile_image,

                    "date": attendance_date,

                    "punchIn": punch_in,

                    "lunchOut": lunch_out,

                    "lunchIn": lunch_in,

                    "punchOut": punch_out,

                    "status": status,
                }
            )


        return results


    # =========================================================================
    # GET EMPLOYEE HISTORY
    # =========================================================================

    @staticmethod
    def get_employee_history(
        db: Session,
        employee_id: int,
        from_date: date | None = None,
        to_date: date | None = None,
    ):
        # ---------------------------------------------------------------------
        # VALIDATE DATE RANGE
        # ---------------------------------------------------------------------

        if (
            from_date is not None
            and to_date is not None
            and from_date > to_date
        ):
            raise ValueError(
                "From date cannot be greater than to date."
            )


        # ---------------------------------------------------------------------
        # GET EMPLOYEE
        # ---------------------------------------------------------------------

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == employee_id,

                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if not employee:
            raise ValueError(
                "Employee not found."
            )


        # ---------------------------------------------------------------------
        # ATTENDANCE QUERY
        # ---------------------------------------------------------------------

        query = (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee_id,

                Attendance.deleted_at.is_(None),
            )
        )


        if from_date is not None:

            query = query.filter(
                Attendance.date >= from_date,
            )


        if to_date is not None:

            query = query.filter(
                Attendance.date <= to_date,
            )


        attendance_records = (
            query
            .order_by(
                Attendance.date.desc()
            )
            .all()
        )


        # ---------------------------------------------------------------------
        # ATTENDANCE MAP
        # ---------------------------------------------------------------------

        attendance_map = {
            attendance.date: attendance
            for attendance in attendance_records
        }


        # ---------------------------------------------------------------------
        # PROFILE
        # ---------------------------------------------------------------------

        gender, profile_image = (
            AttendanceService._get_profile_data(
                employee
            )
        )


        # ---------------------------------------------------------------------
        # CURRENT ATTENDANCE
        # ---------------------------------------------------------------------

        current_attendance = attendance_map.get(
            date.today()
        )


        # ---------------------------------------------------------------------
        # HISTORY RANGE
        # ---------------------------------------------------------------------

        history = []


        if from_date is not None:

            history_start = from_date

        elif attendance_records:

            history_start = min(
                attendance.date
                for attendance in attendance_records
            )

        else:

            history_start = date.today()


        if to_date is not None:

            history_end = to_date

        else:

            history_end = date.today()


        current_date = history_start


        # ---------------------------------------------------------------------
        # BUILD HISTORY
        # ---------------------------------------------------------------------

        while current_date <= history_end:

            attendance = attendance_map.get(
                current_date
            )


            status = AttendanceService._get_status(
                attendance,
                employee,
            )


            check_in = None

            check_out = None

            attendance_id = None


            if attendance:

                attendance_id = attendance.id


                check_in = (
                    AttendanceService._build_punch_data(
                        punch_time=attendance.check_in,
                        latitude=attendance.check_in_latitude,
                        longitude=attendance.check_in_longitude,
                        accuracy=attendance.check_in_accuracy,
                        image=attendance.check_in_image,
                        confidence=attendance.check_in_confidence,
                    )
                )


                check_out = (
                    AttendanceService._build_punch_data(
                        punch_time=attendance.check_out,
                        latitude=attendance.check_out_latitude,
                        longitude=attendance.check_out_longitude,
                        accuracy=attendance.check_out_accuracy,
                        image=attendance.check_out_image,
                        confidence=attendance.check_out_confidence,
                    )
                )


            history.append(
                {
                    "id": attendance_id,

                    "date": current_date,

                    "day": current_date.day,

                    "month": current_date.strftime(
                        "%B"
                    ),

                    "status": status,

                    "checkIn": check_in,

                    "checkOut": check_out,
                }
            )


            # -----------------------------------------------------------------
            # NEXT DATE
            # -----------------------------------------------------------------

            current_date = (
                current_date.fromordinal(
                    current_date.toordinal() + 1
                )
            )


        # ---------------------------------------------------------------------
        # CURRENT STATUS
        # ---------------------------------------------------------------------

        current_status = (
            AttendanceService._get_status(
                current_attendance,
                employee,
            )
        )


        current_check_in = None

        current_check_out = None


        if current_attendance:

            current_check_in = (
                AttendanceService._build_punch_data(
                    punch_time=current_attendance.check_in,
                    latitude=current_attendance.check_in_latitude,
                    longitude=current_attendance.check_in_longitude,
                    accuracy=current_attendance.check_in_accuracy,
                    image=current_attendance.check_in_image,
                    confidence=current_attendance.check_in_confidence,
                )
            )


            current_check_out = (
                AttendanceService._build_punch_data(
                    punch_time=current_attendance.check_out,
                    latitude=current_attendance.check_out_latitude,
                    longitude=current_attendance.check_out_longitude,
                    accuracy=current_attendance.check_out_accuracy,
                    image=current_attendance.check_out_image,
                    confidence=current_attendance.check_out_confidence,
                )
            )


        # ---------------------------------------------------------------------
        # RETURN
        # ---------------------------------------------------------------------

        return {
            "employeeId": employee.id,

            "name": employee.name,

            "email": employee.email,

            "gender": gender,

            "profileImage": profile_image,

            "currentStatus": current_status,

            "currentCheckIn": current_check_in,

            "currentCheckOut": current_check_out,

            "history": history,
        }