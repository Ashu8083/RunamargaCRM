# backend/app/services/Dashboard/application_funnel_service.py

from datetime import date, timedelta
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import Numeric, String, cast, func, literal
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.bank_processings import BankProcessing
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication
from app.services.Loans.application_service import ApplicationService


FUNNEL_STATUSES = [
    "In Process",
    "Login",
    "Sanctioned",
    "Disbursed",
    "Rejected",
]

MONEY_TYPE = Numeric(18, 2)


def _get_current_month_range():
    """
    Return the first day of the current month and the first day
    of the next month.

    Example:
        2026-09-26

    returns:
        2026-09-01
        2026-10-01
    """

    today = date.today()

    month_start = today.replace(day=1)

    if today.month == 12:
        next_month_start = date(
            today.year + 1,
            1,
            1,
        )
    else:
        next_month_start = date(
            today.year,
            today.month + 1,
            1,
        )

    return month_start, next_month_start


def _money(expression):
    return cast(
        func.coalesce(
            expression,
            0,
        ),
        MONEY_TYPE,
    )


def _build_stage_processing_query(
    db: Session,
    scoped_applications,
    status: str,
    timestamp_column,
    amount_column,
    from_date: date,
    to_date_exclusive: date,
):
    """
    Return one BankProcessing record per application
    for the requested lifecycle stage.

    Used for:
        Login
        Sanctioned

    Disbursed is handled separately because multiple
    disbursement records must contribute to the total amount.
    """

    ranked = (
        db.query(
            BankProcessing.loan_id.label(
                "loan_id"
            ),
            timestamp_column.label(
                "stage_date"
            ),
            _money(
                amount_column
            ).label(
                "stage_amount"
            ),
            func.row_number()
            .over(
                partition_by=BankProcessing.loan_id,
                order_by=[
                    timestamp_column.desc(),
                    BankProcessing.id.desc(),
                ],
            )
            .label(
                "row_number"
            ),
        )
        .join(
            scoped_applications,
            scoped_applications.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            func.lower(
                BankProcessing.status
            ) == status,
            timestamp_column.isnot(None),
            timestamp_column >= from_date,
            timestamp_column < to_date_exclusive,
        )
        .subquery(
            name=f"{status}_processing"
        )
    )

    return (
        db.query(
            ranked.c.loan_id.label(
                "loan_id"
            ),
            ranked.c.stage_date.label(
                "stage_date"
            ),
            cast(
                ranked.c.stage_amount,
                MONEY_TYPE,
            ).label(
                "stage_amount"
            ),
        )
        .filter(
            ranked.c.row_number == 1
        )
    )


def get_application_funnel(
    db: Session,
    employee: Employee,
    context_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    loan_type: Optional[int] = None,
):
    """
    Return application funnel data.

    Each funnel stage is calculated independently.

    One LoanApplication can therefore appear in multiple stages.

    Current-month default:
        First day of current month -> today.

    Stage dates:

        In Process -> LoanApplication.applied_date
        Login      -> BankProcessing.loggedin_at
        Sanctioned -> BankProcessing.sanctioned_at
        Disbursed  -> BankProcessing.disbursed_at
        Rejected   -> LoanApplication.rejection_date

    Disbursed:

        Count:
            COUNT(DISTINCT loan_id)

        Amount:
            SUM(all active disbursement_amount records
                inside the selected date range)

    Rejected:

        Only:
            LoanApplication.status IN
            ('rejected', 'revert_rejected')

        and:
            LoanApplication.rejection_date
            inside the selected date range.

    ApplicationService.apply_scope() remains the RBAC
    source of truth.
    """

    # =========================================================
    # PERMISSION
    # =========================================================

    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="dashboard:conversion-funnel",
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "You do not have access to "
                "the application funnel."
            ),
        )

    # =========================================================
    # CONTEXT
    # =========================================================

    if context_id is None:
        raise HTTPException(
            status_code=400,
            detail="context_id is required.",
        )

    # =========================================================
    # DATE RANGE
    #
    # Default:
    # current month -> today
    # =========================================================

    if from_date is None and to_date is None:
        from_date, to_date_exclusive = (
            _get_current_month_range()
        )

        response_to_date = (
            date.today()
        )

    else:
        if from_date is None:
            from_date = to_date

        if to_date is None:
            to_date = from_date

        if from_date > to_date:
            raise HTTPException(
                status_code=400,
                detail=(
                    "from_date cannot be greater "
                    "than to_date."
                ),
            )

        to_date_exclusive = (
            to_date
            + timedelta(days=1)
        )

        response_to_date = to_date

    # =========================================================
    # BASE APPLICATION SCOPE
    # =========================================================

    application_query = (
        db.query(
            LoanApplication.id.label(
                "loan_id"
            ),
            LoanApplication.loan_type_id.label(
                "loan_type_id"
            ),
            LoanApplication.loan_amt.label(
                "loan_amount"
            ),
            LoanApplication.applied_date.label(
                "applied_date"
            ),
            LoanApplication.status.label(
                "application_status"
            ),
            LoanApplication.rejection_date.label(
                "rejection_date"
            ),
        )
        .filter(
            LoanApplication.deleted_at.is_(None),
        )
    )

    application_query = (
        ApplicationService.apply_scope(
            query=application_query,
            db=db,
            employee=employee,
            context_id=context_id,
        )
    )

    scoped_applications = (
        application_query
        .subquery(
            name="scoped_applications"
        )
    )

    # =========================================================
    # LOAN TYPE FILTER
    # =========================================================

    if loan_type:
        scoped_applications = (
            db.query(
                scoped_applications,
            )
            .filter(
                scoped_applications.c.loan_type_id
                == loan_type
            )
            .subquery(
                name="filtered_applications"
            )
        )

    # =========================================================
    # IN PROCESS
    #
    # Application created during the selected period.
    #
    # Funnel behavior intentionally allows the same
    # application to also appear in Login/Sanctioned/
    # Disbursed.
    # =========================================================

    in_process_query = (
        db.query(
            scoped_applications.c.loan_id.label(
                "loan_id"
            ),
            literal("In Process").label(
                "stage"
            ),
            _money(
                scoped_applications.c.loan_amount
            ).label(
                "stage_amount"
            ),
        )
        .filter(
            scoped_applications.c.applied_date
            >= from_date,
            scoped_applications.c.applied_date
            < to_date_exclusive,
        )
    )

    # =========================================================
    # LOGIN
    #
    # One application counted once.
    # Latest login record inside selected period is used
    # for the stage amount.
    # =========================================================

    login_query = _build_stage_processing_query(
        db=db,
        scoped_applications=scoped_applications,
        status="login",
        timestamp_column=BankProcessing.loggedin_at,
        amount_column=func.coalesce(
            BankProcessing.offered_amount,
            scoped_applications.c.loan_amount,
            0,
        ),
        from_date=from_date,
        to_date_exclusive=to_date_exclusive,
    )

    login_query = login_query.with_entities(
        login_query.column_descriptions[0]["expr"].label(
            "loan_id"
        ),
        literal("Login").label(
            "stage"
        ),
        cast(
            login_query.column_descriptions[2]["expr"],
            MONEY_TYPE,
        ).label(
            "stage_amount"
        ),
    )

    # =========================================================
    # SANCTIONED
    #
    # One application counted once.
    # Latest sanctioned record inside selected period is used.
    # =========================================================

    sanctioned_query = _build_stage_processing_query(
        db=db,
        scoped_applications=scoped_applications,
        status="sanctioned",
        timestamp_column=BankProcessing.sanctioned_at,
        amount_column=func.coalesce(
            BankProcessing.offered_amount,
            scoped_applications.c.loan_amount,
            0,
        ),
        from_date=from_date,
        to_date_exclusive=to_date_exclusive,
    )

    sanctioned_query = sanctioned_query.with_entities(
        sanctioned_query.column_descriptions[0]["expr"].label(
            "loan_id"
        ),
        literal("Sanctioned").label(
            "stage"
        ),
        cast(
            sanctioned_query.column_descriptions[2]["expr"],
            MONEY_TYPE,
        ).label(
            "stage_amount"
        ),
    )

    # =========================================================
    # DISBURSED
    #
    # IMPORTANT:
    #
    # Do NOT use ROW_NUMBER() here.
    #
    # One loan can have multiple disbursement records.
    #
    # Example:
    #
    # loan 100:
    #     2,00,000
    #     1,00,000
    #
    # Count:
    #     1
    #
    # Amount:
    #     3,00,000
    #
    # Therefore:
    #
    #     COUNT(DISTINCT loan_id)
    #     SUM(disbursement_amount)
    # =========================================================

    disbursed_rows = (
        db.query(
            BankProcessing.loan_id.label(
                "loan_id"
            ),
            _money(
                BankProcessing.disbursement_amount
            ).label(
                "stage_amount"
            ),
        )
        .join(
            scoped_applications,
            scoped_applications.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            func.lower(
                BankProcessing.status
            ) == "disbursed",
            BankProcessing.disbursed_at.isnot(None),
            BankProcessing.disbursed_at >= from_date,
            BankProcessing.disbursed_at < to_date_exclusive,
        )
        .subquery(
            name="disbursed_rows"
        )
    )

    disbursed_query = (
        db.query(
            disbursed_rows.c.loan_id.label(
                "loan_id"
            ),
            literal("Disbursed").label(
                "stage"
            ),
            cast(
                func.sum(
                    disbursed_rows.c.stage_amount
                ),
                MONEY_TYPE,
            ).label(
                "stage_amount"
            ),
        )
        .group_by(
            disbursed_rows.c.loan_id,
        )
    )

    # =========================================================
    # REJECTED
    #
    # IMPORTANT:
    #
    # Rejected is based ONLY on LoanApplication.
    #
    # We do NOT union BankProcessing.rejected_at.
    #
    # This prevents duplicate/repeated rejected records
    # from inflating the count.
    # =========================================================

    rejected_query = (
        db.query(
            scoped_applications.c.loan_id.label(
                "loan_id"
            ),
            literal("Rejected").label(
                "stage"
            ),
            _money(
                scoped_applications.c.loan_amount
            ).label(
                "stage_amount"
            ),
        )
        .filter(
            func.lower(
                cast(
                    scoped_applications.c.application_status,
                    String,
                )
            ).in_(
                [
                    "rejected",
                    "revert_rejected",
                ]
            ),
            scoped_applications.c.rejection_date
            >= from_date,
            scoped_applications.c.rejection_date
            < to_date_exclusive,
        )
    )

    # =========================================================
    # COMBINE ALL STAGES
    #
    # UNION ALL is intentional.
    #
    # One application can appear in multiple funnel stages.
    # =========================================================

    all_stage_rows = (
        in_process_query
        .union_all(
            login_query,
            sanctioned_query,
            disbursed_query,
            rejected_query,
        )
        .subquery(
            name="all_funnel_stage_rows"
        )
    )

    # =========================================================
    # ONE ROW PER APPLICATION PER STAGE
    #
    # Disbursed has already summed all disbursements for
    # each loan.
    #
    # Other stages already have one row per loan.
    #
    # MAX therefore does not reduce a disbursement amount.
    # =========================================================

    unique_stage_rows = (
        db.query(
            all_stage_rows.c.loan_id.label(
                "loan_id"
            ),
            all_stage_rows.c.stage.label(
                "stage"
            ),
            cast(
                func.max(
                    all_stage_rows.c.stage_amount
                ),
                MONEY_TYPE,
            ).label(
                "stage_amount"
            ),
        )
        .group_by(
            all_stage_rows.c.loan_id,
            all_stage_rows.c.stage,
        )
        .subquery(
            name="unique_funnel_stage_rows"
        )
    )

    # =========================================================
    # FINAL STAGE AGGREGATION
    # =========================================================

    result = (
        db.query(
            unique_stage_rows.c.stage,
            func.count(
                unique_stage_rows.c.loan_id
            ).label(
                "count"
            ),
            cast(
                func.coalesce(
                    func.sum(
                        unique_stage_rows.c.stage_amount
                    ),
                    0,
                ),
                MONEY_TYPE,
            ).label(
                "amount"
            ),
        )
        .group_by(
            unique_stage_rows.c.stage
        )
        .all()
    )

    # =========================================================
    # RESULT MAP
    # =========================================================

    result_map = {
        row.stage: {
            "status": row.stage,
            "count": int(
                row.count or 0
            ),
            "amount": float(
                row.amount or 0
            ),
        }
        for row in result
    }

    # =========================================================
    # INITIALIZE ALL FUNNEL STAGES
    # =========================================================

    data = [
        result_map.get(
            status,
            {
                "status": status,
                "count": 0,
                "amount": 0,
            },
        )
        for status in FUNNEL_STATUSES
    ]

    # =========================================================
    # UNIQUE APPLICATION COUNT
    #
    # This is NOT the sum of funnel stage counts.
    # =========================================================

    total_applications = (
        db.query(
            func.count(
                func.distinct(
                    unique_stage_rows.c.loan_id
                )
            )
        )
        .scalar()
        or 0
    )

    # =========================================================
    # TOTAL AMOUNT
    #
    # Funnel total amount represents Disbursed amount.
    # =========================================================

    total_amount = next(
        (
            item["amount"]
            for item in data
            if item["status"] == "Disbursed"
        ),
        0,
    )

    # =========================================================
    # RESPONSE
    # =========================================================

    return {
        "data": data,
        "totalApplications": int(
            total_applications
        ),
        "totalAmount": float(
            total_amount
        ),
        "filters": {
            "fromDate": (
                from_date.isoformat()
                if from_date
                else None
            ),
            "toDate": (
                response_to_date.isoformat()
                if response_to_date
                else None
            ),
            "loanType": loan_type,
        },
    }