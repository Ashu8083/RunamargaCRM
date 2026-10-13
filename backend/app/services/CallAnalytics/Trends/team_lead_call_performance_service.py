# backend/app/services/CallAnalytics/Trends/team_lead_call_performance_service.py

from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, datetime, time, timedelta
from app.core.access_control import AccessControl
from app.models.call_logs import (
    CallLog,
    CallTypeEnum,
    MobileStatusEnum,
)
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication

class CallAnalyticsTeamLeadCallPerformanceService:

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _date_start(value: date) -> datetime:
        return datetime.combine(value, time.min)

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
    @staticmethod
    def _get_team_lead_scope(
        db: Session,
        employee: Employee,
        team_lead_context: EmployeeContext,
        rm_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
    ) -> list[int]:

        # =====================================================
        # GET RMs FOR THIS TEAM LEAD
        # =====================================================

        visible_rms = (
            AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                team_lead_context_id=team_lead_context.id,
            )
            or []
        )

        rm_context_ids = {
            rm.id
            for rm in visible_rms
            if rm.id is not None
        }

        # =====================================================
        # GET AGENTS FOR THIS TEAM LEAD
        #
        # IMPORTANT:
        # Agents report directly to the Team Lead in your
        # current database.
        #
        # We DO NOT do:
        #
        # Agent -> RM -> Team Lead
        #
        # =====================================================

        visible_agents = (
            AccessControl.get_visible_agents(
                db=db,
                employee=employee,
                team_lead_context_id=team_lead_context.id,
            )
            or []
        )

        agent_context_ids = {
            agent.id
            for agent in visible_agents
            if agent.id is not None
        }

        # =====================================================
        # RM FILTER
        # =====================================================

        if rm_context_id is not None:

            if rm_context_id not in rm_context_ids:
                return []

            return [rm_context_id]

        # =====================================================
        # AGENT FILTER
        # =====================================================

        if agent_context_id is not None:

            if agent_context_id not in agent_context_ids:
                return []

            return [agent_context_id]

        # =====================================================
        # NO FILTER
        #
        # Team Lead performance = RM + Agent
        # =====================================================

        return list(
            rm_context_ids |
            agent_context_ids
        )
    # =========================================================
    # GET TEAM LEAD CONTEXTS
    # =========================================================

    @staticmethod
    def _get_team_lead_contexts(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[EmployeeContext]:

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:
            return []

        family = AccessControl.get_context_family(
            active_context.context.code
        )

        # =====================================================
        # GLOBAL / MANAGER
        # =====================================================

        if family in {"GLOBAL", "MANAGER"}:

            team_leads = (
                AccessControl.get_visible_team_leads(
                    db=db,
                    employee=employee,
                    context_id=context_id,
                )
                or []
            )

            if team_lead_context_id is None:
                return team_leads

            return [
                team_lead
                for team_lead in team_leads
                if team_lead.id == team_lead_context_id
            ]

        # =====================================================
        # TEAM LEAD
        # =====================================================

        if family == "TEAMLEAD":

            # A Team Lead can only see himself.
            if team_lead_context_id is not None:
                if team_lead_context_id != active_context.id:
                    return []

            return [active_context]

        return []
    # =========================================================
    # GET VISIBLE CALL CONTEXTS
    # =========================================================

    @staticmethod
    def _get_call_context_ids(
        db: Session,
        employee: Employee,
        team_lead_context: EmployeeContext,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
    ) -> list[int]:

        team_lead_id = team_lead_context.id

        # -----------------------------------------------------
        # RMs belonging to this Team Lead
        # -----------------------------------------------------

        rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=team_lead_id,
        )

        # For GLOBAL / MANAGER, explicitly request the
        # selected Team Lead's RM scope.
        rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=None,
            team_lead_context_id=team_lead_id,
        )

        rm_ids = {
            rm.id
            for rm in rms
            if rm.id is not None
        }

        if rm_context_id is not None:

            if rm_context_id not in rm_ids:
                return []

            rm_ids = {rm_context_id}

        # -----------------------------------------------------
        # Agents belonging to those RMs
        # -----------------------------------------------------

        agent_ids = set()

        for rm_id in rm_ids:

            agents = (
                db.query(EmployeeContext)
                .join(
                    Employee,
                    EmployeeContext.employee_id == Employee.id,
                )
                .filter(
                    EmployeeContext.reports_to_id == rm_id,
                    EmployeeContext.is_active.is_(True),
                    Employee.deactivate.is_(False),
                )
                .all()
            )

            agent_ids.update(
                agent.id
                for agent in agents
                if agent.id is not None
            )

        # -----------------------------------------------------
        # Selected Agent
        # -----------------------------------------------------

        if agent_context_id is not None:

            if agent_context_id not in agent_ids:
                return []

            agent_ids = {agent_context_id}

        # -----------------------------------------------------
        # Call contexts = RMs + Agents
        # -----------------------------------------------------

        return list(rm_ids | agent_ids)

    # =========================================================
    # GET PERFORMANCE
    # =========================================================

    @staticmethod
    def get_performance(
        db: Session,
        employee: Employee,
        team_lead_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        context_id: Optional[int] = None,
    ):

        from_date, to_date = (
            CallAnalyticsTeamLeadCallPerformanceService
            ._resolve_dates(
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # TEAM LEAD
        # =====================================================

        team_leads = (
            CallAnalyticsTeamLeadCallPerformanceService
            ._get_team_lead_contexts(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        if not team_leads:
            return {
                "summary": {},
                "trends": [],
                "teamLeads": [],
            }

        # =====================================================
        # BUILD TEAM LEAD → CONTEXT SCOPE
        # =====================================================

        team_lead_scopes = {}

        for team_lead in team_leads:

            context_ids = (
                CallAnalyticsTeamLeadCallPerformanceService
                ._get_team_lead_scope(
                    db=db,
                    employee=employee,
                    team_lead_context=team_lead,
                    rm_context_id=rm_context_id,
                    agent_context_id=agent_context_id,
                )
            )

            team_lead_scopes[team_lead.id] = context_ids

        # =====================================================
        # CONTEXT → TEAM LEAD MAP
        # =====================================================

        context_to_team_lead = {}

        for team_lead_id, context_ids in team_lead_scopes.items():

            for context_id_value in context_ids:
                context_to_team_lead[
                    context_id_value
                ] = team_lead_id

        all_context_ids = set(
            context_to_team_lead.keys()
        )

        if not all_context_ids:
            return {
                "summary": {},
                "trends": [],
                "teamLeads": [],
            }

        # =====================================================
        # CALL LOG QUERY
        # =====================================================

        rows = (
            db.query(
                CallLog.employee_context_id.label(
                    "employee_context_id"
                ),

                func.date(
                    CallLog.call_started_at
                ).label("call_date"),

                func.count(
                    CallLog.id
                ).label("total"),

                func.count(
                    CallLog.id
                ).filter(
                    CallLog.call_type
                    == CallTypeEnum.INCOMING,
                    CallLog.mobile_status
                    == MobileStatusEnum.RECEIVED,
                ).label("received"),

                func.count(
                    CallLog.id
                ).filter(
                    CallLog.call_type
                    == CallTypeEnum.OUTGOING,
                ).label("outgoing"),

                func.count(
                    CallLog.id
                ).filter(
                    CallLog.mobile_status
                    == MobileStatusEnum.MISSED,
                ).label("missed"),

                func.count(
                    func.distinct(
                        CallLog.phone_number
                    )
                ).filter(
                    CallLog.mobile_status
                    == MobileStatusEnum.MISSED,
                ).label("unique_missed"),
            )
            .filter(
                CallLog.employee_context_id.in_(
                    all_context_ids
                ),

                CallLog.call_started_at
                >= CallAnalyticsTeamLeadCallPerformanceService
                ._date_start(from_date),

                CallLog.call_started_at
                < CallAnalyticsTeamLeadCallPerformanceService
                ._date_end(to_date),
            )
            .group_by(
                CallLog.employee_context_id,
                func.date(
                    CallLog.call_started_at
                ),
            )
            .all()
        )

        # =====================================================
        # TEAM LEAD AGGREGATION
        # =====================================================

        team_data = {}

        trends = {}

        for row in rows:

            team_lead_id = context_to_team_lead.get(
                row.employee_context_id
            )

            if team_lead_id is None:
                continue

            if team_lead_id not in team_data:

                team_lead = next(
                    (
                        item
                        for item in team_leads
                        if item.id == team_lead_id
                    ),
                    None,
                )

                team_data[team_lead_id] = {
                    "teamLeadContextId": team_lead_id,
                    "teamLeadEmployeeId": (
                        team_lead.employee_id
                        if team_lead
                        else None
                    ),
                    "teamLeadName": (
                        team_lead.employee.name
                        if team_lead
                        and team_lead.employee
                        else None
                    ),
                    "total": 0,
                    "received": 0,
                    "outgoing": 0,
                    "missed": 0,
                    "uniqueMissed": 0,
                    "applications": 0,
                }

            item = team_data[team_lead_id]

            item["total"] += int(row.total or 0)
            item["received"] += int(row.received or 0)
            item["outgoing"] += int(row.outgoing or 0)
            item["missed"] += int(row.missed or 0)
            item["uniqueMissed"] += int(
                row.unique_missed or 0
            )

            # =================================================
            # DAILY TREND
            # =================================================

            date_key = row.call_date.isoformat()

            if date_key not in trends:

                trends[date_key] = {
                    "date": date_key,
                    "total": 0,
                    "received": 0,
                    "outgoing": 0,
                    "missed": 0,
                    "uniqueMissed": 0,
                    "applications": 0,
                }

            trends[date_key]["total"] += int(
                row.total or 0
            )

            trends[date_key]["received"] += int(
                row.received or 0
            )

            trends[date_key]["outgoing"] += int(
                row.outgoing or 0
            )

            trends[date_key]["missed"] += int(
                row.missed or 0
            )

            trends[date_key]["uniqueMissed"] += int(
                row.unique_missed or 0
            )

        # =====================================================
        # APPLICATIONS
        # =====================================================

        application_rows = (
            db.query(
                LoanApplication.applied_by_context_id.label(
                    "context_id"
                ),

                func.date(
                    LoanApplication.applied_date
                ).label("application_date"),

                func.count(
                    LoanApplication.id
                ).label("application_count"),
            )
            .filter(
                LoanApplication.applied_by_context_id.in_(
                    all_context_ids
                ),

                LoanApplication.applied_date >= from_date,

                LoanApplication.applied_date <= to_date,

                LoanApplication.deleted_at.is_(None),
            )
            .group_by(
                LoanApplication.applied_by_context_id,
                func.date(
                    LoanApplication.applied_date
                ),
            )
            .all()
        )

        for row in application_rows:

            team_lead_id = context_to_team_lead.get(
                row.context_id
            )

            if team_lead_id is None:
                continue

            count = int(
                row.application_count or 0
            )

            team_data[team_lead_id][
                "applications"
            ] += count

            date_key = row.application_date.isoformat()

            if date_key not in trends:

                trends[date_key] = {
                    "date": date_key,
                    "total": 0,
                    "received": 0,
                    "outgoing": 0,
                    "missed": 0,
                    "uniqueMissed": 0,
                    "applications": 0,
                }

            trends[date_key][
                "applications"
            ] += count

        # =====================================================
        # SUMMARY
        # =====================================================

        summary = {
            "total": sum(
                item["total"]
                for item in team_data.values()
            ),

            "received": sum(
                item["received"]
                for item in team_data.values()
            ),

            "outgoing": sum(
                item["outgoing"]
                for item in team_data.values()
            ),

            "missed": sum(
                item["missed"]
                for item in team_data.values()
            ),

            "uniqueMissed": sum(
                item["uniqueMissed"]
                for item in team_data.values()
            ),

            "applications": sum(
                item["applications"]
                for item in team_data.values()
            ),
        }

        return {
            "summary": summary,

            "trends": sorted(
                trends.values(),
                key=lambda item: item["date"],
            ),

            "teamLeads": sorted(
                team_data.values(),
                key=lambda item: item["total"],
                reverse=True,
            ),
        }