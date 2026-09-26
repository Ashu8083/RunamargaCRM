# backend/app/services/AgentAnalytics/overview_service.py

from datetime import date, datetime, time, timedelta
from typing import Optional

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
    Agent Analytics Overview service.

    This service intentionally provides TWO different analytics
    views.

    =============================================================
    1. PIPELINE INSIGHTS -> `counts`
    =============================================================

    This section is EVENT / DATE based.

    The selected date range determines which events happened
    during that period.

        Total Leads
            -> LoanApplication.applied_date

        Login
            -> BankProcessing.loggedin_at

        Sanctioned
            -> BankProcessing.sanctioned_at

        Disbursed
            -> BankProcessing.disbursed_at

        Rejected
            -> LoanApplication.rejection_date

    =============================================================
    2. APPLICATION PIPELINE -> `pipeline`
    =============================================================

    This section is APPLICATION COHORT based.

    First:

        LoanApplication.applied_date

    selects the applications belonging to the selected date
    range.

    Then the current/latest status of those applications is
    determined.

    The application is counted in ONLY ONE current-status bucket.

        Rejected
        Disbursed
        Sanctioned
        Login
        In Process

    Example:

        Application:
            applied_date = 2026-08-10

        BankProcessing:
            Bank A -> Login
            Bank B -> Sanction
            Bank C -> Disbursement

    Application Pipeline:

        Disbursed = 1
        Sanctioned = 0
        Login = 0
        In Process = 0

    Another example:

        Bank A -> Login
        Bank B -> Sanction

    Application Pipeline:

        Sanctioned = 1

    Another example:

        Bank A -> Login
        Bank B -> Login

    Application Pipeline:

        Login = 1

    =============================================================
    ACCESS CONTROL
    =============================================================

    AccessControl is used through its static methods.

    It is NOT instantiated.
    """

    # =========================================================
    # DATE HELPERS
    # =========================================================

    @staticmethod
    def _get_default_dates() -> tuple[date, date]:
        """
        Default analytics period is today.
        """

        today = date.today()

        return today, today

    @staticmethod
    def _get_date_range_datetimes(
        from_date: date,
        to_date: date,
    ) -> tuple[datetime, datetime]:
        """
        Convert an inclusive date range into a half-open
        datetime range.

        Example:

            2026-08-01 -> 2026-08-31

        becomes:

            >= 2026-08-01 00:00:00
            <  2026-09-01 00:00:00
        """

        start_datetime = datetime.combine(
            from_date,
            time.min,
        )

        end_datetime = datetime.combine(
            to_date + timedelta(days=1),
            time.min,
        )

        return (
            start_datetime,
            end_datetime,
        )

    @staticmethod
    def _date_range_condition(
        column,
        from_date: date,
        to_date: date,
    ):
        """
        Build an inclusive date-range SQL condition.

        The helper is used for both DATE and DATETIME-like
        database columns.
        """

        start_datetime, end_datetime = (
            AgentAnalyticsOverviewService
            ._get_date_range_datetimes(
                from_date=from_date,
                to_date=to_date,
            )
        )

        return (
            (column >= start_datetime)
            & (column < end_datetime)
        )

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
        Resolve the authenticated employee's active context.

        AccessControl is called statically.
        """

        active_context = (
            AccessControl.get_active_context(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        if not active_context:

            raise PermissionError(
                "No active EmployeeContext found for the authenticated employee."
            )

        return active_context

    # =========================================================
    # CONTEXT FAMILY
    # =========================================================

    @staticmethod
    def _get_context_family(
        context: EmployeeContext,
    ) -> Optional[str]:
        """
        Resolve context family.

        Possible values include:

            GLOBAL
            MANAGER
            TEAMLEAD
            RM
            AGENT
        """

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
        """
        Convert EmployeeContext objects to EmployeeContext IDs.
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
        Get visible Team Lead EmployeeContext IDs.
        """

        contexts = (
            AccessControl.get_visible_team_leads(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        return (
            AgentAnalyticsOverviewService
            ._get_context_ids(
                contexts
            )
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
        Get visible Agent EmployeeContext IDs.

        Team Lead filtering is passed directly to
        AccessControl so hierarchy resolution remains
        centralized there.
        """

        contexts = (
            AccessControl.get_visible_agents(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=(
                    team_lead_context_id
                ),
            )
        )

        return (
            AgentAnalyticsOverviewService
            ._get_context_ids(
                contexts
            )
        )

    # =========================================================
    # VISIBLE RMs
    # =========================================================

    @staticmethod
    def _get_visible_rm_ids(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        team_lead_context_id: Optional[int] = None,
    ) -> list[int]:
        """
        Get visible RM EmployeeContext IDs.
        """

        contexts = (
            AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=(
                    team_lead_context_id
                ),
            )
        )

        return (
            AgentAnalyticsOverviewService
            ._get_context_ids(
                contexts
            )
        )

    # =========================================================
    # HIERARCHY SCOPE
    # =========================================================

    @staticmethod
    def _apply_hierarchy_scope(
        query,
        family: Optional[str],
        active_context: EmployeeContext,
        visible_agent_ids: list[int],
        visible_rm_ids: list[int],
        selected_team_lead_context_id: Optional[int] = None,
    ):
        """
        Apply hierarchy visibility to LoanApplication.

        All hierarchy fields use EmployeeContext IDs.
        """

        # =====================================================
        # GLOBAL / MANAGER
        # =====================================================

        if family in {
            "GLOBAL",
            "MANAGER",
        }:

            conditions = []

            if visible_agent_ids:

                conditions.append(
                    LoanApplication.agent_context_id.in_(
                        visible_agent_ids
                    )
                )

            if visible_rm_ids:

                conditions.append(
                    LoanApplication.rm_context_id.in_(
                        visible_rm_ids
                    )
                )

            # -------------------------------------------------
            # If AccessControl returned no restrictions, allow
            # the full application set.
            # -------------------------------------------------

            if not conditions:

                return query

            return query.filter(
                or_(*conditions)
            )

        # =====================================================
        # TEAM LEAD
        # =====================================================

        if family == "TEAMLEAD":

            conditions = []

            if visible_agent_ids:

                conditions.append(
                    LoanApplication.agent_context_id.in_(
                        visible_agent_ids
                    )
                )

            if visible_rm_ids:

                conditions.append(
                    LoanApplication.rm_context_id.in_(
                        visible_rm_ids
                    )
                )

            if not conditions:

                return query.filter(False)

            return query.filter(
                or_(*conditions)
            )

        # =====================================================
        # RM
        # =====================================================

        if family == "RM":

            conditions = [
                LoanApplication.rm_context_id
                == active_context.id
            ]

            if visible_agent_ids:

                conditions.append(
                    LoanApplication.agent_context_id.in_(
                        visible_agent_ids
                    )
                )

            return query.filter(
                or_(*conditions)
            )

        # =====================================================
        # AGENT
        # =====================================================

        if family == "AGENT":

            return query.filter(
                LoanApplication.agent_context_id
                == active_context.id
            )

        # =====================================================
        # UNKNOWN
        # =====================================================

        return query.filter(False)

    # =========================================================
    # FILTER VALIDATION
    # =========================================================

    @staticmethod
    def _validate_selected_filters(
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
        Validate requested hierarchy filters against the
        authenticated employee's visibility.
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

            if family == "AGENT":

                if (
                    selected_agent_context_id
                    != active_context.id
                ):

                    raise PermissionError(
                        "Selected Agent is outside your visibility scope."
                    )

            elif (
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

            if family == "RM":

                if (
                    selected_rm_context_id
                    != active_context.id
                ):

                    raise PermissionError(
                        "Selected RM is outside your visibility scope."
                    )

            elif (
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
        family: Optional[str],
        active_context: EmployeeContext,
        visible_agent_ids: list[int],
        visible_rm_ids: list[int],
        selected_team_lead_context_id: Optional[int],
        agent_context_id: Optional[int],
        rm_context_id: Optional[int],
        loan_type_id: Optional[int],
    ):
        """
        Build the common LoanApplication query.

        Applied filters:

            - deleted_at
            - hierarchy visibility
            - selected Agent
            - selected RM
            - selected Loan Type

        No date filter is applied here.
        """

        query = (
            db.query(
                LoanApplication
            )
            .filter(
                LoanApplication.deleted_at.is_(None)
            )
        )

        query = (
            AgentAnalyticsOverviewService
            ._apply_hierarchy_scope(
                query=query,
                family=family,
                active_context=active_context,
                visible_agent_ids=visible_agent_ids,
                visible_rm_ids=visible_rm_ids,
                selected_team_lead_context_id=(
                    selected_team_lead_context_id
                ),
            )
        )

        # -----------------------------------------------------
        # AGENT FILTER
        # -----------------------------------------------------

        if agent_context_id is not None:

            query = query.filter(
                LoanApplication.agent_context_id
                == agent_context_id
            )

        # -----------------------------------------------------
        # RM FILTER
        # -----------------------------------------------------

        if rm_context_id is not None:

            query = query.filter(
                LoanApplication.rm_context_id
                == rm_context_id
            )

        # -----------------------------------------------------
        # LOAN TYPE FILTER
        # -----------------------------------------------------

        if loan_type_id is not None:

            query = query.filter(
                LoanApplication.loan_type_id
                == loan_type_id
            )

        return query

    # =========================================================
    # COHORT APPLICATIONS
    # =========================================================

    @staticmethod
    def _get_cohort_applications(
        base_query,
        from_date: date,
        to_date: date,
    ) -> list[LoanApplication]:
        """
        Return applications whose applied_date falls inside
        the selected date range.

        This is the cohort used by Application Pipeline.
        """

        applied_condition = (
            AgentAnalyticsOverviewService
            ._date_range_condition(
                LoanApplication.applied_date,
                from_date,
                to_date,
            )
        )

        return (
            base_query
            .filter(
                applied_condition
            )
            .all()
        )

    # =========================================================
    # PIPELINE INSIGHTS
    # =========================================================

    @staticmethod
    def _get_event_counts(
        db: Session,
        base_query,
        from_date: date,
        to_date: date,
    ) -> AgentAnalyticsCounts:
        """
        Calculate Pipeline Insights.

        These counts are based on events occurring during the
        selected date range.

        IMPORTANT:

        This is intentionally different from Application
        Pipeline.

        Application Pipeline asks:

            "What is the current status of applications
             applied during this period?"

        Pipeline Insights asks:

            "What events happened during this period?"
        """

        # =====================================================
        # TOTAL LEADS
        # =====================================================
        #
        # Total Leads are applications applied during the
        # selected period.
        # =====================================================

        applied_condition = (
            AgentAnalyticsOverviewService
            ._date_range_condition(
                LoanApplication.applied_date,
                from_date,
                to_date,
            )
        )

        total_leads = (
            base_query
            .filter(
                applied_condition
            )
            .count()
        )

        # =====================================================
        # REJECTED
        # =====================================================
        #
        # Rejected uses LoanApplication.rejection_date.
        # =====================================================

        rejection_condition = (
            AgentAnalyticsOverviewService
            ._date_range_condition(
                LoanApplication.rejection_date,
                from_date,
                to_date,
            )
        )

        rejected = (
            base_query
            .filter(
                rejection_condition
            )
            .count()
        )

        # =====================================================
        # LOGIN
        # =====================================================
        #
        # Login uses BankProcessing.loggedin_at.
        #
        # DISTINCT application IDs are counted so multiple
        # banks for the same application do not create multiple
        # Login counts.
        # =====================================================

        login_condition = (
            AgentAnalyticsOverviewService
            ._date_range_condition(
                BankProcessing.loggedin_at,
                from_date,
                to_date,
            )
        )

        login = (
            base_query
            .join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
            .filter(
                login_condition
            )
            .with_entities(
                LoanApplication.id
            )
            .distinct()
            .count()
        )

        # =====================================================
        # SANCTIONED
        # =====================================================

        sanction_condition = (
            AgentAnalyticsOverviewService
            ._date_range_condition(
                BankProcessing.sanctioned_at,
                from_date,
                to_date,
            )
        )

        sanctioned = (
            base_query
            .join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
            .filter(
                sanction_condition
            )
            .with_entities(
                LoanApplication.id
            )
            .distinct()
            .count()
        )

        # =====================================================
        # DISBURSED
        # =====================================================

        disbursement_condition = (
            AgentAnalyticsOverviewService
            ._date_range_condition(
                BankProcessing.disbursed_at,
                from_date,
                to_date,
            )
        )

        disbursed = (
            base_query
            .join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
            .filter(
                disbursement_condition
            )
            .with_entities(
                LoanApplication.id
            )
            .distinct()
            .count()
        )

        # =====================================================
        # IN PROCESS
        # =====================================================
        #
        # Pipeline Insights needs an event/date-based
        # in-process count.
        #
        # We therefore use applications applied during the
        # selected period and remove applications that already
        # have a Login/Sanction/Disbursement event or rejection
        # during the same period.
        #
        # This count is intentionally separate from the
        # Application Pipeline current-status calculation.
        # =====================================================

        cohort_query = (
            base_query
            .filter(
                applied_condition
            )
        )

        cohort_applications = (
            cohort_query
            .all()
        )

        if not cohort_applications:

            in_process = 0

        else:

            application_ids = [
                int(application.id)
                for application in cohort_applications
                if application.id is not None
            ]

            processing_rows = (
                db.query(
                    BankProcessing
                )
                .filter(
                    BankProcessing.loan_id.in_(
                        application_ids
                    )
                )
                .filter(
                    BankProcessing.deleted_at.is_(None)
                )
                .all()
            )

            processing_by_application: dict[
                int,
                list[BankProcessing],
            ] = {}

            for row in processing_rows:

                loan_id = getattr(
                    row,
                    "loan_id",
                    None,
                )

                if loan_id is None:
                    continue

                processing_by_application.setdefault(
                    int(loan_id),
                    [],
                ).append(
                    row
                )

            in_process = 0

            for application in cohort_applications:

                application_id = (
                    int(application.id)
                    if application.id is not None
                    else None
                )

                rows = (
                    processing_by_application.get(
                        application_id,
                        [],
                    )
                )

                # -------------------------------------------------
                # Has rejection during selected period?
                # -------------------------------------------------

                rejected_in_period = (
                    getattr(
                        application,
                        "rejection_date",
                        None,
                    ) is not None
                    and
                    AgentAnalyticsOverviewService
                    ._value_in_date_range(
                        getattr(
                            application,
                            "rejection_date",
                            None,
                        ),
                        from_date,
                        to_date,
                    )
                )

                # -------------------------------------------------
                # Has Login during selected period?
                # -------------------------------------------------

                login_in_period = any(
                    AgentAnalyticsOverviewService
                    ._value_in_date_range(
                        getattr(
                            row,
                            "loggedin_at",
                            None,
                        ),
                        from_date,
                        to_date,
                    )
                    for row in rows
                )

                # -------------------------------------------------
                # Has Sanction during selected period?
                # -------------------------------------------------

                sanction_in_period = any(
                    AgentAnalyticsOverviewService
                    ._value_in_date_range(
                        getattr(
                            row,
                            "sanctioned_at",
                            None,
                        ),
                        from_date,
                        to_date,
                    )
                    for row in rows
                )

                # -------------------------------------------------
                # Has Disbursement during selected period?
                # -------------------------------------------------

                disbursement_in_period = any(
                    AgentAnalyticsOverviewService
                    ._value_in_date_range(
                        getattr(
                            row,
                            "disbursed_at",
                            None,
                        ),
                        from_date,
                        to_date,
                    )
                    for row in rows
                )

                if not (
                    rejected_in_period
                    or login_in_period
                    or sanction_in_period
                    or disbursement_in_period
                ):

                    in_process += 1

        return AgentAnalyticsCounts(
            total_leads=int(
                total_leads
            ),
            in_process=int(
                in_process
            ),
            login=int(
                login
            ),
            sanctioned=int(
                sanctioned
            ),
            disbursed=int(
                disbursed
            ),
            rejected=int(
                rejected
            ),
        )

    # =========================================================
    # VALUE DATE CHECK
    # =========================================================

    @staticmethod
    def _value_in_date_range(
        value,
        from_date: date,
        to_date: date,
    ) -> bool:
        """
        Check whether a date/datetime value falls within the
        inclusive analytics date range.

        This is used for in-memory Pipeline Insights
        calculations.
        """

        if value is None:

            return False

        if isinstance(
            value,
            datetime,
        ):

            value_date = value.date()

        elif isinstance(
            value,
            date,
        ):

            value_date = value

        else:

            return False

        return (
            from_date
            <= value_date
            <= to_date
        )

    # =========================================================
    # STATUS DATE EXTRACTION
    # =========================================================

    @staticmethod
    def _get_latest_status_event(
        application: LoanApplication,
        processing_rows: list[BankProcessing],
    ) -> tuple[
        Optional[str],
        Optional[datetime],
    ]:
        """
        Determine the latest reached status for an application.

        Status hierarchy:

            REJECTED
            DISBURSED
            SANCTIONED
            LOGIN
            IN_PROCESS

        The latest timestamp is used when multiple bank
        processing records exist.

        Important:

        We compare actual status event timestamps rather than
        simply checking whether a field is populated.

        Example:

            Bank A:
                login = Aug 10

            Bank B:
                sanction = Aug 12

            Bank C:
                disbursement = Aug 15

        Result:

            DISBURSED
        """

        events: list[
            tuple[str, datetime]
        ] = []

        # =====================================================
        # APPLICATION-LEVEL REJECTION
        # =====================================================

        rejection_date = getattr(
            application,
            "rejection_date",
            None,
        )

        if rejection_date is not None:

            normalized = (
                AgentAnalyticsOverviewService
                ._normalize_datetime(
                    rejection_date
                )
            )

            if normalized is not None:

                events.append(
                    (
                        "REJECTED",
                        normalized,
                    )
                )

        # =====================================================
        # APPLICATION-LEVEL LOGIN
        # =====================================================

        loggedin_date = getattr(
            application,
            "loggedin_date",
            None,
        )

        if loggedin_date is not None:

            normalized = (
                AgentAnalyticsOverviewService
                ._normalize_datetime(
                    loggedin_date
                )
            )

            if normalized is not None:

                events.append(
                    (
                        "LOGIN",
                        normalized,
                    )
                )

        # =====================================================
        # APPLICATION-LEVEL SANCTION
        # =====================================================

        sanction_date = getattr(
            application,
            "sanction_date",
            None,
        )

        if sanction_date is not None:

            normalized = (
                AgentAnalyticsOverviewService
                ._normalize_datetime(
                    sanction_date
                )
            )

            if normalized is not None:

                events.append(
                    (
                        "SANCTIONED",
                        normalized,
                    )
                )

        # =====================================================
        # APPLICATION-LEVEL DISBURSEMENT
        # =====================================================

        disbursement_date = getattr(
            application,
            "disbursement_date",
            None,
        )

        if disbursement_date is not None:

            normalized = (
                AgentAnalyticsOverviewService
                ._normalize_datetime(
                    disbursement_date
                )
            )

            if normalized is not None:

                events.append(
                    (
                        "DISBURSED",
                        normalized,
                    )
                )

        # =====================================================
        # BANK PROCESSING EVENTS
        # =====================================================

        for row in processing_rows:

            # -------------------------------------------------
            # LOGIN
            # -------------------------------------------------

            loggedin_at = getattr(
                row,
                "loggedin_at",
                None,
            )

            if loggedin_at is not None:

                normalized = (
                    AgentAnalyticsOverviewService
                    ._normalize_datetime(
                        loggedin_at
                    )
                )

                if normalized is not None:

                    events.append(
                        (
                            "LOGIN",
                            normalized,
                        )
                    )

            # -------------------------------------------------
            # SANCTION
            # -------------------------------------------------

            sanctioned_at = getattr(
                row,
                "sanctioned_at",
                None,
            )

            if sanctioned_at is not None:

                normalized = (
                    AgentAnalyticsOverviewService
                    ._normalize_datetime(
                        sanctioned_at
                    )
                )

                if normalized is not None:

                    events.append(
                        (
                            "SANCTIONED",
                            normalized,
                        )
                    )

            # -------------------------------------------------
            # DISBURSEMENT
            # -------------------------------------------------

            disbursed_at = getattr(
                row,
                "disbursed_at",
                None,
            )

            if disbursed_at is not None:

                normalized = (
                    AgentAnalyticsOverviewService
                    ._normalize_datetime(
                        disbursed_at
                    )
                )

                if normalized is not None:

                    events.append(
                        (
                            "DISBURSED",
                            normalized,
                        )
                    )

            # -------------------------------------------------
            # REJECTION
            # -------------------------------------------------

            rejected_at = getattr(
                row,
                "rejected_at",
                None,
            )

            if rejected_at is not None:

                normalized = (
                    AgentAnalyticsOverviewService
                    ._normalize_datetime(
                        rejected_at
                    )
                )

                if normalized is not None:

                    events.append(
                        (
                            "REJECTED",
                            normalized,
                        )
                    )

        # =====================================================
        # NO STATUS EVENT
        # =====================================================

        if not events:

            return (
                "IN_PROCESS",
                None,
            )

        # =====================================================
        # LATEST EVENT
        # =====================================================

        latest_status, latest_datetime = max(
            events,
            key=lambda item: item[1],
        )

        return (
            latest_status,
            latest_datetime,
        )

    # =========================================================
    # NORMALIZE STATUS DATETIME
    # =========================================================

    @staticmethod
    def _normalize_datetime(
        value,
    ) -> Optional[datetime]:
        """
        Normalize date/datetime values to datetime.

        Date values are converted to midnight.

        Unsupported values return None.
        """

        if value is None:

            return None

        if isinstance(
            value,
            datetime,
        ):

            return value

        if isinstance(
            value,
            date,
        ):

            return datetime.combine(
                value,
                time.min,
            )

        return None

    # =========================================================
    # APPLICATION PIPELINE
    # =========================================================

    @staticmethod
    def _get_application_pipeline(
        db: Session,
        applications: list[LoanApplication],
    ) -> AgentAnalyticsPipelineCounts:
        """
        Calculate current-status counts for the selected
        application cohort.

        The applications are already selected using:

            LoanApplication.applied_date

        No event-date filtering is performed here.

        Every application is assigned to exactly ONE bucket.
        """

        total_leads = len(
            applications
        )

        # =====================================================
        # EMPTY COHORT
        # =====================================================

        if not applications:

            return AgentAnalyticsPipelineCounts(
                total_leads=0,
                in_process=0,
                login=0,
                sanctioned=0,
                disbursed=0,
                rejected=0,
            )

        # =====================================================
        # APPLICATION IDS
        # =====================================================

        application_ids = [
            int(application.id)
            for application in applications
            if application.id is not None
        ]

        # =====================================================
        # LOAD ALL BANK PROCESSING ROWS
        # =====================================================
        #
        # NO DATE FILTER.
        #
        # We need the complete status history to determine the
        # CURRENT status of the application.
        # =====================================================

        processing_rows = (
            db.query(
                BankProcessing
            )
            .filter(
                BankProcessing.loan_id.in_(
                    application_ids
                )
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
            .all()
        )

        processing_by_application: dict[
            int,
            list[BankProcessing],
        ] = {}

        for row in processing_rows:

            loan_id = getattr(
                row,
                "loan_id",
                None,
            )

            if loan_id is None:
                continue

            processing_by_application.setdefault(
                int(loan_id),
                [],
            ).append(
                row
            )

        # =====================================================
        # COUNTERS
        # =====================================================

        in_process = 0

        login = 0

        sanctioned = 0

        disbursed = 0

        rejected = 0

        # =====================================================
        # CURRENT STATUS OF EACH APPLICATION
        # =====================================================

        for application in applications:

            application_id = (
                int(application.id)
                if application.id is not None
                else None
            )

            rows = (
                processing_by_application.get(
                    application_id,
                    [],
                )
            )

            current_status, _ = (
                AgentAnalyticsOverviewService
                ._get_latest_status_event(
                    application=application,
                    processing_rows=rows,
                )
            )

            # -------------------------------------------------
            # CURRENT STATUS
            # -------------------------------------------------

            if current_status == "REJECTED":

                rejected += 1

            elif current_status == "DISBURSED":

                disbursed += 1

            elif current_status == "SANCTIONED":

                sanctioned += 1

            elif current_status == "LOGIN":

                login += 1

            else:

                in_process += 1

        # =====================================================
        # RESPONSE
        # =====================================================

        return AgentAnalyticsPipelineCounts(
            total_leads=int(
                total_leads
            ),
            in_process=int(
                in_process
            ),
            login=int(
                login
            ),
            sanctioned=int(
                sanctioned
            ),
            disbursed=int(
                disbursed
            ),
            rejected=int(
                rejected
            ),
        )

    # =========================================================
    # MAIN OVERVIEW
    # =========================================================

    @staticmethod
    def get_overview(
        db: Session,
        employee: Employee,
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

        Response contains:

            counts
                -> Pipeline Insights / event analytics

            pipeline
                -> Application Pipeline / current status

        Date normalization:

            no dates
                -> today

            only from_date
                -> from_date

            only to_date
                -> to_date

            both dates
                -> inclusive range
        """

        # =====================================================
        # AUTHENTICATION
        # =====================================================

        if not employee:

            raise PermissionError(
                "Authenticated employee is required."
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

        # =====================================================
        # CONTEXT FAMILY
        # =====================================================

        family = (
            AgentAnalyticsOverviewService
            ._get_context_family(
                active_context
            )
        )

        # =====================================================
        # VISIBILITY
        # =====================================================

        visible_team_lead_ids = (
            AgentAnalyticsOverviewService
            ._get_visible_team_lead_ids(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        )

        visible_agent_ids = (
            AgentAnalyticsOverviewService
            ._get_visible_agent_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=(
                    team_lead_context_id
                ),
            )
        )

        visible_rm_ids = (
            AgentAnalyticsOverviewService
            ._get_visible_rm_ids(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=(
                    team_lead_context_id
                ),
            )
        )

        # =====================================================
        # FILTER VALIDATION
        # =====================================================

        (
            AgentAnalyticsOverviewService
            ._validate_selected_filters(
                family=family,
                active_context=active_context,
                selected_team_lead_context_id=(
                    team_lead_context_id
                ),
                selected_agent_context_id=(
                    agent_context_id
                ),
                selected_rm_context_id=(
                    rm_context_id
                ),
                visible_team_lead_ids=(
                    visible_team_lead_ids
                ),
                visible_agent_ids=(
                    visible_agent_ids
                ),
                visible_rm_ids=(
                    visible_rm_ids
                ),
            )
        )

        # =====================================================
        # BASE QUERY
        # =====================================================

        base_query = (
            AgentAnalyticsOverviewService
            ._build_base_query(
                db=db,
                family=family,
                active_context=active_context,
                visible_agent_ids=visible_agent_ids,
                visible_rm_ids=visible_rm_ids,
                selected_team_lead_context_id=(
                    team_lead_context_id
                ),
                agent_context_id=(
                    agent_context_id
                ),
                rm_context_id=(
                    rm_context_id
                ),
                loan_type_id=(
                    loan_type_id
                ),
            )
        )

        # =====================================================
        # PIPELINE INSIGHTS
        # =====================================================

        counts = (
            AgentAnalyticsOverviewService
            ._get_event_counts(
                db=db,
                base_query=base_query,
                from_date=from_date,
                to_date=to_date,
            )
        )

        # =====================================================
        # APPLICATION COHORT
        # =====================================================
        #
        # This cohort is ONLY based on applied_date.
        #
        # All current-status calculations below operate on
        # this exact cohort.
        # =====================================================

        applications = (
            AgentAnalyticsOverviewService
            ._get_cohort_applications(
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
                db=db,
                applications=applications,
            )
        )

        # =====================================================
        # FILTERS
        # =====================================================

        filters = AgentAnalyticsFilters(
            team_lead_context_id=(
                team_lead_context_id
            ),
            agent_context_id=(
                agent_context_id
            ),
            rm_context_id=(
                rm_context_id
            ),
            loan_type_id=(
                loan_type_id
            ),
            from_date=from_date,
            to_date=to_date,
        )

        # =====================================================
        # VISIBILITY
        # =====================================================

        visibility = AgentAnalyticsVisibility(
            team_lead_context_ids=(
                visible_team_lead_ids
            ),
            agent_context_ids=(
                visible_agent_ids
            ),
            rm_context_ids=(
                visible_rm_ids
            ),
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {
            "counts": counts,
            "pipeline": pipeline,
            "filters": filters,
            "visibility": visibility,
        }