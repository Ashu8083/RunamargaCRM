// admin-react/src/pages/Analytics/CallAnalytics/Performance/components/AgentPerformanceTable.jsx

import EyeIcon from '@heroicons/react/24/outline/EyeIcon'


// =============================================================
// FORMAT DURATION
// =============================================================

const formatDuration = (seconds) => {

    const totalSeconds =
        Number(seconds || 0)

    const minutes =
        Math.floor(
            totalSeconds / 60
        )

    const remainingSeconds =
        totalSeconds % 60

    return `${minutes}m ${String(
        remainingSeconds
    ).padStart(2, '0')}s`

}


// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState() {

    return (

        <div className="
            flex
            min-h-[260px]
            flex-col
            items-center
            justify-center
            px-6
            text-center
        ">

            <div className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-base-200
            ">

                <span className="
                    text-lg
                    font-semibold
                    text-base-content/30
                ">
                    —
                </span>

            </div>


            <p className="
                mt-4
                text-sm
                font-semibold
                text-base-content/70
            ">
                No agent performance found
            </p>


            <p className="
                mt-1
                text-xs
                text-base-content/45
            ">
                Try changing your filters.
            </p>

        </div>

    )

}


// =============================================================
// TABLE
// =============================================================

function AgentPerformanceTable({
    agents = [],
    onView,
}) {

    return (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {agents.length ? (

                <div className="
                    w-full
                    overflow-x-auto
                ">

                    <table className="
                        w-full
                        min-w-[1100px]
                        border-collapse
                    ">

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                                bg-base-200/40
                            ">

                                <th className="
                                    w-[55px]
                                    px-4
                                    py-3.5
                                    text-center
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    #
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    RM / Agent
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Team
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Incoming
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Outgoing
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Answered
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Missed
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Applications
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Converted
                                </th>


                                <th className="
                                    px-4
                                    py-3.5
                                    text-right
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Avg Talk
                                </th>


                                <th className="
                                    w-[90px]
                                    px-4
                                    py-3.5
                                    text-center
                                    text-xs
                                    font-semibold
                                    text-base-content/65
                                ">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        {/* =================================================
                            BODY
                        ================================================= */}

                        <tbody>

                            {agents.map(
                                (agent, index) => {

                                    return (

                                        <tr
                                            key={
                                                agent.id ??
                                                index
                                            }
                                            className="
                                                border-b
                                                border-base-300
                                                last:border-b-0
                                                transition-colors
                                                hover:bg-base-200/30
                                            "
                                        >

                                            {/* # */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-center
                                                text-xs
                                                text-base-content/45
                                            ">
                                                {
                                                    index + 1
                                                }
                                            </td>


                                            {/* NAME */}

                                            <td className="
                                                px-4
                                                py-4
                                            ">

                                                <p className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        agent.name ||
                                                        '—'
                                                    }
                                                </p>

                                            </td>


                                            {/* TEAM */}

                                            <td className="
                                                px-4
                                                py-4
                                            ">

                                                <span className="
                                                    whitespace-nowrap
                                                    text-xs
                                                    text-base-content/60
                                                ">
                                                    {
                                                        agent.team ||
                                                        '—'
                                                    }
                                                </span>

                                            </td>


                                            {/* INCOMING */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        agent.incoming ??
                                                        0
                                                    }
                                                </span>

                                            </td>


                                            {/* OUTGOING */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        agent.outgoing ??
                                                        0
                                                    }
                                                </span>

                                            </td>


                                            {/* ANSWERED */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                    text-[#6FA800]
                                                ">
                                                    {
                                                        agent.answered ??
                                                        0
                                                    }
                                                </span>

                                            </td>


                                            {/* MISSED */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                    text-red-500
                                                ">
                                                    {
                                                        agent.missed ??
                                                        0
                                                    }
                                                </span>

                                            </td>


                                            {/* APPLICATIONS */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        agent.applications ??
                                                        0
                                                    }
                                                </span>

                                            </td>


                                            {/* CONVERTED */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                    text-[#6FA800]
                                                ">
                                                    {
                                                        agent.converted ??
                                                        0
                                                    }
                                                </span>

                                            </td>


                                            {/* AVG TALK */}

                                            <td className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                text-right
                                            ">

                                                <span className="
                                                    text-sm
                                                    text-base-content/70
                                                ">
                                                    {
                                                        formatDuration(
                                                            agent.avgTalkSeconds
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td className="
                                                px-4
                                                py-4
                                                text-center
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onView?.(
                                                            agent
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        h-9
                                                        items-center
                                                        justify-center
                                                        gap-1.5
                                                        rounded-lg
                                                        border
                                                        border-base-300
                                                        bg-base-100
                                                        px-3
                                                        text-xs
                                                        font-medium
                                                        text-base-content/65
                                                        transition
                                                        hover:border-[#8BCF00]/40
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-[#8BCF00]/30
                                                    "
                                                >

                                                    <EyeIcon className="
                                                        h-3.5
                                                        w-3.5
                                                    " />

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    )

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            ) : (

                <EmptyState />

            )}

        </div>

    )

}


export default AgentPerformanceTable