# backend/app/services/CallAnalytics/Trends/performance_trend_service.py

from datetime import date, datetime, time, timedelta
from typing import Optional

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.call_logs import (
    CallLog,
    CallTypeEnum,
    MobileStatusEnum,
)
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee


class CallAnalyticsPerformanceTrendService:

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _date_start(value: date) -> datetime:
        return datetime.combine(
            value,
            time.min,
        )

    @staticmethod
    def _date_end(value: date) -> datetime:
        return datetime.combine(
            value + timedelta(days=1),
            time.min,
        )

    @staticmethod
    def _resolve_dates(
        from_date: Optional[date],
        to_date: Optional[date],
    ) -> tuple[date, date]:

        today = date.today()

        if from_date is None and to_date is None:
            return today, today

        if from_date is None:
            from_date = to_date

        if to_date is None:
            to_date = from_date

        if from_date > to_date:
            raise ValueError(
                "from_date cannot be greater than to_date."
            )

        return from_date, to_date

    # =========================================================
    # GET VISIBLE CONTEXTS
    # =========================================================

    @staticmethod
    def _get_visible_contexts(
        db: Session,
        employee: Employee,
        analytics_type: str,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:

        analytics_type = (
            str(analytics_type)
            .strip()
            .lower()
        )

        if analytics_type == "agent":

            return (
                AccessControl.get_visible_agents(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
                or []
            )

        if analytics_type == "rm":

            return (
                AccessControl.get_visible_rms(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                    team_lead_context_id=team_lead_context_id,
                )
                or []
            )

        raise ValueError(
            "type must be either 'agent' or 'rm'."
        )

    # =========================================================
    # APPLY ENTITY FILTER
    # =========================================================

    @staticmethod
    def _filter_contexts(
        contexts: list[EmployeeContext],
        analytics_type: str,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:

        selected_id = (
            agent_context_id
            if analytics_type == "agent"
            else rm_context_id
        )

        if selected_id is None:
            return contexts

        visible_ids = {
            context.id
            for context in contexts
            if context.id is not None
        }

        # Important:
        # Never allow a user to request an EmployeeContext
        # outside AccessControl visibility.
        if selected_id not in visible_ids:
            return []

        return [
            context
            for context in contexts
            if context.id == selected_id
        ]

    # =========================================================
    # GET PERFORMANCE TREND
    # =========================================================

    @staticmethod
    def get_performance_trend(
        db: Session,
        employee: Employee,
        analytics_type: str,
        team_lead_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        context_id: Optional[int] = None,
    ) -> dict:

        if not employee:
            raise PermissionError(
                "Authenticated employee is required."
            )

        # -----------------------------------------------------
        # DATES
        # -----------------------------------------------------

        from_date, to_date = (
            CallAnalyticsPerformanceTrendService
            ._resolve_dates(
                from_date=from_date,
                to_date=to_date,
            )
        )

        analytics_type = (
            str(analytics_type)
            .strip()
            .lower()
        )

        # -----------------------------------------------------
        # ACCESS CONTROL
        # -----------------------------------------------------

        contexts = (
            CallAnalyticsPerformanceTrendService
            ._get_visible_contexts(
                db=db,
                employee=employee,
                analytics_type=analytics_type,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        # -----------------------------------------------------
        # AGENT / RM FILTER
        # -----------------------------------------------------

        contexts = (
            CallAnalyticsPerformanceTrendService
            ._filter_contexts(
                contexts=contexts,
                analytics_type=analytics_type,
                agent_context_id=agent_context_id,
                rm_context_id=rm_context_id,
            )
        )

        if not contexts:
            return {
                "summary": {
                    "total": 0,
                    "incoming": 0,
                    "outgoing": 0,
                    "received": 0,
                    "missed": 0,
                    "unique": 0,
                },
                "trends": [],
            }

        context_ids = [
            context.id
            for context in contexts
            if context.id is not None
        ]

        if not context_ids:
            return {
                "summary": {
                    "total": 0,
                    "incoming": 0,
                    "outgoing": 0,
                    "received": 0,
                    "missed": 0,
                    "unique": 0,
                },
                "trends": [],
            }
        # print(contexts,analytics_type,'===============================')
        # -----------------------------------------------------
        # CALL LOG QUERY
        # -----------------------------------------------------

        rows = (
            db.query(
                CallLog.employee_context_id.label(
                    "employee_context_id"
                ),

                Employee.id.label(
                    "employee_id"
                ),

                Employee.name.label(
                    "employee_name"
                ),

                func.date(
                    CallLog.call_started_at
                ).label(
                    "call_date"
                ),

                func.count(
                    CallLog.id
                ).label(
                    "total"
                ),

                func.count(
                    CallLog.id
                ).filter(
                    CallLog.call_type
                    == CallTypeEnum.INCOMING
                ).label(
                    "incoming"
                ),

                func.count(
                    CallLog.id
                ).filter(
                    CallLog.call_type
                    == CallTypeEnum.OUTGOING
                ).label(
                    "outgoing"
                ),

                func.count(
                    CallLog.id
                ).filter(
                    and_(
                        CallLog.call_type
                        == CallTypeEnum.INCOMING,

                        CallLog.mobile_status
                        == MobileStatusEnum.RECEIVED,
                    )
                ).label(
                    "received"
                ),

                func.count(
                    CallLog.id
                ).filter(
                    CallLog.mobile_status
                    == MobileStatusEnum.MISSED
                ).label(
                    "missed"
                ),

                func.count(
                    func.distinct(
                        CallLog.phone_number
                    )
                ).label(
                    "unique"
                ),
            )
            .join(
                EmployeeContext,
                EmployeeContext.id
                == CallLog.employee_context_id,
            )
            .join(
                Employee,
                Employee.id
                == EmployeeContext.employee_id,
            )
            .filter(
                CallLog.employee_context_id.in_(
                    context_ids
                ),

                CallLog.call_started_at
                >= CallAnalyticsPerformanceTrendService
                ._date_start(from_date),

                CallLog.call_started_at
                < CallAnalyticsPerformanceTrendService
                ._date_end(to_date),

                EmployeeContext.is_active.is_(True),

                EmployeeContext.deleted_at.is_(None),

                Employee.deleted_at.is_(None),
            )
            .group_by(
                CallLog.employee_context_id,
                Employee.id,
                Employee.name,
                func.date(
                    CallLog.call_started_at
                ),
            )
            .order_by(
                func.date(
                    CallLog.call_started_at
                ),
                Employee.name,
            )
            .all()
        )

        # -----------------------------------------------------
        # BUILD TRENDS
        # -----------------------------------------------------

        trends = []

        summary_total = 0
        summary_incoming = 0
        summary_outgoing = 0
        summary_received = 0
        summary_missed = 0
        summary_unique_numbers = set()

        for row in rows:

            item = {
                "date": row.call_date,

                "employeeContextId":
                    row.employee_context_id,

                "employeeId":
                    row.employee_id,

                "employeeName":
                    row.employee_name,

                "total":
                    int(row.total or 0),

                "incoming":
                    int(row.incoming or 0),

                "outgoing":
                    int(row.outgoing or 0),

                "received":
                    int(row.received or 0),

                "missed":
                    int(row.missed or 0),

                "unique":
                    int(row.unique or 0),
            }

            trends.append(item)

            summary_total += item["total"]
            summary_incoming += item["incoming"]
            summary_outgoing += item["outgoing"]
            summary_received += item["received"]
            summary_missed += item["missed"]

        # -----------------------------------------------------
        # SUMMARY UNIQUE
        # -----------------------------------------------------

        unique_rows = (
            db.query(
                func.distinct(
                    CallLog.phone_number
                )
            )
            .filter(
                CallLog.employee_context_id.in_(
                    context_ids
                ),

                CallLog.call_started_at
                >= CallAnalyticsPerformanceTrendService
                ._date_start(from_date),

                CallLog.call_started_at
                < CallAnalyticsPerformanceTrendService
                ._date_end(to_date),

                CallLog.phone_number.isnot(None),
            )
            .all()
        )

        summary_unique = len({
            str(row[0]).strip()
            for row in unique_rows
            if row[0]
        })

        return {
            "summary": {
                "total": summary_total,
                "incoming": summary_incoming,
                "outgoing": summary_outgoing,
                "received": summary_received,
                "missed": summary_missed,
                "unique": summary_unique,
            },
            "trends": trends,
        }