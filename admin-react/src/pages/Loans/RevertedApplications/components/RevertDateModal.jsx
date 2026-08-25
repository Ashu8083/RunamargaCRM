// admin-react/src/pages/Loans/RevertedApplications/components/RevertDateModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'


function RevertDateModal({
    open,
    application,
    onClose,
    onSubmit,
}) {

    // =========================================================
    // STATE
    // =========================================================

    const [revertedDate, setRevertedDate] =
        useState('')

    const [remarks, setRemarks] =
        useState('')


    // =========================================================
    // RESET FORM WHEN MODAL OPENS
    // =========================================================

    useEffect(() => {

        if (!open) {

            setRevertedDate('')
            setRemarks('')

            return

        }


        /*
         * IMPORTANT:
         *
         * Do NOT load the existing revertedDate.
         * Do NOT load the existing remarks.
         *
         * The user must enter a new date and new remarks
         * whenever the reverted date is changed.
         */

        setRevertedDate('')
        setRemarks('')

    }, [open, application])


    // =========================================================
    // GET APPLICANT NAME
    // =========================================================

    const applicantName =
        application?.applicantName ??
        application?.applicant_name ??
        application?.name ??
        'Application'


    // =========================================================
    // GET LOAN TYPE
    // =========================================================

    const loanType =
        application?.loanType ??
        application?.loan_type ??
        'N/A'


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        if (!revertedDate) {
            return
        }


        onSubmit?.({

            ...application,

            revertedDate,

            remarks: remarks.trim(),

        })

    }


    // =========================================================
    // CLOSE
    // =========================================================

    if (!open || !application) {
        return null
    }


    // =========================================================
    // MODAL
    // =========================================================

    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div className="
                modal-box
                w-11/12
                max-w-lg
                overflow-hidden
                rounded-2xl
                border
                border-base-300
                bg-base-100
                p-0
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#8BCF00]/10
                        ">

                            <CalendarDaysIcon className="
                                h-5
                                w-5
                                text-[#78B300]
                            " />

                        </div>


                        <div className="
                            min-w-0
                        ">

                            <h3 className="
                                truncate
                                text-base
                                font-semibold
                                text-base-content
                            ">
                                Change Reverted Date
                            </h3>


                            <p className="
                                mt-0.5
                                truncate
                                text-xs
                                text-base-content/50
                            ">
                                Update the reverted date for{' '}
                                {applicantName}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            transition
                            hover:bg-base-200
                        "
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                            text-base-content/60
                        " />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        space-y-5
                        px-5
                        py-5
                    ">

                        {/* =================================================
                            APPLICATION
                        ================================================= */}

                        <div className="
                            rounded-xl
                            border
                            border-base-300
                            bg-base-200/40
                            px-4
                            py-3
                        ">

                            <p className="
                                text-[11px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-base-content/45
                            ">
                                Applicant
                            </p>


                            <p className="
                                mt-1
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                {applicantName}
                            </p>


                            <p className="
                                mt-0.5
                                text-xs
                                text-base-content/55
                            ">
                                {loanType}
                            </p>

                        </div>


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="reverted-date"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-base-content
                                "
                            >
                                New Reverted Date

                                <span className="
                                    ml-1
                                    text-error
                                ">
                                    *
                                </span>

                            </label>


                            <div className="
                                relative
                            ">

                                <CalendarDaysIcon className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    h-5
                                    w-5
                                    -translate-y-1/2
                                    text-base-content/45
                                " />


                                <input
                                    id="reverted-date"
                                    type="date"
                                    value={revertedDate}
                                    onChange={(event) =>
                                        setRevertedDate(
                                            event.target.value
                                        )
                                    }
                                    required
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        pl-10
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                />

                            </div>


                            <p className="
                                mt-1.5
                                text-[11px]
                                text-base-content/45
                            ">
                                Select the new reverted date.
                            </p>

                        </div>


                        {/* =================================================
                            REMARKS
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="reverted-remarks"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-base-content
                                "
                            >
                                Remarks
                            </label>


                            <textarea
                                id="reverted-remarks"
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Enter new remarks..."
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

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        px-5
                        py-3
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
                            disabled={!revertedDate}
                            className="
                                btn
                                btn-sm
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                                disabled:border-base-300
                                disabled:bg-base-300
                                disabled:text-base-content/40
                            "
                        >
                            Update Date
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

                <button
                    type="button"
                    aria-label="Close modal"
                >
                    close
                </button>

            </form>

        </dialog>

    )

}


export default RevertDateModal