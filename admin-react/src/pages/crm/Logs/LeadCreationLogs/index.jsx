// admin-react/src/pages/Logs/LeadCreationLogs/index.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getLoanApplicationAuditLogs } from './Api'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import LeadCreationLogTable from './components/LeadCreationLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'


function LeadCreationLogs() {

    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        setError('')

        try {
            const records = await getLoanApplicationAuditLogs({
                skip: 0,
                limit: 500,
            })

            const mappedLogs = records.map((log) => ({
                id: log.id,
                leadId: log.loan_application_id ?? null,

                phone: log.loan_application_phone ?? '',

                createdById: log.action_by_id ?? null,
                createdByName: log.performer_name ?? 'Unknown Employee',
                createdByRole: log.performer_role ?? '',

                reportsToId: log.report_to_id ?? null,
                reportsToName: log.report_to_name ?? 'Unknown Employee',

                action: log.action ?? '',
                createdAt: log.date_and_time ?? null,
                deletedAt: log.deleted_at ?? null,
            }))

            setLogs(mappedLogs)
        } catch (err) {
            console.error('Failed to fetch loan application audit logs:', err)

            setError(
                err.response?.data?.detail ||
                'Failed to load loan application creation logs.'
            )

            setLogs([])
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
    const [actionFilter, setActionFilter] = useState('')
    const [search, setSearch] =
        useState('')


    const [createdById, setCreatedById] =
        useState('')


    const [reportsToId, setReportsToId] =
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
            const normalizeAction = (value) =>
                String(value ?? '').trim().toUpperCase()

            const matchesAction =
                !actionFilter ||
                String(log.action ?? "")
                    .toLowerCase()
                    .includes(actionFilter.toLowerCase());
            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                String(log.leadId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.createdByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.createdById)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.reportsToName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.reportsToId)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // CREATED BY
            // -------------------------------------------------

            const matchesCreatedBy =
                !createdById ||
                String(log.createdById) ===
                String(createdById)


            // -------------------------------------------------
            // REPORTS TO
            // -------------------------------------------------

            const matchesReportsTo =
                !reportsToId ||
                String(log.reportsToId) ===
                String(reportsToId)


            // -------------------------------------------------
            // LOG DATE
            // -------------------------------------------------

            const logDate =
                log.createdAt
                    ? new Date(log.createdAt)
                    : null


            // -------------------------------------------------
            // FROM DATE
            // -------------------------------------------------

            const matchesFromDate =
                !fromDate ||
                (
                    logDate &&
                    logDate >=
                    new Date(
                        `${fromDate}T00:00:00`
                    )
                )


            // -------------------------------------------------
            // TO DATE
            // -------------------------------------------------

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
                matchesCreatedBy &&
                matchesReportsTo &&
                matchesFromDate &&
                matchesToDate &&
                matchesAction
            )

        })

    }, [
        logs,
        search,
        createdById,
        reportsToId,
        fromDate,
        toDate,
        actionFilter,
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

        setCreatedById('')

        setReportsToId('')

        setFromDate('')

        setToDate('')
        setActionFilter('')
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
    // CREATED BY
    // =========================================================

    const handleCreatedByChange = (
        value
    ) => {

        setCreatedById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // REPORTS TO
    // =========================================================

    const handleReportsToChange = (
        value
    ) => {

        setReportsToId(value)

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
            'Refresh lead creation logs'
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

                    <div className="
                        flex
                        w-full
                        flex-wrap
                        items-center
                        gap-3
                    ">

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="
                            min-w-0
                            w-full
                            sm:flex-1
                            lg:min-w-[220px]
                            lg:flex-[1.5]
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
                        <div>
                            
                            <select
                                id="actionFilter"
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="">All Actions</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                            </select>
                        </div>

                        {/* =========================================
                            CREATED BY
                        ========================================= */}
                        {/* 
                        <div className="
                            min-w-0
                            w-full
                            sm:flex-1
                            lg:min-w-[170px]
                            lg:flex-1
                        ">

                            <EmployeeDropdown
                                label=""
                                value={createdById}
                                onChange={
                                    handleCreatedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Created By"
                            />

                        </div> */}


                        {/* =========================================
                            REPORTS TO
                        ========================================= */}

                        {/* <div className="
                            min-w-0
                            w-full
                            sm:flex-1
                            lg:min-w-[170px]
                            lg:flex-1
                        ">

                            <TeamLeadDropdown
                                label=""
                                value={reportsToId}
                                onChange={
                                    handleReportsToChange
                                }
                                options={teamLeads}
                                allLabel="All Team Leads"
                                placeholder="Reports To"
                            />

                        </div> */}


                        {/* =========================================
                            FROM DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            w-full
                            sm:flex-1
                            lg:min-w-[155px]
                            lg:flex-1
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
                            w-full
                            sm:flex-1
                            lg:min-w-[155px]
                            lg:flex-1
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
                            RESET + REFRESH
                        ========================================= */}

                        <div className="
                            flex
                            w-full
                            shrink-0
                            items-center
                            sm:w-auto
                        ">

                            <div className="
                                flex
                                w-full
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                                sm:w-auto
                            ">

                                {/* Reset */}

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


                                {/* Divider */}

                                <div className="
                                    h-6
                                    w-px
                                    bg-base-300
                                " />


                                {/* Refresh */}

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


            {/* =====================================================
                TABLE
            ===================================================== */}

            <LeadCreationLogTable
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

                        {/* Previous */}

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


                        {/* Page Numbers */}

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


                        {/* Next */}

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


export default LeadCreationLogs