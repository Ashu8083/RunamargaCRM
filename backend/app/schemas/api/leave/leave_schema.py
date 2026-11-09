# backend/app/schemas/api/leave/leave_schema.py

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ApplyLeaveRequest(BaseModel):

    from_date: date = Field(description="Leave start date (YYYY-MM-DD).")
    to_date: date = Field(description="Leave end date (YYYY-MM-DD). Same as from_date for single day.")
    leave_type: Literal["Full Day Leave", "Half Day Leave", "WFH"] = Field(description="Type of leave.")
    reason: str = Field(min_length=1, description="Reason for the leave request.")

    @model_validator(mode="after")
    def check_dates(self):
        if self.to_date < self.from_date:
            raise ValueError("to_date cannot be before from_date.")
        if not self.reason.strip():
            raise ValueError("Reason cannot be empty.")
        return self


class ApplyLeaveResponse(BaseModel):

    message: str = "Leave request submitted successfully."
    employee_id: int
    employee_name: str | None = None
    from_date: str
    to_date: str
    days: int
    leave_type: str
    reason: str
    status: str



# ------------------------------------------------------------------------
# RESPONSE — Single leave record (used in list)
# ------------------------------------------------------------------------

class LeaveRecordResponse(BaseModel):

    employee_id: int
    employee_name: str | None = None
    from_date: str
    to_date: str
    days: int
    leave_type: str
    reason: str
    status: str = Field(description="'Pending', 'Approved', or 'Rejected'.")




# ------------------------------------------------------------------------
# RESPONSE — Paginated leave history
# ------------------------------------------------------------------------

class LeaveHistoryResponse(BaseModel):

    total: int
    page: int
    limit: int
    total_pages: int
    data: list[LeaveRecordResponse]
