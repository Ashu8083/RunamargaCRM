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
    loan_type_id: int
    city_id: int
    state_id: int
    status: BankerStatusEnum

    asms: list[CreateBankerDirectoryASM]
    sms: list[CreateBankerDirectorySM]

class BankerFilterSearchRequest(BaseModel):

    search: str | None = None
    state_id: int | None = None
    city_id: int | None = None
    bank_id: int | None = None
    loan_type_id: int | None = None
    page: int = 1
    limit: int = 10