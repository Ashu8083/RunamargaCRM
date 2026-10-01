# backend/app/services/AgentAnalytics/trends_service.py
from collections import defaultdict
from datetime import date, timedelta
from typing import Optional

from sqlalchemy import Date, cast, func
from sqlalchemy.orm import Query, Session

from app.core.access_control import AccessControl
from app.models.bank_processings import BankProcessing
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.loan_types import LoanType
from app.schemas.AgentAnalytics.trends_schema import (
    AgentAnalyticsLoanTypeTrend,
    AgentAnalyticsRejectionTrend,
    AgentAnalyticsSanctionDisbursementTrend,
    AgentAnalyticsStageDistribution,
    AgentAnalyticsTrendRow,
    AgentAnalyticsTrendsFilters,
    AgentAnalyticsTrendsResponse,
    AgentAnalyticsTrendsVisibility,
)


class AgentAnalyticsTrendsService:

    # =====================================================================
    # DATE
    # =====================================================================

    @staticmethod
    def _dates(
        from_date: Optional[date],
        to_date: Optional[date],
    ) -> tuple[date, date]:

        today = date.today()

        from_date = from_date or to_date or today
        to_date = to_date or from_date

        if from_date > to_date:
            raise ValueError(
                "from_date cannot be greater than to_date"
            )

        return from_date, to_date

    @staticmethod
    def _date_range(
        from_date: date,
        to_date: date,
    ) -> list[date]:

        days = []
        current = from_date

        while current <= to_date:
            days.append(current)
            current += timedelta(days=1)

        return days

    # =====================================================================
    # ACCESS CONTROL
    # =====================================================================

    @staticmethod
    def _visible_agents(
        db: Session,
        employee: Employee,
        context_id: Optional[int],
        team_lead_context_id: Optional[int],
    ) -> list[int]:

        return [
            context.id
            for context in AccessControl.get_visible_agents(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        ]

    @staticmethod
    def _visible_rms(
        db: Session,
        employee: Employee,
        context_id: Optional[int],
        team_lead_context_id: Optional[int],
    ) -> list[int]:

        return [
            context.id
            for context in AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
        ]

    @staticmethod
    def _visible_team_leads(
        db: Session,
        employee: Employee,
        context_id: Optional[int],
    ) -> list[int]:

        return [
            context.id
            for context in AccessControl.get_visible_team_leads(
                db=db,
                employee=employee,
                context_id=context_id,
            )
        ]

    # =====================================================================
    # BASE APPLICATION SCOPE
    # =====================================================================

    @classmethod
    def _base_query(
        cls,
        db: Session,
        employee: Employee,
        context_id: Optional[int],
        analytics_type: str,
        team_lead_context_id: Optional[int],
        agent_context_id: Optional[int],
        rm_context_id: Optional[int],
        loan_type_id: Optional[int],
    ) -> Query:

        query = db.query(LoanApplication).filter(
            LoanApplication.deleted_at.is_(None)
        )

        if analytics_type == "agent":

            visible_ids = cls._visible_agents(
                db,
                employee,
                context_id,
                team_lead_context_id,
            )

            if agent_context_id is not None:

                if agent_context_id not in visible_ids:
                    raise ValueError(
                        "Selected agent is not visible to the current user"
                    )

                query = query.filter(
                    LoanApplication.agent_context_id
                    == agent_context_id
                )

            else:

                query = query.filter(
                    LoanApplication.agent_context_id.in_(visible_ids)
                )

        elif analytics_type == "rm":

            visible_ids = cls._visible_rms(
                db,
                employee,
                context_id,
                team_lead_context_id,
            )

            if rm_context_id is not None:

                if rm_context_id not in visible_ids:
                    raise ValueError(
                        "Selected RM is not visible to the current user"
                    )

                query = query.filter(
                    LoanApplication.rm_context_id
                    == rm_context_id
                )

            else:

                query = query.filter(
                    LoanApplication.rm_context_id.in_(visible_ids)
                )

        else:
            raise ValueError(
                "type must be either 'agent' or 'rm'"
            )

        if loan_type_id is not None:

            query = query.filter(
                LoanApplication.loan_type_id
                == loan_type_id
            )

        return query

    # =====================================================================
    # APPLICATION CREATED
    # =====================================================================

    @staticmethod
    def _application_created(
        query: Query,
        from_date: date,
        to_date: date,
    ) -> dict[date, int]:

        rows = (
            query.filter(
                LoanApplication.applied_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                LoanApplication.applied_date,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.applied_date
            )
            .all()
        )

        return {
            row[0]: int(row[1])
            for row in rows
            if row[0] is not None
        }

    # =====================================================================
    # IN PROCESS
    # =====================================================================

    @staticmethod
    def _in_process(
        query: Query,
        from_date: date,
        to_date: date,
    ) -> dict[date, int]:

        result = defaultdict(int)

        rows = (
            query.filter(
                LoanApplication.status
                == LoanStatus.inprocess,
                LoanApplication.applied_date.between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.applied_date,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.applied_date
            )
            .all()
        )

        for day, count in rows:

            if day:
                result[day] += int(count)

        rows = (
            query.filter(
                LoanApplication.status
                == LoanStatus.docspending,
                LoanApplication.docspending_date.between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.docspending_date,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.docspending_date
            )
            .all()
        )

        for day, count in rows:

            if day:
                result[day] += int(count)

        return dict(result)

    # =====================================================================
    # BANK EVENT COUNTS
    # =====================================================================

    @staticmethod
    def _bank_event(
        query: Query,
        column,
        from_date: date,
        to_date: date,
        require_loggedin: bool = False,
        require_sanctioned: bool = False,
        require_disbursed: bool = False,
    ) -> dict[date, int]:

        event_date = cast(column, Date)

        filters = [
            column.is_not(None),
            event_date.between(
                from_date,
                to_date,
            ),
            BankProcessing.rejected_at.is_(None),
        ]

        if require_loggedin:

            filters.append(
                BankProcessing.loggedin_at.is_not(None)
            )

        if require_sanctioned:

            filters.append(
                BankProcessing.sanctioned_at.is_not(None)
            )

        if require_disbursed:

            filters.append(
                BankProcessing.disbursed_at.is_not(None)
            )

        rows = (
            query.join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(*filters)
            .with_entities(
                event_date,
                func.count(BankProcessing.id),
            )
            .group_by(event_date)
            .all()
        )

        return {
            row[0]: int(row[1])
            for row in rows
            if row[0] is not None
        }

    @classmethod
    def _login(
        cls,
        query: Query,
        from_date: date,
        to_date: date,
    ) -> dict[date, int]:

        return cls._bank_event(
            query,
            BankProcessing.loggedin_at,
            from_date,
            to_date,
        )

    @classmethod
    def _sanctioned(
        cls,
        query: Query,
        from_date: date,
        to_date: date,
    ) -> dict[date, int]:

        return cls._bank_event(
            query,
            BankProcessing.sanctioned_at,
            from_date,
            to_date,
            require_loggedin=True,
        )

    @classmethod
    def _disbursed(
        cls,
        query: Query,
        from_date: date,
        to_date: date,
    ) -> dict[date, int]:

        return cls._bank_event(
            query,
            BankProcessing.disbursed_at,
            from_date,
            to_date,
            require_loggedin=True,
            require_sanctioned=True,
        )

    # =====================================================================
    # REJECTION
    # =====================================================================

    @staticmethod
    def _rejected(
        query: Query,
        from_date: date,
        to_date: date,
    ) -> dict[date, int]:

        rows = (
            query.filter(
                LoanApplication.rejection_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                LoanApplication.rejection_date,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.rejection_date
            )
            .all()
        )

        return {
            row[0]: int(row[1])
            for row in rows
            if row[0] is not None
        }

    # =====================================================================
    # DAILY TREND
    # =====================================================================

    @classmethod
    def _build_daily_trend(
        cls,
        query: Query,
        from_date: date,
        to_date: date,
    ) -> list[AgentAnalyticsTrendRow]:

        created = cls._application_created(
            query,
            from_date,
            to_date,
        )

        in_process = cls._in_process(
            query,
            from_date,
            to_date,
        )

        login = cls._login(
            query,
            from_date,
            to_date,
        )

        sanctioned = cls._sanctioned(
            query,
            from_date,
            to_date,
        )

        disbursed = cls._disbursed(
            query,
            from_date,
            to_date,
        )

        rejected = cls._rejected(
            query,
            from_date,
            to_date,
        )

        return [
            AgentAnalyticsTrendRow(
                date=day,
                application_created=created.get(
                    day,
                    0,
                ),
                in_process=in_process.get(
                    day,
                    0,
                ),
                login=login.get(
                    day,
                    0,
                ),
                sanctioned=sanctioned.get(
                    day,
                    0,
                ),
                disbursed=disbursed.get(
                    day,
                    0,
                ),
                rejected=rejected.get(
                    day,
                    0,
                ),
            )
            for day in cls._date_range(
                from_date,
                to_date,
            )
        ]

    # =====================================================================
    # STAGE DISTRIBUTION
    # =====================================================================

    @staticmethod
    def _stage_distribution(
        query: Query,
        from_date: date,
        to_date: date,
    ) -> AgentAnalyticsStageDistribution:

        cohort = query.filter(
            LoanApplication.applied_date.between(
                from_date,
                to_date,
            )
        )

        # Total Leads must come directly from the LoanApplication
        # cohort. It must NOT be calculated by adding stage counts.
        total_leads = cohort.count()

        if total_leads == 0:

            return AgentAnalyticsStageDistribution(
                total_leads=0,
            )

        in_process = (
            cohort.filter(
                LoanApplication.status.in_(
                    [
                        LoanStatus.inprocess,
                        LoanStatus.docspending,
                    ]
                )
            )
            .count()
        )

        rejected = (
            cohort.filter(
                LoanApplication.status
                == LoanStatus.rejected
            )
            .count()
        )

        bank_query = (
            cohort.join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.rejected_at.is_(None),
            )
        )

        # IMPORTANT:
        # Count every matching BankProcessing login record.
        #
        # Do NOT use DISTINCT here.
        #
        # If one application has 3 matching login records,
        # all 3 records contribute to the login count.
        login = (
            bank_query.filter(
                BankProcessing.status == "login",
                BankProcessing.loggedin_at.is_not(None),
            )
            .count()
        )

        sanctioned = (
            bank_query.filter(
                BankProcessing.status == "sanctioned",
                BankProcessing.loggedin_at.is_not(None),
                BankProcessing.sanctioned_at.is_not(None),
            )
            .with_entities(
                BankProcessing.loan_id
            )
            .distinct()
            .count()
        )

        disbursed = (
            bank_query.filter(
                BankProcessing.status == "disbursed",
                BankProcessing.loggedin_at.is_not(None),
                BankProcessing.sanctioned_at.is_not(None),
                BankProcessing.disbursed_at.is_not(None),
            )
            .with_entities(
                BankProcessing.loan_id
            )
            .distinct()
            .count()
        )

        return AgentAnalyticsStageDistribution(
            total_leads=total_leads,
            in_process=in_process,
            login=login,
            sanctioned=sanctioned,
            disbursed=disbursed,
            rejected=rejected,
        )

    # =====================================================================
    # LOAN TYPE TREND
    # =====================================================================

    @classmethod
    def _loan_type_trend(
        cls,
        db: Session,
        query: Query,
        from_date: date,
        to_date: date,
    ) -> list[AgentAnalyticsLoanTypeTrend]:

        result = {}

        def item(loan_type_id):

            if loan_type_id not in result:

                name = (
                    db.query(LoanType.name)
                    .filter(
                        LoanType.id
                        == loan_type_id
                    )
                    .scalar()
                    or "Unknown"
                )

                result[loan_type_id] = {
                    "loan_type_id": loan_type_id,
                    "loan_type_name": name,
                    "application_created": 0,
                    "in_process": 0,
                    "login": 0,
                    "sanctioned": 0,
                    "disbursed": 0,
                    "rejected": 0,
                }

            return result[loan_type_id]

        rows = (
            query.filter(
                LoanApplication.applied_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            item(
                loan_type_id
            )["application_created"] = int(count)

        rows = (
            query.filter(
                LoanApplication.status
                == LoanStatus.inprocess,
                LoanApplication.applied_date.between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            item(
                loan_type_id
            )["in_process"] += int(count)

        rows = (
            query.filter(
                LoanApplication.status
                == LoanStatus.docspending,
                LoanApplication.docspending_date.between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            item(
                loan_type_id
            )["in_process"] += int(count)

        rows = (
            query.filter(
                LoanApplication.rejection_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(LoanApplication.id),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            item(
                loan_type_id
            )["rejected"] += int(count)

        for field, column, requirements in [
            (
                "login",
                BankProcessing.loggedin_at,
                [],
            ),
            (
                "sanctioned",
                BankProcessing.sanctioned_at,
                [
                    BankProcessing.loggedin_at.is_not(None)
                ],
            ),
            (
                "disbursed",
                BankProcessing.disbursed_at,
                [
                    BankProcessing.loggedin_at.is_not(None),
                    BankProcessing.sanctioned_at.is_not(None),
                ],
            ),
        ]:

            event_date = cast(
                column,
                Date,
            )

            rows = (
                query.join(
                    BankProcessing,
                    BankProcessing.loan_id
                    == LoanApplication.id,
                )
                .filter(
                    column.is_not(None),
                    event_date.between(
                        from_date,
                        to_date,
                    ),
                    BankProcessing.rejected_at.is_(None),
                    *requirements,
                )
                .with_entities(
                    LoanApplication.loan_type_id,
                    func.count(BankProcessing.id),
                )
                .group_by(
                    LoanApplication.loan_type_id
                )
                .all()
            )

            for loan_type_id, count in rows:

                item(
                    loan_type_id
                )[field] += int(count)

        return [
            AgentAnalyticsLoanTypeTrend(
                **values
            )
            for values in result.values()
        ]

    # =====================================================================
    # MAIN
    # =====================================================================

    @classmethod
    def get_trends(
        cls,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        analytics_type: str = "agent",
        team_lead_context_id: Optional[int] = None,
        agent_context_id: Optional[int] = None,
        rm_context_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
    ) -> AgentAnalyticsTrendsResponse:

        from_date, to_date = cls._dates(
            from_date,
            to_date,
        )

        query = cls._base_query(
            db=db,
            employee=employee,
            context_id=context_id,
            analytics_type=analytics_type,
            team_lead_context_id=team_lead_context_id,
            agent_context_id=agent_context_id,
            rm_context_id=rm_context_id,
            loan_type_id=loan_type_id,
        )

        trend = cls._build_daily_trend(
            query,
            from_date,
            to_date,
        )

        stage_distribution = cls._stage_distribution(
            query,
            from_date,
            to_date,
        )

        sanction_disbursement = [
            AgentAnalyticsSanctionDisbursementTrend(
                date=row.date,
                sanctioned=row.sanctioned,
                disbursed=row.disbursed,
            )
            for row in trend
        ]

        rejection_trend = [
            AgentAnalyticsRejectionTrend(
                date=row.date,
                rejected=row.rejected,
            )
            for row in trend
        ]

        agents = cls._visible_agents(
            db,
            employee,
            context_id,
            team_lead_context_id,
        )

        rms = cls._visible_rms(
            db,
            employee,
            context_id,
            team_lead_context_id,
        )

        team_leads = cls._visible_team_leads(
            db,
            employee,
            context_id,
        )

        return AgentAnalyticsTrendsResponse(
            type=analytics_type,
            filters=AgentAnalyticsTrendsFilters(
                type=analytics_type,
                team_lead_context_id=team_lead_context_id,
                agent_context_id=agent_context_id,
                rm_context_id=rm_context_id,
                loan_type_id=loan_type_id,
                from_date=from_date,
                to_date=to_date,
            ),
            trend=trend,
            loan_type_trend=cls._loan_type_trend(
                db,
                query,
                from_date,
                to_date,
            ),
            stage_distribution=stage_distribution,
            sanction_disbursement_trend=sanction_disbursement,
            rejection_trend=rejection_trend,
            visibility=AgentAnalyticsTrendsVisibility(
                team_lead_context_ids=team_leads,
                agent_context_ids=agents,
                rm_context_ids=rms,
            ),
        )