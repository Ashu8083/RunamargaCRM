// admin-react/src/pages/Analytics/CallAnalytics/Performance/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'

import PerformanceCards from './components/PerformanceCards'
import AgentPerformanceTable from './components/AgentPerformanceTable'
import AgentPerformanceModal from './components/AgentPerformanceModal'


// =============================================================
// MOCK PERFORMANCE DATA
// =============================================================

const MOCK_PERFORMANCE = [
    {
        id: 101,
        name: 'Rahul Sharma',
        teamId: 301,
        team: 'Bangalore Team',
        rmId: 201,
        incoming: 164,
        outgoing: 120,
        answered: 214,
        missed: 42,
        applications: 18,
        converted: 5,
        avgTalkSeconds: 134,
        status: 'active',
    },
    {
        id: 102,
        name: 'Anil Kumar',
        teamId: 301,
        team: 'Bangalore Team',
        rmId: 202,
        incoming: 182,
        outgoing: 104,
        answered: 198,
        missed: 61,
        applications: 14,
        converted: 3,
        avgTalkSeconds: 112,
        status: 'active',
    },
    {
        id: 103,
        name: 'Vikram Singh',
        teamId: 302,
        team: 'Mysore Team',
        rmId: 201,
        incoming: 120,
        outgoing: 86,
        answered: 151,
        missed: 38,
        applications: 11,
        converted: 2,
        avgTalkSeconds: 123,
        status: 'active',
    },
    {
        id: 104,
        name: 'Arjun Rao',
        teamId: 301,
        team: 'Bangalore Team',
        rmId: 202,
        incoming: 146,
        outgoing: 98,
        answered: 176,
        missed: 44,
        applications: 16,
        converted: 4,
        avgTalkSeconds: 128,
        status: 'active',
    },
    {
        id: 105,
        name: 'Kiran Kumar',
        teamId: 302,
        team: 'Mysore Team',
        rmId: 201,
        incoming: 108,
        outgoing: 92,
        answered: 142,
        missed: 31,
        applications: 9,
        converted: 2,
        avgTalkSeconds: 118,
        status: 'active',
    },
    {
        id: 106,
        name: 'Niveditha Rao',
        teamId: 301,
        team: 'Bangalore Team',
        rmId: 202,
        incoming: 136,
        outgoing: 88,
        answered: 165,
        missed: 37,
        applications: 13,
        converted: 3,
        avgTalkSeconds: 121,
        status: 'active',
    },
]


// =============================================================
// MOCK API
// =============================================================

const fetchPerformance = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve(MOCK_PERFORMANCE)

        }, 400)

    })

}


// =============================================================
// CALL DIRECTIONS
// =============================================================

const CALL_DIRECTIONS = [
    {
        value: 'incoming',
        label: 'Incoming',
    },
    {
        value: 'outgoing',
        label: 'Outgoing',
    },
]


// =============================================================
// CALL STATUSES
// =============================================================

const CALL_STATUSES = [
    {
        value: 'answered',
        label: 'Answered',
    },
    {
        value: 'missed',
        label: 'Missed',
    },
]


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
            w-full
            grid-cols-1
            gap-3
            sm:grid-cols-2
        ">

            {/* FROM */}

            <div className="min-w-0">

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
                        min-w-0
                        text-sm
                    "
                />

            </div>


            {/* TO */}

            <div className="min-w-0">

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
                        min-w-0
                        text-sm
                    "
                />

            </div>

        </div>

    )

}


// =============================================================
// SIMPLE FILTER DROPDOWN
// =============================================================

function FilterDropdown({
    label,
    value,
    options,
    onChange,
}) {

    return (

        <div className="
            min-w-0
            w-full
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
                    min-w-0
                    text-sm
                "
            >

                <option value="">
                    All
                </option>

                {options.map((option) => (

                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>

                ))}

            </select>

        </div>

    )

}


// =============================================================
// PAGE
// =============================================================

function Performance() {

    // =========================================================
    // DATA
    // =========================================================

    const [performance, setPerformance] =
        useState([])


    const [loading, setLoading] =
        useState(true)


    // =========================================================
    // GLOBAL FILTERS
    // =========================================================

    const [team, setTeam] =
        useState('')


    const [rm, setRm] =
        useState('')


    const [agent, setAgent] =
        useState('')


    // =========================================================
    // OTHER FILTERS
    // =========================================================

    const [direction, setDirection] =
        useState('')


    const [callStatus, setCallStatus] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // MODAL
    // =========================================================

    const [selectedAgent, setSelectedAgent] =
        useState(null)


    const [showModal, setShowModal] =
        useState(false)


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = async () => {

        try {

            setLoading(true)

            const response =
                await fetchPerformance()

            setPerformance(
                Array.isArray(response)
                    ? response
                    : []
            )

        } catch (error) {

            console.error(
                'Failed to load performance data:',
                error
            )

            setPerformance([])

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadData()

    }, [])


    // =========================================================
    // FILTER PERFORMANCE
    // =========================================================

    const filteredPerformance = useMemo(() => {

        return performance.filter((item) => {

            // -------------------------------------------------
            // TEAM
            // -------------------------------------------------

            const matchesTeam =
                !team ||
                String(item.teamId) ===
                    String(team)


            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            const matchesRm =
                !rm ||
                String(item.rmId) ===
                    String(rm)


            // -------------------------------------------------
            // AGENT
            // -------------------------------------------------

            const matchesAgent =
                !agent ||
                String(item.id) ===
                    String(agent)


            // -------------------------------------------------
            // CALL DIRECTION
            // -------------------------------------------------

            const matchesDirection =
                !direction ||
                (
                    direction === 'incoming' &&
                    item.incoming > 0
                ) ||
                (
                    direction === 'outgoing' &&
                    item.outgoing > 0
                )


            // -------------------------------------------------
            // CALL STATUS
            // -------------------------------------------------

            const matchesStatus =
                !callStatus ||
                (
                    callStatus === 'answered' &&
                    item.answered > 0
                ) ||
                (
                    callStatus === 'missed' &&
                    item.missed > 0
                )


            // -------------------------------------------------
            // DATE
            //
            // Performance is currently aggregate data.
            // -------------------------------------------------

            const matchesFrom =
                !fromDate


            const matchesTo =
                !toDate


            return (
                matchesTeam &&
                matchesRm &&
                matchesAgent &&
                matchesDirection &&
                matchesStatus &&
                matchesFrom &&
                matchesTo
            )

        })

    }, [
        performance,
        team,
        rm,
        agent,
        direction,
        callStatus,
        fromDate,
        toDate,
    ])


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setTeam('')
        setRm('')
        setAgent('')
        setDirection('')
        setCallStatus('')
        setFromDate('')
        setToDate('')

    }


    // =========================================================
    // VIEW AGENT
    // =========================================================

    const handleView = (item) => {

        setSelectedAgent(item)

        setShowModal(true)

    }


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setSelectedAgent(null)

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                w-full
                space-y-5
                overflow-x-hidden
                p-4
                sm:p-6
            ">

                {/* FILTER */}

                <div className="
                    h-28
                    w-full
                    animate-pulse
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                " />


                {/* CARDS */}

                <div className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                ">

                    {Array.from({
                        length: 6,
                    }).map((_, index) => (

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

                    ))}

                </div>


                {/* TABLE */}

                <div className="
                    h-[300px]
                    w-full
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
            w-full
            max-w-full
            space-y-5
            overflow-x-hidden
            p-4
            sm:p-6
        ">

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="
                w-full
                max-w-full
                rounded-xl
                border
                border-base-300
                bg-base-100
                p-4
                shadow-sm
            ">

                <div className="
                    grid
                    w-full
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                ">

                    {/* =================================================
                        DATE RANGE
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                        sm:col-span-2
                        lg:col-span-2
                    ">

                        <DateRange
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromChange={setFromDate}
                            onToChange={setToDate}
                        />

                    </div>


                    {/* =================================================
                        TEAM
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <TeamLeadDropdown
                            label="Team"
                            value={team}
                            onChange={setTeam}
                            allLabel="All Teams"
                            placeholder="All Teams"
                            searchPlaceholder="Search team"
                            emptyMessage="No teams found"
                        />

                    </div>


                    {/* =================================================
                        RM
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <RmDropdown
                            value={rm}
                            onChange={setRm}
                        />

                    </div>


                    {/* =================================================
                        AGENT
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <AgentDropdown
                            value={agent}
                            onChange={setAgent}
                        />

                    </div>


                    {/* =================================================
                        CALL DIRECTION
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <FilterDropdown
                            label="Call Direction"
                            value={direction}
                            options={CALL_DIRECTIONS}
                            onChange={setDirection}
                        />

                    </div>


                    {/* =================================================
                        CALL STATUS
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <FilterDropdown
                            label="Call Status"
                            value={callStatus}
                            options={CALL_STATUSES}
                            onChange={setCallStatus}
                        />

                    </div>


                    {/* =================================================
                        ACTIONS
                        RESET + REFRESH ARE ONE GRID ITEM
                    ================================================= */}

                    <div className="
                        flex
                        min-w-0
                        w-full
                        items-end
                        gap-2
                    ">

                        {/* RESET */}

                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                h-10
                                min-w-0
                                flex-1
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-3
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
                                min-w-0
                                flex-1
                                items-center
                                justify-center
                                gap-1
                                rounded-lg
                                bg-[#8BCF00]
                                px-3
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-[#78B300]
                            "
                        >

                            <ArrowPathIcon className="
                                h-3.5
                                w-3.5
                                shrink-0
                            " />

                            <span>
                                Refresh
                            </span>

                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                PERFORMANCE CARDS
            ================================================= */}

            <div className="
                w-full
                min-w-0
            ">

                <PerformanceCards
                    agents={filteredPerformance}
                />

            </div>


            {/* =================================================
                PERFORMANCE TABLE
            ================================================= */}

            <div className="
                w-full
                min-w-0
            ">

                <AgentPerformanceTable
                    agents={filteredPerformance}
                    onView={handleView}
                />

            </div>


            {/* =================================================
                AGENT PERFORMANCE MODAL
            ================================================= */}

            <AgentPerformanceModal
                open={showModal}
                agent={selectedAgent}
                onClose={handleCloseModal}
            />

        </div>

    )

}


export default Performance