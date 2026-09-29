# backend/app/routes/admin/Logs/loan_shuffle_logs_routes.py

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
from app.controllers.Logs.loan_shuffle_logs_controller import (
    LoanShuffleLogsController,
)


router = APIRouter(
    prefix="/loan-shuffle-logs",
    tags=["Loan Shuffle Logs"],
)


@router.get("")
def get_loan_shuffle_logs_route(
    search: Optional[str] = Query(
        default=None
    ),

    context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    shuffled_by_context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    from_agent_context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    to_agent_context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    from_rm_context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    to_rm_context_id: Optional[int] = Query(
        default=None,
        gt=0,
    ),

    from_date: Optional[str] = Query(
        default=None
    ),

    to_date: Optional[str] = Query(
        default=None
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

        return LoanShuffleLogsController.get_logs(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            shuffled_by_context_id=(
                shuffled_by_context_id
            ),
            from_agent_context_id=(
                from_agent_context_id
            ),
            to_agent_context_id=(
                to_agent_context_id
            ),
            from_rm_context_id=(
                from_rm_context_id
            ),
            to_rm_context_id=(
                to_rm_context_id
            ),
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

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch loan shuffle logs.",
        )