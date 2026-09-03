// admin-react/src/pages/Logs/LoanShuffleLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import LoanShuffleLogTable from './components/LoanShuffleLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'
import AgentDropdown from '../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../components/GlobalModels/Filters/RmDropdown'


function LoanShuffleLogs() {

    // =========================================================
    // MOCK EMPLOYEES
    // =========================================================

    const employees = [
        {
            id: 1,
            name: 'Admin',
            employeeId: '1',
            role: 'admin',
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
    // MOCK AGENTS
    // =========================================================

    const agents = [
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
    ]


    // =========================================================
    // MOCK RMS
    // =========================================================

    const rms = [
        {
            id: 201,
            name: 'Priya Nair',
            employeeId: '201',
            role: 'rm',
        },

        {
            id: 202,
            name: 'Sneha Reddy',
            employeeId: '202',
            role: 'rm',
        },

        {
            id: 203,
            name: 'Rajesh Rao',
            employeeId: '203',
            role: 'rm',
        },

        {
            id: 204,
            name: 'Manoj Kumar',
            employeeId: '204',
            role: 'rm',
        },

        {
            id: 205,
            name: 'Deepa Sharma',
            employeeId: '205',
            role: 'rm',
        },
    ]


    // =========================================================
    // MOCK LOAN SHUFFLE LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 5001,

            loanId:
                '10245',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                105,

            fromAgentName:
                'Rahul Sharma',

            toAgentId:
                108,

            toAgentName:
                'Anil Kumar',

            fromRmId:
                null,

            fromRmName:
                null,

            toRmId:
                null,

            toRmName:
                null,

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 5002,

            loanId:
                '10246',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                null,

            fromAgentName:
                null,

            toAgentId:
                null,

            toAgentName:
                null,

            fromRmId:
                201,

            fromRmName:
                'Priya Nair',

            toRmId:
                202,

            toRmName:
                'Sneha Reddy',

            createdAt:
                '01 Sep 2026, 11:15:43',

            deletedAt:
                null,
        },

        {
            id: 5003,

            loanId:
                '10247',

            shuffledById:
                301,

            shuffledByName:
                'Suresh Kumar',

            shuffledByRole:
                'teamlead_agent_business',

            fromAgentId:
                105,

            fromAgentName:
                'Rahul Sharma',

            toAgentId:
                110,

            toAgentName:
                'Vikram Singh',

            fromRmId:
                201,

            fromRmName:
                'Priya Nair',

            toRmId:
                201,

            toRmName:
                'Priya Nair',

            createdAt:
                '02 Sep 2026, 10:21:08',

            deletedAt:
                null,
        },

        {
            id: 5004,

            loanId:
                '10248',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                null,

            fromAgentName:
                null,

            toAgentId:
                null,

            toAgentName:
                null,

            fromRmId:
                203,

            fromRmName:
                'Rajesh Rao',

            toRmId:
                204,

            toRmName:
                'Manoj Kumar',

            createdAt:
                '03 Sep 2026, 09:03:51',

            deletedAt:
                null,
        },

        {
            id: 5005,

            loanId:
                '10249',

            shuffledById:
                302,

            shuffledByName:
                'Priya Nair',

            shuffledByRole:
                'teamlead_agent_personal',

            fromAgentId:
                108,

            fromAgentName:
                'Anil Kumar',

            toAgentId:
                112,

            toAgentName:
                'Arjun Rao',

            fromRmId:
                null,

            fromRmName:
                null,

            toRmId:
                null,

            toRmName:
                null,

            createdAt:
                '03 Sep 2026, 10:30:25',

            deletedAt:
                null,
        },

        {
            id: 5006,

            loanId:
                '10250',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                110,

            fromAgentName:
                'Vikram Singh',

            toAgentId:
                115,

            toAgentName:
                'Kiran Kumar',

            fromRmId:
                202,

            fromRmName:
                'Sneha Reddy',

            toRmId:
                205,

            toRmName:
                'Deepa Sharma',

            createdAt:
                '04 Sep 2026, 11:10:14',

            deletedAt:
                null,
        },

        {
            id: 5007,

            loanId:
                '10251',

            shuffledById:
                303,

            shuffledByName:
                'Rajesh Kumar',

            shuffledByRole:
                'teamlead_agent_business',

            fromAgentId:
                null,

            fromAgentName:
                null,

            toAgentId:
                null,

            toAgentName:
                null,

            fromRmId:
                204,

            fromRmName:
                'Manoj Kumar',

            toRmId:
                201,

            toRmName:
                'Priya Nair',

            createdAt:
                '04 Sep 2026, 12:05:37',

            deletedAt:
                null,
        },

        {
            id: 5008,

            loanId:
                '10252',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                112,

            fromAgentName:
                'Arjun Rao',

            toAgentId:
                105,

            toAgentName:
                'Rahul Sharma',

            fromRmId:
                null,

            fromRmName:
                null,

            toRmId:
                null,

            toRmName:
                null,

            createdAt:
                '05 Sep 2026, 09:42:19',

            deletedAt:
                null,
        },

        {
            id: 5009,

            loanId:
                '10253',

            shuffledById:
                304,

            shuffledByName:
                'Manoj Rao',

            shuffledByRole:
                'teamlead_agent_personal',

            fromAgentId:
                115,

            fromAgentName:
                'Kiran Kumar',

            toAgentId:
                108,

            toAgentName:
                'Anil Kumar',

            fromRmId:
                203,

            fromRmName:
                'Rajesh Rao',

            toRmId:
                203,

            toRmName:
                'Rajesh Rao',

            createdAt:
                '05 Sep 2026, 10:12:44',

            deletedAt:
                null,
        },

        {
            id: 5010,

            loanId:
                '10254',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                null,

            fromAgentName:
                null,

            toAgentId:
                null,

            toAgentName:
                null,

            fromRmId:
                205,

            fromRmName:
                'Deepa Sharma',

            toRmId:
                202,

            toRmName:
                'Sneha Reddy',

            createdAt:
                '06 Sep 2026, 11:45:22',

            deletedAt:
                null,
        },

        {
            id: 5011,

            loanId:
                '10255',

            shuffledById:
                301,

            shuffledByName:
                'Suresh Kumar',

            shuffledByRole:
                'teamlead_agent_business',

            fromAgentId:
                105,

            fromAgentName:
                'Rahul Sharma',

            toAgentId:
                110,

            toAgentName:
                'Vikram Singh',

            fromRmId:
                null,

            fromRmName:
                null,

            toRmId:
                null,

            toRmName:
                null,

            createdAt:
                '06 Sep 2026, 01:18:09',

            deletedAt:
                null,
        },

        {
            id: 5012,

            loanId:
                '10256',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                null,

            fromAgentName:
                null,

            toAgentId:
                null,

            toAgentName:
                null,

            fromRmId:
                201,

            fromRmName:
                'Priya Nair',

            toRmId:
                205,

            toRmName:
                'Deepa Sharma',

            createdAt:
                '07 Sep 2026, 02:52:31',

            deletedAt:
                null,
        },

        {
            id: 5013,

            loanId:
                '10257',

            shuffledById:
                302,

            shuffledByName:
                'Priya Nair',

            shuffledByRole:
                'teamlead_agent_personal',

            fromAgentId:
                110,

            fromAgentName:
                'Vikram Singh',

            toAgentId:
                112,

            toAgentName:
                'Arjun Rao',

            fromRmId:
                202,

            fromRmName:
                'Sneha Reddy',

            toRmId:
                202,

            toRmName:
                'Sneha Reddy',

            createdAt:
                '07 Sep 2026, 03:25:16',

            deletedAt:
                null,
        },

        {
            id: 5014,

            loanId:
                '10258',

            shuffledById:
                303,

            shuffledByName:
                'Rajesh Kumar',

            shuffledByRole:
                'teamlead_agent_business',

            fromAgentId:
                null,

            fromAgentName:
                null,

            toAgentId:
                null,

            toAgentName:
                null,

            fromRmId:
                203,

            fromRmName:
                'Rajesh Rao',

            toRmId:
                204,

            toRmName:
                'Manoj Kumar',

            createdAt:
                '08 Sep 2026, 09:14:42',

            deletedAt:
                null,
        },

        {
            id: 5015,

            loanId:
                '10259',

            shuffledById:
                1,

            shuffledByName:
                'Admin',

            shuffledByRole:
                'admin',

            fromAgentId:
                115,

            fromAgentName:
                'Kiran Kumar',

            toAgentId:
                105,

            toAgentName:
                'Rahul Sharma',

            fromRmId:
                205,

            fromRmName:
                'Deepa Sharma',

            toRmId:
                201,

            toRmName:
                'Priya Nair',

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


    const [shuffledById, setShuffledById] =
        useState('')


    const [fromAgentId, setFromAgentId] =
        useState('')


    const [toAgentId, setToAgentId] =
        useState('')


    const [fromRmId, setFromRmId] =
        useState('')


    const [toRmId, setToRmId] =
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
            // SEARCH LOAN ID
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                String(log.loanId)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // SHUFFLED BY
            // -------------------------------------------------

            const matchesShuffledBy =
                !shuffledById ||
                String(log.shuffledById) ===
                    String(shuffledById)


            // -------------------------------------------------
            // FROM AGENT
            // -------------------------------------------------

            const matchesFromAgent =
                !fromAgentId ||
                String(log.fromAgentId) ===
                    String(fromAgentId)


            // -------------------------------------------------
            // TO AGENT
            // -------------------------------------------------

            const matchesToAgent =
                !toAgentId ||
                String(log.toAgentId) ===
                    String(toAgentId)


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
                matchesShuffledBy &&
                matchesFromAgent &&
                matchesToAgent &&
                matchesFromRm &&
                matchesToRm &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        shuffledById,
        fromAgentId,
        toAgentId,
        fromRmId,
        toRmId,
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

        setShuffledById('')

        setFromAgentId('')

        setToAgentId('')

        setFromRmId('')

        setToRmId('')

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
    // SHUFFLED BY
    // =========================================================

    const handleShuffledByChange = (
        value
    ) => {

        setShuffledById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // FROM AGENT
    // =========================================================

    const handleFromAgentChange = (
        value
    ) => {

        setFromAgentId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // TO AGENT
    // =========================================================

    const handleToAgentChange = (
        value
    ) => {

        setToAgentId(value)

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
            'Refresh loan shuffle logs'
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
                    Loan Shuffle Logs
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    View loan assignment shuffle history between agents and RMs.
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
                        ROW 1 — SEARCH + SHUFFLED BY + AGENTS
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
                                    placeholder="Search loan ID..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            SHUFFLED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <EmployeeDropdown
                                label=""
                                value={shuffledById}
                                onChange={
                                    handleShuffledByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Shuffled By"
                            />

                        </div>


                        {/* =========================================
                            FROM AGENT
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <AgentDropdown
                                label=""
                                value={fromAgentId}
                                onChange={
                                    handleFromAgentChange
                                }
                                options={agents}
                                allLabel="All Agents"
                                placeholder="From Agent"
                            />

                        </div>


                        {/* =========================================
                            TO AGENT
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <AgentDropdown
                                label=""
                                value={toAgentId}
                                onChange={
                                    handleToAgentChange
                                }
                                options={agents}
                                allLabel="All Agents"
                                placeholder="To Agent"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        ROW 2 — RMS + DATES + ACTIONS
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
                            FROM RM
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
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
                            lg:col-span-2
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
                            lg:col-span-3
                            xl:col-span-2
                        ">

                            <div className="
                                flex
                                w-full
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
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

            <LoanShuffleLogTable
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


export default LoanShuffleLogs