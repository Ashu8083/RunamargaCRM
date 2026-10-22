
// admin-react/src/pages/Attendance/components/AttendanceDetailsModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'

import { getDefaultProfileImage } from '../../../../constants/assets'

// =============================================================
// FORMAT TIME
// =============================================================

const formatTime = (value) => {
    if (!value) return '--'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return '--'

    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

const normalizeStatus = (status) => {
    const value = String(status || '').trim().toLowerCase()

    if (value === 'present' || value === 'full day') return 'present'
    if (value === 'half day') return 'half-day'
    if (value === 'holiday') return 'holiday'
    if (
        value === 'weekly off' ||
        value === 'weekly-off' ||
        value === 'weekend'
    ) {
        return 'weekly-off'
    }

    return 'absent'
}

// =============================================================
// COMPONENT
// =============================================================

function AttendanceDetailsModal({ attendance, onClose }) {
    if (!attendance) return null

    const status = normalizeStatus(attendance.status)

    const isPresent = status === 'present' || status === 'half-day'
    const isNonWorkingDay =
        status === 'holiday' || status === 'weekly-off'

    const statusLabels = {
        present: 'Full Day',
        'half-day': 'Half Day',
        absent: 'Absent',
        holiday: 'Holiday',
        'weekly-off': 'Weekly Off',
    }

    const profileImage =
        attendance.profileImage ||
        attendance.profile_image ||
        getDefaultProfileImage(attendance.gender)

    const dateValue = attendance.date
        ? new Date(`${attendance.date}T00:00:00`)
        : null

    const formattedDate =
        dateValue && !Number.isNaN(dateValue.getTime())
            ? dateValue.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
              })
            : 'Date unavailable'

    const checkInTime = formatTime(attendance.check_in)
    const checkOutTime = formatTime(attendance.check_out)

    const workedHours =
        attendance.workedHours ??
        attendance.worked_hours_formatted ??
        attendance.worked_hours

    const statusColor = {
        present: 'text-success',
        'half-day': 'text-warning',
        absent: 'text-error',
        holiday: 'text-info',
        'weekly-off': 'text-base-content/60',
    }[status]

    const statusDotColor = {
        present: 'bg-success',
        'half-day': 'bg-warning',
        absent: 'bg-error',
        holiday: 'bg-info',
        'weekly-off': 'bg-base-content/40',
    }[status]

    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >
            <div className="modal-box w-11/12 max-w-2xl p-0 bg-base-100">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-base-300">
                    <div>
                        <div className="flex items-center gap-2">
                            <CalendarDaysIcon className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                                Attendance Details
                            </h3>
                        </div>

                        <p className="text-sm text-base-content/60 mt-1">
                            {formattedDate}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Status */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-base-content/50">
                                Attendance Status
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${statusDotColor}`}
                                />

                                <span className={`text-sm font-semibold ${statusColor}`}>
                                    {statusLabels[status]}
                                </span>
                            </div>
                        </div>

                        {isPresent && (
                            <div className="text-right">
                                <p className="text-xs text-base-content/50">
                                    Total Worked
                                </p>

                                <p className="text-xl font-semibold mt-1">
                                    {workedHours || '--'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Holiday / Weekly Off */}
                    {isNonWorkingDay && (
                        <div className="rounded-lg border border-base-300 bg-base-200/30 p-4">
                            <p className="text-sm font-medium">
                                {status === 'holiday'
                                    ? attendance.holiday_name ||
                                      attendance.holidayName ||
                                      'Holiday'
                                    : 'Weekly Off'}
                            </p>

                            <p className="text-xs text-base-content/60 mt-1">
                                {status === 'holiday'
                                    ? 'This date is marked as a holiday.'
                                    : 'This date is marked as a weekly off.'}
                            </p>
                        </div>
                    )}

                    {/* Absent */}
                    {status === 'absent' && (
                        <div className="rounded-lg border border-error/20 bg-error/5 p-4">
                            <div className="flex items-start gap-3">
                                <ClockIcon className="w-5 h-5 text-error mt-0.5" />

                                <div>
                                    <p className="text-sm font-medium">
                                        No attendance recorded
                                    </p>

                                    <p className="text-xs text-base-content/60 mt-1">
                                        There is no complete attendance record for this date.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Present / Half Day Details */}
                    {isPresent && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Punch In */}
                                <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
                                    <p className="text-xs uppercase tracking-wide text-base-content/50">
                                        Punch In
                                    </p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="avatar">
                                            <div className="w-14 h-14 rounded-lg">
                                                <img
                                                    src={
                                                        attendance.check_in_image ||
                                                        profileImage
                                                    }
                                                    alt="Punch in verification"
                                                    onError={(event) => {
                                                        event.currentTarget.onerror = null
                                                        event.currentTarget.src =
                                                            getDefaultProfileImage(
                                                                attendance.gender
                                                            )
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-lg font-semibold">
                                                {checkInTime}
                                            </p>

                                            <p className="text-xs text-success mt-0.5">
                                                Punch-in record
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Punch Out */}
                                <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
                                    <p className="text-xs uppercase tracking-wide text-base-content/50">
                                        Punch Out
                                    </p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="avatar">
                                            <div className="w-14 h-14 rounded-lg">
                                                <img
                                                    src={
                                                        attendance.check_out_image ||
                                                        profileImage
                                                    }
                                                    alt="Punch out verification"
                                                    onError={(event) => {
                                                        event.currentTarget.onerror = null
                                                        event.currentTarget.src =
                                                            getDefaultProfileImage(
                                                                attendance.gender
                                                            )
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-lg font-semibold">
                                                {checkOutTime}
                                            </p>

                                            <p className="text-xs text-success mt-0.5">
                                                Punch-out record
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Working Summary */}
                            <div className="mt-4 rounded-xl border border-base-300 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <ClockIcon className="w-5 h-5 text-primary" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                Working Hours
                                            </p>

                                            <p className="text-xs text-base-content/50">
                                                Punch in to punch out
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <span>{checkInTime}</span>
                                        <ArrowRightIcon className="w-4 h-4 text-base-content/40" />
                                        <span>{checkOutTime}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t border-base-300">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-primary"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <form
                method="dialog"
                className="modal-backdrop"
                onClick={(event) => {
                    event.preventDefault()
                    onClose?.()
                }}
            >
                <button type="button" aria-label="Close modal">
                    close
                </button>
            </form>
        </dialog>
    )
}

export default AttendanceDetailsModal
