// admin-react/src/pages/EmployeeManagement/Attendance/index.jsx

import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'

import AttendanceTable from './components/AttendanceTable'
import AttendanceHistoryModal from './components/AttendanceHistoryModal'
import TodayAttendance from './components/TodayAttendance'

import {
    getAttendance,
    getTodayAttendance,
    getEmployeeHistory,
    getApiErrorMessage,
} from './API'


// ============================================================================
// DEFAULT ATTENDANCE QUERY
// ============================================================================
//
// The actual filter controls live inside AttendanceTable.
//
// This object only represents the query received from the table.
// ============================================================================

const DEFAULT_ATTENDANCE_QUERY = {
    search: '',
    employeeId: '',
    fromDate: '',
    toDate: '',
    status: '',
    page: 1,
    limit: 30,
}


// ============================================================================
// COMPONENT
// ============================================================================

function Attendance() {

    // =========================================================================
    // ATTENDANCE DATA
    // =========================================================================

    const [
        entries,
        setEntries,
    ] = useState([])


    // =========================================================================
    // PAGINATION / RESULT INFORMATION
    // =========================================================================

    const [
        totalRecords,
        setTotalRecords,
    ] = useState(0)


    const [
        totalPages,
        setTotalPages,
    ] = useState(0)


    const [
        currentPage,
        setCurrentPage,
    ] = useState(1)


    const [
        currentLimit,
        setCurrentLimit,
    ] = useState(30)


    // =========================================================================
    // ATTENDANCE QUERY
    // =========================================================================
    //
    // The UI controls are inside AttendanceTable.
    //
    // This state only stores the query sent by the table so the page can
    // request the correct data from the backend.
    //
    // =========================================================================

    const [
        attendanceQuery,
        setAttendanceQuery,
    ] = useState(
        DEFAULT_ATTENDANCE_QUERY
    )


    // =========================================================================
    // LOADING
    // =========================================================================

    const [
        loading,
        setLoading,
    ] = useState(true)


    // =========================================================================
    // ERROR
    // =========================================================================

    const [
        error,
        setError,
    ] = useState('')


    // =========================================================================
    // TODAY / SELECTED-DATE ATTENDANCE
    // =========================================================================

    const [
        todayAttendance,
        setTodayAttendance,
    ] = useState([])


    const [
        todayLoading,
        setTodayLoading,
    ] = useState(false)


    const [
        todayError,
        setTodayError,
    ] = useState('')


    // =========================================================================
    // HISTORY STATE
    // =========================================================================

    const [
        showHistoryModal,
        setShowHistoryModal,
    ] = useState(false)


    const [
        selectedEmployee,
        setSelectedEmployee,
    ] = useState(null)


    const [
        history,
        setHistory,
    ] = useState(null)


    const [
        historyLoading,
        setHistoryLoading,
    ] = useState(false)


    // =========================================================================
    // TODAY ATTENDANCE MODAL
    // =========================================================================

    const [
        showTodayAttendance,
        setShowTodayAttendance,
    ] = useState(false)


    // =========================================================================
    // LOAD ATTENDANCE
    // =========================================================================

    const loadAttendance = useCallback(
        async (
            query = DEFAULT_ATTENDANCE_QUERY
        ) => {

            try {

                setLoading(true)

                setError('')


                // ----------------------------------------------------------------
                // REQUEST FULL DATABASE SEARCH / SERVER-SIDE PAGINATION
                // ----------------------------------------------------------------

                const response =
                    await getAttendance({
                        search:
                            query.search,

                        employeeId:
                            query.employeeId,

                        fromDate:
                            query.fromDate,

                        toDate:
                            query.toDate,

                        status:
                            query.status,

                        page:
                            query.page,

                        limit:
                            query.limit,
                    })


                // ----------------------------------------------------------------
                // RESPONSE ITEMS
                // ----------------------------------------------------------------

                const responseItems =
                    Array.isArray(
                        response?.items
                    )
                        ? response.items
                        : []


                setEntries(
                    responseItems
                )


                // ----------------------------------------------------------------
                // TOTAL RECORDS
                // ----------------------------------------------------------------

                setTotalRecords(
                    Number(
                        response?.total || 0
                    )
                )


                // ----------------------------------------------------------------
                // TOTAL PAGES
                // ----------------------------------------------------------------

                setTotalPages(
                    Number(
                        response?.totalPages || 0
                    )
                )


                // ----------------------------------------------------------------
                // CURRENT PAGE
                // ----------------------------------------------------------------

                const responsePage =
                    Number(
                        response?.page ||
                        query.page ||
                        1
                    )


                setCurrentPage(
                    responsePage
                )


                // ----------------------------------------------------------------
                // CURRENT LIMIT
                // ----------------------------------------------------------------

                const responseLimit =
                    Number(
                        response?.limit ||
                        query.limit ||
                        30
                    )


                setCurrentLimit(
                    responseLimit
                )


                // ----------------------------------------------------------------
                // KEEP QUERY IN SYNC WITH BACKEND
                // ----------------------------------------------------------------

                setAttendanceQuery(
                    (currentQuery) => ({
                        ...currentQuery,

                        page:
                            responsePage,

                        limit:
                            responseLimit,
                    })
                )

            } catch (err) {

                console.error(
                    'Unable to load attendance:',
                    err
                )


                setEntries([])

                setTotalRecords(0)

                setTotalPages(0)


                setError(
                    getApiErrorMessage(
                        err,
                        'Unable to load attendance.'
                    )
                )

            } finally {

                setLoading(false)

            }

        },
        []
    )


    // =========================================================================
    // HANDLE TABLE QUERY CHANGE
    // =========================================================================
    //
    // AttendanceTable owns the actual filter and pagination controls.
    //
    // Whenever something changes, the table sends the complete query here.
    //
    // Example:
    //
    // {
    //     search: "sharath",
    //     employeeId: "",
    //     fromDate: "",
    //     toDate: "",
    //     status: "",
    //     page: 1,
    //     limit: 50
    // }
    //
    // =========================================================================

    const handleAttendanceQueryChange =
        useCallback(
            (query) => {

                const normalizedQuery = {
                    ...DEFAULT_ATTENDANCE_QUERY,

                    ...query,

                    page:
                        Number(
                            query?.page || 1
                        ),

                    limit:
                        Number(
                            query?.limit || 30
                        ),
                }


                setAttendanceQuery(
                    normalizedQuery
                )


                loadAttendance(
                    normalizedQuery
                )

            },
            [
                loadAttendance,
            ]
        )


    // =========================================================================
    // INITIAL ATTENDANCE LOAD
    // =========================================================================

    useEffect(() => {

        loadAttendance(
            DEFAULT_ATTENDANCE_QUERY
        )

    }, [
        loadAttendance,
    ])


    // =========================================================================
    // LOAD TODAY / SELECTED-DATE ATTENDANCE
    // =========================================================================

    const loadTodayAttendance =
        useCallback(
            async (
                selectedDate = ''
            ) => {

                try {

                    setTodayLoading(
                        true
                    )

                    setTodayError('')


                    const response =
                        await getTodayAttendance(
                            selectedDate
                        )


                    setTodayAttendance(
                        Array.isArray(
                            response
                        )
                            ? response
                            : []
                    )

                } catch (err) {

                    console.error(
                        'Unable to load attendance for selected date:',
                        err
                    )


                    setTodayAttendance(
                        []
                    )


                    setTodayError(
                        getApiErrorMessage(
                            err,
                            'Unable to load attendance.'
                        )
                    )

                } finally {

                    setTodayLoading(
                        false
                    )

                }

            },
            []
        )


    // =========================================================================
    // INITIAL TODAY ATTENDANCE LOAD
    // =========================================================================

    useEffect(() => {

        loadTodayAttendance()

    }, [
        loadTodayAttendance,
    ])


    // =========================================================================
    // REFRESH
    // =========================================================================

    const handleRefresh =
        async () => {

            await Promise.all([
                loadAttendance(
                    attendanceQuery
                ),

                loadTodayAttendance(),
            ])
        }


    // =========================================================================
    // VIEW EMPLOYEE HISTORY
    // =========================================================================

    const handleViewHistory =
        async (
            entry
        ) => {

            if (
                !entry?.employeeId
            ) {
                return
            }


            setSelectedEmployee(
                entry
            )


            setHistory(null)


            setShowHistoryModal(
                true
            )


            setHistoryLoading(
                true
            )


            try {

                const response =
                    await getEmployeeHistory(
                        entry.employeeId
                    )


                setHistory(
                    response
                )

            } catch (err) {

                console.error(
                    'Unable to load attendance history:',
                    err
                )


                setHistory(null)

            } finally {

                setHistoryLoading(
                    false
                )

            }
        }


    // =========================================================================
    // CLOSE HISTORY
    // =========================================================================

    const handleCloseHistory =
        () => {

            setShowHistoryModal(
                false
            )


            setSelectedEmployee(
                null
            )


            setHistory(
                null
            )


            setHistoryLoading(
                false
            )
        }


    // =========================================================================
    // OPEN TODAY ATTENDANCE
    // =========================================================================

    const handleOpenTodayAttendance =
        async () => {

            setShowTodayAttendance(
                true
            )


            await loadTodayAttendance()

        }


    // =========================================================================
    // CLOSE TODAY ATTENDANCE
    // =========================================================================

    const handleCloseTodayAttendance =
        () => {

            setShowTodayAttendance(
                false
            )

        }


    // =========================================================================
    // TODAY ATTENDANCE COUNT
    // =========================================================================

    const todayAttendanceCount =
        todayAttendance.length


    // =========================================================================
    // ERROR STATE
    // =========================================================================

    if (
        error &&
        !loading &&
        !entries.length
    ) {

        return (
            <div className="
                space-y-5
                p-4
                sm:p-6
            ">

                <div className="
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    p-8
                    text-center
                    shadow-sm
                ">

                    <p className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Unable to load attendance
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading ||
                            todayLoading
                        }
                        className="
                            mt-4
                            inline-flex
                            h-9
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
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <ArrowPathIcon className="
                            h-4
                            w-4
                        " />

                        Try Again

                    </button>

                </div>

            </div>
        )
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">

            {/* =================================================================
                PAGE HEADER
            ================================================================= */}

            <div className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

             

                {/* =============================================================
                    PAGE ACTIONS
                ============================================================= */}

                <div className="
                    flex
                    flex-wrap
                    gap-2
                ">

                    {/* =========================================================
                        REFRESH
                    ========================================================= */}

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            loading ||
                            todayLoading
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
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
                            disabled:opacity-50
                        "
                    >

                        <ArrowPathIcon
                            className={[
                                'h-4',
                                'w-4',

                                loading
                                    ? 'animate-spin'
                                    : '',
                            ].join(' ')}
                        />

                        Refresh

                    </button>


                    {/* =========================================================
                        TODAY ATTENDANCE
                    ========================================================= */}

                    <button
                        type="button"
                        onClick={
                            handleOpenTodayAttendance
                        }
                        className="
                            inline-flex
                            h-10
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
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >

                        <CalendarDaysIcon className="
                            h-4
                            w-4
                        " />

                        Today's Attendance


                        {todayAttendanceCount > 0 && (

                            <span className="
                                ml-0.5
                                rounded-full
                                bg-white/20
                                px-1.5
                                py-0.5
                                text-[9px]
                                font-semibold
                            ">
                                {
                                    todayAttendanceCount
                                }
                            </span>

                        )}

                    </button>

                </div>

            </div>


            {/* =================================================================
                ATTENDANCE ERROR
            ================================================================= */}

            {error &&
                entries.length > 0 && (

                <div className="
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-xs
                    text-red-600
                ">
                    {error}
                </div>

            )}


            {/* =================================================================
                ATTENDANCE TABLE
            ================================================================= */}
            {/*
                The AttendanceTable now owns:

                - Search
                - From Date
                - To Date
                - Status
                - Employee
                - Reset
                - Rows per page
                - Pagination
                - Record range

                It sends the complete query to this page through
                onQueryChange().
            */}

            <AttendanceTable
                entries={
                    entries
                }

                onView={
                    handleViewHistory
                }

                loading={
                    loading
                }

                totalRecords={
                    totalRecords
                }

                totalPages={
                    totalPages
                }

                currentPage={
                    currentPage
                }

                currentLimit={
                    currentLimit
                }

                onQueryChange={
                    handleAttendanceQueryChange
                }
            />


            {/* =================================================================
                EMPLOYEE HISTORY MODAL
            ================================================================= */}

            <AttendanceHistoryModal
                open={
                    showHistoryModal
                }

                entry={
                    selectedEmployee
                }

                history={
                    history?.history || []
                }

                onClose={
                    handleCloseHistory
                }
            />


            {/* =================================================================
                HISTORY LOADING
            ================================================================= */}

            {showHistoryModal &&
                historyLoading && (

                <div className="
                    pointer-events-none
                    fixed
                    inset-0
                    z-[110]
                    flex
                    items-center
                    justify-center
                ">

                    <div className="
                        rounded-lg
                        bg-black/70
                        px-4
                        py-3
                        text-xs
                        font-medium
                        text-white
                    ">
                        Loading attendance history...
                    </div>

                </div>

            )}


            {/* =================================================================
                TODAY / SELECTED-DATE ATTENDANCE MODAL
            ================================================================= */}

            <TodayAttendance
                open={
                    showTodayAttendance
                }

                entries={
                    todayAttendance
                }

                onClose={
                    handleCloseTodayAttendance
                }

                loading={
                    todayLoading
                }

                error={
                    todayError
                }

                onDateChange={
                    loadTodayAttendance
                }
            />


            {/* =================================================================
                TODAY ATTENDANCE ERROR
            ================================================================= */}

            {showTodayAttendance &&
                todayError &&
                !todayLoading && (

                <div className="
                    pointer-events-none
                    fixed
                    bottom-5
                    left-1/2
                    z-[120]
                    -translate-x-1/2
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-xs
                    text-red-600
                    shadow-lg
                ">
                    {todayError}
                </div>

            )}

        </div>
    )
}


export default Attendance