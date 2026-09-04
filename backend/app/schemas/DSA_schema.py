from pydantic import BaseModel,Field
from app.models.dsa_details import DSAStatus
class DSACreateRequest(BaseModel):
    dsa_name: str
    dsa_code: str
    loan_type_id: int
    bank_id: int
    status: DSAStatus
    is_default: bool


class DSAResponse(BaseModel):
    dsa_name: str
    dsa_code: str
    loan_type_id: int
    bank_id: int
    status: DSAStatus
    is_default: bool


class DSA_filter_search_query(BaseModel):
    search: str
    status : DSAStatus
    is_default: bool
    page: int
    limit: int


class BankerDirectoryFilter(BaseModel):

        search: str | None = None
        bank_id: int | None = None
        state_id: int | None = None
        city_id: int | None = None
        loan_type_id: int | None = None
        page: int = Field(default=1, ge=1)
        limit: int = Field(default=20, ge=1, le=100)


