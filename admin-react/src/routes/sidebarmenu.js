// admin-react/src/routes/sidebarmenu.js
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";

import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import ShieldCheckIcon from "@heroicons/react/24/outline/ShieldCheckIcon";

import KeyIcon from "@heroicons/react/24/outline/KeyIcon";

import DocumentPlusIcon from "@heroicons/react/24/outline/DocumentPlusIcon";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";

import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import ArrowsRightLeftIcon from "@heroicons/react/24/outline/ArrowsRightLeftIcon";
import ArrowUturnLeftIcon from "@heroicons/react/24/outline/ArrowUturnLeftIcon";

import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";

import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";

import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import DevicePhoneMobileIcon from "@heroicons/react/24/outline/DevicePhoneMobileIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/outline/ArrowUpOnSquareIcon";

import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import ArrowTrendingUpIcon from "@heroicons/react/24/outline/ArrowTrendingUpIcon";

/*
 * Log-specific icons
 *
 * Keeping these separate makes the Logs section easier to maintain
 * and makes the icon intent immediately obvious.
 */
import ShieldExclamationIcon from "@heroicons/react/24/outline/ShieldExclamationIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import BanknotesIcon from "@heroicons/react/24/outline/BanknotesIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import DocumentCheckIcon from "@heroicons/react/24/outline/DocumentCheckIcon";
import PhoneArrowUpRightIcon from "@heroicons/react/24/outline/PhoneArrowUpRightIcon";
import PhoneArrowDownLeftIcon from "@heroicons/react/24/outline/PhoneArrowDownLeftIcon";
import BuildingOffice2Icon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import RectangleStackIcon from "@heroicons/react/24/outline/RectangleStackIcon";
import ArrowPathRoundedSquareIcon from "@heroicons/react/24/outline/ArrowPathRoundedSquareIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";
import TagIcon from "@heroicons/react/24/outline/TagIcon";

import { PERMISSIONS } from "../app/permissions";

/* =========================================================
 * ICON SIZES
 * ========================================================= */

const iconClasses = "h-6 w-6";
const submenuIconClasses = "h-5 w-5";

/* =========================================================
 * SIDEBAR MENU
 * ========================================================= */

const sidebarmenu = [
  /* =======================================================
   * MAIN
   * ======================================================= */

  {
    path: "/crm/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },

  {
    path: "/crm/filter",
    icon: <FunnelIcon className={iconClasses} />,
    name: "Application Filter",
    permission: PERMISSIONS.APPLICATION_FILTER_VIEW,
  },

  {
    path: "/crm/attendance",
    icon: <CalendarDaysIcon className={iconClasses} />,
    name: "Attendance",
    permission: PERMISSIONS.ATTENDANCE_VIEW,
  },

  {
    path: "/crm/profile",
    icon: <UserCircleIcon className={iconClasses} />,
    name: "Profile",
    permission: PERMISSIONS.PROFILE_VIEW,
  },

  /* =======================================================
   * TEAMS & ROLES
   * ======================================================= */

  {
    type: "section",
    name: "Teams & Roles",

    submenu: [
      {
        path: "/crm/roles",
        icon: <KeyIcon className={submenuIconClasses} />,
        name: "Roles",
        parent: "Teams & Roles",
        permission: PERMISSIONS.ROLES_VIEW,
      },

      {
        path: "/crm/team-leads",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Team Leads",
        parent: "Teams & Roles",
        permission: PERMISSIONS.TEAM_LEADS_VIEW,
      },

      {
        path: "/crm/agents",
        icon: <UserIcon className={submenuIconClasses} />,
        name: "Agents",
        parent: "Teams & Roles",
        permission: PERMISSIONS.AGENTS_VIEW,
      },

      {
        path: "/crm/admins",
        icon: <ShieldCheckIcon className={submenuIconClasses} />,
        name: "Admins",
        parent: "Teams & Roles",
        permission: PERMISSIONS.ADMINS_VIEW,
      },
    ],
  },

  /* =======================================================
   * LOANS
   * ======================================================= */

  {
    type: "section",
    name: "Loans",

    submenu: [
      {
        path: "/crm/create-application",
        icon: <DocumentPlusIcon className={submenuIconClasses} />,
        name: "Create Application",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_CREATE,
      },

      {
        path: "/crm/applications",
        icon: <DocumentTextIcon className={submenuIconClasses} />,
        name: "Loan Applications",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_VIEW,
      },
      // {
      //   path: "/crm/rm-applications",
      //   icon: <DocumentTextIcon className={submenuIconClasses} />,
      //   name: "RM Applications",
      //   parent: "Loans",
      //   permission: PERMISSIONS.LOANS_RM_VIEW,
      // },

      // {
      //   path: "/crm/agent-applications",
      //   icon: <ClipboardDocumentCheckIcon className={submenuIconClasses} />,
      //   name: "Agent Applications",
      //   parent: "Loans",
      //   permission: PERMISSIONS.LOANS_AGENT_VIEW,
      // },

      {
        path: "/crm/pending-applications",
        icon: <ClockIcon className={submenuIconClasses} />,
        name: "Pending Applications",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_PENDING_VIEW,
      },

      {
        path: "/crm/shuffle-loans",
        icon: <ArrowsRightLeftIcon className={submenuIconClasses} />,
        name: "Shuffle Loans",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_SHUFFLE,
      },

      {
        path: "/crm/reverted-applications",
        icon: <ArrowUturnLeftIcon className={submenuIconClasses} />,
        name: "Reverted Applications",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_REVERTED_VIEW,
      },

      {
        path: "/crm/loan-assignment",
        icon: <DocumentDuplicateIcon className={submenuIconClasses} />,
        name: "Loan Assignment",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_ASSIGN,
      },

      {
        path: "/crm/duplicate-approvals",
        icon: <DocumentCheckIcon className={submenuIconClasses} />,
        name: "Duplicate Approvals",
        parent: "Loans",
        permission: PERMISSIONS.LOANS_DUPLICATE_APPROVE,
      },
    ],
  },

  /* =======================================================
   * CALL MANAGEMENT
   * ======================================================= */

  {
    type: "section",
    name: "Call Management",

    submenu: [
      {
        path: "/crm/call-logs",
        icon: <PhoneIcon className={submenuIconClasses} />,
        name: "Call Logs",
        parent: "Call Management",
        permission: PERMISSIONS.CALL_LOGS_VIEW,
      },

      {
        path: "/crm/call-assignment",
        icon: <ArrowUpOnSquareIcon className={submenuIconClasses} />,
        name: "Call Assignment",
        parent: "Call Management",
        permission: PERMISSIONS.CALL_ASSIGNMENT_VIEW,
      },

      {
        path: "/crm/phone-numbers",
        icon: <DevicePhoneMobileIcon className={submenuIconClasses} />,
        name: "Phone Numbers",
        parent: "Call Management",
        permission: PERMISSIONS.PHONE_NUMBERS_VIEW,
      },
    ],
  },

  /* =======================================================
   * ANALYTICS
   * ======================================================= */

  {
    type: "section",
    name: "Analytics",

    submenu: [
      /* -----------------------------------------------------
       * CALL ANALYTICS
       * ----------------------------------------------------- */

      {
        type: "submenu",
        name: "Call Analytics",
        parent: "Analytics",
        icon: <ChartBarIcon className={submenuIconClasses} />,

        submenu: [
          {
            path: "/crm/call-analytics/call-overview",
            icon: <ChartBarIcon className={submenuIconClasses} />,
            name: "Call Overview",
            parent: "Call Analytics",
            permission: PERMISSIONS.CALL_ANALYTICS_OVERVIEW_VIEW,
          },

          {
            path: "/crm/call-analytics/call-performance",
            icon: <UserGroupIcon className={submenuIconClasses} />,
            name: "Call Performance",
            parent: "Call Analytics",
            permission: PERMISSIONS.CALL_ANALYTICS_AGENT_PERFORMANCE_VIEW,
          },

          {
            path: "/crm/call-analytics/call-trends",
            icon: <ArrowTrendingUpIcon className={submenuIconClasses} />,
            name: "Call Trends",
            parent: "Call Analytics",
            permission: PERMISSIONS.CALL_ANALYTICS_CALL_TRENDS_VIEW,
          },
        ],
      },

      /* -----------------------------------------------------
       * AGENT ANALYTICS
       * ----------------------------------------------------- */

      {
        type: "submenu",
        name: "Agent Analytics",
        parent: "Analytics",
        icon: <UserGroupIcon className={submenuIconClasses} />,

        submenu: [
          {
            path: "/crm/agent-analytics/agent-overview",
            icon: <ChartBarIcon className={submenuIconClasses} />,
            name: "Agent Overview",
            parent: "Agent Analytics",
            permission: PERMISSIONS.AGENT_ANALYTICS_OVERVIEW_VIEW,
          },

          {
            path: "/crm/agent-analytics/agent-performance",
            icon: <UserGroupIcon className={submenuIconClasses} />,
            name: "Agent Performance",
            parent: "Agent Analytics",
            permission: PERMISSIONS.AGENT_Performance_OVERVIEW_VIEW,
          },

          {
            path: "/crm/agent-analytics/agent-trends",
            icon: <ArrowTrendingUpIcon className={submenuIconClasses} />,
            name: "Agent Trends",
            parent: "Agent Analytics",
            permission: PERMISSIONS.CALL_ANALYTICS_CALL_TRENDS_VIEW,
          },
        ],
      },
    ],
  },

  /* =======================================================
   * BANK & DSA
   * ======================================================= */

  {
    type: "section",
    name: "Bank & DSA",

    submenu: [
      {
        path: "/crm/banks",
        icon: <BuildingLibraryIcon className={submenuIconClasses} />,
        name: "Banks",
        parent: "Bank & DSA",
        permission: PERMISSIONS.BANKS_VIEW,
      },

      {
        path: "/crm/bankers-directory",
        icon: <IdentificationIcon className={submenuIconClasses} />,
        name: "Banker Directory",
        parent: "Bank & DSA",
        permission: PERMISSIONS.BANKERS_VIEW,
      },

      {
        path: "/crm/dsa-directory",
        icon: <BriefcaseIcon className={submenuIconClasses} />,
        name: "DSA Directory",
        parent: "Bank & DSA",
        permission: PERMISSIONS.DSA_VIEW,
      },
    ],
  },

  /* =======================================================
   * EMPLOYEE MANAGEMENT
   * ======================================================= */

  {
    type: "section",
    name: "Employee Management",

    submenu: [
      {
        path: "/crm/employees",
        icon: <UserCircleIcon className={submenuIconClasses} />,
        name: "Employees",
        parent: "Employee Management",
        permission: PERMISSIONS.EMPLOYEES_VIEW,
      },

      {
        path: "/crm/employee-attendance",
        icon: <CalendarIcon className={submenuIconClasses} />,
        name: "Employee Attendance",
        parent: "Employee Management",
        permission: PERMISSIONS.EMPLOYEE_ATTENDANCE_VIEW,
      },

       {
        path: "/crm/face-enrollment",
        icon: <CalendarIcon className={submenuIconClasses} />,
        name: "Face Enrollment",
        parent: "Employee Management",
        permission: PERMISSIONS.FACE_ENROLLMENT_VIEW,
      },
    ],
  },

  /* =======================================================
   * LOGS
   *
   * Each log has its own contextual icon:
   * - Admin actions       → Shield
   * - Status changes      → Arrow path
   * - Assignments         → User/group
   * - Creation            → User plus
   * - Editing             → Pencil
   * - Deletion            → Trash
   * - Bank processing     → Banknotes
   * - Calls               → Phone arrows
   * - Employees           → Building/person
   * - Phone numbers       → Mobile
   * - Shuffle/revert      → Rotation/history
   * ======================================================= */
  // =========================================================
  // LOGS
  // =========================================================

  {
    type: "section",
    name: "Logs",

    submenu: [
      /* -----------------------------------------------------
       * ADMIN & ACCESS
       * ----------------------------------------------------- */

      {
        path: "/crm/admin-logs",
        icon: <ShieldExclamationIcon className={submenuIconClasses} />,
        name: "Admin Logs",
        parent: "Logs",
        permission: PERMISSIONS.ADMIN_LOGS_VIEW,
      },

      // {
      //   path: "/crm/role-logs",
      //   icon: <KeyIcon className={submenuIconClasses} />,
      //   name: "Role Logs",
      //   parent: "Logs",
      //   permission: PERMISSIONS.ROLE_LOGS_VIEW,
      // },
      /* -----------------------------------------------------
       * EMPLOYEE & USER MANAGEMENT
       * ----------------------------------------------------- */

      {
        path: "/crm/employee-logs",
        icon: <BuildingOffice2Icon className={submenuIconClasses} />,
        name: "Employee Logs",
        parent: "Logs",
        permission: PERMISSIONS.EMPLOYEE_LOGS_VIEW,
      },

      {
        path: "/crm/agent-logs",
        icon: <UserIcon className={submenuIconClasses} />,
        name: "Agent Logs",
        parent: "Logs",
        permission: PERMISSIONS.AGENT_LOGS_VIEW,
      },

      {
        path: "/crm/team-lead-logs",
        icon: <UsersIcon className={submenuIconClasses} />,
        name: "Team Lead Logs",
        parent: "Logs",
        permission: PERMISSIONS.TEAM_LEAD_LOGS_VIEW,
      },
      /* -----------------------------------------------------
       * AGENT & TEAM ASSIGNMENT
       * ----------------------------------------------------- */

      {
        path: "/crm/agent-assignment-logs",
        icon: <UserGroupIcon className={submenuIconClasses} />,
        name: "Agent Assignment Logs",
        parent: "Logs",
        permission: PERMISSIONS.AGENT_ASSIGNMENT_LOGS_VIEW,
      },

      /* -----------------------------------------------------
       * APPLICATION & LEADS
       * ----------------------------------------------------- */

      {
        path: "/crm/lead-creation-logs",
        icon: <UserPlusIcon className={submenuIconClasses} />,
        name: "Lead Creation Logs",
        parent: "Logs",
        permission: PERMISSIONS.LEAD_CREATION_LOGS_VIEW,
      },

      {
        path: "/crm/application-status-logs",
        icon: <ArrowPathIcon className={submenuIconClasses} />,
        name: "Application Status Logs",
        parent: "Logs",
        permission: PERMISSIONS.APPLICATION_STATUS_LOGS_VIEW,
      },

      {
        path: "/crm/application-edit-logs",
        icon: <PencilSquareIcon className={submenuIconClasses} />,
        name: "Application Edit Logs",
        parent: "Logs",
        permission: PERMISSIONS.APPLICATION_EDIT_LOGS_VIEW,
      },

      {
        path: "/crm/application-delete-logs",
        icon: <TrashIcon className={submenuIconClasses} />,
        name: "Application Delete Logs",
        parent: "Logs",
        permission: PERMISSIONS.APPLICATION_DELETE_LOGS_VIEW,
      },

      {
        path: "/crm/loan-type-change-logs",
        icon: <TagIcon className={submenuIconClasses} />,
        name: "Loan Type Change Logs",
        parent: "Logs",
        permission: PERMISSIONS.LOAN_TYPE_CHANGE_LOGS_VIEW,
      },

      {
        path: "/crm/duplicate-lead-logs",
        icon: <DocumentDuplicateIcon className={submenuIconClasses} />,
        name: "Duplicate Lead Logs",
        parent: "Logs",
        permission: PERMISSIONS.DUPLICATE_LEAD_LOGS_VIEW,
      },

      /* -----------------------------------------------------
       * LOAN PROCESSING
       * ----------------------------------------------------- */

      {
        path: "/crm/bank-processing-logs",
        icon: <BanknotesIcon className={submenuIconClasses} />,
        name: "Bank Processing Logs",
        parent: "Logs",
        permission: PERMISSIONS.BANK_PROCESSING_LOGS_VIEW,
      },

      {
        path: "/crm/loan-assignment-logs",
        icon: <ClipboardDocumentListIcon className={submenuIconClasses} />,
        name: "Loan Assignment Logs",
        parent: "Logs",
        permission: PERMISSIONS.LOAN_ASSIGNMENT_LOGS_VIEW,
      },

      {
        path: "/crm/loan-shuffle-logs",
        icon: <ArrowsRightLeftIcon className={submenuIconClasses} />,
        name: "Loan Shuffle Logs",
        parent: "Logs",
        permission: PERMISSIONS.LOAN_SHUFFLE_LOGS_VIEW,
      },

      {
        path: "/crm/reverted-history-logs",
        icon: <ArrowUturnLeftIcon className={submenuIconClasses} />,
        name: "Reverted History Logs",
        parent: "Logs",
        permission: PERMISSIONS.REVERTED_HISTORY_LOGS_VIEW,
      },

      /* -----------------------------------------------------
       * CALL MANAGEMENT
       * ----------------------------------------------------- */

      {
        path: "/crm/call-assignment-logs",
        icon: <PhoneArrowUpRightIcon className={submenuIconClasses} />,
        name: "Call Assignment Logs",
        parent: "Logs",
        permission: PERMISSIONS.CALL_ASSIGNMENT_LOGS_VIEW,
      },

      {
        path: "/crm/call-reassignment-logs",
        icon: <PhoneArrowDownLeftIcon className={submenuIconClasses} />,
        name: "Call Reassignment Logs",
        parent: "Logs",
        permission: PERMISSIONS.CALL_REASSIGNMENT_LOGS_VIEW,
      },

      /* -----------------------------------------------------
       * PHONE / CONTACT
       * ----------------------------------------------------- */

      {
        path: "/crm/phone-number-logs",
        icon: <DevicePhoneMobileIcon className={submenuIconClasses} />,
        name: "Phone Number Logs",
        parent: "Logs",
        permission: PERMISSIONS.PHONE_NUMBER_LOGS_VIEW,
      },
    ],
  },
];

export default sidebarmenu;
