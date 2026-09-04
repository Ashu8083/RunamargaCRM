# backend\app\schemas\city.py
from pydantic import BaseModel, ConfigDict


class CityResponse(BaseModel):
    id: int
    name: str
    state_id: int

    model_config = ConfigDict(
        from_attributes=True
    )