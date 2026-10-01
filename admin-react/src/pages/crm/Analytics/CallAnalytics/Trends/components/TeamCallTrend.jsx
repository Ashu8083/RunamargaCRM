import { useMemo, useState } from 'react'

import AgentDropdown from '../../../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../../../components/GlobalModels/Filters/RmDropdown'

// =============================================================
// HELPERS
// =============================================================

const formatNumber = (value) =>
    Number(value || 0).toLocaleString('en-IN')

// =============================================================
// METRICS
// =============================================================

const METRICS = [
    {
        key: 'total',
        label: 'Total Calls',
        color: 'bg-slate-500',
    },
    {
        key: 'received',
        label: 'Received',
        color: 'bg-emerald-500',
    },
    {
        key: 'called',
        label: 'Called',
        color: 'bg-violet-500',
    },
    {
        key: 'missed',
        label: 'Missed',
        color: 'bg-red-500',
    },
    {
        key: 'uniqueMissed',
        label: 'Unique Missed',
        color: 'bg-amber-500',
    },
    {
        key: 'applications',
        label: 'Applications',
        color: 'bg-[#8BCF00]',
    },
]

// =============================================================
// COMPONENT
// =============================================================

function TeamCallTrend({
    calls = [],
}) {

    // =========================================================
    // FILTER STATE
    // =========================================================

    const [agent, setAgent] = useState('')

    const [rm, setRm] = useState('')

    const [fromDate, setFromDate] = useState('')

    const [toDate, setToDate] = useState('')


    // =========================================================
    // FILTER CALLS BY DATE + AGENT + RM
    // =========================================================

    const filteredCalls = useMemo(() => {

        if (!Array.isArray(calls)) {
            return []
        }

        return calls.filter((call) => {

            const date =
                call.date ||
                call.createdAt?.slice(0, 10) ||
                call.created_at?.slice(0, 10)

            if (!date) {
                return false
            }

            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            if (
                fromDate &&
                date < fromDate
            ) {
                return false
            }

            if (
                toDate &&
                date > toDate
            ) {
                return false
            }


            // -------------------------------------------------
            // AGENT
            //
            // Support the possible field names returned
            // by the backend.
            // -------------------------------------------------

            if (agent) {

                const agentId =
                    call.agentId ??
                    call.agent_id ??
                    call.agentContextId ??
                    call.agent_context_id ??
                    call.employeeId ??
                    call.employee_id

                if (
                    String(agentId ?? '') !==
                    String(agent)
                ) {
                    return false
                }

            }


            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            if (rm) {

                const rmId =
                    call.rmId ??
                    call.rm_id ??
                    call.rmContextId ??
                    call.rm_context_id

                if (
                    String(rmId ?? '') !==
                    String(rm)
                ) {
                    return false
                }

            }


            return true

        })

    }, [
        calls,
        agent,
        rm,
        fromDate,
        toDate,
    ])


    // =========================================================
    // GROUP BY TEAM LEAD
    // =========================================================

    const teamData = useMemo(() => {

        const grouped = {}


        filteredCalls.forEach((call) => {

            const teamId =
                call.reportingToId ??
                call.reporting_to_id ??
                call.teamLeadId ??
                call.team_lead_id ??
                call.teamLeadContextId ??
                call.team_lead_context_id ??
                call.teamLeadName ??
                'unknown'


            if (!grouped[teamId]) {

                grouped[teamId] = {
                    id: teamId,

                    name:
                        call.teamLeadName ||
                        call.team_lead_name ||
                        `Team Lead ${teamId}`,

                    total: 0,

                    received: 0,

                    called: 0,

                    missed: 0,

                    uniqueMissed: 0,

                    applications: 0,
                }

            }


            const item =
                grouped[teamId]


            // -------------------------------------------------
            // TOTAL
            // -------------------------------------------------

            item.total += 1


            const type =
                String(
                    call.type ??
                    call.direction ??
                    ''
                )
                    .trim()
                    .toLowerCase()


            const status =
                String(
                    call.status ??
                    ''
                )
                    .trim()
                    .toLowerCase()


            // -------------------------------------------------
            // RECEIVED
            // -------------------------------------------------

            if (
                (
                    type === 'incoming' ||
                    type === 'received'
                ) &&
                status !== 'missed'
            ) {

                item.received += 1

            }


            // -------------------------------------------------
            // CALLED
            // -------------------------------------------------

            if (
                (
                    type === 'outgoing' ||
                    type === 'called'
                ) &&
                status !== 'missed'
            ) {

                item.called += 1

            }


            // -------------------------------------------------
            // MISSED
            // -------------------------------------------------

            if (
                type === 'missed' ||
                status === 'missed'
            ) {

                item.missed += 1

            }


            // -------------------------------------------------
            // UNIQUE MISSED
            // -------------------------------------------------

            if (
                call.uniqueMissed === true ||
                call.unique_missed === true
            ) {

                item.uniqueMissed += 1

            }


            // -------------------------------------------------
            // APPLICATIONS
            // -------------------------------------------------

            if (
                call.applicationCreated === true ||
                call.application_created === true
            ) {

                item.applications += 1

            }

        })


        return Object.values(grouped)
            .sort(
                (a, b) =>
                    b.total - a.total
            )

    }, [
        filteredCalls,
    ])


    // =========================================================
    // MAX VALUE
    // =========================================================

    const maxValue =
        Math.max(
            ...teamData.map((item) =>
                Math.max(
                    item.total,
                    item.received,
                    item.called,
                    item.missed,
                    item.uniqueMissed,
                    item.applications
                )
            ),
            1
        )


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary = useMemo(() => {

        return METRICS.reduce(
            (result, metric) => {

                result[metric.key] =
                    teamData.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item[
                                    metric.key
                                ] || 0
                            ),
                        0
                    )

                return result

            },
            {}
        )

    }, [
        teamData,
    ])


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setAgent('')

        setRm('')

        setFromDate('')

        setToDate('')

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section
            className="
                w-full
                min-w-0
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-base-300
                    px-4
                    py-4
                    sm:px-5
                "
            >

                <div className="min-w-0">

                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-base-content
                        "
                    >
                        Team Lead Call Performance
                    </h2>

                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-base-content/45
                        "
                    >
                        Call volume and outcomes by team lead.
                    </p>

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-5
                    "
                >

                    {/* AGENT */}

                    <div className="min-w-0">

                        <AgentDropdown
                            label="Agent"
                            value={agent}
                            onChange={(value) => {

                                setAgent(value)

                                // When Agent changes,
                                // reset RM because the
                                // available RM scope changes.

                                setRm('')

                            }}
                        />

                    </div>


                    {/* RM */}

                    <div className="min-w-0">

                        <RmDropdown
                            label="RM"
                            value={rm}
                            onChange={setRm}
                            agentContextId={agent || undefined}
                        />

                    </div>


                    {/* FROM */}

                    <div className="min-w-0">

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            "
                        >
                            From
                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                setFromDate(
                                    event.target.value
                                )
                            }
                            className="
                                input
                                input-bordered
                                h-9
                                min-h-9
                                w-full
                                text-xs
                            "
                        />

                    </div>


                    {/* TO */}

                    <div className="min-w-0">

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            "
                        >
                            To
                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                setToDate(
                                    event.target.value
                                )
                            }
                            className="
                                input
                                input-bordered
                                h-9
                                min-h-9
                                w-full
                                text-xs
                            "
                        />

                    </div>


                    {/* RESET */}

                    <div
                        className="
                            flex
                            items-end
                        "
                    >

                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                h-9
                                w-full
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-4
                                text-xs
                                font-medium
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                            "
                        >
                            Reset
                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div
                className="
                    flex
                    flex-wrap
                    gap-x-5
                    gap-y-2
                    border-b
                    border-base-300
                    px-4
                    py-3
                    sm:px-5
                "
            >

                {METRICS.map((metric) => (

                    <div
                        key={metric.key}
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-base-content/55
                        "
                    >

                        <span
                            className={[
                                'h-2.5',
                                'w-2.5',
                                'rounded-sm',
                                metric.color,
                            ].join(' ')}
                        />

                        {metric.label}

                    </div>

                ))}

            </div>


            {/* =================================================
                GRAPH
            ================================================= */}

            <div
                className="
                    overflow-x-auto
                    px-4
                    py-5
                    sm:px-5
                "
            >

                {teamData.length ? (

                    <div
                        className="
                            min-w-[760px]
                        "
                    >

                        {/* =================================================
                            GRAPH
                        ================================================= */}

                        <div
                            className="
                                flex
                                h-[320px]
                                gap-3
                            "
                        >

                            {/* Y AXIS */}

                            <div
                                className="
                                    flex
                                    w-10
                                    shrink-0
                                    flex-col
                                    justify-between
                                    pb-1
                                    text-right
                                    text-[10px]
                                    text-base-content/35
                                "
                            >

                                <span>
                                    {formatNumber(maxValue)}
                                </span>

                                <span>
                                    {formatNumber(
                                        Math.round(
                                            maxValue * 0.75
                                        )
                                    )}
                                </span>

                                <span>
                                    {formatNumber(
                                        Math.round(
                                            maxValue * 0.5
                                        )
                                    )}
                                </span>

                                <span>
                                    {formatNumber(
                                        Math.round(
                                            maxValue * 0.25
                                        )
                                    )}
                                </span>

                                <span>
                                    0
                                </span>

                            </div>


                            {/* GRAPH BODY */}

                            <div
                                className="
                                    relative
                                    min-w-0
                                    flex-1
                                "
                            >

                                {/* GRID */}

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-0
                                        flex
                                        flex-col
                                        justify-between
                                    "
                                >

                                    {[0, 1, 2, 3, 4].map(
                                        (line) => (

                                            <div
                                                key={line}
                                                className="
                                                    border-t
                                                    border-dashed
                                                    border-base-300
                                                "
                                            />

                                        )
                                    )}

                                </div>


                                {/* BAR GROUPS */}

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        flex
                                        items-end
                                        gap-5
                                        px-3
                                    "
                                >

                                    {teamData.map((item) => (

                                        <div
                                            key={item.id}
                                            className="
                                                group
                                                relative
                                                flex
                                                h-full
                                                min-w-[100px]
                                                flex-1
                                                items-end
                                                justify-center
                                            "
                                        >

                                            {/* TOOLTIP */}

                                            <div
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    bottom-4
                                                    left-1/2
                                                    z-30
                                                    hidden
                                                    w-48
                                                    -translate-x-1/2
                                                    rounded-lg
                                                    border
                                                    border-base-300
                                                    bg-base-100
                                                    p-3
                                                    shadow-xl
                                                    group-hover:block
                                                "
                                            >

                                                <p
                                                    className="
                                                        mb-2
                                                        text-xs
                                                        font-semibold
                                                        text-base-content
                                                    "
                                                >
                                                    {item.name}
                                                </p>


                                                {METRICS.map(
                                                    (metric) => (

                                                        <div
                                                            key={
                                                                metric.key
                                                            }
                                                            className="
                                                                flex
                                                                justify-between
                                                                py-0.5
                                                                text-[10px]
                                                                text-base-content/60
                                                            "
                                                        >

                                                            <span>
                                                                {
                                                                    metric.label
                                                                }
                                                            </span>

                                                            <b
                                                                className="
                                                                    text-base-content
                                                                "
                                                            >
                                                                {
                                                                    item[
                                                                        metric.key
                                                                    ]
                                                                }
                                                            </b>

                                                        </div>

                                                    )
                                                )}

                                            </div>


                                            {/* BARS */}

                                            <div
                                                className="
                                                    flex
                                                    h-full
                                                    w-full
                                                    max-w-[115px]
                                                    items-end
                                                    justify-center
                                                    gap-1
                                                "
                                            >

                                                {METRICS.map(
                                                    (metric) => {

                                                        const value =
                                                            Number(
                                                                item[
                                                                    metric.key
                                                                ] || 0
                                                            )


                                                        const height =
                                                            value > 0
                                                                ? Math.max(
                                                                    (
                                                                        value /
                                                                        maxValue
                                                                    ) *
                                                                    100,
                                                                    2
                                                                )
                                                                : 1


                                                        return (

                                                            <div
                                                                key={
                                                                    metric.key
                                                                }
                                                                className="
                                                                    flex
                                                                    h-full
                                                                    flex-1
                                                                    items-end
                                                                    justify-center
                                                                "
                                                            >

                                                                <div
                                                                    className={[
                                                                        'w-full',
                                                                        'max-w-[11px]',
                                                                        'rounded-t-sm',
                                                                        metric.color,
                                                                        'opacity-80',
                                                                        'transition-all',
                                                                        'group-hover:opacity-100',
                                                                    ].join(' ')}
                                                                    style={{
                                                                        height:
                                                                            `${height}%`,
                                                                    }}
                                                                    title={`${metric.label}: ${value}`}
                                                                />

                                                            </div>

                                                        )

                                                    }
                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            X AXIS
                        ================================================= */}

                        <div
                            className="
                                mt-2
                                flex
                                gap-5
                                pl-[52px]
                            "
                        >

                            {teamData.map((item) => (

                                <div
                                    key={item.id}
                                    className="
                                        min-w-[100px]
                                        flex-1
                                        text-center
                                    "
                                >

                                    <p
                                        className="
                                            truncate
                                            text-[10px]
                                            font-medium
                                            text-base-content/65
                                        "
                                    >
                                        {item.name}
                                    </p>

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-2
                                gap-2
                                sm:grid-cols-3
                                lg:grid-cols-6
                            "
                        >

                            {METRICS.map((metric) => (

                                <div
                                    key={metric.key}
                                    className="
                                        rounded-lg
                                        border
                                        border-base-300
                                        bg-base-200/20
                                        px-3
                                        py-2.5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                        "
                                    >

                                        <span
                                            className={[
                                                'h-2',
                                                'w-2',
                                                'rounded-full',
                                                metric.color,
                                            ].join(' ')}
                                        />

                                        <span
                                            className="
                                                text-[10px]
                                                text-base-content/45
                                            "
                                        >
                                            {metric.label}
                                        </span>

                                    </div>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-base-content
                                        "
                                    >
                                        {formatNumber(
                                            summary[
                                                metric.key
                                            ]
                                        )}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                ) : (

                    <div
                        className="
                            flex
                            h-[320px]
                            items-center
                            justify-center
                            text-center
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                No team lead call data
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-base-content/40
                                "
                            >
                                Try changing the selected filters or date range.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </section>

    )

}


export default TeamCallTrend