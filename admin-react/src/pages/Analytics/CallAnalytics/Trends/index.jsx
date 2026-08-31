// admin-react/src/pages/Analytics/CallAnalytics/Trends/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import TeamLeadDropdown from '../../../../components/GlobalModels/Filters/TeamLeadDropdown'
import ActiveAdNumberDropdown from '../../../../components/GlobalModels/Filters/ActiveAdNumberDropdown'

import AdNumberCallTrend from './components/AdNumberCallTrend'
import RmCallTrend from './components/RmCallTrend'
import TeamCallTrend from './components/TeamCallTrend'
import DailyCallTrend from './components/DailyCallTrend'
import MonthlyCallTrend from './components/MonthlyCallTrend'


// =============================================================
// MOCK API
// Replace only this function when backend API is ready.
// =============================================================

const fetchCallTrends = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 1,
                    date: '2026-08-28',
                    type: 'incoming',
                    status: 'received',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1001',

                    uniqueMissed: false,
                    applicationCreated: true,
                },

                {
                    id: 2,
                    date: '2026-08-28',
                    type: 'outgoing',
                    status: 'received',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1001',

                    uniqueMissed: false,
                    applicationCreated: false,
                },

                {
                    id: 3,
                    date: '2026-08-28',
                    type: 'missed',
                    status: 'missed',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    reportingToId: 302,
                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    adNumber: 'AD-1002',

                    uniqueMissed: true,
                    applicationCreated: false,
                },

                {
                    id: 4,
                    date: '2026-08-27',
                    type: 'incoming',
                    status: 'received',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    reportingToId: 302,
                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    adNumber: 'AD-1002',

                    uniqueMissed: false,
                    applicationCreated: true,
                },

                {
                    id: 5,
                    date: '2026-08-27',
                    type: 'outgoing',
                    status: 'received',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1003',

                    uniqueMissed: false,
                    applicationCreated: false,
                },

                {
                    id: 6,
                    date: '2026-08-27',
                    type: 'missed',
                    status: 'missed',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1003',

                    uniqueMissed: true,
                    applicationCreated: false,
                },

                {
                    id: 7,
                    date: '2026-08-26',
                    type: 'incoming',
                    status: 'received',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1001',

                    uniqueMissed: false,
                    applicationCreated: true,
                },

                {
                    id: 8,
                    date: '2026-08-26',
                    type: 'missed',
                    status: 'missed',

                    rmId: 202,
                    rmName: 'Rajesh Rao',

                    reportingToId: 302,
                    teamLeadId: 302,
                    teamLeadName: 'Priya Nair',

                    adNumber: 'AD-1002',

                    uniqueMissed: true,
                    applicationCreated: false,
                },

                {
                    id: 9,
                    date: '2026-08-25',
                    type: 'incoming',
                    status: 'received',

                    rmId: 201,
                    rmName: 'Priya Nair',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1004',

                    uniqueMissed: false,
                    applicationCreated: true,
                },

                {
                    id: 10,
                    date: '2026-08-25',
                    type: 'missed',
                    status: 'missed',

                    rmId: 203,
                    rmName: 'Sneha Reddy',

                    reportingToId: 301,
                    teamLeadId: 301,
                    teamLeadName: 'Suresh Kumar',

                    adNumber: 'AD-1004',

                    uniqueMissed: true,
                    applicationCreated: false,
                },
            ])

        }, 400)

    })

}


// =============================================================
// PAGE
// =============================================================

function Trends() {

    const [calls, setCalls] =
        useState([])

    const [loading, setLoading] =
        useState(true)


    // =========================================================
    // GLOBAL FILTERS
    // =========================================================

    const [teamLead, setTeamLead] =
        useState('')

    const [rm, setRm] =
        useState('')

    const [adNumber, setAdNumber] =
        useState('')


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = async () => {

        try {

            setLoading(true)

            const response =
                await fetchCallTrends()

            setCalls(
                Array.isArray(response)
                    ? response
                    : []
            )

        } catch (error) {

            console.error(
                'Failed to load call trends:',
                error
            )

            setCalls([])

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

        return calls.filter((call) => {

            const matchesTeamLead =
                !teamLead ||
                String(
                    call.reportingToId ??
                    call.teamLeadId
                ) === String(teamLead)


            const matchesRm =
                !rm ||
                String(call.rmId) ===
                    String(rm)


            const matchesAdNumber =
                !adNumber ||
                String(
                    call.adNumber ||
                    ''
                ) === String(adNumber)


            return (
                matchesTeamLead &&
                matchesRm &&
                matchesAdNumber
            )

        })

    }, [
        calls,
        teamLead,
        rm,
        adNumber,
    ])


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setTeamLead('')
        setRm('')
        setAdNumber('')

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

                <div className="
                    h-24
                    w-full
                    animate-pulse
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                " />

                {Array.from({
                    length: 5,
                }).map((_, index) => (

                    <div
                        key={index}
                        className="
                            h-[300px]
                            w-full
                            animate-pulse
                            rounded-xl
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
                GLOBAL FILTERS
            ================================================= */}

            <div className="
                w-full
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
                    xl:grid-cols-5
                ">

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


                    {/* RM */}

                    <div className="min-w-0">

                        <RmDropdown
                            value={rm}
                            onChange={setRm}
                        />

                    </div>


                    {/* AD NUMBER */}

                    <div className="min-w-0">

                        <ActiveAdNumberDropdown
                            value={adNumber}
                            onChange={setAdNumber}
                        />

                    </div>


                    {/* RESET */}

                    <div className="
                        min-w-0
                        flex
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
                                px-4
                                text-xs
                                font-medium
                                text-base-content/65
                                transition
                                hover:bg-base-200
                            "
                        >
                            Reset
                        </button>

                    </div>


                    {/* REFRESH */}

                    <div className="
                        min-w-0
                        flex
                        items-end
                    ">

                        <button
                            type="button"
                            onClick={loadData}
                            className="
                                inline-flex
                                h-10
                                w-full
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                bg-[#8BCF00]
                                px-4
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
                                shrink-0
                            " />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                1. AD NUMBER — MOST IMPORTANT
            ================================================= */}

            <AdNumberCallTrend
                calls={filteredCalls}
            />


            {/* =================================================
                2. RM
            ================================================= */}

            <RmCallTrend
                calls={filteredCalls}
            />


            {/* =================================================
                3. TEAM LEAD
            ================================================= */}

            <TeamCallTrend
                calls={filteredCalls}
            />


            {/* =================================================
                4. DAILY
            ================================================= */}

            <DailyCallTrend
                calls={filteredCalls}
            />


            {/* =================================================
                5. MONTHLY
            ================================================= */}

            <MonthlyCallTrend
                calls={filteredCalls}
            />

        </div>

    )

}


export default Trends