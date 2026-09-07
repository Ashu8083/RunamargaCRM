from app.models import Employee, EmployeeDetails
from sqlalchemy.orm import Session





def get_self_profile( employee_id : int , db : Session  ):

        employee = (db.query(Employee)
        .join(
            EmployeeDetails,
            EmployeeDetails.employee_id == Employee.id
        )
        .filter(Employee.id == employee_id)
        .first()
        )

        if not employee:
            return RuntimeError("Employee not found")

        return employee

