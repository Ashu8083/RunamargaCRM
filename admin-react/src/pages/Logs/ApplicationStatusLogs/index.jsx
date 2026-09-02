// admin-react\src\pages\Logs\ApplicationStatusLogs\index.jsx
import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import ApplicationStatusLogTable from './components/ApplicationStatusLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'


function ApplicationStatusLogs() {

    // =========================================================
    // MOCK EMPLOYEES
    // =========================================================

    const employees = [
        {
            id: 201,
            name: 'Rahul Sharma',
            employeeId: 'EMP201',
        },

        {
            id: 202,
            name: 'Anil Kumar',
            employeeId: 'EMP202',
        },

        {
            id: 203,
            name: 'Vikram Singh',
            employeeId: 'EMP203',
        },

        {
            id: 204,
            name: 'Arjun Rao',
            employeeId: 'EMP204',
        },

        {
            id: 205,
            name: 'Kiran Kumar',
            employeeId: 'EMP205',
        },
    ]


    // =========================================================
    // STATUS OPTIONS
    // =========================================================

    const statusOptions = [
        {
            value: '',
            label: 'All Statuses',
        },

        {
            value: 'IN_PROCESS',
            label: 'In Process',
        },

        {
            value: 'LOGIN',
            label: 'Login',
        },

        {
            value: 'SANCTIONED',
            label: 'Sanctioned',
        },

        {
            value: 'DISBURSED',
            label: 'Disbursed',
        },

        {
            value: 'REJECTED',
            label: 'Rejected',
        },
    ]


    // =========================================================
    // MOCK APPLICATION STATUS LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 5001,

            loanId:
                '10245',

            changedById:
                201,

            changedByName:
                'Rahul Sharma',

            empRole:
                'agent',

            status:
                'IN_PROCESS',

            createdAt:
                '31 Aug 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 5002,

            loanId:
                '10245',

            changedById:
                201,

            changedByName:
                'Rahul Sharma',

            empRole:
                'agent',

            status:
                'LOGIN',

            createdAt:
                '31 Aug 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 5003,

            loanId:
                '10245',

            changedById:
                202,

            changedByName:
                'Anil Kumar',

            empRole:
                'rm',

            status:
                'SANCTIONED',

            createdAt:
                '01 Sep 2026, 11:21:08',

            deletedAt:
                null,
        },

        {
            id: 5004,

            loanId:
                '10245',

            changedById:
                202,

            changedByName:
                'Anil Kumar',

            empRole:
                'rm',

            status:
                'DISBURSED',

            createdAt:
                '03 Sep 2026, 12:03:51',

            deletedAt:
                null,
        },

        {
            id: 5005,

            loanId:
                '10246',

            changedById:
                203,

            changedByName:
                'Vikram Singh',

            empRole:
                'teamlead_rm_business',

            status:
                'IN_PROCESS',

            createdAt:
                '29 Aug 2026, 09:12:35',

            deletedAt:
                null,
        },

        {
            id: 5006,

            loanId:
                '10246',

            changedById:
                203,

            changedByName:
                'Vikram Singh',

            empRole:
                'teamlead_rm_business',

            status:
                'LOGIN',

            createdAt:
                '29 Aug 2026, 10:45:18',

            deletedAt:
                null,
        },

        {
            id: 5007,

            loanId:
                '10246',

            changedById:
                204,

            changedByName:
                'Arjun Rao',

            empRole:
                'teamlead_agent_business',

            status:
                'REJECTED',

            createdAt:
                '30 Aug 2026, 02:18:42',

            deletedAt:
                null,
        },

        {
            id: 5008,

            loanId:
                '10247',

            changedById:
                205,

            changedByName:
                'Kiran Kumar',

            empRole:
                'teamlead_agent_personal',

            status:
                'IN_PROCESS',

            createdAt:
                '28 Aug 2026, 09:25:11',

            deletedAt:
                null,
        },

        {
            id: 5009,

            loanId:
                '10247',

            changedById:
                205,

            changedByName:
                'Kiran Kumar',

            empRole:
                'teamlead_agent_personal',

            status:
                'LOGIN',

            createdAt:
                '28 Aug 2026, 11:04:27',

            deletedAt:
                null,
        },

        {
            id: 5010,

            loanId:
                '10247',

            changedById:
                201,

            changedByName:
                'Rahul Sharma',

            empRole:
                'agent',

            status:
                'SANCTIONED',

            createdAt:
                '30 Aug 2026, 03:42:19',

            deletedAt:
                null,
        },

        {
            id: 5011,

            loanId:
                '10248',

            changedById:
                202,

            changedByName:
                'Anil Kumar',

            empRole:
                'rm',

            status:
                'IN_PROCESS',

            createdAt:
                '27 Aug 2026, 09:18:09',

            deletedAt:
                null,
        },

        {
            id: 5012,

            loanId:
                '10248',

            changedById:
                202,

            changedByName:
                'Anil Kumar',

            empRole:
                'rm',

            status:
                'REJECTED',

            createdAt:
                '31 Aug 2026, 04:52:31',

            deletedAt:
                '31 Aug 2026, 04:52:31',
        },

        {
            id: 5013,

            loanId:
                '10249',

            changedById:
                203,

            changedByName:
                'Vikram Singh',

            empRole:
                'teamlead_rm_business',

            status:
                'IN_PROCESS',

            createdAt:
                '01 Sep 2026, 08:15:22',

            deletedAt:
                null,
        },

        {
            id: 5014,

            loanId:
                '10249',

            changedById:
                204,

            changedByName:
                'Arjun Rao',

            empRole:
                'teamlead_agent_business',

            status:
                'LOGIN',

            createdAt:
                '01 Sep 2026, 10:32:45',

            deletedAt:
                null,
        },

        {
            id: 5015,

            loanId:
                '10250',

            changedById:
                205,

            changedByName:
                'Kiran Kumar',

            empRole:
                'teamlead_agent_personal',

            status:
                'IN_PROCESS',

            createdAt:
                '25 Aug 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 5016,

            loanId:
                '10250',

            changedById:
                201,

            changedByName:
                'Rahul Sharma',

            empRole:
                'agent',

            status:
                'SANCTIONED',

            createdAt:
                '27 Aug 2026, 02:15:43',

            deletedAt:
                null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [changedById, setChangedById] =
        useState('')


    const [status, setStatus] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // PAGINATION STATE
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)


    const pageSize = 10


    // =========================================================
    // DATE PARSER
    // =========================================================

    const parseLogDate = (dateString) => {

        if (!dateString) {
            return null
        }


        const datePart =
            dateString.split(',')[0]


        const parsedDate =
            new Date(datePart)


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return null
        }


        return parsedDate
    }


    // =========================================================
    // FILTER LOGS
    // =========================================================

    const filteredLogs = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        return logs.filter(
            (log) => {

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                const matchesSearch =
                    !searchValue ||
                    String(log.loanId)
                        .toLowerCase()
                        .includes(searchValue) ||
                    log.changedByName
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    String(log.changedById)
                        .toLowerCase()
                        .includes(searchValue) ||
                    String(log.id)
                        .toLowerCase()
                        .includes(searchValue) ||
                    log.empRole
                        ?.toLowerCase()
                        .includes(searchValue)


                // -------------------------------------------------
                // CHANGED BY
                // -------------------------------------------------

                const matchesChangedBy =
                    !changedById ||
                    String(log.changedById) ===
                        String(changedById)


                // -------------------------------------------------
                // STATUS
                // -------------------------------------------------

                const matchesStatus =
                    !status ||
                    log.status === status


                // -------------------------------------------------
                // LOG DATE
                // -------------------------------------------------

                const logDate =
                    parseLogDate(
                        log.createdAt
                    )


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
                    matchesChangedBy &&
                    matchesStatus &&
                    matchesFromDate &&
                    matchesToDate
                )

            }
        )

    }, [
        logs,
        search,
        changedById,
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
    // PAGINATED DATA
    // =========================================================

    const paginatedLogs =
        filteredLogs.slice(
            (currentPage - 1) *
                pageSize,

            currentPage *
                pageSize
        )


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setChangedById('')

        setStatus('')

        setFromDate('')

        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH CHANGE
    // =========================================================

    const handleSearchChange = (
        value
    ) => {

        setSearch(value)

        setCurrentPage(1)

    }


    // =========================================================
    // CHANGED BY CHANGE
    // =========================================================

    const handleChangedByChange = (
        value
    ) => {

        setChangedById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // STATUS CHANGE
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
    // FROM DATE CHANGE
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
    // TO DATE CHANGE
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
            'Refresh application status logs'
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
                FILTERS
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
                        grid-cols-1
                        gap-3
                        lg:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_minmax(160px,1fr)_minmax(260px,1.2fr)_auto]
                    ">

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div>

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
                                    placeholder="Search loan ID..."
                                    className="grow"
                                />

                            </label>

                        </div>


                        {/* =========================================
                            CHANGED BY
                        ========================================= */}

                        <div>

                            <EmployeeDropdown
                                label=""
                                value={changedById}
                                onChange={
                                    handleChangedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Changed By"
                            />

                        </div>


                        {/* =========================================
                            STATUS
                        ========================================= */}

                        <div>

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
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            DATE RANGE
                        ========================================= */}

                        <div className="
                            grid
                            grid-cols-2
                            gap-2
                        ">

                            {/* From */}

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


                            {/* To */}

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
                            items-center
                            justify-end
                            gap-2
                        ">

                            {/* Reset */}

                            <button
                                type="button"
                                onClick={handleReset}
                                className="
                                    btn
                                    btn-ghost
                                "
                            >
                                Reset
                            </button>


                            {/* Refresh */}

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="
                                    btn
                                    btn-ghost
                                    gap-2
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


            {/* =====================================================
                LOG TABLE
            ===================================================== */}

            <ApplicationStatusLogTable
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
                            {(currentPage - 1) *
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
                                currentPage *
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
                                currentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage - 1
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
                                            currentPage ===
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
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage + 1
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


export default ApplicationStatusLogs