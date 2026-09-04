# app/routes/admin/common_routes.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee

from app.models.roles import Role
from app.models.permissions import Permission
from app.models.loan_types import LoanType
from app.models.employees import Employee
from app.models.employee_contexts import EmployeeContext
router = APIRouter(
    prefix="/common",
    tags=["Common"],
)


@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
):
    return (
        db.query(Role)
        .order_by(Role.id)
        .all()
    )


@router.get("/permissions")
def get_permissions(
    db: Session = Depends(get_db),
):
    return (
        db.query(Permission)
        .filter(
            Permission.is_active.is_(True)
        )
        .order_by(Permission.id)
        .all()
    )

@router.get("/loan-types")
def get_loan_types(
    db: Session = Depends(get_db),
):
    return (
        db.query(LoanType)
        .filter(
            LoanType.status == "active",
        )
        .order_by(LoanType.id)
        .all()
    )
@router.get("/employees")
def get_common_employees(
    context_id: int = Query(...),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    employees = (
        db.query(Employee)
        .join(EmployeeContext, EmployeeContext.employee_id == Employee.id)
        .filter(
            EmployeeContext.context_id == context_id,
            Employee.status == "active",
        )
        .order_by(Employee.name)
        .all()
    )

    return [
        {
            "id": emp.id,
            "name": emp.name,
        }
        for emp in employees
    ]
@router.get("/relationship-managers")
def get_relationship_managers(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    rms = AccessControl.get_visible_rms(
        db=db,
        employee=employee,
        context_id=context_id,
    )

    return [
        {
            "id": rm.id,
            "name": rm.name,
        }
        for rm in rms
    ]