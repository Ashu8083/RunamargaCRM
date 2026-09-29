// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/SanctionDisbursementTrend.jsx

import {
    Bar,
    BarChart,
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

    const parsedDate = new Date(`${date}T00:00:00`)

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


// =============================================================
// VALUE HELPERS
// =============================================================

const getValue = (item, keys) => {

    for (const key of keys) {

        if (
            item?.[key] !== undefined &&
            item?.[key] !== null
        ) {
            return Number(item[key]) || 0
        }

    }

    return 0

}


// =============================================================
// BUILD DATA
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
                sanctioned: 0,
                disbursed: 0,
            }

        }


        grouped[date].sanctioned +=
            getValue(
                item,
                [
                    'sanctioned',
                    'sanctionedCount',
                ]
            )


        grouped[date].disbursed +=
            getValue(
                item,
                [
                    'disbursed',
                    'disbursedCount',
                ]
            )

    })


    return Object.values(grouped)
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        )

}


// =============================================================
// CUSTOM TOOLTIP
// =============================================================

function TrendTooltip({
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
            min-w-[180px]
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
                space-y-2
            ">

                {payload.map((item) => (

                    <div
                        key={item.dataKey}
                        className="
                            flex
                            items-center
                            justify-between
                            gap-5
                            text-xs
                        "
                    >

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                "
                                style={{
                                    backgroundColor:
                                        item.color,
                                }}
                            />

                            <span className="
                                text-base-content/55
                            ">
                                {item.name}
                            </span>

                        </div>


                        <span className="
                            font-semibold
                            text-base-content
                        ">
                            {formatNumber(
                                item.value
                            )}
                        </span>

                    </div>

                ))}

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
                    No sanction or disbursement data
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

function SanctionDisbursementTrend({
    analytics = [],
}) {

    const chartData =
        buildChartData(analytics)


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
                        Sanction vs Disbursement
                    </h2>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Daily comparison of sanctioned and disbursed applications
                    </p>

                </div>


                {/* =================================================
                    LEGEND
                ================================================= */}

                <div className="
                    flex
                    items-center
                    gap-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-base-content/55
                    ">

                        <span className="
                            h-2
                            w-2
                            rounded-full
                            bg-[#D97706]
                        " />

                        Sanctioned

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-base-content/55
                    ">

                        <span className="
                            h-2
                            w-2
                            rounded-full
                            bg-[#25803C]
                        " />

                        Disbursed

                    </div>

                </div>

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

                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 5,
                                }}
                                barCategoryGap="22%"
                                barGap={5}
                            >

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
                                />


                                <Tooltip
                                    content={
                                        <TrendTooltip />
                                    }
                                    cursor={{
                                        fill:
                                            'rgba(0,0,0,0.03)',
                                    }}
                                />


                                <Bar
                                    dataKey="sanctioned"
                                    name="Sanctioned"
                                    fill="#D97706"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />


                                <Bar
                                    dataKey="disbursed"
                                    name="Disbursed"
                                    fill="#25803C"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            )}

        </section>

    )

}


export default SanctionDisbursementTrend