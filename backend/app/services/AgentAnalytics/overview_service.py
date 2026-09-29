# backend/app/services/AgentAnalytics/overview_service.py
from datetime import date, datetime, time, timedelta
from typing import Literal, Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.bank_processings import BankProcessing
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication
from app.schemas.AgentAnalytics.overview_schema import (
    AgentAnalyticsCounts,
    AgentAnalyticsFilters,
    AgentAnalyticsPipelineCounts,
    AgentAnalyticsVisibility,
)


class AgentAnalyticsOverviewService:
    """
    Agent Analytics Overview Service.

    Analytics type:

        agent
            Uses AccessControl.get_visible_agents()
            and scopes applications through
            LoanApplication.agent_context_id.

        rm
            Uses AccessControl.get_visible_rms()
            and scopes applications through
            LoanApplication.rm_context_id.

    AccessControl is the single source of truth
    for visibility.

    No separate hierarchy-scope logic is maintained
    in this service.
    """

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _get_default_dates() -> tuple[date, date]:
        """
        Return today's date as both from_date and to_date.
        """

        today = date.today()

        return today, today

    @staticmethod
    def _get_date_bounds(
        from_date: date,
        to_date: date,
    ) -> tuple[datetime, datetime]:
        """
        Convert an inclusive date range into a half-open
        datetime range.

        Example:

            from_date = 2026-08-01
            to_date   = 2026-08-31

        becomes:

            >= 2026-08-01 00:00:00
            <  2026-09-01 00:00:00
        """

        start = datetime.combine(
            from_date,
            time.min,
        )

        end = datetime.combine(
            to_date + timedelta(days=1),
            time.min,
        )

        return start, end

    # =========================================================
    # ACTIVE CONTEXT
    # =========================================================

    @staticmethod
    def _get_active_context(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> EmployeeContext:
        """
        Get the employee's active context.

        AccessControl owns the context-resolution logic.
        """

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:
            raise PermissionError(
                "No active EmployeeContext found for the authenticated employee."
            )

        return active_context

    @staticmethod
    def _get_context_family(
        context: EmployeeContext,
    ) -> Optional[str]:
        """
        Resolve the context family/code.

        Examples:

            GLOBAL
            MANAGER
            TEAMLEAD
            RM
            AGENT
        """

        if not context or not context.context:
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
        """
        Convert EmployeeContext objects into
        EmployeeContext IDs.
        """

        return [
            int(context.id)
            for context in (contexts or [])
            if context is not None
            and context.id is not None
        ]

    # =========================================================
    # VISIBLE TEAM LEADS
    # =========================================================

    @staticmethod
    def _get_visible_team_lead_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> list[int]:
        """
        Get Team Lead contexts visible to the employee.

        AccessControl remains the source of truth.
        """

        contexts = AccessControl.get_visible_team_leads(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        return AgentAnalyticsOverviewService._get_context_ids(
            contexts
        )

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
        """
        Get Agent contexts visible to the employee.

        If a Team Lead is selected, AccessControl applies
        that Team Lead visibility restriction.
        """

        contexts = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return AgentAnalyticsOverviewService._get_context_ids(
            contexts
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
        """
        Get RM contexts visible to the employee.

        If a Team Lead is selected, AccessControl applies
        that Team Lead visibility restriction.
        """

        contexts = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        return AgentAnalyticsOverviewService._get_context_ids(
            contexts
        )

    # =========================================================
    # VALIDATE TYPE
    # =========================================================

    @staticmethod
    def _validate_type(
        analytics_type: str,
    ) -> Literal["agent", "rm"]:
        """
        Validate analytics type.

        Supported values:

            agent
            rm
        """

        value = str(
            analytics_type or ""
        ).strip().lower()

        if value not in {
            "agent",
            "rm",
        }:
            raise ValueError(
                "type must be either 'agent' or 'rm'."
            )

        return value  # type: ignore[return-value]

    # =========================================================
    # FILTER VALIDATION
    # =========================================================

    @staticmethod
    def _validate_selected_filters(
        analytics_type: Literal["agent", "rm"],
        family: Optional[str],
        active_context: EmployeeContext,
        selected_team_lead_context_id: Optional[int],
        selected_agent_context_id: Optional[int],
        selected_rm_context_id: Optional[int],
        visible_team_lead_ids: list[int],
        visible_agent_ids: list[int],
        visible_rm_ids: list[int],
    ) -> None:
        """
        Validate all selected filters against the visibility
        returned by AccessControl.

        Rules:

        Team Lead:
            Only GLOBAL/MANAGER can select Team Lead.

        Agent analytics:
            Agent filter is allowed.
            RM filter is not allowed.

        RM analytics:
            RM filter is allowed.
            Agent filter is not allowed.
        """

        # =====================================================
        # TEAM LEAD
        # =====================================================

        if selected_team_lead_context_id is not None:

            if family not in {
                "GLOBAL",
                "MANAGER",
            }:
                raise PermissionError(
                    "You are not allowed to filter by Team Lead."
                )

            if (
                selected_team_lead_context_id
                not in visible_team_lead_ids
            ):
                raise PermissionError(
                    "Selected Team Lead is outside your visibility scope."
                )

        # =====================================================
        # AGENT
        # =====================================================

        if selected_agent_context_id is not None:

            if analytics_type != "agent":
                raise PermissionError(
                    "Agent filter is not available for RM analytics."
                )

            if (
                selected_agent_context_id
                not in visible_agent_ids
            ):
                raise PermissionError(
                    "Selected Agent is outside your visibility scope."
                )

        # =====================================================
        # RM
        # =====================================================

        if selected_rm_context_id is not None:

            if analytics_type != "rm":
                raise PermissionError(
                    "RM filter is not available for Agent analytics."
                )

            if (
                selected_rm_context_id
                not in visible_rm_ids
            ):
                raise PermissionError(
                    "Selected RM is outside your visibility scope."
                )

    # =========================================================
    # BASE APPLICATION QUERY
    # =========================================================

    @staticmethod
    def _build_base_query(
        db: Session,
        analytics_type: Literal["agent", "rm"],
        visible_agent_ids: list[int],
        visible_rm_ids: list[int],
        agent_context_id: Optional[int],
        rm_context_id: Optional[int],
        loan_type_id: Optional[int],
    ):
        """
        Build the common LoanApplication query.

        Primary scope:

            type=agent
                LoanApplication.agent_context_id
                must belong to visible_agent_ids.

            type=rm
                LoanApplication.rm_context_id
                must belong to visible_rm_ids.

        Additional filters:

            agent_context_id
            rm_context_id
            loan_type_id
        """

        query = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.deleted_at.is_(None)
            )
        )

        # =====================================================
        # PRIMARY ANALYTICS SCOPE
        # =====================================================

        if analytics_type == "agent":

            if not visible_agent_ids:
                return query.filter(False)

            query = query.filter(
                LoanApplication.agent_context_id.in_(
                    visible_agent_ids
                )
            )

        elif analytics_type == "rm":

            if not visible_rm_ids:
                return query.filter(False)

            query = query.filter(
                LoanApplication.rm_context_id.in_(
                    visible_rm_ids
                )
            )

        else:
            return query.filter(False)

        # =====================================================
        # EXPLICIT AGENT FILTER
        # =====================================================

        if agent_context_id is not None:

            query = query.filter(
                LoanApplication.agent_context_id
                == agent_context_id
            )

        # =====================================================
        # EXPLICIT RM FILTER
        # =====================================================

        if rm_context_id is not None:

            query = query.filter(
                LoanApplication.rm_context_id
                == rm_context_id
            )

        # =====================================================
        # LOAN TYPE FILTER
        # =====================================================

        if loan_type_id is not None:

            query = query.filter(
                LoanApplication.loan_type_id
                == loan_type_id
            )

        return query

    # =========================================================
    # PIPELINE INSIGHTS
    # =========================================================

    @staticmethod
    def _get_event_counts(
        base_query,
        from_date: date,
        to_date: date,
    ) -> AgentAnalyticsCounts:
        """
        Pipeline Insights.

        Event/date based.

        Total Leads:
            LoanApplication.applied_date in selected range.

        In Process:
            1. applied_date in selected range
               AND status = inprocess

            OR

            2. docspending_date in selected range
               AND status = docspending

        Rejected:
            LoanApplication.rejection_date in selected range.

        Login:
            BankProcessing.loggedin_at in selected range
            AND sanctioned_at IS NULL
            AND disbursed_at IS NULL
            AND rejected_at IS NULL.

        Sanctioned:
            loggedin_at IS NOT NULL
            AND sanctioned_at in selected range
            AND disbursed_at IS NULL
            AND rejected_at IS NULL.

        Disbursed:
            loggedin_at IS NOT NULL
            AND sanctioned_at IS NOT NULL
            AND disbursed_at in selected range
            AND rejected_at IS NULL.

        Login/Sanctioned/Disbursed count individual
        BankProcessing rows.
        """

        start_datetime, end_datetime = (
            AgentAnalyticsOverviewService._get_date_bounds(
                from_date,
                to_date,
            )
        )

        # =====================================================
        # TOTAL LEADS
        # =====================================================

        total_leads = (
            base_query
            .filter(
                LoanApplication.applied_date
                >= start_datetime,
                LoanApplication.applied_date
                < end_datetime,
            )
            .count()
        )

        # =====================================================
        # IN PROCESS
        # =====================================================

        in_process = (
            base_query
            .filter(
                or_(
                    (
                        LoanApplication.applied_date
                        >= start_datetime
                    )
                    & (
                        LoanApplication.applied_date
                        < end_datetime
                    )
                    & (
                        LoanApplication.status
                        == "inprocess"
                    ),
                    (
                        LoanApplication.docspending_date
                        >= start_datetime
                    )
                    & (
                        LoanApplication.docspending_date
                        < end_datetime
                    )
                    & (
                        LoanApplication.status
                        == "docspending"
                    ),
                )
            )
            .count()
        )

        # =====================================================
        # REJECTED
        # =====================================================

        rejected = (
            base_query
            .filter(
                LoanApplication.rejection_date
                >= start_datetime,
                LoanApplication.rejection_date
                < end_datetime,
            )
            .count()
        )

        # =====================================================
        # BANK PROCESSING BASE
        # =====================================================

        bank_query = (
            base_query
            .join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
        )

        # =====================================================
        # LOGIN
        # =====================================================

        login = (
            bank_query
            .filter(
                BankProcessing.loggedin_at
                >= start_datetime,
                BankProcessing.loggedin_at
                < end_datetime,
                BankProcessing.sanctioned_at.is_(None),
                BankProcessing.disbursed_at.is_(None),
                BankProcessing.rejected_at.is_(None),
            )
            .count()
        )

        # =====================================================
        # SANCTIONED
        # =====================================================

        sanctioned = (
            bank_query
            .filter(
                BankProcessing.loggedin_at.isnot(None),
                BankProcessing.sanctioned_at
                >= start_datetime,
                BankProcessing.sanctioned_at
                < end_datetime,
                BankProcessing.disbursed_at.is_(None),
                BankProcessing.rejected_at.is_(None),
            )
            .count()
        )

        # =====================================================
        # DISBURSED
        # =====================================================

        disbursed = (
            bank_query
            .filter(
                BankProcessing.loggedin_at.isnot(None),
                BankProcessing.sanctioned_at.isnot(None),
                BankProcessing.disbursed_at
                >= start_datetime,
                BankProcessing.disbursed_at
                < end_datetime,
                BankProcessing.rejected_at.is_(None),
            )
            .count()
        )

        return AgentAnalyticsCounts(
            total_leads=int(total_leads),
            in_process=int(in_process),
            login=int(login),
            sanctioned=int(sanctioned),
            disbursed=int(disbursed),
            rejected=int(rejected),
        )

    # =========================================================
    # APPLICATION PIPELINE
    # =========================================================

    @staticmethod
    def _get_application_pipeline(
        base_query,
        from_date: date,
        to_date: date,
    ) -> AgentAnalyticsPipelineCounts:
        """
        Application Pipeline.

        Cohort:

            LoanApplication.applied_date
            in selected date range.

        Categories are NOT mutually exclusive.

        Total Leads:
            Count of applications in the cohort.

        In Process:
            status = inprocess
            OR
            status = docspending.

        Rejected:
            status = rejected.

        Login:
            Qualifying BankProcessing rows.

        Sanctioned:
            Qualifying BankProcessing rows.

        Disbursed:
            Qualifying BankProcessing rows.

        Login/Sanctioned/Disbursed count individual
        BankProcessing rows.

        Therefore, one application may contribute to
        multiple BankProcessing categories.
        """

        start_datetime, end_datetime = (
            AgentAnalyticsOverviewService._get_date_bounds(
                from_date,
                to_date,
            )
        )

        # =====================================================
        # APPLICATION COHORT
        # =====================================================

        cohort = (
            base_query
            .filter(
                LoanApplication.applied_date
                >= start_datetime,
                LoanApplication.applied_date
                < end_datetime,
            )
        )

        # =====================================================
        # TOTAL LEADS
        # =====================================================

        total_leads = cohort.count()

        # =====================================================
        # IN PROCESS
        # =====================================================

        in_process = (
            cohort
            .filter(
                LoanApplication.status.in_(
                    [
                        "inprocess",
                        "docspending",
                    ]
                )
            )
            .count()
        )

        # =====================================================
        # REJECTED
        # =====================================================

        rejected = (
            cohort
            .filter(
                LoanApplication.status
                == "rejected"
            )
            .count()
        )

        # =====================================================
        # BANK PROCESSING BASE
        # =====================================================

        bank_query = (
            cohort
            .join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
        )

        # =====================================================
        # LOGIN
        # =====================================================

        login = (
            bank_query
            .filter(
                BankProcessing.loggedin_at.isnot(None),
                BankProcessing.sanctioned_at.is_(None),
                BankProcessing.disbursed_at.is_(None),
                BankProcessing.rejected_at.is_(None),
            )
            .count()
        )

        # =====================================================
        # SANCTIONED
        # =====================================================

        sanctioned = (
            bank_query
            .filter(
                BankProcessing.status
                == "sanctioned",
                BankProcessing.loggedin_at.isnot(None),
                BankProcessing.sanctioned_at.isnot(None),
                BankProcessing.disbursed_at.is_(None),
                BankProcessing.rejected_at.is_(None),
            )
            .count()
        )

        # =====================================================
        # DISBURSED
        # =====================================================

        disbursed = (
            bank_query
            .filter(
                BankProcessing.status
                == "disbursed",
                BankProcessing.loggedin_at.isnot(None),
                BankProcessing.sanctioned_at.isnot(None),
                BankProcessing.disbursed_at.isnot(None),
                BankProcessing.rejected_at.is_(None),
            )
            .count()
        )

        return AgentAnalyticsPipelineCounts(
            total_leads=int(total_leads),
            in_process=int(in_process),
            login=int(login),
            sanctioned=int(sanctioned),
            disbursed=int(disbursed),
            rejected=int(rejected),
        )

    # =========================================================
    # MAIN OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(
        db: Session,
        employee: Employee,
        analytics_type: str = "agent",
        team_lead_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        context_id: Optional[int] = None,
    ) -> dict:
        """
        Return Agent Analytics Overview.

        analytics_type:

            agent
                Use visible Agent contexts from
                AccessControl as the primary scope.

            rm
                Use visible RM contexts from
                AccessControl as the primary scope.

        Filters:

            team_lead_context_id
            agent_context_id
            rm_context_id
            loan_type_id
            from_date
            to_date

        Both Pipeline Insights and Application Pipeline
        use the same visibility/application scope.
        """

        # =====================================================
        # AUTHENTICATION
        # =====================================================

        if not employee:
            raise PermissionError(
                "Authenticated employee is required."
            )

        # =====================================================
        # ANALYTICS TYPE
        # =====================================================

        analytics_type = (
            AgentAnalyticsOverviewService
            ._validate_type(
                analytics_type
            )
        )

        # =====================================================
        # DATE RANGE
        # =====================================================

        if (
            from_date is None
            and to_date is None
        ):

            from_date, to_date = (
                AgentAnalyticsOverviewService
                ._get_default_dates()
            )

        elif from_date is None:

            from_date = to_date

        elif to_date is None:

            to_date = from_date

        if (
            from_date is None
            or to_date is None
        ):
            raise ValueError(
                "Unable to resolve analytics date range."
            )

        if from_date > to_date:
            raise ValueError(
                "from_date cannot be greater than to_date."
            )

        # =====================================================
        # ACTIVE CONTEXT
        # =====================================================

        active_context = (
            AgentAnalyticsOverviewService
            ._get_active_context(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        family = (
            AgentAnalyticsOverviewService
            ._get_context_family(
                active_context
            )
        )

        # =====================================================
        # VISIBLE TEAM LEADS
        # =====================================================

        visible_team_lead_ids = (
            AgentAnalyticsOverviewService
            ._get_visible_team_lead_ids(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        # =====================================================
        # VISIBLE AGENTS
        # =====================================================

        visible_agent_ids = (
            AgentAnalyticsOverviewService
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
            AgentAnalyticsOverviewService
            ._get_visible_rm_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        )

        # =====================================================
        # FILTER VALIDATION
        # =====================================================

        AgentAnalyticsOverviewService._validate_selected_filters(
            analytics_type=analytics_type,
            family=family,
            active_context=active_context,
            selected_team_lead_context_id=team_lead_context_id,
            selected_agent_context_id=agent_context_id,
            selected_rm_context_id=rm_context_id,
            visible_team_lead_ids=visible_team_lead_ids,
            visible_agent_ids=visible_agent_ids,
            visible_rm_ids=visible_rm_ids,
        )

        # =====================================================
        # COMMON BASE QUERY
        # =====================================================

        base_query = (
            AgentAnalyticsOverviewService
            ._build_base_query(
                db=db,
                analytics_type=analytics_type,
                visible_agent_ids=visible_agent_ids,
                visible_rm_ids=visible_rm_ids,
                agent_context_id=agent_context_id,
                rm_context_id=rm_context_id,
                loan_type_id=loan_type_id,
            )
        )

        # =====================================================
        # PIPELINE INSIGHTS
        # =====================================================

        counts = (
            AgentAnalyticsOverviewService
            ._get_event_counts(
                base_query=base_query,
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # APPLICATION PIPELINE
        # =====================================================

        pipeline = (
            AgentAnalyticsOverviewService
            ._get_application_pipeline(
                base_query=base_query,
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # FILTER RESPONSE
        # =====================================================

        filters = AgentAnalyticsFilters(
            type=analytics_type,
            team_lead_context_id=team_lead_context_id,
            agent_context_id=agent_context_id,
            rm_context_id=rm_context_id,
            loan_type_id=loan_type_id,
            from_date=from_date,
            to_date=to_date,
        )

        # =====================================================
        # VISIBILITY RESPONSE
        # =====================================================

        visibility = AgentAnalyticsVisibility(
            team_lead_context_ids=visible_team_lead_ids,
            agent_context_ids=visible_agent_ids,
            rm_context_ids=visible_rm_ids,
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "type": analytics_type,
            "counts": counts,
            "pipeline": pipeline,
            "filters": filters,
            "visibility": visibility,
        }