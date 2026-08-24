import React, { useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'

import { COLORS } from '../../../../constants/colors'


const BANKS = [
    {
        id: 1,
        name: 'Incred',
    },
    {
        id: 2,
        name: 'HDFC Bank',
    },
    {
        id: 3,
        name: 'ICICI Bank',
    },
    {
        id: 4,
        name: 'Axis Bank',
    },
    {
        id: 5,
        name: 'Bajaj Finance',
    },
]


function AssignBankModal({
    isOpen,
    onClose,
    onSubmit,
}) {

    const [selectedBank, setSelectedBank] =
        useState(null)

    const [isSaving, setIsSaving] =
        useState(false)


    /* -------------------------------------------------
        RESET
    -------------------------------------------------- */

    useEffect(() => {

        if (isOpen) {

            setSelectedBank(null)

            setIsSaving(false)

        }

    }, [isOpen])


    /* -------------------------------------------------
        SUBMIT
    -------------------------------------------------- */

    const handleSubmit = async (event) => {

        event.preventDefault()


        if (!selectedBank) {
            return
        }


        try {

            setIsSaving(true)


            if (onSubmit) {

                await onSubmit(selectedBank)

            }

        } catch (error) {

            console.error(
                'Failed to assign bank:',
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
                max-w-lg
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
                            Assign Bank
                        </h2>


                        <p className="
                            text-xs
                            text-base-content/50
                            mt-1
                        ">
                            Select a bank for this application.
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
                    ">


                        <label className="
                            text-sm
                            font-medium
                        ">
                            Select Bank

                            <span className="text-error ml-1">
                                *
                            </span>
                        </label>


                        <div className="
                            mt-3
                            space-y-2
                        ">

                            {BANKS.map((bank) => {

                                const selected =
                                    selectedBank?.id ===
                                    bank.id


                                return (

                                    <button
                                        key={bank.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedBank(
                                                bank
                                            )
                                        }
                                        className={`
                                            w-full
                                            flex
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            text-left
                                            transition-all
                                            ${
                                                selected
                                                    ? 'border-2'
                                                    : 'border-base-300'
                                            }
                                        `}
                                        style={
                                            selected
                                                ? {
                                                    borderColor:
                                                        COLORS.GREEN,

                                                    backgroundColor:
                                                        COLORS.GREEN_LIGHT,
                                                }
                                                : {}
                                        }
                                    >

                                        {/* BANK ICON */}

                                        <div
                                            className="
                                                w-9
                                                h-9
                                                rounded-lg
                                                flex
                                                items-center
                                                justify-center
                                                text-sm
                                                font-bold
                                                text-black
                                                shrink-0
                                            "
                                            style={{
                                                backgroundColor:
                                                    COLORS.GREEN,
                                            }}
                                        >

                                            {bank.name
                                                .charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        {/* BANK NAME */}

                                        <span className="
                                            flex-1
                                            text-sm
                                            font-medium
                                        ">
                                            {bank.name}
                                        </span>


                                        {/* SELECTED */}

                                        {selected && (

                                            <span
                                                className="
                                                    w-5
                                                    h-5
                                                    rounded-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-xs
                                                    text-black
                                                    font-bold
                                                "
                                                style={{
                                                    backgroundColor:
                                                        COLORS.GREEN,
                                                }}
                                            >
                                                ✓
                                            </span>

                                        )}

                                    </button>

                                )

                            })}

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
                                !selectedBank
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
                                ? 'ASSIGNING...'
                                : 'ASSIGN BANK'}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default AssignBankModal