
# backend/app/controllers/holiday_controller.py

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.schemas.holiday_schema import (
    HolidayCreateRequest,
    HolidayUpdateRequest,
    HolidayFilterRequest,
)

from app.services.holiday_service import (
    create_holiday_service,
    update_holiday_service,
    search_filter_holiday_service,
    soft_delete_holiday_service,
)


def create_holiday_controller(
    db_session: Session,
    holiday_create_schema: HolidayCreateRequest,
):
    holiday = create_holiday_service(
        db=db_session,
        holiday_data=holiday_create_schema,
    )

    if holiday is None:
        raise HTTPException(
            status_code=409,
            detail="A holiday already exists for this date",
        )

    return holiday


def update_holiday_controller(
    db_session: Session,
    holiday_update_schema: HolidayUpdateRequest,
):
    holiday = update_holiday_service(
        db=db_session,
        holiday_data=holiday_update_schema,
    )

    if holiday is None:
        raise HTTPException(
            status_code=404,
            detail="Holiday not found",
        )

    if holiday == "duplicate_date":
        raise HTTPException(
            status_code=409,
            detail="Another holiday already exists for this date",
        )

    return holiday


def filter_search_holiday_controller(
    db_session: Session,
    holiday_search_filter: HolidayFilterRequest,
):
    return search_filter_holiday_service(
        db=db_session,
        holiday_filter=holiday_search_filter,
    )


def delete_holiday_controller(
    db_session: Session,
    holiday_id: int,
):
    holiday = soft_delete_holiday_service(
        db=db_session,
        holiday_id=holiday_id,
    )

    if holiday is None:
        raise HTTPException(
            status_code=404,
            detail="Holiday not found",
        )

    return holiday
