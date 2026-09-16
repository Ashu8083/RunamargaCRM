// admin-react/src/pages/Loans/ShuffleLoans/components/ShuffleLoansTable.jsx

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'

import {
    getShuffleLoans,
    getApiErrorMessage,
} from '../API'

import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'


function ShuffleLoansTable({
    applications = [],
    loading = false,
    pagination = {
        total: 0,
        page: 1,
        limit: 30,
        totalPages: 0,
    },
    selectedApplicationIds = [],
    onSelectApplication,
    onSelectAll,
    onDataLoaded,
    onLoadingChange,
    onRefresh,
    onOpenAssignModal,
    assigning = false,
}) {

    // =========================================================
    // FILTER STATE
    // =========================================================

    const [
        search,
        setSearch,
    ] = useState('')


    const [
        selectedAgent,
        setSelectedAgent,
    ] = useState('')


    const [
        selectedRM,
        setSelectedRM,
    ] = useState('')


    const [
        selectedLoanType,
        setSelectedLoanType,
    ] = useState('')


    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState('')


    // =========================================================
    // PAGINATION STATE
    // =========================================================

    const [
        page,
        setPage,
    ] = useState(
        pagination?.page || 1
    )


    const [
        limit,
        setLimit,
    ] = useState(
        pagination?.limit || 30
    )


    // =========================================================
    // STATUS OPTIONS
    // =========================================================
    //
    // These are the known statuses from the existing table.
    //
    // Backend filtering is still performed server-side.
    //
    // =========================================================

    const statuses = useMemo(
        () => [
            {
                value: 'inprocess',
                label: 'In Process',
            },
            {
                value: 'docspending',
                label: 'Docs Pending',
            },
            {
                value: 'rejected',
                label: 'Rejected',
            },
            {
                value: 'sanctioned',
                label: 'Sanctioned',
            },
            {
                value: 'approved',
                label: 'Approved',
            },
        ],
        []
    )


    // =========================================================
    // FEEDBACK
    // =========================================================

    const [
        feedback,
        setFeedback,
    ] = useState({
        open: false,
        type: 'info',
        title: '',
        message: '',
    })


    const showFeedback = (
        type,
        title,
        message
    ) => {

        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }


    const closeFeedback = () => {

        setFeedback(
            (previous) => ({
                ...previous,
                open: false,
            })
        )
    }


    // =========================================================
    // REQUEST ID
    // =========================================================
    //
    // Prevent an older request from replacing a newer request
    // when the user changes filters quickly.
    //
    // =========================================================

    const requestIdRef =
        useRef(0)


    // =========================================================
    // INITIAL PAGE SYNCHRONIZATION
    // =========================================================

    useEffect(() => {

        if (
            pagination?.page &&
            pagination.page !== page
        ) {
            setPage(
                pagination.page
            )
        }

    }, [
        pagination?.page,
    ])


    // =========================================================
    // INITIAL LIMIT SYNCHRONIZATION
    // =========================================================

    useEffect(() => {

        if (
            pagination?.limit &&
            pagination.limit !== limit
        ) {
            setLimit(
                pagination.limit
            )
        }

    }, [
        pagination?.limit,
    ])


    // =========================================================
    // LOAD APPLICATIONS
    // =========================================================

    useEffect(() => {

        let cancelled = false

        const currentRequestId =
            ++requestIdRef.current


        const load = async () => {

            try {

                onLoadingChange?.(
                    true
                )


                const data =
                    await getShuffleLoans({
                        search,
                        agentId:
                            selectedAgent,
                        rmId:
                            selectedRM,
                        loanTypeId:
                            selectedLoanType,
                        status:
                            selectedStatus,
                        page,
                        limit,
                    })


                if (
                    cancelled ||
                    currentRequestId !==
                    requestIdRef.current
                ) {
                    return
                }


                onDataLoaded?.(
                    data
                )

            } catch (
                error
            ) {

                if (
                    cancelled ||
                    currentRequestId !==
                    requestIdRef.current
                ) {
                    return
                }


                onLoadingChange?.(
                    false
                )


                showFeedback(
                    'error',
                    'Failed to Load Applications',
                    getApiErrorMessage(
                        error,
                        'Unable to load shuffle applications.'
                    )
                )

            }
        }


        load()


        return () => {

            cancelled = true

        }

    }, [
        search,
        selectedAgent,
        selectedRM,
        selectedLoanType,
        selectedStatus,
        page,
        limit,
    ])


    // =========================================================
    // SEARCH CHANGE
    // =========================================================
    //
    // Search is server-side.
    //
    // Reset to page 1 because the filtered dataset may have
    // completely different pagination.
    //
    // =========================================================

    const handleSearchChange = (
        event
    ) => {

        const value =
            event.target.value

        setSearch(
            value
        )

        if (
            page !== 1
        ) {
            setPage(
                1
            )
        }
    }


    // =========================================================
    // AGENT CHANGE
    // =========================================================

    const handleAgentChange = (
        value
    ) => {

        setSelectedAgent(
            value
        )

        if (
            page !== 1
        ) {
            setPage(
                1
            )
        }
    }


    // =========================================================
    // RM CHANGE
    // =========================================================

    const handleRMChange = (
        value
    ) => {

        setSelectedRM(
            value
        )

        if (
            page !== 1
        ) {
            setPage(
                1
            )
        }
    }


    // =========================================================
    // LOAN TYPE CHANGE
    // =========================================================

    const handleLoanTypeChange = (
        value
    ) => {

        setSelectedLoanType(
            value
        )

        if (
            page !== 1
        ) {
            setPage(
                1
            )
        }
    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (
        event
    ) => {

        setSelectedStatus(
            event.target.value
        )

        if (
            page !== 1
        ) {
            setPage(
                1
            )
        }
    }


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')

        setSelectedAgent('')

        setSelectedRM('')

        setSelectedLoanType('')

        setSelectedStatus('')

        setPage(1)
    }


    // =========================================================
    // CHANGE PAGE
    // =========================================================

    const handlePageChange = (
        nextPage
    ) => {

        const totalPages =
            Number(
                pagination?.totalPages ||
                0
            )


        if (
            nextPage < 1
        ) {
            return
        }


        if (
            totalPages > 0 &&
            nextPage > totalPages
        ) {
            return
        }


        setPage(
            nextPage
        )
    }


    // =========================================================
    // CHANGE PAGE SIZE
    // =========================================================

    const handleLimitChange = (
        event
    ) => {

        const nextLimit =
            Number(
                event.target.value
            )


        if (
            ![
                30,
                50,
                100,
                200,
            ].includes(
                nextLimit
            )
        ) {
            return
        }


        setLimit(
            nextLimit
        )

        setPage(
            1
        )
    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        onRefresh?.()

        // Changing page to itself will not trigger useEffect.
        // Therefore force a new request by incrementing the
        // request key below.
        setRefreshKey(
            (previous) =>
                previous + 1
        )
    }


    // =========================================================
    // REFRESH KEY
    // =========================================================

    const [
        refreshKey,
        setRefreshKey,
    ] = useState(0)


    // =========================================================
    // REFRESH EFFECT
    // =========================================================
    //
    // refreshKey intentionally causes the same request to be
    // executed again.
    //
    // =========================================================

    useEffect(() => {

        if (
            refreshKey === 0
        ) {
            return
        }

        let cancelled = false

        const currentRequestId =
            ++requestIdRef.current


        const refresh = async () => {

            try {

                onLoadingChange?.(
                    true
                )


                const data =
                    await getShuffleLoans({
                        search,
                        agentId:
                            selectedAgent,
                        rmId:
                            selectedRM,
                        loanTypeId:
                            selectedLoanType,
                        status:
                            selectedStatus,
                        page,
                        limit,
                    })


                if (
                    cancelled ||
                    currentRequestId !==
                    requestIdRef.current
                ) {
                    return
                }


                onDataLoaded?.(
                    data
                )

            } catch (
                error
            ) {

                if (
                    cancelled ||
                    currentRequestId !==
                    requestIdRef.current
                ) {
                    return
                }


                onLoadingChange?.(
                    false
                )


                showFeedback(
                    'error',
                    'Refresh Failed',
                    getApiErrorMessage(
                        error,
                        'Unable to refresh shuffle applications.'
                    )
                )

            }
        }


        refresh()


        return () => {

            cancelled = true

        }

    }, [
        refreshKey,
    ])


    // =========================================================
    // FILTER ACTIVE
    // =========================================================

    const hasActiveFilters =
        Boolean(
            search.trim() ||
            selectedAgent ||
            selectedRM ||
            selectedLoanType ||
            selectedStatus
        )


    // =========================================================
    // CURRENT PAGE RANGE
    // =========================================================

    const total =
        Number(
            pagination?.total ||
            0
        )


    const currentPage =
        Number(
            pagination?.page ||
            page ||
            1
        )


    const currentLimit =
        Number(
            pagination?.limit ||
            limit ||
            30
        )


    const totalPages =
        Number(
            pagination?.totalPages ||
            0
        )


    const rangeStart =
        total === 0
            ? 0
            : (
                (currentPage - 1) *
                currentLimit
            ) + 1


    const rangeEnd =
        total === 0
            ? 0
            : Math.min(
                currentPage *
                currentLimit,
                total
            )


    // =========================================================
    // PAGE NUMBERS
    // =========================================================

    const pageNumbers = useMemo(() => {

        if (
            totalPages <= 0
        ) {
            return []
        }


        const pages = []


        // -----------------------------------------------------
        // Small number of pages
        // -----------------------------------------------------

        if (
            totalPages <= 7
        ) {

            for (
                let number = 1;
                number <= totalPages;
                number += 1
            ) {
                pages.push(
                    number
                )
            }

            return pages
        }


        // -----------------------------------------------------
        // Always show first page
        // -----------------------------------------------------

        pages.push(1)


        // -----------------------------------------------------
        // Left ellipsis
        // -----------------------------------------------------

        if (
            currentPage > 4
        ) {
            pages.push(
                'left-ellipsis'
            )
        }


        // -----------------------------------------------------
        // Middle pages
        // -----------------------------------------------------

        const start =
            Math.max(
                2,
                currentPage - 1
            )


        const end =
            Math.min(
                totalPages - 1,
                currentPage + 1
            )


        for (
            let number = start;
            number <= end;
            number += 1
        ) {

            if (
                !pages.includes(
                    number
                )
            ) {
                pages.push(
                    number
                )
            }
        }


        // -----------------------------------------------------
        // Right ellipsis
        // -----------------------------------------------------

        if (
            currentPage <
            totalPages - 3
        ) {
            pages.push(
                'right-ellipsis'
            )
        }


        // -----------------------------------------------------
        // Always show last page
        // -----------------------------------------------------

        if (
            !pages.includes(
                totalPages
            )
        ) {
            pages.push(
                totalPages
            )
        }


        return pages

    }, [
        totalPages,
        currentPage,
    ])


    // =========================================================
    // SELECTION
    // =========================================================

    const currentPageIds =
        applications.map(
            (application) =>
                application.id
        )


    const allSelected =
        currentPageIds.length > 0 &&
        currentPageIds.every(
            (id) =>
                selectedApplicationIds.includes(
                    id
                )
        )


    const someSelected =
        currentPageIds.some(
            (id) =>
                selectedApplicationIds.includes(
                    id
                )
        )


    // =========================================================
    // SELECT ALL CURRENT PAGE
    // =========================================================

    const handleSelectAllCurrentPage = () => {

        onSelectAll?.(
            applications
        )
    }


    // =========================================================
    // FORMAT AMOUNT
    // =========================================================

    const formatAmount = (
        amount
    ) => {

        if (
            amount === null ||
            amount === undefined ||
            amount === ''
        ) {
            return '₹0'
        }


        const numericAmount =
            Number(
                String(amount)
                    .replace(
                        /,/g,
                        ''
                    )
                    .replace(
                        /₹/g,
                        ''
                    )
            )


        if (
            Number.isNaN(
                numericAmount
            )
        ) {
            return `₹${amount}`
        }


        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            }
        ).format(
            numericAmount
        )
    }


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (
        status
    ) => {

        switch (
            String(
                status || ''
            ).toLowerCase()
        ) {

            case 'inprocess':
            case 'in process':

                return [
                    'border-orange-300',
                    'bg-orange-50',
                    'text-orange-600',
                ].join(' ')


            case 'docspending':
            case 'docs pending':

                return [
                    'border-yellow-300',
                    'bg-yellow-50',
                    'text-yellow-600',
                ].join(' ')


            case 'rejected':

                return [
                    'border-red-300',
                    'bg-red-50',
                    'text-red-600',
                ].join(' ')


            case 'sanctioned':
            case 'approved':

                return [
                    'border-green-300',
                    'bg-green-50',
                    'text-green-600',
                ].join(' ')


            default:

                return [
                    'border-base-300',
                    'bg-base-100',
                    'text-base-content/60',
                ].join(' ')
        }
    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    const renderEmptyState = () => {

        if (
            loading
        ) {

            return (
                <div
                    className="
                        flex
                        min-h-[280px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-12
                        text-center
                    "
                >

                    <span
                        className="
                            loading
                            loading-spinner
                            loading-md
                            text-[#8BCF00]
                        "
                    />


                    <p
                        className="
                            mt-4
                            text-sm
                            font-semibold
                            text-base-content/70
                        "
                    >
                        Loading applications...
                    </p>

                </div>
            )
        }


        return (
            <div
                className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    px-6
                    py-12
                    text-center
                "
            >

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-base-200
                    "
                >
                    <ArrowPathIcon
                        className="
                            h-6
                            w-6
                            text-base-content/30
                        "
                    />
                </div>


                <p
                    className="
                        mt-4
                        text-sm
                        font-semibold
                        text-base-content/70
                    "
                >
                    No applications found
                </p>


                <p
                    className="
                        mt-1
                        text-xs
                        text-base-content/45
                    "
                >
                    {hasActiveFilters
                        ? 'Try changing your filters.'
                        : 'There are no shuffle loan applications.'}
                </p>

            </div>
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-sm
                "
            >

                {/* =================================================
                    FILTERS
                ================================================= */}

                <div
                    className="
                        border-b
                        border-base-300
                        p-3
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                            lg:items-center
                        "
                    >

                        {/* SEARCH */}

                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={
                                handleSearchChange
                            }
                            placeholder="Search"
                            className="
                                input
                                input-bordered
                                w-full
                                lg:flex-1
                                focus:border-[#8BCF00]
                                focus:outline-[#8BCF00]
                            "
                        />


                        {/* AGENT */}

                        <AgentDropdown
                            value={
                                selectedAgent
                            }
                            onChange={
                                handleAgentChange
                            }
                            showLabel={
                                false
                            }
                            placeholder="Select Agent"
                            searchPlaceholder="Search agent"
                            emptyMessage="No agents found"
                            includeAllOption={
                                false
                            }
                            className="
                                w-full
                                lg:w-44
                                lg:flex-none
                            "
                        />


                        {/* RM */}

                        <RmDropdown
                            value={
                                selectedRM
                            }
                            onChange={
                                handleRMChange
                            }
                            showLabel={
                                false
                            }
                            placeholder="Select RM"
                            searchPlaceholder="Search RM"
                            emptyMessage="No RMs found"
                            includeAllOption={
                                false
                            }
                            className="
                                w-full
                                lg:w-44
                                lg:flex-none
                            "
                        />


                        {/* LOAN TYPE */}

                        <LoanTypeDropdown
                            value={
                                selectedLoanType
                            }
                            onChange={
                                handleLoanTypeChange
                            }
                            showLabel={
                                false
                            }
                            placeholder="Select Loan Type"
                            searchPlaceholder="Search loan type"
                            emptyMessage="No loan types found"
                            includeAllOption={
                                false
                            }
                            className="
                                w-full
                                lg:w-44
                                lg:flex-none
                            "
                        />


                        {/* STATUS */}

                        <select
                            value={
                                selectedStatus
                            }
                            onChange={
                                handleStatusChange
                            }
                            className="
                                select
                                select-bordered
                                w-full
                                lg:w-44
                                lg:flex-none
                                focus:border-[#8BCF00]
                                focus:outline-[#8BCF00]
                            "
                        >

                            <option value="">
                                All Status
                            </option>

                            {statuses.map(
                                (status) => (

                                    <option
                                        key={
                                            status.value
                                        }
                                        value={
                                            status.value
                                        }
                                    >
                                        {status.label}
                                    </option>

                                )
                            )}

                        </select>


                        {/* ASSIGN */}

                        <button
                            type="button"
                            onClick={
                                onOpenAssignModal
                            }
                            disabled={
                                assigning ||
                                selectedApplicationIds.length === 0
                            }
                            className="
                                btn
                                w-full
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                                disabled:border-base-300
                                disabled:bg-base-300
                                disabled:text-base-content/40
                                lg:w-auto
                            "
                        >

                            Assign

                            {selectedApplicationIds.length > 0 && (
                                <>
                                    {' '}
                                    (
                                    {
                                        selectedApplicationIds.length
                                    }
                                    )
                                </>
                            )}

                        </button>

                    </div>


                    {/* CLEAR FILTERS */}

                    {hasActiveFilters && (

                        <div
                            className="
                                mt-3
                                flex
                                justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={
                                    handleClearFilters
                                }
                                className="
                                    btn
                                    btn-sm
                                    btn-ghost
                                    text-base-content/60
                                    hover:bg-base-200
                                "
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}

                </div>


                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-base-300
                        px-4
                        py-3
                    "
                >

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-base-content
                            "
                        >
                            Shuffle Applications
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-base-content/50
                            "
                        >

                            {total === 0
                                ? '0 applications'
                                : `${rangeStart}-${rangeEnd} of ${total} applications`}

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading
                        }
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            transition
                            hover:bg-base-200
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                        aria-label="Refresh applications"
                    >

                        <ArrowPathIcon
                            className="
                                h-5
                                w-5
                                text-base-content/60
                            "
                        />

                    </button>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                {applications.length === 0 ? (

                    renderEmptyState()

                ) : (

                    <div
                        className="
                            overflow-x-auto
                        "
                    >

                        <table className="table w-full">

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-base-300
                                        bg-base-200/50
                                    "
                                >

                                    {/* SELECT */}

                                    <th
                                        className="
                                            w-12
                                            px-4
                                        "
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                allSelected
                                            }
                                            ref={(
                                                element
                                            ) => {

                                                if (
                                                    element
                                                ) {

                                                    element.indeterminate =
                                                        someSelected &&
                                                        !allSelected

                                                }

                                            }}
                                            onChange={
                                                handleSelectAllCurrentPage
                                            }
                                            className="
                                                checkbox
                                                checkbox-sm
                                                border-base-content/40
                                                checked:border-[#8BCF00]
                                                checked:bg-[#8BCF00]
                                                checked:text-white
                                            "
                                            aria-label="Select all applications on current page"
                                        />

                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Name
                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Phone
                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Loan Type
                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Amount
                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Agent Name
                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        RM Name
                                    </th>


                                    <th
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-xs
                                            font-semibold
                                        "
                                    >
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {applications.map(
                                    (
                                        application
                                    ) => {

                                        const isSelected =
                                            selectedApplicationIds.includes(
                                                application.id
                                            )


                                        const agentName =
                                            application.agentName ||
                                            application.agent_name ||
                                            'Unassigned'


                                        const rmName =
                                            application.rmName ||
                                            application.rm_name ||
                                            'Unassigned'


                                        const status =
                                            application.status ||
                                            'N/A'


                                        return (

                                            <tr
                                                key={
                                                    application.id
                                                }
                                                onClick={() =>
                                                    onSelectApplication?.(
                                                        application
                                                    )
                                                }
                                                className={[
                                                    'cursor-pointer',
                                                    'border-b',
                                                    'border-base-300',
                                                    'last:border-b-0',
                                                    'transition',
                                                    'hover:bg-base-200/30',
                                                    isSelected
                                                        ? 'bg-[#8BCF00]/10'
                                                        : '',
                                                ].join(' ')}
                                            >

                                                {/* SELECT */}

                                                <td
                                                    className="
                                                        w-12
                                                        px-4
                                                    "
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            onSelectApplication?.(
                                                                application
                                                            )
                                                        }
                                                        onClick={(
                                                            event
                                                        ) =>
                                                            event.stopPropagation()
                                                        }
                                                        className="
                                                            checkbox
                                                            checkbox-sm
                                                            border-base-content/40
                                                            checked:border-[#8BCF00]
                                                            checked:bg-[#8BCF00]
                                                            checked:text-white
                                                        "
                                                        aria-label={
                                                            `Select ${
                                                                application.name ||
                                                                'application'
                                                            }`
                                                        }
                                                    />

                                                </td>


                                                {/* NAME */}

                                                <td
                                                    className="
                                                        px-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            min-w-[140px]
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-base-content
                                                            "
                                                        >
                                                            {
                                                                application.name ||
                                                                'N/A'
                                                            }
                                                        </p>


                                                        {application.loanId && (

                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    text-[11px]
                                                                    text-base-content/40
                                                                "
                                                            >
                                                                {
                                                                    application.loanId
                                                                }
                                                            </p>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* PHONE */}

                                                <td
                                                    className="
                                                        whitespace-nowrap
                                                        px-4
                                                        text-sm
                                                        text-base-content/80
                                                    "
                                                >
                                                    {
                                                        application.phone ||
                                                        'N/A'
                                                    }
                                                </td>


                                                {/* LOAN TYPE */}

                                                <td
                                                    className="
                                                        whitespace-nowrap
                                                        px-4
                                                        text-sm
                                                        text-base-content/80
                                                    "
                                                >
                                                    {
                                                        application.loanType ||
                                                        'N/A'
                                                    }
                                                </td>


                                                {/* AMOUNT */}

                                                <td
                                                    className="
                                                        whitespace-nowrap
                                                        px-4
                                                        text-sm
                                                        font-medium
                                                        text-base-content
                                                    "
                                                >
                                                    {formatAmount(
                                                        application.amount
                                                    )}
                                                </td>


                                                {/* AGENT */}

                                                <td
                                                    className="
                                                        px-4
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            whitespace-nowrap
                                                            rounded-full
                                                            bg-[#2F8132]
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            agentName
                                                        }
                                                    </span>

                                                </td>


                                                {/* RM */}

                                                <td
                                                    className="
                                                        px-4
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            whitespace-nowrap
                                                            rounded-full
                                                            bg-[#2F8132]
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-white
                                                        "
                                                    >
                                                        {
                                                            rmName
                                                        }
                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    className="
                                                        px-4
                                                    "
                                                >

                                                    <span
                                                        className={[
                                                            'inline-flex',
                                                            'whitespace-nowrap',
                                                            'rounded-full',
                                                            'border',
                                                            'px-3',
                                                            'py-1',
                                                            'text-xs',
                                                            'font-medium',
                                                            getStatusClass(
                                                                status
                                                            ),
                                                        ].join(' ')}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-base-300
                        px-4
                        py-3
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* PAGE SIZE */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                text-xs
                                text-base-content/50
                            "
                        >
                            Rows per page
                        </span>


                        <select
                            value={
                                currentLimit
                            }
                            onChange={
                                handleLimitChange
                            }
                            className="
                                select
                                select-bordered
                                select-sm
                                w-24
                                focus:border-[#8BCF00]
                                focus:outline-[#8BCF00]
                            "
                        >

                            <option value="30">
                                30
                            </option>

                            <option value="50">
                                50
                            </option>

                            <option value="100">
                                100
                            </option>

                            <option value="200">
                                200
                            </option>

                        </select>

                    </div>


                    {/* PAGE CONTROLS */}

                    {totalPages > 1 && (

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                            "
                        >

                            {/* PREVIOUS */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(
                                        currentPage - 1
                                    )
                                }
                                disabled={
                                    currentPage <= 1 ||
                                    loading
                                }
                                className="
                                    btn
                                    btn-sm
                                    btn-ghost
                                    disabled:opacity-40
                                "
                            >
                                Previous
                            </button>


                            {/* PAGE NUMBERS */}

                            {pageNumbers.map(
                                (item) => {

                                    if (
                                        item ===
                                        'left-ellipsis' ||
                                        item ===
                                        'right-ellipsis'
                                    ) {

                                        return (
                                            <span
                                                key={
                                                    item
                                                }
                                                className="
                                                    flex
                                                    h-8
                                                    min-w-8
                                                    items-center
                                                    justify-center
                                                    px-1
                                                    text-xs
                                                    text-base-content/40
                                                "
                                            >
                                                ...
                                            </span>
                                        )
                                    }


                                    const active =
                                        item ===
                                        currentPage


                                    return (
                                        <button
                                            key={
                                                item
                                            }
                                            type="button"
                                            onClick={() =>
                                                handlePageChange(
                                                    item
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            className={[
                                                'btn',
                                                'btn-sm',
                                                'min-w-8',
                                                active
                                                    ? 'border-[#8BCF00] bg-[#8BCF00] text-white hover:border-[#6FA800] hover:bg-[#6FA800]'
                                                    : 'btn-ghost',
                                            ].join(' ')}
                                        >
                                            {
                                                item
                                            }
                                        </button>
                                    )
                                }
                            )}


                            {/* NEXT */}

                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(
                                        currentPage + 1
                                    )
                                }
                                disabled={
                                    currentPage >= totalPages ||
                                    loading
                                }
                                className="
                                    btn
                                    btn-sm
                                    btn-ghost
                                    disabled:opacity-40
                                "
                            >
                                Next
                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                FEEDBACK
            ================================================= */}

            <FeedbackModal
                open={
                    feedback.open
                }
                type={
                    feedback.type
                }
                title={
                    feedback.title
                }
                message={
                    feedback.message
                }
                onClose={
                    closeFeedback
                }
            />

        </>
    )
}

export default ShuffleLoansTable