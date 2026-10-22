
// admin-react/src/pages/Attendance/components/AttendanceSummary.jsx

import { useMemo } from 'react'

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'

// =============================================================
// DATE HELPERS
// =============================================================

const getMonthKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return `${year}-${month}`
}

const getDateKey = (value) => String(value || '').slice(0, 10)

const formatHours = (minutes) => {
    const totalMinutes = Math.max(0, Math.round(minutes || 0))

    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
}

// =============================================================
// NORMALIZE DAILY STATUS
// =============================================================

const getDayStatus = (item) => {
    const status = String(item?.status || '').trim().toLowerCase()
    const dayType = String(item?.day_type || '').trim().toLowerCase()

    if (status === 'holiday' || dayType === 'holiday') {
        return 'holiday'
    }

    if (
        status === 'weekly off' ||
        status === 'weekly-off' ||
        dayType === 'weekly off' ||
        dayType === 'weekly-off'
    ) {
        return 'weekly-off'
    }

    if (
        status === 'present' ||
        status === 'full day' ||
        dayType === 'full day' ||
        dayType === 'half day' ||
        status === 'half day'
    ) {
        return dayType === 'half day' || status === 'half day'
            ? 'half-day'
            : 'present'
    }

    if (status === 'absent' || dayType === 'absent') {
        return 'absent'
    }

    return 'unknown'
}

// =============================================================
// COMPONENT
// =============================================================

function AttendanceSummary({
    attendanceRecords = [],
    monthlySummary = null,
    currentMonth = new Date(),
    dailySummary = [],
    loading = false,
}) {
    const selectedMonthKey = getMonthKey(currentMonth)

    // =============================================================
    // FILTER DATA TO THE SELECTED MONTH
    // =============================================================

    const selectedDailySummary = useMemo(() => {
        return (Array.isArray(dailySummary) ? dailySummary : []).filter(
            (item) => getDateKey(item?.date).startsWith(`${selectedMonthKey}-`)
        )
    }, [dailySummary, selectedMonthKey])

    const selectedMonthRecords = useMemo(() => {
        return (Array.isArray(attendanceRecords) ? attendanceRecords : []).filter(
            (record) =>
                getDateKey(record?.date).startsWith(`${selectedMonthKey}-`)
        )
    }, [attendanceRecords, selectedMonthKey])

    // =============================================================
    // USE BACKEND SUMMARY ONLY IF IT MATCHES THE SELECTED MONTH
    // =============================================================

    const validMonthlySummary =
        monthlySummary &&
        (
            !monthlySummary.month ||
            monthlySummary.month === selectedMonthKey
        )

    // =============================================================
    // FALLBACK SUMMARY
    // Only calculate from data actually returned for this month.
    // Do not assume missing dates are absent.
    // =============================================================

    const fallbackSummary = useMemo(() => {
        const dailyByDate = new Map()

        selectedDailySummary.forEach((item) => {
            dailyByDate.set(getDateKey(item.date), item)
        })

        const recordsByDate = new Map()

        selectedMonthRecords.forEach((record) => {
            recordsByDate.set(getDateKey(record.date), record)
        })

        const dates = new Set([
            ...dailyByDate.keys(),
            ...recordsByDate.keys(),
        ])

        let presentDays = 0
        let halfDays = 0
        let absentDays = 0
        let workingDays = 0
        let totalWorkedMinutes = 0

        dates.forEach((dateKey) => {
            const dailyItem = dailyByDate.get(dateKey)
            const record = recordsByDate.get(dateKey)

            const status = getDayStatus(dailyItem)

            if (status === 'holiday' || status === 'weekly-off') {
                return
            }

            // If the daily summary is present, trust its classification.
            if (dailyItem) {
                if (status === 'present') {
                    presentDays++
                } else if (status === 'half-day') {
                    halfDays++
                } else if (status === 'absent') {
                    absentDays++
                } else {
                    return
                }

                const workedHours = Number(dailyItem.worked_hours ?? 0)

                if (Number.isFinite(workedHours) && workedHours > 0) {
                    totalWorkedMinutes += Math.round(workedHours * 60)
                }

                workingDays++
                return
            }

            // Fallback to attendance records when no daily summary exists.
            if (record) {
                const hasCheckIn = Boolean(record.check_in)
                const hasCheckOut = Boolean(record.check_out)

                if (hasCheckIn && hasCheckOut) {
                    const checkIn = new Date(record.check_in)
                    const checkOut = new Date(record.check_out)

                    let minutes = Math.floor(
                        (checkOut.getTime() - checkIn.getTime()) / 60000
                    )

                    if (record.lunch_out && record.lunch_in) {
                        const lunchOut = new Date(record.lunch_out)
                        const lunchIn = new Date(record.lunch_in)
                        const lunchMinutes = Math.floor(
                            (lunchIn.getTime() - lunchOut.getTime()) / 60000
                        )

                        if (lunchMinutes > 0) {
                            minutes -= lunchMinutes
                        }
                    }

                    if (Number.isFinite(minutes) && minutes > 0) {
                        presentDays++
                        totalWorkedMinutes += minutes
                    } else {
                        absentDays++
                    }
                } else {
                    absentDays++
                }

                workingDays++
            }
        })

        const averageMinutes =
            workingDays > 0
                ? Math.round(totalWorkedMinutes / workingDays)
                : 0

        return {
            month: selectedMonthKey,
            present_days: presentDays,
            half_days: halfDays,
            absent_days: absentDays,
            working_days: workingDays,
            total_worked_hours: totalWorkedMinutes / 60,
            average_hours: averageMinutes / 60,
            average_hours_formatted: formatHours(averageMinutes),
        }
    }, [
        selectedDailySummary,
        selectedMonthRecords,
        selectedMonthKey,
    ])

    const summaryData = validMonthlySummary
        ? monthlySummary
        : fallbackSummary

    // =============================================================
    // SUMMARY CARDS
    // =============================================================

    const summary = [
        {
            label: 'Present Days',
            value: Number(summaryData.present_days ?? 0),
            description: 'Selected month',
            icon: CheckCircleIcon,
            iconClass: 'text-success',
            iconBg: 'bg-success/10',
        },
        {
            label: 'Absent Days',
            value: Number(summaryData.absent_days ?? 0),
            description: 'Selected month',
            icon: XCircleIcon,
            iconClass: 'text-error',
            iconBg: 'bg-error/10',
        },
        {
            label: 'Working Days',
            value: Number(summaryData.working_days ?? 0),
            description: 'Selected month',
            icon: CalendarDaysIcon,
            iconClass: 'text-primary',
            iconBg: 'bg-primary/10',
        },
        {
            label: 'Average Hours',
            value:
                summaryData.average_hours_formatted ??
                formatHours(Number(summaryData.average_hours ?? 0) * 60),
            description: 'Per working day',
            icon: ClockIcon,
            iconClass: 'text-info',
            iconBg: 'bg-info/10',
        },
    ]

    // =============================================================
    // LOADING
    // =============================================================

    if (loading) {
        return (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {summary.map((item) => (
                    <div
                        key={item.label}
                        className="card bg-base-100 border border-base-300 shadow-sm"
                    >
                        <div className="card-body p-4">
                            <div className="animate-pulse">
                                <div className="h-3 bg-base-300 rounded w-20" />
                                <div className="h-7 bg-base-300 rounded w-12 mt-2" />
                                <div className="h-2 bg-base-300 rounded w-16 mt-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // =============================================================
    // UI
    // =============================================================

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {summary.map((item) => {
                const Icon = item.icon

                return (
                    <div
                        key={item.label}
                        className="card bg-base-100 border border-base-300 shadow-sm"
                    >
                        <div className="card-body p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-base-content/60">
                                        {item.label}
                                    </p>

                                    <p className="text-xl sm:text-2xl font-semibold mt-1">
                                        {item.value}
                                    </p>

                                    <p className="text-[11px] text-base-content/50 mt-1">
                                        {item.description}
                                    </p>
                                </div>

                                <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${item.iconClass}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AttendanceSummary
