// admin-react/src/pages/Banks&DSA/Banks/components/BanksTable.jsx

import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'


function BanksTable({
    banks = [],
    onEdit,
    onDelete,
}) {

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!banks.length) {

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
                    min-h-[260px]
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
                        No banks found
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
                    min-w-[600px]
                    border-collapse
                ">

                    {/* =================================================
                        TABLE HEADER
                    ================================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/40
                        ">

                            {/* BANK */}

                            <th className="
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Bank
                            </th>


                            {/* STATUS */}

                            <th className="
                                w-[180px]
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Status
                            </th>


                            {/* ACTIONS */}

                            <th className="
                                w-[120px]
                                px-5
                                py-3.5
                                text-right
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/60
                            ">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody>

                        {banks.map((bank, index) => {

                            const isActive =
                                bank.status === 'active'


                            return (

                                <tr
                                    key={
                                        bank.id ??
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
                                        BANK
                                    ================================================= */}

                                    <td className="
                                        px-5
                                        py-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-3
                                        ">

                                            {/* BANK AVATAR */}

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

                                                <span className="
                                                    text-sm
                                                    font-semibold
                                                    text-[#6FA800]
                                                ">

                                                    {String(
                                                        bank.name ||
                                                        'B'
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </span>

                                            </div>


                                            {/* BANK NAME */}

                                            <div className="
                                                min-w-0
                                            ">

                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-base-content
                                                    "
                                                    title={
                                                        bank.name
                                                    }
                                                >
                                                    {bank.name || 'Unnamed Bank'}
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* =================================================
                                        STATUS
                                    ================================================= */}

                                    <td className="
                                        px-5
                                        py-4
                                    ">

                                        {isActive ? (

                                            <span className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-[#2F8132]/20
                                                bg-[#2F8132]/10
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-[#2F8132]
                                            ">

                                                <span className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-[#2F8132]
                                                " />

                                                Active

                                            </span>

                                        ) : (

                                            <span className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                border
                                                border-base-300
                                                bg-base-200
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-base-content/55
                                            ">

                                                <span className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-base-content/40
                                                " />

                                                Inactive

                                            </span>

                                        )}

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
                                            justify-end
                                            gap-1
                                        ">

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit?.(
                                                        bank
                                                    )
                                                }
                                                title="Edit bank"
                                                aria-label={
                                                    `Edit ${bank.name}`
                                                }
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    text-base-content/45
                                                    transition
                                                    hover:bg-[#8BCF00]/10
                                                    hover:text-[#6FA800]
                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-[#8BCF00]/20
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
                                                        bank
                                                    )
                                                }
                                                title="Delete bank"
                                                aria-label={
                                                    `Delete ${bank.name}`
                                                }
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    text-base-content/45
                                                    transition
                                                    hover:bg-error/10
                                                    hover:text-error
                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-error/20
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

                        })}

                    </tbody>

                </table>

            </div>

        </div>

    )
}


export default BanksTable