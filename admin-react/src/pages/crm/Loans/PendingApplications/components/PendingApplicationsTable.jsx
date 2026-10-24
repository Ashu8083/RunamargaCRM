// admin-react/src/pages/crm/Loans/PendingApplications/components/PendingApplicationsTable.jsx

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
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import AgentDropdown from "../../../../../components/GlobalModels/Filters/AgentDropdown";
import RmDropdown from "../../../../../components/GlobalModels/Filters/RmDropdown";
import TeamLeadDropdown from "../../../../../components/GlobalModels/Filters/TeamLeadDropdown";
import LoanTypeDropdown from "../../../../../components/GlobalModels/Filters/LoanTypeDropdown";
import StatusDropdown from "../../../../../components/GlobalModels/Filters/StatusDropdown";
import apiClient from "../../../../../app/apiClient";

// =============================================================
// LAZY-LOADED GLOBAL CHAT
// =============================================================

const GlobalChat = lazy(
  () =>
    import(
      "../../../../../components/GlobalModels/Loans/GlobalChat"
    ),
);

function PendingApplicationsTable({
  applications = [],

  currentPage,
  pageSize,
  totalApplications,
  totalPages,
  setCurrentPage,
  setPageSize,

  search,
  setSearch,

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
  statuses = [],
  onClearFilters,
  onLoanTypeChange,
  onStatusChange,
  onReminder,
  onChat,
  onViewApplication,
  onAssignApplication,
  onDeleteApplication,
  onRefresh,
  onAssignmentChange,
}) {
  const [loanTypes, setLoanTypes] = useState([]);
  const [expandedPhoneId, setExpandedPhoneId] = useState(null);

  // =============================================================
  // CONSTANTS
  // =============================================================

  const STATUS_OPTIONS = [
    { label: "In Process", value: "inprocess" },
    { label: "Docs Pending", value: "docspending" },
    { label: "Rejected", value: "rejected" },
    { label: "Sanctioned", value: "sanctioned" },
    { label: "Disbursed", value: "disbursed" },
    { label: "Login", value: "login" },
    { label: "Revert Rejected", value: "revert_rejected" },
  ];

  // =========================================================
  // CHAT
  // =========================================================

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatApplication, setSelectedChatApplication] = useState(null);

  

  const openAssignmentModal = async (application) => {
    const confirmed = window.confirm(
      "Are you sure you want to move this application to Processing Team?",
    );

    if (!confirmed) return;

    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    if (!applicationId) {
      window.alert("Application ID is missing.");
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

      if (onRefresh) {
        await onRefresh();
      }

      window.alert("Application successfully assigned to Processing Team.");
    } catch (error) {
      window.alert(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Assignment failed. Please try again.",
      );
    }
  };

  // =========================================================
  // REJECTION INFO POPUP
  // =========================================================

  const [selectedInfoApplication, setSelectedInfoApplication] = useState(null);
  const [infoPopupPosition, setInfoPopupPosition] = useState(null);

  // =========================================================
  // HELPERS
  // =========================================================

  const handleLoanTypesLoaded = useCallback((options) => {
    setLoanTypes(options || []);
  }, []);

  // =========================================================
  // AGENT CHANGE
  // =========================================================

  const handleAgentChange = async (application, newAgentId) => {
    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    if (
      !applicationId ||
      newAgentId === undefined ||
      newAgentId === null ||
      newAgentId === ""
    ) {
      return;
    }

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
    } catch (error) {
      console.error("Failed to update Processing Agent:", error);
    }
  };

  // =========================================================
  // RM CHANGE
  // =========================================================

  const handleRmChange = async (application, newRmId) => {
    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    if (
      !applicationId ||
      newRmId === undefined ||
      newRmId === null ||
      newRmId === ""
    ) {
      return;
    }

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
    } catch (error) {
      console.error("Failed to update RM:", error);
    }
  };

  // =============================================================
  // LOAN TYPE
  // =============================================================

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

  const getAgentName = (application) => {
    if (application.agent?.name) {
      return application.agent.name;
    }

    if (
      application.processingAgent &&
      typeof application.processingAgent === "object"
    ) {
      return application.processingAgent.name || "N/A";
    }

    return (
      application.agentName ??
      application.agent_name ??
      application.processingAgent ??
      application.processing_agent ??
      "N/A"
    );
  };

  const getRMName = (application) => {
    if (application.rm?.name) {
      return application.rm.name;
    }

    return (
      application.rmName ??
      application.rm_name ??
      (typeof application.rm === "string" ? application.rm : null) ??
      "N/A"
    );
  };

  const getReferralName = (application) => {
    if (application.referral && typeof application.referral === "object") {
      return application.referral.name || "N/A";
    }

    if (
      application.referredBy &&
      typeof application.referredBy === "object"
    ) {
      return application.referredBy.name || "N/A";
    }

    if (application.referrer && typeof application.referrer === "object") {
      return application.referrer.name || "N/A";
    }

    return (
      application.referral ??
      application.referralName ??
      application.referral_name ??
      application.referredBy ??
      application.referred_by ??
      application.referrer ??
      application.referrerName ??
      application.referrer_name ??
      "N/A"
    );
  };

  const getLoanId = (application) =>
    application.uniqueId ??
    application.unique_id ??
    application.loanId ??
    application.loan_id ??
    application.id ??
    null;

  const getAgentId = (application) =>
    application.agentId ??
    application.agent_id ??
    application.processingAgentId ??
    application.processing_agent_id ??
    application.agent?.id ??
    application.processingAgent?.id ??
    null;

  // =========================================================
  // REJECTION / REVERT HELPERS
  // =========================================================

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

  // =========================================================
  // STATUS
  // =========================================================

  const normalizeStatus = (status) =>
    String(status || "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  const getApplicationStatus = (application) => {
    const status = normalizeStatus(application.status);

    if (
      status === "rejected" &&
      (getRevertedReason(application) || getRevertedDate(application))
    ) {
      return "Revert Rejected";
    }

    switch (status) {
      case "inprocess":
      case "in process":
        return "In Process";

      case "docspending":
      case "docs pending":
      case "documents pending":
        return "Docs Pending";

      case "rejected":
        return "Rejected";

      case "revert rejected":
      case "reverted rejected":
        return "Revert Rejected";

      case "sanctioned":
        return "Sanctioned";

      case "disbursed":
        return "Disbursed";

      case "login":
        return "Login";

      default:
        return application.status || "N/A";
    }
  };

  const isRejectedApplication = (application) => {
    const status = getApplicationStatus(application);
    return status === "Rejected" || status === "Revert Rejected";
  };

  const isRevertRejectedApplication = (application) => {
    return getApplicationStatus(application) === "Revert Rejected";
  };

  // =========================================================
  // AMOUNT
  // =========================================================

  const getAmount = (application) => {
    const amount =
      application.loanAmt ??
      application.loan_amt ??
      application.loanAmount ??
      application.loan_amount ??
      application.amount;

    if (amount === null || amount === undefined || amount === "") {
      return "N/A";
    }

    const numericAmount = Number(
      String(amount).replace(/,/g, "").replace(/₹/g, ""),
    );

    return Number.isNaN(numericAmount)
      ? String(amount)
      : `₹${numericAmount.toLocaleString("en-IN")}`;
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

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
        application.applied_at ??
        application.createdAt ??
        application.created_at,
    );

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case "inprocess":
      case "in process":
        return `text-[#78B300] border-[#8BCF00]/40 bg-[#8BCF00]/10`;

      case "docs pending":
      case "docspending":
      case "documents pending":
        return `text-orange-600 border-orange-300 bg-orange-50`;

      case "rejected":
        return `text-error border-error/30 bg-error/5`;

      case "revert rejected":
      case "reverted rejected":
        return `text-amber-600 border-amber-300 bg-amber-50`;

      case "sanctioned":
        return `text-blue-600 border-blue-300 bg-blue-50`;

      case "disbursed":
        return `text-purple-600 border-purple-300 bg-purple-50`;

      case "login":
        return `text-cyan-600 border-cyan-300 bg-cyan-50`;

      default:
        return `text-base-content/60 border-base-300 bg-base-200/50`;
    }
  };

  // =========================================================
  // PHONE
  // =========================================================

  const handlePhoneClick = (application) => {
    const applicationId =
      application.id ?? application.loanId ?? application.loan_id;

    setExpandedPhoneId((currentId) =>
      currentId === applicationId ? null : applicationId,
    );
  };

  // =========================================================
  // REJECTION INFO POPUP
  // =========================================================

  const handleInfoClick = (event, application) => {
    event.stopPropagation();

    if (selectedInfoApplication?.id === application.id) {
      setSelectedInfoApplication(null);
      setInfoPopupPosition(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const popupWidth = 320;
    const popupHeight = 230;
    const spacing = 10;
    const viewportPadding = 16;

    let left = rect.right + spacing;

    if (left + popupWidth > window.innerWidth - viewportPadding) {
      left = rect.left - popupWidth - spacing;
    }

    if (left < viewportPadding) {
      left = viewportPadding;
    }

    let top = rect.top - 15;

    if (top + popupHeight > window.innerHeight - viewportPadding) {
      top = window.innerHeight - popupHeight - viewportPadding;
    }

    if (top < viewportPadding) {
      top = viewportPadding;
    }

    setSelectedInfoApplication(application);
    setInfoPopupPosition({ top, left });
  };

  // =========================================================
  // CLOSE INFO POPUP ON SCROLL / RESIZE
  // =========================================================

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

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // =========================================================
  // FILTER STATUS OPTIONS
  // =========================================================

  const statusOptions = statuses?.length ? statuses : STATUS_OPTIONS;

  // =========================================================
  // CHAT
  // =========================================================

  const handleOpenChat = (application) => {
    setSelectedChatApplication(application);
    setChatOpen(true);
    onChat?.(application);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedChatApplication(null);
  };

  // =========================================================
  // TABLE CELL
  // =========================================================

  const Cell = ({ children, title, className = "" }) => (
    <span
      title={title ?? String(children ?? "")}
      className={`block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );

  const startIndex = Math.max(0, (currentPage - 1) * pageSize);

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
        {/* Scroll container: horizontal scroll when narrow, no y clipping for dropdowns */}

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
                    colSpan={11}
                    className="text-center py-12 text-sm text-base-content/50"
                  >
                    No pending applications found
                  </td>
                </tr>
              ) : (
                applications.map((application, index) => {
                  const applicationId =
                    application.id ??
                    application.loanId ??
                    application.loan_id ??
                    index;

                  const loanTypeName = getLoanTypeName(application, loanTypes);
                  const phone = application.phone || "N/A";
                  const phoneExpanded = expandedPhoneId === applicationId;
                  const referralName = getReferralName(application);
                  const amount = getAmount(application);
                  const appliedDate = getAppliedDate(application);
                  const displayStatus = getApplicationStatus(application);

                  return (
                    <tr
                      key={applicationId}
                      className="border-b border-base-300 last:border-b-0 hover:bg-base-200/30 transition-colors"
                    >
                      <td className="px-3 py-4 align-middle">
                        <Cell className="text-sm text-base-content/70">
                          {startIndex + index + 1}
                        </Cell>
                      </td>

                      <td className="px-3 py-4 align-middle">
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

                      <td className="px-3 py-4 align-middle">
                        <button
                          type="button"
                          onClick={() => onLoanTypeChange?.(application)}
                          title={loanTypeName}
                          className="max-w-full inline-flex items-center px-2.5 py-1 rounded-full border border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#78B300] text-xs font-medium truncate hover:bg-[#8BCF00]/20"
                        >
                          {loanTypeName}
                        </button>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <Cell title={amount} className="text-sm font-medium">
                          {amount}
                        </Cell>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <Cell title={appliedDate} className="text-sm">
                          {appliedDate}
                        </Cell>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <Cell title={referralName} className="text-sm">
                          {referralName}
                        </Cell>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <RmDropdown
                          value={application.rmId ?? application.rm_id ?? ""}
                          onChange={(value) =>
                            handleRmChange(application, value)
                          }
                        />
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <AgentDropdown
                          value={
                            application.agentId ??
                            application.agent_id ??
                            ""
                          }
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
                            title={displayStatus}
                            className={`min-w-0 max-w-full inline-flex items-center justify-center px-2.5 py-1 rounded-full border text-xs font-medium truncate hover:opacity-80 ${getStatusClass(
                              displayStatus,
                            )}`}
                          >
                            <span className="truncate">{displayStatus}</span>
                          </button>
                        </div>
                      </td>

                      <td className="px-2 py-4 align-middle">
                        <div className="flex items-center justify-center gap-0">
                          <button
                            type="button"
                            onClick={() => openAssignmentModal(application)}
                            title="Assign application"
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
              No pending applications found
            </div>
          </div>
        ) : (
          applications.map((application, index) => {
            const applicationId =
              application.id ??
              application.loanId ??
              application.loan_id ??
              index;

            const loanTypeName = getLoanTypeName(application, loanTypes);
            const phone = application.phone || "N/A";
            const phoneExpanded = expandedPhoneId === applicationId;
            const referralName = getReferralName(application);
            const amount = getAmount(application);
            const appliedDate = getAppliedDate(application);
            const displayStatus = getApplicationStatus(application);

            return (
              <div
                key={applicationId}
                className="card bg-base-100 border border-base-300 shadow-sm w-full"
              >
                <div className="p-4 flex flex-col gap-3">
                  {/* HEADER */}

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
                      title={displayStatus}
                      className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusClass(
                        displayStatus,
                      )}`}
                    >
                      {displayStatus}
                    </button>
                  </div>

                  {/* DETAILS */}

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
                        {referralName}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wide text-base-content/45">
                        RM
                      </div>
                      <div className="mt-0.5 min-w-0">
                        <RmDropdown
                          value={application.rmId ?? application.rm_id ?? ""}
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
                            application.agentId ?? application.agent_id ?? ""
                          }
                          onChange={(value) =>
                            handleAgentChange(application, value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

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
          {/* ROWS PER PAGE */}

          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="select select-bordered select-sm w-20"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* SHOWING */}

          <div className="text-sm text-base-content/60">
            Showing {startIndex + 1}
            {"–"}
            {Math.min(currentPage * pageSize, totalApplications)} of{" "}
            {totalApplications}
          </div>

          {/* NAVIGATION */}

          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${
                    currentPage === page ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              className="btn btn-sm btn-ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
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
              {isRevertRejectedApplication(selectedInfoApplication)
                ? "Reverted"
                : "Rejected"}
            </div>

            <div className="mt-1 text-sm text-base-content">
              <span className="font-semibold">By:</span>{" "}
              {isRevertRejectedApplication(selectedInfoApplication)
                ? getRevertedByName(selectedInfoApplication) || "—"
                : getRejectedByName(selectedInfoApplication) || "—"}
            </div>

            <div className="mt-1 text-sm text-base-content">
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(
                isRevertRejectedApplication(selectedInfoApplication)
                  ? getRevertedDate(selectedInfoApplication)
                  : getRejectedDate(selectedInfoApplication),
              )}
            </div>

            <div className="mt-3 text-sm leading-5 text-base-content">
              <span className="font-semibold">Remarks:</span>{" "}
              <span className="break-words">
                {isRevertRejectedApplication(selectedInfoApplication)
                  ? getRevertedReason(selectedInfoApplication) || "—"
                  : getRejectedReason(selectedInfoApplication) || "—"}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default PendingApplicationsTable;