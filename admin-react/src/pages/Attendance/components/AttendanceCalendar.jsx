// admin-react/src/pages/Attendance/components/AttendanceCalendar.jsx

import { useEffect, useMemo, useState } from 'react'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'

import { getMyAttendance } from '../api'


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

const weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]


function AttendanceCalendar({ onDateSelect }) {

    const today = new Date()

    const [attendanceData, setAttendanceData] = useState({})
    const [loading, setLoading] = useState(true)

    const [currentMonth, setCurrentMonth] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    )


    // =============================================================
    // FETCH ATTENDANCE
    // =============================================================

    useEffect(() => {

        const fetchAttendance = async () => {

            try {

                setLoading(true)

                const response = await getMyAttendance()

                const records = response?.data || []

                const formattedAttendance = {}

                records.forEach((record) => {

                    const dateKey = record.date

                    formattedAttendance[dateKey] = {
                        ...record,

                        status: record.check_in
                            ? 'present'
                            : 'absent',

                        workedHours: getWorkedHours(record),
                    }

                })

                setAttendanceData(
                    formattedAttendance
                )

            } catch (error) {

                console.error(
                    'Failed to fetch attendance:',
                    error
                )

                setAttendanceData({})

            } finally {

                setLoading(false)

            }

        }

        fetchAttendance()

    }, [])


    // =============================================================
    // CALCULATE WORKED HOURS
    // =============================================================

    const getWorkedHours = (attendance) => {

        if (
            !attendance?.check_in ||
            !attendance?.check_out
        ) {
            return null
        }


        const checkIn = new Date(
            attendance.check_in
        )

        const checkOut = new Date(
            attendance.check_out
        )


        let workedMilliseconds =
            checkOut.getTime() -
            checkIn.getTime()


        /*
         * Deduct lunch duration if both
         * lunch_out and lunch_in exist.
         */

        if (
            attendance.lunch_out &&
            attendance.lunch_in
        ) {

            const lunchOut = new Date(
                attendance.lunch_out
            )

            const lunchIn = new Date(
                attendance.lunch_in
            )

            workedMilliseconds -=
                lunchIn.getTime() -
                lunchOut.getTime()

        }


        if (workedMilliseconds < 0) {
            return null
        }


        const totalMinutes = Math.floor(
            workedMilliseconds /
            (1000 * 60)
        )


        const hours = Math.floor(
            totalMinutes / 60
        )


        const minutes = totalMinutes % 60


        return `${hours}h ${minutes}m`

    }


    // =============================================================
    // CALENDAR DAYS
    // =============================================================

    const calendarDays = useMemo(() => {

        const year =
            currentMonth.getFullYear()

        const month =
            currentMonth.getMonth()


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


        /*
         * Empty cells before the first
         * day of the month.
         */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            days.push(null)

        }


        /*
         * Actual days.
         */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            days.push(day)

        }


        return days

    }, [currentMonth])


    // =============================================================
    // DATE KEY
    // =============================================================

    const getDateKey = (day) => {

        if (!day) {
            return null
        }


        const year =
            currentMonth.getFullYear()


        const month = String(
            currentMonth.getMonth() + 1
        ).padStart(2, '0')


        const date = String(day)
            .padStart(2, '0')


        return `${year}-${month}-${date}`

    }


    // =============================================================
    // GET STATUS
    // =============================================================

    const getStatus = (day) => {

        const key =
            getDateKey(day)


        if (!key) {
            return null
        }


        return (
            attendanceData[key]?.status ||
            null
        )

    }


    // =============================================================
    // CHECK TODAY
    // =============================================================

    const isToday = (day) => {

        if (!day) {
            return false
        }


        return (
            day === today.getDate() &&
            currentMonth.getMonth() ===
                today.getMonth() &&
            currentMonth.getFullYear() ===
                today.getFullYear()
        )

    }


    // =============================================================
    // PREVIOUS MONTH
    // =============================================================

    const goToPreviousMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        )

    }


    // =============================================================
    // NEXT MONTH
    // =============================================================

    const goToNextMonth = () => {

        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        )

    }


    // =============================================================
    // CURRENT MONTH
    // =============================================================

    const goToCurrentMonth = () => {

        setCurrentMonth(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        )

    }


    // =============================================================
    // DATE CLICK
    // =============================================================

    const handleDateClick = (day) => {

        if (!day) {
            return
        }


        const dateKey =
            getDateKey(day)


        const attendance =
            attendanceData[dateKey]


        if (!attendance) {
            return
        }


        onDateSelect?.({
            date: dateKey,
            ...attendance,
        })

    }


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


                {/* =====================================================
                    HEADER
                ===================================================== */}

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


                {/* =====================================================
                    MONTH
                ===================================================== */}

                <div className="flex items-center justify-center py-2 sm:py-3">

                    <h3 className="text-sm sm:text-base font-semibold">

                        {monthNames[
                            currentMonth.getMonth()
                        ]}{' '}

                        {currentMonth.getFullYear()}

                    </h3>

                </div>


                {/* =====================================================
                    LEGEND
                ===================================================== */}

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


                {/* =====================================================
                    CALENDAR
                ===================================================== */}

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

                        {calendarDays.map(
                            (day, index) => {

                                const status =
                                    getStatus(day)

                                const todayDate =
                                    isToday(day)

                                const dateKey =
                                    getDateKey(day)

                                const attendance =
                                    dateKey
                                        ? attendanceData[
                                            dateKey
                                        ]
                                        : null


                                return (

                                    <button
                                        key={index}
                                        type="button"
                                        disabled={
                                            !day ||
                                            !status
                                        }
                                        onClick={() =>
                                            handleDateClick(day)
                                        }
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

                                                            {attendance?.workedHours || '--'}

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

                            }
                        )}

                    </div>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="flex items-center justify-between gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-300">

                    <p className="text-[9px] sm:text-xs text-base-content/50 truncate">

                        Click a date for details

                    </p>


                    <div className="text-[9px] sm:text-xs text-base-content/50 whitespace-nowrap">

                        {
                            Object.values(
                                attendanceData
                            ).filter(
                                item =>
                                    item.status ===
                                    'present'
                            ).length
                        }{' '}

                        present

                    </div>

                </div>

            </div>

        </div>

    )

}


export default AttendanceCalendar