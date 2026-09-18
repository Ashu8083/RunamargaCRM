import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'

// ============================================================================
// HELPERS
// ============================================================================

const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('en-IN')
}

const getPercentage = (value, total) => {
    if (!total) return 0

    return (Number(value || 0) / Number(total || 0)) * 100
}

const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`
}

// ============================================================================
// COMPONENT
// ============================================================================

function OverallSuccessRate({ analytics = [] }) {
    const totals = analytics.reduce(
        (result, item) => {
            result.leadReceived += Number(item.leadReceived || 0)
            result.loggedIn += Number(item.loggedIn || 0)
            result.rejected += Number(item.rejected || 0)
            result.sanctioned += Number(item.sanctioned || 0)
            result.disbursed += Number(item.disbursed || 0)

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

    const loginRate = getPercentage(
        totals.loggedIn,
        totals.leadReceived
    )

    const sanctionRate = getPercentage(
        totals.sanctioned,
        totals.loggedIn
    )

    const disbursementRate = getPercentage(
        totals.disbursed,
        totals.sanctioned
    )

    const overallSuccessRate = getPercentage(
        totals.disbursed,
        totals.leadReceived
    )

    // ========================================================================
    // EMPTY STATE
    // ========================================================================

    if (!analytics.length) {
        return (
            <section
                className="
                    w-full
                    min-w-0
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    p-5
                    shadow-sm
                "
            >
                <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-success" />

                    <h3 className="text-sm font-semibold text-base-content">
                        Overall Success Rate
                    </h3>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-4xl font-bold text-base-content/25">
                        0.0%
                    </p>

                    <p className="mt-2 text-xs text-base-content/50">
                        No data for selected filters
                    </p>
                </div>
            </section>
        )
    }

    // ========================================================================
    // MAIN CONTENT
    // ========================================================================

    return (
        <section
            className="
                w-full
                min-w-0
                rounded-2xl
                border
                border-base-300
                bg-base-100
                p-5
                shadow-sm
            "
        >
            {/* HEADER */}
            <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-success" />

                <h3 className="text-sm font-semibold text-base-content">
                    Overall Success Rate
                </h3>
            </div>

            {/* OVERALL SUCCESS RATE */}
            <div className="mt-6 text-center">
                <div className="text-4xl font-bold tracking-tight text-success">
                    {formatPercentage(overallSuccessRate)}
                </div>

                <p className="mt-1 text-xs text-base-content/50">
                    Leads to Disbursement
                </p>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
                    <div
                        className="
                            h-full
                            rounded-full
                            bg-success
                            transition-all
                            duration-500
                        "
                        style={{
                            width: `${Math.min(overallSuccessRate, 100)}%`,
                        }}
                    />
                </div>
            </div>

            {/* CONVERSION RATES */}
            <div className="mt-6 space-y-3 border-t border-base-300 pt-5">
                {/* LOGIN */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-xs text-base-content/60">
                            Lead → Login
                        </p>

                        <p className="mt-0.5 text-xs text-base-content/40">
                            {formatNumber(totals.loggedIn)} of{' '}
                            {formatNumber(totals.leadReceived)}
                        </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-base-content">
                        {formatPercentage(loginRate)}
                    </span>
                </div>

                {/* SANCTION */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-xs text-base-content/60">
                            Login → Sanction
                        </p>

                        <p className="mt-0.5 text-xs text-base-content/40">
                            {formatNumber(totals.sanctioned)} of{' '}
                            {formatNumber(totals.loggedIn)}
                        </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-base-content">
                        {formatPercentage(sanctionRate)}
                    </span>
                </div>

                {/* DISBURSEMENT */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-xs text-base-content/60">
                            Sanction → Disbursement
                        </p>

                        <p className="mt-0.5 text-xs text-base-content/40">
                            {formatNumber(totals.disbursed)} of{' '}
                            {formatNumber(totals.sanctioned)}
                        </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-base-content">
                        {formatPercentage(disbursementRate)}
                    </span>
                </div>
            </div>

            {/* DISBURSED SUMMARY */}
            <div className="mt-5 rounded-lg bg-base-200/50 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-base-content/60">
                        Disbursed
                    </span>

                    <span className="text-sm font-semibold text-base-content">
                        {formatNumber(totals.disbursed)}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default OverallSuccessRate