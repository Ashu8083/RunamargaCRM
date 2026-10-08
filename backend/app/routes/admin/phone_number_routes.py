from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee

from app.controllers.phone_numbers_controller import (
    get_phone_numbers,
    create_phone_number,
    update_phone_number,
)

from app.models.employees import Employee


router = APIRouter(
    prefix="/phone-numbers",
    tags=["Phone Numbers"],
)


# =============================================================
# GET PHONE NUMBERS
# =============================================================

@router.get("")
def list_phone_numbers(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(
        get_current_employee
    ),
):
    return get_phone_numbers(
        db=db,
        employee=employee,
        context_id=context_id,
    )


# =============================================================
# CREATE PHONE NUMBER
# =============================================================

@router.post("")
def add_phone_number(
    data: dict,
    db: Session = Depends(get_db),
    employee: Employee = Depends(
        get_current_employee
    ),
):
    return create_phone_number(
        db=db,
        employee=employee,
        data=data,
    )


# =============================================================
# UPDATE PHONE NUMBER
# =============================================================

@router.put("/{phone_number_id}")
def edit_phone_number(
    phone_number_id: int,
    data: dict,
    db: Session = Depends(get_db),
    employee: Employee = Depends(
        get_current_employee
    ),
):
    return update_phone_number(
        db=db,
        employee=employee,
        phone_number_id=phone_number_id,
        data=data,
    )