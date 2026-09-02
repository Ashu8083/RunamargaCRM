// admin-react/src/pages/Logs/AgentLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentLogTable from './components/AgentLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'


function AgentLogs() {

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
            role: 'agent',
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

        {
            id: 1,
            name: 'Admin',
            employeeId: '1',
            role: 'admin',
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
            id: 'INACTIVE',
            name: 'Inactive',
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
            id: 'PERMISSIONS_ADDED',
            name: 'Permissions Added',
        },

        {
            id: 'PERMISSIONS_UPDATED',
            name: 'Permissions Updated',
        },

        {
            id: 'PERMISSIONS_REMOVED',
            name: 'Permissions Removed',
        },

        {
            id: 'REPORTS_TO_CHANGED',
            name: 'Reports To Changed',
        },
    ]


    // =========================================================
    // MOCK AGENT LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 8001,

            agentId:
                105,

            agentName:
                'Rahul Sharma',

            agentRole:
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

            agentId:
                105,

            agentName:
                'Rahul Sharma',

            agentRole:
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
                '02 Sep 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 8003,

            agentId:
                105,

            agentName:
                'Rahul Sharma',

            agentRole:
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
                'REPORTS_TO_CHANGED',

            createdAt:
                '03 Sep 2026, 11:21:08',

            deletedAt:
                null,
        },

        {
            id: 8004,

            agentId:
                105,

            agentName:
                'Rahul Sharma',

            agentRole:
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
                'DEACTIVATED',

            createdAt:
                '04 Sep 2026, 09:03:51',

            deletedAt:
                null,
        },

        {
            id: 8005,

            agentId:
                108,

            agentName:
                'Anil Kumar',

            agentRole:
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
                '05 Sep 2026, 10:30:25',

            deletedAt:
                null,
        },

        {
            id: 8006,

            agentId:
                108,

            agentName:
                'Anil Kumar',

            agentRole:
                'agent',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            actionById:
                301,

            actionByName:
                'Suresh Kumar',

            actionByRole:
                'teamlead_agent_business',

            event:
                'ACTIVATED',

            createdAt:
                '06 Sep 2026, 11:10:14',

            deletedAt:
                null,
        },

        {
            id: 8007,

            agentId:
                110,

            agentName:
                'Vikram Singh',

            agentRole:
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
                'PERMISSIONS_ADDED',

            createdAt:
                '06 Sep 2026, 12:05:37',

            deletedAt:
                null,
        },

        {
            id: 8008,

            agentId:
                110,

            agentName:
                'Vikram Singh',

            agentRole:
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
                'PERMISSIONS_REMOVED',

            createdAt:
                '07 Sep 2026, 09:42:19',

            deletedAt:
                null,
        },

        {
            id: 8009,

            agentId:
                112,

            agentName:
                'Arjun Rao',

            agentRole:
                'agent',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            actionById:
                303,

            actionByName:
                'Rajesh Kumar',

            actionByRole:
                'teamlead_agent_business',

            event:
                'UPDATED',

            createdAt:
                '07 Sep 2026, 10:12:44',

            deletedAt:
                null,
        },

        {
            id: 8010,

            agentId:
                115,

            agentName:
                'Kiran Kumar',

            agentRole:
                'agent',

            reportsToId:
                304,

            reportsToName:
                'Manoj Rao',

            actionById:
                304,

            actionByName:
                'Manoj Rao',

            actionByRole:
                'teamlead_agent_personal',

            event:
                'ABSENT',

            createdAt:
                '08 Sep 2026, 11:45:22',

            deletedAt:
                null,
        },

        {
            id: 8011,

            agentId:
                105,

            agentName:
                'Rahul Sharma',

            agentRole:
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
                'INACTIVE',

            createdAt:
                '08 Sep 2026, 01:18:09',

            deletedAt:
                null,
        },

        {
            id: 8012,

            agentId:
                108,

            agentName:
                'Anil Kumar',

            agentRole:
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
                '09 Sep 2026, 02:52:31',

            deletedAt:
                null,
        },

        {
            id: 8013,

            agentId:
                110,

            agentName:
                'Vikram Singh',

            agentRole:
                'agent',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            actionById:
                303,

            actionByName:
                'Rajesh Kumar',

            actionByRole:
                'teamlead_agent_business',

            event:
                'REPORTS_TO_CHANGED',

            createdAt:
                '09 Sep 2026, 03:25:16',

            deletedAt:
                null,
        },

        {
            id: 8014,

            agentId:
                112,

            agentName:
                'Arjun Rao',

            agentRole:
                'agent',

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
                'DEACTIVATED',

            createdAt:
                '10 Sep 2026, 09:14:42',

            deletedAt:
                null,
        },

        {
            id: 8015,

            agentId:
                115,

            agentName:
                'Kiran Kumar',

            agentRole:
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
                'DELETED',

            createdAt:
                '10 Sep 2026, 10:36:28',

            deletedAt:
                '10 Sep 2026, 10:36:28',
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [agentId, setAgentId] =
        useState('')


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
            // SEARCH
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                log.agentName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.agentId)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // AGENT
            // -------------------------------------------------

            const matchesAgent =
                !agentId ||
                String(log.agentId) ===
                    String(agentId)


            // -------------------------------------------------
            // ACTION BY
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
                matchesAgent &&
                matchesActionBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        agentId,
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

        setAgentId('')

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
    // AGENT
    // =========================================================

    const handleAgentChange = (
        value
    ) => {

        setAgentId(value)

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
            'Refresh agent logs'
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
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                ">
                    Agent Logs
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    View agent activity and account history.
                </p>

            </div>


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
                        FIRST ROW — SEARCH + DROPDOWNS
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
                                    placeholder="Search agent / ID..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            AGENT
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={agentId}
                                onChange={
                                    handleAgentChange
                                }
                                options={employees}
                                allLabel="All Agents"
                                placeholder="Agent"
                            />

                        </div>


                        {/* =========================================
                            ACTION BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
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
                            xl:col-span-4
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
                            sm:col-span-1
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
                            sm:col-span-1
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
                            sm:col-span-2
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
                                        flex-1
                                        rounded-none
                                        border-0
                                        sm:flex-none
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
                                    shrink-0
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
                                        flex-1
                                        rounded-none
                                        border-0
                                        sm:flex-none
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

            <AgentLogTable
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


export default AgentLogs