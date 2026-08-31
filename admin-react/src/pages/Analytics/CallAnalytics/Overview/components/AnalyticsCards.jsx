// admin-react/src/pages/Analytics/CallAnalytics/Overview/components/AnalyticsCards.jsx

import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhoneArrowDownLeftIcon from '@heroicons/react/24/outline/PhoneArrowDownLeftIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'


// =============================================================
// KPI CARD
// =============================================================

const KpiCard = ({
    title,
    value,
    icon: Icon,
    active,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            className={[
                'w-full',
                'rounded-xl',
                'border',
                'bg-base-100',
                'p-4',
                'text-left',
                'shadow-sm',
                'transition',
                'hover:border-[#8BCF00]/50',
                'hover:shadow-md',
                active
                    ? 'border-[#8BCF00] ring-2 ring-[#8BCF00]/20'
                    : 'border-base-300',
            ].join(' ')}
        >

            <div className="
                flex
                items-center
                justify-between
                gap-3
            ">

                <div className="min-w-0">

                    <p className="
                        text-xs
                        font-medium
                        text-base-content/50
                    ">
                        {title}
                    </p>


                    <p className="
                        mt-2
                        text-2xl
                        font-semibold
                        tracking-tight
                        text-base-content
                    ">
                        {Number(value || 0).toLocaleString('en-IN')}
                    </p>

                </div>


                <div className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-base-200
                ">

                    <Icon className="
                        h-5
                        w-5
                        text-base-content/50
                    " />

                </div>

            </div>

        </button>

    )

}


// =============================================================
// ANALYTICS CARDS
// =============================================================

function AnalyticsCards({
    calls = [],
    activeKpi = '',
    onKpiClick,
}) {

    const answered =
        calls.filter(
            (call) =>
                call.status === 'received'
        ).length


    const missed =
        calls.filter(
            (call) =>
                call.status === 'missed'
        ).length


    const unknown =
        calls.filter(
            (call) =>
                call.status === 'unknown'
        ).length


    const assigned =
        calls.filter(
            (call) =>
                call.followUp === 'assigned' ||
                call.followUp === 'completed' ||
                call.followUp === 'converted'
        ).length


    const converted =
        calls.filter(
            (call) =>
                call.followUp === 'converted'
        ).length


    const cards = [
        {
            key: 'total',
            title: 'Total Calls',
            value: calls.length,
            icon: PhoneIcon,
        },
        {
            key: 'answered',
            title: 'Answered',
            value: answered,
            icon: PhoneArrowDownLeftIcon,
        },
        {
            key: 'missed',
            title: 'Missed',
            value: missed,
            icon: PhoneXMarkIcon,
        },
        {
            key: 'unknown',
            title: 'Unknown',
            value: unknown,
            icon: QuestionMarkCircleIcon,
        },
        {
            key: 'assigned',
            title: 'Assigned',
            value: assigned,
            icon: UserGroupIcon,
        },
        {
            key: 'converted',
            title: 'Converted',
            value: converted,
            icon: CheckCircleIcon,
        },
    ]


    return (

        <div className="
            grid
            grid-cols-2
            gap-4
            lg:grid-cols-3
            xl:grid-cols-6
        ">

            {cards.map(
                (card) => (

                    <KpiCard
                        key={card.key}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        active={
                            activeKpi ===
                            card.key
                        }
                        onClick={() =>
                            onKpiClick?.(
                                card.key
                            )
                        }
                    />

                )
            )}

        </div>

    )

}


export default AnalyticsCards