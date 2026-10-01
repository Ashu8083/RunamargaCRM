// admin-react/src/pages/Analytics/AgentAnalytics/Performance/components/PerformanceOverview.jsx

import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import ArrowTrendingUpIcon from '@heroicons/react/24/outline/ArrowTrendingUpIcon'


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


const formatCurrency = (
    value
) => {

    return `₹${Number(
        value || 0
    ).toLocaleString('en-IN')}`

}


// =============================================================
// TOTALS
// =============================================================

const getTotals = (
    rows = []
) => {

    return rows.reduce(
        (
            totals,
            item
        ) => {

            totals.inProcess +=
                Number(
                    item?.inProcess || 0
                )

            totals.login +=
                Number(
                    item?.login || 0
                )

            totals.sanctioned +=
                Number(
                    item?.sanctioned || 0
                )

            totals.disbursed +=
                Number(
                    item?.disbursed || 0
                )

            totals.rejected +=
                Number(
                    item?.rejected || 0
                )

            totals.disbursedAmount +=
                Number(
                    item?.disbursedAmount || 0
                )

            return totals

        },
        {
            inProcess: 0,
            login: 0,
            sanctioned: 0,
            disbursed: 0,
            rejected: 0,
            disbursedAmount: 0,
        }
    )

}


// =============================================================
// KPI CARD
// =============================================================

function KpiCard({
    label,
    value,
    description,
    icon: Icon,
    highlight = false,
}) {

    return (

        <div className={`
            min-w-0
            rounded-xl
            border
            p-4
            shadow-sm
            ${
                highlight
                    ? `
                        border-[#8BCF00]/30
                        bg-[#8BCF00]/5
                    `
                    : `
                        border-base-300
                        bg-base-100
                    `
            }
        `}>

            <div className="
                flex
                items-start
                justify-between
                gap-3
            ">

                <div className="
                    min-w-0
                ">

                    <p className="
                        truncate
                        text-xs
                        font-medium
                        text-base-content/50
                    ">
                        {label}
                    </p>

                    <p className={`
                        mt-2
                        text-2xl
                        font-bold
                        tracking-tight
                        ${
                            highlight
                                ? 'text-[#78B300]'
                                : 'text-base-content'
                        }
                    `}>
                        {formatNumber(value)}
                    </p>

                    <p className="
                        mt-1
                        truncate
                        text-[11px]
                        text-base-content/40
                    ">
                        {description}
                    </p>

                </div>

                <div className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${
                        highlight
                            ? 'bg-[#8BCF00]/10'
                            : 'bg-base-200'
                    }
                `}>

                    <Icon className={`
                        h-4
                        w-4
                        ${
                            highlight
                                ? 'text-[#78B300]'
                                : 'text-base-content/50'
                        }
                    `} />

                </div>

            </div>

        </div>

    )

}


// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState({
    title,
}) {

    return (

        <section className="
            w-full
            rounded-2xl
            border
            border-base-300
            bg-base-100
            p-5
            shadow-sm
        ">

            <div className="
                flex
                items-center
                gap-2
            ">

                <ChartBarIcon className="
                    h-5
                    w-5
                    text-[#8BCF00]
                " />

                <h2 className="
                    text-sm
                    font-semibold
                ">
                    {title}
                </h2>

            </div>

            <p className="
                py-10
                text-center
                text-sm
                text-base-content/40
            ">
                No performance data available.
            </p>

        </section>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function PerformanceOverview({
    mode = 'agent',
    performance = [],
}) {

    // =========================================================
    // NORMALIZE
    // =========================================================

    const rows =
        Array.isArray(
            performance
        )
            ? performance
            : []


    // =========================================================
    // TOTALS
    // =========================================================

    const totals =
        getTotals(
            rows
        )


    // =========================================================
    // ENTITY LABELS
    // =========================================================

    const entityLabel =
        mode === 'rm'
            ? 'RM'
            : 'Agent'

    const entityPlural =
        mode === 'rm'
            ? 'RMs'
            : 'Agents'

    const title =
        mode === 'rm'
            ? 'RM Overview'
            : 'Agent Overview'


    // =========================================================
    // SORTED ROWS
    // =========================================================

    const sortedRows =
        [...rows].sort(
            (
                a,
                b
            ) =>
                Number(
                    b?.disbursed || 0
                ) -
                Number(
                    a?.disbursed || 0
                )
        )


    // =========================================================
    // EMPTY
    // =========================================================

    if (!rows.length) {

        return (
            <EmptyState
                title={title}
            />
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="
            w-full
            min-w-0
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
                items-center
                justify-between
                gap-3
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <div className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#8BCF00]/10
                    ">

                        <ChartBarIcon className="
                            h-5
                            w-5
                            text-[#78B300]
                        " />

                    </div>

                    <div>

                        <h2 className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {title}
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/40
                        ">
                            Overall application pipeline
                        </p>

                    </div>

                </div>

                <div className="
                    rounded-lg
                    bg-base-200/60
                    px-3
                    py-1.5
                    text-xs
                    text-base-content/50
                ">

                    {rows.length}{' '}
                    {entityPlural}

                </div>

            </div>


            {/* =================================================
                KPI CARDS
            ================================================= */}

            <div className="
                mt-5
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-5
            ">

                <KpiCard
                    label="In Process"
                    value={
                        totals.inProcess
                    }
                    description="Currently processing"
                    icon={ChartBarIcon}
                />

                <KpiCard
                    label="Login"
                    value={
                        totals.login
                    }
                    description="Applications logged in"
                    icon={ChartBarIcon}
                />

                <KpiCard
                    label="Sanctioned"
                    value={
                        totals.sanctioned
                    }
                    description="Applications sanctioned"
                    icon={ArrowTrendingUpIcon}
                />

                <KpiCard
                    label="Disbursed"
                    value={
                        totals.disbursed
                    }
                    description={
                        formatCurrency(
                            totals.disbursedAmount
                        )
                    }
                    icon={ArrowTrendingUpIcon}
                    highlight
                />

                <KpiCard
                    label="Rejected"
                    value={
                        totals.rejected
                    }
                    description="Applications rejected"
                    icon={ChartBarIcon}
                />

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="
                mt-5
                overflow-hidden
                rounded-xl
                border
                border-base-300
            ">

                <div className="
                    w-full
                    overflow-x-auto
                ">

                    <table className="
                        w-full
                        min-w-[760px]
                        text-left
                    ">

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                                bg-base-200/40
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/45
                            ">

                                <th className="
                                    px-4
                                    py-3
                                ">
                                    {entityLabel}
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                ">
                                    Team Lead
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    In Process
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    Login
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    Sanctioned
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    Disbursed
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    Rejected
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {sortedRows.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            String(
                                                item?.contextId ??
                                                item?.id ??
                                                index
                                            )
                                        }
                                        className="
                                            border-b
                                            border-base-200
                                            last:border-0
                                            hover:bg-base-200/30
                                        "
                                    >

                                        <td className="
                                            px-4
                                            py-3
                                        ">

                                            <span className="
                                                block
                                                max-w-[220px]
                                                truncate
                                                text-sm
                                                font-medium
                                                text-base-content
                                            ">
                                                {
                                                    item?.name ||
                                                    'Unknown'
                                                }
                                            </span>

                                        </td>

                                        <td className="
                                            px-4
                                            py-3
                                            text-xs
                                            text-base-content/55
                                        ">
                                            {
                                                item?.teamLeadName ||
                                                '-'
                                            }
                                        </td>

                                        <td className="
                                            px-4
                                            py-3
                                            text-right
                                            text-sm
                                        ">
                                            {
                                                formatNumber(
                                                    item?.inProcess
                                                )
                                            }
                                        </td>

                                        <td className="
                                            px-4
                                            py-3
                                            text-right
                                            text-sm
                                        ">
                                            {
                                                formatNumber(
                                                    item?.login
                                                )
                                            }
                                        </td>

                                        <td className="
                                            px-4
                                            py-3
                                            text-right
                                            text-sm
                                        ">
                                            {
                                                formatNumber(
                                                    item?.sanctioned
                                                )
                                            }
                                        </td>

                                        <td className="
                                            px-4
                                            py-3
                                            text-right
                                            text-sm
                                            font-semibold
                                            text-[#78B300]
                                        ">
                                            {
                                                formatNumber(
                                                    item?.disbursed
                                                )
                                            }
                                        </td>

                                        <td className="
                                            px-4
                                            py-3
                                            text-right
                                            text-sm
                                        ">
                                            {
                                                formatNumber(
                                                    item?.rejected
                                                )
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </section>

    )

}


export default PerformanceOverview