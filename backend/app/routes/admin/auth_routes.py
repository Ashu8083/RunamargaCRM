# backend/app/routes/auth_routes.py
from fastapi import APIRouter, Depends, Response, Cookie, HTTPException
from sqlalchemy.orm import Session

from app.controllers.auth_controller import (
    request_otp,
    verify_otp,
    refresh_token,
    logout,
)

from app.config.database import get_db

from app.schemas.auth import (
    RequestOTPRequest,
    VerifyOTPRequest,
)

from app.core.security import get_current_employee
from app.services.auth_service import get_employee_contexts
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
    refresh_token_cookie: str | None = Cookie(
        default=None,
        alias="refresh_token",
    ),
    db: Session = Depends(get_db),
):
    return logout(
        db=db,
        refresh_token=refresh_token_cookie,
        response=response,
    )

@router.get("/me")
def get_current_user_route(
    db: Session = Depends(get_db),
    employee=Depends(get_current_employee),
):
    contexts = get_employee_contexts(
        db=db,
        employee_id=employee.id,
    )

    return {
        "success": True,
        "data": {
            "id": employee.id,
            "name": employee.name,
            "email": employee.email,
            "role": employee.role.name if employee.role else None,
            "contexts": contexts,
        },
    }