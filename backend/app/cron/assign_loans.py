# cron/assign_loans.py

import logging
import random

from sqlalchemy.orm import Session

from app.config.database import SessionLocal

from app.models.loan_applications import LoanApplication, LoanStatus
from app.models.loan_assignments import (
    LoanAssignment,
    LoanAssignmentStatus,
)
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission
from app.models.permissions import Permission

from app.core.access_control import AccessControl


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# =========================================================
# LOAN TYPE -> REQUIRED PERMISSION
# =========================================================

def get_loan_permission_code(loan_type_name: str) -> str:
    """
    Convert the loan type name into its required permission code.

    Example:
        Personal Loan -> loans:personal_loan:view

    IMPORTANT:
    The generated code must match the permission codes
    actually stored in your permissions table.
    """

    normalized_name = "_".join(loan_type_name.strip().lower().split())

    return f"loans:{normalized_name}:view"


# =========================================================
# GET ELIGIBLE AGENTS
# =========================================================

def get_eligible_agents(
    db: Session,
    application: LoanApplication,
) -> list[EmployeeContext]:
    """
    Return agents eligible for this specific loan application.

    Requirements:
        1. Agent must be visible to the application creator.
        2. Agent must have an active LoanAssignment for the
           application's exact loan type.
        3. LoanAssignment must not be soft-deleted.
        4. Agent must have the required active permission.
    """

    if not application.applied_by_context_id:
        logger.warning(
            "Application %s has no applied_by_context_id",
            application.id,
        )
        return []

    if not application.loan_type_id:
        logger.warning(
            "Application %s has no loan_type_id",
            application.id,
        )
        return []

    # -----------------------------------------------------
    # 1. Get the context that created the application.
    # -----------------------------------------------------

    creator_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.id == application.applied_by_context_id
        )
        .first()
    )

    if not creator_context:
        logger.warning(
            "Creator context %s not found for application %s",
            application.applied_by_context_id,
            application.id,
        )
        return []

    # -----------------------------------------------------
    # 2. Get the employee associated with that context.
    # -----------------------------------------------------

    employee = (
        db.query(Employee)
        .filter(Employee.id == creator_context.employee_id)
        .first()
    )

    if not employee:
        logger.warning(
            "Employee not found for context %s",
            creator_context.id,
        )
        return []

    # -----------------------------------------------------
    # 3. Use your existing AccessControl visibility rules.
    # -----------------------------------------------------

    visible_agents = AccessControl.get_visible_agents(
        db=db,
        employee=employee,
        context_id=creator_context.id,
    )

    if not visible_agents:
        logger.info(
            "No visible agents for application %s",
            application.id,
        )
        return []

    visible_agent_ids = [agent.id for agent in visible_agents]

    # -----------------------------------------------------
    # 4. Get the required loan-type permission.
    # -----------------------------------------------------

    loan_type = application.loan_type

    if not loan_type or not loan_type.name:
        logger.warning(
            "Loan type not found for application %s",
            application.id,
        )
        return []

    required_permission_code = get_loan_permission_code(
        loan_type.name
    )

    # -----------------------------------------------------
    # 5. Find agents with the required permission and an
    #    active LoanAssignment for this exact loan type.
    # -----------------------------------------------------

    eligible_agents = (
        db.query(EmployeeContext)
        .join(
            EmployeeContextPermission,
            EmployeeContextPermission.employee_context_id
            == EmployeeContext.id,
        )
        .join(
            Permission,
            Permission.id == EmployeeContextPermission.permission_id,
        )
        .join(
            LoanAssignment,
            LoanAssignment.employee_context_id
            == EmployeeContext.id,
        )
        .filter(
            # Only agents visible to the application creator.
            EmployeeContext.id.in_(visible_agent_ids),

            # Required permission.
            Permission.code == required_permission_code,
            Permission.is_active.is_(True),

            # Exact loan type.
            LoanAssignment.loan_type_id == application.loan_type_id,

            # Only active assignments.
            LoanAssignment.status == LoanAssignmentStatus.active,
            LoanAssignment.deleted_at.is_(None),

            # Exclude soft-deleted contexts, if supported.
            EmployeeContext.deleted_at.is_(None),
        )
        .distinct()
        .all()
    )

    # print(eligible_agents)
    return eligible_agents


# =========================================================
# ASSIGN ONE APPLICATION
# =========================================================

def assign_application(
    db: Session,
    application: LoanApplication,
) -> bool:
    """
    Assign one unassigned loan application to an eligible agent.

    Returns:
        True  - application was assigned.
        False - no eligible agent was available.
    """

    # Prevent assigning an already assigned application.
    if application.agent_context_id is not None:
        return False

    eligible_agents = get_eligible_agents(
        db=db,
        application=application,
    )

    if not eligible_agents:
        logger.warning(
            "No eligible agents for application %s, loan_type_id=%s",
            application.id,
            application.loan_type_id,
        )
        return False

    # Randomly select one eligible agent.
    selected_agent = random.choice(eligible_agents)

    # Store EmployeeContext.id, not Employee.id.
    application.agent_context_id = selected_agent.id

    logger.info(
        "Application %s assigned to agent context %s",
        application.id,
        selected_agent.id,
    )

    return True


# =========================================================
# MAIN CRON JOB
# =========================================================

def run():
    logger.info("Starting automatic loan assignment cron")

    db: Session = SessionLocal()

    assigned_count = 0
    skipped_count = 0
    failed_count = 0

    try:
        # -------------------------------------------------
        # Fetch applications awaiting agent assignment.
        # -------------------------------------------------

        applications = (
            db.query(LoanApplication)
            .filter(
                LoanApplication.deleted_at.is_(None),
                LoanApplication.agent_context_id.is_(None),
                LoanApplication.applied_by_context_id.isnot(None),
                LoanApplication.loan_type_id.isnot(None),
                LoanApplication.status == LoanStatus.inprocess,
            )
            .order_by(LoanApplication.created_at.asc())
            .all()
        )

        logger.info(
            "Found %s unassigned applications",
            len(applications),
        )

        for application in applications:
            try:
                was_assigned = assign_application(
                    db=db,
                    application=application,
                )

                if was_assigned:
                    assigned_count += 1
                    db.commit()
                else:
                    skipped_count += 1
                    db.rollback()

            except Exception:
                db.rollback()
                failed_count += 1

                logger.exception(
                    "Failed to assign application %s",
                    application.id,
                )

        logger.info(
            "Loan assignment cron completed. "
            "Assigned=%s, skipped=%s, failed=%s",
            assigned_count,
            skipped_count,
            failed_count,
        )

    except Exception:
        db.rollback()
        logger.exception("Loan assignment cron failed")

    finally:
        db.close()


# =========================================================
# ENTRY POINT
# =========================================================

if __name__ == "__main__":
    run() 