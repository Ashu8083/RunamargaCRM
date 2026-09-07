from datetime import datetime

from pydantic import  BaseModel

from app.Enums.GenderEnum import Gender


class EmployeeDetailsResponse(BaseModel):

    gender : Gender
    joining_date : datetime
    aadhar_card : str
    pan_card : str
    
    class Config:
        orm_mode = True


class EmployeeProfileResponse(BaseModel):

    name: str
    email: str

