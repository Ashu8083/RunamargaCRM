// admin-react/src/pages/Analytics/AgentAnalytics/Performance/components/LoanWisePerformance.jsx

import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
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

                <DocumentTextIcon className="
                    h-5
                    w-5
                    text-[#8BCF00]
                " />

                <h2 className="
                    text-sm
                    font-semibold
                ">
                    Loan Wise Performance
                </h2>

            </div>

            <p className="
                py-10
                text-center
                text-sm
                text-base-content/40
            ">
                No loan performance data available.
            </p>

        </section>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function LoanWisePerformance({
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
    // SORT BY DISBURSED
    // =========================================================

    const loanRows =
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
    // TOTALS
    // =========================================================

    const totals =
        getTotals(
            loanRows
        )


    // =========================================================
    // ENTITY LABEL
    // =========================================================

    const entityLabel =
        mode === 'rm'
            ? 'RM'
            : 'Agent'


    // =========================================================
    // EMPTY
    // =========================================================

    if (!rows.length) {

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

                        <DocumentTextIcon className="
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
                            Loan Wise Performance
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/40
                        ">
                            Application pipeline by loan type
                        </p>

                    </div>

                </div>

                <div className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-base-200/60
                    px-3
                    py-1.5
                    text-xs
                    text-base-content/50
                ">

                    <span>
                        {loanRows.length}
                    </span>

                    <span>
                        Loan Types
                    </span>

                </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="
                mt-5
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                lg:grid-cols-5
            ">

                {/* IN PROCESS */}

                <div className="
                    rounded-xl
                    bg-base-200/40
                    p-3
                ">

                    <p className="
                        text-[11px]
                        text-base-content/45
                    ">
                        In Process
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-bold
                    ">
                        {
                            formatNumber(
                                totals.inProcess
                            )
                        }
                    </p>

                </div>


                {/* LOGIN */}

                <div className="
                    rounded-xl
                    bg-base-200/40
                    p-3
                ">

                    <p className="
                        text-[11px]
                        text-base-content/45
                    ">
                        Login
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-bold
                    ">
                        {
                            formatNumber(
                                totals.login
                            )
                        }
                    </p>

                </div>


                {/* SANCTIONED */}

                <div className="
                    rounded-xl
                    bg-base-200/40
                    p-3
                ">

                    <p className="
                        text-[11px]
                        text-base-content/45
                    ">
                        Sanctioned
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-bold
                    ">
                        {
                            formatNumber(
                                totals.sanctioned
                            )
                        }
                    </p>

                </div>


                {/* DISBURSED */}

                <div className="
                    rounded-xl
                    border
                    border-[#8BCF00]/20
                    bg-[#8BCF00]/5
                    p-3
                ">

                    <p className="
                        text-[11px]
                        text-[#78B300]/70
                    ">
                        Disbursed
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-bold
                        text-[#78B300]
                    ">
                        {
                            formatNumber(
                                totals.disbursed
                            )
                        }
                    </p>

                    <p className="
                        mt-0.5
                        text-[10px]
                        text-[#78B300]/60
                    ">
                        {
                            formatCurrency(
                                totals.disbursedAmount
                            )
                        }
                    </p>

                </div>


                {/* REJECTED */}

                <div className="
                    rounded-xl
                    bg-base-200/40
                    p-3
                ">

                    <p className="
                        text-[11px]
                        text-base-content/45
                    ">
                        Rejected
                    </p>

                    <p className="
                        mt-1
                        text-lg
                        font-bold
                    ">
                        {
                            formatNumber(
                                totals.rejected
                            )
                        }
                    </p>

                </div>

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
                        min-w-[780px]
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
                                    Loan Type
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
                                    Disbursed Amount
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

                            {loanRows.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            String(
                                                item?.loanTypeId ??
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

                                        {/* LOAN TYPE */}

                                        <td className="
                                            px-4
                                            py-3
                                        ">

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
                                                    max-w-[260px]
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        item?.loanTypeName ||
                                                        'Unknown'
                                                    }
                                                </span>

                                            </div>

                                        </td>


                                        {/* IN PROCESS */}

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


                                        {/* LOGIN */}

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


                                        {/* SANCTIONED */}

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


                                        {/* DISBURSED */}

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


                                        {/* DISBURSED AMOUNT */}

                                        <td className="
                                            px-4
                                            py-3
                                            text-right
                                            text-sm
                                            font-medium
                                            text-base-content
                                        ">
                                            {
                                                formatCurrency(
                                                    item?.disbursedAmount
                                                )
                                            }
                                        </td>


                                        {/* REJECTED */}

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


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="
                mt-4
                flex
                flex-wrap
                items-center
                justify-between
                gap-2
                text-xs
                text-base-content/40
            ">

                <span>
                    {entityLabel} loan pipeline
                </span>

                <span className="
                    inline-flex
                    items-center
                    gap-1.5
                ">

                    <ArrowTrendingUpIcon className="
                        h-3.5
                        w-3.5
                        text-[#78B300]
                    " />

                    Disbursement performance

                </span>

            </div>

        </section>

    )

}


export default LoanWisePerformance