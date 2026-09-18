#  backend/app/controllers/Dashboard/application_status_controller.py

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from app.services.Dashboard.application_status_service import (
    get_application_status_data,
)


async def get_application_status(
    request: Request,
    db: Session,
    employee,
    context_id=None,
    from_date=None,
    to_date=None,
    loan_type_id=None,
):
    """
    Controller for Application Status dashboard.

    context_id refers to EmployeeContext.id.
    """

    try:
        return await get_application_status_data(
            db=db,
            employee=employee,
            context_id=context_id,
            from_date=from_date,
            to_date=to_date,
            loan_type_id=loan_type_id,
        )

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to load application status data.",
        ) from exc