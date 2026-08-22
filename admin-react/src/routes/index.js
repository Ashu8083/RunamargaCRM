// All components mapping with path for internal routes

import { lazy } from 'react'
import TeamLead from '../pages/Role-management/TeamLead'
import Agents from '../pages/Role-management/Agents.'
import Admins from '../pages/Role-management/Admins'

const Dashboard = lazy(() => import('../pages/Dashboard/index'))
const ApplicationFilter = lazy(() => import('../pages/Applicationfilter/index'))
const Attendance = lazy(() => import('../pages/Attendance/index'))
const Roles = lazy(() => import('../pages/Role-management/Roles'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/filter', // the url
    component: ApplicationFilter, // view rendered
  },
  {
    path: '/attendance',
    component: Attendance,
  },
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
