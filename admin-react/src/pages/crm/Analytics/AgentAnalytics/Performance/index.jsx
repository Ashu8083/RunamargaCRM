// admin-react/src/pages/Analytics/AgentAnalytics/Performance/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentDropdown from '../../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import LoanTypeDropdown from '../../../../../components/GlobalModels/Filters/LoanTypeDropdown'

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
// MOCK API
//
// Replace only this function when backend API is ready.
// =============================================================

const fetchAgentPerformance = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 1,
                    date: '2026-08-28',

                    agentId: 101,
                    agentName: 'Rahul Sharma',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 401,
                    loanTypeName: 'Personal Loan',

                    inProcess: 32,
                    login: 24,
                    sanctioned: 12,
                    disbursed: 8,
                    rejected: 4,

                    disbursedAmount: 640000,
                },

                {
                    id: 2,
                    date: '2026-08-28',

                    agentId: 102,
                    agentName: 'Anil Kumar',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    teamId: 502,
                    teamName: 'Mysore Team',

                    loanTypeId: 402,
                    loanTypeName: 'Home Loan',

                    inProcess: 27,
                    login: 19,
                    sanctioned: 10,
                    disbursed: 6,
                    rejected: 3,

                    disbursedAmount: 4200000,
                },

                {
                    id: 3,
                    date: '2026-08-27',

                    agentId: 103,
                    agentName: 'Vikram Singh',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    teamLeadId: 303,
                    teamLeadName: 'Rajesh Rao',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 403,
                    loanTypeName: 'Business Loan',

                    inProcess: 21,
                    login: 17,
                    sanctioned: 9,
                    disbursed: 5,
                    rejected: 2,

                    disbursedAmount: 1250000,
                },

                {
                    id: 4,
                    date: '2026-08-27',

                    agentId: 101,
                    agentName: 'Rahul Sharma',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 402,
                    loanTypeName: 'Home Loan',

                    inProcess: 28,
                    login: 22,
                    sanctioned: 13,
                    disbursed: 9,
                    rejected: 3,

                    disbursedAmount: 5850000,
                },

                {
                    id: 5,
                    date: '2026-08-26',

                    agentId: 104,
                    agentName: 'Arjun Rao',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    teamId: 502,
                    teamName: 'Mysore Team',

                    loanTypeId: 404,
                    loanTypeName: 'Vehicle Loan',

                    inProcess: 19,
                    login: 15,
                    sanctioned: 8,
                    disbursed: 5,
                    rejected: 3,

                    disbursedAmount: 875000,
                },

                {
                    id: 6,
                    date: '2026-08-26',

                    agentId: 105,
                    agentName: 'Kiran Kumar',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    teamLeadId: 303,
                    teamLeadName: 'Rajesh Rao',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 405,
                    loanTypeName: 'Education Loan',

                    inProcess: 15,
                    login: 11,
                    sanctioned: 6,
                    disbursed: 4,
                    rejected: 2,

                    disbursedAmount: 320000,
                },

                {
                    id: 7,
                    date: '2026-08-25',

                    agentId: 106,
                    agentName: 'Niveditha Rao',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 406,
                    loanTypeName: 'Gold Loan',

                    inProcess: 23,
                    login: 18,
                    sanctioned: 10,
                    disbursed: 7,
                    rejected: 2,

                    disbursedAmount: 490000,
                },

                {
                    id: 8,
                    date: '2026-08-25',

                    agentId: 102,
                    agentName: 'Anil Kumar',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    teamId: 502,
                    teamName: 'Mysore Team',

                    loanTypeId: 401,
                    loanTypeName: 'Personal Loan',

                    inProcess: 31,
                    login: 23,
                    sanctioned: 14,
                    disbursed: 10,
                    rejected: 4,

                    disbursedAmount: 800000,
                },

                {
                    id: 9,
                    date: '2026-08-24',

                    agentId: 103,
                    agentName: 'Vikram Singh',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    teamLeadId: 303,
                    teamLeadName: 'Rajesh Rao',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 401,
                    loanTypeName: 'Personal Loan',

                    inProcess: 25,
                    login: 20,
                    sanctioned: 11,
                    disbursed: 8,
                    rejected: 3,

                    disbursedAmount: 620000,
                },

                {
                    id: 10,
                    date: '2026-08-24',

                    agentId: 104,
                    agentName: 'Arjun Rao',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    teamId: 502,
                    teamName: 'Mysore Team',

                    loanTypeId: 403,
                    loanTypeName: 'Business Loan',

                    inProcess: 22,
                    login: 17,
                    sanctioned: 9,
                    disbursed: 6,
                    rejected: 2,

                    disbursedAmount: 1500000,
                },

                {
                    id: 11,
                    date: '2026-08-23',

                    agentId: 105,
                    agentName: 'Kiran Kumar',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    teamLeadId: 303,
                    teamLeadName: 'Rajesh Rao',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 404,
                    loanTypeName: 'Vehicle Loan',

                    inProcess: 17,
                    login: 13,
                    sanctioned: 7,
                    disbursed: 5,
                    rejected: 2,

                    disbursedAmount: 910000,
                },

                {
                    id: 12,
                    date: '2026-08-23',

                    agentId: 106,
                    agentName: 'Niveditha Rao',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    teamId: 501,
                    teamName: 'Bangalore Team',

                    loanTypeId: 402,
                    loanTypeName: 'Home Loan',

                    inProcess: 29,
                    login: 22,
                    sanctioned: 12,
                    disbursed: 8,
                    rejected: 3,

                    disbursedAmount: 5100000,
                },
            ])

        }, 400)

    })

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

            <input
                type="date"
                value={value}
                onChange={(event) =>
                    onChange(
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


    const [refreshing, setRefreshing] =
        useState(false)


    // =========================================================
    // GLOBAL MODE
    // =========================================================

    const [mode, setMode] =
        useState('agent')


    // =========================================================
    // GLOBAL FILTERS
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
    // TOP PERFORMER METRIC
    //
    // This is controlled by index.
    // It is not a filter dropdown.
    // =========================================================

    const [performanceMetric, setPerformanceMetric] =
        useState('disbursed')


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


            const response =
                await fetchAgentPerformance()


            setPerformance(
                Array.isArray(response)
                    ? response
                    : []
            )

        } catch (error) {

            console.error(
                'Failed to load agent performance:',
                error
            )

            setPerformance([])

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
    // MODE CHANGE
    // =========================================================

    const handleModeChange = (
        nextMode
    ) => {

        setMode(nextMode)

        if (nextMode === 'agent') {
            setRm('')
        } else {
            setAgent('')
        }

    }


    // =========================================================
    // FILTER DATA
    // =========================================================

    const filteredPerformance = useMemo(() => {

        return performance.filter((item) => {

            const matchesTeamLead =
                !teamLead ||
                String(
                    item.teamLeadId ?? ''
                ) === String(teamLead)


            const matchesAgent =
                mode !== 'agent' ||
                !agent ||
                String(
                    item.agentId ?? ''
                ) === String(agent)


            const matchesRm =
                mode !== 'rm' ||
                !rm ||
                String(
                    item.rmId ?? ''
                ) === String(rm)


            const matchesLoanType =
                !loanType ||
                String(
                    item.loanTypeId ?? ''
                ) === String(loanType)


            const matchesFromDate =
                !fromDate ||
                String(
                    item.date ?? ''
                ) >= String(fromDate)


            const matchesToDate =
                !toDate ||
                String(
                    item.date ?? ''
                ) <= String(toDate)


            return (
                matchesTeamLead &&
                matchesAgent &&
                matchesRm &&
                matchesLoanType &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        performance,
        mode,
        teamLead,
        agent,
        rm,
        loanType,
        fromDate,
        toDate,
    ])


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setMode('agent')

        setTeamLead('')
        setAgent('')
        setRm('')
        setLoanType('')
        setFromDate('')
        setToDate('')

        setPerformanceMetric('disbursed')

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="
                w-full
                max-w-full
                space-y-5
                overflow-x-hidden
                p-4
                sm:p-6
            ">

                <div className="
                    h-36
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
                            h-[300px]
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
            space-y-5
            overflow-x-hidden
            p-4
            sm:p-6
        ">

            {/* =================================================
                GLOBAL FILTER PANEL
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
                    AGENT / RM TOGGLE
                ================================================= */}

                <div className="
                    flex
                    w-full
                    justify-center
                ">

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
                            onClick={() =>
                                handleModeChange(
                                    'agent'
                                )
                            }
                            className={`
                                min-w-[90px]
                                rounded-md
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                transition
                                ${
                                    mode === 'agent'
                                        ? 'bg-base-100 text-[#78B300] shadow-sm'
                                        : 'text-base-content/50 hover:text-base-content'
                                }
                            `}
                        >
                            Agent
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleModeChange(
                                    'rm'
                                )
                            }
                            className={`
                                min-w-[90px]
                                rounded-md
                                px-4
                                py-2
                                text-xs
                                font-semibold
                                transition
                                ${
                                    mode === 'rm'
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
                    mt-4
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-7
                ">

                    {/* FROM */}

                    <DateInput
                        label="From"
                        value={fromDate}
                        onChange={setFromDate}
                    />


                    {/* TO */}

                    <DateInput
                        label="To"
                        value={toDate}
                        onChange={setToDate}
                    />


                    {/* TEAM LEAD */}

                    <div className="min-w-0">

                        <TeamLeadDropdown
                            label="Team Lead"
                            value={teamLead}
                            onChange={setTeamLead}
                            allLabel="All Team Leads"
                            placeholder="All Team Leads"
                            searchPlaceholder="Search team lead"
                            emptyMessage="No team leads found"
                        />

                    </div>


                    {/* AGENT / RM */}

                    <div className="min-w-0">

                        {mode === 'agent' ? (

                            <AgentDropdown
                                value={agent}
                                onChange={setAgent}
                            />

                        ) : (

                            <RmDropdown
                                value={rm}
                                onChange={setRm}
                            />

                        )}

                    </div>


                    {/* LOAN TYPE */}

                    <div className="min-w-0">

                        <LoanTypeDropdown
                            value={loanType}
                            onChange={setLoanType}
                        />

                    </div>


                    {/* RESET */}

                    <div className="
                        flex
                        min-w-0
                        items-end
                    ">

                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                h-10
                                w-full
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
                            "
                        >
                            Reset
                        </button>

                    </div>


                    {/* REFRESH */}

                    <div className="
                        flex
                        min-w-0
                        items-end
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                loadData(true)
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
                                bg-[#8BCF00]
                                px-3
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
                                className={`
                                    h-4
                                    w-4
                                    shrink-0
                                    ${
                                        refreshing
                                            ? 'animate-spin'
                                            : ''
                                    }
                                `}
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

            {!filteredPerformance.length && (

                <section className="
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    px-5
                    py-12
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

            {filteredPerformance.length > 0 && (

                <>

                    <PerformanceOverview
                        mode={mode}
                        performance={
                            filteredPerformance
                        }
                    />


                    <LoanWisePerformance
                        mode={mode}
                        performance={
                            filteredPerformance
                        }
                    />


                    <TopPerformers
                        mode={mode}
                        performance={
                            filteredPerformance
                        }
                        metric={
                            performanceMetric
                        }
                        onMetricChange={
                            setPerformanceMetric
                        }
                    />

                </>

            )}

        </div>

    )

}


export default Performance