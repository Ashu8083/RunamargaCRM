
// admin-react\src\pages\crm\Attendance\components\LeaveManagement.jsx

import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useState,
} from 'react'

import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import NoSymbolIcon from '@heroicons/react/24/outline/NoSymbolIcon'

import FeedbackModal from '../../../../../src/components/GlobalModels/FeedbackModal'

import {
    applyForLeave,
    getMyLeaveRequests,
    updateMyLeaveRequest,
    cancelMyLeaveRequest,
} from '../api'

const LeaveApplicationModal = lazy(
    () => import('./LeaveApplicationModal')
)

const DEFAULT_LEAVE_BALANCE = {
    monthly_accrual: 1,
    total_accrued: 0,
    approved_days: 0,
    pending_days: 0,
    available_days: 0,
}


// =============================================================
// DATE HELPERS
// =============================================================

const parseDate = (value) => {
    if (!value) return null

    const dateOnly = String(value).slice(0, 10)
    const parsed = new Date(`${dateOnly}T00:00:00`)

    return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getCalendarDays = (fromDate, toDate) => {
    const from = parseDate(fromDate)
    const to = parseDate(toDate)

    if (!from || !to || to < from) {
        return 0
    }

    return Math.floor(
        (to.getTime() - from.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
}

const formatDate = (value) => {
    if (!value) return '-'

    const parsedDate = parseDate(value)

    if (!parsedDate) {
        return String(value).slice(0, 10)
    }

    return parsedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}


// =============================================================
// COMPONENT
// =============================================================

function LeaveManagement() {
    const [showModal, setShowModal] = useState(false)
    const [leaveRequests, setLeaveRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [editingRequest, setEditingRequest] = useState(null)
    const [processingLeaveId, setProcessingLeaveId] = useState(null)

    const [leaveBalance, setLeaveBalance] = useState(
        DEFAULT_LEAVE_BALANCE
    )

    const [feedback, setFeedback] = useState({
        open: false,
        type: 'info',
        title: '',
        message: '',
    })


    // =============================================================
    // FEEDBACK
    // =============================================================

    const showFeedback = (type, title, message) => {
        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }

    const closeFeedback = () => {
        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))
    }

    const getErrorMessage = (error) => {
        const detail = error?.response?.data?.detail

        if (typeof detail === 'string') {
            return detail
        }

        if (Array.isArray(detail)) {
            return detail
                .map((item) => item.msg)
                .filter(Boolean)
                .join(', ')
        }

        return (
            error?.response?.data?.message ||
            error?.message ||
            'Please try again.'
        )
    }


    // =============================================================
    // NORMALIZE LEAVE REQUEST
    // Matches LeaveManagement fields returned by the controller.
    // =============================================================

    const normalizeLeave = (request) => {
        const fromDate = request.from_date ?? request.fromDate ?? ''
        const toDate = request.to_date ?? request.toDate ?? fromDate

        const suppliedDays =
            request.days ??
            request.leave_days ??
            request.number_of_days

        const parsedSuppliedDays = Number(suppliedDays)

        const days =
            suppliedDays !== null &&
            suppliedDays !== undefined &&
            Number.isFinite(parsedSuppliedDays)
                ? parsedSuppliedDays
                : getCalendarDays(fromDate, toDate)

        return {
            id: request.id ?? request.leave_id,
            fromDate,
            toDate,
            days: Math.max(0, days),
            category: request.leave_type ?? request.category ?? '-',
            reason: request.reason ?? '-',
            status: request.status ?? 'Pending',
            reviewRemarks:
                request.review_remarks ??
                request.reviewRemarks ??
                null,
        }
    }


    // =============================================================
    // LOAD LEAVE REQUESTS AND BALANCE
    // GET /attendance/view/leave
    //
    // Controller response:
    // {
    //   success: true,
    //   data: [...leave requests],
    //   leave_balance: {...}
    // }
    // =============================================================

    const loadLeaveRequests = useCallback(async () => {
        setLoading(true)

        try {
            const response = await getMyLeaveRequests()

            // api.js returns Axios response.data, so response here
            // should already be the controller's JSON object.
            const payload = response

            const records = Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.leave_requests)
                    ? payload.leave_requests
                    : Array.isArray(payload?.requests)
                        ? payload.requests
                        : Array.isArray(payload?.leaves)
                            ? payload.leaves
                            : Array.isArray(payload)
                                ? payload
                                : []

            setLeaveRequests(records.map(normalizeLeave))

            const balance = payload?.leave_balance

            if (balance && typeof balance === 'object') {
                setLeaveBalance({
                    ...DEFAULT_LEAVE_BALANCE,
                    ...balance,
                })
            } else {
                setLeaveBalance(DEFAULT_LEAVE_BALANCE)

                console.warn(
                    'The leave API response did not include leave_balance.',
                    payload
                )
            }
        } catch (error) {
            console.error('Failed to load leave requests:', error)

            showFeedback(
                'error',
                'Unable to Load Leave Requests',
                getErrorMessage(error)
            )
        } finally {
            setLoading(false)
        }
    }, [])


    // =============================================================
    // INITIAL LOAD
    // =============================================================

    useEffect(() => {
        loadLeaveRequests()
    }, [loadLeaveRequests])


    // =============================================================
    // APPLY OR UPDATE LEAVE
    // =============================================================

    const handleSubmit = async (data) => {
        setSubmitting(true)

        const isEditing = Boolean(editingRequest)

        try {
            const response = isEditing
                ? await updateMyLeaveRequest(editingRequest.id, data)
                : await applyForLeave(data)

            await loadLeaveRequests()

            setShowModal(false)
            setEditingRequest(null)

            showFeedback(
                'success',
                isEditing ? 'Leave Updated' : 'Leave Applied',
                response?.message ||
                    (
                        isEditing
                            ? 'Your leave request was updated successfully.'
                            : 'Your leave request was submitted successfully.'
                    )
            )
        } catch (error) {
            showFeedback(
                'error',
                isEditing
                    ? 'Unable to Update Leave'
                    : 'Unable to Apply for Leave',
                getErrorMessage(error)
            )
        } finally {
            setSubmitting(false)
        }
    }


    // =============================================================
    // OPEN APPLY MODAL
    // =============================================================

    const handleOpenApplyModal = () => {
        setEditingRequest(null)
        setShowModal(true)
    }


    // =============================================================
    // OPEN EDIT MODAL
    // =============================================================

    const handleEdit = (request) => {
        if (request.status !== 'Pending') {
            showFeedback(
                'warning',
                'Cannot Update Leave',
                'Only pending leave requests can be updated.'
            )
            return
        }

        setEditingRequest(request)
        setShowModal(true)
    }


    // =============================================================
    // CANCEL LEAVE
    // =============================================================

    const handleCancel = async (request) => {
        if (request.status !== 'Pending') {
            showFeedback(
                'warning',
                'Cannot Cancel Leave',
                'Only pending leave requests can be cancelled.'
            )
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to cancel this leave request?'
        )

        if (!confirmed) return

        setProcessingLeaveId(request.id)

        try {
            const response = await cancelMyLeaveRequest(request.id)

            await loadLeaveRequests()

            showFeedback(
                'success',
                'Leave Cancelled',
                response?.message ||
                    'Your leave request was cancelled successfully.'
            )
        } catch (error) {
            showFeedback(
                'error',
                'Unable to Cancel Leave',
                getErrorMessage(error)
            )
        } finally {
            setProcessingLeaveId(null)
        }
    }


    // =============================================================
    // STATUS ICON
    // =============================================================

    const getStatusIcon = (status) => {
        if (status === 'Approved') {
            return <CheckCircleIcon className="w-4 h-4 text-success" />
        }

        if (status === 'Rejected') {
            return <XCircleIcon className="w-4 h-4 text-error" />
        }

        if (status === 'Cancelled') {
            return <NoSymbolIcon className="w-4 h-4 text-base-content/50" />
        }

        return <ClockIcon className="w-4 h-4 text-warning" />
    }


    // =============================================================
    // STATUS CLASS
    // =============================================================

    const getStatusClass = (status) => {
        if (status === 'Approved') {
            return 'text-success bg-success/10 border-success/20'
        }

        if (status === 'Rejected') {
            return 'text-error bg-error/10 border-error/20'
        }

        if (status === 'Cancelled') {
            return 'text-base-content/60 bg-base-200 border-base-300'
        }

        return 'text-warning bg-warning/10 border-warning/20'
    }


    // =============================================================
    // RENDER
    // =============================================================

    return (
        <>
            <div className="card bg-base-100 border border-base-300 shadow-sm h-full">
                <div className="card-body p-4 sm:p-5">

                    {/* Header */}

                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <CalendarDaysIcon className="w-4 h-4 text-primary" />
                                    </div>

                                    <h2 className="text-base font-semibold">
                                        Leave Management
                                    </h2>
                                </div>

                                <p className="text-xs text-base-content/50 mt-2">
                                    Manage your leave requests
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleOpenApplyModal}
                                className="btn btn-sm btn-primary shrink-0"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Apply Leave
                            </button>
                        </div>

                        {/* Leave Balance */}

                        <div className="rounded-xl border border-base-300 bg-base-200/30 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-base-content/50">
                                        Available Leaves
                                    </p>

                                    <p className="text-2xl font-semibold mt-1">
                                        {leaveBalance.available_days}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-base-content/50">
                                        Approved / Accrued
                                    </p>

                                    <p className="text-sm font-semibold mt-1">
                                        {leaveBalance.approved_days} / {leaveBalance.total_accrued}
                                    </p>

                                    <p className="text-xs text-base-content/50 mt-1">
                                        Pending: {leaveBalance.pending_days}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{
                                            width: `${
                                                Number(leaveBalance.total_accrued) > 0
                                                    ? Math.min(
                                                        (
                                                            (
                                                                Number(leaveBalance.approved_days) +
                                                                Number(leaveBalance.pending_days)
                                                            ) /
                                                            Number(leaveBalance.total_accrued)
                                                        ) * 100,
                                                        100
                                                    )
                                                    : 0
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leave Requests */}

                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">
                                Leave Requests
                            </h3>

                            <span className="text-xs text-base-content/50">
                                {leaveRequests.length} requests
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <span className="loading loading-spinner loading-md text-primary" />
                            </div>
                        ) : leaveRequests.length === 0 ? (
                            <div className="text-center py-10">
                                <CalendarDaysIcon className="w-8 h-8 mx-auto text-base-content/30" />

                                <p className="text-sm font-medium mt-3">
                                    No leave requests
                                </p>

                                <p className="text-xs text-base-content/50 mt-1">
                                    Your submitted leave requests will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Period</th>
                                            <th>Type</th>
                                            <th>Days</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {leaveRequests.map((request) => (
                                            <tr key={request.id}>
                                                <td>
                                                    <div>
                                                        <p className="text-sm font-medium whitespace-nowrap">
                                                            {formatDate(request.fromDate)}
                                                        </p>

                                                        {request.fromDate !== request.toDate && (
                                                            <p className="text-xs text-base-content/50 mt-0.5 whitespace-nowrap">
                                                                to {formatDate(request.toDate)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="text-xs whitespace-nowrap">
                                                        {request.category}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="text-sm">
                                                        {request.days}
                                                    </span>
                                                </td>

                                                <td>
                                                    <p className="text-sm max-w-[180px] truncate">
                                                        {request.reason}
                                                    </p>
                                                </td>

                                                <td>
                                                    <div
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-2.5
                                                            py-1
                                                            rounded-full
                                                            border
                                                            text-xs
                                                            font-medium
                                                            ${getStatusClass(request.status)}
                                                        `}
                                                    >
                                                        {getStatusIcon(request.status)}
                                                        {request.status}
                                                    </div>
                                                </td>

                                                <td>
                                                    {request.status === 'Pending' ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEdit(request)}
                                                                className="btn btn-xs btn-ghost"
                                                                title="Edit leave"
                                                                disabled={processingLeaveId === request.id}
                                                            >
                                                                <PencilSquareIcon className="w-4 h-4" />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleCancel(request)}
                                                                className="btn btn-xs btn-ghost text-error"
                                                                title="Cancel leave"
                                                                disabled={processingLeaveId === request.id}
                                                            >
                                                                {processingLeaveId === request.id ? (
                                                                    <span className="loading loading-spinner loading-xs" />
                                                                ) : (
                                                                    <XCircleIcon className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-base-content/40">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply / Update Leave Modal */}

            {showModal && (
                <Suspense fallback={null}>
                    <LeaveApplicationModal
                        onClose={() => {
                            if (!submitting) {
                                setShowModal(false)
                                setEditingRequest(null)
                            }
                        }}
                        onSubmit={handleSubmit}
                        initialData={editingRequest}
                        submitting={submitting}
                    />
                </Suspense>
            )}

            {/* Global Feedback Modal */}

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={closeFeedback}
            />
        </>
    )
}

export default LeaveManagement
