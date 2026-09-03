# backend\app\controllers\loan_types.py
from sqlalchemy.orm import Session

from app.schemas.loan_type import LoanTypeResponse
from app.services.loan_types import get_active_loan_types


def get_loan_types_controller(
    db: Session,
) -> list[LoanTypeResponse]:

    loan_types = get_active_loan_types(db)

    return [
        LoanTypeResponse.model_validate(loan_type)
        for loan_type in loan_types
    ]