// admin-react/src/app/permissions.js

import { getStoredUser, getActiveContext } from "./auth";

export const PERMISSIONS = Object.freeze({

  // =========================================================
  // MAIN
  // =========================================================

  DASHBOARD_VIEW: "dashboard:view",
  DASHBOARD_CONVERSION_FUNNEL: "dashboard:conversion-funnel",
  DASHBOARD_LOAN_DISTRIBUTION: "dashboard:loan-distribution",

  PROFILE_VIEW: "profile:view",
  ATTENDANCE_VIEW: "user-attendance:view",
  APPLICATION_FILTER_VIEW: "application-filter:view",

  // =========================================================
  // TEAM LEADS
  // =========================================================

  TEAM_LEADS_VIEW: "team-leads:view",
  TEAM_LEADS_CREATE: "team-leads:create",
  TEAM_LEADS_EDIT: "team-leads:edit",
  TEAM_LEADS_PERMISSIONS_MANAGE: "team-leads:permissions:manage",

  // =========================================================
  // AGENTS
  // =========================================================

  AGENTS_VIEW: "agents:view",
  AGENTS_CREATE: "agents:create",
  AGENTS_EDIT: "agents:edit",
  AGENTS_DELETE: "agents:delete",
  AGENTS_PERMISSIONS_MANAGE: "agents:permissions:manage",

  // =========================================================
  // LOANS
  // =========================================================

  LOANS_VIEW: "loans:view",
  LOANS_CREATE: "loans:create",
  LOANS_EDIT: "loans:edit",
  LOANS_DELETE: "loans:delete",
  LOANS_STATUS_UPDATE: "loans:status:update",
  LOANS_ASSIGN: "loans:assign",
  LOANS_SHUFFLE: "loans:shuffle",
  LOANS_REVERT: "loans:revert",
  LOANS_PENDING_VIEW: "loans:pending:view",

  LOANS_SHUFFLE_LOAN_TYPE: "loans:shuffle:loan-type",
  LOANS_SHUFFLE_AGENT: "loans:shuffle:agent",
  LOANS_SHUFFLE_RM: "loans:shuffle:rm",

  LOANS_DOCUMENT_EDIT: "loans:document:edit",
  LOANS_DETAILS_EDIT: "loans:details:edit",
  LOANS_ADDRESS_EDIT: "loans:address:edit",
  LOANS_CO_APPLICANT_EDIT: "loans:co-applicant:edit",
  LOANS_HEADER_EDIT: "loans:header:edit",
  LOANS_REFERENCE_EDIT: "loans:reference:edit",

  LOANS_DUPLICATE_APPROVE: "loans:duplicates:approve",

  LOANS_MAIL_SEND: "loans:mail:send",

  LOANS_REMARKS_VIEW: "loans:remarks:view",
  LOANS_REMARKS_SEND: "loans:remarks:send",
  LOANS_REMARKS_DELETE: "loans:remarks:delete",

  LOANS_NOTES_VIEW: "loans:notes:view",
  LOANS_NOTES_SEND: "loans:notes:send",

  LOANS_CHAT_VIEW: "loans:chat:view",

  // =========================================================
  // BANK PROCESSING
  // =========================================================

  BANK_PROCESSING_VIEW: "bank-processing:view",
  BANK_PROCESSING_CREATE: "bank-processing:create",
  BANK_PROCESSING_EDIT: "bank-processing:edit",
  BANK_PROCESSING_DELETE: "bank-processing:delete",

  // =========================================================
  // LOAN TYPES
  // =========================================================

  LOANS_PERSONAL_VIEW: "loans:personal:view",
  LOANS_BUSINESS_VIEW: "loans:business:view",
  LOANS_HOME_VIEW: "loans:home:view",
  LOANS_LAP_VIEW: "loans:lap:view",
  LOANS_EDUCATION_VIEW: "loans:education:view",
  LOANS_CAR_VIEW: "loans:car:view",
  LOANS_GOLD_VIEW: "loans:gold:view",
  LOANS_CREDIT_CARD_VIEW: "loans:credit-card:view",
  LOANS_AGRICULTURE_VIEW: "loans:agriculture:view",

  // =========================================================
  // EMPLOYEES
  // =========================================================

  EMPLOYEES_VIEW: "employees:view",
  EMPLOYEES_CREATE: "employees:create",
  EMPLOYEES_EDIT: "employees:edit",
  EMPLOYEES_DELETE: "employees:delete",
  EMPLOYEES_BLOCK: "employees:block",

  // =========================================================
  // CALLS
  // =========================================================

  CALLS_LOGS_VIEW: "calls:logs:view",
  CALLS_ASSIGNMENT_VIEW: "calls:assignment:view",
  CALLS_NUMBER_ASSIGN: "calls:number:assign",
  CALLS_NUMBER_EXCHANGE: "calls:number:exchange",

  // =========================================================
  // PHONE NUMBERS
  // =========================================================

  PHONE_NUMBERS_VIEW: "phone:numbers:view",

  // =========================================================
  // ROLES
  // =========================================================

  ROLES_VIEW: "roles:view",
  ROLES_CREATE: "roles:create",
  ROLES_EDIT: "roles:edit",
  ROLES_DELETE: "roles:delete",

  // =========================================================
  // BANKS
  // =========================================================

  BANKS_VIEW: "banks:view",
  BANKS_CREATE: "banks:create",
  BANKS_EDIT: "banks:edit",
  BANKS_DELETE: "banks:delete",

  // =========================================================
  // BANKERS
  // =========================================================

  BANKERS_VIEW: "bankers:view",
  BANKERS_CREATE: "bankers:create",
  BANKERS_EDIT: "bankers:edit",
  BANKERS_DELETE: "bankers:delete",

  // =========================================================
  // DSA
  // =========================================================

  DSA_VIEW: "dsa:view",
  DSA_CREATE: "dsa:create",
  DSA_EDIT: "dsa:edit",
  DSA_DELETE: "dsa:delete",

  // =========================================================
  // ATTENDANCE / DISBURSEMENT
  // =========================================================

  ATTENDANCE_VIEW_ADMIN: "attendance:view",
  DISBURSEMENT_VIEW: "disbursement:view",
});
// =========================================================
// Normalize required permissions
// =========================================================

const normalizeRequiredPermissions = (permissions) => {
  if (!permissions) {
    return [];
  }

  return Array.isArray(permissions) ? permissions : [permissions];
};

// =========================================================
// Get permissions for ACTIVE CONTEXT
// =========================================================
//
// Backend:
//
// user
//   └── contexts
//         ├── AGENT
//         │     └── permissions[]
//         │
//         └── RM
//               └── permissions[]
//
// Frontend:
//
// active_context_id
//        ↓
// getActiveContext()
//        ↓
// context.permissions
//
// =========================================================

const getUserPermissions = (user = getStoredUser()) => {
  if (!user) {
    return [];
  }

  // =====================================================
  // NEW RBAC
  // =====================================================

  if (Array.isArray(user.contexts)) {
    const activeContext = getActiveContext(user);

    if (!activeContext) {
      return [];
    }

    return Array.isArray(activeContext.permissions)
      ? activeContext.permissions
      : [];
  }

  // =====================================================
  // BACKWARD COMPATIBILITY
  // =====================================================

  if (Array.isArray(user.permissions)) {
    return user.permissions;
  }

  return [];
};

// =========================================================
// ANY permission
// =========================================================

export const hasAnyPermission = (permissions, user = getStoredUser()) => {
  const requiredPermissions = normalizeRequiredPermissions(permissions);

  if (requiredPermissions.length === 0) {
    return true;
  }

  const userPermissions = getUserPermissions(user);

  // =====================================================
  // SUPER ADMIN
  // =====================================================

  if (userPermissions.includes("*")) {
    return true;
  }

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
};

// =========================================================
// ALL permissions
// =========================================================

export const hasAllPermissions = (permissions, user = getStoredUser()) => {
  const requiredPermissions = normalizeRequiredPermissions(permissions);

  if (requiredPermissions.length === 0) {
    return true;
  }

  const userPermissions = getUserPermissions(user);

  // =====================================================
  // SUPER ADMIN
  // =====================================================

  if (userPermissions.includes("*")) {
    return true;
  }

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
};

// =========================================================
// Default permission checker
// =========================================================

export const hasPermission = hasAnyPermission;
