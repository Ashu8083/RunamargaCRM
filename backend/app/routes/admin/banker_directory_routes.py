from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.core.security import get_current_employee
from app.schemas.banker_directory_schema import (
    CreateBankerDirectoryRequest,
    BankerFilterSearchRequest,
    BankerDirectoryResponse,
    BankerDirectoryPaginatedResponse,
)
from app.dependency.get_access_control_dependency import check_permission

from app.controllers.banker_directory_controller import (
    create_banker_directory_controller,
    get_all_banker_directory_controller,
    get_banker_directory_controller,
    update_banker_directory_controller,
    delete_banker_directory_controller,
    filter_search_banker_directory_controller)

router = APIRouter(
    prefix="/banker-directory",
    dependencies=[Depends(get_current_employee)], tags=["Banker Directory"])



@router.post("/create")
def create_banker_directory(
    banker_directory_data: CreateBankerDirectoryRequest,
    employee=Depends(check_permission("bankers:create")),
    db: Session = Depends(get_db),
):

    return create_banker_directory_controller(
        db=db,
        banker_directory_data=banker_directory_data,
    )


@router.get(
    "/{banker_directory_id}",
    response_model=BankerDirectoryResponse,
)
def get_banker_directory(
    banker_directory_id: int,
    employee=Depends(check_permission("bankers:view")),
    db: Session = Depends(get_db),
):
    return get_banker_directory_controller(
        db=db,
        banker_directory_id=banker_directory_id,
    )

# @router.get("/")
# def get_all_banker_directory_route(
#     page: int = Query(
#         1,
#         ge=1,
#     ),
#     limit: int = Query(
#         15,
#         ge=1,
#         le=100,
#     ),
#     db: Session = Depends(get_db),
# ):
#     return get_all_banker_directory_controller(
#         db=db,
#         page=page,
#         limit=limit,
#     )

@router.put("/{banker_directory_id}")
def update_banker_directory(
    banker_directory_id: int,
    banker_directory_data: CreateBankerDirectoryRequest,
    employee=Depends(check_permission("bankers:update")),
    db: Session = Depends(get_db),
):

    return update_banker_directory_controller(
        db=db,
        banker_directory_id=banker_directory_id,
        banker_directory_data=banker_directory_data,
    )


@router.delete("/{banker_directory_id}")
def delete_banker_directory(
    banker_directory_id: int,
    employee=Depends(check_permission("bankers:delete")),
    db: Session = Depends(get_db),
):

    return delete_banker_directory_controller(
        db=db,
        banker_directory_id=banker_directory_id)

@router.post(
    "/search",
    response_model=list[BankerDirectoryPaginatedResponse],
)
def filter_search_banker_directory_route(
    search: str | None = None,
    state_id: int | None = None,
    city_id: int | None = None,
    bank_id: int | None = None,
    loan_type_id: int | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(15, ge=1),
    db: Session = Depends(get_db),
):

    filter_data = BankerFilterSearchRequest(
        search=search,
        state_id=state_id,
        city_id=city_id,
        bank_id=bank_id,
        loan_type_id=loan_type_id,
        page=page,
        limit=limit,
    )
    return filter_search_banker_directory_controller(
        db=db,
        filter_data=filter_data,

    )