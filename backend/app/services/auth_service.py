# backend/app/services/auth_service.py
import hashlib
import secrets
import resend
from datetime import datetime, timedelta, timezone
from app.config.settings import settings
from app.models.auth_tokens import AuthToken
from fastapi.requests import  Request
from app.core.security import hash_token
from sqlalchemy.orm import Session
from app.models.employees import Employee
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_token,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission
from app.models.permissions import Permission
from app.models.contexts import Context
from app.services.employee_face_profile_service import logger

OTP_EXPIRY_MINUTES = 5


def get_otp_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRY_MINUTES
    )

def generate_otp() -> str:
    """Generate a 4 digit OTP"""
    return f"{secrets.randbelow(1_0000):04d}"
def hash_otp(otp: str) -> str:
    """Hash OTP before storing it in the database."""
    return hashlib.sha256(otp.encode()).hexdigest()
def find_employee_by_email(
    db: Session,
    email: str,
) -> Employee | None:
    return (
        db.query(Employee)
        .filter(
            Employee.email == email,
            Employee.deleted_at.is_(None),
        )
        .first()
    )


def validate_employee_for_login(employee: Employee) -> None:
    if employee.deactivate:
        raise ValueError("Account is deactivated")

    if employee.status != "active":
        raise ValueError("Account is inactive")


def save_login_otp(
    db: Session,
    employee: Employee,
    otp: str,
    expires_at: datetime,
) -> None:
    employee.login_otp_hash = hash_otp(otp)
    employee.login_otp_expires_at = expires_at
    employee.login_otp_sent_at = datetime.now(timezone.utc)

    db.commit()

def send_otp_email(
    email: str,
    otp: str,
) -> None:
    resend.api_key = settings.RESEND_API_KEY

    resend.Emails.send({
        "from": f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM_ADDRESS}>",
        "to": [email],
        "subject": "Your Login OTP - Runamarga",
        "html": f"""
            <div style="font-family: Arial, sans-serif;">
                <h2>Runamarga Login OTP</h2>

                <p>Your One-Time Password is:</p>

                <h1>{otp}</h1>

                <p>
                    This OTP is valid for
                    {OTP_EXPIRY_MINUTES} minutes.
                </p>

                <p>
                    If you did not request this login,
                    please ignore this email.
                </p>
            </div>
        """,
    })
def create_login_otp(
    db: Session,
    email: str,
) -> str:
    employee = find_employee_by_email(db, email)

    if not employee:
        raise ValueError("Invalid email")

    validate_employee_for_login(employee)

    otp = generate_otp()
    expires_at = get_otp_expiry()

    save_login_otp(
        db=db,
        employee=employee,
        otp=otp,
        expires_at=expires_at,
    )

    send_otp_email(
        email=email,
        otp=otp,
    )

    return otp
def get_employee_contexts(
    db: Session,
    employee_id: int,
) -> list[dict]:

    employee_contexts = (
        db.query(EmployeeContext)
        .join(
            Context,
            EmployeeContext.context_id == Context.id,
        )
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.is_active.is_(True),
            Context.is_active.is_(True),
        )
        .all()
    )

    result = []

    for employee_context in employee_contexts:

        permissions = (
            db.query(Permission.code)
            .join(
                EmployeeContextPermission,
                EmployeeContextPermission.permission_id
                == Permission.id,
            )
            .filter(
                EmployeeContextPermission.employee_context_id
                == employee_context.id,
                Permission.is_active.is_(True),
            )
            .all()
        )
        # logger.info(
        #     f"Employee context {employee_context.id} add to request {request.state} ")

        result.append(
            {
                "id": employee_context.id,
                "context_id": employee_context.context.id,
                "code": employee_context.context.code,
                "name": employee_context.context.name,
                "is_default": employee_context.is_default,
                "permissions": [
                    permission.code
                    for permission in permissions
                ],
            }
        )

    return result
def verify_login_otp(
    db: Session,
    email: str,
    otp: str,
) -> tuple[Employee, str, str, list[dict]]:

    employee = find_employee_by_email(db, email)

    if not employee:
        raise ValueError("Invalid email")

    validate_employee_for_login(employee)

    if not employee.login_otp_hash:
        raise ValueError("OTP not requested")

    if not employee.login_otp_expires_at:
        raise ValueError("OTP expired")

    if datetime.now(timezone.utc) > employee.login_otp_expires_at:
        raise ValueError("OTP expired")

    if hash_otp(otp) != employee.login_otp_hash:
        raise ValueError("Invalid OTP")

    employee.login_otp_hash = None
    employee.login_otp_expires_at = None
    employee.login_otp_sent_at = None

    db.commit()
    db.refresh(employee)

    access_token = create_access_token(employee.id)
    refresh_token = create_refresh_token(employee.id)
    save_refresh_token(
        db=db,
        employee_id=employee.id,
        refresh_token=refresh_token,
    )
    contexts = get_employee_contexts(
        db=db,
        employee_id=employee.id,
    )

    return employee, access_token, refresh_token, contexts

def save_refresh_token(
    db: Session,
    employee_id: int,
    refresh_token: str,
) -> AuthToken:

    # Revoke any existing active refresh tokens
    existing_tokens = (
        db.query(AuthToken)
        .filter(
            AuthToken.employee_id == employee_id,
            AuthToken.token_type == "refresh",
            AuthToken.revoked_at.is_(None),
        )
        .all()
    )

    now = datetime.now(timezone.utc)

    for token in existing_tokens:
        token.revoked_at = now

    # Create the new refresh token session
    auth_token = AuthToken(
        employee_id=employee_id,
        token_hash=hash_token(refresh_token),
        token_type="refresh",
        expires_at=now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )

    db.add(auth_token)
    db.commit()
    db.refresh(auth_token)
    return auth_token
def refresh_access_token(
    db: Session,
    refresh_token: str,
) -> str:
    """
    JWT valid
    ↓
    type = refresh
    ↓
    employee_id exists
    ↓
    hash matches auth_tokens
    ↓
    session isn't revoked
    ↓
    session isn't expired
    ↓
    employee still active
    ↓
    NEW access JWT
    """
    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise ValueError("Invalid refresh token")

    employee_id = payload.get("sub")

    if not employee_id:
        raise ValueError("Invalid refresh token")

    token_hash = hash_token(refresh_token)

    auth_token = (
        db.query(AuthToken)
        .filter(
            AuthToken.employee_id == int(employee_id),
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == "refresh",
            AuthToken.revoked_at.is_(None),
        )
        .first()
    )

    if not auth_token:
        raise ValueError("Refresh session is invalid or revoked")

    if datetime.now(timezone.utc) > auth_token.expires_at:
        raise ValueError("Refresh session has expired")

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == int(employee_id),
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not employee:
        raise ValueError("Employee not found")

    validate_employee_for_login(employee)

    return create_access_token(employee.id)