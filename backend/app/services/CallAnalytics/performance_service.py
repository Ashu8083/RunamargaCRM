from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.call_assignments import CallAssignment
from app.models.call_logs import CallLog
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication


class CallAnalyticsPerformanceService:
    """
    Call Analytics Performance Service.

    Default:
        If no dates are supplied:
            TODAY -> TODAY

    Agent-wise / RM-wise:
        The returned performance is calculated for each visible
        employee independently.

    Metrics:

        Calls
        Incoming
        Outgoing
        Answered
        Missed
        Applications
        Converted
        Assignments
        Calls Handled
        Average Talk Seconds

    Classification:

        CONVERTED
            Call/application phone number exists in
            loan_applications.

        ASSIGNED
            Phone number exists in an active call_assignment
            but does not exist in loan_applications.

        UNKNOWN
            Phone number exists in call_logs but is neither
            assigned nor present in loan_applications.

    Access control:
        AccessControl is the source of hierarchy visibility.
    """

    # =========================================================
    # EMPTY RESPONSE
    # =========================================================

    @staticmethod
    def _empty_response() -> dict:
        return {
            "summary": {
                "totalAgents": 0,
                "totalAssignments": 0,
                "totalCalls": 0,
                "totalIncoming": 0,
                "totalOutgoing": 0,
                "totalAnswered": 0,
                "totalMissed": 0,
                "totalApplications": 0,
                "totalConverted": 0,
                "avgTalkSeconds": 0,
            },
            "agents": [],
        }

    # =========================================================
    # PHONE NORMALIZATION
    # =========================================================

    @staticmethod
    def _normalize_phone(
        value: Optional[str],
    ) -> str:

        if value is None:
            return ""

        value = str(value).strip()

        if not value:
            return ""

        value = "".join(
            character
            for character in value
            if character.isdigit()
        )

        if len(value) > 10:
            value = value[-10:]

        return value

    # =========================================================
    # SQL PHONE NORMALIZATION
    # =========================================================

    @staticmethod
    def _phone_sql_expression(column):

        return func.regexp_replace(
            column,
            r"[^0-9]",
            "",
            "g",
        )

    # =========================================================
    # DATE START
    # =========================================================

    @staticmethod
    def _date_start(
        value: date,
    ) -> datetime:

        return datetime.combine(
            value,
            time.min,
        )

    # =========================================================
    # DATE END
    # =========================================================

    @staticmethod
    def _date_end(
        value: date,
    ) -> datetime:

        return datetime.combine(
            value + timedelta(days=1),
            time.min,
        )

    # =========================================================
    # DEFAULT DATES
    # =========================================================

    @staticmethod
    def _get_default_dates() -> tuple[date, date]:

        today = date.today()

        return today, today

    # =========================================================
    # RESOLVE DATES
    # =========================================================

    @staticmethod
    def _resolve_dates(
        from_date: Optional[date],
        to_date: Optional[date],
    ) -> tuple[date, date]:

        # -----------------------------------------------------
        # NO DATE FILTER
        # -----------------------------------------------------

        if (
            from_date is None
            and to_date is None
        ):

            return (
                CallAnalyticsPerformanceService
                ._get_default_dates()
            )

        # -----------------------------------------------------
        # ONLY FROM DATE
        # -----------------------------------------------------

        if to_date is None:

            to_date = from_date

        # -----------------------------------------------------
        # ONLY TO DATE
        # -----------------------------------------------------

        if from_date is None:

            from_date = to_date

        # -----------------------------------------------------
        # VALIDATION
        # -----------------------------------------------------

        if from_date > to_date:

            raise ValueError(
                "from_date cannot be greater than to_date."
            )

        return from_date, to_date





    # =========================================================
    # GET PERFORMANCE CONTEXTS
    # =========================================================

    @staticmethod
    def _get_visible_performance_contexts(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:
        """
        Get all employee contexts that should appear in
        Performance.

        GLOBAL / MANAGER:
            visible Agents + visible RMs

        TEAMLEAD:
            visible Agents + visible RMs

        RM:
            visible Agents

        AGENT:
            current Agent

        AccessControl decides the actual visibility.
        """

        agent_contexts = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
        ) or []

        rm_contexts = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
        ) or []

        result = []

        seen = set()

        for employee_context in [
            *(agent_contexts or []),
            *(rm_contexts or []),
        ]:

            if not employee_context:
                continue

            if employee_context.id is None:
                continue

            if employee_context.id in seen:
                continue

            seen.add(
                employee_context.id
            )

            result.append(
                employee_context
            )

        return result

    # =========================================================
    # GET EMPLOYEE CONTEXT MAP
    # =========================================================

    @staticmethod
    def _get_performance_context_map(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> dict[int, EmployeeContext]:

        contexts = (
            CallAnalyticsPerformanceService
            ._get_visible_performance_contexts(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        result = {}

        for employee_context in contexts:

            if employee_context.employee_id is None:
                continue

            # One employee can potentially have multiple
            # contexts. Keep the first authorized context.
            if employee_context.employee_id not in result:

                result[
                    employee_context.employee_id
                ] = employee_context

        return result

    # =========================================================
    # GET EMPLOYEE CONTEXT DETAILS
    # =========================================================

    @staticmethod
    def _get_employee_context_details(
        db: Session,
        employee_context: Optional[EmployeeContext],
    ) -> dict:

        if not employee_context:

            return {
                "team_id": None,
                "team": None,
                "rm_id": None,
                "rm_name": None,
            }

        reporting_context = None

        if employee_context.reports_to_id:

            reporting_context = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id
                    == employee_context.reports_to_id,
                    EmployeeContext.is_active.is_(True),
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )

        if not reporting_context:

            return {
                "team_id": None,
                "team": None,
                "rm_id": None,
                "rm_name": None,
            }

        reporting_employee = (
            db.query(Employee)
            .filter(
                Employee.id
                == reporting_context.employee_id,
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        reporting_context_model = (
            db.query(Context)
            .filter(
                Context.id
                == reporting_context.context_id,
                Context.is_active.is_(True),
            )
            .first()
        )

        reporting_family = AccessControl.get_context_family(
            reporting_context_model.code
            if reporting_context_model
            else None
        )

        # -----------------------------------------------------
        # REPORTING RM
        # -----------------------------------------------------

        if reporting_family == "RM":

            return {
                "team_id": None,
                "team": None,
                "rm_id": (
                    reporting_employee.id
                    if reporting_employee
                    else None
                ),
                "rm_name": (
                    reporting_employee.name
                    if reporting_employee
                    else None
                ),
            }

        # -----------------------------------------------------
        # REPORTING TEAM LEAD
        # -----------------------------------------------------

        if reporting_family == "TEAMLEAD":

            return {
                "team_id":
                    reporting_context.id,

                "team":
                    (
                        reporting_employee.name
                        if reporting_employee
                        else None
                    ),

                "rm_id":
                    None,

                "rm_name":
                    None,
            }

        return {
            "team_id": None,
            "team": None,
            "rm_id": None,
            "rm_name": None,
        }

    # =========================================================
    # GET EMPLOYEE CALL CONTEXT IDS
    # =========================================================

    @staticmethod
    def _get_employee_call_context_ids(
        db: Session,
        employee_id: int,
        performance_context: Optional[EmployeeContext],
    ) -> list[int]:
        """
        Return all authorized EmployeeContext IDs belonging
        to this employee.

        This is important because CallLog stores:

            employee_context_id

        rather than Employee.id.
        """

        if not performance_context:
            return []

        # AccessControl has already determined that this context is visible.
        # CallLog stores EmployeeContext.id, so analytics must use context IDs
        # rather than Employee.id. Include the employee's active contexts.
        authorized_employee_id = performance_context.employee_id

        if authorized_employee_id is None:
            return []

        rows = (
            db.query(EmployeeContext.id)
            .filter(
                EmployeeContext.employee_id
                == authorized_employee_id,
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
            )
            .all()
        )

        return [
            int(row[0])
            for row in rows
            if row[0] is not None
        ]

    # =========================================================
    # BUILD CALL QUERY
    # =========================================================

    @staticmethod
    def _build_call_query(
        db: Session,
        employee_context_ids: list[int],
        from_date: date,
        to_date: date,
        direction: Optional[str] = None,
        status: Optional[str] = None,
    ):

        if not employee_context_ids:

            return (
                db.query(CallLog)
                .filter(False)
            )

        query = (
            db.query(CallLog)
            .filter(
                CallLog.employee_context_id.in_(
                    employee_context_ids
                ),
                CallLog.call_started_at
                >= (
                    CallAnalyticsPerformanceService
                    ._date_start(
                        from_date
                    )
                ),
                CallLog.call_started_at
                < (
                    CallAnalyticsPerformanceService
                    ._date_end(
                        to_date
                    )
                ),
            )
        )

        # -----------------------------------------------------
        # CALL DIRECTION
        # -----------------------------------------------------

        if direction:

            direction_value = (
                str(direction)
                .strip()
                .lower()
            )

            if direction_value not in {
                "incoming",
                "outgoing",
            }:

                return query.filter(False)

            query = query.filter(
                CallLog.call_type
                == direction_value
            )

        # -----------------------------------------------------
        # CALL STATUS
        # -----------------------------------------------------

        if status:

            status_value = (
                str(status)
                .strip()
                .lower()
            )

            if status_value == "answered":
                status_value = "received"

            valid_statuses = {
                "received",
                "missed",
                "rejected",
                "in_progress",
                "not_reached",
            }

            if status_value not in valid_statuses:

                return query.filter(False)

            query = query.filter(
                CallLog.mobile_status
                == status_value
            )

        return query

    # =========================================================
    # GET CALL METRICS
    # =========================================================

    @staticmethod
    def _get_call_metrics(
        db: Session,
        employee_context_ids: list[int],
        from_date: date,
        to_date: date,
        direction: Optional[str] = None,
        status: Optional[str] = None,
    ) -> dict:

        query = (
            CallAnalyticsPerformanceService
            ._build_call_query(
                db=db,
                employee_context_ids=employee_context_ids,
                from_date=from_date,
                to_date=to_date,
                direction=direction,
                status=status,
            )
        )

        rows = query.all()

        incoming = 0
        outgoing = 0
        answered = 0
        missed = 0

        total_talk_seconds = 0
        talk_count = 0

        for call in rows:

            call_type = (
                getattr(
                    call.call_type,
                    "value",
                    call.call_type,
                )
            )

            call_type = str(
                call_type or ""
            ).lower()

            mobile_status = (
                getattr(
                    call.mobile_status,
                    "value",
                    call.mobile_status,
                )
            )

            mobile_status = str(
                mobile_status or ""
            ).lower()

            # -------------------------------------------------
            # DIRECTION
            # -------------------------------------------------

            if call_type == "incoming":
                incoming += 1

            elif call_type == "outgoing":
                outgoing += 1

            # -------------------------------------------------
            # STATUS
            # -------------------------------------------------

            if mobile_status == "received":

                answered += 1

            elif mobile_status == "missed":

                missed += 1

            # -------------------------------------------------
            # TALK DURATION
            # -------------------------------------------------

            if (
                mobile_status == "received"
                and call.duration_seconds is not None
            ):

                duration = int(
                    call.duration_seconds
                    or 0
                )

                if duration >= 0:

                    total_talk_seconds += duration
                    talk_count += 1

        avg_talk_seconds = (
            round(
                total_talk_seconds
                / talk_count
            )
            if talk_count
            else 0
        )

        return {
            "incoming": incoming,
            "outgoing": outgoing,
            "answered": answered,
            "missed": missed,
            "avg_talk_seconds": avg_talk_seconds,
            "calls": rows,
        }

    # =========================================================
    # GET APPLICATIONS FOR EMPLOYEE
    # =========================================================

    @staticmethod
    def _get_application_count(
        db: Session,
        employee_id: int,
        employee_context: Optional[EmployeeContext],
        from_date: date,
        to_date: date,
    ) -> int:
        """
        Count applications belonging to this employee.

        Application assignment is based on:

            LoanApplication.agent_context_id

        The application date is:

            applied_date

        Fallback to created_at is intentionally NOT used because
        applied_date is the application business date in the
        supplied model.
        """

        if not employee_context:
            return 0

        context_ids = (
            CallAnalyticsPerformanceService
            ._get_employee_call_context_ids(
                db=db,
                employee_id=employee_id,
                performance_context=employee_context,
            )
        )

        if not context_ids:
            return 0

        return int(
            (
                db.query(
                    func.count(
                        LoanApplication.id
                    )
                )
                .filter(
                    LoanApplication.agent_context_id.in_(
                        context_ids
                    ),
                    LoanApplication.deleted_at.is_(None),
                    LoanApplication.applied_date
                    >= from_date,
                    LoanApplication.applied_date
                    <= to_date,
                )
                .scalar()
                or 0
            )
        )

    # =========================================================
    # GET ASSIGNMENT COUNT
    # =========================================================

    @staticmethod
    def _get_assignment_count(
        db: Session,
        employee_id: int,
        from_date: date,
        to_date: date,
    ) -> int:
        """
        Count active assignments received by the employee.
        """

        start_datetime = (
            CallAnalyticsPerformanceService
            ._date_start(
                from_date
            )
        )

        end_datetime = (
            CallAnalyticsPerformanceService
            ._date_end(
                to_date
            )
        )

        return int(
            (
                db.query(
                    func.count(
                        CallAssignment.id
                    )
                )
                .filter(
                    CallAssignment.assigned_to_id
                    == employee_id,
                    CallAssignment.deleted_at.is_(None),
                    CallAssignment.created_at
                    >= start_datetime,
                    CallAssignment.created_at
                    < end_datetime,
                )
                .scalar()
                or 0
            )
        )

    # =========================================================
    # GET CONVERSION COUNT
    # =========================================================

    @staticmethod
    def _get_conversion_count(
        db: Session,
        employee_id: int,
        employee_context: Optional[EmployeeContext],
        from_date: date,
        to_date: date,
    ) -> int:
        """
        Count converted applications for this employee.

        Conversion means:

            Call/assignment phone number
            exists in loan_applications.

        The application must belong to this employee through:

            LoanApplication.agent_context_id

        and must be created/applied inside the requested
        date range.

        Distinct phone numbers are counted so multiple call
        records for the same customer do not inflate conversion.
        """

        if not employee_context:
            return 0

        context_ids = (
            CallAnalyticsPerformanceService
            ._get_employee_call_context_ids(
                db=db,
                employee_id=employee_id,
                performance_context=employee_context,
            )
        )

        if not context_ids:
            return 0

        return int(
            (
                db.query(
                    func.count(
                        func.distinct(
                            CallAnalyticsPerformanceService
                            ._phone_sql_expression(
                                LoanApplication.phone
                            )
                        )
                    )
                )
                .filter(
                    LoanApplication.agent_context_id.in_(
                        context_ids
                    ),
                    LoanApplication.deleted_at.is_(None),
                    LoanApplication.applied_date
                    >= from_date,
                    LoanApplication.applied_date
                    <= to_date,
                    LoanApplication.phone.isnot(None),
                )
                .scalar()
                or 0
            )
        )

    # =========================================================
    # GET ASSIGNMENT PHONE NUMBERS
    # =========================================================

    @staticmethod
    def _get_assignment_phone_numbers(
        db: Session,
        employee_id: int,
        from_date: date,
        to_date: date,
    ) -> set[str]:
        """
        Get active assignment phone numbers belonging to
        this employee during the selected date range.
        """

        start_datetime = (
            CallAnalyticsPerformanceService
            ._date_start(
                from_date
            )
        )

        end_datetime = (
            CallAnalyticsPerformanceService
            ._date_end(
                to_date
            )
        )

        rows = (
            db.query(
                CallAssignment.phone_number
            )
            .filter(
                CallAssignment.assigned_to_id
                == employee_id,
                CallAssignment.deleted_at.is_(None),
                CallAssignment.created_at
                >= start_datetime,
                CallAssignment.created_at
                < end_datetime,
                CallAssignment.phone_number.isnot(None),
            )
            .all()
        )

        result = set()

        for row in rows:

            normalized = (
                CallAnalyticsPerformanceService
                ._normalize_phone(
                    row.phone_number
                )
            )

            if normalized:

                result.add(
                    normalized
                )

        return result

    # =========================================================
    # GET APPLICATION PHONE NUMBERS
    # =========================================================

    @staticmethod
    def _get_application_phone_numbers(
        db: Session,
        employee_context: Optional[EmployeeContext],
        employee_id: int,
        from_date: date,
        to_date: date,
    ) -> set[str]:
        """
        Get application phone numbers belonging to this employee.
        """

        if not employee_context:
            return set()

        context_ids = (
            CallAnalyticsPerformanceService
            ._get_employee_call_context_ids(
                db=db,
                employee_id=employee_id,
                performance_context=employee_context,
            )
        )

        if not context_ids:
            return set()

        rows = (
            db.query(
                LoanApplication.phone,
                LoanApplication.alternate_phone,
            )
            .filter(
                LoanApplication.agent_context_id.in_(
                    context_ids
                ),
                LoanApplication.deleted_at.is_(None),
                LoanApplication.applied_date
                >= from_date,
                LoanApplication.applied_date
                <= to_date,
            )
            .all()
        )

        result = set()

        for row in rows:

            phone = (
                CallAnalyticsPerformanceService
                ._normalize_phone(
                    row.phone
                )
            )

            alternate_phone = (
                CallAnalyticsPerformanceService
                ._normalize_phone(
                    row.alternate_phone
                )
            )

            if phone:
                result.add(phone)

            if alternate_phone:
                result.add(alternate_phone)

        return result

    # =========================================================
    # GET CALL CLASSIFICATION
    # =========================================================

    @staticmethod
    def _get_call_classification(
        db: Session,
        employee_id: int,
        employee_context: Optional[EmployeeContext],
        calls: list[CallLog],
        from_date: date,
        to_date: date,
    ) -> dict:
        """
        Classify calls belonging to one employee.

        Priority:

            CONVERTED
                phone exists in applications

            ASSIGNED
                phone exists in assignments

            UNKNOWN
                phone exists in calls but neither application
                nor assignment exists
        """

        phone_numbers = set()

        for call in calls:

            phone = (
                CallAnalyticsPerformanceService
                ._normalize_phone(
                    call.phone_number
                )
            )

            if phone:

                phone_numbers.add(
                    phone
                )

        assignment_numbers = (
            CallAnalyticsPerformanceService
            ._get_assignment_phone_numbers(
                db=db,
                employee_id=employee_id,
                from_date=from_date,
                to_date=to_date,
            )
        )

        application_numbers = (
            CallAnalyticsPerformanceService
            ._get_application_phone_numbers(
                db=db,
                employee_context=employee_context,
                employee_id=employee_id,
                from_date=from_date,
                to_date=to_date,
            )
        )

        converted_numbers = (
            phone_numbers
            & application_numbers
        )

        assigned_numbers = (
            phone_numbers
            & assignment_numbers
            - converted_numbers
        )

        unknown_numbers = (
            phone_numbers
            - converted_numbers
            - assigned_numbers
        )

        return {
            "converted_numbers":
                converted_numbers,

            "assigned_numbers":
                assigned_numbers,

            "unknown_numbers":
                unknown_numbers,
        }

    # =========================================================
    # GET CLASSIFICATION COUNTS
    # =========================================================

    @staticmethod
    def _get_classification_counts(
        db: Session,
        employee_id: int,
        employee_context: Optional[EmployeeContext],
        calls: list[CallLog],
        from_date: date,
        to_date: date,
    ) -> dict:

        classification = (
            CallAnalyticsPerformanceService
            ._get_call_classification(
                db=db,
                employee_id=employee_id,
                employee_context=employee_context,
                calls=calls,
                from_date=from_date,
                to_date=to_date,
            )
        )

        converted_numbers = (
            classification[
                "converted_numbers"
            ]
        )

        assigned_numbers = (
            classification[
                "assigned_numbers"
            ]
        )

        unknown_numbers = (
            classification[
                "unknown_numbers"
            ]
        )

        converted = 0
        assigned = 0
        unknown = 0

        for call in calls:

            phone = (
                CallAnalyticsPerformanceService
                ._normalize_phone(
                    call.phone_number
                )
            )

            if not phone:

                unknown += 1

            elif phone in converted_numbers:

                converted += 1

            elif phone in assigned_numbers:

                assigned += 1

            elif phone in unknown_numbers:

                unknown += 1

        return {
            "unknown": unknown,
            "assigned": assigned,
            "converted": converted,
        }

    # =========================================================
    # GET PERFORMANCE
    # =========================================================

    @staticmethod
    def get_performance(
        db: Session,
        employee: Employee,
        employee_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        direction: Optional[str] = None,
        status: Optional[str] = None,
        context_id: Optional[int] = None,
    ) -> dict:

        # =====================================================
        # AUTHENTICATION
        # =====================================================

        if not employee:

            raise PermissionError(
                "Authenticated employee is required."
            )

        # =====================================================
        # DATES
        # =====================================================

        from_date, to_date = (
            CallAnalyticsPerformanceService
            ._resolve_dates(
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # VISIBLE EMPLOYEE CONTEXTS
        # =====================================================

        performance_context_map = (
            CallAnalyticsPerformanceService
            ._get_performance_context_map(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not performance_context_map:

            return (
                CallAnalyticsPerformanceService
                ._empty_response()
            )

        # =====================================================
        # EMPLOYEE FILTER
        # =====================================================

        visible_employee_ids = set(
            performance_context_map.keys()
        )

        if employee_id is not None:

            if (
                employee_id
                not in visible_employee_ids
            ):

                return (
                    CallAnalyticsPerformanceService
                    ._empty_response()
                )

            target_employee_ids = {
                employee_id
            }

        else:

            target_employee_ids = (
                visible_employee_ids
            )

        # =====================================================
        # EMPLOYEES
        # =====================================================

        employees = (
            db.query(Employee)
            .filter(
                Employee.id.in_(
                    target_employee_ids
                ),
                Employee.deleted_at.is_(None),
            )
            .order_by(
                Employee.name.asc()
            )
            .all()
        )

        # =====================================================
        # RESULT
        # =====================================================

        agents = []

        # =====================================================
        # SUMMARY
        # =====================================================

        total_assignments = 0
        total_calls = 0
        total_incoming = 0
        total_outgoing = 0
        total_answered = 0
        total_missed = 0
        total_applications = 0
        total_converted = 0

        total_talk_seconds = 0
        total_answered_calls = 0

        # =====================================================
        # EACH EMPLOYEE
        # =====================================================

        for agent in employees:

            employee_context = (
                performance_context_map.get(
                    agent.id
                )
            )

            # -------------------------------------------------
            # CALL CONTEXT IDS
            # -------------------------------------------------

            employee_context_ids = (
                CallAnalyticsPerformanceService
                ._get_employee_call_context_ids(
                    db=db,
                    employee_id=agent.id,
                    performance_context=employee_context,
                )
            )

            # -------------------------------------------------
            # CALL METRICS
            # -------------------------------------------------

            call_metrics = (
                CallAnalyticsPerformanceService
                ._get_call_metrics(
                    db=db,
                    employee_context_ids=employee_context_ids,
                    from_date=from_date,
                    to_date=to_date,
                    direction=direction,
                    status=status,
                )
            )

            calls = call_metrics[
                "calls"
            ]

            # -------------------------------------------------
            # APPLICATIONS
            # -------------------------------------------------

            applications = (
                CallAnalyticsPerformanceService
                ._get_application_count(
                    db=db,
                    employee_id=agent.id,
                    employee_context=employee_context,
                    from_date=from_date,
                    to_date=to_date,
                )
            )

            # -------------------------------------------------
            # ASSIGNMENTS
            # -------------------------------------------------

            assignments = (
                CallAnalyticsPerformanceService
                ._get_assignment_count(
                    db=db,
                    employee_id=agent.id,
                    from_date=from_date,
                    to_date=to_date,
                )
            )

            # -------------------------------------------------
            # CONVERSIONS
            # -------------------------------------------------

            converted = (
                CallAnalyticsPerformanceService
                ._get_conversion_count(
                    db=db,
                    employee_id=agent.id,
                    employee_context=employee_context,
                    from_date=from_date,
                    to_date=to_date,
                )
            )

            # -------------------------------------------------
            # CLASSIFICATION
            # -------------------------------------------------

            classification_counts = (
                CallAnalyticsPerformanceService
                ._get_classification_counts(
                    db=db,
                    employee_id=agent.id,
                    employee_context=employee_context,
                    calls=calls,
                    from_date=from_date,
                    to_date=to_date,
                )
            )

            # -------------------------------------------------
            # TOTAL CALLS
            # -------------------------------------------------

            total_agent_calls = len(
                calls
            )

            # -------------------------------------------------
            # CONTEXT DETAILS
            # -------------------------------------------------

            context_details = (
                CallAnalyticsPerformanceService
                ._get_employee_context_details(
                    db=db,
                    employee_context=employee_context,
                )
            )

            # -------------------------------------------------
            # TALK TIME
            # -------------------------------------------------

            agent_talk_seconds = 0
            agent_answered_calls = 0

            for call in calls:

                mobile_status = (
                    getattr(
                        call.mobile_status,
                        "value",
                        call.mobile_status,
                    )
                )

                mobile_status = str(
                    mobile_status or ""
                ).lower()

                if (
                    mobile_status == "received"
                    and call.duration_seconds is not None
                ):

                    duration = int(
                        call.duration_seconds
                        or 0
                    )

                    if duration >= 0:

                        agent_talk_seconds += duration
                        agent_answered_calls += 1

            avg_talk_seconds = (
                round(
                    agent_talk_seconds
                    / agent_answered_calls
                )
                if agent_answered_calls
                else 0
            )

            # -------------------------------------------------
            # STATUS
            # -------------------------------------------------

            agent_status = (
                getattr(
                    agent.status,
                    "value",
                    agent.status,
                )
                if agent.status is not None
                else "active"
            )

            # -------------------------------------------------
            # AGENT RESULT
            # -------------------------------------------------

            agents.append(
                {
                    "id":
                        agent.id,

                    "name":
                        agent.name,

                    "teamId":
                        context_details[
                            "team_id"
                        ],

                    "team":
                        context_details[
                            "team"
                        ],

                    "rmId":
                        context_details[
                            "rm_id"
                        ],

                    "rmName":
                        context_details[
                            "rm_name"
                        ],

                    "incoming":
                        call_metrics[
                            "incoming"
                        ],

                    "outgoing":
                        call_metrics[
                            "outgoing"
                        ],

                    "answered":
                        call_metrics[
                            "answered"
                        ],

                    "missed":
                        call_metrics[
                            "missed"
                        ],

                    "applications":
                        applications,

                    "converted":
                        converted,

                    "assignments":
                        assignments,

                    "callsHandled":
                        classification_counts[
                            "assigned"
                        ],

                    "totalCalls":
                        total_agent_calls,

                    "avgTalkSeconds":
                        avg_talk_seconds,

                    "status":
                        agent_status,

                    # Additional values available to the
                    # frontend if required.
                    "unknown":
                        classification_counts[
                            "unknown"
                        ],

                    "assignedCalls":
                        classification_counts[
                            "assigned"
                        ],

                    "convertedCalls":
                        classification_counts[
                            "converted"
                        ],
                }
            )

            # -------------------------------------------------
            # SUMMARY ACCUMULATION
            # -------------------------------------------------

            total_assignments += assignments

            total_calls += total_agent_calls

            total_incoming += (
                call_metrics[
                    "incoming"
                ]
            )

            total_outgoing += (
                call_metrics[
                    "outgoing"
                ]
            )

            total_answered += (
                call_metrics[
                    "answered"
                ]
            )

            total_missed += (
                call_metrics[
                    "missed"
                ]
            )

            total_applications += applications

            total_converted += converted

            total_talk_seconds += (
                agent_talk_seconds
            )

            total_answered_calls += (
                agent_answered_calls
            )

        # =====================================================
        # SUMMARY AVG TALK
        # =====================================================

        avg_talk_seconds = (
            round(
                total_talk_seconds
                / total_answered_calls
            )
            if total_answered_calls
            else 0
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "summary": {
                "totalAgents":
                    len(agents),

                "totalAssignments":
                    total_assignments,

                "totalCalls":
                    total_calls,

                "totalIncoming":
                    total_incoming,

                "totalOutgoing":
                    total_outgoing,

                "totalAnswered":
                    total_answered,

                "totalMissed":
                    total_missed,

                "totalApplications":
                    total_applications,

                "totalConverted":
                    total_converted,

                "avgTalkSeconds":
                    avg_talk_seconds,
            },

            "agents":
                agents,
        }