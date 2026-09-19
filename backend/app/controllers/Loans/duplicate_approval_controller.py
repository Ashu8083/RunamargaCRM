# app/controllers/Loans/duplicate_approval_controller.py

from datetime import date, datetime

from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl

from app.models.duplicate_approvals import (
    DuplicateApproval,
    DuplicateApprovalStatus,
)

from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.loan_applications import (
    LoanApplication,
    LoanStatus,
)

from app.schemas.duplicate_approval_schema import (
    DuplicateApprovalCreateRequest,
)


# =========================================================
# GET DUPLICATE APPROVALS
# =========================================================

def get_duplicate_approvals(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    status: str | None = None,
    search: str | None = None,
    loan_type_id: int | None = None,
    applied_by_id: int | None = None,
):
    """
    Get duplicate approval requests.

    context_id refers to EmployeeContext.id.
    applied_by_id remains an employee ID at the API level
    and is resolved to the employee's active AGENT context.
    """

    # ---------------------------------------------------------
    # BASE QUERY
    # ---------------------------------------------------------

    query = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.deleted_at.is_(None)
        )
    )

    # =========================================================
    # CONTEXT ACCESS
    # =========================================================

    query = AccessControl.apply_duplicate_approval_scope(
        query=query,
        db=db,
        employee=employee,
        context_id=context_id,
    )


    # ---------------------------------------------------------
    # STATUS FILTER
    # ---------------------------------------------------------

    if status:

        try:
            status_enum = DuplicateApprovalStatus(status)

        except ValueError:
            return []

        query = query.filter(
            DuplicateApproval.status == status_enum
        )

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------

    if search:

        search_value = (
            f"%{search.strip()}%"
        )

        query = query.filter(
            or_(
                DuplicateApproval.name.ilike(
                    search_value
                ),

                DuplicateApproval.phone.ilike(
                    search_value
                ),
            )
        )

    # ---------------------------------------------------------
    # LOAN TYPE
    # ---------------------------------------------------------

    if loan_type_id:

        query = query.filter(
            DuplicateApproval.loan_type_id
            == loan_type_id
        )

    # ---------------------------------------------------------
    # APPLIED BY
    # ---------------------------------------------------------

    if applied_by_id:

        applied_by_context = (
            db.query(EmployeeContext)
            .join(
                Context,
                Context.id
                == EmployeeContext.context_id,
            )
            .filter(
                EmployeeContext.id
                == applied_by_id,

                EmployeeContext.is_active.is_(True),

                Context.code == "AGENT",
            )
            .first()
        )

        if applied_by_context:

            query = query.filter(
                DuplicateApproval.applied_by_context_id
                == applied_by_context.id
            )

        else:

            query = query.filter(False)

    # ---------------------------------------------------------
    # ORDER
    # ---------------------------------------------------------

    approvals = (
        query
        .order_by(
            DuplicateApproval.applied_date.desc(),
            DuplicateApproval.id.desc(),
        )
        .all()
    )

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    result = []

    for approval in approvals:

        # -----------------------------------------------------
        # LOAN TYPE
        # -----------------------------------------------------

        loan_type_name = None

        if approval.loan_type_id:

            loan_type = (
                db.query(LoanType)
                .filter(
                    LoanType.id
                    == approval.loan_type_id
                )
                .first()
            )

            if loan_type:

                loan_type_name = (
                    getattr(
                        loan_type,
                        "name",
                        None,
                    )
                    or getattr(
                        loan_type,
                        "loan_type",
                        None,
                    )
                    or getattr(
                        loan_type,
                        "title",
                        None,
                    )
                )

        # -----------------------------------------------------
        # APPLIED BY
        # -----------------------------------------------------

        applied_by_name = None
        applied_by_employee_id = None

        if approval.applied_by_context:

            if approval.applied_by_context.employee:

                applied_by_name = (
                    approval
                    .applied_by_context
                    .employee
                    .name
                )

                applied_by_employee_id = (
                    approval
                    .applied_by_context
                    .employee
                    .id
                )

        # -----------------------------------------------------
        # APPROVED BY
        # -----------------------------------------------------

        approved_by_name = None

        if approval.approved_by:

            approved_by_name = (
                approval.approved_by.name
            )

        # -----------------------------------------------------
        # RM
        # -----------------------------------------------------

        rm_name = None
        rm_employee_id = None

        if approval.rm_context:

            if approval.rm_context.employee:

                rm_name = (
                    approval
                    .rm_context
                    .employee
                    .name
                )

                rm_employee_id = (
                    approval
                    .rm_context
                    .employee
                    .id
                )

        # -----------------------------------------------------
        # RESPONSE
        # -----------------------------------------------------

        result.append(
            {
                "id": approval.id,

                "applicantName":
                    approval.name,

                "name":
                    approval.name,

                "phone":
                    approval.phone,

                "loanType":
                    loan_type_name,

                "loan_type":
                    loan_type_name,

                "loan_type_id":
                    approval.loan_type_id,

                "loanAmount":
                    float(approval.loan_amt)
                    if approval.loan_amt is not None
                    else None,

                "loan_amount":
                    float(approval.loan_amt)
                    if approval.loan_amt is not None
                    else None,

                "loan_purpose":
                    approval.loan_purpose,

                "reference_name":
                    approval.referral,

                "appliedBy":
                    applied_by_name,

                "applied_by":
                    applied_by_name,

                # API continues exposing employee ID
                # for frontend compatibility.
                "applied_by_id":
                    applied_by_employee_id,

                "rm_id":
                    rm_employee_id,

                "rmName":
                    rm_name,

                "rm_name":
                    rm_name,

                "status":
                    approval.status.value
                    if approval.status
                    else None,

                "appliedDate":
                    approval.applied_date,

                "applied_date":
                    approval.applied_date,

                "approvedDate":
                    approval.approved_at,

                "approved_date":
                    approval.approved_at,

                "approved_by_id":
                    approval.approved_by_id,

                "approved_by":
                    approved_by_name,

                "rejectedDate":
                    approval.approved_at
                    if approval.status
                    == DuplicateApprovalStatus.rejected
                    else None,

                "rejected_date":
                    approval.approved_at
                    if approval.status
                    == DuplicateApprovalStatus.rejected
                    else None,

                "rejected_remarks":
                    approval.rejected_remarks,

                "loanId":
                    approval.loan_id,

                "loan_id":
                    approval.loan_id,
            }
        )

    return result


# =========================================================
# CREATE DUPLICATE APPROVAL
# =========================================================

def create_duplicate_approval(
    db: Session,
    employee: Employee,
    payload: DuplicateApprovalCreateRequest,
    context_id: int | None = None,
):
    """
    Create a duplicate approval request.

    Ownership is stored using EmployeeContext IDs.
    """

    # =========================================================
    # CONTEXT ACCESS
    # =========================================================

    active_context = AccessControl.get_active_context(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    if not active_context:
        raise HTTPException(
            status_code=403,
            detail="Invalid or inactive employee context.",
        )

    # Make sure this duplicate approval is visible
    # to the active employee context.
    approval_query = db.query(DuplicateApproval).filter(
        DuplicateApproval.id == duplicate_approval_id
    )

    approval_query = AccessControl.apply_duplicate_approval_scope(
        query=approval_query,
        db=db,
        employee=employee,
        context_id=active_context.id,
    )

    duplicate_approval = approval_query.first()

    if not duplicate_approval:
        raise HTTPException(
            status_code=404,
            detail="Duplicate approval not found.",
        )

    # ---------------------------------------------------------
    # VALIDATE RM
    # ---------------------------------------------------------

    rm_context = None

    if payload.rm_id is not None:
        rm_context = (
            db.query(EmployeeContext)
            .join(
                Employee,
                Employee.id == EmployeeContext.employee_id,
            )
            .join(
                Context,
                Context.id == EmployeeContext.context_id,
            )
            .filter(
                EmployeeContext.id == payload.rm_id,
                EmployeeContext.is_active.is_(True),
                Employee.status == "active",
                Employee.deleted_at.is_(None),
                Context.is_active.is_(True),
                Context.code == "RM",
            )
            .first()
        )

        if not rm_context:
            raise HTTPException(
                status_code=404,
                detail="Relationship Manager context not found",
            )

    # ---------------------------------------------------------
    # PREVENT DUPLICATE PENDING REQUEST
    # ---------------------------------------------------------

    existing_request = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.phone
            == payload.phone,

            DuplicateApproval.status
            == DuplicateApprovalStatus.pending,

            DuplicateApproval.deleted_at.is_(None),
        )
        .first()
    )

    if existing_request:

        raise HTTPException(
            status_code=409,
            detail=(
                "Approval request already exists "
                "for this phone number."
            ),
        )

    # ---------------------------------------------------------
    # CREATE APPROVAL
    # ---------------------------------------------------------

    approval = DuplicateApproval(
        name=payload.name,

        phone=payload.phone,

        loan_type_id=payload.loan_type_id,

        loan_amt=payload.loan_amount,

        loan_purpose=payload.loan_purpose,

        referral=payload.reference_name,

        rm_context_id=(
            rm_context.id
            if rm_context
            else None
        ),

        applied_by_context_id=(
            active_context.id
        ),

        status=DuplicateApprovalStatus.pending,

        applied_date=date.today(),

        loan_id=None,
    )

    db.add(approval)

    db.commit()

    db.refresh(approval)

    return {
        "success": True,

        "message": (
            "Duplicate application approval "
            "request submitted successfully."
        ),

        "data": {
            "id": approval.id,

            "loan_id": approval.loan_id,

            "rm_id": (
                rm_context.employee.id
                if rm_context
                and rm_context.employee
                else None
            ),

            "status": approval.status.value,

            "applied_by_id": (
                active_context.employee.id
                if active_context.employee
                else employee.id
            ),

            "applied_date":
                approval.applied_date,
        },
    }


# =========================================================
# APPROVE DUPLICATE APPLICATION
# =========================================================

def approve_duplicate_application(
    db: Session,
    employee: Employee,
    duplicate_approval_id: int,
    context_id: int | None = None,
):
    """
    Approve a duplicate approval request and create
    a LoanApplication using EmployeeContext ownership.
    """

    # ---------------------------------------------------------
    # FIND DUPLICATE APPROVAL
    # ---------------------------------------------------------

    duplicate_approval = (
        db.query(DuplicateApproval)
        .filter(
            DuplicateApproval.id
            == duplicate_approval_id,

            DuplicateApproval.deleted_at.is_(None),
        )
        .first()
    )

    if not duplicate_approval:

        raise HTTPException(
            status_code=404,
            detail=(
                "Duplicate approval request "
                "not found."
            ),
        )

    # ---------------------------------------------------------
    # ACCESS CHECK
    # ---------------------------------------------------------

    active_context = None

    if context_id is not None:

        active_context = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == context_id,
                EmployeeContext.id
                == employee.id,
                EmployeeContext.is_active.is_(True),
            )
            .first()
        )

        if not active_context:

            raise HTTPException(
                status_code=403,
                detail="Invalid or inactive employee context.",
            )

    # ---------------------------------------------------------
    # CHECK STATUS
    # ---------------------------------------------------------

    if (
        duplicate_approval.status
        != DuplicateApprovalStatus.pending
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Only pending duplicate approval "
                "requests can be approved."
            ),
        )

    # ---------------------------------------------------------
    # VALIDATE REQUIRED DATA
    # ---------------------------------------------------------

    if not duplicate_approval.name:

        raise HTTPException(
            status_code=400,
            detail="Applicant name is required.",
        )

    if not duplicate_approval.phone:

        raise HTTPException(
            status_code=400,
            detail="Applicant phone is required.",
        )

    if not duplicate_approval.loan_type_id:

        raise HTTPException(
            status_code=400,
            detail="Loan type is required.",
        )

    # ---------------------------------------------------------
    # CREATE NEW LOAN APPLICATION
    # ---------------------------------------------------------

    loan_application = LoanApplication(
        name=duplicate_approval.name,

        phone=duplicate_approval.phone,

        loan_type_id=duplicate_approval.loan_type_id,

        loan_amt=duplicate_approval.loan_amt,

        loan_purpose=duplicate_approval.loan_purpose,

        referral=duplicate_approval.referral,

        rm_context_id=(
            duplicate_approval.rm_context_id
        ),

        applied_by_context_id=(
            duplicate_approval.applied_by_context_id
        ),

        applied_date=(
            duplicate_approval.applied_date
            or date.today()
        ),

        status=LoanStatus.inprocess,
    )

    db.add(loan_application)

    db.flush()

    loan_application.unique_id = (
        f"LN{loan_application.id}"
    )

    # ---------------------------------------------------------
    # UPDATE DUPLICATE APPROVAL
    # ---------------------------------------------------------

    duplicate_approval.loan_id = (
        loan_application.id
    )

    duplicate_approval.status = (
        DuplicateApprovalStatus.approved
    )

    duplicate_approval.approved_by_id = (
        employee.id
    )

    duplicate_approval.approved_at = (
        datetime.utcnow()
    )

    # ---------------------------------------------------------
    # COMMIT
    # ---------------------------------------------------------

    db.commit()

    db.refresh(loan_application)

    db.refresh(duplicate_approval)

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "success": True,

        "message": (
            "Duplicate application approved "
            "and loan application created successfully."
        ),

        "data": {
            "duplicate_approval_id":
                duplicate_approval.id,

            "loan_id":
                loan_application.id,

            "status":
                duplicate_approval.status.value,

            "approved_by_id":
                duplicate_approval.approved_by_id,

            "approved_at":
                duplicate_approval.approved_at,
        },
    }