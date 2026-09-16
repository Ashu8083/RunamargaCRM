# backend/app/services/Loans/loan_assignment_service.py

from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission
from app.models.permissions import Permission
from app.models.loan_types import LoanType, LoanTypeStatus
from app.models.loan_assignments import (
    LoanAssignment,
    LoanAssignmentStatus,
)


class LoanAssignmentService:

    # ========================================================================
    # LOAN TYPE → PERMISSION MAPPING
    # ========================================================================
    #
    # These names match the current loan_types table.
    #
    # Personal       → loans:assignment:personal
    # Business       → loans:assignment:business
    # Home           → loans:assignment:home
    # LAP            → loans:assignment:lap
    # Education      → loans:assignment:education
    # Car            → loans:assignment:car
    # Gold           → loans:assignment:gold
    # Credit Card    → loans:assignment:credit-card
    # Agricultural   → loans:assignment:agriculture
    #
    # The permission is only READ here.
    # Permissions are managed separately.
    # ========================================================================

    LOAN_PERMISSION_MAP = {
        "personal": "loans:assignment:personal",
        "business": "loans:assignment:business",
        "home": "loans:assignment:home",
        "lap": "loans:assignment:lap",
        "education": "loans:assignment:education",
        "car": "loans:assignment:car",
        "gold": "loans:assignment:gold",
        "credit card": "loans:assignment:credit-card",
        "agricultural": "loans:assignment:agriculture",
    }

    # ========================================================================
    # HELPERS
    # ========================================================================

    @staticmethod
    def _normalize_name(name: str) -> str:
        """
        Normalize loan type name before looking it up in the
        permission mapping.
        """

        return " ".join(
            str(name or "")
            .strip()
            .lower()
            .split()
        )

    @classmethod
    def _get_permission_code(
        cls,
        loan_type: LoanType,
    ) -> str | None:
        """
        Get the assignment permission code for a loan type.
        """

        normalized_name = cls._normalize_name(
            loan_type.name
        )

        return cls.LOAN_PERMISSION_MAP.get(
            normalized_name
        )

    # ========================================================================
    # GET AGENT CONTEXTS
    # ========================================================================

    @staticmethod
    def _get_agent_contexts(
        db: Session,
        agents: list[Employee],
    ) -> list[EmployeeContext]:
        """
        Get active EmployeeContexts belonging to the visible
        agents.

        The returned EmployeeContext.id is what is used by:

            employee_context_permissions
            loan_assignments
        """

        if not agents:
            return []

        employee_ids = [
            employee.id
            for employee in agents
        ]

        return (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id.in_(
                    employee_ids
                ),
                EmployeeContext.is_active.is_(True),
            )
            .all()
        )

    # ========================================================================
    # GET PERMISSION IDS
    # ========================================================================

    @staticmethod
    def _get_permission_ids(
        db: Session,
        permission_code: str,
    ) -> list[int]:
        """
        Find the database Permission ID for a permission code.

        Example:

            loans:assignment:personal
                    ↓
            Permission.id
        """

        permissions = (
            db.query(Permission.id)
            .filter(
                Permission.code == permission_code,
                Permission.is_active.is_(True),
            )
            .all()
        )

        return [
            permission.id
            for permission in permissions
        ]

    # ========================================================================
    # FILTER AGENTS BY PERMISSION
    # ========================================================================

    @staticmethod
    def _get_permissioned_agent_contexts(
        db: Session,
        agent_contexts: list[EmployeeContext],
        permission_code: str,
    ) -> list[EmployeeContext]:
        """
        From the already-visible agents, return only the
        EmployeeContexts that have the requested permission.

        Example:

            Personal Loan
                ↓
            loans:assignment:personal
                ↓
            EmployeeContextPermission
                ↓
            only agents having that permission
        """

        if not agent_contexts:
            return []

        permission_ids = (
            LoanAssignmentService._get_permission_ids(
                db=db,
                permission_code=permission_code,
            )
        )

        if not permission_ids:
            return []

        context_ids = [
            context.id
            for context in agent_contexts
        ]

        permissioned_context_ids = {
            row.employee_context_id
            for row in (
                db.query(
                    EmployeeContextPermission.employee_context_id
                )
                .filter(
                    EmployeeContextPermission.employee_context_id.in_(
                        context_ids
                    ),
                    EmployeeContextPermission.permission_id.in_(
                        permission_ids
                    ),
                )
                .all()
            )
        }

        return [
            context
            for context in agent_contexts
            if context.id in permissioned_context_ids
        ]

    # ========================================================================
    # GET LOAN ASSIGNMENTS
    # ========================================================================

    @classmethod
    def get_loan_assignments(
        cls,
        db: Session,
        employee: Employee,
        context_id: int | None = None,
    ):
        """
        Return loan types with the agents who are eligible for
        each loan type.

        Flow:

            Current User
                ↓
            AccessControl.get_visible_agents()
                ↓
            Visible Agents
                ↓
            EmployeeContexts
                ↓
            Loan Type
                ↓
            Loan Permission
                ↓
            EmployeeContextPermission
                ↓
            Eligible Agents
                ↓
            LoanAssignment
                ↓
            active / inactive
        """

        # --------------------------------------------------------------------
        # STEP 1
        # Get agents visible to the current user according to
        # the existing AccessControl hierarchy.
        #
        # AccessControl is intentionally not changed here.
        # --------------------------------------------------------------------

        visible_agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not visible_agents:
            return []

        # --------------------------------------------------------------------
        # STEP 2
        # Get EmployeeContext records for those agents.
        # --------------------------------------------------------------------

        agent_contexts = cls._get_agent_contexts(
            db=db,
            agents=visible_agents,
        )

        # --------------------------------------------------------------------
        # STEP 3
        # Make employee lookup easy.
        # --------------------------------------------------------------------

        employees_by_id = {
            agent.id: agent
            for agent in visible_agents
        }

        # --------------------------------------------------------------------
        # STEP 4
        # Get all active loan types.
        # --------------------------------------------------------------------

        loan_types = (
            db.query(LoanType)
            .filter(
                LoanType.status == LoanTypeStatus.active,
                LoanType.deleted_at.is_(None),
            )
            .order_by(
                LoanType.id.asc()
            )
            .all()
        )

        response = []

        # --------------------------------------------------------------------
        # STEP 5
        # Process each loan type separately.
        # --------------------------------------------------------------------

        for loan_type in loan_types:

            # ---------------------------------------------------------------
            # Get permission belonging to this loan type.
            #
            # Example:
            #
            # Personal
            #     ↓
            # loans:assignment:personal
            # ---------------------------------------------------------------

            permission_code = cls._get_permission_code(
                loan_type=loan_type,
            )

            # ---------------------------------------------------------------
            # If there is no configured permission mapping,
            # return the loan type with no agents.
            # ---------------------------------------------------------------

            if not permission_code:
                response.append(
                    {
                        "id": loan_type.id,
                        "name": loan_type.name,
                        "permission": None,
                        "agents": [],
                    }
                )

                continue

            # ---------------------------------------------------------------
            # Find only the visible agents that have this permission.
            # ---------------------------------------------------------------

            permissioned_contexts = (
                cls._get_permissioned_agent_contexts(
                    db=db,
                    agent_contexts=agent_contexts,
                    permission_code=permission_code,
                )
            )

            if not permissioned_contexts:
                response.append(
                    {
                        "id": loan_type.id,
                        "name": loan_type.name,
                        "permission": permission_code,
                        "agents": [],
                    }
                )

                continue

            # ---------------------------------------------------------------
            # Get EmployeeContext IDs for checking assignments.
            # ---------------------------------------------------------------

            context_ids = [
                context.id
                for context in permissioned_contexts
            ]

            # ---------------------------------------------------------------
            # STEP 6
            # Get existing loan assignment records.
            #
            # This does NOT determine permission.
            #
            # Permission was already checked above.
            #
            # This only determines:
            #
            #     active   → toggle ON
            #     inactive → toggle OFF
            # ---------------------------------------------------------------

            assignments = (
                db.query(LoanAssignment)
                .filter(
                    LoanAssignment.employee_context_id.in_(
                        context_ids
                    ),
                    LoanAssignment.loan_type_id
                    == loan_type.id,
                )
                .all()
            )

            assignment_by_context_id = {
                assignment.employee_context_id: assignment
                for assignment in assignments
            }

            agents = []

            # ---------------------------------------------------------------
            # STEP 7
            # Build agents for this specific loan type.
            # ---------------------------------------------------------------

            for agent_context in permissioned_contexts:

                agent = employees_by_id.get(
                    agent_context.employee_id
                )

                if not agent:
                    continue

                assignment = assignment_by_context_id.get(
                    agent_context.id
                )

                assigned = (
                    assignment is not None
                    and assignment.status
                    == LoanAssignmentStatus.active
                )

                agents.append(
                    {
                        "employee_context_id": agent_context.id,
                        "employee_id": agent.id,
                        "name": agent.name,
                        "assigned": assigned,
                    }
                )

            # ---------------------------------------------------------------
            # STEP 8
            # Add this loan type and its eligible agents.
            # ---------------------------------------------------------------

            response.append(
                {
                    "id": loan_type.id,
                    "name": loan_type.name,
                    "permission": permission_code,
                    "agents": agents,
                }
            )

        return response

    # ========================================================================
    # TOGGLE LOAN ASSIGNMENT
    # ========================================================================

    @classmethod
    def toggle_loan_assignment(
        cls,
        db: Session,
        employee: Employee,
        employee_context_id: int,
        loan_type_id: int,
        status: LoanAssignmentStatus,
        context_id: int | None = None,
    ):
        """
        Create or update a loan assignment.

        Permission and hierarchy are checked before allowing
        the assignment.

        ON:

            no row
                ↓
            create active

            existing row
                ↓
            update active

        OFF:

            no row
                ↓
            create inactive

            existing row
                ↓
            update inactive
        """

        # --------------------------------------------------------------------
        # STEP 1
        # Verify loan type.
        # --------------------------------------------------------------------

        loan_type = (
            db.query(LoanType)
            .filter(
                LoanType.id == loan_type_id,
                LoanType.status == LoanTypeStatus.active,
                LoanType.deleted_at.is_(None),
            )
            .first()
        )

        if not loan_type:
            raise ValueError(
                "Loan type not found or inactive."
            )

        # --------------------------------------------------------------------
        # STEP 2
        # Get permission belonging to this loan type.
        # --------------------------------------------------------------------

        permission_code = cls._get_permission_code(
            loan_type=loan_type,
        )

        if not permission_code:
            raise ValueError(
                "No assignment permission is configured "
                "for this loan type."
            )

        # --------------------------------------------------------------------
        # STEP 3
        # Get agents visible to the current user.
        #
        # Existing AccessControl is used unchanged for now.
        # --------------------------------------------------------------------

        visible_agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        visible_employee_ids = {
            agent.id
            for agent in visible_agents
        }

        # --------------------------------------------------------------------
        # STEP 4
        # Find target EmployeeContext.
        # --------------------------------------------------------------------

        target_context = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == employee_context_id,
                EmployeeContext.is_active.is_(True),
            )
            .first()
        )

        if not target_context:
            raise ValueError(
                "Employee context not found or inactive."
            )

        # --------------------------------------------------------------------
        # STEP 5
        # Verify target agent is visible to current user.
        # --------------------------------------------------------------------

        if target_context.employee_id not in visible_employee_ids:
            raise ValueError(
                "You are not allowed to modify this agent's assignment."
            )

        # --------------------------------------------------------------------
        # STEP 6
        # Verify target agent has the required permission.
        # --------------------------------------------------------------------

        agent_contexts = [
            target_context
        ]

        permissioned_contexts = (
            cls._get_permissioned_agent_contexts(
                db=db,
                agent_contexts=agent_contexts,
                permission_code=permission_code,
            )
        )

        if not permissioned_contexts:
            raise ValueError(
                "This agent does not have the required "
                "loan assignment permission."
            )

        # --------------------------------------------------------------------
        # STEP 7
        # Find existing assignment.
        # --------------------------------------------------------------------

        assignment = (
            db.query(LoanAssignment)
            .filter(
                LoanAssignment.employee_context_id
                == employee_context_id,
                LoanAssignment.loan_type_id
                == loan_type_id,
            )
            .first()
        )

        # --------------------------------------------------------------------
        # STEP 8
        # Update existing assignment OR create new one.
        # --------------------------------------------------------------------

        if assignment:

            assignment.status = status

            # A status toggle is not a deletion.
            assignment.deleted_at = None

        else:

            assignment = LoanAssignment(
                employee_context_id=employee_context_id,
                loan_type_id=loan_type_id,
                status=status,
            )

            db.add(assignment)

        # --------------------------------------------------------------------
        # STEP 9
        # Save.
        # --------------------------------------------------------------------

        try:
            db.commit()
            db.refresh(assignment)

        except Exception:
            db.rollback()
            raise

        # --------------------------------------------------------------------
        # STEP 10
        # Return updated assignment.
        # --------------------------------------------------------------------

        return {
            "id": assignment.id,
            "employee_context_id": assignment.employee_context_id,
            "loan_type_id": assignment.loan_type_id,
            "status": assignment.status,
            "assigned": (
                assignment.status
                == LoanAssignmentStatus.active
            ),
        }