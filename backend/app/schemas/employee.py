# app/schemas/employee.py
from datetime import datetime
from typing import Optional
from fastapi import Form
from pydantic import BaseModel, EmailStr, Field


class EmployeeContextCreate(BaseModel):
    context_id: int
    is_default: bool = False
    reports_to_id: Optional[int] = None
    permission_ids: list[int] = Field(default_factory=list)


class CreateEmployeeRequest(BaseModel):
    name: str

    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    role_id: int
    reports_to_id: Optional[int] = None
    status: str = "active"

    date_of_birth: Optional[datetime] = None
    joining_date: Optional[datetime] = None
    designation: Optional[str] = None
    shift_type: Optional[str] = None

    address: Optional[str] = None

    current_ctc: Optional[str] = None
    previous_ctc: Optional[str] = None

    blood_group: Optional[str] = None
    pan_no: Optional[str] = None
    aadhar_no: Optional[str] = None

    permission_ids: list[int] = Field(
        default_factory=list
    )
class UpdateEmployeeRequest(BaseModel):
    name: str

    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    role_id: int
    reports_to_id: Optional[int] = None
    status: str = "active"

    date_of_birth: Optional[datetime] = None
    joining_date: Optional[datetime] = None
    designation: Optional[str] = None
    shift_type: Optional[str] = None

    address: Optional[str] = None

    current_ctc: Optional[str] = None
    previous_ctc: Optional[str] = None

    blood_group: Optional[str] = None
    pan_no: Optional[str] = None
    aadhar_no: Optional[str] = None

    permission_ids: list[int] = Field(
        default_factory=list
    )