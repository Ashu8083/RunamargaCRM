# backend/app/services/Dashboard/application_status_service.py

from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing


# =========================================================
# STATUS PRIORITY
# =========================================================

STATUS_PRIORITY = {
    "inprocess": 1,
    "docspending": 1,
    "rejected": 2,
    "revert_rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


# =========================================================
# DASHBOARD STATUS LABELS
# =========================================================

STATUS_LABELS = {
    "inprocess": "In Process",
    "docspending": "In Process",
    "rejected": "Rejected",
    "revert_rejected": "Rejected",
    "login": "Login",
    "sanctioned": "Sanctioned",
    "disbursed": "Disbursed",
}


# =========================================================
# BANK PROCESSING STATUSES
# =========================================================

BANK_STATUS_PRIORITY = {
    "rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


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

    One loan application is counted only once.

    Data sources:
        - loan_applications
        - bank_processings

    Access scope is handled centrally by AccessControl.

    context_id refers to EmployeeContext.id.
    """

    # =====================================================
    # CONTEXT VALIDATION
    # =====================================================

    if context_id is None:
        raise HTTPException(
            status_code=400,
            detail="context_id is required.",
        )

    # =====================================================
    # DATE CONVERSION
    # =====================================================

    if from_date:
        from_date = datetime.strptime(
            from_date,
            "%Y-%m-%d",
        ).date()

    if to_date:
        to_date = datetime.strptime(
            to_date,
            "%Y-%m-%d",
        ).date()

    # =====================================================
    # GET LOAN APPLICATIONS
    # =====================================================

    loan_query = (
        db.query(LoanApplication)
        .filter(
            LoanApplication.deleted_at.is_(None)
        )
    )

    # =====================================================
    # APPLY CENTRAL ACCESS CONTROL SCOPE
    # =====================================================
    #
    # IMPORTANT:
    #
    # Do NOT determine AGENT/RM/TEAMLEAD/GLOBAL here.
    #
    # AccessControl is responsible for:
    #
    #   - validating the EmployeeContext
    #   - resolving context family
    #   - applying Agent scope
    #   - applying RM scope
    #   - applying Team Lead scope
    #   - applying Global scope
    #
    # context_id is EmployeeContext.id.
    #
    # =====================================================

    loan_query = AccessControl.apply_application_scope(
        query=loan_query,
        db=db,
        employee=employee,
        context_id=context_id,
    )

    # =====================================================
    # DATE FILTER
    # =====================================================

    if from_date:
        loan_query = loan_query.filter(
            LoanApplication.applied_date >= from_date
        )

    if to_date:
        loan_query = loan_query.filter(
            LoanApplication.applied_date <= to_date
        )

    # =====================================================
    # LOAN TYPE FILTER
    # =====================================================

    if loan_type_id:
        loan_query = loan_query.filter(
            LoanApplication.loan_type_id == loan_type_id
        )

    # =====================================================
    # GET LOANS
    # =====================================================

    loans = loan_query.all()

    # =====================================================
    # GET BANK PROCESSINGS
    # =====================================================

    loan_ids = [
        loan.id
        for loan in loans
    ]

    bank_processings = []

    if loan_ids:
        bank_processings = (
            db.query(BankProcessing)
            .filter(
                BankProcessing.loan_id.in_(loan_ids),
                BankProcessing.deleted_at.is_(None),
            )
            .all()
        )

    # =====================================================
    # GROUP BANK PROCESSINGS BY LOAN
    # =====================================================

    processing_by_loan = {}

    for processing in bank_processings:
        if not processing.loan_id:
            continue

        processing_by_loan.setdefault(
            processing.loan_id,
            [],
        ).append(processing)

    # =====================================================
    # STATUS AGGREGATION
    # =====================================================

    status_map = {
        "In Process": {
            "count": 0,
            "amount": 0,
        },
        "Rejected": {
            "count": 0,
            "amount": 0,
        },
        "Login": {
            "count": 0,
            "amount": 0,
        },
        "Sanctioned": {
            "count": 0,
            "amount": 0,
        },
        "Disbursed": {
            "count": 0,
            "amount": 0,
        },
    }

    # =====================================================
    # PROCESS EACH LOAN ONCE
    # =====================================================

    for loan in loans:

        # -------------------------------------------------
        # APPLICATION STATUS
        # -------------------------------------------------

        loan_status = (
            loan.status.value
            if loan.status
            else None
        )

        if loan_status:
            loan_status = (
                loan_status
                .lower()
                .strip()
            )

        selected_status = loan_status

        selected_priority = (
            STATUS_PRIORITY.get(
                loan_status,
                0,
            )
        )

        selected_processing = None

        # -------------------------------------------------
        # CHECK BANK PROCESSINGS
        # -------------------------------------------------

        loan_processings = processing_by_loan.get(
            loan.id,
            [],
        )

        for processing in loan_processings:

            bank_status = (
                processing.status or ""
            ).lower().strip()

            bank_priority = (
                BANK_STATUS_PRIORITY.get(
                    bank_status,
                    0,
                )
            )

            if bank_priority > selected_priority:
                selected_priority = bank_priority
                selected_status = bank_status
                selected_processing = processing

        # -------------------------------------------------
        # UNKNOWN STATUS
        # -------------------------------------------------

        if selected_status not in STATUS_LABELS:
            continue

        dashboard_status = STATUS_LABELS[
            selected_status
        ]

        # =================================================
        # DETERMINE AMOUNT
        # =================================================

        loan_amount = float(
            loan.loan_amt or 0
        )

        amount = loan_amount

        # -------------------------------------------------
        # BANK PROCESSING AMOUNT
        # -------------------------------------------------

        if selected_processing:

            # ---------------------------------------------
            # DISBURSED
            # ---------------------------------------------

            if selected_status == "disbursed":

                amount = float(
                    selected_processing.disbursement_amount
                    or selected_processing.offered_amount
                    or loan.loan_amt
                    or 0
                )

            # ---------------------------------------------
            # SANCTIONED / LOGIN / REJECTED
            # ---------------------------------------------

            elif selected_status in {
                "sanctioned",
                "login",
                "rejected",
            }:

                amount = float(
                    selected_processing.offered_amount
                    or loan.loan_amt
                    or 0
                )

        # =================================================
        # ADD APPLICATION ONCE
        # =================================================

        status_map[dashboard_status]["count"] += 1

        status_map[dashboard_status]["amount"] += amount

    # =====================================================
    # RESPONSE DATA
    # =====================================================

    status_order = [
        "In Process",
        "Rejected",
        "Login",
        "Sanctioned",
        "Disbursed",
    ]

    data = []

    for status in status_order:

        values = status_map[status]

        data.append({
            "status": status,
            "count": values["count"],
            "amount": values["amount"],
        })

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