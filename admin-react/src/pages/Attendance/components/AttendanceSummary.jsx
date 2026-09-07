// admin-react/src/pages/Attendance/components/AttendanceSummary.jsx

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'


// =============================================================
// CALCULATE WORKED MINUTES
// =============================================================

const getWorkedMinutes = (attendance) => {

    if (
        !attendance?.check_in ||
        !attendance?.check_out
    ) {
        return 0
    }


    const checkIn =
        new Date(attendance.check_in)

    const checkOut =
        new Date(attendance.check_out)


    let milliseconds =
        checkOut.getTime() -
        checkIn.getTime()


    if (
        attendance.lunch_out &&
        attendance.lunch_in
    ) {

        const lunchOut =
            new Date(attendance.lunch_out)

        const lunchIn =
            new Date(attendance.lunch_in)


        milliseconds -=
            lunchIn.getTime() -
            lunchOut.getTime()

    }


    if (milliseconds <= 0) {
        return 0
    }


    return Math.floor(
        milliseconds / (1000 * 60)
    )

}


// =============================================================
// GET WORKING DAYS
// =============================================================

const getWorkingDays = (
    year,
    month
) => {

    let workingDays = 0

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate()


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            )

        const dayOfWeek =
            date.getDay()


        /*
         * Monday-Friday
         */

        if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6
        ) {

            workingDays++

        }

    }


    return workingDays

}


// =============================================================
// FORMAT HOURS
// =============================================================

const formatHours = (minutes) => {

    if (!minutes) {
        return '0h 0m'
    }


    const hours =
        Math.floor(minutes / 60)

    const remainingMinutes =
        minutes % 60


    return `${hours}h ${remainingMinutes}m`

}


// =============================================================
// COMPONENT
// =============================================================

function AttendanceSummary({
    attendanceRecords = [],
    loading = false,
}) {

    const today = new Date()

    const currentYear =
        today.getFullYear()

    const currentMonth =
        today.getMonth()


    // =============================================================
    // CURRENT MONTH RECORDS
    // =============================================================

    const currentMonthRecords =
        attendanceRecords.filter(
            (record) => {

                const date =
                    new Date(
                        `${record.date}T00:00:00`
                    )

                return (
                    date.getFullYear() ===
                        currentYear &&
                    date.getMonth() ===
                        currentMonth
                )

            }
        )


    // =============================================================
    // PRESENT DAYS
    // =============================================================

    const presentDays =
        currentMonthRecords.filter(
            (record) =>
                Boolean(record.check_in)
        ).length


    // =============================================================
    // WORKING DAYS
    // =============================================================

    const workingDays =
        getWorkingDays(
            currentYear,
            currentMonth
        )


    // =============================================================
    // ABSENT DAYS
    // =============================================================

    /*
     * We only calculate absence for
     * weekdays that have already passed.
     */

    const currentDay =
        today.getDate()


    let elapsedWorkingDays = 0


    for (
        let day = 1;
        day <= currentDay;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth,
                day
            )

        const dayOfWeek =
            date.getDay()


        if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6
        ) {

            elapsedWorkingDays++

        }

    }


    const absentDays =
        Math.max(
            elapsedWorkingDays -
            presentDays,
            0
        )


    // =============================================================
    // AVERAGE HOURS
    // =============================================================

    const totalWorkedMinutes =
        currentMonthRecords.reduce(
            (total, record) => {

                return (
                    total +
                    getWorkedMinutes(record)
                )

            },
            0
        )


    const recordsWithHours =
        currentMonthRecords.filter(
            (record) =>
                record.check_in &&
                record.check_out
        ).length


    const averageMinutes =
        recordsWithHours > 0
            ? Math.round(
                totalWorkedMinutes /
                recordsWithHours
            )
            : 0


    // =============================================================
    // SUMMARY DATA
    // =============================================================

    const summary = [

        {
            label: 'Present Days',
            value: presentDays,
            description: 'This month',
            icon: CheckCircleIcon,
            iconClass: 'text-success',
            iconBg: 'bg-success/10',
        },

        {
            label: 'Absent Days',
            value: absentDays,
            description: 'This month',
            icon: XCircleIcon,
            iconClass: 'text-error',
            iconBg: 'bg-error/10',
        },

        {
            label: 'Working Days',
            value: workingDays,
            description: 'This month',
            icon: CalendarDaysIcon,
            iconClass: 'text-primary',
            iconBg: 'bg-primary/10',
        },

        {
            label: 'Average Hours',
            value: formatHours(
                averageMinutes
            ),
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

                {summary.map((item) => {

                    return (

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

                    )

                })}

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
                                    className={`
                                        w-9 h-9
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                        ${item.iconBg}
                                    `}
                                >

                                    <Icon
                                        className={`
                                            w-5 h-5
                                            ${item.iconClass}
                                        `}
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