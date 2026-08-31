// admin-react/src/pages/Analytics/AgentAnalytics/Trends/index.jsx

import {
    useEffect,
    useMemo,
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


// =============================================================
// MOCK API
//
// Replace only this function when backend API is ready.
// The components do not contain API calls.
// =============================================================

const fetchAnalyticsTrends = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 1,
                    date: '2026-08-01',

                    mode: 'agent',

                    agentId: 101,
                    agentName: 'Rahul Sharma',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 401,
                    loanTypeName: 'Personal Loan',

                    inProcess: 32,
                    applicationCreated: 18,
                    loggedIn: 14,
                    sanctioned: 8,
                    disbursed: 5,
                    rejected: 3,
                },

                {
                    id: 2,
                    date: '2026-08-02',

                    mode: 'agent',

                    agentId: 102,
                    agentName: 'Anil Kumar',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    loanTypeId: 402,
                    loanTypeName: 'Home Loan',

                    inProcess: 26,
                    applicationCreated: 15,
                    loggedIn: 11,
                    sanctioned: 7,
                    disbursed: 4,
                    rejected: 2,
                },

                {
                    id: 3,
                    date: '2026-08-03',

                    mode: 'agent',

                    agentId: 103,
                    agentName: 'Vikram Singh',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 403,
                    loanTypeName: 'Business Loan',

                    inProcess: 29,
                    applicationCreated: 17,
                    loggedIn: 13,
                    sanctioned: 9,
                    disbursed: 6,
                    rejected: 2,
                },

                {
                    id: 4,
                    date: '2026-08-04',

                    mode: 'agent',

                    agentId: 104,
                    agentName: 'Arjun Rao',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    loanTypeId: 404,
                    loanTypeName: 'Vehicle Loan',

                    inProcess: 21,
                    applicationCreated: 13,
                    loggedIn: 10,
                    sanctioned: 6,
                    disbursed: 4,
                    rejected: 2,
                },

                {
                    id: 5,
                    date: '2026-08-05',

                    mode: 'agent',

                    agentId: 105,
                    agentName: 'Kiran Kumar',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 405,
                    loanTypeName: 'Education Loan',

                    inProcess: 17,
                    applicationCreated: 11,
                    loggedIn: 8,
                    sanctioned: 5,
                    disbursed: 3,
                    rejected: 1,
                },

                {
                    id: 6,
                    date: '2026-08-06',

                    mode: 'agent',

                    agentId: 106,
                    agentName: 'Niveditha Rao',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 406,
                    loanTypeName: 'Gold Loan',

                    inProcess: 23,
                    applicationCreated: 14,
                    loggedIn: 10,
                    sanctioned: 7,
                    disbursed: 5,
                    rejected: 1,
                },

                {
                    id: 7,
                    date: '2026-08-07',

                    mode: 'rm',

                    agentId: 101,
                    agentName: 'Rahul Sharma',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 401,
                    loanTypeName: 'Personal Loan',

                    inProcess: 38,
                    applicationCreated: 22,
                    loggedIn: 17,
                    sanctioned: 10,
                    disbursed: 7,
                    rejected: 3,
                },

                {
                    id: 8,
                    date: '2026-08-08',

                    mode: 'rm',

                    agentId: 102,
                    agentName: 'Anil Kumar',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    loanTypeId: 402,
                    loanTypeName: 'Home Loan',

                    inProcess: 31,
                    applicationCreated: 19,
                    loggedIn: 14,
                    sanctioned: 8,
                    disbursed: 5,
                    rejected: 3,
                },

                {
                    id: 9,
                    date: '2026-08-09',

                    mode: 'rm',

                    agentId: 103,
                    agentName: 'Vikram Singh',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 403,
                    loanTypeName: 'Business Loan',

                    inProcess: 34,
                    applicationCreated: 21,
                    loggedIn: 16,
                    sanctioned: 9,
                    disbursed: 6,
                    rejected: 3,
                },

                {
                    id: 10,
                    date: '2026-08-10',

                    mode: 'rm',

                    agentId: 104,
                    agentName: 'Arjun Rao',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    loanTypeId: 404,
                    loanTypeName: 'Vehicle Loan',

                    inProcess: 25,
                    applicationCreated: 16,
                    loggedIn: 12,
                    sanctioned: 7,
                    disbursed: 4,
                    rejected: 2,
                },

                {
                    id: 11,
                    date: '2026-08-11',

                    mode: 'rm',

                    agentId: 105,
                    agentName: 'Kiran Kumar',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 405,
                    loanTypeName: 'Education Loan',

                    inProcess: 20,
                    applicationCreated: 13,
                    loggedIn: 9,
                    sanctioned: 6,
                    disbursed: 4,
                    rejected: 2,
                },

                {
                    id: 12,
                    date: '2026-08-12',

                    mode: 'rm',

                    agentId: 106,
                    agentName: 'Niveditha Rao',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    loanTypeId: 406,
                    loanTypeName: 'Gold Loan',

                    inProcess: 28,
                    applicationCreated: 18,
                    loggedIn: 13,
                    sanctioned: 8,
                    disbursed: 5,
                    rejected: 2,
                },
            ])

        }, 400)

    })

}


// =============================================================
// LOADING SKELETON
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

            {/* FILTER */}

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


            {/* CHARTS */}

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


            <div className="
                h-[400px]
                animate-pulse
                rounded-2xl
                border
                border-base-300
                bg-base-100
            " />


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
// PAGE
// =============================================================

function Trends() {

    // =========================================================
    // DATA
    // =========================================================

    const [analytics, setAnalytics] =
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
    // LOAD DATA
    // =========================================================

    const loadData = async (
        showLoader = true
    ) => {

        try {

            if (showLoader) {
                setLoading(true)
            } else {
                setRefreshing(true)
            }


            const response =
                await fetchAnalyticsTrends()


            setAnalytics(
                Array.isArray(response)
                    ? response
                    : []
            )

        } catch (error) {

            console.error(
                'Failed to load analytics trends:',
                error
            )

            setAnalytics([])

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

        setAgent('')
        setRm('')

    }


    // =========================================================
    // FILTER DATA
    // =========================================================

    const filteredAnalytics = useMemo(() => {

        return analytics.filter((item) => {

            // -------------------------------------------------
            // MODE
            //
            // The backend may eventually return separate
            // datasets for Agent / RM.
            //
            // If mode is not supplied by backend, the record
            // remains available.
            // -------------------------------------------------

            const matchesMode =
                !item.mode ||
                item.mode === mode


            // -------------------------------------------------
            // TEAM LEAD
            // -------------------------------------------------

            const matchesTeamLead =
                !teamLead ||
                String(
                    item.teamLeadId ??
                    item.reportingToId
                ) === String(teamLead)


            // -------------------------------------------------
            // AGENT
            // -------------------------------------------------

            const matchesAgent =
                mode !== 'agent' ||
                !agent ||
                String(item.agentId) ===
                    String(agent)


            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            const matchesRm =
                mode !== 'rm' ||
                !rm ||
                String(item.rmId) ===
                    String(rm)


            // -------------------------------------------------
            // LOAN TYPE
            // -------------------------------------------------

            const matchesLoanType =
                !loanType ||
                String(
                    item.loanTypeId ??
                    item.loanType
                ) === String(loanType)


            // -------------------------------------------------
            // FROM DATE
            // -------------------------------------------------

            const matchesFromDate =
                !fromDate ||
                !item.date ||
                item.date >= fromDate


            // -------------------------------------------------
            // TO DATE
            // -------------------------------------------------

            const matchesToDate =
                !toDate ||
                !item.date ||
                item.date <= toDate


            return (
                matchesMode &&
                matchesTeamLead &&
                matchesAgent &&
                matchesRm &&
                matchesLoanType &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        analytics,
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

        setTeamLead('')
        setAgent('')
        setRm('')
        setLoanType('')
        setFromDate('')
        setToDate('')

    }


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
                    AGENT / RM TOGGLE
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

                        <button
                            type="button"
                            onClick={() =>
                                handleModeChange(
                                    'agent'
                                )
                            }
                            className={`
                                h-9
                                flex-1
                                rounded-lg
                                px-4
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
                                h-9
                                flex-1
                                rounded-lg
                                px-4
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
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                ">

                    {/* FROM */}

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
                            onChange={(event) =>
                                setFromDate(
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
                            onChange={(event) =>
                                setToDate(
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


                    {/* TEAM LEAD */}

                    <div className="
                        min-w-0
                        w-full
                    ">

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


                    {/* AGENT */}

                    {mode === 'agent' && (

                        <div className="
                            min-w-0
                            w-full
                        ">

                            <AgentDropdown
                                value={agent}
                                onChange={setAgent}
                            />

                        </div>

                    )}


                    {/* RM */}

                    {mode === 'rm' && (

                        <div className="
                            min-w-0
                            w-full
                        ">

                            <RmDropdown
                                value={rm}
                                onChange={setRm}
                            />

                        </div>

                    )}


                    {/* LOAN TYPE */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <LoanTypeDropdown
                            value={loanType}
                            onChange={setLoanType}
                        />

                    </div>


                    {/* ACTIONS */}

                    <div className="
                        flex
                        min-w-0
                        w-full
                        items-end
                        gap-2
                    ">

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
                            onClick={() =>
                                loadData(false)
                            }
                            disabled={refreshing}
                            className="
                                inline-flex
                                h-10
                                min-w-0
                                flex-1
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

                            <ArrowPathIcon className="
                                h-4
                                w-4
                                shrink-0
                            " />

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

            {!filteredAnalytics.length && (

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
                APPLICATION TREND + STAGE DISTRIBUTION
            ================================================= */}

            {filteredAnalytics.length > 0 && (

                <div className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-5
                    xl:grid-cols-3
                ">

                    {/* APPLICATION TREND */}

                    <div className="
                        min-w-0
                        xl:col-span-2
                    ">

                        <ApplicationTrend
                            analytics={
                                filteredAnalytics
                            }
                        />

                    </div>


                    {/* STAGE DISTRIBUTION */}

                    <div className="
                        min-w-0
                    ">

                        <LoanStageDistribution
                            analytics={
                                filteredAnalytics
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                LOAN TYPE TREND
            ================================================= */}

            {filteredAnalytics.length > 0 && (

                <LoanTypeTrend
                    analytics={
                        filteredAnalytics
                    }
                />

            )}


            {/* =================================================
                SANCTION + REJECTION
            ================================================= */}

            {filteredAnalytics.length > 0 && (

                <div className="
                    grid
                    w-full
                    min-w-0
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                ">

                    <div className="
                        min-w-0
                    ">

                        <SanctionDisbursementTrend
                            analytics={
                                filteredAnalytics
                            }
                        />

                    </div>


                    <div className="
                        min-w-0
                    ">

                        <RejectionTrend
                            analytics={
                                filteredAnalytics
                            }
                        />

                    </div>

                </div>

            )}

        </div>

    )

}


export default Trends