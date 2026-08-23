// admin-react/src/pages/Loans/RMApplications/components/StatusModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'


function StatusModal({
    open,
    application,
    onClose,
    onSubmit,
}) {

    const [status, setStatus] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')


    // =========================================================
    // LOAD APPLICATION
    // =========================================================

    useEffect(() => {

        if (!open || !application) {

            setStatus('')
            setRejectionReason('')

            return
        }


        setStatus(
            application.status || ''
        )

        setRejectionReason(
            application.rejectionReason ||
            application.rejection_reason ||
            ''
        )

    }, [open, application])


    // =========================================================
    // STATUS OPTIONS
    // =========================================================

    const statuses = [

        {
            value: 'Inprocess',
            title: 'Inprocess',
            description: 'Application is currently being processed.',
            className: 'text-[#78B300]',
        },

        {
            value: 'Docs Pending',
            title: 'Docs Pending',
            description: 'Waiting for required customer documents.',
            className: 'text-orange-600',
        },

        {
            value: 'Rejected',
            title: 'Rejected',
            description: 'Application cannot proceed.',
            className: 'text-error',
        },

        {
            value: 'Revert Rejected',
            title: 'Revert Rejected',
            description: 'Move the rejected application back for processing.',
            className: 'text-[#78B300]',
        },

    ]


    const requiresReason =
        status === 'Rejected' ||
        status === 'Revert Rejected'


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (value) => {

        setStatus(value)

        if (
            value !== 'Rejected' &&
            value !== 'Revert Rejected'
        ) {
            setRejectionReason('')
        }

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        if (!status) {
            return
        }


        if (requiresReason && !rejectionReason.trim()) {
            return
        }


        if (
            status === application.status &&
            !requiresReason
        ) {
            onClose?.()
            return
        }


        onSubmit?.({

            ...application,

            status,

            rejectionReason:
                requiresReason
                    ? rejectionReason.trim()
                    : '',

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
                max-w-2xl
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

                            <ArrowPathIcon className="
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
                                Update Application Status
                            </h3>


                            <p className="
                                text-xs
                                text-base-content/50
                                mt-1
                            ">
                                Select the new status for this application.
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

                        <XMarkIcon className="
                            w-5
                            h-5
                        " />

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
                            ASSIGNED LEAD
                        ================================================= */}

                        <div>

                            <p className="
                                text-xs
                                text-base-content/50
                            ">
                                Assigned Lead
                            </p>


                            <p className="
                                text-sm
                                font-semibold
                                mt-1
                            ">

                                {application.name}
                                {' '}
                                ({application.phone})

                            </p>

                        </div>


                        {/* =================================================
                            CURRENT STATUS
                        ================================================= */}

                        <div>

                            <p className="
                                text-xs
                                text-base-content/50
                                mb-2
                            ">
                                Current Status
                            </p>


                            <span className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                border
                                border-orange-300
                                bg-orange-50
                                text-orange-600
                                text-xs
                                font-medium
                            ">

                                {application.status || 'N/A'}

                            </span>

                        </div>


                        {/* =================================================
                            SELECT NEW STATUS
                        ================================================= */}

                        <div>

                            <p className="
                                text-sm
                                text-base-content/60
                                mb-3
                            ">
                                Select New Status
                            </p>


                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-3
                            ">

                                {statuses.map((item) => {

                                    const isSelected =
                                        status === item.value


                                    return (

                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    item.value
                                                )
                                            }
                                            className={`
                                                text-left
                                                rounded-xl
                                                border
                                                px-4
                                                py-4
                                                transition-all
                                                ${
                                                    isSelected
                                                        ? 'border-[#8BCF00] bg-[#8BCF00]/10 ring-1 ring-[#8BCF00]'
                                                        : 'border-base-300 hover:border-[#8BCF00]/50 hover:bg-base-200/50'
                                                }
                                            `}
                                        >

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            ">

                                                <div>

                                                    <p className={`
                                                        text-sm
                                                        font-semibold
                                                        ${item.className}
                                                    `}>
                                                        {item.title}
                                                    </p>


                                                    <p className="
                                                        text-xs
                                                        text-base-content/60
                                                        mt-1
                                                    ">
                                                        {item.description}
                                                    </p>

                                                </div>


                                                <div className={`
                                                    w-5
                                                    h-5
                                                    rounded-full
                                                    border
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                    ${
                                                        isSelected
                                                            ? 'border-[#8BCF00] bg-[#8BCF00]'
                                                            : 'border-base-300'
                                                    }
                                                `}>

                                                    {isSelected && (

                                                        <div className="
                                                            w-2
                                                            h-2
                                                            rounded-full
                                                            bg-white
                                                        " />

                                                    )}

                                                </div>

                                            </div>

                                        </button>

                                    )

                                })}

                            </div>

                        </div>


                        {/* =================================================
                            REJECTION / REVERT REJECTION REASON
                        ================================================= */}

                        {requiresReason && (

                            <div>

                                <label className="
                                    label
                                    px-0
                                ">

                                    <span className="
                                        label-text
                                        text-sm
                                        font-medium
                                    ">
                                        {status === 'Rejected'
                                            ? 'Reason for Rejection'
                                            : 'Reason for Revert Rejection'
                                        }
                                    </span>

                                    <span className="
                                        label-text-alt
                                        text-error
                                        text-xs
                                    ">
                                        Required
                                    </span>

                                </label>


                                <textarea
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        status === 'Rejected'
                                            ? 'Enter the reason for rejecting this application...'
                                            : 'Enter the reason for reverting the rejection...'
                                    }
                                    rows={4}
                                    className="
                                        textarea
                                        textarea-bordered
                                        w-full
                                        resize-none
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                    autoFocus
                                />


                                <p className="
                                    text-[11px]
                                    text-base-content/50
                                    mt-1.5
                                ">
                                    Please provide a reason before submitting.
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
                            disabled={
                                !status ||
                                (
                                    requiresReason &&
                                    !rejectionReason.trim()
                                ) ||
                                (
                                    status === application.status &&
                                    !requiresReason
                                )
                            }
                            className="
                                btn
                                btn-sm
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                                disabled:bg-base-300
                                disabled:border-base-300
                                disabled:text-base-content/40
                            "
                        >
                            Submit
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


export default StatusModal