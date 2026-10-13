// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/MonthlyCallTrend.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchMonthlyCallOverview } from '../api/MonthlyCallTrend'


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) =>
    Number(value || 0).toLocaleString('en-IN')


const formatMonth = (month) => {

    const date = new Date(
        `${month}-01T00:00:00`
    )

    if (Number.isNaN(date.getTime())) {
        return month
    }

    return date.toLocaleDateString(
        'en-IN',
        {
            month: 'short',
        }
    )

}


// =============================================================
// METRICS
// =============================================================

const DONUT_METRICS = [
    {
        key: 'received',
        label: 'Received',
        color: 'bg-emerald-500',
    },
    {
        key: 'called',
        label: 'Called',
        color: 'bg-violet-500',
    },
    {
        key: 'missed',
        label: 'Missed',
        color: 'bg-red-500',
    },
]


const SECONDARY_METRICS = [
    {
        key: 'uniqueMissed',
        label: 'Unique Missed',
        color: 'bg-amber-500',
    },
    {
        key: 'applications',
        label: 'Applications',
        color: 'bg-[#8BCF00]',
    },
]


// =============================================================
// YEAR OPTIONS
// =============================================================

const getYearOptions = () => {

    const currentYear =
        new Date().getFullYear()

    const startYear = 2022

    return Array.from(
        {
            length:
                currentYear -
                startYear +
                1,
        },
        (_, index) =>
            String(
                startYear + index
            )
    ).reverse()

}


// =============================================================
// MONTH OPTIONS
// =============================================================

const MONTHS = [
    {
        value: '01',
        label: 'January',
    },
    {
        value: '02',
        label: 'February',
    },
    {
        value: '03',
        label: 'March',
    },
    {
        value: '04',
        label: 'April',
    },
    {
        value: '05',
        label: 'May',
    },
    {
        value: '06',
        label: 'June',
    },
    {
        value: '07',
        label: 'July',
    },
    {
        value: '08',
        label: 'August',
    },
    {
        value: '09',
        label: 'September',
    },
    {
        value: '10',
        label: 'October',
    },
    {
        value: '11',
        label: 'November',
    },
    {
        value: '12',
        label: 'December',
    },
]


// =============================================================
// DONUT
// =============================================================

function DonutChart({
    received,
    called,
    missed,
    total,
}) {

    const safeTotal =
        Math.max(
            Number(total || 0),
            1
        )


    const receivedPercent =
        (
            Number(received || 0) /
            safeTotal
        ) * 100


    const calledPercent =
        (
            Number(called || 0) /
            safeTotal
        ) * 100


    const missedPercent =
        (
            Number(missed || 0) /
            safeTotal
        ) * 100


    const receivedEnd =
        receivedPercent


    const calledEnd =
        receivedEnd +
        calledPercent


    const missedEnd =
        calledEnd +
        missedPercent


    const gradient = `
        conic-gradient(
            rgb(16 185 129) 0% ${receivedEnd}%,
            rgb(139 92 246) ${receivedEnd}% ${calledEnd}%,
            rgb(239 68 68) ${calledEnd}% ${missedEnd}%,
            rgb(226 232 240) ${missedEnd}% 100%
        )
    `


    return (

        <div className="
            relative
            flex
            h-56
            w-56
            shrink-0
            items-center
            justify-center
            sm:h-64
            sm:w-64
        ">

            {/* DONUT */}

            <div
                className="
                    absolute
                    inset-0
                    rounded-full
                "
                style={{
                    background: gradient,
                }}
            />


            {/* INNER CIRCLE */}

            <div className="
                absolute
                inset-[22%]
                flex
                flex-col
                items-center
                justify-center
                rounded-full
                bg-base-100
                text-center
                shadow-inner
            ">

                <span className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-base-content/40
                ">
                    Total Calls
                </span>


                <span className="
                    mt-1
                    text-2xl
                    font-bold
                    tracking-tight
                    text-base-content
                    sm:text-3xl
                ">
                    {formatNumber(total)}
                </span>


                {/* <span className="
                    mt-0.5
                    text-[10px]
                    text-base-content/40
                ">
                    {formatNumber(
                        Number(received || 0) +
                        Number(called || 0) +
                        Number(missed || 0)
                    )}{' '}
                    tracked
                </span> */}

            </div>

        </div>

    )

}


// =============================================================
// LEGEND ITEM
// =============================================================

function LegendItem({
    label,
    value,
    color,
    total,
}) {

    const percentage =
        total > 0
            ? (
                (
                    Number(value || 0) /
                    total
                ) * 100
            ).toFixed(1)
            : '0.0'


    return (

        <div className="
            rounded-lg
            border
            border-base-300
            bg-base-200/20
            px-3
            py-2.5
        ">

            <div className="
                flex
                items-center
                justify-between
                gap-3
            ">

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                ">

                    <span
                        className={[
                            'h-2.5',
                            'w-2.5',
                            'shrink-0',
                            'rounded-full',
                            color,
                        ].join(' ')}
                    />

                    <span className="
                        truncate
                        text-xs
                        font-medium
                        text-base-content/60
                    ">
                        {label}
                    </span>

                </div>


                <span className="
                    shrink-0
                    text-xs
                    font-semibold
                    text-base-content
                ">
                    {formatNumber(value)}
                </span>

            </div>


            <div className="
                mt-1
                text-[10px]
                text-base-content/35
            ">
                {percentage}% of total
            </div>

        </div>

    )

}


// =============================================================
// MONTHLY CALL TREND
// =============================================================

function MonthlyCallTrend({
    contextId = '',
}) {

    const currentDate =
        new Date()


    const currentYear =
        String(
            currentDate.getFullYear()
        )


    const currentMonth =
        String(
            currentDate.getMonth() + 1
        ).padStart(
            2,
            '0'
        )


    const [year, setYear] =
        useState(currentYear)


    const [month, setMonth] =
        useState(currentMonth)


    // =========================================================
    // API STATE
    // =========================================================

    const [summary, setSummary] =
        useState({
            total: 0,
            received: 0,
            called: 0,
            missed: 0,
            uniqueMissed: 0,
            applications: 0,
        })


    const [records, setRecords] =
        useState(0)


    const [loading, setLoading] =
        useState(false)


    // =========================================================
    // FETCH MONTHLY OVERVIEW
    // =========================================================

    const loadData = useCallback(
        async () => {

            try {

                setLoading(true)


                const response =
                    await fetchMonthlyCallOverview({
                        year,
                        month,
                        contextId:
                            contextId || '',
                    })


                setSummary(
                    response?.summary || {
                        total: 0,
                        received: 0,
                        called: 0,
                        missed: 0,
                        uniqueMissed: 0,
                        applications: 0,
                    }
                )


                setRecords(
                    Number(
                        response?.records || 0
                    )
                )

            } catch (error) {

                console.error(
                    'Failed to fetch monthly call overview:',
                    error
                )


                setSummary({
                    total: 0,
                    received: 0,
                    called: 0,
                    missed: 0,
                    uniqueMissed: 0,
                    applications: 0,
                })


                setRecords(0)

            } finally {

                setLoading(false)

            }

        },
        [
            year,
            month,
            contextId,
        ]
    )


    // =========================================================
    // LOAD WHEN FILTERS CHANGE
    // =========================================================

    useEffect(() => {

        loadData()

    }, [loadData])


    // =========================================================
    // SELECTED MONTH
    // =========================================================

    const selectedMonth =
        useMemo(
            () =>
                MONTHS.find(
                    (item) =>
                        item.value === month
                ),
            [month]
        )


    // =========================================================
    // DONUT TOTAL
    // =========================================================

    const donutTotal =
        Number(summary.received || 0) +
        Number(summary.called || 0) +
        Number(summary.missed || 0)


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="
            w-full
            min-w-0
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
                px-4
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
            ">

                <div>

                    <h2 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Monthly Call Overview
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/45
                    ">
                        Call distribution and processing summary.
                    </p>

                </div>


                <div className="
                    rounded-full
                    bg-base-200
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-base-content/60
                ">
                    {selectedMonth?.label} {year}
                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                gap-3
                border-b
                border-base-300
                px-4
                py-3
                sm:grid-cols-2
                sm:px-5
            ">

                {/* YEAR */}

                <div className="min-w-0">

                    <label className="
                        mb-1.5
                        block
                        text-xs
                        font-medium
                        text-base-content/60
                    ">
                        Year
                    </label>


                    <select
                        value={year}
                        onChange={(event) =>
                            setYear(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            h-9
                            min-h-9
                            w-full
                            text-xs
                        "
                    >

                        {getYearOptions().map(
                            (option) => (

                                <option
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* MONTH */}

                <div className="min-w-0">

                    <label className="
                        mb-1.5
                        block
                        text-xs
                        font-medium
                        text-base-content/60
                    ">
                        Month
                    </label>


                    <select
                        value={month}
                        onChange={(event) =>
                            setMonth(
                                event.target.value
                            )
                        }
                        className="
                            select
                            select-bordered
                            h-9
                            min-h-9
                            w-full
                            text-xs
                        "
                    >

                        {MONTHS.map(
                            (option) => (

                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="
                    border-b
                    border-base-300
                    px-4
                    py-2
                    text-center
                    text-[10px]
                    text-base-content/40
                ">
                    Loading monthly overview...
                </div>

            )}


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="
                grid
                w-full
                min-w-0
                grid-cols-1
                gap-6
                px-4
                py-5
                lg:grid-cols-[auto_minmax(0,1fr)]
                lg:items-center
                lg:px-6
            ">

                {/* =================================================
                    DONUT
                ================================================= */}

                <div className="
                    flex
                    justify-center
                    lg:justify-start
                ">

                    <DonutChart
                        received={
                            summary.received
                        }
                        called={
                            summary.called
                        }
                        missed={
                            summary.missed
                        }
                        total={
                            donutTotal
                        }
                    />

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="
                    min-w-0
                    space-y-4
                ">

                    {/* MAIN METRICS */}

                    <div>

                        <div className="
                            mb-2.5
                            flex
                            items-center
                            justify-between
                        ">

                            <h3 className="
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Call Distribution
                            </h3>

                            <span className="
                                text-[10px]
                                text-base-content/40
                            ">
                                Hover for details
                            </span>

                        </div>


                        <div className="
                            grid
                            grid-cols-1
                            gap-2
                            sm:grid-cols-3
                        ">

                            {DONUT_METRICS.map(
                                (metric) => (

                                    <LegendItem
                                        key={
                                            metric.key
                                        }
                                        label={
                                            metric.label
                                        }
                                        value={
                                            summary[
                                                metric.key
                                            ]
                                        }
                                        color={
                                            metric.color
                                        }
                                        total={
                                            donutTotal
                                        }
                                    />

                                )
                            )}

                        </div>

                    </div>


                    {/* SECONDARY METRICS */}

                    <div>

                        <h3 className="
                            mb-2.5
                            text-xs
                            font-semibold
                            text-base-content
                        ">
                            Processing Indicators
                        </h3>


                        <div className="
                            grid
                            grid-cols-2
                            gap-2
                        ">

                            {SECONDARY_METRICS.map(
                                (metric) => (

                                    <div
                                        key={
                                            metric.key
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-base-300
                                            bg-base-200/20
                                            px-3
                                            py-3
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-center
                                            gap-1.5
                                        ">

                                            <span
                                                className={[
                                                    'h-2',
                                                    'w-2',
                                                    'shrink-0',
                                                    'rounded-full',
                                                    metric.color,
                                                ].join(' ')}
                                            />

                                            <span className="
                                                truncate
                                                text-[10px]
                                                font-medium
                                                text-base-content/45
                                            ">
                                                {
                                                    metric.label
                                                }
                                            </span>

                                        </div>


                                        <p className="
                                            mt-1
                                            text-lg
                                            font-bold
                                            tracking-tight
                                            text-base-content
                                        ">
                                            {formatNumber(
                                                summary[
                                                    metric.key
                                                ]
                                            )}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                FOOTER SUMMARY
            ================================================= */}

            <div className="
                border-t
                border-base-300
                bg-base-200/20
                px-4
                py-3
                sm:px-5
            ">

                <div className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                ">

                    <div className="
                        text-[10px]
                        text-base-content/40
                    ">
                        Showing data for{' '}

                        <span className="
                            font-semibold
                            text-base-content/60
                        ">
                            {formatMonth(
                                `${year}-${month}`
                            )}{' '}
                            {year}
                        </span>
                    </div>


                    <div className="
                        text-[10px]
                        text-base-content/40
                    ">
                        {formatNumber(
                            records
                        )}{' '}
                        records processed
                    </div>

                </div>

            </div>

        </section>

    )

}


export default MonthlyCallTrend