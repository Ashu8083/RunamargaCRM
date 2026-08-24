// admin-react/src/pages/Loans/PendingApplications/components/PendingApplicationsTable.jsx

import { useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'
import ChatBubbleLeftRightIcon from '@heroicons/react/24/outline/ChatBubbleLeftRightIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'

import GlobalChat from '../../../../components/Loans/GlobalChat'


function PendingApplicationsTable({
    applications = [],

    search,
    setSearch,

    loanTypes = [],
    agents = [],

    selectedLoanType,
    setSelectedLoanType,

    selectedAgent,
    setSelectedAgent,

    onClearFilters,
    onLoanTypeChange,
    onStatusChange,
    onReminder,
    onChat,
    onViewApplication,
    onRefresh,
}) {

    // =========================================================
    // AGENT DROPDOWN
    // =========================================================

    const [agentSearch, setAgentSearch] = useState('')

    const [showAgentMenu, setShowAgentMenu] =
        useState(false)


    // =========================================================
    // CHAT
    // =========================================================

    const [chatOpen, setChatOpen] =
        useState(false)

    const [selectedChatApplication, setSelectedChatApplication] =
        useState(null)


    // =========================================================
    // FILTERED AGENTS
    // =========================================================

    const filteredAgents =
        agents.filter((agent) =>
            agent.name
                ?.toLowerCase()
                .includes(
                    agentSearch
                        .trim()
                        .toLowerCase()
                )
        )


    // =========================================================
    // HELPERS
    // =========================================================

    const getAgentName = (application) =>
        application.agentName ??
        application.agent_name ??
        application.processingAgent ??
        application.processing_agent ??
        application.agent?.name ??
        application.processingAgent?.name ??
        'N/A'


    const getRMName = (application) =>
        application.rmName ??
        application.rm?.name ??
        application.rm_name ??
        application.rm ??
        'N/A'


    const getAppliedBy = (application) =>
        application.appliedBy ??
        application.applied_by ??
        application.createdBy ??
        application.created_by ??
        'N/A'


    const getLoanId = (application) =>
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
            application.loanAmount ??
            application.amount ??
            application.loan_amount


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
            application.applied_at ??
            application.createdAt ??
            application.created_at
        )


    const getStatusClass = (status) => {

        switch (status) {

            case 'Inprocess':
            case 'In Process':

                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                `


            case 'Docs Pending':

                return `
                    text-orange-600
                    border-orange-300
                    bg-orange-50
                `


            case 'Rejected':

                return `
                    text-error
                    border-error/30
                    bg-error/5
                `


            case 'Revert Rejected':

                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                `


            default:

                return `
                    text-base-content/60
                    border-base-300
                    bg-base-200/50
                `

        }

    }


    const selectedAgentName =
        agents.find(
            (agent) =>
                String(agent.id) ===
                String(selectedAgent)
        )?.name || 'All Agents'


    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {

        setAgentSearch('')

        setShowAgentMenu(false)

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

            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="
                card
                bg-base-100
                border
                border-base-300
                shadow-sm
            ">

                <div className="
                    p-3
                    flex
                    items-center
                    gap-2
                    w-full
                ">

                    {/* SEARCH */}

                    <label className="
                        input
                        input-bordered
                        flex
                        items-center
                        gap-2
                        flex-1
                        min-w-0
                    ">

                        <SearchIcon className="
                            w-4
                            h-4
                            shrink-0
                            text-base-content/40
                        " />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="
                                Search name, phone, loan type, agent...
                            "
                            className="
                                grow
                                min-w-0
                            "
                        />

                    </label>


                    {/* LOAN TYPE */}

                    <select
                        value={selectedLoanType}
                        onChange={(event) =>
                            setSelectedLoanType(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            w-44
                            shrink-0
                        "
                    >

                        <option value="">
                            All Loan Types
                        </option>

                        {loanTypes.map((loanType) => (

                            <option
                                key={loanType}
                                value={loanType}
                            >
                                {loanType}
                            </option>

                        ))}

                    </select>


                    {/* AGENT */}

                    <div className="
                        relative
                        w-48
                        shrink-0
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                setShowAgentMenu(
                                    (value) => !value
                                )
                            }
                            className="
                                select
                                select-bordered
                                w-full
                                flex
                                items-center
                                justify-between
                                text-left
                                font-normal
                            "
                        >

                            <span className="
                                truncate
                                min-w-0
                            ">
                                {selectedAgentName}
                            </span>


                            <ChevronDownIcon className="
                                w-4
                                h-4
                                shrink-0
                                text-base-content/50
                            " />

                        </button>


                        {showAgentMenu && (

                            <div className="
                                absolute
                                z-50
                                top-full
                                left-0
                                right-0
                                mt-1
                                bg-base-100
                                border
                                border-base-300
                                rounded-lg
                                shadow-lg
                                overflow-hidden
                            ">

                                {/* SEARCH AGENT */}

                                <div className="
                                    p-2
                                    border-b
                                    border-base-300
                                ">

                                    <label className="
                                        input
                                        input-sm
                                        input-bordered
                                        flex
                                        items-center
                                        gap-2
                                    ">

                                        <SearchIcon className="
                                            w-4
                                            h-4
                                            text-base-content/40
                                        " />


                                        <input
                                            autoFocus
                                            type="text"
                                            value={agentSearch}
                                            onChange={(event) =>
                                                setAgentSearch(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Search Agent..."
                                            className="
                                                grow
                                                min-w-0
                                            "
                                        />

                                    </label>

                                </div>


                                {/* AGENT LIST */}

                                <div className="
                                    max-h-52
                                    overflow-y-auto
                                    p-1
                                ">

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setSelectedAgent('')

                                            setAgentSearch('')

                                            setShowAgentMenu(false)

                                        }}
                                        className={`
                                            w-full
                                            text-left
                                            px-3
                                            py-2
                                            rounded
                                            text-sm
                                            hover:bg-base-200
                                            ${
                                                !selectedAgent
                                                    ? 'bg-[#8BCF00]/10 text-[#78B300] font-medium'
                                                    : ''
                                            }
                                        `}
                                    >
                                        All Agents
                                    </button>


                                    {filteredAgents.map((agent) => (

                                        <button
                                            key={agent.id}
                                            type="button"
                                            onClick={() => {

                                                setSelectedAgent(
                                                    agent.id
                                                )

                                                setAgentSearch('')

                                                setShowAgentMenu(false)

                                            }}
                                            className={`
                                                w-full
                                                text-left
                                                px-3
                                                py-2
                                                rounded
                                                text-sm
                                                truncate
                                                hover:bg-base-200
                                                ${
                                                    String(selectedAgent) ===
                                                    String(agent.id)
                                                        ? 'bg-[#8BCF00]/10 text-[#78B300] font-medium'
                                                        : ''
                                                }
                                            `}
                                        >
                                            {agent.name}
                                        </button>

                                    ))}


                                    {!filteredAgents.length && (

                                        <div className="
                                            text-center
                                            text-xs
                                            text-base-content/50
                                            py-3
                                        ">
                                            No agent found
                                        </div>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


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


            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="
                card
                bg-base-100
                border
                border-base-300
                shadow-sm
                w-full
                overflow-hidden
            ">

                <div className="
                    w-full
                    overflow-x-auto
                    touch-pan-x
                    overscroll-x-contain
                ">

                    <table className="
                        w-full
                        min-w-[1050px]
                        table-fixed
                        border-collapse
                    ">

                        <colgroup>

                            <col className="w-[3%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[10%]" />
                            <col className="w-[8%]" />
                            <col className="w-[11%]" />
                            <col className="w-[8%]" />
                            <col className="w-[12%]" />

                        </colgroup>


                        {/* HEADER */}

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                            ">

                                {[
                                    '#',
                                    'Name',
                                    'Phone',
                                    'Loan Type',
                                    'Loan Amount',
                                    'Applied Date',
                                    'Applied By',
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


                        {/* BODY */}

                        <tbody>

                            {!applications.length ? (

                                <tr>

                                    <td
                                        colSpan="11"
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
                                    (application, index) => (

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

                                                <Cell className="
                                                    text-sm
                                                    text-base-content/70
                                                ">
                                                    {index + 1}
                                                </Cell>

                                            </td>


                                            {/* NAME */}

                                            <td className="px-3 py-4">

                                                <Cell
                                                    title={application.name}
                                                    className="
                                                        text-sm
                                                        font-medium
                                                    "
                                                >
                                                    {application.name || 'N/A'}
                                                </Cell>

                                            </td>


                                            {/* PHONE */}

                                            <td className="px-3 py-4">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    min-w-0
                                                ">

                                                    <Cell
                                                        title={application.phone}
                                                        className="
                                                            text-sm
                                                            flex-1
                                                        "
                                                    >
                                                        {application.phone || 'N/A'}
                                                    </Cell>


                                                    {application.phone && (

                                                        <a
                                                            href={`tel:${application.phone}`}
                                                            title={`Call ${application.name || application.phone}`}
                                                            aria-label={`Call ${application.name || application.phone}`}
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

                                                            <PhoneIcon className="
                                                                w-4
                                                                h-4
                                                            " />

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
                                                    title={application.loanType}
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
                                                    {application.loanType ||
                                                        'Not Assigned'}
                                                </button>

                                            </td>


                                            {/* LOAN AMOUNT */}

                                            <td className="px-3 py-4">

                                                <Cell
                                                    title={getAmount(application)}
                                                    className="
                                                        text-sm
                                                        font-medium
                                                    "
                                                >
                                                    {getAmount(application)}
                                                </Cell>

                                            </td>


                                            {/* APPLIED DATE */}

                                            <td className="px-3 py-4">

                                                <Cell
                                                    title={getAppliedDate(application)}
                                                    className="text-sm"
                                                >
                                                    {getAppliedDate(application)}
                                                </Cell>

                                            </td>


                                            {/* APPLIED BY */}

                                            <td className="px-3 py-4">

                                                <Cell
                                                    title={getAppliedBy(application)}
                                                    className="text-sm"
                                                >
                                                    {getAppliedBy(application)}
                                                </Cell>

                                            </td>


                                            {/* RM */}

                                            <td className="px-3 py-4">

                                                <Cell
                                                    title={getRMName(application)}
                                                    className="text-sm"
                                                >
                                                    {getRMName(application)}
                                                </Cell>

                                            </td>


                                            {/* PROCESSING AGENT */}

                                            <td className="px-3 py-4">

                                                <Cell
                                                    title={getAgentName(application)}
                                                    className="text-sm"
                                                >
                                                    {getAgentName(application)}
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
                                                    title={application.status}
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
                                                    {application.status || 'N/A'}
                                                </button>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-2 py-4">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-0
                                                ">

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

                                                        <EyeIcon className="
                                                            w-4
                                                            h-4
                                                        " />

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

                                                        <BellAlertIcon className="
                                                            w-4
                                                            h-4
                                                        " />

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

                                                        <ChatBubbleLeftRightIcon className="
                                                            w-4
                                                            h-4
                                                        " />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =====================================================
                GLOBAL CHAT
            ===================================================== */}

            {selectedChatApplication && (

                <GlobalChat
                    open={chatOpen}
                    onClose={handleCloseChat}

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