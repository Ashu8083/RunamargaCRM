// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/WeeklyCallTrend.jsx

import { useMemo, useState } from 'react'

import ArrowDownLeftIcon from '@heroicons/react/24/outline/ArrowDownLeftIcon'
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'


// =============================================================
// DATE FORMAT
// =============================================================

const formatDate = (date) => {

    if (!date) {
        return '—'
    }

    const parsed =
        new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsed.getTime())) {
        return date
    }

    return parsed.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
        }
    )

}


// =============================================================
// WEEK START
// =============================================================

const getWeekStart = (date) => {

    const result = new Date(date)

    const day = result.getDay()

    const difference =
        day === 0
            ? -6
            : 1 - day

    result.setDate(
        result.getDate() + difference
    )

    return result

}


// =============================================================
// LEGEND
// =============================================================

function Legend({
    icon: Icon,
    label,
    color,
}) {

    return (

        <div className="
            flex
            items-center
            gap-1.5
            text-[11px]
            text-base-content/55
        ">

            <span
                className={[
                    'h-2.5',
                    'w-2.5',
                    'rounded-sm',
                    color,
                ].join(' ')}
            />

            <Icon className="h-3.5 w-3.5" />

            {label}

        </div>

    )

}


// =============================================================
// DATE INPUT
// =============================================================

function DateInput({
    label,
    value,
    onChange,
}) {

    return (

        <div className="min-w-0">

            <label className="
                mb-1
                block
                text-[11px]
                font-medium
                text-base-content/55
            ">
                {label}
            </label>

            <input
                type="date"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    input
                    input-bordered
                    h-9
                    min-h-9
                    w-full
                    min-w-0
                    text-xs
                "
            />

        </div>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function WeeklyCallTrend({
    calls = [],
}) {

    const [fromDate, setFromDate] =
        useState('')

    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // BUILD WEEKLY DATA
    // =========================================================

    const weeklyData = useMemo(() => {

        if (!Array.isArray(calls)) {
            return []
        }


        const grouped = {}


        calls.forEach((call) => {

            const rawDate =
                call.date ||
                call.createdAt?.slice(0, 10)


            if (!rawDate) {
                return
            }


            if (
                fromDate &&
                rawDate < fromDate
            ) {
                return
            }


            if (
                toDate &&
                rawDate > toDate
            ) {
                return
            }


            const date =
                new Date(
                    `${rawDate}T00:00:00`
                )


            if (Number.isNaN(date.getTime())) {
                return
            }


            const weekStart =
                getWeekStart(date)


            const weekKey =
                weekStart
                    .toISOString()
                    .slice(0, 10)


            if (!grouped[weekKey]) {

                grouped[weekKey] = {
                    date: weekKey,
                    received: 0,
                    outgoing: 0,
                    answered: 0,
                    missed: 0,
                    uniqueNumbers: new Set(),
                    applications: 0,
                }

            }


            const item =
                grouped[weekKey]


            const type =
                String(call.type || '')
                    .trim()
                    .toLowerCase()


            const status =
                String(call.status || '')
                    .trim()
                    .toLowerCase()


            // -------------------------------------------------
            // RECEIVED
            // -------------------------------------------------

            if (
                type === 'incoming' ||
                type === 'received'
            ) {

                item.received += 1

            }


            // -------------------------------------------------
            // OUTGOING
            // -------------------------------------------------

            if (
                type === 'outgoing' ||
                type === 'dialed' ||
                type === 'dialled'
            ) {

                item.outgoing += 1

            }


            // -------------------------------------------------
            // ANSWERED
            // -------------------------------------------------

            if (
                status === 'received' ||
                status === 'answered'
            ) {

                item.answered += 1

            }


            // -------------------------------------------------
            // MISSED
            // -------------------------------------------------

            if (
                type === 'missed' ||
                status === 'missed'
            ) {

                item.missed += 1

            }


            // -------------------------------------------------
            // UNIQUE MISSED CALL
            // -------------------------------------------------

            if (
                (
                    call.uniqueMissed === true ||
                    call.isUniqueMissed === true
                ) &&
                call.crmExists === false
            ) {

                const phone =
                    String(
                        call.phone ||
                        call.contact ||
                        ''
                    ).trim()


                if (phone) {
                    item.uniqueNumbers.add(phone)
                }

            }


            // -------------------------------------------------
            // APPLICATIONS
            // -------------------------------------------------

            if (
                call.applicationCreated === true ||
                call.application === true
            ) {

                item.applications += 1

            } else if (
                Number(call.applications || 0) > 0
            ) {

                item.applications +=
                    Number(call.applications)

            }

        })


        return Object.values(grouped)
            .map((item) => ({
                ...item,
                uniqueMissed:
                    item.uniqueNumbers.size,
            }))
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            )

    }, [
        calls,
        fromDate,
        toDate,
    ])


    // =========================================================
    // MAX VALUE
    // =========================================================

    const maxValue =
        Math.max(
            ...weeklyData.map((item) =>
                Math.max(
                    item.received,
                    item.outgoing,
                    item.answered,
                    item.missed,
                    item.uniqueMissed,
                    item.applications
                )
            ),
            1
        )


    // =========================================================
    // BAR CONFIG
    // =========================================================

    const bars = [
        {
            key: 'received',
            label: 'Received',
            color: 'bg-blue-500',
            icon: ArrowDownLeftIcon,
        },
        {
            key: 'outgoing',
            label: 'Outgoing',
            color: 'bg-violet-500',
            icon: ArrowUpRightIcon,
        },
        {
            key: 'answered',
            label: 'Answered',
            color: 'bg-[#8BCF00]',
            icon: CheckCircleIcon,
        },
        {
            key: 'missed',
            label: 'Missed',
            color: 'bg-red-500',
            icon: PhoneXMarkIcon,
        },
    ]


    // =========================================================
    // TOTALS
    // =========================================================

    const totals = useMemo(() => {

        return weeklyData.reduce(
            (result, item) => {

                result.received +=
                    item.received

                result.outgoing +=
                    item.outgoing

                result.answered +=
                    item.answered

                result.missed +=
                    item.missed

                result.uniqueMissed +=
                    item.uniqueMissed

                result.applications +=
                    item.applications

                return result

            },
            {
                received: 0,
                outgoing: 0,
                answered: 0,
                missed: 0,
                uniqueMissed: 0,
                applications: 0,
            }
        )

    }, [
        weeklyData,
    ])


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            w-full
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                flex-col
                gap-3
                border-b
                border-base-300
                px-5
                py-4
                lg:flex-row
                lg:items-end
                lg:justify-between
            ">

                <div>

                    <h2 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Weekly Call Trend
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/45
                    ">
                        Weekly call volume and outcome trend.
                    </p>

                </div>


                {/* DATE RANGE */}

                <div className="
                    grid
                    w-full
                    grid-cols-2
                    gap-2
                    sm:w-auto
                    sm:min-w-[280px]
                ">

                    <DateInput
                        label="From"
                        value={fromDate}
                        onChange={setFromDate}
                    />

                    <DateInput
                        label="To"
                        value={toDate}
                        onChange={setToDate}
                    />

                </div>

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div className="
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                border-b
                border-base-300
                px-5
                py-3
            ">

                {bars.map((bar) => (

                    <Legend
                        key={bar.key}
                        icon={bar.icon}
                        label={bar.label}
                        color={bar.color}
                    />

                ))}


                <Legend
                    icon={UserGroupIcon}
                    label="Unique Missed"
                    color="bg-orange-500"
                />


                <Legend
                    icon={DocumentTextIcon}
                    label="Applications"
                    color="bg-cyan-500"
                />

            </div>


            {/* =================================================
                GRAPH
            ================================================= */}

            <div className="
                overflow-x-auto
                px-5
                py-5
            ">

                {weeklyData.length ? (

                    <div className="
                        min-w-[650px]
                    ">

                        <div
                            className="
                                relative
                                flex
                                items-end
                                gap-4
                                border-b
                                border-base-300
                                px-3
                            "
                            style={{
                                height: '280px',
                            }}
                        >

                            {/* GRID */}

                            <div className="
                                pointer-events-none
                                absolute
                                inset-0
                                flex
                                flex-col
                                justify-between
                            ">

                                {[0, 1, 2, 3, 4].map(
                                    (line) => (

                                        <div
                                            key={line}
                                            className="
                                                border-t
                                                border-dashed
                                                border-base-300
                                            "
                                        />

                                    )
                                )}

                            </div>


                            {/* WEEK GROUPS */}

                            {weeklyData.map((item) => (

                                <div
                                    key={item.date}
                                    className="
                                        relative
                                        z-10
                                        flex
                                        h-full
                                        min-w-[60px]
                                        flex-1
                                        items-end
                                        justify-center
                                        gap-1
                                    "
                                >

                                    {bars.map((bar) => {

                                        const value =
                                            item[bar.key]


                                        const height =
                                            value > 0
                                                ? Math.max(
                                                    (
                                                        value /
                                                        maxValue
                                                    ) * 100,
                                                    3
                                                )
                                                : 1


                                        return (

                                            <div
                                                key={bar.key}
                                                className="
                                                    relative
                                                    flex
                                                    h-full
                                                    w-3
                                                    items-end
                                                "
                                            >

                                                {/* COUNT */}

                                                {value > 0 && (

                                                    <span className="
                                                        absolute
                                                        -top-4
                                                        left-1/2
                                                        -translate-x-1/2
                                                        whitespace-nowrap
                                                        text-[8px]
                                                        font-medium
                                                        text-base-content/55
                                                    ">
                                                        {value}
                                                    </span>

                                                )}


                                                {/* BAR */}

                                                <div
                                                    className={[
                                                        'w-full',
                                                        'rounded-t',
                                                        bar.color,
                                                        'opacity-80',
                                                        'transition-all',
                                                        'hover:opacity-100',
                                                    ].join(' ')}
                                                    style={{
                                                        height:
                                                            `${height}%`,
                                                    }}
                                                    title={`${bar.label}: ${value}`}
                                                />

                                            </div>

                                        )

                                    })}

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            X AXIS
                        ================================================= */}

                        <div className="
                            mt-2
                            flex
                            gap-4
                            px-3
                        ">

                            {weeklyData.map((item) => (

                                <div
                                    key={item.date}
                                    className="
                                        min-w-[60px]
                                        flex-1
                                        text-center
                                        text-[10px]
                                        text-base-content/40
                                    "
                                >

                                    Week of{' '}
                                    {formatDate(item.date)}

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            TOTALS
                        ================================================= */}

                        <div className="
                            mt-5
                            grid
                            grid-cols-2
                            gap-3
                            sm:grid-cols-3
                            lg:grid-cols-6
                        ">

                            <Summary
                                label="Received"
                                value={totals.received}
                                color="text-blue-500"
                            />

                            <Summary
                                label="Outgoing"
                                value={totals.outgoing}
                                color="text-violet-500"
                            />

                            <Summary
                                label="Answered"
                                value={totals.answered}
                                color="text-[#6FA800]"
                            />

                            <Summary
                                label="Missed"
                                value={totals.missed}
                                color="text-red-500"
                            />

                            <Summary
                                label="Unique Missed"
                                value={totals.uniqueMissed}
                                color="text-orange-500"
                            />

                            <Summary
                                label="Applications"
                                value={totals.applications}
                                color="text-cyan-500"
                            />

                        </div>

                    </div>

                ) : (

                    <div className="
                        flex
                        h-[300px]
                        items-center
                        justify-center
                        text-center
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-base-content/60
                            ">
                                No weekly call data
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-base-content/40
                            ">
                                Try changing the selected date range or filters.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>

    )

}


// =============================================================
// SUMMARY
// =============================================================

function Summary({
    label,
    value,
    color,
}) {

    return (

        <div className="
            rounded-lg
            border
            border-base-300
            bg-base-200/30
            px-3
            py-2.5
        ">

            <p className="
                text-[10px]
                text-base-content/45
            ">
                {label}
            </p>

            <p className={[
                'mt-0.5',
                'text-sm',
                'font-semibold',
                color,
            ].join(' ')}>
                {value.toLocaleString()}
            </p>

        </div>

    )

}


export default WeeklyCallTrend