# backend/app/services/Dashboard/application_status_service.py

from datetime import date, datetime, timedelta
from fastapi import HTTPException
from sqlalchemy import case, func
from sqlalchemy.orm import Session
from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing
from app.services.Loans.application_service import ApplicationService
import time
# =========================================================
# DATE HELPERS
# =========================================================
def _parse_date(value):
    """
    Convert YYYY-MM-DD string to date.
    """
    if not value:
        return None
    if isinstance(value, datetime):
        return value.date()
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
def _get_current_month_range():
    today = datetime.utcnow().date()
    return (
        today.replace(day=1),
        today,
    )
# =========================================================
# APPLICATION STATUS
# =========================================================
async def get_application_status_data(
    db: Session,
    employee,
    context_id=None,
    from_date=None,
    to_date=None,
    loan_type_id=None,
):
    """
    Get Application Status dashboard data.
    BUSINESS RULES
    --------------
    IN PROCESS
    ----------
    Includes:
        - LoanApplication.status = inprocess
        - LoanApplication.status = docspending
    Date:
        - inprocess -> applied_date
        - docspending -> docspending_date
    Exclusion:
        - If the application has progressed to Login,
          Sanctioned, or Disbursed in BankProcessing,
          it is NOT counted as In Process.
    REJECTED
    --------
    Includes only:
        - LoanApplication.status = rejected
        - LoanApplication.status = revert_rejected
    Date:
        - LoanApplication.rejection_date
    LOGIN
    -----
    Source:
        BankProcessing
    Conditions:
        - status = login
        - loggedin_at is inside selected date range
    SANCTIONED
    ----------
    Source:
        BankProcessing
    Conditions:
        - status = sanctioned
        - sanctioned_at is inside selected date range
    DISBURSED
    ---------
    Source:
        BankProcessing
    Conditions:
        - status = disbursed
        - disbursed_at is inside selected date range
    Count:
        - COUNT(DISTINCT loan_id)
    Amount:
        - SUM(disbursement_amount)
    IMPORTANT
    ---------
    Login, Sanctioned, and Disbursed are monthly processing
    events. Therefore the same application can appear in
    multiple boxes.
    """
    service_start = time.perf_counter()
    # =====================================================
    # CONTEXT VALIDATION
    # =====================================================
    if context_id is None:
        raise HTTPException(
            status_code=400,
            detail="context_id is required.",
        )
    # =====================================================
    # DATE RANGE
    # =====================================================
    from_date = _parse_date(from_date)
    to_date = _parse_date(to_date)
    if not from_date and not to_date:
        from_date, to_date = _get_current_month_range()
    elif from_date and not to_date:
        to_date = datetime.utcnow().date()
    elif to_date and not from_date:
        from_date, _ = _get_current_month_range()
    if from_date and to_date and from_date > to_date:
        raise HTTPException(
            status_code=400,
            detail="from_date cannot be greater than to_date.",
        )
    # =====================================================
    # DATETIME RANGE
    # =====================================================
    from_datetime = datetime.combine(
        from_date,
        datetime.min.time(),
    )
    to_datetime_exclusive = datetime.combine(
        to_date + timedelta(days=1),
        datetime.min.time(),
    )
    # =====================================================
    # BASE APPLICATION QUERY
    # =====================================================
    # IMPORTANT:
    # Do NOT put applied_date filtering here.
    #
    # Login / Sanctioned / Disbursed are based on their own
    # BankProcessing event dates.
    # =====================================================
    loan_query = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.deleted_at.is_(None),
        )
    )
    # =====================================================
    # APPLY EXISTING RBAC SCOPE
    # =====================================================
    loan_query = ApplicationService.apply_scope(
        query=loan_query,
        db=db,
        employee=employee,
        context_id=context_id,
    )
    # =====================================================
    # LOAN TYPE FILTER
    # =====================================================
    if loan_type_id:
        loan_query = loan_query.filter(
            LoanApplication.loan_type_id == loan_type_id
        )
    # =====================================================
    # SCOPED APPLICATIONS
    # =====================================================
    # This contains ALL applications visible to the current
    # employee/context.
    #
    # Date filters are applied separately for each dashboard
    # status according to that status's business date.
    # =====================================================
    scoped_loans = (
        loan_query
        .with_entities(
            LoanApplication.id.label("loan_id"),
            LoanApplication.status.label(
                "application_status"
            ),
            LoanApplication.loan_amt.label(
                "loan_amt"
            ),
            LoanApplication.applied_date.label(
                "applied_date"
            ),
            LoanApplication.docspending_date.label(
                "docspending_date"
            ),
            LoanApplication.rejection_date.label(
                "rejection_date"
            ),
        )
        .subquery(
            name="scoped_loans"
        )
    )
    t = time.perf_counter()
    scoped_count = db.query(
        scoped_loans.c.loan_id
    ).count()
    print(
        f"[ApplicationStatus] scoped loans: "
        f"{time.perf_counter() - t:.3f}s "
        f"count={scoped_count}"
    )
    # =====================================================
    # IN PROCESS
    # =====================================================
    # First find applications that have already progressed
    # through Login, Sanctioned, or Disbursed.
    #
    # IMPORTANT:
    # Rejected is intentionally NOT included here because the
    # requested In Process exclusion is specifically:
    # Login / Sanctioned / Disbursed.
    # =====================================================
    progressed_loans = (
        db.query(
            BankProcessing.loan_id.label(
                "loan_id"
            )
        )
        .join(
            scoped_loans,
            scoped_loans.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            BankProcessing.status.in_(
                [
                    "login",
                    "sanctioned",
                    "disbursed",
                ]
            ),
        )
        .distinct()
        .subquery(
            name="progressed_loans"
        )
    )
    # =====================================================
    # IN PROCESS COUNT
    # =====================================================
    in_process_count = (
        db.query(
            func.count(
                scoped_loans.c.loan_id
            )
        )
        .outerjoin(
            progressed_loans,
            progressed_loans.c.loan_id
            == scoped_loans.c.loan_id,
        )
        .filter(
            (
                (
                    scoped_loans.c.application_status
                    == "inprocess"
                )
                & (
                    scoped_loans.c.applied_date
                    >= from_date
                )
                & (
                    scoped_loans.c.applied_date
                    < to_date + timedelta(days=1)
                )
            )
            |
            (
                (
                    scoped_loans.c.application_status
                    == "docspending"
                )
                & (
                    scoped_loans.c.docspending_date
                    >= from_datetime
                )
                & (
                    scoped_loans.c.docspending_date
                    < to_datetime_exclusive
                )
            )
        )
        .filter(
            progressed_loans.c.loan_id.is_(None)
        )
        .scalar()
        or 0
    )
    # =====================================================
    # IN PROCESS AMOUNT
    # =====================================================
    in_process_amount = (
        db.query(
            func.coalesce(
                func.sum(
                    scoped_loans.c.loan_amt
                ),
                0,
            )
        )
        .outerjoin(
            progressed_loans,
            progressed_loans.c.loan_id
            == scoped_loans.c.loan_id,
        )
        .filter(
            (
                (
                    scoped_loans.c.application_status
                    == "inprocess"
                )
                & (
                    scoped_loans.c.applied_date
                    >= from_date
                )
                & (
                    scoped_loans.c.applied_date
                    < to_date + timedelta(days=1)
                )
            )
            |
            (
                (
                    scoped_loans.c.application_status
                    == "docspending"
                )
                & (
                    scoped_loans.c.docspending_date
                    >= from_datetime
                )
                & (
                    scoped_loans.c.docspending_date
                    < to_datetime_exclusive
                )
            )
        )
        .filter(
            progressed_loans.c.loan_id.is_(None)
        )
        .scalar()
        or 0
    )
    # =====================================================
    # LOGIN
    # =====================================================
    # Login is based ONLY on BankProcessing.loggedin_at.
    #
    # We intentionally DO NOT check:
    #     BankProcessing.status == "login"
    #
    # An application is excluded if its current application
    # status is rejected/revert_rejected, even if it has a
    # loggedin_at value inside the selected period.
    # =====================================================
    login_processing = (
        db.query(
            BankProcessing.loan_id.label(
                "loan_id"
            ),
            BankProcessing.loggedin_at.label(
                "loggedin_at"
            ),
            BankProcessing.offered_amount.label(
                "offered_amount"
            ),
            func.row_number()
            .over(
                partition_by=BankProcessing.loan_id,
                order_by=[
                    BankProcessing.loggedin_at.desc(),
                    BankProcessing.id.desc(),
                ],
            )
            .label(
                "row_number"
            ),
        )
        .join(
            scoped_loans,
            scoped_loans.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            BankProcessing.loggedin_at >= from_datetime,
            BankProcessing.loggedin_at < to_datetime_exclusive,
            ~scoped_loans.c.application_status.in_(
                [
                    "rejected",
                    "revert_rejected",
                ]
            ),
        )
        .subquery(
            name="login_processing"
        )
    )
    login_count = (
        db.query(
            func.count(
                login_processing.c.loan_id
            )
        )
        .filter(
            login_processing.c.row_number == 1
        )
        .scalar()
        or 0
    )
    login_amount = (
        db.query(
            func.coalesce(
                func.sum(
                    func.coalesce(
                        login_processing.c.offered_amount,
                        scoped_loans.c.loan_amt,
                        0,
                    )
                ),
                0,
            )
        )
        .join(
            scoped_loans,
            scoped_loans.c.loan_id
            == login_processing.c.loan_id,
        )
        .filter(
            login_processing.c.row_number == 1
        )
        .scalar()
        or 0
    )
    # =====================================================
    # SANCTIONED
    # =====================================================
    # Sanctioned is based ONLY on BankProcessing.sanctioned_at.
    # =====================================================
    sanctioned_processing = (
        db.query(
            BankProcessing.loan_id.label(
                "loan_id"
            ),
            BankProcessing.sanctioned_at.label(
                "sanctioned_at"
            ),
            BankProcessing.offered_amount.label(
                "offered_amount"
            ),
            func.row_number()
            .over(
                partition_by=BankProcessing.loan_id,
                order_by=[
                    BankProcessing.sanctioned_at.desc(),
                    BankProcessing.id.desc(),
                ],
            )
            .label(
                "row_number"
            ),
        )
        .join(
            scoped_loans,
            scoped_loans.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            BankProcessing.status == "sanctioned",
            BankProcessing.sanctioned_at >= from_datetime,
            BankProcessing.sanctioned_at < to_datetime_exclusive,
        )
        .subquery(
            name="sanctioned_processing"
        )
    )
    sanctioned_count = (
        db.query(
            func.count(
                sanctioned_processing.c.loan_id
            )
        )
        .filter(
            sanctioned_processing.c.row_number == 1
        )
        .scalar()
        or 0
    )
    sanctioned_amount = (
        db.query(
            func.coalesce(
                func.sum(
                    func.coalesce(
                        sanctioned_processing.c.offered_amount,
                        scoped_loans.c.loan_amt,
                        0,
                    )
                ),
                0,
            )
        )
        .join(
            scoped_loans,
            scoped_loans.c.loan_id
            == sanctioned_processing.c.loan_id,
        )
        .filter(
            sanctioned_processing.c.row_number == 1
        )
        .scalar()
        or 0
    )
    # =====================================================
    # DISBURSED
    # =====================================================
    # THIS MUST MATCH THE DATABASE QUERY:
    #
    # COUNT(DISTINCT bp.loan_id)
    # SUM(bp.disbursement_amount)
    #
    # WHERE:
    #     bp.status = disbursed
    #     bp.disbursed_at is inside selected period
    #
    # We intentionally DO NOT:
    #     - filter by LoanApplication.applied_date
    #     - use LoanApplication.status
    #     - use row_number()
    #
    # This means the dashboard matches:
    #
    # SELECT COUNT(DISTINCT bp.loan_id),
    #        SUM(bp.disbursement_amount)
    # FROM bank_processings bp
    # ...
    # =====================================================
    disbursed_result = (
        db.query(
            func.count(
                func.distinct(
                    BankProcessing.loan_id
                )
            ).label(
                "disbursed_count"
            ),
            func.coalesce(
                func.sum(
                    BankProcessing.disbursement_amount
                ),
                0,
            ).label(
                "disbursed_amount"
            ),
        )
        .join(
            scoped_loans,
            scoped_loans.c.loan_id
            == BankProcessing.loan_id,
        )
        .filter(
            BankProcessing.deleted_at.is_(None),
            BankProcessing.status == "disbursed",
            BankProcessing.disbursed_at >= from_datetime,
            BankProcessing.disbursed_at < to_datetime_exclusive,
        )
        .one()
    )
    disbursed_count = (
        disbursed_result.disbursed_count
        or 0
    )
    disbursed_amount = (
        disbursed_result.disbursed_amount
        or 0
    )
    # =====================================================
    # REJECTED
    # =====================================================
    # Rejected is based ONLY on LoanApplication:
    #
    #     rejected
    #     revert_rejected
    #
    # and rejection_date.
    #
    # BankProcessing rejection records are NOT used here.
    # =====================================================
    rejected_result = (
        db.query(
            func.count(
                scoped_loans.c.loan_id
            ).label(
                "rejected_count"
            ),
            func.coalesce(
                func.sum(
                    scoped_loans.c.loan_amt
                ),
                0,
            ).label(
                "rejected_amount"
            ),
        )
        .filter(
            scoped_loans.c.application_status.in_(
                [
                    "rejected",
                    "revert_rejected",
                ]
            ),
            scoped_loans.c.rejection_date >= from_datetime,
            scoped_loans.c.rejection_date < to_datetime_exclusive,
        )
        .one()
    )
    rejected_count = (
        rejected_result.rejected_count
        or 0
    )
    rejected_amount = (
        rejected_result.rejected_amount
        or 0
    )
    # =====================================================
    # BUILD RESPONSE
    # =====================================================
    data = [
        {
            "status": "In Process",
            "count": int(
                in_process_count
            ),
            "amount": float(
                in_process_amount
            ),
        },
        {
            "status": "Rejected",
            "count": int(
                rejected_count
            ),
            "amount": float(
                rejected_amount
            ),
        },
        {
            "status": "Login",
            "count": int(
                login_count
            ),
            "amount": float(
                login_amount
            ),
        },
        {
            "status": "Sanctioned",
            "count": int(
                sanctioned_count
            ),
            "amount": float(
                sanctioned_amount
            ),
        },
        {
            "status": "Disbursed",
            "count": int(
                disbursed_count
            ),
            "amount": float(
                disbursed_amount
            ),
        },
    ]
    # =====================================================
    # SUMMARY
    # =====================================================
    total_applications = sum(
        item["count"]
        for item in data
    )
    pending_statuses = {
        "In Process",
        "Login",
        "Sanctioned",
    }
    pending_applications = sum(
        item["count"]
        for item in data
        if item["status"] in pending_statuses
    )
    total_amount = sum(
        item["amount"]
        for item in data
    )
    print(
        f"[ApplicationStatus] SERVICE: "
        f"{time.perf_counter() - service_start:.3f}s"
    )
    # =====================================================
    # RESPONSE
    # =====================================================
    return {
        "data": data,
        "summary": {
            "totalApplications": total_applications,
            "pendingApplications": pending_applications,
            "totalAmount": total_amount,
        },
    }