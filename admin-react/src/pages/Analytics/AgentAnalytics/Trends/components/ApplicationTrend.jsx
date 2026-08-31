// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/ApplicationTrend.jsx
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
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
// DATA TRANSFORMATION
// =============================================================

const buildTrendData = (applications) => {

    const grouped = {}

    applications.forEach((item) => {

        if (!item.date) {
            return
        }

        if (!grouped[item.date]) {

            grouped[item.date] = {
                date: item.date,
                applicationsCreated: 0,
                login: 0,
                sanctioned: 0,
                disbursed: 0,
            }

        }

        grouped[item.date].applicationsCreated +=
            Number(
                item.applicationCreated ??
                item.applicationsCreated ??
                0
            )

        grouped[item.date].login +=
            Number(
                item.loggedIn ??
                item.login ??
                0
            )

        grouped[item.date].sanctioned +=
            Number(
                item.sanctioned ??
                0
            )

        grouped[item.date].disbursed +=
            Number(
                item.disbursed ??
                0
            )

    })


    return Object.values(grouped)
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        )
        .map((item) => ({
            ...item,
            displayDate: formatDate(item.date),
        }))

}


// =============================================================
// CUSTOM TOOLTIP
// =============================================================

function ApplicationTooltip({
    active,
    payload,
    label,
}) {

    if (!active || !payload?.length) {
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


            <div className="space-y-1.5">

                {payload.map((item) => (

                    <div
                        key={item.dataKey}
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            text-xs
                        "
                    >

                        <span className="
                            text-base-content/55
                        ">
                            {item.name}
                        </span>


                        <span className="
                            font-semibold
                            text-base-content
                        ">
                            {formatNumber(item.value)}
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
            h-[300px]
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
                    No application trend data
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

function ApplicationTrend({
    analytics = [],
}) {

    const chartData =
        buildTrendData(analytics)


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
                        Application Trend
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Application movement across pipeline stages
                    </p>

                </div>


                {/* LEGEND */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
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
                            bg-[#8BCF00]
                        " />

                        Created

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
                            bg-[#009FE3]
                        " />

                        Login

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
                    h-[300px]
                    w-full
                    min-w-0
                    overflow-x-auto
                ">

                    <div
                        className="
                            h-full
                            min-w-[600px]
                            sm:min-w-0
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

                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 5,
                                }}
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
                                    tickFormatter={formatNumber}
                                />


                                <Tooltip
                                    content={
                                        <ApplicationTooltip />
                                    }
                                    cursor={{
                                        stroke: 'rgba(0,0,0,0.12)',
                                        strokeDasharray: '4 4',
                                    }}
                                />


                                <Line
                                    type="monotone"
                                    dataKey="applicationsCreated"
                                    name="Applications Created"
                                    stroke="#8BCF00"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />


                                <Line
                                    type="monotone"
                                    dataKey="login"
                                    name="Login"
                                    stroke="#009FE3"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />


                                <Line
                                    type="monotone"
                                    dataKey="sanctioned"
                                    name="Sanctioned"
                                    stroke="#D97706"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />


                                <Line
                                    type="monotone"
                                    dataKey="disbursed"
                                    name="Disbursed"
                                    stroke="#25803C"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            )}

        </section>

    )

}


export default ApplicationTrend