# Path: backend/app/services/CallAnalytics/Trends/ad_number_trend_service.py

from datetime import date, datetime, timedelta
from typing import Optional

from sqlalchemy import func , and_
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.call_logs import (
    CallLog,
    CallTypeEnum,
    MobileStatusEnum,
)
from app.models.employees import Employee
from app.models.phone_numbers import PhoneNumber
from app.models.employee_contexts import EmployeeContext

class CallAnalyticsAdNumberTrendService:

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

        visible_rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_id,
        )

        visible_employee_ids = {
            rm.employee_id
            for rm in visible_rms
        }

        # RM's own phone numbers
        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if active_context:
            visible_employee_ids.add(
                active_context.employee_id
            )

        # -----------------------------------------------------
        # RM FILTER
        # -----------------------------------------------------

        if rm_id is not None:

            if rm_id not in visible_employee_ids:
                return set()

            visible_employee_ids = {rm_id}

        if not visible_employee_ids:
            return set()

        # -----------------------------------------------------
        # PHONE NUMBERS
        # -----------------------------------------------------

        rows = (
            db.query(PhoneNumber.id)
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
        # VISIBLE PHONES
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

            selected_phone_ids = {phone_id}

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
                and_(
                    PhoneNumber.id == CallLog.phone_id,
                    PhoneNumber.trackable == "active",
                ),
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