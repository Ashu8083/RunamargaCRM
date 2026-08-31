// admin-react/src/pages/Analytics/CallAnalytics/Performance/components/PerformanceCards.jsx

import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ArrowTrendingUpIcon from '@heroicons/react/24/outline/ArrowTrendingUpIcon'


// =============================================================
// HELPERS
// =============================================================

const getValue = (calls, key) =>
    calls.reduce(
        (total, call) =>
            total + Number(call[key] || 0),
        0
    )


const getAnswered = (calls) =>
    calls.reduce(
        (total, call) =>
            total + Number(call.answered || 0),
        0
    )


const getTotalCalls = (calls) =>
    calls.reduce(
        (total, call) =>
            total +
            Number(
                call.incoming || 0
            ) +
            Number(
                call.outgoing || 0
            ),
        0
    )


const getAnswerRate = (calls) => {

    const total =
        getTotalCalls(calls)

    if (!total) {
        return 0
    }

    return (
        getAnswered(calls) /
        total
    ) * 100

}


// =============================================================
// COMPONENT
// =============================================================

function PerformanceCards({
    agents = [],
}) {

    // =========================================================
    // KPI VALUES
    // =========================================================

    const totalAgents =
        agents.length


    const callsHandled =
        getTotalCalls(agents)


    const answered =
        getAnswered(agents)


    const missed =
        getValue(
            agents,
            'missed'
        )


    const applications =
        getValue(
            agents,
            'applications'
        )


    const converted =
        getValue(
            agents,
            'converted'
        )


    const answerRate =
        getAnswerRate(agents)


    // =========================================================
    // CARD CONFIG
    // =========================================================

    const cards = [
        {
            label: 'Total Agents',
            value: totalAgents,
            icon: ChartBarIcon,
        },
        {
            label: 'Calls Handled',
            value: callsHandled,
            icon: PhoneIcon,
        },
        {
            label: 'Answer Rate',
            value: `${answerRate.toFixed(1)}%`,
            icon: CheckCircleIcon,
        },
        {
            label: 'Missed Calls',
            value: missed,
            icon: PhoneXMarkIcon,
        },
        {
            label: 'Applications',
            value: applications,
            icon: DocumentTextIcon,
        },
        {
            label: 'Conversions',
            value: converted,
            icon: ArrowTrendingUpIcon,
        },
    ]


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-3
            xl:grid-cols-6
        ">

            {cards.map(
                (card) => {

                    const Icon =
                        card.icon


                    return (

                        <div
                            key={
                                card.label
                            }
                            className="
                                rounded-xl
                                border
                                border-base-300
                                bg-base-100
                                p-4
                                shadow-sm
                            "
                        >

                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-3
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        font-medium
                                        text-base-content/50
                                    ">
                                        {
                                            card.label
                                        }
                                    </p>


                                    <p className="
                                        mt-2
                                        text-xl
                                        font-semibold
                                        text-base-content
                                    ">
                                        {
                                            card.value
                                        }
                                    </p>

                                </div>


                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#8BCF00]/10
                                    text-[#6FA800]
                                ">

                                    <Icon className="
                                        h-4
                                        w-4
                                    " />

                                </div>

                            </div>

                        </div>

                    )

                }
            )}

        </div>

    )

}


export default PerformanceCards