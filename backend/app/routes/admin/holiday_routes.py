
# backend\app\routes\admin\holiday_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.dependency.get_access_control_dependency import check_permission

from app.schemas.holiday_schema import (
    HolidayCreateRequest,
    HolidayUpdateRequest,
    HolidayFilterRequest,
    HolidayResponse,
)

from app.controllers.holiday_controller import (
    create_holiday_controller,
    update_holiday_controller,
    filter_search_holiday_controller,
    delete_holiday_controller,
)


router = APIRouter(
    prefix="/holidays",
    tags=["Holidays"],
    dependencies=[Depends(get_current_employee)],
    responses={
        404: {"description": "Not found"},
    },
)


@router.post(
    "/",
    response_model=HolidayResponse,
    status_code=201,
)
def create_holiday(
    holiday_data: HolidayCreateRequest,
    employee=Depends(check_permission("holidays:create")),
    db: Session = Depends(get_db),
):
    return create_holiday_controller(
        db_session=db,
        holiday_create_schema=holiday_data,
    )


@router.get(
    "/",
    response_model=list[HolidayResponse],
)
def filter_search_holidays(
    holiday_filter: HolidayFilterRequest = Depends(),
    employee=Depends(check_permission("holidays:view")),
    db: Session = Depends(get_db),
):
    return filter_search_holiday_controller(
        db_session=db,
        holiday_search_filter=holiday_filter,
    )


@router.put(
    "/",
    response_model=HolidayResponse,
)
def update_holiday(
    holiday_data: HolidayUpdateRequest,
    employee=Depends(check_permission("holidays:update")),
    db: Session = Depends(get_db),
):
    return update_holiday_controller(
        db_session=db,
        holiday_update_schema=holiday_data,
    )


@router.delete(
    "/{holiday_id}",
    response_model=HolidayResponse,
)
def delete_holiday(
    holiday_id: int,
    employee=Depends(check_permission("holidays:delete")),
    db: Session = Depends(get_db),
):
    return delete_holiday_controller(
        db_session=db,
        holiday_id=holiday_id,
    )
