// admin-react/src/routes/index.js

// All components mapping with path for internal routes

import { lazy } from 'react'


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


// =========================================================
// OTHER PAGES
// =========================================================

const Welcome = lazy(() =>
    import('../pages/protected/Welcome')
)

const Page404 = lazy(() =>
    import('../pages/protected/404')
)

const Blank = lazy(() =>
    import('../pages/protected/Blank')
)

const Charts = lazy(() =>
    import('../pages/protected/Charts')
)

const Leads = lazy(() =>
    import('../pages/protected/Leads')
)

const Integration = lazy(() =>
    import('../pages/protected/Integration')
)

const Calendar = lazy(() =>
    import('../pages/protected/Calendar')
)

const Team = lazy(() =>
    import('../pages/protected/Team')
)

const Transactions = lazy(() =>
    import('../pages/protected/Transactions')
)

const Bills = lazy(() =>
    import('../pages/protected/Bills')
)

const ProfileSettings = lazy(() =>
    import('../pages/protected/ProfileSettings')
)

const GettingStarted = lazy(() =>
    import('../pages/GettingStarted')
)

const DocFeatures = lazy(() =>
    import('../pages/DocFeatures')
)

const DocComponents = lazy(() =>
    import('../pages/DocComponents')
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
    },

    {
        path: '/filter',
        component: ApplicationFilter,
    },

    {
        path: '/attendance',
        component: Attendance,
    },


    // =====================================================
    // TEAMS & ROLES
    // =====================================================

    {
        path: '/roles',
        component: Roles,
    },

    {
        path: '/team-leads',
        component: TeamLead,
    },

    {
        path: '/agents',
        component: Agents,
    },

    {
        path: '/admins',
        component: Admins,
    },


    // =====================================================
    // LOANS
    // =====================================================

    {
        path: '/create-application',
        component: CreateApplication,
    },

    {
        path: '/rm-applications',
        component: RMApplications,
    },

    {
        path: '/agent-applications',
        component: AgentApplications,
    },
    {
        path: '/pending-applications',
        component: PendingApplications,
    },
    {
        path: '/shuffle-loans',
        component: ShuffleLoans,
    },


    // =====================================================
    // OTHER
    // =====================================================

    {
        path: '/features',
        component: DocFeatures,
    },

    {
        path: '/components',
        component: DocComponents,
    },

    {
        path: '/integration',
        component: Integration,
    },

    {
        path: '/charts',
        component: Charts,
    },

    {
        path: '/404',
        component: Page404,
    },

    {
        path: '/blank',
        component: Blank,
    },

]


export default routes