// admin-react/src/pages/EmployeeManagement/FaceEnrollment/components/FaceEnrollmentTable.jsx

import { useMemo } from 'react'


function FaceEnrollmentTable({
    employees = [],
    search = '',
    setSearch,
    onViewEnrollment,
    onRefresh,
    loading = false,
}) {

    // =========================================================
    // FILTER EMPLOYEES
    // =========================================================

    const filteredEmployees = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase()

        if (!searchValue) {
            return employees
        }

        return employees.filter(
            (employee) => {

                const employeeId =
                    String(
                        employee.employeeId ?? '',
                    )

                const employeeName =
                    String(
                        employee.employeeName ?? '',
                    )

                return (
                    employeeName
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    employeeId
                        .toLowerCase()
                        .includes(searchValue)
                )
            },
        )

    }, [
        employees,
        search,
    ])


    // =========================================================
    // GET ENROLLMENT COUNT
    // =========================================================

    const getEnrollmentCount = (
        employee,
    ) => {

        if (
            typeof employee.enrollmentCount ===
            'number'
        ) {
            return employee.enrollmentCount
        }

        if (
            Array.isArray(
                employee.enrollments,
            )
        ) {
            return employee.enrollments.length
        }

        return 0
    }


    // =========================================================
    // GET ENROLLMENT STATUS
    // =========================================================

    const getEnrollmentStatus = (
        count,
    ) => {

        if (count >= 3) {

            return {
                label: 'Complete',
                className: `
                    bg-green-50
                    text-green-700
                    ring-green-600/20

                    dark:bg-green-950/40
                    dark:text-green-400
                    dark:ring-green-500/20
                `,
            }
        }

        if (count > 0) {

            return {
                label: 'Incomplete',
                className: `
                    bg-yellow-50
                    text-yellow-700
                    ring-yellow-600/20

                    dark:bg-yellow-950/40
                    dark:text-yellow-400
                    dark:ring-yellow-500/20
                `,
            }
        }

        return {
            label: 'Not Enrolled',
            className: `
                bg-gray-50
                text-gray-600
                ring-gray-500/20

                dark:bg-gray-800
                dark:text-gray-400
                dark:ring-gray-600/30
            `,
        }
    }


    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClearSearch = () => {
        setSearch('')
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                w-full
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                shadow-sm

                dark:border-gray-700
                dark:bg-gray-900
                dark:shadow-none
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-gray-200
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    dark:border-gray-700
                "
            >

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                        gap-2
                        sm:w-auto
                        sm:flex-row
                    "
                >

                    {/* SEARCH */}

                    <div
                        className="
                            relative
                            w-full
                            sm:w-64
                        "
                    >

                        <svg
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-gray-400

                                dark:text-gray-500
                            "
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                            />

                            <path
                                d="m20 20-3.5-3.5"
                            />
                        </svg>


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value,
                                )
                            }
                            placeholder="Search employee..."
                            className="
                                h-10
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                pl-9
                                pr-9
                                text-sm
                                text-gray-900
                                outline-none
                                transition

                                placeholder:text-gray-400

                                hover:border-gray-400

                                focus:border-gray-500
                                focus:ring-2
                                focus:ring-gray-200

                                dark:border-gray-600
                                dark:bg-gray-800
                                dark:text-gray-100
                                dark:placeholder:text-gray-500
                                dark:hover:border-gray-500
                                dark:focus:border-gray-500
                                dark:focus:ring-gray-700
                            "
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={
                                    handleClearSearch
                                }
                                className="
                                    absolute
                                    right-2
                                    top-1/2
                                    flex
                                    h-6
                                    w-6
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-md
                                    text-gray-400
                                    transition

                                    hover:bg-gray-100
                                    hover:text-gray-600

                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-gray-300

                                    dark:text-gray-500
                                    dark:hover:bg-gray-700
                                    dark:hover:text-gray-200
                                    dark:focus:ring-gray-600
                                "
                                aria-label="Clear search"
                            >
                                ×
                            </button>

                        )}

                    </div>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loading}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            text-sm
                            font-medium
                            text-gray-700
                            transition

                            hover:border-gray-400
                            hover:bg-gray-50
                            hover:text-gray-900

                            focus:outline-none
                            focus:ring-2
                            focus:ring-gray-300

                            disabled:cursor-not-allowed
                            disabled:opacity-60

                            dark:border-gray-600
                            dark:bg-gray-800
                            dark:text-gray-200
                            dark:hover:border-gray-500
                            dark:hover:bg-gray-700
                            dark:hover:text-white
                            dark:focus:ring-gray-600
                        "
                    >

                        <svg
                            className={`
                                h-4
                                w-4
                                ${
                                    loading
                                        ? 'animate-spin'
                                        : ''
                                }
                            `}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path
                                d="M20 11a8.1 8.1 0 0 0-14.8-4"
                            />

                            <path
                                d="M4 4v5h5"
                            />

                            <path
                                d="M4 13a8.1 8.1 0 0 0 14.8 4"
                            />

                            <path
                                d="M20 20v-5h-5"
                            />
                        </svg>

                        Refresh

                    </button>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="
                    overflow-x-auto
                "
            >

                <table
                    className="
                        min-w-full
                        divide-y
                        divide-gray-200

                        dark:divide-gray-700
                    "
                >

                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <thead
                        className="
                            bg-gray-50

                            dark:bg-gray-800/70
                        "
                    >

                        <tr>

                            <th
                                scope="col"
                                className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Employee ID
                            </th>


                            <th
                                scope="col"
                                className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Employee Name
                            </th>


                            <th
                                scope="col"
                                className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Enrollment
                            </th>


                            <th
                                scope="col"
                                className="
                                    px-5
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Status
                            </th>


                            <th
                                scope="col"
                                className="
                                    px-5
                                    py-3
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Action
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody
                        className="
                            divide-y
                            divide-gray-100
                            bg-white

                            dark:divide-gray-800
                            dark:bg-gray-900
                        "
                    >

                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading && (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="
                                        px-5
                                        py-12
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                h-7
                                                w-7
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-gray-200
                                                border-t-gray-700

                                                dark:border-gray-700
                                                dark:border-t-gray-300
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm
                                                text-gray-500

                                                dark:text-gray-400
                                            "
                                        >
                                            Loading employees...
                                        </span>

                                    </div>

                                </td>

                            </tr>

                        )}


                        {/* =================================================
                            EMPTY SEARCH RESULT
                        ================================================= */}

                        {!loading &&
                            filteredEmployees.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="
                                            px-5
                                            py-12
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                            "
                                        >

                                            {/* EMPTY ICON */}

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    h-12
                                                    w-12
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-gray-100

                                                    dark:bg-gray-800
                                                "
                                            >

                                                <svg
                                                    className="
                                                        h-6
                                                        w-6
                                                        text-gray-400

                                                        dark:text-gray-500
                                                    "
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        cx="11"
                                                        cy="11"
                                                        r="7"
                                                    />

                                                    <path
                                                        d="m20 20-3.5-3.5"
                                                    />
                                                </svg>

                                            </div>


                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-gray-700

                                                    dark:text-gray-200
                                                "
                                            >
                                                {search
                                                    ? 'No employees found'
                                                    : 'No employees available'}
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-gray-500

                                                    dark:text-gray-400
                                                "
                                            >
                                                {search
                                                    ? 'Try a different employee name or ID.'
                                                    : 'There are no employees to display.'}
                                            </p>


                                            {search && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleClearSearch
                                                    }
                                                    className="
                                                        mt-3
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        underline
                                                        underline-offset-2
                                                        transition

                                                        hover:text-gray-900

                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-gray-300
                                                        focus:ring-offset-2

                                                        dark:text-gray-300
                                                        dark:hover:text-white
                                                        dark:focus:ring-gray-600
                                                        dark:focus:ring-offset-gray-900
                                                    "
                                                >
                                                    Clear search
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            )}


                        {/* =================================================
                            EMPLOYEE ROWS
                        ================================================= */}

                        {!loading &&
                            filteredEmployees.map(
                                (employee) => {

                                    const count =
                                        getEnrollmentCount(
                                            employee,
                                        )

                                    const status =
                                        getEnrollmentStatus(
                                            count,
                                        )

                                    return (

                                        <tr
                                            key={
                                                employee.employeeId
                                            }
                                            className="
                                                transition
                                                hover:bg-gray-50

                                                dark:hover:bg-gray-800/60
                                            "
                                        >

                                            {/* =================================
                                                EMPLOYEE ID
                                            ================================= */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    font-medium
                                                    text-gray-900

                                                    dark:text-gray-100
                                                "
                                            >
                                                #
                                                {
                                                    employee.employeeId
                                                }
                                            </td>


                                            {/* =================================
                                                EMPLOYEE NAME
                                            ================================= */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-700

                                                    dark:text-gray-300
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    {/* AVATAR */}

                                                    <div
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-gray-100
                                                            text-sm
                                                            font-semibold
                                                            uppercase
                                                            text-gray-600

                                                            dark:bg-gray-800
                                                            dark:text-gray-300
                                                        "
                                                    >
                                                        {
                                                            employee
                                                                .employeeName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                            '?'
                                                        }
                                                    </div>


                                                    <span
                                                        className="
                                                            font-medium
                                                            text-gray-900

                                                            dark:text-gray-100
                                                        "
                                                    >
                                                        {
                                                            employee.employeeName ||
                                                            'Unnamed Employee'
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                ENROLLMENT COUNT
                                            ================================= */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-gray-900

                                                        dark:text-gray-100
                                                    "
                                                >
                                                    {count}
                                                </span>

                                                <span
                                                    className="
                                                        text-sm
                                                        text-gray-400

                                                        dark:text-gray-500
                                                    "
                                                >
                                                    /3
                                                </span>

                                            </td>


                                            {/* =================================
                                                STATUS
                                            ================================= */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                "
                                            >

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        ring-1
                                                        ring-inset
                                                        ${status.className}
                                                    `}
                                                >

                                                    <span
                                                        className="
                                                            mr-1.5
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            bg-current
                                                        "
                                                        aria-hidden="true"
                                                    />

                                                    {
                                                        status.label
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================
                                                ACTION
                                            ================================= */}

                                            <td
                                                className="
                                                    whitespace-nowrap
                                                    px-5
                                                    py-4
                                                    text-right
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onViewEnrollment(
                                                            employee,
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-lg
                                                        border
                                                        border-gray-300
                                                        bg-white
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        transition

                                                        hover:border-gray-400
                                                        hover:bg-gray-50
                                                        hover:text-gray-900

                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-gray-300

                                                        dark:border-gray-600
                                                        dark:bg-gray-800
                                                        dark:text-gray-200
                                                        dark:hover:border-gray-500
                                                        dark:hover:bg-gray-700
                                                        dark:hover:text-white
                                                        dark:focus:ring-gray-600
                                                    "
                                                >

                                                    <svg
                                                        className="
                                                            h-4
                                                            w-4
                                                        "
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                                                        />

                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                    </svg>

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                },
                            )}

                    </tbody>

                </table>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            {!loading &&
                employees.length > 0 && (

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            border-t
                            border-gray-200
                            px-5
                            py-3
                            text-sm
                            text-gray-500
                            sm:flex-row
                            sm:items-center
                            sm:justify-between

                            dark:border-gray-700
                            dark:text-gray-400
                        "
                    >

                        <span>

                            Showing{' '}

                            <span
                                className="
                                    font-medium
                                    text-gray-700

                                    dark:text-gray-200
                                "
                            >
                                {
                                    filteredEmployees.length
                                }
                            </span>

                            {' '}of{' '}

                            <span
                                className="
                                    font-medium
                                    text-gray-700

                                    dark:text-gray-200
                                "
                            >
                                {
                                    employees.length
                                }
                            </span>

                            {' '}employees

                        </span>


                        <span>

                            Each employee can have up to{' '}

                            <span
                                className="
                                    font-medium
                                    text-gray-700

                                    dark:text-gray-200
                                "
                            >
                                3
                            </span>

                            {' '}face images

                        </span>

                    </div>

                )}

        </div>
    )
}


export default FaceEnrollmentTable