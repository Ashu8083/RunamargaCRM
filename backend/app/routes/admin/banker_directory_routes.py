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



@router.post(
    "/create",
    response_model=BankerDirectoryResponse,
)
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

@router.get(
    "/",
    response_model=BankerDirectoryPaginatedResponse,
)
def get_all_banker_directory_route(
    page: int = Query(
        1,
        ge=1,
    ),
    limit: int = Query(
        15,
        ge=1,
        le=100,
    ),
    employee=Depends(check_permission("bankers:view")),
    db: Session = Depends(get_db),
):
    return filter_search_banker_directory_controller(
        db=db,
        filter_data=BankerFilterSearchRequest(page=page, limit=limit),
    )

@router.put(
    "/{banker_directory_id}",
    response_model=BankerDirectoryResponse,
)
def update_banker_directory(
    banker_directory_id: int,
    banker_directory_data: CreateBankerDirectoryRequest,
    employee=Depends(check_permission("bankers:edit")),
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
    response_model=BankerDirectoryPaginatedResponse
)
def filter_search_banker_directory_route(
    filter_data: BankerFilterSearchRequest,
    employee=Depends(check_permission("bankers:view")),
    db: Session = Depends(get_db),
):
    return filter_search_banker_directory_controller(
        db=db,
        filter_data=filter_data,
    )