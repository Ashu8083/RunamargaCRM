# backend\app\seeders\permissions.py
from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.permissions import Permission


# ============================================================
# PERMISSIONS
# Source of truth: admin-react/src/app/permissions.js
#
# Format:
# (name, code, description)
#
# Every unique frontend permission code is included once.
# ============================================================

PERMISSIONS = [
    # ========================================================
    # MAIN
    # ========================================================

    (
        "Dashboard View",
        "dashboard:view",
        "Allows access to the main dashboard.",
    ),
    (
        "Application Filter View",
        "application-filter:view",
        "Allows access to application filtering controls.",
    ),
    (
        "Profile View",
        "profile:view",
        "Allows viewing the user's profile and account information.",
    ),

    # ========================================================
    # TEAMS & ROLES
    # ========================================================

    (
        "Roles View",
        "roles:view",
        "Allows viewing roles and their configurations.",
    ),
    (
        "Roles Manage",
        "roles:manage",
        "Allows managing role configurations and assignments.",
    ),
    (
        "Permissions Manage",
        "permissions:manage",
        "Allows managing permissions and their assignments to roles.",
    ),
    (
        "Role Create",
        "roles:create",
        "Allows creating new roles.",
    ),
    (
        "Role Edit",
        "roles:edit",
        "Allows modifying existing roles.",
    ),
    (
        "Role Delete",
        "roles:delete",
        "Allows deleting roles.",
    ),

    # Team Leads

    (
        "Team Leads View",
        "team-leads:view",
        "Allows viewing team leads and their information.",
    ),
    (
        "Team Lead Create",
        "team-leads:create",
        "Allows creating team lead accounts.",
    ),
    (
        "Team Lead Edit",
        "team-leads:edit",
        "Allows modifying team lead information.",
    ),
    (
        "Team Lead Delete",
        "team-leads:delete",
        "Allows deleting team lead accounts.",
    ),
    (
        "Team Lead Permissions Manage",
        "team-leads:permissions:manage",
        "Allows managing permissions assigned to team leads.",
    ),
    (
        "Team Lead Status Change",
        "team-leads:status:change",
        "Allows changing team lead account status.",
    ),
    (
        "Team Lead Assign Agents View",
        "team-leads:assign-agents:view",
        "Allows viewing the interface for assigning agents to team leads.",
    ),

    # ========================================================
    # EMPLOYEES / AGENTS / ADMINS
    # ========================================================

    # Employees

    (
        "Employees View",
        "employees:view",
        "Allows viewing employee records.",
    ),
    (
        "Employee Create",
        "employees:create",
        "Allows creating employee accounts.",
    ),
    (
        "Employee Edit",
        "employees:edit",
        "Allows modifying employee information.",
    ),
    (
        "Employee Delete",
        "employees:delete",
        "Allows deleting employee records.",
    ),
    (
        "Employee Block",
        "employees:block",
        "Allows blocking or restricting employee accounts.",
    ),

    # Agents

    (
        "Agents View",
        "agents:view",
        "Allows viewing agent records.",
    ),
    (
        "Agent Create",
        "agents:create",
        "Allows creating agent accounts.",
    ),
    (
        "Agent Edit",
        "agents:edit",
        "Allows modifying agent information.",
    ),
    (
        "Agent Delete",
        "agents:delete",
        "Allows deleting agent accounts.",
    ),
    (
        "Agent Permissions Manage",
        "agents:permissions:manage",
        "Allows managing permissions assigned to agents.",
    ),
    (
        "Agent Team Leads Manage",
        "agents:team-leads:manage",
        "Allows assigning agents to team leads and managing those relationships.",
    ),
    (
        "Agent Status Change",
        "agents:status:change",
        "Allows changing agent account status.",
    ),

    # Relationship Manager

    (
        "RM View",
        "rm:view",
        "Allows accessing Relationship Manager views and information.",
    ),

    # Admins

    (
        "Admins View",
        "admins:view",
        "Allows viewing administrator accounts.",
    ),
    (
        "Admin Create",
        "admins:create",
        "Allows creating administrator accounts.",
    ),
    (
        "Admin Edit",
        "admins:edit",
        "Allows modifying administrator information.",
    ),
    (
        "Admin Delete",
        "admins:delete",
        "Allows deleting administrator accounts.",
    ),
    (
        "Admin Permissions Manage",
        "admins:permissions:manage",
        "Allows managing permissions assigned to administrators.",
    ),
    (
        "Admin Status Change",
        "admins:status:change",
        "Allows changing administrator account status.",
    ),

    # ========================================================
    # ATTENDANCE / PROFILE / LEAVE
    # ========================================================

    (
        "User Attendance View",
        "user-attendance:view",
        "Allows viewing the current user's attendance information.",
    ),
    (
        "Attendance View",
        "attendance:view",
        "Allows viewing attendance records through administrative attendance views.",
    ),
    (
        "Employee Attendance View",
        "employee-attendance:view",
        "Allows viewing employee attendance records.",
    ),

    # Holidays

    (
        "Holidays View",
        "holidays:view",
        "Allows viewing holidays and holiday calendars.",
    ),
    (
        "Holiday Create",
        "holidays:create",
        "Allows creating holiday entries.",
    ),
    (
        "Holiday Update",
        "holidays:update",
        "Allows updating existing holiday entries.",
    ),
    (
        "Holiday Delete",
        "holidays:delete",
        "Allows deleting holiday entries.",
    ),

    # Leave Management

    (
        "Leave Management View",
        "leave:view",
        "Allows viewing leave management records and requests.",
    ),
    (
        "Leave Create",
        "leave:create",
        "Allows creating leave records or requests through management functions.",
    ),
    (
        "Leave Update",
        "leave:update",
        "Allows updating existing leave records.",
    ),
    (
        "Leave Delete",
        "leave:delete",
        "Allows deleting leave records.",
    ),
    (
        "Leave Apply",
        "leave:apply",
        "Allows submitting a leave application.",
    ),
    (
        "Leave Status",
        "leave:status",
        "Allows viewing or managing leave status according to the application workflow.",
    ),

    # Face Enrollment

    (
        "Face Enrollment View",
        "face-enrollment:view",
        "Allows accessing the face enrollment interface.",
    ),

    # ========================================================
    # DASHBOARD ANALYTICS
    # ========================================================

    (
        "Dashboard Conversion Funnel",
        "dashboard:conversion-funnel",
        "Allows viewing conversion funnel analytics on the dashboard.",
    ),
    (
        "Dashboard Loan Distribution",
        "dashboard:loan-distribution",
        "Allows viewing loan distribution analytics on the dashboard.",
    ),

    # ========================================================
    # LOANS
    # ========================================================

    (
        "Loans View",
        "loans:view",
        "Allows viewing loan records.",
    ),
    (
        "Loan Create",
        "loans:create",
        "Allows creating loan records.",
    ),
    (
        "Loan Edit",
        "loans:edit",
        "Allows editing loan records through general loan editing functions.",
    ),
    (
        "Loan Delete",
        "loans:delete",
        "Allows deleting loan records.",
    ),
    (
        "Loan Agent Assignment",
        "loan:agent-assignment",
        "Allows accessing agent assignment functionality for loans.",
    ),
    (
        "Loan Application View",
        "loan:application-view",
        "Allows viewing loan application details.",
    ),
    (
        "Loan Status Update",
        "loans:status:update",
        "Allows changing the status of loan applications.",
    ),
    (
        "Loan Add Reminder",
        "loans:add:reminder",
        "Allows adding reminders to loan records.",
    ),
    (
        "Loan Change Loan Type",
        "loans:change:loan-type",
        "Allows changing the loan type associated with a loan application.",
    ),
    (
        "Loan Assign",
        "loans:assign",
        "Allows assigning loans to eligible employees or agents.",
    ),
    (
        "Loan Shuffle",
        "loans:shuffle",
        "Allows accessing loan shuffling functionality.",
    ),
    (
        "Pending Loans View",
        "loans:pending:view",
        "Allows viewing pending loan applications.",
    ),

    # Loan Shuffle Controls

    (
        "Loan Shuffle Loan Type",
        "loans:shuffle:loan-type",
        "Allows shuffling loans by loan type.",
    ),
    (
        "Loan Shuffle Agent",
        "loans:shuffle:agent",
        "Allows shuffling loan assignments between agents.",
    ),
    (
        "Loan Shuffle RM",
        "loans:shuffle:rm",
        "Allows shuffling loan assignments between Relationship Managers.",
    ),
    (
        "Loan Shuffle Assign",
        "loans:shuffle:assign",
        "Allows assigning loans through the loan shuffle workflow.",
    ),

    # Loan Revert

    (
        "Loan Revert",
        "loans:revert",
        "Allows reverting eligible loan operations or assignments.",
    ),
    (
        "Loan Revert Edit",
        "loans:revert:edit",
        "Allows editing information through the loan revert workflow.",
    ),

    # Loan Editing

    (
        "Loan Document Edit",
        "loans:document:edit",
        "Allows editing loan application document information.",
    ),
    (
        "Loan Details Edit",
        "loans:details:edit",
        "Allows editing general loan application details.",
    ),
    (
        "Loan Address Edit",
        "loans:address:edit",
        "Allows editing applicant address information in a loan application.",
    ),
    (
        "Loan Co-Applicant Edit",
        "loans:co-applicant:edit",
        "Allows editing co-applicant information.",
    ),
    (
        "Loan Header Edit",
        "loans:header:edit",
        "Allows editing loan application header information.",
    ),
    (
        "Loan Reference Edit",
        "loans:reference:edit",
        "Allows editing reference information associated with a loan application.",
    ),
    (
        "Loan Duplicate Approval",
        "loans:duplicates:approve",
        "Allows approving or resolving duplicate loan application records.",
    ),
    (
        "Loan Mail Send",
        "loans:mail:send",
        "Allows sending email communications related to loan applications.",
    ),

    # Loan Remarks

    (
        "Loan Remarks View",
        "loans:remarks:view",
        "Allows viewing remarks associated with loan applications.",
    ),
    (
        "Loan Remarks Send",
        "loans:remarks:send",
        "Allows adding or sending remarks associated with loan applications.",
    ),
    (
        "Loan Remarks Delete",
        "loans:remarks:delete",
        "Allows deleting loan application remarks.",
    ),

    # Loan Notes

    (
        "Loan Notes View",
        "loans:notes:view",
        "Allows viewing notes associated with loan applications.",
    ),
    (
        "Loan Notes Send",
        "loans:notes:send",
        "Allows adding or sending notes associated with loan applications.",
    ),

    # Loan Chat

    (
        "Loan Chat View",
        "loans:chat:view",
        "Allows accessing loan-related chat functionality.",
    ),

    # Loan Type Views

    (
        "Personal Loan View",
        "loans:personal:view",
        "Allows viewing personal loan applications.",
    ),
    (
        "Business Loan View",
        "loans:business:view",
        "Allows viewing business loan applications.",
    ),
    (
        "Home Loan View",
        "loans:home:view",
        "Allows viewing home loan applications.",
    ),
    (
        "Loan Against Property View",
        "loans:lap:view",
        "Allows viewing Loan Against Property applications.",
    ),
    (
        "Education Loan View",
        "loans:education:view",
        "Allows viewing education loan applications.",
    ),
    (
        "Car Loan View",
        "loans:car:view",
        "Allows viewing car loan applications.",
    ),
    (
        "Gold Loan View",
        "loans:gold:view",
        "Allows viewing gold loan applications.",
    ),
    (
        "Credit Card View",
        "loans:credit-card:view",
        "Allows viewing credit card applications.",
    ),
    (
        "Agriculture Loan View",
        "loans:agriculture:view",
        "Allows viewing agriculture loan applications.",
    ),

    # Loan Type-Wise Assignment

    (
        "Personal Loan Assignment",
        "loans:assignment:personal",
        "Allows assigning personal loan applications.",
    ),
    (
        "Business Loan Assignment",
        "loans:assignment:business",
        "Allows assigning business loan applications.",
    ),
    (
        "Home Loan Assignment",
        "loans:assignment:home",
        "Allows assigning home loan applications.",
    ),
    (
        "Loan Against Property Assignment",
        "loans:assignment:lap",
        "Allows assigning Loan Against Property applications.",
    ),
    (
        "Education Loan Assignment",
        "loans:assignment:education",
        "Allows assigning education loan applications.",
    ),
    (
        "Car Loan Assignment",
        "loans:assignment:car",
        "Allows assigning car loan applications.",
    ),
    (
        "Gold Loan Assignment",
        "loans:assignment:gold",
        "Allows assigning gold loan applications.",
    ),
    (
        "Credit Card Assignment",
        "loans:assignment:credit-card",
        "Allows assigning credit card applications.",
    ),
    (
        "Agriculture Loan Assignment",
        "loans:assignment:agriculture",
        "Allows assigning agriculture loan applications.",
    ),

    # ========================================================
    # CALL MANAGEMENT
    # ========================================================

    (
        "Call Logs View",
        "calls:logs:view",
        "Allows viewing call logs and call history.",
    ),
    (
        "Call Assignment View",
        "calls:assignment:view",
        "Allows viewing call assignment records and interfaces.",
    ),
    (
        "Call Assignment Assign",
        "calls:assignment:assign",
        "Allows assigning calls through the call assignment workflow.",
    ),
    (
        "Call Number Assign",
        "calls:number:assign",
        "Allows assigning phone numbers for calling operations.",
    ),
    (
        "Call Number Exchange",
        "calls:number:exchange",
        "Allows exchanging or switching assigned phone numbers.",
    ),

    # Phone Numbers

    (
        "Phone Numbers View",
        "phone:numbers:view",
        "Allows viewing configured phone numbers.",
    ),
    (
        "Phone Numbers Add",
        "phone:numbers:add",
        "Allows adding phone numbers to the system.",
    ),
    (
        "Phone Numbers Edit",
        "phone:numbers:edit",
        "Allows editing configured phone number records.",
    ),

    # Reminders

    (
        "Call Reminder View",
        "call:reminder:view",
        "Allows viewing call-related reminders.",
    ),
    (
        "Reminders View",
        "reminder:view",
        "Allows viewing reminders.",
    ),

    # ========================================================
    # CALL ANALYTICS
    # ========================================================

    (
        "Call Analytics Overview View",
        "call-analytics-overview:view",
        "Allows viewing the call analytics overview.",
    ),
    (
        "Call Analytics Agent Performance View",
        "call-analytics-agent-performance:view",
        "Allows viewing agent performance analytics based on calls.",
    ),
    (
        "Call Analytics Call Trends View",
        "call-analytics-call-trends:view",
        "Allows viewing call trends and related analytics.",
    ),

    # ========================================================
    # AGENT ANALYTICS
    # ========================================================

    (
        "Agent Analytics Overview View",
        "agent-analytics-overview:view",
        "Allows viewing the agent analytics overview.",
    ),
    (
        "Agent Performance Overview View",
        "agent-performance-overview:view",
        "Allows viewing the agent performance overview.",
    ),
    (
        "Agent Analytics Call Trends View",
        "agent-analytics-call-trends:view",
        "Allows viewing call trend analytics for agents.",
    ),

    # ========================================================
    # BANKS
    # ========================================================

    (
        "Banks View",
        "banks:view",
        "Allows viewing bank records.",
    ),
    (
        "Banks Manage",
        "banks:manage",
        "Allows managing bank records and configurations.",
    ),
    (
        "Bank Create",
        "banks:create",
        "Allows creating bank records.",
    ),
    (
        "Bank Edit",
        "banks:edit",
        "Allows editing bank information.",
    ),
    (
        "Bank Delete",
        "banks:delete",
        "Allows deleting bank records.",
    ),

    # ========================================================
    # BANKERS
    # ========================================================

    (
        "Bankers View",
        "bankers:view",
        "Allows viewing banker records.",
    ),
    (
        "Banker Create",
        "bankers:create",
        "Allows creating banker records.",
    ),
    (
        "Banker Edit",
        "bankers:edit",
        "Allows editing banker information.",
    ),
    (
        "Banker Delete",
        "bankers:delete",
        "Allows deleting banker records.",
    ),

    # ========================================================
    # DSA
    # ========================================================

    (
        "DSA View",
        "dsa:view",
        "Allows viewing the DSA directory and DSA records.",
    ),
    (
        "DSA Manage",
        "dsa:manage",
        "Allows managing DSA directory records and configurations.",
    ),
    (
        "DSA Create",
        "dsa:create",
        "Allows creating new DSA directory entries.",
    ),
    (
        "DSA Edit",
        "dsa:edit",
        "Allows editing existing DSA directory entries.",
    ),
    (
        "DSA Delete",
        "dsa:delete",
        "Allows deleting DSA directory entries.",
    ),

    # ========================================================
    # BANK PROCESSING
    # ========================================================

    (
        "Bank Processing View",
        "bank-processing:view",
        "Allows viewing bank processing pipeline records.",
    ),
    (
        "Bank Processing Create",
        "bank-processing:create",
        "Allows creating bank processing pipeline records.",
    ),
    (
        "Bank Processing Edit",
        "bank-processing:edit",
        "Allows editing bank processing pipeline records.",
    ),
    (
        "Bank Processing Delete",
        "bank-processing:delete",
        "Allows deleting bank processing pipeline records.",
    ),

    # ========================================================
    # LOGS
    # ========================================================

    (
        "Admin Logs View",
        "admin-logs-view",
        "Allows viewing administrative system logs.",
    ),
    (
        "Role Logs View",
        "role-logs:view",
        "Allows viewing role-related audit logs.",
    ),
    (
        "Employee Logs View",
        "employee-logs:view",
        "Allows viewing employee-related audit logs.",
    ),
    (
        "Agent Logs View",
        "agent-logs:view",
        "Allows viewing agent-related audit logs.",
    ),
    (
        "Team Lead Logs View",
        "team-lead-logs:view",
        "Allows viewing team lead-related audit logs.",
    ),
    (
        "Agent Assignment Logs View",
        "agent-assignment-logs:view",
        "Allows viewing logs of agent assignment changes.",
    ),
    (
        "Lead Creation Logs View",
        "lead-creation-logs:view",
        "Allows viewing lead creation logs.",
    ),
    (
        "Application Status Logs View",
        "application-status-logs:view",
        "Allows viewing loan application status change logs.",
    ),
    (
        "Application Edit Logs View",
        "application-edit-logs:view",
        "Allows viewing loan application edit logs.",
    ),
    (
        "Application Delete Logs View",
        "application-delete-logs:view",
        "Allows viewing loan application deletion logs.",
    ),
    (
        "Loan Type Change Logs View",
        "loan-type-change-logs:view",
        "Allows viewing loan type change history and audit logs.",
    ),
    (
        "Duplicate Lead Logs View",
        "duplicate-lead-logs:view",
        "Allows viewing duplicate lead detection and resolution logs.",
    ),
    (
        "Bank Processing Logs View",
        "bank-processing-logs:view",
        "Allows viewing bank processing pipeline audit logs.",
    ),
    (
        "Loan Assignment Logs View",
        "loan-assignment-logs:view",
        "Allows viewing loan assignment history and audit logs.",
    ),
    (
        "Loan Shuffle Logs View",
        "loan-shuffle-logs:view",
        "Allows viewing loan shuffle history and audit logs.",
    ),
    (
        "Reverted History Logs View",
        "reverted-history-logs:view",
        "Allows viewing the history of reverted operations.",
    ),
    (
        "Call Assignment Logs View",
        "call-assignment-logs:view",
        "Allows viewing call assignment history and audit logs.",
    ),
    (
        "Call Reassignment Logs View",
        "call-reassignment-logs:view",
        "Allows viewing call reassignment history and audit logs.",
    ),
    (
        "Phone Number Logs View",
        "phone-number-logs:view",
        "Allows viewing phone number assignment and change logs.",
    ),

    # ========================================================
    # DISBURSEMENT
    # ========================================================

    (
        "Disbursement View",
        "disbursement:view",
        "Allows viewing disbursement records and information.",
    ),
]


# ============================================================
# VALIDATE PERMISSION DEFINITIONS
# ============================================================

def validate_permissions() -> None:
    """
    Validate permission definitions before writing to the database.

    Duplicate codes are rejected so accidental duplicates cannot
    silently overwrite descriptions or names.
    """
    seen_codes = set()

    for permission_data in PERMISSIONS:
        if len(permission_data) != 3:
            raise ValueError(
                f"Permission must contain name, code, and description: "
                f"{permission_data!r}"
            )

        name, code, description = permission_data

        if not name or not code or not description:
            raise ValueError(
                f"Permission fields cannot be empty: {permission_data!r}"
            )

        if code in seen_codes:
            raise ValueError(
                f"Duplicate permission code found: {code}"
            )

        seen_codes.add(code)


# ============================================================
# SEED PERMISSIONS
# ============================================================

def seed_permissions(db: Session) -> None:
    """
    Insert missing permissions and update existing permissions.

    Existing IDs and created_at values are preserved.
    Existing permissions absent from this list are not deleted.
    """
    validate_permissions()

    created_count = 0
    updated_count = 0

    for name, code, description in PERMISSIONS:
        permission = (
            db.query(Permission)
            .filter(Permission.code == code)
            .first()
        )

        if permission:
            permission.name = name
            permission.description = description
            permission.is_active = True
            updated_count += 1
        else:
            db.add(
                Permission(
                    name=name,
                    code=code,
                    description=description,
                    is_active=True,
                )
            )
            created_count += 1

    # Flush sends pending inserts and updates to the database.
    # The caller remains responsible for committing the transaction.
    db.flush()

    print(f"Permissions defined: {len(PERMISSIONS)}")
    print(f"Permissions created: {created_count}")
    print(f"Permissions updated: {updated_count}")


# ============================================================
# MAIN SEED
# ============================================================

def seed() -> None:
    db = SessionLocal()

    try:
        print("Seeding permissions...")

        seed_permissions(db)

        db.commit()

        print("Permissions seed completed successfully.")

    except Exception:
        db.rollback()
        print("Permission seeding failed. Transaction rolled back.")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()