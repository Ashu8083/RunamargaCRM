// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/LoanTypeTrend.jsx

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


const getLoanType = (item) => {

    return (
        item?.loanTypeName ||
        item?.loanType ||
        item?.loan_name ||
        item?.loanName ||
        'Unknown'
    )

}


// =============================================================
// STAGE CONFIG
// =============================================================

const STAGES = [
    {
        key: 'inProcess',
        label: 'In Process',
        color: '#8BCF00',
        keys: [
            'inProcess',
            'in_process',
            'inProcessCount',
        ],
    },
    {
        key: 'login',
        label: 'Login',
        color: '#009FE3',
        keys: [
            'loggedIn',
            'login',
            'loginCount',
        ],
    },
    {
        key: 'sanctioned',
        label: 'Sanctioned',
        color: '#D97706',
        keys: [
            'sanctioned',
            'sanctionedCount',
        ],
    },
    {
        key: 'disbursed',
        label: 'Disbursed',
        color: '#25803C',
        keys: [
            'disbursed',
            'disbursedCount',
        ],
    },
    {
        key: 'rejected',
        label: 'Rejected',
        color: '#D92D20',
        keys: [
            'rejected',
            'rejectedCount',
        ],
    },
]


// =============================================================
// BUILD CHART DATA
// =============================================================

const buildChartData = (analytics) => {

    const grouped = {}


    analytics.forEach((item) => {

        const loanType =
            getLoanType(item)


        if (!grouped[loanType]) {

            grouped[loanType] = {
                loanType,
                inProcess: 0,
                login: 0,
                sanctioned: 0,
                disbursed: 0,
                rejected: 0,
            }

        }


        STAGES.forEach((stage) => {

            grouped[loanType][stage.key] +=
                getValue(
                    item,
                    stage.keys
                )

        })

    })


    return Object.values(grouped)

}


// =============================================================
// CUSTOM TOOLTIP
// =============================================================

function LoanTypeTooltip({
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
                space-y-1.5
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
            h-[340px]
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
                    No loan type data available
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

function LoanTypeTrend({
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
                        Loan Type Trend
                    </h2>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Application stages by loan type
                    </p>

                </div>


                {/* =================================================
                    LEGEND
                ================================================= */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
                ">

                    {STAGES.map((stage) => (

                        <div
                            key={stage.key}
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-xs
                                text-base-content/55
                            "
                        >

                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                "
                                style={{
                                    backgroundColor:
                                        stage.color,
                                }}
                            />

                            {stage.label}

                        </div>

                    ))}

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
                    h-[340px]
                    w-full
                    overflow-x-auto
                ">

                    <div
                        className="
                            h-full
                            min-w-[650px]
                        "
                        style={{
                            width:
                                chartData.length > 6
                                    ? `${Math.max(
                                        100,
                                        chartData.length * 110
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
                                barCategoryGap="18%"
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(0,0,0,0.08)"
                                />


                                <XAxis
                                    dataKey="loanType"
                                    tick={{
                                        fontSize: 11,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    angle={
                                        chartData.length > 6
                                            ? -25
                                            : 0
                                    }
                                    textAnchor={
                                        chartData.length > 6
                                            ? 'end'
                                            : 'middle'
                                    }
                                    height={
                                        chartData.length > 6
                                            ? 65
                                            : 35
                                    }
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
                                        <LoanTypeTooltip />
                                    }
                                    cursor={{
                                        fill:
                                            'rgba(0,0,0,0.03)',
                                    }}
                                />


                                {STAGES.map((stage) => (

                                    <Bar
                                        key={stage.key}
                                        dataKey={stage.key}
                                        name={stage.label}
                                        stackId="loanStage"
                                        fill={stage.color}
                                        maxBarSize={70}
                                        radius={
                                            stage.key ===
                                            'rejected'
                                                ? [
                                                    4,
                                                    4,
                                                    0,
                                                    0,
                                                ]
                                                : 0
                                        }
                                    />

                                ))}

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            )}

        </section>

    )

}


export default LoanTypeTrend