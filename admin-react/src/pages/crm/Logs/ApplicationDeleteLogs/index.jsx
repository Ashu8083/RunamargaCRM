// admin-react/src/pages/Logs/ApplicationDeleteLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import ApplicationDeleteLogTable from './components/ApplicationDeleteLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'


function ApplicationDeleteLogs() {

    // =========================================================
    // MOCK EMPLOYEES
    // =========================================================

    const employees = [
        {
            id: 105,
            name: 'Rahul Sharma',
            employeeId: '105',
            role: 'agent',
        },

        {
            id: 108,
            name: 'Anil Kumar',
            employeeId: '108',
            role: 'rm',
        },

        {
            id: 110,
            name: 'Vikram Singh',
            employeeId: '110',
            role: 'agent',
        },

        {
            id: 112,
            name: 'Arjun Rao',
            employeeId: '112',
            role: 'rm',
        },

        {
            id: 115,
            name: 'Kiran Kumar',
            employeeId: '115',
            role: 'agent',
        },
    ]


    // =========================================================
    // MOCK TEAM LEADS
    // =========================================================

    const teamLeads = [
        {
            id: 301,
            name: 'Suresh Kumar',
            employeeId: '301',
        },

        {
            id: 302,
            name: 'Priya Singh',
            employeeId: '302',
        },

        {
            id: 303,
            name: 'Rajesh Kumar',
            employeeId: '303',
        },

        {
            id: 304,
            name: 'Manoj Rao',
            employeeId: '304',
        },
    ]


    // =========================================================
    // MOCK APPLICATION DELETE LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 8001,

            loanId: '10245',

            deletedById: 105,

            deletedByName:
                'Rahul Sharma',

            deletedByRole:
                'agent',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                '01 Sep 2026, 09:42:12',
        },

        {
            id: 8002,

            loanId: '10246',

            deletedById: 108,

            deletedByName:
                'Anil Kumar',

            deletedByRole:
                'rm',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '02 Sep 2026, 10:15:43',

            deletedAt:
                '02 Sep 2026, 10:15:43',
        },

        {
            id: 8003,

            loanId: '10247',

            deletedById: 110,

            deletedByName:
                'Vikram Singh',

            deletedByRole:
                'agent',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '02 Sep 2026, 11:21:08',

            deletedAt:
                '02 Sep 2026, 11:21:08',
        },

        {
            id: 8004,

            loanId: '10248',

            deletedById: 112,

            deletedByName:
                'Arjun Rao',

            deletedByRole:
                'rm',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '03 Sep 2026, 09:03:51',

            deletedAt:
                '03 Sep 2026, 09:03:51',
        },

        {
            id: 8005,

            loanId: '10249',

            deletedById: 115,

            deletedByName:
                'Kiran Kumar',

            deletedByRole:
                'agent',

            reportsToId: 304,

            reportsToName:
                'Manoj Rao',

            createdAt:
                '03 Sep 2026, 10:30:25',

            deletedAt:
                '03 Sep 2026, 10:30:25',
        },

        {
            id: 8006,

            loanId: '10250',

            deletedById: 105,

            deletedByName:
                'Rahul Sharma',

            deletedByRole:
                'agent',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '04 Sep 2026, 11:10:14',

            deletedAt:
                '04 Sep 2026, 11:10:14',
        },

        {
            id: 8007,

            loanId: '10251',

            deletedById: 108,

            deletedByName:
                'Anil Kumar',

            deletedByRole:
                'rm',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '04 Sep 2026, 12:05:37',

            deletedAt:
                '04 Sep 2026, 12:05:37',
        },

        {
            id: 8008,

            loanId: '10252',

            deletedById: 110,

            deletedByName:
                'Vikram Singh',

            deletedByRole:
                'agent',

            reportsToId: 304,

            reportsToName:
                'Manoj Rao',

            createdAt:
                '05 Sep 2026, 09:42:19',

            deletedAt:
                '05 Sep 2026, 09:42:19',
        },

        {
            id: 8009,

            loanId: '10253',

            deletedById: 112,

            deletedByName:
                'Arjun Rao',

            deletedByRole:
                'rm',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '05 Sep 2026, 10:12:44',

            deletedAt:
                '05 Sep 2026, 10:12:44',
        },

        {
            id: 8010,

            loanId: '10254',

            deletedById: 115,

            deletedByName:
                'Kiran Kumar',

            deletedByRole:
                'agent',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '06 Sep 2026, 11:45:22',

            deletedAt:
                '06 Sep 2026, 11:45:22',
        },

        {
            id: 8011,

            loanId: '10255',

            deletedById: 105,

            deletedByName:
                'Rahul Sharma',

            deletedByRole:
                'agent',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '06 Sep 2026, 01:18:09',

            deletedAt:
                '06 Sep 2026, 01:18:09',
        },

        {
            id: 8012,

            loanId: '10256',

            deletedById: 108,

            deletedByName:
                'Anil Kumar',

            deletedByRole:
                'rm',

            reportsToId: 304,

            reportsToName:
                'Manoj Rao',

            createdAt:
                '07 Sep 2026, 02:52:31',

            deletedAt:
                '07 Sep 2026, 02:52:31',
        },

        {
            id: 8013,

            loanId: '10257',

            deletedById: 110,

            deletedByName:
                'Vikram Singh',

            deletedByRole:
                'agent',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '07 Sep 2026, 03:25:16',

            deletedAt:
                '07 Sep 2026, 03:25:16',
        },

        {
            id: 8014,

            loanId: '10258',

            deletedById: 112,

            deletedByName:
                'Arjun Rao',

            deletedByRole:
                'rm',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '08 Sep 2026, 09:14:42',

            deletedAt:
                '08 Sep 2026, 09:14:42',
        },

        {
            id: 8015,

            loanId: '10259',

            deletedById: 115,

            deletedByName:
                'Kiran Kumar',

            deletedByRole:
                'agent',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '08 Sep 2026, 10:36:28',

            deletedAt:
                '08 Sep 2026, 10:36:28',
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [deletedById, setDeletedById] =
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

            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                String(log.loanId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.deletedByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.deletedById)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.reportsToName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.reportsToId)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // DELETED BY
            // -------------------------------------------------

            const matchesDeletedBy =
                !deletedById ||
                String(log.deletedById) ===
                    String(deletedById)


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
                log.deletedAt
                    ? new Date(log.deletedAt)
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
                matchesDeletedBy &&
                matchesReportsTo &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        deletedById,
        reportsToId,
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

        setDeletedById('')

        setReportsToId('')

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
    // DELETED BY
    // =========================================================

    const handleDeletedByChange = (
        value
    ) => {

        setDeletedById(value)

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
            'Refresh application delete logs'
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
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-12
                    ">

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-3
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
                                    placeholder="Search loan ID / employee..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            DELETED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={deletedById}
                                onChange={
                                    handleDeletedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Deleted By"
                            />

                        </div>


                        {/* =========================================
                            REPORTS TO
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
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

                        </div>


                        {/* =========================================
                            FROM DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-1
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
                            lg:col-span-1
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
                            min-w-0
                            items-center
                            lg:col-span-3
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
                                        px-4
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
                                        px-4
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

            <ApplicationDeleteLogTable
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
                                        ${
                                            safeCurrentPage ===
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


export default ApplicationDeleteLogs