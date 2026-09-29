// admin-react/src/pages/Analytics/AgentAnalytics/Performance/index.jsx

import { useEffect, useRef, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'

import PerformanceAPI from './API'

import PerformanceOverview from './components/PerformanceOverview'
import LoanWisePerformance from './components/LoanWisePerformance'
import TopPerformers from './components/TopPerformers'


// =============================================================
// METRICS
// =============================================================

export const PERFORMANCE_METRICS = [
    {
        value: 'disbursed',
        label: 'Disbursed',
    },
    {
        value: 'sanctioned',
        label: 'Sanctioned',
    },
    {
        value: 'login',
        label: 'Login',
    },
    {
        value: 'inProcess',
        label: 'In Process',
    },
    {
        value: 'rejected',
        label: 'Rejected',
    },
]


// =============================================================
// DEFAULT VALUES
// =============================================================

const DEFAULT_MODE = 'agent'

const DEFAULT_METRIC = 'disbursed'


// =============================================================
// DATE INPUT
// =============================================================

function DateInput({
    label,
    value,
    onChange,
}) {

    return (

        <div className="
            min-w-0
            w-full
        ">

            <label className="
                mb-1
                block
                text-xs
                font-medium
                text-base-content/60
            ">
                {label}
            </label>

            <input
                type="date"
                value={value}
                onChange={(event) => {
                    onChange(
                        event.target.value
                    )
                }}
                className="
                    input
                    input-bordered
                    h-10
                    min-h-10
                    w-full
                    min-w-0
                    rounded-lg
                    px-2.5
                    text-xs
                "
            />

        </div>

    )

}


// =============================================================
// MODE TOGGLE
// =============================================================

function ModeToggle({
    mode,
    onChange,
}) {

    return (

        <div className="
            inline-flex
            rounded-lg
            border
            border-base-300
            bg-base-200/50
            p-1
        ">

            <button
                type="button"
                onClick={() => {
                    onChange('agent')
                }}
                className={
                    mode === 'agent'
                        ? `
                            min-w-[80px]
                            rounded-md
                            bg-base-100
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#78B300]
                            shadow-sm
                            transition
                        `
                        : `
                            min-w-[80px]
                            rounded-md
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-base-content/50
                            transition
                            hover:text-base-content
                        `
                }
            >
                Agent
            </button>

            <button
                type="button"
                onClick={() => {
                    onChange('rm')
                }}
                className={
                    mode === 'rm'
                        ? `
                            min-w-[80px]
                            rounded-md
                            bg-base-100
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#78B300]
                            shadow-sm
                            transition
                        `
                        : `
                            min-w-[80px]
                            rounded-md
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-base-content/50
                            transition
                            hover:text-base-content
                        `
                }
            >
                RM
            </button>

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

    const [performance, setPerformance] = useState([])

    const [overview, setOverview] = useState([])

    const [loanWise, setLoanWise] = useState([])

    const [
        topPerformers,
        setTopPerformers,
    ] = useState([])

    const [
        topPerformersByLoanType,
        setTopPerformersByLoanType,
    ] = useState([])

    // =========================================================
    // STATE
    // =========================================================

    const [loading, setLoading] = useState(true)

    const [refreshing, setRefreshing] = useState(false)

    const [mode, setMode] = useState(
        DEFAULT_MODE
    )

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
    // TOP PERFORMER METRIC
    // =========================================================

    const [
        performanceMetric,
        setPerformanceMetric,
    ] = useState(
        DEFAULT_METRIC
    )

    // =========================================================
    // REQUEST CONTROL
    // =========================================================

    const requestIdRef = useRef(0)

    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = async ({
        isRefresh = false,
        filters = {},
    } = {}) => {

        const requestId =
            ++requestIdRef.current

        try {

            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const response =
                await PerformanceAPI.getPerformance(
                    filters
                )

            if (
                requestId !==
                requestIdRef.current
            ) {
                return
            }

            setOverview(
                Array.isArray(
                    response?.overview
                )
                    ? response.overview
                    : []
            )

            setLoanWise(
                Array.isArray(
                    response?.loanWise
                )
                    ? response.loanWise
                    : []
            )

            setTopPerformers(
                Array.isArray(
                    response?.topPerformers
                )
                    ? response.topPerformers
                    : []
            )

            setTopPerformersByLoanType(
                Array.isArray(
                    response?.topPerformersByLoanType
                )
                    ? response.topPerformersByLoanType
                    : []
            )

            setPerformance(
                Array.isArray(
                    response?.overview
                )
                    ? response.overview
                    : []
            )

        } catch (error) {

            if (
                requestId !==
                requestIdRef.current
            ) {
                return
            }

            console.error(
                'Failed to load agent performance:',
                error
            )

            setPerformance([])

            setOverview([])

            setLoanWise([])

            setTopPerformers([])

            setTopPerformersByLoanType([])

        } finally {

            if (
                requestId ===
                requestIdRef.current
            ) {

                setLoading(false)

                setRefreshing(false)

            }

        }

    }


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

            type:
                nextMode,

            teamLeadContextId:
                nextTeamLead || null,

            agentContextId:
                nextMode === 'agent'
                    ? nextAgent || null
                    : null,

            rmContextId:
                nextMode === 'rm'
                    ? nextRm || null
                    : null,

            loanTypeId:
                nextLoanType || null,

            fromDate:
                nextFromDate || null,

            toDate:
                nextToDate || null,

        }

    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadData({
            filters: buildFilters({
                nextMode: DEFAULT_MODE,
                nextTeamLead: '',
                nextAgent: '',
                nextRm: '',
                nextLoanType: '',
                nextFromDate: '',
                nextToDate: '',
            }),
        })

    }, [])


    // =========================================================
    // MODE CHANGE
    // =========================================================

    const handleModeChange = (
        nextMode
    ) => {

        const nextAgent =
            nextMode === 'agent'
                ? agent
                : ''

        const nextRm =
            nextMode === 'rm'
                ? rm
                : ''

        setMode(nextMode)

        setAgent(
            nextAgent
        )

        setRm(
            nextRm
        )

        loadData({
            filters: buildFilters({
                nextMode,
                nextAgent,
                nextRm,
            }),
        })

    }


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (
        selectedTeamLead
    ) => {

        const nextTeamLead =
            selectedTeamLead || ''

        setTeamLead(
            nextTeamLead
        )

        setAgent('')

        setRm('')

        loadData({
            filters: buildFilters({
                nextTeamLead,
                nextAgent: '',
                nextRm: '',
            }),
        })

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

        loadData({
            filters: buildFilters({
                nextAgent,
            }),
        })

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

        loadData({
            filters: buildFilters({
                nextRm,
            }),
        })

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

        loadData({
            filters: buildFilters({
                nextLoanType,
            }),
        })

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

        loadData({
            filters: buildFilters({
                nextFromDate:
                    value,
            }),
        })

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

        loadData({
            filters: buildFilters({
                nextToDate:
                    value,
            }),
        })

    }


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setMode(
            DEFAULT_MODE
        )

        setTeamLead('')

        setAgent('')

        setRm('')

        setLoanType('')

        setFromDate('')

        setToDate('')

        setPerformanceMetric(
            DEFAULT_METRIC
        )

        loadData({
            filters: buildFilters({
                nextMode:
                    DEFAULT_MODE,
                nextTeamLead: '',
                nextAgent: '',
                nextRm: '',
                nextLoanType: '',
                nextFromDate: '',
                nextToDate: '',
            }),
        })

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        loadData({
            isRefresh: true,
            filters: buildFilters(),
        })

    }


    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {

        return (

            <div className="
                w-full
                max-w-full
                space-y-4
                overflow-x-hidden
                p-4
                sm:p-5
            ">

                <div className="
                    h-32
                    w-full
                    animate-pulse
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                " />

                {Array.from({
                    length: 3,
                }).map((_, index) => (

                    <div
                        key={index}
                        className="
                            h-[280px]
                            w-full
                            animate-pulse
                            rounded-2xl
                            border
                            border-base-300
                            bg-base-100
                        "
                    />

                ))}

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
            space-y-4
            overflow-x-hidden
            p-4
            sm:p-5
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
                p-3
                shadow-sm
                sm:p-4
            ">

                {/* =================================================
                    AGENT / RM TOGGLE
                ================================================= */}

                <div className="
                    flex
                    w-full
                    justify-center
                ">

                    <ModeToggle
                        mode={mode}
                        onChange={
                            handleModeChange
                        }
                    />

                </div>


                {/* =================================================
                    FILTER GRID
                ================================================= */}

                <div className="
                    mt-3
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-2.5
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                ">

                    {/* FROM */}

                    <DateInput
                        label="From"
                        value={fromDate}
                        onChange={
                            handleFromDateChange
                        }
                    />


                    {/* TO */}

                    <DateInput
                        label="To"
                        value={toDate}
                        onChange={
                            handleToDateChange
                        }
                    />


                    {/* TEAM LEAD */}

                    <div className="
                        min-w-0
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


                    {/* AGENT / RM */}

                    <div className="
                        min-w-0
                    ">

                        {mode === 'agent' ? (

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

                        ) : (

                            <RmDropdown
                                label="Rm"
                                value={rm}
                                onChange={
                                    handleRmChange
                                }
                                teamLeadContextId={
                                    teamLead || null
                                }
                            />

                        )}

                    </div>


                    {/* LOAN TYPE */}

                    <div className="
                        min-w-0
                    ">

                        <LoanTypeDropdown
                            label="Loan Type"
                            value={loanType}
                            onChange={
                                handleLoanTypeChange
                            }
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className="
                        flex
                        min-w-0
                        items-end
                        gap-2
                    ">

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            className="
                                h-10
                                min-w-0
                                flex-1
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-2
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

                        <button
                            type="button"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                refreshing
                            }
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
                                px-2
                                text-xs
                                font-medium
                                text-white
                                transition
                                hover:bg-[#78B300]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <ArrowPathIcon
                                className={
                                    refreshing
                                        ? `
                                            h-4
                                            w-4
                                            shrink-0
                                            animate-spin
                                        `
                                        : `
                                            h-4
                                            w-4
                                            shrink-0
                                        `
                                }
                            />

                            <span>
                                {refreshing
                                    ? 'Loading...'
                                    : 'Refresh'}
                            </span>

                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                NO DATA
            ================================================= */}

            {!overview.length && (

                <section className="
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    px-5
                    py-10
                    text-center
                    shadow-sm
                ">

                    <p className="
                        text-sm
                        font-medium
                        text-base-content/55
                    ">
                        No performance data found
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-base-content/35
                    ">
                        Try changing the selected filters.
                    </p>

                </section>

            )}


            {/* =================================================
                DATA SECTIONS
            ================================================= */}

            {overview.length > 0 && (

                <div className="
                    space-y-4
                ">

                    <PerformanceOverview
                        mode={mode}
                        performance={
                            overview
                        }
                    />

                    <LoanWisePerformance
                        mode={mode}
                        performance={
                            loanWise
                        }
                    />

                    <TopPerformers
                        mode={mode}
                        performance={
                            overview
                        }
                        loanWise={
                            loanWise
                        }
                        topPerformers={
                            topPerformers
                        }
                        topPerformersByLoanType={
                            topPerformersByLoanType
                        }
                        metric={
                            performanceMetric
                        }
                        onMetricChange={
                            setPerformanceMetric
                        }
                    />

                </div>

            )}

        </div>

    )

}


export default Performance