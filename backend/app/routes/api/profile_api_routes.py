from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.log_config import logger
from app.config.database import get_db
from app.controllers.api.profile_controller import get_employee_profile
from app.schemas.api.profile.profile_schema import ProfileResponse

router = APIRouter(
    prefix="/employees",
    tags=["Employee Profile"]
)


@router.get("/{employee_id}/profile"
            , response_model=ProfileResponse)
def get_employee_profile_route(
    employee_id: int,
    db: Session = Depends(get_db)
):

    try :
        employee_profile = get_employee_profile(
            db=db,
            employee_id=employee_id
        )

    except ValueError as e:
        logger.error("profile route error %s",e)
        raise HTTPException(
            status_code=404,
            detail="Employee profile not found"
        )

    return ProfileResponse(**employee_profile)