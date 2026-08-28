// admin-react/src/pages/CallManagement/CallAnalytics/Overview/components/CallActivityGraph.jsx

import { useMemo } from 'react'

import ArrowDownLeftIcon from '@heroicons/react/24/outline/ArrowDownLeftIcon'
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'


// =============================================================
// DATE LABEL
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
// BAR CONFIG
// =============================================================

const BAR_CONFIG = [
    {
        key: 'incoming',
        label: 'Incoming',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        icon: ArrowDownLeftIcon,
    },

    {
        key: 'outgoing',
        label: 'Outgoing',
        color: 'bg-violet-500',
        textColor: 'text-violet-600',
        icon: ArrowUpRightIcon,
    },

    {
        key: 'missed',
        label: 'Missed',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        icon: PhoneXMarkIcon,
    },

    {
        key: 'answered',
        label: 'Answered',
        color: 'bg-[#8BCF00]',
        textColor: 'text-[#6FA800]',
        icon: CheckCircleIcon,
    },
]


// =============================================================
// ACTIVITY GRAPH
// =============================================================

function CallActivityGraph({
    calls = [],
}) {

    // =========================================================
    // GROUP CALLS BY DATE
    // =========================================================

    const graphData = useMemo(() => {

        if (
            !Array.isArray(calls) ||
            calls.length === 0
        ) {
            return []
        }


        const grouped = {}


        calls.forEach((call) => {

            const date =
                call.date ||
                call.createdAt?.slice(0, 10)


            if (!date) {
                return
            }


            if (!grouped[date]) {

                grouped[date] = {
                    date,
                    incoming: 0,
                    outgoing: 0,
                    missed: 0,
                    answered: 0,
                }

            }


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
            // INCOMING
            // -------------------------------------------------

            if (
                type === 'incoming'
            ) {

                grouped[date].incoming += 1

            }


            // -------------------------------------------------
            // OUTGOING
            // -------------------------------------------------

            if (
                type === 'outgoing'
            ) {

                grouped[date].outgoing += 1

            }


            // -------------------------------------------------
            // MISSED
            // -------------------------------------------------

            if (
                type === 'missed' ||
                status === 'missed'
            ) {

                grouped[date].missed += 1

            }


            // -------------------------------------------------
            // ANSWERED
            // -------------------------------------------------

            if (
                status === 'received' ||
                status === 'answered'
            ) {

                grouped[date].answered += 1

            }

        })


        return Object.values(grouped)
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            )

    }, [
        calls,
    ])


    // =========================================================
    // MAX VALUE
    // =========================================================

    const maxValue =
        Math.max(
            ...graphData.map(
                (item) =>
                    Math.max(
                        item.incoming,
                        item.outgoing,
                        item.missed,
                        item.answered
                    )
            ),
            1
        )


    const graphHeight = 240


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
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
                border-b
                border-base-300
                px-5
                py-4
            ">

                <h2 className="
                    text-sm
                    font-semibold
                    text-base-content
                ">
                    Call Activity
                </h2>


                <p className="
                    mt-0.5
                    text-xs
                    text-base-content/45
                ">
                    Call activity based on the selected filters.
                </p>

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div className="
                flex
                flex-wrap
                gap-x-6
                gap-y-2
                border-b
                border-base-300
                px-5
                py-3
            ">

                {BAR_CONFIG.map(
                    (bar) => {

                        const Icon =
                            bar.icon


                        return (

                            <div
                                key={
                                    bar.key
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    text-xs
                                    text-base-content/60
                                "
                            >

                                <span
                                    className={[
                                        'h-2.5',
                                        'w-2.5',
                                        'rounded-sm',
                                        bar.color,
                                    ].join(' ')}
                                />


                                <Icon className="
                                    h-3.5
                                    w-3.5
                                " />


                                <span>
                                    {
                                        bar.label
                                    }
                                </span>

                            </div>

                        )

                    }
                )}

            </div>


            {/* =================================================
                GRAPH
            ================================================= */}

            <div className="
                overflow-x-auto
                px-5
                py-5
            ">

                {graphData.length ? (

                    <div className="
                        min-w-[650px]
                    ">


                        {/* =========================================
                            GRAPH AREA
                        ========================================= */}

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
                                height:
                                    `${graphHeight}px`,
                            }}
                        >


                            {/* =====================================
                                GRID LINES
                            ===================================== */}

                            <div className="
                                pointer-events-none
                                absolute
                                inset-x-0
                                top-0
                                flex
                                h-full
                                flex-col
                                justify-between
                            ">

                                {[0, 1, 2, 3, 4].map(
                                    (line) => (

                                        <div
                                            key={
                                                line
                                            }
                                            className="
                                                w-full
                                                border-t
                                                border-dashed
                                                border-base-300
                                            "
                                        />

                                    )
                                )}

                            </div>


                            {/* =====================================
                                DATE GROUPS
                            ===================================== */}

                            {graphData.map(
                                (item) => (

                                    <div
                                        key={
                                            item.date
                                        }
                                        className="
                                            relative
                                            z-10
                                            flex
                                            h-full
                                            min-w-[55px]
                                            flex-1
                                            items-end
                                            justify-center
                                            gap-1
                                        "
                                    >


                                        {/* =================================
                                            BARS
                                        ================================= */}

                                        {BAR_CONFIG.map(
                                            (bar) => {

                                                const value =
                                                    item[
                                                        bar.key
                                                    ]


                                                const height =
                                                    value > 0
                                                        ? Math.max(
                                                            (
                                                                value /
                                                                maxValue
                                                            ) *
                                                            graphHeight,
                                                            8
                                                        )
                                                        : 2


                                                return (

                                                    <div
                                                        key={
                                                            bar.key
                                                        }
                                                        className="
                                                            relative
                                                            flex
                                                            h-full
                                                            w-3
                                                            items-end
                                                            justify-center
                                                        "
                                                    >


                                                        {/* =================================
                                                            COUNT
                                                        ================================= */}

                                                        <span
                                                            className={[
                                                                'absolute',
                                                                'z-20',
                                                                'whitespace-nowrap',
                                                                'text-[10px]',
                                                                'font-semibold',
                                                                bar.textColor,
                                                            ].join(' ')}
                                                            style={{
                                                                bottom:
                                                                    `${height + 5}px`,
                                                            }}
                                                        >
                                                            {
                                                                value
                                                            }
                                                        </span>


                                                        {/* =================================
                                                            BAR
                                                        ================================= */}

                                                        <div
                                                            className={[
                                                                'w-2.5',
                                                                'rounded-t',
                                                                bar.color,
                                                                'opacity-85',
                                                                'transition-all',
                                                                'hover:opacity-100',
                                                            ].join(' ')}
                                                            style={{
                                                                height:
                                                                    `${height}px`,
                                                            }}
                                                            title={`${bar.label}: ${value}`}
                                                        />

                                                    </div>

                                                )

                                            }
                                        )}

                                    </div>

                                )
                            )}

                        </div>


                        {/* =========================================
                            X AXIS
                        ========================================= */}

                        <div className="
                            mt-2
                            flex
                            gap-4
                            px-3
                        ">

                            {graphData.map(
                                (item) => (

                                    <div
                                        key={
                                            item.date
                                        }
                                        className="
                                            min-w-[55px]
                                            flex-1
                                            text-center
                                            text-[10px]
                                            text-base-content/40
                                        "
                                    >

                                        {
                                            formatDate(
                                                item.date
                                            )
                                        }

                                    </div>

                                )
                            )}

                        </div>


                        {/* =========================================
                            SUMMARY
                        ========================================= */}

                        <div className="
                            mt-5
                            flex
                            flex-wrap
                            justify-center
                            gap-x-6
                            gap-y-2
                        ">

                            {BAR_CONFIG.map(
                                (bar) => {

                                    const total =
                                        graphData.reduce(
                                            (
                                                sum,
                                                item
                                            ) =>
                                                sum +
                                                item[
                                                    bar.key
                                                ],
                                            0
                                        )


                                    return (

                                        <div
                                            key={
                                                bar.key
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-1.5
                                                text-[10px]
                                                text-base-content/50
                                            "
                                        >

                                            <span
                                                className={[
                                                    'h-2.5',
                                                    'w-2.5',
                                                    'rounded-sm',
                                                    bar.color,
                                                ].join(' ')}
                                            />


                                            <span>
                                                {
                                                    bar.label
                                                }:
                                            </span>


                                            <span className="
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                {
                                                    total
                                                }
                                            </span>

                                        </div>

                                    )

                                }
                            )}

                        </div>


                        {/* =========================================
                            TOTAL RECORDS
                        ========================================= */}

                        <div className="
                            mt-3
                            text-center
                            text-[10px]
                            text-base-content/35
                        ">
                            Showing {calls.length} call records
                        </div>

                    </div>

                ) : (

                    <div className="
                        flex
                        h-[280px]
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
                                No call activity
                            </p>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/40
                            ">
                                Try changing the selected filters.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>

    )

}


export default CallActivityGraph