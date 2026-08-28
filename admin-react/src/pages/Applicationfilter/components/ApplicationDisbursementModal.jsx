// admin-react/src/pages/Applicationfilter/components/ApplicationDisbursementModal.jsx

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon'
import BuildingLibraryIcon from '@heroicons/react/24/outline/BuildingLibraryIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'


// =============================================================
// FORMAT CURRENCY
// =============================================================

const formatAmount = (amount) => {

    if (
        amount === null ||
        amount === undefined ||
        amount === ''
    ) {
        return '—'
    }


    const numericAmount =
        Number(amount)


    if (
        Number.isNaN(
            numericAmount
        )
    ) {
        return String(amount)
    }


    return new Intl.NumberFormat(
        'en-IN',
        {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }
    ).format(
        numericAmount
    )

}


// =============================================================
// DETAIL ITEM
// =============================================================

const DetailItem = ({
    icon: Icon,
    label,
    value,
}) => {

    return (

        <div className="
            flex
            min-w-0
            items-start
            gap-3
        ">

            <div className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-base-200
            ">

                <Icon className="
                    h-4
                    w-4
                    text-base-content/50
                " />

            </div>


            <div className="
                min-w-0
            ">

                <p className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-base-content/40
                ">
                    {label}
                </p>


                <p className="
                    mt-0.5
                    break-words
                    text-sm
                    font-medium
                    text-base-content
                ">
                    {value || '—'}
                </p>

            </div>

        </div>

    )

}


// =============================================================
// DISBURSEMENT RECORD
// =============================================================

function DisbursementRecord({
    record,
    index,
}) {

    return (

        <div className="
            rounded-xl
            border
            border-base-300
            bg-base-100
        ">

            {/* =================================================
                RECORD HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                border-b
                border-base-300
                bg-base-200/30
                px-4
                py-3
            ">

                <div className="
                    flex
                    items-center
                    gap-2.5
                ">

                    <div className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#8BCF00]/10
                    ">

                        <BuildingLibraryIcon className="
                            h-4
                            w-4
                            text-[#6FA800]
                        " />

                    </div>


                    <div>

                        <p className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {record.bank || 'Bank'}
                        </p>


                        <p className="
                            text-[10px]
                            text-base-content/40
                        ">
                            Disbursement {index + 1}
                        </p>

                    </div>

                </div>


                <span className="
                    rounded-full
                    border
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-medium
                    text-[#6FA800]
                ">
                    Disbursed
                </span>

            </div>


            {/* =================================================
                RECORD DETAILS
            ================================================= */}

            <div className="
                grid
                grid-cols-1
                gap-4
                p-4
                sm:grid-cols-2
                xl:grid-cols-3
            ">

                <DetailItem
                    icon={CalendarDaysIcon}
                    label="Disbursed Date"
                    value={
                        record.disbursedDate
                    }
                />


                <DetailItem
                    icon={BanknotesIcon}
                    label="Disbursed Amount"
                    value={
                        formatAmount(
                            record.disbursedAmount
                        )
                    }
                />


                <DetailItem
                    icon={DocumentTextIcon}
                    label="DSA Code"
                    value={
                        record.dsaCode ||
                        'Not available'
                    }
                />


                <DetailItem
                    icon={BanknotesIcon}
                    label="Processing Fee"
                    value={
                        formatAmount(
                            record.pf
                        )
                    }
                />


                <DetailItem
                    icon={ShieldCheckIcon}
                    label="Insurance"
                    value={
                        formatAmount(
                            record.insurance
                        )
                    }

                />

            </div>

        </div>

    )

}


// =============================================================
// APPLICATION DISBURSEMENT MODAL
// =============================================================

function ApplicationDisbursementModal({
    open = false,
    application = null,
    onClose,
}) {

    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // APPLICATION
    // =========================================================

    const data =
        application || {}


    // =========================================================
    // MULTIPLE DISBURSEMENTS
    // =========================================================

    let disbursements =
        Array.isArray(
            data.disbursements
        )
            ? data.disbursements
            : []


    /*
     * Support a single disbursement object as well.
     * This makes the component compatible with both
     * current mock data and a future API response.
     */

    if (
        !disbursements.length &&
        data.disbursement
    ) {

        disbursements = [
            data.disbursement,
        ]

    }


    /*
     * If the API directly returns bank records
     * under "banks", support that structure too.
     */

    if (
        !disbursements.length &&
        Array.isArray(
            data.banks
        )
    ) {

        disbursements =
            data.banks

    }


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
                p-3
                sm:p-5
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
                flex
                max-h-[90vh]
                w-full
                max-w-3xl
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
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
                        min-w-0
                    ">

                        <h2 className="
                            text-base
                            font-semibold
                            text-base-content
                        ">
                            Disbursement Details
                        </h2>


                        <div className="
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-1
                        ">

                            <span className="
                                text-xs
                                text-base-content/50
                            ">
                                {data.name ||
                                    'Customer'}
                            </span>


                            {data.id && (

                                <>

                                    <span className="
                                        text-xs
                                        text-base-content/25
                                    ">
                                        •
                                    </span>


                                    <span className="
                                        font-mono
                                        text-[10px]
                                        text-base-content/40
                                    ">
                                        {data.id}
                                    </span>

                                </>

                            )}

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        title="Close"
                        className="
                            ml-3
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
                    min-h-0
                    flex-1
                    overflow-y-auto
                    p-5
                ">


                    {/* =================================================
                        CUSTOMER SUMMARY
                    ================================================= */}

                    <div className="
                        mb-4
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/20
                        p-4
                    ">

                        <div className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-3
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-base-content/40
                                ">
                                    Customer
                                </p>


                                <p className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    text-base-content
                                ">
                                    {data.name ||
                                        '—'}
                                </p>

                            </div>


                            <div>

                                <p className="
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-base-content/40
                                ">
                                    Phone
                                </p>


                                <p className="
                                    mt-1
                                    text-sm
                                    text-base-content/75
                                ">
                                    {data.phone ||
                                        '—'}
                                </p>

                            </div>


                            <div>

                                <p className="
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-base-content/40
                                ">
                                    Loan Type
                                </p>


                                <p className="
                                    mt-1
                                    text-sm
                                    text-base-content/75
                                ">
                                    {data.loanType ||
                                        '—'}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        DISBURSEMENT COUNT
                    ================================================= */}

                    <div className="
                        mb-3
                        flex
                        items-center
                        justify-between
                    ">

                        <div>

                            <h3 className="
                                text-sm
                                font-semibold
                                text-base-content
                            ">
                                Bank Disbursements
                            </h3>


                            <p className="
                                mt-0.5
                                text-xs
                                text-base-content/45
                            ">
                                Disbursement details for this application.
                            </p>

                        </div>


                        <span className="
                            rounded-full
                            bg-base-200
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            {disbursements.length}
                        </span>

                    </div>


                    {/* =================================================
                        RECORDS
                    ================================================= */}

                    {disbursements.length ? (

                        <div className="
                            space-y-3
                        ">

                            {disbursements.map(
                                (
                                    record,
                                    index
                                ) => (

                                    <DisbursementRecord
                                        key={
                                            record.id ??
                                            `${record.bank}-${index}`
                                        }
                                        record={
                                            record
                                        }
                                        index={
                                            index
                                        }
                                    />

                                )
                            )}

                        </div>

                    ) : (

                        <div className="
                            flex
                            min-h-[220px]
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-base-300
                            px-6
                            py-10
                            text-center
                        ">

                            <DocumentTextIcon className="
                                h-8
                                w-8
                                text-base-content/25
                            " />


                            <p className="
                                mt-3
                                text-sm
                                font-medium
                                text-base-content/60
                            ">
                                No disbursement details found
                            </p>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/40
                            ">
                                Disbursement information is unavailable.
                            </p>

                        </div>

                    )}

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
                    px-5
                    py-4
                ">

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        className="
                            h-10
                            rounded-lg
                            bg-[#8BCF00]
                            px-5
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}


export default ApplicationDisbursementModal