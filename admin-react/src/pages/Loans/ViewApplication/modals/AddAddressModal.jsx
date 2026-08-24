import React, { useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { COLORS } from '../../../../constants/colors'


const INITIAL_FORM = {
    address_type: 'CURRENT',
    address: '',
}


function AddAddressModal({
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


        if (!formData.address.trim()) {
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
                'Failed to add address:',
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


    /* -------------------------------------------------
        DON'T RENDER
    -------------------------------------------------- */

    if (!isOpen) {
        return null
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                p-4
            "
        >

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

            <div
                className="
                    relative
                    w-full
                    max-w-xl
                    bg-base-100
                    rounded-2xl
                    shadow-2xl
                    border
                    border-base-300
                    overflow-hidden
                "
            >


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
                            Add New Address
                        </h2>


                        <p className="
                            text-xs
                            text-base-content/50
                            mt-1
                        ">
                            Add an address for this application.
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

                <form onSubmit={handleSubmit}>

                    <div className="
                        px-6
                        py-5
                        space-y-5
                    ">


                        {/* ADDRESS TYPE */}

                        <div>

                            <label className="
                                text-sm
                                font-medium
                            ">
                                Address Type
                            </label>


                            <select
                                value={
                                    formData.address_type
                                }
                                onChange={(event) =>
                                    handleChange(
                                        'address_type',
                                        event.target.value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    mt-2
                                "
                            >

                                <option value="CURRENT">
                                    Current Address
                                </option>

                                <option value="PERMANENT">
                                    Permanent Address
                                </option>

                                <option value="OFFICE">
                                    Office Address
                                </option>

                                <option value="OTHER">
                                    Other Address
                                </option>

                            </select>

                        </div>


                        {/* ADDRESS */}

                        <div>

                            <label className="
                                text-sm
                                font-medium
                            ">

                                Address

                                <span className="text-error ml-1">
                                    *
                                </span>

                            </label>


                            <textarea
                                value={
                                    formData.address
                                }
                                onChange={(event) =>
                                    handleChange(
                                        'address',
                                        event.target.value
                                    )
                                }
                                placeholder="Enter complete address"
                                rows={5}
                                className="
                                    textarea
                                    textarea-bordered
                                    w-full
                                    mt-2
                                    resize-none
                                "
                                required
                            />

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
                        bg-base-50
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
                                !formData.address.trim()
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

                            {isSaving ? (

                                <span className="
                                    loading
                                    loading-spinner
                                    loading-xs
                                " />

                            ) : null}


                            {isSaving
                                ? 'ADDING...'
                                : 'ADD ADDRESS'}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default AddAddressModal