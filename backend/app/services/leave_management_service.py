# backend/app/services/leave_management_service.py

from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.access_control import AccessControl
from app.models.employees import Employee
from app.models.leave_managements import LeaveManagement
from app.schemas.leave_management_schema import (
    LeaveManagementCreate,
    LeaveManagementReview,
)


def _leave_to_response(leave: LeaveManagement, employee_name: str | None = None):
    """
    Convert a LeaveManagement ORM object to a response dictionary
    and include the employee's name.
    """
    response = {
        column.name: getattr(leave, column.name)
        for column in LeaveManagement.__table__.columns
    }

    response["employee_name"] = employee_name
    return response


def create_leave_request(
    db: Session,
    employee: Employee,
    data: LeaveManagementCreate,
    context_id: int | None = None,
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="leave:create",
        context_id=context_id,
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    leave = LeaveManagement(
        applied_by=employee.id,
        from_date=data.from_date,
        to_date=data.to_date,
        leave_type=data.leave_type,
        reason=data.reason.strip(),
        status="Pending",
    )

    try:
        db.add(leave)
        db.commit()
        db.refresh(leave)

        return _leave_to_response(
            leave=leave,
            employee_name=getattr(employee, "name", None),
        )
    except Exception:
        db.rollback()
        raise


def get_leave_requests(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
    team_lead_context_id: int | None = None,
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="leave:view",
        context_id=context_id,
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    visible_agents = AccessControl.get_visible_agents(
        db=db,
        employee=employee,
        context_id=context_id,
        team_lead_context_id=team_lead_context_id,
    )

    visible_rms = AccessControl.get_visible_rms(
        db=db,
        employee=employee,
        context_id=context_id,
        team_lead_context_id=team_lead_context_id,
    )

    # AccessControl returns EmployeeContext objects.
    # LeaveManagement.applied_by references Employee.id,
    # not EmployeeContext.id.
    visible_employee_ids = {
        context.employee_id
        for context in [*(visible_agents or []), *(visible_rms or [])]
        if context.employee_id is not None
    }

    # Include the current employee's own leave requests.
    visible_employee_ids.add(employee.id)

    # Join Employee so the API returns the employee's name.
    rows = (
        db.query(LeaveManagement, Employee)
        .join(
            Employee,
            LeaveManagement.applied_by == Employee.id,
        )
        .filter(
            LeaveManagement.applied_by.in_(visible_employee_ids)
        )
        .order_by(LeaveManagement.created_at.desc())
        .all()
    )

    return [
        _leave_to_response(
            leave=leave,
            employee_name=getattr(requester, "name", None),
        )
        for leave, requester in rows
    ]


def review_leave_request(
    db: Session,
    employee: Employee,
    leave_id: int,
    data: LeaveManagementReview,
    context_id: int | None = None,
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="leave:update",
        context_id=context_id,
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    reviewer_context = AccessControl.get_active_context(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    if not reviewer_context:
        raise HTTPException(
            status_code=403,
            detail="No active employee context found",
        )

    leave = (
        db.query(LeaveManagement)
        .filter(LeaveManagement.id == leave_id)
        .with_for_update()
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave request not found",
        )

    if leave.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending leave requests can be reviewed",
        )

    if leave.applied_by == employee.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot review your own leave request",
        )

    visible_agents = AccessControl.get_visible_agents(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    visible_rms = AccessControl.get_visible_rms(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    visible_employee_ids = {
        context.employee_id
        for context in [*(visible_agents or []), *(visible_rms or [])]
        if context.employee_id is not None
    }

    if leave.applied_by not in visible_employee_ids:
        raise HTTPException(
            status_code=403,
            detail="You cannot review leave requests outside your hierarchy",
        )

    leave.status = data.status
    leave.approved_by = reviewer_context.id
    leave.reviewed_at = datetime.now(timezone.utc)
    leave.review_remarks = (
        data.review_remarks.strip()
        if data.review_remarks and data.review_remarks.strip()
        else None
    )

    try:
        db.commit()
        db.refresh(leave)

        requester = (
            db.query(Employee)
            .filter(Employee.id == leave.applied_by)
            .first()
        )

        return _leave_to_response(
            leave=leave,
            employee_name=getattr(requester, "name", None),
        )
    except Exception:
        db.rollback()
        raise