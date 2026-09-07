# backend\app\routes\admin\city_routes.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.controllers.city_controller import get_cities_controller
from app.schemas.city import CityResponse


router = APIRouter(
    prefix="/cities",
    tags=["Cities"],
)


@router.get(
    "",
    response_model=list[CityResponse],
)
def get_cities(
    state_id: int | None = Query(
        default=None,
        description="Filter cities by state ID",
    ),
    db: Session = Depends(get_db),
):
    return get_cities_controller(
        db=db,
        state_id=state_id,
    )