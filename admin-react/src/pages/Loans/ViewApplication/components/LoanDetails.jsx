import React, { useEffect, useState } from 'react'
import { COLORS } from '../../../../constants/colors'

function Field({ label, value }) {

    return (
        <div>

            <p className="text-xs text-base-content/50">
                {label}
            </p>

            <p className="text-sm font-medium mt-1">
                {value !== null &&
                    value !== undefined &&
                    value !== ''
                    ? value
                    : 'Not provided'}
            </p>

        </div>
    )
}


function EditField({
    label,
    value,
    onChange,
}) {

    return (
        <div>

            <label className="text-xs text-base-content/50">
                {label}
            </label>

            <input
                type="text"
                value={value ?? ''}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="input input-bordered input-sm w-full mt-1"
            />

        </div>
    )
}


function LoanDetails({ application }) {

    const commonFields =
        application?.common_fields || {}

    const loanFields =
        application?.loan_fields || {}


    const [isEditing, setIsEditing] = useState(false)

    const [editCommonFields, setEditCommonFields] =
        useState(commonFields)

    const [editLoanFields, setEditLoanFields] =
        useState(loanFields)


    /*
        Keep local edit state synchronized if the
        application changes from the backend.
    */

    useEffect(() => {

        if (!isEditing) {

            setEditCommonFields(
                application?.common_fields || {}
            )

            setEditLoanFields(
                application?.loan_fields || {}
            )

        }

    }, [application, isEditing])


    /* -------------------------------------------------
        START EDITING
    -------------------------------------------------- */

    const handleEdit = () => {

        setEditCommonFields({
            ...commonFields,
        })

        setEditLoanFields({
            ...loanFields,
        })

        setIsEditing(true)
    }


    /* -------------------------------------------------
        CANCEL
    -------------------------------------------------- */

    const handleCancel = () => {

        setEditCommonFields({
            ...commonFields,
        })

        setEditLoanFields({
            ...loanFields,
        })

        setIsEditing(false)
    }


    /* -------------------------------------------------
        SAVE
    -------------------------------------------------- */

    const handleSave = () => {

        /*
            For now we only update the local UI.

            Later this will call FastAPI:

            PATCH /api/v1/applications/{id}/loan-details

        */

        console.log('Updated common fields:', editCommonFields)

        console.log('Updated loan fields:', editLoanFields)

        setIsEditing(false)
    }


    /* -------------------------------------------------
        COMMON FIELD CHANGE
    -------------------------------------------------- */

    const handleCommonFieldChange = (
        key,
        value
    ) => {

        setEditCommonFields((previous) => ({
            ...previous,
            [key]: value,
        }))

    }


    /* -------------------------------------------------
        LOAN FIELD CHANGE
    -------------------------------------------------- */

    const handleLoanFieldChange = (
        key,
        value
    ) => {

        setEditLoanFields((previous) => ({
            ...previous,
            [key]: value,
        }))

    }


    return (

        <div className="card bg-base-100 border border-base-300 shadow-sm">

            <div className="card-body">


                {/* -------------------------------------------------
                    HEADER
                -------------------------------------------------- */}

                <div className="flex items-center justify-between gap-3">

                    <h2 className="text-lg font-semibold">
                        {application?.loan_type_label ||
                            application?.loan_type ||
                            'Loan'} Details
                    </h2>


                    {!isEditing ? (

                        <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                                backgroundColor:
                                    COLORS.GREEN,

                            }}
                            onClick={handleEdit}
                        >
                            ✎ Edit Details
                        </button>

                    ) : (

                        <div className="flex gap-2">

                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={handleSave}
                            >
                                Save
                            </button>

                        </div>

                    )}

                </div>


                {/* -------------------------------------------------
                    COMMON FIELDS
                -------------------------------------------------- */}

                <div className="mt-5 rounded-xl bg-base-200/60 p-5">

                    <h3 className="text-sm font-semibold">
                        Common Fields
                    </h3>


                    <div className="divider my-2"></div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">


                        {isEditing ? (

                            <>

                                <EditField
                                    label="Email Address"
                                    value={
                                        editCommonFields.email
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'email',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Gender"
                                    value={
                                        editCommonFields.gender
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'gender',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Marital Status"
                                    value={
                                        editCommonFields.marital_status
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'marital_status',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Date of Birth"
                                    value={
                                        editCommonFields.date_of_birth
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'date_of_birth',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="PAN Number"
                                    value={
                                        editCommonFields.pan_number
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'pan_number',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Aadhaar Number"
                                    value={
                                        editCommonFields.aadhaar_number
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'aadhaar_number',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Loan Amount"
                                    value={
                                        editCommonFields.loan_amount
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'loan_amount',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Loan Tenure (months)"
                                    value={
                                        editCommonFields.loan_tenure
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'loan_tenure',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="Bank Account Number"
                                    value={
                                        editCommonFields.bank_account_number
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'bank_account_number',
                                            value
                                        )
                                    }
                                />


                                <EditField
                                    label="IFSC Code"
                                    value={
                                        editCommonFields.ifsc_code
                                    }
                                    onChange={(value) =>
                                        handleCommonFieldChange(
                                            'ifsc_code',
                                            value
                                        )
                                    }
                                />

                            </>

                        ) : (

                            <>

                                <Field
                                    label="Email Address"
                                    value={
                                        commonFields.email
                                    }
                                />


                                <Field
                                    label="Gender"
                                    value={
                                        commonFields.gender
                                    }
                                />


                                <Field
                                    label="Marital Status"
                                    value={
                                        commonFields.marital_status
                                    }
                                />


                                <Field
                                    label="Date of Birth"
                                    value={
                                        commonFields.date_of_birth
                                    }
                                />


                                <Field
                                    label="PAN Number"
                                    value={
                                        commonFields.pan_number
                                    }
                                />


                                <Field
                                    label="Aadhaar Number"
                                    value={
                                        commonFields.aadhaar_number
                                    }
                                />


                                <Field
                                    label="Loan Amount"
                                    value={
                                        commonFields.loan_amount
                                            ? `₹ ${Number(
                                                commonFields.loan_amount
                                            ).toLocaleString('en-IN')}`
                                            : null
                                    }
                                />


                                <Field
                                    label="Loan Tenure (months)"
                                    value={
                                        commonFields.loan_tenure
                                    }
                                />


                                <Field
                                    label="Bank Account Number"
                                    value={
                                        commonFields.bank_account_number
                                    }
                                />


                                <Field
                                    label="IFSC Code"
                                    value={
                                        commonFields.ifsc_code
                                    }
                                />

                            </>

                        )}

                    </div>

                </div>


                {/* -------------------------------------------------
                    LOAN SPECIFIC FIELDS
                -------------------------------------------------- */}

                {Object.keys(
                    isEditing
                        ? editLoanFields
                        : loanFields
                ).length > 0 && (

                        <div className="mt-5 rounded-xl bg-base-200/60 p-5">

                            <h3 className="text-sm font-semibold">
                                {application?.loan_type_label ||
                                    'Loan'} Specific Fields
                            </h3>


                            <div className="divider my-2"></div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">

                                {Object.entries(
                                    isEditing
                                        ? editLoanFields
                                        : loanFields
                                ).map(([key, value]) => (

                                    isEditing ? (

                                        <EditField
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value}
                                            onChange={(newValue) =>
                                                handleLoanFieldChange(
                                                    key,
                                                    newValue
                                                )
                                            }
                                        />

                                    ) : (

                                        <Field
                                            key={key}
                                            label={formatLabel(key)}
                                            value={value}
                                        />

                                    )

                                ))}

                            </div>

                        </div>

                    )}

            </div>

        </div>
    )
}


/* -------------------------------------------------
    FIELD LABEL FORMATTER
-------------------------------------------------- */

function formatLabel(key) {

    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        )
}


export default LoanDetails