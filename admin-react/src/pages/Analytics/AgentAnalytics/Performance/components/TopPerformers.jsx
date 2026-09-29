// admin-react/src/pages/Analytics/AgentAnalytics/Performance/components/TopPerformers.jsx

import TrophyIcon from '@heroicons/react/24/outline/TrophyIcon'


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
// EMPTY STATE
// =============================================================

function EmptyState() {

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


// =============================================================
// COMPONENT
// =============================================================

function TopPerformers({
    mode = 'agent',
    performance = [],
    loanWise = [],
    topPerformers = [],
    topPerformersByLoanType = [],
    metric = 'disbursed',
    onMetricChange,
}) {

    // =========================================================
    // NORMALIZE
    // =========================================================

    const overviewRows =
        Array.isArray(
            performance
        )
            ? performance
            : []

    const backendTopPerformers =
        Array.isArray(
            topPerformers
        )
            ? topPerformers
            : []

    const backendLoanGroups =
        Array.isArray(
            topPerformersByLoanType
        )
            ? topPerformersByLoanType
            : []

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
    // TOP PERFORMERS
    //
    // Backend provides complete rows. The selected metric is
    // used only for ordering/display.
    // =========================================================

    const topRows =
        [...backendTopPerformers]
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b?.[metric] || 0
                    ) -
                    Number(
                        a?.[metric] || 0
                    )
            )
            .slice(
                0,
                5
            )


    // =========================================================
    // FALLBACK
    //
    // Preserves functionality if backend top performers are
    // temporarily unavailable but overview data exists.
    // =========================================================

    const fallbackEntityMap =
        overviewRows.reduce(
            (
                result,
                item
            ) => {

                const id =
                    item?.contextId ??
                    item?.id

                if (
                    id === null ||
                    id === undefined
                ) {
                    return result
                }

                const key =
                    String(id)

                if (
                    !result[key]
                ) {

                    result[key] = {
                        id,

                        name:
                            item?.name ||
                            'Unknown',

                        teamLeadContextId:
                            item?.teamLeadContextId ??
                            null,

                        teamLeadName:
                            item?.teamLeadName ||
                            '-',

                        teamId:
                            item?.teamId ??
                            null,

                        teamName:
                            item?.teamName ||
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
                        item?.inProcess || 0
                    )

                result[key].login +=
                    Number(
                        item?.login || 0
                    )

                result[key].sanctioned +=
                    Number(
                        item?.sanctioned || 0
                    )

                result[key].disbursed +=
                    Number(
                        item?.disbursed || 0
                    )

                result[key].rejected +=
                    Number(
                        item?.rejected || 0
                    )

                result[key].disbursedAmount +=
                    Number(
                        item?.disbursedAmount || 0
                    )

                return result

            },
            {}
        )


    const fallbackTopRows =
        Object.values(
            fallbackEntityMap
        )
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b?.[metric] || 0
                    ) -
                    Number(
                        a?.[metric] || 0
                    )
            )
            .slice(
                0,
                5
            )


    const displayedTopRows =
        topRows.length
            ? topRows
            : fallbackTopRows


    // =========================================================
    // LOAN TYPE PERFORMERS
    //
    // Backend response is already grouped by loan type.
    // =========================================================

    const normalizedLoanGroups =
        backendLoanGroups
            .map(
                (
                    group,
                    groupIndex
                ) => {

                    const rows =
                        Array.isArray(
                            group?.rows
                        )
                            ? group.rows
                            : []

                    const sortedRows =
                        [...rows].sort(
                            (
                                a,
                                b
                            ) =>
                                Number(
                                    b?.count || 0
                                ) -
                                Number(
                                    a?.count || 0
                                )
                        )

                    const total =
                        sortedRows.reduce(
                            (
                                sum,
                                row
                            ) =>
                                sum +
                                Number(
                                    row?.count || 0
                                ),
                            0
                        )

                    return {

                        id:
                            group?.loanTypeId ??
                            group?.id ??
                            `loan-${groupIndex}`,

                        loanTypeId:
                            group?.loanTypeId ??
                            null,

                        loanTypeName:
                            group?.loanTypeName ||
                            'Unknown Loan Type',

                        rows:
                            sortedRows,

                        total,

                    }

                }
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b.total || 0
                    ) -
                    Number(
                        a.total || 0
                    )
            )


    // =========================================================
    // FALLBACK LOAN TYPE PERFORMERS
    // =========================================================

    const fallbackLoanMap =
        overviewRows.reduce(
            (
                result,
                item
            ) => {

                const loanId =
                    item?.loanTypeId ??
                    item?.loan_type_id ??
                    item?.loanTypeName ??
                    'unknown'

                const entityId =
                    item?.contextId ??
                    item?.id

                if (
                    entityId === null ||
                    entityId === undefined
                ) {
                    return result
                }

                const loanKey =
                    String(
                        loanId
                    )

                if (
                    !result[loanKey]
                ) {

                    result[loanKey] = {

                        id:
                            loanId,

                        loanTypeId:
                            item?.loanTypeId ??
                            null,

                        loanTypeName:
                            item?.loanTypeName ||
                            'Unknown Loan Type',

                        rows: [],

                    }

                }

                const existing =
                    result[loanKey].rows.find(
                        (row) =>
                            String(
                                row?.contextId
                            ) ===
                            String(
                                entityId
                            )
                    )

                if (
                    existing
                ) {

                    existing.count +=
                        Number(
                            item?.[metric] || 0
                        )

                    existing.disbursedAmount +=
                        Number(
                            item?.disbursedAmount || 0
                        )

                } else {

                    result[loanKey].rows.push({

                        id:
                            `${loanKey}-${entityId}`,

                        loanTypeId:
                            item?.loanTypeId ??
                            null,

                        loanTypeName:
                            item?.loanTypeName ||
                            'Unknown Loan Type',

                        contextId:
                            entityId,

                        name:
                            item?.name ||
                            'Unknown',

                        count:
                            Number(
                                item?.[metric] || 0
                            ),

                        disbursedAmount:
                            Number(
                                item?.disbursedAmount || 0
                            ),

                    })

                }

                return result

            },
            {}
        )


    const fallbackLoanGroups =
        Object.values(
            fallbackLoanMap
        )
            .map(
                (
                    group
                ) => {

                    const rows =
                        [...group.rows].sort(
                            (
                                a,
                                b
                            ) =>
                                Number(
                                    b?.count || 0
                                ) -
                                Number(
                                    a?.count || 0
                                )
                        )

                    return {

                        ...group,

                        rows,

                        total:
                            rows.reduce(
                                (
                                    sum,
                                    row
                                ) =>
                                    sum +
                                    Number(
                                        row?.count || 0
                                    ),
                                0
                            ),

                    }

                }
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        b.total || 0
                    ) -
                    Number(
                        a.total || 0
                    )
            )


    const displayedLoanGroups =
        normalizedLoanGroups.length
            ? normalizedLoanGroups
            : fallbackLoanGroups


    // =========================================================
    // EMPTY
    // =========================================================

    if (
        !overviewRows.length &&
        !backendTopPerformers.length
    ) {

        return (
            <EmptyState />
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
                            Best performing{' '}
                            {entityPlural.toLowerCase()}
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
                        (
                            item
                        ) => (

                            <button
                                key={
                                    item.value
                                }
                                type="button"
                                onClick={() => {
                                    onMetricChange?.(
                                        item.value
                                    )
                                }}
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
                                {
                                    item.label
                                }
                            </button>

                        )
                    )}

                </div>

            </div>


            {/* =================================================
                TOP PERFORMERS
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
                                Top Performing{' '}
                                {entityPlural}
                            </h3>

                            <p className="
                                mt-0.5
                                text-[11px]
                                text-base-content/40
                            ">
                                Ranked by{' '}
                                {
                                    selectedMetric.label.toLowerCase()
                                }
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
                            Top{' '}
                            {
                                displayedTopRows.length
                            }
                        </span>

                    </div>

                </div>


                {/* =================================================
                    TOP PERFORMERS TABLE
                ================================================= */}

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
                                    {
                                        selectedMetric.label
                                    }
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {displayedTopRows.map(
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
                                                        ? `
                                                            bg-[#8BCF00]/15
                                                            text-[#78B300]
                                                        `
                                                        : `
                                                            bg-base-200
                                                            text-base-content/50
                                                        `
                                                }
                                            `}>
                                                {
                                                    item?.rank ||
                                                    index + 1
                                                }
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
                                            text-xs
                                            text-base-content/55
                                        ">
                                            {
                                                item?.teamName ||
                                                '-'
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
                                                    item?.[metric]
                                                )
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                            {!displayedTopRows.length && (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                            text-xs
                                            text-base-content/40
                                        "
                                    >
                                        No top performer data
                                        available.
                                    </td>

                                </tr>

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
                            {
                                selectedMetric.label
                            } by loan type and{' '}
                            {
                                entityLabel.toLowerCase()
                            }
                        </p>

                    </div>

                </div>


                {/* =================================================
                    LOAN TYPE TABLE
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

                            {displayedLoanGroups.map(
                                (
                                    loan,
                                    loanIndex
                                ) => (

                                    loan.rows.map(
                                        (
                                            row,
                                            rowIndex
                                        ) => (

                                            <tr
                                                key={
                                                    String(
                                                        row?.contextId ??
                                                        row?.id ??
                                                        `${loanIndex}-${rowIndex}`
                                                    )
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
                                                                shrink-0
                                                                rounded-full
                                                                bg-[#8BCF00]
                                                            " />

                                                            <span className="
                                                                block
                                                                max-w-[220px]
                                                                truncate
                                                                text-sm
                                                                font-medium
                                                                text-base-content
                                                            ">
                                                                {
                                                                    loan?.loanTypeName ||
                                                                    'Unknown Loan Type'
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
                                                        block
                                                        max-w-[180px]
                                                        truncate
                                                        text-sm
                                                        text-base-content/70
                                                    ">
                                                        {
                                                            row?.name ||
                                                            'Unknown'
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
                                                            row?.count
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
                                                                row?.disbursedAmount
                                                            )
                                                        }

                                                    </td>

                                                )}

                                            </tr>

                                        )
                                    )

                                )
                            )}

                            {!displayedLoanGroups.length && (

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