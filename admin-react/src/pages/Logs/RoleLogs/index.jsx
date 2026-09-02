import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import RoleLogTable from './components/RoleLogTable'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'


function RoleLogs() {

    // =========================================================
    // MOCK ROLES
    // =========================================================

    const roles = [
        {
            id: 1,
            name: 'Agent',
        },

        {
            id: 2,
            name: 'Relationship Manager',
        },

        {
            id: 3,
            name: 'Team Lead',
        },

        {
            id: 4,
            name: 'Admin',
        },

        {
            id: 5,
            name: 'Super Admin',
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
            id: 'ACTIVATED',
            name: 'Activated',
        },

        {
            id: 'DEACTIVATED',
            name: 'Deactivated',
        },

        {
            id: 'DELETED',
            name: 'Deleted',
        },
    ]


    // =========================================================
    // MOCK ROLE LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 1,

            roleId: 1,

            roleName:
                'Agent',

            actionById: 1,

            actionByName:
                'John Admin',

            actionByEmployeeId:
                'ADM001',

            actionByRole:
                'Admin',

            event:
                'CREATED',

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 2,

            roleId: 1,

            roleName:
                'Agent',

            actionById: 1,

            actionByName:
                'John Admin',

            actionByEmployeeId:
                'ADM001',

            actionByRole:
                'Admin',

            event:
                'UPDATED',

            createdAt:
                '02 Sep 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 3,

            roleId: 1,

            roleName:
                'Agent',

            actionById: 1,

            actionByName:
                'John Admin',

            actionByEmployeeId:
                'ADM001',

            actionByRole:
                'Admin',

            event:
                'ACTIVATED',

            createdAt:
                '03 Sep 2026, 11:21:08',

            deletedAt:
                null,
        },

        {
            id: 4,

            roleId: 1,

            roleName:
                'Agent',

            actionById: 1,

            actionByName:
                'John Admin',

            actionByEmployeeId:
                'ADM001',

            actionByRole:
                'Admin',

            event:
                'DEACTIVATED',

            createdAt:
                '04 Sep 2026, 12:03:51',

            deletedAt:
                null,
        },

        {
            id: 5,

            roleId: 1,

            roleName:
                'Agent',

            actionById: 1,

            actionByName:
                'John Admin',

            actionByEmployeeId:
                'ADM001',

            actionByRole:
                'Admin',

            event:
                'DELETED',

            createdAt:
                '05 Sep 2026, 01:18:25',

            deletedAt:
                '05 Sep 2026, 01:18:25',
        },

        {
            id: 6,

            roleId: 2,

            roleName:
                'Relationship Manager',

            actionById: 2,

            actionByName:
                'Rahul Admin',

            actionByEmployeeId:
                'ADM002',

            actionByRole:
                'Admin',

            event:
                'CREATED',

            createdAt:
                '06 Sep 2026, 09:30:14',

            deletedAt:
                null,
        },

        {
            id: 7,

            roleId: 2,

            roleName:
                'Relationship Manager',

            actionById: 2,

            actionByName:
                'Rahul Admin',

            actionByEmployeeId:
                'ADM002',

            actionByRole:
                'Admin',

            event:
                'UPDATED',

            createdAt:
                '07 Sep 2026, 10:42:33',

            deletedAt:
                null,
        },

        {
            id: 8,

            roleId: 3,

            roleName:
                'Team Lead',

            actionById: 3,

            actionByName:
                'Priya Admin',

            actionByEmployeeId:
                'ADM003',

            actionByRole:
                'Admin',

            event:
                'CREATED',

            createdAt:
                '08 Sep 2026, 12:15:42',

            deletedAt:
                null,
        },

        {
            id: 9,

            roleId: 3,

            roleName:
                'Team Lead',

            actionById: 3,

            actionByName:
                'Priya Admin',

            actionByEmployeeId:
                'ADM003',

            actionByRole:
                'Admin',

            event:
                'ACTIVATED',

            createdAt:
                '09 Sep 2026, 01:05:17',

            deletedAt:
                null,
        },

        {
            id: 10,

            roleId: 3,

            roleName:
                'Team Lead',

            actionById: 3,

            actionByName:
                'Priya Admin',

            actionByEmployeeId:
                'ADM003',

            actionByRole:
                'Admin',

            event:
                'UPDATED',

            createdAt:
                '10 Sep 2026, 02:20:31',

            deletedAt:
                null,
        },

        {
            id: 11,

            roleId: 4,

            roleName:
                'Admin',

            actionById: 4,

            actionByName:
                'Vikram Admin',

            actionByEmployeeId:
                'ADM004',

            actionByRole:
                'Admin',

            event:
                'CREATED',

            createdAt:
                '11 Sep 2026, 03:14:22',

            deletedAt:
                null,
        },

        {
            id: 12,

            roleId: 4,

            roleName:
                'Admin',

            actionById: 4,

            actionByName:
                'Vikram Admin',

            actionByEmployeeId:
                'ADM004',

            actionByRole:
                'Admin',

            event:
                'DEACTIVATED',

            createdAt:
                '12 Sep 2026, 04:05:49',

            deletedAt:
                null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
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
            // SEARCH ROLE
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                log.roleName
                    ?.toLowerCase()
                    .includes(searchValue)


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
                matchesActionBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
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
                            SEARCH ROLE
                        ============================================= */}

                        <div className="
                            min-w-0
                            sm:col-span-2
                            lg:col-span-2
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
                                    placeholder="Search role"
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
                            ACTION BY
                        ============================================= */}

                        <div className="
                            relative
                            z-50
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

                <RoleLogTable
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


export default RoleLogs