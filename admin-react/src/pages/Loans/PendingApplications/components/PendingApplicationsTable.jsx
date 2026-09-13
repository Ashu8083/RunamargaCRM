// admin-react/src/pages/Loans/PendingApplications/components/PendingApplicationsTable.jsx

import { useCallback, useEffect, useState } from "react";
import { createPortal } from 'react-dom'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'
import ChatBubbleLeftRightIcon from '@heroicons/react/24/outline/ChatBubbleLeftRightIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'

import GlobalChat from '../../../../components/GlobalModels/Loans/GlobalChat'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'
import StatusDropdown from '../../../../components/GlobalModels/Filters/StatusDropdown'


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
    onRefresh,
}) {
    const [loanTypes, setLoanTypes] = useState([]);
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
    // =========================================================
    // CHAT
    // =========================================================

    const [chatOpen, setChatOpen] = useState(false)

    const [
        selectedChatApplication,
        setSelectedChatApplication,
    ] = useState(null)


    // =========================================================
    // REJECTION INFO POPUP
    // =========================================================

    const [
        selectedInfoApplication,
        setSelectedInfoApplication,
    ] = useState(null)

    const [
        infoPopupPosition,
        setInfoPopupPosition,
    ] = useState(null)


    // =========================================================
    // HELPERS
    // =========================================================
    const handleLoanTypesLoaded = useCallback(
        (options) => {
            setLoanTypes(options || []);
        },
        []
    );
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

    const getAgentName = (application) => {
        if (application.agent?.name) {
            return application.agent.name
        }

        if (
            application.processingAgent &&
            typeof application.processingAgent === 'object'
        ) {
            return (
                application.processingAgent.name ||
                'N/A'
            )
        }

        return (
            application.agentName ??
            application.agent_name ??
            application.processingAgent ??
            application.processing_agent ??
            'N/A'
        )
    }


    const getRMName = (application) => {
        if (application.rm?.name) {
            return application.rm.name
        }

        return (
            application.rmName ??
            application.rm_name ??
            (
                typeof application.rm === 'string'
                    ? application.rm
                    : null
            ) ??
            'N/A'
        )
    }


    const getAppliedBy = (application) => {
        if (application.appliedBy?.name) {
            return application.appliedBy.name
        }

        if (application.applied_by?.name) {
            return application.applied_by.name
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

        if (application.createdBy?.name) {
            return application.createdBy.name
        }

        if (application.created_by?.name) {
            return application.created_by.name
        }

        return 'N/A'
    }


    const getReferralName = (application) => {
        if (
            application.referral &&
            typeof application.referral === 'object'
        ) {
            return (
                application.referral.name ||
                'N/A'
            )
        }

        if (
            application.referredBy &&
            typeof application.referredBy === 'object'
        ) {
            return (
                application.referredBy.name ||
                'N/A'
            )
        }

        if (
            application.referrer &&
            typeof application.referrer === 'object'
        ) {
            return (
                application.referrer.name ||
                'N/A'
            )
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
            'N/A'
        )
    }


    const getLoanId = (application) =>
        application.uniqueId ??
        application.unique_id ??
        application.loanId ??
        application.loan_id ??
        application.id ??
        null


    const getAgentId = (application) =>
        application.agentId ??
        application.agent_id ??
        application.processingAgentId ??
        application.processing_agent_id ??
        application.agent?.id ??
        application.processingAgent?.id ??
        null


    // =========================================================
    // REJECTION / REVERT HELPERS
    // =========================================================

    const getRevertedReason = (application) =>
        application.reverted_reason ??
        application.revertedReason ??
        null


    const getRevertedDate = (application) =>
        application.reverted_date ??
        application.revertedDate ??
        null


    const getRevertedByName = (application) =>
        application.reverted_by_name ??
        application.revertedByName ??
        application.reverted_by ??
        application.revertedBy ??
        null


    const getRejectedReason = (application) =>
        application.rejected_remarks ??
        application.rejectedRemarks ??
        application.rejection_reason ??
        application.rejectionReason ??
        null


    const getRejectedDate = (application) =>
        application.rejection_date ??
        application.rejectionDate ??
        null


    const getRejectedByName = (application) =>
        application.rejected_by_name ??
        application.rejectedByName ??
        application.rejected_by ??
        application.rejectedBy ??
        null


    // =========================================================
    // STATUS
    // =========================================================

    const normalizeStatus = (status) =>
        String(status || '')
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')


    const getApplicationStatus = (application) => {
        const status = normalizeStatus(
            application.status
        )

        /*
         * Backend currently stores revert-rejected
         * applications as rejected, but returns
         * reverted_reason / reverted_date.
         *
         * Therefore we display Revert Rejected
         * whenever revert information exists.
         */

        if (
            status === 'rejected' &&
            (
                getRevertedReason(application) ||
                getRevertedDate(application)
            )
        ) {
            return 'Revert Rejected'
        }

        switch (status) {
            case 'inprocess':
            case 'in process':
                return 'In Process'

            case 'docspending':
            case 'docs pending':
            case 'documents pending':
                return 'Docs Pending'

            case 'rejected':
                return 'Rejected'

            case 'revert rejected':
            case 'reverted rejected':
                return 'Revert Rejected'

            case 'sanctioned':
                return 'Sanctioned'

            case 'disbursed':
                return 'Disbursed'

            case 'login':
                return 'Login'

            default:
                return application.status || 'N/A'
        }
    }


    const isRejectedApplication = (application) => {
        const status = getApplicationStatus(
            application
        )

        return (
            status === 'Rejected' ||
            status === 'Revert Rejected'
        )
    }


    const isRevertRejectedApplication = (
        application
    ) => {
        return (
            getApplicationStatus(application) ===
            'Revert Rejected'
        )
    }


    // =========================================================
    // AMOUNT
    // =========================================================

    const getAmount = (application) => {
        const amount =
            application.loanAmt ??
            application.loan_amt ??
            application.loanAmount ??
            application.loan_amount ??
            application.amount

        if (
            amount === null ||
            amount === undefined ||
            amount === ''
        ) {
            return 'N/A'
        }

        const numericAmount = Number(
            String(amount)
                .replace(/,/g, '')
                .replace(/₹/g, '')
        )

        return Number.isNaN(numericAmount)
            ? String(amount)
            : `₹${numericAmount.toLocaleString(
                'en-IN'
            )}`
    }


    // =========================================================
    // DATE
    // =========================================================

    const formatDate = (value) => {
        if (!value) {
            return 'N/A'
        }

        const date = new Date(value)

        if (Number.isNaN(date.getTime())) {
            return String(value)
        }

        return [
            String(date.getDate()).padStart(
                2,
                '0'
            ),
            String(
                date.getMonth() + 1
            ).padStart(2, '0'),
            date.getFullYear(),
        ].join('/')
    }


    const getAppliedDate = (application) =>
        formatDate(
            application.appliedDate ??
            application.applied_date ??
            application.applied_at ??
            application.createdAt ??
            application.created_at
        )


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {
        const normalizedStatus =
            normalizeStatus(status)

        switch (normalizedStatus) {
            case 'inprocess':
            case 'in process':
                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                `

            case 'docs pending':
            case 'docspending':
            case 'documents pending':
                return `
                    text-orange-600
                    border-orange-300
                    bg-orange-50
                `

            case 'rejected':
                return `
                    text-error
                    border-error/30
                    bg-error/5
                `

            case 'revert rejected':
            case 'reverted rejected':
                return `
                    text-amber-600
                    border-amber-300
                    bg-amber-50
                `

            case 'sanctioned':
                return `
                    text-blue-600
                    border-blue-300
                    bg-blue-50
                `

            case 'disbursed':
                return `
                    text-purple-600
                    border-purple-300
                    bg-purple-50
                `

            case 'login':
                return `
                    text-cyan-600
                    border-cyan-300
                    bg-cyan-50
                `

            default:
                return `
                    text-base-content/60
                    border-base-300
                    bg-base-200/50
                `
        }
    }


    // =========================================================
    // REJECTION INFO POPUP
    // =========================================================

    const handleInfoClick = (
        event,
        application
    ) => {
        event.stopPropagation()

        /*
         * Clicking the same application's icon
         * closes the popup.
         */

        if (
            selectedInfoApplication?.id ===
            application.id
        ) {
            setSelectedInfoApplication(null)
            setInfoPopupPosition(null)
            return
        }

        const rect =
            event.currentTarget.getBoundingClientRect()

        const popupWidth = 320
        const popupHeight = 230
        const spacing = 10
        const viewportPadding = 16

        /*
         * Prefer popup on the right side.
         */

        let left =
            rect.right + spacing

        /*
         * If there isn't enough space,
         * move it to the left.
         */

        if (
            left + popupWidth >
            window.innerWidth -
            viewportPadding
        ) {
            left =
                rect.left -
                popupWidth -
                spacing
        }

        if (left < viewportPadding) {
            left = viewportPadding
        }

        /*
         * Vertically align close to the
         * info icon.
         */

        let top =
            rect.top -
            15

        if (
            top + popupHeight >
            window.innerHeight -
            viewportPadding
        ) {
            top =
                window.innerHeight -
                popupHeight -
                viewportPadding
        }

        if (top < viewportPadding) {
            top = viewportPadding
        }

        setSelectedInfoApplication(
            application
        )

        setInfoPopupPosition({
            top,
            left,
        })
    }


    // =========================================================
    // CLOSE INFO POPUP ON SCROLL / RESIZE
    // =========================================================

    useEffect(() => {
        if (!selectedInfoApplication) {
            return
        }

        const closePopup = () => {
            setSelectedInfoApplication(null)
            setInfoPopupPosition(null)
        }

        window.addEventListener(
            'scroll',
            closePopup,
            true
        )

        window.addEventListener(
            'resize',
            closePopup
        )

        return () => {
            window.removeEventListener(
                'scroll',
                closePopup,
                true
            )

            window.removeEventListener(
                'resize',
                closePopup
            )
        }
    }, [selectedInfoApplication])


    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {
        onClearFilters?.()
    }

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
    // FILTER STATUS OPTIONS
    // =========================================================

    const statusOptions =
        statuses?.length
            ? statuses
            : STATUS_OPTIONS;
    // =========================================================
    // CHAT
    // =========================================================

    const handleOpenChat = (application) => {
        setSelectedChatApplication(
            application
        )

        setChatOpen(true)

        onChat?.(application)
    }


    const handleCloseChat = () => {
        setChatOpen(false)

        setSelectedChatApplication(null)
    }


    // =========================================================
    // TABLE CELL
    // =========================================================

    const Cell = ({
        children,
        title,
        className = '',
    }) => (
        <span
            title={
                title ??
                String(children ?? '')
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
    )


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="p-5">

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
                            min-w-[1150px]
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


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-base-300
                                "
                            >

                                {[
                                    '#',
                                    'Name',
                                    'Phone',
                                    'Loan Type',
                                    'Loan Amount',
                                    'Applied Date',
                                    'Applied By',
                                    'Referral',
                                    'RM',
                                    'Processing Agent',
                                    'Status',
                                    'Actions',
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="
                                            px-3
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/70
                                            align-middle
                                        "
                                    >
                                        {heading}
                                    </th>
                                ))}

                            </tr>
                        </thead>


                        {/* =================================================
                            BODY
                        ================================================= */}

                        <tbody>

                            {!applications.length ? (

                                <tr>
                                    <td
                                        colSpan={12}
                                        className="
                                            text-center
                                            py-12
                                            text-sm
                                            text-base-content/50
                                        "
                                    >
                                        No pending applications found
                                    </td>
                                </tr>

                            ) : (

                                applications.map(
                                    (
                                        application,
                                        index
                                    ) => {

                                        const loanTypeName =
                                            getLoanTypeName(
                                                application,
                                                loanTypes
                                            )

                                        const agentName =
                                            getAgentName(
                                                application
                                            )

                                        const rmName =
                                            getRMName(
                                                application
                                            )

                                        const appliedBy =
                                            getAppliedBy(
                                                application
                                            )

                                        const referralName =
                                            getReferralName(
                                                application
                                            )

                                        const amount =
                                            getAmount(
                                                application
                                            )

                                        const appliedDate =
                                            getAppliedDate(
                                                application
                                            )

                                        const displayStatus =
                                            getApplicationStatus(
                                                application
                                            )

                                        return (
                                            <tr
                                                key={
                                                    application.id ??
                                                    application.loanId ??
                                                    index
                                                }
                                                className="
                                                    border-b
                                                    border-base-300
                                                    last:border-b-0
                                                    hover:bg-base-200/30
                                                "
                                            >

                                                {/* # */}

                                                <td className="px-3 py-4 align-middle">
                                                    <Cell
                                                        className="
                                                            text-sm
                                                            text-base-content/70
                                                        "
                                                    >
                                                        {(currentPage - 1) * pageSize + index + 1}
                                                    </Cell>
                                                </td>


                                                {/* NAME */}

                                                <td className="px-3 py-4 align-middle">
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
                                                            'N/A'
                                                        }
                                                    </Cell>
                                                </td>


                                                {/* PHONE */}

                                                <td className="px-3 py-4 align-middle">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1
                                                            min-w-0
                                                        "
                                                    >

                                                        <Cell
                                                            title={
                                                                application.phone
                                                            }
                                                            className="
                                                                text-sm
                                                                flex-1
                                                            "
                                                        >
                                                            {
                                                                application.phone ||
                                                                'N/A'
                                                            }
                                                        </Cell>


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

                                                <td className="px-3 py-4 align-middle">

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

                                                <td className="px-3 py-4 align-middle">

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

                                                <td className="px-3 py-4 align-middle">

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

                                                <td className="px-3 py-4 align-middle">

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

                                                <td className="px-3 py-4 align-middle">

                                                    <Cell
                                                        title={
                                                            referralName
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {
                                                            referralName
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* RM */}

                                                <td className="px-3 py-4 align-middle">

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

                                                <td className="px-3 py-4 align-middle">

                                                    <Cell
                                                        title={
                                                            agentName
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {
                                                            agentName
                                                        }
                                                    </Cell>

                                                </td>


                                                {/* STATUS */}

                                                <td className="
                                                    px-3
                                                    py-4
                                                    align-middle
                                                ">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                            min-w-0
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onStatusChange?.(
                                                                    application
                                                                )
                                                            }
                                                            title={
                                                                displayStatus
                                                            }
                                                            className={`
                                                                min-w-0
                                                                max-w-full
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                px-2.5
                                                                py-1
                                                                rounded-full
                                                                border
                                                                text-xs
                                                                font-medium
                                                                truncate
                                                                hover:opacity-80
                                                                ${getStatusClass(
                                                                displayStatus
                                                            )}
                                                            `}
                                                        >
                                                            <span className="
                                                                truncate
                                                            ">
                                                                {
                                                                    displayStatus
                                                                }
                                                            </span>
                                                        </button>


                                                        {/* INFO ICON */}

                                                        {isRejectedApplication(
                                                            application
                                                        ) && (

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
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-base-content/45
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

                                                <td className="px-2 py-4 align-middle">

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
                                        )
                                    }
                                )
                            )}

                        </tbody>

                    </table>

                </div>
                {/* PAGINATION */}
                {totalApplications > 0 && (
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                            border-t
                            border-base-300
                            px-4
                            py-3
                        "
                    >
                        {/* LEFT */}
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                            <span>Rows per page:</span>

                            <select
                                value={pageSize}
                                onChange={(event) => {
                                    setPageSize(
                                        Number(event.target.value)
                                    )
                                    setCurrentPage(1)
                                }}
                                className="
                                    select
                                    select-bordered
                                    select-sm
                                    w-20
                                "
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        {/* MIDDLE */}
                        <div className="text-sm text-base-content/60">
                            Showing{' '}
                            {(currentPage - 1) * pageSize + 1}
                            {'–'}
                            {Math.min(
                                currentPage * pageSize,
                                totalApplications
                            )}{' '}
                            of {totalApplications}
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage - 1
                                    )
                                }
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={`
                                        btn
                                        btn-sm
                                        ${currentPage === page
                                            ? 'btn-primary'
                                            : 'btn-ghost'
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        currentPage + 1
                                    )
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* =================================================
                GLOBAL CHAT
            ================================================= */}

            {selectedChatApplication && (
                <GlobalChat
                    open={chatOpen}
                    onClose={handleCloseChat}
                    loanId={getLoanId(
                        selectedChatApplication
                    )}
                    agentId={getAgentId(
                        selectedChatApplication
                    )}
                    customerName={
                        selectedChatApplication.name ||
                        'Customer'
                    }
                    customerPhone={
                        selectedChatApplication.phone ||
                        ''
                    }
                />
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

                        <div
                            className="
                                text-sm
                                font-semibold
                                text-base-content
                            "
                        >
                            Rejection Details
                        </div>


                        {/* TYPE */}

                        <div
                            className="
                                mt-3
                                text-sm
                                text-base-content
                            "
                        >
                            <span className="font-semibold">
                                Type:
                            </span>{' '}

                            {
                                isRevertRejectedApplication(
                                    selectedInfoApplication
                                )
                                    ? 'Reverted'
                                    : 'Rejected'
                            }
                        </div>


                        {/* BY */}

                        <div
                            className="
                                mt-1
                                text-sm
                                text-base-content
                            "
                        >
                            <span className="font-semibold">
                                By:
                            </span>{' '}

                            {
                                isRevertRejectedApplication(
                                    selectedInfoApplication
                                )
                                    ? (
                                        getRevertedByName(
                                            selectedInfoApplication
                                        ) ||
                                        '—'
                                    )
                                    : (
                                        getRejectedByName(
                                            selectedInfoApplication
                                        ) ||
                                        '—'
                                    )
                            }
                        </div>


                        {/* DATE */}

                        <div
                            className="
                                mt-1
                                text-sm
                                text-base-content
                            "
                        >
                            <span className="font-semibold">
                                Date:
                            </span>{' '}

                            {
                                formatDate(
                                    isRevertRejectedApplication(
                                        selectedInfoApplication
                                    )
                                        ? getRevertedDate(
                                            selectedInfoApplication
                                        )
                                        : getRejectedDate(
                                            selectedInfoApplication
                                        )
                                )
                            }
                        </div>


                        {/* REMARKS */}

                        <div
                            className="
                                mt-3
                                text-sm
                                leading-5
                                text-base-content
                            "
                        >
                            <span className="font-semibold">
                                Remarks:
                            </span>{' '}

                            <span className="break-words">
                                {
                                    isRevertRejectedApplication(
                                        selectedInfoApplication
                                    )
                                        ? (
                                            getRevertedReason(
                                                selectedInfoApplication
                                            ) ||
                                            '—'
                                        )
                                        : (
                                            getRejectedReason(
                                                selectedInfoApplication
                                            ) ||
                                            '—'
                                        )
                                }
                            </span>
                        </div>

                    </div>,

                    document.body
                )}

        </div>
    )
}


export default PendingApplicationsTable