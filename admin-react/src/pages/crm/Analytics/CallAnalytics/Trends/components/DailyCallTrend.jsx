// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/DailyCallTrend.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'

import { fetchDailyCallTrend } from '../api/DailyCallTrend'


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) =>
    Number(value || 0).toLocaleString('en-IN')


const formatDate = (date) => {
    if (!date) return '—'

    const parsed = new Date(`${date}T00:00:00`)

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
// METRICS
// =============================================================

const METRICS = [
    {
        key: 'total',
        label: 'Total Calls',
        color: 'bg-slate-500',
    },
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
// DAILY CALL TREND
// =============================================================

function DailyCallTrend({
    contextId = '',
}) {

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const [trendData, setTrendData] = useState([])

    const [summary, setSummary] = useState({
        total: 0,
        received: 0,
        called: 0,
        missed: 0,
        uniqueMissed: 0,
        applications: 0,
    })

    const [loading, setLoading] = useState(false)


    // =========================================================
    // FETCH DAILY TREND
    // =========================================================

    const loadData = useCallback(async () => {

        try {

            setLoading(true)

            const response = await fetchDailyCallTrend({
                fromDate: fromDate || '',
                toDate: toDate || '',
                contextId: contextId || '',
            })


            setTrendData(
                Array.isArray(response?.trends)
                    ? response.trends
                    : []
            )


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

        } catch (error) {

            console.error(
                'Failed to fetch daily call trend:',
                error
            )

            setTrendData([])

            setSummary({
                total: 0,
                received: 0,
                called: 0,
                missed: 0,
                uniqueMissed: 0,
                applications: 0,
            })

        } finally {

            setLoading(false)

        }

    }, [
        fromDate,
        toDate,
        contextId,
    ])


    // =========================================================
    // LOAD WHEN FILTERS CHANGE
    // =========================================================

    useEffect(() => {
        loadData()
    }, [loadData])


    // =========================================================
    // NORMALIZED DATA
    // =========================================================

    const dailyData = useMemo(() => {

        return trendData.map((item) => ({
            date: item.date,

            total: Number(item.total || 0),

            received: Number(item.received || 0),

            called: Number(item.called || 0),

            missed: Number(item.missed || 0),

            uniqueMissed: Number(
                item.uniqueMissed || 0
            ),

            applications: Number(
                item.applications || 0
            ),
        }))

    }, [trendData])


    // =========================================================
    // MAX VALUE
    // =========================================================

    const maxValue = useMemo(() => {

        if (!dailyData.length) {
            return 1
        }

        return Math.max(
            ...dailyData.map((item) =>
                Math.max(
                    item.total,
                    item.received,
                    item.called,
                    item.missed,
                    item.uniqueMissed,
                    item.applications
                )
            ),
            1
        )

    }, [dailyData])


    // =========================================================
    // GRAPH WIDTH
    // =========================================================

    const graphWidth = Math.max(
        dailyData.length * 90,
        720
    )


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
                        Daily Call Trend
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/45
                    ">
                        Day-by-day call and application activity.
                    </p>

                </div>


                <div className="
                    text-xs
                    text-base-content/45
                ">

                    {dailyData.length}{' '}

                    {dailyData.length === 1
                        ? 'day'
                        : 'days'}

                </div>

            </div>


            {/* =================================================
                DATE RANGE
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


                {/* FROM */}

                <div>

                    <label className="
                        mb-1.5
                        block
                        text-xs
                        font-medium
                        text-base-content/60
                    ">
                        From
                    </label>

                    <input
                        type="date"
                        value={fromDate}
                        max={toDate || undefined}
                        onChange={(event) =>
                            setFromDate(
                                event.target.value
                            )
                        }
                        className="
                            input
                            input-bordered
                            h-9
                            min-h-9
                            w-full
                            text-xs
                        "
                    />

                </div>


                {/* TO */}

                <div>

                    <label className="
                        mb-1.5
                        block
                        text-xs
                        font-medium
                        text-base-content/60
                    ">
                        To
                    </label>

                    <input
                        type="date"
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={(event) =>
                            setToDate(
                                event.target.value
                            )
                        }
                        className="
                            input
                            input-bordered
                            h-9
                            min-h-9
                            w-full
                            text-xs
                        "
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
                px-4
                py-3
                sm:px-5
            ">

                {METRICS.map((metric) => (

                    <div
                        key={metric.key}
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-base-content/55
                        "
                    >

                        <span
                            className={[
                                'h-2.5',
                                'w-2.5',
                                'rounded-sm',
                                metric.color,
                            ].join(' ')}
                        />

                        {metric.label}

                    </div>

                ))}

            </div>


            {/* =================================================
                GRAPH
            ================================================= */}

            {loading ? (

                <div className="
                    flex
                    h-[320px]
                    items-center
                    justify-center
                    text-xs
                    text-base-content/45
                ">
                    Loading daily call trend...
                </div>

            ) : dailyData.length ? (

                <div className="
                    w-full
                    overflow-x-auto
                    px-4
                    py-5
                    sm:px-5
                ">

                    <div
                        style={{
                            width: `${graphWidth}px`,
                        }}
                    >

                        {/* =========================================
                            GRAPH AREA
                        ========================================= */}

                        <div className="
                            flex
                            h-[320px]
                            gap-3
                        ">


                            {/* =====================================
                                Y AXIS
                            ===================================== */}

                            <div className="
                                flex
                                w-10
                                shrink-0
                                flex-col
                                justify-between
                                pb-1
                                text-right
                                text-[10px]
                                text-base-content/35
                            ">

                                <span>
                                    {formatNumber(maxValue)}
                                </span>

                                <span>
                                    {formatNumber(
                                        Math.round(
                                            maxValue * 0.75
                                        )
                                    )}
                                </span>

                                <span>
                                    {formatNumber(
                                        Math.round(
                                            maxValue * 0.5
                                        )
                                    )}
                                </span>

                                <span>
                                    {formatNumber(
                                        Math.round(
                                            maxValue * 0.25
                                        )
                                    )}
                                </span>

                                <span>
                                    0
                                </span>

                            </div>


                            {/* =====================================
                                GRAPH BODY
                            ===================================== */}

                            <div className="
                                relative
                                min-w-0
                                flex-1
                            ">


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


                                {/* =================================
                                    DAYS
                                ================================= */}

                                <div className="
                                    absolute
                                    inset-0
                                    flex
                                    items-end
                                ">

                                    {dailyData.map(
                                        (item) => (

                                            <div
                                                key={item.date}
                                                className="
                                                    group
                                                    relative
                                                    flex
                                                    h-full
                                                    w-[90px]
                                                    shrink-0
                                                    items-end
                                                    justify-center
                                                    px-2
                                                "
                                            >


                                                {/* =====================
                                                    TOOLTIP
                                                ===================== */}

                                                <div className="
                                                    pointer-events-none
                                                    absolute
                                                    bottom-4
                                                    left-1/2
                                                    z-30
                                                    hidden
                                                    w-44
                                                    -translate-x-1/2
                                                    rounded-lg
                                                    border
                                                    border-base-300
                                                    bg-base-100
                                                    p-3
                                                    shadow-xl
                                                    group-hover:block
                                                ">

                                                    <p className="
                                                        mb-2
                                                        text-xs
                                                        font-semibold
                                                        text-base-content
                                                    ">
                                                        {formatDate(
                                                            item.date
                                                        )}
                                                    </p>


                                                    {METRICS.map(
                                                        (metric) => (

                                                            <div
                                                                key={
                                                                    metric.key
                                                                }
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    gap-3
                                                                    py-0.5
                                                                    text-[10px]
                                                                "
                                                            >

                                                                <div className="
                                                                    flex
                                                                    items-center
                                                                    gap-1.5
                                                                    text-base-content/60
                                                                ">

                                                                    <span
                                                                        className={[
                                                                            'h-1.5',
                                                                            'w-1.5',
                                                                            'rounded-full',
                                                                            metric.color,
                                                                        ].join(' ')}
                                                                    />

                                                                    {
                                                                        metric.label
                                                                    }

                                                                </div>


                                                                <span className="
                                                                    font-semibold
                                                                    text-base-content
                                                                ">

                                                                    {
                                                                        item[
                                                                            metric.key
                                                                        ]
                                                                    }

                                                                </span>

                                                            </div>

                                                        )
                                                    )}

                                                </div>


                                                {/* =====================
                                                    BAR GROUP
                                                ===================== */}

                                                <div className="
                                                    flex
                                                    h-full
                                                    w-full
                                                    items-end
                                                    justify-center
                                                    gap-1
                                                ">

                                                    {METRICS.map(
                                                        (metric) => {

                                                            const value =
                                                                Number(
                                                                    item[
                                                                        metric.key
                                                                    ] || 0
                                                                )


                                                            const height =
                                                                value > 0
                                                                    ? Math.max(
                                                                        (
                                                                            value /
                                                                            maxValue
                                                                        ) * 100,
                                                                        2
                                                                    )
                                                                    : 1


                                                            return (

                                                                <div
                                                                    key={
                                                                        metric.key
                                                                    }
                                                                    className="
                                                                        flex
                                                                        h-full
                                                                        flex-1
                                                                        items-end
                                                                        justify-center
                                                                    "
                                                                >

                                                                    <div
                                                                        className={[
                                                                            'w-full',
                                                                            'max-w-[9px]',
                                                                            'rounded-t-sm',
                                                                            metric.color,
                                                                            'opacity-80',
                                                                            'transition',
                                                                            'group-hover:opacity-100',
                                                                        ].join(' ')}
                                                                        style={{
                                                                            height:
                                                                                `${height}%`,
                                                                        }}
                                                                        title={
                                                                            `${metric.label}: ${value}`
                                                                        }
                                                                    />

                                                                </div>

                                                            )

                                                        }
                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* =========================================
                            DATE / X AXIS
                        ========================================= */}

                        <div className="
                            flex
                            pl-[52px]
                            pt-2
                        ">

                            {dailyData.map(
                                (item) => (

                                    <div
                                        key={item.date}
                                        className="
                                            w-[90px]
                                            shrink-0
                                            text-center
                                        "
                                    >

                                        <span className="
                                            text-[10px]
                                            font-medium
                                            text-base-content/55
                                        ">
                                            {formatDate(
                                                item.date
                                            )}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            ) : (

                <div className="
                    flex
                    h-[320px]
                    items-center
                    justify-center
                    px-4
                    text-center
                ">

                    <div>

                        <p className="
                            text-sm
                            font-medium
                            text-base-content/60
                        ">
                            No daily call data
                        </p>

                        <p className="
                            mt-1
                            text-xs
                            text-base-content/40
                        ">
                            Try changing the selected filters or date range.
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            {dailyData.length > 0 && (

                <div className="
                    border-t
                    border-base-300
                    px-4
                    py-4
                    sm:px-5
                ">

                    <div className="
                        grid
                        grid-cols-2
                        gap-2
                        sm:grid-cols-3
                        lg:grid-cols-6
                    ">

                        {METRICS.map((metric) => (

                            <div
                                key={metric.key}
                                className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-200/20
                                    px-3
                                    py-2.5
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
                                            'rounded-full',
                                            metric.color,
                                        ].join(' ')}
                                    />

                                    <span className="
                                        truncate
                                        text-[10px]
                                        text-base-content/45
                                    ">
                                        {metric.label}
                                    </span>

                                </div>


                                <p className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-base-content
                                ">
                                    {formatNumber(
                                        summary[metric.key]
                                    )}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </section>

    )

}


export default DailyCallTrend