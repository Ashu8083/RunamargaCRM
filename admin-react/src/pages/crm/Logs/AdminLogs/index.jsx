// admin-react/src/pages/Logs/AdminLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AdminLogTable from './components/AdminLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'


function AdminLogs() {

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
            id: 'ACTIVE',
            name: 'Active',
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
    // MOCK ADMIN LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 1001,

            empId: 201,

            employeeName:
                'Rahul Sharma',

            performedById: 2,

            performedByName:
                'Rahul Admin',

            event:
                'CREATED',

            createdAt:
                '31 Aug 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 1002,

            empId: 201,

            employeeName:
                'Rahul Sharma',

            performedById: 2,

            performedByName:
                'Rahul Admin',

            event:
                'UPDATED',

            createdAt:
                '31 Aug 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 1003,

            empId: 202,

            employeeName:
                'Anil Kumar',

            performedById: 4,

            performedByName:
                'Vikram Admin',

            event:
                'DELETED',

            createdAt:
                '31 Aug 2026, 11:21:08',

            deletedAt:
                '31 Aug 2026, 11:21:08',
        },

        {
            id: 1004,

            empId: 203,

            employeeName:
                'Vikram Singh',

            performedById: 2,

            performedByName:
                'Rahul Admin',

            event:
                'ACTIVE',

            createdAt:
                '31 Aug 2026, 12:03:51',

            deletedAt:
                null,
        },

        {
            id: 1005,

            empId: 204,

            employeeName:
                'Arjun Rao',

            performedById: 1,

            performedByName:
                'John Admin',

            event:
                'ABSENT',

            createdAt:
                '31 Aug 2026, 12:30:25',

            deletedAt:
                null,
        },

        {
            id: 1006,

            empId: 205,

            employeeName:
                'Kiran Kumar',

            performedById: 3,

            performedByName:
                'Priya Admin',

            event:
                'DEACTIVATED',

            createdAt:
                '31 Aug 2026, 01:10:14',

            deletedAt:
                null,
        },

        {
            id: 1007,

            empId: 201,

            employeeName:
                'Rahul Sharma',

            performedById: 1,

            performedByName:
                'John Admin',

            event:
                'PERMISSIONS_UPDATED',

            createdAt:
                '31 Aug 2026, 02:05:37',

            deletedAt:
                null,
        },

        {
            id: 1008,

            empId: 202,

            employeeName:
                'Anil Kumar',

            performedById: 2,

            performedByName:
                'Rahul Admin',

            event:
                'UPDATED',

            createdAt:
                '31 Aug 2026, 02:42:19',

            deletedAt:
                null,
        },

        {
            id: 1009,

            empId: 203,

            employeeName:
                'Vikram Singh',

            performedById: 4,

            performedByName:
                'Vikram Admin',

            event:
                'PERMISSIONS_UPDATED',

            createdAt:
                '31 Aug 2026, 03:12:44',

            deletedAt:
                null,
        },

        {
            id: 1010,

            empId: 204,

            employeeName:
                'Arjun Rao',

            performedById: 1,

            performedByName:
                'John Admin',

            event:
                'ACTIVE',

            createdAt:
                '31 Aug 2026, 03:45:22',

            deletedAt:
                null,
        },

        {
            id: 1011,

            empId: 205,

            employeeName:
                'Kiran Kumar',

            performedById: 3,

            performedByName:
                'Priya Admin',

            event:
                'UPDATED',

            createdAt:
                '31 Aug 2026, 04:18:09',

            deletedAt:
                null,
        },

        {
            id: 1012,

            empId: 202,

            employeeName:
                'Anil Kumar',

            performedById: 4,

            performedByName:
                'Vikram Admin',

            event:
                'DEACTIVATED',

            createdAt:
                '31 Aug 2026, 04:52:31',

            deletedAt:
                null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [employeeId, setEmployeeId] =
        useState('')


    const [event, setEvent] =
        useState('ALL')


    // =========================================================
    // PAGINATION STATE
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


        return logs.filter(
            (log) => {

                // -------------------------------------------------
                // SEARCH
                //
                // Search employee name, employee ID,
                // performed-by name and log ID.
                // -------------------------------------------------

                const matchesSearch =
                    !searchValue ||
                    log.employeeName
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    String(log.empId)
                        .toLowerCase()
                        .includes(searchValue) ||
                    log.performedByName
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    String(log.performedById)
                        .toLowerCase()
                        .includes(searchValue) ||
                    String(log.id)
                        .toLowerCase()
                        .includes(searchValue)


                // -------------------------------------------------
                // EMPLOYEE
                // -------------------------------------------------

                const matchesEmployee =
                    !employeeId ||
                    String(log.empId) ===
                        String(employeeId)


                // -------------------------------------------------
                // EVENT
                // -------------------------------------------------

                const matchesEvent =
                    !event ||
                    event === 'ALL' ||
                    log.event === event


                return (
                    matchesSearch &&
                    matchesEmployee &&
                    matchesEvent
                )

            }
        )

    }, [
        logs,
        search,
        employeeId,
        event,
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

        setEmployeeId('')

        setEvent('ALL')

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
    // EMPLOYEE CHANGE
    // =========================================================

    const handleEmployeeChange = (
        value
    ) => {

        setEmployeeId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // EVENT CHANGE
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
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * Replace with API call later.
         */

        console.log(
            'Refresh admin logs'
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
                        lg:grid-cols-12
                    ">

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="
                            lg:col-span-4
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
                                    className="grow"
                                />

                            </label>

                        </div>


                        {/* =========================================
                            EMPLOYEE
                        ========================================= */}

                        <div className="
                            lg:col-span-3
                        ">

                            <EmployeeDropdown
                                value={employeeId}
                                onChange={
                                    handleEmployeeChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="All Employees"
                            />

                        </div>


                        {/* =========================================
                            EVENT
                        ========================================= */}

                        <div className="
                            lg:col-span-3
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


                        {/* =========================================
                            RESET
                        ========================================= */}

                        <div className="
                            lg:col-span-1
                        ">

                            <button
                                type="button"
                                onClick={handleReset}
                                className="
                                    btn
                                    btn-ghost
                                    w-full
                                "
                            >
                                Reset
                            </button>

                        </div>


                        {/* =========================================
                            REFRESH
                        ========================================= */}

                        <div className="
                            lg:col-span-1
                        ">

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="
                                    btn
                                    btn-ghost
                                    w-full
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


            {/* =====================================================
                LOG TABLE
            ===================================================== */}

            <AdminLogTable
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


export default AdminLogs