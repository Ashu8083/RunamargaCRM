// admin-react/src/pages/Analytics/CallAnalytics/Performance/components/AgentPerformanceModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ArrowTrendingUpIcon from '@heroicons/react/24/outline/ArrowTrendingUpIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'


// =============================================================
// HELPERS
// =============================================================

const formatDuration = (seconds) => {
    const total = Number(seconds) || 0
    const minutes = Math.floor(total / 60)
    const remaining = total % 60

    return `${minutes}m ${String(remaining).padStart(2, '0')}s`
}


const getPercentage = (value, total) => {
    if (!total) {
        return 0
    }

    return Number(((value / total) * 100).toFixed(1))
}


// =============================================================
// PERFORMANCE BAR
// =============================================================

function PerformanceBar({
    label,
    value,
}) {
    const percentage = Math.min(
        Math.max(Number(value) || 0, 0),
        100
    )

    return (
        <div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-base-content/50">
                    {label}
                </span>

                <span className="font-semibold text-base-content">
                    {percentage.toFixed(1)}%
                </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-base-300">
                <div
                    className="h-full rounded-full bg-[#8BCF00] transition-all"
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    )
}


// =============================================================
// COMPONENT
// =============================================================

function AgentPerformanceModal({
    open = false,
    agent = null,
    onClose,
}) {

    if (!open || !agent) {
        return null
    }


    // =========================================================
    // VALUES
    // =========================================================

    const incoming = Number(agent.incoming) || 0
    const outgoing = Number(agent.outgoing) || 0
    const answered = Number(agent.answered) || 0
    const missed = Number(agent.missed) || 0
    const applications = Number(agent.applications) || 0
    const converted = Number(agent.converted) || 0

    const totalCalls =
        incoming + outgoing

    const answerRate =
        getPercentage(
            answered,
            totalCalls
        )

    const conversionRate =
        getPercentage(
            converted,
            applications
        )


    // =========================================================
    // METRICS
    // =========================================================

    const metrics = [
        {
            label: 'Calls',
            value: totalCalls,
            icon: PhoneIcon,
        },
        {
            label: 'Answered',
            value: answered,
            icon: CheckCircleIcon,
        },
        {
            label: 'Missed',
            value: missed,
            icon: PhoneXMarkIcon,
        },
        {
            label: 'Applications',
            value: applications,
            icon: DocumentTextIcon,
        },
        {
            label: 'Converted',
            value: converted,
            icon: ArrowTrendingUpIcon,
        },
        {
            label: 'Avg Talk',
            value: formatDuration(
                agent.avgTalkSeconds
            ),
            icon: ClockIcon,
        },
    ]


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/40
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose?.()
                }
            }}
        >

            <div
                className="
                    flex
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-2xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-base-300
                        px-5
                        py-4
                    "
                >

                    <div>

                        <div className="flex items-center gap-2">

                            <h2
                                className="
                                    text-base
                                    font-semibold
                                    text-base-content
                                "
                            >
                                {agent.name || 'Agent'}
                            </h2>

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-full
                                    border
                                    border-[#8BCF00]/30
                                    bg-[#8BCF00]/10
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-[#6FA800]
                                "
                            >

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#8BCF00]
                                    "
                                />

                                Active

                            </span>

                        </div>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-base-content/45
                            "
                        >
                            {agent.team || '—'}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        title="Close"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        p-5
                    "
                >

                    {/* =================================================
                        METRICS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                            sm:grid-cols-3
                        "
                    >

                        {metrics.map((metric) => {

                            const Icon = metric.icon

                            return (
                                <div
                                    key={metric.label}
                                    className="
                                        rounded-xl
                                        border
                                        border-base-300
                                        bg-base-100
                                        p-3.5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <Icon
                                            className="
                                                h-4
                                                w-4
                                                text-base-content/40
                                            "
                                        />

                                        <span
                                            className="
                                                text-xs
                                                text-base-content/50
                                            "
                                        >
                                            {metric.label}
                                        </span>

                                    </div>


                                    <p
                                        className="
                                            mt-2
                                            text-lg
                                            font-semibold
                                            text-base-content
                                        "
                                    >
                                        {metric.value}
                                    </p>

                                </div>
                            )
                        })}

                    </div>


                    {/* =================================================
                        PERFORMANCE SUMMARY
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-base-300
                            bg-base-200/20
                            p-4
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-semibold
                                text-base-content/70
                            "
                        >
                            Performance Summary
                        </p>


                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                            "
                        >

                            <PerformanceBar
                                label="Answer Rate"
                                value={answerRate}
                            />

                            <PerformanceBar
                                label="Conversion Rate"
                                value={conversionRate}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        CALL BREAKDOWN
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-base-300
                            p-4
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-semibold
                                text-base-content/70
                            "
                        >
                            Call Breakdown
                        </p>


                        <div
                            className="
                                mt-3
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >

                            {/* INCOMING */}

                            <div
                                className="
                                    rounded-lg
                                    bg-blue-50
                                    px-3
                                    py-2.5
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-medium
                                        text-blue-600
                                    "
                                >
                                    Incoming
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-blue-700
                                    "
                                >
                                    {incoming}
                                </p>

                            </div>


                            {/* OUTGOING */}

                            <div
                                className="
                                    rounded-lg
                                    bg-violet-50
                                    px-3
                                    py-2.5
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-medium
                                        text-violet-600
                                    "
                                >
                                    Outgoing
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-violet-700
                                    "
                                >
                                    {outgoing}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        justify-end
                        border-t
                        border-base-300
                        px-5
                        py-4
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-9
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    )
}


export default AgentPerformanceModal