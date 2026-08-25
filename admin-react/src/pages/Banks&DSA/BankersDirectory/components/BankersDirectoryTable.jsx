// admin-react/src/pages/Banks&DSA/BankersDirectory/components/BankersDirectoryTable.jsx

function BankersDirectoryTable({
    entries = [],
    onView,
    onEdit,
    onRefresh,
}) {

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
                        No banker entries found
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

            {/* =====================================================
                TABLE HEADER / RESULT INFO
            ===================================================== */}

            <div className="
                flex
                min-h-[52px]
                items-center
                justify-between
                border-b
                border-base-300
                px-4
                py-3
                sm:px-5
            ">

                <div>

                    <p className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        Bankers Directory
                    </p>

                    <p className="
                        mt-0.5
                        text-xs
                        text-base-content/45
                    ">
                        {entries.length}{' '}

                        {entries.length === 1
                            ? 'banker entry'
                            : 'banker entries'}
                    </p>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

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

                            {/* STATE */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                State
                            </th>


                            {/* CITY */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                City
                            </th>


                            {/* BANK */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                Bank
                            </th>


                            {/* LOAN TYPE */}

                            <th className="
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                Loan Type
                            </th>


                            {/* SM */}

                            <th className="
                                w-[100px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                SM(s)
                            </th>


                            {/* ASM */}

                            <th className="
                                w-[100px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                ASM(s)
                            </th>


                            {/* STATUS */}

                            <th className="
                                w-[120px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-left
                                text-xs
                                font-semibold
                                text-base-content/65
                            ">
                                Status
                            </th>


                            {/* ACTION */}

                            <th className="
                                w-[170px]
                                whitespace-nowrap
                                px-5
                                py-3.5
                                text-center
                                text-xs
                                font-semibold
                                text-base-content/65
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

                                // -------------------------------------
                                // SAFE PEOPLE ARRAYS
                                // -------------------------------------

                                const sms =
                                    Array.isArray(
                                        entry.sms
                                    )
                                        ? entry.sms
                                        : []


                                const asms =
                                    Array.isArray(
                                        entry.asms
                                    )
                                        ? entry.asms
                                        : []


                                // -------------------------------------
                                // COUNTS
                                // -------------------------------------

                                const smCount =
                                    sms.length


                                const asmCount =
                                    asms.length


                                // -------------------------------------
                                // STATUS
                                // -------------------------------------

                                const isActive =
                                    entry.status ===
                                    'active'


                                return (

                                    <tr
                                        key={
                                            entry.id ??
                                            index
                                        }
                                        onClick={() =>
                                            onView?.(
                                                entry
                                            )
                                        }
                                        className="
                                            cursor-pointer
                                            border-b
                                            border-base-300
                                            last:border-b-0
                                            transition-colors
                                            hover:bg-base-200/40
                                        "
                                    >

                                        {/* =================================
                                            STATE
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span
                                                className="
                                                    block
                                                    max-w-[180px]
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                "
                                                title={
                                                    entry.state ||
                                                    ''
                                                }
                                            >
                                                {
                                                    entry.state ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            CITY
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

                                            <span
                                                className="
                                                    block
                                                    max-w-[160px]
                                                    truncate
                                                    text-sm
                                                    text-base-content/75
                                                "
                                                title={
                                                    entry.city ||
                                                    ''
                                                }
                                            >
                                                {
                                                    entry.city ||
                                                    '—'
                                                }
                                            </span>

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
                                                    max-w-[190px]
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-base-content
                                                "
                                                title={
                                                    entry.bank ||
                                                    ''
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
                                                truncate
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
                                            SM COUNT
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <span className="
                                                inline-flex
                                                min-w-[32px]
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-base-200
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                {smCount}
                                            </span>

                                        </td>


                                        {/* =================================
                                            ASM COUNT
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                            text-center
                                        ">

                                            <span className="
                                                inline-flex
                                                min-w-[32px]
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-base-200
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                {asmCount}
                                            </span>

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td className="
                                            px-5
                                            py-4
                                        ">

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
                                                justify-center
                                                gap-2
                                            ">

                                                {/* =========================
                                                    VIEW
                                                ========================= */}

                                                <button
                                                    type="button"
                                                    onClick={(
                                                        event
                                                    ) => {

                                                        event.stopPropagation()

                                                        onView?.(
                                                            entry
                                                        )

                                                    }}
                                                    className="
                                                        inline-flex
                                                        h-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-base-300
                                                        bg-base-100
                                                        px-3.5
                                                        text-xs
                                                        font-medium
                                                        text-base-content/70
                                                        transition
                                                        hover:border-[#8BCF00]/40
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-[#8BCF00]/30
                                                    "
                                                >
                                                    View
                                                </button>


                                                {/* =========================
                                                    EDIT
                                                ========================= */}

                                                <button
                                                    type="button"
                                                    onClick={(
                                                        event
                                                    ) => {

                                                        event.stopPropagation()

                                                        onEdit?.(
                                                            entry
                                                        )

                                                    }}
                                                    className="
                                                        inline-flex
                                                        h-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        border-base-300
                                                        bg-base-100
                                                        px-3.5
                                                        text-xs
                                                        font-medium
                                                        text-base-content/70
                                                        transition
                                                        hover:border-[#8BCF00]/40
                                                        hover:bg-[#8BCF00]/10
                                                        hover:text-[#6FA800]
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-[#8BCF00]/30
                                                    "
                                                >
                                                    Edit
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


export default BankersDirectoryTable