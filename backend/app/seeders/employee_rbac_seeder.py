# backend/app/seeders/employee_rbac_seeder.py

from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.roles import Role
from app.models.employees import Employee
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import (
    EmployeeContextPermission,
)
from app.models.permissions import Permission


# ============================================================
# EMPLOYEES
# ============================================================

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


# ============================================================
# EMPLOYEE CONTEXTS
# ============================================================

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


# ============================================================
# EMPLOYEE CONTEXT PERMISSIONS
# ============================================================

PERMISSIONS = {

    # --------------------------------------------------------
    # Admin
    # --------------------------------------------------------

    (
        "Test Admin 1",
        "GLOBAL",
    ): "__ALL__",

    # --------------------------------------------------------
    # Business Test - Agent
    # --------------------------------------------------------

    (
        "Business Test 1",
        "AGENT",
    ): [
        "employees:view",
        "loans:view",
        "loans:create",
        "loans:edit",
        "loans:pending:view",
        "loans:status:update",
        "loans:chat:view",
        "application-filter:view",
        "profile:view",
    ],

    # --------------------------------------------------------
    # Business Test - RM
    # --------------------------------------------------------

    (
        "Business Test 1",
        "RM",
    ): [
        "employees:view",
        "loans:view",
        "loans:edit",
        "loans:pending:view",
        "profile:view",
    ],

    # --------------------------------------------------------
    # Accountant / RM
    # --------------------------------------------------------

    (
        "Test Employee",
        "RM",
    ): [
        "employees:view",
        "loans:view",
        "loans:edit",
        "loans:pending:view",
        "profile:view",
    ],

    # --------------------------------------------------------
    # Komal Admin
    # --------------------------------------------------------

    (
        "komal mane",
        "GLOBAL",
    ): "__ALL__",
}


# ============================================================
# GET / CREATE ROLE
# ============================================================

def get_or_create_role(
    db: Session,
    role_data: dict,
) -> Role:

    role = (
        db.query(Role)
        .filter(
            Role.name == role_data["name"]
        )
        .first()
    )

    if role:

        role.description = role_data["description"]
        role.is_active = True

        return role

    role = Role(
        name=role_data["name"],
        description=role_data["description"],
        is_active=True,
    )

    db.add(role)
    db.flush()

    return role


# ============================================================
# GET / CREATE CONTEXT
# ============================================================

def get_or_create_context(
    db: Session,
    context_data: dict,
) -> Context:

    context = (
        db.query(Context)
        .filter(
            Context.code == context_data["code"]
        )
        .first()
    )

    if context:

        context.name = context_data["name"]
        context.description = context_data["description"]
        context.is_active = True

        return context

    context = Context(
        name=context_data["name"],
        code=context_data["code"],
        description=context_data["description"],
        is_active=True,
    )

    db.add(context)
    db.flush()

    return context


# ============================================================
# GET / CREATE EMPLOYEE
# ============================================================

def get_or_create_employee(
    db: Session,
    employee_data: dict,
    role: Role,
) -> Employee:

    employee = (
        db.query(Employee)
        .filter(
            Employee.email == employee_data["email"]
        )
        .first()
    )

    if employee:

        employee.name = employee_data["name"]
        employee.phone = employee_data["phone"]
        employee.role_id = role.id
        employee.status = employee_data["status"]
        employee.deactivate = False

        return employee

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

    return employee


# ============================================================
# GET / CREATE EMPLOYEE CONTEXT
# ============================================================

def get_or_create_employee_context(
    db: Session,
    employee: Employee,
    context: Context,
    is_default: bool,
    reports_to: Employee | None,
) -> EmployeeContext:

    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id
            == employee.id,
            EmployeeContext.context_id
            == context.id,
        )
        .first()
    )

    if employee_context:

        employee_context.is_active = True
        employee_context.is_default = is_default
        employee_context.reports_to_id = (
            reports_to.id
            if reports_to
            else None
        )

        return employee_context

    employee_context = EmployeeContext(
        employee_id=employee.id,
        context_id=context.id,
        is_active=True,
        is_default=is_default,
        reports_to_id=(
            reports_to.id
            if reports_to
            else None
        ),
    )

    db.add(employee_context)
    db.flush()

    return employee_context


# ============================================================
# SYNC EMPLOYEE CONTEXT PERMISSIONS
# ============================================================

def seed_employee_context_permissions(
    db: Session,
    employee_context: EmployeeContext,
    permission_codes,
) -> None:

    # --------------------------------------------------------
    # Resolve __ALL__
    # --------------------------------------------------------

    if permission_codes == "__ALL__":

        permissions = (
            db.query(Permission)
            .filter(
                Permission.is_active.is_(True)
            )
            .all()
        )

    else:

        permission_codes = set(
            permission_codes
        )

        permissions = (
            db.query(Permission)
            .filter(
                Permission.code.in_(
                    permission_codes
                ),
                Permission.is_active.is_(True),
            )
            .all()
        )

        found_codes = {
            permission.code
            for permission in permissions
        }

        missing_codes = (
            permission_codes
            - found_codes
        )

        if missing_codes:

            raise ValueError(
                "Permissions missing from database: "
                f"{sorted(missing_codes)}"
            )

    desired_permission_ids = {
        permission.id
        for permission in permissions
    }

    # --------------------------------------------------------
    # Existing assignments
    # --------------------------------------------------------

    existing_assignments = (
        db.query(EmployeeContextPermission)
        .filter(
            EmployeeContextPermission.employee_context_id
            == employee_context.id
        )
        .all()
    )

    existing_permission_ids = {
        assignment.permission_id
        for assignment in existing_assignments
    }

    # --------------------------------------------------------
    # Add missing assignments
    # --------------------------------------------------------

    for permission in permissions:

        if permission.id not in existing_permission_ids:

            db.add(
                EmployeeContextPermission(
                    employee_context_id=employee_context.id,
                    permission_id=permission.id,
                )
            )

    # --------------------------------------------------------
    # Remove permissions no longer configured
    # --------------------------------------------------------

    for assignment in existing_assignments:

        if (
            assignment.permission_id
            not in desired_permission_ids
        ):

            db.delete(assignment)

    db.flush()


# ============================================================
# VALIDATE EMPLOYEE CONTEXT CONFIGURATION
# ============================================================

def validate_employee_context_configuration(
    employees: dict,
) -> None:

    # --------------------------------------------------------
    # Every configured employee must exist
    # --------------------------------------------------------

    for employee_name in EMPLOYEE_CONTEXTS:

        if employee_name not in employees:

            raise ValueError(
                "Employee context configuration references "
                f"unknown employee: {employee_name}"
            )

    # --------------------------------------------------------
    # Exactly one default context
    # --------------------------------------------------------

    for employee_name, contexts in EMPLOYEE_CONTEXTS.items():

        default_count = sum(
            1
            for context in contexts
            if context["is_default"]
        )

        if default_count != 1:

            raise ValueError(
                f"Employee '{employee_name}' must have "
                "exactly one default context."
            )


# ============================================================
# SEED
# ============================================================

def seed():

    db = SessionLocal()

    try:

        # ====================================================
        # 1. ROLES
        # ====================================================

        roles = {}

        role_definitions = [
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

        for role_data in role_definitions:

            role = get_or_create_role(
                db=db,
                role_data=role_data,
            )

            roles[role.name] = role

        # ====================================================
        # 2. CONTEXTS
        # ====================================================

        context_definitions = [
            {
                "name": "Global",
                "code": "GLOBAL",
                "description": "Global system access",
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

        contexts = {}

        for context_data in context_definitions:

            context = get_or_create_context(
                db=db,
                context_data=context_data,
            )

            contexts[context.code] = context

        # ====================================================
        # 3. EMPLOYEES
        # ====================================================

        employees = {}

        for employee_data in EMPLOYEES:

            role = roles.get(
                employee_data["role"]
            )

            if not role:

                raise ValueError(
                    "Role not found for employee "
                    f"{employee_data['name']}: "
                    f"{employee_data['role']}"
                )

            employee = get_or_create_employee(
                db=db,
                employee_data=employee_data,
                role=role,
            )

            employees[
                employee.name
            ] = employee

        db.flush()

        # ====================================================
        # 4. VALIDATE CONFIGURATION
        # ====================================================

        validate_employee_context_configuration(
            employees
        )

        # ====================================================
        # 5. EMPLOYEE CONTEXTS
        # ====================================================

        employee_contexts = {}

        for (
            employee_name,
            context_data_list,
        ) in EMPLOYEE_CONTEXTS.items():

            employee = employees[
                employee_name
            ]

            for context_data in context_data_list:

                context_code = (
                    context_data["context"]
                )

                context = contexts.get(
                    context_code
                )

                if not context:

                    raise ValueError(
                        "Context not found: "
                        f"{context_code}"
                    )

                reports_to_name = (
                    context_data["reports_to"]
                )

                reports_to = None

                if reports_to_name:

                    reports_to = employees.get(
                        reports_to_name
                    )

                    if not reports_to:

                        raise ValueError(
                            "reports_to employee not found: "
                            f"{reports_to_name}"
                        )

                employee_context = (
                    get_or_create_employee_context(
                        db=db,
                        employee=employee,
                        context=context,
                        is_default=context_data[
                            "is_default"
                        ],
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

        # ====================================================
        # 6. DEACTIVATE UNCONFIGURED CONTEXTS
        # ====================================================

        for employee in employees.values():

            configured_context_codes = {
                item["context"]
                for item in EMPLOYEE_CONTEXTS.get(
                    employee.name,
                    [],
                )
            }

            employee_context_rows = (
                db.query(EmployeeContext)
                .join(
                    Context,
                    EmployeeContext.context_id
                    == Context.id,
                )
                .filter(
                    EmployeeContext.employee_id
                    == employee.id
                )
                .all()
            )

            for employee_context in employee_context_rows:

                context = (
                    db.query(Context)
                    .filter(
                        Context.id
                        == employee_context.context_id
                    )
                    .first()
                )

                if not context:
                    continue

                if (
                    context.code
                    not in configured_context_codes
                ):

                    employee_context.is_active = False
                    employee_context.is_default = False

        db.flush()

        # ====================================================
        # 7. EMPLOYEE CONTEXT PERMISSIONS
        # ====================================================

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

                raise ValueError(
                    "Employee context not found for "
                    f"permission assignment: "
                    f"{employee_name} / {context_code}"
                )

            seed_employee_context_permissions(
                db=db,
                employee_context=employee_context,
                permission_codes=permission_codes,
            )

        # ====================================================
        # 8. COMMIT
        # ====================================================

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