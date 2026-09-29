# app/services/employee_service.py
from datetime import datetime
from typing import Iterable

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.core.access_control import AccessControl
from app.audit.audit_service import AuditService
from app.models import AuditLog
from app.models.permissions import Permission
from app.models.employees import Employee
from app.models.employee_details import EmployeeDetails
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import (
    EmployeeContextPermission,
)
from app.services.employee_face_profile_service import (
    EmployeeFaceProfileService,
)
from app.models.contexts import Context
from app.models.permissions import Permission
from app.models.roles import Role
from app.services.employee_audit_log_service import log_employee_action
from app.Enums.LogAction import LogAction



from app.schemas.employee import (
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
)

from app.utils.file_upload import (
    save_file,
    delete_static_file,
    ALLOWED_IMAGE_EXTS,
    DOCUMENT_EXTS,
)


# =============================================================
# CONSTANTS
# =============================================================

RESTRICTED_ROLES = {
    "admin",
    "business",
}


# =============================================================
# HELPERS
# =============================================================

def _normalize_role_name(role: Role | None) -> str | None:
    if not role or not role.name:
        return None

    return role.name.strip().lower()


def _get_global_context(db: Session) -> Context:
    context = (
        db.query(Context)
        .filter(
            Context.name == "Global",
            Context.is_active.is_(True),
        )
        .first()
    )

    if not context:
        raise HTTPException(
            status_code=500,
            detail="Global context is not configured",
        )

    return context

@staticmethod
def get_roles(db, employee):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:view",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return (
        db.query(Role)
        .order_by(Role.id)
        .all()
    )
@staticmethod
def get_common_permissions(
    db: Session,
    employee: Employee,
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:view",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return (
        db.query(Permission)
        .filter(
            Permission.is_active.is_(True),
            Permission.description.ilike("common"),
        )
        .order_by(Permission.id)
        .all()
    )
def _validate_employee_role(
    db: Session,
    role_id: int,
) -> Role:
    role = (
        db.query(Role)
        .filter(Role.id == role_id)
        .first()
    )

    if not role:
        raise HTTPException(
            status_code=400,
            detail="Invalid role",
        )

    return role


def _validate_common_permissions(
    db: Session,
    permission_ids: list[int] | None,
) -> list[Permission]:
    if not permission_ids:
        return []

    permissions = (
        db.query(Permission)
        .filter(
            Permission.id.in_(permission_ids),
            Permission.is_active.is_(True),
            Permission.description.ilike("common"),
        )
        .all()
    )

    found_permission_ids = {
        permission.id
        for permission in permissions
    }

    requested_permission_ids = set(
        permission_ids
    )

    invalid_permission_ids = (
        requested_permission_ids
        - found_permission_ids
    )

    if invalid_permission_ids:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid common permission IDs: "
                f"{sorted(invalid_permission_ids)}"
            ),
        )

    return permissions


def _validate_reports_to(
    db: Session,
    reports_to_id: int | None,
    employee_id: int,
) -> None:
    if reports_to_id is None:
        return

    if reports_to_id == employee_id:
        raise HTTPException(
            status_code=400,
            detail="Employee cannot report to themselves",
        )

    reports_to = (
        db.query(Employee)
        .filter(
            Employee.id == reports_to_id,
            Employee.deleted_at.is_(None),
            Employee.deactivate.is_(False),
            Employee.status == "active",
        )
        .first()
    )

    if not reports_to:
        raise HTTPException(
            status_code=400,
            detail="Invalid Reports To employee",
        )


def _delete_files(paths: Iterable[str | None]) -> None:
    for path in paths:
        if path:
            try:
                delete_static_file(path)
            except Exception as exc:
                print(
                    "FAILED TO DELETE FILE:",
                    path,
                    repr(exc),
                )


# =============================================================
# GET EMPLOYEES
# =============================================================

def get_employees(
    db: Session,
    employee: Employee,
    context_id: int | None = None,
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:view",
        context_id=context_id,
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    employees = (
        db.query(Employee)
        .filter(
            Employee.deleted_at.is_(None)
        )
        .order_by(Employee.id)
        .all()
    )

    global_context = (
        db.query(Context)
        .filter(
            Context.name == "Global",
            Context.is_active.is_(True),
        )
        .first()
    )

    result = []

    for emp in employees:

        global_employee_context = None

        if global_context:
            global_employee_context = next(
                (
                    employee_context
                    for employee_context in emp.contexts
                    if (
                        employee_context.context_id
                        == global_context.id
                        and employee_context.is_active
                    )
                ),
                None,
            )

        permission_ids = []

        if global_employee_context:
            permission_ids = [
                employee_context_permission.permission_id
                for employee_context_permission
                in global_employee_context.permissions
                if (
                    employee_context_permission.permission
                    and employee_context_permission.permission.is_active
                    and employee_context_permission.permission.description
                    and employee_context_permission.permission.description.lower()
                    == "common"
                )
            ]

        reports_to = None

        if global_employee_context:
            reports_to_employee = (
                global_employee_context.reports_to
            )

            if reports_to_employee:
                reports_to = {
                    "id": reports_to_employee.id,
                    "name": reports_to_employee.name,
                }

        result.append(
            {
                "id": emp.id,
                "name": emp.name,
                "email": emp.email,
                "phone": emp.phone,
                "status": emp.status,
                "blocked": emp.deactivate,

                "role": {
                    "id": emp.role.id,
                    "name": emp.role.name,
                } if emp.role else None,

                "reports_to": reports_to,

                "permission_ids": permission_ids,

                "documents": {
                    "profile_image": (
                        emp.details.profile_image
                        if emp.details
                        else None
                    ),
                    "aadhar_card": (
                        emp.details.aadhar_card
                        if emp.details
                        else None
                    ),
                    "pan_card": (
                        emp.details.pan_card
                        if emp.details
                        else None
                    ),
                    "bank_passbook": (
                        emp.details.bank_passbook
                        if emp.details
                        else None
                    ),
                    "salary_slip": (
                        emp.details.salary_slip
                        if emp.details
                        else []
                    ),
                },
            }
        )

    return result


# =============================================================
# CREATE EMPLOYEE
# =============================================================

def create_employee(
    db: Session,
    employee: Employee,
    data: CreateEmployeeRequest,
    employee_context_id: int | None = None,
    profile_image: UploadFile | None = None,
    aadhaar_card: UploadFile | None = None,
    pan_card: UploadFile | None = None,
    bank_passbook: UploadFile | None = None,
    salary_slips: list[UploadFile] | None = None,
):
    # =========================================================
    # 1. Check permission
    # =========================================================

    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:create",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    # =========================================================
    # 2. Validate role
    # =========================================================

    role = _validate_employee_role(
        db=db,
        role_id=data.role_id,
    )

    role_name = _normalize_role_name(role)

    if role_name in RESTRICTED_ROLES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Admin and Business employees "
                "cannot be created here"
            ),
        )

    # =========================================================
    # 3. Validate Reports To
    # =========================================================

    _validate_reports_to(
        db=db,
        reports_to_id=data.reports_to_id,
        employee_id=employee.id,
    )

    # =========================================================
    # 4. Validate permissions
    # =========================================================

    permissions = _validate_common_permissions(
        db=db,
        permission_ids=data.permission_ids,
    )

    # =========================================================
    # 5. Check duplicate email / phone
    # =========================================================

    if data.email:
        existing_email = (
            db.query(Employee)
            .filter(
                Employee.email == data.email,
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=409,
                detail="Employee with this email already exists",
            )

    if data.phone:
        existing_phone = (
            db.query(Employee)
            .filter(
                Employee.phone == data.phone,
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if existing_phone:
            raise HTTPException(
                status_code=409,
                detail="Employee with this phone already exists",
            )

    saved_files = []

    try:

        # =====================================================
        # 6. Create employee
        # =====================================================

        new_employee = Employee(
            name=data.name,
            email=data.email,
            phone=data.phone,
            role_id=data.role_id,
            status=data.status,
        )

        db.add(new_employee)
        db.flush()

        # =====================================================
        # 7. Create employee details
        # =====================================================

        details = EmployeeDetails(
            employee_id=new_employee.id,
            dob=data.date_of_birth,
            joining_date=data.joining_date,
            designation=data.designation,
            shift_type=data.shift_type,
            address=data.address,
            current_ctc=data.current_ctc,
            previous_ctc=data.previous_ctc,
            blood_group=data.blood_group,
            pan_no=data.pan_no,
            aadhar_no=data.aadhar_no,
        )

        db.add(details)

        # =====================================================
        # 8. Save uploaded files
        # =====================================================

        if profile_image:
            path = save_file(
                profile_image,
                "employees/profile_images",
                allowed_exts=ALLOWED_IMAGE_EXTS,
            )

            details.profile_image = path
            saved_files.append(path)
        if details.profile_image:
            EmployeeFaceProfileService.upsert_face_profile(
                db=db,
                employee_id=new_employee.id,
                image_path=details.profile_image,
                updated_by=employee.id,
            )
        if aadhaar_card:
            path = save_file(
                aadhaar_card,
                "employees/aadhar_cards",
                allowed_exts=DOCUMENT_EXTS,
            )

            details.aadhar_card = path
            saved_files.append(path)

        if pan_card:
            path = save_file(
                pan_card,
                "employees/pan_cards",
                allowed_exts=DOCUMENT_EXTS,
            )

            details.pan_card = path
            saved_files.append(path)

        if bank_passbook:
            path = save_file(
                bank_passbook,
                "employees/bank_passbooks",
                allowed_exts=DOCUMENT_EXTS,
            )

            details.bank_passbook = path
            saved_files.append(path)

        if salary_slips:
            salary_paths = []

            for salary_slip in salary_slips:
                path = save_file(
                    salary_slip,
                    "employees/salary_slips",
                    allowed_exts=DOCUMENT_EXTS,
                )

                salary_paths.append(path)
                saved_files.append(path)

            details.salary_slip = salary_paths

        # =====================================================
        # 9. Store Reports To + Permissions
        # =====================================================

        if (
            data.reports_to_id is not None
            or permissions
        ):
            global_context = _get_global_context(db)

            employee_context = EmployeeContext(
                employee_id=new_employee.id,
                context_id=global_context.id,
                is_default=True,
                is_active=True,
                reports_to_id=data.reports_to_id,
            )

            db.add(employee_context)
            db.flush()

            for permission in permissions:
                db.add(
                    EmployeeContextPermission(
                        employee_context_id=employee_context.id,
                        permission_id=permission.id,
                    )
                )

        # =====================================================
        # 10. Employee Audit Log + Commit
        # =====================================================
        log_employee_action(
            db=db,
            action=LogAction.create,
            action_by=employee.id,
            action_on=new_employee.id,
            report_to=data.reports_to_id,
        )

        audit_logs = AuditService.log(
            db=db,
            action= "employee create",
            module= "employee",
            entity_id=new_employee.id,
            description= "Employee created successfully",
            employee_context_id=employee_context_id,
        )

        db.commit()

        db.refresh(new_employee)



        return {
            "success": True,
            "message": "Employee created successfully",
            "employee": {
                "id": new_employee.id,
                "name": new_employee.name,
                "email": new_employee.email,
                "phone": new_employee.phone,
                "role_id": new_employee.role_id,
                "status": new_employee.status,
                "reports_to_id": data.reports_to_id,
                "permission_ids": [
                    permission.id
                    for permission in permissions
                ],
            },
        }

    except HTTPException:
        db.rollback()
        _delete_files(saved_files)
        raise

    except Exception as exc:
        db.rollback()
        _delete_files(saved_files)

        print(
            "CREATE EMPLOYEE ERROR:",
            repr(exc),
        )

        raise


# =============================================================
# UPDATE EMPLOYEE
# =============================================================

def update_employee(
    db: Session,
    employee: Employee,
    employee_id: int,
    data: UpdateEmployeeRequest,
    profile_image: UploadFile | None = None,
    aadhaar_card: UploadFile | None = None,
    pan_card: UploadFile | None = None,
    bank_passbook: UploadFile | None = None,
    salary_slips: list[UploadFile] | None = None,
):
    # =========================================================
    # 1. Check permission
    # =========================================================

    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:edit",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    # =========================================================
    # 2. Find target employee
    # =========================================================

    target = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not target:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    # =========================================================
    # 3. Determine current + requested role
    # =========================================================

    current_role = target.role

    current_role_name = _normalize_role_name(
        current_role
    )

    requested_role = _validate_employee_role(
        db=db,
        role_id=data.role_id,
    )

    requested_role_name = _normalize_role_name(
        requested_role
    )

    # =========================================================
    # 4. Prevent changing a normal employee INTO
    #    Admin / Business
    #
    #    But allow an existing Admin / Business employee
    #    to keep their current role while editing details.
    # =========================================================

    if (
        requested_role_name in RESTRICTED_ROLES
        and current_role_name not in RESTRICTED_ROLES
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Admin and Business roles "
                "cannot be assigned here"
            ),
        )

    # Existing Admin / Business:
    # role must remain unchanged.
    if current_role_name in RESTRICTED_ROLES:
        if (
            requested_role.id
            != current_role.id
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Admin and Business roles "
                    "cannot be changed"
                ),
            )

    # =========================================================
    # 5. Determine Reports To + permissions
    # =========================================================

    if current_role_name in RESTRICTED_ROLES:
        # Admin / Business:
        # these fields are intentionally ignored.
        reports_to_id = None
        permission_ids = []

        permissions = []

    else:
        reports_to_id = data.reports_to_id
        permission_ids = data.permission_ids

        _validate_reports_to(
            db=db,
            reports_to_id=reports_to_id,
            employee_id=target.id,
        )

        permissions = _validate_common_permissions(
            db=db,
            permission_ids=permission_ids,
        )

    # =========================================================
    # 6. Check duplicate email / phone
    # =========================================================

    if data.email:
        existing_email = (
            db.query(Employee)
            .filter(
                Employee.email == data.email,
                Employee.id != target.id,
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=409,
                detail="Employee with this email already exists",
            )

    if data.phone:
        existing_phone = (
            db.query(Employee)
            .filter(
                Employee.phone == data.phone,
                Employee.id != target.id,
                Employee.deleted_at.is_(None),
            )
            .first()
        )

        if existing_phone:
            raise HTTPException(
                status_code=409,
                detail="Employee with this phone already exists",
            )

    saved_files = []

    old_files_to_delete = []

    try:

        # =====================================================
        # 7. Update employee
        # =====================================================

        target.name = data.name
        target.email = data.email
        target.phone = data.phone

        # For Admin / Business, keep their existing role.
        # For normal employees, use the requested role.
        if current_role_name in RESTRICTED_ROLES:
            target.role_id = current_role.id
        else:
            target.role_id = requested_role.id

        target.status = data.status

        # =====================================================
        # 8. Get / create EmployeeDetails
        # =====================================================

        details = (
            db.query(EmployeeDetails)
            .filter(
                EmployeeDetails.employee_id == target.id
            )
            .first()
        )

        if not details:
            details = EmployeeDetails(
                employee_id=target.id
            )

            db.add(details)
            db.flush()

        # =====================================================
        # 9. Existing document paths
        # =====================================================

        old_profile_image = details.profile_image
        old_aadhar_card = details.aadhar_card
        old_pan_card = details.pan_card
        old_bank_passbook = details.bank_passbook

        # =====================================================
        # 10. Save replacement documents
        # =====================================================

        if profile_image:
            new_profile_image = save_file(
                profile_image,
                "employees/profile_images",
                allowed_exts=ALLOWED_IMAGE_EXTS,
            )

            details.profile_image = new_profile_image

            saved_files.append(
                new_profile_image
            )

            if old_profile_image:
                old_files_to_delete.append(
                    old_profile_image
                )
            if new_profile_image:
                EmployeeFaceProfileService.upsert_face_profile(
                    db=db,
                    employee_id=target.id,
                    image_path=new_profile_image,
                    updated_by=employee.id,
                )
        if aadhaar_card:
            new_aadhar_card = save_file(
                aadhaar_card,
                "employees/aadhar_cards",
                allowed_exts=DOCUMENT_EXTS,
            )

            details.aadhar_card = new_aadhar_card

            saved_files.append(
                new_aadhar_card
            )

            if old_aadhar_card:
                old_files_to_delete.append(
                    old_aadhar_card
                )

        if pan_card:
            new_pan_card = save_file(
                pan_card,
                "employees/pan_cards",
                allowed_exts=DOCUMENT_EXTS,
            )

            details.pan_card = new_pan_card

            saved_files.append(
                new_pan_card
            )

            if old_pan_card:
                old_files_to_delete.append(
                    old_pan_card
                )

        if bank_passbook:
            new_bank_passbook = save_file(
                bank_passbook,
                "employees/bank_passbooks",
                allowed_exts=DOCUMENT_EXTS,
            )

            details.bank_passbook = new_bank_passbook

            saved_files.append(
                new_bank_passbook
            )

            if old_bank_passbook:
                old_files_to_delete.append(
                    old_bank_passbook
                )

        # =====================================================
        # 11. Append salary slips
        # =====================================================

        if salary_slips:

            existing_salary_slips = (
                details.salary_slip
                if isinstance(
                    details.salary_slip,
                    list,
                )
                else []
            )

            new_salary_paths = []

            for salary_slip in salary_slips:

                path = save_file(
                    salary_slip,
                    "employees/salary_slips",
                    allowed_exts=DOCUMENT_EXTS,
                )

                new_salary_paths.append(path)
                saved_files.append(path)

            details.salary_slip = (
                existing_salary_slips
                + new_salary_paths
            )

        # =====================================================
        # 12. Update employee details
        # =====================================================

        details.dob = data.date_of_birth
        details.joining_date = data.joining_date
        details.designation = data.designation
        details.shift_type = data.shift_type
        details.address = data.address
        details.current_ctc = data.current_ctc
        details.previous_ctc = data.previous_ctc
        details.blood_group = data.blood_group
        details.pan_no = data.pan_no
        details.aadhar_no = data.aadhar_no

        # =====================================================
        # 13. Handle Global employee context
        # =====================================================

        global_context = _get_global_context(db)

        employee_context = (
            db.query(EmployeeContext)
            .filter(
                EmployeeContext.employee_id == target.id,
                EmployeeContext.context_id == global_context.id,
                EmployeeContext.is_active.is_(True),
            )
            .first()
        )

        # =====================================================
        # 14. Admin / Business
        # =====================================================

        if current_role_name in RESTRICTED_ROLES:

            # Do not modify Reports To or permissions.
            pass

        # =====================================================
        # 15. Normal employee context
        # =====================================================

        else:

            if (
                reports_to_id is not None
                or permissions
            ):

                if not employee_context:

                    employee_context = EmployeeContext(
                        employee_id=target.id,
                        context_id=global_context.id,
                        is_default=True,
                        is_active=True,
                    )

                    db.add(employee_context)
                    db.flush()

                employee_context.reports_to_id = (
                    reports_to_id
                )

            elif employee_context:

                employee_context.reports_to_id = None

            # =================================================
            # 16. Replace common permissions
            # =================================================

            if employee_context:

                db.query(
                    EmployeeContextPermission
                ).filter(
                    EmployeeContextPermission.employee_context_id
                    == employee_context.id
                ).delete(
                    synchronize_session=False
                )

                for permission in permissions:

                    db.add(
                        EmployeeContextPermission(
                            employee_context_id=(
                                employee_context.id
                            ),
                            permission_id=permission.id,
                        )
                    )

        # =====================================================
        # 17. Employee Audit Log + Commit
        # =====================================================
        log_employee_action(
            db=db,
            action="create",
            action_by=employee.id,
            action_on=target.id,
            report_to=data.reports_to_id
        )

        db.commit()
        db.refresh(target)

    except HTTPException:
        db.rollback()

        # New files must be removed because DB update failed.
        _delete_files(saved_files)

        raise

    except Exception as exc:
        db.rollback()

        # New files must be removed because DB update failed.
        _delete_files(saved_files)

        print(
            "UPDATE EMPLOYEE ERROR:",
            repr(exc),
        )

        raise

    # =========================================================
    # 18. Delete replaced files AFTER successful commit
    # =========================================================

    _delete_files(old_files_to_delete)

    return {
        "success": True,
        "message": "Employee updated successfully",
        "employee": {
            "id": target.id,
            "name": target.name,
            "email": target.email,
            "phone": target.phone,
            "role_id": target.role_id,
            "status": target.status,
            "reports_to_id": (
                None
                if current_role_name in RESTRICTED_ROLES
                else reports_to_id
            ),
            "permission_ids": [
                permission.id
                for permission in permissions
            ],
        },
    }


# =============================================================
# BLOCK / UNBLOCK EMPLOYEE
# =============================================================

def update_employee_block_status(
    db: Session,
    employee: Employee,
    employee_id: int,
    blocked: bool,
):
    target = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not target:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:block",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    target.deactivate = blocked

    db.commit()
    db.refresh(target)

    return {
        "success": True,
        "message": (
            "Employee blocked"
            if blocked
            else "Employee unblocked"
        ),
        "employee": {
            "id": target.id,
            "blocked": target.deactivate,
        },
    }


# =============================================================
# DELETE EMPLOYEE
# =============================================================

def delete_employee(
    db: Session,
    employee: Employee,
    employee_id: int,
):
    if not AccessControl.has_permission(
        db=db,
        employee=employee,
        permission="employees:delete",
    ):
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )
    reports_to_id = employee.contexts.reports_to_id

    target = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id,
            Employee.deleted_at.is_(None),
        )
        .first()
    )

    if not target:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    target.deleted_at = datetime.utcnow()

    log_employee_action(
        db=db,
        action="delete",
        action_by=employee.id,
        action_on=target.id,
        report_to= reports_to_id
    )

    db.commit()

    return {
        "success": True,
        "message": "Employee deleted successfully",
        "employee_id": target.id,
    }