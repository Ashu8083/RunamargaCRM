// admin-react/src/pages/Banks&DSA/DSADirectory/components/DSADirectoryViewModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'


function DSADirectoryViewModal({
    open = false,
    entry = null,
    onClose,
}) {

    // =========================================================
    // DON'T RENDER
    // =========================================================

    if (!open || !entry) {
        return null
    }


    // =========================================================
    // STATUS
    // =========================================================

    const isActive =
        entry.status === 'active'


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        onClose?.()

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/40
                p-4
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose()
                }

            }}
        >

            <div className="
                w-full
                max-w-lg
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
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
                        min-w-0
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-base-content
                        ">
                            DSA Details
                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">
                            View DSA configuration details
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
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
                    px-5
                    py-5
                ">

                    {/* =================================================
                        DSA SUMMARY
                    ================================================= */}

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#8BCF00]/10
                        ">

                            <span className="
                                text-sm
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

                            <h3 className="
                                truncate
                                text-base
                                font-semibold
                                text-base-content
                            ">
                                {
                                    entry.dsaName ||
                                    '—'
                                }
                            </h3>


                            {entry.dsaCode ? (

                                <p className="
                                    mt-0.5
                                    font-mono
                                    text-xs
                                    text-base-content/45
                                ">
                                    {entry.dsaCode}
                                </p>

                            ) : (

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-base-content/40
                                ">
                                    No DSA code
                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        DETAILS
                    ================================================= */}

                    <div className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-base-300
                    ">

                        {/* BANK */}

                        <div className="
                            flex
                            min-h-[58px]
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-base-300
                            px-4
                            py-3
                        ">

                            <span className="
                                shrink-0
                                text-xs
                                font-medium
                                text-base-content/50
                            ">
                                Bank
                            </span>


                            <span className="
                                max-w-[65%]
                                truncate
                                text-right
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

                        </div>


                        {/* LOAN TYPE */}

                        <div className="
                            flex
                            min-h-[58px]
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-base-300
                            px-4
                            py-3
                        ">

                            <span className="
                                shrink-0
                                text-xs
                                font-medium
                                text-base-content/50
                            ">
                                Loan Type
                            </span>


                            <span className="
                                max-w-[65%]
                                truncate
                                rounded-full
                                border
                                border-[#8BCF00]/40
                                bg-[#8BCF00]/10
                                px-3
                                py-1
                                text-right
                                text-xs
                                font-medium
                                text-[#6FA800]
                            "
                                title={
                                    entry.loanType
                                }
                            >
                                {
                                    entry.loanType ||
                                    '—'
                                }
                            </span>

                        </div>


                        {/* STATUS */}

                        <div className="
                            flex
                            min-h-[58px]
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-base-300
                            px-4
                            py-3
                        ">

                            <span className="
                                shrink-0
                                text-xs
                                font-medium
                                text-base-content/50
                            ">
                                Status
                            </span>


                            <span
                                className={[
                                    'inline-flex',
                                    'items-center',
                                    'rounded-full',
                                    'border',
                                    'px-3',
                                    'py-1',
                                    'text-xs',
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


                        {/* DEFAULT */}

                        <div className="
                            flex
                            min-h-[58px]
                            items-center
                            justify-between
                            gap-4
                            px-4
                            py-3
                        ">

                            <span className="
                                shrink-0
                                text-xs
                                font-medium
                                text-base-content/50
                            ">
                                Default
                            </span>


                            <span
                                className={[
                                    'inline-flex',
                                    'items-center',
                                    'rounded-full',
                                    'border',
                                    'px-3',
                                    'py-1',
                                    'text-xs',
                                    'font-medium',
                                    entry.isDefault
                                        ? 'border-[#8BCF00]/40 bg-[#8BCF00]/10 text-[#6FA800]'
                                        : 'border-base-300 bg-base-200 text-base-content/55',
                                ].join(' ')}
                            >
                                {
                                    entry.isDefault
                                        ? 'Default DSA'
                                        : 'No'
                                }
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        DEFAULT INFORMATION
                    ================================================= */}

                    {entry.isDefault && (

                        <div className="
                            mt-4
                            rounded-lg
                            border
                            border-[#8BCF00]/20
                            bg-[#8BCF00]/5
                            px-4
                            py-3
                        ">

                            <p className="
                                text-xs
                                leading-5
                                text-[#5f8f00]
                            ">
                                This DSA is configured as the default
                                for {entry.bank || 'this bank'} and{' '}
                                {entry.loanType || 'this loan type'}.
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    justify-end
                    border-t
                    border-base-300
                    px-5
                    py-4
                ">

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            btn
                            btn-ghost
                            h-10
                            min-h-10
                            px-5
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}


export default DSADirectoryViewModal