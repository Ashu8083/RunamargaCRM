from app.core.log_config import logger
from app.models import Employee, EmployeeDetails
from sqlalchemy.orm import Session





def get_self_profile( employee_id : int , db : Session  ):

    logger.info(f"<=============. {employee_id} ==============>")

    result = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )
    if not result:
        raise RuntimeError("Employee not found")
    employee = result

    employee_details = db.query(EmployeeDetails).filter(EmployeeDetails.id == employee_id).first()
    if not employee_details:
        employee_details = None

    return employee,employee_details