// admin-react/src/pages/Analytics/AgentAnalytics/Overview/components/PipelineInsights.jsx

import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import CurrencyRupeeIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'


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
// INSIGHT CARD
// =============================================================

function InsightCard({
    title,
    value,
    description,
    icon: Icon,
    iconClass,
    valueClass,
    borderClass,
}) {

    return (

        <div
            className={`
                group
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                bg-base-100
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                ${borderClass}
            `}
        >

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div
                className="
                    flex
                    min-w-0
                    items-start
                    justify-between
                    gap-3
                "
            >

                {/* =================================================
                    ICON
                ================================================= */}

                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition-transform
                        duration-200
                        group-hover:scale-105
                        ${iconClass}
                    `}
                >

                    <Icon
                        className="
                            h-5
                            w-5
                        "
                    />

                </div>


                {/* =================================================
                    TYPE
                ================================================= */}

                <span
                    className="
                        rounded-full
                        bg-base-200/70
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-base-content/40
                    "
                >
                    Events
                </span>

            </div>


            {/* =================================================
                COUNT
            ================================================= */}

            <div
                className="
                    mt-5
                    min-w-0
                "
            >

                <p
                    className={`
                        truncate
                        text-3xl
                        font-bold
                        tracking-tight
                        ${valueClass}
                    `}
                >
                    {formatNumber(
                        value
                    )}
                </p>


                <h3
                    className="
                        mt-2
                        truncate
                        text-sm
                        font-semibold
                        text-base-content
                    "
                >
                    {title}
                </h3>


                <p
                    className="
                        mt-1
                        min-h-[32px]
                        break-words
                        text-[11px]
                        leading-4
                        text-base-content/50
                    "
                >
                    {description}
                </p>

            </div>

        </div>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function PipelineInsights({
    counts = {},
}) {

    // =========================================================
    // EVENT COUNTS
    // =========================================================

    const totalLeads =
        Number(
            counts?.totalLeads || 0
        )


    const inProcess =
        Number(
            counts?.inProcess || 0
        )


    const login =
        Number(
            counts?.login || 0
        )


    const sanctioned =
        Number(
            counts?.sanctioned || 0
        )


    const disbursed =
        Number(
            counts?.disbursed || 0
        )


    const rejected =
        Number(
            counts?.rejected || 0
        )


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section
            className="
                w-full
                min-w-0
            "
        >

            {/* =================================================
                SECTION HEADER
            ================================================= */}

            <div
                className="
                    mb-4
                    flex
                    min-w-0
                    flex-wrap
                    items-end
                    justify-between
                    gap-3
                "
            >

                <div
                    className="
                        min-w-0
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <div
                            className="
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-full
                                bg-primary
                            "
                        />


                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-base-content
                                sm:text-base
                            "
                        >
                            Pipeline Insights
                        </h2>

                    </div>


                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-base-content/50
                        "
                    >
                        Events recorded during the selected date range
                    </p>

                </div>

            </div>


            {/* =================================================
                INSIGHT GRID
            ================================================= */}

            <div
                className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >

                {/* =================================================
                    TOTAL LEADS
                ================================================= */}

                <InsightCard
                    title="Total Leads"
                    value={
                        totalLeads
                    }
                    description="Applications received during the selected application period."
                    icon={
                        DocumentTextIcon
                    }
                    iconClass="
                        bg-primary/10
                        text-primary
                    "
                    valueClass="
                        text-base-content
                    "
                    borderClass="
                        border-primary/10
                    "
                />


                {/* =================================================
                    IN PROCESS
                ================================================= */}

                <InsightCard
                    title="In Process"
                    value={
                        inProcess
                    }
                    description="Applications from the selected period with no recorded progression or rejection event."
                    icon={
                        ClockIcon
                    }
                    iconClass="
                        bg-warning/10
                        text-warning
                    "
                    valueClass="
                        text-warning
                    "
                    borderClass="
                        border-warning/10
                    "
                />


                {/* =================================================
                    LOGIN
                ================================================= */}

                <InsightCard
                    title="Login"
                    value={
                        login
                    }
                    description="Applications with a login event recorded during the selected date range."
                    icon={
                        ArrowRightOnRectangleIcon
                    }
                    iconClass="
                        bg-info/10
                        text-info
                    "
                    valueClass="
                        text-info
                    "
                    borderClass="
                        border-info/10
                    "
                />


                {/* =================================================
                    SANCTIONED
                ================================================= */}

                <InsightCard
                    title="Sanctioned"
                    value={
                        sanctioned
                    }
                    description="Applications with a sanction event recorded during the selected date range."
                    icon={
                        CheckCircleIcon
                    }
                    iconClass="
                        bg-success/10
                        text-success
                    "
                    valueClass="
                        text-success
                    "
                    borderClass="
                        border-success/10
                    "
                />


                {/* =================================================
                    DISBURSED
                ================================================= */}

                <InsightCard
                    title="Disbursed"
                    value={
                        disbursed
                    }
                    description="Applications with a disbursement event recorded during the selected date range."
                    icon={
                        CurrencyRupeeIcon
                    }
                    iconClass="
                        bg-secondary/10
                        text-secondary
                    "
                    valueClass="
                        text-secondary
                    "
                    borderClass="
                        border-secondary/10
                    "
                />


                {/* =================================================
                    REJECTED
                ================================================= */}

                <InsightCard
                    title="Rejected"
                    value={
                        rejected
                    }
                    description="Applications with a rejection date falling within the selected date range."
                    icon={
                        XCircleIcon
                    }
                    iconClass="
                        bg-error/10
                        text-error
                    "
                    valueClass="
                        text-error
                    "
                    borderClass="
                        border-error/10
                    "
                />

            </div>

        </section>

    )

}


export default PipelineInsights