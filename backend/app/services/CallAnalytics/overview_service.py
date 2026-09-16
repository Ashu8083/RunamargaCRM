# backend/app/services/CallAnalytics/overview_service.py

import calendar
import re
from datetime import date, datetime, time
from typing import Optional

from sqlalchemy import and_, distinct, func, or_
from sqlalchemy.orm import Session

from app.models.call_assignments import CallAssignment
from app.models.call_logs import CallLog
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication


class CallAnalyticsOverviewService:
    """
    Call Analytics Overview business logic.

    Responsibilities:
    - Apply current-month default when no date filter is supplied.
    - Apply explicit date filters when supplied.
    - Apply employee filter.
    - Apply call direction filter.
    - Apply call status filter.
    - Apply hierarchy visibility based on EmployeeContext.
    - Calculate total / answered / missed / unknown / assigned / converted.
    - Return call activity records.

    Important:
    EmployeeContext.reports_to_id points to EmployeeContext.id,
    not Employee.id.

    AccessControl is intentionally NOT used here so the existing
    AccessControl implementation remains unchanged.
    """

    # =========================================================
    # PHONE NORMALIZATION
    # =========================================================

    @staticmethod
    def _normalize_phone(phone: Optional[str]) -> Optional[str]:
        """
        Normalize a phone number to its last 10 digits.

        This keeps matching consistent between:
        - call_logs.phone_number
        - call_assignments.phone_number
        - loan_applications.phone
        """

        if phone is None:
            return None

        digits = re.sub(r"\D", "", str(phone))

        if not digits:
            return None

        if len(digits) > 10:
            digits = digits[-10:]

        return digits

    @staticmethod
    def _phone_sql_expression(column):
        """
        PostgreSQL expression that normalizes a phone column
        to its last 10 digits.
        """

        digits_expression = func.regexp_replace(
            column,
            r"\D",
            "",
            "g",
        )

        return func.right(digits_expression, 10)

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _date_start(value: Optional[date]) -> Optional[datetime]:
        if value is None:
            return None

        return datetime.combine(
            value,
            time.min,
        )

    @staticmethod
    def _date_end(value: Optional[date]) -> Optional[datetime]:
        if value is None:
            return None

        return datetime.combine(
            value,
            time.max,
        )

    @staticmethod
    def _get_current_month_dates() -> tuple[date, date]:
        """
        Return the first and last date of the current month.
        """

        today = date.today()

        first_day = today.replace(day=1)

        last_day = calendar.monthrange(
            today.year,
            today.month,
        )[1]

        last_date = today.replace(
            day=last_day,
        )

        return first_day, last_date

    # =========================================================
    # CONTEXT / ROLE HELPERS
    # =========================================================

    @staticmethod
    def _get_active_employee_context(
        db: Session,
        employee_id: int,
        context_id: Optional[int] = None,
    ) -> Optional[EmployeeContext]:
        """
        Resolve the active EmployeeContext for an employee.

        If context_id is supplied, it is treated as the
        EmployeeContext id first, and then as the Context id
        for compatibility with existing callers.
        """

        query = (
            db.query(EmployeeContext)
            .join(
                Context,
                EmployeeContext.context_id == Context.id,
            )
            .filter(
                EmployeeContext.employee_id == employee_id,
                EmployeeContext.is_active.is_(True),
                Context.is_active.is_(True),
            )
        )

        if context_id is not None:
            context = (
                query
                .filter(
                    EmployeeContext.id == context_id
                )
                .first()
            )

            if context:
                return context

            context = (
                query
                .filter(
                    EmployeeContext.context_id == context_id
                )
                .first()
            )

            if context:
                return context

        default_context = (
            query
            .filter(
                EmployeeContext.is_default.is_(True)
            )
            .first()
        )

        if default_context:
            return default_context

        return query.first()

    @staticmethod
    def _get_context_family(
        context_code: Optional[str],
    ) -> Optional[str]:
        """
        Resolve the operational role family from Context.code.

        Examples:
        AGENT_PERSONAL -> AGENT
        AGENT_BUSINESS -> AGENT
        RM_SENIOR      -> RM
        TEAMLEAD_NORTH -> TEAMLEAD
        TEAM_LEAD      -> TEAMLEAD
        MANAGER_OPS    -> MANAGER
        """

        if not context_code:
            return None

        code = str(context_code).strip().upper()

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
            code == "TEAMLEAD"
            or code.startswith("TEAMLEAD_")
            or code == "TEAM_LEAD"
            or code.startswith("TEAM_LEAD_")
        ):
            return "TEAMLEAD"

        if (
            code == "MANAGER"
            or code.startswith("MANAGER_")
        ):
            return "MANAGER"

        return None

    @staticmethod
    def _get_visible_employee_ids(
        db: Session,
        employee_id: int,
        context_id: Optional[int] = None,
    ) -> Optional[list[int]]:
        """
        Determine which employee IDs are allowed to appear in
        Call Analytics.

        GLOBAL / MANAGER:
            All active employees.

        AGENT / RM:
            Only the logged-in employee.

        TEAMLEAD:
            The logged-in Team Lead plus employees whose
            EmployeeContext.reports_to_id points to the
            Team Lead's EmployeeContext.id.

        IMPORTANT:
            reports_to_id references employee_contexts.id.
        """

        employee = (
            db.query(Employee)
            .filter(
                Employee.id == employee_id,
                Employee.status == "active",
            )
            .first()
        )

        if not employee:
            return []

        context = (
            CallAnalyticsOverviewService
            ._get_active_employee_context(
                db=db,
                employee_id=employee.id,
                context_id=context_id,
            )
        )

        if not context or not context.context:
            return []

        family = (
            CallAnalyticsOverviewService
            ._get_context_family(
                context.context.code
            )
        )

        # -----------------------------------------------------
        # GLOBAL
        # -----------------------------------------------------

        if family == "GLOBAL":
            return None

        # -----------------------------------------------------
        # MANAGER
        # -----------------------------------------------------

        if family == "MANAGER":
            return None

        # -----------------------------------------------------
        # AGENT / RM
        # -----------------------------------------------------

        if family in {"AGENT", "RM"}:
            return [employee.id]

        # -----------------------------------------------------
        # TEAM LEAD
        # -----------------------------------------------------

        if family == "TEAMLEAD":
            visible_ids = {employee.id}

            subordinate_ids = (
                db.query(EmployeeContext.employee_id)
                .filter(
                    EmployeeContext.reports_to_id == context.id,
                    EmployeeContext.is_active.is_(True),
                )
                .all()
            )

            for row in subordinate_ids:
                if row[0] is not None:
                    visible_ids.add(row[0])

            return list(visible_ids)

        # -----------------------------------------------------
        # UNKNOWN ROLE
        # -----------------------------------------------------

        return []

    # =========================================================
    # CALL SCOPE
    # =========================================================

    @staticmethod
    def _build_call_conditions(
        employee_ids: Optional[list[int]],
        employee_id: Optional[int],
        from_date: Optional[date],
        to_date: Optional[date],
        call_type: Optional[str],
        status: Optional[str],
    ):
        """
        Build the common CallLog conditions.

        employee_ids:
            Hierarchy-authorized employee IDs.

        employee_id:
            Explicit EmployeeDropdown selection.
        """

        conditions = []

        # -----------------------------------------------------
        # Hierarchy scope
        # -----------------------------------------------------

        if employee_ids is not None:
            if not employee_ids:
                conditions.append(False)
            else:
                conditions.append(
                    CallLog.employee_id.in_(employee_ids)
                )

        # -----------------------------------------------------
        # Employee filter
        # -----------------------------------------------------

        if employee_id is not None:
            conditions.append(
                CallLog.employee_id == employee_id
            )

        # -----------------------------------------------------
        # Date filter
        # -----------------------------------------------------

        if from_date is not None:
            conditions.append(
                CallLog.call_started_at
                >= CallAnalyticsOverviewService._date_start(
                    from_date
                )
            )

        if to_date is not None:
            conditions.append(
                CallLog.call_started_at
                <= CallAnalyticsOverviewService._date_end(
                    to_date
                )
            )

        # -----------------------------------------------------
        # Call direction
        # -----------------------------------------------------

        if call_type:
            conditions.append(
                CallLog.call_type == call_type
            )

        # -----------------------------------------------------
        # Call status
        # -----------------------------------------------------

        if status:
            conditions.append(
                CallLog.mobile_status == status
            )

        return conditions

    # =========================================================
    # MAIN OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(
        db: Session,
        employee_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        call_type: Optional[str] = None,
        status: Optional[str] = None,
        logged_in_employee_id: Optional[int] = None,
        context_id: Optional[int] = None,
    ) -> dict:
        """
        Get Call Analytics Overview.

        Date behavior:
        - No from_date AND no to_date:
            current month is automatically selected.
        - Explicit dates:
            use the supplied dates.
        - Other filters do not disable the current-month default.

        Employee behavior:
        - employee_id is the selected EmployeeDropdown ID.
        - logged_in_employee_id is the authenticated employee.
        - hierarchy scope is applied from the authenticated
          employee's EmployeeContext.
        """

        # =====================================================
        # CURRENT MONTH DEFAULT
        # =====================================================

        if from_date is None and to_date is None:
            from_date, to_date = (
                CallAnalyticsOverviewService
                ._get_current_month_dates()
            )

        # If only from_date is supplied, keep it.
        # If only to_date is supplied, keep it.

        # =====================================================
        # HIERARCHY
        # =====================================================

        visible_employee_ids = None

        if logged_in_employee_id is not None:
            visible_employee_ids = (
                CallAnalyticsOverviewService
                ._get_visible_employee_ids(
                    db=db,
                    employee_id=logged_in_employee_id,
                    context_id=context_id,
                )
            )

        # =====================================================
        # CALL CONDITIONS
        # =====================================================

        call_conditions = (
            CallAnalyticsOverviewService
            ._build_call_conditions(
                employee_ids=visible_employee_ids,
                employee_id=employee_id,
                from_date=from_date,
                to_date=to_date,
                call_type=call_type,
                status=status,
            )
        )

        # =====================================================
        # BASE QUERY
        # =====================================================

        base_query = db.query(CallLog)

        if call_conditions:
            base_query = base_query.filter(
                and_(*call_conditions)
            )

        # =====================================================
        # SUMMARY
        # =====================================================

        total = (
            base_query
            .with_entities(
                func.count(CallLog.id)
            )
            .scalar()
            or 0
        )

        answered = (
            base_query
            .filter(
                CallLog.mobile_status == "received"
            )
            .with_entities(
                func.count(CallLog.id)
            )
            .scalar()
            or 0
        )

        missed = (
            base_query
            .filter(
                CallLog.mobile_status == "missed"
            )
            .with_entities(
                func.count(CallLog.id)
            )
            .scalar()
            or 0
        )

        unknown = (
            CallAnalyticsOverviewService
            ._get_unknown_count(
                db=db,
                call_conditions=call_conditions,
            )
        )

        assigned = (
            CallAnalyticsOverviewService
            ._get_assigned_count(
                db=db,
                call_conditions=call_conditions,
            )
        )

        converted = (
            CallAnalyticsOverviewService
            ._get_converted_count(
                db=db,
                call_conditions=call_conditions,
            )
        )

        # =====================================================
        # CALL RECORDS
        # =====================================================

        calls = (
            CallAnalyticsOverviewService
            ._get_call_records(
                db=db,
                call_conditions=call_conditions,
            )
        )

        return {
            "summary": {
                "total": int(total),
                "answered": int(answered),
                "missed": int(missed),
                "unknown": int(unknown),
                "assigned": int(assigned),
                "converted": int(converted),
            },
            "calls": calls,
        }

    # =========================================================
    # UNKNOWN
    # =========================================================

    @staticmethod
    def _get_unknown_count(
        db: Session,
        call_conditions,
    ) -> int:
        """
        Unknown calls are missed-call numbers that:
        - exist in the filtered call-log scope,
        - have no received callback,
        - are not present in call_assignments,
        - are not present in loan_applications.

        The number is counted distinctly by normalized phone.
        """

        missed_query = (
            db.query(
                distinct(
                    CallAnalyticsOverviewService
                    ._phone_sql_expression(
                        CallLog.phone_number
                    )
                )
            )
            .filter(
                CallLog.mobile_status == "missed"
            )
        )

        if call_conditions:
            missed_query = missed_query.filter(
                and_(*call_conditions)
            )

        missed_numbers = [
            row[0]
            for row in missed_query.all()
            if row[0]
        ]

        if not missed_numbers:
            return 0

        # -----------------------------------------------------
        # Remove numbers that have received calls.
        # -----------------------------------------------------

        received_numbers = {
            row[0]
            for row in (
                db.query(
                    distinct(
                        CallAnalyticsOverviewService
                        ._phone_sql_expression(
                            CallLog.phone_number
                        )
                    )
                )
                .filter(
                    CallLog.mobile_status == "received"
                )
                .filter(
                    CallAnalyticsOverviewService
                    ._phone_sql_expression(
                        CallLog.phone_number
                    ).in_(missed_numbers)
                )
                .all()
            )
            if row[0]
        }

        # -----------------------------------------------------
        # Remove assigned numbers.
        # -----------------------------------------------------

        assigned_numbers = {
            row[0]
            for row in (
                db.query(
                    distinct(
                        CallAnalyticsOverviewService
                        ._phone_sql_expression(
                            CallAssignment.phone_number
                        )
                    )
                )
                .filter(
                    CallAnalyticsOverviewService
                    ._phone_sql_expression(
                        CallAssignment.phone_number
                    ).in_(missed_numbers)
                )
                .filter(
                    CallAssignment.deleted_at.is_(None)
                )
                .all()
            )
            if row[0]
        }

        # -----------------------------------------------------
        # Remove converted numbers.
        # -----------------------------------------------------

        converted_numbers = {
            row[0]
            for row in (
                db.query(
                    distinct(
                        CallAnalyticsOverviewService
                        ._phone_sql_expression(
                            LoanApplication.phone
                        )
                    )
                )
                .filter(
                    CallAnalyticsOverviewService
                    ._phone_sql_expression(
                        LoanApplication.phone
                    ).in_(missed_numbers)
                )
                .filter(
                    LoanApplication.deleted_at.is_(None)
                )
                .all()
            )
            if row[0]
        }

        unknown_numbers = [
            phone
            for phone in missed_numbers
            if phone not in received_numbers
            and phone not in assigned_numbers
            and phone not in converted_numbers
        ]

        return len(unknown_numbers)

    # =========================================================
    # ASSIGNED
    # =========================================================

    @staticmethod
    def _get_assigned_count(
        db: Session,
        call_conditions,
    ) -> int:
        """
        Count distinct call-log phone numbers that exist in
        call_assignments.
        """

        call_numbers_query = (
            db.query(
                distinct(
                    CallAnalyticsOverviewService
                    ._phone_sql_expression(
                        CallLog.phone_number
                    )
                )
            )
        )

        if call_conditions:
            call_numbers_query = call_numbers_query.filter(
                and_(*call_conditions)
            )

        call_numbers = [
            row[0]
            for row in call_numbers_query.all()
            if row[0]
        ]

        if not call_numbers:
            return 0

        assigned_count = (
            db.query(
                func.count(
                    distinct(
                        CallAnalyticsOverviewService
                        ._phone_sql_expression(
                            CallAssignment.phone_number
                        )
                    )
                )
            )
            .filter(
                CallAnalyticsOverviewService
                ._phone_sql_expression(
                    CallAssignment.phone_number
                ).in_(call_numbers)
            )
            .filter(
                CallAssignment.deleted_at.is_(None)
            )
            .scalar()
            or 0
        )

        return int(assigned_count)

    # =========================================================
    # CONVERTED
    # =========================================================

    @staticmethod
    def _get_converted_count(
        db: Session,
        call_conditions,
    ) -> int:
        """
        Count loan applications whose normalized phone number
        matches a phone number in the filtered call-log scope.
        """

        call_numbers_query = (
            db.query(
                distinct(
                    CallAnalyticsOverviewService
                    ._phone_sql_expression(
                        CallLog.phone_number
                    )
                )
            )
        )

        if call_conditions:
            call_numbers_query = call_numbers_query.filter(
                and_(*call_conditions)
            )

        call_numbers = [
            row[0]
            for row in call_numbers_query.all()
            if row[0]
        ]

        if not call_numbers:
            return 0

        converted_count = (
            db.query(
                func.count(
                    LoanApplication.id
                )
            )
            .filter(
                CallAnalyticsOverviewService
                ._phone_sql_expression(
                    LoanApplication.phone
                ).in_(call_numbers)
            )
            .filter(
                LoanApplication.deleted_at.is_(None)
            )
            .scalar()
            or 0
        )

        return int(converted_count)

    # =========================================================
    # CALL RECORDS
    # =========================================================

    @staticmethod
    def _get_call_records(
        db: Session,
        call_conditions,
    ) -> list[dict]:
        """
        Return call records for the graph/table.
        """

        query = (
            db.query(CallLog)
            .order_by(
                CallLog.call_started_at.asc(),
                CallLog.id.asc(),
            )
        )

        if call_conditions:
            query = query.filter(
                and_(*call_conditions)
            )

        calls = query.all()

        records = []

        for call in calls:
            records.append(
                {
                    "id": int(call.id),
                    "employee_id": (
                        int(call.employee_id)
                        if call.employee_id is not None
                        else None
                    ),
                    "employee": (
                        call.employee.name
                        if call.employee
                        else None
                    ),
                    "phone_number": call.phone_number,
                    "call_type": (
                        call.call_type.value
                        if call.call_type
                        else None
                    ),
                    "mobile_status": (
                        call.mobile_status.value
                        if call.mobile_status
                        else None
                    ),
                    "call_started_at": (
                        call.call_started_at.isoformat()
                        if call.call_started_at
                        else None
                    ),
                    "call_ended_at": (
                        call.call_ended_at.isoformat()
                        if call.call_ended_at
                        else None
                    ),
                    "duration_seconds": (
                        int(call.duration_seconds)
                        if call.duration_seconds is not None
                        else None
                    ),
                }
            )

        return records