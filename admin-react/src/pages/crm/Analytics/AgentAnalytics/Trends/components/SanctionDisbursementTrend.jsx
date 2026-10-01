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

const normalizeTrend = (
    sanctionDisbursementTrend
) => {

    if (
        !Array.isArray(
            sanctionDisbursementTrend
        )
    ) {

        return []

    }


    return sanctionDisbursementTrend
        .map((item) => ({

            date:
                item?.date ??
                null,

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
            min-w-[170px]
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
                space-y-1.5
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
                    No sanction or disbursement data available
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
    sanctionDisbursementTrend = [],
}) {

    const data =
        normalizeTrend(
            sanctionDisbursementTrend
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
                    Sanction vs Disbursement
                </h2>


                <p className="
                    mt-1
                    text-xs
                    text-base-content/45
                ">
                    Daily sanctioned and disbursed applications
                </p>

            </div>


            {data.length === 0 ? (

                <EmptyState />

            ) : (

                <div className="
                    mt-4
                    h-[360px]
                    w-full
                ">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 10,
                            }}
                            barGap={4}
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
                            />


                            <Tooltip
                                cursor={{
                                    fill:
                                        'currentColor',
                                    className:
                                        'text-base-content/5',
                                }}
                                content={
                                    <TrendTooltip />
                                }
                            />


                            <Bar
                                dataKey="sanctioned"
                                name="Sanctioned"
                                fill="#D97706"
                                radius={[
                                    4,
                                    4,
                                    0,
                                    0,
                                ]}
                                maxBarSize={24}
                            />


                            <Bar
                                dataKey="disbursed"
                                name="Disbursed"
                                fill="#25803C"
                                radius={[
                                    4,
                                    4,
                                    0,
                                    0,
                                ]}
                                maxBarSize={24}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            )}

        </section>

    )

}


export default SanctionDisbursementTrend