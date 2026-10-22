
/*
 * admin-react/src/pages/crm/EmployeeManagement/LeaveManagement/components/LeaveTable.jsx
 */

import {
    useEffect,
    useRef,
    useState,
} from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon'


// ============================================================================
// CONSTANTS
// ============================================================================

const PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
    50,
]


const DEFAULT_FILTERS = {
    search: '',
    fromDate: '',
    toDate: '',
    status: '',
    leaveType: '',
}


// ============================================================================
// DATE FORMATTER
// ============================================================================

const formatDate = (value) => {
    if (!value) {
        return '—'
    }

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
        return String(value)
    }

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}


// ============================================================================
// STATUS STYLING
// ============================================================================

const getStatusClasses = (status) => {
    const normalizedStatus = String(status || '')
        .trim()
        .toLowerCase()

    if (normalizedStatus === 'approved') {
        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')
    }

    if (normalizedStatus === 'rejected') {
        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')
    }

    return [
        'border-amber-300',
        'bg-amber-50',
        'text-amber-700',
    ].join(' ')
}


// ============================================================================
// LEAVE TYPE STYLING
// ============================================================================

const getLeaveTypeClasses = (leaveType) => {
    if (leaveType === 'WFH') {
        return [
            'border-sky-300',
            'bg-sky-50',
            'text-sky-700',
        ].join(' ')
    }

    return [
        'border-violet-300',
        'bg-violet-50',
        'text-violet-700',
    ].join(' ')
}


// ============================================================================
// LEAVE TABLE
// ============================================================================

function LeaveTable({
    entries = [],
    onView,
    onReview,
    loading = false,
    canReview = true,
}) {

    // =========================================================================
    // FILTER STATE
    // =========================================================================

    const [
        filters,
        setFilters,
    ] = useState(DEFAULT_FILTERS)


    // =========================================================================
    // SEARCH INPUT REF
    // =========================================================================

    const searchInputRef = useRef(null)


    // =========================================================================
    // PAGE STATE
    // =========================================================================

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1)


    const [
        pageSize,
        setPageSize,
    ] = useState(10)


    // =========================================================================
    // CLEANUP / RESET PAGE WHEN DATA OR FILTERS CHANGE
    // =========================================================================

    useEffect(() => {
        setCurrentPage(1)
    }, [
        entries,
        filters,
        pageSize,
    ])


    // =========================================================================
    // FILTER HANDLER
    // =========================================================================

    const handleFilterChange = (
        field,
        value
    ) => {
        setFilters((current) => ({
            ...current,
            [field]: value,
        }))
    }


    // =========================================================================
    // FILTER LEAVE REQUESTS
    // =========================================================================

    const filteredEntries = entries.filter(
        (entry) => {
            const search = filters.search
                .trim()
                .toLowerCase()

            const reason = String(
                entry.reason || ''
            ).toLowerCase()

            const leaveType = String(
                entry.leave_type || ''
            ).toLowerCase()

            const status = String(
                entry.status || ''
            ).toLowerCase()

            const applicant = String(
                entry.applicant_name ||
                entry.employee_name ||
                entry.employee?.name ||
                entry.applied_by ||
                ''
            ).toLowerCase()

            const id = String(
                entry.id ?? ''
            ).toLowerCase()

            const matchesSearch =
                !search ||
                reason.includes(search) ||
                leaveType.includes(search) ||
                status.includes(search) ||
                applicant.includes(search) ||
                id.includes(search)

            const fromDate = String(
                entry.from_date || ''
            ).slice(0, 10)

            const toDate = String(
                entry.to_date || ''
            ).slice(0, 10)

            const matchesFromDate =
                !filters.fromDate ||
                toDate >= filters.fromDate

            const matchesToDate =
                !filters.toDate ||
                fromDate <= filters.toDate

            const matchesStatus =
                !filters.status ||
                status === filters.status.toLowerCase()

            const matchesLeaveType =
                !filters.leaveType ||
                leaveType === filters.leaveType.toLowerCase()

            return (
                matchesSearch &&
                matchesFromDate &&
                matchesToDate &&
                matchesStatus &&
                matchesLeaveType
            )
        }
    )


    // =========================================================================
    // PAGINATION
    // =========================================================================

    const totalRecords = filteredEntries.length

    const totalPages = Math.ceil(
        totalRecords / pageSize
    )

    const safeCurrentPage = Math.min(
        currentPage,
        Math.max(totalPages, 1)
    )

    const firstRecord = totalRecords === 0
        ? 0
        : ((safeCurrentPage - 1) * pageSize) + 1

    const lastRecord = totalRecords === 0
        ? 0
        : Math.min(
            safeCurrentPage * pageSize,
            totalRecords
        )

    const paginatedEntries = filteredEntries.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    )


    // =========================================================================
    // PAGINATION NUMBERS
    // =========================================================================

    const getPaginationPages = () => {
        if (totalPages <= 0) {
            return []
        }

        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            )
        }

        const pages = [1]

        if (safeCurrentPage > 4) {
            pages.push('left-ellipsis')
        }

        const start = Math.max(
            2,
            safeCurrentPage - 1
        )

        const end = Math.min(
            totalPages - 1,
            safeCurrentPage + 1
        )

        for (
            let page = start;
            page <= end;
            page += 1
        ) {
            pages.push(page)
        }

        if (safeCurrentPage < totalPages - 3) {
            pages.push('right-ellipsis')
        }

        pages.push(totalPages)

        return pages
    }


    const paginationPages = getPaginationPages()


    // =========================================================================
    // RESET FILTERS
    // =========================================================================

    const handleResetFilters = () => {
        setFilters(DEFAULT_FILTERS)
        setCurrentPage(1)

        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }


    // =========================================================================
    // ACTIVE FILTER CHECK
    // =========================================================================

    const hasActiveFilters = Boolean(
        filters.search ||
        filters.fromDate ||
        filters.toDate ||
        filters.status ||
        filters.leaveType
    )


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* ================================================================
                FILTERS
            ================================================================ */}

            <div className="
                border-b
                border-base-300
                p-4
                sm:p-5
            ">

                <div className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    xl:grid-cols-[minmax(220px,1.5fr)_150px_150px_160px_170px]
                ">

                    {/* ========================================================
                        SEARCH
                    ======================================================== */}

                    <div>
                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Search
                        </label>

                        <div className="relative">
                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/35
                            " />

                            <input
                                ref={searchInputRef}
                                type="text"
                                value={filters.search}
                                onChange={(event) =>
                                    handleFilterChange(
                                        'search',
                                        event.target.value
                                    )
                                }
                                placeholder="Search reason, employee or ID..."
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


                    {/* ========================================================
                        FROM DATE
                    ======================================================== */}

                    <div>
                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            From Date
                        </label>

                        <input
                            type="date"
                            value={filters.fromDate}
                            max={filters.toDate || undefined}
                            onChange={(event) =>
                                handleFilterChange(
                                    'fromDate',
                                    event.target.value
                                )
                            }
                            className="
                                input
                                input-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        />
                    </div>


                    {/* ========================================================
                        TO DATE
                    ======================================================== */}

                    <div>
                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            To Date
                        </label>

                        <input
                            type="date"
                            value={filters.toDate}
                            min={filters.fromDate || undefined}
                            onChange={(event) =>
                                handleFilterChange(
                                    'toDate',
                                    event.target.value
                                )
                            }
                            className="
                                input
                                input-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        />
                    </div>


                    {/* ========================================================
                        STATUS
                    ======================================================== */}

                    <div>
                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Status
                        </label>

                        <select
                            value={filters.status}
                            onChange={(event) =>
                                handleFilterChange(
                                    'status',
                                    event.target.value
                                )
                            }
                            className="
                                select
                                select-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        >
                            <option value="">
                                All Statuses
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Approved">
                                Approved
                            </option>

                            <option value="Rejected">
                                Rejected
                            </option>
                        </select>
                    </div>


                    {/* ========================================================
                        LEAVE TYPE
                    ======================================================== */}

                    <div>
                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Leave Type
                        </label>

                        <select
                            value={filters.leaveType}
                            onChange={(event) =>
                                handleFilterChange(
                                    'leaveType',
                                    event.target.value
                                )
                            }
                            className="
                                select
                                select-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        >
                            <option value="">
                                All Types
                            </option>

                            <option value="Full Day Leave">
                                Full Day Leave
                            </option>

                            <option value="WFH">
                                Work From Home
                            </option>
                        </select>
                    </div>

                </div>


                {/* ============================================================
                    FILTER FOOTER
                ============================================================ */}

                <div className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-base-300
                    pt-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <p className="
                        text-xs
                        font-medium
                        text-base-content/50
                    ">
                        {totalRecords}{' '}
                        {totalRecords === 1
                            ? 'leave request'
                            : 'leave requests'} found
                    </p>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="
                                inline-flex
                                h-9
                                items-center
                                justify-center
                                gap-1
                                self-start
                                rounded-lg
                                px-3
                                text-xs
                                font-medium
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                                sm:self-auto
                            "
                        >
                            <XMarkIcon className="
                                h-4
                                w-4
                            " />

                            Reset Filters
                        </button>
                    )}
                </div>
            </div>


            {/* ================================================================
                TABLE
            ================================================================ */}

            <div className="w-full overflow-x-auto">
                <table className="
                    w-full
                    min-w-[1050px]
                    border-collapse
                ">

                    <thead>
                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/40
                        ">
                            {[
                                'Request',
                                'Leave Dates',
                                'Days',
                                'Type',
                                'Reason',
                                'Status',
                                'Action',
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    className="
                                        whitespace-nowrap
                                        px-5
                                        py-3.5
                                        text-left
                                        text-xs
                                        font-semibold
                                        text-base-content/70
                                    "
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>


                    <tbody>

                        {/* ====================================================
                            LOADING
                        ==================================================== */}

                        {loading ? (
                            Array.from(
                                { length: 6 },
                                (_, index) => (
                                    <tr
                                        key={`loading-${index}`}
                                        className="
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                        "
                                    >
                                        {Array.from(
                                            { length: 7 },
                                            (_, columnIndex) => (
                                                <td
                                                    key={`${index}-${columnIndex}`}
                                                    className="px-5 py-4"
                                                >
                                                    <div className="
                                                        h-4
                                                        w-24
                                                        animate-pulse
                                                        rounded
                                                        bg-base-200
                                                    " />
                                                </td>
                                            )
                                        )}
                                    </tr>
                                )
                            )
                        ) : paginatedEntries.length === 0 ? (

                            /* ==================================================
                               EMPTY STATE
                            ================================================== */

                            <tr>
                                <td
                                    colSpan={7}
                                    className="
                                        px-6
                                        py-16
                                        text-center
                                    "
                                >
                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                    ">
                                        <div className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-base-200
                                        ">
                                            <span className="
                                                text-lg
                                                font-semibold
                                                text-base-content/30
                                            ">
                                                —
                                            </span>
                                        </div>

                                        <p className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-base-content/70
                                        ">
                                            No leave requests found
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-base-content/45
                                        ">
                                            Try changing your filters or search.
                                        </p>
                                    </div>
                                </td>
                            </tr>

                        ) : (

                            /* ==================================================
                               LEAVE REQUEST ROWS
                            ================================================== */

                            paginatedEntries.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className="
                                        border-b
                                        border-base-300
                                        last:border-b-0
                                        transition-colors
                                        hover:bg-base-200/30
                                    "
                                >

                                    {/* ========================================
                                        REQUEST
                                    ======================================== */}

                                    <td className="px-5 py-4">
                                        <p className="
                                            text-sm
                                            font-medium
                                            text-base-content
                                        ">
                                            {entry.applicant_name ||
                                                entry.employee_name ||
                                                entry.employee?.name ||
                                                `Employee #${entry.applied_by}`}
                                        </p>

                                        <p className="
                                            mt-0.5
                                            font-mono
                                            text-[11px]
                                            text-base-content/40
                                        ">
                                            Request #{entry.id}
                                        </p>
                                    </td>


                                    {/* ========================================
                                        LEAVE DATES
                                    ======================================== */}

                                    <td className="px-5 py-4">
                                        <p className="
                                            whitespace-nowrap
                                            text-sm
                                            font-medium
                                            text-base-content
                                        ">
                                            {formatDate(entry.from_date)}
                                        </p>

                                        {entry.from_date !== entry.to_date && (
                                            <p className="
                                                mt-1
                                                whitespace-nowrap
                                                text-xs
                                                text-base-content/50
                                            ">
                                                To {formatDate(entry.to_date)}
                                            </p>
                                        )}
                                    </td>


                                    {/* ========================================
                                        DAYS
                                    ======================================== */}

                                    <td className="px-5 py-4">
                                        <span className="
                                            inline-flex
                                            min-w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-base-200
                                            px-2.5
                                            py-1.5
                                            text-xs
                                            font-semibold
                                            text-base-content/70
                                        ">
                                            {entry.days ??
                                                (
                                                    Math.round(
                                                        (
                                                            new Date(
                                                                `${entry.to_date}T00:00:00`
                                                            ) -
                                                            new Date(
                                                                `${entry.from_date}T00:00:00`
                                                            )
                                                        ) / 86400000
                                                    ) + 1
                                                )}
                                        </span>
                                    </td>


                                    {/* ========================================
                                        TYPE
                                    ======================================== */}

                                    <td className="px-5 py-4">
                                        <span
                                            className={[
                                                'inline-flex',
                                                'whitespace-nowrap',
                                                'rounded-full',
                                                'border',
                                                'px-3',
                                                'py-1.5',
                                                'text-xs',
                                                'font-medium',
                                                getLeaveTypeClasses(
                                                    entry.leave_type
                                                ),
                                            ].join(' ')}
                                        >
                                            {entry.leave_type === 'WFH'
                                                ? 'Work From Home'
                                                : entry.leave_type || '—'}
                                        </span>
                                    </td>


                                    {/* ========================================
                                        REASON
                                    ======================================== */}

                                    <td className="max-w-[260px] px-5 py-4">
                                        <p
                                            className="
                                                max-w-[240px]
                                                truncate
                                                text-sm
                                                text-base-content/70
                                            "
                                            title={entry.reason || ''}
                                        >
                                            {entry.reason || '—'}
                                        </p>
                                    </td>


                                    {/* ========================================
                                        STATUS
                                    ======================================== */}

                                    <td className="px-5 py-4">
                                        <span
                                            className={[
                                                'inline-flex',
                                                'rounded-full',
                                                'border',
                                                'px-3',
                                                'py-1.5',
                                                'text-xs',
                                                'font-medium',
                                                getStatusClasses(
                                                    entry.status
                                                ),
                                            ].join(' ')}
                                        >
                                            {entry.status || 'Pending'}
                                        </span>
                                    </td>


                                    {/* ========================================
                                        ACTIONS
                                    ======================================== */}

                                    <td className="px-5 py-4">
                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                        ">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView?.(entry)
                                                }
                                                className="
                                                    inline-flex
                                                    h-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border
                                                    border-base-300
                                                    bg-base-100
                                                    px-3.5
                                                    text-xs
                                                    font-medium
                                                    text-base-content/70
                                                    transition
                                                    hover:border-[#8BCF00]/40
                                                    hover:bg-[#8BCF00]/10
                                                    hover:text-[#6FA800]
                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-[#8BCF00]/30
                                                "
                                            >
                                                View
                                            </button>

                                            {canReview &&
                                                entry.status === 'Pending' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onReview?.(entry)
                                                        }
                                                        className="
                                                            inline-flex
                                                            h-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            bg-[#8BCF00]
                                                            px-3
                                                            text-xs
                                                            font-semibold
                                                            text-white
                                                            transition
                                                            hover:bg-[#75b000]
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-[#8BCF00]/30
                                                        "
                                                    >
                                                        Review
                                                    </button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>


            {/* ================================================================
                PAGINATION
            ================================================================ */}

            {!loading && totalRecords > 0 && (
                <div className="
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
                ">

                    {/* ========================================================
                        RECORD RANGE
                    ======================================================== */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    ">
                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            Showing{' '}
                            <span className="
                                font-semibold
                                text-base-content/70
                            ">
                                {firstRecord}
                            </span>
                            {' '}to{' '}
                            <span className="
                                font-semibold
                                text-base-content/70
                            ">
                                {lastRecord}
                            </span>
                            {' '}of{' '}
                            <span className="
                                font-semibold
                                text-base-content/70
                            ">
                                {totalRecords}
                            </span>
                        </p>

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">
                            <span className="
                                whitespace-nowrap
                                text-xs
                                text-base-content/50
                            ">
                                Rows
                            </span>

                            <select
                                value={pageSize}
                                onChange={(event) =>
                                    setPageSize(
                                        Number(event.target.value)
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    h-8
                                    min-h-8
                                    w-[78px]
                                    px-2
                                    text-xs
                                "
                                aria-label="Rows per page"
                            >
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <option
                                        key={size}
                                        value={size}
                                    >
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* ========================================================
                        PAGINATION CONTROLS
                    ======================================================== */}

                    <div className="
                        flex
                        items-center
                        justify-center
                        gap-1
                    ">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(1, page - 1)
                                )
                            }
                            disabled={safeCurrentPage <= 1}
                            className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Previous page"
                        >
                            <ChevronLeftIcon className="
                                h-4
                                w-4
                            " />
                        </button>

                        {paginationPages.map((page, index) => {
                            if (
                                page === 'left-ellipsis' ||
                                page === 'right-ellipsis'
                            ) {
                                return (
                                    <span
                                        key={`${page}-${index}`}
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            text-xs
                                            text-base-content/40
                                        "
                                    >
                                        …
                                    </span>
                                )
                            }

                            const isActive =
                                page === safeCurrentPage

                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={[
                                        'inline-flex',
                                        'h-8',
                                        'min-w-8',
                                        'items-center',
                                        'justify-center',
                                        'rounded-lg',
                                        'px-2',
                                        'text-xs',
                                        'font-medium',
                                        'transition',
                                        isActive
                                            ? 'bg-[#8BCF00] text-white'
                                            : 'border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 hover:text-base-content',
                                    ].join(' ')}
                                    aria-current={
                                        isActive ? 'page' : undefined
                                    }
                                >
                                    {page}
                                </button>
                            )
                        })}

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(
                                        Math.max(totalPages, 1),
                                        page + 1
                                    )
                                )
                            }
                            disabled={
                                safeCurrentPage >= totalPages
                            }
                            className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Next page"
                        >
                            <ChevronRightIcon className="
                                h-4
                                w-4
                            " />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default LeaveTable
