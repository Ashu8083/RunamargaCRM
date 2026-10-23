# backend/app/core/api_security.py

import os
import hashlib

from datetime import datetime, timedelta, timezone

import jwt

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.employees import Employee
from app.models.auth_tokens import AuthToken


# ------------------------------------------------------------------------
# JWT CONFIGURATION
# ------------------------------------------------------------------------

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-secret-in-production",
)

JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
TEMPORARY_ENROLLMENT_EXPIRE_MINUTES = 60

# ------------------------------------------------------------------------
# TOKEN TYPES
# ------------------------------------------------------------------------

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"
FACE_ENROLLMENT_TOKEN_TYPE = "face_enrollment"

# ------------------------------------------------------------------------
# TOKEN HASH
# ------------------------------------------------------------------------

def hash_token(
    token: str,
) -> str:
    """
    Hash a token before storing it in the database.
    The raw token is NEVER stored in auth_tokens.
    """
    return hashlib.sha256(
        token.encode()
    ).hexdigest()


# ------------------------------------------------------------------------
# ACCESS TOKEN
# ------------------------------------------------------------------------

def create_access_token(
    employee_id: int,
) -> str:
    """
    Create a normal API access token.

    Lifetime:
        30 minutes
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    payload = {
        "sub": str(employee_id),
        "type": ACCESS_TOKEN_TYPE,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


# ------------------------------------------------------------------------
# REFRESH TOKEN
# ------------------------------------------------------------------------

def create_refresh_token(
    employee_id: int,
) -> str:
    """
    Create a refresh token.

    Lifetime:
        7 days

    Only the SHA-256 hash of this token should be stored
    in auth_tokens.
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    payload = {
        "sub": str(employee_id),
        "type": REFRESH_TOKEN_TYPE,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


# ------------------------------------------------------------------------
# TEMPORARY FACE ENROLLMENT TOKEN
# ------------------------------------------------------------------------

def create_face_enrollment_token(
    employee_id: int,
) -> tuple[str, datetime]:
    """
    Create a short-lived token used ONLY for first-time
    face enrollment.

    Lifetime:
        5 minutes

    IMPORTANT:
        This is NOT an access token.

    It must NEVER be accepted by normal authenticated APIs.
    """

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=TEMPORARY_ENROLLMENT_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(employee_id),
        "type": FACE_ENROLLMENT_TOKEN_TYPE,
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token, expire


# ------------------------------------------------------------------------
# DECODE TOKEN
# ------------------------------------------------------------------------

def decode_token(
    token: str,
) -> dict:
    """
    Decode and validate a JWT.

    This validates:
        - signature
        - algorithm
        - expiration
    """

    try:

        return jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

    except jwt.ExpiredSignatureError:

        raise ValueError(
            "Token has expired"
        )

    except jwt.InvalidTokenError:

        raise ValueError(
            "Invalid token"
        )


# ------------------------------------------------------------------------
# DECODE TOKEN WITHOUT EXPIRATION VALIDATION
# ------------------------------------------------------------------------

def decode_token_unverified_exp(
    token: str,
) -> dict:
    """
    Decode and validate a JWT signature while ignoring expiration.
    Useful for logout to identify employee even if access_token or
    refresh_token has just expired.
    """

    try:

        return jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
            options={"verify_exp": False},
        )

    except jwt.InvalidTokenError:

        raise ValueError(
            "Invalid token"
        )


# ------------------------------------------------------------------------
# GET EMPLOYEE ID FROM ACCESS TOKEN
# ------------------------------------------------------------------------

def get_employee_id_from_access_token(
    token: str,
) -> int:
    """
    Extract employee ID from a normal access token.
    Only token type = access is accepted.
    """

    payload = decode_token(token)

    if payload.get("type") != ACCESS_TOKEN_TYPE:

        raise ValueError(
            "Invalid access token"
        )

    employee_id = payload.get("sub")

    if not employee_id:

        raise ValueError(
            "Invalid access token"
        )

    try:

        return int(employee_id)

    except (TypeError, ValueError):

        raise ValueError(
            "Invalid employee ID in access token"
        )


# ------------------------------------------------------------------------
# GET EMPLOYEE ID FROM REFRESH TOKEN
# ------------------------------------------------------------------------

def get_employee_id_from_refresh_token(
    token: str,
) -> int:
    """
    Extract employee ID from a refresh token.

    Only token type = refresh is accepted.
    """

    payload = decode_token(token)

    if payload.get("type") != REFRESH_TOKEN_TYPE:

        raise ValueError(
            "Invalid refresh token"
        )

    employee_id = payload.get("sub")

    if not employee_id:

        raise ValueError(
            "Invalid refresh token"
        )

    try:

        return int(employee_id)

    except (TypeError, ValueError):

        raise ValueError(
            "Invalid employee ID in refresh token"
        )


# ------------------------------------------------------------------------
# GET EMPLOYEE ID FROM FACE ENROLLMENT TOKEN
# ------------------------------------------------------------------------

def get_employee_id_from_face_enrollment_token(
    token: str,
) -> int:
    """
    Extract employee ID from a temporary face enrollment token.

    Only token type = face_enrollment is accepted.

    This function does NOT check auth_tokens.

    Database validation of the temporary token must happen
    in the authentication service.
    """

    payload = decode_token(token)

    if payload.get("type") != FACE_ENROLLMENT_TOKEN_TYPE:

        raise ValueError(
            "Invalid face enrollment token"
        )

    employee_id = payload.get("sub")

    if not employee_id:

        raise ValueError(
            "Invalid face enrollment token"
        )

    try:

        return int(employee_id)

    except (TypeError, ValueError):

        raise ValueError(
            "Invalid employee ID in face enrollment token"
        )


# ------------------------------------------------------------------------
# HTTP BEARER SECURITY SCHEME FOR OPENAPI
# ------------------------------------------------------------------------

oauth2_scheme = HTTPBearer(
    auto_error=False,
    description="Bearer access token in Authorization header",
)


# ------------------------------------------------------------------------
# CURRENT API EMPLOYEE
# ------------------------------------------------------------------------

def get_current_api_employee(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Employee:
    """
    Get the currently authenticated employee using
    the normal access token from the Authorization header.

    Accepts:
        Authorization: Bearer <token>
        X-Access-Token: <token>

    Checks that token is not revoked in auth_tokens table.
    """

    raw_token = None
    if credentials and credentials.credentials:
        raw_token = credentials.credentials.strip()

    if not raw_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            raw_token = auth_header.split(" ", 1)[1].strip()
        elif auth_header:
            raw_token = auth_header.strip()
        elif request.headers.get("X-Access-Token"):
            raw_token = request.headers.get("X-Access-Token").strip()

    if not raw_token:

        raise HTTPException(
            status_code=401,
            detail={
                "code": "AUTH_REQUIRED",
                "message": "Authentication required. Please provide a valid access token in the Authorization header.",
            },
        )

    try:

        employee_id = get_employee_id_from_access_token(
            raw_token
        )

    except ValueError as exc:

        error_message = str(exc)

        # Map known token errors to specific codes
        if "expired" in error_message.lower():
            error_code = "TOKEN_EXPIRED"
        elif "invalid" in error_message.lower():
            error_code = "INVALID_TOKEN"
        else:
            error_code = "AUTH_FAILED"

        raise HTTPException(
            status_code=401,
            detail={
                "code": error_code,
                "message": error_message,
            },
        )

    # --------------------------------------------------------------------
    # Check if this access token has been revoked
    # --------------------------------------------------------------------
    token_h = hash_token(raw_token)
    revoked_token = (
        db.query(AuthToken)
        .filter(
            AuthToken.employee_id == employee_id,
            AuthToken.token_hash == token_h,
            AuthToken.revoked_at.isnot(None),
        )
        .first()
    )

    if revoked_token:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "TOKEN_REVOKED",
                "message": "Your session has been revoked. Please login again.",
            },
        )

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not employee:

        raise HTTPException(
            status_code=401,
            detail={
                "code": "EMPLOYEE_NOT_FOUND",
                "message": "Employee account not found. Please contact your administrator.",
            },
        )

    if employee.deactivate:

        raise HTTPException(
            status_code=401,
            detail={
                "code": "ACCOUNT_DEACTIVATED",
                "message": "Your account has been deactivated. Please contact your administrator.",
            },
        )

    if employee.status not in (
        "active",
        "WFH",
    ):

        raise HTTPException(
            status_code=401,
            detail={
                "code": "ACCOUNT_INACTIVE",
                "message": "Your account is currently inactive. Please contact your administrator.",
            },
        )

    return employee