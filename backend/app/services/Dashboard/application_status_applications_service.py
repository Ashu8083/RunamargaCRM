# backend/app/services/Dashboard/application_status_applications_service.py
from collections import defaultdict
from datetime import date, datetime, time, timedelta
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import (
    and_,
    cast,
    exists,
    func,
    not_,
    or_,
    String,
)
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.employee_contexts import EmployeeContext
from app.core.access_control import AccessControl
from app.models.loan_applications import LoanApplication
from app.models.bank_processings import BankProcessing
from app.models.reverted_loans import RevertedLoan
from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.services.Loans.application_service import ApplicationService


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

    # New filters
    search: Optional[str] = None,
    rm_id: Optional[int] = None,
    agent_id: Optional[int] = None,
    team_lead_id: Optional[int] = None,

    # Pagination
    page: int = 1,
    page_size: int = 10,
):
    # =====================================================
    # VALIDATE
    # =====================================================

    if context_id is None:
        raise HTTPException(
            status_code=400,
            detail="context_id is required.",
        )

    if page < 1:
        page = 1

    if page_size < 1:
        page_size = 10

    if page_size > 100:
        page_size = 100

    # =====================================================
    # EAGER LOADING
    # =====================================================

    query = (
        db.query(LoanApplication)
        .options(
            joinedload(
                LoanApplication.loan_type
            ),

            selectinload(
                LoanApplication.applied_by_context
            ).selectinload(
                EmployeeContext.employee
            ),

            selectinload(
                LoanApplication.agent_context
            ).selectinload(
                EmployeeContext.employee
            ),

            selectinload(
                LoanApplication.rm_context
            ).selectinload(
                EmployeeContext.employee
            ),
        )
    )

    # =====================================================
    # RBAC / DATA SCOPE
    # =====================================================

    query = ApplicationService.apply_scope(
        query=query,
        db=db,
        employee=employee,
        context_id=context_id,
    )

    query = query.filter(
        LoanApplication.deleted_at.is_(None)
    )

    # =====================================================
    # DATE RANGE
    # =====================================================

    if from_date is None and to_date is None:
        today = date.today()

        from_date = today.replace(
            day=1
        )

        to_date = today

    elif from_date is None:
        from_date = to_date.replace(
            day=1
        )

    elif to_date is None:
        to_date = date.today()

    if from_date > to_date:
        raise HTTPException(
            status_code=400,
            detail="from_date cannot be greater than to_date.",
        )

    to_date_exclusive = (
        to_date + timedelta(days=1)
    )

    from_datetime = datetime.combine(
        from_date,
        time.min,
    )

    to_datetime_exclusive = datetime.combine(
        to_date_exclusive,
        time.min,
    )

    # =====================================================
    # LOAN TYPE FILTER
    # =====================================================

    if loan_type_id:
        query = query.filter(
            LoanApplication.loan_type_id
            == loan_type_id
        )

    # =====================================================
    # DATE FILTER
    #
    # Preserve existing behavior:
    #
    # No status:
    #     use applied_date
    #
    # Status selected:
    #     status-specific date fields are checked below.
    # =====================================================

    if status is None:
        query = query.filter(
            LoanApplication.applied_date
            >= from_date,

            LoanApplication.applied_date
            < to_date_exclusive,
        )

    # =====================================================
    # SEARCH
    # =====================================================

    if search and search.strip():

        search_value = (
            f"%{search.strip()}%"
        )

        search_conditions = [

            LoanApplication.name.ilike(
                search_value
            ),

            LoanApplication.phone.ilike(
                search_value
            ),

            LoanApplication.email.ilike(
                search_value
            ),

            LoanApplication.unique_id.ilike(
                search_value
            ),

            cast(
                LoanApplication.id,
                String,
            ).ilike(
                search_value
            ),

            # Agent name
            LoanApplication.agent_context.has(
                EmployeeContext.employee.has(
                    Employee.name.ilike(
                        search_value
                    )
                )
            ),
        ]

        query = query.filter(
            or_(
                *search_conditions
            )
        )

    # =====================================================
    # RM FILTER
    #
    # rm_id is EmployeeContext.id.
    # =====================================================

    if rm_id:

        query = query.filter(
            LoanApplication.rm_context.has(
                EmployeeContext.id == rm_id
            )
        )

    # =====================================================
    # AGENT FILTER
    #
    # agent_id is EmployeeContext.id.
    # =====================================================

    if agent_id:

        query = query.filter(
            LoanApplication.agent_context.has(
                EmployeeContext.id == agent_id
            )
        )

    # =====================================================
    # TEAM LEAD FILTER
    #
    # RM EmployeeContext
    #        ↓
    # reports_to_id
    #        ↓
    # Team Lead EmployeeContext
    # =====================================================

    if team_lead_id:

        query = query.filter(
            LoanApplication.rm_context.has(
                EmployeeContext.reports_to_id
                == team_lead_id
            )
        )

    # =====================================================
    # STATUS SQL HELPERS
    # =====================================================

    loan_status_text = func.lower(
        cast(
            LoanApplication.status,
            String,
        )
    )

    bank_status_text = func.lower(
        cast(
            BankProcessing.status,
            String,
        )
    )

    # =====================================================
    # IN PROCESS
    # =====================================================

    if status == "In Process":

        progressed_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text.in_(
                    [
                        "login",
                        "sanctioned",
                        "disbursed",
                    ]
                ),
            )
        )

        inprocess_condition = or_(

            and_(
                loan_status_text
                == "inprocess",

                LoanApplication.applied_date
                >= from_date,

                LoanApplication.applied_date
                < to_date_exclusive,
            ),

            and_(
                loan_status_text
                == "docspending",

                LoanApplication.docspending_date
                >= from_date,

                LoanApplication.docspending_date
                < to_date_exclusive,
            ),
        )

        query = query.filter(

            inprocess_condition,

            not_(
                progressed_exists
            ),
        )

    # =====================================================
    # REJECTED
    # =====================================================

    elif status == "Rejected":

        query = query.filter(

            loan_status_text.in_(
                [
                    "rejected",
                    "revert_rejected",
                ]
            ),

            LoanApplication.rejection_date
            >= from_date,

            LoanApplication.rejection_date
            < to_date_exclusive,
        )

    # =====================================================
    # LOGIN
    # =====================================================

    elif status == "Login":

        login_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                BankProcessing.loggedin_at
                >= from_datetime,

                BankProcessing.loggedin_at
                < to_datetime_exclusive,
            )
        )

        query = query.filter(

            not_(
                loan_status_text.in_(
                    [
                        "rejected",
                        "revert_rejected",
                    ]
                )
            ),

            login_exists,
        )

    # =====================================================
    # SANCTIONED
    # =====================================================

    elif status == "Sanctioned":

        sanctioned_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text
                == "sanctioned",

                BankProcessing.sanctioned_at
                >= from_datetime,

                BankProcessing.sanctioned_at
                < to_datetime_exclusive,
            )
        )

        query = query.filter(
            sanctioned_exists
        )

    # =====================================================
    # DISBURSED
    # =====================================================

    elif status == "Disbursed":

        disbursed_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text
                == "disbursed",

                BankProcessing.disbursed_at
                >= from_datetime,

                BankProcessing.disbursed_at
                < to_datetime_exclusive,
            )
        )

        query = query.filter(
            disbursed_exists
        )

    # =====================================================
    # PENDING
    #
    # Final dashboard status must be:
    #
    #     In Process
    #     Login
    #     Sanctioned
    #
    # Disbursed has highest priority, so it is excluded.
    # =====================================================

    elif status == "Pending":

        disbursed_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text
                == "disbursed",
            )
        )

        sanctioned_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text
                == "sanctioned",
            )
        )

        login_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text
                == "login",
            )
        )

        rejected_processing_exists = exists().where(
            and_(
                BankProcessing.loan_id
                == LoanApplication.id,

                BankProcessing.deleted_at.is_(None),

                bank_status_text.in_(
                    [
                        "rejected",
                        "revert_rejected",
                    ]
                ),
            )
        )

        inprocess_condition = or_(

            and_(
                loan_status_text
                == "inprocess",

                LoanApplication.applied_date
                >= from_date,

                LoanApplication.applied_date
                < to_date_exclusive,
            ),

            and_(
                loan_status_text
                == "docspending",

                LoanApplication.docspending_date
                >= from_date,

                LoanApplication.docspending_date
                < to_date_exclusive,
            ),
        )

        base_login_or_sanctioned = (
            loan_status_text.in_(
                [
                    "login",
                    "sanctioned",
                ]
            )
        )

        pending_condition = or_(

            sanctioned_exists,

            login_exists,

            base_login_or_sanctioned,

            and_(
                inprocess_condition,

                not_(
                    login_exists
                ),

                not_(
                    sanctioned_exists
                ),

                not_(
                    rejected_processing_exists
                ),
            ),
        )

        query = query.filter(

            not_(
                disbursed_exists
            ),

            pending_condition,
        )

    # =====================================================
    # COUNT
    #
    # IMPORTANT:
    # Count happens BEFORE pagination.
    #
    # This gives:
    #
    # count = 650
    # page_size = 10
    # total_pages = 65
    # =====================================================

    total_count = (
        query
        .order_by(None)
        .with_entities(
            func.count(
                func.distinct(
                    LoanApplication.id
                )
            )
        )
        .scalar()
        or 0
    )

    # =====================================================
    # PAGINATION
    # =====================================================

    offset = (
        (page - 1)
        * page_size
    )

    applications = (
        query
        .order_by(
            LoanApplication.id.desc()
        )
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # =====================================================
    # NO RESULTS
    # =====================================================

    if not applications:

        total_pages = (
            (
                total_count
                + page_size
                - 1
            )
            // page_size
            if total_count
            else 0
        )

        return {
            "success": True,
            "count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "data": [],
        }

    # =====================================================
    # ONLY CURRENT PAGE IDS
    # =====================================================

    loan_ids = [
        application.id
        for application in applications
    ]

    # =====================================================
    # BATCH: BANK PROCESSINGS
    #
    # BEFORE:
    #
    #     ALL applications
    #         ↓
    #     ALL bank processings
    #
    # NOW:
    #
    #     10 applications
    #         ↓
    #     bank processing only for those 10
    # =====================================================

    bank_processings = (
        db.query(
            BankProcessing
        )
        .filter(

            BankProcessing.loan_id.in_(
                loan_ids
            ),

            BankProcessing.deleted_at.is_(None),
        )
        .all()
    )

    processing_by_loan = (
        defaultdict(list)
    )

    for processing in bank_processings:

        if not processing.loan_id:
            continue

        processing_by_loan[
            processing.loan_id
        ].append(
            processing
        )

    # =====================================================
    # BATCH: LATEST REVERT PER LOAN
    # =====================================================

    latest_revert_subq = (
        db.query(

            RevertedLoan.loan_id.label(
                "loan_id"
            ),

            func.max(
                RevertedLoan.reverted_at
            ).label(
                "max_reverted_at"
            ),
        )
        .filter(

            RevertedLoan.loan_id.in_(
                loan_ids
            ),

            RevertedLoan.deleted_at.is_(None),
        )
        .group_by(
            RevertedLoan.loan_id
        )
        .subquery()
    )

    latest_reverts = (
        db.query(
            RevertedLoan
        )
        .join(

            latest_revert_subq,

            (
                RevertedLoan.loan_id
                == latest_revert_subq.c.loan_id
            )

            &

            (
                RevertedLoan.reverted_at
                == latest_revert_subq.c.max_reverted_at
            ),
        )
        .filter(
            RevertedLoan.deleted_at.is_(None)
        )
        .all()
    )

    latest_revert_map = {
        revert.loan_id: revert
        for revert in latest_reverts
    }

    # =====================================================
    # BUILD RESULT
    # =====================================================

    data = []

    for application in applications:

        # -------------------------------------------------
        # STATUS
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

        selected_priority = (
            STATUS_PRIORITY.get(
                loan_status,
                0,
            )
        )

        selected_processing = None

        loan_processings = (
            processing_by_loan.get(
                application.id,
                [],
            )
        )

        # -------------------------------------------------
        # IN PROCESS
        # -------------------------------------------------

        if status == "In Process":

            if loan_status == "inprocess":

                if not (
                    application.applied_date
                    and from_date
                    <= application.applied_date
                    < to_date_exclusive
                ):
                    continue

            elif loan_status == "docspending":

                if not (
                    application.docspending_date
                    and from_date
                    <= application.docspending_date
                    < to_date_exclusive
                ):
                    continue

            else:
                continue

            progressed = False

            for processing in loan_processings:

                bank_status = (
                    processing.status
                    or ""
                ).lower().strip()

                if bank_status in {
                    "login",
                    "sanctioned",
                    "disbursed",
                }:
                    progressed = True
                    break

            if progressed:
                continue

            selected_status = loan_status

        # -------------------------------------------------
        # REJECTED
        # -------------------------------------------------

        elif status == "Rejected":

            if loan_status not in {
                "rejected",
                "revert_rejected",
            }:
                continue

            if not (
                application.rejection_date
                and from_date
                <= application.rejection_date
                < to_date_exclusive
            ):
                continue

            selected_status = loan_status

        # -------------------------------------------------
        # LOGIN
        # -------------------------------------------------

        elif status == "Login":

            if loan_status in {
                "rejected",
                "revert_rejected",
            }:
                continue

            login_processings = [

                processing

                for processing in loan_processings

                if processing.loggedin_at

                and from_datetime
                <= processing.loggedin_at
                < to_datetime_exclusive
            ]

            if not login_processings:
                continue

            selected_processing = max(

                login_processings,

                key=lambda processing: (
                    processing.loggedin_at,
                    processing.id,
                ),
            )

            selected_status = "login"

        # -------------------------------------------------
        # SANCTIONED
        # -------------------------------------------------

        elif status == "Sanctioned":

            sanctioned_processings = [

                processing

                for processing in loan_processings

                if (
                    processing.status
                    or ""
                ).lower().strip()
                == "sanctioned"

                and processing.sanctioned_at

                and from_datetime
                <= processing.sanctioned_at
                < to_datetime_exclusive
            ]

            if not sanctioned_processings:
                continue

            selected_processing = max(

                sanctioned_processings,

                key=lambda processing: (
                    processing.sanctioned_at,
                    processing.id,
                ),
            )

            selected_status = "sanctioned"

        # -------------------------------------------------
        # DISBURSED
        # -------------------------------------------------

        elif status == "Disbursed":

            disbursed_processings = [

                processing

                for processing in loan_processings

                if (
                    processing.status
                    or ""
                ).lower().strip()
                == "disbursed"

                and processing.disbursed_at

                and from_datetime
                <= processing.disbursed_at
                < to_datetime_exclusive
            ]

            if not disbursed_processings:
                continue

            selected_processing = max(

                disbursed_processings,

                key=lambda processing: (
                    processing.disbursed_at,
                    processing.id,
                ),
            )

            selected_status = "disbursed"

        # -------------------------------------------------
        # NORMAL / PENDING
        # -------------------------------------------------

        else:

            for processing in loan_processings:

                bank_status = (
                    processing.status
                    or ""
                ).lower().strip()

                bank_priority = (
                    BANK_STATUS_PRIORITY.get(
                        bank_status,
                        0,
                    )
                )

                if (
                    bank_priority
                    > selected_priority
                ):

                    selected_priority = (
                        bank_priority
                    )

                    selected_status = (
                        bank_status
                    )

                    selected_processing = (
                        processing
                    )

        # -------------------------------------------------
        # NORMALIZE
        # -------------------------------------------------

        if (
            selected_status
            not in STATUS_LABELS
        ):
            continue

        dashboard_status = (
            STATUS_LABELS[
                selected_status
            ]
        )

        if status:

            if status == "Pending":

                if (
                    dashboard_status
                    not in PENDING_STATUSES
                ):
                    continue

            elif (
                dashboard_status
                != status
            ):
                continue

        # -------------------------------------------------
        # AMOUNT
        # -------------------------------------------------

        loan_amount = float(
            application.loan_amt
            or 0
        )

        amount = loan_amount

        if selected_processing:

            if (
                selected_status
                == "disbursed"
            ):

                amount = float(
                    selected_processing
                    .disbursement_amount
                    or 0
                )

            elif selected_status in {
                "sanctioned",
                "login",
                "rejected",
            }:

                amount = float(
                    selected_processing
                    .offered_amount
                    or application.loan_amt
                    or 0
                )

        # -------------------------------------------------
        # LOOKUPS
        # -------------------------------------------------

        latest_revert = (
            latest_revert_map.get(
                application.id
            )
        )

        loan_type_name = (

            application.loan_type.name

            if application.loan_type

            else None
        )

        applied_by_employee = (

            application
            .applied_by_context
            .employee

            if (
                application.applied_by_context
                and
                application
                .applied_by_context
                .employee
            )

            else None
        )

        agent_employee = (

            application
            .agent_context
            .employee

            if (
                application.agent_context
                and
                application
                .agent_context
                .employee
            )

            else None
        )

        rm_employee = (

            application
            .rm_context
            .employee

            if (
                application.rm_context
                and
                application
                .rm_context
                .employee
            )

            else None
        )

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        data.append(
            {
                "id": application.id,

                "unique_id":
                    application.unique_id,

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

                "team_lead_id": (
                    application
                    .rm_context
                    .reports_to_id
                    if application.rm_context
                    else None
                ),

                "applied_by": (

                    {
                        "id":
                            applied_by_employee.id,

                        "name":
                            applied_by_employee.name,
                    }

                    if applied_by_employee

                    else None
                ),

                "agent": (

                    {
                        "id":
                            agent_employee.id,

                        "name":
                            agent_employee.name,
                    }

                    if agent_employee

                    else None
                ),

                "rm": (

                    {
                        "id":
                            rm_employee.id,

                        "name":
                            rm_employee.name,
                    }

                    if rm_employee

                    else None
                ),

                "status":
                    dashboard_status,

                "applied_date":
                    application.applied_date,

                "sanction_date":
                    application.sanction_date,

                "loggedin_date":
                    application.loggedin_date,

                "docspending_date":
                    application.docspending_date,

                "rejection_date":
                    application.rejection_date,

                "rejected_remarks":
                    application.rejected_remarks,

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

                "state_id":
                    application.state_id,

                "city_id":
                    application.city_id,

                "language_id":
                    application.language_id,

                "ivr_id":
                    application.ivr_id,

                "created_at":
                    application.created_at,

                "updated_at":
                    application.updated_at,
            }
        )

    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    total_pages = (
        (
            total_count
            + page_size
            - 1
        )
        // page_size

        if total_count

        else 0
    )

    return {
        "success": True,
        "count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "data": data,
    }