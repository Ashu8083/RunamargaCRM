# backend/app/routes/auth_routes.py
from fastapi import APIRouter, Depends,Response,Cookie
from sqlalchemy.orm import Session
from app.controllers.auth_controller import request_otp,verify_otp,refresh_token
from app.config.database import get_db
from app.schemas.auth import RequestOTPRequest,VerifyOTPRequest


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/request-otp")
def request_otp_route(
    request: RequestOTPRequest,
    db: Session = Depends(get_db),
):
    return request_otp(
        db=db,
        request=request,
    )
@router.post("/verify-otp")
def verify_otp_route(
    request: VerifyOTPRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    return verify_otp(
        db=db,
        request=request,
        response=response,
    )
@router.post("/refresh")
def refresh_token_route(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh token not found",
        )

    return refresh_token(
        db=db,
        refresh_token=refresh_token,
        response=response,
    )