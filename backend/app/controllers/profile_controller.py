from app.models import Employee
from sqlalchemy.orm import Session
from app.services.profile_service import get_self_profile

def get_employee_profile_controller(db: Session, employee: Employee):
    return get_self_profile(employee.id , db)