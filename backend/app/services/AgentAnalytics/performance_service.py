# backend/app/services/AgentAnalytics/performance_service.py

from datetime import date
from decimal import Decimal
from typing import Literal, Optional

from sqlalchemy import func
from sqlalchemy.orm import Query, Session, aliased

from app.core.access_control import AccessControl
from app.models.bank_processings import BankProcessing
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.loan_types import LoanType
from app.schemas.AgentAnalytics.performance_schema import (
    AgentAnalyticsLoanWisePerformanceRow,
    AgentAnalyticsPerformanceFilters,
    AgentAnalyticsPerformanceOverviewRow,
    AgentAnalyticsPerformanceResponse,
    AgentAnalyticsPerformanceVisibility,
    AgentAnalyticsTopPerformerLoanTypeGroup,
    AgentAnalyticsTopPerformerLoanTypeRow,
    AgentAnalyticsTopPerformerRow,
)


AnalyticsType = Literal["agent", "rm"]


class AgentAnalyticsPerformanceService:

    # =========================================================
    # DATE
    # =========================================================

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

    # =========================================================
    # ACCESS CONTROL
    # =========================================================

    @staticmethod
    def _visible_agents(
        db: Session,
        employee: Employee,
        context_id: Optional[int],
        team_lead_context_id: Optional[int],
    ) -> list[EmployeeContext]:

        return (
            AccessControl.get_visible_agents(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
            or []
        )

    @staticmethod
    def _visible_rms(
        db: Session,
        employee: Employee,
        context_id: Optional[int],
        team_lead_context_id: Optional[int],
    ) -> list[EmployeeContext]:

        return (
            AccessControl.get_visible_rms(
                db=db,
                employee=employee,
                context_id=context_id,
                team_lead_context_id=team_lead_context_id,
            )
            or []
        )

    @staticmethod
    def _visible_team_leads(
        db: Session,
        employee: Employee,
        context_id: Optional[int],
    ) -> list[EmployeeContext]:

        return (
            AccessControl.get_visible_team_leads(
                db=db,
                employee=employee,
                context_id=context_id,
            )
            or []
        )

    # =========================================================
    # VALIDATION
    # =========================================================

    @staticmethod
    def _validate_type(
        analytics_type: str,
    ) -> AnalyticsType:

        value = str(
            analytics_type or ""
        ).strip().lower()

        if value not in {"agent", "rm"}:
            raise ValueError(
                "type must be either 'agent' or 'rm'"
            )

        return value  # type: ignore[return-value]

    @staticmethod
    def _context_ids(
        contexts: list[EmployeeContext],
    ) -> list[int]:

        return [
            int(context.id)
            for context in contexts
            if context is not None
            and context.id is not None
        ]

    # =========================================================
    # ENTITY INFORMATION
    # =========================================================

    @staticmethod
    def _entity_information(
        db: Session,
        context_ids: list[int],
    ) -> dict[int, dict]:

        if not context_ids:
            return {}

        team_lead_context = aliased(
            EmployeeContext
        )

        team_lead_employee = aliased(
            Employee
        )

        rows = (
            db.query(
                EmployeeContext.id,
                Employee.name,
                EmployeeContext.reports_to_id,
                team_lead_employee.name.label(
                    "team_lead_name"
                ),
            )
            .join(
                Employee,
                EmployeeContext.employee_id
                == Employee.id,
            )
            .outerjoin(
                team_lead_context,
                team_lead_context.id
                == EmployeeContext.reports_to_id,
            )
            .outerjoin(
                team_lead_employee,
                team_lead_employee.id
                == team_lead_context.employee_id,
            )
            .filter(
                EmployeeContext.id.in_(
                    context_ids
                ),
                EmployeeContext.deleted_at.is_(None),
            )
            .all()
        )

        return {
            int(context_id): {
                "name": employee_name or "Unknown",
                "team_lead_context_id": (
                    int(reports_to_id)
                    if reports_to_id is not None
                    else None
                ),
                "team_lead_name": (
                    team_lead_name or "-"
                ),
                "team_id": None,
                "team_name": "-",
            }
            for (
                context_id,
                employee_name,
                reports_to_id,
                team_lead_name,
            ) in rows
        }

    # =========================================================
    # BASE QUERY
    # =========================================================

    @classmethod
    def _base_query(
        cls,
        db: Session,
        employee: Employee,
        context_id: Optional[int],
        analytics_type: AnalyticsType,
        team_lead_context_id: Optional[int],
        agent_context_id: Optional[int],
        rm_context_id: Optional[int],
        loan_type_id: Optional[int],
    ) -> tuple[
        Query,
        list[EmployeeContext],
        list[EmployeeContext],
        list[EmployeeContext],
    ]:

        visible_team_leads = cls._visible_team_leads(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        visible_team_lead_ids = cls._context_ids(
            visible_team_leads
        )

        if (
            team_lead_context_id is not None
            and team_lead_context_id
            not in visible_team_lead_ids
        ):
            raise ValueError(
                "Selected Team Lead is not visible to the current user"
            )

        visible_agents = cls._visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        visible_rms = cls._visible_rms(
            db=db,
            employee=employee,
            context_id=context_id,
            team_lead_context_id=team_lead_context_id,
        )

        visible_agent_ids = cls._context_ids(
            visible_agents
        )

        visible_rm_ids = cls._context_ids(
            visible_rms
        )

        query = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.deleted_at.is_(None)
            )
        )

        if analytics_type == "agent":

            if agent_context_id is not None:

                if (
                    agent_context_id
                    not in visible_agent_ids
                ):
                    raise ValueError(
                        "Selected agent is not visible to the current user"
                    )

                query = query.filter(
                    LoanApplication.agent_context_id
                    == agent_context_id
                )

            elif visible_agent_ids:

                query = query.filter(
                    LoanApplication.agent_context_id.in_(
                        visible_agent_ids
                    )
                )

            else:

                query = query.filter(False)

        else:

            if rm_context_id is not None:

                if (
                    rm_context_id
                    not in visible_rm_ids
                ):
                    raise ValueError(
                        "Selected RM is not visible to the current user"
                    )

                query = query.filter(
                    LoanApplication.rm_context_id
                    == rm_context_id
                )

            elif visible_rm_ids:

                query = query.filter(
                    LoanApplication.rm_context_id.in_(
                        visible_rm_ids
                    )
                )

            else:

                query = query.filter(False)

        if loan_type_id is not None:

            query = query.filter(
                LoanApplication.loan_type_id
                == loan_type_id
            )

        return (
            query,
            visible_agents,
            visible_rms,
            visible_team_leads,
        )

    # =========================================================
    # APPLICATION IN-PROCESS
    # =========================================================

    @staticmethod
    def _in_process_query(
        query: Query,
        from_date: date,
        to_date: date,
    ) -> Query:

        return query.filter(
            (
                (
                    LoanApplication.status
                    == LoanStatus.inprocess
                )
                & LoanApplication.applied_date.between(
                    from_date,
                    to_date,
                )
            )
            |
            (
                (
                    LoanApplication.status
                    == LoanStatus.docspending
                )
                & LoanApplication.docspending_date.between(
                    from_date,
                    to_date,
                )
            )
        )

    # =========================================================
    # APPLICATION COUNTS
    # =========================================================

    @classmethod
    def _application_counts(
        cls,
        query: Query,
        entity_column,
        from_date: date,
        to_date: date,
    ) -> dict[int, dict]:

        result: dict[int, dict] = {}

        def apply_rows(
            rows,
            field: str,
        ) -> None:

            for entity_id, count in rows:

                if entity_id is None:
                    continue

                result.setdefault(
                    int(entity_id),
                    {
                        "in_process": 0,
                        "rejected": 0,
                    },
                )

                result[
                    int(entity_id)
                ][field] = int(count)

        in_process_rows = (
            cls._in_process_query(
                query,
                from_date,
                to_date,
            )
            .with_entities(
                entity_column,
                func.count(
                    LoanApplication.id
                ),
            )
            .group_by(
                entity_column
            )
            .all()
        )

        apply_rows(
            in_process_rows,
            "in_process",
        )

        rejected_rows = (
            query.filter(
                LoanApplication.rejection_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                entity_column,
                func.count(
                    LoanApplication.id
                ),
            )
            .group_by(
                entity_column
            )
            .all()
        )

        apply_rows(
            rejected_rows,
            "rejected",
        )

        return result

    # =========================================================
    # BANK PROCESSING COUNTS
    #
    # IMPORTANT:
    # Login, Sanctioned and Disbursed are EVENT COUNTS.
    #
    # A BankProcessing row can therefore contribute to:
    #   - Login
    #   - Sanctioned
    #   - Disbursed
    #
    # independently when each corresponding timestamp falls
    # inside the selected date range.
    #
    # This matches the SQL cross-check:
    #
    # loggedin_at   -> login
    # sanctioned_at -> sanctioned
    # disbursed_at  -> disbursed
    #
    # We intentionally DO NOT require later timestamps to be NULL.
    # =========================================================

    @staticmethod
    def _bank_counts(
        query: Query,
        entity_column,
        from_date: date,
        to_date: date,
    ) -> dict[int, dict]:

        result: dict[int, dict] = {}

        bank_query = (
            query.join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
        )

        def apply_rows(
            rows,
            field: str,
        ) -> None:

            for entity_id, count in rows:

                if entity_id is None:
                    continue

                result.setdefault(
                    int(entity_id),
                    {
                        "login": 0,
                        "sanctioned": 0,
                        "disbursed": 0,
                        "disbursed_amount": 0.0,
                    },
                )

                result[
                    int(entity_id)
                ][field] = int(count)

        # -----------------------------------------------------
        # LOGIN
        #
        # Count every BankProcessing row having loggedin_at
        # inside the selected date range.
        # -----------------------------------------------------

        login_rows = (
            bank_query.filter(
                BankProcessing.loggedin_at.is_not(None),
                func.date(
                    BankProcessing.loggedin_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                entity_column,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                entity_column
            )
            .all()
        )

        apply_rows(
            login_rows,
            "login",
        )

        # -----------------------------------------------------
        # SANCTIONED
        #
        # Count every BankProcessing row having sanctioned_at
        # inside the selected date range.
        # -----------------------------------------------------

        sanctioned_rows = (
            bank_query.filter(
                BankProcessing.sanctioned_at.is_not(None),
                func.date(
                    BankProcessing.sanctioned_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                entity_column,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                entity_column
            )
            .all()
        )

        apply_rows(
            sanctioned_rows,
            "sanctioned",
        )

        # -----------------------------------------------------
        # DISBURSED
        #
        # Count every BankProcessing row having disbursed_at
        # inside the selected date range.
        # -----------------------------------------------------

        disbursed_rows = (
            bank_query.filter(
                BankProcessing.disbursed_at.is_not(None),
                func.date(
                    BankProcessing.disbursed_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                entity_column,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                entity_column
            )
            .all()
        )

        apply_rows(
            disbursed_rows,
            "disbursed",
        )

        # -----------------------------------------------------
        # DISBURSED AMOUNT
        #
        # Sum amount for every disbursed BankProcessing row
        # whose disbursed_at is inside the selected range.
        # -----------------------------------------------------

        amount_rows = (
            bank_query.filter(
                BankProcessing.disbursed_at.is_not(None),
                func.date(
                    BankProcessing.disbursed_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                entity_column,
                func.coalesce(
                    func.sum(
                        BankProcessing.disbursement_amount
                    ),
                    0,
                ),
            )
            .group_by(
                entity_column
            )
            .all()
        )

        for entity_id, amount in amount_rows:

            if entity_id is None:
                continue

            result.setdefault(
                int(entity_id),
                {
                    "login": 0,
                    "sanctioned": 0,
                    "disbursed": 0,
                    "disbursed_amount": 0.0,
                },
            )

            result[
                int(entity_id)
            ]["disbursed_amount"] = float(
                amount or Decimal("0")
            )

        return result

    # =========================================================
    # OVERVIEW
    # =========================================================

    @classmethod
    def _overview(
        cls,
        db: Session,
        query: Query,
        analytics_type: AnalyticsType,
        visible_agents: list[EmployeeContext],
        visible_rms: list[EmployeeContext],
        from_date: date,
        to_date: date,
    ) -> list[AgentAnalyticsPerformanceOverviewRow]:

        contexts = (
            visible_agents
            if analytics_type == "agent"
            else visible_rms
        )

        context_ids = cls._context_ids(
            contexts
        )

        entity_column = (
            LoanApplication.agent_context_id
            if analytics_type == "agent"
            else LoanApplication.rm_context_id
        )

        information = cls._entity_information(
            db=db,
            context_ids=context_ids,
        )

        application_counts = cls._application_counts(
            query=query,
            entity_column=entity_column,
            from_date=from_date,
            to_date=to_date,
        )

        bank_counts = cls._bank_counts(
            query=query,
            entity_column=entity_column,
            from_date=from_date,
            to_date=to_date,
        )

        result = []

        for context_id in context_ids:

            info = information.get(
                context_id,
                {},
            )

            app = application_counts.get(
                context_id,
                {},
            )

            bank = bank_counts.get(
                context_id,
                {},
            )

            result.append(
                AgentAnalyticsPerformanceOverviewRow(
                    context_id=context_id,
                    name=info.get(
                        "name",
                        "Unknown",
                    ),
                    team_lead_context_id=info.get(
                        "team_lead_context_id"
                    ),
                    team_lead_name=info.get(
                        "team_lead_name",
                        "-",
                    ),
                    team_id=info.get(
                        "team_id"
                    ),
                    team_name=info.get(
                        "team_name",
                        "-",
                    ),
                    in_process=int(
                        app.get(
                            "in_process",
                            0,
                        )
                    ),
                    login=int(
                        bank.get(
                            "login",
                            0,
                        )
                    ),
                    sanctioned=int(
                        bank.get(
                            "sanctioned",
                            0,
                        )
                    ),
                    disbursed=int(
                        bank.get(
                            "disbursed",
                            0,
                        )
                    ),
                    rejected=int(
                        app.get(
                            "rejected",
                            0,
                        )
                    ),
                    disbursed_amount=float(
                        bank.get(
                            "disbursed_amount",
                            0,
                        )
                    ),
                )
            )

        return result

    # =========================================================
    # LOAN WISE
    # =========================================================

    @classmethod
    def _loan_wise(
        cls,
        query: Query,
        from_date: date,
        to_date: date,
    ) -> list[AgentAnalyticsLoanWisePerformanceRow]:

        result: dict = {}

        def ensure(
            loan_type_id,
        ):

            if loan_type_id not in result:

                result[loan_type_id] = {
                    "loan_type_id": loan_type_id,
                    "in_process": 0,
                    "login": 0,
                    "sanctioned": 0,
                    "disbursed": 0,
                    "rejected": 0,
                    "disbursed_amount": 0.0,
                }

            return result[loan_type_id]

        # -----------------------------------------------------
        # IN PROCESS
        # -----------------------------------------------------

        rows = (
            cls._in_process_query(
                query,
                from_date,
                to_date,
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(
                    LoanApplication.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            ensure(
                loan_type_id
            )["in_process"] = int(count)

        # -----------------------------------------------------
        # REJECTED
        # -----------------------------------------------------

        rows = (
            query.filter(
                LoanApplication.rejection_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(
                    LoanApplication.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            ensure(
                loan_type_id
            )["rejected"] = int(count)

        # -----------------------------------------------------
        # BANK QUERY
        # -----------------------------------------------------

        bank_query = (
            query.join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
        )

        # -----------------------------------------------------
        # LOGIN
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.loggedin_at.is_not(None),
                func.date(
                    BankProcessing.loggedin_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            ensure(
                loan_type_id
            )["login"] = int(count)

        # -----------------------------------------------------
        # SANCTIONED
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.sanctioned_at.is_not(None),
                func.date(
                    BankProcessing.sanctioned_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            ensure(
                loan_type_id
            )["sanctioned"] = int(count)

        # -----------------------------------------------------
        # DISBURSED
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.disbursed_at.is_not(None),
                func.date(
                    BankProcessing.disbursed_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, count in rows:

            ensure(
                loan_type_id
            )["disbursed"] = int(count)

        # -----------------------------------------------------
        # DISBURSED AMOUNT
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.disbursed_at.is_not(None),
                func.date(
                    BankProcessing.disbursed_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                func.coalesce(
                    func.sum(
                        BankProcessing.disbursement_amount
                    ),
                    0,
                ),
            )
            .group_by(
                LoanApplication.loan_type_id
            )
            .all()
        )

        for loan_type_id, amount in rows:

            ensure(
                loan_type_id
            )["disbursed_amount"] = float(
                amount or Decimal("0")
            )

        # -----------------------------------------------------
        # LOAN TYPE NAMES
        # -----------------------------------------------------

        loan_type_ids = list(
            result.keys()
        )

        names: dict[int, str] = {}

        if loan_type_ids:

            rows = (
                query.session.query(
                    LoanType.id,
                    LoanType.name,
                )
                .filter(
                    LoanType.id.in_(
                        [
                            value
                            for value in loan_type_ids
                            if value is not None
                        ]
                    )
                )
                .all()
            )

            names = {
                int(loan_type_id): (
                    name or "Unknown"
                )
                for loan_type_id, name in rows
            }

        output = []

        for values in result.values():

            loan_type_id = values[
                "loan_type_id"
            ]

            output.append(
                AgentAnalyticsLoanWisePerformanceRow(
                    loan_type_id=loan_type_id,
                    loan_type_name=(
                        names.get(
                            int(loan_type_id)
                        )
                        if loan_type_id is not None
                        else "Unknown"
                    ),
                    in_process=values[
                        "in_process"
                    ],
                    login=values[
                        "login"
                    ],
                    sanctioned=values[
                        "sanctioned"
                    ],
                    disbursed=values[
                        "disbursed"
                    ],
                    rejected=values[
                        "rejected"
                    ],
                    disbursed_amount=values[
                        "disbursed_amount"
                    ],
                )
            )

        return sorted(
            output,
            key=lambda row: row.disbursed,
            reverse=True,
        )

    # =========================================================
    # TOP PERFORMERS
    # =========================================================

    @staticmethod
    def _top_performers(
        overview: list[
            AgentAnalyticsPerformanceOverviewRow
        ],
    ) -> list[
        AgentAnalyticsTopPerformerRow
    ]:

        rows = sorted(
            overview,
            key=lambda row: (
                row.disbursed,
                row.sanctioned,
                row.login,
                row.in_process,
                row.rejected,
            ),
            reverse=True,
        )

        return [
            AgentAnalyticsTopPerformerRow(
                rank=index,
                context_id=row.context_id,
                name=row.name,
                team_lead_context_id=(
                    row.team_lead_context_id
                ),
                team_lead_name=(
                    row.team_lead_name
                ),
                team_id=row.team_id,
                team_name=row.team_name,
                in_process=row.in_process,
                login=row.login,
                sanctioned=row.sanctioned,
                disbursed=row.disbursed,
                rejected=row.rejected,
                disbursed_amount=(
                    row.disbursed_amount
                ),
            )
            for index, row in enumerate(
                rows[:5],
                start=1,
            )
        ]

    # =========================================================
    # TOP PERFORMERS BY LOAN TYPE
    # =========================================================

    @classmethod
    def _top_performers_by_loan_type(
        cls,
        db: Session,
        query: Query,
        analytics_type: AnalyticsType,
        context_ids: list[int],
        from_date: date,
        to_date: date,
    ) -> list[
        AgentAnalyticsTopPerformerLoanTypeGroup
    ]:

        if not context_ids:
            return []

        entity_column = (
            LoanApplication.agent_context_id
            if analytics_type == "agent"
            else LoanApplication.rm_context_id
        )

        information = cls._entity_information(
            db=db,
            context_ids=context_ids,
        )

        grouped: dict = {}

        def ensure_group(
            loan_type_id,
        ):

            if loan_type_id not in grouped:

                grouped[loan_type_id] = {
                    "loan_type_id": loan_type_id,
                    "rows": {},
                }

            return grouped[loan_type_id]

        def ensure_row(
            loan_type_id,
            entity_id,
        ):

            group = ensure_group(
                loan_type_id
            )

            if entity_id not in group["rows"]:

                info = information.get(
                    entity_id,
                    {},
                )

                group["rows"][
                    entity_id
                ] = {
                    "loan_type_id": loan_type_id,
                    "context_id": entity_id,
                    "name": info.get(
                        "name",
                        "Unknown",
                    ),
                    "count": 0,
                    "disbursed_amount": 0.0,
                }

            return group["rows"][
                entity_id
            ]

        # -----------------------------------------------------
        # IN PROCESS
        # -----------------------------------------------------

        rows = (
            cls._in_process_query(
                query,
                from_date,
                to_date,
            )
            .with_entities(
                LoanApplication.loan_type_id,
                entity_column,
                func.count(
                    LoanApplication.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id,
                entity_column,
            )
            .all()
        )

        for (
            loan_type_id,
            entity_id,
            count,
        ) in rows:

            if entity_id is None:
                continue

            ensure_row(
                loan_type_id,
                int(entity_id),
            )["count"] += int(count)

        # -----------------------------------------------------
        # BANK QUERY
        # -----------------------------------------------------

        bank_query = (
            query.join(
                BankProcessing,
                BankProcessing.loan_id
                == LoanApplication.id,
            )
            .filter(
                BankProcessing.deleted_at.is_(None)
            )
        )

        # -----------------------------------------------------
        # LOGIN
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.loggedin_at.is_not(None),
                func.date(
                    BankProcessing.loggedin_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                entity_column,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id,
                entity_column,
            )
            .all()
        )

        for (
            loan_type_id,
            entity_id,
            count,
        ) in rows:

            if entity_id is None:
                continue

            ensure_row(
                loan_type_id,
                int(entity_id),
            )["count"] += int(count)

        # -----------------------------------------------------
        # SANCTIONED
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.sanctioned_at.is_not(None),
                func.date(
                    BankProcessing.sanctioned_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                entity_column,
                func.count(
                    BankProcessing.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id,
                entity_column,
            )
            .all()
        )

        for (
            loan_type_id,
            entity_id,
            count,
        ) in rows:

            if entity_id is None:
                continue

            ensure_row(
                loan_type_id,
                int(entity_id),
            )["count"] += int(count)

        # -----------------------------------------------------
        # DISBURSED
        # -----------------------------------------------------

        rows = (
            bank_query.filter(
                BankProcessing.disbursed_at.is_not(None),
                func.date(
                    BankProcessing.disbursed_at
                ).between(
                    from_date,
                    to_date,
                ),
            )
            .with_entities(
                LoanApplication.loan_type_id,
                entity_column,
                func.count(
                    BankProcessing.id
                ),
                func.coalesce(
                    func.sum(
                        BankProcessing.disbursement_amount
                    ),
                    0,
                ),
            )
            .group_by(
                LoanApplication.loan_type_id,
                entity_column,
            )
            .all()
        )

        for (
            loan_type_id,
            entity_id,
            count,
            amount,
        ) in rows:

            if entity_id is None:
                continue

            row = ensure_row(
                loan_type_id,
                int(entity_id),
            )

            row["count"] += int(count)

            row["disbursed_amount"] += float(
                amount or Decimal("0")
            )

        # -----------------------------------------------------
        # REJECTED
        # -----------------------------------------------------

        rows = (
            query.filter(
                LoanApplication.rejection_date.between(
                    from_date,
                    to_date,
                )
            )
            .with_entities(
                LoanApplication.loan_type_id,
                entity_column,
                func.count(
                    LoanApplication.id
                ),
            )
            .group_by(
                LoanApplication.loan_type_id,
                entity_column,
            )
            .all()
        )

        for (
            loan_type_id,
            entity_id,
            count,
        ) in rows:

            if entity_id is None:
                continue

            ensure_row(
                loan_type_id,
                int(entity_id),
            )["count"] += int(count)

        # -----------------------------------------------------
        # LOAN TYPE NAMES
        # -----------------------------------------------------

        loan_type_ids = [
            loan_type_id
            for loan_type_id in grouped
            if loan_type_id is not None
        ]

        loan_names: dict[int, str] = {}

        if loan_type_ids:

            rows = (
                db.query(
                    LoanType.id,
                    LoanType.name,
                )
                .filter(
                    LoanType.id.in_(
                        loan_type_ids
                    )
                )
                .all()
            )

            loan_names = {
                int(loan_type_id): (
                    name or "Unknown"
                )
                for loan_type_id, name in rows
            }

        # -----------------------------------------------------
        # BUILD GROUPS
        # -----------------------------------------------------

        output = []

        for group in grouped.values():

            loan_type_id = group[
                "loan_type_id"
            ]

            rows = sorted(
                group["rows"].values(),
                key=lambda item: (
                    item["count"],
                    item["disbursed_amount"],
                ),
                reverse=True,
            )

            if not rows:
                continue

            loan_type_name = (
                loan_names.get(
                    int(loan_type_id)
                )
                if loan_type_id is not None
                else "Unknown"
            )

            output.append(
                AgentAnalyticsTopPerformerLoanTypeGroup(
                    loan_type_id=loan_type_id,
                    loan_type_name=loan_type_name,
                    rows=[
                        AgentAnalyticsTopPerformerLoanTypeRow(
                            loan_type_id=loan_type_id,
                            loan_type_name=loan_type_name,
                            context_id=row[
                                "context_id"
                            ],
                            name=row[
                                "name"
                            ],
                            count=row[
                                "count"
                            ],
                            disbursed_amount=row[
                                "disbursed_amount"
                            ],
                        )
                        for row in rows
                    ],
                )
            )

        output.sort(
            key=lambda group: sum(
                row.count
                for row in group.rows
            ),
            reverse=True,
        )

        return output

    # =========================================================
    # MAIN
    # =========================================================

    @classmethod
    def get_performance(
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
    ) -> AgentAnalyticsPerformanceResponse:

        analytics_type = cls._validate_type(
            analytics_type
        )

        from_date, to_date = cls._dates(
            from_date,
            to_date,
        )

        (
            query,
            visible_agents,
            visible_rms,
            visible_team_leads,
        ) = cls._base_query(
            db=db,
            employee=employee,
            context_id=context_id,
            analytics_type=analytics_type,
            team_lead_context_id=team_lead_context_id,
            agent_context_id=agent_context_id,
            rm_context_id=rm_context_id,
            loan_type_id=loan_type_id,
        )

        overview = cls._overview(
            db=db,
            query=query,
            analytics_type=analytics_type,
            visible_agents=visible_agents,
            visible_rms=visible_rms,
            from_date=from_date,
            to_date=to_date,
        )

        # -----------------------------------------------------
        # LOAN-WISE QUERY
        #
        # Intentionally independent of selected loan_type_id.
        # The Loan Wise section always shows all loan types.
        # -----------------------------------------------------

        loan_wise_query = (
            db.query(
                LoanApplication
            )
            .filter(
                LoanApplication.deleted_at.is_(None)
            )
        )

        if analytics_type == "agent":

            visible_agent_ids = cls._context_ids(
                visible_agents
            )

            if visible_agent_ids:

                loan_wise_query = loan_wise_query.filter(
                    LoanApplication.agent_context_id.in_(
                        visible_agent_ids
                    )
                )

            else:

                loan_wise_query = loan_wise_query.filter(
                    False
                )

            if agent_context_id is not None:

                loan_wise_query = loan_wise_query.filter(
                    LoanApplication.agent_context_id
                    == agent_context_id
                )

        else:

            visible_rm_ids = cls._context_ids(
                visible_rms
            )

            if visible_rm_ids:

                loan_wise_query = loan_wise_query.filter(
                    LoanApplication.rm_context_id.in_(
                        visible_rm_ids
                    )
                )

            else:

                loan_wise_query = loan_wise_query.filter(
                    False
                )

            if rm_context_id is not None:

                loan_wise_query = loan_wise_query.filter(
                    LoanApplication.rm_context_id
                    == rm_context_id
                )

        loan_wise = cls._loan_wise(
            query=loan_wise_query,
            from_date=from_date,
            to_date=to_date,
        )

        context_ids = cls._context_ids(
            visible_agents
            if analytics_type == "agent"
            else visible_rms
        )

        top_performers = cls._top_performers(
            overview
        )

        top_performers_by_loan_type = (
            cls._top_performers_by_loan_type(
                db=db,
                query=loan_wise_query,
                analytics_type=analytics_type,
                context_ids=context_ids,
                from_date=from_date,
                to_date=to_date,
            )
        )

        return AgentAnalyticsPerformanceResponse(
            type=analytics_type,
            filters=AgentAnalyticsPerformanceFilters(
                type=analytics_type,
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
            ),
            overview=overview,
            loan_wise=loan_wise,
            top_performers=top_performers,
            top_performers_by_loan_type=(
                top_performers_by_loan_type
            ),
            visibility=AgentAnalyticsPerformanceVisibility(
                team_lead_context_ids=cls._context_ids(
                    visible_team_leads
                ),
                agent_context_ids=cls._context_ids(
                    visible_agents
                ),
                rm_context_ids=cls._context_ids(
                    visible_rms
                ),
            ),
        )