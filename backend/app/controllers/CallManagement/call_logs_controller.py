# backend/app/controllers/CallManagement/call_logs_controller.py

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.call_logs import CallLog
from app.models.employees import Employee
from app.core.access_control import AccessControl

def get_call_logs(
    db: Session,
    employee: Employee,
):
    call_logs = (
        db.query(CallLog)
        .join(
            Employee,
            Employee.id == CallLog.employee_id,
        )
        .filter(
            CallLog.employee_id == employee.id,
        )
        .order_by(
            CallLog.call_started_at.desc(),
            CallLog.id.desc(),
        )
        .all()
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

            "duration_seconds":
                call.duration_seconds,

            "recording_path":
                call.recording_path,

            "recording_size_kb":
                call.recording_size_kb,

            "recording_duration_seconds":
                call.recording_duration_seconds,

            "attended_at":
                call.attended_at,

            "attended_by":
                call.attended_by,

            "remarks":
                call.remarks,

            "created_at":
                call.created_at,

            "updated_at":
                call.updated_at,
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
    query = (
        db.query(CallLog)
        .filter(
            CallLog.phone_number == phone_number,
        )
    )

    query = AccessControl.apply_call_log_scope(
        query=query,
        db=db,
        employee=employee,
    )

    call_logs = (
        query
        .order_by(
            CallLog.call_started_at.desc(),
            CallLog.id.desc(),
        )
        .all()
    )

    data = []

    for call in call_logs:
        data.append({
            "id": call.id,
            "employee_id": call.employee_id,
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