# backend/app/routes/admin/Logs/bank_processing_logs_routes.py

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee

from app.controllers.Logs.bank_processing_logs_controller import (
    BankProcessingLogsController,
)


router = APIRouter(
    prefix="/bank-processing-logs",
    tags=["Bank Processing Logs"],
)


@router.get("")
def get_bank_processing_logs(
    context_id: int | None = Query(
        default=None
    ),

    search: str | None = Query(
        default=None
    ),

    loan_id: int | None = Query(
        default=None
    ),

    bp_id: int | None = Query(
        default=None
    ),

    employee_context_id: int | None = Query(
        default=None
    ),

    event: str | None = Query(
        default=None
    ),

    from_date: str | None = Query(
        default=None
    ),

    to_date: str | None = Query(
        default=None
    ),

    page: int = Query(
        default=1,
        ge=1,
    ),

    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),

    db: Session = Depends(get_db),

    employee=Depends(
        get_current_employee
    ),
):

    try:
        return BankProcessingLogsController.get_logs(
            db=db,
            employee=employee,
            context_id=context_id,
            search=search,
            loan_id=loan_id,
            bp_id=bp_id,
            employee_context_id=employee_context_id,
            event=event,
            from_date=from_date,
            to_date=to_date,
            page=page,
            limit=limit,
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise