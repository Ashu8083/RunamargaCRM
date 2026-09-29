// admin-react/src/pages/Logs/RevertedHistoryLogs/index.jsx

import { useMemo, useState } from 'react'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import RevertedHistoryLogTable from './components/RevertedHistoryLogTable'


function RevertedHistoryLogs() {

    // =========================================================
    // MOCK REVERTED HISTORY LOGS
    // =========================================================

    const [logs] = useState([
        {
            id: 9001,

            revertedId:
                '501',

            changedDate:
                '01 Sep 2026',

            previousRevertedDate:
                '28 Aug 2026',

            newRevertedDate:
                '05 Sep 2026',

            createdAt:
                '01 Sep 2026, 09:42:12',

            deletedAt:
                null,
        },

        {
            id: 9002,

            revertedId:
                '501',

            changedDate:
                '05 Sep 2026',

            previousRevertedDate:
                '05 Sep 2026',

            newRevertedDate:
                '10 Sep 2026',

            createdAt:
                '05 Sep 2026, 10:15:43',

            deletedAt:
                null,
        },

        {
            id: 9003,

            revertedId:
                '502',

            changedDate:
                '02 Sep 2026',

            previousRevertedDate:
                '30 Aug 2026',

            newRevertedDate:
                '07 Sep 2026',

            createdAt:
                '02 Sep 2026, 11:21:08',

            deletedAt:
                null,
        },

        {
            id: 9004,

            revertedId:
                '503',

            changedDate:
                '03 Sep 2026',

            previousRevertedDate:
                '01 Sep 2026',

            newRevertedDate:
                '08 Sep 2026',

            createdAt:
                '03 Sep 2026, 09:03:51',

            deletedAt:
                null,
        },

        {
            id: 9005,

            revertedId:
                '504',

            changedDate:
                '04 Sep 2026',

            previousRevertedDate:
                '02 Sep 2026',

            newRevertedDate:
                '09 Sep 2026',

            createdAt:
                '04 Sep 2026, 10:30:25',

            deletedAt:
                null,
        },

        {
            id: 9006,

            revertedId:
                '505',

            changedDate:
                '05 Sep 2026',

            previousRevertedDate:
                '03 Sep 2026',

            newRevertedDate:
                '10 Sep 2026',

            createdAt:
                '05 Sep 2026, 11:10:14',

            deletedAt:
                null,
        },

        {
            id: 9007,

            revertedId:
                '506',

            changedDate:
                '06 Sep 2026',

            previousRevertedDate:
                '04 Sep 2026',

            newRevertedDate:
                '11 Sep 2026',

            createdAt:
                '06 Sep 2026, 12:05:37',

            deletedAt:
                null,
        },

        {
            id: 9008,

            revertedId:
                '507',

            changedDate:
                '07 Sep 2026',

            previousRevertedDate:
                '05 Sep 2026',

            newRevertedDate:
                '12 Sep 2026',

            createdAt:
                '07 Sep 2026, 09:42:19',

            deletedAt:
                null,
        },

        {
            id: 9009,

            revertedId:
                '508',

            changedDate:
                '08 Sep 2026',

            previousRevertedDate:
                '06 Sep 2026',

            newRevertedDate:
                '13 Sep 2026',

            createdAt:
                '08 Sep 2026, 10:12:44',

            deletedAt:
                null,
        },

        {
            id: 9010,

            revertedId:
                '509',

            changedDate:
                '09 Sep 2026',

            previousRevertedDate:
                '07 Sep 2026',

            newRevertedDate:
                '14 Sep 2026',

            createdAt:
                '09 Sep 2026, 11:45:22',

            deletedAt:
                null,
        },

        {
            id: 9011,

            revertedId:
                '510',

            changedDate:
                '10 Sep 2026',

            previousRevertedDate:
                '08 Sep 2026',

            newRevertedDate:
                '15 Sep 2026',

            createdAt:
                '10 Sep 2026, 01:18:09',

            deletedAt:
                null,
        },

        {
            id: 9012,

            revertedId:
                '511',

            changedDate:
                '11 Sep 2026',

            previousRevertedDate:
                '09 Sep 2026',

            newRevertedDate:
                '16 Sep 2026',

            createdAt:
                '11 Sep 2026, 02:52:31',

            deletedAt:
                null,
        },

        {
            id: 9013,

            revertedId:
                '512',

            changedDate:
                '12 Sep 2026',

            previousRevertedDate:
                '10 Sep 2026',

            newRevertedDate:
                '17 Sep 2026',

            createdAt:
                '12 Sep 2026, 03:25:16',

            deletedAt:
                null,
        },

        {
            id: 9014,

            revertedId:
                '513',

            changedDate:
                '13 Sep 2026',

            previousRevertedDate:
                '11 Sep 2026',

            newRevertedDate:
                '18 Sep 2026',

            createdAt:
                '13 Sep 2026, 09:14:42',

            deletedAt:
                null,
        },

        {
            id: 9015,

            revertedId:
                '514',

            changedDate:
                '14 Sep 2026',

            previousRevertedDate:
                '12 Sep 2026',

            newRevertedDate:
                '19 Sep 2026',

            createdAt:
                '14 Sep 2026, 10:36:28',

            deletedAt:
                null,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)


    const pageSize = 10


    // =========================================================
    // FILTER LOGS
    // =========================================================

    const filteredLogs = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        return logs.filter((log) => {

            // -------------------------------------------------
            // SEARCH REVERTED ID
            // -------------------------------------------------

            const matchesSearch =
                !searchValue ||
                String(log.revertedId)
                    .toLowerCase()
                    .includes(searchValue)


            // -------------------------------------------------
            // LOG DATE
            // -------------------------------------------------

            const logDate =
                log.createdAt
                    ? new Date(log.createdAt)
                    : null


            // -------------------------------------------------
            // FROM DATE
            // -------------------------------------------------

            const matchesFromDate =
                !fromDate ||
                (
                    logDate &&
                    logDate >=
                        new Date(
                            `${fromDate}T00:00:00`
                        )
                )


            // -------------------------------------------------
            // TO DATE
            // -------------------------------------------------

            const matchesToDate =
                !toDate ||
                (
                    logDate &&
                    logDate <=
                        new Date(
                            `${toDate}T23:59:59`
                        )
                )


            return (
                matchesSearch &&
                matchesFromDate &&
                matchesToDate
            )

        })

    }, [
        logs,
        search,
        fromDate,
        toDate,
    ])


    // =========================================================
    // TOTAL PAGES
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredLogs.length /
                pageSize
            )
        )


    // =========================================================
    // SAFE CURRENT PAGE
    // =========================================================

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        )


    // =========================================================
    // PAGINATED DATA
    // =========================================================

    const paginatedLogs =
        filteredLogs.slice(
            (safeCurrentPage - 1) *
                pageSize,

            safeCurrentPage *
                pageSize
        )


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setFromDate('')

        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange = (
        value
    ) => {

        setSearch(value)

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

    const handleRefresh = () => {

        /*
         * Replace with API call later.
         */

        console.log(
            'Refresh reverted history logs'
        )

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
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


            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                ">
                    Reverted History Logs
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    View reverted date change history.
                </p>

            </div>


            {/* =====================================================
                FILTER CARD
            ===================================================== */}

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
                        FILTER ROW
                    ================================================= */}

                    <div className="
                        flex
                        w-full
                        flex-col
                        gap-3
                        lg:flex-row
                        lg:items-center
                    ">


                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="
                            w-full
                            lg:flex-1
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
                                    placeholder="Search reverted ID..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            FROM DATE
                        ========================================= */}

                        <div className="
                            w-full
                            lg:w-44
                            xl:w-48
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


                        {/* =========================================
                            TO DATE
                        ========================================= */}

                        <div className="
                            w-full
                            lg:w-44
                            xl:w-48
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


                        {/* =========================================
                            RESET + REFRESH
                        ========================================= */}

                        <div className="
                            flex
                            w-full
                            items-center
                            lg:w-auto
                        ">

                            <div className="
                                flex
                                w-full
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                                lg:w-auto
                            ">


                                {/* =================================
                                    RESET
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={handleReset}
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


                                {/* =================================
                                    DIVIDER
                                ================================= */}

                                <div className="
                                    h-6
                                    w-px
                                    shrink-0
                                    bg-base-300
                                " />


                                {/* =================================
                                    REFRESH
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={handleRefresh}
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

                                    <ArrowPathIcon className="
                                        h-4
                                        w-4
                                    " />

                                    <span>
                                        Refresh
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <RevertedHistoryLogTable
                logs={paginatedLogs}
            />


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {filteredLogs.length > 0 && (

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

                        Showing{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {(safeCurrentPage - 1) *
                                pageSize +
                                1
                            }
                        </span>

                        {' '}to{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {Math.min(
                                safeCurrentPage *
                                    pageSize,
                                filteredLogs.length
                            )}
                        </span>

                        {' '}of{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {filteredLogs.length}
                        </span>

                        {' '}logs

                    </p>


                    {/* =============================================
                        PAGINATION CONTROLS
                    ============================================= */}

                    <div className="
                        flex
                        items-center
                        gap-1
                    ">


                        {/* Previous */}

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


                        {/* Page Numbers */}

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
                                        ${
                                            safeCurrentPage ===
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


                        {/* Next */}

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


export default RevertedHistoryLogs