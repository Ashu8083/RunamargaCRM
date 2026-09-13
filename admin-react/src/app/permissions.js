// admin-react/src/app/permissions.js

import {
  getStoredUser,
  getActiveContext,
} from "./auth";


// =========================================================
// PERMISSIONS
// =========================================================

export const PERMISSIONS = Object.freeze({

  // =========================================================================
  // MAIN
  // =========================================================================

  DASHBOARD_VIEW: "dashboard:view",
  APPLICATION_FILTER_VIEW: "application-filter:view",
  PROFILE_VIEW: "profile:view",

  // =========================================================================
  // TEAMS & ROLES
  // =========================================================================

  ROLES_VIEW: "roles:view",
  ROLES_MANAGE: "roles:manage",
  PERMISSIONS_MANAGE: "permissions:manage",

  ROLES_CREATE: "roles:create",
  ROLES_EDIT: "roles:edit",
  ROLES_DELETE: "roles:delete",

  TEAM_LEADS_VIEW: "team-leads:view",
  TEAM_LEADS_CREATE: "team-leads:create",
  TEAM_LEADS_EDIT: "team-leads:edit",
  TEAM_LEADS_PERMISSIONS_MANAGE:
    "team-leads:permissions:manage",

  // =========================================================================
  // EMPLOYEES / AGENTS / ADMINS
  // =========================================================================

  EMPLOYEES_VIEW: "employees:view",
  EMPLOYEES_CREATE: "employees:create",
  EMPLOYEES_EDIT: "employees:edit",
  EMPLOYEES_DELETE: "employees:delete",
  EMPLOYEES_BLOCK: "employees:block",

  AGENTS_VIEW: "agents:view",
  AGENTS_CREATE: "agents:create",
  AGENTS_EDIT: "agents:edit",
  AGENTS_DELETE: "agents:delete",
  AGENTS_PERMISSIONS_MANAGE:
    "agents:permissions:manage",

  ADMINS_VIEW: "admins:view",

  // =========================================================================
  // ATTENDANCE / PROFILE
  // =========================================================================

  ATTENDANCE_VIEW: "user-attendance:view",
  ATTENDANCE_VIEW_ADMIN: "attendance:view",

  EMPLOYEE_ATTENDANCE_VIEW:
    "employee-attendance:view",

  FACE_ENROLLMENT_VIEW:
    "face-enrollment:view",

  // =========================================================================
  // DASHBOARD
  // =========================================================================

  DASHBOARD_CONVERSION_FUNNEL:
    "dashboard:conversion-funnel",

  DASHBOARD_LOAN_DISTRIBUTION:
    "dashboard:loan-distribution",

  // =========================================================================
  // LOANS
  // =========================================================================

  LOANS_VIEW: "loans:view",
  LOANS_CREATE: "loans:create",
  LOANS_EDIT: "loans:edit",
  LOANS_DELETE: "loans:delete",

  LOANS_STATUS_UPDATE:
    "loans:status:update",

  LOANS_ASSIGN:
    "loans:assign",

  LOANS_SHUFFLE:
    "loans:shuffle",

  LOANS_REVERT:
    "loans:revert",

  LOANS_PENDING_VIEW:
    "loans:pending:view",

  // =========================================================================
  // LOAN SHUFFLE
  // =========================================================================

  LOANS_SHUFFLE_LOAN_TYPE:
    "loans:shuffle:loan-type",

  LOANS_SHUFFLE_AGENT:
    "loans:shuffle:agent",

  LOANS_SHUFFLE_RM:
    "loans:shuffle:rm",

  // =========================================================================
  // LOAN EDITING
  // =========================================================================

  LOANS_DOCUMENT_EDIT:
    "loans:document:edit",

  LOANS_DETAILS_EDIT:
    "loans:details:edit",

  LOANS_ADDRESS_EDIT:
    "loans:address:edit",

  LOANS_CO_APPLICANT_EDIT:
    "loans:co-applicant:edit",

  LOANS_HEADER_EDIT:
    "loans:header:edit",

  LOANS_REFERENCE_EDIT:
    "loans:reference:edit",

  LOANS_DUPLICATE_APPROVE:
    "loans:duplicates:approve",

  LOANS_MAIL_SEND:
    "loans:mail:send",

  // =========================================================================
  // LOAN REMARKS
  // =========================================================================

  LOANS_REMARKS_VIEW:
    "loans:remarks:view",

  LOANS_REMARKS_SEND:
    "loans:remarks:send",

  LOANS_REMARKS_DELETE:
    "loans:remarks:delete",

  // =========================================================================
  // LOAN NOTES
  // =========================================================================

  LOANS_NOTES_VIEW:
    "loans:notes:view",

  LOANS_NOTES_SEND:
    "loans:notes:send",

  // =========================================================================
  // LOAN CHAT
  // =========================================================================

  LOANS_CHAT_VIEW:
    "loans:chat:view",

  // =========================================================================
  // LOAN TYPE VIEW ACCESS
  // =========================================================================

  LOANS_PERSONAL_VIEW:
    "loans:personal:view",

  LOANS_BUSINESS_VIEW:
    "loans:business:view",

  LOANS_HOME_VIEW:
    "loans:home:view",

  LOANS_LAP_VIEW:
    "loans:lap:view",

  LOANS_EDUCATION_VIEW:
    "loans:education:view",

  LOANS_CAR_VIEW:
    "loans:car:view",

  LOANS_GOLD_VIEW:
    "loans:gold:view",

  LOANS_CREDIT_CARD_VIEW:
    "loans:credit-card:view",

  LOANS_AGRICULTURE_VIEW:
    "loans:agriculture:view",

  // =========================================================================
  // LOAN TYPE-WISE ASSIGNMENT ACCESS
  // =========================================================================

  LOANS_ASSIGNMENT_PERSONAL:
    "loans:assignment:personal",

  LOANS_ASSIGNMENT_BUSINESS:
    "loans:assignment:business",

  LOANS_ASSIGNMENT_HOME:
    "loans:assignment:home",

  LOANS_ASSIGNMENT_LAP:
    "loans:assignment:lap",

  LOANS_ASSIGNMENT_EDUCATION:
    "loans:assignment:education",

  LOANS_ASSIGNMENT_CAR:
    "loans:assignment:car",

  LOANS_ASSIGNMENT_GOLD:
    "loans:assignment:gold",

  LOANS_ASSIGNMENT_CREDIT_CARD:
    "loans:assignment:credit-card",

  LOANS_ASSIGNMENT_AGRICULTURE:
    "loans:assignment:agriculture",

  // =========================================================================
  // CALL MANAGEMENT
  // =========================================================================

  CALL_LOGS_VIEW:
    "calls:logs:view",

  CALL_ASSIGNMENT_VIEW:
    "calls:assignment:view",

  CALLS_LOGS_VIEW:
    "calls:logs:view",

  CALLS_ASSIGNMENT_VIEW:
    "calls:assignment:view",

  CALLS_NUMBER_ASSIGN:
    "calls:number:assign",

  CALLS_NUMBER_EXCHANGE:
    "calls:number:exchange",

  PHONE_NUMBERS_VIEW:
    "phone:numbers:view",

  // =========================================================================
  // CALL ANALYTICS
  // =========================================================================

  CALL_ANALYTICS_OVERVIEW_VIEW:
    "call-analytics-overview:view",

  CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW:
    "call-analytics-agent-performance:view",

  CALL_ANALYTICS_CALL_TRENDS_VIEW:
    "call-analytics-call-trends:view",

  // =========================================================================
  // AGENT ANALYTICS
  // =========================================================================

  AGENT_ANALYTICS_OVERVIEW_VIEW:
    "agent-analytics-overview:view",

  AGENT_PERFORMANCE_OVERVIEW_VIEW:
    "agent-performance-overview:view",

  AGENT_ANALYTICS_CALL_TRENDS_VIEW:
    "agent-analytics-call-trends:view",

  // =========================================================================
  // BANKS
  // =========================================================================

  BANKS_VIEW:
    "banks:view",

  BANKS_MANAGE:
    "banks:manage",

  BANKS_CREATE:
    "banks:create",

  BANKS_EDIT:
    "banks:edit",

  BANKS_DELETE:
    "banks:delete",

  // =========================================================================
  // BANKERS
  // =========================================================================

  BANKERS_VIEW:
    "bankers:view",

  BANKERS_CREATE:
    "bankers:create",

  BANKERS_EDIT:
    "bankers:edit",

  BANKERS_DELETE:
    "bankers:delete",

  // =========================================================================
  // DSA
  // =========================================================================

  DSA_VIEW:
    "dsa:view",

  DSA_MANAGE:
    "dsa:manage",

  DSA_CREATE:
    "dsa:create",

  DSA_EDIT:
    "dsa:edit",

  DSA_DELETE:
    "dsa:delete",

  // =========================================================================
  // BANK PROCESSING
  // =========================================================================

  BANK_PROCESSING_VIEW:
    "bank-processing:view",

  BANK_PROCESSING_CREATE:
    "bank-processing:create",

  BANK_PROCESSING_EDIT:
    "bank-processing:edit",

  BANK_PROCESSING_DELETE:
    "bank-processing:delete",

  // =========================================================================
  // LOGS
  // =========================================================================

  ADMIN_LOGS_VIEW:
    "admin-logs-view",

  ROLE_LOGS_VIEW:
    "role-logs:view",

  EMPLOYEE_LOGS_VIEW:
    "employee-logs:view",

  AGENT_LOGS_VIEW:
    "agent-logs:view",

  TEAM_LEAD_LOGS_VIEW:
    "team-lead-logs:view",

  AGENT_ASSIGNMENT_LOGS_VIEW:
    "agent-assignment-logs:view",

  LEAD_CREATION_LOGS_VIEW:
    "lead-creation-logs:view",

  APPLICATION_STATUS_LOGS_VIEW:
    "application-status-logs:view",

  APPLICATION_EDIT_LOGS_VIEW:
    "application-edit-logs:view",

  APPLICATION_DELETE_LOGS_VIEW:
    "application-delete-logs:view",

  LOAN_TYPE_CHANGE_LOGS_VIEW:
    "loan-type-change-logs:view",

  DUPLICATE_LEAD_LOGS_VIEW:
    "duplicate-lead-logs:view",

  BANK_PROCESSING_LOGS_VIEW:
    "bank-processing-logs:view",

  LOAN_ASSIGNMENT_LOGS_VIEW:
    "loan-assignment-logs:view",

  LOAN_SHUFFLE_LOGS_VIEW:
    "loan-shuffle-logs:view",

  REVERTED_HISTORY_LOGS_VIEW:
    "reverted-history-logs:view",

  CALL_ASSIGNMENT_LOGS_VIEW:
    "call-assignment-logs:view",

  CALL_REASSIGNMENT_LOGS_VIEW:
    "call-reassignment-logs:view",

  PHONE_NUMBER_LOGS_VIEW:
    "phone-number-logs:view",

  // =========================================================================
  // DISBURSEMENT
  // =========================================================================

  DISBURSEMENT_VIEW:
    "disbursement:view",
})


// =========================================================
// NORMALIZE REQUIRED PERMISSIONS
// =========================================================

const normalizeRequiredPermissions = (
  permissions
) => {

  if (!permissions) {
    return []
  }


  return Array.isArray(
    permissions
  )
    ? permissions
    : [permissions]
}


// =========================================================
// GET USER PERMISSIONS
// =========================================================
//
// New RBAC:
//
// user
//   └── contexts
//         ├── AGENT
//         │     └── permissions[]
//         │
//         ├── RM
//         │     └── permissions[]
//         │
//         └── TEAMLEAD
//               └── permissions[]
//
// The permission list belongs to the
// currently active employee context.
//
// =========================================================

const getUserPermissions = (
  user = getStoredUser()
) => {

  if (!user) {
    return []
  }


  // =====================================================
  // NEW RBAC
  // =====================================================

  if (
    Array.isArray(
      user.contexts
    )
  ) {

    const activeContext =
      getActiveContext(
        user
      )


    if (!activeContext) {
      return []
    }


    return Array.isArray(
      activeContext.permissions
    )
      ? activeContext.permissions
      : []
  }


  // =====================================================
  // BACKWARD COMPATIBILITY
  // =====================================================

  if (
    Array.isArray(
      user.permissions
    )
  ) {

    return user.permissions
  }


  return []
}


// =========================================================
// ANY PERMISSION
// =========================================================
//
// Returns true when the user has at least
// one of the requested permissions.
//
// =========================================================

export const hasAnyPermission = (
  permissions,
  user = getStoredUser()
) => {

  const requiredPermissions =
    normalizeRequiredPermissions(
      permissions
    )


  if (
    requiredPermissions.length === 0
  ) {

    return true
  }


  const userPermissions =
    getUserPermissions(
      user
    )


  // =====================================================
  // SUPER ADMIN
  // =====================================================

  if (
    userPermissions.includes("*")
  ) {

    return true
  }


  return requiredPermissions.some(
    (permission) =>
      userPermissions.includes(
        permission
      )
  )
}


// =========================================================
// ALL PERMISSIONS
// =========================================================
//
// Returns true only when the user has
// every requested permission.
//
// =========================================================

export const hasAllPermissions = (
  permissions,
  user = getStoredUser()
) => {

  const requiredPermissions =
    normalizeRequiredPermissions(
      permissions
    )


  if (
    requiredPermissions.length === 0
  ) {

    return true
  }


  const userPermissions =
    getUserPermissions(
      user
    )


  // =====================================================
  // SUPER ADMIN
  // =====================================================

  if (
    userPermissions.includes("*")
  ) {

    return true
  }


  return requiredPermissions.every(
    (permission) =>
      userPermissions.includes(
        permission
      )
  )
}


// =========================================================
// DEFAULT PERMISSION CHECKER
// =========================================================

export const hasPermission =
  hasAnyPermission