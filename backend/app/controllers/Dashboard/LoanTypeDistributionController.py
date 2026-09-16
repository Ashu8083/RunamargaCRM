# backend/app/controllers/Dashboard/LoanTypeDistributionController.py
from datetime import date
from typing import Optional

from sqlalchemy.orm import Session

from app.services.Dashboard.loan_type_distribution_service import (
    get_loan_type_distribution,
)


class LoanTypeDistributionController:

    @staticmethod
    async def get_loan_type_distribution(
        db: Session,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        status: str = "In Process",
    ):
        return get_loan_type_distribution(
            db=db,
            from_date=from_date,
            to_date=to_date,
            status=status,
        )