// admin-react/src/pages/Logs/LeadCreationLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import LeadCreationLogTable from './components/LeadCreationLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'
import TeamLeadDropdown from '../../../components/GlobalModels/Filters/TeamLeadDropdown'


function LeadCreationLogs() {

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
    // MOCK LEAD CREATION LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 5001,

            leadId: '10245',

            createdById: 105,

            createdByName:
                'Rahul Sharma',

            createdByRole:
                'agent',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 5002,

            leadId: '10246',

            createdById: 108,

            createdByName:
                'Anil Kumar',

            createdByRole:
                'rm',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '02 Sep 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 5003,

            leadId: '10247',

            createdById: 110,

            createdByName:
                'Vikram Singh',

            createdByRole:
                'agent',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '02 Sep 2026, 11:21:08',

            deletedAt:
                null,
        },

        {
            id: 5004,

            leadId: '10248',

            createdById: 112,

            createdByName:
                'Arjun Rao',

            createdByRole:
                'rm',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '03 Sep 2026, 09:03:51',

            deletedAt:
                null,
        },

        {
            id: 5005,

            leadId: '10249',

            createdById: 115,

            createdByName:
                'Kiran Kumar',

            createdByRole:
                'agent',

            reportsToId: 304,

            reportsToName:
                'Manoj Rao',

            createdAt:
                '03 Sep 2026, 10:30:25',

            deletedAt:
                null,
        },

        {
            id: 5006,

            leadId: '10250',

            createdById: 105,

            createdByName:
                'Rahul Sharma',

            createdByRole:
                'agent',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '04 Sep 2026, 11:10:14',

            deletedAt:
                null,
        },

        {
            id: 5007,

            leadId: '10251',

            createdById: 108,

            createdByName:
                'Anil Kumar',

            createdByRole:
                'rm',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '04 Sep 2026, 12:05:37',

            deletedAt:
                null,
        },

        {
            id: 5008,

            leadId: '10252',

            createdById: 110,

            createdByName:
                'Vikram Singh',

            createdByRole:
                'agent',

            reportsToId: 304,

            reportsToName:
                'Manoj Rao',

            createdAt:
                '05 Sep 2026, 09:42:19',

            deletedAt:
                null,
        },

        {
            id: 5009,

            leadId: '10253',

            createdById: 112,

            createdByName:
                'Arjun Rao',

            createdByRole:
                'rm',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '05 Sep 2026, 10:12:44',

            deletedAt:
                null,
        },

        {
            id: 5010,

            leadId: '10254',

            createdById: 115,

            createdByName:
                'Kiran Kumar',

            createdByRole:
                'agent',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '06 Sep 2026, 11:45:22',

            deletedAt:
                null,
        },

        {
            id: 5011,

            leadId: '10255',

            createdById: 105,

            createdByName:
                'Rahul Sharma',

            createdByRole:
                'agent',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '06 Sep 2026, 01:18:09',

            deletedAt:
                null,
        },

        {
            id: 5012,

            leadId: '10256',

            createdById: 108,

            createdByName:
                'Anil Kumar',

            createdByRole:
                'rm',

            reportsToId: 304,

            reportsToName:
                'Manoj Rao',

            createdAt:
                '07 Sep 2026, 02:52:31',

            deletedAt:
                null,
        },

        {
            id: 5013,

            leadId: '10257',

            createdById: 110,

            createdByName:
                'Vikram Singh',

            createdByRole:
                'agent',

            reportsToId: 301,

            reportsToName:
                'Suresh Kumar',

            createdAt:
                '07 Sep 2026, 03:25:16',

            deletedAt:
                null,
        },

        {
            id: 5014,

            leadId: '10258',

            createdById: 112,

            createdByName:
                'Arjun Rao',

            createdByRole:
                'rm',

            reportsToId: 302,

            reportsToName:
                'Priya Singh',

            createdAt:
                '08 Sep 2026, 09:14:42',

            deletedAt:
                null,
        },

        {
            id: 5015,

            leadId: '10259',

            createdById: 115,

            createdByName:
                'Kiran Kumar',

            createdByRole:
                'agent',

            reportsToId: 303,

            reportsToName:
                'Rajesh Kumar',

            createdAt:
                '08 Sep 2026, 10:36:28',

            deletedAt:
                null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

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
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        createdById,
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

        setCreatedById('')

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


                        {/* =========================================
                            CREATED BY
                        ========================================= */}

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

                        </div>


                        {/* =========================================
                            REPORTS TO
                        ========================================= */}

                        <div className="
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

                        </div>


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


export default LeadCreationLogs