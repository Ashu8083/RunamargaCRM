// admin-react/src/pages/Logs/LoanAssignmentLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import LoanAssignmentLogTable from './components/LoanAssignmentLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'


function LoanAssignmentLogs() {

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
            name: 'Priya Singh',
            employeeId: '302',
            role: 'teamlead_rm_business',
        },
    ]


    // =========================================================
    // MOCK LOAN ASSIGNMENT LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 5001,

            employeeId: 105,

            employeeName: 'Rahul Sharma',

            employeeRole: 'agent',

            reportsToId: 301,

            reportsToName: 'Suresh Kumar',

            loanType: 'PERSONAL',

            event: 'Auto-assignment enabled',

            createdAt: '01 Sep 2026, 09:42:12',

            deletedAt: null,
        },

        {
            id: 5002,

            employeeId: 105,

            employeeName: 'Rahul Sharma',

            employeeRole: 'agent',

            reportsToId: 301,

            reportsToName: 'Suresh Kumar',

            loanType: 'BUSINESS',

            event: 'Auto-assignment enabled',

            createdAt: '01 Sep 2026, 10:15:43',

            deletedAt: null,
        },

        {
            id: 5003,

            employeeId: 105,

            employeeName: 'Rahul Sharma',

            employeeRole: 'agent',

            reportsToId: 301,

            reportsToName: 'Suresh Kumar',

            loanType: 'PERSONAL',

            event: 'Auto-assignment disabled',

            createdAt: '02 Sep 2026, 11:21:08',

            deletedAt: null,
        },

        {
            id: 5004,

            employeeId: 108,

            employeeName: 'Anil Kumar',

            employeeRole: 'agent',

            reportsToId: 302,

            reportsToName: 'Priya Singh',

            loanType: 'PERSONAL',

            event: 'Auto-assignment enabled',

            createdAt: '02 Sep 2026, 09:03:51',

            deletedAt: null,
        },

        {
            id: 5005,

            employeeId: 108,

            employeeName: 'Anil Kumar',

            employeeRole: 'agent',

            reportsToId: 302,

            reportsToName: 'Priya Singh',

            loanType: 'BUSINESS',

            event: 'Auto-assignment enabled',

            createdAt: '03 Sep 2026, 10:30:25',

            deletedAt: null,
        },

        {
            id: 5006,

            employeeId: 108,

            employeeName: 'Anil Kumar',

            employeeRole: 'agent',

            reportsToId: 302,

            reportsToName: 'Priya Singh',

            loanType: 'PERSONAL',

            event: 'Auto-assignment disabled',

            createdAt: '04 Sep 2026, 11:10:14',

            deletedAt: null,
        },

        {
            id: 5007,

            employeeId: 110,

            employeeName: 'Vikram Singh',

            employeeRole: 'agent',

            reportsToId: 303,

            reportsToName: 'Rajesh Kumar',

            loanType: 'BUSINESS',

            event: 'Auto-assignment enabled',

            createdAt: '04 Sep 2026, 12:05:37',

            deletedAt: null,
        },

        {
            id: 5008,

            employeeId: 110,

            employeeName: 'Vikram Singh',

            employeeRole: 'agent',

            reportsToId: 303,

            reportsToName: 'Rajesh Kumar',

            loanType: 'PERSONAL',

            event: 'Auto-assignment enabled',

            createdAt: '05 Sep 2026, 09:42:19',

            deletedAt: null,
        },

        {
            id: 5009,

            employeeId: 112,

            employeeName: 'Arjun Rao',

            employeeRole: 'rm',

            reportsToId: 301,

            reportsToName: 'Suresh Kumar',

            loanType: 'BUSINESS',

            event: 'Auto-assignment enabled',

            createdAt: '05 Sep 2026, 10:12:44',

            deletedAt: null,
        },

        {
            id: 5010,

            employeeId: 112,

            employeeName: 'Arjun Rao',

            employeeRole: 'rm',

            reportsToId: 301,

            reportsToName: 'Suresh Kumar',

            loanType: 'PERSONAL',

            event: 'Auto-assignment disabled',

            createdAt: '06 Sep 2026, 11:45:22',

            deletedAt: null,
        },

        {
            id: 5011,

            employeeId: 115,

            employeeName: 'Kiran Kumar',

            employeeRole: 'agent',

            reportsToId: 302,

            reportsToName: 'Priya Singh',

            loanType: 'PERSONAL',

            event: 'Auto-assignment enabled',

            createdAt: '06 Sep 2026, 01:18:09',

            deletedAt: null,
        },

        {
            id: 5012,

            employeeId: 115,

            employeeName: 'Kiran Kumar',

            employeeRole: 'agent',

            reportsToId: 302,

            reportsToName: 'Priya Singh',

            loanType: 'BUSINESS',

            event: 'Auto-assignment disabled',

            createdAt: '07 Sep 2026, 02:52:31',

            deletedAt: null,
        },

        {
            id: 5013,

            employeeId: 105,

            employeeName: 'Rahul Sharma',

            employeeRole: 'agent',

            reportsToId: 301,

            reportsToName: 'Suresh Kumar',

            loanType: 'BUSINESS',

            event: 'Auto-assignment enabled',

            createdAt: '07 Sep 2026, 03:25:16',

            deletedAt: null,
        },

        {
            id: 5014,

            employeeId: 108,

            employeeName: 'Anil Kumar',

            employeeRole: 'agent',

            reportsToId: 302,

            reportsToName: 'Priya Singh',

            loanType: 'PERSONAL',

            event: 'Auto-assignment enabled',

            createdAt: '08 Sep 2026, 09:14:42',

            deletedAt: null,
        },

        {
            id: 5015,

            employeeId: 110,

            employeeName: 'Vikram Singh',

            employeeRole: 'agent',

            reportsToId: 303,

            reportsToName: 'Rajesh Kumar',

            loanType: 'BUSINESS',

            event: 'Auto-assignment disabled',

            createdAt: '08 Sep 2026, 10:36:28',

            deletedAt: null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [employeeId, setEmployeeId] =
        useState('')


    const [loanType, setLoanType] =
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
                log.employeeName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.employeeId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.reportsToName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.reportsToId)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // EMPLOYEE
            // -------------------------------------------------

            const matchesEmployee =
                !employeeId ||
                String(log.employeeId) ===
                    String(employeeId)


            // -------------------------------------------------
            // LOAN TYPE
            // -------------------------------------------------

            const matchesLoanType =
                !loanType ||
                log.loanType === loanType


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
                matchesLoanType &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        employeeId,
        loanType,
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

        setLoanType('')

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
    // LOAN TYPE
    // =========================================================

    const handleLoanTypeChange = (
        value
    ) => {

        setLoanType(value)

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
            'Refresh loan assignment logs'
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
                    Loan Assignment Logs
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    View loan assignment configuration history.
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
                        FILTER ROW
                    ================================================= */}

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
                            lg:min-w-[240px]
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
                            w-full
                            sm:flex-1
                            lg:min-w-[170px]
                            lg:flex-1
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
                            LOAN TYPE
                        ========================================= */}

                        <div className="
                            min-w-0
                            w-full
                            sm:flex-1
                            lg:min-w-[170px]
                            lg:flex-1
                        ">

                            <LoanTypeDropdown
                                label=""
                                value={loanType}
                                onChange={
                                    handleLoanTypeChange
                                }
                                allLabel="All Loan Types"
                                placeholder="Loan Type"
                            />

                        </div>


                        {/* =========================================
                            FROM DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            w-full
                            sm:flex-1
                            lg:min-w-[145px]
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
                            lg:min-w-[145px]
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

            <LoanAssignmentLogTable
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


export default LoanAssignmentLogs