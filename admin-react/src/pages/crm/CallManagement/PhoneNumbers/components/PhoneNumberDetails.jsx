// admin-react/src/pages/CallManagement/PhoneNumbers/components/PhoneNumberDetails.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'


function PhoneNumberDetails({
    open,
    phoneNumber,
    onClose,
}) {

    // =========================================================
    // CLOSED
    // =========================================================

    if (!open || !phoneNumber) {
        return null
    }


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === 'Active') {

            return `
                border-[#8BCF00]/40
                bg-[#8BCF00]/10
                text-[#78B300]
            `

        }


        return `
            border-error/30
            bg-error/5
            text-error
        `

    }


    // =========================================================
    // TRACKABLE
    // =========================================================

    const isTrackable =
        phoneNumber.trackable === true ||
        phoneNumber.trackable === 'Yes'


    // =========================================================
    // ASSIGNMENT HISTORY
    // =========================================================

    const assignmentHistory =
        phoneNumber.assignmentHistory || []


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
                max-w-2xl
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
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#8BCF00]/10
                        ">

                            <PhoneIcon className="
                                h-5
                                w-5
                                text-[#78B300]
                            " />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">
                                Phone Number Details
                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                View phone number assignment details.
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
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    max-h-[70vh]
                    space-y-5
                    overflow-y-auto
                    p-5
                ">

                    {/* =================================================
                        PHONE NUMBER
                    ================================================= */}

                    <div className="
                        rounded-lg
                        border
                        border-base-300
                        bg-base-200/30
                        p-4
                    ">

                        <div className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    text-base-content/50
                                ">
                                    Phone Number
                                </p>


                                <p className="
                                    mt-1
                                    text-xl
                                    font-semibold
                                ">
                                    {phoneNumber.number ||
                                        phoneNumber.phone ||
                                        'N/A'
                                    }
                                </p>

                            </div>


                            <span className={`
                                inline-flex
                                items-center
                                rounded-full
                                border
                                px-3
                                py-1
                                text-xs
                                font-medium
                                ${getStatusClass(
                                    phoneNumber.status
                                )}
                            `}>

                                <span className="
                                    mr-1.5
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-current
                                " />

                                {phoneNumber.status ||
                                    'Inactive'
                                }

                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        ASSIGNMENT DETAILS
                    ================================================= */}

                    <section>

                        <h4 className="
                            mb-3
                            text-sm
                            font-semibold
                        ">
                            Assignment Details
                        </h4>


                        <div className="
                            overflow-hidden
                            rounded-lg
                            border
                            border-base-300
                        ">

                            {/* Employee */}

                            <div className="
                                flex
                                items-center
                                gap-3
                                border-b
                                border-base-300
                                px-4
                                py-3
                            ">

                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-base-200
                                ">

                                    <UserIcon className="
                                        h-4
                                        w-4
                                        text-base-content/50
                                    " />

                                </div>


                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Employee
                                    </p>


                                    <p className="
                                        mt-0.5
                                        text-sm
                                        font-medium
                                    ">
                                        {phoneNumber.employeeName ||
                                            phoneNumber.employee?.name ||
                                            'Not Assigned'
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* Team */}

                            <div className="
                                flex
                                items-center
                                gap-3
                                border-b
                                border-base-300
                                px-4
                                py-3
                            ">

                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-base-200
                                ">

                                    <UserGroupIcon className="
                                        h-4
                                        w-4
                                        text-base-content/50
                                    " />

                                </div>


                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Team
                                    </p>


                                    <p className="
                                        mt-0.5
                                        text-sm
                                        font-medium
                                    ">
                                        {phoneNumber.teamName ||
                                            phoneNumber.team?.name ||
                                            'Not Assigned'
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* Trackable */}

                            <div className="
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                            ">

                                <div className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-base-200
                                ">

                                    <CheckCircleIcon className="
                                        h-4
                                        w-4
                                        text-base-content/50
                                    " />

                                </div>


                                <div className="
                                    min-w-0
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Trackable
                                    </p>


                                    <p className={`
                                        mt-0.5
                                        text-sm
                                        font-medium
                                        ${
                                            isTrackable
                                                ? 'text-[#78B300]'
                                                : 'text-base-content/70'
                                        }
                                    `}>

                                        {isTrackable
                                            ? 'Yes'
                                            : 'No'
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        ASSIGNMENT DATE
                    ================================================= */}

                    <section>

                        <h4 className="
                            mb-3
                            text-sm
                            font-semibold
                        ">
                            Assignment Information
                        </h4>


                        <div className="
                            rounded-lg
                            border
                            border-base-300
                            bg-base-200/30
                            px-4
                            py-3
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <ClockIcon className="
                                    h-5
                                    w-5
                                    shrink-0
                                    text-base-content/40
                                " />


                                <div>

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Assigned On
                                    </p>


                                    <p className="
                                        mt-0.5
                                        text-sm
                                        font-medium
                                    ">
                                        {phoneNumber.assignedAt ||
                                            'N/A'
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        ASSIGNMENT HISTORY
                    ================================================= */}

                    <section>

                        <div className="
                            mb-3
                            flex
                            items-center
                            justify-between
                            gap-3
                        ">

                            <div>

                                <h4 className="
                                    text-sm
                                    font-semibold
                                ">
                                    Assignment History
                                </h4>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-base-content/50
                                ">
                                    Previous employee assignments.
                                </p>

                            </div>


                            {assignmentHistory.length > 0 && (

                                <span className="
                                    rounded-full
                                    bg-base-200
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                ">
                                    {assignmentHistory.length}
                                </span>

                            )}

                        </div>


                        {assignmentHistory.length === 0 ? (

                            <div className="
                                rounded-lg
                                border
                                border-base-300
                                py-8
                                text-center
                            ">

                                <ClockIcon className="
                                    mx-auto
                                    h-7
                                    w-7
                                    text-base-content/30
                                " />


                                <p className="
                                    mt-3
                                    text-sm
                                    font-medium
                                ">
                                    No assignment history
                                </p>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-base-content/50
                                ">
                                    Previous assignments will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                            ">

                                {assignmentHistory.map(
                                    (history, index) => (

                                        <div
                                            key={
                                                history.id ||
                                                `${history.employeeId}-${index}`
                                            }
                                            className={`
                                                px-4
                                                py-3
                                                ${
                                                    index !==
                                                    assignmentHistory.length - 1
                                                        ? 'border-b border-base-300'
                                                        : ''
                                                }
                                            `}
                                        >

                                            <div className="
                                                flex
                                                items-start
                                                gap-3
                                            ">

                                                {/* Timeline */}

                                                <div className="
                                                    mt-1
                                                    flex
                                                    shrink-0
                                                    flex-col
                                                    items-center
                                                ">

                                                    <span className="
                                                        h-2.5
                                                        w-2.5
                                                        rounded-full
                                                        bg-[#8BCF00]
                                                    " />

                                                    {index !==
                                                        assignmentHistory.length - 1 && (

                                                        <span className="
                                                            mt-1
                                                            h-8
                                                            w-px
                                                            bg-base-300
                                                        " />

                                                    )}

                                                </div>


                                                {/* History */}

                                                <div className="
                                                    min-w-0
                                                    flex-1
                                                ">

                                                    <div className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        justify-between
                                                        gap-2
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            font-semibold
                                                        ">
                                                            {history.employeeName ||
                                                                history.employee?.name ||
                                                                'Unknown Employee'
                                                            }
                                                        </p>


                                                        <span className="
                                                            text-xs
                                                            text-base-content/50
                                                        ">
                                                            {history.date ||
                                                                history.assignedAt ||
                                                                'N/A'
                                                            }
                                                        </span>

                                                    </div>


                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-base-content/60
                                                    ">
                                                        {history.action ||
                                                            'Assigned'
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    justify-end
                    border-t
                    border-base-300
                    p-4
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

                <button type="button">
                    close
                </button>

            </form>

        </dialog>

    )
}


export default PhoneNumberDetails