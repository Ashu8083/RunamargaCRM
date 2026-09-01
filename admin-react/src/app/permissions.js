import { getCurrentUser, getActiveContext } from './auth'

export const PERMISSIONS = Object.freeze({
    // =========================================================
    // MAIN
    // =========================================================

    DASHBOARD_VIEW: 'dashboard:view',
    APPLICATION_FILTER_VIEW: 'application-filter:view',
    ATTENDANCE_VIEW: 'attendance:view',
    PROFILE_VIEW: 'profile:view',

    // =========================================================
    // CALL MANAGEMENT
    // =========================================================

    CALL_LOGS_VIEW: 'calls:logs:view',
    CALL_ASSIGNMENT_VIEW: 'calls:assignment:view',
    CALL_ANALYTICS_OVERVIEW_VIEW:
        'call-analytics-overview:view',
    CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW:
        'call-analytics-agent-performance:view',
    CALL_ANALYTICS_CALL_TRENDS_VIEW:
        'call-analytics-call-trends:view',

    // =========================================================
    // TEAMS & ROLES
    // =========================================================

    ROLES_VIEW: 'roles:view',
    ROLES_MANAGE: 'roles:manage',

    TEAM_LEADS_VIEW: 'team-leads:view',
    AGENTS_VIEW: 'agents:view',
    ADMINS_VIEW: 'admins:view',
    PERMISSIONS_MANAGE: 'permissions:manage',

    // =========================================================
    // LOANS
    // =========================================================

    LOANS_CREATE: 'loans:create',
    LOANS_VIEW: 'loans:view',
    LOANS_RM_VIEW: 'loans:rm:view',
    LOANS_AGENT_VIEW: 'loans:agent:view',
    LOANS_PENDING_VIEW: 'loans:pending:view',
    LOANS_SHUFFLE: 'loans:shuffle',
    LOANS_REVERTED_VIEW: 'loans:reverted:view',
    LOANS_ASSIGN: 'loans:assign',
    LOANS_DUPLICATE_APPROVE:
        'loans:duplicates:approve',
    LOANS_STATUS_UPDATE: 'loans:status:update',
    LOANS_REMINDER_CREATE:
        'loans:reminder:create',
    LOANS_CHAT_VIEW: 'loans:chat:view',

    // =========================================================
    // BANKS / DSA
    // =========================================================

    BANKS_VIEW: 'banks:view',
    BANKS_MANAGE: 'banks:manage',

    BANKERS_VIEW: 'bankers:view',

    DSA_VIEW: 'dsa:view',
    DSA_MANAGE: 'dsa:manage',

    // =========================================================
    // EMPLOYEES
    // =========================================================

    EMPLOYEES_VIEW: 'employees:view',
    EMPLOYEES_CREATE: 'employees:create',
    EMPLOYEES_EDIT: 'employees:edit',
    EMPLOYEES_DELETE: 'employees:delete',
    EMPLOYEES_BLOCK: 'employees:block',

    EMPLOYEE_ATTENDANCE_VIEW:
        'employee-attendance:view',
})


// =========================================================
// Normalize required permissions
// =========================================================

const normalizeRequiredPermissions = (permissions) => {
    if (!permissions) {
        return []
    }

    return Array.isArray(permissions)
        ? permissions
        : [permissions]
}


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

const getUserPermissions = (
    user = getCurrentUser()
) => {
    if (!user) {
        return []
    }

    // =====================================================
    // NEW RBAC
    // =====================================================

    if (Array.isArray(user.contexts)) {
        const activeContext =
            getActiveContext(user)

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

    if (Array.isArray(user.permissions)) {
        return user.permissions
    }

    return []
}


// =========================================================
// ANY permission
// =========================================================

export const hasAnyPermission = (
    permissions,
    user = getCurrentUser()
) => {
    const requiredPermissions =
        normalizeRequiredPermissions(
            permissions
        )

    if (requiredPermissions.length === 0) {
        return true
    }

    const userPermissions =
        getUserPermissions(user)

    // =====================================================
    // SUPER ADMIN
    // =====================================================

    if (userPermissions.includes('*')) {
        return true
    }

    return requiredPermissions.some(
        (permission) =>
            userPermissions.includes(permission)
    )
}


// =========================================================
// ALL permissions
// =========================================================

export const hasAllPermissions = (
    permissions,
    user = getCurrentUser()
) => {
    const requiredPermissions =
        normalizeRequiredPermissions(
            permissions
        )

    if (requiredPermissions.length === 0) {
        return true
    }

    const userPermissions =
        getUserPermissions(user)

    // =====================================================
    // SUPER ADMIN
    // =====================================================

    if (userPermissions.includes('*')) {
        return true
    }

    return requiredPermissions.every(
        (permission) =>
            userPermissions.includes(permission)
    )
}


// =========================================================
// Default permission checker
// =========================================================

export const hasPermission =
    hasAnyPermission