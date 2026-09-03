# backend\app\routes\loan_types.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.loan_types import get_loan_types_controller
from app.schemas.loan_type import LoanTypeResponse


router = APIRouter(
    prefix="/loan-types",
    tags=["Loan Types"],
)


@router.get(
    "",
    response_model=list[LoanTypeResponse],
)
def get_loan_types(
    db: Session = Depends(get_db),
):
    return get_loan_types_controller(db)