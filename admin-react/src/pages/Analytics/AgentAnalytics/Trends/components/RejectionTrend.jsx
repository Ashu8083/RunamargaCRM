// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/RejectionTrend.jsx

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('en-IN')
}


const formatDate = (date) => {

    if (!date) {
        return ''
    }

    const parsedDate =
        new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }

    return parsedDate.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
        }
    )

}


const getRejectedValue = (item) => {

    const value =
        item?.rejected ??
        item?.rejectedCount ??
        item?.rejectedApplications ??
        item?.rejections ??
        0

    return Number(value) || 0

}


// =============================================================
// BUILD CHART DATA
// =============================================================

const buildChartData = (analytics) => {

    const grouped = {}


    analytics.forEach((item) => {

        if (!item?.date) {
            return
        }


        const date =
            item.date


        if (!grouped[date]) {

            grouped[date] = {
                date,
                displayDate: formatDate(date),
                rejected: 0,
            }

        }


        grouped[date].rejected +=
            getRejectedValue(item)

    })


    return Object.values(grouped)
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        )

}


// =============================================================
// TOOLTIP
// =============================================================

function RejectionTooltip({
    active,
    payload,
    label,
}) {

    if (
        !active ||
        !payload?.length
    ) {
        return null
    }


    return (

        <div className="
            min-w-[160px]
            rounded-xl
            border
            border-base-300
            bg-base-100
            px-3
            py-3
            shadow-xl
        ">

            <p className="
                mb-2
                text-xs
                font-semibold
                text-base-content
            ">
                {label}
            </p>


            <div className="
                flex
                items-center
                justify-between
                gap-5
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <span className="
                        h-2
                        w-2
                        rounded-full
                        bg-[#D92D20]
                    " />

                    <span className="
                        text-xs
                        text-base-content/55
                    ">
                        Rejected
                    </span>

                </div>


                <span className="
                    text-sm
                    font-semibold
                    text-base-content
                ">
                    {formatNumber(
                        payload[0].value
                    )}
                </span>

            </div>

        </div>

    )

}


// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState() {

    return (

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
                    text-base-content/50
                ">
                    No rejection data available
                </p>


                <p className="
                    mt-1
                    text-xs
                    text-base-content/35
                ">
                    Try changing the selected filters
                </p>

            </div>

        </div>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function RejectionTrend({
    analytics = [],
}) {

    const chartData =
        buildChartData(analytics)


    const totalRejected =
        chartData.reduce(
            (total, item) =>
                total + item.rejected,
            0
        )


    const highestRejected =
        chartData.reduce(
            (highest, item) =>
                Math.max(
                    highest,
                    item.rejected
                ),
            0
        )


    return (

        <section className="
            w-full
            min-w-0
            overflow-hidden
            rounded-2xl
            border
            border-base-300
            bg-base-100
            p-4
            shadow-sm
            sm:p-5
        ">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                flex-wrap
                items-start
                justify-between
                gap-3
            ">

                <div className="min-w-0">

                    <h2 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Rejection Trend
                    </h2>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Rejected applications over time
                    </p>

                </div>


                {chartData.length > 0 && (

                    <div className="
                        rounded-lg
                        bg-[#D92D20]/5
                        px-3
                        py-2
                    ">

                        <p className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-base-content/40
                        ">
                            Total Rejected
                        </p>


                        <p className="
                            mt-0.5
                            text-sm
                            font-semibold
                            text-[#D92D20]
                        ">
                            {formatNumber(
                                totalRejected
                            )}
                        </p>

                    </div>

                )}

            </div>


            {/* =================================================
                CHART
            ================================================= */}

            {chartData.length === 0 ? (

                <EmptyState />

            ) : (

                <div className="
                    mt-5
                    h-[320px]
                    w-full
                    overflow-x-auto
                ">

                    <div
                        className="
                            h-full
                            min-w-[600px]
                        "
                        style={{
                            width:
                                chartData.length > 12
                                    ? `${Math.max(
                                        100,
                                        chartData.length * 65
                                    )}%`
                                    : '100%',
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >

                                <defs>

                                    <linearGradient
                                        id="rejectionGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >

                                        <stop
                                            offset="0%"
                                            stopColor="#D92D20"
                                            stopOpacity={0.22}
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#D92D20"
                                            stopOpacity={0.02}
                                        />

                                    </linearGradient>

                                </defs>


                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(0,0,0,0.08)"
                                />


                                <XAxis
                                    dataKey="displayDate"
                                    tick={{
                                        fontSize: 11,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={20}
                                />


                                <YAxis
                                    tick={{
                                        fontSize: 11,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={42}
                                    tickFormatter={
                                        formatNumber
                                    }
                                    domain={[
                                        0,
                                        (
                                            dataMax
                                        ) => {

                                            if (
                                                !Number.isFinite(
                                                    dataMax
                                                ) ||
                                                dataMax <= 0
                                            ) {
                                                return 10
                                            }

                                            return Math.ceil(
                                                dataMax * 1.2
                                            )

                                        },
                                    ]}
                                />


                                <Tooltip
                                    content={
                                        <RejectionTooltip />
                                    }
                                    cursor={{
                                        stroke:
                                            '#D92D20',
                                        strokeOpacity:
                                            0.25,
                                        strokeDasharray:
                                            '4 4',
                                    }}
                                />


                                <Area
                                    type="monotone"
                                    dataKey="rejected"
                                    name="Rejected"
                                    stroke="#D92D20"
                                    strokeWidth={2.5}
                                    fill="url(#rejectionGradient)"
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                    connectNulls
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            {chartData.length > 0 && (

                <div className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-base-300
                    pt-4
                ">

                    <div>

                        <p className="
                            text-[10px]
                            uppercase
                            tracking-wide
                            text-base-content/40
                        ">
                            Period
                        </p>


                        <p className="
                            mt-0.5
                            text-xs
                            font-medium
                            text-base-content/70
                        ">
                            {chartData.length}{' '}
                            {chartData.length === 1
                                ? 'day'
                                : 'days'}
                        </p>

                    </div>


                    <div className="
                        text-right
                    ">

                        <p className="
                            text-[10px]
                            uppercase
                            tracking-wide
                            text-base-content/40
                        ">
                            Highest Daily Rejection
                        </p>


                        <p className="
                            mt-0.5
                            text-xs
                            font-semibold
                            text-[#D92D20]
                        ">
                            {formatNumber(
                                highestRejected
                            )}
                        </p>

                    </div>

                </div>

            )}

        </section>

    )

}


export default RejectionTrend