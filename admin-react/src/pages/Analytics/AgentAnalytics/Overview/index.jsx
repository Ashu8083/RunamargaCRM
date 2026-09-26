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
// DEFAULT VISIBILITY
// =============================================================

const DEFAULT_VISIBILITY = {
    teamLeadContextIds: [],
    agentContextIds: [],
    rmContextIds: [],
}


// =============================================================
// PAGE
// =============================================================

function Overview() {

    // =========================================================
    // PIPELINE INSIGHTS COUNTS
    // =========================================================

    const [counts, setCounts] =
        useState(
            DEFAULT_COUNTS
        )


    // =========================================================
    // APPLICATION PIPELINE COUNTS
    // =========================================================

    const [pipeline, setPipeline] =
        useState(
            DEFAULT_PIPELINE
        )


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(true)


    const [refreshing, setRefreshing] =
        useState(false)


    const [error, setError] =
        useState('')


    // =========================================================
    // FILTERS
    // =========================================================

    const [teamLead, setTeamLead] =
        useState('')


    const [agent, setAgent] =
        useState('')


    const [rm, setRm] =
        useState('')


    const [loanType, setLoanType] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // VISIBILITY
    // =========================================================

    const [visibility, setVisibility] =
        useState(
            DEFAULT_VISIBILITY
        )


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

                    teamLeadContextId:
                        teamLead || null,

                    agentContextId:
                        agent || null,

                    rmContextId:
                        rm || null,

                    loanTypeId:
                        loanType || null,

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


            // -------------------------------------------------
            // VISIBILITY
            // -------------------------------------------------

            setVisibility(
                response?.visibility ||
                DEFAULT_VISIBILITY
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


            setVisibility(
                DEFAULT_VISIBILITY
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
    // FILTER CHANGE
    // =========================================================

    useEffect(() => {

        if (loading) {
            return
        }


        loadData()

    }, [
        teamLead,
        agent,
        rm,
        loanType,
        fromDate,
        toDate,
    ])


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (
        selectedTeamLead
    ) => {

        setTeamLead(
            selectedTeamLead || ''
        )

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

                {/* =================================================
                    MAIN CARD SKELETON
                ================================================= */}

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
                    FILTER HEADER + REFRESH
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
                        FILTER TITLE
                    ------------------------------------------------- */}

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-base-content
                            "
                        >
                            Filters
                        </h2>


                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-base-content/45
                            "
                        >
                            Filter the analytics by hierarchy, loan type,
                            and application period.
                        </p>

                    </div>


                    {/* -------------------------------------------------
                        ACTIONS
                    ------------------------------------------------- */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                        "
                    >

                        {/* -------------------------------------------------
                            RESET
                        ------------------------------------------------- */}

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


                        {/* -------------------------------------------------
                            REFRESH
                        ------------------------------------------------- */}

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

                            {/* -------------------------------------------------
                                Refresh icon replaced with text symbol
                                to avoid SVG/icon overlap.
                            ------------------------------------------------- */}

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


                    {/* =================================================
                        RM
                    ================================================= */}

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
                                    toDate || undefined
                                }
                                className="
                                    input
                                    input-bordered
                                    relative
                                    z-10
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
                                    fromDate || undefined
                                }
                                className="
                                    input
                                    input-bordered
                                    relative
                                    z-10
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
                            />

                        </div>

                    </div>

                )}

            </section>

        </div>

    )

}


export default Overview
