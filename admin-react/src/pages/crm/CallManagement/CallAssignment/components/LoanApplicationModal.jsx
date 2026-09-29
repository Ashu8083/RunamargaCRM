// admin-react/src/pages/CallManagement/CallAssignment/components/LoanApplicationModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'


// =============================================================
// STATUS
// =============================================================

const getStatusClass = (status) => {

    const value =
        String(status || '')
            .trim()
            .toLowerCase()


    if (
        value === 'approved' ||
        value === 'disbursed' ||
        value === 'active'
    ) {

        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (
        value === 'pending' ||
        value === 'in_progress' ||
        value === 'in progress'
    ) {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }


    if (
        value === 'rejected' ||
        value === 'cancelled'
    ) {

        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// FORMAT STATUS
// =============================================================

const formatStatus = (status) => {

    if (!status) {
        return '—'
    }


    return String(status)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        )

}


// =============================================================
// DETAIL ITEM
// =============================================================

const Detail = ({
    label,
    value,
}) => {

    return (

        <div>

            <p className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-base-content/40
            ">
                {label}
            </p>


            <p className="
                mt-1
                text-sm
                font-medium
                text-base-content
            ">
                {value || '—'}
            </p>

        </div>

    )

}


// =============================================================
// LOAN APPLICATION MODAL
// =============================================================

function LoanApplicationModal({
    open = false,
    application = null,
    onClose,
}) {

    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // DATA
    // =========================================================

    const data =
        application || {}


    const applicantName =
        data.name ||
        data.applicantName ||
        'Unknown'


    const phone =
        data.phone ||
        data.contact ||
        data.number ||
        '—'


    const applicationStatus =
        data.loanStatus ||
        data.applicationStatus ||
        data.status ||
        'Pending'


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        onClose?.()

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[110]
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
                border
                border-base-300
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
                    px-5
                    py-4
                    sm:px-6
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
                            rounded-lg
                            bg-[#8BCF00]/10
                        ">

                            <DocumentTextIcon className="
                                h-5
                                w-5
                                text-[#6FA800]
                            " />

                        </div>


                        <div className="min-w-0">

                            <h2 className="
                                truncate
                                text-lg
                                font-semibold
                                text-base-content
                            ">
                                Loan Application
                            </h2>


                            <p className="
                                mt-0.5
                                truncate
                                text-xs
                                text-base-content/45
                            ">
                                {applicantName} • {phone}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
                            transition
                            hover:bg-base-200
                            hover:text-base-content
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
                    p-5
                    sm:p-6
                ">

                    {/* =================================================
                        APPLICANT
                    ================================================= */}

                    <div className="
                        mb-5
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/20
                        p-5
                    ">

                        <div className="
                            mb-4
                            flex
                            items-center
                            justify-between
                            gap-3
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-base-content
                                ">
                                    Applicant Details
                                </p>


                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-base-content/45
                                ">
                                    Basic application information
                                </p>

                            </div>


                            <span
                                className={[
                                    'shrink-0',
                                    'rounded-full',
                                    'border',
                                    'px-2.5',
                                    'py-1',
                                    'text-xs',
                                    'font-medium',
                                    getStatusClass(
                                        applicationStatus
                                    ),
                                ].join(' ')}
                            >
                                {formatStatus(
                                    applicationStatus
                                )}
                            </span>

                        </div>


                        <div className="
                            grid
                            grid-cols-1
                            gap-x-6
                            gap-y-4
                            sm:grid-cols-2
                        ">

                            <Detail
                                label="Name"
                                value={
                                    applicantName
                                }
                            />


                            <Detail
                                label="Phone"
                                value={
                                    phone
                                }
                            />


                            <Detail
                                label="Loan Type"
                                value={
                                    data.loanType
                                }
                            />


                            <Detail
                                label="Loan Amount"
                                value={
                                    data.loanAmount
                                        ? `₹ ${data.loanAmount}`
                                        : '—'
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        ASSIGNMENT
                    ================================================= */}

                    <div className="
                        mb-5
                        rounded-xl
                        border
                        border-base-300
                        p-5
                    ">

                        <p className="
                            mb-4
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            Assignment Details
                        </p>


                        <div className="
                            grid
                            grid-cols-1
                            gap-x-6
                            gap-y-4
                            sm:grid-cols-2
                        ">

                            <Detail
                                label="RM"
                                value={
                                    data.rm ||
                                    data.rmName
                                }
                            />


                            <Detail
                                label="Agent"
                                value={
                                    data.agent ||
                                    data.agentName
                                }
                            />


                            <Detail
                                label="Applied Date"
                                value={
                                    data.appliedDate
                                }
                            />


                            <Detail
                                label="Assigned Date"
                                value={
                                    data.assignedDate
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        CALL DETAILS
                    ================================================= */}

                    <div className="
                        rounded-xl
                        border
                        border-base-300
                        p-5
                    ">

                        <p className="
                            mb-4
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            Call Details
                        </p>


                        <div className="
                            grid
                            grid-cols-1
                            gap-x-6
                            gap-y-4
                            sm:grid-cols-2
                        ">

                            <Detail
                                label="Call Status"
                                value={
                                    formatStatus(
                                        data.callStatus
                                    )
                                }
                            />


                            <Detail
                                label="Attempts"
                                value={
                                    data.attempts
                                }
                            />


                            <Detail
                                label="Last Called"
                                value={
                                    data.lastCalled
                                }
                            />


                            <Detail
                                label="Application ID"
                                value={
                                    data.applicationId ||
                                    data.id
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    justify-end
                    border-t
                    border-base-300
                    px-5
                    py-4
                    sm:px-6
                ">

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            h-9
                            rounded-lg
                            bg-[#8BCF00]
                            px-5
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}


export default LoanApplicationModal