// admin-react/src/pages/EmployeeManagement/Attendance/components/AttendanceHistoryModal.jsx

import React, {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    createPortal,
} from 'react-dom'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PrinterIcon from '@heroicons/react/24/outline/PrinterIcon'


// ============================================================================
// DATE FORMAT
// ============================================================================

const formatDate = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return '—'
    }


    if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

        const [
            year,
            month,
            day,
        ] = value.split('-')


        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )


        return date.toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )
    }


    const date = new Date(value)


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value)
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
// STATUS
// ============================================================================

const getStatus = (item) => {

    if (
        item?.checkIn?.time
    ) {
        return 'Present'
    }


    if (
        String(
            item?.status || ''
        )
            .trim()
            .toLowerCase() === 'present'
    ) {
        return 'Present'
    }


    return 'Absent'
}


// ============================================================================
// STATUS CLASS
// ============================================================================

const getStatusClass = (status) => {

    if (
        status === 'Present'
    ) {

        return `
            border-green-200
            bg-green-50
            text-green-700
        `
    }


    return `
        border-red-200
        bg-red-50
        text-red-700
    `
}


// ============================================================================
// MONTH LABEL
// ============================================================================

const getMonthLabel = (month) => {

    if (
        !month ||
        !/^\d{4}-\d{2}$/.test(
            String(month)
        )
    ) {
        return String(
            month || ''
        )
    }


    const [
        year,
        monthNumber,
    ] = String(month).split('-')


    const date = new Date(
        Number(year),
        Number(monthNumber) - 1,
        1
    )


    return date.toLocaleDateString(
        'en-IN',
        {
            month: 'long',
            year: 'numeric',
        }
    )
}


// ============================================================================
// GET MONTH FROM DATE
// ============================================================================

const getMonthFromDate = (value) => {

    if (!value) {
        return ''
    }


    const stringValue =
        String(value)


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            stringValue
        )
    ) {

        return stringValue.slice(
            0,
            7
        )
    }


    return ''
}


// ============================================================================
// GET MONTHS FROM HISTORY
// ============================================================================

const getAvailableMonths = (
    history
) => {

    if (
        !Array.isArray(history)
    ) {
        return []
    }


    const months = history
        .map(
            (item) => {

                if (
                    item?.month &&
                    /^\d{4}-\d{2}$/.test(
                        String(item.month)
                    )
                ) {

                    return String(
                        item.month
                    )
                }


                return getMonthFromDate(
                    item?.date
                )
            }
        )
        .filter(Boolean)


    return [
        ...new Set(months),
    ].sort(
        (a, b) =>
            b.localeCompare(a)
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
                text-gray-400
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
            className="
                text-xs
                font-medium
                text-blue-600
                underline
                underline-offset-2
                hover:text-blue-800
            "
            onClick={(event) => {
                event.stopPropagation()
            }}
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
            min-w-[120px]
            flex-col
            gap-1
        ">

            <div className="
                flex
                items-center
                gap-1.5
            ">

                <span className="
                    text-xs
                    text-gray-500
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
            ">

                <span className="
                    text-xs
                    text-gray-500
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
// COMPONENT
// ============================================================================

function AttendanceHistoryModal({
    open = false,
    entry = null,
    history = [],
    onClose,
}) {

    // =========================================================================
    // SELECTED MONTH
    // =========================================================================

    const [
        selectedMonth,
        setSelectedMonth,
    ] = useState('')


    // =========================================================================
    // AVAILABLE MONTHS
    // =========================================================================

    const availableMonths =
        useMemo(
            () =>
                getAvailableMonths(
                    history
                ),
            [
                history,
            ]
        )


    // =========================================================================
    // SET DEFAULT MONTH
    // =========================================================================

    useEffect(() => {

        if (
            availableMonths.length === 0
        ) {

            setSelectedMonth('')

            return
        }


        setSelectedMonth(
            (currentMonth) => {

                if (
                    currentMonth &&
                    availableMonths.includes(
                        currentMonth
                    )
                ) {

                    return currentMonth
                }


                return availableMonths[0]
            }
        )

    }, [
        availableMonths,
    ])


    // =========================================================================
    // FILTERED HISTORY
    // =========================================================================

    const monthlyHistory =
        useMemo(() => {

            if (
                !Array.isArray(history)
            ) {
                return []
            }


            if (
                !selectedMonth
            ) {
                return history
            }


            return history.filter(
                (item) => {

                    const itemMonth =
                        (
                            item?.month &&
                            /^\d{4}-\d{2}$/.test(
                                String(
                                    item.month
                                )
                            )
                        )
                            ? String(
                                item.month
                            )
                            : getMonthFromDate(
                                item?.date
                            )


                    return (
                        itemMonth ===
                        selectedMonth
                    )
                }
            )

        }, [
            history,
            selectedMonth,
        ])


    // =========================================================================
    // SUMMARY
    // =========================================================================

    const summary =
        useMemo(() => {

            const present =
                monthlyHistory.filter(
                    (item) =>
                        getStatus(item) ===
                        'Present'
                ).length


            const absent =
                monthlyHistory.filter(
                    (item) =>
                        getStatus(item) ===
                        'Absent'
                ).length


            return {
                present,
                absent,
                total:
                    monthlyHistory.length,
            }

        }, [
            monthlyHistory,
        ])


    // =========================================================================
    // EMPLOYEE
    // =========================================================================

    const employee =
        entry || {}


    // =========================================================================
    // CURRENT STATUS
    // =========================================================================

    const currentStatus =
        getStatus(
            employee
        )


    // =========================================================================
    // CURRENT CHECK IN
    // =========================================================================

    const currentCheckIn =
        employee?.checkIn?.time ||
        employee?.punchIn ||
        '—'


    // =========================================================================
    // CURRENT CHECK OUT
    // =========================================================================

    const currentCheckOut =
        employee?.checkOut?.time ||
        employee?.punchOut ||
        '—'


    // =========================================================================
    // CLOSE
    // =========================================================================

    const handleClose = () => {

        if (
            typeof onClose ===
            'function'
        ) {
            onClose()
        }

    }


    // =========================================================================
    // PRINT MODAL
    // =========================================================================

    const handlePrint = () => {

        const printWindow =
            window.open(
                '',
                '_blank',
                'width=1200,height=900'
            )


        if (!printWindow) {

            window.alert(
                'Please allow pop-ups for this site to print attendance history.'
            )

            return
        }


        // ---------------------------------------------------------------------
        // BUILD PRINTABLE ROWS
        // ---------------------------------------------------------------------

        const tableRows =
            monthlyHistory
                .map(
                    (item) => {

                        const status =
                            getStatus(item)


                        const statusClass =
                            status === 'Present'
                                ? 'status-present'
                                : 'status-absent'


                        const punchInImage =
                            item?.checkIn?.image ||
                            null


                        const punchOutImage =
                            item?.checkOut?.image ||
                            null


                        const imageHtml = `

                            <div class="image-cell">

                                <div>
                                    Punch In:
                                    ${
                                        punchInImage
                                            ? `<a href="${punchInImage}" target="_blank">View</a>`
                                            : '—'
                                    }
                                </div>

                                <div>
                                    Punch Out:
                                    ${
                                        punchOutImage
                                            ? `<a href="${punchOutImage}" target="_blank">View</a>`
                                            : '—'
                                    }
                                </div>

                            </div>

                        `


                        return `

                            <tr>

                                <td>
                                    ${formatDate(
                                        item?.date
                                    )}
                                </td>


                                <td>
                                    ${
                                        item?.checkIn?.time ||
                                        '—'
                                    }
                                </td>


                                <td>
                                    ${
                                        item?.checkOut?.time ||
                                        '—'
                                    }
                                </td>


                                <td>
                                    ${imageHtml}
                                </td>


                                <td>

                                    <span class="${statusClass}">
                                        ${status}
                                    </span>

                                </td>

                            </tr>

                        `
                    }
                )
                .join('')


        // ---------------------------------------------------------------------
        // EMPLOYEE INFORMATION
        // ---------------------------------------------------------------------

        const employeeName =
            employee?.name ||
            'Employee'


        const employeeId =
            employee?.employeeId
                ? `ID: ${employee.employeeId}`
                : ''


        const monthLabel =
            selectedMonth
                ? getMonthLabel(
                    selectedMonth
                )
                : 'All Months'


        // ---------------------------------------------------------------------
        // PRINT WINDOW
        // ---------------------------------------------------------------------

        printWindow.document.open()


        printWindow.document.write(
            `

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8" />

                <title>
                    ${employeeName} - Attendance History
                </title>


                <style>

                    * {
                        box-sizing: border-box;
                    }


                    body {
                        margin: 0;
                        padding: 32px;
                        background: #ffffff;
                        color: #111827;
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                        font-size: 13px;
                    }


                    .print-container {
                        width: 100%;
                        max-width: 1100px;
                        margin: 0 auto;
                    }


                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #111827;
                        padding-bottom: 16px;
                        margin-bottom: 20px;
                    }


                    .title {
                        margin: 0;
                        font-size: 24px;
                        font-weight: 700;
                        color: #111827;
                    }


                    .employee-name {
                        margin-top: 6px;
                        font-size: 14px;
                        color: #4b5563;
                    }


                    .generated {
                        text-align: right;
                        font-size: 11px;
                        color: #6b7280;
                    }


                    .section-title {
                        margin: 0 0 10px 0;
                        font-size: 15px;
                        font-weight: 700;
                        color: #111827;
                    }


                    .current-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                3,
                                minmax(0, 1fr)
                            );
                        gap: 12px;
                        margin-bottom: 22px;
                    }


                    .summary-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                3,
                                minmax(0, 1fr)
                            );
                        gap: 12px;
                        margin-bottom: 22px;
                    }


                    .info-card {
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        padding: 14px;
                        background: #f9fafb;
                    }


                    .info-label {
                        font-size: 11px;
                        font-weight: 600;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 0.04em;
                    }


                    .info-value {
                        margin-top: 7px;
                        font-size: 16px;
                        font-weight: 700;
                        color: #111827;
                    }


                    .status-present {
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 999px;
                        background: #dcfce7;
                        color: #15803d;
                        font-size: 11px;
                        font-weight: 600;
                    }


                    .status-absent {
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 999px;
                        background: #fee2e2;
                        color: #b91c1c;
                        font-size: 11px;
                        font-weight: 600;
                    }


                    .month-section {
                        margin-bottom: 14px;
                    }


                    .month-label {
                        font-size: 13px;
                        color: #4b5563;
                    }


                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }


                    th {
                        padding: 11px 12px;
                        border: 1px solid #d1d5db;
                        background: #f3f4f6;
                        text-align: left;
                        font-size: 11px;
                        font-weight: 700;
                        color: #374151;
                        text-transform: uppercase;
                    }


                    td {
                        padding: 11px 12px;
                        border: 1px solid #e5e7eb;
                        font-size: 12px;
                        color: #374151;
                    }


                    tr {
                        page-break-inside: avoid;
                    }


                    .image-cell {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }


                    .image-cell a {
                        color: #2563eb;
                        text-decoration: underline;
                    }


                    .empty {
                        padding: 30px;
                        text-align: center;
                        border: 1px solid #d1d5db;
                        color: #6b7280;
                    }


                    .footer {
                        margin-top: 24px;
                        padding-top: 12px;
                        border-top: 1px solid #d1d5db;
                        font-size: 10px;
                        color: #6b7280;
                        text-align: center;
                    }


                    @page {
                        size: A4;
                        margin: 14mm;
                    }


                    @media print {

                        body {
                            padding: 0;
                        }


                        .print-container {
                            max-width: none;
                        }

                    }

                </style>

            </head>


            <body>

                <div class="print-container">


                    <!-- =====================================================
                        HEADER
                    ====================================================== -->

                    <div class="header">

                        <div>

                            <h1 class="title">
                                Attendance History
                            </h1>


                            <div class="employee-name">

                                ${employeeName}

                                ${
                                    employeeId
                                        ? ` &nbsp; ${employeeId}`
                                        : ''
                                }

                            </div>

                        </div>


                        <div class="generated">

                            Printed on<br />

                            ${new Date().toLocaleString(
                                'en-IN'
                            )}

                        </div>

                    </div>


                    <!-- =====================================================
                        CURRENT ATTENDANCE
                    ====================================================== -->

                    <h2 class="section-title">
                        Current Attendance
                    </h2>


                    <div class="current-grid">


                        <div class="info-card">

                            <div class="info-label">
                                Current Status
                            </div>


                            <div class="info-value">

                                <span class="${
                                    currentStatus === 'Present'
                                        ? 'status-present'
                                        : 'status-absent'
                                }">

                                    ${currentStatus}

                                </span>

                            </div>

                        </div>


                        <div class="info-card">

                            <div class="info-label">
                                Punch In
                            </div>


                            <div class="info-value">
                                ${currentCheckIn}
                            </div>

                        </div>


                        <div class="info-card">

                            <div class="info-label">
                                Punch Out
                            </div>


                            <div class="info-value">
                                ${currentCheckOut}
                            </div>

                        </div>


                    </div>


                    <!-- =====================================================
                        SELECTED MONTH
                    ====================================================== -->

                    <div class="month-section">

                        <h2 class="section-title">
                            Attendance History
                        </h2>


                        <div class="month-label">

                            Selected Month:

                            <strong>
                                ${monthLabel}
                            </strong>

                        </div>

                    </div>


                    <!-- =====================================================
                        SUMMARY
                    ====================================================== -->

                    <div class="summary-grid">


                        <div class="info-card">

                            <div class="info-label">
                                Present
                            </div>


                            <div class="info-value">
                                ${summary.present}
                            </div>

                        </div>


                        <div class="info-card">

                            <div class="info-label">
                                Absent
                            </div>


                            <div class="info-value">
                                ${summary.absent}
                            </div>

                        </div>


                        <div class="info-card">

                            <div class="info-label">
                                Total Days
                            </div>


                            <div class="info-value">
                                ${summary.total}
                            </div>

                        </div>


                    </div>


                    <!-- =====================================================
                        DAILY DETAILS
                    ====================================================== -->

                    <h2 class="section-title">
                        Daily Details
                    </h2>


                    ${
                        monthlyHistory.length > 0
                            ? `

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Date
                                            </th>


                                            <th>
                                                Punch In
                                            </th>


                                            <th>
                                                Punch Out
                                            </th>


                                            <th>
                                                Image
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

                            `
                            : `

                                <div class="empty">

                                    No attendance records
                                    found for this month.

                                </div>

                            `
                    }


                    <!-- =====================================================
                        FOOTER
                    ====================================================== -->

                    <div class="footer">
                        Attendance History Report
                    </div>


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

            `
        )


        printWindow.document.close()

    }


    // =========================================================================
    // ESCAPE KEY
    // =========================================================================

    useEffect(() => {

        if (!open) {
            return undefined
        }


        const handleKeyDown =
            (event) => {

                if (
                    event.key ===
                    'Escape'
                ) {
                    handleClose()
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
    ])


    // =========================================================================
    // CLOSED
    // =========================================================================

    if (!open) {
        return null
    }


    // =========================================================================
    // MODAL
    // =========================================================================

    const modal = (

        <div
            className="
                fixed
                inset-0
                z-[99999]
                flex
                h-screen
                w-screen
                items-center
                justify-center
                bg-black/50
                p-3
                sm:p-5
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-history-title"
            onMouseDown={(
                event
            ) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose()
                }

            }}
        >

            {/* ================================================================
                MODAL CONTAINER
            ================================================================ */}

            <div
                className="
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-xl
                    bg-white
                    shadow-2xl
                "
                onMouseDown={(
                    event
                ) => {

                    event.stopPropagation()

                }}
            >

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        px-5
                        py-4
                        sm:px-6
                    "
                >

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <h2
                            id="attendance-history-title"
                            className="
                                truncate
                                text-lg
                                font-semibold
                                text-gray-900
                            "
                        >
                            Attendance History
                        </h2>


                        <div
                            className="
                                mt-1
                                flex
                                flex-wrap
                                items-center
                                gap-x-2
                                gap-y-0.5
                                text-xs
                                text-gray-500
                            "
                        >

                            <span>
                                {
                                    employee?.name ||
                                    'Employee'
                                }
                            </span>


                            {employee?.employeeId && (

                                <>

                                    <span>
                                        •
                                    </span>


                                    <span>
                                        ID:{' '}
                                        {
                                            employee.employeeId
                                        }
                                    </span>

                                </>

                            )}

                        </div>

                    </div>


                    {/* ========================================================
                        HEADER ACTIONS
                    ======================================================== */}

                    <div
                        className="
                            ml-4
                            flex
                            shrink-0
                            items-center
                            gap-2
                        "
                    >

                        {/* ====================================================
                            PRINT BUTTON
                        ==================================================== */}

                        <button
                            type="button"
                            onClick={
                                handlePrint
                            }
                            className="
                                flex
                                h-9
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:bg-gray-100
                                hover:text-gray-800
                            "
                            title="Print attendance history"
                        >

                            <PrinterIcon
                                className="
                                    h-4
                                    w-4
                                "
                            />


                            <span className="
                                hidden
                                sm:inline
                            ">
                                Print
                            </span>

                        </button>


                        {/* ====================================================
                            CLOSE BUTTON
                        ==================================================== */}

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                text-gray-500
                                transition
                                hover:bg-gray-100
                                hover:text-gray-700
                            "
                            aria-label="Close attendance history"
                            title="Close"
                        >

                            <XMarkIcon
                                className="
                                    h-5
                                    w-5
                                "
                            />

                        </button>

                    </div>

                </div>


                {/* ============================================================
                    CONTENT
                ============================================================ */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-5
                        sm:px-6
                    "
                >

                    {/* ========================================================
                        CURRENT ATTENDANCE
                    ======================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-3
                        "
                    >

                        {/* ====================================================
                            STATUS
                        ==================================================== */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-gray-200
                                bg-gray-50
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-gray-500
                                "
                            >
                                Current Status
                            </p>


                            <div
                                className="
                                    mt-2
                                "
                            >

                                <span
                                    className={`
                                        inline-flex
                                        rounded-full
                                        border
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        ${getStatusClass(
                                            currentStatus
                                        )}
                                    `}
                                >
                                    {
                                        currentStatus
                                    }
                                </span>

                            </div>

                        </div>


                        {/* ====================================================
                            PUNCH IN
                        ==================================================== */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-gray-200
                                bg-gray-50
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-gray-500
                                "
                            >
                                Punch In
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {
                                    currentCheckIn
                                }
                            </p>

                        </div>


                        {/* ====================================================
                            PUNCH OUT
                        ==================================================== */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-gray-200
                                bg-gray-50
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    text-gray-500
                                "
                            >
                                Punch Out
                            </p>


                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {
                                    currentCheckOut
                                }
                            </p>

                        </div>

                    </div>


                    {/* ========================================================
                        MONTH FILTER
                    ======================================================== */}

                    {availableMonths.length > 0 && (

                        <div
                            className="
                                mt-5
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-gray-900
                                    "
                                >
                                    Attendance History
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Daily attendance records
                                </p>

                            </div>


                            <div>

                                <label
                                    htmlFor="attendance-history-month"
                                    className="
                                        sr-only
                                    "
                                >
                                    Attendance Month
                                </label>


                                <select
                                    id="attendance-history-month"
                                    value={
                                        selectedMonth
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSelectedMonth(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        h-10
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-white
                                        px-3
                                        text-sm
                                        text-gray-700
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-1
                                        focus:ring-blue-500
                                        sm:w-[210px]
                                    "
                                >

                                    {availableMonths.map(
                                        (month) => (

                                            <option
                                                key={
                                                    month
                                                }
                                                value={
                                                    month
                                                }
                                            >
                                                {
                                                    getMonthLabel(
                                                        month
                                                    )
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    )}


                    {/* ========================================================
                        SUMMARY
                    ======================================================== */}

                    <div
                        className="
                            mt-4
                            grid
                            grid-cols-3
                            gap-3
                        "
                    >

                        <div
                            className="
                                rounded-lg
                                bg-green-50
                                p-3
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-green-600
                                "
                            >
                                Present
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xl
                                    font-semibold
                                    text-green-700
                                "
                            >
                                {
                                    summary.present
                                }
                            </p>

                        </div>


                        <div
                            className="
                                rounded-lg
                                bg-red-50
                                p-3
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-red-600
                                "
                            >
                                Absent
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xl
                                    font-semibold
                                    text-red-700
                                "
                            >
                                {
                                    summary.absent
                                }
                            </p>

                        </div>


                        <div
                            className="
                                rounded-lg
                                bg-gray-50
                                p-3
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Total Days
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xl
                                    font-semibold
                                    text-gray-700
                                "
                            >
                                {
                                    summary.total
                                }
                            </p>

                        </div>

                    </div>


                    {/* ========================================================
                        DAILY TABLE
                    ======================================================== */}

                    <div
                        className="
                            mt-5
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-200
                        "
                    >

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    min-w-[720px]
                                    divide-y
                                    divide-gray-200
                                "
                            >

                                {/* ==================================================
                                    TABLE HEADER
                                ================================================== */}

                                <thead
                                    className="
                                        bg-gray-50
                                    "
                                >

                                    <tr>

                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-3
                                                text-left
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-gray-500
                                            "
                                        >
                                            Date
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-3
                                                text-left
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-gray-500
                                            "
                                        >
                                            Punch In
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-3
                                                text-left
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-gray-500
                                            "
                                        >
                                            Punch Out
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-3
                                                text-left
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-gray-500
                                            "
                                        >
                                            Image
                                        </th>


                                        <th
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-3
                                                text-left
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wider
                                                text-gray-500
                                            "
                                        >
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                {/* ==================================================
                                    TABLE BODY
                                ================================================== */}

                                <tbody
                                    className="
                                        divide-y
                                        divide-gray-200
                                        bg-white
                                    "
                                >

                                    {monthlyHistory.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan={5}
                                                className="
                                                    px-4
                                                    py-10
                                                    text-center
                                                    text-sm
                                                    text-gray-500
                                                "
                                            >
                                                No attendance records
                                                found for this month.
                                            </td>

                                        </tr>

                                    ) : (

                                        monthlyHistory.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const status =
                                                    getStatus(
                                                        item
                                                    )


                                                return (

                                                    <tr
                                                        key={
                                                            item?.id ??
                                                            `${item?.date}-${index}`
                                                        }
                                                        className="
                                                            hover:bg-gray-50
                                                        "
                                                    >

                                                        {/* ==========================================
                                                            DATE
                                                        ========================================== */}

                                                        <td
                                                            className="
                                                                whitespace-nowrap
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                text-gray-700
                                                            "
                                                        >
                                                            {
                                                                formatDate(
                                                                    item?.date
                                                                )
                                                            }
                                                        </td>


                                                        {/* ==========================================
                                                            PUNCH IN
                                                        ========================================== */}

                                                        <td
                                                            className="
                                                                whitespace-nowrap
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                font-medium
                                                                text-gray-700
                                                            "
                                                        >
                                                            {
                                                                item?.checkIn?.time ||
                                                                '—'
                                                            }
                                                        </td>


                                                        {/* ==========================================
                                                            PUNCH OUT
                                                        ========================================== */}

                                                        <td
                                                            className="
                                                                whitespace-nowrap
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                font-medium
                                                                text-gray-700
                                                            "
                                                        >
                                                            {
                                                                item?.checkOut?.time ||
                                                                '—'
                                                            }
                                                        </td>


                                                        {/* ==========================================
                                                            IMAGE
                                                        ========================================== */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-3
                                                            "
                                                        >

                                                            <AttendanceImageCell
                                                                checkIn={
                                                                    item?.checkIn
                                                                }
                                                                checkOut={
                                                                    item?.checkOut
                                                                }
                                                            />

                                                        </td>


                                                        {/* ==========================================
                                                            STATUS
                                                        ========================================== */}

                                                        <td
                                                            className="
                                                                whitespace-nowrap
                                                                px-4
                                                                py-3
                                                            "
                                                        >

                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    rounded-full
                                                                    border
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    ${getStatusClass(
                                                                        status
                                                                    )}
                                                                `}
                                                            >
                                                                {
                                                                    status
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

                    </div>

                </div>


                {/* ============================================================
                    FOOTER
                ============================================================ */}

                <div
                    className="
                        flex
                        shrink-0
                        justify-end
                        border-t
                        border-gray-200
                        px-5
                        py-3
                        sm:px-6
                    "
                >

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-50
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )


    // =========================================================================
    // PORTAL
    // =========================================================================

    return createPortal(
        modal,
        document.body
    )
}


export default AttendanceHistoryModal