from pydantic import BaseModel


class BankCreateRequest(BaseModel):
    name: str
    is_active: bool

class UpdateBankRequest(BaseModel):
    id: int
    name: str
    is_active: bool

class BankResponse(BaseModel):
    id: int
    name: str
    is_active: bool

class BankFilterSearchRequest(BaseModel):
    name: str
