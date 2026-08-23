// admin-react\src\pages\Attendance\components\LeaveManagement.jsx
import { useState } from 'react'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import LeaveApplicationModal from './LeaveApplicationModal'

function LeaveManagement() {

    const [showModal, setShowModal] = useState(false)

    // This will come from backend later
    const totalLeaves = 2
    const usedLeaves = 1
    const availableLeaves = totalLeaves - usedLeaves


    const [leaveRequests, setLeaveRequests] = useState([
        {
            id: 1,
            fromDate: '2026-08-10',
            toDate: '2026-08-11',
            days: 2,
            category: 'Full Day Leave',
            reason: 'Personal work',
            status: 'Approved',
        },
        {
            id: 2,
            fromDate: '2026-08-24',
            toDate: '2026-08-24',
            days: 1,
            category: 'WFH',
            reason: 'Family function',
            status: 'Pending',
        },
    ])


    const formatDate = (date) => {

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )
    }


    const handleSubmit = (data) => {

        const from = new Date(`${data.fromDate}T00:00:00`)
        const to = new Date(`${data.toDate}T00:00:00`)

        const days =
            Math.floor(
                (to - from) / (1000 * 60 * 60 * 24)
            ) + 1


        const newRequest = {
            id: Date.now(),
            fromDate: data.fromDate,
            toDate: data.toDate,
            days,
            category: data.category,
            reason: data.reason,
            status: 'Pending',
        }


        setLeaveRequests((previous) => [
            newRequest,
            ...previous,
        ])

        setShowModal(false)
    }


    const getStatusIcon = (status) => {

        if (status === 'Approved') {
            return (
                <CheckCircleIcon className="w-4 h-4 text-success" />
            )
        }

        if (status === 'Rejected') {
            return (
                <XCircleIcon className="w-4 h-4 text-error" />
            )
        }

        return (
            <ClockIcon className="w-4 h-4 text-warning" />
        )
    }


    const getStatusClass = (status) => {

        if (status === 'Approved') {
            return 'text-success bg-success/10 border-success/20'
        }

        if (status === 'Rejected') {
            return 'text-error bg-error/10 border-error/20'
        }

        return 'text-warning bg-warning/10 border-warning/20'
    }


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
                                onClick={() => setShowModal(true)}
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
                                        {availableLeaves}
                                    </p>

                                </div>


                                <div className="text-right">

                                    <p className="text-xs text-base-content/50">
                                        Used
                                    </p>

                                    <p className="text-sm font-semibold mt-1">
                                        {usedLeaves} / {totalLeaves}
                                    </p>

                                </div>

                            </div>


                            <div className="mt-3">

                                <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{
                                            width: `${totalLeaves > 0
                                                ? (usedLeaves / totalLeaves) * 100
                                                : 0
                                            }%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Requests */}

                    <div className="mt-5">

                        <div className="flex items-center justify-between mb-3">

                            <h3 className="text-sm font-semibold">
                                Leave Requests
                            </h3>

                            <span className="text-xs text-base-content/50">
                                {leaveRequests.length} requests
                            </span>

                        </div>


                        {leaveRequests.length === 0 ? (

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

                                            <th>
                                                Period
                                            </th>

                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                Days
                                            </th>

                                            <th>
                                                Reason
                                            </th>

                                            <th>
                                                Status
                                            </th>

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

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* Apply Leave Modal */}

            {showModal && (

                <LeaveApplicationModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                />

            )}

        </>
    )
}

export default LeaveManagement