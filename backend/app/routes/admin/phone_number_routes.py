# backend/app/routes/phone_number_routes.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
router = APIRouter(
    prefix="/phone-numbers",
    tags=["Phone Numbers"],
)

@router.get("")
def get_phone_numbers(
    context_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    return get_phone_numbers(
        db=db,
        employee=employee,
        context_id=context_id,
    )