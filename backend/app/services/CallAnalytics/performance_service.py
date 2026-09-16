# backend/app/services/CallAnalytics/performance_service.py

from calendar import monthrange
from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.call_assignments import CallAssignment
from app.models.call_logs import (
    CallLog,
    CallTypeEnum,
    MobileStatusEnum,
)
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication


class CallAnalyticsPerformanceService:
    """
    Service for Call Analytics Agent-wise Performance.

    Responsibilities:
    - Determine agents visible to the logged-in employee.
    - Apply employee / date / direction / status filters.
    - Calculate call performance.
    - Calculate application volume.
    - Calculate conversions.
    - Calculate average talk duration.
    - Build the summary required by the Performance page.
    """

    # =========================================================
    # PHONE NORMALIZATION
    # =========================================================

    @staticmethod
    def _normalize_phone(value: Optional[str]) -> str:
        if value is None:
            return ""

        value = str(value).strip()

        if not value:
            return ""

        return "".join(
            character
            for character in value
            if character.isdigit()
        )

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
    def _date_start(value: date) -> datetime:
        return datetime.combine(
            value,
            time.min,
        )

    # =========================================================
    # DATE END
    # =========================================================

    @staticmethod
    def _date_end(value: date) -> datetime:
        return datetime.combine(
            value + timedelta(days=1),
            time.min,
        )

    # =========================================================
    # CURRENT MONTH
    # =========================================================

    @staticmethod
    def _get_current_month_dates():
        today = date.today()

        first_day = date(
            today.year,
            today.month,
            1,
        )

        last_day = date(
            today.year,
            today.month,
            monthrange(
                today.year,
                today.month,
            )[1],
        )

        return (
            first_day,
            last_day,
        )

    # =========================================================
    # ACTIVE CONTEXT
    # =========================================================

    @staticmethod
    def _get_active_employee_context(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[EmployeeContext]:

        if not employee:
            return None

        query = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id
                == employee.id,
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
            )
        )

        if context_id is not None:

            selected = (
                query
                .filter(
                    EmployeeContext.id
                    == context_id,
                )
                .first()
            )

            if selected:
                return selected

        default_context = (
            query
            .filter(
                EmployeeContext.is_default.is_(True),
            )
            .first()
        )

        if default_context:
            return default_context

        return (
            query
            .order_by(
                EmployeeContext.id.asc()
            )
            .first()
        )

    # =========================================================
    # CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def _get_context_family(
        context_code: Optional[str],
    ) -> str:

        if not context_code:
            return "UNKNOWN"

        code = str(
            context_code
        ).strip().upper()

        if code == "GLOBAL":
            return "GLOBAL"

        if (
            code == "AGENT"
            or code.startswith("AGENT_")
        ):
            return "AGENT"

        if (
            code == "RM"
            or code.startswith("RM_")
        ):
            return "RM"

        if (
            code == "TEAM_LEAD"
            or code == "TEAMLEAD"
            or code.startswith("TEAMLEAD_")
        ):
            return "TEAMLEAD"

        if (
            code == "MANAGER"
            or code.startswith("MANAGER_")
        ):
            return "MANAGER"

        return "UNKNOWN"

    # =========================================================
    # GET VISIBLE AGENT CONTEXTS
    # =========================================================

    @staticmethod
    def _get_visible_agent_contexts(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:

        if not employee:
            return []

        current_context = (
            CallAnalyticsPerformanceService
            ._get_active_employee_context(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not current_context:
            return []

        # Context model does NOT have deleted_at.
        context = (
            db.query(Context)
            .filter(
                Context.id
                == current_context.context_id,
                Context.is_active.is_(True),
            )
            .first()
        )

        if not context:
            return []

        family = (
            CallAnalyticsPerformanceService
            ._get_context_family(
                context.code
            )
        )

        # -----------------------------------------------------
        # AGENT CONTEXT QUERY
        # -----------------------------------------------------

        agent_context_query = (
            db.query(EmployeeContext)
            .join(
                Context,
                Context.id
                == EmployeeContext.context_id,
            )
            .filter(
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
                Context.is_active.is_(True),
            )
            .filter(
                or_(
                    Context.code == "AGENT",
                    Context.code.ilike("AGENT_%"),
                )
            )
        )

        # -----------------------------------------------------
        # GLOBAL
        # -----------------------------------------------------

        if family == "GLOBAL":

            return (
                agent_context_query
                .order_by(
                    EmployeeContext.id.asc()
                )
                .all()
            )

        # -----------------------------------------------------
        # MANAGER
        # -----------------------------------------------------

        if family == "MANAGER":

            return (
                agent_context_query
                .order_by(
                    EmployeeContext.id.asc()
                )
                .all()
            )

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        if family == "AGENT":

            return (
                agent_context_query
                .filter(
                    EmployeeContext.id
                    == current_context.id
                )
                .all()
            )

        # -----------------------------------------------------
        # RM / TEAM LEAD
        # -----------------------------------------------------

        if family in {
            "RM",
            "TEAMLEAD",
        }:

            return (
                agent_context_query
                .filter(
                    EmployeeContext.reports_to_id
                    == current_context.id
                )
                .order_by(
                    EmployeeContext.id.asc()
                )
                .all()
            )

        return []

    # =========================================================
    # GET AGENT CONTEXT MAP
    # =========================================================

    @staticmethod
    def _get_agent_context_map(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> dict[int, EmployeeContext]:

        contexts = (
            CallAnalyticsPerformanceService
            ._get_visible_agent_contexts(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        result = {}

        for agent_context in contexts:

            if agent_context.employee_id is None:
                continue

            if agent_context.employee_id not in result:

                result[
                    agent_context.employee_id
                ] = agent_context

        return result

    # =========================================================
    # GET TEAM / RM INFORMATION
    # =========================================================

    @staticmethod
    def _get_employee_context_details(
        db: Session,
        employee_context: Optional[EmployeeContext],
    ):

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
                db.query(
                    EmployeeContext
                )
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

        # Context model does NOT have deleted_at.
        reporting_context_model = (
            db.query(Context)
            .filter(
                Context.id
                == reporting_context.context_id,
                Context.is_active.is_(True),
            )
            .first()
        )

        reporting_family = (
            CallAnalyticsPerformanceService
            ._get_context_family(
                reporting_context_model.code
                if reporting_context_model
                else None
            )
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
                "team_id": reporting_context.id,
                "team": (
                    reporting_employee.name
                    if reporting_employee
                    else None
                ),
                "rm_id": None,
                "rm_name": None,
            }

        return {
            "team_id": None,
            "team": None,
            "rm_id": None,
            "rm_name": None,
        }

    # =========================================================
    # BUILD CALL QUERY
    # =========================================================

    @staticmethod
    def _build_call_query(
        db: Session,
        employee_ids: set[int],
        from_date: date,
        to_date: date,
        direction: Optional[str] = None,
        status: Optional[str] = None,
    ):

        if not employee_ids:

            return (
                db.query(CallLog)
                .filter(False)
            )

        query = (
            db.query(CallLog)
            .filter(
                CallLog.employee_id.in_(
                    employee_ids
                ),
                CallLog.call_started_at
                >= CallAnalyticsPerformanceService._date_start(
                    from_date
                ),
                CallLog.call_started_at
                < CallAnalyticsPerformanceService._date_end(
                    to_date
                ),
            )
        )

        # -----------------------------------------------------
        # DIRECTION
        # -----------------------------------------------------

        if direction:

            direction_value = (
                str(direction)
                .strip()
                .lower()
            )

            if direction_value in {
                "incoming",
                "outgoing",
            }:

                try:

                    direction_enum = (
                        CallTypeEnum(
                            direction_value
                        )
                    )

                    query = query.filter(
                        CallLog.call_type
                        == direction_enum
                    )

                except ValueError:

                    return query.filter(False)

        # -----------------------------------------------------
        # STATUS
        # -----------------------------------------------------

        if status:

            status_value = (
                str(status)
                .strip()
                .lower()
            )

            if status_value == "answered":
                status_value = "received"

            try:

                status_enum = (
                    MobileStatusEnum(
                        status_value
                    )
                )

                query = query.filter(
                    CallLog.mobile_status
                    == status_enum
                )

            except ValueError:

                return query.filter(False)

        return query

    # =========================================================
    # GET CALL METRICS
    # =========================================================

    @staticmethod
    def _get_call_metrics(
        db: Session,
        employee_id: int,
        from_date: date,
        to_date: date,
        direction: Optional[str] = None,
        status: Optional[str] = None,
    ) -> dict:

        query = (
            CallAnalyticsPerformanceService
            ._build_call_query(
                db=db,
                employee_ids={
                    employee_id
                },
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
                call.call_type.value
                if hasattr(
                    call.call_type,
                    "value",
                )
                else str(
                    call.call_type
                    or ""
                ).lower()
            )

            mobile_status = (
                call.mobile_status.value
                if hasattr(
                    call.mobile_status,
                    "value",
                )
                else str(
                    call.mobile_status
                    or ""
                ).lower()
            )

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
        }

    # =========================================================
    # GET APPLICATION COUNT
    # =========================================================

    @staticmethod
    def _get_application_count(
        db: Session,
        employee_id: int,
        from_date: date,
        to_date: date,
    ) -> int:

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
                        LoanApplication.id
                    )
                )
                .filter(
                    LoanApplication.agent_id
                    == employee_id,
                    LoanApplication.deleted_at.is_(None),
                    LoanApplication.created_at
                    >= start_datetime,
                    LoanApplication.created_at
                    < end_datetime,
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
        from_date: date,
        to_date: date,
    ) -> int:

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

        assignment_phone_expression = (
            CallAnalyticsPerformanceService
            ._phone_sql_expression(
                CallAssignment.phone_number
            )
        )

        application_phone_expression = (
            CallAnalyticsPerformanceService
            ._phone_sql_expression(
                LoanApplication.phone
            )
        )

        query = (
            db.query(
                func.count(
                    func.distinct(
                        assignment_phone_expression
                    )
                )
            )
            .select_from(
                CallAssignment
            )
            .join(
                LoanApplication,
                application_phone_expression
                == assignment_phone_expression,
            )
            .filter(
                CallAssignment.assigned_to_id
                == employee_id,
                CallAssignment.deleted_at.is_(None),
                CallAssignment.created_at
                >= start_datetime,
                CallAssignment.created_at
                < end_datetime,
                LoanApplication.deleted_at.is_(None),
                LoanApplication.created_at
                >= CallAssignment.created_at,
            )
        )

        return int(
            query.scalar()
            or 0
        )

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

        if not employee:

            raise PermissionError(
                "Authenticated employee is required."
            )

        # =====================================================
        # DATE DEFAULT
        # =====================================================

        if (
            from_date is None
            and to_date is None
        ):

            (
                from_date,
                to_date,
            ) = (
                CallAnalyticsPerformanceService
                ._get_current_month_dates()
            )

        elif from_date is None:

            from_date = to_date

        elif to_date is None:

            to_date = from_date

        if from_date > to_date:

            raise ValueError(
                "from_date cannot be greater than to_date."
            )

        # =====================================================
        # VISIBLE AGENTS
        # =====================================================

        agent_context_map = (
            CallAnalyticsPerformanceService
            ._get_agent_context_map(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not agent_context_map:

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

        visible_employee_ids = set(
            agent_context_map.keys()
        )

        # =====================================================
        # EMPLOYEE FILTER
        # =====================================================

        if employee_id is not None:

            if (
                employee_id
                not in visible_employee_ids
            ):

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
        # AGENT RESULTS
        # =====================================================

        agents = []

        # =====================================================
        # SUMMARY ACCUMULATORS
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
        agents_with_talk = 0

        # =====================================================
        # BUILD AGENT PERFORMANCE
        # =====================================================

        for agent in employees:

            agent_context = (
                agent_context_map.get(
                    agent.id
                )
            )

            context_details = (
                CallAnalyticsPerformanceService
                ._get_employee_context_details(
                    db=db,
                    employee_context=agent_context,
                )
            )

            # -------------------------------------------------
            # CALL METRICS
            # -------------------------------------------------

            call_metrics = (
                CallAnalyticsPerformanceService
                ._get_call_metrics(
                    db=db,
                    employee_id=agent.id,
                    from_date=from_date,
                    to_date=to_date,
                    direction=direction,
                    status=status,
                )
            )

            # -------------------------------------------------
            # APPLICATIONS
            # -------------------------------------------------

            applications = (
                CallAnalyticsPerformanceService
                ._get_application_count(
                    db=db,
                    employee_id=agent.id,
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
                    from_date=from_date,
                    to_date=to_date,
                )
            )

            # -------------------------------------------------
            # TOTAL CALLS
            # -------------------------------------------------

            total_agent_calls = (
                call_metrics["incoming"]
                + call_metrics["outgoing"]
            )

            # -------------------------------------------------
            # AGENT RESULT
            # -------------------------------------------------

            agents.append(
                {
                    "id": agent.id,
                    "name": agent.name,

                    "teamId": context_details[
                        "team_id"
                    ],

                    "team": context_details[
                        "team"
                    ],

                    "rmId": context_details[
                        "rm_id"
                    ],

                    "rmName": context_details[
                        "rm_name"
                    ],

                    "incoming": call_metrics[
                        "incoming"
                    ],

                    "outgoing": call_metrics[
                        "outgoing"
                    ],

                    "answered": call_metrics[
                        "answered"
                    ],

                    "missed": call_metrics[
                        "missed"
                    ],

                    "applications": applications,

                    "converted": converted,

                    "assignments": assignments,

                    "callsHandled": assignments,

                    "totalCalls": total_agent_calls,

                    "avgTalkSeconds": call_metrics[
                        "avg_talk_seconds"
                    ],

                    "status": (
                        agent.status
                        if agent.status is not None
                        else "active"
                    ),
                }
            )

            # -------------------------------------------------
            # SUMMARY
            # -------------------------------------------------

            total_assignments += assignments
            total_calls += total_agent_calls
            total_incoming += call_metrics[
                "incoming"
            ]
            total_outgoing += call_metrics[
                "outgoing"
            ]
            total_answered += call_metrics[
                "answered"
            ]
            total_missed += call_metrics[
                "missed"
            ]
            total_applications += applications
            total_converted += converted

            if call_metrics[
                "avg_talk_seconds"
            ] > 0:

                total_talk_seconds += (
                    call_metrics[
                        "avg_talk_seconds"
                    ]
                )

                agents_with_talk += 1

        # =====================================================
        # SUMMARY AVERAGE
        # =====================================================

        avg_talk_seconds = (
            round(
                total_talk_seconds
                / agents_with_talk
            )
            if agents_with_talk
            else 0
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "summary": {
                "totalAgents": len(agents),
                "totalAssignments": total_assignments,
                "totalCalls": total_calls,
                "totalIncoming": total_incoming,
                "totalOutgoing": total_outgoing,
                "totalAnswered": total_answered,
                "totalMissed": total_missed,
                "totalApplications": total_applications,
                "totalConverted": total_converted,
                "avgTalkSeconds": avg_talk_seconds,
            },
            "agents": agents,
        }