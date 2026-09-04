# backend\app\controllers\state_controller.py
from sqlalchemy.orm import Session

from app.schemas.state import StateResponse
from app.services.states import get_active_states


def get_states_controller(
    db: Session,
) -> list[StateResponse]:
    states = get_active_states(db)

    return [
        StateResponse.model_validate(state)
        for state in states
    ]