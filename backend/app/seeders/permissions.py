# backend/app/seeders/permissions.py

from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.roles import Role
from app.models.permissions import Permission
from app.models.contexts import Context


# ============================================================
# ROLES
# ============================================================

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


# ============================================================
# PERMISSIONS
# ============================================================

PERMISSIONS = [
    # --------------------------------------------------------
    # Dashboard
    # --------------------------------------------------------

    (
        "Dashboard View",
        "dashboard:view",
    ),
    (
        "Conversion Funnel",
        "dashboard:conversion-funnel",
    ),
    (
        "Loan Distribution",
        "dashboard:loan-distribution",
    ),
    (
        "Profile View",
        "profile:view",
    ),
    (
        "User Attendance View",
        "user-attendance:view",
    ),
    (
        "Application Filter View",
        "application-filter:view",
    ),

    # --------------------------------------------------------
    # Team Leads
    # --------------------------------------------------------

    (
        "Team Leads View",
        "team-leads:view",
    ),
    (
        "Team Lead Create",
        "team-leads:create",
    ),
    (
        "Team Lead Edit",
        "team-leads:edit",
    ),
    (
        "Team Lead Permissions Manage",
        "team-leads:permissions:manage",
    ),

    # --------------------------------------------------------
    # Agents
    # --------------------------------------------------------

    (
        "Agents View",
        "agents:view",
    ),
    (
        "Agent Create",
        "agents:create",
    ),
    (
        "Agent Edit",
        "agents:edit",
    ),
    (
        "Agent Delete",
        "agents:delete",
    ),
    (
        "Agent Permissions Manage",
        "agents:permissions:manage",
    ),

    # --------------------------------------------------------
    # Loans
    # --------------------------------------------------------

    (
        "Loans View",
        "loans:view",
    ),
    (
        "Loan Create",
        "loans:create",
    ),
    (
        "Loan Edit",
        "loans:edit",
    ),
    (
        "Loan Delete",
        "loans:delete",
    ),
    (
        "Loan Status Update",
        "loans:status:update",
    ),
    (
        "Loan Assign",
        "loans:assign",
    ),
    (
        "Loan Shuffle",
        "loans:shuffle",
    ),
    (
        "Loan Revert",
        "loans:revert",
    ),
    (
        "Pending Loans View",
        "loans:pending:view",
    ),
    (
        "Loan Shuffle By Type",
        "loans:shuffle:loan-type",
    ),
    (
        "Loan Shuffle Agent",
        "loans:shuffle:agent",
    ),
    (
        "Loan Shuffle RM",
        "loans:shuffle:rm",
    ),

    # --------------------------------------------------------
    # Application Details
    # --------------------------------------------------------

    (
        "Loan Document Edit",
        "loans:document:edit",
    ),
    (
        "Loan Details Edit",
        "loans:details:edit",
    ),
    (
        "Loan Address Edit",
        "loans:address:edit",
    ),
    (
        "Loan Co-Applicant Edit",
        "loans:co-applicant:edit",
    ),
    (
        "Loan Header Edit",
        "loans:header:edit",
    ),
    (
        "Loan Reference Edit",
        "loans:reference:edit",
    ),

    # --------------------------------------------------------
    # Communication
    # --------------------------------------------------------

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
        "Application Notes Send",
        "loans:notes:send",
    ),
    (
        "Customer Chat Access",
        "loans:chat:view",
    ),

    # --------------------------------------------------------
    # Bank Processing
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Loan Types
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Employees
    # --------------------------------------------------------

    (
        "Employee View",
        "employees:view",
    ),
    (
        "Employee Create",
        "employees:create",
    ),
    (
        "Employee Edit",
        "employees:edit",
    ),
    (
        "Employee Delete",
        "employees:delete",
    ),
    (
        "Employee Block",
        "employees:block",
    ),

    # --------------------------------------------------------
    # Calls
    # --------------------------------------------------------

    (
        "Call Logs View",
        "calls:logs:view",
    ),
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
    (
        "Phone Numbers View",
        "phone:numbers:view",
    ),

    # --------------------------------------------------------
    # Roles
    # --------------------------------------------------------

    (
        "Role View",
        "roles:view",
    ),
    (
        "Role Create",
        "roles:create",
    ),
    (
        "Role Edit",
        "roles:edit",
    ),
    (
        "Role Delete",
        "roles:delete",
    ),

    # --------------------------------------------------------
    # Banks
    # --------------------------------------------------------

    (
        "Bank View",
        "banks:view",
    ),
    (
        "Bank Create",
        "banks:create",
    ),
    (
        "Bank Edit",
        "banks:edit",
    ),
    (
        "Bank Delete",
        "banks:delete",
    ),

    # --------------------------------------------------------
    # Banker
    # --------------------------------------------------------

    (
        "Banker View",
        "bankers:view",
    ),
    (
        "Banker Create",
        "bankers:create",
    ),
    (
        "Banker Edit",
        "bankers:edit",
    ),
    (
        "Banker Delete",
        "bankers:delete",
    ),

    # --------------------------------------------------------
    # DSA
    # --------------------------------------------------------

    (
        "DSA View",
        "dsa:view",
    ),
    (
        "DSA Create",
        "dsa:create",
    ),
    (
        "DSA Edit",
        "dsa:edit",
    ),
    (
        "DSA Delete",
        "dsa:delete",
    ),

    # --------------------------------------------------------
    # Attendance
    # --------------------------------------------------------

    (
        "Attendance View",
        "attendance:view",
    ),

    # --------------------------------------------------------
    # Accountant
    # --------------------------------------------------------

    (
        "Disbursement View",
        "disbursement:view",
    ),
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
        "description": "Agent operational context",
    },
    {
        "name": "Relationship Manager",
        "code": "RM",
        "description": "Relationship Manager operational context",
    },
]


# ============================================================
# SEED ROLES
# ============================================================

def seed_roles(db: Session) -> None:

    for role_data in ROLES:

        role = (
            db.query(Role)
            .filter(Role.name == role_data["name"])
            .first()
        )

        if role:

            role.description = role_data["description"]
            role.is_active = True

        else:

            db.add(
                Role(
                    name=role_data["name"],
                    description=role_data["description"],
                    is_active=True,
                )
            )

    db.flush()


# ============================================================
# SEED PERMISSIONS
# ============================================================

def seed_permissions(db: Session) -> None:

    for name, code in PERMISSIONS:

        permission = (
            db.query(Permission)
            .filter(Permission.code == code)
            .first()
        )

        if permission:

            permission.name = name
            permission.is_active = True

        else:

            db.add(
                Permission(
                    name=name,
                    code=code,
                    is_active=True,
                )
            )

    db.flush()


# ============================================================
# SEED CONTEXTS
# ============================================================

def seed_contexts(db: Session) -> None:

    for context_data in CONTEXTS:

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

        else:

            db.add(
                Context(
                    name=context_data["name"],
                    code=context_data["code"],
                    description=context_data["description"],
                    is_active=True,
                )
            )

    db.flush()


# ============================================================
# MAIN SEED
# ============================================================

def seed():

    db = SessionLocal()

    try:

        print("Seeding roles...")
        seed_roles(db)

        print("Seeding permissions...")
        seed_permissions(db)

        print("Seeding contexts...")
        seed_contexts(db)

        db.commit()

        print(
            "Permissions/RBAC base seed completed successfully."
        )

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


if __name__ == "__main__":
    seed()