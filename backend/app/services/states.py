# backend\app\services\states.py
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.states import State


def get_active_states(db: Session) -> list[State]:
    statement = (
        select(State)
        .where(
            State.deleted_at.is_(None),
        )
        .order_by(State.id.asc())
    )

    return list(
        db.scalars(statement).all()
    )