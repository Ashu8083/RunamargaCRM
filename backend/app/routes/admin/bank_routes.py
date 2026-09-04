from fastapi import Depends,Request,APIRouter
from sqlalchemy.orm import Session
from app.config.database import get_db
router = APIRouter(
    prefix="/admin/bank_routes",
    tags=["bank_routes"],
    responses={404: {"description": "Not found"}},
)


@router.post("/bank_routes", tags=["bank_routes"])
def create_bank_routes(db : Session = Depends(get_db)):
    return
@router.post("/bank_routes", tags=["bank_routes"])
def filter_search_services():
    return
@router.put("/bank_routes", tags=["bank_routes"])
def update_bank_routes():
    return
@router.delete("/bank_routes", tags=["bank_routes"])
def delete_bank_routes():
    return