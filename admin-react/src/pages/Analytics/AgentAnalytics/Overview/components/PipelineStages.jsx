// admin-react/src/pages/Analytics/AgentAnalytics/Overview/components/PipelineStages.jsx

import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import CurrencyRupeeIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'


// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) => {

    return Number(value || 0).toLocaleString('en-IN')

}


const getPercentage = (
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


const formatPercentage = (value) => {

    return `${Number(value || 0).toFixed(1)}%`

}


// =============================================================
// PIPELINE STAGE
// =============================================================

function PipelineStage({
    title,
    value,
    percentage,
    icon: Icon,
    iconClass,
    valueClass,
}) {

    return (

        <div className="
            min-w-[150px]
            flex-1
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
                gap-3
            ">

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                ">

                    <div className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        ${iconClass}
                    `}>

                        <Icon className="
                            h-4
                            w-4
                        " />

                    </div>


                    <p className="
                        truncate
                        text-xs
                        font-medium
                        text-base-content/55
                    ">
                        {title}
                    </p>

                </div>


                <span className="
                    shrink-0
                    text-[11px]
                    font-medium
                    text-base-content/40
                ">
                    {formatPercentage(percentage)}
                </span>

            </div>


            <p className={`
                mt-4
                text-2xl
                font-bold
                tracking-tight
                ${valueClass}
            `}>
                {formatNumber(value)}
            </p>


            <div className="
                mt-3
                h-1.5
                w-full
                overflow-hidden
                rounded-full
                bg-base-200
            ">

                <div
                    className="
                        h-full
                        rounded-full
                        bg-current
                        transition-all
                        duration-500
                    "
                    style={{
                        width: `${Math.min(
                            Math.max(
                                percentage || 0,
                                0
                            ),
                            100
                        )}%`,
                    }}
                />

            </div>

        </div>

    )

}


// =============================================================
// COMPONENT
// =============================================================

function PipelineStages({
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
    // STAGE RATES
    // =========================================================

    const loginRate =
        getPercentage(
            totals.loggedIn,
            totals.leadReceived
        )


    const rejectionRate =
        getPercentage(
            totals.rejected,
            totals.leadReceived
        )


    const sanctionRate =
        getPercentage(
            totals.sanctioned,
            totals.loggedIn
        )


    const disbursementRate =
        getPercentage(
            totals.disbursed,
            totals.sanctioned
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
                    justify-between
                    gap-3
                ">

                    <div>

                        <h3 className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            Application Pipeline
                        </h3>

                        <p className="
                            mt-1
                            text-xs
                            text-base-content/45
                        ">
                            Lead movement across application stages
                        </p>

                    </div>

                </div>


                <div className="
                    mt-8
                    rounded-xl
                    bg-base-200/50
                    px-4
                    py-8
                    text-center
                ">

                    <p className="
                        text-sm
                        text-base-content/45
                    ">
                        No pipeline data available
                    </p>

                </div>

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
            border-base-300
            bg-base-100
            p-5
            shadow-sm
        ">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                flex-wrap
                items-start
                justify-between
                gap-3
            ">

                <div>

                    <h3 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Application Pipeline
                    </h3>

                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Lead movement across application stages
                    </p>

                </div>


                <div className="
                    rounded-lg
                    bg-[#8BCF00]/10
                    px-3
                    py-1.5
                ">

                    <span className="
                        text-xs
                        font-medium
                        text-[#78B300]
                    ">
                        {formatNumber(
                            totals.leadReceived
                        )}{' '}
                        Total Leads
                    </span>

                </div>

            </div>


            {/* =================================================
                PIPELINE
            ================================================= */}

            <div className="
                mt-6
                flex
                w-full
                items-stretch
                gap-2
                overflow-x-auto
                pb-2
            ">

                {/* LEADS */}

                <PipelineStage
                    title="Leads"
                    value={totals.leadReceived}
                    percentage={100}
                    icon={DocumentTextIcon}
                    iconClass="
                        bg-[#8BCF00]/10
                        text-[#78B300]
                    "
                    valueClass="
                        text-[#78B300]
                    "
                />


                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                ">

                    <ArrowRightIcon className="
                        h-4
                        w-4
                        text-base-content/25
                    " />

                </div>


                {/* LOGIN */}

                <PipelineStage
                    title="Logged In"
                    value={totals.loggedIn}
                    percentage={loginRate}
                    icon={CheckCircleIcon}
                    iconClass="
                        bg-[#009FE3]/10
                        text-[#009FE3]
                    "
                    valueClass="
                        text-[#008FD0]
                    "
                />


                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                ">

                    <ArrowRightIcon className="
                        h-4
                        w-4
                        text-base-content/25
                    " />

                </div>


                {/* SANCTION */}

                <PipelineStage
                    title="Sanctioned"
                    value={totals.sanctioned}
                    percentage={sanctionRate}
                    icon={CheckCircleIcon}
                    iconClass="
                        bg-[#D97706]/10
                        text-[#D97706]
                    "
                    valueClass="
                        text-[#C26100]
                    "
                />


                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                ">

                    <ArrowRightIcon className="
                        h-4
                        w-4
                        text-base-content/25
                    " />

                </div>


                {/* DISBURSED */}

                <PipelineStage
                    title="Disbursed"
                    value={totals.disbursed}
                    percentage={disbursementRate}
                    icon={CurrencyRupeeIcon}
                    iconClass="
                        bg-[#25803C]/10
                        text-[#25803C]
                    "
                    valueClass="
                        text-[#25803C]
                    "
                />

            </div>


            {/* =================================================
                REJECTION SUMMARY
            ================================================= */}

            <div className="
                mt-4
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-[#D92D20]/15
                bg-[#D92D20]/5
                px-4
                py-3
            ">

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                ">

                    <div className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#D92D20]/10
                    ">

                        <XCircleIcon className="
                            h-4
                            w-4
                            text-[#D92D20]
                        " />

                    </div>


                    <div>

                        <p className="
                            text-xs
                            font-medium
                            text-base-content/65
                        ">
                            Rejected
                        </p>

                        <p className="
                            mt-0.5
                            text-[11px]
                            text-base-content/40
                        ">
                            Leads rejected during processing
                        </p>

                    </div>

                </div>


                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <span className="
                        text-lg
                        font-bold
                        text-[#D92D20]
                    ">
                        {formatNumber(
                            totals.rejected
                        )}
                    </span>


                    <span className="
                        rounded-full
                        bg-[#D92D20]/10
                        px-2
                        py-1
                        text-[11px]
                        font-semibold
                        text-[#D92D20]
                    ">
                        {formatPercentage(
                            rejectionRate
                        )}
                    </span>

                </div>

            </div>

        </section>

    )

}


export default PipelineStages