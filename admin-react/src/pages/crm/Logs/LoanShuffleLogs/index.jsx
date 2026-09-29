
// admin-react/src/pages/Logs/LoanShuffleLogs/index.jsx

import { useEffect, useState, useRef } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import LoanShuffleLogTable from './components/LoanShuffleLogTable'
import { getLoanShuffleLogs } from './Api'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'

import {
    useCommonData,
} from '../../../../context/CommonDataContext'


function LoanShuffleLogs() {

    // =========================================================
    // COMMON DATA
    // =========================================================
    //
    // These values come from the backend through
    // CommonDataContext.
    //
    // NO MOCK DATA.
    //
    // agents/rms/teamLeads contain EmployeeContext IDs.
    //
    // =========================================================

    const {
        agents,
        rms,
        teamLeads,
        loading: commonLoading,
        refetch,
    } = useCommonData()


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const [shuffledById, setShuffledById] =
        useState('')

    const [fromAgentId, setFromAgentId] =
        useState('')

    const [toAgentId, setToAgentId] =
        useState('')

    const [fromRmId, setFromRmId] =
        useState('')

    const [toRmId, setToRmId] =
        useState('')

    const [fromDate, setFromDate] =
        useState('')

    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // SERVER-SIDE PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)

    const pageSize = 10


    // =========================================================
    // LOG DATA
    // =========================================================

    const [logs, setLogs] =
        useState([])

    const [totalLogs, setTotalLogs] =
        useState(0)

    const [totalPages, setTotalPages] =
        useState(0)


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(false)


    // =========================================================
    // ERROR
    // =========================================================

    const [error, setError] =
        useState('')


    // Fetch — depends only on debouncedSearch (not raw search)
    useEffect(() => {
        let cancelled = false

        const fetchLogs = async () => {
            try {
                setLoading(true)
                setError('')

               

                const response = await getLoanShuffleLogs({
                    search: debouncedSearch,
                    shuffledById,
                    fromAgentId,
                    toAgentId,
                    fromRmId,
                    toRmId,
                    fromDate,
                    toDate,
                    page: currentPage,
                    pageSize,
                })

                if (cancelled) return

                const items = Array.isArray(response?.items)
                    ? response.items
                    : []

                setLogs(items)
                setTotalLogs(Number(response?.total || 0))
                setTotalPages(Number(response?.totalPages || 0))

            } catch (err) {
                if (cancelled) return

                console.error(
                    'Failed to fetch loan shuffle logs:',
                    err
                )

                setLogs([])
                setTotalLogs(0)
                setTotalPages(0)

                setError(
                    err?.response?.data?.detail ||
                    'Failed to load loan shuffle logs.'
                )
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchLogs()

        return () => {
            cancelled = true
        }

    }, [
        debouncedSearch,
        shuffledById,
        fromAgentId,
        toAgentId,
        fromRmId,
        toRmId,
        fromDate,
        toDate,
        currentPage,
    ])

    // =========================================================
    // SAFE CURRENT PAGE
    // =========================================================

    const safeCurrentPage =
        totalPages > 0
            ? Math.min(
                currentPage,
                totalPages
            )
            : 1


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setShuffledById('')

        setFromAgentId('')

        setToAgentId('')

        setFromRmId('')

        setToRmId('')

        setFromDate('')

        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH
    // =========================================================

    const searchTimerRef = useRef(null)

    const handleSearchChange = (value) => {

        setSearch(value)

        if (currentPage !== 1) {
            setCurrentPage(1)
        }

        clearTimeout(searchTimerRef.current)

        searchTimerRef.current = setTimeout(() => {
           
            setDebouncedSearch(value)
        }, 1000)
    }

    useEffect(() => {
        return () => {
            clearTimeout(searchTimerRef.current)
        }
    }, [])

    useEffect(() => {
        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current)
            }
        }
    }, [])
    
    // =========================================================
    // SHUFFLED BY
    // =========================================================

    const handleShuffledByChange = (
        value
    ) => {

        setShuffledById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // FROM AGENT
    // =========================================================

    const handleFromAgentChange = (
        value
    ) => {

        setFromAgentId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // TO AGENT
    // =========================================================

    const handleToAgentChange = (
        value
    ) => {

        setToAgentId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // FROM RM
    // =========================================================

    const handleFromRmChange = (
        value
    ) => {

        setFromRmId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // TO RM
    // =========================================================

    const handleToRmChange = (
        value
    ) => {

        setToRmId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // FROM DATE
    // =========================================================

    const handleFromDateChange = (
        event
    ) => {

        setFromDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // TO DATE
    // =========================================================

    const handleToDateChange = (
        event
    ) => {

        setToDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        try {

            setLoading(true)

            setError('')


            // -------------------------------------------------
            // Refresh common dropdown data
            // -------------------------------------------------

            if (refetch) {

                refetch('agents')

                refetch('rms')

                refetch('teamLeads')

            }


            // -------------------------------------------------
            // Refresh logs
            // -------------------------------------------------

            const response =
                await getLoanShuffleLogs({

                    debouncedSearch,

                    shuffledById,

                    fromAgentId,

                    toAgentId,

                    fromRmId,

                    toRmId,

                    fromDate,

                    toDate,

                    page: safeCurrentPage,

                    pageSize,

                })


            const items =
                Array.isArray(
                    response?.items
                )
                    ? response.items
                    : []


            setLogs(items)

            setTotalLogs(
                Number(
                    response?.total || 0
                )
            )

            setTotalPages(
                Number(
                    response?.totalPages || 0
                )
            )


        } catch (err) {

            console.error(
                'Failed to refresh loan shuffle logs:',
                err
            )


            setError(
                err?.response?.data?.detail ||
                'Failed to refresh loan shuffle logs.'
            )


        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            (
                totalPages > 0 &&
                page > totalPages
            )
        ) {
            return
        }


        setCurrentPage(page)

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
                PAGE HEADER
            ================================================= */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                ">
                    Loan Shuffle Logs
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    View loan assignment shuffle history between agents and RMs.
                </p>

            </div>


            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    card-body
                    p-4
                ">


                    {/* =================================================
                        ROW 1
                    ================================================= */}

                    <div className="
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-12
                    ">


                        {/* =============================================
                            SEARCH
                        ============================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <label className="
                                input
                                input-bordered
                                flex
                                w-full
                                items-center
                                gap-3
                            ">

                                <SearchIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/40
                                " />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        handleSearchChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search loan ID..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =============================================
                            SHUFFLED BY
                        ============================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <EmployeeDropdown
                                label=""
                                value={shuffledById}
                                onChange={
                                    handleShuffledByChange
                                }
                                options={[]}
                                allLabel="All Employees"
                                placeholder={
                                    commonLoading?.employees
                                        ? "Loading Employees..."
                                        : "Shuffled By"
                                }
                            />

                        </div>


                        {/* =============================================
                            FROM AGENT
                        ============================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <AgentDropdown
                                label=""
                                value={fromAgentId}
                                onChange={
                                    handleFromAgentChange
                                }
                                options={agents}
                                allLabel="All Agents"
                                placeholder={
                                    commonLoading?.agents
                                        ? "Loading Agents..."
                                        : "From Agent"
                                }
                            />

                        </div>


                        {/* =============================================
                            TO AGENT
                        ============================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

                            <AgentDropdown
                                label=""
                                value={toAgentId}
                                onChange={
                                    handleToAgentChange
                                }
                                options={agents}
                                allLabel="All Agents"
                                placeholder={
                                    commonLoading?.agents
                                        ? "Loading Agents..."
                                        : "To Agent"
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        ROW 2
                    ================================================= */}

                    <div className="
                        mt-3
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-12
                    ">


                        {/* =============================================
                            FROM RM
                        ============================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={fromRmId}
                                onChange={
                                    handleFromRmChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder={
                                    commonLoading?.rms
                                        ? "Loading RMs..."
                                        : "From RM"
                                }
                            />

                        </div>


                        {/* =============================================
                            TO RM
                        ============================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={toRmId}
                                onChange={
                                    handleToRmChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder={
                                    commonLoading?.rms
                                        ? "Loading RMs..."
                                        : "To RM"
                                }
                            />

                        </div>


                        {/* =============================================
                            FROM DATE
                        ============================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <input
                                type="date"
                                value={fromDate}
                                onChange={
                                    handleFromDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                title="From date"
                            />

                        </div>


                        {/* =============================================
                            TO DATE
                        ============================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <input
                                type="date"
                                value={toDate}
                                onChange={
                                    handleToDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                title="To date"
                            />

                        </div>


                        {/* =============================================
                            RESET + REFRESH
                        ============================================= */}

                        <div className="
                            flex
                            min-w-0
                            items-center
                            lg:col-span-3
                            xl:col-span-2
                        ">

                            <div className="
                                flex
                                w-full
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                            ">


                                {/* RESET */}

                                <button
                                    type="button"
                                    onClick={
                                        handleReset
                                    }
                                    className="
                                        btn
                                        btn-ghost
                                        flex-1
                                        rounded-none
                                        border-0
                                        sm:flex-none
                                    "
                                >
                                    Reset
                                </button>


                                <div className="
                                    h-6
                                    w-px
                                    shrink-0
                                    bg-base-300
                                " />


                                {/* REFRESH */}

                                <button
                                    type="button"
                                    onClick={
                                        handleRefresh
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                        btn
                                        btn-ghost
                                        flex-1
                                        rounded-none
                                        border-0
                                        sm:flex-none
                                    "
                                    title="Refresh logs"
                                >

                                    <ArrowPathIcon
                                        className={`
                                            h-4
                                            w-4
                                            ${loading
                                                ? "animate-spin"
                                                : ""
                                            }
                                        `}
                                    />

                                    <span>
                                        Refresh
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


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
                    text-sm
                    text-error
                ">

                    {error}

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-4
                    py-6
                    text-sm
                    text-base-content/60
                ">

                    <span className="
                        loading
                        loading-spinner
                        loading-sm
                        mr-2
                    " />

                    Loading loan shuffle logs...

                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            <LoanShuffleLogTable
                logs={logs}
            />


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalLogs > 0 && (

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-4
                    py-3
                    sm:flex-row
                ">


                    {/* =============================================
                        RESULT INFO
                    ============================================= */}

                    <p className="
                        text-xs
                        text-base-content/60
                    ">

                        Showing{" "}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {
                                (safeCurrentPage - 1) *
                                pageSize +
                                1
                            }
                        </span>

                        {" "}to{" "}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {
                                Math.min(
                                    safeCurrentPage *
                                    pageSize,
                                    totalLogs
                                )
                            }
                        </span>

                        {" "}of{" "}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {totalLogs}
                        </span>

                        {" "}logs

                    </p>


                    {/* =============================================
                        PAGINATION CONTROLS
                    ============================================= */}

                    <div className="
                        flex
                        items-center
                        gap-1
                    ">


                        {/* PREVIOUS */}

                        <button
                            type="button"
                            disabled={
                                safeCurrentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage - 1
                                )
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Previous
                        </button>


                        {/* PAGE NUMBERS */}

                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (_, index) =>
                                index + 1
                        ).map(
                            (page) => (

                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                    className={`
                                        btn
                                        btn-sm
                                        ${safeCurrentPage ===
                                            page
                                            ? `
                                                    border-[#8BCF00]
                                                    bg-[#8BCF00]
                                                    text-white
                                                    hover:border-[#6FA800]
                                                    hover:bg-[#6FA800]
                                                `
                                            : `
                                                    btn-ghost
                                                `
                                        }
                                    `}
                                >
                                    {page}
                                </button>

                            )
                        )}


                        {/* NEXT */}

                        <button
                            type="button"
                            disabled={
                                safeCurrentPage ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage + 1
                                )
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </div>

    )

}


export default LoanShuffleLogs
