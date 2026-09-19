# backend/app/seeders/permissions.py

from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.permissions import Permission


# ============================================================
# PERMISSIONS
# Synced with frontend PERMISSIONS codes.
#
# Duplicate frontend codes are seeded only once because
# Permission.code is the unique identifier.
# ============================================================

PERMISSIONS = [
    ("Dashboard View", "dashboard:view"),
    ("Application Filter View", "application-filter:view"),
    ("Profile View", "profile:view"),

    # Roles
    ("Role View", "roles:view"),
    ("Roles Manage", "roles:manage"),
    ("Permissions Manage", "permissions:manage"),
    ("Role Create", "roles:create"),
    ("Role Edit", "roles:edit"),
    ("Role Delete", "roles:delete"),

    # Team Leads
    ("Team Leads View", "team-leads:view"),
    ("Team Lead Create", "team-leads:create"),
    ("Team Lead Edit", "team-leads:edit"),
    ("Team Lead Permissions Manage", "team-leads:permissions:manage"),

    # Employees / Agents / Admins
    ("Employee View", "employees:view"),
    ("Employee Create", "employees:create"),
    ("Employee Edit", "employees:edit"),
    ("Employee Delete", "employees:delete"),
    ("Employee Block", "employees:block"),

    ("Agents View", "agents:view"),
    ("Agent Create", "agents:create"),
    ("Agent Edit", "agents:edit"),
    ("Agent Delete", "agents:delete"),
    ("Agent Permissions Manage", "agents:permissions:manage"),

    ("Admins View", "admins:view"),

    # Attendance / Profile
    ("User Attendance View", "user-attendance:view"),
    ("Attendance View", "attendance:view"),
    ("Employee Attendance View", "employee-attendance:view"),
    ("Face Enrollment View", "face-enrollment:view"),

    # Dashboard
    ("Conversion Funnel", "dashboard:conversion-funnel"),
    ("Loan Distribution", "dashboard:loan-distribution"),

    # Loans
    ("Loans View", "loans:view"),
    ("Loan Create", "loans:create"),
    ("Loan Edit", "loans:edit"),
    ("Loan Delete", "loans:delete"),
    ("Loan Status Update", "loans:status:update"),
    ("Loan Assign", "loans:assign"),
    ("Loan Shuffle", "loans:shuffle"),
    ("Loan Revert", "loans:revert"),
    ("Pending Loans View", "loans:pending:view"),

    # Loan Shuffle
    ("Loan Shuffle By Type", "loans:shuffle:loan-type"),
    ("Loan Shuffle Agent", "loans:shuffle:agent"),
    ("Loan Shuffle RM", "loans:shuffle:rm"),

    # Loan Editing
    ("Loan Document Edit", "loans:document:edit"),
    ("Loan Details Edit", "loans:details:edit"),
    ("Loan Address Edit", "loans:address:edit"),
    ("Loan Co-Applicant Edit", "loans:co-applicant:edit"),
    ("Loan Header Edit", "loans:header:edit"),
    ("Loan Reference Edit", "loans:reference:edit"),
    ("Loan Duplicate Approval", "loans:duplicates:approve"),
    ("Application Mail Send", "loans:mail:send"),

    # Remarks
    ("Application Remarks View", "loans:remarks:view"),
    ("Application Remarks Send", "loans:remarks:send"),
    ("Loans Remarks Delete", "loans:remarks:delete"),

    # Notes
    ("Application Notes View", "loans:notes:view"),
    ("Application Notes Send", "loans:notes:send"),

    # Chat
    ("Customer Chat Access", "loans:chat:view"),

    # Loan Type Views
    ("Personal Loan Access", "loans:personal:view"),
    ("Business Loan Access", "loans:business:view"),
    ("Home Loan Access", "loans:home:view"),
    ("LAP Access", "loans:lap:view"),
    ("Education Loan Access", "loans:education:view"),
    ("Car Loan Access", "loans:car:view"),
    ("Gold Loan Access", "loans:gold:view"),
    ("Credit Card Access", "loans:credit-card:view"),
    ("Agriculture Loan Access", "loans:agriculture:view"),

    # Loan Type-wise Assignment
    ("Loans Assignment Personal", "loans:assignment:personal"),
    ("Loans Assignment Business", "loans:assignment:business"),
    ("Loans Assignment Home", "loans:assignment:home"),
    ("Loans Assignment Lap", "loans:assignment:lap"),
    ("Loans Assignment Education", "loans:assignment:education"),
    ("Loans Assignment Car", "loans:assignment:car"),
    ("Loans Assignment Gold", "loans:assignment:gold"),
    ("Loans Assignment Credit Card", "loans:assignment:credit-card"),
    ("Loans Assignment Agriculture", "loans:assignment:agriculture"),

    # Calls
    ("Call Logs View", "calls:logs:view"),
    ("Call Assignment View", "calls:assignment:view"),
    ("Call Number Assign", "calls:number:assign"),
    ("Call Number Exchange", "calls:number:exchange"),
    ("Phone Numbers View", "phone:numbers:view"),

    # Call Analytics
    (
        "Call Analytics Overview View",
        "call-analytics-overview:view",
    ),
    (
        "Call Analytics Agent Performance View",
        "call-analytics-agent-performance:view",
    ),
    (
        "Call Analytics Call Trends View",
        "call-analytics-call-trends:view",
    ),

    # Agent Analytics
    (
        "Agent Analytics Overview View",
        "agent-analytics-overview:view",
    ),
    (
        "Agent Performance Overview View",
        "agent-performance-overview:view",
    ),
    (
        "Agent Analytics Call Trends View",
        "agent-analytics-call-trends:view",
    ),

    # Banks
    ("Bank View", "banks:view"),
    ("Banks Manage", "banks:manage"),
    ("Bank Create", "banks:create"),
    ("Bank Edit", "banks:edit"),
    ("Bank Delete", "banks:delete"),

    # Bankers
    ("Banker View", "bankers:view"),
    ("Banker Create", "bankers:create"),
    ("Banker Edit", "bankers:edit"),
    ("Banker Delete", "bankers:delete"),

    # DSA
    ("DSA View", "dsa:view"),
    ("DSA Manage", "dsa:manage"),
    ("DSA Create", "dsa:create"),
    ("DSA Edit", "dsa:edit"),
    ("DSA Delete", "dsa:delete"),

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

    # Logs
    ("Admin Logs View", "admin-logs-view"),
    ("Role Logs View", "role-logs:view"),
    ("Employee Logs View", "employee-logs:view"),
    ("Agent Logs View", "agent-logs:view"),
    ("Team Lead Logs View", "team-lead-logs:view"),
    (
        "Agent Assignment Logs View",
        "agent-assignment-logs:view",
    ),
    (
        "Lead Creation Logs View",
        "lead-creation-logs:view",
    ),
    (
        "Application Status Logs View",
        "application-status-logs:view",
    ),
    (
        "Application Edit Logs View",
        "application-edit-logs:view",
    ),
    (
        "Application Delete Logs View",
        "application-delete-logs:view",
    ),
    (
        "Loan Type Change Logs View",
        "loan-type-change-logs:view",
    ),
    (
        "Duplicate Lead Logs View",
        "duplicate-lead-logs:view",
    ),
    (
        "Bank Processing Logs View",
        "bank-processing-logs:view",
    ),
    (
        "Loan Assignment Logs View",
        "loan-assignment-logs:view",
    ),
    (
        "Loan Shuffle Logs View",
        "loan-shuffle-logs:view",
    ),
    (
        "Reverted History Logs View",
        "reverted-history-logs:view",
    ),
    (
        "Call Assignment Logs View",
        "call-assignment-logs:view",
    ),
    (
        "Call Reassignment Logs View",
        "call-reassignment-logs:view",
    ),
    (
        "Phone Number Logs View",
        "phone-number-logs:view",
    ),

    # Disbursement
    ("Disbursement View", "disbursement:view"),
]


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
            # Already exists → update
            permission.name = name
            permission.is_active = True
        else:
            # Doesn't exist → create
            db.add(
                Permission(
                    name=name,
                    code=code,
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
        print("Seeding permissions...")

        seed_permissions(db)

        db.commit()

        print("Permissions seed completed successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()