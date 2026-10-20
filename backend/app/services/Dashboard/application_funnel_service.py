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

    Used for Login and Sanctioned for applications in the selected
    applied_date cohort. Stage timestamps determine whether a stage
    was reached, not which month the application belongs to.

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
            # Login and Sanctioned must not include applications
            # whose main LoanApplication status is rejected.
            func.lower(
                cast(
                    scoped_applications.c.application_status,
                    String,
                )
            ).notin_(["rejected", "revert_rejected"]),
            timestamp_column.isnot(None),
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

    This is a monthly application cohort funnel.

    First, select applications whose applied_date falls inside the
    selected date range. Then classify each selected application into
    one stage based on its current main status and processing history.
    Stage timestamps do not determine cohort membership.

    Docs Pending and In Process are combined into "In Process".
    Each application should appear in only one stage:
        Rejected > Disbursed > Sanctioned > Login > In Process.

    The cohort date is always LoanApplication.applied_date.

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
    # DATE RANGE — CURRENT MONTH ONLY
    # =========================================================

      # =========================================================
    # DATE RANGE — CURRENT MONTH BY DEFAULT
    # =========================================================

    today = date.today()

    # No dates supplied: default to the current month.
    if from_date is None and to_date is None:
        from_date = today.replace(day=1)
        to_date = today

    # Only to_date supplied: start from the first day
    # of the selected month.
    elif from_date is None:
        from_date = to_date.replace(day=1)

    # Only from_date supplied: use today as the end date.
    elif to_date is None:
        to_date = today

    # Validate the selected range.
    if from_date > to_date:
        raise HTTPException(
            status_code=400,
            detail="from_date cannot be greater than to_date.",
        )

    # Inclusive end date:
    # If to_date is October 17, include all of October 17.
    to_date_exclusive = to_date + timedelta(days=1)

    # Dates returned in the API response.
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
        )
        .filter(
            LoanApplication.deleted_at.is_(None),
            LoanApplication.applied_date >= from_date,
            LoanApplication.applied_date < to_date_exclusive,
        )
    )

    # print(application_query,to_date, "0-0--=-=-=0=--90-90-=-==-=-=-=-=====")
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
    # IN PROCESS (includes Docs Pending)
    # =========================================================
    # Cohort membership is determined only by applied_date.
    # Docs Pending is not returned as a separate stage.
    # Applications with any qualifying Login/Sanctioned/Disbursed
    # history are classified in the furthest stage reached instead.
    # =========================================================


    # Cohort is already filtered by applied_date.
    # Applications with qualifying Login/Sanctioned/Disbursed
    # history are counted in their furthest reached stage.
    # =========================================================

    # Combine current inprocess and docspending statuses.
    # Exclude applications with qualifying Login/Sanctioned/
    # Disbursed history, regardless of when that stage was reached.
    in_process_query = (
        db.query(
            scoped_applications.c.loan_id.label("loan_id"),
            literal("In Process").label("stage"),
            _money(
                scoped_applications.c.loan_amount
            ).label("stage_amount"),
        )
        .filter(
            func.lower(
                cast(
                    scoped_applications.c.application_status,
                    String,
                )
            ).in_(["inprocess", "docspending"]),
            ~db.query(BankProcessing.id).filter(
                BankProcessing.loan_id == scoped_applications.c.loan_id,
                BankProcessing.deleted_at.is_(None),
                func.lower(BankProcessing.status) == "login",
                BankProcessing.loggedin_at.isnot(None),
            ).exists(),
            ~db.query(BankProcessing.id).filter(
                BankProcessing.loan_id == scoped_applications.c.loan_id,
                BankProcessing.deleted_at.is_(None),
                func.lower(BankProcessing.status) == "sanctioned",
                BankProcessing.sanctioned_at.isnot(None),
            ).exists(),
            ~db.query(BankProcessing.id).filter(
                BankProcessing.loan_id == scoped_applications.c.loan_id,
                BankProcessing.deleted_at.is_(None),
                func.lower(BankProcessing.status) == "disbursed",
                BankProcessing.disbursed_at.isnot(None),
            ).exists(),
        )
    )

    # =========================================================
    # LOGIN
    #
    # One application counted once.
    # Latest login record across all dates is used for the stage amount.
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

    # Login is the furthest stage only when no Sanctioned or
    # Disbursed processing record exists for this application.
    login_loan_id = login_query.column_descriptions[0]["expr"]
    login_query = login_query.filter(
        ~db.query(BankProcessing.id).filter(
            BankProcessing.loan_id == login_loan_id,
            BankProcessing.deleted_at.is_(None),
            func.lower(BankProcessing.status) == "sanctioned",
            BankProcessing.sanctioned_at.isnot(None),
        ).exists(),
        ~db.query(BankProcessing.id).filter(
            BankProcessing.loan_id == login_loan_id,
            BankProcessing.deleted_at.is_(None),
            func.lower(BankProcessing.status) == "disbursed",
            BankProcessing.disbursed_at.isnot(None),
        ).exists(),
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
    # Latest sanctioned record across all dates is used.
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

    # Sanctioned is the furthest stage only when the application
    # has not subsequently reached Disbursed.
    sanctioned_loan_id = sanctioned_query.column_descriptions[0]["expr"]
    sanctioned_query = sanctioned_query.filter(
        ~db.query(BankProcessing.id).filter(
            BankProcessing.loan_id == sanctioned_loan_id,
            BankProcessing.deleted_at.is_(None),
            func.lower(BankProcessing.status) == "disbursed",
            BankProcessing.disbursed_at.isnot(None),
        ).exists(),
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
            # A rejected main application must not appear as Disbursed.
            func.lower(
                cast(
                    scoped_applications.c.application_status,
                    String,
                )
            ).notin_(["rejected", "revert_rejected"]),
            BankProcessing.disbursed_at.isnot(None),
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
        )
    )

    # =========================================================
    # COMBINE ALL STAGES
    #
    # UNION ALL combines the mutually exclusive stage queries.
    # Each application is intended to appear in only one stage.
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
    # This is the distinct number of applications received in
    # the selected applied_date cohort, not the sum of stage counts.
    # =========================================================

    total_applications = (
        db.query(
            func.count(
                func.distinct(
                    scoped_applications.c.loan_id
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