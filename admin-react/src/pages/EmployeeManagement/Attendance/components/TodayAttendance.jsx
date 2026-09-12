import React, {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    createPortal,
} from 'react-dom'

import PrinterIcon from '@heroicons/react/24/outline/PrinterIcon'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'


// ============================================================================
// DATE HELPERS
// ============================================================================

const getTodayDate = () => {

    const today =
        new Date()


    const year =
        today.getFullYear()


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            '0'
        )


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            '0'
        )


    return `${year}-${month}-${day}`

}


// ============================================================================
// FORMAT DISPLAY DATE
// ============================================================================

const formatDisplayDate = (
    value
) => {

    if (!value) {
        return '—'
    }


    const date =
        new Date(
            `${value}T00:00:00`
        )


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value
    }


    return date.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    )

}


// ============================================================================
// FORMAT TIME
// ============================================================================

const formatTime = (
    value
) => {

    if (!value) {
        return '—'
    }


    // ------------------------------------------------------------
    // Already formatted value such as:
    //
    // 09:30 AM
    // 06:15 PM
    // ------------------------------------------------------------

    if (
        typeof value === 'string' &&
        /am|pm/i.test(
            value
        )
    ) {
        return value
    }


    // ------------------------------------------------------------
    // PostgreSQL / API timestamp:
    //
    // 2026-09-11T09:30:00
    // ------------------------------------------------------------

    const date =
        new Date(
            value
        )


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value
    }


    return date.toLocaleTimeString(
        'en-IN',
        {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }
    )

}


// ============================================================================
// NORMALIZE STATUS
// ============================================================================

const normalizeStatus = (
    entry
) => {

    const rawStatus =
        String(
            entry?.status || ''
        )
            .trim()
            .toLowerCase()


    if (
        entry?.punchIn ||
        entry?.checkIn?.time ||
        rawStatus === 'present'
    ) {
        return 'Present'
    }


    return 'Absent'

}


// ============================================================================
// STATUS CLASS
// ============================================================================

const getStatusClass = (
    status
) => {

    if (
        status === 'Present'
    ) {

        return [
            'border',
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    return [
        'border',
        'border-red-300',
        'bg-red-50',
        'text-red-600',
    ].join(' ')

}


// ============================================================================
// TIME CELL
// ============================================================================

const TimeCell = ({
    value,
}) => {

    return (

        <span className="
            whitespace-nowrap
            text-sm
            font-medium
            text-base-content
        ">
            {
                formatTime(
                    value
                )
            }
        </span>

    )

}


// ============================================================================
// COMPONENT
// ============================================================================

function TodayAttendance({
    open = false,
    entries = [],
    loading = false,
    error = null,
    onClose,
    onDateChange,
}) {

    // ========================================================================
    // SELECTED DATE
    // ========================================================================

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(
        getTodayDate()
    )


    // ========================================================================
    // SELECTED IMAGE
    // ========================================================================

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null)


    // ========================================================================
    // RESET TO TODAY WHEN MODAL OPENS
    // ========================================================================

    useEffect(() => {

        if (!open) {
            return
        }


        const today =
            getTodayDate()


        setSelectedDate(
            today
        )

    }, [
        open,
    ])


    // ========================================================================
    // CLOSE IMAGE
    // ========================================================================

    const closeImage = () => {

        setSelectedImage(
            null
        )

    }


    // ========================================================================
    // ESCAPE KEY
    // ========================================================================

    useEffect(() => {

        if (!open) {
            return undefined
        }


        const handleKeyDown = (
            event
        ) => {

            if (
                event.key ===
                'Escape'
            ) {

                if (
                    selectedImage
                ) {

                    closeImage()

                    return

                }


                if (
                    typeof onClose ===
                    'function'
                ) {

                    onClose()

                }

            }

        }


        document.addEventListener(
            'keydown',
            handleKeyDown
        )


        return () => {

            document.removeEventListener(
                'keydown',
                handleKeyDown
            )

        }

    }, [
        open,
        selectedImage,
        onClose,
    ])


    // ========================================================================
    // NORMALIZE ENTRIES
    // ========================================================================

    const normalizedEntries =
        useMemo(() => {

            if (
                !Array.isArray(
                    entries
                )
            ) {

                return []

            }


            return entries.map(
                (
                    entry
                ) => {

                    const punchIn =
                        entry?.punchIn ??
                        entry?.punch_in ??
                        entry?.checkIn?.time ??
                        null


                    const lunchOut =
                        entry?.lunchOut ??
                        entry?.lunch_out ??
                        null


                    const lunchIn =
                        entry?.lunchIn ??
                        entry?.lunch_in ??
                        null


                    const punchOut =
                        entry?.punchOut ??
                        entry?.punch_out ??
                        entry?.checkOut?.time ??
                        null


                    return {

                        ...entry,

                        id:
                            entry?.id ??
                            null,

                        employeeId:
                            entry?.employeeId ??
                            entry?.employee_id ??
                            null,

                        name:
                            entry?.name ||
                            'N/A',

                        email:
                            entry?.email ||
                            null,

                        date:
                            entry?.date ||
                            '',

                        punchIn,

                        lunchOut,

                        lunchIn,

                        punchOut,

                        displayStatus:
                            normalizeStatus(
                                {
                                    ...entry,
                                    punchIn,
                                }
                            ),

                    }

                }
            )

        }, [
            entries,
        ])


    // ========================================================================
    // DISPLAYED ENTRIES
    // ========================================================================
    //
    // The parent already requests the selected date from the backend.
    //
    // We still keep this date check as a safety guard so that stale data from
    // a previous request is never displayed under the new date.
    //
    // ========================================================================

    const displayedEntries =
        useMemo(() => {

            if (
                !selectedDate
            ) {

                return normalizedEntries

            }


            return normalizedEntries.filter(
                (
                    entry
                ) =>
                    !entry.date ||
                    entry.date ===
                    selectedDate
            )

        }, [
            normalizedEntries,
            selectedDate,
        ])


    // ========================================================================
    // SUMMARY
    // ========================================================================

    const summary =
        useMemo(() => {

            let present = 0

            let absent = 0


            displayedEntries.forEach(
                (
                    entry
                ) => {

                    if (
                        entry.displayStatus ===
                        'Present'
                    ) {

                        present += 1

                    } else {

                        absent += 1

                    }

                }
            )


            return {

                present,

                absent,

                total:
                    displayedEntries.length,

            }

        }, [
            displayedEntries,
        ])


    // ========================================================================
    // TITLE
    // ========================================================================

    const today =
        getTodayDate()


    const isToday =
        selectedDate ===
        today


    const modalTitle =
        isToday
            ? "Today's Attendance"
            : `Attendance — ${formatDisplayDate(
                selectedDate
            )}`


    // ========================================================================
    // DATE CHANGE
    // ========================================================================

    const handleDateChange = (
        event
    ) => {

        const value =
            event.target.value


        if (!value) {
            return
        }


        setSelectedDate(
            value
        )


        if (
            typeof onDateChange ===
            'function'
        ) {

            onDateChange(
                value
            )

        }

    }


    // ========================================================================
    // DOWNLOAD IMAGE
    // ========================================================================

    const downloadImage = async (
        imageUrl,
        employeeName
    ) => {

        if (!imageUrl) {
            return
        }


        try {

            const response =
                await fetch(
                    imageUrl
                )


            if (!response.ok) {

                throw new Error(
                    'Unable to download image.'
                )

            }


            const blob =
                await response.blob()


            const objectUrl =
                window.URL.createObjectURL(
                    blob
                )


            const link =
                document.createElement(
                    'a'
                )


            link.href =
                objectUrl


            link.download =
                `${employeeName || 'employee'}-profile.jpg`


            document.body.appendChild(
                link
            )


            link.click()


            link.remove()


            window.URL.revokeObjectURL(
                objectUrl
            )

        } catch (
            downloadError
        ) {

            console.error(
                'Image download failed:',
                downloadError
            )


            window.open(
                imageUrl,
                '_blank',
                'noopener,noreferrer'
            )

        }

    }


    // ========================================================================
    // PRINT
    // ========================================================================

    const handlePrint = () => {

        const printWindow =
            window.open(
                '',
                '_blank',
                'width=1200,height=900'
            )


        if (!printWindow) {

            window.alert(
                'Please allow pop-ups for printing attendance.'
            )

            return

        }


        const tableRows =
            displayedEntries
                .map(
                    (
                        entry
                    ) => {

                        const status =
                            entry.displayStatus


                        return `

                            <tr>

                                <td>
                                    ${entry.name || 'N/A'}
                                </td>

                                <td>
                                    ${entry.employeeId ?? '—'}
                                </td>

                                <td>
                                    ${formatTime(entry.punchIn)}
                                </td>

                                <td>
                                    ${formatTime(entry.lunchOut)}
                                </td>

                                <td>
                                    ${formatTime(entry.lunchIn)}
                                </td>

                                <td>
                                    ${formatTime(entry.punchOut)}
                                </td>

                                <td>
                                    ${status}
                                </td>

                            </tr>

                        `

                    }
                )
                .join('')


        printWindow.document.open()


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

                <head>

                    <title>
                        ${modalTitle}
                    </title>

                    <meta
                        charset="UTF-8"
                    />

                    <style>

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            margin: 0;
                            padding: 32px;
                            font-family:
                                Arial,
                                Helvetica,
                                sans-serif;
                            color: #222;
                            background: #fff;
                        }

                        h1 {
                            margin: 0 0 6px 0;
                            font-size: 22px;
                        }

                        .date {
                            margin-bottom: 24px;
                            color: #666;
                            font-size: 13px;
                        }

                        .summary {
                            display: flex;
                            gap: 12px;
                            margin-bottom: 24px;
                        }

                        .summary-card {
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            padding: 12px 18px;
                            min-width: 120px;
                        }

                        .summary-label {
                            font-size: 11px;
                            color: #777;
                            margin-bottom: 4px;
                        }

                        .summary-value {
                            font-size: 20px;
                            font-weight: 600;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th,
                        td {
                            border: 1px solid #ddd;
                            padding: 10px;
                            text-align: left;
                            font-size: 12px;
                        }

                        th {
                            background: #f5f5f5;
                            font-weight: 600;
                        }

                        .footer {
                            margin-top: 24px;
                            font-size: 10px;
                            color: #888;
                        }

                        @media print {

                            body {
                                padding: 12px;
                            }

                        }

                    </style>

                </head>


                <body>

                    <h1>
                        ${modalTitle}
                    </h1>

                    <div class="date">
                        Date: ${formatDisplayDate(
                            selectedDate
                        )}
                    </div>


                    <div class="summary">

                        <div class="summary-card">

                            <div class="summary-label">
                                Total
                            </div>

                            <div class="summary-value">
                                ${summary.total}
                            </div>

                        </div>


                        <div class="summary-card">

                            <div class="summary-label">
                                Present
                            </div>

                            <div class="summary-value">
                                ${summary.present}
                            </div>

                        </div>


                        <div class="summary-card">

                            <div class="summary-label">
                                Absent
                            </div>

                            <div class="summary-value">
                                ${summary.absent}
                            </div>

                        </div>

                    </div>


                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Punch In
                                </th>

                                <th>
                                    Lunch Out
                                </th>

                                <th>
                                    Lunch In
                                </th>

                                <th>
                                    Punch Out
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${tableRows}

                        </tbody>

                    </table>


                    <div class="footer">
                        Generated on ${new Date().toLocaleString(
                            'en-IN'
                        )}
                    </div>

                </body>

            </html>

        `)


        printWindow.document.close()


        printWindow.focus()


        setTimeout(
            () => {

                printWindow.print()

            },
            250
        )

    }


    // ========================================================================
    // CLOSED
    // ========================================================================

    if (!open) {
        return null
    }


    // ========================================================================
    // MODAL
    // ========================================================================

    const modal = (

        <div className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            sm:p-6
        ">

            {/* ================================================================
                BACKDROP
            ================================================================ */}

            <button
                type="button"
                aria-label="Close attendance modal"
                onClick={
                    onClose
                }
                className="
                    absolute
                    inset-0
                    cursor-default
                "
            />


            {/* ================================================================
                MODAL CARD
            ================================================================ */}

            <div className="
                relative
                z-10
                flex
                max-h-[90vh]
                w-full
                max-w-6xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-base-300
                bg-base-100
                shadow-2xl
            ">

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-base-300
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <h2 className="
                            text-base
                            font-semibold
                            text-base-content
                        ">
                            {modalTitle}
                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">
                            {formatDisplayDate(
                                selectedDate
                            )}
                        </p>

                    </div>


                    <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    ">

                        {/* =================================================
                            CALENDAR
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <CalendarDaysIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/45
                            " />


                            <input
                                type="date"
                                value={
                                    selectedDate
                                }
                                onChange={
                                    handleDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    h-9
                                    min-h-9
                                    pl-9
                                    text-xs
                                "
                                aria-label="Select attendance date"
                            />

                        </div>


                        {/* =================================================
                            PRINT
                        ================================================= */}

                        <button
                            type="button"
                            onClick={
                                handlePrint
                            }
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                h-9
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-3
                                text-xs
                                font-medium
                                text-base-content/70
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <PrinterIcon className="
                                h-4
                                w-4
                            " />

                            Print

                        </button>


                        {/* =================================================
                            CLOSE
                        ================================================= */}

                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            className="
                                inline-flex
                                h-9
                                w-9
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
                            "
                            aria-label="Close"
                        >

                            <XMarkIcon className="
                                h-5
                                w-5
                            " />

                        </button>

                    </div>

                </div>


                {/* ============================================================
                    SUMMARY
                ============================================================ */}

                <div className="
                    grid
                    grid-cols-3
                    gap-3
                    border-b
                    border-base-300
                    bg-base-200/20
                    px-5
                    py-4
                ">

                    <div className="
                        rounded-xl
                        border
                        border-base-300
                        bg-base-100
                        px-4
                        py-3
                    ">

                        <p className="
                            text-[11px]
                            font-medium
                            text-base-content/45
                        ">
                            Total
                        </p>


                        <p className="
                            mt-1
                            text-xl
                            font-semibold
                            text-base-content
                        ">
                            {
                                summary.total
                            }
                        </p>

                    </div>


                    <div className="
                        rounded-xl
                        border
                        border-[#8BCF00]/20
                        bg-[#8BCF00]/5
                        px-4
                        py-3
                    ">

                        <p className="
                            text-[11px]
                            font-medium
                            text-[#6FA800]
                        ">
                            Present
                        </p>


                        <p className="
                            mt-1
                            text-xl
                            font-semibold
                            text-[#6FA800]
                        ">
                            {
                                summary.present
                            }
                        </p>

                    </div>


                    <div className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50/60
                        px-4
                        py-3
                    ">

                        <p className="
                            text-[11px]
                            font-medium
                            text-red-600
                        ">
                            Absent
                        </p>


                        <p className="
                            mt-1
                            text-xl
                            font-semibold
                            text-red-600
                        ">
                            {
                                summary.absent
                            }
                        </p>

                    </div>

                </div>


                {/* ============================================================
                    ERROR
                ============================================================ */}

                {error && (

                    <div className="
                        mx-5
                        mt-4
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-xs
                        text-red-600
                    ">
                        {error}
                    </div>

                )}


                {/* ============================================================
                    TABLE AREA
                ============================================================ */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-auto
                ">

                    <table className="
                        w-full
                        min-w-[900px]
                        border-collapse
                    ">

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <thead className="
                            sticky
                            top-0
                            z-10
                        ">

                            <tr className="
                                border-b
                                border-base-300
                                bg-base-200/95
                                backdrop-blur
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
                                    Employee
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
                                    Punch In
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
                                    Lunch Out
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
                                    Lunch In
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
                                    Punch Out
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

                            </tr>

                        </thead>


                        {/* =================================================
                            BODY
                        ================================================= */}

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
                                                `today-loading-${index}`
                                            }
                                            className="
                                                border-b
                                                border-base-300
                                            "
                                        >

                                            {Array.from(
                                                {
                                                    length: 6,
                                                }
                                            ).map(
                                                (
                                                    _,
                                                    columnIndex
                                                ) => (

                                                    <td
                                                        key={
                                                            `today-loading-${index}-${columnIndex}`
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

                            ) : displayedEntries.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={6}
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

                                                <CalendarDaysIcon className="
                                                    h-5
                                                    w-5
                                                    text-base-content/30
                                                " />

                                            </div>


                                            <p className="
                                                mt-4
                                                text-sm
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                No attendance found
                                            </p>


                                            <p className="
                                                mt-1
                                                text-xs
                                                text-base-content/45
                                            ">
                                                No attendance records are available for {
                                                    formatDisplayDate(
                                                        selectedDate
                                                    )
                                                }.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                displayedEntries.map(
                                    (
                                        entry,
                                        index
                                    ) => {

                                        const profileImage =
                                            entry?.profileImage ??
                                            entry?.profile_image ??
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

                                                {/* =================================
                                                    EMPLOYEE
                                                ================================= */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        {profileImage ? (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        {
                                                                            url:
                                                                                profileImage,
                                                                            name:
                                                                                entry.name,
                                                                        }
                                                                    )
                                                                }
                                                                className="
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    overflow-hidden
                                                                    rounded-full
                                                                    border
                                                                    border-base-300
                                                                "
                                                            >

                                                                <img
                                                                    src={
                                                                        profileImage
                                                                    }
                                                                    alt={
                                                                        entry.name
                                                                    }
                                                                    className="
                                                                        h-full
                                                                        w-full
                                                                        object-cover
                                                                    "
                                                                />

                                                            </button>

                                                        ) : (

                                                            <div className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-base-200
                                                                text-xs
                                                                font-semibold
                                                                text-base-content/40
                                                            ">
                                                                {
                                                                    String(
                                                                        entry.name ||
                                                                        'N'
                                                                    )
                                                                        .charAt(0)
                                                                        .toUpperCase()
                                                                }
                                                            </div>

                                                        )}


                                                        <div className="
                                                            min-w-0
                                                        ">

                                                            <p className="
                                                                truncate
                                                                text-sm
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    entry.name ||
                                                                    'N/A'
                                                                }
                                                            </p>


                                                            <p className="
                                                                mt-0.5
                                                                font-mono
                                                                text-[11px]
                                                                text-base-content/40
                                                            ">
                                                                {
                                                                    entry.employeeId ??
                                                                    '—'
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* =================================
                                                    PUNCH IN
                                                ================================= */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <TimeCell
                                                        value={
                                                            entry.punchIn
                                                        }
                                                    />

                                                </td>


                                                {/* =================================
                                                    LUNCH OUT
                                                ================================= */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <TimeCell
                                                        value={
                                                            entry.lunchOut
                                                        }
                                                    />

                                                </td>


                                                {/* =================================
                                                    LUNCH IN
                                                ================================= */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <TimeCell
                                                        value={
                                                            entry.lunchIn
                                                        }
                                                    />

                                                </td>


                                                {/* =================================
                                                    PUNCH OUT
                                                ================================= */}

                                                <td className="
                                                    px-5
                                                    py-4
                                                ">

                                                    <TimeCell
                                                        value={
                                                            entry.punchOut
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
                                                            'px-3',
                                                            'py-1.5',
                                                            'text-xs',
                                                            'font-medium',

                                                            getStatusClass(
                                                                entry.displayStatus
                                                            ),
                                                        ].join(' ')}
                                                    >
                                                        {
                                                            entry.displayStatus
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ============================================================
                    FOOTER
                ============================================================ */}

                <div className="
                    flex
                    flex-col
                    gap-2
                    border-t
                    border-base-300
                    px-5
                    py-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <p className="
                        text-[11px]
                        text-base-content/40
                    ">

                        {
                            summary.total
                        }{' '}

                        {
                            summary.total === 1
                                ? 'employee'
                                : 'employees'
                        }

                        {' '}shown

                    </p>


                    <p className="
                        text-[11px]
                        text-base-content/40
                    ">
                        Attendance for {
                            formatDisplayDate(
                                selectedDate
                            )
                        }
                    </p>

                </div>

            </div>

        </div>

    )


    // ========================================================================
    // IMAGE PREVIEW
    // ========================================================================

    const imagePreview =
        selectedImage && (

            <div className="
                fixed
                inset-0
                z-[120]
                flex
                items-center
                justify-center
                bg-black/80
                p-4
            ">

                <button
                    type="button"
                    onClick={
                        closeImage
                    }
                    className="
                        absolute
                        inset-0
                        cursor-default
                    "
                    aria-label="Close image"
                />


                <div className="
                    relative
                    z-10
                    max-h-[90vh]
                    max-w-[90vw]
                    overflow-hidden
                    rounded-xl
                    bg-base-100
                    shadow-2xl
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-base-300
                        px-4
                        py-3
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content
                        ">
                            {
                                selectedImage.name ||
                                'Employee'
                            }
                        </p>


                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    downloadImage(
                                        selectedImage.url,
                                        selectedImage.name
                                    )
                                }
                                className="
                                    inline-flex
                                    h-8
                                    items-center
                                    justify-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-base-300
                                    px-3
                                    text-xs
                                    font-medium
                                    text-base-content/70
                                    transition
                                    hover:bg-base-200
                                "
                            >

                                <ArrowDownTrayIcon className="
                                    h-4
                                    w-4
                                " />

                                Download

                            </button>


                            <button
                                type="button"
                                onClick={
                                    closeImage
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
                                    text-base-content/60
                                    transition
                                    hover:bg-base-200
                                "
                                aria-label="Close image"
                            >

                                <XMarkIcon className="
                                    h-4
                                    w-4
                                " />

                            </button>

                        </div>

                    </div>


                    <div className="
                        max-h-[calc(90vh-60px)]
                        overflow-auto
                        p-4
                    ">

                        <img
                            src={
                                selectedImage.url
                            }
                            alt={
                                selectedImage.name ||
                                'Employee'
                            }
                            className="
                                max-h-[75vh]
                                max-w-[80vw]
                                rounded-lg
                                object-contain
                            "
                        />

                    </div>

                </div>

            </div>

        )


    // ========================================================================
    // PORTAL
    // ========================================================================

    return createPortal(
        <>

            {modal}

            {imagePreview}

        </>,
        document.body
    )

}


export default TodayAttendance