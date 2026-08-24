// admin-react/src/pages/Loans/PendingApplications/components/ReminderModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon'


function ReminderModal({
    open,
    application,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        note: '',
    })

    const [error, setError] = useState('')


    // =========================================================
    // LOAD APPLICATION
    // =========================================================

    useEffect(() => {

        if (!open || !application) {

            setFormData({
                date: '',
                time: '',
                note: '',
            })

            setError('')

            return
        }


        setFormData({
            date: '',
            time: '',
            note: '',
        })

        setError('')

    }, [open, application])


    // =========================================================
    // CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }))


        setError('')
    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        if (!formData.date) {

            setError('Reminder date is required.')

            return
        }


        if (!formData.time) {

            setError('Reminder time is required.')

            return
        }


        if (!formData.note.trim()) {

            setError('Reminder note is required.')

            return
        }


        onSubmit?.({

            applicationId: application.id,

            loanId:
                application.loanId ||
                application.loan_id ||
                application.id,

            agentId:
                application.agentId ||
                application.agent_id ||
                null,

            date: formData.date,

            time: formData.time,

            note: formData.note.trim(),

        })

    }


    // =========================================================
    // MODAL
    // =========================================================

    if (!open || !application) {
        return null
    }


    return (

        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="
                modal-box
                w-11/12
                max-w-lg
                p-0
                bg-base-100
                border
                border-base-300
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    p-5
                    border-b
                    border-base-300
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#8BCF00]/10
                            flex
                            items-center
                            justify-center
                        ">

                            <BellAlertIcon className="
                                w-5
                                h-5
                                text-[#78B300]
                            " />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">
                                Add Reminder
                            </h3>


                            <p className="
                                text-xs
                                text-base-content/50
                                mt-1
                            ">
                                Schedule a reminder for this application.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
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


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        p-5
                        space-y-5
                    ">

                        {/* =================================================
                            APPLICATION
                        ================================================= */}

                        <div className="
                            rounded-lg
                            border
                            border-base-300
                            bg-base-200/30
                            px-4
                            py-3
                        ">

                            <p className="
                                text-xs
                                text-base-content/50
                            ">
                                Application
                            </p>


                            <p className="
                                text-sm
                                font-semibold
                                mt-1
                            ">
                                {application.name || 'N/A'}
                            </p>


                            <p className="
                                text-xs
                                text-base-content/50
                                mt-0.5
                            ">
                                {application.phone || 'N/A'}
                            </p>


                            {(application.loanId ||
                                application.loan_id) && (

                                <p className="
                                    text-[11px]
                                    text-base-content/40
                                    mt-1
                                ">
                                    Loan ID:{' '}
                                    {application.loanId ||
                                        application.loan_id}
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            DATE + TIME
                        ================================================= */}

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                        ">

                            {/* Date */}

                            <div>

                                <label className="label px-0">

                                    <span className="
                                        label-text
                                        text-sm
                                        font-medium
                                    ">
                                        Reminder Date
                                    </span>

                                </label>


                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                />

                            </div>


                            {/* Time */}

                            <div>

                                <label className="label px-0">

                                    <span className="
                                        label-text
                                        text-sm
                                        font-medium
                                    ">
                                        Reminder Time
                                    </span>

                                </label>


                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
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


                        {/* =================================================
                            NOTE
                        ================================================= */}

                        <div>

                            <label className="label px-0">

                                <span className="
                                    label-text
                                    text-sm
                                    font-medium
                                ">
                                    Reminder Note
                                </span>

                            </label>


                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows={4}
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


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="
                                rounded-lg
                                border
                                border-error/20
                                bg-error/5
                                px-3
                                py-2
                            ">

                                <p className="
                                    text-xs
                                    text-error
                                ">
                                    {error}
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        justify-end
                        gap-2
                        p-4
                        border-t
                        border-base-300
                    ">

                        <button
                            type="button"
                            onClick={onClose}
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
                            Add Reminder
                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                BACKDROP
            ================================================= */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={onClose}
            >

                <button type="button">
                    close
                </button>

            </form>

        </dialog>

    )

}


export default ReminderModal