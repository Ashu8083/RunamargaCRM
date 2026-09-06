// admin-react/src/pages/Loans/PendingApplications/components/PendingApplicationsTable.jsx

import { useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'
import ChatBubbleLeftRightIcon from '@heroicons/react/24/outline/ChatBubbleLeftRightIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'

import GlobalChat from '../../../../components/GlobalModels/Loans/GlobalChat'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'
import StatusDropdown from '../../../../components/GlobalModels/Filters/StatusDropdown'


function PendingApplicationsTable({
    applications = [],

    search,
    setSearch,

    loanTypes = [],
    rms = [],
    teamLeads = [],
    agents = [],
    statuses = [],

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
    // =========================================================
    // CHAT
    // =========================================================

    const [chatOpen, setChatOpen] = useState(false)
    const [selectedChatApplication, setSelectedChatApplication] =
        useState(null)


    // =========================================================
    // HELPERS
    // =========================================================

    const getLoanTypeName = (application) => {
        /*
         * Backend now returns loan_type_id.
         * Resolve that ID using the common loanTypes list.
         */

        const loanTypeId =
            application.loanTypeId ??
            application.loan_type_id

        const loanType = loanTypes.find(
            (item) =>
                String(item.id) ===
                String(loanTypeId)
        )

        if (loanType?.name) {
            return loanType.name
        }

        /*
         * Fallback in case the API already sends
         * a loan type object or name.
         */

        if (
            application.loanType &&
            typeof application.loanType === 'object'
        ) {
            return application.loanType.name || 'N/A'
        }

        if (
            application.loan_type &&
            typeof application.loan_type === 'object'
        ) {
            return application.loan_type.name || 'N/A'
        }

        if (
            typeof application.loanType === 'string'
        ) {
            return application.loanType
        }

        if (
            typeof application.loan_type === 'string'
        ) {
            return application.loan_type
        }

        return 'Not Assigned'
    }


    const getAgentName = (application) => {
        if (application.agent?.name) {
            return application.agent.name
        }

        if (
            application.processingAgent &&
            typeof application.processingAgent === 'object'
        ) {
            return application.processingAgent.name || 'N/A'
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

        if (
            application.createdBy?.name
        ) {
            return application.createdBy.name
        }

        if (
            application.created_by?.name
        ) {
            return application.created_by.name
        }

        return 'N/A'
    }


    const getReferralName = (application) => {
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
            application.referrer &&
            typeof application.referrer === 'object'
        ) {
            return application.referrer.name || 'N/A'
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
            : `₹${numericAmount.toLocaleString('en-IN')}`
    }


    const formatDate = (value) => {
        if (!value) {
            return 'N/A'
        }

        const date = new Date(value)

        if (Number.isNaN(date.getTime())) {
            return String(value)
        }

        return [
            String(date.getDate()).padStart(2, '0'),
            String(date.getMonth() + 1).padStart(2, '0'),
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


    const getStatusClass = (status) => {
        const normalizedStatus = String(
            status || ''
        )
            .trim()
            .toLowerCase()

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
            case 'revert_rejected':
                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
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

            default:
                return `
                    text-base-content/60
                    border-base-300
                    bg-base-200/50
                `
        }
    }


    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {
        onClearFilters?.()
    }


    // =========================================================
    // CHAT
    // =========================================================

    const handleOpenChat = (application) => {
        setSelectedChatApplication(application)
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
        <div className="space-y-4">

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

                    <div className="flex-1">
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
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search name, loan ID, email or RM, Agent..."
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

                    <LoanTypeDropdown
                        value={selectedLoanType}
                        onChange={setSelectedLoanType}
                        options={loanTypes}
                        showLabel={false}
                        className="w-44 shrink-0"
                    />


                    {/* RM */}

                    <RmDropdown
                        label=""
                        value={selectedRM}
                        onChange={setSelectedRM}
                        options={rms}
                        allLabel="All RMs"
                        placeholder="All RMs"
                        searchPlaceholder="Search RM"
                        emptyMessage="No RMs found"
                    />


                    {/* TEAM LEAD */}

                    <TeamLeadDropdown
                        label=""
                        value={selectedTeamLead}
                        onChange={setSelectedTeamLead}
                        options={teamLeads}
                        allLabel="All Team Leads"
                        placeholder="All Team Leads"
                        searchPlaceholder="Search team lead"
                        emptyMessage="No team leads found"
                    />


                    {/* AGENT */}

                    <AgentDropdown
                        value={selectedAgent}
                        onChange={setSelectedAgent}
                        options={agents}
                        showLabel={false}
                        className="w-48 shrink-0"
                    />


                    {/* STATUS */}

                    <StatusDropdown
                        label=""
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={statuses}
                        allLabel="All Statuses"
                        placeholder="All Statuses"
                        searchPlaceholder="Search status"
                        emptyMessage="No statuses found"
                    />


                    {/* CLEAR */}

                    <button
                        type="button"
                        onClick={handleClear}
                        className="
                            btn
                            btn-ghost
                            btn-sm
                            shrink-0
                        "
                    >
                        Clear
                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={onRefresh}
                        title="Refresh pending applications"
                        className="
                            btn
                            btn-sm
                            btn-square
                            shrink-0
                            border-[#8BCF00]
                            text-[#78B300]
                            hover:bg-[#8BCF00]
                            hover:text-white
                        "
                    >
                        <ArrowPathIcon className="w-4 h-4" />
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
                            <col className="w-[3%]" />
                            <col className="w-[10%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[8%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[8%]" />
                            <col className="w-[9%]" />
                            <col className="w-[7%]" />
                            <col className="w-[10%]" />
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
                                    (application, index) => {

                                        const loanTypeName =
                                            getLoanTypeName(
                                                application
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

                                                <td className="px-3 py-4">
                                                    <Cell
                                                        className="
                                                            text-sm
                                                            text-base-content/70
                                                        "
                                                    >
                                                        {index + 1}
                                                    </Cell>
                                                </td>


                                                {/* NAME */}

                                                <td className="px-3 py-4">
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

                                                <td className="px-3 py-4">

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
                                                                title={`Call ${
                                                                    application.name ||
                                                                    application.phone
                                                                }`}
                                                                aria-label={`Call ${
                                                                    application.name ||
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

                                                <td className="px-3 py-4">

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
                                                        {loanTypeName}
                                                    </button>

                                                </td>


                                                {/* LOAN AMOUNT */}

                                                <td className="px-3 py-4">

                                                    <Cell
                                                        title={amount}
                                                        className="
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        {amount}
                                                    </Cell>

                                                </td>


                                                {/* APPLIED DATE */}

                                                <td className="px-3 py-4">

                                                    <Cell
                                                        title={appliedDate}
                                                        className="text-sm"
                                                    >
                                                        {appliedDate}
                                                    </Cell>

                                                </td>


                                                {/* APPLIED BY */}

                                                <td className="px-3 py-4">

                                                    <Cell
                                                        title={appliedBy}
                                                        className="text-sm"
                                                    >
                                                        {appliedBy}
                                                    </Cell>

                                                </td>


                                                {/* REFERRAL */}

                                                <td className="px-3 py-4">

                                                    <Cell
                                                        title={
                                                            referralName
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {referralName}
                                                    </Cell>

                                                </td>


                                                {/* RM */}

                                                <td className="px-3 py-4">

                                                    <Cell
                                                        title={rmName}
                                                        className="text-sm"
                                                    >
                                                        {rmName}
                                                    </Cell>

                                                </td>


                                                {/* PROCESSING AGENT */}

                                                <td className="px-3 py-4">

                                                    <Cell
                                                        title={
                                                            agentName
                                                        }
                                                        className="text-sm"
                                                    >
                                                        {agentName}
                                                    </Cell>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-3 py-4">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onStatusChange?.(
                                                                application
                                                            )
                                                        }
                                                        title={
                                                            application.status ||
                                                            'N/A'
                                                        }
                                                        className={`
                                                            max-w-full
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
                                                            ${getStatusClass(
                                                                application.status
                                                            )}
                                                        `}
                                                    >
                                                        {
                                                            application.status ||
                                                            'N/A'
                                                        }
                                                    </button>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-2 py-4">

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

        </div>
    )
}


export default PendingApplicationsTable