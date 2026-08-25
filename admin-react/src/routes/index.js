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
        path: '/rm-applications',
        component: RMApplications,
        permission: PERMISSIONS.LOANS_RM_VIEW,
    },

    {
        path: '/agent-applications',
        component: AgentApplications,
        permission: PERMISSIONS.LOANS_AGENT_VIEW,
    },
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


]


export default routes
