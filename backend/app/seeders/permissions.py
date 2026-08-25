from sqlalchemy.orm import Session

from app.models.roles import Role
from app.models.permissions import Permission
from app.models.role_permissions import RolePermission


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
    ("Dashboard View", "DASHBOARD_VIEW"),
    ("Profile View", "PROFILE_VIEW"),
    ("Application Filter", "APPLICATION_FILTER"),


    # Leads
    ("My Leads View", "MY_LEADS_VIEW"),
    ("My Leads Edit", "MY_LEADS_EDIT"),
    ("Assigned Leads View", "ASSIGNED_LEADS_VIEW"),
    ("Assigned Leads Edit", "ASSIGNED_LEADS_EDIT"),

    # Applications
    ("Application Create", "APPLICATION_CREATE"),
    ("Application View", "APPLICATION_VIEW"),
    ("Application Edit", "APPLICATION_EDIT"),
    ("Application Status Change", "APPLICATION_STATUS_CHANGE"),
    ("Application Assign", "APPLICATION_ASSIGN"),
    ("Application Shuffle", "APPLICATION_SHUFFLE"),
    ("Application Revert", "APPLICATION_REVERT"),

    # Documents / details
    ("Application Document Edit", "APPLICATION_DOCUMENT_EDIT"),
    ("Application Loan Details Edit", "APPLICATION_LOAN_DETAILS_EDIT"),
    ("Application Address Edit", "APPLICATION_ADDRESS_EDIT"),
    ("Application Co Applicant Edit", "APPLICATION_CO_APPLICANT_EDIT"),
    ("Application Header Edit", "APPLICATION_HEADER_EDIT"),
    ("Application Reference Edit", "APPLICATION_REFERENCE_EDIT"),

    # Communication
    ("Application Mail Send", "APPLICATION_MAIL_SEND"),
    ("Application Remarks View", "APPLICATION_REMARKS_VIEW"),
    ("Application Remarks Send", "APPLICATION_REMARKS_SEND"),
    ("Application Notes View", "APPLICATION_NOTES_VIEW"),
    ("Customer Chat Access", "CUSTOMER_CHAT_ACCESS"),

    # Bank processing
    ("Bank Processing View", "BANK_PROCESSING_VIEW"),
    ("Bank Processing Create", "BANK_PROCESSING_CREATE"),
    ("Bank Processing Edit", "BANK_PROCESSING_EDIT"),
    ("Bank Processing Delete", "BANK_PROCESSING_DELETE"),

    # Analytics
    ("Analytics View", "ANALYTICS_VIEW"),
    ("Team Performance View", "TEAM_PERFORMANCE_VIEW"),
    ("Agent Performance View", "AGENT_PERFORMANCE_VIEW"),
    ("Call Analytics View", "CALL_ANALYTICS_VIEW"),

    # Employees
    ("Employee View", "EMPLOYEE_VIEW"),
    ("Employee Create", "EMPLOYEE_CREATE"),
    ("Employee Edit", "EMPLOYEE_EDIT"),
    ("Employee Delete", "EMPLOYEE_DELETE"),
    ("Employee Block", "EMPLOYEE_BLOCK"),

    # Team leads / agents
    ("Team Lead View", "TEAM_LEAD_VIEW"),
    ("Team Lead Create", "TEAM_LEAD_CREATE"),
    ("Team Lead Edit", "TEAM_LEAD_EDIT"),
    ("Team Lead Permission Manage", "TEAM_LEAD_PERMISSION_MANAGE"),
    ("Agent View", "AGENT_VIEW"),
    ("Agent Create", "AGENT_CREATE"),
    ("Agent Edit", "AGENT_EDIT"),
    ("Agent Delete", "AGENT_DELETE"),
    ("Agent Permission Manage", "AGENT_PERMISSION_MANAGE"),

    # Calls
    ("Call Logs View", "CALL_LOGS_VIEW"),
    ("Call Assignment View", "CALL_ASSIGNMENT_VIEW"),
    ("Call Number Assign", "CALL_NUMBER_ASSIGN"),
    ("Call Number Exchange", "CALL_NUMBER_EXCHANGE"),

    # Roles
    ("Role View", "ROLE_VIEW"),
    ("Role Create", "ROLE_CREATE"),
    ("Role Edit", "ROLE_EDIT"),
    ("Role Delete", "ROLE_DELETE"),

    # Banks
    ("Bank View", "BANK_VIEW"),
    ("Bank Create", "BANK_CREATE"),
    ("Bank Edit", "BANK_EDIT"),
    ("Bank Delete", "BANK_DELETE"),

    # Banker
    ("Banker View", "BANKER_VIEW"),
    ("Banker Create", "BANKER_CREATE"),
    ("Banker Edit", "BANKER_EDIT"),
    ("Banker Delete", "BANKER_DELETE"),

    # DSA
    ("DSA View", "DSA_VIEW"),
    ("DSA Create", "DSA_CREATE"),
    ("DSA Edit", "DSA_EDIT"),
    ("DSA Delete", "DSA_DELETE"),

    # Attendance
    ("Attendance View", "ATTENDANCE_VIEW"),

    # Accountant
    ("Disbursement View", "DISBURSEMENT_VIEW"),
]