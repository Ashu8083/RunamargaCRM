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
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon'
import BuildingLibraryIcon from '@heroicons/react/24/outline/BuildingLibraryIcon'
import IdentificationIcon from '@heroicons/react/24/outline/IdentificationIcon'
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

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
  },

  {
    path: '/crm/filter',
    icon: <FunnelIcon className={iconClasses} />,
    name: 'Application Filter',
  },

  {
    path: '/crm/attendance',
    icon: <CalendarDaysIcon className={iconClasses} />,
    name: 'Attendance',
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
      },

      {
        path: '/crm/team-leads',
        icon: <UsersIcon className={submenuIconClasses} />,
        name: 'Team Leads',
        parent: 'Teams & Roles',
      },

      {
        path: '/crm/agents',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Agents',
        parent: 'Teams & Roles',
      },

      {
        path: '/crm/admins',
        icon: <ShieldCheckIcon className={submenuIconClasses} />,
        name: 'Admins',
        parent: 'Teams & Roles',
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
      },

      {
        path: '/crm/rm-applications',
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: 'RM Applications',
        parent: 'Loans',
      },

      {
        path: '/crm/agent-applications',
        icon: <ClipboardDocumentCheckIcon className={submenuIconClasses} />,
        name: 'Agent Applications',
        parent: 'Loans',
      },

      {
        path: '/crm/pendingleads',
        icon: <ClockIcon className={submenuIconClasses} />,
        name: 'Pending Applications',
        parent: 'Loans',
      },

      {
        path: '/crm/shuffleapplications',
        icon: <ArrowsRightLeftIcon className={submenuIconClasses} />,
        name: 'Shuffle Applications',
        parent: 'Loans',
      },

      {
        path: '/crm/revertapplications',
        icon: <ArrowUturnLeftIcon className={submenuIconClasses} />,
        name: 'Reverted Applications',
        parent: 'Loans',
      },

      {
        path: '/crm/loan-auto-assign',
        icon: <DocumentDuplicateIcon className={submenuIconClasses} />,
        name: 'Loan Auto Assignment',
        parent: 'Loans',
      },

      {
        path: '/crm/duplicate-approval',
        icon: <DocumentDuplicateIcon className={submenuIconClasses} />,
        name: 'Approval Duplicate',
        parent: 'Loans',
      },

    ]
  },


  // =========================================================
  // CALL MANAGEMENT
  // =========================================================

  {
    type: 'section',
    name: 'Call Management',

    submenu: [

      {
        path: '/crm/calllogs',
        icon: <PhoneIcon className={submenuIconClasses} />,
        name: 'Call Logs',
        parent: 'Call Management',
      },

      {
        path: '/crm/callassignments',
        icon: <UserPlusIcon className={submenuIconClasses} />,
        name: 'Call Assignments',
        parent: 'Call Management',
      },

      {
        path: '/crm/call-analytics',
        icon: <ChartBarIcon className={submenuIconClasses} />,
        name: 'Call Analytics',
        parent: 'Call Management',
      },

    ]
  },


  // =========================================================
  // ANALYTICS MANAGEMENT
  // =========================================================

  {
    type: 'section',
    name: 'Analytics Management',

    submenu: [

      {
        path: '/crm/analytics',
        icon: <LightBulbIcon className={submenuIconClasses} />,
        name: 'Insights',
        parent: 'Analytics Management',
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
      },

      {
        path: '/crm/bankerdirectory',
        icon: <IdentificationIcon className={submenuIconClasses} />,
        name: 'Banker Directory',
        parent: 'Bank & DSA',
      },

      {
        path: '/crm/dsadetails',
        icon: <BriefcaseIcon className={submenuIconClasses} />,
        name: 'DSA Details',
        parent: 'Bank & DSA',
      },

    ]
  },


  // =========================================================
  // EMPLOYEES MANAGEMENT
  // =========================================================

  {
    type: 'section',
    name: 'Employees Management',

    submenu: [

      {
        path: '/crm/employees',
        icon: <UsersIcon className={submenuIconClasses} />,
        name: 'Employees',
        parent: 'Employees Management',
      },

      {
        path: '/crm/attendance-dashboard',
        icon: <CalendarDaysIcon className={submenuIconClasses} />,
        name: 'Attendance Dashboard',
        parent: 'Employees Management',
      },

    ]
  },

]

export default sidebarmenu