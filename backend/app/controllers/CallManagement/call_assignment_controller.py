# backend/app/controllers/CallManagement/call_assignments_controller.py

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallManagement.call_assignment_service import (
    CallAssignmentService,
)


# =============================================================
# GET CALL ASSIGNMENTS
# =============================================================

def get_call_assignments(
    db: Session,
    employee: Employee,
):
    try:
        assignments = CallAssignmentService.get_all(
            db=db,
            employee=employee,
        )

        data = []

        for assignment in assignments:
            data.append({
                "id": assignment.id,
                "phone_number": assignment.phone_number,

                "assigned_to_id": assignment.assigned_to_id,

                "assigned_to_name": (
                    assignment.assigned_to.name
                    if assignment.assigned_to
                    else None
                ),

                "assigned_by_id": assignment.assigned_by_id,

                "assigned_by_name": (
                    assignment.assigned_by.name
                    if assignment.assigned_by
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
):
    try:
        assignment = CallAssignmentService.create(
            db=db,
            employee=employee,
            phone_number=phone_number,
            assigned_to_id=assigned_to_id,
        )

        return {
            "success": True,
            "data": {
                "id": assignment.id,
                "phone_number": assignment.phone_number,
                "assigned_to_id": assignment.assigned_to_id,
                "assigned_by_id": assignment.assigned_by_id,

                "status": (
                    assignment.status.value
                    if assignment.status
                    else None
                ),

                "created_at": assignment.created_at,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except PermissionError as e:
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
                detail="assignmentId and newAgentId must be valid integers",
            )

        assignment, previous_agent = (
            CallAssignmentService.exchange(
                db=db,
                employee=employee,
                assignment_id=assignment_id,
                new_agent_id=new_agent_id,
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

                "previous_agent_id": (
                    previous_agent.id
                    if previous_agent
                    else None
                ),

                "previous_agent_name": (
                    previous_agent.name
                    if previous_agent
                    else None
                ),

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