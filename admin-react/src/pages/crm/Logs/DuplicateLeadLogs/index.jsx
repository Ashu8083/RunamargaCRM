// admin-react/src/pages/Logs/DuplicateLeadLogs/index.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import DuplicateLeadLogTable from './components/DuplicateLeadLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import { getDuplicateLeadApprovalLogs } from './Api'

function DuplicateLeadLogs() {

    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Build dropdown options from actual API results.
    const employees = useMemo(() => {
        const employeeMap = new Map()

        logs.forEach((log) => {
            if (log.submittedById != null) {
                const id = String(log.submittedById)

                if (!employeeMap.has(id)) {
                    employeeMap.set(id, {
                        id,
                        employeeId: id,
                        name: log.submittedByName || `Employee ${id}`,
                        role: '',
                    })
                }
            }

            if (log.reviewedById != null) {
                const id = String(log.reviewedById)

                if (!employeeMap.has(id)) {
                    employeeMap.set(id, {
                        id,
                        employeeId: id,
                        name: log.reviewedByName || `Employee ${id}`,
                        role: '',
                    })
                }
            }
        })

        return Array.from(employeeMap.values())
    }, [logs])

    // =========================================================
    // STATUS OPTIONS
    // =========================================================

    const statusOptions = [
        {
            id: '',
            name: 'All Statuses',
        },

        {
            id: 'APPROVED',
            name: 'Approved',
        },

        {
            id: 'REJECTED',
            name: 'Rejected',
        },
    ]
    const fetchLogs = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const response = await getDuplicateLeadApprovalLogs({
                skip: 0,
                limit: 200,
            })

            const records = Array.isArray(response)
                ? response
                : response?.items ?? response?.data ?? []

            const mappedLogs = records.map((log) => ({
                id: log.id,

                // Actual loan application ID; null for rejected requests.
                leadId: log.loan_id ?? null,

                // Duplicate approval request ID.
                duplicateApprovalId: log.duplicate_approval_id ?? null,

                submittedById: log.submitted_by_id ?? null,
                submittedByName: log.submitted_by_name ?? null,
                submittedByRole: '',

                reportsToId: log.reports_to_id ?? null,
                reportsToName: log.reports_to_name ?? null,

                reviewedById: log.reviewed_by_id ?? null,
                reviewedByName: log.reviewed_by_name ?? null,
                reviewedByRole: '',

                status: String(log.status ?? '').toUpperCase(),
                createdAt: log.created_at ?? null,
                deletedAt: log.deleted_at ?? null,
            }))

            setLogs(mappedLogs)
            setCurrentPage(1)
        } catch (err) {
            console.error('Failed to fetch duplicate lead logs:', err)

            setError(
                err.response?.data?.detail ||
                'Failed to load duplicate lead logs.'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [submittedById, setSubmittedById] =
        useState('')

    const [reviewedById, setReviewedById] =
        useState('')

    const [status, setStatus] =
        useState('')

    const [fromDate, setFromDate] =
        useState('')

    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)

    const pageSize = 10


    // =========================================================
    // FILTER LOGS
    // =========================================================

    const filteredLogs = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        return logs.filter((log) => {

            const matchesSearch =
                !searchValue ||
                String(log.leadId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.submittedByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.submittedById)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.reviewedByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.reviewedById)
                    .toLowerCase()
                    .includes(searchValue)


            const matchesSubmittedBy =
                !submittedById ||
                String(log.submittedById) ===
                String(submittedById)


            const matchesReviewedBy =
                !reviewedById ||
                String(log.reviewedById) ===
                String(reviewedById)


            const matchesStatus =
                !status ||
                String(log.status ?? '').toUpperCase() ===
                String(status).toUpperCase()

            const logDate =
                log.createdAt
                    ? new Date(log.createdAt)
                    : null


            const matchesFromDate =
                !fromDate ||
                (
                    logDate &&
                    logDate >=
                    new Date(
                        `${fromDate}T00:00:00`
                    )
                )


            const matchesToDate =
                !toDate ||
                (
                    logDate &&
                    logDate <=
                    new Date(
                        `${toDate}T23:59:59`
                    )
                )


            return (
                matchesSearch &&
                matchesSubmittedBy &&
                matchesReviewedBy &&
                matchesStatus &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        submittedById,
        reviewedById,
        status,
        fromDate,
        toDate,
    ])


    // =========================================================
    // TOTAL PAGES
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredLogs.length /
                pageSize
            )
        )


    // =========================================================
    // SAFE CURRENT PAGE
    // =========================================================

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        )


    // =========================================================
    // PAGINATED DATA
    // =========================================================

    const paginatedLogs =
        filteredLogs.slice(
            (safeCurrentPage - 1) *
            pageSize,

            safeCurrentPage *
            pageSize
        )


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch('')
        setSubmittedById('')
        setReviewedById('')
        setStatus('')
        setFromDate('')
        setToDate('')
        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange = (
        value
    ) => {

        setSearch(value)
        setCurrentPage(1)

    }


    // =========================================================
    // SUBMITTED BY
    // =========================================================

    const handleSubmittedByChange = (
        value
    ) => {

        setSubmittedById(value)
        setCurrentPage(1)

    }


    // =========================================================
    // REVIEWED BY
    // =========================================================

    const handleReviewedByChange = (
        value
    ) => {

        setReviewedById(value)
        setCurrentPage(1)

    }


    // =========================================================
    // STATUS
    // =========================================================

    const handleStatusChange = (
        event
    ) => {

        setStatus(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // FROM DATE
    // =========================================================

    const handleFromDateChange = (
        event
    ) => {

        setFromDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // TO DATE
    // =========================================================

    const handleToDateChange = (
        event
    ) => {

        setToDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * Replace with API call later.
         */

        console.log(
            'Refresh duplicate lead logs'
        )

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return
        }

        setCurrentPage(page)

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">



            {/* =====================================================
                FILTER CARD
            ===================================================== */}

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    card-body
                    p-4
                ">


                    {/* =================================================
                        FIRST ROW — MAIN FILTERS
                    ================================================= */}

                    <div className="
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-12
                    ">

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-4
                        ">

                            <label className="
                                input
                                input-bordered
                                flex
                                w-full
                                items-center
                                gap-3
                            ">

                                <SearchIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/40
                                " />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        handleSearchChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search lead ID / employee..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            SUBMITTED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={submittedById}
                                onChange={
                                    handleSubmittedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Submitted By"
                            />

                        </div>


                        {/* =========================================
                            REVIEWED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={reviewedById}
                                onChange={
                                    handleReviewedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Reviewed By"
                            />

                        </div>


                        {/* =========================================
                            STATUS
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <select
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                {statusOptions.map(
                                    (option) => (

                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        SECOND ROW — DATES + ACTIONS
                    ================================================= */}

                    <div className="
                        mt-3
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-12
                    ">

                        {/* =========================================
                            FROM DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <input
                                type="date"
                                value={fromDate}
                                onChange={
                                    handleFromDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                title="From date"
                            />

                        </div>


                        {/* =========================================
                            TO DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <input
                                type="date"
                                value={toDate}
                                onChange={
                                    handleToDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                title="To date"
                            />

                        </div>


                        {/* =========================================
                            ACTIONS
                        ========================================= */}

                        <div className="
                            flex
                            min-w-0
                            items-center
                            lg:col-span-2
                        ">

                            <div className="
                                flex
                                w-full
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                                lg:w-auto
                            ">

                                {/* =================================
                                    RESET
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                    "
                                >
                                    Reset
                                </button>


                                {/* =================================
                                    DIVIDER
                                ================================= */}

                                <div className="
                                    h-6
                                    w-px
                                    bg-base-300
                                " />


                                {/* =================================
                                    REFRESH
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                    "
                                    title="Refresh logs"
                                >

                                    <ArrowPathIcon className="
                                        h-4
                                        w-4
                                    " />

                                    <span>
                                        Refresh
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {loading && (
                <div className="py-4 text-center text-sm text-base-content/60">
                    Loading duplicate lead logs...
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn btn-sm"
                        onClick={fetchLogs}
                    >
                        Retry
                    </button>
                </div>
            )}
            {/* =====================================================
                TABLE
            ===================================================== */}

            <DuplicateLeadLogTable
                logs={paginatedLogs}
            />


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {filteredLogs.length > 0 && (

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-4
                    py-3
                    sm:flex-row
                ">

                    {/* =============================================
                        RESULT INFO
                    ============================================= */}

                    <p className="
                        text-xs
                        text-base-content/60
                    ">

                        Showing{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {(safeCurrentPage - 1) *
                                pageSize +
                                1
                            }
                        </span>

                        {' '}to{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {Math.min(
                                safeCurrentPage *
                                pageSize,
                                filteredLogs.length
                            )}
                        </span>

                        {' '}of{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {filteredLogs.length}
                        </span>

                        {' '}logs

                    </p>


                    {/* =============================================
                        PAGINATION CONTROLS
                    ============================================= */}

                    <div className="
                        flex
                        items-center
                        gap-1
                    ">

                        <button
                            type="button"
                            disabled={
                                safeCurrentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage - 1
                                )
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Previous
                        </button>


                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (_, index) =>
                                index + 1
                        ).map(
                            (page) => (

                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                    className={`
                                        btn
                                        btn-sm
                                        ${safeCurrentPage ===
                                            page
                                            ? `
                                                    border-[#8BCF00]
                                                    bg-[#8BCF00]
                                                    text-white
                                                    hover:border-[#6FA800]
                                                    hover:bg-[#6FA800]
                                                `
                                            : `
                                                    btn-ghost
                                                `
                                        }
                                    `}
                                >
                                    {page}
                                </button>

                            )
                        )}


                        <button
                            type="button"
                            disabled={
                                safeCurrentPage ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage + 1
                                )
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </div>

    )

}


export default DuplicateLeadLogs