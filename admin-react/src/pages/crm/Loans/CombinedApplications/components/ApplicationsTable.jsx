// admin-react/src/pages/crm/Loans/CombinedApplications/components/ApplicationsTable.jsx

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import AgentDropdown from "../../../../../components/GlobalModels/Filters/AgentDropdown";
import RmDropdown from "../../../../../components/GlobalModels/Filters/RmDropdown";
import TeamLeadDropdown from "../../../../../components/GlobalModels/Filters/TeamLeadDropdown";
import LoanTypeDropdown from "../../../../../components/GlobalModels/Filters/LoanTypeDropdown";
import StatusDropdown from "../../../../../components/GlobalModels/Filters/StatusDropdown";
import apiClient from "../../../../../app/apiClient";
import { PERMISSIONS, hasPermission } from '../../../../../app/permissions'

const canChangeLoanType = hasPermission(PERMISSIONS.LOANS_CHANGE_LOAN_TYPE)
const canChangeStatus = hasPermission(PERMISSIONS.LOANS_STATUS_UPDATE)
const canAssignAgent = hasPermission(PERMISSIONS.LOANS_AGENT_ASSIGNMENT)
const canViewApplication = hasPermission(PERMISSIONS.LOANS_APPLICATION_VIEW)
const canAddReminder = hasPermission(PERMISSIONS.LOANS_ADD_REMINDER)
const canViewChat = hasPermission(PERMISSIONS.LOANS_REMARKS_VIEW)
const canDeleteApplication = hasPermission(PERMISSIONS.LOANS_DELETE)


const GlobalChat = lazy(
  () =>
    import(
      "../../../../../components/GlobalModels/Loans/GlobalChat"
    ),
);

const STATUS_OPTIONS = [
  { label: "In Process", value: "inprocess" },
  { label: "Docs Pending", value: "docspending" },
  { label: "Rejected", value: "rejected" },
  { label: "Sanctioned", value: "sanctioned" },
  { label: "Disbursed", value: "disbursed" },
  { label: "Login", value: "login" },
  { label: "Revert Rejected", value: "revert_rejected" },
];

// =============================================================
// HELPERS
// =============================================================

const getAgentName = (application) => {
  const names = [
    application.agent?.name,
    application.processingAgent?.name,
    application.agentName,
    application.agent_name,
    typeof application.processingAgent === "string"
      ? application.processingAgent
      : null,
    typeof application.processing_agent === "string"
      ? application.processing_agent
      : null,
  ];

  return names.find(
    (name) => typeof name === "string" && name.trim(),
  ) || "N/A";
};

const getRMName = (application) => {
  const names = [
    application.rm?.name,
    application.rmName,
    application.rm_name,
    typeof application.rm === "string"
      ? application.rm
      : null,
  ];

  return names.find(
    (name) => typeof name === "string" && name.trim(),
  ) || "N/A";
};

const getTeamLeadName = (application) => {
  if (application.teamLead && typeof application.teamLead === "object") {
    return application.teamLead.name || "N/A";
  }
  if (application.team_lead && typeof application.team_lead === "object") {
    return application.team_lead.name || "N/A";
  }
  if (typeof application.teamLeadName === "string") return application.teamLeadName;
  if (typeof application.team_lead_name === "string")
    return application.team_lead_name;
  return "N/A";
};

const getAppliedBy = (application) => {
  if (application.appliedBy && typeof application.appliedBy === "object") {
    return application.appliedBy.name || "N/A";
  }
  if (application.applied_by && typeof application.applied_by === "object") {
    return application.applied_by.name || "N/A";
  }
  if (application.createdBy && typeof application.createdBy === "object") {
    return application.createdBy.name || "N/A";
  }
  if (application.created_by && typeof application.created_by === "object") {
    return application.created_by.name || "N/A";
  }
  if (typeof application.appliedBy === "string") return application.appliedBy;
  if (typeof application.applied_by === "string") return application.applied_by;
  if (typeof application.createdBy === "string") return application.createdBy;
  if (typeof application.created_by === "string") return application.created_by;
  if (typeof application.appliedByName === "string")
    return application.appliedByName;
  if (typeof application.applied_by_name === "string")
    return application.applied_by_name;
  return "N/A";
};

const getReferral = (application) => {
  if (application.referral && typeof application.referral === "object") {
    return application.referral.name || "N/A";
  }
  if (application.referredBy && typeof application.referredBy === "object") {
    return application.referredBy.name || "N/A";
  }
  if (application.referred_by && typeof application.referred_by === "object") {
    return application.referred_by.name || "N/A";
  }
  if (application.referrer && typeof application.referrer === "object") {
    return application.referrer.name || "N/A";
  }
  if (typeof application.referral === "string") return application.referral;
  if (typeof application.referralName === "string") return application.referralName;
  if (typeof application.referral_name === "string")
    return application.referral_name;
  if (typeof application.referredBy === "string") return application.referredBy;
  if (typeof application.referred_by === "string") return application.referred_by;
  if (typeof application.referrer === "string") return application.referrer;
  if (typeof application.referrerName === "string") return application.referrerName;
  if (typeof application.referrer_name === "string")
    return application.referrer_name;
  return "N/A";
};

const getLoanId = (application) =>
  application.loanId ??
  application.loan_id ??
  application.unique_id ??
  application.id ??
  null;

const getAgentId = (application) =>
  application.agentId ??
  application.agent_context_id ??
  application.processingAgentId ??
  application.processing_agent_id ??
  application.agent?.id ??
  application.processingAgent?.id ??
  null;

const getRevertedReason = (application) =>
  application.reverted_reason ?? application.revertedReason ?? null;

const getRevertedDate = (application) =>
  application.reverted_date ?? application.revertedDate ?? null;

const getRevertedByName = (application) =>
  application.reverted_by_name ??
  application.revertedByName ??
  application.reverted_by ??
  application.revertedBy ??
  null;

const getRejectedReason = (application) =>
  application.rejected_remarks ??
  application.rejectedRemarks ??
  application.rejection_reason ??
  application.rejectionReason ??
  null;

const getRejectedDate = (application) =>
  application.rejection_date ?? application.rejectionDate ?? null;

const getRejectedByName = (application) =>
  application.rejected_by_name ??
  application.rejectedByName ??
  application.rejected_by ??
  application.rejectedBy ??
  null;

const getLoanTypeName = (application, loanTypes = []) => {
  if (application.loanType && typeof application.loanType === "string") {
    return application.loanType;
  }
  if (application.loan_type && typeof application.loan_type === "string") {
    return application.loan_type;
  }
  const loanTypeId =
    application.loanTypeId ??
    application.loan_type_id ??
    application.loanType?.id ??
    application.loan_type?.id;
  if (loanTypeId === null || loanTypeId === undefined || loanTypeId === "") {
    return "Not Assigned";
  }
  const loanType = loanTypes.find(
    (item) => String(item.id) === String(loanTypeId),
  );
  return loanType?.name || "Not Assigned";
};

const getAmount = (application) => {
  const amount =
    application.loanAmount ??
    application.loan_amount ??
    application.loan_amt ??
    application.amount;
  if (amount === null || amount === undefined || amount === "") {
    return "N/A";
  }
  const numericAmount = Number(
    String(amount).replace(/,/g, "").replace(/₹/g, "").trim(),
  );
  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }
  return `₹${numericAmount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("/");
};

const getAppliedDate = (application) =>
  formatDate(
    application.appliedDate ??
    application.applied_date ??
    application.appliedAt ??
    application.applied_at ??
    application.createdAt ??
    application.created_at,
  );

const normalizeStatus = (value) => {
  if (!value) return "N/A";
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
  switch (normalized) {
    case "revert rejected":
    case "reverted rejected":
    case "revertreject":
    case "revert reject":
      return "Revert Rejected";
    case "rejected":
    case "reject":
      return "Rejected";
    case "inprocess":
    case "in process":
    case "in progress":
    case "processing":
      return "In Process";
    case "docspending":
    case "docs pending":
    case "document pending":
    case "documents pending":
      return "Docs Pending";
    case "sanctioned":
    case "sanction":
      return "Sanctioned";
    case "disbursed":
    case "disbursement":
      return "Disbursed";
    case "login":
      return "Login";
    default:
      return String(value);
  }
};

const getApplicationStatus = (application) => {
  const baseStatus = normalizeStatus(application.status);
  const revertedReason = getRevertedReason(application);
  if (baseStatus === "Rejected" && revertedReason) {
    return "Revert Rejected";
  }
  return baseStatus;
};

const getStatusClass = (status) => {
  switch (normalizeStatus(status)) {
    case "In Process":
      return `text-[#78B300] border-[#8BCF00]/40 bg-[#8BCF00]/10`;
    case "Docs Pending":
      return `text-orange-600 border-orange-300 bg-orange-50`;
    case "Rejected":
      return `text-error border-error/30 bg-error/5`;
    case "Revert Rejected":
      return `text-yellow-600 border-yellow-300 bg-yellow-50`;
    case "Sanctioned":
      return `text-blue-600 border-blue-300 bg-blue-50`;
    case "Disbursed":
      return `text-purple-600 border-purple-300 bg-purple-50`;
    default:
      return `text-base-content/60 border-base-300 bg-base-200/50`;
  }
};

function Cell({ children, title, className = "" }) {
  return (
    <span
      title={title ?? String(children ?? "")}
      className={`block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

// =============================================================
// COMPONENT
// =============================================================

function ApplicationsTable({
  applications = [],
  search,
  setSearch,
  statuses = STATUS_OPTIONS,
  selectedLoanType,
  setSelectedLoanType,
  selectedRM,
  setSelectedRM,
  selectedTeamLead,
  setSelectedTeamLead,
  selectedAgent,
  setSelectedAgent,
  selectedStatus,
  setSelectedStatus,
  onClearFilters,
  onLoanTypeChange,
  onStatusChange,
  onReminder,
  onChat,
  onViewApplication,
  onAssignApplication,
  onRefresh,
  onAssignmentChange,
  onAssignmentSuccess,
  onAssignmentError,
  onDeleteApplication,
  currentPage = 1,
  pageSize = 10,
  totalApplications = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}) {
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedInfoApplication, setSelectedInfoApplication] = useState(null);
  const [infoPopupPosition, setInfoPopupPosition] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatApplication, setSelectedChatApplication] = useState(null);
  const [expandedPhoneId, setExpandedPhoneId] = useState(null);

  const openAssignmentModal = async (application) => {
    const confirmed = window.confirm(
      "Are you sure you want to move this application to Processing Team?",
    );
    if (!confirmed) return;

    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    if (!applicationId) {
      onAssignmentError?.(
        null,
        "Processing Team assignment"
      );
      return;
    }

    try {
      const response = await apiClient({
        method: "PATCH",
        url: `/shuffle-loans/applications/${applicationId}/assign-random`,
      });

      const updatedApplication = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (updatedApplication && onAssignmentChange) {
        onAssignmentChange(Number(applicationId), updatedApplication);
      }
      if (onRefresh) await onRefresh();
      onAssignmentSuccess?.(
        "Processing Team assignment"
      );
    } catch (error) {
      onAssignmentError?.(
        error,
        "Processing Team assignment"
      );
    }
  };

  const handleLoanTypesLoaded = useCallback((options) => {
    setLoanTypes(options || []);
  }, []);

  const handleAgentChange = async (application, newAgentId) => {
    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    if (
      !applicationId ||
      newAgentId === undefined ||
      newAgentId === null ||
      newAgentId === ""
    )
      return;

    try {
      const response = await apiClient({
        method: "PATCH",
        url: "/shuffle-loans/assign",
        data: {
          application_ids: [applicationId],
          agent_id: Number(newAgentId),
        },
      });

      const updatedApplication = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (updatedApplication && onAssignmentChange) {
        onAssignmentChange(applicationId, updatedApplication);
      }

      onAssignmentSuccess?.("Processing Agent");
    } catch (error) {
      console.error("Failed to update Processing Agent:", error);
      onAssignmentError?.(error, "Processing Agent");
    }
  };

  const handleRmChange = async (application, newRmId) => {
    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    if (
      !applicationId ||
      newRmId === undefined ||
      newRmId === null ||
      newRmId === ""
    )
      return;

    try {
      const response = await apiClient({
        method: "PATCH",
        url: "/shuffle-loans/assign",
        data: {
          application_ids: [applicationId],
          rm_id: Number(newRmId),
        },
      });

      const updatedApplication = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (updatedApplication && onAssignmentChange) {
        onAssignmentChange(applicationId, updatedApplication);
      }

      onAssignmentSuccess?.("RM");
    } catch (error) {
      console.error("Failed to update RM:", error);
      onAssignmentError?.(error, "RM");
    }
  };

  const handleInfoClick = (event, application) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = 280;
    const spacing = 10;
    const viewportPadding = 16;

    let left = rect.right + spacing;
    if (left + popupWidth > window.innerWidth - viewportPadding) {
      left = rect.left - popupWidth - spacing;
    }
    if (left < viewportPadding) left = viewportPadding;

    let top = rect.bottom + spacing;
    if (top + popupHeight > window.innerHeight - viewportPadding) {
      top = rect.top - popupHeight - spacing;
    }
    if (top < viewportPadding) top = viewportPadding;

    if (selectedInfoApplication?.id === application.id) {
      setSelectedInfoApplication(null);
      setInfoPopupPosition(null);
      return;
    }

    setSelectedInfoApplication(application);
    setInfoPopupPosition({ top, left });
  };

  useEffect(() => {
    if (!selectedInfoApplication) return;
    const closePopup = () => {
      setSelectedInfoApplication(null);
      setInfoPopupPosition(null);
    };
    window.addEventListener("scroll", closePopup, true);
    window.addEventListener("resize", closePopup);
    return () => {
      window.removeEventListener("scroll", closePopup, true);
      window.removeEventListener("resize", closePopup);
    };
  }, [selectedInfoApplication]);

  const statusOptions = statuses?.length ? statuses : STATUS_OPTIONS;

  const handleOpenChat = (application) => {
    setSelectedChatApplication(application);
    setChatOpen(true);
    onChat?.(application);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedChatApplication(null);
  };

  const handlePhoneClick = (application) => {
    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;
    setExpandedPhoneId((currentId) =>
      currentId === applicationId ? null : applicationId,
    );
  };

  const startIndex = Math.max(0, (currentPage - 1) * pageSize);

  const handleSearchChange = (event) => setSearch(event.target.value);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="w-full flex flex-col gap-3">
      {/* =================================================
                FILTERS
            ================================================= */}

      <div className="card bg-base-100 border border-base-300 shadow-sm w-full">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col gap-2">
            {/* SEARCH */}

            <div className="relative w-full">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/35" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search name, loan ID, email or Agent..."
                className="input input-bordered h-10 min-h-10 w-full pl-9 text-sm"
              />
            </div>

            {/* FILTER DROPDOWNS + ACTIONS */}

            <div className="flex flex-col xl:flex-row xl:items-center gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex-1 xl:grid-cols-5 gap-2">
                <div className="w-full">
                  <LoanTypeDropdown
                    label=""
                    value={selectedLoanType}
                    onChange={setSelectedLoanType}
                    onOptionsLoaded={handleLoanTypesLoaded}
                    allLabel="All Loan Types"
                    placeholder="All Loan Types"
                    searchPlaceholder="Search loan type"
                    emptyMessage="No loan types found"
                  />
                </div>

                <div className="w-full">
                  <RmDropdown
                    label=""
                    value={selectedRM}
                    onChange={setSelectedRM}
                    allLabel="All RMs"
                    placeholder="All RMs"
                    searchPlaceholder="Search RM"
                    emptyMessage="No RMs found"
                    teamLeadContextId={selectedTeamLead}
                  />
                </div>

                <div className="w-full">
                  <TeamLeadDropdown
                    label=""
                    value={selectedTeamLead}
                    onChange={setSelectedTeamLead}
                    allLabel="All Team Leads"
                    placeholder="All Team Leads"
                    searchPlaceholder="Search Team Lead"
                    emptyMessage="No Team Leads found"
                  />
                </div>

                <div className="w-full">
                  <AgentDropdown
                    label=""
                    value={selectedAgent}
                    onChange={setSelectedAgent}
                    allLabel="All Agents"
                    placeholder="All Agents"
                    searchPlaceholder="Search Agent"
                    emptyMessage="No Agents found"
                    teamLeadContextId={selectedTeamLead}
                  />
                </div>

                <div className="w-full">
                  <StatusDropdown
                    label=""
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={statusOptions}
                    allLabel="All Statuses"
                    placeholder="All Statuses"
                    searchPlaceholder="Search status"
                    emptyMessage="No statuses found"
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex items-center justify-end gap-2 xl:shrink-0">
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="btn btn-ghost btn-sm h-10 min-h-10"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={onRefresh}
                  title="Refresh applications"
                  className="btn btn-sm btn-square h-10 min-h-10 border-[#8BCF00] text-[#78B300] hover:bg-[#8BCF00] hover:text-white"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
                DESKTOP TABLE (lg and above)
            ================================================= */}

      <div className="hidden lg:block card bg-base-100 border border-base-300 shadow-sm w-full">
        {/*
          SCROLL CONTAINER:
          - overflow-x-auto → horizontal scroll when columns don't fit
          - overflow-y-visible → dropdown menus below the trigger are NOT clipped
          - On some browsers `overflow-x-auto` forces `overflow-y-auto` implicitly.
            Using `overflow-y-visible` on the parent + no max-height avoids that.
        */}
        <div className="w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[1200px] border-collapse">
            <colgroup>
              <col style={{ width: "48px" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "250px" }} />
            </colgroup>

            <thead>
              <tr className="border-b border-base-300 bg-base-200/40">
                {[
                  "#",
                  "Name",
                  "Phone",
                  "Loan Type",
                  "Loan Amount",
                  "Applied Date",
                  "Referral",
                  "RM",
                  "Processing Agent",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-base-content/70"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!applications.length ? (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center py-12 text-sm text-base-content/50"
                  >
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((application, index) => {
                  const applicationId =
                    application.id ??
                    application.loanId ??
                    application.loan_id ??
                    index;
                  const phone = application.phone || "N/A";
                  const phoneExpanded = expandedPhoneId === applicationId;
                  const status = getApplicationStatus(application);
                  const loanTypeName = getLoanTypeName(application, loanTypes);
                  const referral = getReferral(application);
                  const amount = getAmount(application);
                  const appliedDate = getAppliedDate(application);

                  return (
                    <tr
                      key={applicationId}
                      className="border-b border-base-300 last:border-b-0 hover:bg-base-200/30 transition-colors"
                    >
                      <td className="px-3 py-4">
                        <Cell className="text-sm text-base-content/70">
                          {startIndex + index + 1}
                        </Cell>
                      </td>

                      <td className="px-3 py-4">
                        <Cell
                          title={application.name}
                          className="text-sm font-medium"
                        >
                          {application.name || "N/A"}
                        </Cell>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => handlePhoneClick(application)}
                            title={
                              phoneExpanded
                                ? "Collapse phone number"
                                : "Show full phone number"
                            }
                            className="min-w-0 flex-1 text-left text-sm hover:text-[#78B300]"
                          >
                            <span
                              className={
                                phoneExpanded ? "break-all" : "block truncate"
                              }
                            >
                              {phone}
                            </span>
                          </button>
                          {application.phone && (
                            <a
                              href={`tel:${application.phone}`}
                              title={`Call ${
                                application.name || application.phone
                              }`}
                              aria-label={`Call ${
                                application.name || application.phone
                              }`}
                              className="btn btn-ghost btn-xs btn-square shrink-0 rounded-full text-[#78B300] hover:bg-[#8BCF00]/10"
                            >
                              <PhoneIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (!canChangeLoanType) return
                            onLoanTypeChange?.(application)
                          }}
                          title={loanTypeName}
                          disabled={!canChangeLoanType}
                          className="max-w-full inline-flex items-center px-2.5 py-1 rounded-full border border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#78B300] text-xs font-medium truncate hover:bg-[#8BCF00]/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loanTypeName}
                        </button>
                      </td>

                      <td className="px-3 py-4">
                        <Cell title={amount} className="text-sm font-medium">
                          {amount}
                        </Cell>
                      </td>

                      <td className="px-3 py-4">
                        <Cell title={appliedDate} className="text-sm">
                          {appliedDate}
                        </Cell>
                      </td>

                      <td className="px-3 py-4">
                        <Cell title={referral} className="text-sm">
                          {referral}
                        </Cell>
                      </td>

                      <td className="px-3 py-4">
                        <RmDropdown
                          value={
                            application.rmId ??
                            application.rm_context_id ??
                            ""
                          }
                          fallbackLabel={getRMName(application)}
                          onChange={(value) =>
                            handleRmChange(application, value)
                          }
                        />
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <AgentDropdown
                          value={
                            application.agentId ??
                            application.agent_context_id ??
                            ""
                          }
                          fallbackLabel={getAgentName(application)}
                          onChange={(value) =>
                            handleAgentChange(application, value)
                          }
                        />
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => onStatusChange?.(application)}
                            title={status}
                            disabled={!canChangeStatus}
                            className={`max-w-full shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium truncate hover:opacity-80 ${getStatusClass(
                              status,
                            )}`}
                          >
                            {status}
                          </button>
                        </div>
                      </td>

                      <td className="px-2 py-4">
                        <div className="flex items-center justify-center gap-0">
                          <button
                            type="button"
                            onClick={() => openAssignmentModal(application)}
                            title="Assign application"
                            disabled={!canAssignAgent}
                            aria-label={`Assign application for ${
                              application.name || "customer"
                            }`}
                            className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                          >
                            <UserPlusIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onViewApplication?.(application)}
                            title="View application"
                            disabled={!canViewApplication}
                            className="btn btn-ghost btn-sm btn-square hover:bg-[#8BCF00]/10 hover:text-[#78B300]"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onReminder?.(application)}
                            title="Add reminder"
                            disabled={!canAddReminder}
                            className="btn btn-ghost btn-sm btn-square hover:bg-[#8BCF00]/10 hover:text-[#78B300]"
                          >
                            <BellAlertIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenChat(application)}
                            title="Open chat"
                            disabled={!canViewChat}
                            className="btn btn-ghost btn-sm btn-square hover:bg-[#8BCF00]/10 hover:text-[#78B300]"
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteApplication?.(application)}
                            title="Delete application"
                            disabled={!canDeleteApplication}
                            aria-label={`Delete application for ${
                              application.name || "customer"
                            }`}
                            className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
                MOBILE / TABLET CARD LIST (below lg)
            ================================================= */}

      <div className="lg:hidden w-full flex flex-col gap-3">
        {!applications.length ? (
          <div className="card bg-base-100 border border-base-300 shadow-sm w-full">
            <div className="text-center py-12 text-sm text-base-content/50">
              No applications found
            </div>
          </div>
        ) : (
          applications.map((application, index) => {
            const applicationId =
              application.id ??
              application.loanId ??
              application.loan_id ??
              index;
            const phone = application.phone || "N/A";
            const phoneExpanded = expandedPhoneId === applicationId;
            const status = getApplicationStatus(application);
            const loanTypeName = getLoanTypeName(application, loanTypes);
            const referral = getReferral(application);
            const amount = getAmount(application);
            const appliedDate = getAppliedDate(application);

            return (
              <div
                key={applicationId}
                className="card bg-base-100 border border-base-300 shadow-sm w-full"
              >
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-xs font-semibold text-base-content/50 pt-0.5 shrink-0">
                        #{startIndex + index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-base-content break-words">
                          {application.name || "N/A"}
                        </div>
                        <div className="text-xs text-base-content/60 mt-0.5">
                          {appliedDate}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStatusChange?.(application)}
                      title={status}
                      className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusClass(
                        status,
                      )}`}
                    >
                      {status}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        Phone
                      </div>
                      <div className="flex items-center gap-1 min-w-0 mt-0.5">
                        <button
                          type="button"
                          onClick={() => handlePhoneClick(application)}
                          className="min-w-0 flex-1 text-left text-sm hover:text-[#78B300] break-all"
                          title={
                            phoneExpanded
                              ? "Collapse phone number"
                              : "Show full phone number"
                          }
                        >
                          {phone}
                        </button>
                        {application.phone && (
                          <a
                            href={`tel:${application.phone}`}
                            title={`Call ${
                              application.name || application.phone
                            }`}
                            aria-label={`Call ${
                              application.name || application.phone
                            }`}
                            className="btn btn-ghost btn-xs btn-square shrink-0 rounded-full text-[#78B300] hover:bg-[#8BCF00]/10"
                          >
                            <PhoneIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        Loan Type
                      </div>
                      <div className="mt-0.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => onLoanTypeChange?.(application)}
                          title={loanTypeName}
                          className="max-w-full inline-flex items-center px-2.5 py-1 rounded-full border border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#78B300] text-xs font-medium truncate hover:bg-[#8BCF00]/20"
                        >
                          {loanTypeName}
                        </button>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        Loan Amount
                      </div>
                      <div className="mt-0.5 text-sm font-medium break-words">
                        {amount}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        Referral
                      </div>
                      <div className="mt-0.5 text-sm break-words">
                        {referral}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        RM
                      </div>
                      <div className="mt-0.5 min-w-0">
                        <RmDropdown
                          value={
                            application.rmId ??
                            application.rm_context_id ??
                            ""
                          }
                          fallbackLabel={getRMName(application)}
                          onChange={(value) =>
                            handleRmChange(application, value)
                          }
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        Processing Agent
                      </div>
                      <div className="mt-0.5 min-w-0">
                        <AgentDropdown
                          value={
                            application.agentId ??
                            application.agent_context_id ??
                            ""
                          }
                          fallbackLabel={getAgentName(application)}
                          onChange={(value) =>
                            handleAgentChange(application, value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-base-300 flex-wrap">
                    <button
                      type="button"
                      onClick={() => openAssignmentModal(application)}
                      title="Assign application"
                      className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewApplication?.(application)}
                      title="View application"
                      className="btn btn-ghost btn-sm btn-square hover:bg-[#8BCF00]/10 hover:text-[#78B300]"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onReminder?.(application)}
                      title="Add reminder"
                      className="btn btn-ghost btn-sm btn-square hover:bg-[#8BCF00]/10 hover:text-[#78B300]"
                    >
                      <BellAlertIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenChat(application)}
                      title="Open chat"
                      className="btn btn-ghost btn-sm btn-square hover:bg-[#8BCF00]/10 hover:text-[#78B300]"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteApplication?.(application)}
                      title="Delete application"
                      className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =================================================
                PAGINATION
            ================================================= */}

      {totalApplications > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-wrap bg-base-100 border border-base-300 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange?.(Number(event.target.value))
              }
              className="select select-bordered select-sm w-20"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="text-sm text-base-content/60">
            Showing {startIndex + 1}
            {"–"}
            {Math.min(startIndex + pageSize, totalApplications)} of{" "}
            {totalApplications}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                disabled={currentPage === 1}
                onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
              >
                Previous
              </button>
              <span className="px-2 text-sm text-base-content/60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                disabled={currentPage === totalPages}
                onClick={() =>
                  onPageChange?.(Math.min(currentPage + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================
                REJECTION DETAILS POPUP
            ================================================= */}

      {selectedInfoApplication &&
        infoPopupPosition &&
        createPortal(
          <div
            className="fixed z-[9999] w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl"
            style={{
              top: infoPopupPosition.top,
              left: infoPopupPosition.left,
            }}
          >
            <div className="text-sm font-semibold text-base-content">
              Rejection Details
            </div>

            <div className="mt-3 text-sm text-base-content">
              <span className="font-semibold">Type:</span>{" "}
              {getRevertedReason(selectedInfoApplication)
                ? "Reverted"
                : "Rejected"}
            </div>

            <div className="mt-1 text-sm text-base-content">
              <span className="font-semibold">By:</span>{" "}
              {getRevertedReason(selectedInfoApplication)
                ? getRevertedByName(selectedInfoApplication) || "—"
                : getRejectedByName(selectedInfoApplication) || "—"}
            </div>

            <div className="mt-1 text-sm text-base-content">
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(
                getRevertedReason(selectedInfoApplication)
                  ? getRevertedDate(selectedInfoApplication)
                  : getRejectedDate(selectedInfoApplication),
              )}
            </div>

            <div className="mt-3 text-sm leading-5 text-base-content">
              <span className="font-semibold">Remarks:</span>{" "}
              <span className="break-words">
                {getRevertedReason(selectedInfoApplication)
                  ? getRevertedReason(selectedInfoApplication) || "—"
                  : getRejectedReason(selectedInfoApplication) || "—"}
              </span>
            </div>
          </div>,
          document.body,
        )}

      {/* =================================================
                GLOBAL CHAT
            ================================================= */}

      <Suspense fallback={null}>
        {selectedChatApplication && (
          <GlobalChat
            open={chatOpen}
            onClose={handleCloseChat}
            loanId={getLoanId(selectedChatApplication)}
            agentId={getAgentId(selectedChatApplication)}
            customerName={selectedChatApplication.name || "Customer"}
            customerPhone={selectedChatApplication.phone || ""}
          />
        )}
      </Suspense>
    </div>
  );
}

export default ApplicationsTable;
