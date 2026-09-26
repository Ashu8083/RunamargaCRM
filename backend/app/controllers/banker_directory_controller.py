from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.banker_directory_schema import (
    CreateBankerDirectoryRequest,
    BankerFilterSearchRequest,
)

from app.services.bank_directory_service import (
    create_banker_directory,
    get_banker_directory,
    get_all_banker_directory,
    update_banker_directory,
    delete_banker_directory,
    filter_search_banker_directory,
)
from app.schemas.banker_directory_schema import (
    BankerDirectoryResponse,
    BankerStatusEnum,
    CreateBankerDirectoryASM,
    CreateBankerDirectorySM,
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

        status=BankerStatusEnum(

            banker_directory.status

        ),

        asms=[

            CreateBankerDirectoryASM(

                name=asm.name,

                contact=asm.contact,

                email=asm.email,

            )

            for asm in banker_directory.asms

        ],

        sms=[

            CreateBankerDirectorySM(

                name=sm.name,

                contact=sm.contact,

                email=sm.email,

            )

            for sm in banker_directory.sms

        ],

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
    data, total = filter_search_banker_directory(
        db=db,
        filter_data=filter_data,
    )

    items = [
        BankerDirectoryResponse(
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

            status=BankerStatusEnum(
                banker_directory.status
            ),

            asms=[
                CreateBankerDirectoryASM(
                    name=asm.name,
                    contact=asm.contact,
                    email=asm.email,
                )
                for asm in banker_directory.asms
            ],

            sms=[
                CreateBankerDirectorySM(
                    name=sm.name,
                    contact=sm.contact,
                    email=sm.email,
                )
                for sm in banker_directory.sms
            ],
        )
        for banker_directory in data
    ]

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