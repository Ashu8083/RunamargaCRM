# backend/app/controllers/employee_controller.py
from sqlalchemy.orm import Session
from app.schemas.employee import CreateEmployeeRequest,UpdateEmployeeRequest
from app.services.employee_service import get_employees,create_employee,update_employee,update_employee_block_status,delete_employee
from app.models.employees import Employee
from fastapi import UploadFile
def get_employees_controller(
    db: Session,
    employee,
    context_id: int | None = None,
):
    return get_employees(
        db=db,
        employee=employee,
        context_id=context_id,
    )
def create_employee_controller(
    db: Session,
    employee: Employee,
    data: CreateEmployeeRequest,
    employee_context_id: int | None = None,
    profile_image: UploadFile | None = None,
    aadhaar_card: UploadFile | None = None,
    pan_card: UploadFile | None = None,
    bank_passbook: UploadFile | None = None,
    salary_slips: list[UploadFile] | None = None,
):
    return create_employee(
        db=db,
        employee=employee,
        employee_context_id = employee_context_id,
        data=data,
        profile_image=profile_image,
        aadhaar_card=aadhaar_card,
        pan_card=pan_card,
        bank_passbook=bank_passbook,
        salary_slips=salary_slips,
    )
def update_employee_controller(
    db: Session,
    employee: Employee,
    employee_id: int,
    data: UpdateEmployeeRequest,
    profile_image: UploadFile | None = None,
    aadhaar_card: UploadFile | None = None,
    pan_card: UploadFile | None = None,
    bank_passbook: UploadFile | None = None,
    salary_slips: list[UploadFile] | None = None,
):
    return update_employee(
        db=db,
        employee=employee,
        employee_id=employee_id,
        data=data,
        profile_image=profile_image,
        aadhaar_card=aadhaar_card,
        pan_card=pan_card,
        bank_passbook=bank_passbook,
        salary_slips=salary_slips,
    )
def update_employee_block_status_controller(
    db: Session,
    employee: Employee,
    employee_id: int,
    blocked: bool,
):
    return update_employee_block_status(
        db=db,
        employee=employee,
        employee_id=employee_id,
        blocked=blocked,
    )
def delete_employee_controller(
    db: Session,
    employee: Employee,
    employee_id: int,
):
    return delete_employee(
        db=db,
        employee=employee,
        employee_id=employee_id,
    )