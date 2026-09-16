# backend/app/services/Dashboard/application_funnel_service.py

from collections import defaultdict
from datetime import date
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing
from app.models.employees import Employee


STATUS_PRIORITY = {
    "inprocess": 1,
    "docspending": 1,
    "rejected": 2,
    "revert_rejected": 2,
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


BANK_STATUS_PRIORITY = {
    "rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


FUNNEL_STATUSES = [
    "In Process",
    "Login",
    "Sanctioned",
    "Disbursed",
    "Rejected",
]


def get_application_funnel(
    db: Session,
    employee: Employee,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    loan_type: Optional[int] = None,
):
    """
    Return application funnel data for the current employee's
    permitted application scope.

    Each loan application is counted only once.

    BankProcessing can move an application to a higher-priority
    status.

    Filters:
        from_date -> LoanApplication.applied_date >= from_date
        to_date   -> LoanApplication.applied_date <= to_date
        loan_type -> LoanApplication.loan_type_id == loan_type
    """

    # ---------------------------------------------------------
    # PERMISSION
    # ---------------------------------------------------------

    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="dashboard:conversion-funnel",
    ):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to the application funnel.",
        )

    # ---------------------------------------------------------
    # APPLICATION QUERY
    # ---------------------------------------------------------

    query = db.query(LoanApplication)

    # Apply the existing application visibility rules.
    query = AccessControl.apply_application_scope(
        query=query,
        db=db,
        employee=employee,
    )

    # Only active applications.
    query = query.filter(
        LoanApplication.deleted_at.is_(None)
    )

    # ---------------------------------------------------------
    # DATE FILTER
    # ---------------------------------------------------------

    if from_date:
        query = query.filter(
            LoanApplication.applied_date >= from_date
        )

    if to_date:
        query = query.filter(
            LoanApplication.applied_date <= to_date
        )

    # ---------------------------------------------------------
    # LOAN TYPE FILTER
    # ---------------------------------------------------------

    if loan_type:
        query = query.filter(
            LoanApplication.loan_type_id == loan_type
        )

    applications = query.all()

    # ---------------------------------------------------------
    # EMPTY RESPONSE
    # ---------------------------------------------------------

    if not applications:
        return {
            "data": [
                {
                    "status": status,
                    "count": 0,
                    "amount": 0,
                }
                for status in FUNNEL_STATUSES
            ],
            "totalApplications": 0,
            "totalAmount": 0,
            "filters": {
                "fromDate": (
                    from_date.isoformat()
                    if from_date
                    else None
                ),
                "toDate": (
                    to_date.isoformat()
                    if to_date
                    else None
                ),
                "loanType": loan_type,
            },
        }

    # ---------------------------------------------------------
    # BANK PROCESSINGS
    # ---------------------------------------------------------

    loan_ids = [
        application.id
        for application in applications
    ]

    bank_processings = (
        db.query(BankProcessing)
        .filter(
            BankProcessing.loan_id.in_(loan_ids),
            BankProcessing.deleted_at.is_(None),
        )
        .all()
    )

    bank_by_loan = defaultdict(list)

    for processing in bank_processings:
        bank_by_loan[processing.loan_id].append(
            processing
        )

    # ---------------------------------------------------------
    # INITIALIZE ALL FUNNEL STAGES
    # ---------------------------------------------------------

    funnel_data = {
        status: {
            "status": status,
            "count": 0,
            "amount": 0,
        }
        for status in FUNNEL_STATUSES
    }

    # ---------------------------------------------------------
    # PROCESS APPLICATIONS
    # ---------------------------------------------------------

    for application in applications:

        # -----------------------------------------------------
        # APPLICATION STATUS
        # -----------------------------------------------------

        application_status = (
            application.status.value
            if hasattr(application.status, "value")
            else str(application.status)
        )

        application_status = application_status.lower()

        current_priority = STATUS_PRIORITY.get(
            application_status,
            1,
        )

        current_status = application_status
        current_amount = (
            application.loan_amt or 0
        )

        # -----------------------------------------------------
        # FIND HIGHEST BANK STATUS
        # -----------------------------------------------------

        processings = bank_by_loan.get(
            application.id,
            []
        )

        highest_bank_processing = None
        highest_bank_priority = 0

        for processing in processings:

            processing_status = (
                processing.status.value
                if hasattr(processing.status, "value")
                else str(processing.status)
            )

            processing_status = (
                processing_status.lower()
            )

            bank_priority = BANK_STATUS_PRIORITY.get(
                processing_status,
                0,
            )

            if bank_priority > highest_bank_priority:
                highest_bank_priority = bank_priority
                highest_bank_processing = processing

        # -----------------------------------------------------
        # BANK PROCESSING STATUS
        # -----------------------------------------------------

        if highest_bank_processing:

            processing_status = (
                highest_bank_processing.status.value
                if hasattr(
                    highest_bank_processing.status,
                    "value",
                )
                else str(
                    highest_bank_processing.status
                )
            )

            processing_status = (
                processing_status.lower()
            )

            # Bank processing moves the application forward
            # when its status has equal or higher priority.
            if (
                highest_bank_priority >= current_priority
                and highest_bank_priority > 0
            ):
                current_status = processing_status

                # Amount is based on the actual stage.
                if current_status == "disbursed":
                    current_amount = (
                        highest_bank_processing.disbursement_amount
                        or highest_bank_processing.offered_amount
                        or application.loan_amt
                        or 0
                    )

                elif current_status in {
                    "sanctioned",
                    "login",
                    "rejected",
                }:
                    current_amount = (
                        highest_bank_processing.offered_amount
                        or application.loan_amt
                        or 0
                    )

        # -----------------------------------------------------
        # NORMALIZE STATUS
        # -----------------------------------------------------

        normalized_status = STATUS_LABELS.get(
            current_status,
            "In Process",
        )

        # -----------------------------------------------------
        # ADD TO FUNNEL STAGE
        # -----------------------------------------------------

        if normalized_status not in funnel_data:
            continue

        funnel_data[normalized_status]["count"] += 1

        funnel_data[normalized_status]["amount"] += (
            current_amount or 0
        )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    data = [
        funnel_data[status]
        for status in FUNNEL_STATUSES
    ]

    total_applications = sum(
        item["count"]
        for item in data
    )

    total_amount = sum(
        item["amount"]
        for item in data
    )

    return {
        "data": data,
        "totalApplications": total_applications,
        "totalAmount": total_amount,
        "filters": {
            "fromDate": (
                from_date.isoformat()
                if from_date
                else None
            ),
            "toDate": (
                to_date.isoformat()
                if to_date
                else None
            ),
            "loanType": loan_type,
        },
    }