// admin-react\src\pages\Logs\TeamLeadLogs\index.jsx
import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import TeamLeadLogTable from './components/TeamLeadLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'
import TeamLeadDropdown from '../../../components/GlobalModels/Filters/TeamLeadDropdown'


function TeamLeadLogs() {

    // =========================================================
    // MOCK TEAM LEADS
    // =========================================================

    const teamLeads = [
        {
            id: 301,
            name: 'Suresh Kumar',
            employeeId: 'EMP301',
            role: 'Team Lead',
        },

        {
            id: 302,
            name: 'Mahesh Rao',
            employeeId: 'EMP302',
            role: 'Team Lead',
        },

        {
            id: 303,
            name: 'Priya Sharma',
            employeeId: 'EMP303',
            role: 'Team Lead',
        },

        {
            id: 304,
            name: 'Vijay Kumar',
            employeeId: 'EMP304',
            role: 'Team Lead',
        },

        {
            id: 305,
            name: 'Sneha Reddy',
            employeeId: 'EMP305',
            role: 'Team Lead',
        },
    ]


    // =========================================================
    // MOCK ACTION-BY USERS
    // =========================================================

    const actionByUsers = [
        {
            id: 1,
            name: 'John Admin',
            employeeId: 'ADM001',
            role: 'Admin',
        },

        {
            id: 2,
            name: 'Rahul Admin',
            employeeId: 'ADM002',
            role: 'Admin',
        },

        {
            id: 3,
            name: 'Priya Admin',
            employeeId: 'ADM003',
            role: 'Admin',
        },

        {
            id: 4,
            name: 'Vikram Admin',
            employeeId: 'ADM004',
            role: 'Admin',
        },
    ]


    // =========================================================
    // EVENT OPTIONS
    // =========================================================

    const eventOptions = [
        {
            id: 'ALL',
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
    ]


    // =========================================================
    // MOCK TEAM LEAD LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 9001,
            teamLeadId: 301,
            teamLeadName: 'Suresh Kumar',
            teamLeadEmployeeId: 'EMP301',
            teamLeadRole: 'Team Lead',
            actionById: 1,
            actionByName: 'John Admin',
            actionByEmployeeId: 'ADM001',
            actionByRole: 'Admin',
            event: 'CREATED',
            createdAt: '01 Sep 2026, 09:42:12',
            deletedAt: null,
        },

        {
            id: 9002,
            teamLeadId: 301,
            teamLeadName: 'Suresh Kumar',
            teamLeadEmployeeId: 'EMP301',
            teamLeadRole: 'Team Lead',
            actionById: 1,
            actionByName: 'John Admin',
            actionByEmployeeId: 'ADM001',
            actionByRole: 'Admin',
            event: 'PERMISSIONS_UPDATED',
            createdAt: '02 Sep 2026, 10:15:43',
            deletedAt: null,
        },

        {
            id: 9003,
            teamLeadId: 301,
            teamLeadName: 'Suresh Kumar',
            teamLeadEmployeeId: 'EMP301',
            teamLeadRole: 'Team Lead',
            actionById: 1,
            actionByName: 'John Admin',
            actionByEmployeeId: 'ADM001',
            actionByRole: 'Admin',
            event: 'UPDATED',
            createdAt: '03 Sep 2026, 11:21:08',
            deletedAt: null,
        },

        {
            id: 9004,
            teamLeadId: 301,
            teamLeadName: 'Suresh Kumar',
            teamLeadEmployeeId: 'EMP301',
            teamLeadRole: 'Team Lead',
            actionById: 1,
            actionByName: 'John Admin',
            actionByEmployeeId: 'ADM001',
            actionByRole: 'Admin',
            event: 'DEACTIVATED',
            createdAt: '04 Sep 2026, 12:03:51',
            deletedAt: null,
        },

        {
            id: 9005,
            teamLeadId: 302,
            teamLeadName: 'Mahesh Rao',
            teamLeadEmployeeId: 'EMP302',
            teamLeadRole: 'Team Lead',
            actionById: 2,
            actionByName: 'Rahul Admin',
            actionByEmployeeId: 'ADM002',
            actionByRole: 'Admin',
            event: 'CREATED',
            createdAt: '05 Sep 2026, 09:18:25',
            deletedAt: null,
        },

        {
            id: 9006,
            teamLeadId: 302,
            teamLeadName: 'Mahesh Rao',
            teamLeadEmployeeId: 'EMP302',
            teamLeadRole: 'Team Lead',
            actionById: 2,
            actionByName: 'Rahul Admin',
            actionByEmployeeId: 'ADM002',
            actionByRole: 'Admin',
            event: 'ACTIVATED',
            createdAt: '06 Sep 2026, 10:30:14',
            deletedAt: null,
        },

        {
            id: 9007,
            teamLeadId: 302,
            teamLeadName: 'Mahesh Rao',
            teamLeadEmployeeId: 'EMP302',
            teamLeadRole: 'Team Lead',
            actionById: 2,
            actionByName: 'Rahul Admin',
            actionByEmployeeId: 'ADM002',
            actionByRole: 'Admin',
            event: 'PERMISSIONS_ADDED',
            createdAt: '07 Sep 2026, 11:42:33',
            deletedAt: null,
        },

        {
            id: 9008,
            teamLeadId: 303,
            teamLeadName: 'Priya Sharma',
            teamLeadEmployeeId: 'EMP303',
            teamLeadRole: 'Team Lead',
            actionById: 3,
            actionByName: 'Priya Admin',
            actionByEmployeeId: 'ADM003',
            actionByRole: 'Admin',
            event: 'UPDATED',
            createdAt: '08 Sep 2026, 12:15:42',
            deletedAt: null,
        },

        {
            id: 9009,
            teamLeadId: 303,
            teamLeadName: 'Priya Sharma',
            teamLeadEmployeeId: 'EMP303',
            teamLeadRole: 'Team Lead',
            actionById: 3,
            actionByName: 'Priya Admin',
            actionByEmployeeId: 'ADM003',
            actionByRole: 'Admin',
            event: 'PERMISSIONS_REMOVED',
            createdAt: '09 Sep 2026, 01:05:17',
            deletedAt: null,
        },

        {
            id: 9010,
            teamLeadId: 304,
            teamLeadName: 'Vijay Kumar',
            teamLeadEmployeeId: 'EMP304',
            teamLeadRole: 'Team Lead',
            actionById: 4,
            actionByName: 'Vikram Admin',
            actionByEmployeeId: 'ADM004',
            actionByRole: 'Admin',
            event: 'ABSENT',
            createdAt: '10 Sep 2026, 02:20:31',
            deletedAt: null,
        },

        {
            id: 9011,
            teamLeadId: 304,
            teamLeadName: 'Vijay Kumar',
            teamLeadEmployeeId: 'EMP304',
            teamLeadRole: 'Team Lead',
            actionById: 4,
            actionByName: 'Vikram Admin',
            actionByEmployeeId: 'ADM004',
            actionByRole: 'Admin',
            event: 'INACTIVE',
            createdAt: '11 Sep 2026, 03:14:22',
            deletedAt: null,
        },

        {
            id: 9012,
            teamLeadId: 305,
            teamLeadName: 'Sneha Reddy',
            teamLeadEmployeeId: 'EMP305',
            teamLeadRole: 'Team Lead',
            actionById: 1,
            actionByName: 'John Admin',
            actionByEmployeeId: 'ADM001',
            actionByRole: 'Admin',
            event: 'DELETED',
            createdAt: '12 Sep 2026, 04:05:49',
            deletedAt: '12 Sep 2026, 04:05:49',
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [teamLeadId, setTeamLeadId] =
        useState('')

    const [actionById, setActionById] =
        useState('')

    const [event, setEvent] =
        useState('ALL')

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
                log.teamLeadName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                log.teamLeadEmployeeId
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.teamLeadId)
                    .toLowerCase()
                    .includes(searchValue) ||
                log.actionByName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                String(log.actionById)
                    .toLowerCase()
                    .includes(searchValue) ||
                String(log.id)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // TEAM LEAD
            // -------------------------------------------------

            const matchesTeamLead =
                !teamLeadId ||
                String(log.teamLeadId) ===
                    String(teamLeadId)


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
                event === 'ALL' ||
                log.event === event


            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            const logDate =
                log.createdAt
                    ? new Date(log.createdAt)
                    : null


            const matchesFromDate =
                !fromDate ||
                (
                    logDate &&
                    !Number.isNaN(
                        logDate.getTime()
                    ) &&
                    logDate >=
                        new Date(
                            `${fromDate}T00:00:00`
                        )
                )


            const matchesToDate =
                !toDate ||
                (
                    logDate &&
                    !Number.isNaN(
                        logDate.getTime()
                    ) &&
                    logDate <=
                        new Date(
                            `${toDate}T23:59:59`
                        )
                )


            return (
                matchesSearch &&
                matchesTeamLead &&
                matchesActionBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        teamLeadId,
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
    // PAGINATED LOGS
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

        setTeamLeadId('')

        setActionById('')

        setEvent('ALL')

        setFromDate('')

        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH CHANGE
    // =========================================================

    const handleSearchChange = (value) => {

        setSearch(value)

        setCurrentPage(1)

    }


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (value) => {

        setTeamLeadId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // ACTION BY CHANGE
    // =========================================================

    const handleActionByChange = (value) => {

        setActionById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // EVENT CHANGE
    // =========================================================

    const handleEventChange = (event) => {

        setEvent(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // FROM DATE CHANGE
    // =========================================================

    const handleFromDateChange = (event) => {

        setFromDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // TO DATE CHANGE
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

        /*
         * Replace with API call later.
         */

        console.log(
            'Refresh team lead logs'
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
            w-full
            min-w-0
            space-y-5
            p-4
            sm:p-6
        ">

          

            {/* =====================================================
                FILTER CARD
            ===================================================== */}

            <div className="
                relative
                z-20
                w-full
                min-w-0
                overflow-visible
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    p-4
                    sm:p-5
                ">

                    {/* =================================================
                        FILTER GRID
                    ================================================= */}

                    <div className="
                        grid
                        w-full
                        min-w-0
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                    ">

                        {/* =============================================
                            SEARCH
                        ============================================= */}

                        <div className="
                            min-w-0
                            sm:col-span-2
                            lg:col-span-1
                        ">

                            <label className="
                                input
                                input-bordered
                                flex
                                h-11
                                min-h-11
                                w-full
                                min-w-0
                                items-center
                                gap-3
                                bg-base-100
                                transition-colors
                                focus-within:border-[#8BCF00]
                                focus-within:outline-none
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
                                    placeholder="Search team lead or ID"
                                    className="
                                        min-w-0
                                        grow
                                        bg-transparent
                                        text-sm
                                        outline-none
                                    "
                                />

                            </label>

                        </div>


                        {/* =============================================
                            TEAM LEAD
                        ============================================= */}

                        <div className="
                            relative
                            z-50
                            min-w-0
                        ">

                            <TeamLeadDropdown
                                label=""
                                value={teamLeadId}
                                onChange={
                                    handleTeamLeadChange
                                }
                                options={teamLeads}
                                allLabel="All Team Leads"
                                placeholder="All Team Leads"
                            />

                        </div>


                        {/* =============================================
                            ACTION BY
                        ============================================= */}

                        <div className="
                            relative
                            z-40
                            min-w-0
                        ">

                            <EmployeeDropdown
                                label=""
                                value={actionById}
                                onChange={
                                    handleActionByChange
                                }
                                options={actionByUsers}
                                allLabel="All Action By"
                                placeholder="All Action By"
                            />

                        </div>


                        {/* =============================================
                            EVENT
                        ============================================= */}

                        <div className="
                            relative
                            z-10
                            min-w-0
                        ">

                            <select
                                value={event}
                                onChange={
                                    handleEventChange
                                }
                                className="
                                    select
                                    select-bordered
                                    h-11
                                    min-h-11
                                    w-full
                                    min-w-0
                                    bg-base-100
                                    text-sm
                                    transition-colors
                                    focus:border-[#8BCF00]
                                    focus:outline-none
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


                        {/* =============================================
                            FROM DATE
                        ============================================= */}

                        <div className="
                            min-w-0
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
                                    h-11
                                    min-h-11
                                    w-full
                                    min-w-0
                                    bg-base-100
                                    text-sm
                                    transition-colors
                                    focus:border-[#8BCF00]
                                    focus:outline-none
                                "
                                title="From date"
                                aria-label="From date"
                            />

                        </div>


                        {/* =============================================
                            TO DATE
                        ============================================= */}

                        <div className="
                            min-w-0
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
                                    h-11
                                    min-h-11
                                    w-full
                                    min-w-0
                                    bg-base-100
                                    text-sm
                                    transition-colors
                                    focus:border-[#8BCF00]
                                    focus:outline-none
                                "
                                title="To date"
                                aria-label="To date"
                            />

                        </div>


                        {/* =============================================
                            RESET
                        ============================================= */}

                        <div className="
                            min-w-0
                        ">

                            <button
                                type="button"
                                onClick={handleReset}
                                className="
                                    btn
                                    h-11
                                    min-h-11
                                    w-full
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-5
                                    text-sm
                                    font-medium
                                    text-base-content/70
                                    transition-colors
                                    hover:border-base-300
                                    hover:bg-base-200
                                "
                            >
                                Reset
                            </button>

                        </div>


                        {/* =============================================
                            REFRESH
                        ============================================= */}

                        <div className="
                            min-w-0
                        ">

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="
                                    btn
                                    h-11
                                    min-h-11
                                    w-full
                                    gap-2
                                    border-[#8BCF00]
                                    bg-[#8BCF00]
                                    px-5
                                    text-sm
                                    font-medium
                                    text-white
                                    transition-colors
                                    hover:border-[#6FA800]
                                    hover:bg-[#6FA800]
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

            <div className="
                relative
                z-10
                min-w-0
            ">

                <TeamLeadLogTable
                    logs={paginatedLogs}
                />

            </div>


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {filteredLogs.length > 0 && (

                <div className="
                    relative
                    z-10
                    flex
                    min-w-0
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
                        max-w-full
                        items-center
                        gap-1
                        overflow-x-auto
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
                                shrink-0
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
                                        shrink-0
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
                                shrink-0
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


export default TeamLeadLogs