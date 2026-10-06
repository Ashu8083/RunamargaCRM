// admin-react/src/pages/crm/Loans/AgentApplications/components/ReminderModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'

import apiClient from '../../../app/apiClient'
import { useToast } from '../../../components/Toast/ToastProvider'

function ReminderModal({
    open,
    applicationId,
    application,
    onClose,
    onSubmit,
}) {
    const {
        showSuccess,
        showError,
    } = useToast()

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        note: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // =========================================================
    // RESET FORM WHEN MODAL OPENS OR APPLICATION CHANGES
    // =========================================================

    useEffect(() => {
        if (!open || !applicationId) {
            setFormData({
                date: '',
                time: '',
                note: '',
            })

            setError('')
            setLoading(false)

            return
        }

        setFormData({
            date: '',
            time: '',
            note: '',
        })

        setError('')
        setLoading(false)
    }, [open, applicationId])

    // =========================================================
    // CHANGE FORM VALUES
    // =========================================================

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))

        setError('')
    }

    // =========================================================
    // VALIDATION ERROR
    // =========================================================

    const showValidationError = (message) => {
        setError(message)
        showError(message)
    }

    // =========================================================
    // SUBMIT REMINDER
    // =========================================================

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (loading) {
            return
        }

        // =====================================================
        // APPLICATION ID
        // =====================================================

        if (
            applicationId === null ||
            applicationId === undefined ||
            applicationId === ''
        ) {
            showValidationError(
                'Application information is missing.'
            )
            return
        }

        const parsedApplicationId = Number(applicationId)

        if (
            !Number.isSafeInteger(parsedApplicationId) ||
            parsedApplicationId <= 0
        ) {
            showValidationError('Invalid application ID.')
            return
        }

        // =====================================================
        // DATE
        // =====================================================

        if (!formData.date) {
            showValidationError(
                'Reminder date is required.'
            )
            return
        }

        // =====================================================
        // TIME
        // =====================================================

        if (!formData.time) {
            showValidationError(
                'Reminder time is required.'
            )
            return
        }

        // =====================================================
        // NOTE
        // =====================================================

        if (!formData.note.trim()) {
            showValidationError(
                'Reminder note is required.'
            )
            return
        }

        // =====================================================
        // CREATE REMINDER DATETIME
        // =====================================================

        const reminderDateTime = new Date(
            `${formData.date}T${formData.time}`
        )

        if (Number.isNaN(reminderDateTime.getTime())) {
            showValidationError(
                'Invalid reminder date or time.'
            )
            return
        }

        // =====================================================
        // PREVENT PAST REMINDERS
        // =====================================================

        if (reminderDateTime.getTime() <= Date.now()) {
            showValidationError(
                'Reminder date and time must be in the future.'
            )
            return
        }

        // =====================================================
        // START LOADING
        // =====================================================

        setLoading(true)
        setError('')

        // =====================================================
        // SAVE REMINDER DIRECTLY FROM THIS COMPONENT
        // =====================================================

        try {
            const response = await apiClient({
                method: 'POST',
                url: '/reminders',
                data: {
                    application_id: parsedApplicationId,
                    reminder_at: reminderDateTime.toISOString(),
                    note: formData.note.trim(),
                },
            })

            // =================================================
            // SUCCESS CALLBACK
            // =================================================

            if (typeof onSubmit === 'function') {
                onSubmit(response.data)
            }

            // =================================================
            // RESET FORM
            // =================================================

            setFormData({
                date: '',
                time: '',
                note: '',
            })

            setError('')

            // =================================================
            // SHOW SUCCESS TOAST
            // =================================================

            showSuccess('Reminder created successfully.')

            // =================================================
            // CLOSE MODAL
            // =================================================

            if (typeof onClose === 'function') {
                onClose()
            }
        } catch (requestError) {
            console.error(
                'Failed to create reminder:',
                requestError
            )

            let errorMessage = 'Unable to create reminder.'

            const responseData = requestError?.response?.data
            const detail = responseData?.detail

            if (typeof detail === 'string') {
                errorMessage = detail
            } else if (Array.isArray(detail)) {
                const messages = detail
                    .map((item) => item?.msg)
                    .filter(Boolean)

                if (messages.length > 0) {
                    errorMessage = messages.join(', ')
                }
            } else if (
                typeof responseData?.message === 'string'
            ) {
                errorMessage = responseData.message
            }

            // Preserve the inline error and show a toast.
            setError(errorMessage)
            showError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // MODAL VISIBILITY
    // =========================================================

    if (!open || !application) {
        return null
    }

    // =========================================================
    // MINIMUM DATE
    // =========================================================

    const minimumDate = new Date()
        .toISOString()
        .split('T')[0]

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >
            <div
                className="
                    modal-box
                    w-11/12
                    max-w-lg
                    p-0
                    bg-base-100
                    border
                    border-base-300
                "
            >
                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-5
                        border-b
                        border-base-300
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                w-9
                                h-9
                                rounded-lg
                                bg-[#8BCF00]/10
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <BellAlertIcon
                                className="
                                    w-5
                                    h-5
                                    text-[#78B300]
                                "
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold">
                                Add Reminder
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-base-content/50
                                    mt-1
                                "
                            >
                                Schedule a reminder for this application.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                        "
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* FORM */}

                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-5">

                        {/* APPLICATION DETAILS */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-base-300
                                bg-base-200/30
                                px-4
                                py-3
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-base-content/50
                                "
                            >
                                Application
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    mt-1
                                "
                            >
                                {application.name || 'N/A'}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-base-content/50
                                    mt-0.5
                                "
                            >
                                {application.phone || 'N/A'}
                            </p>

                            {(application.loanId ||
                                application.loan_id) && (
                                <p
                                    className="
                                        text-[11px]
                                        text-base-content/40
                                        mt-1
                                    "
                                >
                                    Loan ID:{' '}
                                    {application.loanId ||
                                        application.loan_id}
                                </p>
                            )}
                        </div>

                        {/* DATE AND TIME */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            "
                        >
                            {/* DATE */}

                            <div>
                                <label className="label px-0">
                                    <span
                                        className="
                                            label-text
                                            text-sm
                                            font-medium
                                        "
                                    >
                                        Reminder Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={minimumDate}
                                    disabled={loading}
                                    required
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                />
                            </div>

                            {/* TIME */}

                            <div>
                                <label className="label px-0">
                                    <span
                                        className="
                                            label-text
                                            text-sm
                                            font-medium
                                        "
                                    >
                                        Reminder Time
                                    </span>
                                </label>

                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    disabled={loading}
                                    required
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                />
                            </div>
                        </div>

                        {/* REMINDER NOTE */}

                        <div>
                            <label className="label px-0">
                                <span
                                    className="
                                        label-text
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Reminder Note
                                </span>
                            </label>

                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows={4}
                                maxLength={5000}
                                disabled={loading}
                                required
                                placeholder="e.g. Follow up with customer regarding documents..."
                                className="
                                    textarea
                                    textarea-bordered
                                    w-full
                                    resize-none
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                            />
                        </div>

                        {/* INLINE ERROR */}

                        {error && (
                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-error/20
                                    bg-error/5
                                    px-3
                                    py-2
                                "
                            >
                                <p className="text-xs text-error">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-2
                            p-4
                            border-t
                            border-base-300
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                btn
                                btn-sm
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                            "
                        >
                            {loading
                                ? 'Saving...'
                                : 'Add Reminder'}
                        </button>
                    </div>
                </form>
            </div>

            {/* BACKDROP */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={
                    loading
                        ? (event) => event.preventDefault()
                        : onClose
                }
            >
                <button
                    type="button"
                    disabled={loading}
                >
                    close
                </button>
            </form>
        </dialog>
    )
}

export default ReminderModal