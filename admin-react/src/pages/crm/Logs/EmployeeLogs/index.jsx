// admin-react/src/pages/Logs/EmployeeLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import EmployeeLogTable from './components/EmployeeLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'


function EmployeeLogs() {

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
            role: 'agent',
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

        {
            id: 301,
            name: 'Suresh Kumar',
            employeeId: '301',
            role: 'teamlead_agent_business',
        },

        {
            id: 302,
            name: 'Priya Nair',
            employeeId: '302',
            role: 'teamlead_agent_personal',
        },

        {
            id: 303,
            name: 'Rajesh Kumar',
            employeeId: '303',
            role: 'teamlead_agent_business',
        },

        {
            id: 304,
            name: 'Manoj Rao',
            employeeId: '304',
            role: 'teamlead_agent_personal',
        },
    ]


    // =========================================================
    // EVENT OPTIONS
    // =========================================================

    const eventOptions = [
        {
            id: '',
            name: 'All Events',
        },

        {
            id: 'CREATED',
            name: 'Created',
        },

        {
            id: 'UPDATED',
            name: 'Updated',
        },

        {
            id: 'DELETED',
            name: 'Deleted',
        },

        {
            id: 'ACTIVATED',
            name: 'Activated',
        },

        {
            id: 'ABSENT',
            name: 'Absent',
        },

        {
            id: 'DEACTIVATED',
            name: 'Deactivated',
        },

        {
            id: 'PERMISSIONS_UPDATED',
            name: 'Permissions Updated',
        },
    ]


    // =========================================================
    // MOCK EMPLOYEE LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 8001,

            employeeId: 105,

            employeeName:
                'Rahul Sharma',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'CREATED',

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 8002,

            employeeId: 105,

            employeeName:
                'Rahul Sharma',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'UPDATED',

            createdAt:
                '02 Sep 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 8003,

            employeeId: 105,

            employeeName:
                'Rahul Sharma',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'ACTIVATED',

            createdAt:
                '03 Sep 2026, 11:21:08',

            deletedAt:
                null,
        },

        {
            id: 8004,

            employeeId: 105,

            employeeName:
                'Rahul Sharma',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'PERMISSIONS_UPDATED',

            createdAt:
                '04 Sep 2026, 09:03:51',

            deletedAt:
                null,
        },

        {
            id: 8005,

            employeeId: 105,

            employeeName:
                'Rahul Sharma',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'DEACTIVATED',

            createdAt:
                '05 Sep 2026, 10:30:25',

            deletedAt:
                null,
        },

        {
            id: 8006,

            employeeId: 108,

            employeeName:
                'Anil Kumar',

            employeeRole:
                'agent',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'UPDATED',

            createdAt:
                '06 Sep 2026, 11:10:14',

            deletedAt:
                null,
        },

        {
            id: 8007,

            employeeId: 108,

            employeeName:
                'Anil Kumar',

            employeeRole:
                'agent',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'ACTIVATED',

            createdAt:
                '06 Sep 2026, 12:05:37',

            deletedAt:
                null,
        },

        {
            id: 8008,

            employeeId: 110,

            employeeName:
                'Vikram Singh',

            employeeRole:
                'agent',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'CREATED',

            createdAt:
                '07 Sep 2026, 09:42:19',

            deletedAt:
                null,
        },

        {
            id: 8009,

            employeeId: 110,

            employeeName:
                'Vikram Singh',

            employeeRole:
                'agent',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'PERMISSIONS_UPDATED',

            createdAt:
                '07 Sep 2026, 10:12:44',

            deletedAt:
                null,
        },

        {
            id: 8010,

            employeeId: 112,

            employeeName:
                'Arjun Rao',

            employeeRole:
                'rm',

            reportsToId:
                304,

            reportsToName:
                'Manoj Rao',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'CREATED',

            createdAt:
                '08 Sep 2026, 11:45:22',

            deletedAt:
                null,
        },

        {
            id: 8011,

            employeeId: 112,

            employeeName:
                'Arjun Rao',

            employeeRole:
                'rm',

            reportsToId:
                304,

            reportsToName:
                'Manoj Rao',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'UPDATED',

            createdAt:
                '08 Sep 2026, 01:18:09',

            deletedAt:
                null,
        },

        {
            id: 8012,

            employeeId: 115,

            employeeName:
                'Kiran Kumar',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'DEACTIVATED',

            createdAt:
                '09 Sep 2026, 02:52:31',

            deletedAt:
                null,
        },

        {
            id: 8013,

            employeeId: 115,

            employeeName:
                'Kiran Kumar',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'ACTIVATED',

            createdAt:
                '09 Sep 2026, 03:25:16',

            deletedAt:
                null,
        },

        {
            id: 8014,

            employeeId: 105,

            employeeName:
                'Rahul Sharma',

            employeeRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'ABSENT',

            createdAt:
                '10 Sep 2026, 09:14:42',

            deletedAt:
                null,
        },

        {
            id: 8015,

            employeeId: 108,

            employeeName:
                'Anil Kumar',

            employeeRole:
                'agent',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            actionById:
                1,

            actionByName:
                'Admin',

            actionByRole:
                'admin',

            event:
                'DELETED',

            createdAt:
                '10 Sep 2026, 10:36:28',

            deletedAt:
                null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    // Employee being acted upon
    const [employeeId, setEmployeeId] =
        useState('')


    // Employee who performed the action
    const [actionById, setActionById] =
        useState('')


    const [event, setEvent] =
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
            // SEARCH EMPLOYEE / ID
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                log.employeeName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.employeeId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.actionByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.actionById)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // EMPLOYEE
            //
            // Filters the employee whose record is being changed.
            // -------------------------------------------------

            const matchesEmployee =
                !employeeId ||
                String(log.employeeId) ===
                    String(employeeId)


            // -------------------------------------------------
            // ACTION BY
            //
            // Filters the employee/admin who performed the action.
            // -------------------------------------------------

            const matchesActionBy =
                !actionById ||
                String(log.actionById) ===
                    String(actionById)


            // -------------------------------------------------
            // EVENT
            // -------------------------------------------------

            const matchesEvent =
                !event ||
                log.event === event


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
                matchesEmployee &&
                matchesActionBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        employeeId,
        actionById,
        event,
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

        setEmployeeId('')

        setActionById('')

        setEvent('')

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
    // EMPLOYEE
    // =========================================================

    const handleEmployeeChange = (
        value
    ) => {

        setEmployeeId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // ACTION BY
    // =========================================================

    const handleActionByChange = (
        value
    ) => {

        setActionById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // EVENT
    // =========================================================

    const handleEventChange = (
        event
    ) => {

        setEvent(
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
            'Refresh employee logs'
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
                            xl:col-span-3
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
                                    placeholder="Search employee / ID..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            EMPLOYEE
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <EmployeeDropdown
                                label=""
                                value={employeeId}
                                onChange={
                                    handleEmployeeChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Employee"
                            />

                        </div>


                        {/* =========================================
                            ACTION BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <EmployeeDropdown
                                label=""
                                value={actionById}
                                onChange={
                                    handleActionByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Action By"
                            />

                        </div>


                        {/* =========================================
                            EVENT
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <select
                                value={event}
                                onChange={
                                    handleEventChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                {eventOptions.map(
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
                            RESET + REFRESH
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


            {/* =====================================================
                TABLE
            ===================================================== */}

            <EmployeeLogTable
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


export default EmployeeLogs