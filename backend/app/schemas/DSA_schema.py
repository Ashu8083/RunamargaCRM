from pydantic import BaseModel, Field
from app.models.dsa_details import DSAStatus


class DSACreateRequest(BaseModel):
    dsa_name: str
    dsa_code: str
    loan_type_id: int
    bank_id: int
    status: DSAStatus
    is_default: bool = False


class DSAResponse(BaseModel):
    id: int | None = None
    dsa_name: str
    dsa_code: str
    loan_type_id: int
    bank_id: int
    status: DSAStatus
    is_default: bool
    bank_name: str | None = None
    loan_type_name: str | None = None

    model_config = {
        "from_attributes": True
    }


class DSA_filter_search_query(BaseModel):
    search: str | None = None
    status: DSAStatus | None = None
    is_default: bool | None = None
    bank_id: int | None = None
    loan_type_id: int | None = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


class BankerDirectoryFilter(BaseModel):
    search: str | None = None
    bank_id: int | None = None
    state_id: int | None = None
    city_id: int | None = None
    loan_type_id: int | None = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
