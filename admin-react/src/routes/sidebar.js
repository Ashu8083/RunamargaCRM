/** Icons are imported separately to reduce build time */

import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
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
import BuildingOffice2Icon from '@heroicons/react/24/outline/BuildingOffice2Icon'
import IdentificationIcon from '@heroicons/react/24/outline/IdentificationIcon'
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  // =========================================================
  // MAIN
  // =========================================================

  {
    path: '/app/dashboard',
    icon: <Squares2X2Icon className={iconClasses} />,
    name: 'Dashboard',
  },
  {
    path: '/app/filter',
    icon: <Squares2X2Icon className={iconClasses} />,
    name: 'Application Filter',
  },
  {
    path: '/app/attendance',
    icon: <CalendarDaysIcon className={iconClasses} />,
    name: 'Attendance',
  },

  {
    path: '/app/profile',
    icon: <UserIcon className={iconClasses} />,
    name: 'My Profile',
  },


  // =========================================================
  // TEAMS & ROLES
  // =========================================================

  {
    path: '',
    icon: <UserGroupIcon className={`${iconClasses} inline`} />,
    name: 'Teams & Roles',

    submenu: [

      {
        path: '/app/roles',
        icon: <ShieldCheckIcon className={submenuIconClasses} />,
        name: 'Roles',
      },

      {
        path: '/app/team-leads',
        icon: <UsersIcon className={submenuIconClasses} />,
        name: 'Team Leads',
      },

      {
        path: '/app/agents',
        icon: <UserIcon className={submenuIconClasses} />,
        name: 'Agents',
      },

    ]
  },


  // =========================================================
  // LOAN APPLICATIONS
  // =========================================================

  {
    path: '',
    icon: <DocumentTextIcon className={`${iconClasses} inline`} />,
    name: 'Loan Applications',

    submenu: [

      {
        path: '/app/createapplication',
        icon: <DocumentPlusIcon className={submenuIconClasses} />,
        name: 'Create Application',
      },

      {
        path: '/app/myleads',
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: 'Originated Applications',
      },

      {
        path: '/app/assignedleads',
        icon: <ClipboardDocumentCheckIcon className={submenuIconClasses} />,
        name: 'Supervised Applications',
      },

      {
        path: '/app/pendingleads',
        icon: <ClockIcon className={submenuIconClasses} />,
        name: 'Pending Applications',
      },

      {
        path: '/app/shuffleapplications',
        icon: <ArrowsRightLeftIcon className={submenuIconClasses} />,
        name: 'Shuffle Applications',
      },

      {
        path: '/app/revertapplications',
        icon: <ArrowUturnLeftIcon className={submenuIconClasses} />,
        name: 'Reverted Applications',
      },

    ]
  },


  // =========================================================
  // CALL MANAGEMENT
  // =========================================================

  {
    path: '',
    icon: <PhoneIcon className={`${iconClasses} inline`} />,
    name: 'Call Management',

    submenu: [

      {
        path: '/app/calllogs',
        icon: <PhoneIcon className={submenuIconClasses} />,
        name: 'Call Logs',
      },

      {
        path: '/app/callassignments',
        icon: <UserPlusIcon className={submenuIconClasses} />,
        name: 'Call Assignments',
      },

      {
        path: '/app/call-analytics',
        icon: <ChartBarIcon className={submenuIconClasses} />,
        name: 'Call Analytics',
      },

    ]
  },


  // =========================================================
  // ANALYTICS MANAGEMENT
  // =========================================================

  {
    path: '',
    icon: <ChartBarIcon className={`${iconClasses} inline`} />,
    name: 'Analytics Management',

    submenu: [

      {
        path: '/app/analytics',
        icon: <LightBulbIcon className={submenuIconClasses} />,
        name: 'Insights',
      },

    ]
  },


  // =========================================================
  // BANKS & BANKERS DIRECTORY
  // =========================================================

  {
    path: '',
    icon: <BuildingLibraryIcon className={`${iconClasses} inline`} />,
    name: 'Banks & Bankers Directory',

    submenu: [

      {
        path: '/app/banks',
        icon: <BuildingLibraryIcon className={submenuIconClasses} />,
        name: 'Banks',
      },

      {
        path: '/app/bankerdirectory',
        icon: <IdentificationIcon className={submenuIconClasses} />,
        name: 'Banker Directory',
      },

      {
        path: '/app/dsadetails',
        icon: <BriefcaseIcon className={submenuIconClasses} />,
        name: 'DSA Details',
      },

    ]
  },


  // =========================================================
  // EMPLOYEES & ATTENDANCE MANAGEMENT
  // =========================================================

  {
    path: '',
    icon: <UsersIcon className={`${iconClasses} inline`} />,
    name: 'Employees & Attendance Management',

    submenu: [

      {
        path: '/app/employees',
        icon: <UsersIcon className={submenuIconClasses} />,
        name: 'Employees',
      },

      {
        path: '/app/attendance-dashboard',
        icon: <CalendarDaysIcon className={submenuIconClasses} />,
        name: 'Attendance Dashboard',
      },

    ]
  },

]

export default routes