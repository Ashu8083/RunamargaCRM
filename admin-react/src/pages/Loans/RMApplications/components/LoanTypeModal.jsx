// admin-react/src/pages/Loans/RMApplications/components/LoanTypeModal.jsx
import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'


function LoanTypeModal({
    open,
    application,
    onClose,
    onSubmit,
}) {

    const [loanType, setLoanType] = useState('')


    useEffect(() => {

        if (!open || !application) {

            setLoanType('')

            return
        }


        setLoanType(
            application.loanType || ''
        )

    }, [open, application])


    if (!open || !application) {
        return null
    }


    const handleSubmit = (event) => {

        event.preventDefault()

        if (!loanType) {
            return
        }


        onSubmit?.({
            ...application,
            loanType,
        })
    }


    return (

        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="modal-box w-11/12 max-w-md p-0 bg-base-100 border border-base-300">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-3">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#8BCF00]/10
                            flex
                            items-center
                            justify-center
                        ">

                            <PencilIcon className="w-5 h-5 text-[#78B300]" />

                        </div>


                        <div>

                            <h3 className="text-lg font-semibold">
                                Change Loan Type
                            </h3>

                            <p className="text-xs text-base-content/50 mt-1">
                                Update the loan type for this application.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >

                        <XMarkIcon className="w-5 h-5" />

                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="p-5 space-y-5">


                        {/* Application */}

                        <div className="rounded-lg border border-base-300 bg-base-200/30 px-4 py-3">

                            <p className="text-xs text-base-content/50">
                                Application
                            </p>

                            <p className="text-sm font-semibold mt-1">
                                {application.name}
                            </p>

                            <p className="text-xs text-base-content/50 mt-0.5">
                                {application.phone}
                            </p>

                        </div>


                        {/* Current Loan Type */}

                        <div>

                            <p className="text-xs text-base-content/50">
                                Current Loan Type
                            </p>

                            <p className="text-sm font-medium mt-1">
                                {application.loanType || 'N/A'}
                            </p>

                        </div>


                        {/* New Loan Type */}

                        <div>

                            <label className="label px-0">

                                <span className="label-text text-sm font-medium">
                                    Select New Loan Type
                                </span>

                            </label>


                            <select
                                value={loanType}
                                onChange={(event) =>
                                    setLoanType(event.target.value)
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                            >

                                <option value="">
                                    Select Loan Type
                                </option>

                                <option value="Personal Loan">
                                    Personal Loan
                                </option>

                                <option value="Home Loan">
                                    Home Loan
                                </option>

                                <option value="Business Loan">
                                    Business Loan
                                </option>

                                <option value="Vehicle Loan">
                                    Vehicle Loan
                                </option>

                                <option value="Education Loan">
                                    Education Loan
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="flex justify-end gap-2 p-4 border-t border-base-300">

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={!loanType}
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
                            Update Loan Type
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


export default LoanTypeModal