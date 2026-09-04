# backend\app\controllers\city_controller.py
from sqlalchemy.orm import Session

from app.schemas.city import CityResponse
from app.services.cities import get_active_cities


def get_cities_controller(
    db: Session,
    state_id: int | None = None,
) -> list[CityResponse]:
    cities = get_active_cities(
        db=db,
        state_id=state_id,
    )

    return [
        CityResponse.model_validate(city)
        for city in cities
    ]