import React, { useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { COLORS } from '../../../../constants/colors'


const INITIAL_FORM = {
    name: '',
    phone: '',
    relation: '',
    address: '',
}


function AddReferenceModal({
    isOpen,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] =
        useState(INITIAL_FORM)

    const [isSaving, setIsSaving] =
        useState(false)


    useEffect(() => {

        if (isOpen) {

            setFormData(INITIAL_FORM)
            setIsSaving(false)

        }

    }, [isOpen])


    const handleChange = (
        field,
        value
    ) => {

        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }))

    }


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

        } catch (error) {

            console.error(
                'Failed to add reference:',
                error
            )

        } finally {

            setIsSaving(false)

        }

    }


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
                bg-base-100
                rounded-2xl
                shadow-2xl
                border
                border-base-300
                overflow-hidden
            ">


                {/* HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    px-6
                    py-4
                    border-b
                    border-base-300
                ">

                    <h2 className="
                        text-lg
                        font-semibold
                    ">
                        Add New Reference
                    </h2>


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


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        px-6
                        py-5
                    ">

                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">


                            {/* REFERENCE NAME */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Reference Name

                                    <span className="text-error ml-1">
                                        *
                                    </span>
                                </label>


                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(event) =>
                                        handleChange(
                                            'name',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter reference name"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                    "
                                    required
                                />

                            </div>


                            {/* REFERENCE PHONE */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Reference Phone

                                    <span className="text-error ml-1">
                                        *
                                    </span>
                                </label>


                                <input
                                    type="tel"
                                    value={formData.phone}
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


                            {/* RELATION */}

                            <div>

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Relation with Reference
                                </label>


                                <input
                                    type="text"
                                    value={formData.relation}
                                    onChange={(event) =>
                                        handleChange(
                                            'relation',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter relation"
                                    className="
                                        input
                                        input-bordered
                                        w-full
                                        mt-2
                                    "
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="md:col-span-2">

                                <label className="
                                    text-sm
                                    font-medium
                                ">
                                    Reference Address
                                </label>


                                <textarea
                                    value={formData.address}
                                    onChange={(event) =>
                                        handleChange(
                                            'address',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter reference address"
                                    rows={4}
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


                    {/* FOOTER */}

                    <div className="
                        flex
                        items-center
                        justify-end
                        gap-3
                        px-6
                        py-4
                        border-t
                        border-base-300
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
                                border-none
                                text-black
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
                                : 'ADD REFERENCE'}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default AddReferenceModal