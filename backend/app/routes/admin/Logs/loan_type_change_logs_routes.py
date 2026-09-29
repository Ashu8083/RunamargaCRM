# backend/app/routes/admin/Logs/loan_type_change_logs_routes.py

from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee
from app.controllers.Logs.loan_type_change_logs_controller import (
    LoanTypeChangeLogController,
)


router = APIRouter(
    prefix="/loan-type-change-logs",
    tags=["Loan Type Change Logs"],
)


@router.get("")
def get_loan_type_change_logs(
    context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    search: Optional[str] = Query(
        default=None,
    ),

    changed_by_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    reports_to_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    from_loan_type_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    to_loan_type_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    from_date: Optional[str] = Query(
        default=None,
    ),

    to_date: Optional[str] = Query(
        default=None,
    ),

    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=10,
        ge=1,
        le=200,
    ),

    db: Session = Depends(get_db),

    employee: Employee = Depends(
        get_current_employee
    ),
):

    try:

        return LoanTypeChangeLogController.get_logs(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            changed_by_id=changed_by_id,
            reports_to_id=reports_to_id,
            from_loan_type_id=from_loan_type_id,
            to_loan_type_id=to_loan_type_id,
            from_date=from_date,
            to_date=to_date,
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

    except HTTPException:

        raise

    except Exception as exc:

        db.rollback()

        print(
            "Loan type change logs error:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch loan type change logs.",
        )