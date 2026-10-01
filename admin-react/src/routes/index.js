// admin-react/src/routes/index.js

// All components mapping with path for internal routes

import { lazy } from 'react'

import { PERMISSIONS } from '../app/permissions'


// =========================================================
// MAIN
// =========================================================

const Dashboard = lazy(() =>
    import('../pages/crm/Dashboard/index')
)

const ApplicationFilter = lazy(() =>
    import('../pages/crm/Applicationfilter/index')
)

const Attendance = lazy(() =>
    import('../pages/crm/Attendance/index')
)

const Profile = lazy(() =>
    import('../pages/crm/Profile')
)


// =========================================================
// TEAMS & ROLES
// =========================================================

const Roles = lazy(() =>
    import('../pages/crm/Roles&Teams/Roles/index')
)

const TeamLead = lazy(() =>
    import('../pages/crm/Roles&Teams/TeamLead/index')
)

const Agents = lazy(() =>
    import('../pages/crm/Roles&Teams/Agents/index')
)

const Admins = lazy(() =>
    import('../pages/crm/Roles&Teams/Admins/index')
)


// =========================================================
// LOANS
// =========================================================

const CreateApplication = lazy(
    () => import('../pages/crm/Loans/CreateApplication/index')
)
const Applications = lazy(() =>
    import('../pages/crm/Loans/CombinedApplications/index')
)
const ApplicationStatus = lazy(() =>
    import('../pages/crm/Loans/Application-Status/index')
)

const PendingApplications = lazy(() =>
    import('../pages/crm/Loans/PendingApplications/index')
)

const ShuffleLoans = lazy(() =>
    import('../pages/crm/Loans/ShuffleLoans/index')
)

const RevertedApplications = lazy(() =>
    import('../pages/crm/Loans/RevertedApplications/index')
)

const LoanAssignment = lazy(() =>
    import('../pages/crm/Loans/LoanAssignment/index')
)

const DuplicateApproval = lazy(() =>
    import('../pages/crm/Loans/DuplicateApproval/index')
)

const ViewApplication = lazy(
    () => import('../pages/crm/Loans/ViewApplication/index')
)


// =========================================================
// Call Management
// =========================================================

const CallLogs = lazy(
    () => import('../pages/crm/CallManagement/CallLogs')
)

const CallAssignment = lazy(
    () => import('../pages/crm/CallManagement/CallAssignment')
)

const PhoneNumbers = lazy(
    () => import('../pages/crm/CallManagement/PhoneNumbers')
)

// =========================================================
// Call Analytics
// =========================================================


// ******************** Call Analytics *****************************
const CallAnalyticsOverview = lazy(
    () => import('../pages/crm/Analytics/CallAnalytics/Overview')
)

const CallPerformance = lazy(
    () => import('../pages/crm/Analytics/CallAnalytics/Performance')
)

const CallTrends = lazy(
    () => import('../pages/crm/Analytics/CallAnalytics/Trends')
)


// ******************** Agent Analytics *****************************
const AgentAnalyticsOverview = lazy(
    () => import('../pages/crm/Analytics/AgentAnalytics/Overview')
)
const AgentAnalyticsPerformance = lazy(
    () => import('../pages/crm/Analytics/AgentAnalytics/Performance')
)
const AgentAnalyticsTrends = lazy(
    () => import('../pages/crm/Analytics/AgentAnalytics/Trends')
)

// =========================================================
// Banks & DSA
// =========================================================

const Banks = lazy(
    () => import('../pages/crm/Banks&DSA/Banks/index')
)

const BankersDirectory = lazy(
    () => import('../pages/crm/Banks&DSA/BankersDirectory/index')
)

const DSADirectory = lazy(
    () => import('../pages/crm/Banks&DSA/DSADirectory/index')
)


// =========================================================
// Employee Management
// =========================================================

const Employees = lazy(
    () => import('../pages/crm/EmployeeManagement/Employees')
)

const EmployeeAttendance = lazy(
    () => import('../pages/crm/EmployeeManagement/Attendance/index')
)

// =========================================================
// Face Enrollment
// =========================================================
const FaceEnrollment = lazy(
    () => import('../pages/crm/EmployeeManagement/FaceEnrollment/index')
)


// =========================================================
// Logs
// =========================================================

const AdminLogs = lazy(
    () => import('../pages/crm/Logs/AdminLogs')
)
const ApplicationStatusLogs = lazy(
    () => import('../pages/crm/Logs/ApplicationStatusLogs')
)
const AgentAssignmentLogs = lazy(
    () => import('../pages/crm/Logs/AgentAssignmentLogs')
)
const LeadCreationLogs = lazy(
    () => import('../pages/crm/Logs/LeadCreationLogs')
)
const LoanTypeChangeLogs = lazy(
    () => import('../pages/crm/Logs/LoanTypeChangeLogs')
)
const ApplicationDeleteLogs = lazy(
    () => import('../pages/crm/Logs/ApplicationDeleteLogs')
)
const ApplicationEditLogs = lazy(
    () => import('../pages/crm/Logs/ApplicationEditLogs')
)
const BankProcessingLogs = lazy(
    () => import('../pages/crm/Logs/BankProcessingLogs')
)
const LoanAssignmentLogs = lazy(
    () => import('../pages/crm/Logs/LoanAssignmentLogs')
)
const DuplicateLeadLogs = lazy(
    () => import('../pages/crm/Logs/DuplicateLeadLogs')
)
const CallAssignmentLogs = lazy(
    () => import('../pages/crm/Logs/CallAssignmentLogs')
)
const CallReassignmentLogs = lazy(
    () => import('../pages/crm/Logs/CallReassignmentLogs')
)
const EmployeeLogs = lazy(
    () => import('../pages/crm/Logs/EmployeeLogs')
)
const PhoneNumberLogs = lazy(
    () => import('../pages/crm/Logs/PhoneNumberLogs')
)
const LoanShuffleLogs = lazy(
    () => import('../pages/crm/Logs/LoanShuffleLogs')
)
const RevertedHistoryLogs = lazy(
    () => import('../pages/crm/Logs/RevertedHistoryLogs')
)
const AgentLogs = lazy(
    () => import('../pages/crm/Logs/AgentLogs')
)
const TeamLeadLogs = lazy(
    () => import('../pages/crm/Logs/TeamLeadLogs')
)
const RoleLogs = lazy(
    () => import('../pages/crm/Logs/RoleLogs')
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
        path: '/view-application/:uniqueId',
        component: ViewApplication,
        permission: PERMISSIONS.LOANS_VIEW,
    },
    {
        path: '/applications',
        component: Applications,
        permission: PERMISSIONS.LOANS_VIEW,
    },
    {
        path: '/application-status',
        component: ApplicationStatus,
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
    {
        path: '/phone-numbers',
        component: PhoneNumbers,
        permission: PERMISSIONS.PHONE_NUMBERS_VIEW,
    },


    // =====================================================
    // Call Analytics
    // =====================================================

    {
        path: '/call-analytics/call-overview',
        component: CallAnalyticsOverview,
        permission: PERMISSIONS.CALL_ANALYTICS_OVERVIEW_VIEW,
    },

    {
        path: '/call-analytics/call-performance',
        component: CallPerformance,
        permission: PERMISSIONS.CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW,
    },

    {
        path: '/call-analytics/call-trends',
        component: CallTrends,
        permission: PERMISSIONS.CALL_ANALYTICS_CALL_TRENDS_VIEW,
    },


    // =====================================================
    // Agent Analytics
    // =====================================================
    {
        path: '/agent-analytics/agent-overview',
        component: AgentAnalyticsOverview,
        permission: PERMISSIONS.AGENT_ANALYTICS_OVERVIEW_VIEW,
    },
    {
        path: '/agent-analytics/agent-performance',
        component: AgentAnalyticsPerformance,
        permission: PERMISSIONS.AGENT_Performance_OVERVIEW_VIEW,
    },
    {
        path: '/agent-analytics/agent-trends',
        component: AgentAnalyticsTrends,
        permission: PERMISSIONS.AGENT_Performance_OVERVIEW_VIEW,
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

    // =====================================================
    // Face Enrollment
    // =====================================================
    {
        path: '/face-enrollment',
        component: FaceEnrollment,
        permission: PERMISSIONS.FACE_ENROLLMENT_VIEW,
    },


    // =====================================================
    // Logs
    // =====================================================

    {
        path: '/admin-logs',
        component: AdminLogs,
        permission: PERMISSIONS.ADMINS_VIEW_VIEW,
    },
    {
        path: '/application-status-logs',
        component: ApplicationStatusLogs,
        permission: PERMISSIONS.APPLICATION_STATUS_LOGS_VIEW,
    },
    {
        path: '/agent-assignment-logs',
        component: AgentAssignmentLogs,
        permission: PERMISSIONS.AGENT_ASSIGNMENT_LOGS_VIEW,
    },
    {
        path: '/lead-creation-logs',
        component: LeadCreationLogs,
        permission: PERMISSIONS.LEAD_CREATION_LOGS_VIEW,
    },
    {
        path: '/loan-type-change-logs',
        component: LoanTypeChangeLogs,
        permission: PERMISSIONS.LOAN_TYPE_CHANGE_LOGS_VIEW,
    },
    {
        path: '/application-delete-logs',
        component: ApplicationDeleteLogs,
        permission: PERMISSIONS.APPLICATION_DELETE_LOGS_VIEW,
    },
    {
        path: '/application-edit-logs',
        component: ApplicationEditLogs,
        permission: PERMISSIONS.APPLICATION_EDIT_LOGS_VIEW,
    },
    {
        path: '/bank-processing-logs',
        component: BankProcessingLogs,
        permission: PERMISSIONS.BANK_PROCESSING_LOGS_VIEW,
    },
    {
        path: '/loan-assignment-logs',
        component: LoanAssignmentLogs,
        permission: PERMISSIONS.LOAN_ASSIGNMENT_LOGS_VIEW,
    },
    {
        path: '/duplicate-lead-logs',
        component: DuplicateLeadLogs,
        permission: PERMISSIONS.DUPLICATE_LEAD_LOGS_VIEW,
    },
    {
        path: '/call-assignment-logs',
        component: CallAssignmentLogs,
        permission: PERMISSIONS.CALL_ASSIGNMENT_LOGS_VIEW,
    },
    {
        path: '/call-reassignment-logs',
        component: CallReassignmentLogs,
        permission: PERMISSIONS.CALL_REASSIGNMENT_LOGS_VIEW,
    },
    {
        path: '/employee-logs',
        component: EmployeeLogs,
        permission: PERMISSIONS.EMPLOYEE_LOGS_VIEW,
    },
    {
        path: '/phone-number-logs',
        component: PhoneNumberLogs,
        permission: PERMISSIONS.PHONE_NUMBER_LOGS_VIEW,
    },
    {
        path: '/loan-shuffle-logs',
        component: LoanShuffleLogs,
        permission: PERMISSIONS.LOAN_SHUFFLE_LOGS_VIEW,
    },
    {
        path: '/reverted-history-logs',
        component: RevertedHistoryLogs,
        permission: PERMISSIONS.REVERTED_HISTORY_LOGS_VIEW,
    },
    {
        path: '/agent-logs',
        component: AgentLogs,
        permission: PERMISSIONS.AGENT_LOGS_VIEW,
    },
    {
        path: '/team-lead-logs',
        component: TeamLeadLogs,
        permission: PERMISSIONS.TEAM_LEAD_LOGS_VIEW,
    },
    {
        path: '/role-logs',
        component: RoleLogs,
        permission: PERMISSIONS.ROLE_LOGS_VIEW,
    }


]


export default routes