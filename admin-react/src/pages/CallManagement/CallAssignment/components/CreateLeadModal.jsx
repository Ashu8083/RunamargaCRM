// admin-react/src/pages/CallManagement/CallAssignment/components/CreateLeadModal.jsx

import { useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'

import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'
import StateCityDropdown from '../../../../components/GlobalModels/Filters/StateCityDropdown'


// =============================================================
// CREATE LEAD MODAL
// =============================================================

function CreateLeadModal({
    open = false,
    entry = null,
    onClose,
    onCreate,
}) {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [name, setName] = useState('')

    const [gender, setGender] = useState('')

    const [loanType, setLoanType] = useState('')

    const [loanAmount, setLoanAmount] = useState('')

    const [loanPurpose, setLoanPurpose] = useState('')

    const [stateId, setStateId] = useState('')

    const [cityId, setCityId] = useState('')

    const [businessName, setBusinessName] = useState('')

    const [remarks, setRemarks] = useState('')

    const [loading, setLoading] = useState(false)


    // =========================================================
    // PHONE
    // =========================================================

    const phone =
        entry?.phone ||
        entry?.contact ||
        entry?.number ||
        '—'


    // =========================================================
    // ASSIGNED PERSON
    // =========================================================

    const assignedTo =
        entry?.assignedToName ||
        entry?.assignedTo ||
        entry?.rmName ||
        entry?.rm ||
        'Not assigned'


    // =========================================================
    // BUSINESS LOAN
    // =========================================================
    const [selectedLoanType, setSelectedLoanType] = useState(null)

    const isBusinessLoan =
        String(selectedLoanType?.name || '')
            .trim()
            .toLowerCase() === 'business'


    // =========================================================
    // CREATE LEAD
    // =========================================================

    const handleCreate = async (e) => {

        e.preventDefault()

        if (
            !name.trim() ||
            !phone.trim() ||
            !gender ||
            !loanType ||
            !loanAmount
        ) {
            return
        }

        if (
            isBusinessLoan &&
            !businessName.trim()
        ) {
            return
        }

        setLoading(true)

        try {

            await onCreate?.({

                name: name.trim(),

                phone: phone.trim(),

                gender,

                loanType,

                loanAmount,

                loanPurpose:
                    loanPurpose.trim(),

                stateId:
                    stateId
                        ? Number(stateId)
                        : null,

                cityId:
                    cityId
                        ? Number(cityId)
                        : null,

                businessName:
                    isBusinessLoan
                        ? businessName.trim()
                        : null,

                remarks:
                    remarks.trim(),

            })

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setName('')

        setGender('')

        setLoanType('')

        setLoanAmount('')

        setLoanPurpose('')

        setStateId('')

        setCityId('')

        setBusinessName('')

        setRemarks('')

        setLoading(false)

        onClose?.()

    }


    // =========================================================
    // VALIDATION
    // =========================================================

    const canCreate =
        name.trim().length > 0 &&
        Boolean(gender) &&
        Boolean(loanType) &&
        Boolean(loanAmount) &&
        (
            !isBusinessLoan ||
            businessName.trim().length > 0
        ) &&
        !loading


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[120]
                flex
                items-center
                justify-center
                bg-black/45
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

            <div
                className="
                    flex
                    max-h-[92vh]
                    w-full
                    max-w-2xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    bg-base-100
                    shadow-2xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-base-300
                        px-6
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <UserPlusIcon
                            className="
                                h-6
                                w-6
                                text-base-content
                            "
                        />

                        <h2
                            className="
                                text-xl
                                font-semibold
                                text-base-content
                            "
                        >
                            Create Lead
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-base-300
                            text-base-content/50
                            transition
                            hover:bg-base-200
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon
                            className="
                                h-5
                                w-5
                            "
                        />

                    </button>

                </div>


                {/* =================================================
                    FORM CONTENT
                ================================================= */}

                <form
                    onSubmit={handleCreate}
                    className="
                        min-h-0
                        overflow-y-auto
                    "
                >

                    <div className="px-6 py-5">


                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Full Name of Applicant *
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter customer name"
                                className="
                                    input
                                    input-bordered
                                    h-14
                                    min-h-14
                                    w-full
                                    text-base
                                "
                            />

                        </div>


                        {/* =================================================
                            PHONE
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Phone Number
                            </label>

                            <input
                                type="text"
                                value={phone}
                                readOnly
                                className="
                                    input
                                    input-bordered
                                    h-14
                                    min-h-14
                                    w-full
                                    bg-base-200/40
                                    text-base
                                "
                            />

                        </div>


                        {/* =================================================
                            GENDER
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Gender *
                            </label>

                            <select
                                value={gender}
                                onChange={(event) =>
                                    setGender(
                                        event.target.value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    h-14
                                    min-h-14
                                    w-full
                                    text-base
                                "
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="male">
                                    Male
                                </option>

                                <option value="female">
                                    Female
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            LOAN TYPE
                        ================================================= */}

                        <div className="mb-5">

                            <LoanTypeDropdown
                                label="Loan Type *"
                                value={loanType}
                                onChange={(value, selectedOption) => {
                                    setLoanType(value)
                                    setSelectedLoanType(selectedOption)

                                    if (
                                        String(selectedOption?.name || '')
                                            .trim()
                                            .toLowerCase() !== 'business'
                                    ) {
                                        setBusinessName('')
                                    }
                                }}
                                placeholder="Select Loan Type"
                            />

                            {isBusinessLoan && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Business Name *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Enter business name"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            )}

                        </div>


                       

                        {/* =================================================
                            LOAN AMOUNT
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Loan Amount *
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={loanAmount}
                                onChange={(event) =>
                                    setLoanAmount(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter loan amount"
                                className="
                                    input
                                    input-bordered
                                    h-14
                                    min-h-14
                                    w-full
                                    text-base
                                "
                            />

                        </div>


                        {/* =================================================
                            STATE + CITY
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Location
                            </label>

                            <StateCityDropdown
                                stateValue={stateId}
                                cityValue={cityId}
                                onStateChange={setStateId}
                                onCityChange={setCityId}
                                statePlaceholder="Select State"
                                cityPlaceholder="Select City"
                                stateSearchPlaceholder="Search State"
                                citySearchPlaceholder="Search City"
                                stateEmptyMessage="No states found"
                                cityEmptyMessage="No cities found"
                            />

                        </div>


                        {/* =================================================
                            LOAN PURPOSE
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Loan Purpose
                            </label>

                            <input
                                type="text"
                                value={loanPurpose}
                                onChange={(event) =>
                                    setLoanPurpose(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter loan purpose"
                                className="
                                    input
                                    input-bordered
                                    h-14
                                    min-h-14
                                    w-full
                                    text-base
                                "
                            />

                        </div>


                        {/* =================================================
                            REMARKS
                        ================================================= */}

                        <div className="mb-5">

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/60
                                "
                            >
                                Remarks / Notes
                            </label>

                            <textarea
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter remarks"
                                rows={3}
                                className="
                                    textarea
                                    textarea-bordered
                                    min-h-[100px]
                                    w-full
                                    resize-none
                                    text-base
                                "
                            />

                        </div>


                        {/* =================================================
                            ASSIGNMENT INFO
                        ================================================= */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                bg-sky-50
                                px-4
                                py-4
                                text-sky-700
                            "
                        >

                            <InformationCircleIcon
                                className="
                                    mt-0.5
                                    h-5
                                    w-5
                                    shrink-0
                                "
                            />

                            <p className="text-sm">

                                Lead will be assigned to:{' '}

                                <strong>
                                    {assignedTo}
                                </strong>

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-end
                            gap-3
                            border-t
                            border-base-300
                            px-6
                            py-4
                        "
                    >

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                h-10
                                rounded-lg
                                px-5
                                text-sm
                                font-medium
                                text-base-content
                                transition
                                hover:bg-base-200
                            "
                        >
                            Close
                        </button>


                        <button
                            type="submit"
                            disabled={!canCreate}
                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-2
                                rounded-lg
                                bg-[#8BCF00]
                                px-5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-[#78B300]
                                disabled:cursor-not-allowed
                                disabled:bg-base-300
                                disabled:text-base-content/35
                            "
                        >

                            <UserPlusIcon
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            {loading
                                ? 'Creating...'
                                : 'Create Lead'}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}


export default CreateLeadModal