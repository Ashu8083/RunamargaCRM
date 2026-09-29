// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/RmCallTrend.jsx

import { useMemo, useState } from 'react'

import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// HELPERS
// =============================================================

const formatDate = (date) => {

    if (!date) return '—'

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


const formatNumber = (value) =>
    Number(value || 0).toLocaleString('en-IN')


// =============================================================
// GRAPH CONFIG
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
// RM CALL TREND
// =============================================================

function RmCallTrend({
    calls = [],
}) {

    const [view, setView] =
        useState('daily')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // FILTER DATE
    // =========================================================

    const dateFilteredCalls = useMemo(() => {

        return calls.filter((call) => {

            const date =
                call.date ||
                call.createdAt?.slice(0, 10)

            if (!date) {
                return false
            }

            return (
                (!fromDate || date >= fromDate) &&
                (!toDate || date <= toDate)
            )

        })

    }, [
        calls,
        fromDate,
        toDate,
    ])


    // =========================================================
    // GROUP BY RM
    // =========================================================

    const rmData = useMemo(() => {

        const grouped = {}


        dateFilteredCalls.forEach((call) => {

            const rmId =
                call.rmId ??
                call.rmName ??
                'unknown'


            if (!grouped[rmId]) {

                grouped[rmId] = {
                    id: rmId,
                    name:
                        call.rmName ||
                        `RM ${rmId}`,

                    teamLead:
                        call.teamLeadName ||
                        '—',

                    total: 0,
                    received: 0,
                    called: 0,
                    missed: 0,
                    uniqueMissed: 0,
                    applications: 0,
                }

            }


            const item =
                grouped[rmId]


            item.total += 1


            const type =
                String(
                    call.type || ''
                )
                    .trim()
                    .toLowerCase()


            const status =
                String(
                    call.status || ''
                )
                    .trim()
                    .toLowerCase()


            // -------------------------------------------------
            // RECEIVED
            // -------------------------------------------------

            if (
                type === 'incoming' &&
                status === 'received'
            ) {

                item.received += 1

            }


            // -------------------------------------------------
            // CALLED
            // -------------------------------------------------

            if (
                type === 'outgoing' &&
                status !== 'missed'
            ) {

                item.called += 1

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
            // UNIQUE MISSED
            // -------------------------------------------------

            if (call.uniqueMissed) {

                item.uniqueMissed += 1

            }


            // -------------------------------------------------
            // APPLICATION
            // -------------------------------------------------

            if (call.applicationCreated) {

                item.applications += 1

            }

        })


        return Object.values(grouped)
            .sort(
                (a, b) =>
                    b.total - a.total
            )

    }, [
        dateFilteredCalls,
    ])


    // =========================================================
    // MAX VALUE
    // =========================================================

    const maxValue =
        Math.max(
            ...rmData.map((item) =>
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
                sm:px-5
                md:flex-row
                md:items-center
                md:justify-between
            ">

                <div className="min-w-0">

                    <h2 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        RM Call Performance
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/45
                    ">
                        Calls, missed calls and applications by RM.
                    </p>

                </div>


                {/* DAILY / MONTHLY */}

                <div className="
                    flex
                    shrink-0
                    rounded-lg
                    border
                    border-base-300
                    bg-base-200/40
                    p-1
                ">

                    <button
                        type="button"
                        onClick={() =>
                            setView('daily')
                        }
                        className={[
                            'rounded-md',
                            'px-3',
                            'py-1.5',
                            'text-xs',
                            'font-medium',
                            'transition',
                            view === 'daily'
                                ? 'bg-base-100 text-base-content shadow-sm'
                                : 'text-base-content/50 hover:text-base-content',
                        ].join(' ')}
                    >
                        Daily
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setView('monthly')
                        }
                        className={[
                            'rounded-md',
                            'px-3',
                            'py-1.5',
                            'text-xs',
                            'font-medium',
                            'transition',
                            view === 'monthly'
                                ? 'bg-base-100 text-base-content shadow-sm'
                                : 'text-base-content/50 hover:text-base-content',
                        ].join(' ')}
                    >
                        Monthly
                    </button>

                </div>

            </div>


            {/* =================================================
                DATE FILTER
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

            <div className="
                overflow-x-auto
                px-4
                py-5
                sm:px-5
            ">

                {rmData.length ? (

                    <div className="
                        min-w-[760px]
                    ">

                        {/* GRAPH */}

                        <div className="
                            flex
                            h-[320px]
                            gap-3
                        ">

                            {/* Y AXIS */}

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

                                <span>0</span>

                            </div>


                            {/* GRAPH BODY */}

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


                                {/* BARS */}

                                <div className="
                                    absolute
                                    inset-0
                                    flex
                                    items-end
                                    gap-5
                                    px-3
                                ">

                                    {rmData.map((item) => (

                                        <div
                                            key={item.id}
                                            className="
                                                group
                                                relative
                                                flex
                                                h-full
                                                min-w-[90px]
                                                flex-1
                                                items-end
                                                justify-center
                                            "
                                        >

                                            {/* TOOLTIP */}

                                            <div className="
                                                pointer-events-none
                                                absolute
                                                bottom-2
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
                                                text-left
                                                shadow-xl
                                                group-hover:block
                                            ">

                                                <p className="
                                                    mb-2
                                                    text-xs
                                                    font-semibold
                                                    text-base-content
                                                ">
                                                    {item.name}
                                                </p>

                                                <div className="
                                                    space-y-1
                                                    text-[10px]
                                                    text-base-content/60
                                                ">

                                                    <div className="flex justify-between">
                                                        <span>Total</span>
                                                        <b>{item.total}</b>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span>Received</span>
                                                        <b>{item.received}</b>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span>Called</span>
                                                        <b>{item.called}</b>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span>Missed</span>
                                                        <b>{item.missed}</b>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span>Unique Missed</span>
                                                        <b>{item.uniqueMissed}</b>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span>Applications</span>
                                                        <b>{item.applications}</b>
                                                    </div>

                                                </div>

                                            </div>


                                            {/* BAR GROUP */}

                                            <div className="
                                                flex
                                                h-full
                                                w-full
                                                max-w-[110px]
                                                items-end
                                                justify-center
                                                gap-1
                                            ">

                                                {METRICS.map(
                                                    (metric) => {

                                                        const value =
                                                            item[
                                                                metric.key
                                                            ]


                                                        const height =
                                                            value > 0
                                                                ? Math.max(
                                                                    (
                                                                        value /
                                                                        maxValue
                                                                    ) *
                                                                    100,
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
                                                                        'max-w-[10px]',
                                                                        'rounded-t-sm',
                                                                        metric.color,
                                                                        'opacity-80',
                                                                        'transition-all',
                                                                        'group-hover:opacity-100',
                                                                    ].join(' ')}
                                                                    style={{
                                                                        height:
                                                                            `${height}%`,
                                                                    }}
                                                                    title={`${metric.label}: ${value}`}
                                                                />

                                                            </div>

                                                        )

                                                    }
                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            X AXIS
                        ================================================= */}

                        <div className="
                            mt-2
                            flex
                            gap-5
                            pl-[52px]
                        ">

                            {rmData.map((item) => (

                                <div
                                    key={item.id}
                                    className="
                                        min-w-[90px]
                                        flex-1
                                        text-center
                                    "
                                >

                                    <p className="
                                        truncate
                                        text-[10px]
                                        font-medium
                                        text-base-content/60
                                    ">
                                        {item.name}
                                    </p>

                                    <p className="
                                        mt-0.5
                                        truncate
                                        text-[9px]
                                        text-base-content/35
                                    ">
                                        {item.teamLead}
                                    </p>

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div className="
                            mt-5
                            grid
                            grid-cols-2
                            gap-2
                            sm:grid-cols-3
                            lg:grid-cols-6
                        ">

                            {METRICS.map((metric) => {

                                const total =
                                    rmData.reduce(
                                        (sum, item) =>
                                            sum +
                                            Number(
                                                item[
                                                    metric.key
                                                ] || 0
                                            ),
                                        0
                                    )


                                return (

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
                                            {formatNumber(total)}
                                        </p>

                                    </div>

                                )

                            })}

                        </div>

                    </div>

                ) : (

                    <div className="
                        flex
                        h-[320px]
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
                                No RM call data
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

            </div>

        </section>

    )

}


export default RmCallTrend