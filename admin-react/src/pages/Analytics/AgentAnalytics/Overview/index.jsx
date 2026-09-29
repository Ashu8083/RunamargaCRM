// admin-react/src/pages/Analytics/AgentAnalytics/Overview/index.jsx

import { useEffect, useState } from 'react'

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'

import PipelineStages from './components/PipelineStages'
import PipelineInsights from './components/PipelineInsights'

import API from './API'


// =============================================================
// DEFAULT COUNTS
// =============================================================

const DEFAULT_COUNTS = {
    totalLeads: 0,
    inProcess: 0,
    login: 0,
    sanctioned: 0,
    disbursed: 0,
    rejected: 0,
}


// =============================================================
// DEFAULT PIPELINE
// =============================================================

const DEFAULT_PIPELINE = {
    totalLeads: 0,
    inProcess: 0,
    login: 0,
    sanctioned: 0,
    disbursed: 0,
    rejected: 0,
}


// =============================================================
// VIEW TYPES
// =============================================================

const VIEW_TYPES = {
    AGENT: 'agent',
    RM: 'rm',
}


// =============================================================
// PAGE
// =============================================================

function Overview() {

    // =========================================================
    // VIEW TYPE
    // =========================================================

    const [viewType, setViewType] = useState(
        VIEW_TYPES.AGENT
    )


    // =========================================================
    // PIPELINE INSIGHTS COUNTS
    // =========================================================

    const [counts, setCounts] = useState(
        DEFAULT_COUNTS
    )


    // =========================================================
    // APPLICATION PIPELINE COUNTS
    // =========================================================

    const [pipeline, setPipeline] = useState(
        DEFAULT_PIPELINE
    )


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] = useState(true)

    const [refreshing, setRefreshing] = useState(false)

    const [error, setError] = useState('')


    // =========================================================
    // FILTERS
    // =========================================================

    const [teamLead, setTeamLead] = useState('')

    const [agent, setAgent] = useState('')

    const [rm, setRm] = useState('')

    const [loanType, setLoanType] = useState('')

    const [fromDate, setFromDate] = useState('')

    const [toDate, setToDate] = useState('')


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = async (
        isRefresh = false
    ) => {

        try {

            if (isRefresh) {

                setRefreshing(true)

            } else {

                setLoading(true)

            }


            setError('')


            // -------------------------------------------------
            // API REQUEST
            // -------------------------------------------------

            const response =
                await API.getOverview({

                    // -------------------------------------------------
                    // ANALYTICS TYPE
                    // -------------------------------------------------

                    type:
                        viewType,


                    // -------------------------------------------------
                    // TEAM LEAD
                    // -------------------------------------------------

                    teamLeadContextId:
                        teamLead || null,


                    // -------------------------------------------------
                    // AGENT
                    // -------------------------------------------------

                    agentContextId:
                        viewType === VIEW_TYPES.AGENT
                            ? agent || null
                            : null,


                    // -------------------------------------------------
                    // RM
                    // -------------------------------------------------

                    rmContextId:
                        viewType === VIEW_TYPES.RM
                            ? rm || null
                            : null,


                    // -------------------------------------------------
                    // LOAN TYPE
                    // -------------------------------------------------

                    loanTypeId:
                        loanType || null,


                    // -------------------------------------------------
                    // DATE RANGE
                    // -------------------------------------------------

                    fromDate:
                        fromDate || null,

                    toDate:
                        toDate || null,

                })


            // -------------------------------------------------
            // PIPELINE INSIGHTS
            // -------------------------------------------------

            setCounts(
                response?.counts ||
                DEFAULT_COUNTS
            )


            // -------------------------------------------------
            // APPLICATION PIPELINE
            // -------------------------------------------------

            setPipeline(
                response?.pipeline ||
                DEFAULT_PIPELINE
            )

        } catch (error) {

            console.error(
                'Failed to load agent analytics:',
                error
            )


            setCounts(
                DEFAULT_COUNTS
            )


            setPipeline(
                DEFAULT_PIPELINE
            )


            setError(
                error?.response?.data?.detail ||
                error?.message ||
                'Failed to load agent analytics.'
            )

        } finally {

            setLoading(false)

            setRefreshing(false)

        }

    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadData()

    }, [])


    // =========================================================
    // FILTER / VIEW CHANGE
    // =========================================================

    useEffect(() => {

        if (loading) {
            return
        }


        loadData()

    }, [
        viewType,
        teamLead,
        agent,
        rm,
        loanType,
        fromDate,
        toDate,
    ])


    // =========================================================
    // VIEW TYPE CHANGE
    // =========================================================

    const handleViewTypeChange = (
        selectedView
    ) => {

        if (
            selectedView ===
            VIEW_TYPES.RM
        ) {

            setViewType(
                VIEW_TYPES.RM
            )

            // Clear Agent filter when switching to RM.
            setAgent('')

            return

        }


        setViewType(
            VIEW_TYPES.AGENT
        )

        // Clear RM filter when switching to Agent.
        setRm('')

    }


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (
        selectedTeamLead
    ) => {

        setTeamLead(
            selectedTeamLead || ''
        )


        // Reset both child filters because
        // available options depend on Team Lead.

        setAgent('')

        setRm('')

    }


    // =========================================================
    // AGENT CHANGE
    // =========================================================

    const handleAgentChange = (
        selectedAgent
    ) => {

        setAgent(
            selectedAgent || ''
        )

    }


    // =========================================================
    // RM CHANGE
    // =========================================================

    const handleRmChange = (
        selectedRm
    ) => {

        setRm(
            selectedRm || ''
        )

    }


    // =========================================================
    // LOAN TYPE CHANGE
    // =========================================================

    const handleLoanTypeChange = (
        selectedLoanType
    ) => {

        setLoanType(
            selectedLoanType || ''
        )

    }


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setViewType(
            VIEW_TYPES.AGENT
        )

        setTeamLead('')

        setAgent('')

        setRm('')

        setLoanType('')

        setFromDate('')

        setToDate('')

    }


    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (

            <div
                className="
                    w-full
                    min-w-0
                    max-w-full
                    space-y-5
                    overflow-x-hidden
                    p-4
                    sm:p-5
                    lg:p-6
                "
            >

                <div
                    className="
                        w-full
                        animate-pulse
                        rounded-2xl
                        bg-base-200
                        p-4
                        sm:p-5
                    "
                >

                    {/* -------------------------------------------------
                        FILTER HEADER
                    ------------------------------------------------- */}

                    <div
                        className="
                            mb-5
                            h-12
                            w-full
                            rounded-xl
                            bg-base-300/60
                        "
                    />


                    {/* -------------------------------------------------
                        FILTERS
                    ------------------------------------------------- */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >

                        {Array.from({
                            length: 8,
                        }).map((_, index) => (

                            <div
                                key={index}
                                className="
                                    h-10
                                    rounded-xl
                                    bg-base-300/60
                                "
                            />

                        ))}

                    </div>


                    {/* -------------------------------------------------
                        INSIGHTS
                    ------------------------------------------------- */}

                    <div
                        className="
                            mt-6
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {Array.from({
                            length: 6,
                        }).map((_, index) => (

                            <div
                                key={index}
                                className="
                                    h-36
                                    rounded-2xl
                                    bg-base-300/60
                                "
                            />

                        ))}

                    </div>


                    {/* -------------------------------------------------
                        PIPELINE
                    ------------------------------------------------- */}

                    <div
                        className="
                            mt-6
                            h-80
                            w-full
                            rounded-2xl
                            bg-base-300/60
                        "
                    />

                </div>

            </div>

        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                w-full
                min-w-0
                max-w-full
                space-y-5
                overflow-x-hidden
                p-4
                sm:p-5
                lg:p-6
            "
        >

            {/* =================================================
                MAIN ANALYTICS CARD
            ================================================= */}

            <section
                className="
                    isolate
                    w-full
                    min-w-0
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    p-4
                    shadow-sm
                    sm:p-5
                "
            >

                {/* =================================================
                    FILTER HEADER
                ================================================= */}

                <div
                    className="
                        mb-5
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    {/* -------------------------------------------------
                        TITLE
                    ------------------------------------------------- */}

                    <div
                        className="
                            min-w-0
                        "
                    >

                    </div>


                    {/* -------------------------------------------------
                        AGENT / RM TOGGLE + ACTIONS
                    ------------------------------------------------- */}

                    <div
                        className="
                            flex
                            shrink-0
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        {/* =================================================
                            AGENT / RM TOGGLE
                        ================================================= */}

                        <div
                            className="
                                inline-flex
                                items-center
                                rounded-xl
                                border
                                border-base-300
                                bg-base-200/60
                                p-1
                            "
                        >

                            {/* -------------------------------------------------
                                AGENT
                            ------------------------------------------------- */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleViewTypeChange(
                                        VIEW_TYPES.AGENT
                                    )
                                }
                                className={`
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    transition
                                    sm:px-4
                                    sm:text-sm
                                    ${
                                        viewType ===
                                        VIEW_TYPES.AGENT
                                            ? `
                                                bg-base-100
                                                text-base-content
                                                shadow-sm
                                            `
                                            : `
                                                text-base-content/50
                                                hover:text-base-content
                                            `
                                    }
                                `}
                            >
                                Agent
                            </button>


                            {/* -------------------------------------------------
                                RM
                            ------------------------------------------------- */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleViewTypeChange(
                                        VIEW_TYPES.RM
                                    )
                                }
                                className={`
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    transition
                                    sm:px-4
                                    sm:text-sm
                                    ${
                                        viewType ===
                                        VIEW_TYPES.RM
                                            ? `
                                                bg-base-100
                                                text-base-content
                                                shadow-sm
                                            `
                                            : `
                                                text-base-content/50
                                                hover:text-base-content
                                            `
                                    }
                                `}
                            >
                                RM
                            </button>

                        </div>


                        {/* =================================================
                            RESET
                        ================================================= */}

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            className="
                                rounded-lg
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                text-base-content/55
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                            "
                        >
                            Reset filters
                        </button>


                        {/* =================================================
                            REFRESH
                        ================================================= */}

                        <button
                            type="button"
                            onClick={() =>
                                loadData(true)
                            }
                            disabled={refreshing}
                            className="
                                inline-flex
                                h-10
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-base-300
                                bg-base-100
                                px-4
                                text-xs
                                font-medium
                                text-base-content/70
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                sm:text-sm
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    leading-none
                                "
                            >
                                ↻
                            </span>


                            <span>
                                {refreshing
                                    ? 'Refreshing...'
                                    : 'Refresh'}
                            </span>

                        </button>

                    </div>

                </div>


                {/* =================================================
                    FILTER GRID
                ================================================= */}

                <div
                    className="
                        relative
                        z-0
                        grid
                        w-full
                        min-w-0
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {/* =================================================
                        TEAM LEAD
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            w-full
                        "
                    >

                        <TeamLeadDropdown

                            label="Team Lead"

                            value={teamLead}

                            onChange={
                                handleTeamLeadChange
                            }

                            allLabel="All Team Leads"

                            placeholder="All Team Leads"

                            searchPlaceholder="Search team lead"

                            emptyMessage="No team leads found"

                        />

                    </div>


                    {/* =================================================
                        AGENT
                    ================================================= */}

                    {viewType ===
                        VIEW_TYPES.AGENT && (

                        <div
                            className="
                                min-w-0
                                w-full
                            "
                        >

                            <AgentDropdown

                                label="Agent"

                                value={agent}

                                onChange={
                                    handleAgentChange
                                }

                                teamLeadContextId={
                                    teamLead || null
                                }

                            />

                        </div>

                    )}


                    {/* =================================================
                        RM
                    ================================================= */}

                    {viewType ===
                        VIEW_TYPES.RM && (

                        <div
                            className="
                                min-w-0
                                w-full
                            "
                        >

                            <RmDropdown

                                label="RM"

                                value={rm}

                                onChange={
                                    handleRmChange
                                }

                                teamLeadContextId={
                                    teamLead || null
                                }

                            />

                        </div>

                    )}


                    {/* =================================================
                        LOAN TYPE
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            w-full
                        "
                    >

                        <LoanTypeDropdown

                            label="Loan Type"

                            value={loanType}

                            onChange={
                                handleLoanTypeChange
                            }

                        />

                    </div>


                    {/* =================================================
                        FROM DATE
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            w-full
                        "
                    >

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            "
                        >
                            From Date
                        </label>


                        <div
                            className="
                                relative
                                isolate
                                w-full
                            "
                        >

                            <CalendarDaysIcon
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    z-0
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-base-content/35
                                "
                            />


                            <input
                                type="date"
                                value={
                                    fromDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFromDate(
                                        event.target.value
                                    )
                                }
                                max={
                                    toDate ||
                                    undefined
                                }
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    min-w-0
                                    pl-9
                                    text-sm
                                    bg-base-100
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        TO DATE
                    ================================================= */}

                    <div
                        className="
                            min-w-0
                            w-full
                        "
                    >

                        <label
                            className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            "
                        >
                            To Date
                        </label>


                        <div
                            className="
                                relative
                                isolate
                                w-full
                            "
                        >

                            <CalendarDaysIcon
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    z-0
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-base-content/35
                                "
                            />


                            <input
                                type="date"
                                value={
                                    toDate
                                }
                                onChange={(
                                    event
                                ) =>
                                    setToDate(
                                        event.target.value
                                    )
                                }
                                min={
                                    fromDate ||
                                    undefined
                                }
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    min-w-0
                                    pl-9
                                    text-sm
                                    bg-base-100
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        FILTER STATUS
                    ================================================= */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-end
                            lg:col-span-2
                        "
                    >

                        <div
                            className="
                                flex
                                min-h-10
                                w-full
                                items-center
                                justify-between
                                gap-3
                                rounded-xl
                                bg-base-200/60
                                px-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-2
                                "
                            >

                                <CalendarDaysIcon
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
                                        text-base-content/40
                                    "
                                />


                                <span
                                    className="
                                        truncate
                                        text-xs
                                        text-base-content/55
                                    "
                                >
                                    Application period
                                </span>

                            </div>


                            <span
                                className="
                                    shrink-0
                                    rounded-full
                                    bg-primary/10
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-semibold
                                    text-primary
                                "
                            >
                                {fromDate || toDate
                                    ? 'Filtered'
                                    : 'Today'}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <section
                        className="
                            mt-5
                            w-full
                            rounded-2xl
                            border
                            border-error/20
                            bg-error/5
                            px-4
                            py-3
                        "
                    >

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-3
                            "
                        >

                            <p
                                className="
                                    min-w-0
                                    text-xs
                                    font-medium
                                    text-error
                                "
                            >
                                {error}
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    loadData(true)
                                }
                                className="
                                    shrink-0
                                    rounded-lg
                                    bg-error/10
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-error
                                    transition
                                    hover:bg-error/20
                                "
                            >
                                Retry
                            </button>

                        </div>

                    </section>

                )}


                {/* =================================================
                    ANALYTICS
                ================================================= */}

                {!error && (

                    <div
                        className="
                            mt-6
                            min-w-0
                        "
                    >

                        {/* =================================================
                            PIPELINE INSIGHTS
                        ================================================= */}

                        <PipelineInsights
                            counts={counts}
                            viewType={viewType}
                        />


                        {/* =================================================
                            APPLICATION PIPELINE
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                min-w-0
                            "
                        >

                            <PipelineStages
                                pipeline={pipeline}
                                viewType={viewType}
                            />

                        </div>

                    </div>

                )}

            </section>

        </div>

    )

}


export default Overview