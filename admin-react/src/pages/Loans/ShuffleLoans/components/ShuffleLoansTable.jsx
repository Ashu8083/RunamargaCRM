// admin-react/src/pages/Loans/ShuffleLoans/components/ShuffleLoansTable.jsx

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'


function ShuffleLoansTable({
    applications = [],
    selectedApplicationIds = [],
    onSelectApplication,
    onSelectAll,
    onRefresh,
}) {

    // =========================================================
    // SELECTION
    // =========================================================

    const filteredIds = applications.map(
        (application) => application.id
    )

    const allSelected =
        filteredIds.length > 0 &&
        filteredIds.every((id) =>
            selectedApplicationIds.includes(id)
        )

    const someSelected =
        filteredIds.some((id) =>
            selectedApplicationIds.includes(id)
        )


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

        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            }
        ).format(numericAmount)
    }


    // =========================================================
    // STATUS
    // =========================================================

    const getStatusClass = (status) => {

        switch (String(status || '').toLowerCase()) {

            case 'inprocess':
            case 'in process':
                return [
                    'border-orange-300',
                    'bg-orange-50',
                    'text-orange-600',
                ].join(' ')

            case 'docspending':
            case 'docs pending':
                return [
                    'border-yellow-300',
                    'bg-yellow-50',
                    'text-yellow-600',
                ].join(' ')

            case 'rejected':
                return [
                    'border-red-300',
                    'bg-red-50',
                    'text-red-600',
                ].join(' ')

            case 'sanctioned':
            case 'approved':
                return [
                    'border-green-300',
                    'bg-green-50',
                    'text-green-600',
                ].join(' ')

            default:
                return [
                    'border-base-300',
                    'bg-base-100',
                    'text-base-content/60',
                ].join(' ')
        }
    }


    // =========================================================
    // ROW SELECTION
    // =========================================================

    const handleRowSelection = (application) => {
        onSelectApplication?.(application.id)
    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (applications.length === 0) {

        return (
            <div
                className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        min-h-[280px]
                        flex-col
                        items-center
                        justify-center
                        px-6
                        py-12
                        text-center
                    "
                >

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            bg-base-200
                        "
                    >
                        <ArrowPathIcon
                            className="
                                h-6
                                w-6
                                text-base-content/30
                            "
                        />
                    </div>


                    <p
                        className="
                            mt-4
                            text-sm
                            font-semibold
                            text-base-content/70
                        "
                    >
                        No applications found
                    </p>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-base-content/45
                        "
                    >
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
        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            "
        >

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-4
                    py-3
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-base-content
                        "
                    >
                        Shuffle Applications
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        "
                    >
                        {applications.length}{' '}
                        {applications.length === 1
                            ? 'application'
                            : 'applications'}
                    </p>

                </div>


                <button
                    type="button"
                    onClick={onRefresh}
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
                    aria-label="Refresh applications"
                >
                    <ArrowPathIcon
                        className="
                            h-5
                            w-5
                            text-base-content/60
                        "
                    />
                </button>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

                <table className="table w-full">

                    <thead>

                        <tr
                            className="
                                border-b
                                border-base-300
                                bg-base-200/50
                            "
                        >

                            {/* SELECT */}

                            <th className="w-12 px-4">

                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(element) => {

                                        if (element) {
                                            element.indeterminate =
                                                someSelected &&
                                                !allSelected
                                        }

                                    }}
                                    onChange={onSelectAll}
                                    className="
                                        checkbox
                                        checkbox-sm
                                        border-base-content/40
                                        checked:border-[#8BCF00]
                                        checked:bg-[#8BCF00]
                                        checked:text-white
                                    "
                                    aria-label="Select all applications"
                                />

                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                Name
                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                Phone
                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                Loan Type
                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                Amount
                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                Agent Name
                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                RM Name
                            </th>


                            <th
                                className="
                                    whitespace-nowrap
                                    px-4
                                    text-xs
                                    font-semibold
                                "
                            >
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {applications.map((application) => {

                            const isSelected =
                                selectedApplicationIds.includes(
                                    application.id
                                )


                            const agentName =
                                application.agentName ||
                                application.agent_name ||
                                'Unassigned'


                            const rmName =
                                application.rmName ||
                                application.rm_name ||
                                'Unassigned'


                            const status =
                                application.status ||
                                'N/A'


                            return (
                                <tr
                                    key={application.id}
                                    onClick={() =>
                                        handleRowSelection(
                                            application
                                        )
                                    }
                                    className={[
                                        'cursor-pointer',
                                        'border-b',
                                        'border-base-300',
                                        'last:border-b-0',
                                        'transition',
                                        'hover:bg-base-200/30',
                                        isSelected
                                            ? 'bg-[#8BCF00]/10'
                                            : '',
                                    ].join(' ')}
                                >

                                    {/* SELECT */}

                                    <td className="w-12 px-4">

                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                handleRowSelection(
                                                    application
                                                )
                                            }
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                            className="
                                                checkbox
                                                checkbox-sm
                                                border-base-content/40
                                                checked:border-[#8BCF00]
                                                checked:bg-[#8BCF00]
                                                checked:text-white
                                            "
                                            aria-label={
                                                `Select ${
                                                    application.name ||
                                                    'application'
                                                }`
                                            }
                                        />

                                    </td>


                                    {/* NAME */}

                                    <td className="px-4">

                                        <div className="min-w-[140px]">

                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                "
                                            >
                                                {application.name || 'N/A'}
                                            </p>


                                            {application.loanId && (

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[11px]
                                                        text-base-content/40
                                                    "
                                                >
                                                    {application.loanId}
                                                </p>

                                            )}

                                        </div>

                                    </td>


                                    {/* PHONE */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-sm
                                            text-base-content/80
                                        "
                                    >
                                        {application.phone || 'N/A'}
                                    </td>


                                    {/* LOAN TYPE */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-sm
                                            text-base-content/80
                                        "
                                    >
                                        {application.loanType || 'N/A'}
                                    </td>


                                    {/* AMOUNT */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            text-sm
                                            font-medium
                                            text-base-content
                                        "
                                    >
                                        {formatAmount(
                                            application.amount
                                        )}
                                    </td>


                                    {/* AGENT */}

                                    <td className="px-4">

                                        <span
                                            className="
                                                inline-flex
                                                whitespace-nowrap
                                                rounded-full
                                                bg-[#2F8132]
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                text-white
                                            "
                                        >
                                            {agentName}
                                        </span>

                                    </td>


                                    {/* RM */}

                                    <td className="px-4">

                                        <span
                                            className="
                                                inline-flex
                                                whitespace-nowrap
                                                rounded-full
                                                bg-[#2F8132]
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                text-white
                                            "
                                        >
                                            {rmName}
                                        </span>

                                    </td>


                                    {/* STATUS */}

                                    <td className="px-4">

                                        <span
                                            className={[
                                                'inline-flex',
                                                'whitespace-nowrap',
                                                'rounded-full',
                                                'border',
                                                'px-3',
                                                'py-1',
                                                'text-xs',
                                                'font-medium',
                                                getStatusClass(status),
                                            ].join(' ')}
                                        >
                                            {status}
                                        </span>

                                    </td>

                                </tr>
                            )
                        })}

                    </tbody>

                </table>

            </div>

        </div>
    )
}


export default ShuffleLoansTable