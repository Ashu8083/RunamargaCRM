from fastapi.responses import  JSONResponse
from fastapi import HTTPException,APIRouter,Depends,Request
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.dependency.get_access_control_dependency import  check_permission
from app.controllers.profile_controller import get_employee_profile_controller
from app.models import Employee
from app.schemas.employee_profile_schema import EmployeeProfileResponse
from app.core.security import get_current_employee
profile_router = APIRouter(
    prefix="/profile",
    tags=["profile"],
    dependencies=[Depends(get_current_employee)],
)



@profile_router.get(
    "/employee_profile",
    response_model=EmployeeProfileResponse
)
def get_employee_profile_route(
    request: Request,
    db: Session = Depends(get_db),
):
    employee, employee_details = get_employee_profile_controller(
        db=db,
        employee=request.state.employee
    )

    profile_response = EmployeeProfileResponse(
        name=employee.name,
        email=employee.email,
        phone=employee.phone,
        role =employee.role.name,
        employee_code=employee.employee_code,
        gender=employee_details.gender if employee_details else None,
        joining_date=employee_details.joining_date if employee_details else None,
        aadhar_card=employee_details.aadhar_card if employee_details else None,
        pan_card=employee_details.pan_card if employee_details else None,
    )

    return profile_response

