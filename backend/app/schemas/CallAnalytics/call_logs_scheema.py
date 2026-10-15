from datetime import datetime

from pydantic import BaseModel
from app.models.call_logs import CallTypeEnum, MobileStatusEnum

class CallLogsCreateSchema(BaseModel):
        phone_number: str
        call_type: CallTypeEnum
        mobile_status : MobileStatusEnum
        call_started_at: datetime
        call_ended_at: datetime
        duration_seconds: int
        attended_at : datetime
        phone_id : int
        employee_context_id: int


class CallLogsResponseSchema(BaseModel):

    phone_number: str
    call_type: CallTypeEnum
    mobile_status: MobileStatusEnum
    call_started_at: datetime
    call_ended_at: datetime
    duration_seconds: int
    attended_at: datetime
    employee_context_id: int




