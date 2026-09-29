// admin-react/src/pages/Logs/CallAssignmentLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import CallAssignmentLogTable from './components/CallAssignmentLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'


function CallAssignmentLogs() {

    // =========================================================
    // MOCK RMS
    // =========================================================

    const rms = [
        {
            id: 105,
            name: 'Rahul Sharma',
            employeeId: '105',
            role: 'rm',
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
            role: 'rm',
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
            role: 'rm',
        },
    ]


    // =========================================================
    // MOCK EMPLOYEES
    // Used for Assigned By
    // =========================================================

    const employees = [
        {
            id: 105,
            name: 'Rahul Sharma',
            employeeId: '105',
            role: 'rm',
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
            role: 'rm',
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
            role: 'rm',
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
            id: 'ASSIGNED',
            name: 'Assigned',
        },

        {
            id: 'DELETED',
            name: 'Deleted',
        },
    ]


    // =========================================================
    // MOCK CALL ASSIGNMENT LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 6001,

            customerPhone:
                '9876543210',

            assignedToId:
                105,

            assignedToName:
                'Rahul Sharma',

            assignedToRole:
                'rm',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            assignedPhone:
                '08012345678',

            assignedById:
                301,

            assignedByName:
                'Suresh Kumar',

            event:
                'ASSIGNED',

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 6002,

            customerPhone:
                '9876543210',

            assignedToId:
                108,

            assignedToName:
                'Anil Kumar',

            assignedToRole:
                'rm',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            assignedPhone:
                '08098765432',

            assignedById:
                302,

            assignedByName:
                'Priya Nair',

            event:
                'ASSIGNED',

            createdAt:
                '03 Sep 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 6003,

            customerPhone:
                '9123456780',

            assignedToId:
                110,

            assignedToName:
                'Vikram Singh',

            assignedToRole:
                'rm',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            assignedPhone:
                '08087654321',

            assignedById:
                303,

            assignedByName:
                'Rajesh Kumar',

            event:
                'DELETED',

            createdAt:
                '04 Sep 2026, 11:21:08',

            deletedAt:
                '04 Sep 2026, 11:21:08',
        },

        {
            id: 6004,

            customerPhone:
                '9123456781',

            assignedToId:
                112,

            assignedToName:
                'Arjun Rao',

            assignedToRole:
                'rm',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            assignedPhone:
                '08045678901',

            assignedById:
                301,

            assignedByName:
                'Suresh Kumar',

            event:
                'ASSIGNED',

            createdAt:
                '05 Sep 2026, 09:03:51',

            deletedAt:
                null,
        },

        {
            id: 6005,

            customerPhone:
                '9123456782',

            assignedToId:
                115,

            assignedToName:
                'Kiran Kumar',

            assignedToRole:
                'rm',

            reportsToId:
                304,

            reportsToName:
                'Manoj Rao',

            assignedPhone:
                '08056789012',

            assignedById:
                304,

            assignedByName:
                'Manoj Rao',

            event:
                'ASSIGNED',

            createdAt:
                '05 Sep 2026, 10:30:25',

            deletedAt:
                null,
        },

        {
            id: 6006,

            customerPhone:
                '9876501234',

            assignedToId:
                105,

            assignedToName:
                'Rahul Sharma',

            assignedToRole:
                'rm',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            assignedPhone:
                '08012345678',

            assignedById:
                302,

            assignedByName:
                'Priya Nair',

            event:
                'ASSIGNED',

            createdAt:
                '06 Sep 2026, 11:10:14',

            deletedAt:
                null,
        },

        {
            id: 6007,

            customerPhone:
                '9876501235',

            assignedToId:
                108,

            assignedToName:
                'Anil Kumar',

            assignedToRole:
                'rm',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            assignedPhone:
                '08098765432',

            assignedById:
                303,

            assignedByName:
                'Rajesh Kumar',

            event:
                'ASSIGNED',

            createdAt:
                '06 Sep 2026, 12:05:37',

            deletedAt:
                null,
        },

        {
            id: 6008,

            customerPhone:
                '9876501236',

            assignedToId:
                110,

            assignedToName:
                'Vikram Singh',

            assignedToRole:
                'rm',

            reportsToId:
                304,

            reportsToName:
                'Manoj Rao',

            assignedPhone:
                '08087654321',

            assignedById:
                304,

            assignedByName:
                'Manoj Rao',

            event:
                'ASSIGNED',

            createdAt:
                '07 Sep 2026, 09:42:19',

            deletedAt:
                null,
        },

        {
            id: 6009,

            customerPhone:
                '9876501237',

            assignedToId:
                112,

            assignedToName:
                'Arjun Rao',

            assignedToRole:
                'rm',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            assignedPhone:
                '08045678901',

            assignedById:
                301,

            assignedByName:
                'Suresh Kumar',

            event:
                'DELETED',

            createdAt:
                '07 Sep 2026, 10:12:44',

            deletedAt:
                '07 Sep 2026, 10:12:44',
        },

        {
            id: 6010,

            customerPhone:
                '9876501238',

            assignedToId:
                115,

            assignedToName:
                'Kiran Kumar',

            assignedToRole:
                'rm',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            assignedPhone:
                '08056789012',

            assignedById:
                302,

            assignedByName:
                'Priya Nair',

            event:
                'ASSIGNED',

            createdAt:
                '08 Sep 2026, 11:45:22',

            deletedAt:
                null,
        },

        {
            id: 6011,

            customerPhone:
                '9876501239',

            assignedToId:
                105,

            assignedToName:
                'Rahul Sharma',

            assignedToRole:
                'rm',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            assignedPhone:
                '08012345678',

            assignedById:
                303,

            assignedByName:
                'Rajesh Kumar',

            event:
                'ASSIGNED',

            createdAt:
                '08 Sep 2026, 01:18:09',

            deletedAt:
                null,
        },

        {
            id: 6012,

            customerPhone:
                '9876501240',

            assignedToId:
                108,

            assignedToName:
                'Anil Kumar',

            assignedToRole:
                'rm',

            reportsToId:
                304,

            reportsToName:
                'Manoj Rao',

            assignedPhone:
                '08098765432',

            assignedById:
                304,

            assignedByName:
                'Manoj Rao',

            event:
                'ASSIGNED',

            createdAt:
                '09 Sep 2026, 02:52:31',

            deletedAt:
                null,
        },

        {
            id: 6013,

            customerPhone:
                '9876501241',

            assignedToId:
                110,

            assignedToName:
                'Vikram Singh',

            assignedToRole:
                'rm',

            reportsToId:
                301,

            reportsToName:
                'Suresh Kumar',

            assignedPhone:
                '08087654321',

            assignedById:
                301,

            assignedByName:
                'Suresh Kumar',

            event:
                'ASSIGNED',

            createdAt:
                '09 Sep 2026, 03:25:16',

            deletedAt:
                null,
        },

        {
            id: 6014,

            customerPhone:
                '9876501242',

            assignedToId:
                112,

            assignedToName:
                'Arjun Rao',

            assignedToRole:
                'rm',

            reportsToId:
                302,

            reportsToName:
                'Priya Nair',

            assignedPhone:
                '08045678901',

            assignedById:
                302,

            assignedByName:
                'Priya Nair',

            event:
                'ASSIGNED',

            createdAt:
                '10 Sep 2026, 09:14:42',

            deletedAt:
                null,
        },

        {
            id: 6015,

            customerPhone:
                '9876501243',

            assignedToId:
                115,

            assignedToName:
                'Kiran Kumar',

            assignedToRole:
                'rm',

            reportsToId:
                303,

            reportsToName:
                'Rajesh Kumar',

            assignedPhone:
                '08056789012',

            assignedById:
                303,

            assignedByName:
                'Rajesh Kumar',

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


    const [assignedToId, setAssignedToId] =
        useState('')


    const [assignedById, setAssignedById] =
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
                String(log.customerPhone)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.assignedToName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.assignedToId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.assignedByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.assignedById)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // ASSIGNED TO
            // -------------------------------------------------

            const matchesAssignedTo =
                !assignedToId ||
                String(log.assignedToId) ===
                    String(assignedToId)


            // -------------------------------------------------
            // ASSIGNED BY
            // -------------------------------------------------

            const matchesAssignedBy =
                !assignedById ||
                String(log.assignedById) ===
                    String(assignedById)


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
                matchesAssignedTo &&
                matchesAssignedBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        assignedToId,
        assignedById,
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

        setAssignedToId('')

        setAssignedById('')

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
    // ASSIGNED TO
    // =========================================================

    const handleAssignedToChange = (
        value
    ) => {

        setAssignedToId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // ASSIGNED BY
    // =========================================================

    const handleAssignedByChange = (
        value
    ) => {

        setAssignedById(value)

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
            'Refresh call assignment logs'
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
                                    placeholder="Search customer phone / employee..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            ASSIGNED TO — RM DROPDOWN
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={assignedToId}
                                onChange={
                                    handleAssignedToChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder="Assigned To"
                            />

                        </div>


                        {/* =========================================
                            ASSIGNED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={assignedById}
                                onChange={
                                    handleAssignedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Assigned By"
                            />

                        </div>


                        {/* =========================================
                            EVENT
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
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

            <CallAssignmentLogTable
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


export default CallAssignmentLogs