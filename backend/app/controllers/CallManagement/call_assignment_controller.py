from fastapi import HTTPException, Request
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.call_assignments import CallAssignment
from app.models.call_logs import CallLog
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication


# =============================================================
# GET CALL ASSIGNMENTS
# =============================================================

def get_call_assignments(
    db: Session,
    employee: Employee,
):
    query = (
        db.query(CallAssignment)
        .join(
            Employee,
            Employee.id == CallAssignment.assigned_to_id,
            isouter=True,
        )
        .filter(
            CallAssignment.deleted_at.is_(None),
        )
    )

    # ---------------------------------------------------------
    # Apply centralized access-control scope
    # ---------------------------------------------------------

    query = AccessControl.apply_call_assignment_scope(
        query=query,
        db=db,
        employee=employee,
    )

    assignments = (
        query
        .order_by(
            CallAssignment.created_at.desc(),
            CallAssignment.id.desc(),
        )
        .all()
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


# =============================================================
# CREATE CALL ASSIGNMENT
# =============================================================

def create_call_assignment(
    db: Session,
    employee: Employee,
    phone_number: str,
    assigned_to_id: int,
):
    # ---------------------------------------------------------
    # GET TARGET EMPLOYEE
    # ---------------------------------------------------------

    assigned_to = (
        db.query(Employee)
        .filter(
            Employee.id == assigned_to_id,
        )
        .first()
    )

    if not assigned_to:
        raise HTTPException(
            status_code=404,
            detail="Assigned employee not found",
        )

    # ---------------------------------------------------------
    # CHECK WHETHER CURRENT EMPLOYEE CAN ASSIGN
    # ---------------------------------------------------------
    #
    # AccessControl owns the hierarchy rules.
    # The controller does not determine GLOBAL/RM/AGENT/etc.
    #

    if not AccessControl.can_assign_call_to_employee(
        db=db,
        employee=employee,
        target_employee=assigned_to,
    ):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to assign calls to this employee.",
        )

    # ---------------------------------------------------------
    # PREVENT DUPLICATE ACTIVE ASSIGNMENTS
    # ---------------------------------------------------------

    existing_assignment = (
        db.query(CallAssignment)
        .filter(
            CallAssignment.phone_number == phone_number,
            CallAssignment.deleted_at.is_(None),
            CallAssignment.assigned_to_id.isnot(None),
        )
        .first()
    )

    if existing_assignment:
        raise HTTPException(
            status_code=409,
            detail="This phone number is already assigned.",
        )

    # ---------------------------------------------------------
    # CREATE ASSIGNMENT
    # ---------------------------------------------------------

    assignment = CallAssignment(
        phone_number=phone_number,
        assigned_to_id=assigned_to_id,
        assigned_by_id=employee.id,
        status="received",
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

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


# =============================================================
# GET AVAILABLE CALL NUMBERS
# =============================================================

def get_available_call_numbers(
    db: Session,
    employee: Employee,
):
    # ---------------------------------------------------------
    # Find the FIRST call occurrence for every phone number
    # ---------------------------------------------------------

    first_call_subquery = (
        db.query(
            CallLog.phone_number.label("phone_number"),

            func.row_number()
            .over(
                partition_by=CallLog.phone_number,
                order_by=(
                    CallLog.call_started_at.asc(),
                    CallLog.id.asc(),
                ),
            )
            .label("row_number"),
        )
        .subquery()
    )

    # ---------------------------------------------------------
    # First occurrence must be MISSED
    # ---------------------------------------------------------

    query = (
        db.query(CallLog)
        .join(
            first_call_subquery,
            first_call_subquery.c.phone_number
            == CallLog.phone_number,
        )
        .filter(
            first_call_subquery.c.row_number == 1,
            CallLog.mobile_status == "missed",
        )
    )

    # ---------------------------------------------------------
    # Apply centralized call-log access-control scope
    # ---------------------------------------------------------

    query = AccessControl.apply_call_log_scope(
        query=query,
        db=db,
        employee=employee,
    )

    # ---------------------------------------------------------
    # Exclude phone numbers already in loan applications
    # ---------------------------------------------------------

    application_numbers = (
        db.query(LoanApplication.phone_number)
        .filter(
            LoanApplication.phone_number.isnot(None),
        )
        .distinct()
        .all()
    )

    application_numbers = {
        row[0]
        for row in application_numbers
    }

    # ---------------------------------------------------------
    # Get eligible first missed calls
    # ---------------------------------------------------------

    call_logs = (
        query
        .order_by(
            CallLog.call_started_at.asc(),
            CallLog.id.asc(),
        )
        .all()
    )

    data = []

    for call in call_logs:

        # -----------------------------------------------------
        # Number already exists in loan applications
        # -----------------------------------------------------

        if call.phone_number in application_numbers:
            continue

        data.append({
            "id": call.id,
            "phone_number": call.phone_number,

            "call_type": (
                call.call_type.value
                if call.call_type
                else None
            ),

            "mobile_status": (
                call.mobile_status.value
                if call.mobile_status
                else None
            ),

            "call_started_at": call.call_started_at,
            "call_ended_at": call.call_ended_at,
            "duration_seconds": call.duration_seconds,
            "employee_id": call.employee_id,

            "employee_name": (
                call.employee.name
                if call.employee
                else None
            ),
        })

    return {
        "success": True,
        "data": data,
    }


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
        # ---------------------------------------------------------
        # GET PAYLOAD
        # ---------------------------------------------------------

        assignment_id = payload.get("assignmentId")
        new_agent_id = payload.get("newAgentId")

        if not assignment_id or not new_agent_id:
            raise HTTPException(
                status_code=400,
                detail="assignmentId and newAgentId are required",
            )

        # ---------------------------------------------------------
        # MAKE SURE IDs ARE INTEGERS
        # ---------------------------------------------------------

        try:
            assignment_id = int(assignment_id)
            new_agent_id = int(new_agent_id)

        except (TypeError, ValueError):
            raise HTTPException(
                status_code=400,
                detail="assignmentId and newAgentId must be valid integers",
            )

        # ---------------------------------------------------------
        # GET CURRENT ASSIGNMENT
        # ---------------------------------------------------------

        assignment = (
            db.query(CallAssignment)
            .filter(
                CallAssignment.id == assignment_id,
                CallAssignment.deleted_at.is_(None),
            )
            .first()
        )

        if not assignment:
            raise HTTPException(
                status_code=404,
                detail="Call assignment not found",
            )

        # ---------------------------------------------------------
        # CHECK ACCESS TO CURRENT ASSIGNMENT
        # ---------------------------------------------------------
        #
        # AccessControl determines whether the current employee
        # can access this assignment.
        #

        visible_assignment = (
            AccessControl.apply_call_assignment_scope(
                query=db.query(CallAssignment).filter(
                    CallAssignment.id == assignment_id,
                    CallAssignment.deleted_at.is_(None),
                ),
                db=db,
                employee=employee,
            )
            .first()
        )

        if not visible_assignment:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to exchange this assignment.",
            )

        # ---------------------------------------------------------
        # GET NEW ASSIGNED EMPLOYEE
        # ---------------------------------------------------------

        new_agent = (
            db.query(Employee)
            .filter(
                Employee.id == new_agent_id,
            )
            .first()
        )

        if not new_agent:
            raise HTTPException(
                status_code=404,
                detail="Assigned employee not found",
            )

        # ---------------------------------------------------------
        # CHECK ACCESS TO NEW EMPLOYEE
        # ---------------------------------------------------------
        #
        # AccessControl owns the hierarchy rules.
        #

        if not AccessControl.can_assign_call_to_employee(
            db=db,
            employee=employee,
            target_employee=new_agent,
        ):
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to assign calls to this employee.",
            )

        # ---------------------------------------------------------
        # PREVIOUS ASSIGNED EMPLOYEE
        # ---------------------------------------------------------

        previous_agent_id = assignment.assigned_to_id

        previous_agent = None

        if previous_agent_id:
            previous_agent = (
                db.query(Employee)
                .filter(
                    Employee.id == previous_agent_id,
                )
                .first()
            )

        previous_agent_name = (
            previous_agent.name
            if previous_agent
            else None
        )

        # ---------------------------------------------------------
        # EXCHANGE ASSIGNMENT
        # ---------------------------------------------------------

        assignment.assigned_to_id = new_agent_id
        assignment.assigned_by_id = employee.id

        db.commit()
        db.refresh(assignment)

        # ---------------------------------------------------------
        # RESPONSE
        # ---------------------------------------------------------

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

                "previous_agent_id":
                    previous_agent_id,

                "previous_agent_name":
                    previous_agent_name,

                "new_agent_id":
                    new_agent.id,

                "new_agent_name":
                    new_agent.name,

                "updated_at":
                    assignment.updated_at,
            },
        }

    except HTTPException:
        db.rollback()
        raise

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
        # ---------------------------------------------------------
        # GET ASSIGNMENT
        # ---------------------------------------------------------

        assignment = (
            db.query(CallAssignment)
            .filter(
                CallAssignment.id == assignment_id,
                CallAssignment.deleted_at.is_(None),
            )
            .first()
        )

        if not assignment:
            raise HTTPException(
                status_code=404,
                detail="Call assignment not found",
            )

        # ---------------------------------------------------------
        # CHECK ACCESS
        # ---------------------------------------------------------
        #
        # AccessControl determines whether this assignment is
        # visible to the current employee.
        #

        visible_assignment = (
            AccessControl.apply_call_assignment_scope(
                query=db.query(CallAssignment).filter(
                    CallAssignment.id == assignment_id,
                    CallAssignment.deleted_at.is_(None),
                ),
                db=db,
                employee=employee,
            )
            .first()
        )

        if not visible_assignment:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to delete this assignment.",
            )

        # ---------------------------------------------------------
        # SOFT DELETE
        # ---------------------------------------------------------

        from datetime import datetime

        now = datetime.utcnow()

        assignment.deleted_at = now
        assignment.updated_at = now

        db.commit()
        db.refresh(assignment)

        # ---------------------------------------------------------
        # RESPONSE
        # ---------------------------------------------------------

        return {
            "success": True,
            "message": "Assignment deleted successfully",

            "data": {
                "assignment_id":
                    assignment.id,

                "phone_number":
                    assignment.phone_number,
            },
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete assignment: {str(e)}",
        )