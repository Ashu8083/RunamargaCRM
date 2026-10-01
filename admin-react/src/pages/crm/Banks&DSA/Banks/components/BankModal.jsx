// admin-react/src/pages/BanksAndDSA/Banks/components/BankModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'


const EMPTY_FORM = {
    name: '',
    is_active: true,
}


function BankModal({
    open = false,
    bank = null,
    onClose,
    onSubmit,
}) {

    const [form, setForm] =
        useState(EMPTY_FORM)

    const [errors, setErrors] =
        useState({})


    // =========================================================
    // INITIALIZE FORM
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        if (bank) {

           setForm({
                             name: bank.name || '',
                             is_active: bank.is_active ?? true,
                    })

        } else {

            setForm({
                ...EMPTY_FORM,
            })

        }


        setErrors({})

    }, [open, bank])


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }))


        setErrors((previous) => ({
            ...previous,
            [name]: '',
        }))

    }


    // =========================================================
    // VALIDATION
    // =========================================================

    const validate = () => {

        const nextErrors = {}


        if (!form.name.trim()) {

            nextErrors.name =
                'Bank name is required.'

        }


        setErrors(nextErrors)


        return (
            Object.keys(nextErrors).length === 0
        )

    }


    // =========================================================
    // SUBMIT
    // =========================================================

   const handleSubmit = (event) => {

    event.preventDefault()

    if (!validate()) {
        return
    }

    const payload = {
        ...(bank || {}),
        name: form.name.trim(),
        is_active: form.is_active,
    }

    console.log('SUBMIT PAYLOAD:', payload)

    onSubmit?.(payload)
}

    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setForm({
            ...EMPTY_FORM,
        })

        setErrors({})

        onClose?.()

    }


    // =========================================================
    // DO NOT RENDER WHEN CLOSED
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

            {/* =====================================================
                MODAL
            ===================================================== */}

            <div className="
                w-full
                max-w-md
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

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-base-content
                        ">

                            {bank
                                ? 'Edit Bank'
                                : 'Add Bank'}

                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">

                            {bank
                                ? 'Update bank details'
                                : 'Add a new bank'}

                        </p>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="
                            flex
                            h-9
                            w-9
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
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="
                        px-5
                        py-5
                    ">

                        {/* =================================================
                            BANK NAME
                        ================================================= */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/70
                            ">

                                Bank Name

                                <span className="
                                    text-error
                                ">
                                    {' '}*
                                </span>

                            </label>


                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter bank name"
                                autoFocus
                                className={[
                                    'input',
                                    'input-bordered',
                                    'w-full',
                                    errors.name
                                        ? 'input-error'
                                        : '',
                                ].join(' ')}
                            />


                            {errors.name && (

                                <p className="
                                    mt-1
                                    text-xs
                                    text-error
                                ">
                                    {errors.name}
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div className="
                            mt-4
                        ">

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/70
                            ">

                                Status

                            </label>


                            <select

    name="is_active"

    value={String(form.is_active)}
    onChange={(event) =>
        setForm((previous) => ({
            ...previous,
            is_active: event.target.value === 'true',

        }))
    }
    className="
        select
        select-bordered
        w-full
    "
>
    <option value="true">
        Active
    </option>
    <option value="false">
        Inactive
    </option>
</select>


                            <p className="
                                mt-1.5
                                text-[11px]
                                text-base-content/45
                            ">
                                Inactive banks will not be
                                available for new assignments.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        flex-col-reverse
                        gap-2
                        border-t
                        border-base-300
                        px-5
                        py-4
                        sm:flex-row
                        sm:justify-end
                    ">

                        {/* CANCEL */}

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                btn
                                btn-ghost
                                w-full
                                sm:w-auto
                            "
                        >
                            Cancel
                        </button>


                        {/* SAVE */}

                        <button
                            type="submit"
                            className="
                                btn
                                w-full
                                border-none
                                bg-[#8BCF00]
                                text-white
                                shadow-none
                                hover:bg-[#78B300]
                                sm:w-auto
                            "
                        >

                            {bank
                                ? 'Update Bank'
                                : 'Add Bank'}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}


export default BankModal