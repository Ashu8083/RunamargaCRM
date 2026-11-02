
 // admin-react/src/pages/crm/EmployeeManagement/Holiday/components/HolidayCalendar.jsx

import {
    useMemo,
} from 'react'

import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { PERMISSIONS,hasPermission } from '../../../../../app/permissions'

const canAdd=hasPermission(PERMISSIONS.HOLIDAY_CREATE)
const canEdit=hasPermission(PERMISSIONS.HOLIDAY_UPDATE)

// ============================================================================
// DATE HELPERS
// ============================================================================

const padNumber = (value) =>
    String(value).padStart(2, '0')


const toDateKey = (date) => {
    return [
        date.getFullYear(),
        padNumber(date.getMonth() + 1),
        padNumber(date.getDate()),
    ].join('-')
}


const formatMonthKey = (date) => {
    return [
        date.getFullYear(),
        padNumber(date.getMonth() + 1),
    ].join('-')
}


const formatHolidayDate = (dateString) => {
    if (!dateString) {
        return ''
    }

    // Parse date-only values locally to avoid timezone shifting.
    const [year, month, day] = dateString
        .slice(0, 10)
        .split('-')
        .map(Number)

    if (!year || !month || !day) {
        return dateString
    }

    return new Date(
        year,
        month - 1,
        day
    ).toLocaleDateString(
        undefined,
        {
            day: 'numeric',
            month: 'short',
        }
    )
}


// ============================================================================
// CALENDAR CONSTANTS
// ============================================================================

const WEEK_DAYS = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]


// ============================================================================
// HOLIDAY CALENDAR
// ============================================================================

function HolidayCalendar({
    currentMonth,
    onMonthChange,
    holidays = [],
    selectedDate = '',
    onDateSelect,
    onHolidaySelect,
    onAddHoliday,
    loading = false,
}) {

    // =========================================================================
    // MONTH INFORMATION
    // =========================================================================

    const monthDate = useMemo(() => {
        if (currentMonth instanceof Date) {
            return new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                1
            )
        }

        if (
            typeof currentMonth === 'string' &&
            /^\d{4}-\d{2}$/.test(currentMonth)
        ) {
            const [year, month] = currentMonth
                .split('-')
                .map(Number)

            return new Date(
                year,
                month - 1,
                1
            )
        }

        const today = new Date()

        return new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    }, [currentMonth])


    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()


    const monthLabel = monthDate.toLocaleDateString(
        undefined,
        {
            month: 'long',
            year: 'numeric',
        }
    )


    const todayKey = toDateKey(
        new Date()
    )


    // =========================================================================
    // BUILD CALENDAR GRID
    // =========================================================================
    //
    // Six rows are used to keep the calendar height consistent between months.
    // Each day has a local YYYY-MM-DD key.
    //
    // =========================================================================

    const calendarDays = useMemo(() => {
        const firstDay = new Date(
            year,
            month,
            1
        )

        const gridStart = new Date(
            year,
            month,
            1 - firstDay.getDay()
        )

        return Array.from(
            { length: 42 },
            (_, index) => {
                const date = new Date(
                    gridStart.getFullYear(),
                    gridStart.getMonth(),
                    gridStart.getDate() + index
                )

                return {
                    date,
                    key: toDateKey(date),
                    day: date.getDate(),
                    isCurrentMonth:
                        date.getMonth() === month,
                    isToday:
                        toDateKey(date) === todayKey,
                }
            }
        )
    }, [year, month, todayKey])


    // =========================================================================
    // GROUP HOLIDAYS BY DATE
    // =========================================================================

    const holidaysByDate = useMemo(() => {
        const grouped = {}

        holidays.forEach((holiday) => {
            if (!holiday?.date) {
                return
            }

            const dateKey = String(
                holiday.date
            ).slice(0, 10)

            if (!grouped[dateKey]) {
                grouped[dateKey] = []
            }

            grouped[dateKey].push(holiday)
        })

        return grouped
    }, [holidays])


    // =========================================================================
    // MONTH NAVIGATION
    // =========================================================================

    const changeMonth = (offset) => {
        if (
            typeof onMonthChange !== 'function'
        ) {
            return
        }

        const nextMonth = new Date(
            year,
            month + offset,
            1
        )

        onMonthChange(
            formatMonthKey(nextMonth)
        )
    }


    const goToToday = () => {
        const today = new Date()

        onMonthChange?.(
            formatMonthKey(today)
        )

        onDateSelect?.(
            toDateKey(today)
        )
    }


    // =========================================================================
    // DATE SELECTION
    // =========================================================================

    const handleDateClick = (day) => {
        onDateSelect?.(
            day.key
        )
    }


    // =========================================================================
    // HOLIDAY CLICK
    // =========================================================================

    const handleHolidayClick = (
        event,
        holiday
    ) => {
        event.stopPropagation()

        onHolidaySelect?.(
            holiday
        )
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* ================================================================
                CALENDAR HEADER
            ================================================================ */}

            <div className="
                flex
                flex-col
                gap-4
                border-b
                border-base-300
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:p-5
            ">

                {/* ============================================================
                    MONTH NAVIGATION
                ============================================================ */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                ">

                    <h2 className="
                        min-w-0
                        text-xl
                        font-semibold
                        tracking-tight
                        text-base-content
                        sm:text-2xl
                    ">
                        {monthLabel}
                    </h2>


                    <div className="
                        flex
                        items-center
                        gap-1
                    ">

                        <button
                            type="button"
                            onClick={() => changeMonth(-1)}
                            disabled={loading}
                            className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                text-base-content/70
                                transition
                                hover:bg-base-200
                                disabled:opacity-40
                            "
                            aria-label="Previous month"
                            title="Previous month"
                        >
                            <ChevronLeftIcon className="
                                h-4
                                w-4
                            " />
                        </button>


                        <button
                            type="button"
                            onClick={() => changeMonth(1)}
                            disabled={loading}
                            className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-base-300
                                text-base-content/70
                                transition
                                hover:bg-base-200
                                disabled:opacity-40
                            "
                            aria-label="Next month"
                            title="Next month"
                        >
                            <ChevronRightIcon className="
                                h-4
                                w-4
                            " />
                        </button>

                    </div>


                    <button
                        type="button"
                        onClick={goToToday}
                        disabled={loading}
                        className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-base-300
                            px-3
                            text-xs
                            font-medium
                            text-base-content/70
                            transition
                            hover:bg-base-200
                            disabled:opacity-40
                        "
                    >
                        Today
                    </button>

                </div>


                {/* ============================================================
                    ADD HOLIDAY
                ============================================================ */}

                <button
                    type="button"
                    onClick={() => onAddHoliday?.(
                        selectedDate || todayKey
                    )}
                    disabled={loading |!canAdd}
                    className="
                        inline-flex
                        h-10
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-[#8BCF00]
                        px-4
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#78B300]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#8BCF00]/30
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <PlusIcon className="
                        h-4
                        w-4
                    " />

                    Add Holiday
                </button>

            </div>


            {/* ================================================================
                LOADING INDICATOR
            ================================================================ */}

            {loading && (
                <div className="
                    flex
                    items-center
                    gap-2
                    border-b
                    border-base-300
                    px-4
                    py-2
                    text-xs
                    text-base-content/50
                ">
                    <span className="
                        h-3
                        w-3
                        animate-spin
                        rounded-full
                        border-2
                        border-base-300
                        border-t-[#8BCF00]
                    " />

                    Loading holidays...
                </div>
            )}


            {/* ================================================================
                WEEKDAY HEADERS
            ================================================================ */}

            <div className="
                grid
                grid-cols-7
                border-b
                border-base-300
                bg-base-200/30
            ">

                {WEEK_DAYS.map((day) => (
                    <div
                        key={day}
                        className="
                            px-1
                            py-3
                            text-center
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-base-content/50
                            sm:px-3
                            sm:text-xs
                        "
                    >
                        {day}
                    </div>
                ))}

            </div>


            {/* ================================================================
                CALENDAR DAYS
            ================================================================ */}

            <div className="
                grid
                grid-cols-7
            ">

                {calendarDays.map((day) => {
                    const dayHolidays =
                        holidaysByDate[day.key] || []

                    const isSelected =
                        selectedDate === day.key

                    return (
                        <button
                            key={day.key}
                            type="button"
                            onClick={() => handleDateClick(day)}
                            aria-label={
                                `${day.key}, ${dayHolidays.length} holidays`
                            }
                            disabled={!canEdit}
                            className={[
                                'group',
                                'relative',
                                'flex',
                                'min-h-[88px]',
                                'min-w-0',
                                'flex-col',
                                'items-stretch',
                                'gap-1',
                                'border-b',
                                'border-r',
                                'border-base-300',
                                'p-1.5',
                                'text-left',
                                'transition-colors',
                                'sm:min-h-[118px]',
                                'sm:gap-1.5',
                                'sm:p-2',

                                day.isCurrentMonth
                                    ? 'bg-base-100'
                                    : 'bg-base-200/20',

                                isSelected
                                    ? 'bg-[#8BCF00]/10 ring-2 ring-inset ring-[#8BCF00]/60'
                                    : 'hover:bg-base-200/60',

                            ].join(' ')}
                        >

                            {/* =================================================
                                DAY NUMBER
                            ================================================= */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                gap-1
                            ">

                                <span
                                    className={[
                                        'inline-flex',
                                        'h-7',
                                        'w-7',
                                        'shrink-0',
                                        'items-center',
                                        'justify-center',
                                        'rounded-full',
                                        'text-xs',
                                        'font-medium',
                                        'sm:h-8',
                                        'sm:w-8',
                                        'sm:text-sm',

                                        day.isToday
                                            ? 'bg-[#8BCF00] font-semibold text-white'
                                            : day.isCurrentMonth
                                                ? 'text-base-content/80'
                                                : 'text-base-content/25',

                                    ].join(' ')}
                                >
                                    {day.day}
                                </span>


                                {dayHolidays.length > 0 && (
                                    <span className="
                                        hidden
                                        rounded-full
                                        bg-[#8BCF00]/10
                                        px-1.5
                                        py-0.5
                                        text-[9px]
                                        font-semibold
                                        text-[#6FA800]
                                        sm:inline-flex
                                    ">
                                        {dayHolidays.length}
                                    </span>
                                )}

                            </div>


                            {/* =================================================
                                HOLIDAY INDICATORS
                            ================================================= */}

                            <div className="
                                flex
                                min-w-0
                                flex-col
                                gap-1
                            ">

                                {dayHolidays
                                    .slice(0, 3)
                                    .map((holiday) => {
                                        const active =
                                            holiday.is_active !== false

                                        return (
                                            <span
                                                key={holiday.id}
                                                onClick={(event) =>
                                                    handleHolidayClick(
                                                        event,
                                                        holiday
                                                    )
                                                }
                                                title={[
                                                    holiday.name,
                                                    formatHolidayDate(
                                                        holiday.date
                                                    ),
                                                    !active
                                                        ? '(Inactive)'
                                                        : '',
                                                ].filter(Boolean).join(' ')}
                                                className={[
                                                    'block',
                                                    'w-full',
                                                    'min-w-0',
                                                    'cursor-pointer',
                                                    'truncate',
                                                    'rounded',
                                                    'border-l-2',
                                                    'px-1',
                                                    'py-1',
                                                    'text-[9px]',
                                                    'font-medium',
                                                    'leading-tight',
                                                    'sm:px-1.5',
                                                    'sm:text-[11px]',

                                                    active
                                                        ? 'border-[#8BCF00] bg-[#8BCF00]/15 text-[#527f00] hover:bg-[#8BCF00]/25'
                                                        : 'border-base-content/30 bg-base-200 text-base-content/50 line-through',

                                                ].join(' ')}
                                            >
                                                {holiday.name}
                                            </span>
                                        )
                                    })}


                                {dayHolidays.length > 3 && (
                                    <span className="
                                        truncate
                                        px-1
                                        text-[9px]
                                        font-medium
                                        text-base-content/50
                                    ">
                                        +{dayHolidays.length - 3} more
                                    </span>
                                )}

                            </div>

                        </button>
                    )
                })}

            </div>


            {/* ================================================================
                CALENDAR FOOTER
            ================================================================ */}

            <div className="
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
                border-t
                border-base-300
                px-4
                py-3
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">
                    <span className="
                        h-2.5
                        w-2.5
                        rounded-sm
                        bg-[#8BCF00]
                    " />

                    <span className="
                        text-[11px]
                        text-base-content/55
                    ">
                        Active holiday
                    </span>
                </div>


                <div className="
                    flex
                    items-center
                    gap-2
                ">
                    <span className="
                        h-2.5
                        w-2.5
                        rounded-sm
                        bg-base-300
                    " />

                    <span className="
                        text-[11px]
                        text-base-content/55
                    ">
                        Inactive holiday
                    </span>
                </div>


                <div className="
                    flex
                    items-center
                    gap-2
                ">
                    <span className="
                        h-3
                        w-3
                        rounded-full
                        bg-[#8BCF00]
                    " />

                    <span className="
                        text-[11px]
                        text-base-content/55
                    ">
                        Today
                    </span>
                </div>

            </div>

        </div>
    )
}


export default HolidayCalendar
