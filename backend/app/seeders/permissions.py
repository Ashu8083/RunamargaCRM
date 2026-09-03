# backend\app\seeders\permissions.py
from sqlalchemy.orm import Session

from app.models.employees import Employee
from app.models.roles import Role
from app.models.permissions import Permission
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission


# ============================================================
# ROLES
# ============================================================

ROLES = [
    {
        "name": "admin",
        "description": "Full system administrator",
    },
    {
        "name": "Guest",
        "description": "Guest",
    },
    {
        "name": "HR",
        "description": "Handles HRMS",
    },
    {
        "name": "accountant",
        "description": "Handles disbursed loan and financial operations",
    },
    {
        "name": "developer",
        "description": "Technical/system access",
    },
    {
        "name": "business",
        "description": "Business operations employee",
    },
]


# ============================================================
# PERMISSIONS
# ============================================================

PERMISSIONS = [
    # Dashboard
    ("Dashboard View", "dashboard:view"),
    (
        "Dashboard Conversion Funnel Access",
        "dashboard:conversion-funnel",
    ),
    (
        "Dashboard Loan Distribution Access",
        "dashboard:loan-distribution",
    ),
    ("Profile View", "profile:view"),
    ("Attendance", "user-attendance:view"),
    ("Application Filter", "application-filter:view"),
    # Team Leads
    ("Team Lead View", "team-leads:view"),
    ("Team Lead Create", "team-leads:create"),
    ("Team Lead Edit", "team-leads:edit"),
    (
        "Team Lead Permission Manage",
        "team-leads:permissions:manage",
    ),
    # Agents
    ("Agent View", "agents:view"),
    ("Agent Create", "agents:create"),
    ("Agent Edit", "agents:edit"),
    ("Agent Delete", "agents:delete"),
    (
        "Agent Permission Manage",
        "agents:permissions:manage",
    ),
    # Applications / Loans
    ("Application View", "loans:view"),
    ("Application Create", "loans:create"),
    ("Application Edit", "loans:edit"),
    ("Application Delete", "loans:delete"),
    ("Application Status Change", "loans:status:update"),
    ("Application Assign", "loans:assign"),
    ("Application Shuffle", "loans:shuffle"),
    ("Application Revert", "loans:revert"),
    ("Application Pending", "loans:pending:view"),
    (
        "Shuffle Loan Type Access",
        "loans:shuffle:loan-type",
    ),
    (
        "Shuffle Agent Access",
        "loans:shuffle:agent",
    ),
    (
        "Shuffle RM Access",
        "loans:shuffle:rm",
    ),

    # Application Details
    (
        "Application Document Edit",
        "loans:document:edit",
    ),
    (
        "Application Loan Details Edit",
        "loans:details:edit",
    ),
    (
        "Application Address Edit",
        "loans:address:edit",
    ),
    (
        "Application Co Applicant Edit",
        "loans:co-applicant:edit",
    ),
    (
        "Application Header Edit",
        "loans:header:edit",
    ),
    (
        "Application Reference Edit",
        "loans:reference:edit",
    ),

    # Application Communication
    (
        "Application Mail Send",
        "loans:mail:send",
    ),
    (
        "Application Remarks View",
        "loans:remarks:view",
    ),
    (
        "Application Remarks Send",
        "loans:remarks:send",
    ),
    (
        "Application Notes View",
        "loans:notes:view",
    ),
    (
        "Customer Chat Access",
        "loans:chat:view",
    ),

    # Bank Processing
    (
        "Bank Processing Pipeline",
        "bank-processing:view",
    ),
    (
        "Add Bank Processing Pipeline",
        "bank-processing:create",
    ),
    (
        "Edit Bank Processing Pipeline",
        "bank-processing:edit",
    ),
    (
        "Delete Bank Processing Pipeline",
        "bank-processing:delete",
    ),

    # Loan Types
    (
        "Personal Loan Access",
        "loans:personal:view",
    ),
    (
        "Business Loan Access",
        "loans:business:view",
    ),
    (
        "Home Loan Access",
        "loans:home:view",
    ),
    (
        "LAP Access",
        "loans:lap:view",
    ),
    (
        "Education Loan Access",
        "loans:education:view",
    ),
    (
        "Car Loan Access",
        "loans:car:view",
    ),
    (
        "Gold Loan Access",
        "loans:gold:view",
    ),
    (
        "Credit Card Access",
        "loans:credit-card:view",
    ),
    (
        "Agriculture Loan Access",
        "loans:agriculture:view",
    ),

    # Employees
    ("Employee View", "employees:view"),
    ("Employee Create", "employees:create"),
    ("Employee Edit", "employees:edit"),
    ("Employee Delete", "employees:delete"),
    ("Employee Block", "employees:block"),

    # Calls
    ("Call Logs View", "calls:logs:view"),
    (
        "Call Assignment View",
        "calls:assignment:view",
    ),
    (
        "Call Number Assign",
        "calls:number:assign",
    ),
    (
        "Call Number Exchange",
        "calls:number:exchange",
    ),

    # Roles
    ("Role View", "roles:view"),
    ("Role Create", "roles:create"),
    ("Role Edit", "roles:edit"),
    ("Role Delete", "roles:delete"),

    # Banks
    ("Bank View", "banks:view"),
    ("Bank Create", "banks:create"),
    ("Bank Edit", "banks:edit"),
    ("Bank Delete", "banks:delete"),

    # Banker
    ("Banker View", "bankers:view"),
    ("Banker Create", "bankers:create"),
    ("Banker Edit", "bankers:edit"),
    ("Banker Delete", "bankers:delete"),

    # DSA
    ("DSA View", "dsa:view"),
    ("DSA Create", "dsa:create"),
    ("DSA Edit", "dsa:edit"),
    ("DSA Delete", "dsa:delete"),

    # Attendance
    ("Attendance View", "attendance:view"),

    # Accountant
    ("Disbursement View", "disbursement:view"),
]


# ============================================================
# CONTEXTS
# ============================================================

CONTEXTS = [
    {
        "name": "Global",
        "code": "GLOBAL",
        "description": "Global system access",
    },
    {
        "name": "Agent",
        "code": "AGENT",
        "description": "Processing Agent workspace",
    },
    {
        "name": "Relationship Manager",
        "code": "RM",
        "description": "Relationship Manager workspace",
    },
]


# ============================================================
# CONTEXT PERMISSIONS
# ============================================================

AGENT_PERMISSION_CODES = {
    # Common
    "dashboard:view",
    "dashboard:conversion-funnel",
    "dashboard:loan-distribution",
    "profile:view",
    "application-filter:view",

    # Applications
    "loans:view",
    "loans:create",
    "loans:edit",
    "loans:pending:view",
    "loans:status:update",
    "loans:revert",

    # Application details
    "loans:document:edit",
    "loans:details:edit",
    "loans:address:edit",
    "loans:co-applicant:edit",
    "loans:header:edit",
    "loans:reference:edit",

    # Communication
    "loans:mail:send",
    "loans:remarks:view",
    "loans:remarks:send",
    "loans:notes:view",
    "loans:chat:view",

    # Bank Processing
    "bank-processing:view",
    "bank-processing:create",
    "bank-processing:edit",
    "bank-processing:delete",

    # Loan types
    "loans:personal:view",
    "loans:business:view",
    "loans:home:view",
    "loans:lap:view",
    "loans:education:view",
    "loans:car:view",
    "loans:gold:view",
    "loans:credit-card:view",
    "loans:agriculture:view",

}


RM_PERMISSION_CODES = {
    # Common
    "dashboard:view",
    "dashboard:conversion-funnel",
    "dashboard:loan-distribution",
    "profile:view",
    "application-filter:view",

    # Applications
    "loans:view",
    "loans:create",
    "loans:edit",
    "loans:pending:view",
    "loans:status:update",
    "loans:assign",
    "loans:revert",

    # Shuffle
    "loans:shuffle",
    "loans:shuffle:loan-type",
    "loans:shuffle:agent",
    "loans:shuffle:rm",

    # Application details
    "loans:document:edit",
    "loans:details:edit",
    "loans:address:edit",
    "loans:co-applicant:edit",
    "loans:header:edit",
    "loans:reference:edit",

    # Communication
    "loans:mail:send",
    "loans:remarks:view",
    "loans:remarks:send",
    "loans:notes:view",
    "loans:chat:view",

    # Loan types
    "loans:personal:view",
    "loans:business:view",
    "loans:home:view",
    "loans:lap:view",
    "loans:education:view",
    "loans:car:view",
    "loans:gold:view",
    "loans:credit-card:view",
    "loans:agriculture:view",

    # Bank Processing
    "bank-processing:view",
    # Calls
    "calls:logs:view",
    "calls:assignment:view",
}


# ============================================================
# SEED ROLES
# ============================================================

def seed_roles(db: Session) -> None:
    for role_data in ROLES:

        existing_role = (
            db.query(Role)
            .filter(
                Role.name == role_data["name"]
            )
            .first()
        )

        if existing_role:
            continue

        db.add(
            Role(**role_data)
        )

    db.commit()


# ============================================================
# SEED PERMISSIONS
# ============================================================

def seed_permissions(db: Session) -> None:
    for name, code in PERMISSIONS:

        existing_permission = (
            db.query(Permission)
            .filter(
                Permission.code == code
            )
            .first()
        )

        if existing_permission:
            continue

        db.add(
            Permission(
                name=name,
                code=code,
            )
        )

    db.commit()


# ============================================================
# SEED CONTEXTS
# ============================================================

def seed_contexts(db: Session) -> None:
    for context_data in CONTEXTS:

        existing_context = (
            db.query(Context)
            .filter(
                Context.code == context_data["code"]
            )
            .first()
        )

        if existing_context:
            continue

        db.add(
            Context(**context_data)
        )

    db.commit()


# ============================================================
# ASSIGN PERMISSIONS TO CONTEXT
# ============================================================

def assign_context_permissions(
    db: Session,
    context_code: str,
    permission_codes: set[str],
) -> None:

    context = (
        db.query(Context)
        .filter(
            Context.code == context_code,
            Context.is_active.is_(True),
        )
        .first()
    )

    if not context:
        raise ValueError(
            f"Context '{context_code}' not found"
        )

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

    missing_codes = (
        permission_codes - found_codes
    )

    if missing_codes:
        raise ValueError(
            f"Permissions not found for "
            f"{context_code}: {sorted(missing_codes)}"
        )

    # This function only adds missing assignments.
    # It does not duplicate existing ones.
    for permission in permissions:

        existing_assignment = (
            db.query(EmployeeContextPermission)
            .filter(
                EmployeeContextPermission.employee_context_id
                == context.id,
                EmployeeContextPermission.permission_id
                == permission.id,
            )
            .first()
        )

        if existing_assignment:
            continue

        db.add(
            EmployeeContextPermission(
                employee_context_id=context.id,
                permission_id=permission.id,
            )
        )

    db.commit()


# ============================================================
# ASSIGN ADMIN GLOBAL CONTEXT
# ============================================================

def assign_employee_global_context(
    db: Session,
    employee_id: int,
) -> None:

    global_context = (
        db.query(Context)
        .filter(
            Context.code == "GLOBAL",
            Context.is_active.is_(True),
        )
        .first()
    )

    if not global_context:
        raise ValueError(
            "GLOBAL context not found"
        )

    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.context_id == global_context.id,
        )
        .first()
    )

    if not employee_context:

        employee_context = EmployeeContext(
            employee_id=employee_id,
            context_id=global_context.id,
            is_default=True,
            is_active=True,
        )

        db.add(employee_context)
        db.commit()
        db.refresh(employee_context)

    # Admin gets every active permission.
    permissions = (
        db.query(Permission)
        .filter(
            Permission.is_active.is_(True)
        )
        .all()
    )

    for permission in permissions:

        existing_assignment = (
            db.query(EmployeeContextPermission)
            .filter(
                EmployeeContextPermission.employee_context_id
                == employee_context.id,
                EmployeeContextPermission.permission_id
                == permission.id,
            )
            .first()
        )

        if existing_assignment:
            continue

        db.add(
            EmployeeContextPermission(
                employee_context_id=employee_context.id,
                permission_id=permission.id,
            )
        )

    db.commit()


# ============================================================
# CREATE / GET EMPLOYEE CONTEXT
# ============================================================

def assign_employee_context(
    db: Session,
    employee_id: int,
    context_code: str,
    is_default: bool = False,
) -> EmployeeContext:

    context = (
        db.query(Context)
        .filter(
            Context.code == context_code,
            Context.is_active.is_(True),
        )
        .first()
    )

    if not context:
        raise ValueError(
            f"Context '{context_code}' not found"
        )

    employee_context = (
        db.query(EmployeeContext)
        .filter(
            EmployeeContext.employee_id == employee_id,
            EmployeeContext.context_id == context.id,
        )
        .first()
    )

    if employee_context:
        return employee_context

    employee_context = EmployeeContext(
        employee_id=employee_id,
        context_id=context.id,
        is_default=is_default,
        is_active=True,
    )

    db.add(employee_context)
    db.commit()
    db.refresh(employee_context)

    return employee_context


# ============================================================
# CREATE DUMMY BUSINESS EMPLOYEE
# ============================================================

def seed_dummy_business_employee(
    db: Session,
) -> None:

    email = "manekomal2021@gmail.com"

    business_role = (
        db.query(Role)
        .filter(
            Role.name == "business"
        )
        .first()
    )

    if not business_role:
        raise ValueError(
            "Business role not found"
        )

    employee = (
        db.query(Employee)
        .filter(
            Employee.email == email
        )
        .first()
    )

    if not employee:

        employee = Employee(
            name="Business Test",
            email=email,
            role_id=business_role.id,
            status="active",
            deactivate=False,
        )

        db.add(employee)
        db.commit()
        db.refresh(employee)

    else:

        # Make sure the existing employee has
        # the intended business role.
        employee.role_id = business_role.id
        employee.status = "active"
        employee.deactivate = False

        db.commit()
        db.refresh(employee)

    # --------------------------------------------------------
    # Give employee BOTH contexts
    # --------------------------------------------------------

    agent_context = assign_employee_context(
        db=db,
        employee_id=employee.id,
        context_code="AGENT",
        is_default=True,
    )

    rm_context = assign_employee_context(
        db=db,
        employee_id=employee.id,
        context_code="RM",
        is_default=False,
    )

    # --------------------------------------------------------
    # Assign AGENT permissions
    # --------------------------------------------------------

    assign_permissions_to_employee_context(
        db=db,
        employee_context_id=agent_context.id,
        permission_codes=AGENT_PERMISSION_CODES,
    )

    # --------------------------------------------------------
    # Assign RM permissions
    # --------------------------------------------------------

    assign_permissions_to_employee_context(
        db=db,
        employee_context_id=rm_context.id,
        permission_codes=RM_PERMISSION_CODES,
    )


# ============================================================
# ASSIGN PERMISSIONS TO EMPLOYEE CONTEXT
# ============================================================

def assign_permissions_to_employee_context(
    db: Session,
    employee_context_id: int,
    permission_codes: set[str],
) -> None:

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

    missing_codes = (
        permission_codes - found_codes
    )

    if missing_codes:
        raise ValueError(
            "Permissions missing from database: "
            f"{sorted(missing_codes)}"
        )

    for permission in permissions:

        existing_assignment = (
            db.query(EmployeeContextPermission)
            .filter(
                EmployeeContextPermission.employee_context_id
                == employee_context_id,
                EmployeeContextPermission.permission_id
                == permission.id,
            )
            .first()
        )

        if existing_assignment:
            continue

        db.add(
            EmployeeContextPermission(
                employee_context_id=employee_context_id,
                permission_id=permission.id,
            )
        )

    db.commit()


# ============================================================
# SEED EVERYTHING
# ============================================================

def seed_all(
    db: Session,
    admin_employee_id: int = 1,
) -> None:

    """
    Seed complete RBAC structure.

    Flow:

        Roles
          ↓
        Permissions
          ↓
        Contexts
          ↓
        Context Permissions
          ↓
        Admin → GLOBAL
          ↓
        Business Test → AGENT + RM
    """

    # 1. Roles
    seed_roles(db)

    # 2. Permissions
    seed_permissions(db)

    # 3. Contexts
    seed_contexts(db)

    # 4. Context-level permissions
    # assign_context_permissions(
    #     db=db,
    #     context_code="AGENT",
    #     permission_codes=AGENT_PERMISSION_CODES,
    # )

    # assign_context_permissions(
    #     db=db,
    #     context_code="RM",
    #     permission_codes=RM_PERMISSION_CODES,
    # )

    # 5. Admin employee
    assign_employee_global_context(
        db=db,
        employee_id=admin_employee_id,
    )

    # 6. Dummy Business employee
    seed_dummy_business_employee(db=db)