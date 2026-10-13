# backend/app/services/CallAnalytics/Overview/monthly_call_overview_service.py

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


class CallAnalyticsMonthlyCallOverviewService:

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _month_range(
        year: int,
        month: int,
    ) -> tuple[date, date]:

        start_date = date(
            year,
            month,
            1,
        )

        if month == 12:
            end_date = date(
                year + 1,
                1,
                1,
            )
        else:
            end_date = date(
                year,
                month + 1,
                1,
            )

        return start_date, end_date

    # =========================================================
    # EMPTY RESPONSE
    # =========================================================

    @staticmethod
    def _empty_response(
        year: int,
        month: int,
    ) -> dict:

        return {
            "success": True,

            "year": year,

            "month": month,

            "summary": {
                "total": 0,
                "received": 0,
                "called": 0,
                "missed": 0,
                "uniqueMissed": 0,
                "applications": 0,
            },

            "records": 0,
        }

    # =========================================================
    # CALL CONTEXT SCOPE
    # =========================================================

    @staticmethod
    def _get_call_context_ids(
        db: Session,
        employee: Employee,
        active_context: EmployeeContext,
    ) -> set[int]:

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
                if context
                and context.id is not None
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
                if context
                and context.id is not None
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
        Same application RBAC as ApplicationService.apply_scope().
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

            # No application context restriction.
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

            agent_contexts = (
                AccessControl._visible_contexts(
                    db=db,
                    family="AGENT",
                    reports_to_id=active_context.id,
                )
            )

            agent_context_ids = [
                context.id
                for context in agent_contexts
                if context
                and context.id is not None
            ]

            if not agent_context_ids:

                return query.filter(False)

            return query.filter(
                LoanApplication.agent_context_id.in_(
                    agent_context_ids
                )
            )

        # =====================================================
        # UNKNOWN
        # =====================================================

        return query.filter(False)

    # =========================================================
    # MONTHLY CALL OVERVIEW
    # =========================================================

    @staticmethod
    def get_monthly_call_overview(
        db: Session,
        employee: Employee,
        year: int,
        month: int,
        context_id: Optional[int] = None,
    ):

        # =====================================================
        # VALIDATE MONTH
        # =====================================================

        if month < 1 or month > 12:

            raise ValueError(
                "month must be between 1 and 12."
            )

        # =====================================================
        # DATE RANGE
        # =====================================================

        start_date, end_date = (
            CallAnalyticsMonthlyCallOverviewService
            ._month_range(
                year=year,
                month=month,
            )
        )

        # =====================================================
        # ACTIVE CONTEXT
        # =====================================================

        active_context = (
            AccessControl.get_active_context(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not active_context:

            return (
                CallAnalyticsMonthlyCallOverviewService
                ._empty_response(
                    year=year,
                    month=month,
                )
            )

        # =====================================================
        # CALL RBAC
        # =====================================================

        call_context_ids = (
            CallAnalyticsMonthlyCallOverviewService
            ._get_call_context_ids(
                db=db,
                employee=employee,
                active_context=active_context,
            )
        )

        # =====================================================
        # CALL SUMMARY
        # =====================================================

        total = 0
        received = 0
        called = 0
        missed = 0
        unique_missed = 0

        if call_context_ids:

            call_summary = (
                db.query(

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

                .filter(
                    CallLog.employee_context_id.in_(
                        call_context_ids
                    )
                )

                .filter(
                    CallLog.call_started_at
                    >= datetime.combine(
                        start_date,
                        time.min,
                    )
                )

                .filter(
                    CallLog.call_started_at
                    < datetime.combine(
                        end_date,
                        time.min,
                    )
                )

                .first()
            )

            if call_summary:

                total = int(
                    call_summary.total or 0
                )

                received = int(
                    call_summary.received or 0
                )

                called = int(
                    call_summary.called or 0
                )

                missed = int(
                    call_summary.missed or 0
                )

                unique_missed = int(
                    call_summary.unique_missed or 0
                )

        # =====================================================
        # APPLICATION COUNT
        # =====================================================

        application_query = db.query(
            func.count(
                LoanApplication.id
            )
        )

        # -----------------------------------------------------
        # SAME RBAC AS APPLICATION SERVICE
        # -----------------------------------------------------

        application_query = (
            CallAnalyticsMonthlyCallOverviewService
            ._apply_application_scope(
                query=application_query,
                db=db,
                employee=employee,
                active_context=active_context,
            )
        )

        # -----------------------------------------------------
        # APPLICATION DATE
        # -----------------------------------------------------

        application_query = application_query.filter(
            LoanApplication.deleted_at.is_(None)
        )

        application_query = application_query.filter(
            LoanApplication.applied_date >= start_date
        )

        application_query = application_query.filter(
            LoanApplication.applied_date < end_date
        )

        applications = int(
            application_query.scalar() or 0
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "success": True,

            "year": year,

            "month": month,

            "summary": {
                "total": total,

                "received": received,

                "called": called,

                "missed": missed,

                "uniqueMissed": unique_missed,

                "applications": applications,
            },

            "records": total,
        }