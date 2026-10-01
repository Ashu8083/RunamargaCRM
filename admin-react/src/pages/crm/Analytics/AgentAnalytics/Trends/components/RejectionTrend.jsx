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

const formatNumber = (
    value
) => {

    return Number(
        value || 0
    ).toLocaleString('en-IN')

}


const formatDate = (
    value
) => {

    if (!value) {
        return ''
    }


    const date =
        new Date(
            `${value}T00:00:00`
        )


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value

    }


    return date.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
        }
    )

}


// =============================================================
// NORMALIZE DATA
// =============================================================

const normalizeRejectionTrend = (
    rejectionTrend
) => {

    if (
        !Array.isArray(
            rejectionTrend
        )
    ) {

        return []

    }


    return rejectionTrend
        .map((item) => ({

            date:
                item?.date ??
                null,

            rejected:
                Number(
                    item?.rejected ??
                    0
                ) || 0,

        }))
        .filter(
            (item) =>
                item.date !== null
        )
        .sort(
            (a, b) =>
                String(a.date).localeCompare(
                    String(b.date)
                )
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
            py-2.5
            shadow-xl
        ">

            <p className="
                mb-2
                text-xs
                font-semibold
                text-base-content
            ">
                {formatDate(label)}
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
                        text-[11px]
                        text-base-content/55
                    ">
                        Rejected
                    </span>

                </div>


                <span className="
                    text-xs
                    font-semibold
                    text-base-content
                ">
                    {formatNumber(
                        payload[0]?.value
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
            h-[360px]
            items-center
            justify-center
            text-center
        ">

            <div>

                <div className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-base-200
                ">

                    <div className="
                        h-8
                        w-8
                        rounded-full
                        border-4
                        border-base-300
                    " />

                </div>


                <p className="
                    mt-4
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
    rejectionTrend = [],
}) {

    const data =
        normalizeRejectionTrend(
            rejectionTrend
        )


    const totalRejected =
        data.reduce(
            (
                total,
                item
            ) =>
                total +
                item.rejected,
            0
        )


    const highestRejected =
        data.reduce(
            (
                highest,
                item
            ) =>
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

            <div>

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
                    Daily rejected applications across the selected period
                </p>

            </div>


            {data.length === 0 ? (

                <EmptyState />

            ) : (

                <>

                    {/* =============================================
                        CHART
                    ============================================= */}

                    <div className="
                        mt-4
                        h-[360px]
                        w-full
                    ">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 10,
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    className="
                                        text-base-content/10
                                    "
                                />


                                <XAxis
                                    dataKey="date"
                                    tick={{
                                        fontSize: 10,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={18}
                                    tickFormatter={
                                        formatDate
                                    }
                                />


                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fontSize: 10,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={45}
                                    tickFormatter={
                                        formatNumber
                                    }
                                    domain={[
                                        0,
                                        (dataMax) => {

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
                                    cursor={{
                                        stroke:
                                            'currentColor',
                                        className:
                                            'text-base-content/20',
                                    }}
                                    content={
                                        <RejectionTooltip />
                                    }
                                />


                                <Area
                                    type="monotone"
                                    dataKey="rejected"
                                    name="Rejected"
                                    stroke="#D92D20"
                                    fill="#D92D20"
                                    fillOpacity={0.12}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        r: 4,
                                    }}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>


                    {/* =============================================
                        SUMMARY
                    ============================================= */}

                    <div className="
                        mt-2
                        grid
                        grid-cols-2
                        gap-2
                        border-t
                        border-base-300
                        pt-4
                    ">

                        <div className="
                            rounded-lg
                            bg-base-200/40
                            px-3
                            py-2
                        ">

                            <p className="
                                text-[11px]
                                text-base-content/45
                            ">
                                Total Rejected
                            </p>


                            <p className="
                                mt-1
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                {formatNumber(
                                    totalRejected
                                )}
                            </p>

                        </div>


                        <div className="
                            rounded-lg
                            bg-base-200/40
                            px-3
                            py-2
                        ">

                            <p className="
                                text-[11px]
                                text-base-content/45
                            ">
                                Highest Daily
                            </p>


                            <p className="
                                mt-1
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                {formatNumber(
                                    highestRejected
                                )}
                            </p>

                        </div>

                    </div>

                </>

            )}

        </section>

    )

}


export default RejectionTrend