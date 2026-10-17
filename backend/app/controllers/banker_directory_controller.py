from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.banker_directory_schema import (
    CreateBankerDirectoryRequest,
    BankerFilterSearchRequest,
    BankerDirectoryResponse,
    BankerStatusEnum,
    CreateBankerDirectoryASM,
    CreateBankerDirectorySM,
)

from app.services.bank_directory_service import (
    create_banker_directory,
    get_banker_directory,
    get_all_banker_directory,
    update_banker_directory,
    delete_banker_directory,
    filter_search_banker_directory,
)


def format_banker_directory(banker_directory) -> BankerDirectoryResponse:
    status_val = BankerStatusEnum.active
    if banker_directory.status is not None:
        try:
            status_val = BankerStatusEnum(str(banker_directory.status))
        except ValueError:
            status_val = BankerStatusEnum.active

    return BankerDirectoryResponse(
        banker_directory_id=banker_directory.id,
        bank_id=banker_directory.bank_id,
        bank_name=(
            banker_directory.bank.name
            if banker_directory.bank
            else ""
        ),
        loan_type_id=banker_directory.loan_type_id,
        loan_type_name=(
            banker_directory.loan_type.name
            if banker_directory.loan_type
            else ""
        ),
        city_id=banker_directory.city_id,
        city_name=(
            banker_directory.city.name
            if banker_directory.city
            else ""
        ),
        state_id=banker_directory.state_id,
        state_name=(
            banker_directory.state.name
            if banker_directory.state
            else ""
        ),
        status=status_val,
        asms=[
            CreateBankerDirectoryASM(
                name=asm.name or "",
                contact=asm.contact,
                email=asm.email,
            )
            for asm in (banker_directory.asms or [])
        ],
        sms=[
            CreateBankerDirectorySM(
                name=sm.name or "",
                contact=sm.contact,
                email=sm.email,
            )
            for sm in (banker_directory.sms or [])
        ],
    )


# =========================================================
# CREATE
# =========================================================

def create_banker_directory_controller(
    db: Session,
    banker_directory_data: CreateBankerDirectoryRequest,
) -> BankerDirectoryResponse:
    banker_directory = create_banker_directory(
        db=db,
        banker_directory_schema=banker_directory_data,
    )
    return get_banker_directory_controller(
        db=db,
        banker_directory_id=banker_directory.id,
    )


# =========================================================
# GET BY ID
# =========================================================
def get_all_banker_directory_controller(
    db: Session,
    page: int = 1,
    limit: int = 15,
):
    return get_all_banker_directory(
        db=db,
        page=page,
        limit=limit,
    )


def get_banker_directory_controller(
    db: Session,
    banker_directory_id: int,
) -> BankerDirectoryResponse:
    banker_directory = get_banker_directory(
        db=db,
        banker_directory_id=banker_directory_id,
    )
    return format_banker_directory(banker_directory)


# =========================================================
# UPDATE
# =========================================================

def update_banker_directory_controller(
    db: Session,
    banker_directory_id: int,
    banker_directory_data: CreateBankerDirectoryRequest,
) -> BankerDirectoryResponse:
    update_banker_directory(
        db=db,
        banker_directory_id=banker_directory_id,
        banker_directory_schema=banker_directory_data,
    )
    return get_banker_directory_controller(
        db=db,
        banker_directory_id=banker_directory_id,
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

def filter_search_banker_directory_controller(
    db: Session,
    filter_data: BankerFilterSearchRequest,
):
    data, total = filter_search_banker_directory(
        db=db,
        filter_data=filter_data,
    )

    items = [format_banker_directory(banker_directory) for banker_directory in data]

    total_pages = (
        (total + filter_data.limit - 1)
        // filter_data.limit
    )

    return {
        "items": items,
        "total": total,
        "page": filter_data.page,
        "limit": filter_data.limit,
        "total_pages": total_pages,
    }