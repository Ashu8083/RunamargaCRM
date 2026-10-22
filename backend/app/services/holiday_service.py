
# backend/app/services/holiday_service.py

from datetime import date

from sqlalchemy import select, extract
from sqlalchemy.orm import Session

from app.models.holidays import Holiday
from app.schemas.holiday_schema import (
    HolidayCreateRequest,
    HolidayUpdateRequest,
    HolidayFilterRequest,
)


def create_holiday_service(
    db: Session,
    holiday_data: HolidayCreateRequest,
):
    # Prevent duplicate holidays on the same date
    existing_holiday = db.execute(
        select(Holiday).where(
            Holiday.date == holiday_data.date
        )
    ).scalar_one_or_none()

    if existing_holiday:
        return None

    holiday = Holiday(
        name=holiday_data.name,
        date=holiday_data.date,
        description=holiday_data.description,
        is_active=holiday_data.is_active,
    )

    try:
        db.add(holiday)
        db.commit()
        db.refresh(holiday)
        return holiday
    except Exception:
        db.rollback()
        raise


def search_filter_holiday_service(
    db: Session,
    holiday_filter: HolidayFilterRequest,
):
    query = select(Holiday)

    # By default, show only active holidays
    if holiday_filter.is_active is not None:
        query = query.where(
            Holiday.is_active == holiday_filter.is_active
        )

    # Filter by exact date
    if holiday_filter.date is not None:
        query = query.where(
            Holiday.date == holiday_filter.date
        )

    # Filter by date range
    elif (
        holiday_filter.start_date is not None
        or holiday_filter.end_date is not None
    ):
        if holiday_filter.start_date is not None:
            query = query.where(
                Holiday.date >= holiday_filter.start_date
            )

        if holiday_filter.end_date is not None:
            query = query.where(
                Holiday.date <= holiday_filter.end_date
            )

    # Filter by month (YYYY-MM)
    elif holiday_filter.month:
        year, month = map(
            int,
            holiday_filter.month.split("-"),
        )

        query = query.where(
            extract("year", Holiday.date) == year,
            extract("month", Holiday.date) == month,
        )

    # Default: current month's holidays
    else:
        today = date.today()

        query = query.where(
            extract("year", Holiday.date) == today.year,
            extract("month", Holiday.date) == today.month,
        )

    # Filter by holiday name
    if holiday_filter.name:
        query = query.where(
            Holiday.name.ilike(
                f"%{holiday_filter.name.strip()}%"
            )
        )

    query = query.order_by(Holiday.date.asc())

    return db.execute(query).scalars().all()


def update_holiday_service(
    db: Session,
    holiday_data: HolidayUpdateRequest,
):
    holiday = db.execute(
        select(Holiday).where(
            Holiday.id == holiday_data.id
        )
    ).scalar_one_or_none()

    if holiday is None:
        return None

    # Prevent another holiday from using the same date
    duplicate = db.execute(
        select(Holiday).where(
            Holiday.date == holiday_data.date,
            Holiday.id != holiday_data.id,
        )
    ).scalar_one_or_none()

    if duplicate:
        return "duplicate_date"

    holiday.name = holiday_data.name
    holiday.date = holiday_data.date
    holiday.description = holiday_data.description
    holiday.is_active = holiday_data.is_active

    try:
        db.commit()
        db.refresh(holiday)
        return holiday
    except Exception:
        db.rollback()
        raise


def soft_delete_holiday_service(
    db: Session,
    holiday_id: int,
):
    holiday = db.execute(
        select(Holiday).where(
            Holiday.id == holiday_id
        )
    ).scalar_one_or_none()

    if holiday is None:
        return None

    # Soft delete: keep the record but deactivate it
    holiday.is_active = False

    try:
        db.commit()
        db.refresh(holiday)
        return holiday
    except Exception:
        db.rollback()
        raise
