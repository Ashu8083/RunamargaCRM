from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.banker_directory_schema import (
    CreateBankerDirectoryRequest,
    BankerFilterSearchRequest,
)

from app.services.bank_directory_service import (
    create_banker_directory,
    get_banker_directory,
    update_banker_directory,
    delete_banker_directory,
    filter_search_banker_directory,
)


# =========================================================
# CREATE
# =========================================================

def create_banker_directory_controller(
    db: Session,
    banker_directory_data: CreateBankerDirectoryRequest,
):
    return create_banker_directory(
        db=db,
        banker_directory_schema=banker_directory_data,
    )


# =========================================================
# GET BY ID
# =========================================================

def get_banker_directory_controller(
    db: Session,
    banker_directory_id: int,
):
    return get_banker_directory(
        db=db,
        banker_directory_id=banker_directory_id,
    )


# =========================================================
# UPDATE
# =========================================================

def update_banker_directory_controller(
    db: Session,
    banker_directory_id: int,
    banker_directory_data: CreateBankerDirectoryRequest,
):
    return update_banker_directory(
        db=db,
        banker_directory_id=banker_directory_id,
        banker_directory_schema=banker_directory_data,
    )


# =========================================================
# SOFT DELETE
# =========================================================

def delete_banker_directory_controller(
    db: Session,
    banker_directory_id: int,
):
    return delete_banker_directory(
        db=db,
        banker_directory_id=banker_directory_id,
    )


# =========================================================
# FILTER / SEARCH
# =========================================================
from fastapi import HTTPException

def filter_search_banker_directory_controller(
    db: Session,
    filter_data: BankerFilterSearchRequest,
):
    bank_directory = filter_search_banker_directory(
        db=db,
        filter_data=filter_data,
    )
    if not bank_directory:
        raise HTTPException(
            status_code=404,
            detail="Banker directory not found"
        )
    return bank_directory