# backend/app/services/shuffle_loans_service.py

from math import ceil
from typing import Optional

from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_, func

from app.models.loan_applications import LoanApplication
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.loan_types import LoanType


class ShuffleLoansService:

    # =========================================================
    # GET SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def get_shuffle_loans(
        db: Session,
        search: Optional[str] = None,
        agent_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 30,
    ):
        # =====================================================
        # VALIDATE PAGINATION
        # =====================================================

        if page < 1:
            page = 1

        if limit < 1:
            limit = 30

        if limit > 200:
            limit = 200

        # =====================================================
        # ALIASES
        # =====================================================

        AgentContext = aliased(EmployeeContext)
        RMContext = aliased(EmployeeContext)

        Agent = aliased(Employee)
        RM = aliased(Employee)

        # =====================================================
        # BASE QUERY
        # =====================================================

        query = (
            db.query(
                LoanApplication,
                Agent.name.label("agent_name"),
                RM.name.label("rm_name"),
                LoanType.name.label("loan_type"),
            )

            # -------------------------------------------------
            # AGENT CONTEXT
            # -------------------------------------------------

            .outerjoin(
                AgentContext,
                AgentContext.id
                == LoanApplication.agent_context_id,
            )

            .outerjoin(
                Agent,
                Agent.id
                == AgentContext.employee_id,
            )

            # -------------------------------------------------
            # RM CONTEXT
            # -------------------------------------------------

            .outerjoin(
                RMContext,
                RMContext.id
                == LoanApplication.rm_context_id,
            )

            .outerjoin(
                RM,
                RM.id
                == RMContext.employee_id,
            )

            # -------------------------------------------------
            # LOAN TYPE
            # -------------------------------------------------

            .outerjoin(
                LoanType,
                LoanType.id
                == LoanApplication.loan_type_id,
            )

            # -------------------------------------------------
            # ACTIVE APPLICATIONS
            # -------------------------------------------------

            .filter(
                LoanApplication.deleted_at.is_(None)
            )
        )

        # =====================================================
        # SEARCH
        # =====================================================
        #
        # IMPORTANT:
        #
        # Search is performed BEFORE pagination.
        #
        # =====================================================

        if search and search.strip():

            value = f"%{search.strip()}%"

            query = query.filter(
                or_(
                    LoanApplication.name.ilike(value),
                    LoanApplication.phone.ilike(value),
                    LoanApplication.email.ilike(value),
                    LoanApplication.unique_id.ilike(value),
                    Agent.name.ilike(value),
                    RM.name.ilike(value),
                    LoanType.name.ilike(value),
                )
            )

        # =====================================================
        # AGENT FILTER
        # =====================================================
        #
        # API receives:
        #
        #     agent_id = EmployeeContext.id
        #
        # Database stores:
        #
        #     LoanApplication.agent_context_id
        #
        # Therefore the context ID can be used directly.
        #
        # =====================================================

        if agent_id is not None:

            agent_context = (
                db.query(EmployeeContext)
                .join(
                    Context,
                    EmployeeContext.context_id
                    == Context.id,
                )
                .filter(
                    EmployeeContext.id == agent_id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .first()
            )

            if not agent_context:
                return {
                    "items": [],
                    "total": 0,
                    "page": page,
                    "limit": limit,
                    "totalPages": 0,
                }

            query = query.filter(
                LoanApplication.agent_context_id
                == agent_context.id
            )

        # =====================================================
        # RM FILTER
        # =====================================================
        #
        # API receives:
        #
        #     rm_id = EmployeeContext.id
        #
        # Database stores:
        #
        #     LoanApplication.rm_context_id
        #
        # Therefore the context ID can be used directly.
        #
        # =====================================================

        if rm_id is not None:

            rm_context = (
                db.query(EmployeeContext)
                .join(
                    Context,
                    EmployeeContext.context_id
                    == Context.id,
                )
                .filter(
                    EmployeeContext.id == rm_id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .first()
            )

            if not rm_context:
                return {
                    "items": [],
                    "total": 0,
                    "page": page,
                    "limit": limit,
                    "totalPages": 0,
                }

            query = query.filter(
                LoanApplication.rm_context_id
                == rm_context.id
            )

        # =====================================================
        # LOAN TYPE FILTER
        # =====================================================

        if loan_type_id is not None:

            query = query.filter(
                LoanApplication.loan_type_id
                == loan_type_id
            )

        # =====================================================
        # STATUS FILTER
        # =====================================================

        if status:

            query = query.filter(
                LoanApplication.status == status
            )

        # =====================================================
        # TOTAL COUNT
        # =====================================================

        total = query.count()

        # =====================================================
        # TOTAL PAGES
        # =====================================================

        total_pages = (
            ceil(total / limit)
            if total > 0
            else 0
        )

        # =====================================================
        # HANDLE PAGE OUT OF RANGE
        # =====================================================

        if total_pages > 0 and page > total_pages:
            page = total_pages

        # =====================================================
        # OFFSET
        # =====================================================

        offset = (
            (page - 1) * limit
        )

        # =====================================================
        # ORDER
        # =====================================================

        query = query.order_by(
            LoanApplication.id.desc()
        )

        # =====================================================
        # PAGINATION
        # =====================================================

        rows = (
            query
            .offset(offset)
            .limit(limit)
            .all()
        )

        # =====================================================
        # FORMAT RESULTS
        # =====================================================

        items = [
            ShuffleLoansService._format_application(
                application,
                agent_name,
                rm_name,
                loan_type,
            )
            for (
                application,
                agent_name,
                rm_name,
                loan_type,
            ) in rows
        ]

        # =====================================================
        # RETURN PAGINATED RESPONSE
        # =====================================================

        return {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": total_pages,
        }

    # =========================================================
    # ASSIGN / SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def assign_shuffle_loans(
        db: Session,
        application_ids: list[int],
        agent_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
    ):
        # =====================================================
        # VALIDATION
        # =====================================================

        if not application_ids:

            raise ValueError(
                "At least one application must be selected."
            )

        if (
            agent_id is None
            and rm_id is None
            and loan_type_id is None
        ):

            raise ValueError(
                "Select at least one value to update."
            )

        # =====================================================
        # VALIDATE AGENT CONTEXT
        # =====================================================
        #
        # agent_id is EmployeeContext.id.
        #
        # We validate that the selected context:
        #
        #     1. exists
        #     2. is active
        #     3. belongs to an AGENT family
        #
        # =====================================================

        agent_context = None

        if agent_id is not None:

            agent_context = (
                db.query(EmployeeContext)
                .join(
                    Context,
                    EmployeeContext.context_id
                    == Context.id,
                )
                .filter(
                    EmployeeContext.id == agent_id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "AGENT",
                        func.upper(Context.code).like("AGENT_%"),
                    ),
                )
                .first()
            )

            if not agent_context:

                raise ValueError(
                    "Selected Agent context was not found or is not an active AGENT context."
                )

        # =====================================================
        # VALIDATE RM CONTEXT
        # =====================================================
        #
        # rm_id is EmployeeContext.id.
        #
        # We validate that the selected context:
        #
        #     1. exists
        #     2. is active
        #     3. belongs to an RM family
        #
        # =====================================================

        rm_context = None

        if rm_id is not None:

            rm_context = (
                db.query(EmployeeContext)
                .join(
                    Context,
                    EmployeeContext.context_id
                    == Context.id,
                )
                .filter(
                    EmployeeContext.id == rm_id,
                    EmployeeContext.is_active.is_(True),
                    Context.is_active.is_(True),
                    or_(
                        func.upper(Context.code) == "RM",
                        func.upper(Context.code).like("RM_%"),
                    ),
                )
                .first()
            )

            if not rm_context:

                raise ValueError(
                    "Selected RM context was not found or is not an active RM context."
                )

        # =====================================================
        # VALIDATE LOAN TYPE
        # =====================================================

        if loan_type_id is not None:

            loan_type = (
                db.query(LoanType)
                .filter(
                    LoanType.id == loan_type_id
                )
                .first()
            )

            if not loan_type:

                raise ValueError(
                    "Selected Loan Type was not found."
                )

        # =====================================================
        # FETCH APPLICATIONS
        # =====================================================

        applications = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.id.in_(
                    application_ids
                ),
                LoanApplication.deleted_at.is_(None),
            )
            .all()
        )

        if not applications:

            raise ValueError(
                "No valid loan applications were found."
            )

        # =====================================================
        # ENSURE ALL REQUESTED IDS EXIST
        # =====================================================

        found_ids = {
            application.id
            for application in applications
        }

        missing_ids = [
            application_id
            for application_id in application_ids
            if application_id not in found_ids
        ]

        if missing_ids:

            raise ValueError(
                "Some selected applications were not found."
            )

        # =====================================================
        # PARTIAL UPDATE
        # =====================================================
        #
        # Only a field that is NOT None is changed.
        #
        # None means:
        #
        #     "User did not select this field."
        #
        # =====================================================

        for application in applications:

            # -------------------------------------------------
            # AGENT
            # -------------------------------------------------

            if agent_context is not None:

                application.agent_context_id = (
                    agent_context.id
                )

            # -------------------------------------------------
            # RM
            # -------------------------------------------------

            if rm_context is not None:

                application.rm_context_id = (
                    rm_context.id
                )

            # -------------------------------------------------
            # LOAN TYPE
            # -------------------------------------------------

            if loan_type_id is not None:

                application.loan_type_id = (
                    loan_type_id
                )

        # =====================================================
        # SAVE
        # =====================================================

        db.commit()

        # =====================================================
        # RETURN UPDATED DATA
        # =====================================================

        return ShuffleLoansService.get_shuffle_loans_by_ids(
            db=db,
            application_ids=application_ids,
        )

    # =========================================================
    # GET UPDATED APPLICATIONS
    # =========================================================

    @staticmethod
    def get_shuffle_loans_by_ids(
        db: Session,
        application_ids: list[int],
    ):

        # =====================================================
        # ALIASES
        # =====================================================

        AgentContext = aliased(EmployeeContext)
        RMContext = aliased(EmployeeContext)

        Agent = aliased(Employee)
        RM = aliased(Employee)

        # =====================================================
        # QUERY
        # =====================================================

        rows = (
            db.query(
                LoanApplication,
                Agent.name.label("agent_name"),
                RM.name.label("rm_name"),
                LoanType.name.label("loan_type"),
            )

            # -------------------------------------------------
            # AGENT CONTEXT
            # -------------------------------------------------

            .outerjoin(
                AgentContext,
                AgentContext.id
                == LoanApplication.agent_context_id,
            )

            .outerjoin(
                Agent,
                Agent.id
                == AgentContext.employee_id,
            )

            # -------------------------------------------------
            # RM CONTEXT
            # -------------------------------------------------

            .outerjoin(
                RMContext,
                RMContext.id
                == LoanApplication.rm_context_id,
            )

            .outerjoin(
                RM,
                RM.id
                == LoanApplication.rm_context_id,
            )

            # -------------------------------------------------
            # LOAN TYPE
            # -------------------------------------------------

            .outerjoin(
                LoanType,
                LoanType.id
                == LoanApplication.loan_type_id,
            )

            # -------------------------------------------------
            # FILTER
            # -------------------------------------------------

            .filter(
                LoanApplication.id.in_(
                    application_ids
                ),
                LoanApplication.deleted_at.is_(None),
            )

            .order_by(
                LoanApplication.id.desc()
            )

            .all()
        )

        return [
            ShuffleLoansService._format_application(
                application,
                agent_name,
                rm_name,
                loan_type,
            )
            for (
                application,
                agent_name,
                rm_name,
                loan_type,
            ) in rows
        ]

    # =========================================================
    # FORMAT APPLICATION
    # =========================================================

    @staticmethod
    def _format_application(
        application,
        agent_name,
        rm_name,
        loan_type,
    ):

        # =====================================================
        # STATUS
        # =====================================================

        status = (
            application.status.value
            if application.status
            else None
        )

        # =====================================================
        # RESOLVE CONTEXT IDS
        # =====================================================
        #
        # The API now exposes EmployeeContext.id.
        #
        # Employee.id is only used internally for employee
        # identity/name resolution.
        #
        # =====================================================

        agent_context_id = (
            application.agent_context_id
        )

        rm_context_id = (
            application.rm_context_id
        )

        # =====================================================
        # RESPONSE
        # =====================================================

        return {

            "id":
                application.id,

            "loanId":
                application.unique_id,

            "unique_id":
                application.unique_id,

            "name":
                application.name,

            "email":
                application.email,

            "phone":
                application.phone,

            # -------------------------------------------------
            # LOAN TYPE
            # -------------------------------------------------

            "loanType":
                loan_type,

            "loan_type":
                loan_type,

            "loan_type_id":
                application.loan_type_id,

            # -------------------------------------------------
            # AMOUNT
            # -------------------------------------------------

            "amount": (
                float(application.loan_amt)
                if application.loan_amt is not None
                else None
            ),

            "loan_amt": (
                float(application.loan_amt)
                if application.loan_amt is not None
                else None
            ),

            # -------------------------------------------------
            # AGENT
            # -------------------------------------------------
            #
            # API returns EmployeeContext.id.
            #
            # Database ownership:
            #
            #     LoanApplication.agent_context_id
            #
            # -------------------------------------------------

            "agentId":
                agent_context_id,

            "agent_id":
                agent_context_id,

            "agentName":
                agent_name,

            "agent_name":
                agent_name,

            # -------------------------------------------------
            # RM
            # -------------------------------------------------
            #
            # API returns EmployeeContext.id.
            #
            # Database ownership:
            #
            #     LoanApplication.rm_context_id
            #
            # -------------------------------------------------

            "rmId":
                rm_context_id,

            "rm_id":
                rm_context_id,

            "rmName":
                rm_name,

            "rm_name":
                rm_name,

            # -------------------------------------------------
            # STATUS
            # -------------------------------------------------

            "status":
                status,

            # -------------------------------------------------
            # DATES
            # -------------------------------------------------

            "appliedDate": (
                application.applied_date.isoformat()
                if application.applied_date
                else None
            ),

            "applied_date": (
                application.applied_date.isoformat()
                if application.applied_date
                else None
            ),

            "created_at": (
                application.created_at.isoformat()
                if application.created_at
                else None
            ),

            "updated_at": (
                application.updated_at.isoformat()
                if application.updated_at
                else None
            ),
        }