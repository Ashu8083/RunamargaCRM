// admin-react/src/pages/CallManagement/CallAnalytics/Overview/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'

import AnalyticsCards from './components/AnalyticsCards'
import CallActivityGraph from './components/CallActivityGraph'


// =============================================================
// MOCK DATA
// =============================================================

const MOCK_CALLS = [
    {
        id: 1,
        name: 'Aravind Kumar',
        phone: '9876543210',
        agentId: 101,
        agent: 'Rahul Sharma',
        rm: 'Priya Nair',
        team: 'Bangalore Team',
        type: 'incoming',
        status: 'received',
        date: '2026-08-28',
    },
    {
        id: 2,
        name: 'Priya Sharma',
        phone: '9876543211',
        agentId: 101,
        agent: 'Rahul Sharma',
        rm: 'Priya Nair',
        team: 'Bangalore Team',
        type: 'outgoing',
        status: 'received',
        date: '2026-08-28',
    },
    {
        id: 3,
        name: 'Suresh Kumar',
        phone: '9876543212',
        agentId: 102,
        agent: 'Anil Kumar',
        rm: 'Rajesh Rao',
        team: 'Bangalore Team',
        type: 'incoming',
        status: 'missed',
        date: '2026-08-28',
    },
    {
        id: 4,
        name: 'Nayana Rao',
        phone: '9876543213',
        agentId: 102,
        agent: 'Anil Kumar',
        rm: 'Rajesh Rao',
        team: 'Mysore Team',
        type: 'outgoing',
        status: 'received',
        date: '2026-08-27',
    },
    {
        id: 5,
        name: 'Manoj Rao',
        phone: '9876543214',
        agentId: 103,
        agent: 'Vikram Singh',
        rm: 'Priya Nair',
        team: 'Bangalore Team',
        type: 'incoming',
        status: 'unknown',
        date: '2026-08-27',
    },
    {
        id: 6,
        name: 'Asma Banu',
        phone: '9876543215',
        agentId: 103,
        agent: 'Vikram Singh',
        rm: 'Rajesh Rao',
        team: 'Mysore Team',
        type: 'outgoing',
        status: 'missed',
        date: '2026-08-26',
    },
    {
        id: 7,
        name: 'Kiran Kumar',
        phone: '9876543216',
        agentId: 101,
        agent: 'Rahul Sharma',
        rm: 'Priya Nair',
        team: 'Bangalore Team',
        type: 'incoming',
        status: 'received',
        date: '2026-08-26',
    },
    {
        id: 8,
        name: 'Deepa R',
        phone: '9876543217',
        agentId: 102,
        agent: 'Anil Kumar',
        rm: 'Rajesh Rao',
        team: 'Mysore Team',
        type: 'incoming',
        status: 'missed',
        date: '2026-08-25',
    },
    {
        id: 9,
        name: 'Ramesh Gowda',
        phone: '9876543218',
        agentId: 103,
        agent: 'Vikram Singh',
        rm: 'Priya Nair',
        team: 'Bangalore Team',
        type: 'outgoing',
        status: 'received',
        date: '2026-08-25',
    },
    {
        id: 10,
        name: 'Sneha Rao',
        phone: '9876543219',
        agentId: 101,
        agent: 'Rahul Sharma',
        rm: 'Rajesh Rao',
        team: 'Mysore Team',
        type: 'incoming',
        status: 'unknown',
        date: '2026-08-24',
    },
    {
        id: 11,
        name: 'Vijay Kumar',
        phone: '9876543220',
        agentId: 102,
        agent: 'Anil Kumar',
        rm: 'Priya Nair',
        team: 'Bangalore Team',
        type: 'outgoing',
        status: 'missed',
        date: '2026-08-23',
    },
    {
        id: 12,
        name: 'Pooja Shetty',
        phone: '9876543221',
        agentId: 103,
        agent: 'Vikram Singh',
        rm: 'Rajesh Rao',
        team: 'Mysore Team',
        type: 'incoming',
        status: 'received',
        date: '2026-08-22',
    },
]


// =============================================================
// MOCK API
// =============================================================

const fetchCallAnalytics = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve(MOCK_CALLS)
        }, 400)

    })

}


// =============================================================
// FILTER OPTIONS
// =============================================================

const TEAMS = [
    'Bangalore Team',
    'Mysore Team',
]


const RMS = [
    'Priya Nair',
    'Rajesh Rao',
]


const DIRECTIONS = [
    'incoming',
    'outgoing',
]


const STATUSES = [
    'received',
    'missed',
    'unknown',
]


// =============================================================
// FORMAT LABEL
// =============================================================

const formatLabel = (value) => {

    if (!value) {
        return 'All'
    }


    return String(value)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        )

}


// =============================================================
// DROPDOWN
// =============================================================

function FilterDropdown({
    label,
    value,
    options,
    onChange,
}) {

    return (

        <div className="
            min-w-[160px]
            flex-1
        ">

            <label className="
                mb-1.5
                block
                text-xs
                font-medium
                text-base-content/60
            ">
                {label}
            </label>


            <div className="relative">

                <select
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="
                        select
                        select-bordered
                        h-10
                        min-h-10
                        w-full
                        appearance-none
                        pr-9
                        text-sm
                    "
                >

                    <option value="">
                        All
                    </option>


                    {options.map(
                        (option) => (

                            <option
                                key={option}
                                value={option}
                            >
                                {formatLabel(option)}
                            </option>

                        )
                    )}

                </select>


                <ChevronDownIcon className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-base-content/40
                " />

            </div>

        </div>

    )

}


// =============================================================
// DATE RANGE
// =============================================================

function DateRange({
    fromDate,
    toDate,
    onFromChange,
    onToChange,
}) {

    return (

        <div className="
            grid
            min-w-[280px]
            flex-1
            grid-cols-2
            gap-2
        ">

            {/* FROM */}

            <div>

                <label className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-base-content/60
                ">
                    From
                </label>


                <input
                    type="date"
                    value={fromDate}
                    onChange={(event) =>
                        onFromChange(
                            event.target.value
                        )
                    }
                    className="
                        input
                        input-bordered
                        h-10
                        min-h-10
                        w-full
                        text-sm
                    "
                />

            </div>


            {/* TO */}

            <div>

                <label className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-base-content/60
                ">
                    To
                </label>


                <input
                    type="date"
                    value={toDate}
                    onChange={(event) =>
                        onToChange(
                            event.target.value
                        )
                    }
                    className="
                        input
                        input-bordered
                        h-10
                        min-h-10
                        w-full
                        text-sm
                    "
                />

            </div>

        </div>

    )

}


// =============================================================
// PAGE
// =============================================================

function Overview() {

    const [calls, setCalls] =
        useState([])


    const [loading, setLoading] =
        useState(true)


    const [team, setTeam] =
        useState('')


    const [agent, setAgent] =
        useState('')


    const [rm, setRm] =
        useState('')


    const [direction, setDirection] =
        useState('')


    const [status, setStatus] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    const [activeKpi, setActiveKpi] =
        useState('')


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = async () => {

        try {

            setLoading(true)


            const response =
                await fetchCallAnalytics()


            setCalls(
                Array.isArray(response)
                    ? response
                    : []
            )

        } finally {

            setLoading(false)

        }

    }


    useEffect(() => {

        loadData()

    }, [])


    // =========================================================
    // FILTER DATA
    // =========================================================

    const filteredCalls = useMemo(() => {

        return calls.filter(
            (call) => {

                // -------------------------------------------------
                // TEAM
                // -------------------------------------------------

                const matchesTeam =
                    !team ||
                    call.team === team


                // -------------------------------------------------
                // AGENT
                // AgentDropdown returns agent ID
                // -------------------------------------------------

                const matchesAgent =
                    !agent ||
                    String(
                        call.agentId
                    ) === String(agent)


                // -------------------------------------------------
                // RM
                // -------------------------------------------------

                const matchesRm =
                    !rm ||
                    call.rm === rm


                // -------------------------------------------------
                // CALL DIRECTION
                // -------------------------------------------------

                const matchesDirection =
                    !direction ||
                    call.type === direction


                // -------------------------------------------------
                // CALL STATUS
                // -------------------------------------------------

                const matchesStatus =
                    !status ||
                    call.status === status


                // -------------------------------------------------
                // FROM DATE
                // -------------------------------------------------

                const matchesFrom =
                    !fromDate ||
                    call.date >= fromDate


                // -------------------------------------------------
                // TO DATE
                // -------------------------------------------------

                const matchesTo =
                    !toDate ||
                    call.date <= toDate


                // -------------------------------------------------
                // KPI FILTER
                // -------------------------------------------------

                const matchesKpi =
                    !activeKpi ||
                    activeKpi === 'total' ||
                    (
                        activeKpi === 'answered' &&
                        call.status === 'received'
                    ) ||
                    (
                        activeKpi === 'missed' &&
                        call.status === 'missed'
                    ) ||
                    (
                        activeKpi === 'unknown' &&
                        call.status === 'unknown'
                    ) ||
                    (
                        activeKpi === 'assigned' &&
                        call.followUp === 'assigned'
                    ) ||
                    (
                        activeKpi === 'converted' &&
                        call.followUp === 'converted'
                    )


                return (
                    matchesTeam &&
                    matchesAgent &&
                    matchesRm &&
                    matchesDirection &&
                    matchesStatus &&
                    matchesFrom &&
                    matchesTo &&
                    matchesKpi
                )

            }
        )

    }, [
        calls,
        team,
        agent,
        rm,
        direction,
        status,
        fromDate,
        toDate,
        activeKpi,
    ])


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setTeam('')
        setAgent('')
        setRm('')
        setDirection('')
        setStatus('')
        setFromDate('')
        setToDate('')
        setActiveKpi('')

    }


    // =========================================================
    // KPI CLICK
    // =========================================================

    const handleKpiClick = (key) => {

        setActiveKpi((current) =>
            current === key
                ? ''
                : key
        )

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                space-y-5
                p-4
                sm:p-6
            ">

                <div className="
                    h-24
                    animate-pulse
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                " />


                <div className="
                    grid
                    grid-cols-2
                    gap-4
                    lg:grid-cols-3
                    xl:grid-cols-6
                ">

                    {Array.from({
                        length: 6,
                    }).map(
                        (_, index) => (

                            <div
                                key={index}
                                className="
                                    h-24
                                    animate-pulse
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                "
                            />

                        )
                    )}

                </div>


                <div className="
                    h-[420px]
                    animate-pulse
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                " />

            </div>

        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                p-4
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    xl:flex-row
                    xl:items-end
                ">


                    {/* TEAM */}

                    <FilterDropdown
                        label="Team"
                        value={team}
                        options={TEAMS}
                        onChange={setTeam}
                    />


                    {/* AGENT */}

                    <AgentDropdown
                        value={agent}
                        onChange={setAgent}
                    />


                    {/* RM */}

                    <FilterDropdown
                        label="RM"
                        value={rm}
                        options={RMS}
                        onChange={setRm}
                    />


                    {/* CALL DIRECTION */}

                    <FilterDropdown
                        label="Call Direction"
                        value={direction}
                        options={DIRECTIONS}
                        onChange={setDirection}
                    />


                    {/* CALL STATUS */}

                    <FilterDropdown
                        label="Call Status"
                        value={status}
                        options={STATUSES}
                        onChange={setStatus}
                    />

                </div>


                {/* =================================================
                    DATE + ACTIONS
                ================================================= */}

                <div className="
                    mt-3
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                    lg:items-end
                ">

                    <DateRange
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromChange={setFromDate}
                        onToChange={setToDate}
                    />


                    {/* RESET */}

                    <button
                        type="button"
                        onClick={handleReset}
                        className="
                            h-10
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            px-5
                            text-xs
                            font-medium
                            text-base-content/65
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
                    >
                        Reset
                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={loadData}
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#8BCF00]
                            px-5
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                        "
                    >

                        <ArrowPathIcon className="
                            h-4
                            w-4
                        " />

                        Refresh

                    </button>

                </div>

            </div>


            {/* =================================================
                KPI CARDS
            ================================================= */}

            <AnalyticsCards
                calls={filteredCalls}
                activeKpi={activeKpi}
                onKpiClick={handleKpiClick}
            />


            {/* =================================================
                ACTIVE KPI INFO
            ================================================= */}

            {activeKpi && (

                <div className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-[#8BCF00]/30
                    bg-[#8BCF00]/5
                    px-4
                    py-2.5
                ">

                    <p className="
                        text-xs
                        text-base-content/60
                    ">

                        Showing{' '}

                        <span className="
                            font-semibold
                            text-base-content
                        ">
                            {formatLabel(activeKpi)}
                        </span>

                        {' '}calls

                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            setActiveKpi('')
                        }
                        className="
                            text-xs
                            font-medium
                            text-[#6FA800]
                            hover:underline
                        "
                    >
                        Clear
                    </button>

                </div>

            )}


            {/* =================================================
                GRAPH
            ================================================= */}

            <CallActivityGraph
                calls={filteredCalls}
            />

        </div>

    )

}


export default Overview