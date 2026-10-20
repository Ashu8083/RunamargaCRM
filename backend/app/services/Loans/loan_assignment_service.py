# backend/app/services/Loans/loan_assignment_service.py

from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.core.log_config import logger
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

    # ======================================================================
    # HELPERS
    # ======================================================================

    @staticmethod
    def _normalize_name(name: str) -> str:
        return " ".join(str(name or "").strip().lower().split())

    @classmethod
    def _get_permission_code(
        cls,
        loan_type: LoanType,
    ) -> str | None:
        return cls.LOAN_PERMISSION_MAP.get(
            cls._normalize_name(loan_type.name)
        )

    # ======================================================================
    # GET CONTEXTS FOR VISIBLE AGENTS
    # get_visible_agents() returns EmployeeContext objects.
    # Therefore, use EmployeeContext.id, NOT employee_id.
    # ======================================================================

    @staticmethod
    def _get_agent_contexts(
        db: Session,
        agents: list[EmployeeContext],
    ) -> list[EmployeeContext]:

        if not agents:
            return []

        visible_context_ids = [agent.id for agent in agents]

        contexts = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id.in_(visible_context_ids),
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
            )
            .all()
        )

        # logger.info(
        #     "[LoanAssignment Debug] Visible agent contexts: %s",
        #     [(ctx.id, ctx.employee_id) for ctx in contexts],
        # )

        return contexts

    # ======================================================================
    # GET PERMISSION IDS
    # ======================================================================

    @staticmethod
    def _get_permission_ids(
        db: Session,
        permission_code: str,
    ) -> list[int]:

        rows = (
            db.query(Permission.id)
            .filter(
                Permission.code == permission_code,
                Permission.is_active.is_(True),
            )
            .all()
        )

        return [row[0] for row in rows]

    # ======================================================================
    # FILTER VISIBLE AGENT CONTEXTS BY PERMISSION
    # ======================================================================

    @staticmethod
    def _get_permissioned_agent_contexts(
        db: Session,
        agent_contexts: list[EmployeeContext],
        permission_code: str,
    ) -> list[EmployeeContext]:

        if not agent_contexts:
            return []

        permission_ids = LoanAssignmentService._get_permission_ids(
            db=db,
            permission_code=permission_code,
        )

        if not permission_ids:
            # logger.info(
            #     "[LoanAssignment Debug] Permission missing/inactive: %s",
            #     permission_code,
            # )
            return []

        context_ids = [ctx.id for ctx in agent_contexts]

        rows = (
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

        permissioned_context_ids = {row[0] for row in rows}

        # logger.info(
        #     "[LoanAssignment Debug] Permission=%s, permission_ids=%s, "
        #     "checked_context_ids=%s, matched_context_ids=%s",
        #     permission_code,
        #     permission_ids,
        #     context_ids,
        #     sorted(permissioned_context_ids),
        # )

        return [
            ctx
            for ctx in agent_contexts
            if ctx.id in permissioned_context_ids
        ]

    # ======================================================================
    # GET LOAN ASSIGNMENTS
    # ======================================================================

    @classmethod
    def get_loan_assignments(
        cls,
        db: Session,
        employee: Employee,
        context_id: int | None = None,
    ):

        # 1. Get only the agent contexts visible through AccessControl.
        visible_agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not visible_agents:
            # logger.info(
            #     "[LoanAssignment Debug] No visible agents for employee_id=%s",
            #     employee.id,
            # )
            return []

        # 2. Re-fetch only those exact contexts.
        agent_contexts = cls._get_agent_contexts(
            db=db,
            agents=visible_agents,
        )
        # logger.info(
        #     "[LoanAssignment Debug] Business permission lookup starting. "
        #     "Context 129 included: %s",
        #     any(ctx.id == 129 for ctx in agent_contexts),
        # )

        # 3. Map employee IDs to Employee records.
        # visible_agents contains EmployeeContext objects, not Employee objects.
        employees_by_id = {
            ctx.employee_id: ctx.employee
            for ctx in agent_contexts
            if ctx.employee is not None
        }

        # 4. Fetch active loan types.
        loan_types = (
            db.query(LoanType)
            .filter(
                LoanType.status == LoanTypeStatus.active,
                LoanType.deleted_at.is_(None),
            )
            .order_by(LoanType.id.asc())
            .all()
        )

        response = []

        # 5. Find eligible agents for each loan type.
        for loan_type in loan_types:

            permission_code = cls._get_permission_code(loan_type)

            if not permission_code:
                response.append({
                    "id": loan_type.id,
                    "name": loan_type.name,
                    "permission": None,
                    "agents": [],
                })
                continue

            permissioned_contexts = (
                cls._get_permissioned_agent_contexts(
                    db=db,
                    agent_contexts=agent_contexts,
                    permission_code=permission_code,
                )
            )

            # logger.info(
            #     "[LoanAssignment Debug] Loan=%s, Permission=%s, "
            #     "Eligible contexts=%s",
            #     loan_type.name,
            #     permission_code,
            #     [
            #         (ctx.id, ctx.employee_id)
            #         for ctx in permissioned_contexts
            #     ],
            # )

            context_ids = [ctx.id for ctx in permissioned_contexts]

            # 6. Fetch assignment records for eligible contexts only.
            assignments = []

            if context_ids:
                assignments = (
                    db.query(LoanAssignment)
                    .filter(
                        LoanAssignment.employee_context_id.in_(context_ids),
                        LoanAssignment.loan_type_id == loan_type.id,
                    )
                    .all()
                )

            assignment_by_context_id = {
                assignment.employee_context_id: assignment
                for assignment in assignments
            }

            agents = []

            # 7. Build the response.
            for agent_context in permissioned_contexts:

                agent = employees_by_id.get(agent_context.employee_id)

                if agent is None:
                    # logger.warning(
                    #     "[LoanAssignment Debug] Employee not found for "
                    #     "context_id=%s, employee_id=%s",
                    #     agent_context.id,
                    #     agent_context.employee_id,
                    # )
                    continue

                assignment = assignment_by_context_id.get(agent_context.id)

                assigned = (
                    assignment is not None
                    and assignment.status == LoanAssignmentStatus.active
                )

                agents.append({
                    "employee_context_id": agent_context.id,
                    "employee_id": agent.id,
                    "name": agent.name,
                    "assigned": assigned,
                })

            response.append({
                "id": loan_type.id,
                "name": loan_type.name,
                "permission": permission_code,
                "agents": agents,
            })

        return response

    # ======================================================================
    # TOGGLE LOAN ASSIGNMENT
    # ======================================================================

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

        # 1. Verify loan type.
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
            raise ValueError("Loan type not found or inactive.")

        # 2. Resolve its required permission.
        permission_code = cls._get_permission_code(loan_type)

        if not permission_code:
            raise ValueError(
                "No assignment permission is configured for this loan type."
            )

        # 3. Get visible agent contexts.
        visible_agents = AccessControl.get_visible_agents(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        visible_context_ids = {
            ctx.id for ctx in visible_agents
        }

        # 4. Find the target context.
        target_context = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.id == employee_context_id,
                EmployeeContext.is_active.is_(True),
                EmployeeContext.deleted_at.is_(None),
            )
            .first()
        )

        if not target_context:
            raise ValueError("Employee context not found or inactive.")

        # 5. Validate the exact context ID against visible agent contexts.
        if target_context.id not in visible_context_ids:
            raise ValueError(
                "You are not allowed to modify this agent's assignment."
            )

        # 6. Verify the target context has the loan permission.
        permissioned_contexts = cls._get_permissioned_agent_contexts(
            db=db,
            agent_contexts=[target_context],
            permission_code=permission_code,
        )

        if not permissioned_contexts:
            raise ValueError(
                "This agent does not have the required loan assignment permission."
            )

        # 7. Resolve the context of the employee performing the action.
        action_context = None

        if context_id is not None:
            action_context = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.id == context_id,
                    EmployeeContext.employee_id == employee.id,
                    EmployeeContext.is_active.is_(True),
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )

        if action_context is None:
            action_context = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.employee_id == employee.id,
                    EmployeeContext.is_active.is_(True),
                    EmployeeContext.is_default.is_(True),
                    EmployeeContext.deleted_at.is_(None),
                )
                .first()
            )

        if action_context is None:
            active_contexts = (
                db.query(EmployeeContext)
                .filter(
                    EmployeeContext.employee_id == employee.id,
                    EmployeeContext.is_active.is_(True),
                    EmployeeContext.deleted_at.is_(None),
                )
                .all()
            )

            if len(active_contexts) == 1:
                action_context = active_contexts[0]

        if action_context is None:
            raise ValueError(
                "No valid active employee context was found. "
                "Please select an active context or configure a default context."
            )

        action_by_id = action_context.id

        # 8. Find the existing assignment.
        assignment = (
            db.query(LoanAssignment)
            .filter(
                LoanAssignment.employee_context_id == employee_context_id,
                LoanAssignment.loan_type_id == loan_type_id,
            )
            .first()
        )

        # 9. Update or create the assignment.
        if assignment:
            assignment.status = status
            assignment.deleted_at = None
            assignment.action_by = action_by_id
        else:
            assignment = LoanAssignment(
                employee_context_id=employee_context_id,
                loan_type_id=loan_type_id,
                status=status,
                action_by=action_by_id,
            )
            db.add(assignment)

        # 10. Save.
        try:
            db.commit()
            db.refresh(assignment)
        except Exception:
            db.rollback()
            raise

        return {
            "id": assignment.id,
            "employee_context_id": assignment.employee_context_id,
            "loan_type_id": assignment.loan_type_id,
            "status": assignment.status,
            "assigned": (
                assignment.status == LoanAssignmentStatus.active
            ),
        }
