// admin-react/src/pages/Loans/DuplicateApproval/components/DuplicateApprovalModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'


function DuplicateApprovalModal({
    open,
    applications = [],
    onClose,
    onSubmit,
}) {

    // =========================================================
    // CLOSE
    // =========================================================

    if (
        !open ||
        !applications.length
    ) {
        return null
    }


    // =========================================================
    // APPLICATION COUNT
    // =========================================================

    const applicationCount =
        applications.length


    // =========================================================
    // SINGLE APPLICATION
    // =========================================================

    const isSingle =
        applicationCount === 1


    const singleApplication =
        isSingle
            ? applications[0]
            : null


    // =========================================================
    // APPLICANT NAME
    // =========================================================

    const getApplicantName = (
        application
    ) => {

        return (
            application?.applicantName ??
            application?.applicant_name ??
            application?.name ??
            'Application'
        )

    }


    // =========================================================
    // LOAN TYPE
    // =========================================================

    const getLoanType = (
        application
    ) => {

        return (
            application?.loanType ??
            application?.loan_type ??
            'N/A'
        )

    }


    // =========================================================
    // FORMAT AMOUNT
    // =========================================================

    const formatAmount = (
        amount
    ) => {

        if (
            amount === null ||
            amount === undefined ||
            amount === ''
        ) {
            return '₹0'
        }


        const numericAmount =
            Number(
                String(amount)
                    .replace(/,/g, '')
                    .replace(/₹/g, '')
            )


        if (
            Number.isNaN(
                numericAmount
            )
        ) {
            return `₹${amount}`
        }


        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            }
        ).format(
            numericAmount
        )

    }


    // =========================================================
    // HANDLE ACTION
    // =========================================================

    const handleAction = (
        action
    ) => {

        onSubmit?.(action)

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
                        min-w-0
                    ">

                        <h3 className="
                            text-base
                            font-semibold
                            text-base-content
                        ">
                            Review Application
                            {applicationCount > 1
                                ? 's'
                                : ''}
                        </h3>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">
                            {applicationCount}{' '}
                            {applicationCount === 1
                                ? 'application'
                                : 'applications'}{' '}
                            selected
                        </p>

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
                    CONTENT
                ================================================= */}

                <div className="
                    max-h-[55vh]
                    overflow-y-auto
                    px-5
                    py-5
                ">

                    {/* =================================================
                        WARNING
                    ================================================= */}

                    <div className="
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-yellow-200
                        bg-yellow-50
                        px-4
                        py-3
                    ">

                        <ExclamationTriangleIcon className="
                            mt-0.5
                            h-5
                            w-5
                            shrink-0
                            text-yellow-600
                        " />


                        <p className="
                            text-xs
                            leading-5
                            text-yellow-700
                        ">
                            Please review the selected
                            application
                            {applicationCount > 1
                                ? 's'
                                : ''}.
                            Once approved or rejected,
                            the decision cannot be changed.
                        </p>

                    </div>


                    {/* =================================================
                        SINGLE APPLICATION
                    ================================================= */}

                    {isSingle ? (

                        <div className="
                            mt-4
                            rounded-xl
                            border
                            border-base-300
                            bg-base-200/30
                            p-4
                        ">

                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            ">

                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    "
                                        title={
                                            getApplicantName(
                                                singleApplication
                                            )
                                        }
                                    >
                                        {
                                            getApplicantName(
                                                singleApplication
                                            )
                                        }
                                    </p>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-base-content/55
                                    ">
                                        {
                                            getLoanType(
                                                singleApplication
                                            )
                                        }
                                    </p>

                                </div>


                                <span className="
                                    shrink-0
                                    rounded-full
                                    border
                                    border-orange-300
                                    bg-orange-50
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-orange-600
                                ">
                                    Active
                                </span>

                            </div>


                            <div className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-3
                            ">

                                {/* AMOUNT */}

                                <div>

                                    <p className="
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-base-content/40
                                    ">
                                        Loan Amount
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        {
                                            formatAmount(
                                                singleApplication.loanAmount ??
                                                singleApplication.loan_amount ??
                                                singleApplication.amount
                                            )
                                        }
                                    </p>

                                </div>


                                {/* PHONE */}

                                <div>

                                    <p className="
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-wide
                                        text-base-content/40
                                    ">
                                        Phone
                                    </p>


                                    <p className="
                                        mt-1
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-base-content
                                    ">
                                        {
                                            singleApplication.phone ??
                                            singleApplication.mobile ??
                                            'N/A'
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    ) : (

                        /* =================================================
                           MULTIPLE APPLICATIONS
                        ================================================= */

                        <div className="
                            mt-4
                            overflow-hidden
                            rounded-xl
                            border
                            border-base-300
                        ">

                            <div className="
                                border-b
                                border-base-300
                                bg-base-200/40
                                px-4
                                py-2.5
                            ">

                                <p className="
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                ">
                                    Selected Applications
                                </p>

                            </div>


                            <div className="
                                max-h-64
                                overflow-y-auto
                            ">

                                {applications.map(
                                    (
                                        application,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                application.id ??
                                                index
                                            }
                                            className={[
                                                'flex',
                                                'items-center',
                                                'justify-between',
                                                'gap-3',
                                                'px-4',
                                                'py-3',
                                                index !== 0
                                                    ? 'border-t border-base-300'
                                                    : '',
                                            ].join(' ')}
                                        >

                                            <div className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            ">

                                                <span className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-base-200
                                                    text-xs
                                                    font-semibold
                                                    text-base-content/60
                                                ">
                                                    {String(
                                                        getApplicantName(
                                                            application
                                                        )
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>


                                                <div className="
                                                    min-w-0
                                                ">

                                                    <p className="
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                        text-base-content
                                                    "
                                                        title={
                                                            getApplicantName(
                                                                application
                                                            )
                                                        }
                                                    >
                                                        {
                                                            getApplicantName(
                                                                application
                                                            )
                                                        }
                                                    </p>


                                                    <p className="
                                                        mt-0.5
                                                        truncate
                                                        text-[11px]
                                                        text-base-content/45
                                                    ">
                                                        {
                                                            getLoanType(
                                                                application
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>


                                            <span className="
                                                shrink-0
                                                text-xs
                                                font-medium
                                                text-base-content/70
                                            ">
                                                {
                                                    formatAmount(
                                                        application.loanAmount ??
                                                        application.loan_amount ??
                                                        application.amount
                                                    )
                                                }
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    border-t
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        flex-col-reverse
                        gap-2
                        sm:flex-row
                        sm:justify-end
                    ">

                        {/* CANCEL */}

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


                        {/* REJECT */}

                        <button
                            type="button"
                            onClick={() =>
                                handleAction(
                                    'reject'
                                )
                            }
                            className="
                                flex
                                h-9
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                border
                                border-error/30
                                bg-error/5
                                px-4
                                text-xs
                                font-semibold
                                text-error
                                transition
                                hover:bg-error/10
                            "
                        >

                            <XCircleIcon className="
                                h-4
                                w-4
                            " />

                            Reject
                        </button>


                        {/* APPROVE */}

                        <button
                            type="button"
                            onClick={() =>
                                handleAction(
                                    'approve'
                                )
                            }
                            className="
                                flex
                                h-9
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                bg-[#8BCF00]
                                px-4
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#78B300]
                            "
                        >

                            <CheckCircleIcon className="
                                h-4
                                w-4
                            " />

                            Approve
                        </button>

                    </div>

                </div>

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


export default DuplicateApprovalModal