from app.models import Employee, EmployeeDetails
from sqlalchemy.orm import Session





def get_self_profile( employee_id : int , db : Session  ):
    result = (
        db.query(Employee, EmployeeDetails)
        .join(
            EmployeeDetails,
            EmployeeDetails.employee_id == Employee.id
        )
        .filter(Employee.id == employee_id)
        .first()
    )
    if not result:
        raise RuntimeError("Employee not found")
    employee, employee_details = result
    return employee, employee_details