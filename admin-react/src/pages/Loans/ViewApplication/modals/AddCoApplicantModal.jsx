import React, { useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { COLORS } from '../../../../constants/colors'


const INITIAL_FORM = {
    name: '',
    phone: '',
    date_of_birth: '',
    pan_number: '',
    aadhaar_number: '',
    current_address: '',
    permanent_address: '',
}


function AddCoApplicantModal({
    isOpen,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] =
        useState(INITIAL_FORM)

    const [isSaving, setIsSaving] =
        useState(false)


    /* -------------------------------------------------
        RESET FORM
    -------------------------------------------------- */

    useEffect(() => {

        if (isOpen) {

            setFormData(INITIAL_FORM)

            setIsSaving(false)

        }

    }, [isOpen])


    /* -------------------------------------------------
        CHANGE
    -------------------------------------------------- */

    const handleChange = (
        field,
        value
    ) => {

        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }))

    }


    /* -------------------------------------------------
        SUBMIT
    -------------------------------------------------- */

    const handleSubmit = async (event) => {

        event.preventDefault()


        if (
            !formData.name.trim() ||
            !formData.phone.trim()
        ) {
            return
        }


        try {

            setIsSaving(true)


            if (onSubmit) {

                await onSubmit(formData)

            }


            setFormData(INITIAL_FORM)

        } catch (error) {

            console.error(
                'Failed to add co-applicant:',
                error
            )

        } finally {

            setIsSaving(false)

        }

    }


    /* -------------------------------------------------
        CLOSE
    -------------------------------------------------- */

    const handleClose = () => {

        if (isSaving) {
            return
        }

        onClose()

    }


    if (!isOpen) {
        return null
    }


    return (

        <div className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
        ">

            {/* BACKDROP */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/40
                    backdrop-blur-[1px]
                "
                onClick={handleClose}
            />


            {/* MODAL */}

            <div className="
                relative
                w-full
                max-w-3xl
                max-h-[90vh]
                bg-base-100
                rounded-2xl
                shadow-2xl
                border
                border-base-300
                overflow-hidden
            ">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="
                    flex
                    items-center
                    justify-between
                    px-6
                    py-4
                    border-b
                    border-base-300
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                        ">
                            Add New Co-Applicant
                        </h2>


                        <p className="
                            text-xs
                            text-base-content/50
                            mt-1
                        ">
                            Add the co-applicant details for this application.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            btn
                            btn-sm
                            btn-circle
                            btn-ghost
                        "
                    >

                        <XMarkIcon
                            className="w-5 h-5"
                        />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col max-h-[calc(90vh-75px)]"
                >

                    <div className="
                        overflow-y-auto
                        px-6
                        py-5
                    ">

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">


                            {/* NAME */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">

                                    Name

                                    <span className="text-error ml-1">
                                        *
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    value={
                                        formData.name
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'name',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter full name"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                    "
                                    required
                                />

                            </div>


                            {/* PHONE */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">

                                    Phone Number

                                    <span className="text-error ml-1">
                                        *
                                    </span>

                                </label>


                                <input
                                    type="tel"
                                    value={
                                        formData.phone
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'phone',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter phone number"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                    "
                                    required
                                />

                            </div>


                            {/* DATE OF BIRTH */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Date of Birth
                                </label>


                                <input
                                    type="date"
                                    value={
                                        formData.date_of_birth
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'date_of_birth',
                                            event.target.value
                                        )
                                    }
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                    "
                                />

                            </div>


                            {/* PAN */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    PAN Card Number
                                </label>


                                <input
                                    type="text"
                                    value={
                                        formData.pan_number
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'pan_number',
                                            event.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Enter PAN number"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                        uppercase
                                    "
                                />

                            </div>


                            {/* AADHAAR */}

                            <div className="md:col-span-2">

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Aadhaar Number
                                </label>


                                <input
                                    type="text"
                                    value={
                                        formData.aadhaar_number
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'aadhaar_number',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter Aadhaar number"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                    "
                                />

                            </div>


                            {/* CURRENT ADDRESS */}

                            <div className="md:col-span-2">

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Current Address
                                </label>


                                <textarea
                                    value={
                                        formData.current_address
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'current_address',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter current address"
                                    rows={3}
                                    className="
                                        textarea
                                        textarea-bordered
                                        w-full
                                        mt-2
                                        resize-none
                                    "
                                />

                            </div>


                            {/* PERMANENT ADDRESS */}

                            <div className="md:col-span-2">

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Permanent Address
                                </label>


                                <textarea
                                    value={
                                        formData.permanent_address
                                    }
                                    onChange={(event) =>
                                        handleChange(
                                            'permanent_address',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter permanent address"
                                    rows={3}
                                    className="
                                        textarea
                                        textarea-bordered
                                        w-full
                                        mt-2
                                        resize-none
                                    "
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        px-6
                        py-4
                        border-t
                        border-base-300
                        bg-base-100
                    ">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="
                                btn
                                btn-sm
                                btn-outline
                            "
                        >
                            CANCEL
                        </button>


                        <button
                            type="submit"
                            disabled={
                                isSaving ||
                                !formData.name.trim() ||
                                !formData.phone.trim()
                            }
                            className="
                                btn
                                btn-sm
                                text-black
                                border-none
                            "
                            style={{
                                backgroundColor:
                                    COLORS.GREEN,
                            }}
                        >

                            {isSaving && (

                                <span className="
                                    loading
                                    loading-spinner
                                    loading-xs
                                " />

                            )}

                            {isSaving
                                ? 'ADDING...'
                                : 'ADD CO-APPLICANT'}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default AddCoApplicantModal