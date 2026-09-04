# backend\app\services\loan_types.py
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.loan_types import LoanType, LoanTypeStatus


def get_active_loan_types(db: Session) -> list[LoanType]:
    statement = (
        select(LoanType)
        .where(
            LoanType.status == LoanTypeStatus.active,
            LoanType.deleted_at.is_(None),
        )
        .order_by(LoanType.id.asc())
    )

    return list(db.scalars(statement).all())    