# backend/app/controllers/Loans/shuffle_loans_controller.py

from typing import Optional

from sqlalchemy.orm import Session

from app.schemas.shuffle_loans_schema import ShuffleLoansAssign
from app.services.shuffle_loans_service import ShuffleLoansService


class ShuffleLoansController:

    # =========================================================
    # GET SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def get_shuffle_loans(
        db: Session,
        search: Optional[str] = None,
        agent_id: Optional[int] = None,
        rm_id: Optional[int] = None,
        loan_type_id: Optional[int] = None,
        status: Optional[str] = None,
    ):
        return ShuffleLoansService.get_shuffle_loans(
            db=db,
            search=search,
            agent_id=agent_id,
            rm_id=rm_id,
            loan_type_id=loan_type_id,
            status=status,
        )


    # =========================================================
    # ASSIGN / SHUFFLE LOANS
    # =========================================================

    @staticmethod
    def assign_shuffle_loans(
        db: Session,
        payload: ShuffleLoansAssign,
    ):
        return ShuffleLoansService.assign_shuffle_loans(
            db=db,
            application_ids=payload.application_ids,
            agent_id=payload.agent_id,
            rm_id=payload.rm_id,
            loan_type_id=payload.loan_type_id,
        )