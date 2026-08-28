from sqlalchemy.orm import Session

from app.models.roles import Role
from app.models.permissions import Permission
from app.models.contexts import Context
from app.models.employee_contexts import EmployeeContext
from app.models.employee_context_permissions import EmployeeContextPermission


ROLES = [
    {
        "name": "admin",
        "description": "Full system administrator",
    },
    {
        "name": "team_lead",
        "description": "Manages and monitors team members",
    },
    {
        "name": "agent",
        "description": "Handles assigned and RM leads",
    },
    {
        "name": "accountant",
        "description": "Handles disbursed loan and financial operations",
    },
    {
        "name": "developer",
        "description": "Technical/system access",
    },
]


PERMISSIONS = [
    # Dashboard
    ("Dashboard View", "dashboard:view"),
    ("Dashboard Conversion Funnel Access", "dashboard:conversion-funnel"),
    ("Dashboard Loan Distribution Access", "dashboard:loan-distribution"),
    ("Profile View", "profile:view"),
    ("Application Filter", "application-filter:view"),

    # Team leads / agents
    ("Team Lead View", "team-leads:view"),
    ("Team Lead Create", "team-leads:create"),
    ("Team Lead Edit", "team-leads:edit"),
    ("Team Lead Permission Manage", "team-leads:permissions:manage"),
    ("Agent View", "agents:view"),
    ("Agent Create", "agents:create"),
    ("Agent Edit", "agents:edit"),
    ("Agent Delete", "agents:delete"),
    ("Agent Permission Manage", "agents:permissions:manage"),

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
    ("Shuffle Loan Type Access", "loans:shuffle:loan-type"),
    ("Shuffle Agent Access", "loans:shuffle:agent"),
    ("Shuffle RM Access", "loans:shuffle:rm"),

    # Application details
    ("Application Document Edit", "loans:document:edit"),
    ("Application Loan Details Edit", "loans:details:edit"),
    ("Application Address Edit", "loans:address:edit"),
    ("Application Co Applicant Edit", "loans:co-applicant:edit"),
    ("Application Header Edit", "loans:header:edit"),
    ("Application Reference Edit", "loans:reference:edit"),

    # Application communication
    ("Application Mail Send", "loans:mail:send"),
    ("Application Remarks View", "loans:remarks:view"),
    ("Application Remarks Send", "loans:remarks:send"),
    ("Application Notes View", "loans:notes:view"),
    ("Customer Chat Access", "loans:chat:view"),

    # Bank Processing
    ("Bank Processing Pipeline", "bank-processing:view"),
    ("Add Bank Processing Pipeline", "bank-processing:create"),
    ("Edit Bank Processing Pipeline", "bank-processing:edit"),
    ("Delete Bank Processing Pipeline", "bank-processing:delete"),

    # Loan Types
    ("Personal Loan Access", "loans:personal:view"),
    ("Business Loan Access", "loans:business:view"),
    ("Home Loan Access", "loans:home:view"),
    ("LAP Access", "loans:lap:view"),
    ("Education Loan Access", "loans:education:view"),
    ("Car Loan Access", "loans:car:view"),
    ("Gold Loan Access", "loans:gold:view"),
    ("Credit Card Access", "loans:credit-card:view"),
    ("Agriculture Loan Access", "loans:agriculture:view"),

    # Employees
    ("Employee View", "employees:view"),
    ("Employee Create", "employees:create"),
    ("Employee Edit", "employees:edit"),
    ("Employee Delete", "employees:delete"),
    ("Employee Block", "employees:block"),

    # Calls
    ("Call Logs View", "calls:logs:view"),
    ("Call Assignment View", "calls:assignment:view"),
    ("Call Number Assign", "calls:number:assign"),
    ("Call Number Exchange", "calls:number:exchange"),

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


CONTEXTS = [
    {
        "name": "Global",
        "code": "GLOBAL",
        "description": "Global system access",
    },
]


def seed_roles(db: Session) -> None:
    for role_data in ROLES:
        existing_role = (
            db.query(Role)
            .filter(Role.name == role_data["name"])
            .first()
        )

        if existing_role:
            continue

        db.add(Role(**role_data))

    db.commit()


def seed_permissions(db: Session) -> None:
    for name, code in PERMISSIONS:
        existing_permission = (
            db.query(Permission)
            .filter(Permission.code == code)
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


def seed_contexts(db: Session) -> None:
    for context_data in CONTEXTS:
        existing_context = (
            db.query(Context)
            .filter(Context.code == context_data["code"])
            .first()
        )

        if existing_context:
            continue

        db.add(Context(**context_data))

    db.commit()


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
        raise ValueError("GLOBAL context not found")

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

    permissions = (
        db.query(Permission)
        .filter(Permission.is_active.is_(True))
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


def seed_all(
    db: Session,
    admin_employee_id: int = 1,
) -> None:
    """
    Seed the complete RBAC structure.

    Flow:

        Roles
          ↓
        Permissions
          ↓
        Contexts
          ↓
        Employee Context
          ↓
        Employee Context Permissions
    """

    seed_roles(db)
    seed_permissions(db)
    seed_contexts(db)

    assign_employee_global_context(
        db=db,
        employee_id=admin_employee_id,
    )