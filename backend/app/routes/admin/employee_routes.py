# backend/app/routes/employee_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query,File,UploadFile,Request
from sqlalchemy.orm import Session
from app.core.access_control import AccessControl
from app.schemas.employee import (
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
)
from fastapi import Form
from app.config.database import get_db
from app.controllers.employee_controller import (
    get_employees_controller,create_employee_controller,update_employee_controller,update_employee_block_status_controller,delete_employee_controller
)
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.models.roles import Role
from app.models.permissions import Permission
router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.get("")
def get_employees(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_employees_controller(
        db=db,
        employee=employee,
        context_id=context_id,
    )
@router.post("")
async def create_employee(
    request: Request,
    data: str = Form(...),
    profile_image: UploadFile | None = File(None),
    aadhaar_card: UploadFile | None = File(None),
    pan_card: UploadFile | None = File(None),
    bank_passbook: UploadFile | None = File(None),
    salary_slips: list[UploadFile] | None = File(None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        employee_data = CreateEmployeeRequest.model_validate_json(data)
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail="Invalid employee data",
        ) from exc

    return create_employee_controller(
        db=db,
        employee=employee,
        employee_context_id=getattr(request.state, "employee_context_id", None),
        data=employee_data,
        profile_image=profile_image,
        aadhaar_card=aadhaar_card,
        pan_card=pan_card,
        bank_passbook=bank_passbook,
        salary_slips=salary_slips,
    )
@router.get("/roles")
def get_roles(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:view",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return (
        db.query(Role)
        .order_by(Role.id)
        .all()
    )

@router.get("/permissions")
def get_permissions(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:view",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return (
        db.query(Permission)
        .filter(
            Permission.is_active.is_(True),
            Permission.description.ilike("common"),
        )
        .order_by(Permission.id)
        .all()
    )
@router.put("/{employee_id}")
async def update_employee(
    employee_id: int,

    data: str = Form(...),

    profile_image: UploadFile | None = File(None),
    aadhaar_card: UploadFile | None = File(None),
    pan_card: UploadFile | None = File(None),
    bank_passbook: UploadFile | None = File(None),
    salary_slips: list[UploadFile] | None = File(None),

    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:
        employee_data = UpdateEmployeeRequest.model_validate_json(
            data
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail="Invalid employee data",
        ) from exc

    return update_employee_controller(
        db=db,
        employee=employee,
        employee_id=employee_id,
        data=employee_data,
        profile_image=profile_image,
        aadhaar_card=aadhaar_card,
        pan_card=pan_card,
        bank_passbook=bank_passbook,
        salary_slips=salary_slips,
    )
@router.patch("/{employee_id}/block")
def block_employee(
    employee_id: int,
    blocked: bool,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return update_employee_block_status_controller(
        db=db,
        employee=employee,
        employee_id=employee_id,
        blocked=blocked,
    )
@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return delete_employee_controller(
        db=db,
        employee=employee,
        employee_id=employee_id,
    )