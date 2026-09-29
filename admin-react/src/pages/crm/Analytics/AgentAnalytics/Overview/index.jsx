// admin-react/src/pages/Analytics/AgentAnalytics/Overview/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import AgentDropdown from '../../../../../components/GlobalModels/Filters/AgentDropdown'

import RmDropdown from '../../../../../components/GlobalModels/Filters/RmDropdown'

import TeamLeadDropdown from '../../../../../components/GlobalModels/Filters/TeamLeadDropdown'

import LoanTypeDropdown from '../../../../../components/GlobalModels/Filters/LoanTypeDropdown'

import PipelineStages from './components/PipelineStages'

import PipelineInsights from './components/PipelineInsights'

import OverallSuccessRate from './components/OverallSuccessRate'


// =============================================================
// MOCK API
//
// Replace only this function when backend API is ready.
// The filters below work against the same API response.
// =============================================================

const fetchAgentAnalytics = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 1,

                    date: '2026-08-28',

                    agentId: 101,

                    rmId: 201,

                    teamLeadId: 301,

                    loanTypeId: 401,

                    leadReceived: 42,

                    loggedIn: 31,

                    rejected: 5,

                    sanctioned: 18,

                    disbursed: 12,
                },


                {
                    id: 2,

                    date: '2026-08-27',

                    agentId: 102,

                    rmId: 202,

                    teamLeadId: 302,

                    loanTypeId: 402,

                    leadReceived: 36,

                    loggedIn: 27,

                    rejected: 4,

                    sanctioned: 15,

                    disbursed: 10,
                },


                {
                    id: 3,

                    date: '2026-08-26',

                    agentId: 103,

                    rmId: 201,

                    teamLeadId: 301,

                    loanTypeId: 403,

                    leadReceived: 51,

                    loggedIn: 39,

                    rejected: 7,

                    sanctioned: 24,

                    disbursed: 17,
                },


                {
                    id: 4,

                    date: '2026-08-25',

                    agentId: 101,

                    rmId: 201,

                    teamLeadId: 301,

                    loanTypeId: 401,

                    leadReceived: 47,

                    loggedIn: 35,

                    rejected: 6,

                    sanctioned: 21,

                    disbursed: 15,
                },


                {
                    id: 5,

                    date: '2026-08-24',

                    agentId: 104,

                    rmId: 202,

                    teamLeadId: 302,

                    loanTypeId: 404,

                    leadReceived: 29,

                    loggedIn: 21,

                    rejected: 3,

                    sanctioned: 12,

                    disbursed: 8,
                },


                {
                    id: 6,

                    date: '2026-08-23',

                    agentId: 105,

                    rmId: 201,

                    teamLeadId: 301,

                    loanTypeId: 405,

                    leadReceived: 33,

                    loggedIn: 24,

                    rejected: 5,

                    sanctioned: 14,

                    disbursed: 9,
                },


                {
                    id: 7,

                    date: '2026-08-22',

                    agentId: 106,

                    rmId: 202,

                    teamLeadId: 302,

                    loanTypeId: 406,

                    leadReceived: 38,

                    loggedIn: 29,

                    rejected: 4,

                    sanctioned: 17,

                    disbursed: 11,
                },
            ])

        }, 400)

    })

}


// =============================================================
// PAGE
// =============================================================

function Overview() {

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
                await fetchAgentAnalytics()


            setAnalytics(
                Array.isArray(response)
                    ? response
                    : []
            )


        } catch (error) {

            console.error(
                'Failed to load agent analytics:',
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
    // FILTER DATA
    // =========================================================

    const filteredAnalytics = useMemo(() => {

        return analytics.filter((item) => {

            // -------------------------------------------------
            // TEAM LEAD
            // -------------------------------------------------

            const matchesTeamLead =
                !teamLead ||

                String(
                    item.teamLeadId
                ) === String(teamLead)


            // -------------------------------------------------
            // AGENT
            // -------------------------------------------------

            const matchesAgent =
                !agent ||

                String(
                    item.agentId
                ) === String(agent)


            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            const matchesRm =
                !rm ||

                String(
                    item.rmId
                ) === String(rm)


            // -------------------------------------------------
            // LOAN TYPE
            // -------------------------------------------------

            const matchesLoanType =
                !loanType ||

                String(
                    item.loanTypeId
                ) === String(loanType)


            // -------------------------------------------------
            // FROM DATE
            // -------------------------------------------------

            const matchesFromDate =
                !fromDate ||

                String(
                    item.date || ''
                ) >= String(fromDate)


            // -------------------------------------------------
            // TO DATE
            // -------------------------------------------------

            const matchesToDate =
                !toDate ||

                String(
                    item.date || ''
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
        analytics,

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

    const handleTeamLeadChange = (selectedTeamLead) => {
        console.log('TEAM LEAD VALUE:', selectedTeamLead)

        setTeamLead(selectedTeamLead)
        setRm('')
        setAgent('')
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

                {/* FILTER SKELETON */}

                <div className="
                    h-40
                    w-full
                    animate-pulse
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                " />


                {/* TOP CONTENT SKELETON */}

                <div className="
                    grid
                    w-full
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                ">

                    {Array.from({
                        length: 2,
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


                {/* PIPELINE SKELETON */}

                <div className="
                    h-[280px]
                    w-full
                    animate-pulse
                    rounded-2xl
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

            <section className="
                w-full
                min-w-0
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
                    min-w-0
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                ">

                    {/* =================================================
                        ROW 1 — TEAM LEAD
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
                        ROW 1 — AGENT
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <AgentDropdown

                            label='Agent'

                            value={agent}

                            onChange={setAgent}

                            teamLeadContextId={teamLead}

                        />

                    </div>


                    {/* =================================================
                        ROW 1 — RM
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <RmDropdown

                            label='RM'

                            value={rm}

                            onChange={setRm}

                            teamLeadContextId={teamLead}

                        />

                    </div>


                    {/* =================================================
                        ROW 1 — LOAN TYPE
                    ================================================= */}

                    <div className="
                        min-w-0
                        w-full
                    ">

                        <LoanTypeDropdown

                            label='Loan Type'

                            value={loanType}

                            onChange={setLoanType}

                        />

                    </div>


                    {/* =================================================
                        ROW 2 — FROM DATE
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


                    {/* =================================================
                        ROW 2 — TO DATE
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


                    {/* =================================================
                        ROW 2 — ACTIONS
                    ================================================= */}

                    <div className="
                        col-span-1
                        flex
                        min-w-0
                        w-full
                        items-end
                        gap-2
                        sm:col-span-2
                        lg:col-span-2
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
                                text-base-content/60
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

                            onClick={() =>
                                loadData(true)
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

                            <ArrowPathIcon

                                className={`
                                    h-4
                                    w-4
                                    shrink-0
                                    ${refreshing
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
                EMPTY STATE
            ================================================= */}

            {!filteredAnalytics.length && (

                <section className="
                    w-full
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

                        No analytics data found

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
                ANALYTICS CONTENT
            ================================================= */}

            {filteredAnalytics.length > 0 && (

                <>

                    {/* =================================================
                        TOP ANALYTICS
                    ================================================= */}

                    <div className="
                        grid
                        w-full
                        min-w-0
                        grid-cols-1
                        gap-5
                        xl:grid-cols-2
                    ">

                        {/* PIPELINE INSIGHTS */}

                        <PipelineInsights

                            analytics={filteredAnalytics}

                        />


                        {/* SUCCESS RATE */}

                        <OverallSuccessRate

                            analytics={filteredAnalytics}

                        />

                    </div>


                    {/* =================================================
                        PIPELINE STAGES
                    ================================================= */}

                    <PipelineStages

                        analytics={filteredAnalytics}

                    />

                </>

            )}

        </div>

    )

}


export default Overview