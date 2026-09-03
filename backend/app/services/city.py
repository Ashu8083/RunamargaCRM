# backend\app\services\city.py
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cities import City


def get_active_cities(
    db: Session,
    state_id: int | None = None,
) -> list[City]:
    statement = (
        select(City)
        .where(
            City.deleted_at.is_(None),
        )
    )

    if state_id is not None:
        statement = statement.where(
            City.state_id == state_id,
        )

    statement = statement.order_by(City.id.asc())

    return list(
        db.scalars(statement).all()
    )