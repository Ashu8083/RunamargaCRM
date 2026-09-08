from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.Enums.GenderEnum import Gender




class EmployeeProfileResponse(BaseModel):

    name: str
    email: str
    phone  : str
    role: str
    employee_code: str
    gender: Gender | None = None
    joining_date: datetime | None = None
    aadhar_card: str | None = None
    pan_card: str | None = None
