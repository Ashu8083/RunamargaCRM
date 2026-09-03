# backend/seeders/employee_rbac_seeder.py

from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.roles import Role
from app.models.employees import Employee
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission
from app.models.permissions import Permission


ROLES = [
    {
        "name": "admin",
        "description": "System administrator",
    },
    {
        "name": "Guest",
        "description": "Guest user",
    },
    {
        "name": "HR",
        "description": "Human resources",
    },
    {
        "name": "accountant",
        "description": "Accountant",
    },
    {
        "name": "developer",
        "description": "Developer",
    },
    {
        "name": "business",
        "description": "Business user",
    },
]


CONTEXTS = [
    {
        "name": "Global",
        "code": "GLOBAL",
        "description": "Global application context",
    },
    {
        "name": "Agent",
        "code": "AGENT",
        "description": "Agent operational context",
    },
    {
        "name": "Relationship Manager",
        "code": "RM",
        "description": "Relationship Manager operational context",
    },
]


EMPLOYEES = [
    {
        "name": "Test Admin 1",
        "email": "admin@test.com",
        "phone": "9000000001",
        "role": "admin",
        "status": "active",
    },
    {
        "name": "Business Test 1",
        "email": "business@test.com",
        "phone": "9000000002",
        "role": "business",
        "status": "active",
    },
    {
        "name": "Test Employee",
        "email": "employee@test.com",
        "phone": "9000000008",
        "role": "accountant",
        "status": "active",
    },
    {
        "name": "komal mane",
        "email": "komal@test.com",
        "phone": "9000000010",
        "role": "admin",
        "status": "active",
    },
]


# employee name -> contexts
EMPLOYEE_CONTEXTS = {
    "Test Admin 1": [
        {
            "context": "GLOBAL",
            "is_default": True,
            "reports_to": None,
        },
    ],

    "Business Test 1": [
        {
            "context": "AGENT",
            "is_default": True,
            "reports_to": "Test Employee",
        },
        {
            "context": "RM",
            "is_default": False,
            "reports_to": "Test Admin 1",
        },
    ],

    "Test Employee": [
        {
            "context": "RM",
            "is_default": True,
            "reports_to": "Test Admin 1",
        },
    ],

    "komal mane": [
        {
            "context": "GLOBAL",
            "is_default": True,
            "reports_to": None,
        },
    ],
}


# Permission codes that should be assigned to each employee/context.
#
# Leave a list empty if that context should have no permissions.
#
# IMPORTANT:
# These permissions must already exist because your permissions
# seeder is responsible for creating them.
PERMISSIONS = {
    ("Test Admin 1", "GLOBAL"): "__ALL__",

    ("Business Test 1", "AGENT"): [
        "employees:view",
        "applications:view",
        "applications:create",
        "applications:update",
    ],

    ("Business Test 1", "RM"): [
        "employees:view",
        "applications:view",
        "applications:create",
        "applications:update",
    ],

    ("Test Employee", "RM"): [
        "employees:view",
        "applications:view",
        "applications:update",
    ],

    ("komal mane", "GLOBAL"): "__ALL__",
}


def get_or_create_role(
    db: Session,
    role_data: dict,
):
    role = (
        db.query(Role)
        .filter(Role.name == role_data["name"])
        .first()
    )

    if not role:
        role = Role(
            name=role_data["name"],
            description=role_data["description"],
            is_active=True,
        )

        db.add(role)
        db.flush()

    return role


def get_or_create_context(
    db: Session,
    context_data: dict,
):
    context = (
        db.query(Context)
        .filter(Context.code == context_data["code"])
        .first()
    )

    if not context:
        context = Context(
            name=context_data["name"],
            code=context_data["code"],
            description=context_data["description"],
            is_active=True,
        )

        db.add(context)
        db.flush()

    return context


def get_or_create_employee(
    db: Session,
    employee_data: dict,
    role: Role,
):
    employee = None

    if employee_data.get("email"):
        employee = (
            db.query(Employee)
            .filter(
                Employee.email == employee_data["email"]
            )
            .first()
        )

    if not employee and employee_data.get("phone"):
        employee = (
            db.query(Employee)
            .filter(
                Employee.phone == employee_data["phone"]
            )
            .first()
        )

    if not employee:
        employee = Employee(
            name=employee_data["name"],
            email=employee_data["email"],
            phone=employee_data["phone"],
            role_id=role.id,
            status=employee_data["status"],
            deactivate=False,
        )

        db.add(employee)
        db.flush()

    else:
        employee.name = employee_data["name"]
        employee.role_id = role.id
        employee.status = employee_data["status"]

    return employee


def get_or_create_employee_context(
    db: Session,
    employee: Employee,
    context: Context,
    is_default: bool,
    reports_to: Employee | None,
):
    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee.id,
            EmployeeContext.context_id == context.id,
        )
        .first()
    )

    if not employee_context:
        employee_context = EmployeeContext(
            employee_id=employee.id,
            context_id=context.id,
            is_default=is_default,
            reports_to_id=(
                reports_to.id
                if reports_to
                else None
            ),
            is_active=True,
        )

        db.add(employee_context)
        db.flush()

    else:
        employee_context.is_default = is_default
        employee_context.reports_to_id = (
            reports_to.id
            if reports_to
            else None
        )
        employee_context.is_active = True

    return employee_context


def seed_employee_context_permissions(
    db: Session,
    employee_context: EmployeeContext,
    permission_codes,
):
    if permission_codes == "__ALL__":
        permissions = (
            db.query(Permission)
            .filter(
                Permission.is_active.is_(True)
            )
            .all()
        )
    else:
        permissions = (
            db.query(Permission)
            .filter(
                Permission.code.in_(permission_codes),
                Permission.is_active.is_(True),
            )
            .all()
        )

    found_codes = {
        permission.code
        for permission in permissions
    }

    if permission_codes != "__ALL__":
        for code in permission_codes:
            if code not in found_codes:
                print(
                    f"WARNING: Permission not found: {code}"
                )

    for permission in permissions:
        existing = (
            db.query(EmployeeContextPermission)
            .filter(
                EmployeeContextPermission.employee_context_id
                == employee_context.id,
                EmployeeContextPermission.permission_id
                == permission.id,
            )
            .first()
        )

        if not existing:
            db.add(
                EmployeeContextPermission(
                    employee_context_id=employee_context.id,
                    permission_id=permission.id,
                )
            )
def seed():
    db = SessionLocal()

    try:
        # -----------------------------------------------------
        # 1. ROLES
        # -----------------------------------------------------

        roles = {}

        for role_data in ROLES:
            role = get_or_create_role(
                db,
                role_data,
            )

            roles[role.name] = role

        # -----------------------------------------------------
        # 2. CONTEXTS
        # -----------------------------------------------------

        contexts = {}

        for context_data in CONTEXTS:
            context = get_or_create_context(
                db,
                context_data,
            )

            contexts[context.code] = context

        # -----------------------------------------------------
        # 3. EMPLOYEES
        # -----------------------------------------------------

        employees = {}

        for employee_data in EMPLOYEES:
            role = roles[employee_data["role"]]

            employee = get_or_create_employee(
                db,
                employee_data,
                role,
            )

            employees[employee.name] = employee

        db.flush()

        # -----------------------------------------------------
        # 4. EMPLOYEE CONTEXTS
        # -----------------------------------------------------

        employee_contexts = {}

        for employee_name, context_data_list in EMPLOYEE_CONTEXTS.items():

            employee = employees[employee_name]

            for context_data in context_data_list:

                context_code = context_data["context"]

                context = contexts[context_code]

                reports_to_name = context_data["reports_to"]

                reports_to = None

                if reports_to_name:
                    reports_to = employees[reports_to_name]

                employee_context = (
                    get_or_create_employee_context(
                        db=db,
                        employee=employee,
                        context=context,
                        is_default=context_data["is_default"],
                        reports_to=reports_to,
                    )
                )

                employee_contexts[
                    (
                        employee_name,
                        context_code,
                    )
                ] = employee_context

        db.flush()

        # -----------------------------------------------------
        # 5. EMPLOYEE CONTEXT PERMISSIONS
        # -----------------------------------------------------

        for (
            employee_name,
            context_code,
        ), permission_codes in PERMISSIONS.items():

            employee_context = employee_contexts.get(
                (
                    employee_name,
                    context_code,
                )
            )

            if not employee_context:
                print(
                    "WARNING: Employee context not found:",
                    employee_name,
                    context_code,
                )
                continue

            seed_employee_context_permissions(
                db=db,
                employee_context=employee_context,
                permission_codes=permission_codes,
            )

        # -----------------------------------------------------
        # COMMIT
        # -----------------------------------------------------

        db.commit()

        print(
            "Employee RBAC seed completed successfully."
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()