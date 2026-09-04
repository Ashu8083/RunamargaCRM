# backend\app\controllers\auth_controller.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, Response

from app.schemas.auth import (
    RequestOTPRequest,
    VerifyOTPRequest,
)
from app.services.auth_service import (
    create_login_otp,
    verify_login_otp,
    refresh_access_token,
)


def request_otp(
    db: Session,
    request: RequestOTPRequest,
):
    otp = create_login_otp(
        db=db,
        email=request.emailId,
    )

    return {
        "message": "OTP sent successfully",
        "otp": otp,
    }


def verify_otp(
    db: Session,
    request: VerifyOTPRequest,
    response: Response,
):
    try:
        (
            employee,
            access_token,
            refresh_token,
            contexts,
        ) = verify_login_otp(
            db=db,
            email=request.emailId,
            otp=request.otp,
        )

        # Access token
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=60,
        )

        # Refresh token
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=7 * 24 * 60 * 60,
        )

        return {
            "message": "Login successful",
            "employee_id": employee.id,
            "user": {
                "id": employee.id,
                "name": employee.name,
                "email": employee.email,
                "role": employee.role.name if employee.role else None,
                "contexts": contexts,
                "token": access_token,
            },
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )


def refresh_token(
    db: Session,
    refresh_token: str,
    response: Response,
):
    try:
        access_token = refresh_access_token(
            db=db,
            refresh_token=refresh_token,
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=30 * 60,
        )

        return {
            "message": "Access token refreshed successfully",
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )