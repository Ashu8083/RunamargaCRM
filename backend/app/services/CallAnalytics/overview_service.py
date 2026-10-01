# backend/app/services/CallAnalytics/overview_service.py

from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.core.access_control import AccessControl
from app.models.call_assignments import CallAssignment
from app.models.call_logs import CallLog
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication


class CallAnalyticsOverviewService:
    """
    Call Analytics Overview Service.

    Classification rules:

    UNKNOWN
    -------
    A call is UNKNOWN when:

        1. The call was MISSED / unattended
        2. There is no matching active CallAssignment
        3. The phone number does not exist in LoanApplication

    ASSIGNED
    --------
    A call is ASSIGNED when its normalized phone number exists
    in an active CallAssignment.

    CONVERTED
    ---------
    A call is CONVERTED when its normalized phone number exists
    in LoanApplication.

    A phone number that exists in LoanApplication is considered
    converted even if it also has a CallAssignment.

    A phone number that is assigned but does not exist in
    LoanApplication is ASSIGNED.

    A fresh/unhandled missed number that is neither assigned nor
    present in LoanApplication is UNKNOWN.

    Visibility is handled only through AccessControl.

    DEFAULT DATE BEHAVIOR:
        If no from_date and no to_date are supplied,
        ONLY TODAY'S DATA is returned.
    """

    # =========================================================
    # EMPTY RESPONSE
    # =========================================================

    @staticmethod
    def _empty_response() -> dict:
        return {
            "summary": {
                "total": 0,
                "answered": 0,
                "missed": 0,
                "unknown": 0,
                "assigned": 0,
                "converted": 0,
            },
            "calls": [],
        }

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _get_default_dates() -> tuple[date, date]:

        today = date.today()

        return today, today

    @staticmethod
    def _get_date_bounds(
        from_date: date,
        to_date: date,
    ) -> tuple[datetime, datetime]:

        start_datetime = datetime.combine(
            from_date,
            time.min,
        )

        end_datetime = datetime.combine(
            to_date + timedelta(days=1),
            time.min,
        )

        return start_datetime, end_datetime

    # =========================================================
    # ACTIVE CONTEXT
    # =========================================================

    @staticmethod
    def _get_active_context(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[EmployeeContext]:

        return AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

    # =========================================================
    # CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def _get_context_family(
        context: Optional[EmployeeContext],
    ) -> Optional[str]:

        if not context:
            return None

        if not context.context:
            return None

        return AccessControl.get_context_family(
            context.context.code
        )

    # =========================================================
    # CONTEXT IDS
    # =========================================================

    @staticmethod
    def _get_context_ids(
        contexts,
    ) -> list[int]:

        return [
            int(context.id)
            for context in (contexts or [])
            if context is not None
            and context.id is not None
        ]

    # =========================================================
    # VISIBLE AGENTS
    # =========================================================

    @staticmethod
    def _get_visible_agent_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[int]:

        contexts = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return (
            CallAnalyticsOverviewService
            ._get_context_ids(
                contexts
            )
        )

    # =========================================================
    # VISIBLE RMS
    # =========================================================

    @staticmethod
    def _get_visible_rm_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[int]:

        contexts = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return (
            CallAnalyticsOverviewService
            ._get_context_ids(
                contexts
            )
        )

    # =========================================================
    # COMBINED VISIBLE CALL CONTEXTS
    # =========================================================

    @staticmethod
    def _get_visible_call_context_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[int]:

        visible_agent_ids = (
            CallAnalyticsOverviewService
            ._get_visible_agent_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        visible_rm_ids = (
            CallAnalyticsOverviewService
            ._get_visible_rm_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        combined_ids = []

        seen_ids = set()

        for employee_context_id in [
            *visible_agent_ids,
            *visible_rm_ids,
        ]:

            if employee_context_id in seen_ids:
                continue

            seen_ids.add(
                employee_context_id
            )

            combined_ids.append(
                employee_context_id
            )

        return combined_ids

    # =========================================================
    # VISIBLE EMPLOYEE CONTEXTS
    # =========================================================

    @staticmethod
    def _get_visible_employee_contexts(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:

        visible_agent_contexts = (
            AccessControl.get_visible_agents(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        visible_rm_contexts = (
            AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        contexts = []

        seen_ids = set()

        for employee_context in [
            *(visible_agent_contexts or []),
            *(visible_rm_contexts or []),
        ]:

            if not employee_context:
                continue

            if employee_context.id is None:
                continue

            if employee_context.id in seen_ids:
                continue

            seen_ids.add(
                employee_context.id
            )

            contexts.append(
                employee_context
            )

        return contexts

    # =========================================================
    # SELECTED EMPLOYEE CONTEXT IDS
    # =========================================================

    @staticmethod
    def _get_selected_employee_context_ids(
        visible_contexts: list[EmployeeContext],
        employee_id: Optional[int],
    ) -> list[int]:

        if employee_id is None:

            return [
                int(context.id)
                for context in visible_contexts
                if context.id is not None
            ]

        return [
            int(context.id)
            for context in visible_contexts
            if (
                context.id is not None
                and context.employee_id == employee_id
            )
        ]

    # =========================================================
    # DATE RESOLUTION
    # =========================================================

    @staticmethod
    def _resolve_dates(
        from_date: Optional[date],
        to_date: Optional[date],
    ) -> tuple[date, date]:

        if (
            from_date is None
            and to_date is None
        ):

            return (
                CallAnalyticsOverviewService
                ._get_default_dates()
            )

        if from_date is None:

            from_date = to_date.replace(
                day=1
            )

        if to_date is None:

            to_date = date.today()

        if from_date > to_date:

            raise ValueError(
                "from_date cannot be greater than to_date."
            )

        return from_date, to_date

    # =========================================================
    # CALL QUERY
    # =========================================================

    @staticmethod
    def _build_call_query(
        db: Session,
        context_ids: list[int],
        from_date: date,
        to_date: date,
        call_type: Optional[str] = None,
        status: Optional[str] = None,
    ):

        if not context_ids:

            return (
                db.query(CallLog)
                .filter(False)
            )

        start_datetime, end_datetime = (
            CallAnalyticsOverviewService
            ._get_date_bounds(
                from_date=from_date,
                to_date=to_date,
            )
        )

        query = (
            db.query(CallLog)
            .options(
                joinedload(
                    CallLog.employee_context
                ).joinedload(
                    EmployeeContext.employee
                )
            )
            .filter(
                CallLog.employee_context_id.in_(
                    context_ids
                ),
                CallLog.call_started_at >= start_datetime,
                CallLog.call_started_at < end_datetime,
            )
        )

        if call_type:

            query = query.filter(
                CallLog.call_type == call_type
            )

        if status:

            query = query.filter(
                CallLog.mobile_status == status
            )

        return query

    # =========================================================
    # NORMALIZE PHONE
    # =========================================================

    @staticmethod
    def _normalize_phone(
        phone_number: Optional[str],
    ) -> Optional[str]:

        if not phone_number:
            return None

        value = "".join(
            character
            for character in str(phone_number)
            if character.isdigit()
        )

        if not value:
            return None

        if len(value) > 10:

            value = value[-10:]

        return value

    # =========================================================
    # GET ACTIVE ASSIGNED NUMBERS
    # =========================================================

    @staticmethod
    def _get_assigned_phone_numbers(
        db: Session,
        phone_numbers: set[str],
    ) -> set[str]:
        """
        Return normalized phone numbers that have an active
        CallAssignment.

        deleted_at IS NULL = active assignment.

        Only requested phone numbers are checked.
        """

        if not phone_numbers:
            return set()

        rows = (
            db.query(
                CallAssignment.phone_number
            )
            .filter(
                CallAssignment.phone_number.isnot(None),
                CallAssignment.deleted_at.is_(None),
            )
            .all()
        )

        assigned_numbers = set()

        for row in rows:

            normalized = (
                CallAnalyticsOverviewService
                ._normalize_phone(
                    row.phone_number
                )
            )

            if (
                normalized
                and normalized in phone_numbers
            ):

                assigned_numbers.add(
                    normalized
                )

        return assigned_numbers

    # =========================================================
    # GET APPLICATION PHONE NUMBERS
    # =========================================================

    @staticmethod
    def _get_application_phone_numbers(
        db: Session,
        phone_numbers: set[str],
    ) -> set[str]:
        """
        Return normalized phone numbers that already exist
        in loan_applications.

        Only non-deleted applications are considered.

        Matching is performed against:

            LoanApplication.phone

        and:

            LoanApplication.alternate_phone
        """

        if not phone_numbers:

            return set()

        rows = (
            db.query(
                LoanApplication.phone,
                LoanApplication.alternate_phone,
            )
            .filter(
                LoanApplication.deleted_at.is_(None),
                or_(
                    LoanApplication.phone.isnot(None),
                    LoanApplication.alternate_phone.isnot(None),
                ),
            )
            .all()
        )

        application_numbers = set()

        for row in rows:

            phone = (
                CallAnalyticsOverviewService
                ._normalize_phone(
                    row.phone
                )
            )

            alternate_phone = (
                CallAnalyticsOverviewService
                ._normalize_phone(
                    row.alternate_phone
                )
            )

            if (
                phone
                and phone in phone_numbers
            ):

                application_numbers.add(
                    phone
                )

            if (
                alternate_phone
                and alternate_phone in phone_numbers
            ):

                application_numbers.add(
                    alternate_phone
                )

        return application_numbers

    # =========================================================
    # PHONE CLASSIFICATION
    # =========================================================

    @staticmethod
    def _get_phone_classification(
        db: Session,
        calls: list[CallLog],
    ) -> dict:
        """
        Classify every call phone number.

        Priority:

            CONVERTED
                phone exists in LoanApplication

            ASSIGNED
                phone exists in active CallAssignment

            UNKNOWN
                phone exists in neither

        The classification is based on phone number.

        This allows the same classification to be used for
        every CallLog row having that number.
        """

        normalized_numbers = set()

        for call in calls:

            normalized = (
                CallAnalyticsOverviewService
                ._normalize_phone(
                    call.phone_number
                )
            )

            if normalized:

                normalized_numbers.add(
                    normalized
                )

        if not normalized_numbers:

            return {
                "assigned_numbers": set(),
                "converted_numbers": set(),
                "unknown_numbers": set(),
            }

        assigned_numbers = (
            CallAnalyticsOverviewService
            ._get_assigned_phone_numbers(
                db=db,
                phone_numbers=normalized_numbers,
            )
        )

        converted_numbers = (
            CallAnalyticsOverviewService
            ._get_application_phone_numbers(
                db=db,
                phone_numbers=normalized_numbers,
            )
        )

        unknown_numbers = (
            normalized_numbers
            - assigned_numbers
            - converted_numbers
        )

        return {
            "assigned_numbers":
                assigned_numbers,

            "converted_numbers":
                converted_numbers,

            "unknown_numbers":
                unknown_numbers,
        }

    # =========================================================
    # PHONE SUMMARY
    # =========================================================

    @staticmethod
    def _get_phone_summary(
        db: Session,
        calls: list[CallLog],
    ) -> dict:
        """
        Calculate:

            unknown
            assigned
            converted

        Converted has priority over assigned.

        Therefore:

            application exists
                -> converted

            no application
                + assignment exists
                -> assigned

            no application
                + no assignment
                -> unknown
        """

        classification = (
            CallAnalyticsOverviewService
            ._get_phone_classification(
                db=db,
                calls=calls,
            )
        )

        assigned_numbers = (
            classification[
                "assigned_numbers"
            ]
        )

        converted_numbers = (
            classification[
                "converted_numbers"
            ]
        )

        unknown_numbers = (
            classification[
                "unknown_numbers"
            ]
        )

        unknown = 0
        assigned = 0
        converted = 0

        for call in calls:

            normalized = (
                CallAnalyticsOverviewService
                ._normalize_phone(
                    call.phone_number
                )
            )

            if not normalized:

                unknown += 1

                continue

            if normalized in converted_numbers:

                converted += 1

            elif normalized in assigned_numbers:

                assigned += 1

            elif normalized in unknown_numbers:

                unknown += 1

        return {
            "unknown": unknown,
            "assigned": assigned,
            "converted": converted,
        }

    # =========================================================
    # ENUM VALUE
    # =========================================================

    @staticmethod
    def _enum_value(
        value,
    ) -> Optional[str]:

        if value is None:
            return None

        raw_value = getattr(
            value,
            "value",
            None,
        )

        if raw_value is not None:

            return str(
                raw_value
            ).lower()

        value_string = str(
            value
        )

        if "." in value_string:

            value_string = (
                value_string
                .split(".")[-1]
            )

        return value_string.lower()

    # =========================================================
    # SUMMARY
    # =========================================================

    @staticmethod
    def _build_summary(
        db: Session,
        calls: list[CallLog],
    ) -> dict:

        total = len(
            calls
        )

        answered = 0
        missed = 0

        for call in calls:

            status = (
                CallAnalyticsOverviewService
                ._enum_value(
                    call.mobile_status
                )
            )

            if status == "received":

                answered += 1

            elif status == "missed":

                missed += 1

        phone_summary = (
            CallAnalyticsOverviewService
            ._get_phone_summary(
                db=db,
                calls=calls,
            )
        )

        return {
            "total": total,
            "answered": answered,
            "missed": missed,
            "unknown": phone_summary[
                "unknown"
            ],
            "assigned": phone_summary[
                "assigned"
            ],
            "converted": phone_summary[
                "converted"
            ],
        }

    # =========================================================
    # EMPLOYEE NAME
    # =========================================================

    @staticmethod
    def _get_employee_name(
        employee: Optional[Employee],
    ) -> str:

        if not employee:

            return "Unknown Employee"

        name = getattr(
            employee,
            "name",
            None,
        )

        if name:

            return str(
                name
            )

        first_name = getattr(
            employee,
            "first_name",
            None,
        ) or ""

        last_name = getattr(
            employee,
            "last_name",
            None,
        ) or ""

        full_name = (
            f"{first_name} {last_name}"
        ).strip()

        if full_name:

            return full_name

        return "Unknown Employee"

    # =========================================================
    # CALL RECORDS
    # =========================================================

    @staticmethod
    def _build_call_records(
        db: Session,
        calls: list[CallLog],
    ) -> list[dict]:
        """
        Build frontend call records.

        Every record also receives:

            assigned
            converted
            unknown

        based on CallAssignment and LoanApplication.
        """

        classification = (
            CallAnalyticsOverviewService
            ._get_phone_classification(
                db=db,
                calls=calls,
            )
        )

        assigned_numbers = (
            classification[
                "assigned_numbers"
            ]
        )

        converted_numbers = (
            classification[
                "converted_numbers"
            ]
        )

        unknown_numbers = (
            classification[
                "unknown_numbers"
            ]
        )

        records = []

        for call in calls:

            employee_context = (
                call.employee_context
            )

            employee = (
                employee_context.employee
                if employee_context
                else None
            )

            normalized_phone = (
                CallAnalyticsOverviewService
                ._normalize_phone(
                    call.phone_number
                )
            )

            is_converted = (
                normalized_phone is not None
                and normalized_phone
                in converted_numbers
            )

            is_assigned = (
                not is_converted
                and normalized_phone is not None
                and normalized_phone
                in assigned_numbers
            )

            is_unknown = (
                not is_converted
                and not is_assigned
                and (
                    normalized_phone is None
                    or normalized_phone
                    in unknown_numbers
                )
            )

            records.append(
                {
                    "id":
                        call.id,

                    "employee_id":
                        (
                            employee_context.employee_id
                            if employee_context
                            else None
                        ),

                    "employee":
                        CallAnalyticsOverviewService
                        ._get_employee_name(
                            employee
                        ),

                    "employee_context_id":
                        (
                            employee_context.id
                            if employee_context
                            else None
                        ),

                    "phone_number":
                        call.phone_number,

                    "call_type":
                        CallAnalyticsOverviewService
                        ._enum_value(
                            call.call_type
                        ),

                    "mobile_status":
                        CallAnalyticsOverviewService
                        ._enum_value(
                            call.mobile_status
                        ),

                    "call_started_at":
                        call.call_started_at,

                    "call_ended_at":
                        call.call_ended_at,

                    "duration_seconds":
                        call.duration_seconds,

                    # -----------------------------------------
                    # ANALYTICS CLASSIFICATION
                    # -----------------------------------------

                    "assigned":
                        is_assigned,

                    "is_assigned":
                        is_assigned,

                    "converted":
                        is_converted,

                    "is_converted":
                        is_converted,

                    "unknown":
                        is_unknown,

                    "is_unknown":
                        is_unknown,
                }
            )

        return records

    # =========================================================
    # MAIN OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(
        db: Session,
        employee: Employee,
        employee_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        call_type: Optional[str] = None,
        status: Optional[str] = None,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
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
            CallAnalyticsOverviewService
            ._resolve_dates(
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # ACTIVE CONTEXT
        # =====================================================

        active_context = (
            CallAnalyticsOverviewService
            ._get_active_context(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not active_context:

            raise PermissionError(
                "No active EmployeeContext found for the authenticated employee."
            )

        # =====================================================
        # VISIBLE AGENTS
        # =====================================================

        visible_agent_ids = (
            CallAnalyticsOverviewService
            ._get_visible_agent_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        # =====================================================
        # VISIBLE RMS
        # =====================================================

        visible_rm_ids = (
            CallAnalyticsOverviewService
            ._get_visible_rm_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        # =====================================================
        # COMBINED CALL CONTEXTS
        # =====================================================

        visible_call_context_ids = (
            CallAnalyticsOverviewService
            ._get_visible_call_context_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        if not visible_call_context_ids:

            return (
                CallAnalyticsOverviewService
                ._empty_response()
            )

        # =====================================================
        # SELECTED EMPLOYEE
        # =====================================================

        visible_contexts = (
            CallAnalyticsOverviewService
            ._get_visible_employee_contexts(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        selected_context_ids = (
            CallAnalyticsOverviewService
            ._get_selected_employee_context_ids(
                visible_contexts=visible_contexts,
                employee_id=employee_id,
            )
        )

        # =====================================================
        # NO MATCHING EMPLOYEE
        # =====================================================

        if not selected_context_ids:

            return (
                CallAnalyticsOverviewService
                ._empty_response()
            )

        # =====================================================
        # ADDITIONAL SECURITY CHECK
        # =====================================================

        selected_context_ids = [
            context_id_value
            for context_id_value
            in selected_context_ids
            if context_id_value
            in visible_call_context_ids
        ]

        if not selected_context_ids:

            return (
                CallAnalyticsOverviewService
                ._empty_response()
            )

        # =====================================================
        # CALL QUERY
        # =====================================================

        query = (
            CallAnalyticsOverviewService
            ._build_call_query(
                db=db,
                context_ids=selected_context_ids,
                from_date=from_date,
                to_date=to_date,
                call_type=call_type,
                status=status,
            )
        )

        # =====================================================
        # ORDER
        # =====================================================

        query = query.order_by(
            CallLog.call_started_at.asc()
        )

        # =====================================================
        # EXECUTE
        # =====================================================

        calls = query.all()

        # =====================================================
        # SUMMARY
        # =====================================================

        summary = (
            CallAnalyticsOverviewService
            ._build_summary(
                db=db,
                calls=calls,
            )
        )

        # =====================================================
        # RECORDS
        # =====================================================

        records = (
            CallAnalyticsOverviewService
            ._build_call_records(
                db=db,
                calls=calls,
            )
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "summary": summary,
            "calls": records,
        }


# =============================================================
# FUNCTION COMPATIBILITY WRAPPER
# =============================================================

def get_overview(
    db: Session,
    employee: Employee,
    employee_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    call_type: Optional[str] = None,
    status: Optional[str] = None,
    context_id: Optional[int] = None,
    team_lead_context_id: Optional[int] = None,
) -> dict:

    return (
        CallAnalyticsOverviewService
        .get_overview(
            db=db,
            employee=employee,
            employee_id=employee_id,
            from_date=from_date,
            to_date=to_date,
            call_type=call_type,
            status=status,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )
    )