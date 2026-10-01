import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import GlobalChat from "../../../../../components/GlobalModels/Loans/GlobalChat";
import AgentDropdown from "../../../../../components/GlobalModels/Filters/AgentDropdown";
import RmDropdown from "../../../../../components/GlobalModels/Filters/RmDropdown";
import TeamLeadDropdown from "../../../../../components/GlobalModels/Filters/TeamLeadDropdown";
import LoanTypeDropdown from "../../../../../components/GlobalModels/Filters/LoanTypeDropdown";
import StatusDropdown from "../../../../../components/GlobalModels/Filters/StatusDropdown";

import apiClient from "../../../../../app/apiClient";

const STATUS_OPTIONS = [
  "Revert Rejected",
  "Rejected",
  "In Process",
  "Docs Pending",
  "Sanctioned",
  "Disbursed",
];

const NAME_FIELDS = {
  agent: [
    ["agent", true],
    ["processingAgent", true],
    ["agentName"],
    ["agent_name"],
    ["processingAgent"],
    ["processing_agent"],
  ],
  rm: [["rm", true], ["rmName"], ["rm_name"], ["rm"]],
  appliedBy: [
    ["appliedBy", true],
    ["applied_by", true],
    ["createdBy", true],
    ["created_by", true],
    ["appliedBy"],
    ["applied_by"],
    ["createdBy"],
    ["created_by"],
    ["appliedByName"],
    ["applied_by_name"],
  ],
  referral: [
    ["referral", true],
    ["referredBy", true],
    ["referred_by", true],
    ["referrer", true],
    ["referral"],
    ["referralName"],
    ["referral_name"],
    ["referredBy"],
    ["referred_by"],
    ["referrer"],
    ["referrerName"],
    ["referrer_name"],
  ],
};

const getName = (application, fields) => {
  for (const [key, isObject] of fields) {
    const value = application?.[key];

    if (isObject && value && typeof value === "object") {
      return value.name || "N/A";
    }

    if (!isObject && typeof value === "string") {
      return value;
    }
  }

  return "N/A";
};

const getAgentName = (application) => getName(application, NAME_FIELDS.agent);

const getRMName = (application) => getName(application, NAME_FIELDS.rm);

const getAppliedBy = (application) =>
  getName(application, NAME_FIELDS.appliedBy);

const getReferral = (application) => getName(application, NAME_FIELDS.referral);

const getLoanId = (application) =>
  application?.loanId ??
  application?.loan_id ??
  application?.unique_id ??
  application?.id ??
  null;

const getAgentId = (application) =>
  application?.agentId ??
  application?.agent_context_id ??
  application?.processingAgentId ??
  application?.processing_agent_id ??
  application?.agent?.id ??
  application?.processingAgent?.id ??
  null;

const getRevertedReason = (application) =>
  application?.reverted_reason ?? application?.revertedReason ?? null;

const getRevertedDate = (application) =>
  application?.reverted_date ?? application?.revertedDate ?? null;

const getRevertedByName = (application) =>
  application?.reverted_by_name ??
  application?.revertedByName ??
  application?.reverted_by ??
  application?.revertedBy ??
  null;

const getRejectedReason = (application) =>
  application?.rejected_remarks ??
  application?.rejectedRemarks ??
  application?.rejection_reason ??
  application?.rejectionReason ??
  null;

const getRejectedDate = (application) =>
  application?.rejection_date ?? application?.rejectionDate ?? null;

const getRejectedByName = (application) =>
  application?.rejected_by_name ??
  application?.rejectedByName ??
  application?.rejected_by ??
  application?.rejectedBy ??
  null;

const getLoanTypeName = (application, loanTypes = []) => {
  if (typeof application?.loanType === "string") {
    return application.loanType;
  }

  if (typeof application?.loan_type === "string") {
    return application.loan_type;
  }

  const loanTypeId =
    application?.loanTypeId ??
    application?.loan_type_id ??
    application?.loanType?.id ??
    application?.loan_type?.id;

  if (loanTypeId === null || loanTypeId === undefined || loanTypeId === "") {
    return "Not Assigned";
  }

  return (
    loanTypes.find((item) => String(item.id) === String(loanTypeId))?.name ||
    "Not Assigned"
  );
};

const getAmount = (application) => {
  const amount =
    application?.display_amount ??
    application?.loanAmount ??
    application?.loan_amount ??
    application?.loan_amt ??
    application?.amount;

  if (amount === null || amount === undefined || amount === "") {
    return "N/A";
  }

  const numericAmount = Number(
    String(amount).replace(/,/g, "").replace(/₹/g, "").trim(),
  );

  return Number.isNaN(numericAmount)
    ? String(amount)
    : `₹${numericAmount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "N/A";

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
    application?.appliedDate ??
      application?.applied_date ??
      application?.appliedAt ??
      application?.applied_at ??
      application?.createdAt ??
      application?.created_at,
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
  const status = normalizeStatus(application?.status);

  return status === "Rejected" && getRevertedReason(application)
    ? "Revert Rejected"
    : status;
};

const STATUS_CLASSES = {
  "In Process": "text-[#78B300] border-[#8BCF00]/40 bg-[#8BCF00]/10",
  "Docs Pending": "text-orange-600 border-orange-300 bg-orange-50",
  Rejected: "text-error border-error/30 bg-error/5",
  "Revert Rejected": "text-yellow-600 border-yellow-300 bg-yellow-50",
  Sanctioned: "text-blue-600 border-blue-300 bg-blue-50",
  Disbursed: "text-purple-600 border-purple-300 bg-purple-50",
  Login: "text-indigo-600 border-indigo-300 bg-indigo-50",
};

const getStatusClass = (status) =>
  STATUS_CLASSES[normalizeStatus(status)] ||
  "text-base-content/60 border-base-300 bg-base-200/50";

const Cell = ({ children, title, className = "" }) => (
  <span
    title={title ?? String(children ?? "")}
    className={`block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);

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
  onRefresh,
  onAssignmentChange,

  currentPage = 1,
  totalPages = 1,
  totalApplications = 0,
  pageSize = 10,
  onPageChange,
}) {
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedInfoApplication, setSelectedInfoApplication] = useState(null);
  const [infoPopupPosition, setInfoPopupPosition] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatApplication, setSelectedChatApplication] = useState(null);

  const [expandedPhoneId, setExpandedPhoneId] = useState(null);

  const pageSizeValue = Number(pageSize) || 10;

  const statusOptions = statuses?.length ? statuses : STATUS_OPTIONS;

  const startIndex = (currentPage - 1) * pageSizeValue;

  // Backend already returns the requested page.
  const paginatedApplications = applications;

  const handleLoanTypesLoaded = useCallback(
    (options) => setLoanTypes(options || []),
    [],
  );

  const updateApplicationAssignment = async ({
    applicationId,
    rmId,
    agentId,
  }) => {
    const data = {
      application_ids: [applicationId],
    };

    if (rmId !== undefined) data.rm_id = rmId;
    if (agentId !== undefined) data.agent_id = agentId;

    return (
      await apiClient({
        method: "PATCH",
        url: "/shuffle-loans/assign",
        data,
      })
    ).data;
  };

  const getApplicationId = (application) =>
    application?.id ?? application?.loanId ?? application?.loan_id;

  const handleAssignmentChange = async (application, id, field, label) => {
    const applicationId = getApplicationId(application);

    if (!applicationId || id === undefined || id === null || id === "") {
      return;
    }

    try {
      const response = await updateApplicationAssignment({
        applicationId,
        ...(field === "agent" ? { agentId: Number(id) } : { rmId: Number(id) }),
      });

      const updatedApplication = Array.isArray(response)
        ? response[0]
        : response;

      if (updatedApplication && onAssignmentChange) {
        onAssignmentChange(applicationId, updatedApplication);
      }
    } catch (error) {
      console.error(`Failed to update ${label}:`, error);
    }
  };

  const handleAgentChange = (application, id) =>
    handleAssignmentChange(application, id, "agent", "Processing Agent");

  const handleRmChange = (application, id) =>
    handleAssignmentChange(application, id, "rm", "RM");

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

    if (left < viewportPadding) {
      left = viewportPadding;
    }

    let top = rect.bottom + spacing;

    if (top + popupHeight > window.innerHeight - viewportPadding) {
      top = rect.top - popupHeight - spacing;
    }

    if (top < viewportPadding) {
      top = viewportPadding;
    }

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
    const applicationId = getApplicationId(application);

    setExpandedPhoneId((currentId) =>
      currentId === applicationId ? null : applicationId,
    );
  };

  return (
    <div>
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="p-3 flex items-center gap-2 w-full flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/35" />

              <input
                type="text"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, loan ID, email or Agent..."
                className="input input-bordered h-10 min-h-10 w-full pl-9"
              />
            </div>
          </div>

          <div className="w-44 shrink-0">
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

          <div className="w-44 shrink-0">
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

          <div className="w-44 shrink-0">
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

          <div className="w-44 shrink-0">
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

          <div className="w-44 shrink-0">
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

          <button
            type="button"
            onClick={onClearFilters}
            className="btn btn-ghost btn-sm h-10 min-h-10 shrink-0"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onRefresh}
            title="Refresh applications"
            className="btn btn-sm btn-square h-10 min-h-10 shrink-0 border-[#8BCF00] text-[#78B300] hover:bg-[#8BCF00] hover:text-white"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm w-full overflow-hidden mt-3">
        <div className="w-full overflow-x-auto touch-pan-x overscroll-x-contain">
          <table className="w-full min-w-[1300px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[3%]" />
              <col className="w-[10%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
              <col className="w-[8%]" />
            </colgroup>

            <thead>
              <tr className="border-b border-base-300">
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
                    className="px-3 py-3 text-left text-[11px] font-semibold text-base-content/70"
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
                    colSpan="12"
                    className="text-center py-12 text-sm text-base-content/50"
                  >
                    No applications found
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((application, index) => {
                  const applicationId = getApplicationId(application) ?? index;

                  const phone = application.phone || "N/A";

                  const phoneExpanded = expandedPhoneId === applicationId;

                  const status = getApplicationStatus(application);

                  const loanTypeName = getLoanTypeName(application, loanTypes);

                  const agentName = getAgentName(application);

                  const rmName = getRMName(application);

                  const referral = getReferral(application);

                  const amount = getAmount(application);

                  const appliedDate = getAppliedDate(application);

                  return (
                    <tr
                      key={applicationId}
                      className="border-b border-base-300 last:border-b-0 hover:bg-base-200/30"
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
                          onClick={() => onLoanTypeChange?.(application)}
                          title={loanTypeName}
                          className="max-w-full inline-flex items-center px-2.5 py-1 rounded-full border border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#78B300] text-xs font-medium truncate hover:bg-[#8BCF00]/20"
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
                            application.rm?.id ??
                            application.rm_id ??
                            application.rm_context_id ??
                            ""
                          }
                          fallbackLabel={
                            application.rm?.name ?? application.rm_name ?? ""
                          }
                          onChange={(value) =>
                            handleRmChange(application, value)
                          }
                        />
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <AgentDropdown
                          value={
                            application.agent?.id ??
                            application.agent_id ??
                            application.agent_context_id ??
                            ""
                          }
                          fallbackLabel={
                            application.agent?.name ??
                            application.agent_name ??
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
                            title={status}
                            className={`max-w-full shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium truncate hover:opacity-80 ${getStatusClass(
                              status,
                            )}`}
                          >
                            {status}
                          </button>

                          {(status === "Rejected" ||
                            status === "Revert Rejected") && (
                            <button
                              type="button"
                              onClick={(event) =>
                                handleInfoClick(event, application)
                              }
                              title="View rejection details"
                              aria-label="View rejection details"
                              className="shrink-0 text-base-content/50 hover:text-base-content transition-colors"
                            >
                              <InformationCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-2 py-4">
                        <div className="flex items-center justify-center gap-0">
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

      {totalApplications > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <div className="text-sm text-base-content/60">
            {pageSizeValue} rows per page
          </div>

          <div className="text-sm text-base-content/60">
            Showing {startIndex + 1}–
            {Math.min(startIndex + pageSizeValue, totalApplications)} of{" "}
            {totalApplications}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
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

      {selectedInfoApplication &&
        infoPopupPosition &&
        createPortal(
          <div
            className="fixed z-[9999] w-80 rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl"
            style={infoPopupPosition}
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
    </div>
  );
}

export default ApplicationsTable;
