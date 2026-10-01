// admin-react/src/pages/Banks&DSA/DSADirectory/components/DSADirectoryModal.jsx

import { useEffect, useMemo, useRef, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


const EMPTY_FORM = {
    dsaName: '',
    dsaCode: '',
    bank: '',
    loanType: '',
    status: 'active',
    isDefault: false,
}


function DSAModal({
    open = false,
    entry = null,
    banks = [],
    loanTypes = [],
    existingEntries = [],
    onClose,
    onSubmit,
}) {

    // =========================================================
    // FORM
    // =========================================================

    const [form, setForm] =
        useState(EMPTY_FORM)


    const [errors, setErrors] =
        useState({})


    // =========================================================
    // BANK DROPDOWN
    // =========================================================

    const [bankOpen, setBankOpen] =
        useState(false)


    const [bankSearch, setBankSearch] =
        useState('')


    const bankDropdownRef =
        useRef(null)


    // =========================================================
    // INITIALIZE FORM
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        if (entry) {

            setForm({
                dsaName:
                    entry.dsaName || '',

                dsaCode:
                    entry.dsaCode || '',

                bank:
                    entry.bank || '',

                loanType:
                    entry.loanType || '',

                status:
                    entry.status || 'active',

                isDefault:
                    Boolean(entry.isDefault),
            })

        } else {

            setForm({
                ...EMPTY_FORM,
            })

        }


        setErrors({})
        setBankSearch('')
        setBankOpen(false)

    }, [
        open,
        entry,
    ])


    // =========================================================
    // CLOSE BANK DROPDOWN WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                bankDropdownRef.current &&
                !bankDropdownRef.current.contains(
                    event.target
                )
            ) {

                setBankOpen(false)

            }

        }


        document.addEventListener(
            'mousedown',
            handleOutsideClick
        )


        return () => {

            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            )

        }

    }, [])


    // =========================================================
    // FILTER BANKS
    // =========================================================

    const filteredBanks = useMemo(() => {

        const searchValue =
            bankSearch
                .trim()
                .toLowerCase()


        if (!searchValue) {
            return banks
        }


        return banks.filter(
            (bank) =>
                String(bank)
                    .toLowerCase()
                    .includes(searchValue)
        )

    }, [
        banks,
        bankSearch,
    ])


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target


        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        )


        setErrors(
            (previous) => ({
                ...previous,
                [name]: '',
            })
        )

    }


    // =========================================================
    // BANK SELECT
    // =========================================================

    const handleBankSelect = (bank) => {

        setForm(
            (previous) => ({
                ...previous,
                bank,
            })
        )


        setErrors(
            (previous) => ({
                ...previous,
                bank: '',
            })
        )


        setBankSearch('')
        setBankOpen(false)

    }


    // =========================================================
    // DEFAULT CHANGE
    // =========================================================

    const handleDefaultChange = () => {

        setForm(
            (previous) => ({
                ...previous,
                isDefault:
                    !previous.isDefault,
            })
        )

    }


    // =========================================================
    // VALIDATION
    // =========================================================

    const validate = () => {

        const nextErrors = {}


        // -----------------------------------------------------
        // DSA NAME
        // -----------------------------------------------------

        if (!form.dsaName.trim()) {

            nextErrors.dsaName =
                'DSA name is required.'

        }


        // -----------------------------------------------------
        // BANK
        // -----------------------------------------------------

        if (!form.bank.trim()) {

            nextErrors.bank =
                'Please select a bank.'

        }


        // -----------------------------------------------------
        // LOAN TYPE
        // -----------------------------------------------------

        if (!form.loanType) {

            nextErrors.loanType =
                'Please select a loan type.'

        }


        // -----------------------------------------------------
        // DEFAULT DUPLICATE CHECK
        // -----------------------------------------------------

        if (
            form.isDefault &&
            form.bank &&
            form.loanType
        ) {

            const duplicateDefault =
                existingEntries.some(
                    (item) => {

                        if (
                            entry &&
                            item.id === entry.id
                        ) {
                            return false
                        }


                        return (
                            item.bank ===
                                form.bank &&
                            item.loanType ===
                                form.loanType &&
                            item.isDefault === true
                        )

                    }
                )


            /*
             * This is not treated as an error.
             *
             * The parent page will automatically remove
             * the previous default when this DSA is saved.
             */

            if (duplicateDefault) {

                // Intentionally allowed.

            }

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

            ...(entry || {}),

            dsaName:
                form.dsaName.trim(),

            dsaCode:
                form.dsaCode.trim(),

            bank:
                form.bank,

            loanType:
                form.loanType,

            status:
                form.status,

            isDefault:
                Boolean(form.isDefault),

        }


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

        setBankSearch('')
        setBankOpen(false)

        onClose?.()

    }


    // =========================================================
    // DON'T RENDER
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

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-base-content
                        ">

                            {entry
                                ? 'Edit DSA'
                                : 'Add DSA'}

                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/50
                        ">

                            {entry
                                ? 'Update DSA configuration'
                                : 'Add a new DSA configuration'}

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
                        max-h-[70vh]
                        overflow-y-auto
                        px-5
                        py-5
                    ">

                        <div className="
                            space-y-4
                        ">

                            {/* =====================================
                                DSA NAME
                            ===================================== */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/70
                                ">

                                    DSA Name

                                    <span className="
                                        text-error
                                    ">
                                        {' '}*
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="dsaName"
                                    value={
                                        form.dsaName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter DSA name"
                                    className={[
                                        'input',
                                        'input-bordered',
                                        'h-10',
                                        'min-h-10',
                                        'w-full',
                                        errors.dsaName
                                            ? 'input-error'
                                            : '',
                                    ].join(' ')}
                                />


                                {errors.dsaName && (

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-error
                                    ">
                                        {
                                            errors.dsaName
                                        }
                                    </p>

                                )}

                            </div>


                            {/* =====================================
                                DSA CODE
                            ===================================== */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/70
                                ">

                                    DSA Code

                                    <span className="
                                        ml-1
                                        font-normal
                                        text-base-content/40
                                    ">
                                        Optional
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="dsaCode"
                                    value={
                                        form.dsaCode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter DSA code"
                                    className="
                                        input
                                        input-bordered
                                        h-10
                                        min-h-10
                                        w-full
                                    "
                                />

                            </div>


                            {/* =====================================
                                BANK
                            ===================================== */}

                            <div
                                ref={
                                    bankDropdownRef
                                }
                            >

                                <label className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/70
                                ">

                                    Bank

                                    <span className="
                                        text-error
                                    ">
                                        {' '}*
                                    </span>

                                </label>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setBankOpen(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    className={[
                                        'flex',
                                        'h-10',
                                        'w-full',
                                        'items-center',
                                        'justify-between',
                                        'rounded-lg',
                                        'border',
                                        'bg-base-100',
                                        'px-3',
                                        'text-left',
                                        'text-sm',
                                        'transition',
                                        'focus:outline-none',
                                        'focus:ring-2',
                                        'focus:ring-[#8BCF00]/30',
                                        errors.bank
                                            ? 'border-error'
                                            : 'border-base-300',
                                    ].join(' ')}
                                >

                                    <span
                                        className={
                                            form.bank
                                                ? 'text-base-content'
                                                : 'text-base-content/40'
                                        }
                                    >

                                        {form.bank ||
                                            'Select bank'}

                                    </span>


                                    <ChevronDownIcon
                                        className={[
                                            'h-4',
                                            'w-4',
                                            'shrink-0',
                                            'text-base-content/40',
                                            'transition-transform',
                                            bankOpen
                                                ? 'rotate-180'
                                                : '',
                                        ].join(' ')}
                                    />

                                </button>


                                {bankOpen && (

                                    <div className="
                                        relative
                                        z-20
                                    ">

                                        <div className="
                                            absolute
                                            left-0
                                            right-0
                                            mt-1
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-base-300
                                            bg-base-100
                                            shadow-xl
                                        ">

                                            {/* SEARCH */}

                                            <div className="
                                                border-b
                                                border-base-300
                                                p-2
                                            ">

                                                <div className="
                                                    relative
                                                ">

                                                    <MagnifyingGlassIcon className="
                                                        pointer-events-none
                                                        absolute
                                                        left-3
                                                        top-1/2
                                                        h-4
                                                        w-4
                                                        -translate-y-1/2
                                                        text-base-content/35
                                                    " />


                                                    <input
                                                        type="text"
                                                        value={
                                                            bankSearch
                                                        }
                                                        onChange={(event) =>
                                                            setBankSearch(
                                                                event.target.value
                                                            )
                                                        }
                                                        onClick={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                        autoFocus
                                                        placeholder="Search bank..."
                                                        className="
                                                            input
                                                            input-bordered
                                                            h-9
                                                            min-h-9
                                                            w-full
                                                            pl-9
                                                            text-sm
                                                        "
                                                    />

                                                </div>

                                            </div>


                                            {/* BANK LIST */}

                                            <div className="
                                                max-h-48
                                                overflow-y-auto
                                                p-1
                                            ">

                                                {filteredBanks.length > 0 ? (

                                                    filteredBanks.map(
                                                        (bank) => (

                                                            <button
                                                                key={
                                                                    bank
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleBankSelect(
                                                                        bank
                                                                    )
                                                                }
                                                                className={[
                                                                    'flex',
                                                                    'w-full',
                                                                    'items-center',
                                                                    'rounded-lg',
                                                                    'px-3',
                                                                    'py-2.5',
                                                                    'text-left',
                                                                    'text-sm',
                                                                    'transition',
                                                                    form.bank ===
                                                                    bank
                                                                        ? 'bg-[#8BCF00]/10 font-medium text-[#6FA800]'
                                                                        : 'text-base-content hover:bg-base-200',
                                                                ].join(' ')}
                                                            >

                                                                {bank}

                                                            </button>

                                                        )
                                                    )

                                                ) : (

                                                    <div className="
                                                        px-3
                                                        py-6
                                                        text-center
                                                        text-xs
                                                        text-base-content/45
                                                    ">
                                                        No banks found
                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )}


                                {errors.bank && (

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-error
                                    ">
                                        {
                                            errors.bank
                                        }
                                    </p>

                                )}

                            </div>


                            {/* =====================================
                                LOAN TYPE
                            ===================================== */}

                            <div>

                                <label className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-medium
                                    text-base-content/70
                                ">

                                    Loan Type

                                    <span className="
                                        text-error
                                    ">
                                        {' '}*
                                    </span>

                                </label>


                                <select
                                    name="loanType"
                                    value={
                                        form.loanType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={[
                                        'select',
                                        'select-bordered',
                                        'h-10',
                                        'min-h-10',
                                        'w-full',
                                        errors.loanType
                                            ? 'select-error'
                                            : '',
                                    ].join(' ')}
                                >

                                    <option value="">
                                        Select loan type
                                    </option>


                                    {loanTypes.map(
                                        (loanType) => (

                                            <option
                                                key={
                                                    loanType
                                                }
                                                value={
                                                    loanType
                                                }
                                            >
                                                {
                                                    loanType
                                                }
                                            </option>

                                        )
                                    )}

                                </select>


                                {errors.loanType && (

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-error
                                    ">
                                        {
                                            errors.loanType
                                        }
                                    </p>

                                )}

                            </div>


                            {/* =====================================
                                STATUS
                            ===================================== */}

                            <div>

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
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        select
                                        select-bordered
                                        h-10
                                        min-h-10
                                        w-full
                                    "
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>


                            {/* =====================================
                                DEFAULT
                            ===================================== */}

                            <div className="
                                rounded-xl
                                border
                                border-base-300
                                bg-base-200/30
                                p-4
                            ">

                                <label className="
                                    flex
                                    cursor-pointer
                                    items-start
                                    gap-3
                                ">

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.isDefault
                                        }
                                        onChange={
                                            handleDefaultChange
                                        }
                                        className="
                                            checkbox
                                            checkbox-sm
                                            mt-0.5
                                            border-base-content/30
                                            checked:border-[#8BCF00]
                                            checked:bg-[#8BCF00]
                                            checked:text-white
                                        "
                                    />


                                    <span className="
                                        min-w-0
                                    ">

                                        <span className="
                                            block
                                            text-sm
                                            font-medium
                                            text-base-content
                                        ">
                                            Set as default DSA
                                        </span>


                                        <span className="
                                            mt-0.5
                                            block
                                            text-xs
                                            leading-5
                                            text-base-content/50
                                        ">
                                            This DSA will be used by default
                                            for the selected bank and loan type.
                                        </span>

                                    </span>

                                </label>

                            </div>

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

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                btn
                                btn-ghost
                                h-10
                                min-h-10
                                w-full
                                sm:w-auto
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="
                                btn
                                h-10
                                min-h-10
                                w-full
                                border-none
                                bg-[#8BCF00]
                                px-5
                                text-white
                                hover:bg-[#78B300]
                                sm:w-auto
                            "
                        >

                            {entry
                                ? 'Update DSA'
                                : 'Add DSA'}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}


export default DSAModal