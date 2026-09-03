# backend/app/routes/auth_routes.py
from fastapi import APIRouter, Depends, Response, Cookie, HTTPException
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
    refresh_token_cookie: str | None = Cookie(
        default=None,
        alias="refresh_token",
    ),
    db: Session = Depends(get_db),
):
    if not refresh_token_cookie:
        raise HTTPException(
            status_code=401,
            detail="Refresh token not found",
        )

    return refresh_token(
        db=db,
        refresh_token=refresh_token_cookie,
        response=response,
    )
@router.post("/logout")
def logout_route(
    response: Response,
):
    response.delete_cookie(
        key="access_token",
        path="/",
    )

    response.delete_cookie(
        key="refresh_token",
        path="/",
    )

    return {
        "message": "Logout successful",
    }