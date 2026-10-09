// admin-react/src/pages/Analytics/CallAnalytics/Overview/index.jsx

import { useCallback, useEffect, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import AgentDropdown from '../../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../../components/GlobalModels/Filters/TeamLeadDropdown'

import AnalyticsCards from './components/AnalyticsCards'
import CallActivityGraph from './components/CallActivityGraph'

import {
    getCallAnalyticsOverview,
    getApiErrorMessage,
} from './API'


// =============================================================
// FILTER OPTIONS
// =============================================================

const DIRECTIONS = [
    'incoming',
    'outgoing',
]


const STATUSES = [
    'received',
    'missed',
    'rejected',
    'not_reached',
]


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
// TODAY DATE RANGE
// =============================================================

const getTodayDateRange = () => {

    const now = new Date()

    const year =
        now.getFullYear()

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            '0'
        )

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            '0'
        )

    const today =
        `${year}-${month}-${day}`

    return {

        fromDate:
            today,

        toDate:
            today,

    }

}


// =============================================================
// FORMAT LABEL
// =============================================================

const formatLabel = (value) => {

    if (!value) {
        return 'All'
    }

    return String(value)
        .replace(/_/g, ' ')
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

    // =========================================================
    // DEFAULT TODAY
    // =========================================================

    const today =
        getTodayDateRange()


    // =========================================================
    // DATA
    // =========================================================

    const [calls, setCalls] =
        useState([])


    const [summary, setSummary] =
        useState(
            DEFAULT_SUMMARY
        )


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(true)


    // =========================================================
    // ERROR
    // =========================================================

    const [error, setError] =
        useState('')


    // =========================================================
    // FILTERS
    // =========================================================

    const [agent, setAgent] =
        useState('')


    const [rm, setRm] =
        useState('')


    const [teamLead, setTeamLead] =
        useState('')


    const [direction, setDirection] =
        useState('')


    const [status, setStatus] =
        useState('')


    const [fromDate, setFromDate] =
        useState(
            today.fromDate
        )


    const [toDate, setToDate] =
        useState(
            today.toDate
        )


    // =========================================================
    // KPI
    // =========================================================

    const [activeKpi, setActiveKpi] =
        useState('')


    // =========================================================
    // AGENT CHANGE
    // =========================================================

    const handleAgentChange = (
        selectedValue
    ) => {

        setAgent(
            selectedValue
        )

        setRm('')

    }


    // =========================================================
    // RM CHANGE
    // =========================================================

    const handleRmChange = (
        selectedValue
    ) => {

        setRm(
            selectedValue
        )

        setAgent('')

    }


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (
        selectedValue
    ) => {

        setTeamLead(
            selectedValue
        )

        setAgent('')

        setRm('')

    }


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = useCallback(
        async () => {

            try {

                setLoading(true)

                setError('')


                // -------------------------------------------------
                // EMPLOYEE FILTER
                // -------------------------------------------------

                const employeeId =
                    agent || rm || ''


                // -------------------------------------------------
                // API REQUEST
                // -------------------------------------------------

                const response =
                    await getCallAnalyticsOverview({

                        employeeId:
                            employeeId,

                        fromDate:
                            fromDate,

                        toDate:
                            toDate,

                        callType:
                            direction,

                        status:
                            status,

                        teamLeadContextId:
                            teamLead || '',

                    })


                // -------------------------------------------------
                // CALL RECORDS
                // -------------------------------------------------

                setCalls(
                    Array.isArray(
                        response.calls
                    )
                        ? response.calls
                        : []
                )


                // -------------------------------------------------
                // SUMMARY
                // -------------------------------------------------

                setSummary({
                    ...DEFAULT_SUMMARY,
                    ...(response.summary || {}),
                })

            } catch (requestError) {

                console.error(
                    'Failed to load call analytics:',
                    requestError
                )


                setCalls([])

                setSummary(
                    DEFAULT_SUMMARY
                )


                setError(
                    getApiErrorMessage(
                        requestError,
                        'Unable to load call analytics.'
                    )
                )

            } finally {

                setLoading(false)

            }

        },
        [
            agent,
            rm,
            fromDate,
            toDate,
            direction,
            status,
            teamLead,
        ]
    )


    // =========================================================
    // INITIAL / FILTER LOAD
    // =========================================================

    useEffect(() => {

        loadData()

    }, [
        loadData,
    ])


    // =========================================================
    // KPI FILTER
    // =========================================================

    const displayedCalls =
        activeKpi === 'total' ||
        !activeKpi
            ? calls
            : activeKpi === 'answered'
                ? calls.filter(
                    (call) =>
                        call.status === 'received'
                )
                : activeKpi === 'missed'
                    ? calls.filter(
                        (call) =>
                            call.status === 'missed'
                    )
                    : activeKpi === 'unknown'
                        ? []
                        : activeKpi === 'assigned'
                            ? []
                            : activeKpi === 'converted'
                                ? []
                                : calls


    // =========================================================
    // KPI CLICK
    // =========================================================

    const handleKpiClick = (
        key
    ) => {

        setActiveKpi(
            (current) =>
                current === key
                    ? ''
                    : key
        )

    }


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        const today =
            getTodayDateRange()


        setAgent('')

        setRm('')

        setTeamLead('')

        setDirection('')

        setStatus('')

        setFromDate(
            today.fromDate
        )

        setToDate(
            today.toDate
        )

        setActiveKpi('')

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
                    h-40
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
                ERROR
            ================================================= */}

            {error && (

                <div className="
                    rounded-lg
                    border
                    border-error/30
                    bg-error/5
                    px-4
                    py-3
                ">

                    <p className="
                        text-xs
                        text-error
                    ">
                        {error}
                    </p>

                </div>

            )}


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

                    {/* =================================================
                        TEAM LEAD
                    ================================================= */}

                    <TeamLeadDropdown
                        label="Team Lead"
                        value={teamLead}
                        onChange={
                            handleTeamLeadChange
                        }
                        placeholder="Select Team Lead"
                    />


                    {/* =================================================
                        AGENT
                    ================================================= */}

                    <AgentDropdown
                        label="Agent"
                        value={agent}
                        onChange={
                            handleAgentChange
                        }
                        placeholder="Select Agent"
                        teamLeadContextId={
                            teamLead || null
                        }
                    />


                    {/* =================================================
                        RM
                    ================================================= */}

                    <RmDropdown
                        label="RM"
                        value={rm}
                        onChange={
                            handleRmChange
                        }
                        placeholder="Select RM"
                        teamLeadContextId={
                            teamLead || null
                        }
                    />


                    {/* =================================================
                        CALL DIRECTION
                    ================================================= */}

                    <FilterDropdown
                        label="Call Direction"
                        value={direction}
                        options={DIRECTIONS}
                        onChange={
                            setDirection
                        }
                    />


                    {/* =================================================
                        CALL STATUS
                    ================================================= */}

                    <FilterDropdown
                        label="Call Status"
                        value={status}
                        options={STATUSES}
                        onChange={
                            setStatus
                        }
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
                        onFromChange={
                            setFromDate
                        }
                        onToChange={
                            setToDate
                        }
                    />


                    {/* =================================================
                        RESET
                    ================================================= */}

                    <button
                        type="button"
                        onClick={
                            handleReset
                        }
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


                    {/* =================================================
                        REFRESH
                    ================================================= */}

                    <button
                        type="button"
                        onClick={
                            loadData
                        }
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
                summary={
                    summary
                }
                activeKpi={
                    activeKpi
                }
                onKpiClick={
                    handleKpiClick
                }
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
                            {
                                formatLabel(
                                    activeKpi
                                )
                            }
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
                calls={
                    displayedCalls
                }
            />

        </div>

    )

}


export default Overview