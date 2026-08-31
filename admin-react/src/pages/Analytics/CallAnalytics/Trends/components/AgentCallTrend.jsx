// admin-react/src/pages/Analytics/CallAnalytics/Trends/components/AgentCallTrend.jsx

import { useMemo, useState } from 'react'

import ArrowDownLeftIcon from '@heroicons/react/24/outline/ArrowDownLeftIcon'
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'


// =============================================================
// DATE FORMAT
// =============================================================

const formatDate = (date) => {

    if (!date) {
        return '—'
    }

    const parsed =
        new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsed.getTime())) {
        return date
    }

    return parsed.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
        }
    )

}


// =============================================================
// LEGEND
// =============================================================

function Legend({
    icon: Icon,
    label,
    color,
}) {

    return (

        <div className="
            flex
            items-center
            gap-1.5
            text-[11px]
            text-base-content/55
        ">

            <span
                className={[
                    'h-2.5',
                    'w-2.5',
                    'rounded-sm',
                    color,
                ].join(' ')}
            />

            <Icon className="h-3.5 w-3.5" />

            {label}

        </div>

    )

}


// =============================================================
// DATE INPUT
// =============================================================

function DateInput({
    label,
    value,
    onChange,
}) {

    return (

        <div className="min-w-0">

            <label className="
                mb-1
                block
                text-[11px]
                font-medium
                text-base-content/55
            ">
                {label}
            </label>

            <input
                type="date"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="
                    input
                    input-bordered
                    h-9
                    min-h-9
                    w-full
                    min-w-0
                    text-xs
                "
            />

        </div>

    )

}


// =============================================================
// AGENT CALL TREND
// =============================================================

function AgentCallTrend({
    calls = [],
}) {

    const [fromDate, setFromDate] =
        useState('')

    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // GROUP BY AGENT
    // =========================================================

    const agentData = useMemo(() => {

        if (!Array.isArray(calls)) {
            return []
        }


        const grouped = {}


        calls.forEach((call) => {

            const date =
                call.date ||
                call.createdAt?.slice(0, 10)


            if (!date) {
                return
            }


            if (
                fromDate &&
                date < fromDate
            ) {
                return
            }


            if (
                toDate &&
                date > toDate
            ) {
                return
            }


            const agentId =
                call.agentId ||
                call.agent_id ||
                call.agent?.id


            const agentName =
                call.agentName ||
                call.agent_name ||
                call.agent?.name ||
                call.agent ||
                'Unassigned'


            const key =
                String(
                    agentId ||
                    agentName
                )


            if (!grouped[key]) {

                grouped[key] = {
                    id: key,
                    name: agentName,
                    received: 0,
                    outgoing: 0,
                    answered: 0,
                    missed: 0,
                    total: 0,
                }

            }


            const item =
                grouped[key]


            const type =
                String(call.type || '')
                    .trim()
                    .toLowerCase()


            const status =
                String(call.status || '')
                    .trim()
                    .toLowerCase()


            if (
                type === 'incoming' ||
                type === 'received'
            ) {

                item.received += 1

            }


            if (
                type === 'outgoing' ||
                type === 'dialed' ||
                type === 'dialled'
            ) {

                item.outgoing += 1

            }


            if (
                status === 'received' ||
                status === 'answered'
            ) {

                item.answered += 1

            }


            if (
                type === 'missed' ||
                status === 'missed'
            ) {

                item.missed += 1

            }


            item.total += 1

        })


        return Object.values(grouped)
            .sort(
                (a, b) =>
                    b.total - a.total
            )

    }, [
        calls,
        fromDate,
        toDate,
    ])


    // =========================================================
    // MAX VALUE
    // =========================================================

    const maxValue =
        Math.max(
            ...agentData.map((item) =>
                Math.max(
                    item.received,
                    item.outgoing,
                    item.answered,
                    item.missed
                )
            ),
            1
        )


    // =========================================================
    // BAR CONFIG
    // =========================================================

    const bars = [
        {
            key: 'received',
            label: 'Received',
            color: 'bg-blue-500',
            icon: ArrowDownLeftIcon,
        },
        {
            key: 'outgoing',
            label: 'Outgoing',
            color: 'bg-violet-500',
            icon: ArrowUpRightIcon,
        },
        {
            key: 'answered',
            label: 'Answered',
            color: 'bg-[#8BCF00]',
            icon: CheckCircleIcon,
        },
        {
            key: 'missed',
            label: 'Missed',
            color: 'bg-red-500',
            icon: PhoneXMarkIcon,
        },
    ]


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            w-full
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                flex-col
                gap-3
                border-b
                border-base-300
                px-5
                py-4
                lg:flex-row
                lg:items-end
                lg:justify-between
            ">

                <div>

                    <h2 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Calls by Agent
                    </h2>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/45
                    ">
                        Call volume and outcomes handled by each agent.
                    </p>

                </div>


                <div className="
                    grid
                    w-full
                    grid-cols-2
                    gap-2
                    sm:w-auto
                    sm:min-w-[280px]
                ">

                    <DateInput
                        label="From"
                        value={fromDate}
                        onChange={setFromDate}
                    />

                    <DateInput
                        label="To"
                        value={toDate}
                        onChange={setToDate}
                    />

                </div>

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div className="
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                border-b
                border-base-300
                px-5
                py-3
            ">

                {bars.map((bar) => (

                    <Legend
                        key={bar.key}
                        icon={bar.icon}
                        label={bar.label}
                        color={bar.color}
                    />

                ))}

            </div>


            {/* =================================================
                GRAPH
            ================================================= */}

            <div className="
                overflow-x-auto
                px-5
                py-5
            ">

                {agentData.length ? (

                    <div className="
                        min-w-[700px]
                    ">

                        <div
                            className="
                                relative
                                flex
                                items-end
                                gap-5
                                border-b
                                border-base-300
                                px-3
                            "
                            style={{
                                height: '300px',
                            }}
                        >

                            {/* GRID */}

                            <div className="
                                pointer-events-none
                                absolute
                                inset-0
                                flex
                                flex-col
                                justify-between
                            ">

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


                            {/* AGENT GROUPS */}

                            {agentData.map((item) => (

                                <div
                                    key={item.id}
                                    className="
                                        relative
                                        z-10
                                        flex
                                        h-full
                                        min-w-[90px]
                                        flex-1
                                        items-end
                                        justify-center
                                        gap-1
                                    "
                                >

                                    {bars.map((bar) => {

                                        const value =
                                            item[bar.key]


                                        const height =
                                            value > 0
                                                ? Math.max(
                                                    (
                                                        value /
                                                        maxValue
                                                    ) * 100,
                                                    3
                                                )
                                                : 1


                                        return (

                                            <div
                                                key={bar.key}
                                                className="
                                                    relative
                                                    flex
                                                    h-full
                                                    w-3
                                                    items-end
                                                "
                                            >

                                                {value > 0 && (

                                                    <span className="
                                                        absolute
                                                        -top-4
                                                        left-1/2
                                                        -translate-x-1/2
                                                        text-[8px]
                                                        font-medium
                                                        text-base-content/55
                                                    ">
                                                        {value}
                                                    </span>

                                                )}


                                                <div
                                                    className={[
                                                        'w-full',
                                                        'rounded-t',
                                                        bar.color,
                                                        'opacity-80',
                                                        'transition-all',
                                                        'hover:opacity-100',
                                                    ].join(' ')}
                                                    style={{
                                                        height:
                                                            `${height}%`,
                                                    }}
                                                    title={`${bar.label}: ${value}`}
                                                />

                                            </div>

                                        )

                                    })}

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            X AXIS
                        ================================================= */}

                        <div className="
                            mt-2
                            flex
                            gap-5
                            px-3
                        ">

                            {agentData.map((item) => (

                                <div
                                    key={item.id}
                                    className="
                                        min-w-[90px]
                                        flex-1
                                        truncate
                                        text-center
                                        text-[10px]
                                        font-medium
                                        text-base-content/50
                                    "
                                    title={item.name}
                                >
                                    {item.name}

                                </div>

                            ))}

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div className="
                            mt-5
                            grid
                            grid-cols-2
                            gap-3
                            sm:grid-cols-3
                            lg:grid-cols-5
                        ">

                            <Summary
                                label="Total Calls"
                                value={
                                    agentData.reduce(
                                        (sum, item) =>
                                            sum + item.total,
                                        0
                                    )
                                }
                            />

                            <Summary
                                label="Received"
                                value={
                                    agentData.reduce(
                                        (sum, item) =>
                                            sum + item.received,
                                        0
                                    )
                                }
                            />

                            <Summary
                                label="Outgoing"
                                value={
                                    agentData.reduce(
                                        (sum, item) =>
                                            sum + item.outgoing,
                                        0
                                    )
                                }
                            />

                            <Summary
                                label="Answered"
                                value={
                                    agentData.reduce(
                                        (sum, item) =>
                                            sum + item.answered,
                                        0
                                    )
                                }
                            />

                            <Summary
                                label="Missed"
                                value={
                                    agentData.reduce(
                                        (sum, item) =>
                                            sum + item.missed,
                                        0
                                    )
                                }
                            />

                        </div>

                    </div>

                ) : (

                    <div className="
                        flex
                        h-[300px]
                        items-center
                        justify-center
                        text-center
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-medium
                                text-base-content/60
                            ">
                                No agent call data
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-base-content/40
                            ">
                                Try changing the selected date range or global filters.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>

    )

}


// =============================================================
// SUMMARY
// =============================================================

function Summary({
    label,
    value,
}) {

    return (

        <div className="
            rounded-lg
            border
            border-base-300
            bg-base-200/30
            px-3
            py-2.5
        ">

            <p className="
                text-[10px]
                text-base-content/45
            ">
                {label}
            </p>

            <p className="
                mt-0.5
                text-sm
                font-semibold
                text-base-content
            ">
                {value.toLocaleString()}
            </p>

        </div>

    )

}


export default AgentCallTrend