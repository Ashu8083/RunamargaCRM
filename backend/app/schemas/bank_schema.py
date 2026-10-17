from pydantic import BaseModel, field_validator

class BankCreateRequest(BaseModel):
    name: str
    is_active: bool = True

class UpdateBankRequest(BaseModel):
    id: int
    name: str
    is_active: bool = True

class BankResponse(BaseModel):
    id: int
    name: str
    is_active: bool = True

    model_config = {
        "from_attributes": True
    }

    @field_validator("is_active", mode="before")
    @classmethod
    def set_is_active(cls, v):
        if v is None:
            return True
        return bool(v)

class BankFilterSearchRequest(BaseModel):
    name: str | None = None
    is_active: bool | None = None