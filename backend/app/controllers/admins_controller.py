# app/controllers/admins_controller.py

from sqlalchemy.orm import Session

from app.schemas.admins_schema import (
    AdminCreate,
    AdminUpdate,
    AdminStatusUpdate,
)

from app.services.admins_service import AdminsService


class AdminsController:

    # ========================================================================
    # GET ADMINS
    # ========================================================================

    @staticmethod
    def get_admins(
        db: Session,
    ):
        return AdminsService.get_admins(
            db=db,
        )

    # ========================================================================
    # CREATE ADMIN
    # ========================================================================
    #
    # Required:
    #
    #     employee_id
    #     status
    #
    # The GLOBAL context is resolved by AdminsService.
    #
    # ========================================================================

    @staticmethod
    def create_admin(
        db: Session,
        payload: AdminCreate,
    ):
        return AdminsService.create_admin(
            db=db,
            employee_id=payload.employee_id,
            status=payload.status,
        )

    # ========================================================================
    # UPDATE ADMIN
    # ========================================================================
    #
    # Admin role/context is fixed to GLOBAL.
    #
    # Employee cannot be changed.
    #
    # ========================================================================

    @staticmethod
    def update_admin(
        db: Session,
        admin_id: int,
        payload: AdminUpdate,
    ):
        return AdminsService.update_admin(
            db=db,
            admin_id=admin_id,
        )

    # ========================================================================
    # DELETE ADMIN
    # ========================================================================

    @staticmethod
    def delete_admin(
        db: Session,
        admin_id: int,
    ):
        return AdminsService.delete_admin(
            db=db,
            admin_id=admin_id,
        )

    # ========================================================================
    # UPDATE ADMIN STATUS
    # ========================================================================

    @staticmethod
    def update_admin_status(
        db: Session,
        admin_id: int,
        payload: AdminStatusUpdate,
    ):
        return AdminsService.update_admin_status(
            db=db,
            admin_id=admin_id,
            status=payload.status,
        )