// admin-react/src/pages/Logs/PhoneNumberLogs/index.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPhoneNumberAuditLogs } from './Api'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import PhoneNumberLogTable from './components/PhoneNumberLogTable'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'

import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'

function PhoneNumberLogs() {

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

            id: 'ASSIGNED',

            name: 'Assigned',

        },

        {

            id: 'REASSIGNED',

            name: 'Reassigned',

        },

        {

            id: 'UNASSIGNED',

            name: 'Unassigned',

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

            id: 'TRACKABLE_ENABLED',

            name: 'Trackable Enabled',

        },

        {

            id: 'TRACKABLE_DISABLED',

            name: 'Trackable Disabled',

        },

        {

            id: 'DELETED',

            name: 'Deleted',

        },

    ]

    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const response = await getPhoneNumberAuditLogs({ skip: 0, limit: 500 })
            const records = Array.isArray(response)
                ? response
                : response?.items ?? response?.data ?? []

            const mappedLogs = records.map((log) => ({
                id: log.id,
                phoneNumber: log.phone ?? '',
                assignedToId: log.employee_context_id ?? null,
                assignedToName: log.employee_context_id != null
                    ? `Employee context ${log.employee_context_id}` : null,
                assignedToRole: null,
                reportsToId: log.report_to_id ?? null,
                reportsToName: log.report_to_id != null
                    ? `Employee context ${log.report_to_id}` : null,
                actionById: log.action_by_id ?? null,
                actionByName: log.action_by_id != null
                    ? `Employee context ${log.action_by_id}` : null,
                actionByRole: null,
                event: String(log.action ?? '').toUpperCase(),
                status: null,
                trackable: null,
                createdAt: log.date_and_time ?? null,
                deletedAt: log.deleted_at ?? null,
            }))
            setLogs(mappedLogs)
            setCurrentPage(1)
        } catch (err) {
            console.error('Failed to fetch phone number audit logs:', err)
            setError(err.response?.data?.detail || 'Failed to load phone number logs.')
            setLogs([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const rms = useMemo(() => {
        const unique = new Map()
        logs.forEach((log) => {
            if (log.assignedToId == null) return
            const id = String(log.assignedToId)
            if (!unique.has(id)) unique.set(id, {
                id, employeeId: id,
                name: log.assignedToName || `Employee context ${id}`,
                role: log.assignedToRole || 'rm',
            })
        })
        return Array.from(unique.values())
    }, [logs])

    const employees = useMemo(() => {
        const unique = new Map()
        logs.forEach((log) => {
            if (log.actionById == null) return
            const id = String(log.actionById)
            if (!unique.has(id)) unique.set(id, {
                id, employeeId: id,
                name: log.actionByName || `Employee context ${id}`,
                role: log.actionByRole || '',
            })
        })
        return Array.from(unique.values())
    }, [logs])

    // =========================================================

    // FILTER STATE

    // =========================================================

    const [search, setSearch] =

        useState('')

    const [assignedToId, setAssignedToId] =

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

            // SEARCH PHONE NUMBER

            // -------------------------------------------------

            const matchesSearch =

                !searchValue ||

                String(log.phoneNumber)

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

                matchesAssignedTo &&

                matchesActionBy &&

                matchesEvent &&

                matchesFromDate &&

                matchesToDate

            )

        })

    }, [

        logs,

        search,

        assignedToId,

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

        setAssignedToId('')

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

    // ASSIGNED TO

    // =========================================================

    const handleAssignedToChange = (

        value

    ) => {

        setAssignedToId(value)

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
        fetchLogs()
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

            \===================================================== */}

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

                    \================================================= */}

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

                        \========================================= */}

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

                                    placeholder="Search phone number..."

                                    className="

                                        min-w-0

                                        grow

                                    "

                                />

                            </label>

                        </div>

                        {/* =========================================

                            ASSIGNED TO

                        \========================================= */}

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

                            ACTION BY

                        \========================================= */}

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

                        \========================================= */}

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

                    \================================================= */}

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

                        \========================================= */}

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

                        \========================================= */}

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

                        \========================================= */}

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

                                \================================= */}

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

                                \================================= */}

                                <div className="

                                    h-6

                                    w-px

                                    bg-base-300

                                " />

                                {/* =================================

                                    REFRESH

                                \================================= */}

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

            \===================================================== */}

            {loading && (
                <div className="px-4 py-3 text-sm text-base-content/60">Loading phone number logs...</div>
            )}
            {error && (
                <div className="alert alert-error flex items-center justify-between gap-3">
                    <span>{error}</span>
                    <button type="button" className="btn btn-sm" onClick={fetchLogs}>Retry</button>
                </div>
            )}
            {!loading && !error && <PhoneNumberLogTable logs={paginatedLogs} />}

            {/* =====================================================

                PAGINATION

            \===================================================== */}

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

                    \============================================= */}

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

                    \============================================= */}

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

export default PhoneNumberLogs