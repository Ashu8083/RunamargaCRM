// admin-react/src/pages/Banks&DSA/BankersDirectory/components/BankerViewModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'


function BankerViewModal({
    open = false,
    entry = null,
    onClose,
}) {

    // =========================================================
    // CLOSED / NO DATA
    // =========================================================

    if (!open || !entry) {
        return null
    }


    // =========================================================
    // PEOPLE
    // =========================================================

    const asms =
        Array.isArray(entry.asms)
            ? entry.asms
            : []


    const sms =
        Array.isArray(entry.sms)
            ? entry.sms
            : []


    const isActive =
        entry.status === 'active'


    // =========================================================
    // PERSON TABLE
    // =========================================================

    const renderPeopleTable = (
        people,
        title
    ) => {

        return (
            <section className="
                space-y-3
            ">

                {/* SECTION HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                ">

                    <h3 className="
                        text-sm
                        font-semibold
                        text-base-content
                    ">
                        {title}
                    </h3>


                    <span className="
                        rounded-full
                        bg-base-200
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        text-base-content/60
                    ">
                        {people.length}
                    </span>

                </div>


                {/* EMPTY */}

                {!people.length ? (

                    <div className="
                        rounded-xl
                        border
                        border-dashed
                        border-base-300
                        bg-base-200/20
                        px-4
                        py-6
                        text-center
                    ">

                        <p className="
                            text-xs
                            text-base-content/45
                        ">
                            No {title.toLowerCase()} assigned.
                        </p>

                    </div>

                ) : (

                    <div className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-base-300
                        bg-base-100
                    ">

                        <div className="
                            w-full
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                min-w-[560px]
                                border-collapse
                            ">

                                <thead>

                                    <tr className="
                                        border-b
                                        border-base-300
                                        bg-base-200/40
                                    ">

                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            #
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Name
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Contact
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-[11px]
                                            font-semibold
                                            text-base-content/60
                                        ">
                                            Email
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {people.map(
                                        (
                                            person,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    person.id ??
                                                    index
                                                }
                                                className="
                                                    border-b
                                                    border-base-300
                                                    last:border-b-0
                                                "
                                            >

                                                {/* NUMBER */}

                                                <td className="
                                                    w-12
                                                    px-4
                                                    py-3.5
                                                    text-xs
                                                    text-base-content/40
                                                ">
                                                    {index + 1}
                                                </td>


                                                {/* NAME */}

                                                <td className="
                                                    px-4
                                                    py-3.5
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
                                                            person.name
                                                        }
                                                    >
                                                        {
                                                            person.name ||
                                                            '—'
                                                        }
                                                    </span>

                                                </td>


                                                {/* CONTACT */}

                                                <td className="
                                                    px-4
                                                    py-3.5
                                                ">

                                                    <span className="
                                                        whitespace-nowrap
                                                        text-sm
                                                        text-base-content/75
                                                    ">
                                                        {
                                                            person.contact ||
                                                            person.phone ||
                                                            '—'
                                                        }
                                                    </span>

                                                </td>


                                                {/* EMAIL */}

                                                <td className="
                                                    px-4
                                                    py-3.5
                                                ">

                                                    <span
                                                        className="
                                                            block
                                                            max-w-[240px]
                                                            truncate
                                                            text-sm
                                                            text-base-content/75
                                                        "
                                                        title={
                                                            person.email
                                                        }
                                                    >
                                                        {
                                                            person.email ||
                                                            '—'
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </section>
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[110]
                flex
                items-center
                justify-center
                bg-black/40
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose?.()
                }

            }}
        >

            <div className="
                flex
                max-h-[94vh]
                w-full
                max-w-4xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-base-300
                bg-base-100
                shadow-2xl
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-base-300
                    px-5
                    py-4
                    sm:px-6
                ">

                    <div className="
                        min-w-0
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-base-content
                            sm:text-xl
                        ">
                            Banker Details
                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">
                            Bank, loan and assigned team details
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            onClose?.()
                        }
                        aria-label="Close"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/45
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
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
                    min-h-0
                    flex-1
                    overflow-y-auto
                    px-5
                    py-5
                    sm:px-6
                ">

                    {/* =============================================
                        BASIC DETAILS
                    ============================================= */}

                    <div className="
                        rounded-xl
                        border
                        border-base-300
                        bg-base-100
                    ">

                        <div className="
                            border-b
                            border-base-300
                            px-4
                            py-3
                        ">

                            <h3 className="
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                Entry Details
                            </h3>

                        </div>


                        <div className="
                            grid
                            grid-cols-1
                            gap-x-6
                            gap-y-4
                            px-4
                            py-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        ">

                            {/* STATE */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    State
                                </p>

                                <p className="
                                    mt-1
                                    truncate
                                    text-sm
                                    font-medium
                                    text-base-content
                                ">
                                    {
                                        entry.state ||
                                        '—'
                                    }
                                </p>

                            </div>


                            {/* CITY */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    City
                                </p>

                                <p className="
                                    mt-1
                                    truncate
                                    text-sm
                                    font-medium
                                    text-base-content
                                ">
                                    {
                                        entry.city ||
                                        '—'
                                    }
                                </p>

                            </div>


                            {/* BANK */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    Bank
                                </p>

                                <p className="
                                    mt-1
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-base-content
                                ">
                                    {
                                        entry.bank ||
                                        '—'
                                    }
                                </p>

                            </div>


                            {/* LOAN TYPE */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    Loan Type
                                </p>

                                <p className="
                                    mt-1
                                    truncate
                                    text-sm
                                    font-medium
                                    text-base-content
                                ">
                                    {
                                        entry.loanType ||
                                        entry.loan_type ||
                                        '—'
                                    }
                                </p>

                            </div>


                            {/* STATUS */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    Status
                                </p>

                                <span
                                    className={[
                                        'mt-1.5',
                                        'inline-flex',
                                        'items-center',
                                        'rounded-full',
                                        'border',
                                        'px-2.5',
                                        'py-1',
                                        'text-[11px]',
                                        'font-medium',
                                        isActive
                                            ? 'border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#6FA800]'
                                            : 'border-base-300 bg-base-200 text-base-content/55',
                                    ].join(' ')}
                                >
                                    {
                                        isActive
                                            ? 'Active'
                                            : 'Inactive'
                                    }
                                </span>

                            </div>


                            {/* SM COUNT */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    Sales Managers
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-base-content
                                ">
                                    {sms.length}
                                </p>

                            </div>


                            {/* ASM COUNT */}

                            <div>

                                <p className="
                                    text-[11px]
                                    font-medium
                                    text-base-content/45
                                ">
                                    Assistant Sales Managers
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                    text-base-content
                                ">
                                    {asms.length}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =============================================
                        PEOPLE
                    ============================================= */}

                    <div className="
                        mt-6
                        space-y-6
                    ">

                        {renderPeopleTable(
                            asms,
                            'Assistant Sales Managers (ASMs)'
                        )}


                        {renderPeopleTable(
                            sms,
                            'Sales Managers (SMs)'
                        )}

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    justify-end
                    border-t
                    border-base-300
                    bg-base-100
                    px-5
                    py-3
                    sm:px-6
                ">

                    <button
                        type="button"
                        onClick={() =>
                            onClose?.()
                        }
                        className="
                            btn
                            btn-ghost
                            h-10
                            min-h-10
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    )
}


export default BankerViewModal