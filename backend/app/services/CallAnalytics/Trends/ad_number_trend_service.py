# Path: backend/app/services/CallAnalytics/Trends/ad_number_trend_service.py

from datetime import date, datetime, timedelta
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.call_logs import (
    CallLog,
    CallTypeEnum,
    MobileStatusEnum,
)
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.phone_numbers import PhoneNumber


class CallAnalyticsAdNumberTrendService:
    """
    Service for Call Analytics -> Call Trends -> Ad Number.

    Data visibility is controlled using the application's
    existing AccessControl hierarchy.

    Filters:

        team_lead_id
        rm_id
        phone_id
        from_date
        to_date

    Date behavior:

        No dates:
            current month

        Only from_date:
            from_date -> today

        Only to_date:
            first day of current month -> to_date
    """

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _get_current_month_range():
        today = date.today()

        start_date = today.replace(day=1)

        if start_date.month == 12:
            next_month = start_date.replace(
                year=start_date.year + 1,
                month=1,
                day=1,
            )
        else:
            next_month = start_date.replace(
                month=start_date.month + 1,
                day=1,
            )

        return start_date, next_month

    @staticmethod
    def _date_start(value: date) -> datetime:
        return datetime.combine(
            value,
            datetime.min.time(),
        )

    @staticmethod
    def _date_end(value: date) -> datetime:
        return datetime.combine(
            value + timedelta(days=1),
            datetime.min.time(),
        )

    # =========================================================
    # ACTIVE CONTEXT
    # =========================================================

    @staticmethod
    def _get_active_context(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ):
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
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Optional[str]:
        return AccessControl.get_active_context_family(
            db=db,
            employee=employee,
            context_id=context_id,
        )

    # =========================================================
    # VISIBLE EMPLOYEES
    # =========================================================

    @staticmethod
    def _get_visible_employee_ids(
        db: Session,
        employee: Employee,
        team_lead_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        context_id: Optional[int] = None,
    ) -> set[int]:
        """
        Resolve visible employees using the existing
        AccessControl hierarchy.

        Team Lead and RM filters are applied on top of the
        authenticated employee's visibility.
        """

        family = (
            CallAnalyticsAdNumberTrendService
            ._get_context_family(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not family:
            return set()

        active_context = (
            CallAnalyticsAdNumberTrendService
            ._get_active_context(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not active_context:
            return set()

        # -----------------------------------------------------
        # GLOBAL / MANAGER
        # -----------------------------------------------------

        if family in {"GLOBAL", "MANAGER"}:

            visible_rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
            )

            visible_agents = AccessControl.get_visible_agents(
                db=db,
                employee=employee,
                context_id=context_id,
            )

            visible_employee_ids = {
                item.id
                for item in visible_rms
            }

            visible_employee_ids.update(
                item.id
                for item in visible_agents
            )

            # Include authenticated employee where appropriate.
            visible_employee_ids.add(employee.id)

        # -----------------------------------------------------
        # TEAM LEAD
        # -----------------------------------------------------

        elif family == "TEAMLEAD":

            visible_rms = AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
            )

            visible_employee_ids = {
                item.id
                for item in visible_rms
            }

            # Team Lead itself is not normally the owner of
            # the phone number used by RM call analytics.
            #
            # The actual call data comes from visible RMs.

        # -----------------------------------------------------
        # RM
        # -----------------------------------------------------

        elif family == "RM":

            visible_employee_ids = {
                employee.id
            }

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        elif family == "AGENT":

            visible_employee_ids = {
                employee.id
            }

        else:
            return set()

        # =====================================================
        # TEAM LEAD FILTER
        # =====================================================

        if team_lead_id is not None:

            team_lead_contexts = (
                db.query(
                    EmployeeContext.id
                )
                .filter(
                    EmployeeContext.employee_id
                    == team_lead_id,
                    EmployeeContext.is_active.is_(True),
                    EmployeeContext.deleted_at.is_(None),
                )
                .all()
            )

            team_lead_context_ids = {
                row.id
                for row in team_lead_contexts
            }

            if not team_lead_context_ids:
                return set()

            rm_rows = (
                db.query(
                    EmployeeContext.employee_id
                )
                .filter(
                    EmployeeContext.reports_to_id.in_(
                        team_lead_context_ids
                    ),
                    EmployeeContext.is_active.is_(True),
                    EmployeeContext.deleted_at.is_(None),
                )
                .all()
            )

            team_lead_rm_ids = {
                row.employee_id
                for row in rm_rows
            }

            visible_employee_ids &= team_lead_rm_ids

        # =====================================================
        # RM FILTER
        # =====================================================

        if rm_id is not None:

            if rm_id not in visible_employee_ids:
                return set()

            visible_employee_ids = {
                rm_id
            }

        return visible_employee_ids

    # =========================================================
    # VISIBLE PHONE NUMBERS
    # =========================================================

    @staticmethod
    def _get_visible_phone_ids(
        db: Session,
        employee: Employee,
        team_lead_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        context_id: Optional[int] = None,
    ) -> set[int]:
        """
        Get phone_numbers belonging to employees visible
        through the hierarchy and selected filters.
        """

        visible_employee_ids = (
            CallAnalyticsAdNumberTrendService
            ._get_visible_employee_ids(
                db=db,
                employee=employee,
                team_lead_id=team_lead_id,
                rm_id=rm_id,
                context_id=context_id,
            )
        )

        if not visible_employee_ids:
            return set()

        rows = (
            db.query(
                PhoneNumber.id
            )
            .filter(
                PhoneNumber.employee_id.in_(
                    visible_employee_ids
                ),
                PhoneNumber.deleted_at.is_(None),
            )
            .all()
        )

        return {
            row.id
            for row in rows
        }

    # =========================================================
    # MAIN TREND
    # =========================================================

    @staticmethod
    def get_trend(
        db: Session,
        employee: Employee,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        phone_id: Optional[int] = None,
        team_lead_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        context_id: Optional[int] = None,
    ):
        if not employee:
            raise PermissionError(
                "Authenticated employee is required."
            )

        # =====================================================
        # DATE RANGE
        # =====================================================

        current_month_start, next_month_start = (
            CallAnalyticsAdNumberTrendService
            ._get_current_month_range()
        )

        if from_date is None:
            from_date = current_month_start

        if to_date is None:

            if from_date == current_month_start:
                to_date = (
                    next_month_start
                    - timedelta(days=1)
                )
            else:
                to_date = date.today()

        if from_date > to_date:
            raise ValueError(
                "from_date cannot be greater than to_date."
            )

        # =====================================================
        # VISIBLE PHONE NUMBERS
        # =====================================================

        visible_phone_ids = (
            CallAnalyticsAdNumberTrendService
            ._get_visible_phone_ids(
                db=db,
                employee=employee,
                team_lead_id=team_lead_id,
                rm_id=rm_id,
                context_id=context_id,
            )
        )

        if not visible_phone_ids:
            return {
                "summary": {
                    "total": 0,
                    "received": 0,
                    "called": 0,
                    "missed": 0,
                    "unique": 0,
                },
                "trends": [],
            }

        # =====================================================
        # PHONE FILTER
        # =====================================================

        if phone_id is not None:

            if phone_id not in visible_phone_ids:
                return {
                    "summary": {
                        "total": 0,
                        "received": 0,
                        "called": 0,
                        "missed": 0,
                        "unique": 0,
                    },
                    "trends": [],
                }

            selected_phone_ids = {
                phone_id
            }

        else:
            selected_phone_ids = visible_phone_ids

        # =====================================================
        # CALL QUERY
        # =====================================================

        rows = (
            db.query(
                CallLog.id,
                CallLog.phone_id,
                PhoneNumber.phone.label(
                    "phone_number"
                ),
                func.date(
                    CallLog.call_started_at
                ).label("call_date"),
                CallLog.call_type,
                CallLog.mobile_status,
                CallLog.phone_number.label(
                    "caller_number"
                ),
            )
            .join(
                PhoneNumber,
                PhoneNumber.id
                == CallLog.phone_id,
            )
            .filter(
                CallLog.phone_id.in_(
                    selected_phone_ids
                ),
                CallLog.call_started_at >= (
                    CallAnalyticsAdNumberTrendService
                    ._date_start(from_date)
                ),
                CallLog.call_started_at < (
                    CallAnalyticsAdNumberTrendService
                    ._date_end(to_date)
                ),
                PhoneNumber.deleted_at.is_(None),
            )
            .order_by(
                func.date(
                    CallLog.call_started_at
                ),
                PhoneNumber.id,
                CallLog.id,
            )
            .all()
        )

        # =====================================================
        # GROUP
        # =====================================================

        grouped = {}

        summary_total = 0
        summary_received = 0
        summary_called = 0
        summary_missed = 0

        unique_numbers = set()

        for row in rows:

            call_date = row.call_date

            if isinstance(
                call_date,
                datetime,
            ):
                call_date = call_date.date()

            key = (
                row.phone_id,
                call_date,
            )

            if key not in grouped:

                grouped[key] = {
                    "phone_id": row.phone_id,
                    "phone_number": row.phone_number,
                    "date": call_date,
                    "total": 0,
                    "received": 0,
                    "called": 0,
                    "missed": 0,
                    "unique": 0,
                    "_unique_numbers": set(),
                }

            item = grouped[key]

            item["total"] += 1
            summary_total += 1

            # -------------------------------------------------
            # RECEIVED
            # -------------------------------------------------

            if (
                row.call_type
                == CallTypeEnum.INCOMING
                and row.mobile_status
                == MobileStatusEnum.RECEIVED
            ):
                item["received"] += 1
                summary_received += 1

            # -------------------------------------------------
            # CALLED
            # -------------------------------------------------

            if (
                row.call_type
                == CallTypeEnum.OUTGOING
            ):
                item["called"] += 1
                summary_called += 1

            # -------------------------------------------------
            # MISSED
            # -------------------------------------------------

            if (
                row.mobile_status
                == MobileStatusEnum.MISSED
            ):
                item["missed"] += 1
                summary_missed += 1

            # -------------------------------------------------
            # UNIQUE
            # -------------------------------------------------

            caller_number = (
                str(row.caller_number).strip()
                if row.caller_number
                else ""
            )

            if caller_number:

                item["_unique_numbers"].add(
                    caller_number
                )

                unique_numbers.add(
                    caller_number
                )

        # =====================================================
        # BUILD RESPONSE
        # =====================================================

        trends = []

        for item in grouped.values():

            item["unique"] = len(
                item["_unique_numbers"]
            )

            item.pop(
                "_unique_numbers",
                None,
            )

            trends.append(item)

        trends.sort(
            key=lambda item: (
                item["date"],
                item["phone_id"],
            )
        )

        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        return {
            "summary": {
                "total": summary_total,
                "received": summary_received,
                "called": summary_called,
                "missed": summary_missed,
                "unique": len(unique_numbers),
            },
            "trends": trends,
        }