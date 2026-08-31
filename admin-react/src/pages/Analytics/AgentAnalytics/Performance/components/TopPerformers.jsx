// admin-react/src/pages/Analytics/AgentAnalytics/Performance/components/TopPerformers.jsx

import TrophyIcon from '@heroicons/react/24/outline/TrophyIcon'


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) => {

    return Number(
        value || 0
    ).toLocaleString('en-IN')

}


const formatCurrency = (value) => {

    return `₹${Number(
        value || 0
    ).toLocaleString('en-IN')}`

}


// =============================================================
// METRICS
// =============================================================

const METRICS = [
    {
        value: 'disbursed',
        label: 'Disbursed',
    },
    {
        value: 'sanctioned',
        label: 'Sanctioned',
    },
    {
        value: 'login',
        label: 'Login',
    },
    {
        value: 'inProcess',
        label: 'In Process',
    },
    {
        value: 'rejected',
        label: 'Rejected',
    },
]


// =============================================================
// COMPONENT
// =============================================================

function TopPerformers({
    mode = 'agent',
    performance = [],
    metric = 'disbursed',
    onMetricChange,
}) {

    // =========================================================
    // ENTITY GROUPING
    // =========================================================

    const entityMap =
        performance.reduce(
            (result, item) => {

                const id =
                    mode === 'rm'
                        ? item.rmId
                        : item.agentId


                const key =
                    String(id)


                if (!result[key]) {

                    result[key] = {

                        id,

                        name:
                            mode === 'rm'
                                ? item.rmName
                                : item.agentName,

                        teamLeadName:
                            item.teamLeadName ||
                            '-',

                        teamName:
                            item.teamName ||
                            '-',

                        inProcess: 0,
                        login: 0,
                        sanctioned: 0,
                        disbursed: 0,
                        rejected: 0,
                        disbursedAmount: 0,

                    }

                }


                result[key].inProcess +=
                    Number(
                        item.inProcess || 0
                    )

                result[key].login +=
                    Number(
                        item.login || 0
                    )

                result[key].sanctioned +=
                    Number(
                        item.sanctioned || 0
                    )

                result[key].disbursed +=
                    Number(
                        item.disbursed || 0
                    )

                result[key].rejected +=
                    Number(
                        item.rejected || 0
                    )

                result[key].disbursedAmount +=
                    Number(
                        item.disbursedAmount || 0
                    )


                return result

            },
            {}
        )


    // =========================================================
    // TOP PERFORMERS
    // =========================================================

    const topPerformers =
        Object.values(entityMap)
            .sort(
                (a, b) =>
                    Number(
                        b[metric] || 0
                    ) -
                    Number(
                        a[metric] || 0
                    )
            )
            .slice(0, 5)


    // =========================================================
    // LOAN + ENTITY GROUPING
    //
    // Required structure:
    //
    // Loan Type | Agent/RM | Count | Amount
    //
    // =========================================================

    const loanEntityMap =
        performance.reduce(
            (result, item) => {

                const loanId =
                    item.loanTypeId ??
                    item.loanTypeName ??
                    'unknown'


                const entityId =
                    mode === 'rm'
                        ? item.rmId
                        : item.agentId


                const key =
                    `${String(loanId)}-${String(entityId)}`


                if (!result[key]) {

                    result[key] = {

                        id: key,

                        loanTypeId:
                            loanId,

                        loanTypeName:
                            item.loanTypeName ||
                            'Unknown Loan Type',

                        entityId,

                        entityName:
                            mode === 'rm'
                                ? item.rmName
                                : item.agentName,

                        count: 0,

                        disbursedAmount: 0,

                    }

                }


                result[key].count +=
                    Number(
                        item[metric] || 0
                    )


                result[key].disbursedAmount +=
                    Number(
                        item.disbursedAmount || 0
                    )


                return result

            },
            {}
        )


    // =========================================================
    // GROUP LOAN ROWS
    // =========================================================

    const loanGroups =
        Object.values(loanEntityMap)
            .reduce(
                (result, item) => {

                    const loanKey =
                        String(
                            item.loanTypeId
                        )


                    if (!result[loanKey]) {

                        result[loanKey] = {

                            id:
                                item.loanTypeId,

                            name:
                                item.loanTypeName,

                            rows: [],

                        }

                    }


                    result[loanKey].rows.push(
                        item
                    )


                    return result

                },
                {}
            )


    const groupedLoanTypes =
        Object.values(loanGroups)
            .map(
                (loan) => ({

                    ...loan,

                    rows:
                        loan.rows.sort(
                            (a, b) =>
                                b.count -
                                a.count
                        ),

                })
            )
            .sort(
                (a, b) => {

                    const aTotal =
                        a.rows.reduce(
                            (
                                total,
                                row
                            ) =>
                                total +
                                row.count,
                            0
                        )

                    const bTotal =
                        b.rows.reduce(
                            (
                                total,
                                row
                            ) =>
                                total +
                                row.count,
                            0
                        )

                    return bTotal - aTotal

                }
            )


    // =========================================================
    // LABELS
    // =========================================================

    const entityLabel =
        mode === 'rm'
            ? 'RM'
            : 'Agent'


    const entityPlural =
        mode === 'rm'
            ? 'RMs'
            : 'Agents'


    const selectedMetric =
        METRICS.find(
            (item) =>
                item.value === metric
        ) ||
        METRICS[0]


    // =========================================================
    // EMPTY
    // =========================================================

    if (!performance.length) {

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

                    <TrophyIcon className="
                        h-5
                        w-5
                        text-[#8BCF00]
                    " />

                    <h2 className="
                        text-sm
                        font-semibold
                    ">
                        Top Performers
                    </h2>

                </div>


                <p className="
                    py-10
                    text-center
                    text-sm
                    text-base-content/40
                ">
                    No performer data available.
                </p>

            </section>

        )

    }


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

                        <TrophyIcon className="
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
                            Top Performers
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/40
                        ">
                            Best performing {entityPlural.toLowerCase()}
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                METRIC TABS
            ================================================= */}

            <div className="
                mt-5
                overflow-x-auto
            ">

                <div className="
                    inline-flex
                    min-w-max
                    rounded-lg
                    border
                    border-base-300
                    bg-base-200/40
                    p-1
                ">

                    {METRICS.map(
                        (item) => (

                            <button
                                key={
                                    item.value
                                }
                                type="button"
                                onClick={() =>
                                    onMetricChange?.(
                                        item.value
                                    )
                                }
                                className={`
                                    rounded-md
                                    px-4
                                    py-2
                                    text-xs
                                    font-medium
                                    transition
                                    ${
                                        metric ===
                                        item.value
                                            ? `
                                                bg-base-100
                                                text-[#78B300]
                                                shadow-sm
                                            `
                                            : `
                                                text-base-content/50
                                                hover:text-base-content
                                            `
                                    }
                                `}
                            >
                                {item.label}
                            </button>

                        )
                    )}

                </div>

            </div>


            {/* =================================================
                OVERALL TOP PERFORMERS
            ================================================= */}

            <div className="
                mt-5
                overflow-hidden
                rounded-xl
                border
                border-base-300
            ">

                <div className="
                    border-b
                    border-base-300
                    bg-base-200/40
                    px-4
                    py-3
                ">

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    ">

                        <div>

                            <h3 className="
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Top Performing {entityPlural}
                            </h3>

                            <p className="
                                mt-0.5
                                text-[11px]
                                text-base-content/40
                            ">
                                Ranked by{' '}
                                {selectedMetric.label.toLowerCase()}
                            </p>

                        </div>


                        <span className="
                            rounded-md
                            bg-[#8BCF00]/10
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-[#78B300]
                        ">
                            Top {topPerformers.length}
                        </span>

                    </div>

                </div>


                {/* OVERALL TABLE */}

                <div className="
                    w-full
                    overflow-x-auto
                ">

                    <table className="
                        w-full
                        min-w-[650px]
                        text-left
                    ">

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/40
                            ">

                                <th className="
                                    w-16
                                    px-4
                                    py-3
                                ">
                                    Rank
                                </th>

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
                                ">
                                    Team
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    {selectedMetric.label}
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {topPerformers.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            String(
                                                item.id
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

                                            <span className={`
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                text-xs
                                                font-bold
                                                ${
                                                    index === 0
                                                        ? 'bg-[#8BCF00]/15 text-[#78B300]'
                                                        : 'bg-base-200 text-base-content/50'
                                                }
                                            `}>
                                                {index + 1}
                                            </span>

                                        </td>


                                        <td className="
                                            px-4
                                            py-3
                                        ">

                                            <span className="
                                                block
                                                max-w-[180px]
                                                truncate
                                                text-sm
                                                font-medium
                                                text-base-content
                                            ">
                                                {item.name}
                                            </span>

                                        </td>


                                        <td className="
                                            px-4
                                            py-3
                                            text-xs
                                            text-base-content/55
                                        ">
                                            {
                                                item.teamLeadName
                                            }
                                        </td>


                                        <td className="
                                            px-4
                                            py-3
                                            text-xs
                                            text-base-content/55
                                        ">
                                            {
                                                item.teamName
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
                                                    item[
                                                        metric
                                                    ]
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


            {/* =================================================
                TOP PERFORMERS BY LOAN TYPE
            ================================================= */}

            <div className="
                mt-5
                overflow-hidden
                rounded-xl
                border
                border-base-300
            ">

                <div className="
                    border-b
                    border-base-300
                    bg-base-200/40
                    px-4
                    py-3
                ">

                    <div>

                        <h3 className="
                            text-xs
                            font-semibold
                            text-base-content
                        ">
                            Top Performers by Loan Type
                        </h3>

                        <p className="
                            mt-0.5
                            text-[11px]
                            text-base-content/40
                        ">
                            {selectedMetric.label} by loan type and{' '}
                            {entityLabel.toLowerCase()}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    LOAN TABLE
                ================================================= */}

                <div className="
                    w-full
                    overflow-x-auto
                ">

                    <table className="
                        w-full
                        min-w-[620px]
                        text-left
                    ">

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/40
                            ">

                                <th className="
                                    px-4
                                    py-3
                                ">
                                    Loan Type
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                ">
                                    {entityLabel}
                                </th>

                                <th className="
                                    px-4
                                    py-3
                                    text-right
                                ">
                                    Count
                                </th>

                                {metric === 'disbursed' && (

                                    <th className="
                                        px-4
                                        py-3
                                        text-right
                                    ">
                                        Disbursed Amount
                                    </th>

                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {groupedLoanTypes.map(
                                (loan) => (

                                    loan.rows.map(
                                        (
                                            row,
                                            rowIndex
                                        ) => (

                                            <tr
                                                key={
                                                    row.id
                                                }
                                                className="
                                                    border-b
                                                    border-base-200
                                                    last:border-0
                                                    hover:bg-base-200/30
                                                "
                                            >

                                                {/* LOAN TYPE */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                ">

                                                    {rowIndex === 0 ? (

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        ">

                                                            <div className="
                                                                h-2
                                                                w-2
                                                                rounded-full
                                                                bg-[#8BCF00]
                                                            " />

                                                            <span className="
                                                                text-sm
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    loan.name
                                                                }
                                                            </span>

                                                        </div>

                                                    ) : (

                                                        <span className="
                                                            pl-4
                                                            text-xs
                                                            text-base-content/25
                                                        ">
                                                            ↳
                                                        </span>

                                                    )}

                                                </td>


                                                {/* ENTITY */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                ">

                                                    <span className="
                                                        text-sm
                                                        text-base-content/70
                                                    ">
                                                        {
                                                            row.entityName
                                                        }
                                                    </span>

                                                </td>


                                                {/* COUNT */}

                                                <td className="
                                                    px-4
                                                    py-3
                                                    text-right
                                                    text-sm
                                                    font-semibold
                                                    text-base-content
                                                ">

                                                    {
                                                        formatNumber(
                                                            row.count
                                                        )
                                                    }

                                                </td>


                                                {/* AMOUNT */}

                                                {metric ===
                                                    'disbursed' && (

                                                    <td className="
                                                        px-4
                                                        py-3
                                                        text-right
                                                        text-sm
                                                        font-semibold
                                                        text-[#78B300]
                                                    ">

                                                        {
                                                            formatCurrency(
                                                                row.disbursedAmount
                                                            )
                                                        }

                                                    </td>

                                                )}

                                            </tr>

                                        )
                                    )

                                )
                            )}


                            {!groupedLoanTypes.length && (

                                <tr>

                                    <td
                                        colSpan={
                                            metric ===
                                            'disbursed'
                                                ? 4
                                                : 3
                                        }
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                            text-xs
                                            text-base-content/40
                                        "
                                    >
                                        No loan-wise performer
                                        data available.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </section>

    )

}


export default TopPerformers