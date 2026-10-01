# backend/app/services/Dashboard/loan_type_distribution_service.py

from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import String, case, cast, exists, func
from sqlalchemy.orm import Session

from app.models.bank_processings import BankProcessing
from app.models.loan_applications import LoanApplication
from app.models.loan_types import LoanType
from app.services.Loans.application_service import ApplicationService


# ============================================================
# STATUS PRIORITY
# ============================================================

STATUS_PRIORITY = {
    "inprocess": 1,
    "docspending": 1,
    "rejected": 2,
    "revert_rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


BANK_STATUS_PRIORITY = {
    "rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


STATUS_LABELS = {
    "inprocess": "In Process",
    "docspending": "In Process",
    "rejected": "Rejected",
    "revert_rejected": "Rejected",
    "login": "Login",
    "sanctioned": "Sanctioned",
    "disbursed": "Disbursed",
}


SUPPORTED_STATUSES = {
    "inprocess",
    "docspending",
    "rejected",
    "revert_rejected",
    "login",
    "sanctioned",
    "disbursed",
}


# ============================================================
# STATUS GROUPS
# ============================================================

APPLICATION_STATUS_GROUPS = {
    "inprocess": (
        "inprocess",
        "docspending",
    ),
    "rejected": (
        "rejected",
        "revert_rejected",
    ),
    "login": (
        "login",
    ),
    "sanctioned": (
        "sanctioned",
    ),
    "disbursed": (
        "disbursed",
    ),
}


# Bank statuses that can override the selected status.
#
# Example:
# If application is "Login" and bank processing is
# "Sanctioned", the application is effectively Sanctioned.
#
HIGHER_BANK_STATUSES = {
    "inprocess": (
        "rejected",
        "login",
        "sanctioned",
        "disbursed",
    ),
    "rejected": (
        "login",
        "sanctioned",
        "disbursed",
    ),
    "login": (
        "sanctioned",
        "disbursed",
    ),
    "sanctioned": (
        "disbursed",
    ),
    "disbursed": (),
}


# ============================================================
# HELPERS
# ============================================================

def _parse_date(value):
    if not value:
        return None

    if isinstance(value, date):
        return value

    try:
        return datetime.strptime(
            value,
            "%Y-%m-%d",
        ).date()
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Expected YYYY-MM-DD.",
        )


def _normalize_status(
    status: Optional[str],
) -> Optional[str]:

    if not status:
        return None

    normalized = status.strip().lower()

    aliases = {
        "in process": "inprocess",
        "in_process": "inprocess",
        "inprocess": "inprocess",

        "docspending": "docspending",
        "docs pending": "docspending",
        "docs_pending": "docspending",

        "rejected": "rejected",

        "revert rejected": "revert_rejected",
        "revert_rejected": "revert_rejected",

        "login": "login",
        "sanctioned": "sanctioned",
        "disbursed": "disbursed",
    }

    return aliases.get(
        normalized,
        normalized,
    )


def _status_label(status: str) -> str:
    return STATUS_LABELS.get(
        status,
        status.replace("_", " ").title(),
    )


# ============================================================
# LOAN TYPE DISTRIBUTION
# ============================================================

def get_loan_type_distribution(
    db: Session,
    employee,
    context_id=None,
    from_date=None,
    to_date=None,
    status="Disbursed",
):
    """
    Return loan-type distribution for the selected date range
    and selected status.

    Default dashboard behavior:

        Status:
            Disbursed

        Date:
            Current month

        Date field for Disbursed:
            BankProcessing.disbursed_at

        Amount for Disbursed:
            BankProcessing.disbursement_amount

    For other statuses:

        Date:
            LoanApplication.applied_date

        Existing application/bank effective-status priority
        rules are preserved.

    Response remains compatible with the existing donut chart:

        {
            "status": "Disbursed",
            "data": [
                {
                    "loanTypeId": 1,
                    "loanType": "Personal Loan",
                    "count": 20,
                    "amount": 5000000
                }
            ],
            "totalApplications": 20,
            "totalAmount": 5000000
        }
    """

    # ========================================================
    # PARSE DATE
    # ========================================================

    from_date = _parse_date(from_date)
    to_date = _parse_date(to_date)

    # ========================================================
    # SELECTED STATUS
    # ========================================================

    selected_status = _normalize_status(status)

    if selected_status not in SUPPORTED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported status: {status}",
        )

    # ========================================================
    # DEFAULT CURRENT MONTH FOR DISBURSED
    #
    # This also protects the backend if the frontend does not
    # send dates.
    # ========================================================

    if (
        selected_status == "disbursed"
        and from_date is None
        and to_date is None
    ):
        today = date.today()

        from_date = today.replace(
            day=1
        )

        to_date = today

    # ========================================================
    # DISBURSED
    #
    # IMPORTANT:
    #
    # Disbursement is an event in BankProcessing.
    #
    # Therefore:
    #
    #     date       -> disbursed_at
    #     amount     -> disbursement_amount
    #
    # We do NOT use LoanApplication.applied_date here.
    # ========================================================

    if selected_status == "disbursed":

        # ----------------------------------------------------
        # BASE APPLICATION QUERY
        # ----------------------------------------------------

        applications = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.deleted_at.is_(None),
            )
        )

        # ----------------------------------------------------
        # APPLICATION RBAC
        # ----------------------------------------------------

        applications = ApplicationService.apply_scope(
            db=db,
            query=applications,
            employee=employee,
            context_id=context_id,
        )

        # ----------------------------------------------------
        # ONLY KEEP REQUIRED APPLICATION COLUMNS
        # ----------------------------------------------------

        scoped_applications = (
            applications
            .with_entities(
                LoanApplication.id.label(
                    "loan_id"
                ),
                LoanApplication.loan_type_id.label(
                    "loan_type_id"
                ),
                LoanApplication.loan_amt.label(
                    "loan_amt"
                ),
            )
            .subquery()
        )

        # ----------------------------------------------------
        # DATE RANGE
        #
        # disbursed_at is DateTime.
        #
        # For to_date:
        #
        #     < next day
        #
        # so the complete selected day is included.
        # ----------------------------------------------------

        disbursement_filters = [
            BankProcessing.deleted_at.is_(None),
            BankProcessing.status == "disbursed",
            BankProcessing.disbursed_at.isnot(None),
        ]

        if from_date:
            disbursement_filters.append(
                BankProcessing.disbursed_at >= from_date
            )

        if to_date:
            next_day = to_date + timedelta(days=1)

            disbursement_filters.append(
                BankProcessing.disbursed_at < next_day
            )

        # ----------------------------------------------------
        # ONE DISBURSEMENT RECORD PER APPLICATION
        #
        # There can potentially be multiple BankProcessing
        # rows for one loan.
        #
        # Keep the latest disbursement record.
        # ----------------------------------------------------

        ranked_disbursements = (
            db.query(
                BankProcessing.loan_id.label(
                    "loan_id"
                ),
                BankProcessing.disbursement_amount.label(
                    "disbursement_amount"
                ),
                BankProcessing.offered_amount.label(
                    "offered_amount"
                ),
                BankProcessing.disbursed_at.label(
                    "disbursed_at"
                ),
                func.row_number()
                .over(
                    partition_by=BankProcessing.loan_id,
                    order_by=(
                        BankProcessing.disbursed_at.desc(),
                        BankProcessing.id.desc(),
                    ),
                )
                .label("rn"),
            )
            .join(
                scoped_applications,
                scoped_applications.c.loan_id
                == BankProcessing.loan_id,
            )
            .filter(
                *disbursement_filters
            )
            .subquery()
        )

        # ----------------------------------------------------
        # FINAL DISBURSEMENT AGGREGATION
        #
        # Database returns only aggregated rows.
        # No application dataset is loaded into Python.
        # ----------------------------------------------------

        effective_amount = func.coalesce(
            ranked_disbursements.c.disbursement_amount,
            ranked_disbursements.c.offered_amount,
            scoped_applications.c.loan_amt,
        )

        rows = (
            db.query(
                scoped_applications.c.loan_type_id.label(
                    "loan_type_id"
                ),
                LoanType.name.label(
                    "loan_type"
                ),
                func.count(
                    scoped_applications.c.loan_id
                ).label(
                    "count"
                ),
                func.coalesce(
                    func.sum(effective_amount),
                    0,
                ).label(
                    "amount"
                ),
            )
            .join(
                ranked_disbursements,
                (
                    ranked_disbursements.c.loan_id
                    == scoped_applications.c.loan_id
                )
                & (
                    ranked_disbursements.c.rn == 1
                ),
            )
            .join(
                LoanType,
                LoanType.id
                == scoped_applications.c.loan_type_id,
            )
            .group_by(
                scoped_applications.c.loan_type_id,
                LoanType.name,
            )
            .order_by(
                LoanType.name.asc()
            )
            .all()
        )

        # ----------------------------------------------------
        # BUILD EXISTING FLAT RESPONSE
        # ----------------------------------------------------

        data = []

        total_count = 0
        total_amount = 0

        for row in rows:

            count = int(
                row.count or 0
            )

            amount = float(
                row.amount or 0
            )

            data.append(
                {
                    "loanTypeId": row.loan_type_id,
                    "loanType": row.loan_type,
                    "count": count,
                    "amount": amount,
                }
            )

            total_count += count
            total_amount += amount

        return {
            "status": "Disbursed",
            "data": data,
            "totalApplications": total_count,
            "totalAmount": total_amount,
        }

    # ========================================================
    # OTHER STATUSES
    #
    # Existing effective-status business logic:
    #
    #     Application status
    #             +
    #     BankProcessing status
    #
    # Higher bank priority overrides application status.
    # ========================================================

    applications = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.deleted_at.is_(None),
        )
    )

    # --------------------------------------------------------
    # APPLICATION RBAC
    # --------------------------------------------------------

    applications = ApplicationService.apply_scope(
        db=db,
        query=applications,
        employee=employee,
        context_id=context_id,
    )

    # --------------------------------------------------------
    # DATE RANGE
    #
    # Existing behavior for non-disbursement statuses:
    # LoanApplication.applied_date
    # --------------------------------------------------------

    if from_date:
        applications = applications.filter(
            LoanApplication.applied_date >= from_date,
        )

    if to_date:
        applications = applications.filter(
            LoanApplication.applied_date <= to_date,
        )

    # --------------------------------------------------------
    # APPLICATION STATUS
    #
    # PostgreSQL enum must be cast to String before comparing
    # with text values.
    # --------------------------------------------------------

    application_status_text = cast(
        LoanApplication.status,
        String,
    )

    application_priority = case(
        STATUS_PRIORITY,
        value=application_status_text,
        else_=0,
    )

    application_matches = (
        application_status_text.in_(
            APPLICATION_STATUS_GROUPS[
                selected_status
            ]
        )
    )

    # --------------------------------------------------------
    # SELECTED BANK PROCESSING
    #
    # Only needed when the selected status exists in
    # BankProcessing.
    #
    # This is deliberately limited to the selected status
    # instead of ranking every BankProcessing row.
    # --------------------------------------------------------

    selected_processing = None

    if selected_status in BANK_STATUS_PRIORITY:

        selected_processing = (
            db.query(
                BankProcessing.loan_id.label(
                    "loan_id"
                ),
                BankProcessing.offered_amount.label(
                    "offered_amount"
                ),
                BankProcessing.disbursement_amount.label(
                    "disbursement_amount"
                ),
                func.row_number()
                .over(
                    partition_by=BankProcessing.loan_id,
                    order_by=BankProcessing.id.asc(),
                )
                .label("rn"),
            )
            .filter(
                BankProcessing.deleted_at.is_(None),
                func.lower(
                    BankProcessing.status
                ) == selected_status,
            )
            .subquery()
        )

    # --------------------------------------------------------
    # HIGHER BANK STATUS
    #
    # If a higher-priority bank status exists, the selected
    # status cannot be the effective status.
    # --------------------------------------------------------

    higher_statuses = HIGHER_BANK_STATUSES[
        selected_status
    ]

    if higher_statuses:

        higher_bank_exists = exists().where(
            BankProcessing.loan_id
            == LoanApplication.id,
            BankProcessing.deleted_at.is_(None),
            func.lower(
                BankProcessing.status
            ).in_(higher_statuses),
        )

    else:

        higher_bank_exists = None

    # --------------------------------------------------------
    # SELECTED BANK OVERRIDE
    #
    # Bank status overrides application status only when:
    #
    #     bank priority > application priority
    # --------------------------------------------------------

    if selected_processing is not None:

        selected_bank_exists = (
            selected_processing.c.loan_id.isnot(None)
        )

        selected_bank_priority = (
            BANK_STATUS_PRIORITY[
                selected_status
            ]
        )

        bank_override = (
            selected_bank_exists
            & (
                application_priority
                < selected_bank_priority
            )
        )

    else:

        bank_override = False

    # --------------------------------------------------------
    # EFFECTIVE STATUS FILTER
    # --------------------------------------------------------

    if higher_bank_exists is not None:

        no_higher_bank_status = (
            ~higher_bank_exists
        )

    else:

        no_higher_bank_status = True

    effective_status_filter = (
        no_higher_bank_status
        & (
            application_matches
            | bank_override
        )
    )

    # --------------------------------------------------------
    # EFFECTIVE AMOUNT
    #
    # Preserve existing amount behavior:
    #
    # Application selected:
    #     loan_amt
    #
    # Bank overrides:
    #     offered_amount -> loan_amt
    #
    # Disbursed is handled separately above.
    # --------------------------------------------------------

    if selected_processing is not None:

        effective_amount = case(
            (
                bank_override,
                func.coalesce(
                    selected_processing.c.offered_amount,
                    LoanApplication.loan_amt,
                ),
            ),
            else_=LoanApplication.loan_amt,
        )

    else:

        effective_amount = LoanApplication.loan_amt

    # --------------------------------------------------------
    # FINAL QUERY
    #
    # Return only:
    #
    #     loan type
    #     count
    #     amount
    #
    # No application rows are loaded into Python.
    # --------------------------------------------------------

    query = (
        applications
        .join(
            LoanType,
            LoanType.id
            == LoanApplication.loan_type_id,
        )
    )

    if selected_processing is not None:

        query = query.outerjoin(
            selected_processing,
            (
                selected_processing.c.loan_id
                == LoanApplication.id
            )
            & (
                selected_processing.c.rn == 1
            ),
        )

    rows = (
        query
        .filter(
            effective_status_filter,
        )
        .with_entities(
            LoanApplication.loan_type_id.label(
                "loan_type_id"
            ),
            LoanType.name.label(
                "loan_type"
            ),
            func.count(
                LoanApplication.id
            ).label(
                "count"
            ),
            func.coalesce(
                func.sum(effective_amount),
                0,
            ).label(
                "amount"
            ),
        )
        .group_by(
            LoanApplication.loan_type_id,
            LoanType.name,
        )
        .order_by(
            LoanType.name.asc()
        )
        .all()
    )

    # ========================================================
    # BUILD EXISTING FLAT RESPONSE
    # ========================================================

    data = []

    total_count = 0
    total_amount = 0

    for row in rows:

        count = int(
            row.count or 0
        )

        amount = float(
            row.amount or 0
        )

        data.append(
            {
                "loanTypeId": row.loan_type_id,
                "loanType": row.loan_type,
                "count": count,
                "amount": amount,
            }
        )

        total_count += count
        total_amount += amount

    return {
        "status": _status_label(
            selected_status
        ),
        "data": data,
        "totalApplications": total_count,
        "totalAmount": total_amount,
    }