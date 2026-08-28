// admin-react/src/pages/CallManagement/CallAssignment/components/CreateLeadModal.jsx

import { useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// MOCK LOAN TYPES
// =============================================================

const LOAN_TYPES = [
    'Personal Loan',
    'Home Loan',
    'Business Loan',
    'Vehicle Loan',
    'Education Loan',
]


// =============================================================
// CREATE LEAD MODAL
// =============================================================

function CreateLeadModal({
    open = false,
    entry = null,
    onClose,
    onCreate,
}) {

    const [name, setName] = useState('')

    const [loanType, setLoanType] = useState('')

    const [loanAmount, setLoanAmount] = useState('')

    const [remarks, setRemarks] = useState('')

    const [loading, setLoading] = useState(false)


    // =========================================================
    // PHONE
    // =========================================================

    const phone =
        entry?.phone ||
        entry?.contact ||
        entry?.number ||
        '—'


    // =========================================================
    // ASSIGNED PERSON
    // =========================================================

    const assignedTo =
        entry?.assignedToName ||
        entry?.assignedTo ||
        entry?.rmName ||
        entry?.rm ||
        'Not assigned'


    // =========================================================
    // CREATE LEAD
    // =========================================================

    const handleCreate = async () => {

        if (
            !name.trim() ||
            !loanType
        ) {
            return
        }


        setLoading(true)


        try {

            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    500
                )
            )


            onCreate?.({

                name:
                    name.trim(),

                phone,

                loanType,

                loanAmount,

                remarks:
                    remarks.trim(),

                assignedTo,

                source:
                    'Call Assignment',

            })


            handleClose()

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setName('')
        setLoanType('')
        setLoanAmount('')
        setRemarks('')
        setLoading(false)

        onClose?.()

    }


    // =========================================================
    // VALIDATION
    // =========================================================

    const canCreate =
        name.trim().length > 0 &&
        Boolean(loanType) &&
        !loading


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[120]
                flex
                items-center
                justify-center
                bg-black/45
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose()
                }

            }}
        >

            <div className="
                flex
                max-h-[92vh]
                w-full
                max-w-2xl
                flex-col
                overflow-hidden
                rounded-2xl
                bg-base-100
                shadow-2xl
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-6
                    py-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <UserPlusIcon className="
                            h-6
                            w-6
                            text-base-content
                        " />


                        <h2 className="
                            text-xl
                            font-semibold
                            text-base-content
                        ">
                            Create Lead
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-base-300
                            text-base-content/50
                            transition
                            hover:bg-base-200
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    min-h-0
                    overflow-y-auto
                    px-6
                    py-5
                ">

                    {/* =================================================
                        NAME
                    ================================================= */}

                    <div className="mb-5">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Name *
                        </label>


                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter customer name"
                            className="
                                input
                                input-bordered
                                h-14
                                min-h-14
                                w-full
                                text-base
                            "
                        />

                    </div>


                    {/* =================================================
                        PHONE
                    ================================================= */}

                    <div className="mb-5">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Phone
                        </label>


                        <input
                            type="text"
                            value={phone}
                            readOnly
                            className="
                                input
                                input-bordered
                                h-14
                                min-h-14
                                w-full
                                bg-base-200/40
                                text-base
                            "
                        />

                    </div>


                    {/* =================================================
                        LOAN TYPE
                    ================================================= */}

                    <div className="relative mb-5">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Loan Type *
                        </label>


                        <select
                            value={loanType}
                            onChange={(event) =>
                                setLoanType(
                                    event.target.value
                                )
                            }
                            className="
                                select
                                select-bordered
                                h-14
                                min-h-14
                                w-full
                                appearance-none
                                pr-10
                                text-base
                            "
                        >

                            <option value="">
                                Select loan type
                            </option>


                            {LOAN_TYPES.map(
                                (type) => (

                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>

                                )
                            )}

                        </select>


                        <ChevronDownIcon className="
                            pointer-events-none
                            absolute
                            bottom-4
                            right-4
                            h-5
                            w-5
                            text-base-content/50
                        " />

                    </div>


                    {/* =================================================
                        LOAN AMOUNT
                    ================================================= */}

                    <div className="mb-5">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Loan Amount
                        </label>


                        <input
                            type="number"
                            min="0"
                            value={loanAmount}
                            onChange={(event) =>
                                setLoanAmount(
                                    event.target.value
                                )
                            }
                            placeholder="Enter loan amount"
                            className="
                                input
                                input-bordered
                                h-14
                                min-h-14
                                w-full
                                text-base
                            "
                        />

                    </div>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

                    <div className="mb-5">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Remarks
                        </label>


                        <textarea
                            value={remarks}
                            onChange={(event) =>
                                setRemarks(
                                    event.target.value
                                )
                            }
                            placeholder="Enter remarks"
                            rows={3}
                            className="
                                textarea
                                textarea-bordered
                                min-h-[100px]
                                w-full
                                resize-none
                                text-base
                            "
                        />

                    </div>


                    {/* =================================================
                        ASSIGNMENT INFO
                    ================================================= */}

                    <div className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        bg-sky-50
                        px-4
                        py-4
                        text-sky-700
                    ">

                        <InformationCircleIcon className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                        " />


                        <p className="
                            text-sm
                        ">

                            Lead will be assigned to:{' '}

                            <strong>
                                {assignedTo}
                            </strong>

                        </p>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-end
                    gap-3
                    border-t
                    border-base-300
                    px-6
                    py-4
                ">

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            h-10
                            rounded-lg
                            px-5
                            text-sm
                            font-medium
                            text-base-content
                            transition
                            hover:bg-base-200
                        "
                    >
                        Close
                    </button>


                    <button
                        type="button"
                        disabled={!canCreate}
                        onClick={handleCreate}
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#8BCF00]
                            px-5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            disabled:cursor-not-allowed
                            disabled:bg-base-300
                            disabled:text-base-content/35
                        "
                    >

                        <UserPlusIcon className="
                            h-4
                            w-4
                        " />

                        {loading
                            ? 'Creating...'
                            : 'Create Lead'}

                    </button>

                </div>

            </div>

        </div>

    )

}


export default CreateLeadModal