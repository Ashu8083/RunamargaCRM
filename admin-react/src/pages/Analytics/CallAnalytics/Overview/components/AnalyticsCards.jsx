// admin-react/src/pages/Analytics/CallAnalytics/Overview/components/AnalyticsCards.jsx

import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhoneArrowDownLeftIcon from '@heroicons/react/24/outline/PhoneArrowDownLeftIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import QuestionMarkCircleIcon from '@heroicons/react/24/outline/QuestionMarkCircleIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'


// =============================================================
// DEFAULT SUMMARY
// =============================================================

const DEFAULT_SUMMARY = {
    total: 0,
    answered: 0,
    missed: 0,
    unknown: 0,
    assigned: 0,
    converted: 0,
}


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
                        {Number(
                            value || 0
                        ).toLocaleString('en-IN')}
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
    summary = DEFAULT_SUMMARY,
    activeKpi = '',
    onKpiClick,
}) {

    // =========================================================
    // SAFE SUMMARY
    // =========================================================

    const safeSummary = {
        ...DEFAULT_SUMMARY,
        ...(summary || {}),
    }


    // =========================================================
    // BACKEND SUMMARY
    // =========================================================

    const total =
        Number(
            safeSummary.total || 0
        )


    const answered =
        Number(
            safeSummary.answered || 0
        )


    const missed =
        Number(
            safeSummary.missed || 0
        )


    const unknown =
        Number(
            safeSummary.unknown || 0
        )


    const assigned =
        Number(
            safeSummary.assigned || 0
        )


    const converted =
        Number(
            safeSummary.converted || 0
        )


    // =========================================================
    // CARDS
    // =========================================================

    const cards = [

        {
            key: 'total',
            title: 'Total Calls',
            value: total,
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


    // =========================================================
    // RENDER
    // =========================================================

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
                        key={
                            card.key
                        }

                        title={
                            card.title
                        }

                        value={
                            card.value
                        }

                        icon={
                            card.icon
                        }

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