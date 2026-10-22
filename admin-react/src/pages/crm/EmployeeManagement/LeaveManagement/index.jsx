
/*
 * admin-react/src/pages/crm/EmployeeManagement/LeaveManagement/index.jsx
 */

import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'

import LeaveTable from './components/LeaveTable'
import LeaveModal from './components/LeaveModal'

import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

import {
    getLeaveRequests,
    createLeaveRequest,
    reviewLeaveRequest,
    getLeaveApiErrorMessage,
} from './API'


// ============================================================================
// LEAVE MANAGEMENT PAGE
// ============================================================================

function LeaveManagement() {

    // =========================================================================
    // LEAVE REQUEST DATA
    // =========================================================================

    const [
        leaveRequests,
        setLeaveRequests,
    ] = useState([])


    // =========================================================================
    // LOADING AND SAVING STATES
    // =========================================================================

    const [
        loading,
        setLoading,
    ] = useState(true)


    const [
        saving,
        setSaving,
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
    // LEAVE MODAL STATE
    // =========================================================================

    const [
        modalOpen,
        setModalOpen,
    ] = useState(false)


    const [
        modalMode,
        setModalMode,
    ] = useState('create')


    const [
        selectedLeave,
        setSelectedLeave,
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
    // LOAD LEAVE REQUESTS
    // =========================================================================

    const loadLeaveRequests = useCallback(
        async () => {
            try {
                setLoading(true)

                const data = await getLeaveRequests()

                setLeaveRequests(
                    Array.isArray(data)
                        ? data
                        : []
                )

                return true
            } catch (error) {
                console.error(
                    'Unable to load leave requests:',
                    error
                )

                showFeedback(
                    'error',
                    'Unable to Load Leave Requests',
                    getLeaveApiErrorMessage(
                        error,
                        'Unable to load leave requests. Please try again.'
                    )
                )

                return false
            } finally {
                setLoading(false)
            }
        },
        []
    )


    // =========================================================================
    // INITIAL LOAD
    // =========================================================================

    useEffect(() => {
        loadLeaveRequests()
    }, [
        loadLeaveRequests,
    ])


    // =========================================================================
    // REFRESH
    // =========================================================================

    const handleRefresh = async () => {
        await loadLeaveRequests()
    }


    // =========================================================================
    // OPEN CREATE MODAL
    // =========================================================================

    const handleAddLeave = () => {
        if (saving) {
            return
        }

        setSelectedLeave(null)
        setModalMode('create')
        setModalError('')
        setModalOpen(true)
    }


    // =========================================================================
    // OPEN VIEW MODAL
    // =========================================================================

    const handleViewLeave = (
        leave
    ) => {
        if (saving) {
            return
        }

        setSelectedLeave(leave)
        setModalMode('view')
        setModalError('')
        setModalOpen(true)
    }


    // =========================================================================
    // OPEN REVIEW MODAL
    // =========================================================================

    // Called by LeaveTable when the user clicks Review.
    const handleOpenReviewModal = (
        leave
    ) => {
        if (
            saving ||
            !leave ||
            leave.status !== 'Pending'
        ) {
            return
        }

        setSelectedLeave(leave)
        setModalMode('review')
        setModalError('')
        setModalOpen(true)
    }


    // =========================================================================
    // CLOSE LEAVE MODAL
    // =========================================================================

    const handleCloseModal = () => {
        if (saving) {
            return
        }

        setModalOpen(false)
        setSelectedLeave(null)
        setModalError('')
    }


    // =========================================================================
    // CREATE LEAVE REQUEST
    // =========================================================================

    const handleSaveLeave = async (
        leaveData
    ) => {
        try {
            setSaving(true)
            setModalError('')

            await createLeaveRequest(leaveData)

            setModalOpen(false)
            setSelectedLeave(null)

            const refreshed = await loadLeaveRequests()

            if (refreshed) {
                showFeedback(
                    'success',
                    'Leave Request Submitted',
                    'Your leave request has been submitted successfully.'
                )
            }
        } catch (error) {
            console.error(
                'Unable to submit leave request:',
                error
            )

            setModalError(
                getLeaveApiErrorMessage(
                    error,
                    'Unable to submit the leave request.'
                )
            )
        } finally {
            setSaving(false)
        }
    }


    // =========================================================================
    // SUBMIT APPROVAL / REJECTION
    // =========================================================================

    // Called by LeaveModal with (leaveId, reviewData).
    const handleSubmitReview = async (
        leaveId,
        reviewData
    ) => {
        if (!leaveId || !reviewData?.status) {
            setModalError(
                'Missing leave request or review decision.'
            )
            return
        }

        try {
            setSaving(true)
            setModalError('')

            await reviewLeaveRequest(
                leaveId,
                reviewData
            )

            setModalOpen(false)
            setSelectedLeave(null)

            const refreshed = await loadLeaveRequests()

            if (refreshed) {
                const approved =
                    reviewData.status === 'Approved'

                showFeedback(
                    'success',
                    approved
                        ? 'Leave Request Approved'
                        : 'Leave Request Rejected',
                    approved
                        ? 'The leave request has been approved successfully.'
                        : 'The leave request has been rejected successfully.'
                )
            }
        } catch (error) {
            console.error(
                'Unable to review leave request:',
                error
            )

            setModalError(
                getLeaveApiErrorMessage(
                    error,
                    'Unable to review the leave request.'
                )
            )
        } finally {
            setSaving(false)
        }
    }


    // =========================================================================
    // SUMMARY COUNTS
    // =========================================================================

    const pendingCount = leaveRequests.filter(
        (leave) =>
            String(leave.status || '').toLowerCase() ===
            'pending'
    ).length


    const approvedCount = leaveRequests.filter(
        (leave) =>
            String(leave.status || '').toLowerCase() ===
            'approved'
    ).length


    const rejectedCount = leaveRequests.filter(
        (leave) =>
            String(leave.status || '').toLowerCase() ===
            'rejected'
    ).length


    const totalCount = leaveRequests.length


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

                <div>
                    <h1 className="
                        text-xl
                        font-semibold
                        text-base-content
                    ">
                        Leave Management
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-base-content/50
                    ">
                        Manage leave requests, track statuses, and review applications.
                    </p>
                </div>


                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                ">

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


                    <button
                        type="button"
                        onClick={handleAddLeave}
                        disabled={saving}
                        className="
                            inline-flex
                            h-10
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#75b000]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <PlusIcon className="
                            h-4
                            w-4
                        " />

                        Apply for Leave
                    </button>

                </div>
            </div>


            {/* ================================================================
                SUMMARY CARDS
            ================================================================ */}

            <div className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                xl:grid-cols-4
            ">

                {/* ============================================================
                    TOTAL REQUESTS
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
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-base-200
                        text-base-content/60
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
                            Total Requests
                        </p>

                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            {loading ? '—' : totalCount}
                        </p>
                    </div>
                </div>


                {/* ============================================================
                    PENDING
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
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-amber-50
                        text-amber-600
                    ">
                        <ClockIcon className="
                            h-5
                            w-5
                        " />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            Pending
                        </p>

                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            {loading ? '—' : pendingCount}
                        </p>
                    </div>
                </div>


                {/* ============================================================
                    APPROVED
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
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#8BCF00]/10
                        text-[#6FA800]
                    ">
                        <CheckCircleIcon className="
                            h-5
                            w-5
                        " />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            Approved
                        </p>

                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            {loading ? '—' : approvedCount}
                        </p>
                    </div>
                </div>


                {/* ============================================================
                    REJECTED
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
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-50
                        text-red-600
                    ">
                        <XCircleIcon className="
                            h-5
                            w-5
                        " />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            text-base-content/50
                        ">
                            Rejected
                        </p>

                        <p className="
                            mt-1
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            {loading ? '—' : rejectedCount}
                        </p>
                    </div>
                </div>

            </div>


            {/* ================================================================
                LEAVE TABLE
            ================================================================ */}

            <LeaveTable
                entries={leaveRequests}
                onView={handleViewLeave}
                onReview={handleOpenReviewModal}
                loading={loading}
                canReview={true}
            />


            {/* ================================================================
                CREATE / VIEW / REVIEW MODAL
            ================================================================ */}

            <LeaveModal
                open={modalOpen}
                leave={selectedLeave}
                mode={modalMode}
                onClose={handleCloseModal}
                onSave={handleSaveLeave}
                onReview={handleSubmitReview}
                saving={saving}
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


export default LeaveManagement
