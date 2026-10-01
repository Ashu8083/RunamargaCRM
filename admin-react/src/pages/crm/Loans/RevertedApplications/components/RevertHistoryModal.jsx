// admin-react/src/pages/Loans/RevertedApplications/components/RevertHistoryModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'


function RevertHistoryModal({
    open,
    application,
    onClose,
}) {

    // =========================================================
    // CLOSE
    // =========================================================

    if (!open || !application) {
        return null
    }


    // =========================================================
    // HELPERS
    // =========================================================

    const getApplicantName = () => {

        return (
            application.applicantName ??
            application.applicant_name ??
            application.name ??
            'Application'
        )

    }


    const getLoanType = () => {

        return (
            application.loanType ??
            application.loan_type ??
            'N/A'
        )

    }


    const formatDate = (value) => {

        if (!value) {
            return 'N/A'
        }


        const date = new Date(value)


        if (Number.isNaN(date.getTime())) {
            return String(value)
        }


        const day = String(
            date.getDate()
        ).padStart(2, '0')


        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0')


        const year = date.getFullYear()


        return `${day}-${month}-${year}`

    }


    const formatDateTime = (value) => {

        if (!value) {
            return 'N/A'
        }


        const date = new Date(value)


        if (Number.isNaN(date.getTime())) {
            return String(value)
        }


        const day = String(
            date.getDate()
        ).padStart(2, '0')


        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0')


        const year = date.getFullYear()


        const hours = String(
            date.getHours()
        ).padStart(2, '0')


        const minutes = String(
            date.getMinutes()
        ).padStart(2, '0')


        const seconds = String(
            date.getSeconds()
        ).padStart(2, '0')


        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

    }


    const getChangedBy = (history) => {

        return (
            history.changedBy ??
            history.changed_by ??
            history.updatedBy ??
            history.updated_by ??
            'Unknown User'
        )

    }


    const getFromDate = (history) => {

        return (
            history.fromDate ??
            history.from_date ??
            history.previousDate ??
            history.previous_date ??
            ''
        )

    }


    const getToDate = (history) => {

        return (
            history.toDate ??
            history.to_date ??
            history.newDate ??
            history.new_date ??
            ''
        )

    }


    const getRemarks = (history) => {

        return (
            history.remarks ??
            history.remark ??
            ''
        )

    }


    // =========================================================
    // HISTORY
    // =========================================================

    const history =
        Array.isArray(
            application.changeHistory
        )
            ? application.changeHistory
            : Array.isArray(
                application.change_history
            )
                ? application.change_history
                : []


    const applicantName =
        getApplicantName()


    const loanType =
        getLoanType()


    const currentDate =
        application.revertedDate ??
        application.reverted_date ??
        ''


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
                max-w-xl
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

                            <ClockIcon className="
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
                                Revert Change History
                            </h3>


                            <p className="
                                mt-0.5
                                truncate
                                text-xs
                                text-base-content/50
                            ">
                                Change details for {applicantName}
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
                    APPLICATION SUMMARY
                ================================================= */}

                <div className="
                    border-b
                    border-base-300
                    bg-base-200/30
                    px-5
                    py-4
                ">

                    <div className="
                        space-y-3
                    ">

                        {/* APPLICANT */}

                        <div>

                            <p className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-base-content/45
                            ">
                                Applicant
                            </p>


                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-base-content
                                "
                                title={applicantName}
                            >
                                {applicantName}
                            </p>

                        </div>


                        {/* LOAN TYPE */}

                        <div>

                            <p className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-base-content/45
                            ">
                                Loan Type
                            </p>


                            <p className="
                                mt-1
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                {loanType}
                            </p>

                        </div>


                        {/* CURRENT DATE */}

                        <div>

                            <p className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-base-content/45
                            ">
                                Current Reverted Date
                            </p>


                            <p className="
                                mt-1
                                flex
                                items-center
                                gap-1.5
                                text-sm
                                font-semibold
                                text-base-content
                            ">

                                <CalendarDaysIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/50
                                " />

                                {formatDate(currentDate)}

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    HISTORY CONTENT
                ================================================= */}

                <div className="
                    max-h-[55vh]
                    overflow-y-auto
                    px-5
                    py-5
                ">

                    {history.length === 0 ? (

                        <div className="
                            flex
                            min-h-[180px]
                            flex-col
                            items-center
                            justify-center
                            text-center
                        ">

                            <div className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-base-200
                            ">

                                <ClockIcon className="
                                    h-6
                                    w-6
                                    text-base-content/30
                                " />

                            </div>


                            <p className="
                                mt-4
                                text-sm
                                font-semibold
                                text-base-content/70
                            ">
                                No change history
                            </p>


                            <p className="
                                mt-1
                                max-w-sm
                                text-xs
                                text-base-content/45
                            ">
                                No reverted date changes have been
                                recorded for this application.
                            </p>

                        </div>

                    ) : (

                        <div className="
                            space-y-3
                        ">

                            {history
                                .slice()
                                .reverse()
                                .map(
                                    (
                                        historyItem,
                                        index
                                    ) => {

                                        const changedBy =
                                            getChangedBy(
                                                historyItem
                                            )


                                        const fromDate =
                                            getFromDate(
                                                historyItem
                                            )


                                        const toDate =
                                            getToDate(
                                                historyItem
                                            )


                                        const remarks =
                                            getRemarks(
                                                historyItem
                                            )


                                        const changedAt =
                                            historyItem.changedAt ??
                                            historyItem.changed_at ??
                                            historyItem.updatedAt ??
                                            historyItem.updated_at


                                        return (

                                            <div
                                                key={
                                                    historyItem.id ??
                                                    `${changedAt}-${index}`
                                                }
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-base-300
                                                    bg-base-100
                                                    p-4
                                                "
                                            >

                                                {/* =================================================
                                                    CHANGED BY / DATE TIME
                                                ================================================= */}

                                                <div className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                ">

                                                    <div className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-[#8BCF00]/10
                                                    ">

                                                        <UserIcon className="
                                                            h-4
                                                            w-4
                                                            text-[#78B300]
                                                        " />

                                                    </div>


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
                                                                changedBy
                                                            }
                                                        >
                                                            {changedBy}
                                                        </p>


                                                        <p className="
                                                            mt-0.5
                                                            text-xs
                                                            text-base-content/50
                                                        ">
                                                            Changed on{' '}
                                                            {formatDateTime(
                                                                changedAt
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>


                                                


                                                {/* =================================================
                                                    LAST REMARKS
                                                ================================================= */}

                                                {remarks && (

                                                    <div className="
                                                        mt-3
                                                        border-t
                                                        border-base-300
                                                        pt-3
                                                    ">

                                                        <p className="
                                                            text-[10px]
                                                            font-medium
                                                            uppercase
                                                            tracking-wide
                                                            text-base-content/45
                                                        ">
                                                            Remarks
                                                        </p>


                                                        <p className="
                                                            mt-1
                                                            whitespace-pre-wrap
                                                            break-words
                                                            text-sm
                                                            leading-5
                                                            text-base-content/75
                                                        ">
                                                            {remarks}
                                                        </p>

                                                    </div>

                                                )}

                                            </div>

                                        )

                                    }
                                )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    justify-end
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
                        Close
                    </button>

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


export default RevertHistoryModal