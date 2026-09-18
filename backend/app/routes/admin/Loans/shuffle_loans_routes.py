# backend/app/routes/admin/Loans/shuffle_loans_routes.py

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.controllers.Loans.shuffle_loans_controller import (
    ShuffleLoansController,
)

from app.schemas.shuffle_loans_schema import (
    ShuffleLoansAssign,
)


router = APIRouter(
    prefix="/shuffle-loans",
    tags=["Shuffle Loans"],
)


# =========================================================
# GET SHUFFLE LOANS
# =========================================================

@router.get("")
def get_shuffle_loans_route(
    search: Optional[str] = Query(
        default=None
    ),

    # EmployeeContext.id for AGENT context
    agent_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    # EmployeeContext.id for RM context
    rm_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    loan_type_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    status: Optional[str] = Query(
        default=None
    ),

    # =====================================================
    # PAGINATION
    # =====================================================

    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=30,
        ge=1,
        le=200,
    ),

    db: Session = Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):
    try:

        return ShuffleLoansController.get_shuffle_loans(
            db=db,
            search=search,
            agent_id=agent_id,
            rm_id=rm_id,
            loan_type_id=loan_type_id,
            status=status,
            page=page,
            limit=limit,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# =========================================================
# ASSIGN / SHUFFLE LOANS
# =========================================================

@router.patch("/assign")
def assign_shuffle_loans_route(
    payload: ShuffleLoansAssign,

    db: Session = Depends(
        get_db
    ),

    employee: Employee = Depends(
        get_current_employee
    ),
):
    try:

        return ShuffleLoansController.assign_shuffle_loans(
            db=db,
            payload=payload,
        )

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to assign selected loans.",
        )