// admin-react/src/pages/EmployeeManagement/Attendance/components/AttendanceTable.jsx

import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon'


// =============================================================
// LOCATION LINK
// =============================================================

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


    const mapUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            location || ''
        )}`


    return (
        <div className="mt-1 flex items-center gap-1.5">

            <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                    event.stopPropagation()
                }}
                className="inline-flex items-center gap-1 text-xs text-base-content/50 transition hover:text-[#6FA800]"
                title="Open location in Google Maps"
            >

                <MapPinIcon className="h-3.5 w-3.5" />

                <span className="max-w-[150px] truncate">
                    {location || 'Location unavailable'}
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
                {isOffice ? 'In Office' : 'Out Office'}
            </span>

        </div>
    )
}


// =============================================================
// STATUS
// =============================================================

const getStatusClasses = (status) => {

    const normalizedStatus =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalizedStatus === 'present') {

        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalizedStatus === 'late') {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }


    if (normalizedStatus === 'absent') {

        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    if (normalizedStatus === 'half-day') {

        return [
            'border-blue-300',
            'bg-blue-50',
            'text-blue-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// STATUS TEXT
// =============================================================

const formatStatus = (status) => {

    const normalizedStatus =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalizedStatus === 'half-day') {
        return 'Half Day'
    }


    if (normalizedStatus === 'present') {
        return 'Present'
    }


    if (normalizedStatus === 'late') {
        return 'Late'
    }


    if (normalizedStatus === 'absent') {
        return 'Absent'
    }


    return 'Unknown'

}


// =============================================================
// ATTENDANCE TABLE
// =============================================================

function AttendanceTable({
    entries = [],
    onView,
}) {

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!entries.length) {

        return (

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    px-6
                    py-12
                    text-center
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

            </div>

        )

    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            <div className="
                w-full
                overflow-x-auto
            ">

                <table className="
                    w-full
                    min-w-[1000px]
                    border-collapse
                ">

                    {/* =================================================
                        HEADER
                    ================================================= */}

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


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <tbody>

                        {entries.map(
                            (entry, index) => {

                                const checkIn =
                                    entry.checkIn || {}


                                const checkOut =
                                    entry.checkOut || {}


                                return (

                                    <tr
                                        key={
                                            entry.id ??
                                            index
                                        }
                                        className="
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                            transition-colors
                                            hover:bg-base-200/30
                                        "
                                    >

                                        {/* =================================
                                            NAME
                                        ================================= */}

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


                                        {/* =================================
                                            DATE
                                        ================================= */}

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


                                        {/* =================================
                                            CHECK IN
                                        ================================= */}

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
                                                    checkIn.time ||
                                                    '—'
                                                }
                                            </p>


                                            <LocationLink
                                                location={
                                                    checkIn.location
                                                }
                                                latitude={
                                                    checkIn.latitude
                                                }
                                                longitude={
                                                    checkIn.longitude
                                                }
                                                isOffice={
                                                    checkIn.isOffice
                                                }
                                            />

                                        </td>


                                        {/* =================================
                                            CHECK OUT
                                        ================================= */}

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
                                                    checkOut.time ||
                                                    '—'
                                                }
                                            </p>


                                            <LocationLink
                                                location={
                                                    checkOut.location
                                                }
                                                latitude={
                                                    checkOut.latitude
                                                }
                                                longitude={
                                                    checkOut.longitude
                                                }
                                                isOffice={
                                                    checkOut.isOffice
                                                }
                                            />

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

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


                                        {/* =================================
                                            ACTION
                                        ================================= */}

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
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default AttendanceTable