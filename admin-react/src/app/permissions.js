import { getCurrentUser } from './auth'

export const PERMISSIONS = Object.freeze({
    DASHBOARD_VIEW: 'dashboard:view',
    APPLICATION_FILTER_VIEW: 'application-filter:view',
    ATTENDANCE_VIEW: 'attendance:view',
    PROFILE_VIEW: 'profile:view',
    CALL_LOGS_VIEW: 'call-logs:view',
    EMPLOYEE_LOGS_VIEW: 'employee-logs:view',
    CALL_ASSIGNMENT_LOGS_VIEW: 'call-assignment-logs:view',
    CALL_ASSIGNMENT_VIEW: 'call-assignment:view',
    CALL_ANALYTICS_OVERVIEW_VIEW: 'call-analytics-overview:view',
    CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW: 'call-analytics-agent-performance:view',
    CALL_ANALYTICS_CALL_TRENDS_VIEW: 'call-analytics-call-trends:view',
    AGENT_ANALYTICS_OVERVIEW_VIEW: 'agent-analytics-overview:view',
    AGENT_Performance_OVERVIEW_VIEW: 'agent-performance-overview:view',
    PHONE_NUMBERS_VIEW:"phone-numbers-view",
    ADMIN_LOGS_VIEW:"admin-logs-view",
    APPLICATION_STATUS_LOGS_VIEW:"application-status-logs-view",
    AGENT_ASSIGNMENT_LOGS_VIEW:"agent-assignment-logs-view",
    LEAD_CREATION_LOGS_VIEW:"lead-creation-logs-view",
    LOAN_TYPE_CHANGE_LOGS_VIEW:"loan-type-change-logs-view",
    APPLICATION_DELETE_LOGS_VIEW:"application-delete-logs-view",
    APPLICATION_EDIT_LOGS_VIEW:"application-edit-logs-view",
    BANK_PROCESSING_LOGS_VIEW:"bank-processing-logs-view",
    LOAN_ASSIGNMENT_LOGS_VIEW:"loan-assignment-logs-view",
    DUPLICATE_LEAD_LOGS_VIEW:"duplicate-lead-logs-view",
    CALL_REASSIGNMENT_LOGS_VIEW:"call-reassignment-logs-view",
    PHONE_NUMBER_LOGS_VIEW:"phone-number-logs-view",
    LOAN_SHUFFLE_LOGS_VIEW:"loan-shuffle-logs-view",
    ROLES_VIEW: 'roles:view',
    ROLES_MANAGE: 'roles:manage',
    TEAM_LEADS_VIEW: 'team-leads:view',
    AGENTS_VIEW: 'agents:view',
    ADMINS_VIEW: 'admins:view',
    PERMISSIONS_MANAGE: 'permissions:manage',
    REVERTED_HISTORY_LOGS_VIEW: 'reverted-history-logs:view',
    AGENT_LOGS_VIEW: 'agent-logs:view',
    TEAM_LEAD_LOGS_VIEW: 'team-lead-logs:view',
    ROLE_LOGS_VIEW: 'role-logs:view',
    LOANS_CREATE: 'loans:create',
    LOANS_VIEW: 'loans:view',
    LOANS_RM_VIEW: 'loans:rm:view',
    LOANS_AGENT_VIEW: 'loans:agent:view',
    LOANS_PENDING_VIEW: 'loans:pending:view',
    LOANS_SHUFFLE: 'loans:shuffle',
    LOANS_REVERTED_VIEW: 'loans:reverted:view',
    LOANS_ASSIGN: 'loans:assign',
    LOANS_DUPLICATE_APPROVE: 'loans:duplicates:approve',
    LOANS_STATUS_UPDATE: 'loans:status:update',
    LOANS_REMINDER_CREATE: 'loans:reminder:create',
    LOANS_CHAT_VIEW: 'loans:chat:view',

    BANKS_VIEW: 'banks:view',
    BANKS_MANAGE: 'banks:manage',
    BANKERS_VIEW: 'bankers:view',
    DSA_VIEW: 'dsa:view',
    DSA_MANAGE: 'dsa:manage',

    EMPLOYEE_ATTENDANCE_VIEW: 'employee-attendance:view',
})

const normalizeRequiredPermissions = (permissions) => {
    if (!permissions) return []
    return Array.isArray(permissions) ? permissions : [permissions]
}

const getUserPermissions = (user = getCurrentUser()) => {
    return Array.isArray(user?.permissions) ? user.permissions : []
}

export const hasAnyPermission = (permissions, user = getCurrentUser()) => {
    const requiredPermissions = normalizeRequiredPermissions(permissions)

    if (requiredPermissions.length === 0) return true

    const userPermissions = getUserPermissions(user)

    if (userPermissions.includes('*')) return true

    return requiredPermissions.some((permission) =>
        userPermissions.includes(permission)
    )
}

export const hasAllPermissions = (permissions, user = getCurrentUser()) => {
    const requiredPermissions = normalizeRequiredPermissions(permissions)

    if (requiredPermissions.length === 0) return true

    const userPermissions = getUserPermissions(user)

    if (userPermissions.includes('*')) return true

    return requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
    )
}

export const hasPermission = hasAnyPermission
