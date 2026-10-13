# backend/app/controllers/CallManagement/call_assignments_controller.py

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallManagement.call_assignment_service import (
    CallAssignmentService,
)
from app.core.access_control import AccessControl


# =============================================================
# GET CALL ASSIGNMENTS
# =============================================================

def get_call_assignments(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
):
    try:
        assignments = CallAssignmentService.get_all(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        data = []

        for assignment in assignments:
            data.append({
                "id": assignment.id,
                "phone_number": assignment.phone_number,

                # EmployeeContext ID
                "assigned_to_id": assignment.assigned_to_id,

                # Recipient's employee name
                "assigned_to_name": (
                    assignment.assigned_to.employee.name
                    if assignment.assigned_to
                    and assignment.assigned_to.employee
                    else None
                ),

                # EmployeeContext ID
                "assigned_by_id": assignment.assigned_by_id,

                # Creator's employee name
                "assigned_by_name": (
                    assignment.assigned_by.employee.name
                    if assignment.assigned_by
                    and assignment.assigned_by.employee
                    else None
                ),

                "status": (
                    assignment.status.value
                    if assignment.status
                    else None
                ),

                "created_at": assignment.created_at,
                "updated_at": assignment.updated_at,
                "deleted_at": assignment.deleted_at,
            })

        return {
            "success": True,
            "data": data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =============================================================
# CREATE CALL ASSIGNMENT
# =============================================================

def create_call_assignment(
    db: Session,
    employee: Employee,
    phone_number: str,
    assigned_to_id: int,
    context_id: int | None = None,
):
    try:
        # Resolve the caller's active EmployeeContext.
        current_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not current_context:
            raise HTTPException(
                status_code=400,
                detail="Active employee context not found.",
            )

        assignment = CallAssignmentService.create(
            db=db,
            employee=employee,
            phone_number=phone_number,
            assigned_to_id=assigned_to_id,
            context_id=current_context.id,
        )

        return {
            "success": True,
            "data": {
                "id": assignment.id,
                "phone_number": assignment.phone_number,

                # Both values are EmployeeContext IDs.
                "assigned_to_id": assignment.assigned_to_id,
                "assigned_by_id": assignment.assigned_by_id,

                "assigned_to_name": (
                    assignment.assigned_to.employee.name
                    if assignment.assigned_to
                    and assignment.assigned_to.employee
                    else None
                ),

                "assigned_by_name": (
                    assignment.assigned_by.employee.name
                    if assignment.assigned_by
                    and assignment.assigned_by.employee
                    else None
                ),

                "status": (
                    assignment.status.value
                    if assignment.status
                    else None
                ),

                "created_at": assignment.created_at,
            },
        }

    except HTTPException:
        db.rollback()
        raise

    except ValueError as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except PermissionError as e:
        db.rollback()
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =============================================================
# GET AVAILABLE CALL NUMBERS
# =============================================================

def get_available_call_numbers(
    db: Session,
    employee: Employee,
):
    try:
        return CallAssignmentService.get_available_call_numbers(
            db=db,
            employee=employee,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# =============================================================
# EXCHANGE CALL ASSIGNMENT
# =============================================================

async def exchange_assignment(
    request: Request,
    db: Session,
    payload: dict,
    employee: Employee,
    context_id: int | None = None,
):
    try:
        assignment_id = payload.get("assignmentId")
        new_agent_id = payload.get("newAgentId")

        if not assignment_id or not new_agent_id:
            raise HTTPException(
                status_code=400,
                detail="assignmentId and newAgentId are required",
            )

        try:
            assignment_id = int(assignment_id)
            new_agent_id = int(new_agent_id)

        except (TypeError, ValueError):
            raise HTTPException(
                status_code=400,
                detail=(
                    "assignmentId and newAgentId "
                    "must be valid integers"
                ),
            )

        current_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
            context_id=context_id,
        )

        if not current_context:
            raise HTTPException(
                status_code=400,
                detail="Active employee context not found.",
            )

        assignment, previous_agent = (
            CallAssignmentService.exchange(
                db=db,
                employee=employee,
                assignment_id=assignment_id,
                new_agent_id=new_agent_id,
                context_id=current_context.id,
            )
        )

        return {
            "success": True,
            "message": "Assignment exchanged successfully",
            "updated_count": 1,
            "skipped_count": 0,

            "data": {
                "assignment_id": assignment.id,
                "phone_number": assignment.phone_number,

                "assignment_ids": [
                    assignment.id,
                ],

                "phone_numbers": [
                    assignment.phone_number,
                ],

                "skipped_assignment_ids": [],

                # Previous recipient's EmployeeContext ID
                "previous_agent_id": (
                    previous_agent.id
                    if previous_agent
                    else None
                ),

                "previous_agent_name": (
                    previous_agent.employee.name
                    if previous_agent
                    and previous_agent.employee
                    else None
                ),

                # New recipient's EmployeeContext ID
                "new_agent_id": assignment.assigned_to_id,

                "new_agent_name": (
                    assignment.assigned_to.employee.name
                    if assignment.assigned_to
                    and assignment.assigned_to.employee
                    else None
                ),

                "updated_at": assignment.updated_at,
            },
        }

    except HTTPException:
        db.rollback()
        raise

    except ValueError as e:
        db.rollback()
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except PermissionError as e:
        db.rollback()
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to exchange assignment: {str(e)}",
        )


# =============================================================
# DELETE CALL ASSIGNMENT
# =============================================================

async def delete_call_assignment(
    request: Request,
    db: Session,
    assignment_id: int,
    employee: Employee,
):
    try:
        assignment = CallAssignmentService.delete(
            db=db,
            employee=employee,
            assignment_id=assignment_id,
        )

        return {
            "success": True,
            "message": "Assignment deleted successfully",
            "data": {
                "assignment_id": assignment.id,
                "phone_number": assignment.phone_number,
            },
        }

    except ValueError as e:
        db.rollback()
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except PermissionError as e:
        db.rollback()
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete assignment: {str(e)}",
        )