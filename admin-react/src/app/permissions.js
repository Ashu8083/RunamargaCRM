import { getStoredUser, getActiveContext } from "./auth";

// admin-react/src/app/permissions.js

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
  TEAM_LEADS_VIEW: "team-leads:view",
  AGENTS_VIEW: "agents:view",
  ADMINS_VIEW: "admins:view",

  // =========================================================================
  // LOANS
  // =========================================================================
  LOANS_CREATE: "loans:create",
  LOANS_VIEW: "loans:view",
  LOANS_RM_VIEW: "loans:rm:view",
  LOANS_AGENT_VIEW: "loans:agent:view",
  LOANS_PENDING_VIEW: "loans:pending:view",
  LOANS_SHUFFLE: "loans:shuffle",
  LOANS_REVERTED_VIEW: "loans:reverted:view",
  LOANS_ASSIGN: "loans:assign",
  LOANS_DUPLICATE_APPROVE: "loans:duplicates:approve",
  LOANS_STATUS_UPDATE: "loans:status:update",
  LOANS_REMINDER_CREATE: "loans:reminder:create",
  LOANS_CHAT_VIEW: "loans:chat:view",

  // Loan Type Access
  LOANS_PERSONAL_VIEW: "loans:personal:view",
  LOANS_BUSINESS_VIEW: "loans:business:view",
  LOANS_HOME_VIEW: "loans:home:view",
  LOANS_LAP_VIEW: "loans:lap:view",
  LOANS_EDUCATION_VIEW: "loans:education:view",
  LOANS_CAR_VIEW: "loans:car:view",
  LOANS_GOLD_VIEW: "loans:gold:view",
  LOANS_CREDIT_CARD_VIEW: "loans:credit-card:view",
  LOANS_AGRICULTURE_VIEW: "loans:agriculture:view",

  // Loan Type-wise Assignment Access
  LOANS_ASSIGNMENT_PERSONAL: "loans:assignment:personal",
  LOANS_ASSIGNMENT_BUSINESS: "loans:assignment:business",
  LOANS_ASSIGNMENT_HOME: "loans:assignment:home",
  LOANS_ASSIGNMENT_LAP: "loans:assignment:lap",
  LOANS_ASSIGNMENT_EDUCATION: "loans:assignment:education",
  LOANS_ASSIGNMENT_CAR: "loans:assignment:car",
  LOANS_ASSIGNMENT_GOLD: "loans:assignment:gold",
  LOANS_ASSIGNMENT_CREDIT_CARD: "loans:assignment:credit-card",
  LOANS_ASSIGNMENT_AGRICULTURE: "loans:assignment:agriculture",

  // =========================================================================
  // CALL MANAGEMENT
  // =========================================================================
  CALL_LOGS_VIEW: "calls:logs:view",
  CALL_ASSIGNMENT_VIEW: "calls:assignment:view",
  PHONE_NUMBERS_VIEW: "phone:numbers:view",

  // =========================================================================
  // CALL ANALYTICS
  // =========================================================================
  CALL_ANALYTICS_OVERVIEW_VIEW: "call-analytics-overview:view",

  CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW:
    "call-analytics-agent-performance:view",

  CALL_ANALYTICS_CALL_TRENDS_VIEW: "call-analytics-call-trends:view",

  // =========================================================================
  // AGENT ANALYTICS
  // =========================================================================
  AGENT_ANALYTICS_OVERVIEW_VIEW: "agent-analytics-overview:view",

  AGENT_PERFORMANCE_OVERVIEW_VIEW: "agent-performance-overview:view",

  AGENT_ANALYTICS_CALL_TRENDS_VIEW: "agent-analytics-call-trends:view",

  // =========================================================================
  // BANKS / BANKERS / DSA
  // =========================================================================
  BANKS_VIEW: "banks:view",
  BANKS_MANAGE: "banks:manage",
  BANKERS_VIEW: "bankers:view",
  DSA_VIEW: "dsa:view",
  DSA_MANAGE: "dsa:manage",

  // =========================================================================
  // EMPLOYEE MANAGEMENT
  // =========================================================================
  EMPLOYEES_VIEW: "employees:view",
  EMPLOYEES_CREATE: "employees:create",
  EMPLOYEES_EDIT: "employees:edit",
  EMPLOYEES_DELETE: "employees:delete",
  EMPLOYEES_BLOCK: "employees:block",
  ATTENDANCE_VIEW: "user-attendance:view",
  EMPLOYEE_ATTENDANCE_VIEW: "employee-attendance:view",
  FACE_ENROLLMENT_VIEW: "face-enrollment:view",

  // =========================================================================
  // LOGS
  // =========================================================================

  // -------------------------------------------------------------------------
  // Admin & Access Logs
  // -------------------------------------------------------------------------
  ADMIN_LOGS_VIEW: "admin-logs-view",
  ROLE_LOGS_VIEW: "role-logs:view",

  // -------------------------------------------------------------------------
  // Employee & Team Logs
  // -------------------------------------------------------------------------
  EMPLOYEE_LOGS_VIEW: "employee-logs:view",
  AGENT_LOGS_VIEW: "agent-logs:view",
  TEAM_LEAD_LOGS_VIEW: "team-lead-logs:view",
  AGENT_ASSIGNMENT_LOGS_VIEW: "agent-assignment-logs:view",

  // -------------------------------------------------------------------------
  // Application & Lead Logs
  // -------------------------------------------------------------------------
  LEAD_CREATION_LOGS_VIEW: "lead-creation-logs:view",
  APPLICATION_STATUS_LOGS_VIEW: "application-status-logs:view",
  APPLICATION_EDIT_LOGS_VIEW: "application-edit-logs:view",
  APPLICATION_DELETE_LOGS_VIEW: "application-delete-logs:view",
  LOAN_TYPE_CHANGE_LOGS_VIEW: "loan-type-change-logs:view",
  DUPLICATE_LEAD_LOGS_VIEW: "duplicate-lead-logs:view",

  // -------------------------------------------------------------------------
  // Loan Processing Logs
  // -------------------------------------------------------------------------
  BANK_PROCESSING_LOGS_VIEW: "bank-processing-logs:view",
  LOAN_ASSIGNMENT_LOGS_VIEW: "loan-assignment-logs:view",
  LOAN_SHUFFLE_LOGS_VIEW: "loan-shuffle-logs:view",
  REVERTED_HISTORY_LOGS_VIEW: "reverted-history-logs:view",

  // -------------------------------------------------------------------------
  // Call Management Logs
  // -------------------------------------------------------------------------
  CALL_ASSIGNMENT_LOGS_VIEW: "call-assignment-logs:view",
  CALL_REASSIGNMENT_LOGS_VIEW: "call-reassignment-logs:view",
  PHONE_NUMBER_LOGS_VIEW: "phone-number-logs:view",
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
