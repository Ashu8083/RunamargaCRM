// admin-react/src/pages/CallManagement/CallAssignment/components/CallAssignmentTable.jsx

import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowsRightLeftIcon from '@heroicons/react/24/outline/ArrowsRightLeftIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'


// =============================================================
// STATUS
// =============================================================

const getStatusClasses = (status) => {
    switch (String(status || '').toLowerCase()) {
        case 'received':
            return 'border-amber-300 bg-amber-50 text-amber-600'

        case 'missed':
            return 'border-red-300 bg-red-50 text-red-600'

        case 'rejected':
            return 'border-gray-300 bg-gray-50 text-gray-600'

        case 'in_progress':
            return 'border-blue-300 bg-blue-50 text-blue-600'

        default:
            return 'border-base-300 bg-base-200 text-base-content/50'
    }
}

const formatStatus = (status) => {
    const value =
        String(status || '')
            .trim()
            .toLowerCase()

    if (value === 'received') return 'Received'
    if (value === 'missed') return 'Missed'
    if (value === 'rejected') return 'Rejected'
    if (value === 'in_progress') return 'In Progress'

    return 'Unknown'
}

// =============================================================
// TABLE
// =============================================================

function CallAssignmentTable({
    entries = [],
    loading = false,
    currentPage = 1,
    pageSize = 10,
    totalRecords = 0,
    totalPages = 1,
    onPageChange,
    onPageSizeChange,
    onViewHistory,
    onViewLoan,
    onCreateLead,
    onExchange,
    onDelete,
}) {

    const firstRecord = totalRecords
        ? (currentPage - 1) * pageSize + 1
        : 0

    const lastRecord = totalRecords
        ? Math.min(currentPage * pageSize, totalRecords)
        : 0

    const pageNumbers = (() => {
        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            )
        }

        const pages = new Set([
            1,
            totalPages,
            currentPage,
            currentPage - 1,
            currentPage + 1,
        ])

        const sortedPages = Array.from(pages)
            .filter((page) => page > 0 && page <= totalPages)
            .sort((a, b) => a - b)

        return sortedPages.reduce(
            (result, page, index) => {
                if (
                    index > 0 &&
                    page - sortedPages[index - 1] > 1
                ) {
                    result.push('ellipsis-' + page)
                }

                result.push(page)
                return result
            },
            []
        )
    })()

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

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
                    overflow-x-auto
                ">

                    <table className="
                        w-full
                        min-w-[1100px]
                        border-collapse
                    ">

                        <thead>

                            <tr className="
                                border-b
                                border-base-300
                                bg-base-200/40
                            ">

                                {[
                                    'ID',
                                    'Assigned By',
                                    'Assigned To',
                                    'Contact',
                                    'Status',
                                    'Attempts',
                                    'Last Called',
                                    'Actions',
                                ].map((heading) => (

                                    <th
                                        key={heading}
                                        className="
                                            px-5
                                            py-3.5
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-base-content/70
                                        "
                                    >
                                        {heading}
                                    </th>

                                ))}

                            </tr>

                        </thead>


                        <tbody>

                            {[1, 2, 3].map((item) => (

                                <tr
                                    key={item}
                                    className="
                                        border-b
                                        border-base-300
                                    "
                                >

                                    {Array.from({
                                        length: 8,
                                    }).map((_, index) => (

                                        <td
                                            key={index}
                                            className="
                                                px-5
                                                py-5
                                            "
                                        >

                                            <div className="
                                                h-4
                                                w-20
                                                animate-pulse
                                                rounded
                                                bg-base-300
                                            " />

                                        </td>

                                    ))}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        )

    }


    // =========================================================
    // EMPTY
    // =========================================================

    if (!entries.length) {

        return (

            <div className="
                flex
                min-h-[280px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-base-300
                bg-base-100
                px-6
                py-12
                text-center
                shadow-sm
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

                    <PhoneIcon className="
                        h-5
                        w-5
                        text-base-content/30
                    " />

                </div>


                <p className="
                    mt-4
                    text-sm
                    font-semibold
                    text-base-content/70
                ">
                    No call assignments found
                </p>


                <p className="
                    mt-1
                    text-xs
                    text-base-content/45
                ">
                    Try changing your filters or search.
                </p>

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
                    min-w-[1150px]
                    border-collapse
                ">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/40
                        ">

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                ID
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Assigned By
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Assigned To
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Contact
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Status
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Attempts
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Last Called
                            </th>


                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <tbody>

                        {entries.map(
                            (entry, index) => {

                                const hasApplication =
                                    Boolean(
                                        entry
                                            ?.loanApplication
                                            ?.created
                                    )


                                return (

                                    <tr
                                        key={
                                            entry.id ??
                                            index
                                        }
                                        className="
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                            transition-colors
                                            hover:bg-base-200/30
                                        "
                                    >

                                        {/* =================================================
                                            ID
                                        ================================================= */}

                                        <td className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                font-mono
                                                text-xs
                                                font-medium
                                                text-base-content/65
                                            ">
                                                {entry.id || '—'}
                                            </span>

                                        </td>


                                        {/* =================================================
                                            ASSIGNED BY
                                        ================================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <p className="
                                                text-sm
                                                font-medium
                                                text-base-content
                                            ">
                                                {
                                                    entry.assignedBy ||
                                                    '—'
                                                }
                                            </p>

                                        </td>


                                        {/* =================================================
                                            ASSIGNED TO
                                        ================================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <p className="
                                                text-sm
                                                font-medium
                                                text-base-content
                                            ">
                                                {
                                                    entry.assignedToName ||
                                                    'Unassigned'
                                                }
                                            </p>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewHistory?.(
                                                        entry
                                                    )
                                                }
                                                className="
                                                    mt-1.5
                                                    inline-flex
                                                    items-center
                                                    gap-1
                                                    text-[11px]
                                                    font-medium
                                                    text-base-content/50
                                                    transition
                                                    hover:text-[#6FA800]
                                                "
                                            >

                                                <EyeIcon className="
                                                    h-3.5
                                                    w-3.5
                                                " />

                                                View History

                                            </button>

                                        </td>


                                        {/* =================================================
                                            CONTACT
                                        ================================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <p className="
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                                text-base-content
                                            ">
                                                {
                                                    entry.phone ||
                                                    entry.contact ||
                                                    '—'
                                                }
                                            </p>


                                            {entry.name && (

                                                <p className="
                                                    mt-0.5
                                                    max-w-[170px]
                                                    truncate
                                                    text-xs
                                                    text-base-content/45
                                                ">
                                                    {entry.name}
                                                </p>

                                            )}


                                        
                                        </td>


                                        {/* =================================================
                                            STATUS
                                        ================================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className={[
                                                'inline-flex',
                                                'rounded-full',
                                                'border',
                                                'px-3',
                                                'py-1.5',
                                                'text-xs',
                                                'font-medium',
                                                getStatusClasses(
                                                    entry.status
                                                ),
                                            ].join(' ')}>
                                                {
                                                    formatStatus(
                                                        entry.status
                                                    )
                                                }
                                            </span>

                                        </td>


                                        {/* =================================================
                                            ATTEMPTS
                                        ================================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <span className="
                                                text-sm
                                                font-medium
                                                text-base-content/70
                                            ">
                                                {
                                                    entry.attempts ??
                                                    0
                                                }
                                            </span>

                                        </td>


                                        {/* =================================================
                                            LAST CALLED
                                        ================================================= */}

                                        <td className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                text-sm
                                                text-base-content/65
                                            ">
                                                {
                                                    entry.lastCalled ||
                                                    'Never'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-1.5
                                            ">


                                                {/* CREATE LEAD */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onCreateLead?.(
                                                            entry
                                                        )
                                                    }
                                                    title="Create Lead"
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
                                                        text-base-content/55
                                                        transition
                                                        hover:border-[#8BCF00]/40
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                    "
                                                >

                                                    <PlusIcon className="
                                                        h-4
                                                        w-4
                                                    " />

                                                </button>


                                                {/* EXCHANGE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onExchange?.(
                                                            entry
                                                        )
                                                    }
                                                    title="Exchange Number"
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
                                                        text-orange-500
                                                        transition
                                                        hover:border-orange-300
                                                        hover:bg-orange-50
                                                    "
                                                >

                                                    <ArrowsRightLeftIcon className="
                                                        h-4
                                                        w-4
                                                    " />

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete?.(
                                                            entry
                                                        )
                                                    }
                                                    title="Delete"
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
                                                        text-red-500
                                                        transition
                                                        hover:border-red-300
                                                        hover:bg-red-50
                                                    "
                                                >

                                                    <TrashIcon className="
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

            <div className="
                flex
                flex-col
                gap-3
                border-t
                border-base-300
                px-4
                py-4
                text-xs
                text-base-content/60
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">

                <div className="flex items-center gap-2">

                    <label htmlFor="call-assignment-page-size">
                        Rows per page
                    </label>

                    <select
                        id="call-assignment-page-size"
                        value={pageSize}
                        onChange={(event) =>
                            onPageSizeChange?.(
                                Number(event.target.value)
                            )
                        }
                        className="
                            select
                            select-bordered
                            select-xs
                            min-h-8
                            w-20
                        "
                    >
                        {[10, 25, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>

                    <span>
                        Showing {firstRecord}–{lastRecord} of {totalRecords}
                    </span>

                </div>

                <div className="flex flex-wrap items-center gap-1.5">

                    <button
                        type="button"
                        onClick={() =>
                            onPageChange?.(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className="
                            btn
                            btn-xs
                            border-base-300
                            bg-base-100
                            normal-case
                            disabled:opacity-50
                        "
                    >
                        Previous
                    </button>

                    {pageNumbers.map((page) =>
                        typeof page === 'string' ? (
                            <span
                                key={page}
                                className="px-1"
                            >
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                onClick={() => onPageChange?.(page)}
                                aria-current={
                                    page === currentPage
                                        ? 'page'
                                        : undefined
                                }
                                className={[
                                    'btn btn-xs min-w-8',
                                    page === currentPage
                                        ? 'bg-[#8BCF00] text-white hover:bg-[#78B300]'
                                        : 'border-base-300 bg-base-100',
                                ].join(' ')}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            onPageChange?.(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="
                            btn
                            btn-xs
                            border-base-300
                            bg-base-100
                            normal-case
                            disabled:opacity-50
                        "
                    >
                        Next
                    </button>

                    <span className="ml-1 whitespace-nowrap">
                        Page {currentPage} of {totalPages}
                    </span>

                </div>

            </div>

        </div>

    )

}


export default CallAssignmentTable