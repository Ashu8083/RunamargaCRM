# app/routes/admin/admins_routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.security import get_current_employee
from app.models.employees import Employee

from app.schemas.admins_schema import (
    AdminCreate,
    AdminUpdate,
    AdminStatusUpdate,
)

from app.controllers.admins_controller import AdminsController


router = APIRouter(
    prefix="/admins",
    tags=["Admins"],
)


# ============================================================================
# GET ADMINS
# ============================================================================
#
# Returns EmployeeContexts whose Context code is:
#
#     GLOBAL
#
# The role returned by the service is:
#
#     Admin
#
# ============================================================================

@router.get("")
def get_admins(
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        return AdminsController.get_admins(
            db=db,
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        raise


# ============================================================================
# CREATE ADMIN
# ============================================================================
#
# Required:
#
#     employee_id
#     status
#
# The GLOBAL context is automatically resolved by the service.
#
# Frontend does NOT send context_id.
#
# ============================================================================

@router.post("")
def create_admin(
    payload: AdminCreate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AdminsController.create_admin(
            db=db,
            payload=payload,
            action_by= employee.id,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# UPDATE ADMIN
# ============================================================================
#
# Admin role is permanently GLOBAL.
#
# Employee cannot be changed.
#
# Therefore this endpoint does not change the Admin's employee or context.
#
# ============================================================================

@router.put("/{admin_id}")
def update_admin(
    admin_id: int,
    payload: AdminUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AdminsController.update_admin(
            db=db,
            admin_id=admin_id,
            payload=payload,
            action_by=employee.id,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# DELETE ADMIN
# ============================================================================

@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AdminsController.delete_admin(
            db=db,
            admin_id=admin_id,
            action_by=employee.id,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise


# ============================================================================
# UPDATE ADMIN STATUS
# ============================================================================
#
# Allowed:
#
#     Active
#     Inactive
#
# Backend stores:
#
#     is_active = True / False
#
# ============================================================================

@router.patch("/{admin_id}/status")
def update_admin_status(
    admin_id: int,
    payload: AdminStatusUpdate,
    db: Session = Depends(get_db),
    employee: Employee = Depends(get_current_employee),
):
    try:

        result = AdminsController.update_admin_status(
            db=db,
            admin_id=admin_id,
            payload=payload,
        )

        db.commit()

        return result

    except ValueError as exc:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        db.rollback()

        raise