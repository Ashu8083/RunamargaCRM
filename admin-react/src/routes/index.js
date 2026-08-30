// admin-react/src/routes/index.js

// All components mapping with path for internal routes

import { lazy } from 'react'

import { PERMISSIONS } from '../app/permissions'


// =========================================================
// MAIN
// =========================================================

const Dashboard = lazy(() =>
    import('../pages/Dashboard/index')
)

const ApplicationFilter = lazy(() =>
    import('../pages/Applicationfilter/index')
)

const Attendance = lazy(() =>
    import('../pages/Attendance/index')
)

const Profile = lazy(() =>
    import('../pages/Profile')
)


// =========================================================
// TEAMS & ROLES
// =========================================================

const Roles = lazy(() =>
    import('../pages/Roles&Teams/Roles/index')
)

const TeamLead = lazy(() =>
    import('../pages/Roles&Teams/TeamLead/index')
)

const Agents = lazy(() =>
    import('../pages/Roles&Teams/Agents/index')
)

const Admins = lazy(() =>
    import('../pages/Roles&Teams/Admins/index')
)


// =========================================================
// LOANS
// =========================================================

const CreateApplication = lazy(
    () => import('../pages/Loans/CreateApplication/index')
)
const Applications = lazy(() =>
    import('../pages/Loans/CombinedApplications/index')
)

const RMApplications = lazy(() =>
    import('../pages/Loans/RMApplications/index')
)

const AgentApplications = lazy(() =>
    import('../pages/Loans/AgentApplications/index')
)

const PendingApplications = lazy(() =>
    import('../pages/Loans/PendingApplications/index')
)

const ShuffleLoans = lazy(() =>
    import('../pages/Loans/ShuffleLoans/index')
)

const RevertedApplications = lazy(() =>
    import('../pages/Loans/RevertedApplications/index')
)

const LoanAssignment = lazy(() =>
    import('../pages/Loans/LoanAssignment/index')
)

const DuplicateApproval = lazy(() =>
    import('../pages/Loans/DuplicateApproval/index')
)

const ViewApplication = lazy(
    () => import('../pages/Loans/ViewApplication/index')
)


// =========================================================
// Call Management
// =========================================================

const CallLogs = lazy(
    () => import('../pages/CallManagement/CallLogs')
)

const CallAssignment = lazy(
    () => import('../pages/CallManagement/CallAssignment')
)


// =========================================================
// Call Analytics
// =========================================================

const CallAnalyticsOverview = lazy(
    () => import('../pages/CallManagement/CallAnalytics/Overview')
)

const AgentPerformance = lazy(
    () => import('../pages/CallManagement/CallAnalytics/AgentPerformance')
)

const CallTrends = lazy(
    () => import('../pages/CallManagement/CallAnalytics/CallTrends')
)


// =========================================================
// Banks & DSA
// =========================================================

const Banks = lazy(
    () => import('../pages/Banks&DSA/Banks/index')
)

const BankersDirectory = lazy(
    () => import('../pages/Banks&DSA/BankersDirectory/index')
)

const DSADirectory = lazy(
    () => import('../pages/Banks&DSA/DSADirectory/index')
)


// =========================================================
// Employee Management
// =========================================================

const Employees = lazy(
    () => import('../pages/EmployeeManagement/Employees')
)

const EmployeeAttendance = lazy(
    () => import('../pages/EmployeeManagement/Attendance/index')
)


// =========================================================
// ROUTES
// =========================================================

const routes = [

    // =====================================================
    // MAIN
    // =====================================================

    {
        path: '/dashboard',
        component: Dashboard,
        permission: PERMISSIONS.DASHBOARD_VIEW,
    },

    {
        path: '/filter',
        component: ApplicationFilter,
        permission: PERMISSIONS.APPLICATION_FILTER_VIEW,
    },

    {
        path: '/attendance',
        component: Attendance,
        permission: PERMISSIONS.ATTENDANCE_VIEW,
    },

    {
        path: '/profile',
        component: Profile,
        permission: PERMISSIONS.PROFILE_VIEW,
    },


    // =====================================================
    // TEAMS & ROLES
    // =====================================================

    {
        path: '/roles',
        component: Roles,
        permission: PERMISSIONS.ROLES_VIEW,
    },

    {
        path: '/team-leads',
        component: TeamLead,
        permission: PERMISSIONS.TEAM_LEADS_VIEW,
    },

    {
        path: '/agents',
        component: Agents,
        permission: PERMISSIONS.AGENTS_VIEW,
    },

    {
        path: '/admins',
        component: Admins,
        permission: PERMISSIONS.ADMINS_VIEW,
    },


    // =====================================================
    // LOANS
    // =====================================================

    {
        path: '/create-application',
        component: CreateApplication,
        permission: PERMISSIONS.LOANS_CREATE,
    },

    {
        path: '/view-application',
        component: ViewApplication,
        permission: PERMISSIONS.LOANS_VIEW,
    },
    {
        path: '/applications',
        component: Applications,
        permission: PERMISSIONS.LOANS_VIEW,
    },
    // {
    //     path: '/rm-applications',
    //     component: RMApplications,
    //     permission: PERMISSIONS.LOANS_RM_VIEW,
    // },

    // {
    //     path: '/agent-applications',
    //     component: AgentApplications,
    //     permission: PERMISSIONS.LOANS_AGENT_VIEW,
    // },

    {
        path: '/pending-applications',
        component: PendingApplications,
        permission: PERMISSIONS.LOANS_PENDING_VIEW,
    },

    {
        path: '/shuffle-loans',
        component: ShuffleLoans,
        permission: PERMISSIONS.LOANS_SHUFFLE,
    },

    {
        path: '/reverted-applications',
        component: RevertedApplications,
        permission: PERMISSIONS.LOANS_REVERTED_VIEW,
    },

    {
        path: '/duplicate-approvals',
        component: DuplicateApproval,
        permission: PERMISSIONS.LOANS_DUPLICATE_APPROVE,
    },

    {
        path: '/loan-assignment',
        component: LoanAssignment,
        permission: PERMISSIONS.LOANS_ASSIGN,
    },


    // =====================================================
    // Call Management
    // =====================================================

    {
        path: '/call-logs',
        component: CallLogs,
        permission: PERMISSIONS.CALL_LOGS_VIEW,
    },

    {
        path: '/call-assignment',
        component: CallAssignment,
        permission: PERMISSIONS.CALL_ASSIGNMENT_VIEW,
    },


    // =====================================================
    // Call Analytics
    // =====================================================

    {
        path: '/call-analytics/overview',
        component: CallAnalyticsOverview,
        permission: PERMISSIONS.CALL_ANALYTICS_OVERVIEW_VIEW,
    },

    {
        path: '/call-analytics/agent-performance',
        component: AgentPerformance,
        permission: PERMISSIONS.CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW,
    },

    {
        path: '/call-analytics/call-trends',
        component: CallTrends,
        permission: PERMISSIONS.CALL_ANALYTICS_CALL_TRENDS_VIEW,
    },


    // =====================================================
    // Banks and DSA
    // =====================================================

    {
        path: '/banks',
        component: Banks,
        permission: PERMISSIONS.BANKS_VIEW,
    },

    {
        path: '/bankers-directory',
        component: BankersDirectory,
        permission: PERMISSIONS.BANKERS_VIEW,
    },

    {
        path: '/dsa-directory',
        component: DSADirectory,
        permission: PERMISSIONS.DSA_VIEW,
    },


    // =====================================================
    // Employee Management
    // =====================================================

    {
        path: '/employees',
        component: Employees,
        permission: PERMISSIONS.EMPLOYEES_VIEW,
    },

    {
        path: '/employee-attendance',
        component: EmployeeAttendance,
        permission: PERMISSIONS.EMPLOYEE_ATTENDANCE_VIEW,
    },

]


export default routes