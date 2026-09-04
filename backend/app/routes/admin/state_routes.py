# backend\app\routes\admin\state_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.state_controller import get_states_controller
from app.schemas.state import StateResponse


router = APIRouter(
    prefix="/states",
    tags=["States"],
)


@router.get(
    "",
    response_model=list[StateResponse],
)
def get_states(
    db: Session = Depends(get_db),
):
    return get_states_controller(db)