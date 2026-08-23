// admin-react\src\pages\Attendance\components\AttendanceDetailsModal.jsx
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'

function AttendanceDetailsModal({ attendance, onClose }) {

    if (!attendance) return null

    const formattedDate = new Date(
        `${attendance.date}T00:00:00`
    ).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })


    const isPresent = attendance.status === 'present'


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
                                    className={`
                                        w-2.5 h-2.5 rounded-full
                                        ${
                                            isPresent
                                                ? 'bg-success'
                                                : 'bg-error'
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        text-sm font-semibold
                                        ${
                                            isPresent
                                                ? 'text-success'
                                                : 'text-error'
                                        }
                                    `}
                                >
                                    {isPresent ? 'Present' : 'Absent'}
                                </span>

                            </div>

                        </div>


                        {isPresent && (
                            <div className="text-right">

                                <p className="text-xs text-base-content/50">
                                    Total Worked
                                </p>

                                <p className="text-xl font-semibold mt-1">
                                    {attendance.workedHours || '--'}
                                </p>

                            </div>
                        )}

                    </div>


                    {/* Absent */}
                    {!isPresent && (
                        <div className="rounded-lg border border-error/20 bg-error/5 p-4">

                            <div className="flex items-start gap-3">

                                <div className="mt-0.5">
                                    <ClockIcon className="w-5 h-5 text-error" />
                                </div>

                                <div>

                                    <p className="text-sm font-medium">
                                        No attendance recorded
                                    </p>

                                    <p className="text-xs text-base-content/60 mt-1">
                                        There is no punch-in or punch-out
                                        record for this date.
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* Present details */}
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
                                                    src="https://placehold.co/120x120"
                                                    alt="Punch in verification"
                                                />

                                            </div>

                                        </div>


                                        <div>

                                            <p className="text-lg font-semibold">
                                                09:12 AM
                                            </p>

                                            <p className="text-xs text-success mt-0.5">
                                                Face verified
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
                                                    src="https://placehold.co/120x120"
                                                    alt="Punch out verification"
                                                />

                                            </div>

                                        </div>


                                        <div>

                                            <p className="text-lg font-semibold">
                                                05:54 PM
                                            </p>

                                            <p className="text-xs text-success mt-0.5">
                                                Face verified
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Working summary */}
                            <div className="mt-4 rounded-xl border border-base-300 p-4">

                                <div className="flex items-center justify-between">

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

                                        <span>
                                            09:12 AM
                                        </span>

                                        <ArrowRightIcon className="w-4 h-4 text-base-content/40" />

                                        <span>
                                            05:54 PM
                                        </span>

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
                onClick={onClose}
            >
                <button type="button">
                    close
                </button>
            </form>

        </dialog>
    )
}

export default AttendanceDetailsModal