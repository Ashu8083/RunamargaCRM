import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import GlobalChat from "../../../../components/GlobalModels/Loans/GlobalChat";

import AgentDropdown from "../../../../components/GlobalModels/Filters/AgentDropdown";
import RmDropdown from "../../../../components/GlobalModels/Filters/RmDropdown";
import TeamLeadDropdown from "../../../../components/GlobalModels/Filters/TeamLeadDropdown";
import LoanTypeDropdown from "../../../../components/GlobalModels/Filters/LoanTypeDropdown";
import StatusDropdown from "../../../../components/GlobalModels/Filters/StatusDropdown";


// =============================================================
// CONSTANTS
// =============================================================

const STATUS_OPTIONS = [
    "Revert Rejected",
    "Rejected",
    "In Process",
    "Docs Pending",
    "Sanctioned",
    "Disbursed",
];


// =============================================================
// HELPERS
// =============================================================

const getAgentName = (application) => {

    if (
        application.agent &&
        typeof application.agent === 'object'
    ) {
        return application.agent.name || 'N/A'
    }

    if (
        application.processingAgent &&
        typeof application.processingAgent === 'object'
    ) {
        return application.processingAgent.name || 'N/A'
    }

    if (
        application.agentName &&
        typeof application.agentName === 'string'
    ) {
        return application.agentName
    }

    if (
        application.agent_name &&
        typeof application.agent_name === 'string'
    ) {
        return application.agent_name
    }

    if (
        typeof application.processingAgent === 'string'
    ) {
        return application.processingAgent
    }

    if (
        typeof application.processing_agent === 'string'
    ) {
        return application.processing_agent
    }

    return 'N/A'
}


const getRMName = (application) => {

    if (
        application.rm &&
        typeof application.rm === 'object'
    ) {
        return application.rm.name || 'N/A'
    }

    if (
        typeof application.rmName === 'string'
    ) {
        return application.rmName
    }

    if (
        typeof application.rm_name === 'string'
    ) {
        return application.rm_name
    }

    if (
        typeof application.rm === 'string'
    ) {
        return application.rm
    }

    return 'N/A'
}


const getTeamLeadName = (application) => {

    if (
        application.teamLead &&
        typeof application.teamLead === 'object'
    ) {
        return application.teamLead.name || 'N/A'
    }

    if (
        application.team_lead &&
        typeof application.team_lead === 'object'
    ) {
        return application.team_lead.name || 'N/A'
    }

    if (
        typeof application.teamLeadName === 'string'
    ) {
        return application.teamLeadName
    }

    if (
        typeof application.team_lead_name === 'string'
    ) {
        return application.team_lead_name
    }

    return 'N/A'
}
const getAppliedBy = (application) => {

    if (
        application.appliedBy &&
        typeof application.appliedBy === 'object'
    ) {
        return application.appliedBy.name || 'N/A'
    }

    if (
        application.applied_by &&
        typeof application.applied_by === 'object'
    ) {
        return application.applied_by.name || 'N/A'
    }

    if (
        application.createdBy &&
        typeof application.createdBy === 'object'
    ) {
        return application.createdBy.name || 'N/A'
    }

    if (
        application.created_by &&
        typeof application.created_by === 'object'
    ) {
        return application.created_by.name || 'N/A'
    }

    if (
        typeof application.appliedBy === 'string'
    ) {
        return application.appliedBy
    }

    if (
        typeof application.applied_by === 'string'
    ) {
        return application.applied_by
    }

    if (
        typeof application.createdBy === 'string'
    ) {
        return application.createdBy
    }

    if (
        typeof application.created_by === 'string'
    ) {
        return application.created_by
    }

    if (
        typeof application.appliedByName === 'string'
    ) {
        return application.appliedByName
    }

    if (
        typeof application.applied_by_name === 'string'
    ) {
        return application.applied_by_name
    }

    return 'N/A'
}

const getReferral = (application) => {

    if (
        application.referral &&
        typeof application.referral === 'object'
    ) {
        return application.referral.name || 'N/A'
    }

    if (
        application.referredBy &&
        typeof application.referredBy === 'object'
    ) {
        return application.referredBy.name || 'N/A'
    }

    if (
        application.referred_by &&
        typeof application.referred_by === 'object'
    ) {
        return application.referred_by.name || 'N/A'
    }

    if (
        application.referrer &&
        typeof application.referrer === 'object'
    ) {
        return application.referrer.name || 'N/A'
    }

    if (
        typeof application.referral === 'string'
    ) {
        return application.referral
    }

    if (
        typeof application.referralName === 'string'
    ) {
        return application.referralName
    }

    if (
        typeof application.referral_name === 'string'
    ) {
        return application.referral_name
    }

    if (
        typeof application.referredBy === 'string'
    ) {
        return application.referredBy
    }

    if (
        typeof application.referred_by === 'string'
    ) {
        return application.referred_by
    }

    if (
        typeof application.referrer === 'string'
    ) {
        return application.referrer
    }

    if (
        typeof application.referrerName === 'string'
    ) {
        return application.referrerName
    }

    if (
        typeof application.referrer_name === 'string'
    ) {
        return application.referrer_name
    }

    return 'N/A'
}
const getLoanId = (application) =>
    application.loanId ??
    application.loan_id ??
    application.unique_id ??
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


// =============================================================
// REJECTION HELPERS
// =============================================================

const getRevertedReason = (application) =>
    application.reverted_reason ??
    application.revertedReason ??
    null;


const getRevertedDate = (application) =>
    application.reverted_date ??
    application.revertedDate ??
    null;


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
    application.rejection_date ??
    application.rejectionDate ??
    null;


const getRejectedByName = (application) =>
    application.rejected_by_name ??
    application.rejectedByName ??
    application.rejected_by ??
    application.rejectedBy ??
    null;


// =============================================================
// LOAN TYPE
// =============================================================

const getLoanTypeName = (
    application,
    loanTypes = []
) => {

    if (
        application.loanType &&
        typeof application.loanType === "string"
    ) {
        return application.loanType;
    }

    if (
        application.loan_type &&
        typeof application.loan_type === "string"
    ) {
        return application.loan_type;
    }

    const loanTypeId =
        application.loanTypeId ??
        application.loan_type_id ??
        application.loanType?.id ??
        application.loan_type?.id;

    if (
        loanTypeId === null ||
        loanTypeId === undefined ||
        loanTypeId === ""
    ) {
        return "Not Assigned";
    }

    const loanType = loanTypes.find(
        (item) =>
            String(item.id) ===
            String(loanTypeId)
    );

    return loanType?.name || "Not Assigned";
};


// =============================================================
// AMOUNT
// =============================================================

const getAmount = (application) => {

    const amount =
        application.loanAmount ??
        application.loan_amount ??
        application.loan_amt ??
        application.amount;

    if (
        amount === null ||
        amount === undefined ||
        amount === ""
    ) {
        return "N/A";
    }

    const numericAmount = Number(
        String(amount)
            .replace(/,/g, "")
            .replace(/₹/g, "")
            .trim()
    );

    if (Number.isNaN(numericAmount)) {
        return String(amount);
    }

    return `₹${numericAmount.toLocaleString("en-IN")}`;
};


// =============================================================
// DATE
// =============================================================

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
        application.appliedAt ??
        application.applied_at ??
        application.createdAt ??
        application.created_at
    );


// =============================================================
// STATUS
// =============================================================

const normalizeStatus = (value) => {

    if (!value) {
        return "N/A";
    }

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


// =============================================================
// DISPLAY STATUS
// =============================================================

const getApplicationStatus = (application) => {

    const baseStatus =
        normalizeStatus(
            application.status
        );

    const revertedReason =
        getRevertedReason(
            application
        );

    if (
        baseStatus === "Rejected" &&
        revertedReason
    ) {
        return "Revert Rejected";
    }

    return baseStatus;
};


// =============================================================
// STATUS CLASS
// =============================================================

const getStatusClass = (status) => {

    switch (normalizeStatus(status)) {

        case "In Process":
            return `
                text-[#78B300]
                border-[#8BCF00]/40
                bg-[#8BCF00]/10
            `;

        case "Docs Pending":
            return `
                text-orange-600
                border-orange-300
                bg-orange-50
            `;

        case "Rejected":
            return `
                text-error
                border-error/30
                bg-error/5
            `;

        case "Revert Rejected":
            return `
                text-yellow-600
                border-yellow-300
                bg-yellow-50
            `;

        case "Sanctioned":
            return `
                text-blue-600
                border-blue-300
                bg-blue-50
            `;

        case "Disbursed":
            return `
                text-purple-600
                border-purple-300
                bg-purple-50
            `;

        default:
            return `
                text-base-content/60
                border-base-300
                bg-base-200/50
            `;
    }
};


// =============================================================
// TABLE CELL
// =============================================================

function Cell({
    children,
    title,
    className = "",
}) {

    return (
        <span
            title={
                title ??
                String(children ?? "")
            }
            className={`
                block
                min-w-0
                overflow-hidden
                text-ellipsis
                whitespace-nowrap
                ${className}
            `}
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
    onRefresh,
}) {
    const [loanTypes, setLoanTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // =========================================================
    // STATE
    // =========================================================

    const [
        selectedInfoApplication,
        setSelectedInfoApplication,
    ] = useState(null);

    const [
        infoPopupPosition,
        setInfoPopupPosition,
    ] = useState(null);

    const [
        chatOpen,
        setChatOpen,
    ] = useState(false);

    const [
        selectedChatApplication,
        setSelectedChatApplication,
    ] = useState(null);

    const [
        expandedPhoneId,
        setExpandedPhoneId,
    ] = useState(null);
    const handleLoanTypesLoaded = useCallback(
        (options) => {
            setLoanTypes(options || []);
        },
        []
    );

    // =========================================================
    // INFO POPUP
    // =========================================================

    const handleInfoClick = (
        event,
        application
    ) => {

        const rect =
            event.currentTarget.getBoundingClientRect();

        const popupWidth = 320;
        const popupHeight = 280;
        const spacing = 10;
        const viewportPadding = 16;

        let left =
            rect.right + spacing;

        if (
            left + popupWidth >
            window.innerWidth -
            viewportPadding
        ) {
            left =
                rect.left -
                popupWidth -
                spacing;
        }

        if (left < viewportPadding) {
            left = viewportPadding;
        }

        let top =
            rect.bottom + spacing;

        if (
            top + popupHeight >
            window.innerHeight -
            viewportPadding
        ) {
            top =
                rect.top -
                popupHeight -
                spacing;
        }

        if (top < viewportPadding) {
            top = viewportPadding;
        }

        const isSameApplication =
            selectedInfoApplication?.id ===
            application.id;

        if (isSameApplication) {

            setSelectedInfoApplication(
                null
            );

            setInfoPopupPosition(
                null
            );

            return;
        }

        setSelectedInfoApplication(
            application
        );

        setInfoPopupPosition({
            top,
            left,
        });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        selectedLoanType,
        selectedRM,
        selectedTeamLead,
        selectedAgent,
        selectedStatus,
    ]);
    // =========================================================
    // CLOSE POPUP ON SCROLL / RESIZE
    // =========================================================

    useEffect(() => {

        if (!selectedInfoApplication) {
            return;
        }

        const closePopup = () => {

            setSelectedInfoApplication(
                null
            );

            setInfoPopupPosition(
                null
            );
        };

        window.addEventListener(
            "scroll",
            closePopup,
            true
        );

        window.addEventListener(
            "resize",
            closePopup
        );

        return () => {

            window.removeEventListener(
                "scroll",
                closePopup,
                true
            );

            window.removeEventListener(
                "resize",
                closePopup
            );
        };

    }, [selectedInfoApplication]);


    // =========================================================
    // FILTER STATUS OPTIONS
    // =========================================================

    const statusOptions =
        statuses?.length
            ? statuses
            : STATUS_OPTIONS;


    // =========================================================
    // CHAT
    // =========================================================

    const handleOpenChat = (
        application
    ) => {

        setSelectedChatApplication(
            application
        );

        setChatOpen(true);

        onChat?.(application);
    };


    const handleCloseChat = () => {

        setChatOpen(false);

        setSelectedChatApplication(
            null
        );
    };


    // =========================================================
    // PHONE
    // =========================================================

    const handlePhoneClick = (
        application
    ) => {

        const applicationId =
            application.id ??
            application.loanId ??
            application.loan_id;

        setExpandedPhoneId(
            (currentId) =>
                currentId === applicationId
                    ? null
                    : applicationId
        );
    };

    const totalPages = Math.ceil(
        applications.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedApplications =
        applications.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange = (
        event
    ) => {

        setSearch(
            event.target.value
        );
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="">

            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="
                    card
                    bg-base-100
                    border
                    border-base-300
                    shadow-sm
                "
            >

                <div
                    className="
                        p-3
                        flex
                        items-center
                        gap-2
                        w-full
                    "
                >

                    {/* SEARCH */}

                    <div className="flex-1 min-w-0">

                        <div className="relative">

                            <SearchIcon
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-base-content/35
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={
                                    handleSearchChange
                                }
                                placeholder="
                                    Search name, loan ID, email or Agent...
                                "
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    pl-9
                                "
                            />

                        </div>

                    </div>


                    {/* LOAN TYPE */}

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

                    {/* RM */}

                    <div className="w-44 shrink-0">

                        {/* RM */}

                        <RmDropdown
                            label=""
                            value={selectedRM}
                            onChange={setSelectedRM}
                            allLabel="All RMs"
                            placeholder="All RMs"
                            searchPlaceholder="Search RM"
                            emptyMessage="No RMs found"
                        />

                    </div>


                    {/* TEAM LEAD */}

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


                    {/* AGENT */}

                    <div className="w-44 shrink-0">
                        <AgentDropdown
                            label=""
                            value={selectedAgent}
                            onChange={setSelectedAgent}
                            allLabel="All Agents"
                            placeholder="All Agents"
                            searchPlaceholder="Search Agent"
                            emptyMessage="No Agents found"
                        />

                    </div>
                    {/* STATUS */}

                    <div className="w-44 shrink-0">

                        <StatusDropdown
                            label=""
                            value={
                                selectedStatus
                            }
                            onChange={
                                setSelectedStatus
                            }
                            options={
                                statusOptions
                            }
                            allLabel="All Statuses"
                            placeholder="All Statuses"
                            searchPlaceholder="Search status"
                            emptyMessage="No statuses found"
                        />

                    </div>


                    {/* CLEAR */}

                    <button
                        type="button"
                        onClick={
                            onClearFilters
                        }
                        className="
                            btn
                            btn-ghost
                            btn-sm
                            h-10
                            min-h-10
                            shrink-0
                        "
                    >
                        Clear
                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={
                            onRefresh
                        }
                        title="Refresh applications"
                        className="
                            btn
                            btn-sm
                            btn-square
                            h-10
                            min-h-10
                            shrink-0
                            border-[#8BCF00]
                            text-[#78B300]
                            hover:bg-[#8BCF00]
                            hover:text-white
                        "
                    >
                        <ArrowPathIcon
                            className="w-4 h-4"
                        />
                    </button>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="
                    card
                    bg-base-100
                    border
                    border-base-300
                    shadow-sm
                    w-full
                    overflow-hidden
                "
            >

                <div
                    className="
                        w-full
                        overflow-x-auto
                        touch-pan-x
                        overscroll-x-contain
                    "
                >

                    <table
                        className="
                            w-full
                            min-w-[1300px]
                            table-fixed
                            border-collapse
                        "
                    >

                        <colgroup>

                            {/* # */}
                            <col className="w-[3%]" />

                            {/* Name */}
                            <col className="w-[10%]" />

                            {/* Phone */}
                            <col className="w-[8%]" />

                            {/* Loan Type */}
                            <col className="w-[7%]" />

                            {/* Loan Amount */}
                            <col className="w-[7%]" />

                            {/* Applied Date */}
                            <col className="w-[7%]" />

                            {/* Applied By */}
                            <col className="w-[8%]" />

                            {/* Referral */}
                            <col className="w-[7%]" />

                            {/* RM */}
                            <col className="w-[7%]" />

                            {/* Processing Agent */}
                            <col className="w-[9%]" />

                            {/* Status */}
                            <col className="w-[11%]" />

                            {/* Actions */}
                            <col className="w-[7%]" />

                        </colgroup>


                        {/* HEADER */}

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                            ">

                                {[
                                    "#",
                                    "Name",
                                    "Phone",
                                    "Loan Type",
                                    "Loan Amount",
                                    "Applied Date",
                                    "Applied By",
                                    "Referral",
                                    "RM",
                                    "Processing Agent",
                                    "Status",
                                    "Actions",
                                ].map(
                                    (heading) => (

                                        <th
                                            key={
                                                heading
                                            }
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                text-[11px]
                                                font-semibold
                                                text-base-content/70
                                            "
                                        >
                                            {heading}
                                        </th>

                                    )
                                )}

                            </tr>

                        </thead>


                        {/* BODY */}

                        <tbody>

                            {!applications.length ? (

                                <tr>

                                    <td
                                        colSpan="12"
                                        className="
                                            text-center
                                            py-12
                                            text-sm
                                            text-base-content/50
                                        "
                                    >
                                        No applications found
                                    </td>

                                </tr>

                            ) : (

                                paginatedApplications.map(
                                    (
                                        application,
                                        index
                                    ) => {

                                        const applicationId =
                                            application.id ??
                                            application.loanId ??
                                            application.loan_id ??
                                            index;


                                        const phone =
                                            application.phone ||
                                            "N/A";


                                        const phoneExpanded =
                                            expandedPhoneId ===
                                            applicationId;


                                        const status =
                                            getApplicationStatus(
                                                application
                                            );


                                        const loanTypeName =
                                            getLoanTypeName(
                                                application,
                                                loanTypes
                                            );


                                        const agentName =
                                            getAgentName(
                                                application
                                            );


                                        const rmName =
                                            getRMName(
                                                application
                                            );


                                        const appliedBy =
                                            getAppliedBy(
                                                application
                                            );


                                        const referral =
                                            getReferral(
                                                application
                                            );


                                        const amount =
                                            getAmount(
                                                application
                                            );


                                        const appliedDate =
                                            getAppliedDate(
                                                application
                                            );


                                        return (

                                            <tr
                                                key={
                                                    applicationId
                                                }
                                                className="
                                                    border-b
                                                    border-base-300
                                                    last:border-b-0
                                                    hover:bg-base-200/30
                                                "
                                            >

                                                {/* # */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        className="
                                                            text-sm
                                                            text-base-content/70
                                                        "
                                                    >
                                                        {startIndex + index + 1}
                                                    </Cell>

                                                </td>


                                                {/* NAME */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        title={
                                                            application.name
                                                        }
                                                        className="
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        {
                                                            application.name ||
                                                            "N/A"
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* PHONE */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1
                                                            min-w-0
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handlePhoneClick(
                                                                    application
                                                                )
                                                            }
                                                            title={
                                                                phoneExpanded
                                                                    ? "Collapse phone number"
                                                                    : "Show full phone number"
                                                            }
                                                            className="
                                                                min-w-0
                                                                flex-1
                                                                text-left
                                                                text-sm
                                                                hover:text-[#78B300]
                                                            "
                                                        >

                                                            <span
                                                                className={
                                                                    phoneExpanded
                                                                        ? "break-all"
                                                                        : "block truncate"
                                                                }
                                                            >
                                                                {
                                                                    phone
                                                                }
                                                            </span>

                                                        </button>


                                                        {application.phone && (

                                                            <a
                                                                href={`tel:${application.phone}`}
                                                                title={`Call ${application.name ||
                                                                    application.phone
                                                                    }`}
                                                                aria-label={`Call ${application.name ||
                                                                    application.phone
                                                                    }`}
                                                                className="
                                                                    btn
                                                                    btn-ghost
                                                                    btn-xs
                                                                    btn-square
                                                                    shrink-0
                                                                    rounded-full
                                                                    text-[#78B300]
                                                                    hover:bg-[#8BCF00]/10
                                                                "
                                                            >

                                                                <PhoneIcon
                                                                    className="
                                                                        w-4
                                                                        h-4
                                                                    "
                                                                />

                                                            </a>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* LOAN TYPE */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onLoanTypeChange?.(
                                                                application
                                                            )
                                                        }
                                                        title={
                                                            loanTypeName
                                                        }
                                                        className="
                                                            max-w-full
                                                            inline-flex
                                                            items-center
                                                            px-2.5
                                                            py-1
                                                            rounded-full
                                                            border
                                                            border-[#8BCF00]/40
                                                            bg-[#8BCF00]/10
                                                            text-[#78B300]
                                                            text-xs
                                                            font-medium
                                                            truncate
                                                            hover:bg-[#8BCF00]/20
                                                        "
                                                    >
                                                        {
                                                            loanTypeName
                                                        }
                                                    </button>

                                                </td>


                                                {/* LOAN AMOUNT */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        title={
                                                            amount
                                                        }
                                                        className="
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        {
                                                            amount
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* APPLIED DATE */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        title={
                                                            appliedDate
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {
                                                            appliedDate
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* APPLIED BY */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        title={
                                                            appliedBy
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {
                                                            appliedBy
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* REFERRAL */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        title={
                                                            referral
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {
                                                            referral
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* RM */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                ">

                                                    <Cell
                                                        title={
                                                            rmName
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {
                                                            rmName
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* PROCESSING AGENT */}

                                                <td className="
    px-3
    py-4
    align-middle
">
                                                    <Cell
                                                        title={agentName}
                                                        className="
            text-sm
            text-left
        "
                                                    >
                                                        {agentName}
                                                    </Cell>
                                                </td>


                                                {/* STATUS */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                    align-middle
                                                ">

                                                    <div className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                            min-w-0
                                                        ">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onStatusChange?.(
                                                                    application
                                                                )
                                                            }
                                                            title={
                                                                status
                                                            }
                                                            className={`
                                                                    max-w-full
                                                                    shrink-0
                                                                    inline-flex
                                                                    items-center
                                                                    px-2.5
                                                                    py-1
                                                                    rounded-full
                                                                    border
                                                                    text-xs
                                                                    font-medium
                                                                    truncate
                                                                    hover:opacity-80
                                                                    ${getStatusClass(status)}
                                                                `}
                                                        >
                                                            {status}
                                                        </button>


                                                        {(status === "Rejected" ||
                                                            status === "Revert Rejected") && (

                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        handleInfoClick(
                                                                            event,
                                                                            application
                                                                        )
                                                                    }
                                                                    title="View rejection details"
                                                                    aria-label="View rejection details"
                                                                    className="
                                                                    shrink-0
                                                                    text-base-content/50
                                                                    hover:text-base-content
                                                                    transition-colors
                                                                "
                                                                >

                                                                    <InformationCircleIcon
                                                                        className="
                                                                        h-4
                                                                        w-4
                                                                    "
                                                                    />

                                                                </button>

                                                            )}

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="
                                                    px-2
                                                    py-4
                                                ">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-0
                                                        "
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onViewApplication?.(
                                                                    application
                                                                )
                                                            }
                                                            title="View application"
                                                            className="
                                                                btn
                                                                btn-ghost
                                                                btn-sm
                                                                btn-square
                                                                hover:bg-[#8BCF00]/10
                                                                hover:text-[#78B300]
                                                            "
                                                        >

                                                            <EyeIcon
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                "
                                                            />

                                                        </button>


                                                        {/* REMINDER */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onReminder?.(
                                                                    application
                                                                )
                                                            }
                                                            title="Add reminder"
                                                            className="
                                                                btn
                                                                btn-ghost
                                                                btn-sm
                                                                btn-square
                                                                hover:bg-[#8BCF00]/10
                                                                hover:text-[#78B300]
                                                            "
                                                        >

                                                            <BellAlertIcon
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                "
                                                            />

                                                        </button>


                                                        {/* CHAT */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenChat(
                                                                    application
                                                                )
                                                            }
                                                            title="Open chat"
                                                            className="
                                                                btn
                                                                btn-ghost
                                                                btn-sm
                                                                btn-square
                                                                hover:bg-[#8BCF00]/10
                                                                hover:text-[#78B300]
                                                            "
                                                        >

                                                            <ChatBubbleLeftRightIcon
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                "
                                                            />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {totalPages > 1 && (
                <div className="
        flex
        items-center
        justify-end
        gap-3
        mt-3
    ">
                    <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.max(page - 1, 1)
                            )
                        }
                    >
                        Previous
                    </button>

                    <span className="
            text-sm
            text-base-content/60
        ">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(
                                    page + 1,
                                    totalPages
                                )
                            )
                        }
                    >
                        Next
                    </button>
                </div>
            )}
            {/* =================================================
                REJECTION DETAILS POPUP
            ================================================= */}

            {selectedInfoApplication &&
                infoPopupPosition &&
                createPortal(

                    <div
                        className="
                            fixed
                            z-[9999]
                            w-80
                            rounded-xl
                            border
                            border-base-300
                            bg-base-100
                            p-4
                            shadow-xl
                        "
                        style={{
                            top:
                                infoPopupPosition.top,
                            left:
                                infoPopupPosition.left,
                        }}
                    >

                        {/* TITLE */}

                        <div className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            Rejection Details
                        </div>


                        {/* TYPE */}

                        <div className="
                            mt-3
                            text-sm
                            text-base-content
                        ">

                            <span className="font-semibold">
                                Type:
                            </span>{" "}

                            {getRevertedReason(
                                selectedInfoApplication
                            )
                                ? "Reverted"
                                : "Rejected"}

                        </div>


                        {/* BY */}

                        <div className="
                            mt-1
                            text-sm
                            text-base-content
                        ">

                            <span className="font-semibold">
                                By:
                            </span>{" "}

                            {getRevertedReason(
                                selectedInfoApplication
                            )
                                ? (
                                    getRevertedByName(
                                        selectedInfoApplication
                                    ) || "—"
                                )
                                : (
                                    getRejectedByName(
                                        selectedInfoApplication
                                    ) || "—"
                                )}

                        </div>


                        {/* DATE */}

                        <div className="
                            mt-1
                            text-sm
                            text-base-content
                        ">

                            <span className="font-semibold">
                                Date:
                            </span>{" "}

                            {formatDate(
                                getRevertedReason(
                                    selectedInfoApplication
                                )
                                    ? getRevertedDate(
                                        selectedInfoApplication
                                    )
                                    : getRejectedDate(
                                        selectedInfoApplication
                                    )
                            )}

                        </div>


                        {/* REMARKS */}

                        <div className="
                            mt-3
                            text-sm
                            leading-5
                            text-base-content
                        ">

                            <span className="font-semibold">
                                Remarks:
                            </span>{" "}

                            <span className="
                                break-words
                            ">
                                {getRevertedReason(
                                    selectedInfoApplication
                                )
                                    ? (
                                        getRevertedReason(
                                            selectedInfoApplication
                                        ) || "—"
                                    )
                                    : (
                                        getRejectedReason(
                                            selectedInfoApplication
                                        ) || "—"
                                    )}
                            </span>

                        </div>

                    </div>,

                    document.body

                )}


            {/* =================================================
                GLOBAL CHAT
            ================================================= */}

            {selectedChatApplication && (

                <GlobalChat
                    open={
                        chatOpen
                    }
                    onClose={
                        handleCloseChat
                    }
                    loanId={
                        getLoanId(
                            selectedChatApplication
                        )
                    }
                    agentId={
                        getAgentId(
                            selectedChatApplication
                        )
                    }
                    customerName={
                        selectedChatApplication.name ||
                        "Customer"
                    }
                    customerPhone={
                        selectedChatApplication.phone ||
                        ""
                    }
                />

            )}

        </div>
    );
}


export default ApplicationsTable;