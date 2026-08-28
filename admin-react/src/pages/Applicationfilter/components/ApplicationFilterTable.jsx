// admin-react/src/pages/Applicationfilter/components/ApplicationFilterTable.jsx

import EyeIcon from '@heroicons/react/24/outline/EyeIcon'


// =============================================================
// STATUS
// =============================================================

const getStatusClasses = (status) => {

    const normalizedStatus =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalizedStatus === 'disbursed') {

        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalizedStatus === 'approved') {

        return [
            'border-blue-300',
            'bg-blue-50',
            'text-blue-600',
        ].join(' ')

    }


    if (normalizedStatus === 'rejected') {

        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    if (normalizedStatus === 'pending') {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }


    if (normalizedStatus === 'processing') {

        return [
            'border-purple-300',
            'bg-purple-50',
            'text-purple-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// STATUS TEXT
// =============================================================

const formatStatus = (status) => {

    const normalizedStatus =
        String(status || '')
            .trim()
            .toLowerCase()


    if (!normalizedStatus) {
        return 'Unknown'
    }


    return normalizedStatus
        .split('-')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(' ')

}


// =============================================================
// APPLICATION TABLE
// =============================================================

function ApplicationFilterTable({
    entries = [],
    loading = false,
    onView,
}) {

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
                    w-full
                    overflow-x-auto
                ">

                    <table className="
                        w-full
                        min-w-[1050px]
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
                                    'Name',
                                    'Applied Date',
                                    'Agent',
                                    'RM',
                                    'Loan Type',
                                    'Loan Status',
                                    'Action',
                                ].map(
                                    (heading) => (

                                        <th
                                            key={
                                                heading
                                            }
                                            className="
                                                whitespace-nowrap
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

                                    )
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {[1, 2, 3, 4, 5].map(
                                (item) => (

                                    <tr
                                        key={item}
                                        className="
                                            border-b
                                            border-base-300
                                        "
                                    >

                                        {[
                                            'w-16',
                                            'w-40',
                                            'w-28',
                                            'w-28',
                                            'w-28',
                                            'w-32',
                                            'w-24',
                                            'w-20',
                                        ].map(
                                            (
                                                width,
                                                index
                                            ) => (

                                                <td
                                                    key={
                                                        index
                                                    }
                                                    className="
                                                        px-5
                                                        py-4
                                                    "
                                                >

                                                    <div
                                                        className={`
                                                            ${width}
                                                            h-4
                                                            animate-pulse
                                                            rounded
                                                            bg-base-300
                                                        `}
                                                    />

                                                </td>

                                            )
                                        )}

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        )

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!entries.length) {

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

                        <span className="
                            text-lg
                            font-semibold
                            text-base-content/30
                        ">
                            —
                        </span>

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
                        Try changing your filters or search.
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
                    min-w-[1050px]
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

                            {/* ID */}

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


                            {/* NAME */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Name
                            </th>


                            {/* APPLIED DATE */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Applied Date
                            </th>


                            {/* AGENT */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Agent
                            </th>


                            {/* RM */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                RM
                            </th>


                            {/* LOAN TYPE */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Loan Type
                            </th>


                            {/* LOAN STATUS */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Loan Status
                            </th>


                            {/* ACTION */}

                            <th className="
                                w-[100px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Action
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <tbody>

                        {entries.map(
                            (entry, index) => {

                                const status =
                                    String(
                                        entry.loanStatus ||
                                        entry.status ||
                                        ''
                                    )
                                        .trim()
                                        .toLowerCase()


                                const isDisbursed =
                                    status ===
                                    'disbursed'


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

                                        {/* =================================
                                            ID
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                font-mono
                                                text-xs
                                                font-medium
                                                text-base-content/60
                                            ">
                                                {
                                                    entry.id ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            NAME
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <div>

                                                <p className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        entry.name ||
                                                        '—'
                                                    }
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    whitespace-nowrap
                                                    text-xs
                                                    text-base-content/45
                                                ">
                                                    {
                                                        entry.phone ||
                                                        '—'
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================
                                            APPLIED DATE
                                        ================================= */}

                                        <td className="
                                            whitespace-nowrap
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                text-sm
                                                text-base-content/75
                                            ">
                                                {
                                                    entry.appliedDate ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            AGENT
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <p className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/80
                                            ">
                                                {
                                                    entry.agentName ||
                                                    '—'
                                                }
                                            </p>

                                        </td>


                                        {/* =================================
                                            RM
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <p className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/80
                                            ">
                                                {
                                                    entry.rmName ||
                                                    '—'
                                                }
                                            </p>

                                        </td>


                                        {/* =================================
                                            LOAN TYPE
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/75
                                            ">
                                                {
                                                    entry.loanType ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            LOAN STATUS
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span
                                                className={[
                                                    'inline-flex',
                                                    'rounded-full',
                                                    'border',
                                                    'px-3',
                                                    'py-1.5',
                                                    'text-xs',
                                                    'font-medium',
                                                    getStatusClasses(
                                                        status
                                                    ),
                                                ].join(' ')}
                                            >
                                                {
                                                    formatStatus(
                                                        status
                                                    )
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            ACTION
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <button
                                                type="button"
                                                disabled={
                                                    !isDisbursed
                                                }
                                                onClick={() => {

                                                    if (
                                                        isDisbursed
                                                    ) {

                                                        onView?.(
                                                            entry
                                                        )

                                                    }

                                                }}
                                                title={
                                                    isDisbursed
                                                        ? 'View disbursement details'
                                                        : 'Available after disbursement'
                                                }
                                                className={[
                                                    'inline-flex',
                                                    'h-9',
                                                    'items-center',
                                                    'justify-center',
                                                    'gap-1.5',
                                                    'rounded-lg',
                                                    'border',
                                                    'px-3.5',
                                                    'text-xs',
                                                    'font-medium',
                                                    'transition',
                                                    'focus:outline-none',
                                                    'focus:ring-2',
                                                    'focus:ring-[#8BCF00]/30',

                                                    isDisbursed
                                                        ? [
                                                            'border-base-300',
                                                            'bg-base-100',
                                                            'text-base-content/70',
                                                            'hover:border-[#8BCF00]/40',
                                                            'hover:bg-[#8BCF00]/10',
                                                            'hover:text-[#6FA800]',
                                                        ].join(' ')
                                                        : [
                                                            'cursor-not-allowed',
                                                            'border-base-300',
                                                            'bg-base-200/50',
                                                            'text-base-content/25',
                                                        ].join(' '),

                                                ].join(' ')}
                                            >

                                                <EyeIcon className="
                                                    h-4
                                                    w-4
                                                " />

                                                View

                                            </button>

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


export default ApplicationFilterTable