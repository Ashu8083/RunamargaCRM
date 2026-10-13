# backend/app/controllers/CallManagement/call_logs_controller.py

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.services.CallManagement.call_log_service import CallLogService


def get_call_logs(
    db: Session,
    employee: Employee,
):
    call_logs = CallLogService.get_all(
        db=db,
        employee=employee,
    )

    data = []

    for call in call_logs:
        data.append({
            "id": call.id,

            "employee_id": call.employee_id,

            "employee_name": (
                call.employee.name
                if call.employee
                else None
            ),

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

            "recording_path": call.recording_path,

            "recording_size_kb": call.recording_size_kb,

            "recording_duration_seconds":
                call.recording_duration_seconds,

            "attended_at": call.attended_at,

            "attended_by": call.attended_by,

            "remarks": call.remarks,

            "created_at": call.created_at,

            "updated_at": call.updated_at,
        })

    return {
        "success": True,
        "data": data,
    }


def get_call_history(
    db: Session,
    employee: Employee,
    phone_number: str,
):
    call_logs = CallLogService.get_history(
        db=db,
        employee=employee,
        phone_number=phone_number,
    )

    data = []

    for call in call_logs:
        data.append({
            "id": call.id,

            "employee_id": call.employee_context_id,

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

            "duration_seconds":
                call.duration_seconds,

           

            "attended_at":
                call.attended_at,


            "created_at":
                call.created_at,

            "updated_at":
                call.updated_at,
        })

    return {
        "success": True,
        "data": data,
    }