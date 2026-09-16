
# backend/app/services/Dashboard/loan_type_distribution_service.py
from collections import defaultdict
from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing
from app.models.loan_types import LoanType


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


def get_loan_type_distribution(
    db: Session,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    status: str = "In Process",
):
    """
    Return loan-type-wise application count and amount
    for the selected application status.

    Each loan application is counted only once.

    If an application has bank-processing records, the highest
    priority bank status is used when it is higher than the
    application status.
    """

    # ---------------------------------------------------------
    # APPLICATIONS
    # ---------------------------------------------------------

    query = db.query(LoanApplication).filter(
        LoanApplication.deleted_at.is_(None)
    )   

    if from_date:
        query = query.filter(
            LoanApplication.applied_date >= from_date
        )

    if to_date:
        query = query.filter(
            LoanApplication.applied_date <= to_date
        )

    applications = query.all()

    if not applications:
        return {
            "data": [],
            "totalApplications": 0,
            "totalAmount": 0,
            "status": status,
            "dateRange": {
                "fromDate": from_date.isoformat() if from_date else None,
                "toDate": to_date.isoformat() if to_date else None,
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
            BankProcessing.loan_id.in_(loan_ids)
        )
        .all()
    )

    bank_by_loan = defaultdict(list)

    for processing in bank_processings:
        bank_by_loan[processing.loan_id].append(processing)

    # ---------------------------------------------------------
    # LOAN TYPES
    # ---------------------------------------------------------

    loan_type_ids = {
        application.loan_type_id
        for application in applications
        if application.loan_type_id is not None
    }

    loan_types = (
        db.query(LoanType)
        .filter(
            LoanType.id.in_(loan_type_ids)
        )
        .all()
        if loan_type_ids
        else []
    )

    loan_type_map = {
        loan_type.id: loan_type.name
        for loan_type in loan_types
    }

    # ---------------------------------------------------------
    # NORMALIZE SELECTED STATUS
    # ---------------------------------------------------------

    selected_status = status.strip().lower()

    status_aliases = {
        "in process": "inprocess",
        "login": "login",
        "sanctioned": "sanctioned",
        "disbursed": "disbursed",
        "rejected": "rejected",
    }

    selected_status_key = status_aliases.get(
        selected_status,
        "inprocess",
    )

    # ---------------------------------------------------------
    # GROUP DATA
    # ---------------------------------------------------------

    grouped_data = {}

    for application in applications:

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
        current_amount = application.loan_amt or 0

        # -----------------------------------------------------
        # CHECK BANK PROCESSING STATUS
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

            processing_status = processing_status.lower()

            bank_priority = BANK_STATUS_PRIORITY.get(
                processing_status,
                0,
            )

            if bank_priority > highest_bank_priority:
                highest_bank_priority = bank_priority
                highest_bank_processing = processing

        # -----------------------------------------------------
        # BANK STATUS OVERRIDES APPLICATION STATUS
        # -----------------------------------------------------

        if (
            highest_bank_processing
            and highest_bank_priority > current_priority
        ):
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

            current_status = processing_status.lower()

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
        # NORMALIZE STATUS FOR RESPONSE
        # -----------------------------------------------------

        normalized_status = STATUS_LABELS.get(
            current_status,
            "In Process",
        )

        # -----------------------------------------------------
        # ONLY SELECTED STATUS
        # -----------------------------------------------------

        if normalized_status != STATUS_LABELS.get(
            selected_status_key,
            "In Process",
        ):
            continue

        # -----------------------------------------------------
        # LOAN TYPE
        # -----------------------------------------------------

        loan_type_name = loan_type_map.get(
            application.loan_type_id,
            "Unknown",
        )

        if loan_type_name not in grouped_data:
            grouped_data[loan_type_name] = {
                "loanType": loan_type_name,
                "count": 0,
                "amount": 0,
            }

        grouped_data[loan_type_name]["count"] += 1
        grouped_data[loan_type_name]["amount"] += (
            current_amount or 0
        )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    data = list(grouped_data.values())

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
        "status": STATUS_LABELS.get(
            selected_status_key,
            "In Process",
        ),
        "dateRange": {
            "fromDate": from_date.isoformat() if from_date else None,
            "toDate": to_date.isoformat() if to_date else None,
        },
    }