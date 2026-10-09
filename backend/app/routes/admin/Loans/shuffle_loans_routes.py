# backend/app/routes/admin/Loans/shuffle_loans_routes.py

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.core.access_control import AccessControl
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

    # =====================================================
    # DATABASE
    # =====================================================

    db: Session = Depends(get_db),

    # =====================================================
    # CURRENT EMPLOYEE
    # =====================================================

    employee: Employee = Depends(
        get_current_employee
    ),
):
    try:

        return ShuffleLoansController.get_shuffle_loans(
            db=db,

            # IMPORTANT
            employee=employee,

            search=search,
            agent_id=agent_id,
            rm_id=rm_id,
            loan_type_id=loan_type_id,
            status=status,
            page=page,
            limit=limit,
        )

    except PermissionError as exc:

        raise HTTPException(
            status_code=403,
            detail=str(exc),
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

    # =====================================================
    # DATABASE
    # =====================================================

    db: Session = Depends(
        get_db
    ),

    # =====================================================
    # CURRENT EMPLOYEE
    # =====================================================

    employee: Employee = Depends(
        get_current_employee
    ),
):
    try:

        # =================================================
        # GET CURRENT ACTIVE CONTEXT
        # =================================================

        active_context = AccessControl.get_active_context(
            db=db,
            employee=employee,
        )

        if not active_context:

            raise HTTPException(
                status_code=403,
                detail=(
                    "No active employee context found."
                ),
            )

        # =================================================
        # ASSIGN / SHUFFLE
        # =================================================

        return ShuffleLoansController.assign_shuffle_loans(
            db=db,

            # IMPORTANT
            employee=employee,

            payload=payload,

            shuffled_by_context_id=active_context.id,
        )

    except PermissionError as exc:

        db.rollback()

        raise HTTPException(
            status_code=403,
            detail=str(exc),
        )

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except HTTPException:

        db.rollback()

        raise

    except Exception as exc:

        db.rollback()

        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )