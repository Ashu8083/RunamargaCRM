from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from app.schemas.CallAnalytics.call_logs_scheema import CallLogsCreateSchema
from app.config.database import get_db
from app.models.employees import Employee
from app.controllers.CallManagement.call_logs_controller import (
    get_call_logs,
    get_call_history,
    create_call_logs,
)
from app.core.security import get_current_employee


router = APIRouter(
    prefix="/call-logs-apk",
    tags=["Call Logs API"],
    responses={}
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def cal_logs_create(
    call_log_schema : CallLogsCreateSchema,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    call_logs = create_call_logs(db, employee, call_log_schema)

    return call_logs
