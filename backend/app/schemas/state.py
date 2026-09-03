# backend\app\schemas\state.py
from pydantic import BaseModel, ConfigDict


class StateResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(
        from_attributes=True
    )