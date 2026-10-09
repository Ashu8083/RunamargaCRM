from app.models import Employee
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services.employee_face_profile_service import logger
from app.services.profile_service import get_self_profile

def get_employee_profile_controller(db: Session, employee: Employee):
    employee_profile = get_self_profile(employee.id , db)

    logger.info(employee_profile)

    if not employee_profile:
        raise HTTPException(status_code=404,
                            detail="Employee not found")
    return employee_profile