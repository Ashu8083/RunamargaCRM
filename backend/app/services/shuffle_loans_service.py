# backend/app/services/shuffle_loans_service.py

from math import ceil
from typing import Optional

from sqlalchemy import or_, func
from sqlalchemy.orm import Session, aliased

from app.models.loan_applications import LoanApplication
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.contexts import Context
from app.models.loan_types import LoanType
from app.models.loan_shuffle_history import LoanShuffleHistory

from app.core.access_control import AccessControl


class ShuffleLoansService:

    # =========================================================
    # ACCESS CONTROL
    # =========================================================

    @staticmethod
    def _get_access_scope(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
    ):
        """
        Resolve the current employee's active context and
        determine which Agent/RM contexts are visible to them.

        Access rules come entirely from AccessControl.

        Returns:
            {
                "context": EmployeeContext,
                "family": str,
                "agent_ids": set[int],
                "rm_ids": set[int],
            }
        """

        if not employee:
            raise PermissionError(
                "Current employee could not be resolved."
            )

        # -----------------------------------------------------
        # ACTIVE CONTEXT
        # -----------------------------------------------------

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not active_context:
            raise PermissionError(
                "No active context found for the current employee."
            )

        # -----------------------------------------------------
        # CONTEXT FAMILY
        # -----------------------------------------------------

        if not active_context.context:
            raise PermissionError(
                "Active context is invalid."
            )

        family = AccessControl.get_context_family(
            active_context.context.code
        )

        if not family:
            raise PermissionError(
                "Unable to determine the active context family."
            )

        # -----------------------------------------------------
        # VISIBLE AGENTS
        # -----------------------------------------------------

        visible_agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=active_context.id,
        )

        visible_agent_ids = {
            employee_context.id
            for employee_context in visible_agents
        }

        # -----------------------------------------------------
        # VISIBLE RMs
        # -----------------------------------------------------

        visible_rms = AccessControl.get_visible_rms(
            db=db,
            employee=employee,
            context_id=active_context.id,
        )

        visible_rm_ids = {
            employee_context.id
            for employee_context in visible_rms
        }

        return {
            "context": active_context,
            "family": family,
            "agent_ids": visible_agent_ids,
            "rm_ids": visible_rm_ids,
        }

    # =========================================================
    # APPLY APPLICATION DATA ACCESS SCOPE
    # =========================================================

    @staticmethod
    def _apply_access_scope(
        query,
        scope,
    ):
        """
        Restrict LoanApplication query according to the
        current employee's AccessControl scope.

        Rules:

        GLOBAL:
            All applications.

        MANAGER:
            All applications.

        TEAMLEAD:
            Applications belonging to visible RMs or Agents.

        RM:
            Applications belonging to:
                - current RM
                - Agents reporting to current RM

        AGENT:
            Applications belonging to the current Agent context.

        This method MUST be applied before pagination.
        """

        family = scope["family"]
        context = scope["context"]

        # -----------------------------------------------------
        # GLOBAL / MANAGER
        # -----------------------------------------------------

        if family in {"GLOBAL", "MANAGER"}:
            return query

        # -----------------------------------------------------
        # AGENT
        # -----------------------------------------------------

        if family == "AGENT":
            return query.filter(
                LoanApplication.agent_context_id
                == context.id
            )

        # -----------------------------------------------------
        # TEAMLEAD / RM
        # -----------------------------------------------------

        visible_agent_ids = scope["agent_ids"]
        visible_rm_ids = scope["rm_ids"]

        access_conditions = []

        if visible_agent_ids:
            access_conditions.append(
                LoanApplication.agent_context_id.in_(
                    visible_agent_ids
                )
            )

        if visible_rm_ids:
            access_conditions.append(
                LoanApplication.rm_context_id.in_(
                    visible_rm_ids
                )
            )

        # -----------------------------------------------------
        # No visible contexts
        # -----------------------------------------------------

        if not access_conditions:
            return query.filter(False)

        return query.filter(
            or_(*access_conditions)
        )

    # =========================================================
    # VALIDATE TARGET AGENT
    # =========================================================

    @staticmethod
    def _validate_agent_access(
        agent_id: Optional[int],
        scope,
    ):
        """
        Verify that the current employee is allowed to
        assign/shuffle to the requested Agent context.
        """

        if agent_id is None:
            return

        family = scope["family"]

        # -----------------------------------------------------
        # GLOBAL / MANAGER
        # -----------------------------------------------------

        if family in {"GLOBAL", "MANAGER"}:
            if agent_id not in scope["agent_ids"]:
                raise PermissionError(
                    "Selected Agent is not active or accessible."
                )

            return

        # -----------------------------------------------------
        # Other roles
        # -----------------------------------------------------

        if agent_id not in scope["agent_ids"]:
            raise PermissionError(
                "You are not allowed to assign loans to this Agent."
            )

    # =========================================================
    # VALIDATE TARGET RM
    # =========================================================

    @staticmethod
    def _validate_rm_access(
        rm_id: Optional[int],
        scope,
    ):
        """
        Verify that the current employee is allowed to
        assign/shuffle to the requested RM context.
        """

        if rm_id is None:
            return

        family = scope["family"]

        # -----------------------------------------------------
        # GLOBAL / MANAGER
        # -----------------------------------------------------

        if family in {"GLOBAL", "MANAGER"}:
            if rm_id not in scope["rm_ids"]:
                raise PermissionError(
                    "Selected RM is not active or accessible."
                )

            return

        # -----------------------------------------------------
        # Other roles
        # -----------------------------------------------------

        if rm_id not in scope["rm_ids"]:
            raise PermissionError(
                "You are not allowed to assign loans to this RM."
            )

    # =========================================================
    # GET SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def get_shuffle_loans(
        db: Session,
        employee: Employee,
        context_id: Optional[int] = None,
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
        # ACCESS CONTROL
        # =====================================================

        scope = ShuffleLoansService._get_access_scope(
            db=db,
            employee=employee,
            context_id=context_id,
        )

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
        # ACCESS SCOPE
        # =====================================================

        query = ShuffleLoansService._apply_access_scope(
            query=query,
            scope=scope,
        )

        # =====================================================
        # AGENT FILTER
        # =====================================================

        if agent_id is not None:

            # -------------------------------------------------
            # First ensure the requested Agent is accessible.
            # -------------------------------------------------

            ShuffleLoansService._validate_agent_access(
                agent_id=agent_id,
                scope=scope,
            )

            query = query.filter(
                LoanApplication.agent_context_id
                == agent_id
            )

        # =====================================================
        # RM FILTER
        # =====================================================

        if rm_id is not None:

            # -------------------------------------------------
            # First ensure the requested RM is accessible.
            # -------------------------------------------------

            ShuffleLoansService._validate_rm_access(
                rm_id=rm_id,
                scope=scope,
            )

            query = query.filter(
                LoanApplication.rm_context_id
                == rm_id
            )

        # =====================================================
        # SEARCH
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
        employee: Employee,
        application_ids: list[int],
        shuffled_by_context_id: int,
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
        # ACCESS CONTROL
        # =====================================================

        scope = ShuffleLoansService._get_access_scope(
            db=db,
            employee=employee,
            context_id=shuffled_by_context_id,
        )

        active_context = scope["context"]

        # =====================================================
        # VALIDATE SHUFFLED-BY CONTEXT
        # =====================================================

        if active_context.id != shuffled_by_context_id:
            raise PermissionError(
                "Invalid shuffle context."
            )

        # =====================================================
        # VALIDATE TARGET AGENT ACCESS
        # =====================================================

        ShuffleLoansService._validate_agent_access(
            agent_id=agent_id,
            scope=scope,
        )

        # =====================================================
        # VALIDATE TARGET RM ACCESS
        # =====================================================

        ShuffleLoansService._validate_rm_access(
            rm_id=rm_id,
            scope=scope,
        )

        # =====================================================
        # VALIDATE AGENT CONTEXT
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
                        func.upper(Context.code)
                        == "AGENT",

                        func.upper(Context.code)
                        .like("AGENT_%"),
                    ),
                )
                .first()
            )

            if not agent_context:
                raise ValueError(
                    "Selected Agent context was not found "
                    "or is not an active AGENT context."
                )

        # =====================================================
        # VALIDATE RM CONTEXT
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
                        func.upper(Context.code)
                        == "RM",

                        func.upper(Context.code)
                        .like("RM_%"),
                    ),
                )
                .first()
            )

            if not rm_context:
                raise ValueError(
                    "Selected RM context was not found "
                    "or is not an active RM context."
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
        # FETCH REQUESTED APPLICATIONS
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
        # IMPORTANT:
        #
        # APPLY ACCESS CONTROL TO SELECTED APPLICATIONS
        #
        # We cannot simply trust application_ids from the
        # frontend.
        # =====================================================

        authorized_query = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.id.in_(
                    application_ids
                ),
                LoanApplication.deleted_at.is_(None),
            )
        )

        authorized_query = (
            ShuffleLoansService._apply_access_scope(
                query=authorized_query,
                scope=scope,
            )
        )

        authorized_applications = (
            authorized_query
            .all()
        )

        authorized_ids = {
            application.id
            for application in authorized_applications
        }

        # =====================================================
        # CHECK FOR UNAUTHORIZED APPLICATIONS
        # =====================================================

        unauthorized_ids = [
            application_id
            for application_id in application_ids
            if application_id not in authorized_ids
        ]

        if unauthorized_ids:
            raise PermissionError(
                "You are not allowed to shuffle one or more "
                "selected applications."
            )

        # -----------------------------------------------------
        # Use only authorized applications from this point.
        # -----------------------------------------------------

        applications = authorized_applications

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
        # BUILD EXACT SHUFFLE HISTORY
        # =====================================================

        history_items = []

        for application in applications:

            old_agent_context_id = (
                application.agent_context_id
            )

            old_rm_context_id = (
                application.rm_context_id
            )

            new_agent_context_id = (
                agent_context.id
                if agent_context is not None
                else old_agent_context_id
            )

            new_rm_context_id = (
                rm_context.id
                if rm_context is not None
                else old_rm_context_id
            )

            history_items.append(
                {
                    "loan_id": application.id,

                    "from_agent_context_id":
                        old_agent_context_id,

                    "to_agent_context_id":
                        new_agent_context_id,

                    "from_rm_context_id":
                        old_rm_context_id,

                    "to_rm_context_id":
                        new_rm_context_id,
                }
            )

        # =====================================================
        # CREATE SHUFFLE HISTORY
        # =====================================================

        shuffle_history = LoanShuffleHistory(
            shuffled_by_context_id=active_context.id,

            to_agent_context_id=(
                agent_context.id
                if agent_context is not None
                else None
            ),

            to_rm_context_id=(
                rm_context.id
                if rm_context is not None
                else None
            ),

            loan_ids=history_items,
        )

        db.add(shuffle_history)

        # =====================================================
        # PARTIAL UPDATE
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
            application_ids=[
                application.id
                for application in applications
            ],
        )

    # =========================================================
    # GET UPDATED APPLICATIONS
    # =========================================================

    @staticmethod
    def get_shuffle_loans_by_ids(
        db: Session,
        application_ids: list[int],
    ):
        """
        Internal helper used after a successful shuffle.

        The caller has already authorized the application IDs
        before reaching this method.
        """

        if not application_ids:
            return []

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

            # IMPORTANT:
            #
            # The previous code joined RM using:
            #
            #     RM.id == LoanApplication.rm_context_id
            #
            # which is incorrect because rm_context_id is an
            # EmployeeContext.id.
            #
            # Correct relationship:
            #
            #     RM.id == RMContext.employee_id
            #

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

        # =====================================================
        # FORMAT
        # =====================================================

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
            # -------------------------------------------------
            # APPLICATION
            # -------------------------------------------------

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