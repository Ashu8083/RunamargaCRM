// admin-react/src/pages/Loans/DuplicateApproval/components/DuplicateApprovalTable.jsx

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'

function DuplicateApprovalTable({
    applications = [],
    selectedIds = [],
    onSelect,
    onSelectAll,
    allSelected = false,
}) {

    // =========================================================
    // FORMAT AMOUNT
    // =========================================================

    const formatAmount = (amount) => {

        if (
            amount === null ||
            amount === undefined ||
            amount === ''
        ) {
            return '₹0'
        }

        const numericAmount = Number(
            String(amount)
                .replace(/,/g, '')
                .replace(/₹/g, '')
        )

        if (Number.isNaN(numericAmount)) {
            return `₹${amount}`
        }

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(numericAmount)
    }


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

        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    }


    // =========================================================
    // FORMAT DATE + TIME
    // =========================================================

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
    // GET STATUS
    // =========================================================

    const getStatus = (application) => {

        return (
            application.status ||
            'active'
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
                        No applications found
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

            <div className="
                w-full
                overflow-x-auto
            ">

                <table className="
                    w-full
                    min-w-[900px]
                    table-fixed
                    border-collapse
                ">

                    {/* =================================================
                        COLUMN WIDTHS
                    ================================================= */}

                    <colgroup>

                        <col className="w-[5%]" />

                        <col className="w-[15%]" />

                        <col className="w-[13%]" />

                        <col className="w-[15%]" />

                        <col className="w-[13%]" />

                        <col className="w-[13%]" />

                        <col className="w-[12%]" />

                        <col className="w-[14%]" />

                    </colgroup>


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/40
                        ">

                            {/* SELECT ALL */}

                            <th className="
                                px-3
                                py-3
                                text-center
                            ">

                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onSelectAll}
                                    className="
                                        checkbox
                                        checkbox-sm
                                        border-base-content/35
                                        checked:border-[#8BCF00]
                                        checked:bg-[#8BCF00]
                                        checked:text-white
                                    "
                                    aria-label="
                                        Select all active applications
                                    "
                                />

                            </th>


                            {/* NAME */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Name
                            </th>


                            {/* PHONE */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Phone
                            </th>


                            {/* LOAN TYPE */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Loan Type
                            </th>


                            {/* LOAN AMOUNT */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Loan Amount
                            </th>


                            {/* APPLIED DATE */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Applied Date
                            </th>


                            {/* APPLIED BY */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Applied By
                            </th>


                            {/* APPROVAL / REJECTION */}

                            <th className="
                                px-3
                                py-3
                                text-left
                                text-xs
                                font-semibold
                                text-base-content
                            ">
                                Approval / Rejection
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <tbody>

                        {applications.map(
                            (application, index) => {

                                const status =
                                    getStatus(
                                        application
                                    )

                                const isActive =
                                    status === 'active'

                                const isApproved =
                                    status === 'approved'

                                const isRejected =
                                    status === 'rejected'

                                const isSelected =
                                    selectedIds.includes(
                                        application.id
                                    )


                                // -------------------------------------------------
                                // APPLICANT
                                // -------------------------------------------------

                                const applicantName =
                                    application.applicantName ||
                                    application.applicant_name ||
                                    application.name ||
                                    'N/A'


                                // -------------------------------------------------
                                // PHONE
                                // -------------------------------------------------

                                const phone =
                                    application.phone ||
                                    application.mobile ||
                                    'N/A'


                                // -------------------------------------------------
                                // LOAN TYPE
                                // -------------------------------------------------

                                const loanType =
                                    application.loanType ||
                                    application.loan_type ||
                                    'N/A'


                                // -------------------------------------------------
                                // APPLIED BY
                                // -------------------------------------------------

                                const appliedBy =
                                    application.appliedBy ||
                                    application.applied_by ||
                                    'N/A'


                                // -------------------------------------------------
                                // APPLIED DATE
                                // -------------------------------------------------

                                const appliedDate =
                                    application.appliedDate ||
                                    application.applied_date


                                // -------------------------------------------------
                                // LOAN ID
                                // -------------------------------------------------

                                const loanId =
                                    application.loanId ||
                                    application.loan_id


                                // -------------------------------------------------
                                // DECISION DATE
                                // -------------------------------------------------

                                let decisionDate = null

                                if (isApproved) {

                                    decisionDate =
                                        application.approvedDate ||
                                        application.approved_date

                                }

                                if (isRejected) {

                                    decisionDate =
                                        application.rejectedDate ||
                                        application.rejected_date

                                }


                                // -------------------------------------------------
                                // ROW CLICK
                                // -------------------------------------------------

                                const handleRowClick = () => {

                                    if (!isActive) {
                                        return
                                    }

                                    onSelect?.(
                                        application.id
                                    )

                                }


                                return (

                                    <tr
                                        key={
                                            application.id ||
                                            index
                                        }
                                        onClick={
                                            handleRowClick
                                        }
                                        className={`
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                            transition-colors
                                            ${
                                                isActive
                                                    ? 'cursor-pointer hover:bg-base-200/40'
                                                    : ''
                                            }
                                            ${
                                                isSelected
                                                    ? 'bg-[#8BCF00]/5'
                                                    : ''
                                            }
                                        `}
                                    >

                                        {/* =================================================
                                            SELECT
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                            text-center
                                        ">

                                            {isActive ? (

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        isSelected
                                                    }
                                                    onChange={() =>
                                                        onSelect?.(
                                                            application.id
                                                        )
                                                    }
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                    className="
                                                        checkbox
                                                        checkbox-sm
                                                        border-base-content/35
                                                        checked:border-[#8BCF00]
                                                        checked:bg-[#8BCF00]
                                                        checked:text-white
                                                    "
                                                    aria-label={
                                                        `Select ${applicantName}`
                                                    }
                                                />

                                            ) : (

                                                <span className="
                                                    block
                                                    h-4
                                                    w-4
                                                    mx-auto
                                                " />

                                            )}

                                        </td>


                                        {/* =================================================
                                            NAME
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
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
                                                {
                                                    applicantName
                                                }
                                            </p>

                                        </td>


                                        {/* =================================================
                                            PHONE
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/80
                                            ">
                                                {
                                                    phone
                                                }
                                            </span>

                                        </td>


                                        {/* =================================================
                                            LOAN TYPE
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            <span className="
                                                inline-flex
                                                max-w-full
                                                truncate
                                                rounded-full
                                                border
                                                border-[#8BCF00]/40
                                                bg-[#8BCF00]/10
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-[#6FA800]
                                            "
                                                title={
                                                    loanType
                                                }
                                            >
                                                {
                                                    loanType
                                                }
                                            </span>

                                        </td>


                                        {/* =================================================
                                            LOAN AMOUNT
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                                text-base-content
                                            ">
                                                {formatAmount(
                                                    application.loanAmount ||
                                                    application.loan_amount ||
                                                    application.amount
                                                )}
                                            </span>

                                        </td>


                                        {/* =================================================
                                            APPLIED DATE
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-1.5
                                            ">

                                                <CalendarDaysIcon className="
                                                    h-4
                                                    w-4
                                                    shrink-0
                                                    text-base-content/45
                                                " />

                                                <span className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        formatDate(
                                                            appliedDate
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        </td>


                                        {/* =================================================
                                            APPLIED BY
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            <span
                                                className="
                                                    block
                                                    truncate
                                                    text-sm
                                                    text-base-content
                                                "
                                                title={
                                                    appliedBy
                                                }
                                            >
                                                {
                                                    appliedBy
                                                }
                                            </span>

                                        </td>


                                        {/* =================================================
                                            APPROVAL / REJECTION
                                            + LOAN ID
                                        ================================================= */}

                                        <td className="
                                            px-3
                                            py-4
                                        ">

                                            {/* ACTIVE */}

                                            {isActive && (

                                                <span className="
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    border
                                                    border-orange-300
                                                    bg-orange-50
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-orange-600
                                                ">
                                                    Active
                                                </span>

                                            )}


                                            {/* APPROVED */}

                                            {isApproved && (

                                                <div className="
                                                    flex
                                                    items-start
                                                    gap-2
                                                ">

                                                    <CheckCircleIcon className="
                                                        mt-0.5
                                                        h-5
                                                        w-5
                                                        shrink-0
                                                        text-[#2F8132]
                                                    " />


                                                    <div className="
                                                        min-w-0
                                                    ">

                                                        <span className="
                                                            block
                                                            text-xs
                                                            font-semibold
                                                            text-[#2F8132]
                                                        ">
                                                            Approved
                                                        </span>


                                                        <span className="
                                                            mt-0.5
                                                            block
                                                            whitespace-nowrap
                                                            text-[11px]
                                                            text-base-content/45
                                                        ">
                                                            {
                                                                formatDateTime(
                                                                    decisionDate
                                                                )
                                                            }
                                                        </span>


                                                        {/* LOAN ID */}

                                                        {loanId && (

                                                            <div className="
                                                                mt-1.5
                                                            ">

                                                                <span className="
                                                                    text-[10px]
                                                                    text-base-content/40
                                                                ">
                                                                </span>


                                                                <span className="
                                                                    ml-1
                                                                    font-mono
                                                                    text-xs
                                                                    font-medium
                                                                    text-base-content/75
                                                                ">
                                                                    {
                                                                        loanId
                                                                    }
                                                                </span>

                                                            </div>

                                                        )}

                                                    </div>

                                                </div>

                                            )}


                                            {/* REJECTED */}

                                            {isRejected && (

                                                <div className="
                                                    flex
                                                    items-start
                                                    gap-2
                                                ">

                                                    <XCircleIcon className="
                                                        mt-0.5
                                                        h-5
                                                        w-5
                                                        shrink-0
                                                        text-error
                                                    " />


                                                    <div className="
                                                        min-w-0
                                                    ">

                                                        <span className="
                                                            block
                                                            text-xs
                                                            font-semibold
                                                            text-error
                                                        ">
                                                            Rejected
                                                        </span>


                                                        <span className="
                                                            mt-0.5
                                                            block
                                                            whitespace-nowrap
                                                            text-[11px]
                                                            text-base-content/45
                                                        ">
                                                            {
                                                                formatDateTime(
                                                                    decisionDate
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            )}

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


export default DuplicateApprovalTable