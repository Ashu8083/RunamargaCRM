// admin-react\src\pages\EmployeeManagement\Attendance\components\AttendanceTable.jsx
import {
    useEffect,
    useRef,
    useState,
} from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon'
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'


// ============================================================================
// CONSTANTS
// ============================================================================

const PAGE_SIZE_OPTIONS = [
    30,
    50,
    100,
]


const DEFAULT_FILTERS = {
    search: '',
    employeeId: '',
    fromDate: '',
    toDate: '',
    status: '',
}


// ============================================================================
// LOCATION LINK
// ============================================================================

const LocationLink = ({
    location,
    latitude,
    longitude,
    isOffice,
}) => {

    const hasCoordinates =
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined


    const safeLocation =
        typeof location === 'string'
            ? location
            : ''


    const mapUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : safeLocation
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                safeLocation
            )}`
            : null


    if (!mapUrl) {
        return (
            <div className="
                mt-1
                flex
                items-center
                gap-1.5
            ">
                <span className="
                    text-xs
                    text-base-content/40
                ">
                    Location unavailable
                </span>
            </div>
        )
    }


    return (

        <div className="
            mt-1
            flex
            items-center
            gap-1.5
        ">

            <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                    event.stopPropagation()
                }}
                className="
                    inline-flex
                    items-center
                    gap-1
                    text-xs
                    text-base-content/50
                    transition
                    hover:text-[#6FA800]
                "
                title="Open location in Google Maps"
            >

                <MapPinIcon className="
                    h-3.5
                    w-3.5
                " />


                <span className="
                    max-w-[150px]
                    truncate
                ">
                    {
                        safeLocation ||
                        'Open Location'
                    }
                </span>

            </a>


            <span
                className={[
                    'shrink-0',
                    'rounded-full',
                    'px-1.5',
                    'py-0.5',
                    'text-[10px]',
                    'font-medium',

                    isOffice
                        ? 'bg-[#8BCF00]/10 text-[#6FA800]'
                        : 'bg-amber-50 text-amber-600',

                ].join(' ')}
            >
                {
                    isOffice
                        ? 'In Office'
                        : 'Out Office'
                }
            </span>

        </div>
    )
}


// ============================================================================
// IMAGE LINK
// ============================================================================

const ImageLink = ({
    image,
}) => {

    if (!image) {
        return (
            <span className="
                text-xs
                text-base-content/40
            ">
                —
            </span>
        )
    }


    return (

        <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
                event.stopPropagation()
            }}
            className="
                text-xs
                font-medium
                text-[#6FA800]
                underline
                underline-offset-2
                transition
                hover:text-[#527f00]
            "
            title="Open attendance image"
        >
            View
        </a>
    )
}


// ============================================================================
// IMAGE CELL
// ============================================================================

const AttendanceImageCell = ({
    checkIn,
    checkOut,
}) => {

    return (

        <div className="
            flex
            min-w-[110px]
            flex-col
            gap-1
        ">

            <div className="
                flex
                items-center
                gap-1.5
                text-xs
            ">

                <span className="
                    text-base-content/50
                ">
                    Punch In:
                </span>

                <ImageLink
                    image={
                        checkIn?.image ||
                        null
                    }
                />

            </div>


            <div className="
                flex
                items-center
                gap-1.5
                text-xs
            ">

                <span className="
                    text-base-content/50
                ">
                    Punch Out:
                </span>

                <ImageLink
                    image={
                        checkOut?.image ||
                        null
                    }
                />

            </div>

        </div>
    )
}


// ============================================================================
// STATUS
// ============================================================================

const getStatusClasses = (status) => {

    const normalizedStatus =
        String(status || '')
            .trim()
            .toLowerCase()


    if (
        normalizedStatus ===
        'present'
    ) {

        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (
        normalizedStatus ===
        'absent'
    ) {

        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// ============================================================================
// STATUS TEXT
// ============================================================================

const formatStatus = (status) => {

    const normalizedStatus =
        String(status || '')
            .trim()
            .toLowerCase()


    if (
        normalizedStatus ===
        'present'
    ) {
        return 'Present'
    }


    if (
        normalizedStatus ===
        'absent'
    ) {
        return 'Absent'
    }


    return 'Unknown'

}


// ============================================================================
// ATTENDANCE TABLE
// ============================================================================

function AttendanceTable({
    entries = [],
    onView,
    loading = false,

    totalRecords = 0,
    totalPages = 0,
    currentPage = 1,
    currentLimit = 30,

    onQueryChange,
}) {

    // =========================================================================
    // FILTER STATE
    // =========================================================================

    const [
        filters,
        setFilters,
    ] = useState(
        DEFAULT_FILTERS
    )


    // =========================================================================
    // SEARCH DEBOUNCE
    // =========================================================================

    const searchTimerRef =
        useRef(null)


    // =========================================================================
    // CURRENT PAGE SIZE
    // =========================================================================

    const pageSize =
        PAGE_SIZE_OPTIONS.includes(
            Number(currentLimit)
        )
            ? Number(currentLimit)
            : 30


    // =========================================================================
    // CLEANUP SEARCH TIMER
    // =========================================================================

    useEffect(() => {

        return () => {

            if (
                searchTimerRef.current
            ) {

                clearTimeout(
                    searchTimerRef.current
                )

            }

        }

    }, [])


    // =========================================================================
    // BUILD QUERY
    // =========================================================================

    const buildQuery = (
        nextFilters,
        page = 1,
        limit = pageSize
    ) => {

        return {

            search:
                String(
                    nextFilters?.search || ''
                ).trim(),

            employeeId:
                nextFilters?.employeeId || '',

            fromDate:
                nextFilters?.fromDate || '',

            toDate:
                nextFilters?.toDate || '',

            status:
                nextFilters?.status || '',

            page:
                Number(page) || 1,

            limit:
                Number(limit) || 30,

        }

    }


    // =========================================================================
    // SEND QUERY TO PARENT
    // =========================================================================

    const requestAttendance = (
        nextFilters,
        page = 1,
        limit = pageSize
    ) => {

        if (
            typeof onQueryChange !==
            'function'
        ) {
            return
        }


        onQueryChange(
            buildQuery(
                nextFilters,
                page,
                limit
            )
        )

    }


    // =========================================================================
    // SEARCH CHANGE
    // =========================================================================

    const handleSearchChange = (
        event
    ) => {

        const value =
            event.target.value


        const nextFilters = {
            ...filters,
            search: value,
        }


        setFilters(
            nextFilters
        )


        if (
            searchTimerRef.current
        ) {

            clearTimeout(
                searchTimerRef.current
            )

        }


        searchTimerRef.current =
            setTimeout(
                () => {

                    requestAttendance(
                        nextFilters,
                        1,
                        pageSize
                    )

                },
                300
            )

    }


    // =========================================================================
    // EMPLOYEE CHANGE
    // =========================================================================

    const handleEmployeeChange = (
        value
    ) => {

        const nextFilters = {
            ...filters,

            employeeId:
                value === null ||
                value === undefined
                    ? ''
                    : value,
        }


        setFilters(
            nextFilters
        )


        requestAttendance(
            nextFilters,
            1,
            pageSize
        )

    }


    // =========================================================================
    // FROM DATE CHANGE
    // =========================================================================

    const handleFromDateChange = (
        event
    ) => {

        const value =
            event.target.value


        const nextFilters = {
            ...filters,
            fromDate: value,
        }


        setFilters(
            nextFilters
        )


        requestAttendance(
            nextFilters,
            1,
            pageSize
        )

    }


    // =========================================================================
    // TO DATE CHANGE
    // =========================================================================

    const handleToDateChange = (
        event
    ) => {

        const value =
            event.target.value


        const nextFilters = {
            ...filters,
            toDate: value,
        }


        setFilters(
            nextFilters
        )


        requestAttendance(
            nextFilters,
            1,
            pageSize
        )

    }


    // =========================================================================
    // STATUS CHANGE
    // =========================================================================

    const handleStatusChange = (
        event
    ) => {

        const value =
            event.target.value


        const nextFilters = {
            ...filters,
            status: value,
        }


        setFilters(
            nextFilters
        )


        requestAttendance(
            nextFilters,
            1,
            pageSize
        )

    }


    // =========================================================================
    // RESET FILTERS
    // =========================================================================

    const handleResetFilters = () => {

        if (
            searchTimerRef.current
        ) {

            clearTimeout(
                searchTimerRef.current
            )

        }


        setFilters(
            DEFAULT_FILTERS
        )


        requestAttendance(
            DEFAULT_FILTERS,
            1,
            pageSize
        )

    }


    // =========================================================================
    // PAGE SIZE CHANGE
    // =========================================================================

    const handlePageSizeChange = (
        event
    ) => {

        const nextLimit =
            Number(
                event.target.value
            )


        if (
            !PAGE_SIZE_OPTIONS.includes(
                nextLimit
            )
        ) {
            return
        }


        requestAttendance(
            filters,
            1,
            nextLimit
        )

    }


    // =========================================================================
    // PREVIOUS PAGE
    // =========================================================================

    const handlePreviousPage = () => {

        if (
            loading ||
            currentPage <= 1
        ) {
            return
        }


        requestAttendance(
            filters,
            currentPage - 1,
            pageSize
        )

    }


    // =========================================================================
    // NEXT PAGE
    // =========================================================================

    const handleNextPage = () => {

        if (
            loading ||
            currentPage >= totalPages
        ) {
            return
        }


        requestAttendance(
            filters,
            currentPage + 1,
            pageSize
        )

    }


    // =========================================================================
    // DIRECT PAGE CHANGE
    // =========================================================================

    const handlePageChange = (
        page
    ) => {

        const numericPage =
            Number(page)


        if (
            loading ||
            numericPage < 1 ||
            numericPage > totalPages ||
            numericPage === currentPage
        ) {
            return
        }


        requestAttendance(
            filters,
            numericPage,
            pageSize
        )

    }


    // =========================================================================
    // PAGINATION NUMBER LIST
    // =========================================================================

    const getPaginationPages = () => {

        if (
            totalPages <= 0
        ) {
            return []
        }


        if (
            totalPages <= 7
        ) {

            return Array.from(
                {
                    length:
                        totalPages,
                },
                (
                    _,
                    index
                ) =>
                    index + 1
            )

        }


        const pages = []


        pages.push(1)


        if (
            currentPage > 4
        ) {

            pages.push(
                'left-ellipsis'
            )

        }


        const start =
            Math.max(
                2,
                currentPage - 1
            )


        const end =
            Math.min(
                totalPages - 1,
                currentPage + 1
            )


        for (
            let page = start;
            page <= end;
            page += 1
        ) {

            pages.push(
                page
            )

        }


        if (
            currentPage <
            totalPages - 3
        ) {

            pages.push(
                'right-ellipsis'
            )

        }


        pages.push(
            totalPages
        )


        return pages

    }


    const paginationPages =
        getPaginationPages()


    // =========================================================================
    // RECORD RANGE
    // =========================================================================

    const firstRecord =
        totalRecords === 0
            ? 0
            : (
                (
                    currentPage - 1
                ) *
                pageSize
            ) + 1


    const lastRecord =
        totalRecords === 0
            ? 0
            : Math.min(
                currentPage *
                    pageSize,
                totalRecords
            )


    // =========================================================================
    // ACTIVE FILTER CHECK
    // =========================================================================

    const hasActiveFilters =
        Boolean(
            filters.search ||
            filters.employeeId ||
            filters.fromDate ||
            filters.toDate ||
            filters.status
        )


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =================================================================
                FILTERS
            ================================================================= */}

            <div className="
                border-b
                border-base-300
                p-4
                sm:p-5
            ">

                <div className="
                    grid
                    grid-cols-1
                    gap-3
                    md:grid-cols-2
                    xl:grid-cols-[minmax(260px,1.5fr)_150px_150px_150px_230px]
                ">

                    {/* =========================================================
                        SEARCH
                    ========================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Search
                        </label>


                        <div className="
                            relative
                        ">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/35
                            " />


                            <input
                                type="text"
                                value={
                                    filters.search
                                }
                                onChange={
                                    handleSearchChange
                                }
                                placeholder="Search name, employee ID, email or date..."
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    pl-9
                                "
                            />

                        </div>

                    </div>


                    {/* =========================================================
                        FROM DATE
                    ========================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            From Date
                        </label>


                        <input
                            type="date"
                            value={
                                filters.fromDate
                            }
                            onChange={
                                handleFromDateChange
                            }
                            className="
                                input
                                input-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        />

                    </div>


                    {/* =========================================================
                        TO DATE
                    ========================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            To Date
                        </label>


                        <input
                            type="date"
                            value={
                                filters.toDate
                            }
                            min={
                                filters.fromDate ||
                                undefined
                            }
                            onChange={
                                handleToDateChange
                            }
                            className="
                                input
                                input-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        />

                    </div>


                    {/* =========================================================
                        STATUS
                    ========================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Status
                        </label>


                        <select
                            value={
                                filters.status
                            }
                            onChange={
                                handleStatusChange
                            }
                            className="
                                select
                                select-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="present">
                                Present
                            </option>

                            <option value="absent">
                                Absent
                            </option>

                        </select>

                    </div>


                    {/* =========================================================
                        EMPLOYEE
                    ========================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Employee
                        </label>


                        <EmployeeDropdown
                            value={
                                filters.employeeId
                            }
                            onChange={
                                handleEmployeeChange
                            }
                        />

                    </div>

                </div>


                {/* =============================================================
                    FILTER FOOTER
                ============================================================= */}

                <div className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-base-300
                    pt-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <p className="
                        text-xs
                        font-medium
                        text-base-content/50
                    ">

                        {totalRecords}{' '}

                        {
                            totalRecords === 1
                                ? 'attendance record'
                                : 'attendance records'
                        }

                        {' '}found

                    </p>


                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    ">

                        {filters.employeeId && (

                            <span className="
                                rounded-full
                                bg-[#8BCF00]/10
                                px-3
                                py-1.5
                                text-[11px]
                                font-medium
                                text-[#6FA800]
                            ">
                                Employee selected
                            </span>

                        )}


                        {hasActiveFilters && (

                            <button
                                type="button"
                                onClick={
                                    handleResetFilters
                                }
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    justify-center
                                    gap-1
                                    rounded-lg
                                    px-3
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                    transition
                                    hover:bg-base-200
                                    hover:text-base-content
                                "
                            >

                                <XMarkIcon className="
                                    h-4
                                    w-4
                                " />

                                Reset Filters

                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================================
                TABLE
            ================================================================= */}

            <div className="
                w-full
                overflow-x-auto
            ">

                <table className="
                    w-full
                    min-w-[1150px]
                    border-collapse
                ">

                    {/* =========================================================
                        HEADER
                    ========================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/40
                        ">

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Name
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Date
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Check In
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Check Out
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Image
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Status
                            </th>


                            <th className="
                                w-[100px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Action
                            </th>

                        </tr>

                    </thead>


                    {/* =========================================================
                        BODY
                    ========================================================= */}

                    <tbody>

                        {loading ? (

                            Array.from(
                                {
                                    length: 8,
                                }
                            ).map(
                                (
                                    _,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            `loading-${index}`
                                        }
                                        className="
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                        "
                                    >

                                        {Array.from(
                                            {
                                                length: 7,
                                            }
                                        ).map(
                                            (
                                                _,
                                                columnIndex
                                            ) => (

                                                <td
                                                    key={
                                                        `loading-${index}-${columnIndex}`
                                                    }
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >

                                                    <div className="
                                                        h-4
                                                        w-24
                                                        animate-pulse
                                                        rounded
                                                        bg-base-200
                                                    " />

                                                </td>

                                            )
                                        )}

                                    </tr>

                                )
                            )

                        ) : entries.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    className="
                                        px-6
                                        py-16
                                        text-center
                                    "
                                >

                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                    ">

                                        <div className="
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-base-200
                                        ">

                                            <span className="
                                                text-lg
                                                font-semibold
                                                text-base-content/30
                                            ">
                                                —
                                            </span>

                                        </div>


                                        <p className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-base-content/70
                                        ">
                                            No attendance records found
                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-base-content/45
                                        ">
                                            Try changing your filters or search.
                                        </p>

                                    </div>

                                </td>

                            </tr>

                        ) : (

                            entries.map(
                                (
                                    entry,
                                    index
                                ) => {

                                    const checkIn =
                                        entry?.checkIn ||
                                        null


                                    const checkOut =
                                        entry?.checkOut ||
                                        null


                                    const checkInLocation =
                                        checkIn?.location &&
                                        typeof checkIn.location === 'object'
                                            ? checkIn.location
                                            : {}


                                    const checkOutLocation =
                                        checkOut?.location &&
                                        typeof checkOut.location === 'object'
                                            ? checkOut.location
                                            : {}


                                    const checkInAddress =
                                        typeof checkIn?.location === 'string'
                                            ? checkIn.location
                                            : checkInLocation?.address ||
                                                null


                                    const checkOutAddress =
                                        typeof checkOut?.location === 'string'
                                            ? checkOut.location
                                            : checkOutLocation?.address ||
                                                null


                                    return (

                                        <tr
                                            key={
                                                entry.id ??
                                                `${entry.employeeId}-${entry.date}-${index}`
                                            }
                                            className="
                                                border-b
                                                border-base-300
                                                last:border-b-0
                                                transition-colors
                                                hover:bg-base-200/30
                                            "
                                        >

                                            {/* =====================================
                                                NAME
                                            ===================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <div>

                                                    <p className="
                                                        text-sm
                                                        font-medium
                                                        text-base-content
                                                    ">
                                                        {
                                                            entry.name ||
                                                            '—'
                                                        }
                                                    </p>


                                                    {entry.employeeId && (

                                                        <p className="
                                                            mt-0.5
                                                            font-mono
                                                            text-[11px]
                                                            text-base-content/40
                                                        ">
                                                            {
                                                                entry.employeeId
                                                            }
                                                        </p>

                                                    )}

                                                </div>

                                            </td>


                                            {/* =====================================
                                                DATE
                                            ===================================== */}

                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        entry.date ||
                                                        '—'
                                                    }
                                                </span>

                                            </td>


                                            {/* =====================================
                                                CHECK IN
                                            ===================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <p className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        checkIn?.time ||
                                                        '—'
                                                    }
                                                </p>


                                                {checkIn && (

                                                    <LocationLink
                                                        location={
                                                            checkInAddress
                                                        }

                                                        latitude={
                                                            checkInLocation?.latitude ??
                                                            checkIn?.latitude ??
                                                            null
                                                        }

                                                        longitude={
                                                            checkInLocation?.longitude ??
                                                            checkIn?.longitude ??
                                                            null
                                                        }

                                                        isOffice={
                                                            Boolean(
                                                                checkInLocation?.isOffice ??
                                                                checkIn?.isOffice
                                                            )
                                                        }
                                                    />

                                                )}

                                            </td>


                                            {/* =====================================
                                                CHECK OUT
                                            ===================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <p className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        checkOut?.time ||
                                                        '—'
                                                    }
                                                </p>


                                                {checkOut && (

                                                    <LocationLink
                                                        location={
                                                            checkOutAddress
                                                        }

                                                        latitude={
                                                            checkOutLocation?.latitude ??
                                                            checkOut?.latitude ??
                                                            null
                                                        }

                                                        longitude={
                                                            checkOutLocation?.longitude ??
                                                            checkOut?.longitude ??
                                                            null
                                                        }

                                                        isOffice={
                                                            Boolean(
                                                                checkOutLocation?.isOffice ??
                                                                checkOut?.isOffice
                                                            )
                                                        }
                                                    />

                                                )}

                                            </td>


                                            {/* =====================================
                                                IMAGE
                                            ===================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <AttendanceImageCell
                                                    checkIn={
                                                        checkIn
                                                    }
                                                    checkOut={
                                                        checkOut
                                                    }
                                                />

                                            </td>


                                            {/* =====================================
                                                STATUS
                                            ===================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span
                                                    className={[
                                                        'inline-flex',
                                                        'rounded-full',
                                                        'border',
                                                        'px-3',
                                                        'py-1.5',
                                                        'text-xs',
                                                        'font-medium',

                                                        getStatusClasses(
                                                            entry.status
                                                        ),

                                                    ].join(' ')}
                                                >
                                                    {
                                                        formatStatus(
                                                            entry.status
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* =====================================
                                                ACTION
                                            ===================================== */}

                                            <td className="
                                                px-5
                                                py-4
                                                text-center
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onView?.(
                                                            entry
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        h-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-base-300
                                                        bg-base-100
                                                        px-3.5
                                                        text-xs
                                                        font-medium
                                                        text-base-content/70
                                                        transition
                                                        hover:border-[#8BCF00]/40
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-[#8BCF00]/30
                                                    "
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )

                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* =================================================================
                PAGINATION
            ================================================================= */}

            {!loading &&
                totalPages > 0 && (

                <div className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-base-300
                    px-4
                    py-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    {/* =========================================================
                        LEFT SIDE
                    ========================================================= */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                    ">

                        <p className="
                            text-xs
                            text-base-content/50
                        ">

                            Showing{' '}

                            <span className="
                                font-semibold
                                text-base-content/70
                            ">
                                {firstRecord}
                            </span>

                            {' '}to{' '}

                            <span className="
                                font-semibold
                                text-base-content/70
                            ">
                                {lastRecord}
                            </span>

                            {' '}of{' '}

                            <span className="
                                font-semibold
                                text-base-content/70
                            ">
                                {totalRecords}
                            </span>

                            {' '}records

                        </p>


                        {/* =====================================================
                            PAGE SIZE
                        ===================================================== */}

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <span className="
                                whitespace-nowrap
                                text-xs
                                text-base-content/50
                            ">
                                Rows
                            </span>


                            <select
                                value={
                                    pageSize
                                }
                                onChange={
                                    handlePageSizeChange
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    select
                                    select-bordered
                                    h-8
                                    min-h-8
                                    w-[78px]
                                    px-2
                                    text-xs
                                "
                                aria-label="Rows per page"
                            >

                                {PAGE_SIZE_OPTIONS.map(
                                    (
                                        size
                                    ) => (

                                        <option
                                            key={
                                                size
                                            }
                                            value={
                                                size
                                            }
                                        >
                                            {size}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =========================================================
                        PAGINATION CONTROLS
                    ========================================================= */}

                    <div className="
                        flex
                        items-center
                        justify-center
                        gap-1
                    ">

                        {/* =====================================================
                            PREVIOUS
                        ===================================================== */}

                        <button
                            type="button"
                            onClick={
                                handlePreviousPage
                            }
                            disabled={
                                loading ||
                                currentPage <= 1
                            }
                            className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Previous page"
                        >

                            <ChevronLeftIcon className="
                                h-4
                                w-4
                            " />

                        </button>


                        {/* =====================================================
                            PAGE NUMBERS
                        ===================================================== */}

                        {paginationPages.map(
                            (
                                page,
                                index
                            ) => {

                                if (
                                    page ===
                                    'left-ellipsis'
                                ) {

                                    return (

                                        <span
                                            key={
                                                `left-${index}`
                                            }
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                text-xs
                                                text-base-content/40
                                            "
                                        >
                                            …
                                        </span>

                                    )

                                }


                                if (
                                    page ===
                                    'right-ellipsis'
                                ) {

                                    return (

                                        <span
                                            key={
                                                `right-${index}`
                                            }
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                text-xs
                                                text-base-content/40
                                            "
                                        >
                                            …
                                        </span>

                                    )

                                }


                                const isActive =
                                    page ===
                                    currentPage


                                return (

                                    <button
                                        key={
                                            page
                                        }
                                        type="button"
                                        onClick={() =>
                                            handlePageChange(
                                                page
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className={[
                                            'inline-flex',
                                            'h-8',
                                            'min-w-8',
                                            'items-center',
                                            'justify-center',
                                            'rounded-lg',
                                            'px-2',
                                            'text-xs',
                                            'font-medium',
                                            'transition',
                                            'disabled:cursor-not-allowed',
                                            'disabled:opacity-50',

                                            isActive
                                                ? 'bg-[#8BCF00] text-white'
                                                : 'border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 hover:text-base-content',

                                        ].join(' ')}
                                    >
                                        {
                                            page
                                        }
                                    </button>

                                )

                            }
                        )}


                        {/* =====================================================
                            NEXT
                        ===================================================== */}

                        <button
                            type="button"
                            onClick={
                                handleNextPage
                            }
                            disabled={
                                loading ||
                                currentPage >= totalPages
                            }
                            className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            aria-label="Next page"
                        >

                            <ChevronRightIcon className="
                                h-4
                                w-4
                            " />

                        </button>

                    </div>

                </div>

            )}

        </div>

    )
}


export default AttendanceTable