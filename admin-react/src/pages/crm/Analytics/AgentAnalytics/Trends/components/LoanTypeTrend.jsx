// admin-react/src/pages/Analytics/AgentAnalytics/Trends/components/LoanTypeTrend.jsx

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
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


// =============================================================
// NORMALIZE DATA
// =============================================================

const normalizeLoanTypeTrend = (
    loanTypeTrend
) => {

    if (
        !Array.isArray(
            loanTypeTrend
        )
    ) {

        return []

    }


    return loanTypeTrend
        .map((item) => ({

            loanTypeId:
                item?.loanTypeId ??
                item?.loan_type_id ??
                null,

            loanTypeName:
                item?.loanTypeName ??
                item?.loan_type_name ??
                'Unknown',

            applicationCreated:
                Number(
                    item?.applicationCreated ??
                    item?.application_created ??
                    0
                ) || 0,

            inProcess:
                Number(
                    item?.inProcess ??
                    item?.in_process ??
                    0
                ) || 0,

            login:
                Number(
                    item?.login ??
                    0
                ) || 0,

            sanctioned:
                Number(
                    item?.sanctioned ??
                    0
                ) || 0,

            disbursed:
                Number(
                    item?.disbursed ??
                    0
                ) || 0,

            rejected:
                Number(
                    item?.rejected ??
                    0
                ) || 0,

        }))
        .sort(
            (
                a,
                b
            ) =>
                b.applicationCreated -
                a.applicationCreated
        )

}


// =============================================================
// TOOLTIP
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


    const data =
        payload[0]?.payload || {}


    return (

        <div className="
            min-w-[210px]
            rounded-xl
            border
            border-base-300
            bg-base-100
            px-3
            py-3
            shadow-xl
        ">

            {/* =================================================
                LOAN TYPE
            ================================================= */}

            <p className="
                mb-3
                truncate
                text-xs
                font-semibold
                text-base-content
            ">
                {label}
            </p>


            {/* =================================================
                APPLICATION CREATED
            ================================================= */}

            <div className="
                mb-3
                rounded-lg
                bg-base-200/60
                px-3
                py-2
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                ">

                    <span className="
                        text-[11px]
                        text-base-content/55
                    ">
                        Applications Created
                    </span>


                    <span className="
                        text-xs
                        font-semibold
                        text-base-content
                    ">
                        {formatNumber(
                            data.applicationCreated
                        )}
                    </span>

                </div>

            </div>


            {/* =================================================
                STAGES
            ================================================= */}

            <div className="
                space-y-2
            ">

                {payload.map(
                    (item) => (

                        <div
                            key={
                                item.dataKey
                            }
                            className="
                                flex
                                items-center
                                justify-between
                                gap-5
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
                                    text-[11px]
                                    text-base-content/55
                                ">
                                    {item.name}
                                </span>

                            </div>


                            <span className="
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                {formatNumber(
                                    item.value
                                )}
                            </span>

                        </div>

                    )
                )}

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

                <div className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-base-200
                ">

                    <div className="
                        h-7
                        w-7
                        rounded-lg
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
// LEGEND
// =============================================================

function LoanTypeLegend() {

    return (

        <div className="
            flex
            flex-wrap
            items-center
            justify-end
            gap-x-4
            gap-y-2
        ">

            <LegendItem
                label="In Process"
                color="#8BCF00"
            />

            <LegendItem
                label="Login"
                color="#009FE3"
            />

            <LegendItem
                label="Sanctioned"
                color="#D97706"
            />

            <LegendItem
                label="Disbursed"
                color="#25803C"
            />

            <LegendItem
                label="Rejected"
                color="#D92D20"
            />

        </div>

    )

}


// =============================================================
// LEGEND ITEM
// =============================================================

function LegendItem({
    label,
    color,
}) {

    return (

        <div className="
            flex
            items-center
            gap-1.5
        ">

            <span
                className="
                    h-2
                    w-2
                    rounded-full
                "
                style={{
                    backgroundColor:
                        color,
                }}
            />

            <span className="
                text-[10px]
                text-base-content/60
            ">
                {label}
            </span>

        </div>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function LoanTypeTrend({
    loanTypeTrend = [],
}) {

    const data =
        normalizeLoanTypeTrend(
            loanTypeTrend
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
                flex-col
                gap-3
                sm:flex-row
                sm:items-start
                sm:justify-between
            ">

                {/* =============================================
                    TITLE
                ============================================= */}

                <div className="
                    min-w-0
                ">

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


                {/* =============================================
                    LEGEND
                ============================================= */}

                {data.length > 0 && (

                    <LoanTypeLegend />

                )}

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
                        h-[320px]
                        w-full
                    ">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={data}
                                margin={{
                                    top: 8,
                                    right: 8,
                                    left: 0,
                                    bottom: 8,
                                }}
                                barCategoryGap="35%"
                            >

                                {/* =================================
                                    GRID
                                ================================= */}

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    className="
                                        text-base-content/10
                                    "
                                />


                                {/* =================================
                                    X AXIS
                                ================================= */}

                                <XAxis
                                    dataKey="loanTypeName"
                                    tick={{
                                        fontSize: 10,
                                        fill: 'currentColor',
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    tickFormatter={(
                                        value
                                    ) => {

                                        const text =
                                            String(
                                                value || ''
                                            )

                                        if (
                                            text.length >
                                            14
                                        ) {

                                            return `${text.slice(
                                                0,
                                                14
                                            )}...`

                                        }

                                        return text

                                    }}
                                    className="
                                        text-base-content/55
                                    "
                                />


                                {/* =================================
                                    Y AXIS
                                ================================= */}

                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fontSize: 10,
                                        fill: 'currentColor',
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={35}
                                    tickFormatter={
                                        formatNumber
                                    }
                                    className="
                                        text-base-content/50
                                    "
                                />


                                {/* =================================
                                    TOOLTIP
                                ================================= */}

                                <Tooltip
                                    cursor={{
                                        fill:
                                            'currentColor',
                                        className:
                                            'text-base-content/5',
                                    }}
                                    content={
                                        <LoanTypeTooltip />
                                    }
                                />


                                {/* =================================
                                    LEGEND
                                ================================= */}

                                <Legend
                                    content={() => null}
                                />


                                {/* =================================
                                    IN PROCESS
                                ================================= */}

                                <Bar
                                    dataKey="inProcess"
                                    name="In Process"
                                    stackId="pipeline"
                                    fill="#8BCF00"
                                    radius={[
                                        0,
                                        0,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />


                                {/* =================================
                                    LOGIN
                                ================================= */}

                                <Bar
                                    dataKey="login"
                                    name="Login"
                                    stackId="pipeline"
                                    fill="#009FE3"
                                    radius={[
                                        0,
                                        0,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />


                                {/* =================================
                                    SANCTIONED
                                ================================= */}

                                <Bar
                                    dataKey="sanctioned"
                                    name="Sanctioned"
                                    stackId="pipeline"
                                    fill="#D97706"
                                    radius={[
                                        0,
                                        0,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />


                                {/* =================================
                                    DISBURSED
                                ================================= */}

                                <Bar
                                    dataKey="disbursed"
                                    name="Disbursed"
                                    stackId="pipeline"
                                    fill="#25803C"
                                    radius={[
                                        0,
                                        0,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />


                                {/* =================================
                                    REJECTED
                                ================================= */}

                                <Bar
                                    dataKey="rejected"
                                    name="Rejected"
                                    stackId="pipeline"
                                    fill="#D92D20"
                                    radius={[
                                        4,
                                        4,
                                        0,
                                        0,
                                    ]}
                                    maxBarSize={34}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </>

            )}

        </section>

    )

}


export default LoanTypeTrend
