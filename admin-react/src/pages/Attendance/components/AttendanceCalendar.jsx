// admin-react\src\pages\Attendance\components\AttendanceCalendar.jsx
import { useMemo, useState } from 'react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'

const attendanceData = {
    '2026-08-01': { status: 'present', workedHours: '8h 42m' },
    '2026-08-03': { status: 'present', workedHours: '9h 05m' },
    '2026-08-04': { status: 'present', workedHours: '8h 31m' },
    '2026-08-05': { status: 'absent' },
    '2026-08-06': { status: 'present', workedHours: '8h 48m' },
    '2026-08-07': { status: 'present', workedHours: '8h 17m' },
    '2026-08-08': { status: 'present', workedHours: '7h 56m' },
    '2026-08-10': { status: 'present', workedHours: '8h 44m' },
    '2026-08-11': { status: 'present', workedHours: '9h 12m' },
    '2026-08-12': { status: 'present', workedHours: '8h 37m' },
    '2026-08-13': { status: 'absent' },
    '2026-08-14': { status: 'present', workedHours: '8h 21m' },
    '2026-08-17': { status: 'present', workedHours: '8h 55m' },
    '2026-08-18': { status: 'present', workedHours: '8h 46m' },
    '2026-08-19': { status: 'present', workedHours: '9h 02m' },
    '2026-08-20': { status: 'present', workedHours: '8h 29m' },
    '2026-08-21': { status: 'present', workedHours: '8h 11m' },
}

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


function AttendanceCalendar({ onDateSelect }) {

    const today = new Date()

    const [currentMonth, setCurrentMonth] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    )


    const calendarDays = useMemo(() => {

        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        const firstDay = new Date(
            year,
            month,
            1
        ).getDay()

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate()

        const days = []

        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return days

    }, [currentMonth])


    const getDateKey = (day) => {

        if (!day) return null

        const year = currentMonth.getFullYear()

        const month = String(
            currentMonth.getMonth() + 1
        ).padStart(2, '0')

        const date = String(day).padStart(2, '0')

        return `${year}-${month}-${date}`
    }


    const getStatus = (day) => {

        const key = getDateKey(day)

        if (!key) return null

        return attendanceData[key]?.status || null
    }


    const isToday = (day) => {

        if (!day) return false

        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        )
    }


    const goToPreviousMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        )
    }


    const goToNextMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        )
    }


    const goToCurrentMonth = () => {

        setCurrentMonth(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        )
    }


    const handleDateClick = (day) => {

        if (!day) return

        const dateKey = getDateKey(day)
        const attendance = attendanceData[dateKey]

        if (!attendance) return

        onDateSelect?.({
            date: dateKey,
            ...attendance,
        })
    }


    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm">

            <div className="card-body p-3 sm:p-4 md:p-5">

                {/* Header */}

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
                            <span className="hidden sm:inline">
                                Today
                            </span>

                            <span className="sm:hidden">
                                Now
                            </span>
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
                        >
                            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                    </div>

                </div>


                {/* Month */}

                <div className="flex items-center justify-center py-2 sm:py-3">

                    <h3 className="text-sm sm:text-base font-semibold">
                        {monthNames[currentMonth.getMonth()]}{' '}
                        {currentMonth.getFullYear()}
                    </h3>

                </div>


                {/* Legend */}

                <div className="flex items-center justify-center gap-3 sm:gap-5 pb-2 sm:pb-4">

                    <div className="flex items-center gap-1 sm:gap-2">

                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-success" />

                        <span className="text-[10px] sm:text-xs text-base-content/70">
                            Present
                        </span>

                    </div>


                    <div className="flex items-center gap-1 sm:gap-2">

                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-error" />

                        <span className="text-[10px] sm:text-xs text-base-content/70">
                            Absent
                        </span>

                    </div>


                    <div className="flex items-center gap-1 sm:gap-2">

                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-base-300" />

                        <span className="text-[10px] sm:text-xs text-base-content/70">
                            No record
                        </span>

                    </div>

                </div>


                {/* Calendar */}

                <div className="w-full">

                    {/* Week days */}

                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">

                        {weekDays.map((day) => (

                            <div
                                key={day}
                                className="
                                    text-center
                                    text-[9px]
                                    min-[400px]:text-[10px]
                                    sm:text-xs
                                    font-medium
                                    text-base-content/50
                                    py-1
                                    sm:py-2
                                "
                            >
                                {day}
                            </div>

                        ))}

                    </div>


                    {/* Dates */}

                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">

                        {calendarDays.map((day, index) => {

                            const status = getStatus(day)
                            const todayDate = isToday(day)

                            return (

                                <button
                                    key={index}
                                    type="button"
                                    disabled={!day || !status}
                                    onClick={() => handleDateClick(day)}
                                    className={`
                                        relative
                                        w-full
                                        min-w-0
                                        h-[58px]
                                        min-[400px]:h-[64px]
                                        sm:h-[76px]
                                        md:h-[82px]
                                        lg:h-[86px]
                                        rounded-md
                                        sm:rounded-lg
                                        border
                                        transition-all
                                        text-left
                                        p-1
                                        sm:p-1.5
                                        md:p-2
                                        overflow-hidden

                                        ${
                                            !day
                                                ? 'border-transparent bg-transparent cursor-default'
                                                : status === 'present'
                                                    ? 'border-base-300 bg-base-100 hover:border-success/40 hover:bg-success/5 cursor-pointer'
                                                    : status === 'absent'
                                                        ? 'border-base-300 bg-base-100 hover:border-error/40 hover:bg-error/5 cursor-pointer'
                                                        : 'border-base-300 bg-base-200/30'
                                        }
                                    `}
                                >

                                    {day && (
                                        <>

                                            {/* Date + status */}

                                            <div className="flex items-start justify-between gap-0.5">

                                                <span
                                                    className={`
                                                        text-[10px]
                                                        min-[400px]:text-xs
                                                        sm:text-sm
                                                        font-medium
                                                        leading-none
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

                                                    <span
                                                        className={`
                                                            shrink-0
                                                            w-1.5
                                                            h-1.5
                                                            sm:w-2
                                                            sm:h-2
                                                            rounded-full
                                                            mt-0.5
                                                            ${
                                                                status === 'present'
                                                                    ? 'bg-success'
                                                                    : 'bg-error'
                                                            }
                                                        `}
                                                    />

                                                )}

                                            </div>


                                            {/* Present */}

                                            {status === 'present' && (

                                                <div className="mt-2 sm:mt-3">

                                                    <span className="block text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-success font-medium truncate">
                                                        Present
                                                    </span>

                                                    <p className="text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-base-content/50 mt-0.5 truncate">
                                                        {attendanceData[getDateKey(day)]?.workedHours}
                                                    </p>

                                                </div>

                                            )}


                                            {/* Absent */}

                                            {status === 'absent' && (

                                                <div className="mt-2 sm:mt-3">

                                                    <span className="block text-[8px] min-[400px]:text-[9px] sm:text-[11px] text-error font-medium truncate">
                                                        Absent
                                                    </span>

                                                </div>

                                            )}

                                        </>
                                    )}

                                </button>

                            )

                        })}

                    </div>

                </div>


                {/* Footer */}

                <div className="flex items-center justify-between gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-300">

                    <p className="text-[9px] sm:text-xs text-base-content/50 truncate">
                        Click a date for details
                    </p>

                    <div className="text-[9px] sm:text-xs text-base-content/50 whitespace-nowrap">

                        {Object.values(attendanceData).filter(
                            item => item.status === 'present'
                        ).length}{' '}

                        present

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AttendanceCalendar