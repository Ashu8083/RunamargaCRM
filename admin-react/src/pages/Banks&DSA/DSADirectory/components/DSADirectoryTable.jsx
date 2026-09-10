// admin-react/src/pages/Banks&DSA/DSADirectory/components/DSADirectoryTable.jsx

import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'


function DSADirectoryTable({
    entries = [],
    loading = false,
    onEdit,
    onDelete,
}) {

    // =========================================================
    // EMPTY / LOADING STATE
    // =========================================================

    if (!entries.length || loading) {

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
                        No DSA entries found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/45
                    ">
                        Try changing your search or add a new DSA.
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
                    min-w-[850px]
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

                            {/* DSA NAME */}

                            <th className="
                                min-w-[210px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                DSA Name
                            </th>


                            {/* DSA CODE */}

                            <th className="
                                min-w-[130px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                DSA Code
                            </th>


                            {/* BANK */}

                            <th className="
                                min-w-[180px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/70
                            ">
                                Bank
                            </th>


                            {/* LOAN TYPE */}

                            <th className="
                                min-w-[180px]
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


                            {/* STATUS */}

                            <th className="
                                min-w-[130px]
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


                            {/* ACTION */}

                            <th className="
                                w-[150px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-right
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

                                const isActive =
                                    entry.status === 'active'

                                const isDefault =
                                    entry.isDefault === true


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
                                            DSA NAME
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-2.5
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

                                                    <span className="
                                                        text-xs
                                                        font-semibold
                                                        text-[#6FA800]
                                                    ">
                                                        {String(
                                                            entry.dsaName ||
                                                            'D'
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>

                                                </div>


                                                <div className="
                                                    min-w-0
                                                ">

                                                    <p
                                                        className="
                                                            max-w-[210px]
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                            text-base-content
                                                        "
                                                        title={
                                                            entry.dsaName
                                                        }
                                                    >
                                                        {
                                                            entry.dsaName ||
                                                            '—'
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =================================
                                            DSA CODE
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            {entry.dsaCode ? (

                                                <span className="
                                                    inline-flex
                                                    rounded-md
                                                    bg-base-200
                                                    px-2.5
                                                    py-1.5
                                                    font-mono
                                                    text-xs
                                                    font-medium
                                                    text-base-content/70
                                                ">
                                                    {
                                                        entry.dsaCode
                                                    }
                                                </span>

                                            ) : (

                                                <span className="
                                                    text-sm
                                                    text-base-content/30
                                                ">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        {/* =================================
                                            BANK
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span
                                                className="
                                                    block
                                                    max-w-[210px]
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                "
                                                title={
                                                    entry.bank
                                                }
                                            >
                                                {
                                                    entry.bank ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            LOAN TYPE
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span className="
                                                inline-flex
                                                max-w-[210px]
                                                items-center
                                                rounded-full
                                                border
                                                border-[#8BCF00]/40
                                                bg-[#8BCF00]/10
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-medium
                                                text-[#6FA800]
                                            ">
                                                {
                                                    entry.loanType ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                flex-col
                                                items-start
                                                gap-1.5
                                            ">

                                                {/* ACTIVE / INACTIVE */}

                                                <span
                                                    className={[
                                                        'inline-flex',
                                                        'items-center',
                                                        'rounded-full',
                                                        'border',
                                                        'px-3',
                                                        'py-1.5',
                                                        'text-xs',
                                                        'font-medium',
                                                        isActive
                                                            ? 'border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#6FA800]'
                                                            : 'border-base-300 bg-base-200 text-base-content/55',
                                                    ].join(' ')}
                                                >
                                                    {isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>


                                                {/* DEFAULT */}

                                                {isDefault && (

                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        border
                                                        border-amber-300
                                                        bg-amber-50
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-medium
                                                        text-amber-700
                                                    ">
                                                        Default
                                                    </span>

                                                )}

                                            </div>

                                        </td>


                                        {/* =================================
                                            ACTION
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                justify-end
                                                gap-1
                                            ">

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onEdit?.(
                                                            entry
                                                        )
                                                    }
                                                    title="Edit DSA"
                                                    aria-label={
                                                        `Edit ${entry.dsaName}`
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        text-base-content/50
                                                        transition
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                    "
                                                >

                                                    <PencilSquareIcon className="
                                                        h-5
                                                        w-5
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
                                                    title="Delete DSA"
                                                    aria-label={
                                                        `Delete ${entry.dsaName}`
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        text-base-content/50
                                                        transition
                                                        hover:bg-error/10
                                                        hover:text-error
                                                    "
                                                >

                                                    <TrashIcon className="
                                                        h-5
                                                        w-5
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


export default DSADirectoryTable