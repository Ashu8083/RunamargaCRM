# backend/app/controllers/CallManagement/call_logs_controller.py

from datetime import date
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.schemas.CallAnalytics.call_logs_scheema import CallLogsCreateSchema,CallLogsResponseSchema
from app.services.api.CallManagement.call_log_service import CallLogService


def _pagination(page, page_size, total_records):
    total_pages = (
        (total_records + page_size - 1) // page_size
        if total_records
        else 0
    )

    return {
        "page": page,
        "page_size": page_size,
        "total_records": total_records,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1 and total_pages > 0,
    }


def _serialize_call_log(call, total_calls=None):
    employee_context = call.employee_context
    assigned_employee = (
        employee_context.employee
        if employee_context
        else None
    )
    context = (
        employee_context.context
        if employee_context
        else None
    )

    return {
        "id": call.id,
        "employee_id": (
            employee_context.employee_id
            if employee_context
            else None
        ),
        "employee_context_id": call.employee_context_id,
        "employee_name": (
            assigned_employee.name
            if assigned_employee
            else None
        ),
        "context_name": context.name if context else None,
        "phone_id": call.phone_id,
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
        "attended_at": call.attended_at,
        "created_at": call.created_at,
        "updated_at": call.updated_at,
        "total_calls": total_calls,
    }


def get_call_logs(
    db: Session,
    employee: Employee,
    context_id: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
    agent_id: Optional[int] = None,
    employee_id: Optional[int] = None,
    employee_context_id: Optional[int] = None,
    call_type: Optional[str] = None,
    mobile_status: Optional[str] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
):
    try:
        rows, total_records = CallLogService.get_all(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            page=page,
            page_size=page_size,
            agent_id=agent_id,
            employee_id=employee_id,
            employee_context_id=employee_context_id,
            call_type=call_type,
            mobile_status=mobile_status,
            from_date=from_date,
            to_date=to_date,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "success": True,
        "data": [
            _serialize_call_log(call, total_calls)
            for call, total_calls in rows
        ],
        "pagination": _pagination(
            page,
            page_size,
            total_records,
        ),
    }


def get_call_history(
    db: Session,
    employee: Employee,
    phone_number: str,
    context_id: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
    agent_id: Optional[int] = None,
    employee_id: Optional[int] = None,
    employee_context_id: Optional[int] = None,
    call_type: Optional[str] = None,
    mobile_status: Optional[str] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
):
    try:
        rows, total_records = CallLogService.get_history(
            db=db,
            employee=employee,
            phone_number=phone_number,
            context_id=context_id,
            search=search,
            page=page,
            page_size=page_size,
            agent_id=agent_id,
            employee_id=employee_id,
            employee_context_id=employee_context_id,
            call_type=call_type,
            mobile_status=mobile_status,
            from_date=from_date,
            to_date=to_date,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "success": True,
        "data": [
            _serialize_call_log(call, total_calls)
            for call, total_calls in rows
        ],
        "pagination": _pagination(
            page,
            page_size,
            total_records,
        ),
    }


def create_call_logs(
    db: Session,
    employee: Employee,
    call_log_schema: CallLogsCreateSchema,
):
    try:
        call_log = CallLogService.create_call_log(
            db=db,
            employee=employee,
            call_log_schema=call_log_schema,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=403,
            detail=str(exc),
        ) from exc
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to save the call log.",
        ) from exc

    return _serialize_call_log(call_log)
