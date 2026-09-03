// admin-react/src/pages/Logs/LoanTypeChangeLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import LoanTypeChangeLogTable from './components/LoanTypeChangeLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'
import TeamLeadDropdown from '../../../components/GlobalModels/Filters/TeamLeadDropdown'


function LoanTypeChangeLogs() {

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
    // LOAN TYPE OPTIONS
    // =========================================================

    const loanTypeOptions = [
        {
            id: '',
            name: 'All Loan Types',
        },

        {
            id: 'PERSONAL',
            name: 'Personal Loan',
        },

        {
            id: 'BUSINESS',
            name: 'Business Loan',
        },

        {
            id: 'HOME',
            name: 'Home Loan',
        },

        {
            id: 'CAR',
            name: 'Car Loan',
        },

        {
            id: 'EDUCATION',
            name: 'Education Loan',
        },
    ]


    // =========================================================
    // MOCK LOAN TYPE CHANGE LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 6001,
            loanId: '10245',
            changedById: 105,
            changedByName: 'Rahul Sharma',
            changedByRole: 'agent',
            reportsToId: 301,
            reportsToName: 'Suresh Kumar',
            fromLoanType: 'PERSONAL',
            toLoanType: 'BUSINESS',
            createdAt: '01 Sep 2026, 09:42:12',
            deletedAt: null,
        },

        {
            id: 6002,
            loanId: '10246',
            changedById: 108,
            changedByName: 'Anil Kumar',
            changedByRole: 'rm',
            reportsToId: 302,
            reportsToName: 'Priya Singh',
            fromLoanType: 'BUSINESS',
            toLoanType: 'PERSONAL',
            createdAt: '02 Sep 2026, 10:15:43',
            deletedAt: null,
        },

        {
            id: 6003,
            loanId: '10247',
            changedById: 110,
            changedByName: 'Vikram Singh',
            changedByRole: 'agent',
            reportsToId: 303,
            reportsToName: 'Rajesh Kumar',
            fromLoanType: 'PERSONAL',
            toLoanType: 'HOME',
            createdAt: '02 Sep 2026, 11:21:08',
            deletedAt: null,
        },

        {
            id: 6004,
            loanId: '10248',
            changedById: 112,
            changedByName: 'Arjun Rao',
            changedByRole: 'rm',
            reportsToId: 301,
            reportsToName: 'Suresh Kumar',
            fromLoanType: 'HOME',
            toLoanType: 'PERSONAL',
            createdAt: '03 Sep 2026, 09:03:51',
            deletedAt: null,
        },

        {
            id: 6005,
            loanId: '10249',
            changedById: 115,
            changedByName: 'Kiran Kumar',
            changedByRole: 'agent',
            reportsToId: 304,
            reportsToName: 'Manoj Rao',
            fromLoanType: 'PERSONAL',
            toLoanType: 'CAR',
            createdAt: '03 Sep 2026, 10:30:25',
            deletedAt: null,
        },

        {
            id: 6006,
            loanId: '10250',
            changedById: 105,
            changedByName: 'Rahul Sharma',
            changedByRole: 'agent',
            reportsToId: 302,
            reportsToName: 'Priya Singh',
            fromLoanType: 'CAR',
            toLoanType: 'PERSONAL',
            createdAt: '04 Sep 2026, 11:10:14',
            deletedAt: null,
        },

        {
            id: 6007,
            loanId: '10251',
            changedById: 108,
            changedByName: 'Anil Kumar',
            changedByRole: 'rm',
            reportsToId: 303,
            reportsToName: 'Rajesh Kumar',
            fromLoanType: 'BUSINESS',
            toLoanType: 'HOME',
            createdAt: '04 Sep 2026, 12:05:37',
            deletedAt: null,
        },

        {
            id: 6008,
            loanId: '10252',
            changedById: 110,
            changedByName: 'Vikram Singh',
            changedByRole: 'agent',
            reportsToId: 304,
            reportsToName: 'Manoj Rao',
            fromLoanType: 'HOME',
            toLoanType: 'BUSINESS',
            createdAt: '05 Sep 2026, 09:42:19',
            deletedAt: null,
        },

        {
            id: 6009,
            loanId: '10253',
            changedById: 112,
            changedByName: 'Arjun Rao',
            changedByRole: 'rm',
            reportsToId: 301,
            reportsToName: 'Suresh Kumar',
            fromLoanType: 'PERSONAL',
            toLoanType: 'EDUCATION',
            createdAt: '05 Sep 2026, 10:12:44',
            deletedAt: null,
        },

        {
            id: 6010,
            loanId: '10254',
            changedById: 115,
            changedByName: 'Kiran Kumar',
            changedByRole: 'agent',
            reportsToId: 302,
            reportsToName: 'Priya Singh',
            fromLoanType: 'EDUCATION',
            toLoanType: 'PERSONAL',
            createdAt: '06 Sep 2026, 11:45:22',
            deletedAt: null,
        },

        {
            id: 6011,
            loanId: '10255',
            changedById: 105,
            changedByName: 'Rahul Sharma',
            changedByRole: 'agent',
            reportsToId: 303,
            reportsToName: 'Rajesh Kumar',
            fromLoanType: 'PERSONAL',
            toLoanType: 'BUSINESS',
            createdAt: '06 Sep 2026, 01:18:09',
            deletedAt: null,
        },

        {
            id: 6012,
            loanId: '10256',
            changedById: 108,
            changedByName: 'Anil Kumar',
            changedByRole: 'rm',
            reportsToId: 304,
            reportsToName: 'Manoj Rao',
            fromLoanType: 'BUSINESS',
            toLoanType: 'CAR',
            createdAt: '07 Sep 2026, 02:52:31',
            deletedAt: null,
        },

        {
            id: 6013,
            loanId: '10257',
            changedById: 110,
            changedByName: 'Vikram Singh',
            changedByRole: 'agent',
            reportsToId: 301,
            reportsToName: 'Suresh Kumar',
            fromLoanType: 'CAR',
            toLoanType: 'HOME',
            createdAt: '07 Sep 2026, 03:25:16',
            deletedAt: null,
        },

        {
            id: 6014,
            loanId: '10258',
            changedById: 112,
            changedByName: 'Arjun Rao',
            changedByRole: 'rm',
            reportsToId: 302,
            reportsToName: 'Priya Singh',
            fromLoanType: 'HOME',
            toLoanType: 'EDUCATION',
            createdAt: '08 Sep 2026, 09:14:42',
            deletedAt: null,
        },

        {
            id: 6015,
            loanId: '10259',
            changedById: 115,
            changedByName: 'Kiran Kumar',
            changedByRole: 'agent',
            reportsToId: 303,
            reportsToName: 'Rajesh Kumar',
            fromLoanType: 'EDUCATION',
            toLoanType: 'PERSONAL',
            createdAt: '08 Sep 2026, 10:36:28',
            deletedAt: null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [changedById, setChangedById] =
        useState('')

    const [reportsToId, setReportsToId] =
        useState('')

    const [fromLoanType, setFromLoanType] =
        useState('')

    const [toLoanType, setToLoanType] =
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
                log.reportsToName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.reportsToId)
                    .toLowerCase()
                    .includes(searchValue)


            const matchesChangedBy =
                !changedById ||
                String(log.changedById) ===
                    String(changedById)


            const matchesReportsTo =
                !reportsToId ||
                String(log.reportsToId) ===
                    String(reportsToId)


            const matchesFromLoanType =
                !fromLoanType ||
                log.fromLoanType ===
                    fromLoanType


            const matchesToLoanType =
                !toLoanType ||
                log.toLoanType ===
                    toLoanType


            const logDate =
                log.createdAt
                    ? new Date(log.createdAt)
                    : null


            const matchesFromDate =
                !fromDate ||
                (
                    logDate &&
                    logDate >=
                        new Date(
                            `${fromDate}T00:00:00`
                        )
                )


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
                matchesReportsTo &&
                matchesFromLoanType &&
                matchesToLoanType &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        changedById,
        reportsToId,
        fromLoanType,
        toLoanType,
        fromDate,
        toDate,
    ])


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredLogs.length /
                pageSize
            )
        )


    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        )


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
        setChangedById('')
        setReportsToId('')
        setFromLoanType('')
        setToLoanType('')
        setFromDate('')
        setToDate('')
        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange = (value) => {

        setSearch(value)
        setCurrentPage(1)

    }


    // =========================================================
    // CHANGED BY
    // =========================================================

    const handleChangedByChange = (value) => {

        setChangedById(value)
        setCurrentPage(1)

    }


    // =========================================================
    // REPORTS TO
    // =========================================================

    const handleReportsToChange = (value) => {

        setReportsToId(value)
        setCurrentPage(1)

    }


    // =========================================================
    // FROM LOAN TYPE
    // =========================================================

    const handleFromLoanTypeChange = (event) => {

        setFromLoanType(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // TO LOAN TYPE
    // =========================================================

    const handleToLoanTypeChange = (event) => {

        setToLoanType(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // FROM DATE
    // =========================================================

    const handleFromDateChange = (event) => {

        setFromDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // TO DATE
    // =========================================================

    const handleToDateChange = (event) => {

        setToDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        console.log(
            'Refresh loan type change logs'
        )

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (page) => {

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
                            CHANGED BY
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

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
                            FROM LOAN TYPE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <select
                                value={fromLoanType}
                                onChange={
                                    handleFromLoanTypeChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                {loanTypeOptions.map(
                                    (option) => (

                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.id
                                                ? `From: ${option.name}`
                                                : 'From Loan Type'
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            TO LOAN TYPE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <select
                                value={toLoanType}
                                onChange={
                                    handleToLoanTypeChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                {loanTypeOptions.map(
                                    (option) => (

                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.id
                                                ? `To: ${option.name}`
                                                : 'To Loan Type'
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =========================================
                            ACTIONS
                            From Date + To Date + Reset + Refresh
                            stay together in the same row.
                        ========================================= */}

                        <div className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                            lg:col-span-3
                        ">

                            {/* From Date */}

                            <input
                                type="date"
                                value={fromDate}
                                onChange={
                                    handleFromDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    min-w-0
                                    w-full
                                "
                                title="From date"
                            />


                            {/* To Date */}

                            <input
                                type="date"
                                value={toDate}
                                onChange={
                                    handleToDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    min-w-0
                                    w-full
                                "
                                title="To date"
                            />


                            {/* Reset + Refresh */}

                            <div className="
                                flex
                                shrink-0
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                            ">

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                        px-3
                                    "
                                >
                                    Reset
                                </button>


                                <div className="
                                    h-6
                                    w-px
                                    bg-base-300
                                " />


                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                        px-3
                                    "
                                    title="Refresh logs"
                                >

                                    <ArrowPathIcon className="
                                        h-4
                                        w-4
                                    " />

                                    <span className="
                                        hidden
                                        xl:inline
                                    ">
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

            <LoanTypeChangeLogTable
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


                    <div className="
                        flex
                        items-center
                        gap-1
                    ">

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


export default LoanTypeChangeLogs