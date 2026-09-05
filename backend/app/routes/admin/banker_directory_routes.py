from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schemas.banker_directory_schema import (
    CreateBankerDirectoryRequest,
    BankerFilterSearchRequest,
)
from app.dependency.get_access_control_dependency import check_permission

from app.controllers.banker_directory_controller import (
    create_banker_directory_controller,
    get_banker_directory_controller,
    update_banker_directory_controller,
    delete_banker_directory_controller,
    filter_search_banker_directory_controller,
)
router = APIRouter(
    prefix="/banker-directory",
    tags=["Banker Directory"],
)
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


@router.get("/{banker_directory_id}")
def get_banker_directory(
    banker_directory_id: int,
    employee=Depends(check_permission("bankers:view")),
    db: Session = Depends(get_db),
):

    return get_banker_directory_controller(
        db=db,
        banker_directory_id=banker_directory_id,
    )

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
        banker_directory_id=banker_directory_id,
    )

@router.post("/search")
def filter_search_banker_directory(
    employee = Depends(check_permission("bankers:view")),
    filter_data: BankerFilterSearchRequest = Depends(),
    db: Session = Depends(get_db),
):

    return filter_search_banker_directory_controller(
        db=db,
        filter_data=filter_data,
    )