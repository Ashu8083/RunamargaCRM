// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/LoanStageDistribution.jsx

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
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
// BUILD DATA
// =============================================================

const buildDistributionData = (analytics) => {

    const totals = STAGES.reduce(
        (result, stage) => {

            result[stage.key] = 0

            return result

        },
        {}
    )


    analytics.forEach((item) => {

        STAGES.forEach((stage) => {

            totals[stage.key] += getValue(
                item,
                stage.keys
            )

        })

    })


    return STAGES
        .map((stage) => ({
            ...stage,
            value: totals[stage.key],
        }))
        .filter(
            (stage) => stage.value > 0
        )

}


// =============================================================
// TOOLTIP
// =============================================================

function DistributionTooltip({
    active,
    payload,
}) {

    if (
        !active ||
        !payload?.length
    ) {
        return null
    }


    const item =
        payload[0]?.payload


    if (!item) {
        return null
    }


    const total =
        payload[0]?.payload?.total || 0


    const percentage =
        total > 0
            ? (item.value / total) * 100
            : 0


    return (

        <div className="
            min-w-[150px]
            rounded-xl
            border
            border-base-300
            bg-base-100
            px-3
            py-2.5
            shadow-xl
        ">

            <div className="
                flex
                items-center
                justify-between
                gap-4
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                        "
                        style={{
                            backgroundColor:
                                item.color,
                        }}
                    />

                    <span className="
                        text-xs
                        text-base-content/60
                    ">
                        {item.label}
                    </span>

                </div>


                <span className="
                    text-sm
                    font-semibold
                    text-base-content
                ">
                    {formatNumber(item.value)}
                </span>

            </div>


            <p className="
                mt-1.5
                text-right
                text-[11px]
                text-base-content/40
            ">
                {percentage.toFixed(1)}%
            </p>

        </div>

    )

}


// =============================================================
// CENTER LABEL
// =============================================================

function CenterLabel({
    total,
}) {

    return (

        <g>

            <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="
                    fill-base-content
                    text-2xl
                    font-bold
                "
            >
                {formatNumber(total)}
            </text>


            <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="
                    fill-base-content/45
                    text-[11px]
                "
            >
                Applications
            </text>

        </g>

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
                    No stage data available
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

function LoanStageDistribution({
    analytics = [],
}) {

    const distribution =
        buildDistributionData(
            analytics
        )


    const total =
        distribution.reduce(
            (sum, item) =>
                sum + item.value,
            0
        )


    const chartData =
        distribution.map((item) => ({
            ...item,
            total,
        }))


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
                    Loan Stage Distribution
                </h2>


                <p className="
                    mt-1
                    text-xs
                    text-base-content/45
                ">
                    Current application distribution
                </p>

            </div>


            {chartData.length === 0 ? (

                <EmptyState />

            ) : (

                <>

                    {/* =============================================
                        CHART
                    ============================================= */}

                    <div className="
                        mt-3
                        h-[270px]
                        w-full
                    ">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="58%"
                                    outerRadius="82%"
                                    paddingAngle={3}
                                    stroke="none"
                                    isAnimationActive
                                >

                                    {chartData.map(
                                        (item) => (

                                            <Cell
                                                key={item.key}
                                                fill={item.color}
                                            />

                                        )
                                    )}

                                </Pie>


                                <Tooltip
                                    content={
                                        <DistributionTooltip />
                                    }
                                />


                                <CenterLabel
                                    total={total}
                                />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>


                    {/* =============================================
                        LEGEND
                    ============================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        gap-2
                        border-t
                        border-base-300
                        pt-4
                        sm:grid-cols-2
                    ">

                        {STAGES.map((stage) => {

                            const current =
                                chartData.find(
                                    (item) =>
                                        item.key ===
                                        stage.key
                                )


                            const value =
                                current?.value || 0


                            const percentage =
                                total > 0
                                    ? (
                                        value /
                                        total
                                    ) *
                                    100
                                    : 0


                            return (

                                <div
                                    key={stage.key}
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        justify-between
                                        gap-3
                                        rounded-lg
                                        px-2
                                        py-1.5
                                        transition
                                        hover:bg-base-200/60
                                    "
                                >

                                    <div className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-2
                                    ">

                                        <span
                                            className="
                                                h-2.5
                                                w-2.5
                                                shrink-0
                                                rounded-full
                                            "
                                            style={{
                                                backgroundColor:
                                                    stage.color,
                                            }}
                                        />


                                        <span className="
                                            truncate
                                            text-xs
                                            text-base-content/60
                                        ">
                                            {stage.label}
                                        </span>

                                    </div>


                                    <div className="
                                        flex
                                        shrink-0
                                        items-center
                                        gap-2
                                    ">

                                        <span className="
                                            text-xs
                                            font-semibold
                                            text-base-content
                                        ">
                                            {formatNumber(
                                                value
                                            )}
                                        </span>


                                        <span className="
                                            text-[10px]
                                            text-base-content/35
                                        ">
                                            {percentage.toFixed(1)}%
                                        </span>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                </>

            )}

        </section>

    )

}


export default LoanStageDistribution