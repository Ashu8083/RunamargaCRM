from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_employee
from app.dependency.get_access_control_dependency import check_permission
from app.config.database import get_db
from app.schemas.DSA_schema import (
    DSACreateRequest,
    DSAResponse,
    DSA_filter_search_query,
)
from app.controllers.dsa_details_controller import (
    create_dsa_details,
    filter_dsa_details,
)

router = APIRouter(
    prefix="/dsa",
    dependencies=[Depends(get_current_employee)],
    tags=["DSA"],
)


@router.post(
    "/create-dsa",
    response_model=DSAResponse
)
async def create_dsa(
    create_dsa_request: DSACreateRequest,
    employee=Depends(check_permission("dsa:create")),
    db: Session = Depends(get_db),
):
    return create_dsa_details(
        db_session=db,
        create_dsa_details_request=create_dsa_request,
    )


@router.get(
    "/dsa-list",
    response_model=list[DSAResponse]
)
async def get_dsa_list(
    filters: Annotated[DSA_filter_search_query, Query()],
    employee=Depends(check_permission("dsa:view")),
    db: Session = Depends(get_db),
):
    return filter_dsa_details(
        db_session=db,
        dsa_search_filter=filters,
    )