# backend/app/schemas/leave_management_schema.py

from datetime import date, datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    computed_field,
    model_validator,
)


class LeaveManagementCreate(BaseModel):
    from_date: date
    to_date: date
    leave_type: Literal["Full Day Leave", "WFH"]
    reason: str = Field(..., min_length=1)

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.to_date < self.from_date:
            raise ValueError("to_date cannot be before from_date")

        if not self.reason.strip():
            raise ValueError("Reason cannot be empty")

        return self


class LeaveManagementReview(BaseModel):
    status: Literal["Approved", "Rejected"]
    review_remarks: str | None = None


class LeaveManagementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    applied_by: int
    employee_name: str | None = None

    from_date: date
    to_date: date
    leave_type: str
    reason: str
    status: str

    approved_by: int | None = None
    reviewed_at: datetime | None = None
    review_remarks: str | None = None

    created_at: datetime
    updated_at: datetime | None = None

    @computed_field
    @property
    def days(self) -> int:
        return (self.to_date - self.from_date).days + 1