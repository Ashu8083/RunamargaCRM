// admin-react/src/pages/EmployeeManagement/Attendance/components/AttendanceHistoryModal.jsx

import { useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import PrinterIcon from '@heroicons/react/24/outline/PrinterIcon'


// =============================================================
// MONTH OPTIONS
// =============================================================

const MONTH_OPTIONS = [
    {
        value: '2026-08',
        label: 'August 2026',
    },
    {
        value: '2026-07',
        label: 'July 2026',
    },
    {
        value: '2026-06',
        label: 'June 2026',
    },
    {
        value: '2026-05',
        label: 'May 2026',
    },
]


// =============================================================
// STATUS HELPERS
// =============================================================

const getStatusLabel = (status) => {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalized === 'present') {
        return 'Present'
    }


    if (normalized === 'late') {
        return 'Late'
    }


    if (normalized === 'absent') {
        return 'Absent'
    }


    if (normalized === 'half-day') {
        return 'Half Day'
    }


    return 'Unknown'
}


// =============================================================
// STATUS CLASSES
// =============================================================

const getStatusClasses = (status) => {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalized === 'present') {

        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalized === 'late') {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }


    if (normalized === 'absent') {

        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    if (normalized === 'half-day') {

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
// MAP URL
// =============================================================

const getMapUrl = (location) => {

    if (!location) {
        return '#'
    }


    if (
        location.latitude !== null &&
        location.latitude !== undefined &&
        location.longitude !== null &&
        location.longitude !== undefined
    ) {

        return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`

    }


    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location.address || ''
    )}`

}


// =============================================================
// LOCATION DISPLAY
// =============================================================

const LocationDisplay = ({
    location,
}) => {

    if (!location) {
        return (
            <span className="text-xs text-base-content/40">
                Location unavailable
            </span>
        )
    }


    const isOffice =
        Boolean(location.isOffice)


    return (

        <div className="flex items-center gap-2">

            <a
                href={getMapUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    inline-flex
                    items-center
                    gap-1
                    text-xs
                    text-base-content/55
                    transition
                    hover:text-[#6FA800]
                "
            >

                <MapPinIcon className="h-3.5 w-3.5" />

                <span className="max-w-[150px] truncate">
                    {location.address || 'View location'}
                </span>

            </a>


            <span
                className={[
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
                {isOffice
                    ? 'In Office'
                    : 'Out Office'}
            </span>

        </div>

    )

}


// =============================================================
// PUNCH IMAGE
// =============================================================

const PunchImage = ({
    image,
    label,
}) => {

    return (

        <div className="
            overflow-hidden
            rounded-lg
            border
            border-base-300
            bg-base-200
        ">

            {image ? (

                <img
                    src={image}
                    alt={label}
                    className="
                        h-36
                        w-full
                        object-cover
                    "
                />

            ) : (

                <div className="
                    flex
                    h-36
                    items-center
                    justify-center
                    px-4
                    text-center
                ">

                    <p className="
                        text-xs
                        text-base-content/40
                    ">
                        No {label.toLowerCase()} image
                    </p>

                </div>

            )}

            <div className="
                border-t
                border-base-300
                bg-base-100
                px-3
                py-2
            ">

                <p className="
                    text-[11px]
                    font-medium
                    text-base-content/55
                ">
                    {label}
                </p>

            </div>

        </div>

    )

}


// =============================================================
// MONTHLY SUMMARY
// =============================================================

const SummaryCard = ({
    label,
    value,
}) => {

    return (

        <div className="
            rounded-lg
            border
            border-base-300
            bg-base-100
            px-3
            py-3
        ">

            <p className="
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-base-content/40
            ">
                {label}
            </p>


            <p className="
                mt-1
                text-lg
                font-semibold
                text-base-content
            ">
                {value}
            </p>

        </div>

    )

}


// =============================================================
// HISTORY MODAL
// =============================================================

function AttendanceHistoryModal({
    open = false,
    entry = null,
    history = [],
    onClose,
}) {

    const [selectedMonth, setSelectedMonth] =
        useState('2026-08')


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        onClose?.()

    }


    // =========================================================
    // FILTER MONTH
    // =========================================================

    const monthlyHistory = useMemo(() => {

        if (!Array.isArray(history)) {
            return []
        }


        return history.filter(
            (item) =>
                item.month === selectedMonth
        )

    }, [
        history,
        selectedMonth,
    ])


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary = useMemo(() => {

        const present =
            monthlyHistory.filter(
                (item) =>
                    item.status === 'present'
            ).length


        const late =
            monthlyHistory.filter(
                (item) =>
                    item.status === 'late'
            ).length


        const absent =
            monthlyHistory.filter(
                (item) =>
                    item.status === 'absent'
            ).length


        const halfDay =
            monthlyHistory.filter(
                (item) =>
                    item.status === 'half-day'
            ).length


        return {
            present,
            late,
            absent,
            halfDay,
        }

    }, [
        monthlyHistory,
    ])


    // =========================================================
    // CURRENT DAY
    // =========================================================

    const currentEntry =
        entry || {}


    const currentCheckIn =
        currentEntry.checkIn || null


    const currentCheckOut =
        currentEntry.checkOut || null


    // =========================================================
    // CURRENT STATUS
    // =========================================================

    const currentStatus =
        currentEntry.status ||
        'unknown'


    // =========================================================
    // DOWNLOAD CHART
    // =========================================================

    const handleDownloadChart = () => {

        const chart =
            document.getElementById(
                'attendance-history-chart'
            )


        if (!chart) {
            return
        }


        const canvas =
            document.createElement('canvas')


        const width =
            chart.offsetWidth || 900


        const height =
            chart.offsetHeight || 320


        canvas.width = width * 2
        canvas.height = height * 2


        const context =
            canvas.getContext('2d')


        if (!context) {
            return
        }


        context.scale(2, 2)


        context.fillStyle =
            '#ffffff'


        context.fillRect(
            0,
            0,
            width,
            height
        )


        context.fillStyle =
            '#222222'


        context.font =
            '600 16px Arial'


        context.fillText(
            `${currentEntry.name || 'Employee'} - Attendance History`,
            20,
            30
        )


        context.font =
            '12px Arial'


        context.fillStyle =
            '#666666'


        const monthLabel =
            MONTH_OPTIONS.find(
                (month) =>
                    month.value ===
                    selectedMonth
            )?.label || selectedMonth


        context.fillText(
            monthLabel,
            20,
            52
        )


        const chartItems =
            monthlyHistory


        const startX = 25
        const startY = 85
        const barWidth = 22
        const gap = 8
        const maxHeight = 170


        chartItems.forEach(
            (item, index) => {

                const x =
                    startX +
                    index *
                    (barWidth + gap)


                const status =
                    String(
                        item.status || ''
                    ).toLowerCase()


                let barHeight =
                    maxHeight


                if (status === 'absent') {
                    barHeight = 35
                } else if (
                    status === 'late'
                ) {
                    barHeight = 120
                } else if (
                    status === 'half-day'
                ) {
                    barHeight = 80
                }


                context.fillStyle =
                    status === 'present'
                        ? '#8BCF00'
                        : status === 'late'
                            ? '#f59e0b'
                            : status === 'half-day'
                                ? '#3b82f6'
                                : '#ef4444'


                context.fillRect(
                    x,
                    startY +
                    maxHeight -
                    barHeight,
                    barWidth,
                    barHeight
                )


                context.fillStyle =
                    '#666666'


                context.font =
                    '10px Arial'


                context.fillText(
                    String(
                        item.day || ''
                    ),
                    x + 5,
                    startY +
                    maxHeight +
                    15
                )

            }
        )


        const link =
            document.createElement('a')


        link.download =
            `attendance-${selectedMonth}.png`


        link.href =
            canvas.toDataURL(
                'image/png'
            )


        link.click()

    }


    // =========================================================
    // PRINT / PDF
    // =========================================================

    const handlePrint = () => {

        window.print()

    }


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/40
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose()
                }

            }}
        >

            <div className="
                flex
                max-h-[94vh]
                w-full
                max-w-5xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-base-300
                bg-base-100
                shadow-2xl
            ">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div>

                        <h2 className="
                            text-base
                            font-semibold
                            text-base-content
                        ">
                            Attendance History
                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">
                            {currentEntry.name ||
                                'Employee'}
                        </p>

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <button
                            type="button"
                            onClick={handlePrint}
                            title="Print / Save as PDF"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-base-content/50
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                            "
                        >

                            <PrinterIcon className="
                                h-4
                                w-4
                            " />

                        </button>


                        <button
                            type="button"
                            onClick={handleClose}
                            title="Close"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-base-content/50
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                            "
                        >

                            <XMarkIcon className="
                                h-5
                                w-5
                            " />

                        </button>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-5
                    py-5
                ">


                    {/* =================================================
                        CURRENT STATUS
                    ================================================= */}

                    <div className="
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/30
                        p-4
                    ">

                        <div className="
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        ">

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-base-content/40
                                ">
                                    Current Status
                                </p>


                                <div className="
                                    mt-1.5
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <span
                                        className={[
                                            'rounded-full',
                                            'border',
                                            'px-3',
                                            'py-1.5',
                                            'text-xs',
                                            'font-medium',
                                            getStatusClasses(
                                                currentStatus
                                            ),
                                        ].join(' ')}
                                    >
                                        {getStatusLabel(
                                            currentStatus
                                        )}
                                    </span>

                                </div>

                            </div>


                            <div className="
                                grid
                                grid-cols-2
                                gap-3
                            ">

                                <div className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-4
                                    py-3
                                ">

                                    <p className="
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        text-base-content/40
                                    ">
                                        Punch In
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        {
                                            currentCheckIn?.time ||
                                            '—'
                                        }
                                    </p>

                                </div>


                                <div className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-4
                                    py-3
                                ">

                                    <p className="
                                        text-[10px]
                                        uppercase
                                        tracking-wide
                                        text-base-content/40
                                    ">
                                        Punch Out
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        {
                                            currentCheckOut?.time ||
                                            '—'
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        CURRENT PUNCH IMAGES
                    ================================================= */}

                    <div className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    ">

                        <PunchImage
                            image={
                                currentCheckIn?.image
                            }
                            label="Punch In Image"
                        />


                        <PunchImage
                            image={
                                currentCheckOut?.image
                            }
                            label="Punch Out Image"
                        />

                    </div>


                    {/* =================================================
                        MONTH SELECTOR
                    ================================================= */}

                    <div className="
                        mt-5
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    ">

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Attendance Month
                            </label>


                            <select
                                value={selectedMonth}
                                onChange={(event) =>
                                    setSelectedMonth(
                                        event.target.value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    sm:w-[210px]
                                "
                            >

                                {MONTH_OPTIONS.map(
                                    (month) => (

                                        <option
                                            key={
                                                month.value
                                            }
                                            value={
                                                month.value
                                            }
                                        >
                                            {month.label}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleDownloadChart
                            }
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-4
                                text-xs
                                font-medium
                                text-base-content/70
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                            "
                        >

                            <ArrowDownTrayIcon className="
                                h-4
                                w-4
                            " />

                            Download Chart

                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-4
                    ">

                        <SummaryCard
                            label="Present"
                            value={
                                summary.present
                            }
                        />


                        <SummaryCard
                            label="Late"
                            value={
                                summary.late
                            }
                        />


                        <SummaryCard
                            label="Half Day"
                            value={
                                summary.halfDay
                            }
                        />


                        <SummaryCard
                            label="Absent"
                            value={
                                summary.absent
                            }
                        />

                    </div>


                    {/* =================================================
                        CHART
                    ================================================= */}

                    <div
                        id="attendance-history-chart"
                        className="
                            mt-5
                            overflow-x-auto
                            rounded-xl
                            border
                            border-base-300
                            bg-base-100
                            p-5
                        "
                    >

                        <div className="
                            min-w-[650px]
                        ">

                            <div className="
                                mb-5
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <h3 className="
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        Daily Attendance
                                    </h3>


                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-base-content/45
                                    ">
                                        Day-wise attendance
                                        for the selected month.
                                    </p>

                                </div>

                            </div>


                            {monthlyHistory.length ? (

                                <div className="
                                    flex
                                    h-[230px]
                                    items-end
                                    gap-2
                                    border-b
                                    border-base-300
                                    pb-7
                                ">

                                    {monthlyHistory.map(
                                        (item, index) => {

                                            const status =
                                                String(
                                                    item.status ||
                                                    ''
                                                ).toLowerCase()


                                            const heightClass =
                                                status === 'present'
                                                    ? 'h-[85%]'
                                                    : status === 'late'
                                                        ? 'h-[65%]'
                                                        : status === 'half-day'
                                                            ? 'h-[45%]'
                                                            : status === 'absent'
                                                                ? 'h-[20%]'
                                                                : 'h-[35%]'


                                            const barClass =
                                                status === 'present'
                                                    ? 'bg-[#8BCF00]'
                                                    : status === 'late'
                                                        ? 'bg-amber-400'
                                                        : status === 'half-day'
                                                            ? 'bg-blue-400'
                                                            : status === 'absent'
                                                                ? 'bg-red-400'
                                                                : 'bg-base-300'


                                            return (

                                                <div
                                                    key={
                                                        item.id ??
                                                        index
                                                    }
                                                    className="
                                                        flex
                                                        h-full
                                                        min-w-[22px]
                                                        flex-1
                                                        flex-col
                                                        items-center
                                                        justify-end
                                                    "
                                                    title={`${item.day || ''} - ${getStatusLabel(item.status)}`}
                                                >

                                                    <div
                                                        className={[
                                                            'w-full',
                                                            'max-w-[26px]',
                                                            'rounded-t-md',
                                                            'transition',
                                                            heightClass,
                                                            barClass,
                                                        ].join(' ')}
                                                    />


                                                    <span className="
                                                        absolute
                                                        mt-[245px]
                                                        text-[10px]
                                                        text-base-content/45
                                                    ">
                                                        {
                                                            item.day ||
                                                            ''
                                                        }
                                                    </span>

                                                </div>

                                            )

                                        }
                                    )}

                                </div>

                            ) : (

                                <div className="
                                    flex
                                    h-[220px]
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-base-200/40
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/40
                                    ">
                                        No attendance data
                                        for this month.
                                    </p>

                                </div>

                            )}


                            <div className="
                                mt-4
                                flex
                                flex-wrap
                                gap-4
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                ">

                                    <span className="
                                        h-2.5
                                        w-2.5
                                        rounded-sm
                                        bg-[#8BCF00]
                                    " />

                                    <span className="
                                        text-[11px]
                                        text-base-content/50
                                    ">
                                        Present
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                ">

                                    <span className="
                                        h-2.5
                                        w-2.5
                                        rounded-sm
                                        bg-amber-400
                                    " />

                                    <span className="
                                        text-[11px]
                                        text-base-content/50
                                    ">
                                        Late
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                ">

                                    <span className="
                                        h-2.5
                                        w-2.5
                                        rounded-sm
                                        bg-blue-400
                                    " />

                                    <span className="
                                        text-[11px]
                                        text-base-content/50
                                    ">
                                        Half Day
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                ">

                                    <span className="
                                        h-2.5
                                        w-2.5
                                        rounded-sm
                                        bg-red-400
                                    " />

                                    <span className="
                                        text-[11px]
                                        text-base-content/50
                                    ">
                                        Absent
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        DAY-WISE HISTORY
                    ================================================= */}

                    <div className="
                        mt-5
                        overflow-hidden
                        rounded-xl
                        border
                        border-base-300
                    ">

                        <div className="
                            border-b
                            border-base-300
                            bg-base-200/30
                            px-4
                            py-3
                        ">

                            <h3 className="
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                Daily Details
                            </h3>

                        </div>


                        {monthlyHistory.length ? (

                            <div className="
                                overflow-x-auto
                            ">

                                <table className="
                                    w-full
                                    min-w-[700px]
                                    border-collapse
                                ">

                                    <thead>

                                        <tr className="
                                            border-b
                                            border-base-300
                                        ">

                                            <th className="
                                                px-4
                                                py-3
                                                text-left
                                                text-[11px]
                                                font-semibold
                                                text-base-content/55
                                            ">
                                                Date
                                            </th>


                                            <th className="
                                                px-4
                                                py-3
                                                text-left
                                                text-[11px]
                                                font-semibold
                                                text-base-content/55
                                            ">
                                                Check In
                                            </th>


                                            <th className="
                                                px-4
                                                py-3
                                                text-left
                                                text-[11px]
                                                font-semibold
                                                text-base-content/55
                                            ">
                                                Check Out
                                            </th>


                                            <th className="
                                                px-4
                                                py-3
                                                text-left
                                                text-[11px]
                                                font-semibold
                                                text-base-content/55
                                            ">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {monthlyHistory.map(
                                            (item, index) => {

                                                return (

                                                    <tr
                                                        key={
                                                            item.id ??
                                                            index
                                                        }
                                                        className="
                                                            border-b
                                                            border-base-300
                                                            last:border-b-0
                                                        "
                                                    >

                                                        <td className="
                                                            px-4
                                                            py-3
                                                        ">

                                                            <span className="
                                                                text-xs
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    item.date ||
                                                                    item.day ||
                                                                    '—'
                                                                }
                                                            </span>

                                                        </td>


                                                        <td className="
                                                            px-4
                                                            py-3
                                                        ">

                                                            <p className="
                                                                text-xs
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    item.checkIn?.time ||
                                                                    '—'
                                                                }
                                                            </p>


                                                            <LocationDisplay
                                                                location={
                                                                    item.checkIn
                                                                }
                                                            />

                                                        </td>


                                                        <td className="
                                                            px-4
                                                            py-3
                                                        ">

                                                            <p className="
                                                                text-xs
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    item.checkOut?.time ||
                                                                    '—'
                                                                }
                                                            </p>


                                                            <LocationDisplay
                                                                location={
                                                                    item.checkOut
                                                                }
                                                            />

                                                        </td>


                                                        <td className="
                                                            px-4
                                                            py-3
                                                        ">

                                                            <span
                                                                className={[
                                                                    'inline-flex',
                                                                    'rounded-full',
                                                                    'border',
                                                                    'px-2.5',
                                                                    'py-1',
                                                                    'text-[11px]',
                                                                    'font-medium',
                                                                    getStatusClasses(
                                                                        item.status
                                                                    ),
                                                                ].join(' ')}
                                                            >
                                                                {
                                                                    getStatusLabel(
                                                                        item.status
                                                                    )
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>

                                                )

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="
                                px-5
                                py-10
                                text-center
                            ">

                                <p className="
                                    text-xs
                                    text-base-content/40
                                ">
                                    No daily records available.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    justify-end
                    border-t
                    border-base-300
                    px-5
                    py-4
                ">

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            h-10
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            px-4
                            text-sm
                            font-medium
                            text-base-content/70
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}


export default AttendanceHistoryModal