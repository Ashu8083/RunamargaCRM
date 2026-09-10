from enum import Enum
from typing import List
from pydantic import Field
from pydantic import BaseModel


class BankerStatusEnum(str, Enum):

    inactive = "0"

    active = "1"

class CreateBankerDirectoryASM(BaseModel):

    name: str
    contact: str | None = None
    email: str | None = None

class CreateBankerDirectorySM(BaseModel):

    name: str
    contact: str | None = None
    email: str | None = None

class CreateBankerDirectoryRequest(BaseModel):
    bank_id: int
    loan_type_id: int
    city_id: int
    state_id: int
    status: BankerStatusEnum
    asms: list[CreateBankerDirectoryASM] = Field(
        default_factory=list
    )
    sms: list[CreateBankerDirectorySM] = Field(
        default_factory=list

    )

class BankerDirectoryResponse(BaseModel):
    banker_directory_id: int

    bank_id: int
    bank_name: str
    loan_type_id: int
    loan_type_name: str
    city_id: int
    city_name: str
    state_id: int
    state_name: str
    status: BankerStatusEnum

    asms: list[CreateBankerDirectoryASM]
    sms: list[CreateBankerDirectorySM]

    model_config = {
        "from_attributes": True
    }

class BankerFilterSearchRequest(BaseModel):

    search: str | None = None
    state_id: int | None = None
    city_id: int | None = None
    bank_id: int | None = None
    loan_type_id: int | None = None
    page: int = Field(default=1, ge=1)

    limit: int = Field(default=15, ge=1, le=100)
class BankerDirectoryPaginatedResponse(BaseModel):

    items: list[BankerDirectoryResponse]
    total: int
    page: int
    limit: int
    total_pages: int