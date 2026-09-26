# backend/app/services/Loans/duplicate_approval_service.py

from datetime import date, datetime
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Query, Session

from app.core.access_control import AccessControl

from app.models.contexts import Context
from app.models.duplicate_approvals import (
    DuplicateApproval,
    DuplicateApprovalStatus,
)
from app.models.employee_contexts import EmployeeContext
from app.models.employees import Employee
from app.models.loan_applications import (
    LoanApplication,
    LoanStatus,
)
from app.models.loan_types import LoanType

from app.schemas.duplicate_approval_schema import (
    DuplicateApprovalCreateRequest,
)


class DuplicateApprovalService:

    # =========================================================
    # SCOPE
    # =========================================================

    @staticmethod
    def apply_scope(
        query: Query,
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ) -> Query:
        """
        Apply employee access scope to DuplicateApproval records.

        GLOBAL:
            All duplicate approvals.

        MANAGER:
            All duplicate approvals.

        AGENT:
            Duplicate approvals created by the current
            Agent EmployeeContext.

        RM:
            Duplicate approvals created by Agent contexts
            reporting to the current RM context.

        TEAMLEAD:
            Duplicate approvals created by Agent contexts
            reporting to the current Team Lead context.

        UNKNOWN:
            No records.
        """

        if not employee:
            return query.filter(False)

        employee_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not employee_context or not employee_context.context:
            return query.filter(False)

        family = AccessControl.get_context_family(
            employee_context.context.code
        )

        # ---------------------------------------------------------
        # GLOBAL / MANAGER
        # ---------------------------------------------------------

        if family in {"GLOBAL", "MANAGER"}:
            return query

        # ---------------------------------------------------------
        # AGENT
        # ---------------------------------------------------------

        if family == "AGENT":
            return query.filter(
                DuplicateApproval.applied_by_context_id
                == employee_context.id
            )

        # ---------------------------------------------------------
        # RM
        # ---------------------------------------------------------

        if family == "RM":

            agent_context_ids = (
                db.query(EmployeeContext.id)
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    EmployeeContext.reports_to_id
                    == employee_context.id,

                    EmployeeContext.is_active.is_(True),

                    Context.is_active.is_(True),

                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .all()
            )

            agent_context_ids = [
                agent_context_id
                for (agent_context_id,) in agent_context_ids
            ]

            if not agent_context_ids:
                return query.filter(False)

            return query.filter(
                DuplicateApproval.applied_by_context_id.in_(
                    agent_context_ids
                )
            )

        # ---------------------------------------------------------
        # TEAM LEAD
        # ---------------------------------------------------------

        if family == "TEAMLEAD":

            agent_context_ids = (
                db.query(EmployeeContext.id)
                .join(
                    Context,
                    EmployeeContext.context_id == Context.id,
                )
                .filter(
                    EmployeeContext.reports_to_id
                    == employee_context.id,

                    EmployeeContext.is_active.is_(True),

                    Context.is_active.is_(True),

                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .all()
            )

            agent_context_ids = [
                agent_context_id
                for (agent_context_id,) in agent_context_ids
            ]

            if not agent_context_ids:
                return query.filter(False)

            return query.filter(
                DuplicateApproval.applied_by_context_id.in_(
                    agent_context_ids
                )
            )

        # ---------------------------------------------------------
        # UNKNOWN
        # ---------------------------------------------------------

        return query.filter(False)

    # =========================================================
    # GET DUPLICATE APPROVALS
    # =========================================================

    @staticmethod
    def get_all(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        loan_type_id: Optional[int] = None,
        applied_by_id: Optional[int] = None,
    ):
        """
        Get duplicate approvals visible to the employee.

        All filtering and database logic belongs here.
        """

        query = (
            db.query(DuplicateApproval)
            .filter(
                DuplicateApproval.deleted_at.is_(None)
            )
        )

        # ---------------------------------------------------------
        # ACCESS SCOPE
        # ---------------------------------------------------------

        query = DuplicateApprovalService.apply_scope(
            query=query,
            db=db,
            employee=employee,
            context_id=context_id,
        )

        # ---------------------------------------------------------
        # STATUS
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

            search_value = f"%{search.strip()}%"

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
                    Employee,
                    Employee.id
                    == EmployeeContext.employee_id,
                )
                .join(
                    Context,
                    Context.id
                    == EmployeeContext.context_id,
                )
                .filter(
                    Employee.id == applied_by_id,

                    EmployeeContext.is_active.is_(True),

                    Employee.status == "active",

                    Employee.deleted_at.is_(None),

                    Context.is_active.is_(True),

                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .first()
            )

            if applied_by_context:

                query = query.filter(
                    DuplicateApproval.applied_by_context_id
                    == applied_by_context.id
                )

            else:

                return []

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

        return approvals

    # =========================================================
    # SERIALIZE DUPLICATE APPROVAL
    # =========================================================

    @staticmethod
    def serialize(
        db: Session,
        approval: DuplicateApproval,
    ) -> dict:
        """
        Convert DuplicateApproval into API response data.
        """

        # ---------------------------------------------------------
        # LOAN TYPE
        # ---------------------------------------------------------

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

        # ---------------------------------------------------------
        # APPLIED BY
        # ---------------------------------------------------------

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

        # ---------------------------------------------------------
        # APPROVED BY
        # ---------------------------------------------------------

        approved_by_name = None

        if approval.approved_by:

            approved_by_name = (
                approval.approved_by.name
            )

        # ---------------------------------------------------------
        # RM
        # ---------------------------------------------------------

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

        # ---------------------------------------------------------
        # RESPONSE
        # ---------------------------------------------------------

        return {
            "id": approval.id,

            "applicantName": approval.name,

            "name": approval.name,

            "phone": approval.phone,

            "loanType": loan_type_name,

            "loan_type": loan_type_name,

            "loan_type_id": approval.loan_type_id,

            "loanAmount": (
                float(approval.loan_amt)
                if approval.loan_amt is not None
                else None
            ),

            "loan_amount": (
                float(approval.loan_amt)
                if approval.loan_amt is not None
                else None
            ),

            "loan_purpose": approval.loan_purpose,

            "reference_name": approval.referral,

            "appliedBy": applied_by_name,

            "applied_by": applied_by_name,

            "applied_by_id": applied_by_employee_id,

            "rm_id": rm_employee_id,

            "rmName": rm_name,

            "rm_name": rm_name,

            "status": (
                approval.status.value
                if approval.status
                else None
            ),

            "appliedDate": approval.applied_date,

            "applied_date": approval.applied_date,

            "approvedDate": approval.approved_at,

            "approved_date": approval.approved_at,

            "approved_by_id": approval.approved_by_id,

            "approved_by": approved_by_name,

            "rejectedDate": (
                approval.approved_at
                if approval.status
                == DuplicateApprovalStatus.rejected
                else None
            ),

            "rejected_date": (
                approval.approved_at
                if approval.status
                == DuplicateApprovalStatus.rejected
                else None
            ),

            "rejected_remarks": (
                approval.rejected_remarks
            ),

            "loanId": approval.loan_id,

            "loan_id": approval.loan_id,
        }

    # =========================================================
    # CREATE DUPLICATE APPROVAL
    # =========================================================

    @staticmethod
    def create(
        db: Session,
        employee: Employee,
        payload: DuplicateApprovalCreateRequest,
        context_id: Optional[int] = None,
    ):
        """
        Create a duplicate approval request.
        """

        # ---------------------------------------------------------
        # ACTIVE CONTEXT
        # ---------------------------------------------------------

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:
            raise ValueError(
                "Invalid or inactive employee context."
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
                    Employee.id
                    == EmployeeContext.employee_id,
                )
                .join(
                    Context,
                    Context.id
                    == EmployeeContext.context_id,
                )
                .filter(
                    EmployeeContext.id
                    == payload.rm_id,

                    EmployeeContext.is_active.is_(True),

                    Employee.status == "active",

                    Employee.deleted_at.is_(None),

                    Context.is_active.is_(True),

                    func.upper(Context.code) == "RM",
                )
                .first()
            )

            if not rm_context:

                raise ValueError(
                    "Relationship Manager context not found."
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

            raise ValueError(
                "Approval request already exists "
                "for this phone number."
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

        return approval

    # =========================================================
    # APPROVE DUPLICATE APPLICATION
    # =========================================================

    @staticmethod
    def approve(
        db: Session,
        employee: Employee,
        duplicate_approval_id: int,
        context_id: Optional[int] = None,
    ):
        """
        Approve a duplicate approval request and create
        a LoanApplication.
        """

        # ---------------------------------------------------------
        # FIND APPROVAL
        # ---------------------------------------------------------

        query = (
            db.query(DuplicateApproval)
            .filter(
                DuplicateApproval.id
                == duplicate_approval_id,

                DuplicateApproval.deleted_at.is_(None),
            )
        )

        # ---------------------------------------------------------
        # ACCESS SCOPE
        # ---------------------------------------------------------

        query = DuplicateApprovalService.apply_scope(
            query=query,
            db=db,
            employee=employee,
            context_id=context_id,
        )

        duplicate_approval = query.first()

        if not duplicate_approval:

            raise LookupError(
                "Duplicate approval request not found."
            )

        # ---------------------------------------------------------
        # STATUS
        # ---------------------------------------------------------

        if (
            duplicate_approval.status
            != DuplicateApprovalStatus.pending
        ):

            raise ValueError(
                "Only pending duplicate approval "
                "requests can be approved."
            )

        # ---------------------------------------------------------
        # REQUIRED DATA
        # ---------------------------------------------------------

        if not duplicate_approval.name:

            raise ValueError(
                "Applicant name is required."
            )

        if not duplicate_approval.phone:

            raise ValueError(
                "Applicant phone is required."
            )

        if not duplicate_approval.loan_type_id:

            raise ValueError(
                "Loan type is required."
            )

        # ---------------------------------------------------------
        # CREATE LOAN APPLICATION
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

        # ---------------------------------------------------------
        # GENERATE UNIQUE ID
        # ---------------------------------------------------------

        loan_application.unique_id = (
            f"LN{loan_application.id}"
        )

        # ---------------------------------------------------------
        # UPDATE APPROVAL
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

        return {
            "duplicate_approval": duplicate_approval,
            "loan_application": loan_application,
        }