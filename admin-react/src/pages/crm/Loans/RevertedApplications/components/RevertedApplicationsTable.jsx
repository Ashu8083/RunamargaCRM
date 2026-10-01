// admin-react/src/pages/Loans/RevertedApplications/components/RevertedApplicationsTable.jsx

import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ClockIcon from '@heroicons/react/24/outline/ClockIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ChatBubbleLeftRightIcon from '@heroicons/react/24/outline/ChatBubbleLeftRightIcon'


function RevertedApplicationsTable({
    applications = [],
    onChangeDate,
    onViewHistory,
    onRefresh,
}) {

    // =========================================================
    // FORMAT DATE
    // =========================================================

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


        const year = String(
            date.getFullYear()
        ).slice(-2)


        const hours = String(
            date.getHours()
        ).padStart(2, '0')


        const minutes = String(
            date.getMinutes()
        ).padStart(2, '0')


        return `${day}-${month}-${year} ${hours}:${minutes}`

    }


    // =========================================================
    // GET APPLICANT NAME
    // =========================================================

    const getApplicantName = (application) => {

        return (
            application.applicantName ??
            application.applicant_name ??
            application.name ??
            'N/A'
        )

    }


    // =========================================================
    // GET LOAN TYPE
    // =========================================================

    const getLoanType = (application) => {

        return (
            application.loanType ??
            application.loan_type ??
            'N/A'
        )

    }


    // =========================================================
    // GET LAST UPDATED REMARKS
    // =========================================================

    const getRemarks = (application) => {

        return (
            application.remarks ??
            application.remark ??
            ''
        )

    }


    // =========================================================
    // GET REVERTED BY
    // =========================================================

    const getRevertedBy = (application) => {

        return (
            application.revertedBy ??
            application.reverted_by ??
            application.updatedBy ??
            application.updated_by ??
            'N/A'
        )

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!applications.length) {

        return (

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    px-6
                    py-12
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

                        <ArrowPathIcon className="
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
                        No reverted applications found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Try changing your filters.
                    </p>

                </div>

            </div>

        )

    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <div className="
            overflow-hidden
            rounded-xl
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                border-b
                border-base-300
                px-4
                py-3
            ">

                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Reverted Applications
                    </p>


                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/50
                    ">
                        {applications.length}{' '}
                        {applications.length === 1
                            ? 'application'
                            : 'applications'}
                    </p>

                </div>


                <button
                    type="button"
                    onClick={onRefresh}
                    title="Refresh applications"
                    aria-label="Refresh applications"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-base-300
                        bg-base-100
                        transition
                        hover:bg-base-200
                    "
                >

                    <ArrowPathIcon className="
                        h-5
                        w-5
                        text-base-content/60
                    " />

                </button>

            </div>


            {/* =================================================
                TABLE CONTAINER
            ================================================= */}

            <div className="
                w-full
                overflow-x-auto
                touch-pan-x
                overscroll-x-contain
            ">

                <table className="
                    w-full
                    min-w-[1050px]
                    table-fixed
                    border-collapse
                ">

                    {/* =================================================
                        COLUMN WIDTHS
                    ================================================= */}

                    <colgroup>

                        <col className="w-[15%]" />

                        <col className="w-[15%]" />

                        <col className="w-[18%]" />

                        <col className="w-[25%]" />

                        <col className="w-[17%]" />

                        <col className="w-[10%]" />

                    </colgroup>


                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/50
                        ">

                            {/* APPLICANT NAME */}

                            <th className="
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Applicant Name
                            </th>


                            {/* LOAN TYPE */}

                            <th className="
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Loan Type
                            </th>


                            {/* REVERTED DATE */}

                            <th className="
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Reverted Date
                            </th>


                            {/* LAST REMARKS */}

                            <th className="
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Last Remarks
                            </th>


                            {/* REVERTED BY */}

                            <th className="
                                px-4
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Reverted By
                            </th>


                            {/* ACTIONS */}

                            <th className="
                                px-4
                                py-3
                                text-center
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody>

                        {applications.map(
                            (application, index) => {

                                const applicantName =
                                    getApplicantName(
                                        application
                                    )


                                const loanType =
                                    getLoanType(
                                        application
                                    )


                                const revertedDate =
                                    formatDate(
                                        application.revertedDate ??
                                        application.reverted_date
                                    )


                                const remarks =
                                    getRemarks(
                                        application
                                    )


                                const revertedBy =
                                    getRevertedBy(
                                        application
                                    )


                                return (

                                    <tr
                                        key={
                                            application.id ??
                                            index
                                        }
                                        className="
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                            transition
                                            hover:bg-base-200/30
                                        "
                                    >

                                        {/* =================================================
                                            APPLICANT NAME
                                        ================================================= */}

                                        <td className="
                                            px-4
                                            py-4
                                        ">

                                            <div className="
                                                min-w-0
                                            ">

                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                        text-base-content
                                                    "
                                                    title={
                                                        applicantName
                                                    }
                                                >
                                                    {applicantName}
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            LOAN TYPE
                                        ================================================= */}

                                        <td className="
                                            px-4
                                            py-4
                                        ">

                                            <span
                                                className="
                                                    inline-flex
                                                    max-w-full
                                                    items-center
                                                    truncate
                                                    rounded-full
                                                    border
                                                    border-base-300
                                                    bg-base-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-base-content
                                                "
                                                title={
                                                    loanType
                                                }
                                            >
                                                {loanType}
                                            </span>

                                        </td>


                                        {/* =================================================
                                            REVERTED DATE
                                        ================================================= */}

                                        <td className="
                                            px-4
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-2
                                            ">

                                                <CalendarDaysIcon className="
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    text-base-content/55
                                                " />


                                                <span
                                                    className="
                                                        whitespace-nowrap
                                                        text-sm
                                                        text-base-content
                                                    "
                                                    title={
                                                        revertedDate
                                                    }
                                                >
                                                    {revertedDate}
                                                </span>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            LAST REMARKS
                                        ================================================= */}

                                        <td className="
                                            px-4
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-2
                                            ">

                                                <ChatBubbleLeftRightIcon className="
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    text-base-content/55
                                                " />


                                                <span
                                                    className="
                                                        block
                                                        min-w-0
                                                        max-w-full
                                                        truncate
                                                        text-sm
                                                        text-base-content
                                                        cursor-default
                                                    "
                                                    title={
                                                        remarks ||
                                                        'No remarks'
                                                    }
                                                >
                                                    {remarks ||
                                                        'No remarks'}
                                                </span>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            REVERTED BY
                                        ================================================= */}

                                        <td className="
                                            px-4
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-2
                                            ">

                                                <span className="
                                                    flex
                                                    h-7
                                                    w-7
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-base-200
                                                ">

                                                    <span className="
                                                        text-xs
                                                        font-semibold
                                                        text-base-content/60
                                                    ">
                                                        {String(
                                                            revertedBy
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </span>

                                                </span>


                                                <span
                                                    className="
                                                        truncate
                                                        text-sm
                                                        text-base-content
                                                    "
                                                    title={
                                                        revertedBy
                                                    }
                                                >
                                                    {revertedBy}
                                                </span>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                            ">

                                                {/* =================================================
                                                    CHANGE DATE
                                                ================================================= */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onChangeDate?.(
                                                            application
                                                        )
                                                    }
                                                    title="Change reverted date"
                                                    aria-label={
                                                        `Change reverted date for ${applicantName}`
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border
                                                        border-base-300
                                                        bg-base-100
                                                        transition
                                                        hover:border-[#8BCF00]
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                >

                                                    <PencilIcon className="
                                                        h-4
                                                        w-4
                                                    " />

                                                </button>


                                                {/* =================================================
                                                    VIEW HISTORY
                                                ================================================= */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onViewHistory?.(
                                                            application
                                                        )
                                                    }
                                                    title="View change history"
                                                    aria-label={
                                                        `View change history for ${applicantName}`
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border
                                                        border-base-300
                                                        bg-base-100
                                                        transition
                                                        hover:border-[#8BCF00]
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#78B300]
                                                    "
                                                >

                                                    <ClockIcon className="
                                                        h-4
                                                        w-4
                                                    " />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default RevertedApplicationsTable