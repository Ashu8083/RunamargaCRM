// admin-react/src/pages/Analytics/CallAnalytics/Performance/components/AgentPerformanceModal.jsx

import {
    XMarkIcon,
} from "@heroicons/react/24/outline";


// =============================================================
// FORMAT DURATION
// =============================================================

const formatDuration = (seconds) => {

    const totalSeconds = Number(seconds || 0);

    const minutes = Math.floor(
        totalSeconds / 60
    );

    const remainingSeconds =
        totalSeconds % 60;

    return `${minutes}m ${String(
        remainingSeconds
    ).padStart(2, "0")}s`;
};


// =============================================================
// PERCENTAGE
// =============================================================

const getPercentage = (
    value,
    total
) => {

    const numericValue = Number(
        value || 0
    );

    const numericTotal = Number(
        total || 0
    );

    if (numericTotal <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            (numericValue / numericTotal) * 100
        )
    );
};


// =============================================================
// METRIC CARD
// =============================================================

function Metric({
    label,
    value,
}) {

    return (

        <div className="
            rounded-xl
            border
            border-base-300
            bg-base-100
            p-4
        ">

            <p className="
                text-xs
                font-medium
                text-base-content/50
            ">
                {label}
            </p>

            <p className="
                mt-1
                text-xl
                font-semibold
                text-base-content
            ">
                {value}
            </p>

        </div>

    );
}


// =============================================================
// PERFORMANCE BAR
// =============================================================

function PerformanceBar({
    label,
    percentage,
}) {

    const safePercentage = Math.round(
        Math.min(
            100,
            Math.max(
                0,
                Number(percentage || 0)
            )
        )
    );

    return (

        <div className="space-y-2">

            <div className="
                flex
                items-center
                justify-between
            ">

                <span className="
                    text-xs
                    font-medium
                    text-base-content/60
                ">
                    {label}
                </span>

                <span className="
                    text-xs
                    font-semibold
                    text-base-content/70
                ">
                    {safePercentage}%
                </span>

            </div>


            <div className="
                h-2
                w-full
                overflow-hidden
                rounded-full
                bg-base-200
            ">

                <div
                    className="
                        h-full
                        rounded-full
                        bg-[#8BCF00]
                        transition-all
                    "
                    style={{
                        width: `${safePercentage}%`,
                    }}
                />

            </div>

        </div>

    );
}


// =============================================================
// MODAL
// =============================================================

function AgentPerformanceModal({
    open = false,
    agent = null,
    onClose,
}) {

    if (!open || !agent) {
        return null;
    }


    const incoming = Number(
        agent.incoming || 0
    );

    const outgoing = Number(
        agent.outgoing || 0
    );

    const answered = Number(
        agent.answered || 0
    );

    const missed = Number(
        agent.missed || 0
    );

    const applications = Number(
        agent.applications || 0
    );

    const converted = Number(
        agent.converted || 0
    );

    const assignments = Number(
        agent.assignments || 0
    );

    const callsHandled = Number(
        agent.callsHandled || assignments
    );

    const totalCalls = Number(
        agent.totalCalls ||
        (incoming + outgoing)
    );


    const answerRate = getPercentage(
        answered,
        totalCalls
    );

    const conversionRate = getPercentage(
        converted,
        applications
    );


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
            onClick={onClose}
        >

            <div
                className="
                    w-full
                    max-w-2xl
                    overflow-hidden
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-xl
                "
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-6
                    py-5
                ">

                    <div>

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <h2 className="
                                text-lg
                                font-semibold
                                text-base-content
                            ">
                                {
                                    agent.name ||
                                    "Agent Performance"
                                }
                            </h2>

                            <span className="
                                rounded-full
                                bg-[#8BCF00]/10
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-[#6FA800]
                            ">
                                {
                                    agent.status ||
                                    "active"
                                }
                            </span>

                        </div>


                        {agent.team && (

                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                {agent.team}
                            </p>

                        )}

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
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

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =====================================================
                    BODY
                ===================================================== */}

                <div className="
                    max-h-[75vh]
                    overflow-y-auto
                    px-6
                    py-6
                ">

                    {/* =================================================
                        METRICS
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-3
                    ">

                        <Metric
                            label="Calls"
                            value={totalCalls}
                        />

                        <Metric
                            label="Calls Handled"
                            value={callsHandled}
                        />

                        <Metric
                            label="Answered"
                            value={answered}
                        />

                        <Metric
                            label="Missed"
                            value={missed}
                        />

                        <Metric
                            label="Applications"
                            value={applications}
                        />

                        <Metric
                            label="Converted"
                            value={converted}
                        />

                    </div>


                    {/* =================================================
                        AVG TALK
                    ================================================= */}

                    <div className="
                        mt-4
                        rounded-xl
                        border
                        border-base-300
                        bg-base-100
                        p-4
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    font-medium
                                    text-base-content/50
                                ">
                                    Average Talk Time
                                </p>

                                <p className="
                                    mt-1
                                    text-xl
                                    font-semibold
                                    text-base-content
                                ">
                                    {
                                        formatDuration(
                                            agent.avgTalkSeconds
                                        )
                                    }
                                </p>

                            </div>


                            <div className="
                                text-right
                            ">

                                <p className="
                                    text-xs
                                    text-base-content/45
                                ">
                                    Assignments
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-base-content/70
                                ">
                                    {assignments}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PERFORMANCE
                    ================================================= */}

                    <div className="
                        mt-6
                    ">

                        <h3 className="
                            mb-4
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            Performance
                        </h3>


                        <div className="
                            space-y-5
                        ">

                            <PerformanceBar
                                label="Answer Rate"
                                percentage={
                                    answerRate
                                }
                            />

                            <PerformanceBar
                                label="Conversion Rate"
                                percentage={
                                    conversionRate
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        CALL BREAKDOWN
                    ================================================= */}

                    <div className="
                        mt-6
                    ">

                        <h3 className="
                            mb-4
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            Call Breakdown
                        </h3>


                        <div className="
                            grid
                            grid-cols-2
                            gap-3
                        ">

                            <div className="
                                rounded-xl
                                border
                                border-base-300
                                p-4
                            ">

                                <p className="
                                    text-xs
                                    text-base-content/50
                                ">
                                    Incoming
                                </p>

                                <p className="
                                    mt-1
                                    text-lg
                                    font-semibold
                                    text-base-content
                                ">
                                    {incoming}
                                </p>

                            </div>


                            <div className="
                                rounded-xl
                                border
                                border-base-300
                                p-4
                            ">

                                <p className="
                                    text-xs
                                    text-base-content/50
                                ">
                                    Outgoing
                                </p>

                                <p className="
                                    mt-1
                                    text-lg
                                    font-semibold
                                    text-base-content
                                ">
                                    {outgoing}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="
                    flex
                    justify-end
                    border-t
                    border-base-300
                    px-6
                    py-4
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            border
                            border-base-300
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-base-content/70
                            transition
                            hover:bg-base-200
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );
}


export default AgentPerformanceModal;