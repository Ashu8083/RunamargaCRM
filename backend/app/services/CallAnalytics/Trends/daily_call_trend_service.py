# backend/app/services/CallAnalytics/Trends/daily_call_trend_service.py

from datetime import date, datetime, time, timedelta
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
from app.models.loan_applications import LoanApplication


class CallAnalyticsDailyCallTrendService:

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
    # CALL CONTEXT SCOPE
    # =========================================================

    @staticmethod
    def _get_call_context_ids(
        db: Session,
        employee: Employee,
        active_context: EmployeeContext,
    ) -> set[int]:
        """
        Resolve which EmployeeContext IDs are allowed to
        contribute to the daily call trend.

        IMPORTANT:

        CallLog.employee_context_id is used for the actual
        call-log filtering.

        We do NOT use Employee.id here.
        """

        family = AccessControl.get_context_family(
            active_context.context.code
            if active_context.context
            else None
        )

        # =====================================================
        # GLOBAL / MANAGER
        # =====================================================

        if family in {"GLOBAL", "MANAGER"}:

            visible_rms = (
                AccessControl.get_visible_rms(
                    db=db,
                    employee=employee,
                    context_id=active_context.id,
                )
                or []
            )

            visible_agents = (
                AccessControl.get_visible_agents(
                    db=db,
                    employee=employee,
                    context_id=active_context.id,
                )
                or []
            )

            return {
                context.id
                for context in (
                    list(visible_rms)
                    + list(visible_agents)
                )
                if context and context.id is not None
            }

        # =====================================================
        # TEAM LEAD
        # =====================================================

        if family == "TEAMLEAD":

            visible_rms = (
                AccessControl.get_visible_rms(
                    db=db,
                    employee=employee,
                    context_id=active_context.id,
                )
                or []
            )

            visible_agents = (
                AccessControl.get_visible_agents(
                    db=db,
                    employee=employee,
                    context_id=active_context.id,
                )
                or []
            )

            return {
                context.id
                for context in (
                    list(visible_rms)
                    + list(visible_agents)
                )
                if context and context.id is not None
            }

        # =====================================================
        # RM
        # =====================================================

        if family == "RM":

            return {
                active_context.id
            }

        # =====================================================
        # AGENT
        # =====================================================

        if family == "AGENT":

            return {
                active_context.id
            }

        # =====================================================
        # UNKNOWN FAMILY
        # =====================================================

        return set()

    # =========================================================
    # APPLICATION SCOPE
    # =========================================================

    @staticmethod
    def _apply_application_scope(
        query,
        db: Session,
        employee: Employee,
        active_context: EmployeeContext,
    ):
        """
        Apply the SAME application visibility rules used by:

            ApplicationService.apply_scope()

        Rules:

            GLOBAL
                -> all applications

            MANAGER
                -> all applications

            AGENT
                -> applications where
                   agent_context_id == current context

            RM
                -> applications where
                   rm_context_id == current context

            TEAMLEAD
                -> applications belonging to
                   visible agents of the Team Lead

            UNKNOWN
                -> no applications
        """

        family = AccessControl.get_context_family(
            active_context.context.code
            if active_context.context
            else None
        )

        # =====================================================
        # GLOBAL / MANAGER
        # =====================================================

        if family in {"GLOBAL", "MANAGER"}:

            # IMPORTANT:
            #
            # No applied_by_context_id filter.
            #
            # This matches ApplicationService.apply_scope()
            # exactly.
            #
            # GLOBAL / MANAGER can therefore see all
            # applications.
            #

            return query

        # =====================================================
        # AGENT
        # =====================================================

        if family == "AGENT":

            return query.filter(
                LoanApplication.agent_context_id
                == active_context.id
            )

        # =====================================================
        # RM
        # =====================================================

        if family == "RM":

            return query.filter(
                LoanApplication.rm_context_id
                == active_context.id
            )

        # =====================================================
        # TEAM LEAD
        # =====================================================

        if family == "TEAMLEAD":

            agent_contexts = AccessControl._visible_contexts(
                db=db,
                family="AGENT",
                reports_to_id=active_context.id,
            )

            agent_context_ids = [
                agent_context.id
                for agent_context in agent_contexts
                if agent_context and agent_context.id is not None
            ]

            if not agent_context_ids:

                return query.filter(False)

            return query.filter(
                LoanApplication.agent_context_id.in_(
                    agent_context_ids
                )
            )

        # =====================================================
        # UNKNOWN FAMILY
        # =====================================================

        return query.filter(False)

    # =========================================================
    # EMPTY RESPONSE
    # =========================================================

    @staticmethod
    def _empty_response() -> dict:

        return {
            "summary": {
                "total": 0,
                "received": 0,
                "called": 0,
                "missed": 0,
                "uniqueMissed": 0,
                "applications": 0,
            },
            "trends": [],
        }

    # =========================================================
    # DAILY CALL TREND
    # =========================================================

    @staticmethod
    def get_daily_call_trend(
        db: Session,
        employee: Employee,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        context_id: Optional[int] = None,
    ):

        # =====================================================
        # DATE RANGE
        # =====================================================

        from_date, to_date = (
            CallAnalyticsDailyCallTrendService
            ._resolve_dates(
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # ACTIVE CONTEXT
        # =====================================================

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:

            return (
                CallAnalyticsDailyCallTrendService
                ._empty_response()
            )

        # =====================================================
        # CONTEXT FAMILY
        # =====================================================

        family = AccessControl.get_context_family(
            active_context.context.code
            if active_context.context
            else None
        )

        # =====================================================
        # CALL RBAC SCOPE
        # =====================================================

        call_context_ids = (
            CallAnalyticsDailyCallTrendService
            ._get_call_context_ids(
                db=db,
                employee=employee,
                active_context=active_context,
            )
        )

        # =====================================================
        # DAILY CALL LOG AGGREGATION
        # =====================================================

        call_rows = []

        if call_context_ids:

            call_rows = (
                db.query(

                    # -----------------------------------------
                    # DATE
                    # -----------------------------------------

                    func.date(
                        CallLog.call_started_at
                    ).label(
                        "call_date"
                    ),

                    # -----------------------------------------
                    # TOTAL
                    # -----------------------------------------

                    func.count(
                        CallLog.id
                    ).label(
                        "total"
                    ),

                    # -----------------------------------------
                    # RECEIVED
                    # -----------------------------------------

                    func.count(
                        CallLog.id
                    ).filter(
                        CallLog.call_type
                        == CallTypeEnum.INCOMING,

                        CallLog.mobile_status
                        == MobileStatusEnum.RECEIVED,
                    ).label(
                        "received"
                    ),

                    # -----------------------------------------
                    # CALLED
                    # -----------------------------------------

                    func.count(
                        CallLog.id
                    ).filter(
                        CallLog.call_type
                        == CallTypeEnum.OUTGOING,
                    ).label(
                        "called"
                    ),

                    # -----------------------------------------
                    # MISSED
                    # -----------------------------------------

                    func.count(
                        CallLog.id
                    ).filter(
                        CallLog.mobile_status
                        == MobileStatusEnum.MISSED,
                    ).label(
                        "missed"
                    ),

                    # -----------------------------------------
                    # UNIQUE MISSED
                    # -----------------------------------------

                    func.count(
                        func.distinct(
                            CallLog.phone_number
                        )
                    ).filter(
                        CallLog.mobile_status
                        == MobileStatusEnum.MISSED,
                    ).label(
                        "unique_missed"
                    ),
                )

                # =============================================
                # CALL CONTEXT FILTER
                # =============================================

                .filter(
                    CallLog.employee_context_id.in_(
                        call_context_ids
                    )
                )

                # =============================================
                # DATE FILTER
                # =============================================

                .filter(
                    CallLog.call_started_at
                    >= (
                        CallAnalyticsDailyCallTrendService
                        ._date_start(from_date)
                    )
                )

                .filter(
                    CallLog.call_started_at
                    < (
                        CallAnalyticsDailyCallTrendService
                        ._date_end(to_date)
                    )
                )

                # =============================================
                # GROUP
                # =============================================

                .group_by(
                    func.date(
                        CallLog.call_started_at
                    )
                )

                .order_by(
                    func.date(
                        CallLog.call_started_at
                    )
                )

                .all()
            )

        # =====================================================
        # APPLICATION AGGREGATION
        # =====================================================

        application_query = db.query(

            # -----------------------------------------------
            # APPLICATION DATE
            # -----------------------------------------------

            LoanApplication.applied_date.label(
                "application_date"
            ),

            # -----------------------------------------------
            # APPLICATION COUNT
            # -----------------------------------------------

            func.count(
                LoanApplication.id
            ).label(
                "applications"
            ),
        )

        # =====================================================
        # SAME RBAC AS ApplicationService.apply_scope()
        # =====================================================

        application_query = (
            CallAnalyticsDailyCallTrendService
            ._apply_application_scope(
                query=application_query,
                db=db,
                employee=employee,
                active_context=active_context,
            )
        )

        # =====================================================
        # APPLICATION FILTERS
        # =====================================================

        application_query = application_query.filter(
            LoanApplication.deleted_at.is_(None)
        )

        application_query = application_query.filter(
            LoanApplication.applied_date >= from_date
        )

        application_query = application_query.filter(
            LoanApplication.applied_date <= to_date
        )

        # =====================================================
        # GROUP APPLICATIONS BY DATE
        # =====================================================

        application_rows = (
            application_query

            .group_by(
                LoanApplication.applied_date
            )

            .order_by(
                LoanApplication.applied_date
            )

            .all()
        )

        # =====================================================
        # APPLICATIONS BY DATE
        # =====================================================

        applications_by_date = {
            row.application_date: int(
                row.applications or 0
            )
            for row in application_rows
            if row.application_date is not None
        }

        # =====================================================
        # CALL DATA BY DATE
        # =====================================================

        calls_by_date = {}

        for row in call_rows:

            calls_by_date[row.call_date] = {
                "total": int(
                    row.total or 0
                ),

                "received": int(
                    row.received or 0
                ),

                "called": int(
                    row.called or 0
                ),

                "missed": int(
                    row.missed or 0
                ),

                "uniqueMissed": int(
                    row.unique_missed or 0
                ),
            }

        # =====================================================
        # MERGE DATES
        # =====================================================

        all_dates = sorted(
            set(calls_by_date.keys())
            | set(applications_by_date.keys())
        )

        # =====================================================
        # BUILD TRENDS
        # =====================================================

        trends = []

        for trend_date in all_dates:

            call_data = calls_by_date.get(
                trend_date,
                {
                    "total": 0,
                    "received": 0,
                    "called": 0,
                    "missed": 0,
                    "uniqueMissed": 0,
                },
            )

            applications = applications_by_date.get(
                trend_date,
                0,
            )

            trends.append({
                "date": trend_date.isoformat(),

                "total": call_data["total"],

                "received": call_data["received"],

                "called": call_data["called"],

                "missed": call_data["missed"],

                "uniqueMissed": call_data["uniqueMissed"],

                "applications": applications,
            })

        # =====================================================
        # SUMMARY
        # =====================================================

        summary = {
            "total": sum(
                item["total"]
                for item in trends
            ),

            "received": sum(
                item["received"]
                for item in trends
            ),

            "called": sum(
                item["called"]
                for item in trends
            ),

            "missed": sum(
                item["missed"]
                for item in trends
            ),

            "uniqueMissed": sum(
                item["uniqueMissed"]
                for item in trends
            ),

            "applications": sum(
                item["applications"]
                for item in trends
            ),
        }

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "summary": summary,
            "trends": trends,
        }