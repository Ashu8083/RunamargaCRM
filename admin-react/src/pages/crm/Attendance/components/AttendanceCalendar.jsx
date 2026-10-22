
// admin-react/src/pages/Attendance/components/AttendanceCalendar.jsx

import { useMemo } from 'react'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'

const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// =============================================================
// DATE HELPERS
// =============================================================

const getLocalDateKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const getMonthKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return `${year}-${month}`
}

const formatWorkedHours = (hours) => {
    if (hours === null || hours === undefined || !Number.isFinite(Number(hours))) {
        return '--'
    }

    const totalMinutes = Math.round(Number(hours) * 60)

    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
}

const normalizeStatus = (item) => {
    const status = String(item?.status ?? '').trim().toLowerCase()
    const dayType = String(item?.day_type ?? item?.dayType ?? '').trim().toLowerCase()

    if (status === 'holiday' || dayType === 'holiday') return 'holiday'

    if (
        ['weekly off', 'weekly-off', 'weekend'].includes(status) ||
        ['weekly off', 'weekly-off', 'weekend'].includes(dayType)
    ) {
        return 'weekly-off'
    }

    if (
        ['present', 'full day', 'half day'].includes(status) ||
        ['full day', 'half day'].includes(dayType)
    ) {
        return 'present'
    }

    if (status === 'absent' || dayType === 'absent') return 'absent'

    return null
}

// =============================================================
// COMPONENT
// =============================================================

function AttendanceCalendar({
    onDateSelect,
    attendanceRecords = [],
    dailySummary = [],
    currentMonth = new Date(),
    setCurrentMonth,
    loading = false,
}) {
    const today = new Date()
    const todayKey = getLocalDateKey(today)
    const currentMonthKey = getMonthKey(today)
    const selectedMonthKey = getMonthKey(currentMonth)

    // =============================================================
    // PREPARE DATA FROM THE SHARED PARENT RESPONSE
    // =============================================================

    const attendanceData = useMemo(() => {
        const formatted = {}

        const recordsByDate = new Map()

        ;(Array.isArray(attendanceRecords) ? attendanceRecords : []).forEach(
            (record) => {
                if (record?.date) {
                    recordsByDate.set(String(record.date).slice(0, 10), record)
                }
            }
        )

        ;(Array.isArray(dailySummary) ? dailySummary : []).forEach((item) => {
            if (!item?.date) return

            const dateKey = String(item.date).slice(0, 10)

            if (!dateKey.startsWith(`${selectedMonthKey}-`)) return

            const record = recordsByDate.get(dateKey) || {}
            const status = normalizeStatus(item) || normalizeStatus(record) || 'absent'

            const rawHours = item.worked_hours

            formatted[dateKey] = {
                ...record,
                ...item,
                date: dateKey,
                status,
                dayType:
                    item.day_type ||
                    item.dayType ||
                    (status === 'present'
                        ? Number(rawHours) > 5
                            ? 'Full Day'
                            : 'Half Day'
                        : status === 'holiday'
                            ? 'Holiday'
                            : status === 'weekly-off'
                                ? 'Weekly Off'
                                : 'Absent'),
                workedHours:
                    rawHours !== null &&
                    rawHours !== undefined &&
                    Number.isFinite(Number(rawHours))
                        ? formatWorkedHours(rawHours)
                        : '--',
                check_in: item.check_in ?? record.check_in ?? null,
                check_out: item.check_out ?? record.check_out ?? null,
                check_in_image: record.check_in_image ?? null,
                check_out_image: record.check_out_image ?? null,
                holiday_name: item.holiday_name ?? null,
            }
        })

        // Keep attendance records even if a date is missing from daily_summary.
        recordsByDate.forEach((record, dateKey) => {
            if (!dateKey.startsWith(`${selectedMonthKey}-`)) return
            if (formatted[dateKey]) return

            const status = normalizeStatus(record) ||
                (record.check_in && record.check_out ? 'present' : 'absent')

            formatted[dateKey] = {
                ...record,
                date: dateKey,
                status,
                dayType: status === 'present' ? 'Present' : 'Absent',
                workedHours: '--',
            }
        })

        return formatted
    }, [attendanceRecords, dailySummary, selectedMonthKey])

    // =============================================================
    // CALENDAR DAYS
    // =============================================================

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        return [
            ...Array(firstDay).fill(null),
            ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
        ]
    }, [currentMonth])

    const getDateKey = (day) => {
        if (!day) return null

        const year = currentMonth.getFullYear()
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
        const date = String(day).padStart(2, '0')

        return `${year}-${month}-${date}`
    }

    // =============================================================
    // GET STATUS
    // =============================================================

    const getStatus = (day) => {
        const key = getDateKey(day)

        if (!key || key > todayKey) return null

        // Never mark a day absent while its selected month's request is loading.
        if (loading) return null

        return attendanceData[key]?.status || 'absent'
    }

    const isToday = (day) => (
        Boolean(day) &&
        day === today.getDate() &&
        currentMonth.getMonth() === today.getMonth() &&
        currentMonth.getFullYear() === today.getFullYear()
    )

    // =============================================================
    // MONTH NAVIGATION - PARENT OWNS THE SELECTED MONTH
    // =============================================================

    const goToPreviousMonth = () => {
        setCurrentMonth?.(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        )
    }

    const goToNextMonth = () => {
        const nextMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            1
        )

        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        if (nextMonth <= thisMonth) {
            setCurrentMonth?.(nextMonth)
        }
    }

    const goToCurrentMonth = () => {
        setCurrentMonth?.(
            new Date(today.getFullYear(), today.getMonth(), 1)
        )
    }

    // =============================================================
    // DATE CLICK
    // =============================================================

    const handleDateClick = (day) => {
        if (!day) return

        const dateKey = getDateKey(day)
        const status = getStatus(day)

        if (!status) return

        onDateSelect?.({
            ...(attendanceData[dateKey] || {}),
            date: dateKey,
            status,
        })
    }

    // =============================================================
    // COUNTS
    // =============================================================

    const visibleStatuses = calendarDays
        .filter(Boolean)
        .map(getStatus)

    const presentCount = visibleStatuses.filter(
        (status) => status === 'present'
    ).length

    const absentCount = visibleStatuses.filter(
        (status) => status === 'absent'
    ).length

    // =============================================================
    // LOADING
    // =============================================================

    if (loading) {
        return (
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-3 sm:p-4 md:p-5">
                    <div className="flex items-center justify-center min-h-[300px]">
                        <span className="loading loading-spinner loading-md text-primary" />
                    </div>
                </div>
            </div>
        )
    }

    // =============================================================
    // UI
    // =============================================================

    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <h2 className="text-base sm:text-lg font-semibold">
                            Attendance
                        </h2>
                        <p className="text-[10px] sm:text-xs text-base-content/60 mt-1 truncate">
                            Daily attendance and working hours
                        </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            type="button"
                            onClick={goToCurrentMonth}
                            className="btn btn-xs sm:btn-sm btn-ghost border border-base-300"
                        >
                            <span className="hidden sm:inline">Today</span>
                            <span className="sm:hidden">Now</span>
                        </button>

                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square"
                            aria-label="Previous month"
                        >
                            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square"
                            aria-label="Next month"
                            disabled={selectedMonthKey === currentMonthKey}
                        >
                            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center py-2 sm:py-3">
                    <h3 className="text-sm sm:text-base font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pb-2 sm:pb-4">
                    {[
                        ['bg-success', 'Present'],
                        ['bg-error', 'Absent'],
                        ['bg-info', 'Holiday'],
                        ['bg-base-300', 'Weekly Off / Future'],
                    ].map(([color, label]) => (
                        <div key={label} className="flex items-center gap-1 sm:gap-2">
                            <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${color}`} />
                            <span className="text-[10px] sm:text-xs text-base-content/70">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="text-center text-[9px] min-[400px]:text-[10px] sm:text-xs font-medium text-base-content/50 py-1 sm:py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                    {calendarDays.map((day, index) => {
                        const status = getStatus(day)
                        const todayDate = isToday(day)
                        const dateKey = getDateKey(day)
                        const attendance = dateKey ? attendanceData[dateKey] : null

                        const statusLabel = {
                            present: 'Present',
                            absent: 'Absent',
                            holiday: 'Holiday',
                            'weekly-off': 'Weekly Off',
                        }[status]

                        const statusColor = {
                            present: 'bg-success',
                            absent: 'bg-error',
                            holiday: 'bg-info',
                            'weekly-off': 'bg-base-300',
                        }[status]

                        const cellColor = {
                            present: 'border-success/30 bg-success/5 hover:bg-success/10',
                            absent: 'border-error/40 bg-error/10 hover:bg-error/20',
                            holiday: 'border-info/30 bg-info/5 hover:bg-info/10',
                            'weekly-off': 'border-base-300 bg-base-200/30',
                        }[status]

                        return (
                            <button
                                key={index}
                                type="button"
                                disabled={!day || !status}
                                onClick={() => handleDateClick(day)}
                                aria-label={day ? `${dateKey}: ${statusLabel || 'No data'}` : undefined}
                                className={`
                                    relative w-full min-w-0
                                    h-[58px] min-[400px]:h-[64px]
                                    sm:h-[76px] md:h-[82px] lg:h-[86px]
                                    rounded-md sm:rounded-lg border
                                    transition-all text-left
                                    p-1 sm:p-1.5 md:p-2 overflow-hidden
                                    ${
                                        !day
                                            ? 'border-transparent bg-transparent cursor-default'
                                            : !status
                                                ? 'border-base-300 bg-base-100 cursor-default'
                                                : `${cellColor} cursor-pointer`
                                    }
                                `}
                            >
                                {day && (
                                    <>
                                        <div className="flex items-start justify-between gap-0.5">
                                            <span
                                                className={`
                                                    text-[10px] min-[400px]:text-xs
                                                    sm:text-sm font-medium leading-none
                                                    ${
                                                        todayDate
                                                            ? 'flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-content'
                                                            : 'text-base-content'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </span>

                                            {status && (
                                                <span className={`shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-0.5 ${statusColor}`} />
                                            )}
                                        </div>

                                        {status === 'present' && (
                                            <div className="mt-2 sm:mt-3">
                                                <span className="block text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-success font-medium truncate">
                                                    {attendance?.dayType || 'Present'}
                                                </span>
                                                <p className="text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-base-content/60 mt-0.5 truncate">
                                                    {attendance?.workedHours || '--'}
                                                </p>
                                            </div>
                                        )}

                                        {status === 'absent' && (
                                            <div className="mt-2 sm:mt-3">
                                                <span className="block text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-error font-semibold truncate">
                                                    Absent
                                                </span>
                                            </div>
                                        )}

                                        {status === 'holiday' && (
                                            <div className="mt-2 sm:mt-3">
                                                <span className="block text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-info font-medium truncate">
                                                    Holiday
                                                </span>
                                                {attendance?.holiday_name && (
                                                    <p className="text-[8px] sm:text-[10px] text-base-content/60 mt-0.5 truncate">
                                                        {attendance.holiday_name}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {status === 'weekly-off' && (
                                            <div className="mt-2 sm:mt-3">
                                                <span className="block text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-base-content/50 font-medium truncate">
                                                    Weekly Off
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </button>
                        )
                    })}
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-300">
                    <p className="text-[9px] sm:text-xs text-base-content/50 truncate">
                        Click a date for details
                    </p>

                    <div className="flex items-center gap-3 text-[9px] sm:text-xs whitespace-nowrap">
                        <span className="text-success">{presentCount} present</span>
                        <span className="text-error">{absentCount} absent</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendanceCalendar
