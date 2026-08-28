// admin-react/src/pages/EmployeeManagement/Attendance/components/TodayAttendance.jsx

import { useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon'
import PrinterIcon from '@heroicons/react/24/outline/PrinterIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'


function TodayAttendance({
    open = false,
    entries = [],
    onClose,
}) {

    // =========================================================
    // SELECTED DATE
    // =========================================================

    const getDefaultDate = () => {

        if (!Array.isArray(entries) || !entries.length) {
            return new Date()
                .toISOString()
                .slice(0, 10)
        }

        const dates = entries
            .map((entry) => entry?.date)
            .filter(Boolean)
            .sort()

        return dates[dates.length - 1] ||
            new Date()
                .toISOString()
                .slice(0, 10)

    }


    const [selectedDate, setSelectedDate] =
        useState(getDefaultDate)


    // =========================================================
    // LATE EMPLOYEES
    // =========================================================

    const [lateEmployees, setLateEmployees] =
        useState([])


    // =========================================================
    // TOGGLE LATE
    // =========================================================

    const handleToggleLate = (rowId) => {

        setLateEmployees((previous) => {

            if (previous.includes(rowId)) {

                return previous.filter(
                    (id) => id !== rowId
                )

            }

            return [
                ...previous,
                rowId,
            ]

        })

    }


    // =========================================================
    // ATTENDANCE ROWS
    // =========================================================

    const attendanceRows = useMemo(() => {

        if (!Array.isArray(entries)) {
            return []
        }

        return entries
            .filter(
                (entry) =>
                    !selectedDate ||
                    entry?.date === selectedDate
            )
            .map((entry, index) => ({
                ...entry,

                rowId:
                    entry.id ??
                    `${entry.employeeId}-${index}`,

                punchIn:
                    entry.checkIn?.time ||
                    entry.punchIn ||
                    '—',
            }))

    }, [
        entries,
        selectedDate,
    ])


    // =========================================================
    // DISPLAY DATE
    // =========================================================

    const displayDate = useMemo(() => {

        if (!selectedDate) {
            return '—'
        }

        const date =
            new Date(
                `${selectedDate}T00:00:00`
            )

        if (Number.isNaN(date.getTime())) {
            return selectedDate
        }

        return date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )

    }, [
        selectedDate,
    ])


    // =========================================================
    // DOWNLOAD IMAGE
    // =========================================================

    const handleDownloadImage = () => {

        const width = 1000

        const rowHeight = 60

        const headerHeight = 115

        const tableHeaderHeight = 48

        const footerHeight = 55

        const rowsHeight =
            Math.max(
                attendanceRows.length,
                1
            ) *
            rowHeight

        const height =
            headerHeight +
            tableHeaderHeight +
            rowsHeight +
            footerHeight

        const scale = 2


        const canvas =
            document.createElement(
                'canvas'
            )

        canvas.width =
            width * scale

        canvas.height =
            height * scale


        const context =
            canvas.getContext('2d')

        if (!context) {
            return
        }


        context.scale(
            scale,
            scale
        )


        // -------------------------------------------------------
        // BACKGROUND
        // -------------------------------------------------------

        context.fillStyle =
            '#ffffff'

        context.fillRect(
            0,
            0,
            width,
            height
        )


        // -------------------------------------------------------
        // HEADER
        // -------------------------------------------------------

        context.fillStyle =
            '#222222'

        context.font =
            '600 22px Arial'

        context.fillText(
            "Today's Attendance",
            35,
            35
        )


        context.fillStyle =
            '#666666'

        context.font =
            '13px Arial'

        context.fillText(
            displayDate,
            35,
            60
        )


        context.fillStyle =
            '#888888'

        context.font =
            '11px Arial'

        context.fillText(
            'Runamarga Employee Management',
            35,
            82
        )


        // -------------------------------------------------------
        // TABLE HEADER
        // -------------------------------------------------------

        const tableTop =
            headerHeight


        context.fillStyle =
            '#f3f3f3'

        context.fillRect(
            25,
            tableTop,
            width - 50,
            tableHeaderHeight
        )


        context.fillStyle =
            '#555555'

        context.font =
            '600 11px Arial'


        context.fillText(
            'Employee',
            45,
            tableTop + 30
        )


        context.fillText(
            'Employee ID',
            350,
            tableTop + 30
        )


        context.fillText(
            'Punch In',
            520,
            tableTop + 30
        )


        context.fillText(
            'Status',
            670,
            tableTop + 30
        )


        context.fillText(
            'Late',
            850,
            tableTop + 30
        )


        // -------------------------------------------------------
        // EMPTY STATE
        // -------------------------------------------------------

        if (!attendanceRows.length) {

            const y =
                tableTop +
                tableHeaderHeight


            context.strokeStyle =
                '#e5e5e5'

            context.strokeRect(
                25,
                y,
                width - 50,
                rowHeight
            )


            context.fillStyle =
                '#888888'

            context.font =
                '12px Arial'

            context.fillText(
                'No attendance records available for this date.',
                45,
                y + 36
            )

        }


        // -------------------------------------------------------
        // ROWS
        // -------------------------------------------------------

        attendanceRows.forEach(
            (entry, index) => {

                const y =
                    tableTop +
                    tableHeaderHeight +
                    index *
                    rowHeight


                const isLate =
                    lateEmployees.includes(
                        entry.rowId
                    )


                // Row background

                if (isLate) {

                    context.fillStyle =
                        '#fff7ed'

                    context.fillRect(
                        25,
                        y,
                        width - 50,
                        rowHeight
                    )

                }


                // Row border

                context.strokeStyle =
                    '#e5e5e5'

                context.beginPath()

                context.moveTo(
                    25,
                    y
                )

                context.lineTo(
                    width - 25,
                    y
                )

                context.stroke()


                // Employee

                context.fillStyle =
                    '#333333'

                context.font =
                    '600 11px Arial'

                context.fillText(
                    entry.name ||
                    'Unknown',
                    45,
                    y + 25
                )


                if (entry.email) {

                    context.fillStyle =
                        '#888888'

                    context.font =
                        '9px Arial'

                    context.fillText(
                        entry.email,
                        45,
                        y + 42
                    )

                }


                // Employee ID

                context.fillStyle =
                    '#555555'

                context.font =
                    '11px Arial'

                context.fillText(
                    entry.employeeId ||
                    '—',
                    350,
                    y + 32
                )


                // Punch In

                context.fillStyle =
                    '#333333'

                context.fillText(
                    entry.punchIn,
                    520,
                    y + 32
                )


                // Status

                const status =
                    String(
                        entry.status ||
                        ''
                    ).toLowerCase()


                const statusText =
                    status === 'wfh'
                        ? 'WFH'
                        : status === 'late'
                            ? 'Late'
                            : status === 'absent'
                                ? 'Absent'
                                : 'Present'


                context.fillStyle =
                    status === 'absent'
                        ? '#dc2626'
                        : status === 'wfh'
                            ? '#2563eb'
                            : status === 'late'
                                ? '#d97706'
                                : '#6FA800'


                context.font =
                    '600 11px Arial'

                context.fillText(
                    statusText,
                    670,
                    y + 32
                )


                // Late

                context.fillStyle =
                    isLate
                        ? '#d97706'
                        : '#777777'

                context.fillText(
                    isLate
                        ? 'YES'
                        : 'NO',
                    850,
                    y + 32
                )

            }
        )


        // -------------------------------------------------------
        // FOOTER
        // -------------------------------------------------------

        const footerY =
            tableTop +
            tableHeaderHeight +
            Math.max(
                attendanceRows.length,
                1
            ) *
            rowHeight +
            30


        context.fillStyle =
            '#777777'

        context.font =
            '10px Arial'

        context.fillText(
            `Generated: ${displayDate}`,
            35,
            footerY
        )


        context.fillText(
            'Runamarga',
            width - 100,
            footerY
        )


        // -------------------------------------------------------
        // DOWNLOAD
        // -------------------------------------------------------

        const link =
            document.createElement('a')


        link.download =
            `attendance-${selectedDate}.png`


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

        const printWindow =
            window.open(
                '',
                '_blank',
                'width=1000,height=800'
            )


        if (!printWindow) {

            window.print()

            return

        }


        const rowsHtml =
            attendanceRows
                .map(
                    (entry) => {

                        const isLate =
                            lateEmployees.includes(
                                entry.rowId
                            )


                        const status =
                            String(
                                entry.status ||
                                ''
                            ).toLowerCase()


                        const statusText =
                            status === 'wfh'
                                ? 'WFH'
                                : status === 'late'
                                    ? 'Late'
                                    : status === 'absent'
                                        ? 'Absent'
                                        : 'Present'


                        return `
                            <tr
                                class="${isLate ? 'late-row' : ''}"
                            >

                                <td>
                                    <strong>
                                        ${entry.name || 'Unknown'}
                                    </strong>

                                    ${
                                        entry.email
                                            ? `
                                                <div class="secondary">
                                                    ${entry.email}
                                                </div>
                                            `
                                            : ''
                                    }
                                </td>

                                <td>
                                    ${entry.employeeId || '—'}
                                </td>

                                <td>
                                    ${entry.punchIn}
                                </td>

                                <td>
                                    ${statusText}
                                </td>

                                <td
                                    class="${
                                        isLate
                                            ? 'late'
                                            : ''
                                    }"
                                >
                                    ${
                                        isLate
                                            ? 'YES'
                                            : 'NO'
                                    }
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
                    Attendance - ${displayDate}
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
                        padding: 35px;
                        font-family: Arial, sans-serif;
                        color: #222;
                        background: #fff;
                    }

                    h1 {
                        margin: 0;
                        font-size: 22px;
                    }

                    .date {
                        margin-top: 6px;
                        color: #666;
                        font-size: 13px;
                    }

                    .subtitle {
                        margin-top: 4px;
                        color: #888;
                        font-size: 11px;
                    }

                    .table {
                        width: 100%;
                        margin-top: 25px;
                        border-collapse: collapse;
                        border: 1px solid #ddd;
                    }

                    th {
                        padding: 12px;
                        text-align: left;
                        background: #f3f3f3;
                        border-bottom: 1px solid #ddd;
                        font-size: 11px;
                    }

                    td {
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                        font-size: 11px;
                    }

                    tr:last-child td {
                        border-bottom: none;
                    }

                    .secondary {
                        margin-top: 3px;
                        color: #888;
                        font-size: 9px;
                    }

                    .late-row {
                        background: #fff7ed;
                    }

                    .late {
                        color: #d97706;
                        font-weight: 700;
                    }

                    .empty {
                        padding: 30px;
                        text-align: center;
                        color: #888;
                    }

                    .footer {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                        color: #777;
                        font-size: 10px;
                    }

                    @media print {

                        body {
                            padding: 20px;
                        }

                        @page {
                            size: A4 landscape;
                            margin: 12mm;
                        }

                    }

                </style>

            </head>


            <body>

                <h1>
                    Today's Attendance
                </h1>

                <div class="date">
                    ${displayDate}
                </div>

                <div class="subtitle">
                    Runamarga Employee Management
                </div>


                <table class="table">

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
                                Status
                            </th>

                            <th>
                                Late
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            rowsHtml ||
                            `
                                <tr>
                                    <td
                                        colspan="5"
                                        class="empty"
                                    >
                                        No attendance records
                                        available for this date.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>


                <div class="footer">

                    <span>
                        Generated: ${displayDate}
                    </span>

                    <span>
                        Runamarga
                    </span>

                </div>


                <script>

                    window.onload = function () {
                        window.focus()
                        window.print()
                    }

                    window.onafterprint = function () {
                        window.close()
                    }

                </script>

            </body>

            </html>
        `)


        printWindow.document.close()

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {
        onClose?.()
    }


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
                max-h-[90vh]
                w-full
                max-w-4xl
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
                            Today's Attendance
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">
                            Select a date and manage late employees.
                        </p>

                    </div>


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


                {/* =================================================
                    DATE SELECTOR
                ================================================= */}

                <div className="
                    shrink-0
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
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
                                Attendance Date
                            </label>


                            <div className="
                                relative
                                w-full
                                sm:w-56
                            ">

                                <CalendarDaysIcon className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-base-content/40
                                " />


                                <input
                                    type="date"
                                    value={
                                        selectedDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSelectedDate(
                                            event
                                                .target
                                                .value
                                        )
                                    }
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


                        <p className="
                            text-xs
                            text-base-content/45
                        ">
                            {attendanceRows.length}{' '}
                            {
                                attendanceRows.length === 1
                                    ? 'record'
                                    : 'records'
                            }
                        </p>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    p-5
                ">

                    <div className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-base-300
                    ">

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
                                        bg-base-200/40
                                    ">

                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Employee
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Punch In
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Status
                                        </th>


                                        <th className="
                                            w-[110px]
                                            px-4
                                            py-3
                                            text-center
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Mark Late
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {attendanceRows.length ? (

                                        attendanceRows.map(
                                            (entry) => {

                                                const isLate =
                                                    lateEmployees.includes(
                                                        entry.rowId
                                                    )


                                                return (

                                                    <tr
                                                        key={
                                                            entry.rowId
                                                        }
                                                        className={[
                                                            'border-b',
                                                            'border-base-300',
                                                            'last:border-b-0',
                                                            'transition-colors',

                                                            isLate
                                                                ? 'bg-amber-50/60'
                                                                : 'hover:bg-base-200/30',

                                                        ].join(' ')}
                                                    >


                                                        {/* EMPLOYEE */}

                                                        <td className="
                                                            px-4
                                                            py-3.5
                                                        ">

                                                            <p className="
                                                                text-sm
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    entry.name ||
                                                                    'Unknown'
                                                                }
                                                            </p>


                                                            <div className="
                                                                mt-0.5
                                                                flex
                                                                flex-wrap
                                                                gap-x-2
                                                                gap-y-0.5
                                                            ">

                                                                {entry.employeeId && (

                                                                    <span className="
                                                                        font-mono
                                                                        text-[10px]
                                                                        text-base-content/40
                                                                    ">
                                                                        {
                                                                            entry.employeeId
                                                                        }
                                                                    </span>

                                                                )}


                                                                {entry.email && (

                                                                    <span className="
                                                                        text-[10px]
                                                                        text-base-content/40
                                                                    ">
                                                                        {
                                                                            entry.email
                                                                        }
                                                                    </span>

                                                                )}

                                                            </div>

                                                        </td>


                                                        {/* PUNCH IN */}

                                                        <td className="
                                                            whitespace-nowrap
                                                            px-4
                                                            py-3.5
                                                        ">

                                                            <span className="
                                                                text-sm
                                                                font-medium
                                                                text-base-content/80
                                                            ">
                                                                {
                                                                    entry.punchIn
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="
                                                            px-4
                                                            py-3.5
                                                        ">

                                                            <span
                                                                className={[
                                                                    'inline-flex',
                                                                    'rounded-full',
                                                                    'border',
                                                                    'px-2.5',
                                                                    'py-1',
                                                                    'text-[10px]',
                                                                    'font-medium',

                                                                    entry.status === 'absent'
                                                                        ? 'border-red-200 bg-red-50 text-red-600'
                                                                        : entry.status === 'wfh'
                                                                            ? 'border-blue-200 bg-blue-50 text-blue-600'
                                                                            : entry.status === 'late'
                                                                                ? 'border-amber-200 bg-amber-50 text-amber-600'
                                                                                : 'border-[#8BCF00]/30 bg-[#8BCF00]/10 text-[#6FA800]',
                                                                ].join(' ')}
                                                            >

                                                                {
                                                                    entry.status === 'wfh'
                                                                        ? 'WFH'
                                                                        : entry.status === 'late'
                                                                            ? 'Late'
                                                                            : entry.status === 'absent'
                                                                                ? 'Absent'
                                                                                : 'Present'
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* MARK LATE */}

                                                        <td className="
                                                            px-4
                                                            py-3.5
                                                            text-center
                                                        ">

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    isLate
                                                                }
                                                                onChange={() =>
                                                                    handleToggleLate(
                                                                        entry.rowId
                                                                    )
                                                                }
                                                                className="
                                                                    h-4
                                                                    w-4
                                                                    cursor-pointer
                                                                    rounded
                                                                    border-base-300
                                                                    accent-[#8BCF00]
                                                                "
                                                                aria-label={`Mark ${entry.name || 'employee'} as late`}
                                                            />

                                                        </td>

                                                    </tr>

                                                )

                                            }
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan={4}
                                                className="
                                                    px-5
                                                    py-12
                                                    text-center
                                                "
                                            >

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    text-base-content/60
                                                ">
                                                    No attendance records
                                                    available for this date.
                                                </p>

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-base-content/40
                                                ">
                                                    Select another date to
                                                    view attendance.
                                                </p>

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    flex-col
                    gap-2
                    border-t
                    border-base-300
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-end
                ">

                    <button
                        type="button"
                        onClick={
                            handleDownloadImage
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

                        Download Image

                    </button>


                    <button
                        type="button"
                        onClick={
                            handlePrint
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

                        <PrinterIcon className="
                            h-4
                            w-4
                        " />

                        Print / PDF

                    </button>


                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        className="
                            h-10
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}


export default TodayAttendance