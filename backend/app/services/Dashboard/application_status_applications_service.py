# backend/app/services/Dashboard/application_status_applications_service.py

from collections import defaultdict
from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing
from app.models.reverted_loans import RevertedLoan
from app.models.loan_types import LoanType
from app.models.employees import Employee


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
# STATUS LABELS
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
# BANK PROCESSING PRIORITY
# =========================================================

BANK_STATUS_PRIORITY = {
    "rejected": 2,
    "login": 3,
    "sanctioned": 4,
    "disbursed": 5,
}


# =========================================================
# PENDING STATUSES
# =========================================================

PENDING_STATUSES = {
    "In Process",
    "Login",
    "Sanctioned",
}


# =========================================================
# GET APPLICATION STATUS APPLICATIONS
# =========================================================

def get_application_status_applications(
    db: Session,
    employee: Employee,
    context_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    loan_type_id: Optional[int] = None,
    status: Optional[str] = None,
):
    """
    Get the actual applications represented by the
    Application Status dashboard.

    The status calculation is intentionally kept consistent
    with application_status_service.py.

    Each application appears only once.

    BankProcessing can move an application to a
    higher-priority status.
    """

    # =====================================================
    # GET APPLICATIONS WITH ACCESS SCOPE
    # =====================================================

    query = db.query(LoanApplication)

    if context_id is None:
        raise HTTPException(
            status_code=400,
            detail="context_id is required.",
        )

    query = AccessControl.apply_application_scope(
        query=query,
        db=db,
        employee=employee,
        context_id=context_id,
    )

    query = query.filter(
        LoanApplication.deleted_at.is_(None)
    )

    # =====================================================
    # DATE FILTER
    # =====================================================

    if from_date:

        query = query.filter(
            LoanApplication.applied_date >= from_date
        )

    if to_date:

        query = query.filter(
            LoanApplication.applied_date <= to_date
        )

    # =====================================================
    # LOAN TYPE FILTER
    # =====================================================

    if loan_type_id:

        query = query.filter(
            LoanApplication.loan_type_id == loan_type_id
        )

    # =====================================================
    # GET APPLICATIONS
    # =====================================================

    applications = (
        query
        .order_by(
            LoanApplication.id.desc()
        )
        .all()
    )

    if not applications:

        return {
            "success": True,
            "count": 0,
            "data": [],
        }

    # =====================================================
    # GET BANK PROCESSINGS
    # =====================================================

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

    # =====================================================
    # GROUP BANK PROCESSINGS
    # =====================================================

    processing_by_loan = defaultdict(list)

    for processing in bank_processings:

        if not processing.loan_id:
            continue

        processing_by_loan[
            processing.loan_id
        ].append(processing)

    # =====================================================
    # BUILD RESULT
    # =====================================================

    data = []

    for application in applications:

        # -------------------------------------------------
        # APPLICATION STATUS
        # -------------------------------------------------

        loan_status = (
            application.status.value
            if application.status
            else None
        )

        if loan_status:
            loan_status = (
                loan_status
                .lower()
                .strip()
            )

        selected_status = loan_status

        selected_priority = STATUS_PRIORITY.get(
            loan_status,
            0,
        )

        selected_processing = None

        # -------------------------------------------------
        # CHECK BANK PROCESSINGS
        # -------------------------------------------------

        loan_processings = (
            processing_by_loan.get(
                application.id,
                [],
            )
        )

        for processing in loan_processings:

            bank_status = (
                processing.status or ""
            )

            bank_status = (
                bank_status
                .lower()
                .strip()
            )

            bank_priority = BANK_STATUS_PRIORITY.get(
                bank_status,
                0,
            )

            if bank_priority > selected_priority:

                selected_priority = bank_priority
                selected_status = bank_status
                selected_processing = processing

        # -------------------------------------------------
        # NORMALIZE STATUS
        # -------------------------------------------------

        if selected_status not in STATUS_LABELS:
            continue

        dashboard_status = STATUS_LABELS[
            selected_status
        ]

        # =================================================
        # STATUS FILTER
        # =================================================

        if status:

            if status == "Pending":

                if dashboard_status not in PENDING_STATUSES:
                    continue

            elif dashboard_status != status:

                continue

        # =================================================
        # AMOUNT
        # =================================================

        loan_amount = float(
            application.loan_amt or 0
        )

        amount = loan_amount

        if selected_processing:

            if selected_status == "disbursed":

                amount = float(
                    selected_processing.disbursement_amount
                    or selected_processing.offered_amount
                    or application.loan_amt
                    or 0
                )

            elif selected_status in {
                "sanctioned",
                "login",
                "rejected",
            }:

                amount = float(
                    selected_processing.offered_amount
                    or application.loan_amt
                    or 0
                )

        # =================================================
        # LATEST REVERT
        # =================================================

        latest_revert = (
            db.query(RevertedLoan)
            .filter(
                RevertedLoan.loan_id == application.id,
                RevertedLoan.deleted_at.is_(None),
            )
            .order_by(
                RevertedLoan.reverted_at.desc(),
                RevertedLoan.id.desc(),
            )
            .first()
        )

        # =================================================
        # LOAN TYPE
        # =================================================

        loan_type_name = None

        if application.loan_type_id:

            loan_type = (
                db.query(LoanType)
                .filter(
                    LoanType.id
                    == application.loan_type_id
                )
                .first()
            )

            if loan_type:
                loan_type_name = loan_type.name

        # =================================================
        # ASSIGNMENTS
        # =================================================

        # The database now stores ownership using
        # EmployeeContext IDs.
        #
        # The API response continues exposing Employee IDs
        # for frontend compatibility.

        applied_by_employee = None
        agent_employee = None
        rm_employee = None

        # -------------------------------------------------
        # APPLIED BY
        # -------------------------------------------------

        if (
            application.applied_by_context
            and application.applied_by_context.employee
        ):
            applied_by_employee = (
                application.applied_by_context.employee
            )

        # -------------------------------------------------
        # AGENT
        # -------------------------------------------------

        if (
            application.agent_context
            and application.agent_context.employee
        ):
            agent_employee = (
                application.agent_context.employee
            )

        # -------------------------------------------------
        # RM
        # -------------------------------------------------

        if (
            application.rm_context
            and application.rm_context.employee
        ):
            rm_employee = (
                application.rm_context.employee
            )

        # =================================================
        # RESPONSE
        # =================================================

        data.append({

            "id":
                application.id,

            "unique_id":
                application.unique_id,

            # -------------------------------------------------
            # CUSTOMER
            # -------------------------------------------------

            "name":
                application.name,

            "email":
                application.email,

            "phone":
                application.phone,

            "alternate_phone":
                application.alternate_phone,

            "alternate_email":
                application.alternate_email,

            # -------------------------------------------------
            # LOAN
            # -------------------------------------------------

            "loan_type_id":
                application.loan_type_id,

            "loan_type":
                loan_type_name,

            "loan_amt":
                application.loan_amt,

            "display_amount":
                amount,

            "loan_tenure":
                application.loan_tenure,

            "loan_purpose":
                application.loan_purpose,

            "credit_score":
                application.credit_score,

            "referral":
                application.referral,

            # -------------------------------------------------
            # ASSIGNMENTS
            # -------------------------------------------------
            #
            # IMPORTANT:
            #
            # These are EMPLOYEE IDs in the API response.
            #
            # The database stores:
            #
            # applied_by_context_id
            # agent_context_id
            # rm_context_id
            #
            # -------------------------------------------------

            "applied_by_id": (
                applied_by_employee.id
                if applied_by_employee
                else None
            ),

            "agent_id": (
                agent_employee.id
                if agent_employee
                else None
            ),

            "rm_id": (
                rm_employee.id
                if rm_employee
                else None
            ),

            # -------------------------------------------------
            # APPLIED BY
            # -------------------------------------------------

            "applied_by": (
                {
                    "id": applied_by_employee.id,
                    "name": applied_by_employee.name,
                }
                if applied_by_employee
                else None
            ),

            # -------------------------------------------------
            # AGENT
            # -------------------------------------------------

            "agent": (
                {
                    "id": agent_employee.id,
                    "name": agent_employee.name,
                }
                if agent_employee
                else None
            ),

            # -------------------------------------------------
            # RM
            # -------------------------------------------------

            "rm": (
                {
                    "id": rm_employee.id,
                    "name": rm_employee.name,
                }
                if rm_employee
                else None
            ),

            # -------------------------------------------------
            # DASHBOARD STATUS
            # -------------------------------------------------

            "status":
                dashboard_status,

            # -------------------------------------------------
            # DATES
            # -------------------------------------------------

            "applied_date":
                application.applied_date,

            "sanction_date":
                application.sanction_date,

            "loggedin_date":
                application.loggedin_date,

            "docspending_date":
                application.docspending_date,

            # -------------------------------------------------
            # REJECTION
            # -------------------------------------------------

            "rejection_date":
                application.rejection_date,

            "rejected_remarks":
                application.rejected_remarks,

            # -------------------------------------------------
            # REVERT
            # -------------------------------------------------

            "reverted_status":
                application.reverted_status,

            "reverted_reason": (
                latest_revert.remarks
                if latest_revert
                else None
            ),

            "reverted_date": (
                latest_revert.reverted_at
                if latest_revert
                else None
            ),

            "reverted_by_name": (
                latest_revert.reverted_by_name
                if latest_revert
                else None
            ),

            "reverted_by_role": (
                latest_revert.reverted_by_role
                if latest_revert
                else None
            ),

            # -------------------------------------------------
            # LOCATION / OTHER
            # -------------------------------------------------

            "state_id":
                application.state_id,

            "city_id":
                application.city_id,

            "language_id":
                application.language_id,

            "ivr_id":
                application.ivr_id,

            # -------------------------------------------------
            # TIMESTAMPS
            # -------------------------------------------------

            "created_at":
                application.created_at,

            "updated_at":
                application.updated_at,
        })

    # =====================================================
    # RETURN
    # =====================================================

    return {
        "success": True,
        "count": len(data),
        "data": data,
    }