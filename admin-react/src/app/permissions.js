import { getCurrentUser } from './auth'

export const PERMISSIONS = Object.freeze({
    DASHBOARD_VIEW: 'dashboard:view',
    APPLICATION_FILTER_VIEW: 'application-filter:view',
    ATTENDANCE_VIEW: 'attendance:view',
    PROFILE_VIEW: 'profile:view',
    CALL_LOGS_VIEW: 'call-logs:view',
    CALL_ASSIGNMENT_VIEW: 'call-assignment:view',
    CALL_ANALYTICS_OVERVIEW_VIEW: 'call-analytics-overview:view',
    CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW: 'call-analytics-agent-performance:view',
    CALL_ANALYTICS_CALL_TRENDS_VIEW: 'call-analytics-call-trends:view',
    AGENT_ANALYTICS_OVERVIEW_VIEW: 'agent-analytics-overview:view',
    AGENT_Performance_OVERVIEW_VIEW: 'agent-performance-overview:view',
    PHONE_NUMBERS_VIEW:"phone-numbers-view",
    ADMIN_LOGS_VIEW:"admin-logs-view",

    ROLES_VIEW: 'roles:view',
    ROLES_MANAGE: 'roles:manage',
    TEAM_LEADS_VIEW: 'team-leads:view',
    AGENTS_VIEW: 'agents:view',
    ADMINS_VIEW: 'admins:view',
    PERMISSIONS_MANAGE: 'permissions:manage',

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
