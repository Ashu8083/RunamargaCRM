// admin-react/src/pages/crm/Reminders/index.jsx

import { useEffect, useState } from 'react'

import { getReminders } from './API'

import EmployeeDropdown from '../../../components/GlobalModels/Filters/EmployeeDropdown'


const PAGE_SIZE = 25


// =============================================================
// FORMAT DATE
// =============================================================

const formatDateTime = (value) => {

    if (!value) {
        return '-'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '-'
    }

    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

}


// =============================================================
// STATUS CLASS
// =============================================================

const getStatusClass = (status) => {

    if (status === 'completed') {
        return 'text-success bg-success/10'
    }

    if (status === 'cancelled') {
        return 'text-error bg-error/10'
    }

    return 'text-warning bg-warning/10'

}


// =============================================================
// REMINDERS
// =============================================================

function Reminders() {

    const [reminders, setReminders] =
        useState([])

    const [pagination, setPagination] =
        useState({
            page: 1,
            page_size: PAGE_SIZE,
            total: 0,
            total_pages: 0,
            has_next: false,
            has_previous: false,
        })

    const [searchInput, setSearchInput] =
        useState('')

    const [search, setSearch] =
        useState('')

    const [employeeId, setEmployeeId] =
        useState('')

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')


    // =============================================================
    // FETCH REMINDERS
    // =============================================================

    const fetchReminders = async (
        page = 1,
        currentSearch = search,
        currentEmployeeId = employeeId
    ) => {

        try {

            setLoading(true)

            setError('')

            const response =
                await getReminders({
                    page,
                    pageSize: PAGE_SIZE,
                    search: currentSearch,
                    employeeId: currentEmployeeId,
                })

            setReminders(
                response?.items || []
            )

            setPagination(
                response?.pagination || {
                    page: 1,
                    page_size: PAGE_SIZE,
                    total: 0,
                    total_pages: 0,
                    has_next: false,
                    has_previous: false,
                }
            )

        } catch (error) {

            console.error(
                'Failed to fetch reminders:',
                error
            )

            setError(
                error?.response?.data?.detail ||
                error?.message ||
                'Failed to load reminders.'
            )

            setReminders([])

        } finally {

            setLoading(false)

        }

    }


    // =============================================================
    // INITIAL FETCH
    // =============================================================

    useEffect(() => {

        fetchReminders()

    }, [])


    // =============================================================
    // SEARCH
    // =============================================================

    const handleSearch = () => {

        const value =
            searchInput.trim()

        setSearch(value)

        fetchReminders(
            1,
            value,
            employeeId
        )

    }


    // =============================================================
    // SEARCH - ENTER
    // =============================================================

    const handleSearchKeyDown = (event) => {

        if (event.key === 'Enter') {
            handleSearch()
        }

    }


    // =============================================================
    // EMPLOYEE FILTER
    // =============================================================

    const handleEmployeeChange = (value) => {

        const employee =
            value || ''

        setEmployeeId(employee)

        fetchReminders(
            1,
            search,
            employee
        )

    }


    // =============================================================
    // CLEAR FILTERS
    // =============================================================

    const handleClear = () => {

        setSearchInput('')

        setSearch('')

        setEmployeeId('')

        fetchReminders(
            1,
            '',
            ''
        )

    }


    // =============================================================
    // REFRESH
    // =============================================================

    const handleRefresh = () => {

        fetchReminders(
            pagination.page || 1,
            search,
            employeeId
        )

    }


    // =============================================================
    // PREVIOUS PAGE
    // =============================================================

    const handlePrevious = () => {

        if (
            loading ||
            !pagination.has_previous
        ) {
            return
        }

        fetchReminders(
            pagination.page - 1,
            search,
            employeeId
        )

    }


    // =============================================================
    // NEXT PAGE
    // =============================================================

    const handleNext = () => {

        if (
            loading ||
            !pagination.has_next
        ) {
            return
        }

        fetchReminders(
            pagination.page + 1,
            search,
            employeeId
        )

    }


    return (

        <div className="p-4 sm:p-6 space-y-5">


            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="
                flex
                items-center
                justify-between
                gap-4
            ">

                <div>

                    <h1 className="
                        text-2xl
                        font-semibold
                        text-base-content
                    ">
                        Reminders
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-base-content/60
                    ">
                        Manage all reminders
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="
                        rounded-lg
                        border
                        border-base-300
                        bg-base-100
                        px-4
                        py-2
                        text-sm
                        font-medium
                        hover:bg-base-200
                        disabled:opacity-50
                    "
                >
                    {loading
                        ? 'Loading...'
                        : 'Refresh'}
                </button>

            </div>


            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                p-4
                shadow-sm
            ">

                <div className="
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-12
                    md:items-end
                ">


                    {/* SEARCH */}

                    <div className="md:col-span-7">

                        <label className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-base-content
                        ">
                            Search
                        </label>

                        <div className="
                            flex
                            h-10
                            overflow-hidden
                            rounded-lg
                            border
                            border-base-300
                        ">

                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(
                                        event.target.value
                                    )
                                }
                                onKeyDown={
                                    handleSearchKeyDown
                                }
                                placeholder="
                                    Application number, name,
                                    phone or employee
                                "
                                className="
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    px-3
                                    text-sm
                                    outline-none
                                "
                            />

                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={loading}
                                className="
                                    border-l
                                    border-base-300
                                    px-4
                                    text-sm
                                    font-medium
                                    hover:bg-base-200
                                    disabled:opacity-50
                                "
                            >
                                Search
                            </button>

                        </div>

                    </div>


                    {/* EMPLOYEE */}

                    <div className="md:col-span-3">

                        <EmployeeDropdown
                            value={employeeId}
                            onChange={
                                handleEmployeeChange
                            }
                            placeholder="Select Employee"
                        />

                    </div>


                    {/* CLEAR */}

                    <div className="md:col-span-2">

                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={
                                loading ||
                                (
                                    !searchInput &&
                                    !search &&
                                    !employeeId
                                )
                            }
                            className="
                                h-10
                                w-full
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-4
                                text-sm
                                font-medium
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Clear
                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

                <div className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-error/20
                    bg-error/5
                    px-4
                    py-3
                    text-sm
                    text-error
                ">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="font-medium underline"
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =====================================================
                REMINDERS TABLE
            ===================================================== */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">


                {/* TABLE HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-4
                    py-3
                ">

                    <div>

                        <h2 className="
                            text-base
                            font-semibold
                            text-base-content
                        ">
                            All Reminders
                        </h2>

                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            {pagination.total || 0}
                            {' '}
                            reminders
                        </p>

                    </div>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="
                        flex
                        min-h-60
                        items-center
                        justify-center
                        text-sm
                        text-base-content/60
                    ">
                        Loading reminders...
                    </div>

                ) : reminders.length === 0 ? (

                    /* EMPTY */

                    <div className="
                        flex
                        min-h-60
                        items-center
                        justify-center
                        text-sm
                        text-base-content/60
                    ">
                        No reminders found.
                    </div>

                ) : (

                    /* DATA */

                    <div className="overflow-x-auto">

                        <table className="
                            w-full
                            min-w-[1000px]
                            text-left
                        ">

                            <thead>

                                <tr className="
                                    border-b
                                    border-base-300
                                    bg-base-200/40
                                ">

                                    <th className="
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                    ">
                                        Reminder
                                    </th>

                                    <th className="
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                    ">
                                        Application
                                    </th>

                                    <th className="
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                    ">
                                        Employee
                                    </th>

                                    <th className="
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                    ">
                                        Scheduled
                                    </th>

                                    <th className="
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                    ">
                                        Status
                                    </th>

                                    <th className="
                                        px-4
                                        py-3
                                        text-xs
                                        font-semibold
                                    ">
                                        Created
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {reminders.map(
                                    (reminder) => {

                                        const application =
                                            reminder.application || {}

                                        const employee =
                                            reminder.employee || {}

                                        const status =
                                            reminder.status ||
                                            'pending'


                                        return (

                                            <tr
                                                key={reminder.id}
                                                className="
                                                    border-b
                                                    border-base-200
                                                    hover:bg-base-200/30
                                                "
                                            >


                                                {/* REMINDER */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                ">

                                                    <div className="
                                                        max-w-[260px]
                                                    ">

                                                        <div className="
                                                            text-sm
                                                            font-medium
                                                        ">
                                                            #{reminder.id}
                                                        </div>

                                                        <div
                                                            className="
                                                                mt-1
                                                                truncate
                                                                text-xs
                                                                text-base-content/60
                                                            "
                                                            title={
                                                                reminder.note || ''
                                                            }
                                                        >
                                                            {reminder.note || '-'}
                                                        </div>

                                                    </div>

                                                </td>


                                                {/* APPLICATION */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                ">

                                                    <div>

                                                        <div className="
                                                            text-sm
                                                            font-medium
                                                        ">
                                                            {application.name || '-'}
                                                        </div>

                                                        <div className="
                                                            text-xs
                                                            text-base-content/60
                                                        ">
                                                            #{application.id || '-'}
                                                            {application.unique_id
                                                                ? ` • ${application.unique_id}`
                                                                : ''}
                                                        </div>

                                                        <div className="
                                                            text-xs
                                                            text-base-content/60
                                                        ">
                                                            {application.phone || '-'}
                                                        </div>

                                                    </div>

                                                </td>


                                                {/* EMPLOYEE */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                ">

                                                    <div>

                                                        <div className="
                                                            text-sm
                                                            font-medium
                                                        ">
                                                            {employee.name || '-'}
                                                        </div>

                                                        <div className="
                                                            text-xs
                                                            text-base-content/60
                                                        ">
                                                            {employee.employee_code || '-'}
                                                        </div>

                                                    </div>

                                                </td>


                                                {/* SCHEDULED */}

                                                <td className="
                                                    whitespace-nowrap
                                                    px-4
                                                    py-3
                                                    text-sm
                                                ">
                                                    {formatDateTime(
                                                        reminder.reminder_at
                                                    )}
                                                </td>


                                                {/* STATUS */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                ">

                                                    <span className={`
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ${getStatusClass(status)}
                                                    `}>
                                                        {status
                                                            .charAt(0)
                                                            .toUpperCase()
                                                            + status.slice(1)}
                                                    </span>

                                                </td>


                                                {/* CREATED */}

                                                <td className="
                                                    whitespace-nowrap
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    text-base-content/60
                                                ">
                                                    {formatDateTime(
                                                        reminder.created_at
                                                    )}
                                                </td>

                                            </tr>

                                        )

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    reminders.length > 0 && (

                    <div className="
                        flex
                        items-center
                        justify-between
                        border-t
                        border-base-300
                        px-4
                        py-3
                    ">

                        <span className="
                            text-sm
                            text-base-content/60
                        ">
                            Page {pagination.page || 1}
                            {' '}of{' '}
                            {pagination.total_pages || 1}
                        </span>


                        <div className="
                            flex
                            gap-2
                        ">

                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={
                                    loading ||
                                    !pagination.has_previous
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    px-3
                                    py-1.5
                                    text-sm
                                    hover:bg-base-200
                                    disabled:opacity-40
                                "
                            >
                                Previous
                            </button>


                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={
                                    loading ||
                                    !pagination.has_next
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    px-3
                                    py-1.5
                                    text-sm
                                    hover:bg-base-200
                                    disabled:opacity-40
                                "
                            >
                                Next
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    )

}


export default Reminders