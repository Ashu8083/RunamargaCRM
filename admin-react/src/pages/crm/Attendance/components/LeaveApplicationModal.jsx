// admin-react/src/pages/Attendance/components/LeaveApplicationModal.jsx

import { useEffect, useState } from 'react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'

function LeaveApplicationModal({
    onClose,
    onSubmit,
    initialData = null,
    submitting = false,
}) {

    const [formData, setFormData] = useState({
        category: '',
        fromDate: '',
        toDate: '',
        reason: '',
    })

    const [error, setError] = useState('')


    // =============================================================
    // INITIALIZE FORM FOR APPLY / EDIT
    // =============================================================

    useEffect(() => {
        setFormData({
            category: initialData?.category || '',
            fromDate: initialData?.fromDate || '',
            toDate: initialData?.toDate || '',
            reason: initialData?.reason || '',
        })

        setError('')
    }, [initialData])


    // =============================================================
    // FORM CHANGE
    // =============================================================

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))

        setError('')
    }


    // =============================================================
    // FORM SUBMIT
    // =============================================================

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!formData.category) {
            setError('Please select a leave type.')
            return
        }

        if (!formData.fromDate || !formData.toDate) {
            setError('Please select the leave dates.')
            return
        }

        if (formData.toDate < formData.fromDate) {
            setError('To date cannot be earlier than from date.')
            return
        }

        if (!formData.reason.trim()) {
            setError('Please enter the reason for the request.')
            return
        }

        if (formData.category === 'Half Day Leave') {
            setError(
                'Half Day Leave is not currently supported by the backend. Please select Full Day Leave or Work From Home.'
            )
            return
        }

        onSubmit?.({
            ...formData,
            reason: formData.reason.trim(),
        })
    }


    // =============================================================
    // RENDER
    // =============================================================

    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="modal-box w-11/12 max-w-lg p-0 bg-base-100">

                {/* Header */}

                <div className="flex items-start justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CalendarDaysIcon className="w-4 h-4 text-primary" />
                        </div>

                        <div>

                            <h3 className="text-lg font-semibold">
                                {initialData ? 'Update Leave Request' : 'Apply for Leave'}
                            </h3>

                            <p className="text-xs text-base-content/50 mt-0.5">
                                {initialData
                                    ? 'Update your pending leave request'
                                    : 'Submit a request for approval'}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                </div>


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    <div className="p-5 space-y-5">

                        {/* Request Type */}

                        <div>

                            <label className="label px-0">
                                <span className="label-text text-sm font-medium">
                                    Request Type
                                </span>
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                disabled={submitting}
                                required
                            >

                                <option value="" disabled>
                                    Select request type
                                </option>

                                <option value="Full Day Leave">
                                    Full Day Leave
                                </option>

                                <option value="Half Day Leave">
                                    Half Day Leave
                                </option>

                                <option value="WFH">
                                    Work From Home
                                </option>

                            </select>

                            {formData.category === 'Half Day Leave' && (
                                <p className="text-xs text-warning mt-2">
                                    Half-day leave requires backend support before it can be submitted.
                                </p>
                            )}

                        </div>


                        {/* Dates */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div>

                                <label className="label px-0">
                                    <span className="label-text text-sm font-medium">
                                        From Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    disabled={submitting}
                                    required
                                />

                            </div>

                            <div>

                                <label className="label px-0">
                                    <span className="label-text text-sm font-medium">
                                        To Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    name="toDate"
                                    value={formData.toDate}
                                    min={formData.fromDate || undefined}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>


                        {/* Reason */}

                        <div>

                            <label className="label px-0">
                                <span className="label-text text-sm font-medium">
                                    Reason
                                </span>
                            </label>

                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter the reason for your request..."
                                rows={4}
                                className="textarea textarea-bordered w-full resize-none"
                                disabled={submitting}
                                required
                            />

                            <p className="text-[11px] text-base-content/50 mt-1.5">
                                Provide a short explanation for your request.
                            </p>

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="rounded-lg border border-error/20 bg-error/5 px-3 py-2">
                                <p className="text-xs text-error">
                                    {error}
                                </p>
                            </div>
                        )}

                    </div>


                    {/* Footer */}

                    <div className="flex justify-end gap-2 p-4 border-t border-base-300">

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost"
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-sm btn-primary"
                            disabled={
                                submitting ||
                                formData.category === 'Half Day Leave'
                            }
                        >
                            {submitting && (
                                <span className="loading loading-spinner loading-xs" />
                            )}

                            {submitting
                                ? 'Saving...'
                                : initialData
                                    ? 'Update Leave'
                                    : 'Submit for Approval'}
                        </button>

                    </div>

                </form>

            </div>


            {/* Backdrop */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={(event) => {
                    event.preventDefault()

                    if (!submitting) {
                        onClose?.()
                    }
                }}
            >
                <button type="button">
                    close
                </button>
            </form>

        </dialog>
    )
}

export default LeaveApplicationModal