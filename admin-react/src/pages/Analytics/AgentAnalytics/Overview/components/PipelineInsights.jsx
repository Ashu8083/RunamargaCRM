// admin-react/src/pages/Analytics/AgentAnalytics/Overview/components/PipelineInsights.jsx

import ClockIcon from '@heroicons/react/24/outline/ClockIcon'


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) => {

    return Number(value || 0).toLocaleString('en-IN')

}


const calculatePercentage = (
    value,
    total
) => {

    if (!total) {
        return 0
    }

    return (
        (Number(value || 0) /
            Number(total || 0)) *
        100
    )

}


const roundPercentage = (
    value
) => {

    return `${value.toFixed(1)}%`

}


// =============================================================
// COMPONENT
// =============================================================

function PipelineInsights({
    analytics = [],
}) {

    // =========================================================
    // TOTALS
    // =========================================================

    const totals = analytics.reduce(
        (result, item) => {

            result.leadReceived +=
                Number(
                    item.leadReceived || 0
                )

            result.loggedIn +=
                Number(
                    item.loggedIn || 0
                )

            result.rejected +=
                Number(
                    item.rejected || 0
                )

            result.sanctioned +=
                Number(
                    item.sanctioned || 0
                )

            result.disbursed +=
                Number(
                    item.disbursed || 0
                )

            return result

        },
        {
            leadReceived: 0,
            loggedIn: 0,
            rejected: 0,
            sanctioned: 0,
            disbursed: 0,
        }
    )


    // =========================================================
    // RATES
    // =========================================================

    const loginRate =
        calculatePercentage(
            totals.loggedIn,
            totals.leadReceived
        )


    const rejectionRate =
        calculatePercentage(
            totals.rejected,
            totals.leadReceived
        )


    const sanctionRate =
        calculatePercentage(
            totals.sanctioned,
            totals.loggedIn
        )


    const disbursementRate =
        calculatePercentage(
            totals.disbursed,
            totals.sanctioned
        )


    // =========================================================
    // PIPELINE DROP-OFF
    //
    // Leads that have not reached login and were
    // not rejected.
    // =========================================================

    const pendingLogin = Math.max(
        totals.leadReceived -
            totals.loggedIn -
            totals.rejected,
        0
    )


    // =========================================================
    // PENDING SANCTION
    // =========================================================

    const pendingSanction = Math.max(
        totals.loggedIn -
            totals.rejected -
            totals.sanctioned,
        0
    )


    // =========================================================
    // PENDING DISBURSEMENT
    // =========================================================

    const pendingDisbursement = Math.max(
        totals.sanctioned -
            totals.disbursed,
        0
    )


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!analytics.length) {

        return (

            <section className="
                w-full
                min-w-0
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

                    <ClockIcon className="
                        h-5
                        w-5
                        text-success
                    " />

                    <h3 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Key Insight
                    </h3>

                </div>


                <p className="
                    mt-5
                    text-sm
                    text-base-content/55
                ">
                    No analytics data available for
                    the selected filters.
                </p>

            </section>

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
            border-info/25
            bg-info/5
            p-5
            shadow-sm
        ">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                gap-2
            ">

                <ClockIcon className="
                    h-5
                    w-5
                    shrink-0
                    text-info
                " />

                <h3 className="
                    text-sm
                    font-semibold
                    text-info
                ">
                    Key Insight
                </h3>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="
                mt-5
                space-y-3
            ">

                <p className="
                    text-sm
                    leading-6
                    text-base-content/70
                ">

                    Out of{' '}

                    <span className="
                        font-semibold
                        text-base-content
                    ">
                        {formatNumber(
                            totals.leadReceived
                        )}
                    </span>

                    {' '}leads received in this period:

                </p>


                {/* LOGIN */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-sm
                    text-base-content/70
                ">

                    <span>
                        •
                    </span>

                    <span>
                        {formatNumber(
                            totals.loggedIn
                        )}{' '}
                        reached login
                    </span>

                    <span className="
                        font-medium
                        text-info
                    ">
                        (
                        {roundPercentage(
                            loginRate
                        )}
                        )
                    </span>

                </div>


                {/* REJECTED */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-sm
                    text-base-content/70
                ">

                    <span>
                        •
                    </span>

                    <span>
                        {formatNumber(
                            totals.rejected
                        )}{' '}
                        were rejected
                    </span>

                    <span className="
                        font-medium
                        text-error
                    ">
                        (
                        {roundPercentage(
                            rejectionRate
                        )}
                        )
                    </span>

                </div>


                {/* PENDING LOGIN */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-sm
                    text-base-content/70
                ">

                    <span>
                        •
                    </span>

                    <span>
                        {formatNumber(
                            pendingLogin
                        )}{' '}
                        still pending login
                    </span>

                </div>


                {/* SANCTION */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-sm
                    text-base-content/70
                ">

                    <span>
                        •
                    </span>

                    <span>
                        {formatNumber(
                            totals.sanctioned
                        )}{' '}
                        reached sanction
                    </span>

                    <span className="
                        font-medium
                        text-warning
                    ">
                        (
                        {roundPercentage(
                            sanctionRate
                        )}
                        )
                    </span>

                </div>


                {/* DISBURSED */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-sm
                    text-base-content/70
                ">

                    <span>
                        •
                    </span>

                    <span>
                        {formatNumber(
                            totals.disbursed
                        )}{' '}
                        reached disbursed
                    </span>

                    <span className="
                        font-medium
                        text-success
                    ">
                        (
                        {roundPercentage(
                            disbursementRate
                        )}
                        )
                    </span>

                </div>

            </div>


            {/* =================================================
                SECONDARY INSIGHTS
            ================================================= */}

            <div className="
                mt-6
                border-t
                border-base-300
                pt-5
            ">

                <div className="
                    space-y-3
                ">

                    {/* PIPELINE DROP OFF */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    ">

                        <span className="
                            text-sm
                            text-base-content/70
                        ">
                            Pipeline drop-off
                            <span className="
                                text-xs
                                text-base-content/50
                            ">
                                {' '}(excluding rejected)
                            </span>
                        </span>


                        <span className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {formatNumber(
                                pendingLogin
                            )}
                        </span>

                    </div>


                    {/* PENDING SANCTION */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    ">

                        <span className="
                            text-sm
                            text-base-content/70
                        ">
                            Pending sanction
                        </span>


                        <span className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {formatNumber(
                                pendingSanction
                            )}
                        </span>

                    </div>


                    {/* PENDING DISBURSEMENT */}

                    <div className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    ">

                        <span className="
                            text-sm
                            text-base-content/70
                        ">
                            Pending disbursement
                        </span>


                        <span className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {formatNumber(
                                pendingDisbursement
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </section>

    )

}


export default PipelineInsights