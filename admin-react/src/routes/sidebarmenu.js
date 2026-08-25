// admin-react/src/routes/sidebarmenu.js
/** Icons are imported separately to reduce build time */

import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import DocumentPlusIcon from '@heroicons/react/24/outline/DocumentPlusIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ClipboardDocumentCheckIcon from '@heroicons/react/24/outline/ClipboardDocumentCheckIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import ArrowsRightLeftIcon from '@heroicons/react/24/outline/ArrowsRightLeftIcon'
import ArrowUturnLeftIcon from '@heroicons/react/24/outline/ArrowUturnLeftIcon'
import BuildingLibraryIcon from '@heroicons/react/24/outline/BuildingLibraryIcon'
import IdentificationIcon from '@heroicons/react/24/outline/IdentificationIcon'
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

import { PERMISSIONS } from '../app/permissions'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const sidebarmenu = [

  // =========================================================
  // MAIN
  // =========================================================

  {
    path: '/crm/dashboard',
    icon: <Squares2X2Icon className={iconClasses} />,
    name: 'Dashboard',
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },

  {
    path: '/crm/filter',
    icon: <FunnelIcon className={iconClasses} />,
    name: 'Application Filter',
    permission: PERMISSIONS.APPLICATION_FILTER_VIEW,
  },

  {
    path: '/crm/attendance',
    icon: <CalendarDaysIcon className={iconClasses} />,
    name: 'Attendance',
    permission: PERMISSIONS.ATTENDANCE_VIEW,
  },


  // =========================================================
  // TEAMS & ROLES
  // =========================================================

  {
    type: 'section',
    name: 'Teams & Roles',

    submenu: [

      {
        path: '/crm/roles',
        icon: <KeyIcon className={submenuIconClasses} />,
        name: 'Roles',
        parent: 'Teams & Roles',
        permission: PERMISSIONS.ROLES_VIEW,
      },

      {
        path: '/crm/team-leads',
        icon: <UsersIcon className={submenuIconClasses} />,
        name: 'Team Leads',
        parent: 'Teams & Roles',
        permission: PERMISSIONS.TEAM_LEADS_VIEW,
      },

      {
        path: '/crm/agents',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Agents',
        parent: 'Teams & Roles',
        permission: PERMISSIONS.AGENTS_VIEW,
      },

      {
        path: '/crm/admins',
        icon: <ShieldCheckIcon className={submenuIconClasses} />,
        name: 'Admins',
        parent: 'Teams & Roles',
        permission: PERMISSIONS.ADMINS_VIEW,
      },

    ]
  },


  // =========================================================
  // LOANS
  // =========================================================

  {
    type: 'section',
    name: 'Loans',

    submenu: [

      {
        path: '/crm/create-application',
        icon: <DocumentPlusIcon className={submenuIconClasses} />,
        name: 'Create Application',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_CREATE,
      },

      {
        path: '/crm/rm-applications',
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: 'RM Applications',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_RM_VIEW,
      },

      {
        path: '/crm/agent-applications',
        icon: <ClipboardDocumentCheckIcon className={submenuIconClasses} />,
        name: 'Agent Applications',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_AGENT_VIEW,
      },

      {
        path: '/crm/pending-applications',
        icon: <ClockIcon className={submenuIconClasses} />,
        name: 'Pending Applications',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_PENDING_VIEW,
      },

      {
        path: '/crm/shuffle-loans',
        icon: <ArrowsRightLeftIcon className={submenuIconClasses} />,
        name: 'Shuffle Loans',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_SHUFFLE,
      },

      {
        path: '/crm/reverted-applications',
        icon: <ArrowUturnLeftIcon className={submenuIconClasses} />,
        name: 'Reverted Applications',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_REVERTED_VIEW,
      },

      {
        path: '/crm/loan-assignment',
        icon: <DocumentDuplicateIcon className={submenuIconClasses} />,
        name: 'Loan Assignment',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_ASSIGN,
      },

      {
        path: '/crm/duplicate-approvals',
        icon: <DocumentDuplicateIcon className={submenuIconClasses} />,
        name: 'Duplicate Approvals',
        parent: 'Loans',
        permission: PERMISSIONS.LOANS_DUPLICATE_APPROVE,
      },

    ]
  },


  // =========================================================
  // BANK & DSA
  // =========================================================

  {
    type: 'section',
    name: 'Bank & DSA',

    submenu: [

      {
        path: '/crm/banks',
        icon: <BuildingLibraryIcon className={submenuIconClasses} />,
        name: 'Banks',
        parent: 'Bank & DSA',
        permission: PERMISSIONS.BANKS_VIEW,
      },

      {
        path: '/crm/bankers-directory',
        icon: <IdentificationIcon className={submenuIconClasses} />,
        name: 'Banker Directory',
        parent: 'Bank & DSA',
        permission: PERMISSIONS.BANKERS_VIEW,
      },

      {
        path: '/crm/dsa-directory',
        icon: <BriefcaseIcon className={submenuIconClasses} />,
        name: 'DSA Directory',
        parent: 'Bank & DSA',
        permission: PERMISSIONS.DSA_VIEW,
      },

    ]
  },


]

export default sidebarmenu
