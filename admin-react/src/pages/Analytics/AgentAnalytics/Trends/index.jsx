// admin-react/src/pages/Analytics/AgentAnalytics/Trends/index.jsx

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'

import ApplicationTrend from './components/ApplicationTrend'
import LoanStageDistribution from './components/LoanStageDistribution'
import LoanTypeTrend from './components/LoanTypeTrend'
import SanctionDisbursementTrend from './components/SanctionDisbursementTrend'
import RejectionTrend from './components/RejectionTrend'

import TrendsAPI from './API'


// =============================================================
// LOADING STATE
// =============================================================

function LoadingState() {

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
                FILTER SKELETON
            ================================================= */}

            <div className="
                w-full
                animate-pulse
                rounded-2xl
                border
                border-base-300
                bg-base-100
                p-4
            ">

                <div className="
                    mb-4
                    h-10
                    w-48
                    rounded-lg
                    bg-base-200
                " />

                <div className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                ">

                    {Array.from({
                        length: 4,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="
                                h-10
                                rounded-lg
                                bg-base-200
                            "
                        />

                    ))}

                </div>

            </div>


            {/* =================================================
                FIRST ROW SKELETON
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-3
            ">

                <div className="
                    h-[380px]
                    animate-pulse
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    xl:col-span-2
                " />

                <div className="
                    h-[380px]
                    animate-pulse
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                " />

            </div>


            {/* =================================================
                LOAN TYPE SKELETON
            ================================================= */}

            <div className="
                h-[400px]
                animate-pulse
                rounded-2xl
                border
                border-base-300
                bg-base-100
            " />


            {/* =================================================
                BOTTOM ROW SKELETON
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                gap-5
                xl:grid-cols-2
            ">

                <div className="
                    h-[380px]
                    animate-pulse
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                " />

                <div className="
                    h-[380px]
                    animate-pulse
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                " />

            </div>

        </div>
    )

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

function Trends() {

    // =========================================================
    // ANALYTICS DATA
    // =========================================================

    const [trend, setTrend] =
        useState([])

    const [loanTypeTrend, setLoanTypeTrend] =
        useState([])

    const [stageDistribution, setStageDistribution] =
        useState({})

    const [
        sanctionDisbursementTrend,
        setSanctionDisbursementTrend,
    ] = useState([])

    const [rejectionTrend, setRejectionTrend] =
        useState([])


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(true)

    const [refreshing, setRefreshing] =
        useState(false)


    // =========================================================
    // MODE
    // =========================================================

    const [mode, setMode] =
        useState(VIEW_TYPES.AGENT)


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
    // REQUEST CONTROL
    // =========================================================

    const requestIdRef =
        useRef(0)


    // =========================================================
    // CLEAR ANALYTICS
    // =========================================================

    const clearAnalytics = useCallback(() => {

        setTrend([])

        setLoanTypeTrend([])

        setStageDistribution({})

        setSanctionDisbursementTrend([])

        setRejectionTrend([])

    }, [])


    // =========================================================
    // APPLY RESPONSE
    // =========================================================

    const applyResponse = useCallback((
        response
    ) => {

        setTrend(
            Array.isArray(
                response?.trend
            )
                ? response.trend
                : []
        )


        setLoanTypeTrend(
            Array.isArray(
                response?.loanTypeTrend
            )
                ? response.loanTypeTrend
                : []
        )


        setStageDistribution(
            response?.stageDistribution &&
            typeof response.stageDistribution === 'object'
                ? response.stageDistribution
                : {}
        )


        setSanctionDisbursementTrend(
            Array.isArray(
                response?.sanctionDisbursementTrend
            )
                ? response.sanctionDisbursementTrend
                : []
        )


        setRejectionTrend(
            Array.isArray(
                response?.rejectionTrend
            )
                ? response.rejectionTrend
                : []
        )

    }, [])


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = useCallback(async (
        filters,
        initial = false
    ) => {

        const requestId =
            ++requestIdRef.current


        console.log(
            '[Agent Analytics Trends] Request:',
            filters
        )


        if (initial) {

            setLoading(true)

        } else {

            setRefreshing(true)

        }


        try {

            const response =
                await TrendsAPI.getTrends(
                    filters
                )


            // -------------------------------------------------
            // Ignore old request responses
            // -------------------------------------------------

            if (
                requestId !==
                requestIdRef.current
            ) {

                return

            }


            console.log(
                '[Agent Analytics Trends] Response:',
                response
            )


            applyResponse(
                response
            )

        } catch (error) {

            if (
                requestId !==
                requestIdRef.current
            ) {

                return

            }


            console.error(
                '[Agent Analytics Trends] Failed:',
                error
            )


            clearAnalytics()

        } finally {

            if (
                requestId ===
                requestIdRef.current
            ) {

                setLoading(false)

                setRefreshing(false)

            }

        }

    }, [
        applyResponse,
        clearAnalytics,
    ])


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadData({

            type:
                VIEW_TYPES.AGENT,

            teamLeadContextId:
                null,

            agentContextId:
                null,

            rmContextId:
                null,

            loanTypeId:
                null,

            fromDate:
                null,

            toDate:
                null,

        }, true)

    }, [
        loadData,
    ])


    // =========================================================
    // BUILD FILTERS
    // =========================================================

    const buildFilters = ({
        nextMode = mode,

        nextTeamLead = teamLead,

        nextAgent = agent,

        nextRm = rm,

        nextLoanType = loanType,

        nextFromDate = fromDate,

        nextToDate = toDate,

    } = {}) => {

        return {

            // -------------------------------------------------
            // ANALYTICS TYPE
            // -------------------------------------------------

            type:
                nextMode,


            // -------------------------------------------------
            // TEAM LEAD
            // -------------------------------------------------

            teamLeadContextId:
                nextTeamLead || null,


            // -------------------------------------------------
            // AGENT
            // -------------------------------------------------

            agentContextId:
                nextMode === VIEW_TYPES.AGENT
                    ? (
                        nextAgent || null
                    )
                    : null,


            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            rmContextId:
                nextMode === VIEW_TYPES.RM
                    ? (
                        nextRm || null
                    )
                    : null,


            // -------------------------------------------------
            // LOAN TYPE
            // -------------------------------------------------

            loanTypeId:
                nextLoanType || null,


            // -------------------------------------------------
            // DATE RANGE
            // -------------------------------------------------

            fromDate:
                nextFromDate || null,

            toDate:
                nextToDate || null,

        }

    }


    // =========================================================
    // MODE CHANGE
    // =========================================================

    const handleModeChange = (
        nextMode
    ) => {

        const selectedMode =
            nextMode === VIEW_TYPES.RM
                ? VIEW_TYPES.RM
                : VIEW_TYPES.AGENT


        if (
            selectedMode === mode
        ) {

            return

        }


        // -----------------------------------------------------
        // Keep only the filter belonging to the selected mode.
        // -----------------------------------------------------

        const nextAgent =
            selectedMode === VIEW_TYPES.AGENT
                ? agent
                : ''


        const nextRm =
            selectedMode === VIEW_TYPES.RM
                ? rm
                : ''


        setMode(
            selectedMode
        )

        setAgent(
            nextAgent
        )

        setRm(
            nextRm
        )


        const filters =
            buildFilters({

                nextMode:
                    selectedMode,

                nextAgent,

                nextRm,

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (
        selectedTeamLead
    ) => {

        const nextTeamLead =
            selectedTeamLead || ''


        // -----------------------------------------------------
        // Update Team Lead
        // -----------------------------------------------------

        setTeamLead(
            nextTeamLead
        )


        // -----------------------------------------------------
        // IMPORTANT:
        // Agent and RM depend on Team Lead.
        //
        // When Team Lead changes, clear both child filters.
        // This is the same behavior used in Overview.
        // -----------------------------------------------------

        setAgent('')

        setRm('')


        // -----------------------------------------------------
        // Load analytics using the new Team Lead.
        //
        // Do NOT send the old Agent/RM selection.
        // -----------------------------------------------------

        const filters =
            buildFilters({

                nextTeamLead,

                nextAgent:
                    '',

                nextRm:
                    '',

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // AGENT CHANGE
    // =========================================================

    const handleAgentChange = (
        selectedAgent
    ) => {

        const nextAgent =
            selectedAgent || ''


        setAgent(
            nextAgent
        )


        const filters =
            buildFilters({

                nextAgent,

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // RM CHANGE
    // =========================================================

    const handleRmChange = (
        selectedRm
    ) => {

        const nextRm =
            selectedRm || ''


        setRm(
            nextRm
        )


        const filters =
            buildFilters({

                nextRm,

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // LOAN TYPE CHANGE
    // =========================================================

    const handleLoanTypeChange = (
        selectedLoanType
    ) => {

        const nextLoanType =
            selectedLoanType || ''


        setLoanType(
            nextLoanType
        )


        const filters =
            buildFilters({

                nextLoanType,

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // FROM DATE CHANGE
    // =========================================================

    const handleFromDateChange = (
        value
    ) => {

        setFromDate(
            value
        )


        // -----------------------------------------------------
        // Do not request invalid date range.
        // -----------------------------------------------------

        if (
            toDate &&
            value &&
            value > toDate
        ) {

            return

        }


        const filters =
            buildFilters({

                nextFromDate:
                    value,

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // TO DATE CHANGE
    // =========================================================

    const handleToDateChange = (
        value
    ) => {

        setToDate(
            value
        )


        // -----------------------------------------------------
        // Do not request invalid date range.
        // -----------------------------------------------------

        if (
            fromDate &&
            value &&
            value < fromDate
        ) {

            return

        }


        const filters =
            buildFilters({

                nextToDate:
                    value,

            })


        loadData(
            filters
        )

    }


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        const resetFilters = {

            type:
                VIEW_TYPES.AGENT,

            teamLeadContextId:
                null,

            agentContextId:
                null,

            rmContextId:
                null,

            loanTypeId:
                null,

            fromDate:
                null,

            toDate:
                null,

        }


        // -----------------------------------------------------
        // Reset local state
        // -----------------------------------------------------

        setMode(
            VIEW_TYPES.AGENT
        )

        setTeamLead('')

        setAgent('')

        setRm('')

        setLoanType('')

        setFromDate('')

        setToDate('')


        // -----------------------------------------------------
        // Reload with completely clean filters.
        // -----------------------------------------------------

        loadData(
            resetFilters
        )

    }


    // =========================================================
    // HAS STAGE DATA
    // =========================================================

    const hasStageData =
        Object.values(
            stageDistribution || {}
        ).some(
            (value) =>
                Number(value || 0) > 0
        )


    // =========================================================
    // HAS DATA
    // =========================================================

    const hasData =
        trend.length > 0 ||
        loanTypeTrend.length > 0 ||
        hasStageData ||
        sanctionDisbursementTrend.length > 0 ||
        rejectionTrend.length > 0


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return <LoadingState />

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
                FILTER PANEL
            ================================================= */}

            <section className="
                w-full
                min-w-0
                rounded-2xl
                border
                border-base-300
                bg-base-100
                p-4
                shadow-sm
            ">

                {/* =================================================
                    MODE
                ================================================= */}

                <div className="
                    mb-4
                    flex
                    w-full
                    justify-center
                ">

                    <div className="
                        inline-flex
                        w-full
                        max-w-[280px]
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/50
                        p-1
                    ">

                        {/* -------------------------------------------------
                            AGENT
                        ------------------------------------------------- */}

                        <button
                            type="button"
                            onClick={() =>
                                handleModeChange(
                                    VIEW_TYPES.AGENT
                                )
                            }
                            disabled={refreshing}
                            className={`
                                h-9
                                flex-1
                                rounded-lg
                                px-4
                                text-xs
                                font-semibold
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                ${
                                    mode === VIEW_TYPES.AGENT
                                        ? 'bg-base-100 text-[#78B300] shadow-sm'
                                        : 'text-base-content/50 hover:text-base-content'
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
                                handleModeChange(
                                    VIEW_TYPES.RM
                                )
                            }
                            disabled={refreshing}
                            className={`
                                h-9
                                flex-1
                                rounded-lg
                                px-4
                                text-xs
                                font-semibold
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                ${
                                    mode === VIEW_TYPES.RM
                                        ? 'bg-base-100 text-[#78B300] shadow-sm'
                                        : 'text-base-content/50 hover:text-base-content'
                                }
                            `}
                        >
                            RM
                        </button>

                    </div>

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                ">

                    {/* =================================================
                        FROM
                    ================================================= */}

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
                            From
                        </label>


                        <input
                            type="date"
                            value={fromDate}
                            max={
                                toDate ||
                                undefined
                            }
                            onChange={(event) =>
                                handleFromDateChange(
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


                    {/* =================================================
                        TO
                    ================================================= */}

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
                            To
                        </label>


                        <input
                            type="date"
                            value={toDate}
                            min={
                                fromDate ||
                                undefined
                            }
                            onChange={(event) =>
                                handleToDateChange(
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


                    {/* =================================================
                        TEAM LEAD
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

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

                    {mode === VIEW_TYPES.AGENT && (

                        <div className="
                            min-w-0
                            w-full
                        ">

                            <AgentDropdown
                                label="Agent"
                                value={agent}
                                onChange={
                                    handleAgentChange
                                }

                                // IMPORTANT:
                                // Agent list is filtered by Team Lead.
                                teamLeadContextId={
                                    teamLead || null
                                }
                            />

                        </div>

                    )}


                    {/* =================================================
                        RM
                    ================================================= */}

                    {mode === VIEW_TYPES.RM && (

                        <div className="
                            min-w-0
                            w-full
                        ">

                            <RmDropdown
                                label="RM"
                                value={rm}
                                onChange={
                                    handleRmChange
                                }

                                // IMPORTANT:
                                // RM list is filtered by Team Lead.
                                teamLeadContextId={
                                    teamLead || null
                                }
                            />

                        </div>

                    )}


                    {/* =================================================
                        LOAN TYPE
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <LoanTypeDropdown
                            label="Loan Type"
                            value={loanType}
                            onChange={
                                handleLoanTypeChange
                            }
                        />

                    </div>


                    {/* =================================================
                        RESET
                    ================================================= */}

                    <div className="
                        flex
                        min-w-0
                        w-full
                        items-end
                    ">

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            disabled={refreshing}
                            className="
                                inline-flex
                                h-10
                                w-full
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
                                text-base-content/60
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <ArrowPathIcon className="
                                h-4
                                w-4
                                shrink-0
                            " />

                            <span>
                                {refreshing
                                    ? 'Loading...'
                                    : 'Reset'}
                            </span>

                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                NO DATA
            ================================================= */}

            {!hasData && (

                <section className="
                    flex
                    min-h-[220px]
                    w-full
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    p-6
                    text-center
                    shadow-sm
                ">

                    <div>

                        <p className="
                            text-sm
                            font-semibold
                            text-base-content/50
                        ">
                            No analytics data found
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            text-base-content/35
                        ">
                            Try changing the selected filters.
                        </p>

                    </div>

                </section>

            )}


            {/* =================================================
                APPLICATION TREND + STAGE
            ================================================= */}

            {hasData && (

                <div className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-5
                    xl:grid-cols-3
                ">

                    {/* -------------------------------------------------
                        APPLICATION TREND
                    ------------------------------------------------- */}

                    <div className="
                        min-w-0
                        xl:col-span-2
                    ">

                        <ApplicationTrend
                            analytics={
                                trend
                            }
                        />

                    </div>


                    {/* -------------------------------------------------
                        STAGE DISTRIBUTION
                    ------------------------------------------------- */}

                    <div className="
                        min-w-0
                    ">

                        <LoanStageDistribution
                            stageDistribution={
                                stageDistribution
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                LOAN TYPE TREND
            ================================================= */}

            {hasData && (

                <LoanTypeTrend
                    loanTypeTrend={
                        loanTypeTrend
                    }
                />

            )}


            {/* =================================================
                SANCTION / REJECTION
            ================================================= */}

            {hasData && (

                <div className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                ">

                    {/* -------------------------------------------------
                        SANCTION / DISBURSEMENT
                    ------------------------------------------------- */}

                    <div className="
                        min-w-0
                    ">

                        <SanctionDisbursementTrend
                            sanctionDisbursementTrend={
                                sanctionDisbursementTrend
                            }
                        />

                    </div>


                    {/* -------------------------------------------------
                        REJECTION
                    ------------------------------------------------- */}

                    <div className="
                        min-w-0
                    ">

                        <RejectionTrend
                            rejectionTrend={
                                rejectionTrend
                            }
                        />

                    </div>

                </div>

            )}

        </div>

    )

}


export default Trends