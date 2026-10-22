
// admin-react/src/pages/crm/EmployeeManagement/Holiday/index.jsx

import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import HolidayCalendar from './components/HolidayCalendar'
import HolidayModal from './components/HolidayModal'

import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

import {
    getHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    getHolidayApiErrorMessage,
} from './API'


// ============================================================================
// DATE HELPERS
// ============================================================================

const padNumber = (value) =>
    String(value).padStart(2, '0')


const getCurrentMonth = () => {
    const today = new Date()

    return [
        today.getFullYear(),
        padNumber(today.getMonth() + 1),
    ].join('-')
}


const getTodayDate = () => {
    const today = new Date()

    return [
        today.getFullYear(),
        padNumber(today.getMonth() + 1),
        padNumber(today.getDate()),
    ].join('-')
}


// ============================================================================
// HOLIDAY PAGE
// ============================================================================

function Holiday() {

    // =========================================================================
    // CURRENT MONTH
    // =========================================================================

    const [
        currentMonth,
        setCurrentMonth,
    ] = useState(getCurrentMonth)


    // =========================================================================
    // HOLIDAY DATA
    // =========================================================================

    const [
        holidays,
        setHolidays,
    ] = useState([])


    // =========================================================================
    // LOADING STATES
    // =========================================================================

    const [
        loading,
        setLoading,
    ] = useState(true)


    const [
        saving,
        setSaving,
    ] = useState(false)


    const [
        deleting,
        setDeleting,
    ] = useState(false)


    // =========================================================================
    // FEEDBACK MODAL STATE
    // =========================================================================

    const [
        feedback,
        setFeedback,
    ] = useState({
        open: false,
        type: 'success',
        title: '',
        message: '',
    })


    // =========================================================================
    // SELECTED DATE
    // =========================================================================

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(getTodayDate)


    // =========================================================================
    // HOLIDAY MODAL STATE
    // =========================================================================

    const [
        modalOpen,
        setModalOpen,
    ] = useState(false)


    const [
        selectedHoliday,
        setSelectedHoliday,
    ] = useState(null)


    const [
        modalError,
        setModalError,
    ] = useState('')


    // =========================================================================
    // SHOW FEEDBACK
    // =========================================================================

    const showFeedback = (
        type,
        title,
        message
    ) => {
        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }


    // =========================================================================
    // CLOSE FEEDBACK
    // =========================================================================

    const closeFeedback = () => {
        setFeedback((current) => ({
            ...current,
            open: false,
        }))
    }


    // =========================================================================
    // LOAD HOLIDAYS FOR THE SELECTED MONTH
    // =========================================================================
    //
    // Fetch active and inactive holidays separately so inactive holidays
    // remain visible and can be reactivated from the edit modal.
    //
    // =========================================================================

    const loadHolidays = useCallback(
        async (
            month = currentMonth
        ) => {
            try {
                setLoading(true)

                const [
                    activeHolidays,
                    inactiveHolidays,
                ] = await Promise.all([
                    getHolidays(month, true),
                    getHolidays(month, false),
                ])

                const allHolidays = [
                    ...activeHolidays,
                    ...inactiveHolidays,
                ]

                const uniqueHolidays = Array.from(
                    new Map(
                        allHolidays.map(
                            (holiday) => [
                                holiday.id,
                                holiday,
                            ]
                        )
                    ).values()
                )

                uniqueHolidays.sort(
                    (a, b) =>
                        String(a.date).localeCompare(
                            String(b.date)
                        )
                )

                setHolidays(uniqueHolidays)

                return true
            } catch (error) {
                console.error(
                    'Unable to load holidays:',
                    error
                )

                showFeedback(
                    'error',
                    'Unable to Load Holidays',
                    getHolidayApiErrorMessage(
                        error,
                        'Unable to load holidays. Please try again.'
                    )
                )

                return false
            } finally {
                setLoading(false)
            }
        },
        [currentMonth]
    )


    // =========================================================================
    // LOAD WHEN MONTH CHANGES
    // =========================================================================

    useEffect(() => {
        loadHolidays(currentMonth)
    }, [
        currentMonth,
        loadHolidays,
    ])


    // =========================================================================
    // CHANGE MONTH
    // =========================================================================

    const handleMonthChange = (
        month
    ) => {
        setCurrentMonth(month)
    }


    // =========================================================================
    // SELECT A DATE
    // =========================================================================

    const handleDateSelect = (
        date
    ) => {
        setSelectedDate(date)
    }


    // =========================================================================
    // OPEN ADD MODAL
    // =========================================================================

    const handleAddHoliday = (
        date = selectedDate
    ) => {
        setSelectedDate(date)
        setSelectedHoliday(null)
        setModalError('')
        setModalOpen(true)
    }


    // =========================================================================
    // OPEN EDIT MODAL
    // =========================================================================

    const handleHolidaySelect = (
        holiday
    ) => {
        setSelectedDate(
            String(holiday.date).slice(0, 10)
        )

        setSelectedHoliday(holiday)
        setModalError('')
        setModalOpen(true)
    }


    // =========================================================================
    // CLOSE HOLIDAY MODAL
    // =========================================================================

    const handleCloseModal = () => {
        if (saving || deleting) {
            return
        }

        setModalOpen(false)
        setSelectedHoliday(null)
        setModalError('')
    }


    // =========================================================================
    // SAVE HOLIDAY
    // =========================================================================

    const handleSaveHoliday = async (
        holidayData
    ) => {
        try {
            setSaving(true)
            setModalError('')

            if (holidayData.id) {
                await updateHoliday(holidayData)
            } else {
                await createHoliday(holidayData)
            }

            // Close the holiday form after a successful API operation.
            setModalOpen(false)
            setSelectedHoliday(null)

            // Navigate to the holiday's month if its date changed.
            const targetMonth =
                holidayData.date.slice(0, 7)

            setSelectedDate(holidayData.date)
            setCurrentMonth(targetMonth)

            // Refresh the target month before showing success feedback.
            const refreshed = await loadHolidays(targetMonth)

            if (refreshed) {
                showFeedback(
                    'success',
                    holidayData.id
                        ? 'Holiday Updated'
                        : 'Holiday Created',
                    holidayData.id
                        ? 'The holiday was updated successfully.'
                        : 'The holiday was created successfully.'
                )
            }
        } catch (error) {
            console.error(
                'Unable to save holiday:',
                error
            )

            setModalError(
                getHolidayApiErrorMessage(
                    error,
                    'Unable to save holiday.'
                )
            )
        } finally {
            setSaving(false)
        }
    }


    // =========================================================================
    // DEACTIVATE HOLIDAY
    // =========================================================================

    const handleDeleteHoliday = async (
        holidayId
    ) => {
        try {
            setDeleting(true)
            setModalError('')

            await deleteHoliday(holidayId)

            setModalOpen(false)
            setSelectedHoliday(null)

            const refreshed = await loadHolidays(currentMonth)

            if (refreshed) {
                showFeedback(
                    'success',
                    'Holiday Deactivated',
                    'The holiday was deactivated successfully.'
                )
            }
        } catch (error) {
            console.error(
                'Unable to deactivate holiday:',
                error
            )

            setModalError(
                getHolidayApiErrorMessage(
                    error,
                    'Unable to deactivate holiday.'
                )
            )
        } finally {
            setDeleting(false)
        }
    }


    // =========================================================================
    // REFRESH
    // =========================================================================

    const handleRefresh = async () => {
        await loadHolidays(currentMonth)
    }


    // =========================================================================
    // HOLIDAY COUNTS
    // =========================================================================

    const activeHolidayCount = holidays.filter(
        (holiday) =>
            holiday.is_active !== false
    ).length


    const inactiveHolidayCount = holidays.filter(
        (holiday) =>
            holiday.is_active === false
    ).length


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="
            space-y-5
            p-4
            sm:p-6
        ">

            {/* ================================================================
                PAGE HEADER
            ================================================================ */}

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                {/* ============================================================
                    REFRESH
                ============================================================ */}

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="
                        inline-flex
                        h-10
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        self-start
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
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:self-auto
                    "
                >
                    <ArrowPathIcon
                        className={[
                            'h-4',
                            'w-4',
                            loading ? 'animate-spin' : '',
                        ].join(' ')}
                    />

                    Refresh
                </button>

            </div>


            {/* ================================================================
                SUMMARY CARDS
            ================================================================ */}

            <div className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
            ">

                {/* ============================================================
                    ACTIVE HOLIDAYS
                ============================================================ */}

                <div className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    p-4
                    shadow-sm
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#8BCF00]/10
                        text-[#6FA800]
                    ">
                        <CalendarDaysIcon className="
                            h-5
                            w-5
                        " />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            Active Holidays
                        </p>

                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            {loading ? '—' : activeHolidayCount}
                        </p>
                    </div>

                </div>


                {/* ============================================================
                    INACTIVE HOLIDAYS
                ============================================================ */}

                <div className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    p-4
                    shadow-sm
                ">

                    <div className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-base-200
                        text-base-content/50
                    ">
                        <CalendarDaysIcon className="
                            h-5
                            w-5
                        " />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            Inactive Holidays
                        </p>

                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            {loading ? '—' : inactiveHolidayCount}
                        </p>
                    </div>

                </div>

            </div>


            {/* ================================================================
                HOLIDAY CALENDAR
            ================================================================ */}

            <HolidayCalendar
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                holidays={holidays}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onHolidaySelect={handleHolidaySelect}
                onAddHoliday={handleAddHoliday}
                loading={loading}
            />


            {/* ================================================================
                ADD / EDIT HOLIDAY MODAL
                Keep the existing modal unchanged.
            ================================================================ */}

            <HolidayModal
                open={modalOpen}
                holiday={selectedHoliday}
                selectedDate={selectedDate}
                onClose={handleCloseModal}
                onSave={handleSaveHoliday}
                onDelete={handleDeleteHoliday}
                saving={saving}
                deleting={deleting}
                error={modalError}
            />


            {/* ================================================================
                GLOBAL FEEDBACK MODAL
            ================================================================ */}

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={closeFeedback}
            />

        </div>
    )
}


export default Holiday
