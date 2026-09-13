# backend/app/controllers/CallManagement/call_assignment_controller.py

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.call_assignments import CallAssignment
from app.models.call_logs import CallLog
from app.models.employees import Employee
from app.models.loan_applications import LoanApplication


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


def create_call_assignment(
    db: Session,
    employee: Employee,
    phone_number: str,
    assigned_to_id: int,
):
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
    # Verify assignment target is visible to the current
    # employee through AccessControl
    # ---------------------------------------------------------

    visible_rms = AccessControl.get_visible_rms(
        db=db,
        employee=employee,
    )

    visible_rm_ids = {
        rm.id
        for rm in visible_rms
    }

    context_family = AccessControl.get_active_context_family(
        db=db,
        employee=employee,
    )

    if context_family == "GLOBAL":
        target_allowed = True

    elif context_family == "RM":
        target_allowed = assigned_to_id == employee.id

    elif context_family == "AGENT":
        target_allowed = assigned_to_id in visible_rm_ids

    elif context_family == "TEAMLEAD":
        target_allowed = assigned_to_id in visible_rm_ids

    elif context_family == "MANAGER":
        target_allowed = True

    else:
        target_allowed = False

    if not target_allowed:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to assign calls to this employee.",
        )
    # ---------------------------------------------------------
    # Prevent duplicate active assignments
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
    # Create assignment
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
    # Apply logged-in employee's access-control scope
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

        # Number already exists in loan applications
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