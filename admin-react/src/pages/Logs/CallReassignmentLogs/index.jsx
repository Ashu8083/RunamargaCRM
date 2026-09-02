// admin-react/src/pages/Logs/CallReassignmentLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import CallReassignmentLogTable from './components/CallReassignmentLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'
import RmDropdown from '../../../components/GlobalModels/Filters/RmDropdown'


function CallReassignmentLogs() {

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
    // Used for Reassigned By
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
    // MOCK CALL REASSIGNMENT LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 7001,

            customerPhone:
                '9876543210',

            fromRmId:
                105,

            fromRmName:
                'Rahul Sharma',

            fromPhone:
                '08012345678',

            toRmId:
                108,

            toRmName:
                'Anil Kumar',

            toPhone:
                '08098765432',

            reassignedById:
                301,

            reassignedByName:
                'Suresh Kumar',

            createdAt:
                '01 Sep 2026, 09:42:12',
        },

        {
            id: 7002,

            customerPhone:
                '9123456780',

            fromRmId:
                110,

            fromRmName:
                'Vikram Singh',

            fromPhone:
                '08087654321',

            toRmId:
                105,

            toRmName:
                'Rahul Sharma',

            toPhone:
                '08012345678',

            reassignedById:
                302,

            reassignedByName:
                'Priya Nair',

            createdAt:
                '02 Sep 2026, 10:15:43',
        },

        {
            id: 7003,

            customerPhone:
                '9123456781',

            fromRmId:
                112,

            fromRmName:
                'Arjun Rao',

            fromPhone:
                '08045678901',

            toRmId:
                115,

            toRmName:
                'Kiran Kumar',

            toPhone:
                '08056789012',

            reassignedById:
                303,

            reassignedByName:
                'Rajesh Kumar',

            createdAt:
                '03 Sep 2026, 11:21:08',
        },

        {
            id: 7004,

            customerPhone:
                '9123456782',

            fromRmId:
                115,

            fromRmName:
                'Kiran Kumar',

            fromPhone:
                '08056789012',

            toRmId:
                112,

            toRmName:
                'Arjun Rao',

            toPhone:
                '08045678901',

            reassignedById:
                304,

            reassignedByName:
                'Manoj Rao',

            createdAt:
                '04 Sep 2026, 09:03:51',
        },

        {
            id: 7005,

            customerPhone:
                '9876501234',

            fromRmId:
                105,

            fromRmName:
                'Rahul Sharma',

            fromPhone:
                '08012345678',

            toRmId:
                110,

            toRmName:
                'Vikram Singh',

            toPhone:
                '08087654321',

            reassignedById:
                301,

            reassignedByName:
                'Suresh Kumar',

            createdAt:
                '05 Sep 2026, 10:30:25',
        },

        {
            id: 7006,

            customerPhone:
                '9876501235',

            fromRmId:
                108,

            fromRmName:
                'Anil Kumar',

            fromPhone:
                '08098765432',

            toRmId:
                115,

            toRmName:
                'Kiran Kumar',

            toPhone:
                '08056789012',

            reassignedById:
                302,

            reassignedByName:
                'Priya Nair',

            createdAt:
                '06 Sep 2026, 11:10:14',
        },

        {
            id: 7007,

            customerPhone:
                '9876501236',

            fromRmId:
                110,

            fromRmName:
                'Vikram Singh',

            fromPhone:
                '08087654321',

            toRmId:
                112,

            toRmName:
                'Arjun Rao',

            toPhone:
                '08045678901',

            reassignedById:
                303,

            reassignedByName:
                'Rajesh Kumar',

            createdAt:
                '06 Sep 2026, 12:05:37',
        },

        {
            id: 7008,

            customerPhone:
                '9876501237',

            fromRmId:
                112,

            fromRmName:
                'Arjun Rao',

            fromPhone:
                '08045678901',

            toRmId:
                105,

            toRmName:
                'Rahul Sharma',

            toPhone:
                '08012345678',

            reassignedById:
                304,

            reassignedByName:
                'Manoj Rao',

            createdAt:
                '07 Sep 2026, 09:42:19',
        },

        {
            id: 7009,

            customerPhone:
                '9876501238',

            fromRmId:
                115,

            fromRmName:
                'Kiran Kumar',

            fromPhone:
                '08056789012',

            toRmId:
                108,

            toRmName:
                'Anil Kumar',

            toPhone:
                '08098765432',

            reassignedById:
                301,

            reassignedByName:
                'Suresh Kumar',

            createdAt:
                '08 Sep 2026, 11:45:22',
        },

        {
            id: 7010,

            customerPhone:
                '9876501239',

            fromRmId:
                105,

            fromRmName:
                'Rahul Sharma',

            fromPhone:
                '08012345678',

            toRmId:
                112,

            toRmName:
                'Arjun Rao',

            toPhone:
                '08045678901',

            reassignedById:
                302,

            reassignedByName:
                'Priya Nair',

            createdAt:
                '08 Sep 2026, 13:18:09',
        },

        {
            id: 7011,

            customerPhone:
                '9876501240',

            fromRmId:
                108,

            fromRmName:
                'Anil Kumar',

            fromPhone:
                '08098765432',

            toRmId:
                110,

            toRmName:
                'Vikram Singh',

            toPhone:
                '08087654321',

            reassignedById:
                303,

            reassignedByName:
                'Rajesh Kumar',

            createdAt:
                '09 Sep 2026, 14:52:31',
        },

        {
            id: 7012,

            customerPhone:
                '9876501241',

            fromRmId:
                110,

            fromRmName:
                'Vikram Singh',

            fromPhone:
                '08087654321',

            toRmId:
                115,

            toRmName:
                'Kiran Kumar',

            toPhone:
                '08056789012',

            reassignedById:
                304,

            reassignedByName:
                'Manoj Rao',

            createdAt:
                '09 Sep 2026, 15:25:16',
        },

        {
            id: 7013,

            customerPhone:
                '9876501242',

            fromRmId:
                112,

            fromRmName:
                'Arjun Rao',

            fromPhone:
                '08045678901',

            toRmId:
                108,

            toRmName:
                'Anil Kumar',

            toPhone:
                '08098765432',

            reassignedById:
                301,

            reassignedByName:
                'Suresh Kumar',

            createdAt:
                '10 Sep 2026, 09:14:42',
        },

        {
            id: 7014,

            customerPhone:
                '9876501243',

            fromRmId:
                115,

            fromRmName:
                'Kiran Kumar',

            fromPhone:
                '08056789012',

            toRmId:
                105,

            toRmName:
                'Rahul Sharma',

            toPhone:
                '08012345678',

            reassignedById:
                302,

            reassignedByName:
                'Priya Nair',

            createdAt:
                '10 Sep 2026, 10:36:28',
        },

        {
            id: 7015,

            customerPhone:
                '9876501244',

            fromRmId:
                108,

            fromRmName:
                'Anil Kumar',

            fromPhone:
                '08098765432',

            toRmId:
                110,

            toRmName:
                'Vikram Singh',

            toPhone:
                '08087654321',

            reassignedById:
                303,

            reassignedByName:
                'Rajesh Kumar',

            createdAt:
                '10 Sep 2026, 11:42:17',
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [fromRmId, setFromRmId] =
        useState('')


    const [toRmId, setToRmId] =
        useState('')


    const [reassignedById, setReassignedById] =
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
            // SEARCH CUSTOMER PHONE
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                String(log.customerPhone)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // FROM RM
            // -------------------------------------------------

            const matchesFromRm =
                !fromRmId ||
                String(log.fromRmId) ===
                    String(fromRmId)


            // -------------------------------------------------
            // TO RM
            // -------------------------------------------------

            const matchesToRm =
                !toRmId ||
                String(log.toRmId) ===
                    String(toRmId)


            // -------------------------------------------------
            // REASSIGNED BY
            // -------------------------------------------------

            const matchesReassignedBy =
                !reassignedById ||
                String(log.reassignedById) ===
                    String(reassignedById)


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
                matchesFromRm &&
                matchesToRm &&
                matchesReassignedBy &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        fromRmId,
        toRmId,
        reassignedById,
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

        setFromRmId('')

        setToRmId('')

        setReassignedById('')

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
    // FROM RM
    // =========================================================

    const handleFromRmChange = (
        value
    ) => {

        setFromRmId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // TO RM
    // =========================================================

    const handleToRmChange = (
        value
    ) => {

        setToRmId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // REASSIGNED BY
    // =========================================================

    const handleReassignedByChange = (
        value
    ) => {

        setReassignedById(value)

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
            'Refresh call reassignment logs'
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
                                    placeholder="Search customer phone..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            FROM RM
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={fromRmId}
                                onChange={
                                    handleFromRmChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder="From RM"
                            />

                        </div>


                        {/* =========================================
                            TO RM
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={toRmId}
                                onChange={
                                    handleToRmChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder="To RM"
                            />

                        </div>


                        {/* =========================================
                            REASSIGNED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={reassignedById}
                                onChange={
                                    handleReassignedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Reassigned By"
                            />

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

            <CallReassignmentLogTable
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


export default CallReassignmentLogs