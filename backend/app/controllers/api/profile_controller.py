from sqlalchemy.orm import Session

from app.config.database import logger
from app.models import EmployeeDetails
from app.models.employees import Employee


def get_employee_profile(db: Session, employee_id: int):

    employee_profile = (
        db.query(
            Employee.name,
            EmployeeDetails.profile_image
        )
        .outerjoin(
            EmployeeDetails,
            EmployeeDetails.employee_id == Employee.id
        )
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee_profile:
        logger.error(f"Employee with id {employee_id} not found")
        raise ValueError(
            f"Employee with id {employee_id} doesn't exist"
        )

    return {
        "name": employee_profile.name,
        "profile_image": employee_profile.profile_image
    }