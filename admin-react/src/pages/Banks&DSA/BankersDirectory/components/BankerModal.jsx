// admin-react/src/pages/Banks&DSA/BankersDirectory/components/BankerModal.jsx

import { useEffect, useMemo, useState } from 'react'


// =============================================================
// EMPTY PERSON
// =============================================================

const createPerson = () => ({
    id: Date.now() + Math.random(),
    name: '',
    phone: '',
    email: '',
})


// =============================================================
// EMPTY FORM
// =============================================================

const EMPTY_FORM = {
    state: '',
    city: '',
    bank: '',
    loanType: '',
    status: 'active',
    sms: [],
    asms: [],
}


// =============================================================
// COMPONENT
// =============================================================

function BankerModal({
    open = false,
    entry = null,
    states = [],
    banks = [],
    loanTypes = [],
    onClose,
    onSubmit,
}) {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [form, setForm] =
        useState(EMPTY_FORM)


    const [errors, setErrors] =
        useState({})


    // =========================================================
    // DROPDOWN STATE
    // =========================================================

    const [openDropdown, setOpenDropdown] =
        useState(null)


    const [stateSearch, setStateSearch] =
        useState('')


    const [citySearch, setCitySearch] =
        useState('')


    const [bankSearch, setBankSearch] =
        useState('')


    // =========================================================
    // EDIT / ADD INITIALIZATION
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        if (entry) {

            setForm({
                state: entry.state || '',
                city: entry.city || '',
                bank: entry.bank || '',
                loanType: entry.loanType || '',
                status: entry.status || 'active',

                sms: Array.isArray(entry.sms)
                    ? entry.sms.map((person) => ({
                        ...person,
                    }))
                    : [],

                asms: Array.isArray(entry.asms)
                    ? entry.asms.map((person) => ({
                        ...person,
                    }))
                    : [],
            })

        } else {

            setForm({
                ...EMPTY_FORM,
                sms: [],
                asms: [],
            })

        }


        setErrors({})

        setOpenDropdown(null)

        setStateSearch('')
        setCitySearch('')
        setBankSearch('')

    }, [open, entry])


    // =========================================================
    // CITY OPTIONS
    // =========================================================

    const cityOptions = useMemo(() => {

        /*
         * Cities are derived from the available entries
         * through the parent component.
         *
         * If the parent later provides a dedicated city
         * list, this component can use it directly.
         */

        if (!form.state) {
            return []
        }

        /*
         * Current parent structure does not directly provide
         * city options, so keep the existing city value
         * available during edit.
         */

        if (form.city) {
            return [form.city]
        }

        return []

    }, [
        form.state,
        form.city,
    ])


    // =========================================================
    // FILTER DROPDOWN OPTIONS
    // =========================================================

    const filteredStates = useMemo(() => {

        const search =
            stateSearch
                .trim()
                .toLowerCase()


        if (!search) {
            return states
        }


        return states.filter(
            (state) =>
                String(state)
                    .toLowerCase()
                    .includes(search)
        )

    }, [
        states,
        stateSearch,
    ])


    const filteredCities = useMemo(() => {

        const search =
            citySearch
                .trim()
                .toLowerCase()


        if (!search) {
            return cityOptions
        }


        return cityOptions.filter(
            (city) =>
                String(city)
                    .toLowerCase()
                    .includes(search)
        )

    }, [
        cityOptions,
        citySearch,
    ])


    const filteredBanks = useMemo(() => {

        const search =
            bankSearch
                .trim()
                .toLowerCase()


        if (!search) {
            return banks
        }


        return banks.filter(
            (bank) =>
                String(bank)
                    .toLowerCase()
                    .includes(search)
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
    // STATE SELECT
    // =========================================================

    const handleStateSelect = (state) => {

        setForm((previous) => ({
            ...previous,
            state,
            city: '',
            bank: '',
        }))


        setErrors((previous) => ({
            ...previous,
            state: '',
            city: '',
            bank: '',
        }))


        setOpenDropdown(null)

        setStateSearch('')

        setCitySearch('')

        setBankSearch('')

    }


    // =========================================================
    // CITY SELECT
    // =========================================================

    const handleCitySelect = (city) => {

        setForm((previous) => ({
            ...previous,
            city,
            bank: '',
        }))


        setErrors((previous) => ({
            ...previous,
            city: '',
            bank: '',
        }))


        setOpenDropdown(null)

        setCitySearch('')

        setBankSearch('')

    }


    // =========================================================
    // BANK SELECT
    // =========================================================

    const handleBankSelect = (bank) => {

        setForm((previous) => ({
            ...previous,
            bank,
        }))


        setErrors((previous) => ({
            ...previous,
            bank: '',
        }))


        setOpenDropdown(null)

        setBankSearch('')

    }


    // =========================================================
    // ADD SM
    // =========================================================

    const handleAddSM = () => {

        setForm((previous) => ({
            ...previous,

            sms: [
                ...previous.sms,
                createPerson(),
            ],
        }))

    }


    // =========================================================
    // ADD ASM
    // =========================================================

    const handleAddASM = () => {

        setForm((previous) => ({
            ...previous,

            asms: [
                ...previous.asms,
                createPerson(),
            ],
        }))

    }


    // =========================================================
    // UPDATE SM
    // =========================================================

    const handleSMChange = (
        personId,
        field,
        value
    ) => {

        setForm((previous) => ({

            ...previous,

            sms: previous.sms.map(
                (person) =>
                    person.id === personId
                        ? {
                            ...person,
                            [field]: value,
                        }
                        : person
            ),

        }))


        setErrors((previous) => ({
            ...previous,
            sms: '',
        }))

    }


    // =========================================================
    // UPDATE ASM
    // =========================================================

    const handleASMChange = (
        personId,
        field,
        value
    ) => {

        setForm((previous) => ({

            ...previous,

            asms: previous.asms.map(
                (person) =>
                    person.id === personId
                        ? {
                            ...person,
                            [field]: value,
                        }
                        : person
            ),

        }))


        setErrors((previous) => ({
            ...previous,
            asms: '',
        }))

    }


    // =========================================================
    // REMOVE SM
    // =========================================================

    const handleRemoveSM = (personId) => {

        setForm((previous) => ({
            ...previous,

            sms: previous.sms.filter(
                (person) =>
                    person.id !== personId
            ),
        }))

    }


    // =========================================================
    // REMOVE ASM
    // =========================================================

    const handleRemoveASM = (personId) => {

        setForm((previous) => ({
            ...previous,

            asms: previous.asms.filter(
                (person) =>
                    person.id !== personId
            ),
        }))

    }


    // =========================================================
    // VALIDATE PERSON
    // =========================================================

    const validatePerson = (
        person,
        role,
        index
    ) => {

        const errors = {}


        if (!person.name.trim()) {

            errors.name =
                `${role} ${index + 1} name is required.`

        }


        if (!person.phone.trim()) {

            errors.phone =
                `${role} ${index + 1} phone is required.`

        } else if (
            !/^[0-9]{10}$/.test(
                person.phone.trim()
            )
        ) {

            errors.phone =
                `${role} ${index + 1} phone must be 10 digits.`

        }


        if (!person.email.trim()) {

            errors.email =
                `${role} ${index + 1} email is required.`

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                person.email.trim()
            )
        ) {

            errors.email =
                `${role} ${index + 1} email is invalid.`

        }


        return errors

    }


    // =========================================================
    // VALIDATE FORM
    // =========================================================

    const validate = () => {

        const nextErrors = {}


        if (!form.state.trim()) {

            nextErrors.state =
                'State is required.'

        }


        if (!form.city.trim()) {

            nextErrors.city =
                'City is required.'

        }


        if (!form.bank.trim()) {

            nextErrors.bank =
                'Bank is required.'

        }


        if (!form.loanType.trim()) {

            nextErrors.loanType =
                'Loan type is required.'

        }


        // -----------------------------------------------------
        // SM VALIDATION
        // -----------------------------------------------------

        form.sms.forEach(
            (person, index) => {

                const personErrors =
                    validatePerson(
                        person,
                        'SM',
                        index
                    )


                if (
                    Object.keys(
                        personErrors
                    ).length
                ) {

                    nextErrors[
                        `sm_${person.id}`
                    ] = personErrors

                }

            }
        )


        // -----------------------------------------------------
        // ASM VALIDATION
        // -----------------------------------------------------

        form.asms.forEach(
            (person, index) => {

                const personErrors =
                    validatePerson(
                        person,
                        'ASM',
                        index
                    )


                if (
                    Object.keys(
                        personErrors
                    ).length
                ) {

                    nextErrors[
                        `asm_${person.id}`
                    ] = personErrors

                }

            }
        )


        setErrors(nextErrors)


        return (
            Object.keys(
                nextErrors
            ).length === 0
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

            state:
                form.state.trim(),

            city:
                form.city.trim(),

            bank:
                form.bank.trim(),

            loanType:
                form.loanType.trim(),

            status:
                form.status,

            sms:
                form.sms.map(
                    (person) => ({
                        ...person,

                        name:
                            person.name.trim(),

                        phone:
                            person.phone.trim(),

                        email:
                            person.email.trim(),
                    })
                ),

            asms:
                form.asms.map(
                    (person) => ({
                        ...person,

                        name:
                            person.name.trim(),

                        phone:
                            person.phone.trim(),

                        email:
                            person.email.trim(),
                    })
                ),

        }


        onSubmit?.(payload)

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setForm({
            ...EMPTY_FORM,
            sms: [],
            asms: [],
        })


        setErrors({})

        setOpenDropdown(null)

        setStateSearch('')
        setCitySearch('')
        setBankSearch('')

        onClose?.()

    }


    // =========================================================
    // DROPDOWN COMPONENT
    // =========================================================

    const SearchDropdown = ({
        type,
        label,
        value,
        placeholder,
        searchValue,
        onSearchChange,
        options,
        onSelect,
        disabled = false,
        error,
    }) => {

        const isOpen =
            openDropdown === type


        return (

            <div className="relative">

                <label className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-base-content/70
                ">

                    {label}

                    <span className="text-error">
                        {' '}*
                    </span>

                </label>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        if (disabled) {
                            return
                        }

                        setOpenDropdown(
                            isOpen
                                ? null
                                : type
                        )

                    }}
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
                        'focus:ring-[#8BCF00]/20',

                        error
                            ? 'border-error'
                            : 'border-base-300',

                        disabled
                            ? 'cursor-not-allowed bg-base-200 text-base-content/35'
                            : 'text-base-content',
                    ].join(' ')}
                >

                    <span className="
                        truncate
                    ">
                        {value || placeholder}
                    </span>


                    <span className="
                        ml-2
                        shrink-0
                        text-xs
                        text-base-content/40
                    ">
                        {isOpen ? '▲' : '▼'}
                    </span>

                </button>


                {isOpen && !disabled && (

                    <div className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+4px)]
                        z-[120]
                        overflow-hidden
                        rounded-lg
                        border
                        border-base-300
                        bg-base-100
                        shadow-xl
                    ">

                        <div className="
                            border-b
                            border-base-300
                            p-2
                        ">

                            <input
                                type="text"
                                value={searchValue}
                                onChange={(event) =>
                                    onSearchChange(
                                        event.target.value
                                    )
                                }
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                                placeholder={`Search ${label.toLowerCase()}...`}
                                className="
                                    input
                                    input-bordered
                                    h-9
                                    min-h-9
                                    w-full
                                    text-sm
                                "
                                autoFocus
                            />

                        </div>


                        <div className="
                            max-h-52
                            overflow-y-auto
                            p-1
                        ">

                            {options.length > 0 ? (

                                options.map(
                                    (option) => (

                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() =>
                                                onSelect(
                                                    option
                                                )
                                            }
                                            className={[
                                                'flex',
                                                'w-full',
                                                'items-center',
                                                'rounded-md',
                                                'px-3',
                                                'py-2',
                                                'text-left',
                                                'text-sm',
                                                'transition',
                                                'hover:bg-base-200',

                                                value === option
                                                    ? 'bg-[#8BCF00]/10 font-medium text-[#6FA800]'
                                                    : 'text-base-content/80',
                                            ].join(' ')}
                                        >
                                            {option}
                                        </button>

                                    )
                                )

                            ) : (

                                <div className="
                                    px-3
                                    py-3
                                    text-center
                                    text-xs
                                    text-base-content/45
                                ">
                                    No options found
                                </div>

                            )}

                        </div>

                    </div>

                )}


                {error && (

                    <p className="
                        mt-1
                        text-xs
                        text-error
                    ">
                        {error}
                    </p>

                )}

            </div>

        )

    }


    // =========================================================
    // PERSON INPUT
    // =========================================================

    const PersonSection = ({
        title,
        people,
        role,
        onAdd,
        onRemove,
        onChange,
    }) => {

        return (

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
            ">

                {/* ===============================================
                    SECTION HEADER
                =============================================== */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-base-300
                    px-4
                    py-3
                ">

                    <div>

                        <p className="
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {title}
                        </p>

                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/45
                        ">
                            {people.length}{' '}

                            {people.length === 1
                                ? 'person'
                                : 'people'} added
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onAdd}
                        className="
                            h-9
                            rounded-lg
                            border
                            border-[#8BCF00]/40
                            bg-[#8BCF00]/10
                            px-3
                            text-xs
                            font-semibold
                            text-[#6FA800]
                            transition
                            hover:bg-[#8BCF00]/20
                        "
                    >
                        + Add {role}
                    </button>

                </div>


                {/* ===============================================
                    PEOPLE
                =============================================== */}

                <div className="
                    space-y-3
                    p-4
                ">

                    {people.length === 0 && (

                        <div className="
                            rounded-lg
                            border
                            border-dashed
                            border-base-300
                            px-4
                            py-6
                            text-center
                        ">

                            <p className="
                                text-xs
                                text-base-content/45
                            ">
                                No {role}s added yet.
                            </p>

                            <button
                                type="button"
                                onClick={onAdd}
                                className="
                                    mt-2
                                    text-xs
                                    font-medium
                                    text-[#6FA800]
                                    hover:underline
                                "
                            >
                                Add {role}
                            </button>

                        </div>

                    )}


                    {people.map(
                        (person, index) => {

                            const personErrors =
                                errors[
                                    `${role.toLowerCase()}_${person.id}`
                                ] || {}


                            return (

                                <div
                                    key={
                                        person.id
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-base-300
                                        bg-base-200/20
                                        p-3
                                    "
                                >

                                    {/* =================================
                                        PERSON HEADER
                                    ================================= */}

                                    <div className="
                                        mb-3
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    ">

                                        <p className="
                                            text-xs
                                            font-semibold
                                            text-base-content/65
                                        ">
                                            {role} {index + 1}
                                        </p>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove(
                                                    person.id
                                                )
                                            }
                                            className="
                                                text-xs
                                                font-medium
                                                text-error/70
                                                transition
                                                hover:text-error
                                            "
                                        >
                                            Remove
                                        </button>

                                    </div>


                                    {/* =================================
                                        PERSON FORM
                                    ================================= */}

                                    <div className="
                                        grid
                                        grid-cols-1
                                        gap-3
                                        sm:grid-cols-3
                                    ">

                                        {/* NAME */}

                                        <div>

                                            <label className="
                                                mb-1
                                                block
                                                text-[11px]
                                                font-medium
                                                text-base-content/55
                                            ">
                                                Name
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    person.name
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    onChange(
                                                        person.id,
                                                        'name',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={`${role} name`}
                                                className={[
                                                    'input',
                                                    'input-bordered',
                                                    'h-10',
                                                    'min-h-10',
                                                    'w-full',
                                                    'text-sm',

                                                    personErrors.name
                                                        ? 'input-error'
                                                        : '',
                                                ].join(' ')}
                                            />

                                            {personErrors.name && (

                                                <p className="
                                                    mt-1
                                                    text-[11px]
                                                    text-error
                                                ">
                                                    {personErrors.name}
                                                </p>

                                            )}

                                        </div>


                                        {/* PHONE */}

                                        <div>

                                            <label className="
                                                mb-1
                                                block
                                                text-[11px]
                                                font-medium
                                                text-base-content/55
                                            ">
                                                Phone
                                            </label>

                                            <input
                                                type="tel"
                                                value={
                                                    person.phone
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    onChange(
                                                        person.id,
                                                        'phone',
                                                        event.target.value
                                                            .replace(
                                                                /\D/g,
                                                                ''
                                                            )
                                                            .slice(
                                                                0,
                                                                10
                                                            )
                                                    )
                                                }
                                                placeholder="10-digit phone"
                                                inputMode="numeric"
                                                maxLength={10}
                                                className={[
                                                    'input',
                                                    'input-bordered',
                                                    'h-10',
                                                    'min-h-10',
                                                    'w-full',
                                                    'text-sm',

                                                    personErrors.phone
                                                        ? 'input-error'
                                                        : '',
                                                ].join(' ')}
                                            />

                                            {personErrors.phone && (

                                                <p className="
                                                    mt-1
                                                    text-[11px]
                                                    text-error
                                                ">
                                                    {personErrors.phone}
                                                </p>

                                            )}

                                        </div>


                                        {/* EMAIL */}

                                        <div>

                                            <label className="
                                                mb-1
                                                block
                                                text-[11px]
                                                font-medium
                                                text-base-content/55
                                            ">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                value={
                                                    person.email
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    onChange(
                                                        person.id,
                                                        'email',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={`${role.toLowerCase()}@example.com`}
                                                className={[
                                                    'input',
                                                    'input-bordered',
                                                    'h-10',
                                                    'min-h-10',
                                                    'w-full',
                                                    'text-sm',

                                                    personErrors.email
                                                        ? 'input-error'
                                                        : '',
                                                ].join(' ')}
                                            />

                                            {personErrors.email && (

                                                <p className="
                                                    mt-1
                                                    text-[11px]
                                                    text-error
                                                ">
                                                    {personErrors.email}
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )

                        }
                    )}

                </div>

            </div>

        )

    }


    // =========================================================
    // DO NOT RENDER
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
                flex
                max-h-[92vh]
                w-full
                max-w-4xl
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
                    gap-4
                    border-b
                    border-base-300
                    px-5
                    py-4
                    sm:px-6
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-base-content
                        ">
                            {entry
                                ? 'Edit Banker Directory'
                                : 'Add Banker Directory'}
                        </h2>


                        <p className="
                            mt-0.5
                            text-xs
                            text-base-content/45
                        ">
                            {entry
                                ? 'Update bank location and banker details'
                                : 'Add bank location and assign SMs and ASMs'}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-lg
                            text-base-content/45
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                    "
                >

                    {/* =================================================
                        FORM BODY
                    ================================================= */}

                    <div className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-5
                        sm:px-6
                    ">

                        {/* =============================================
                            LOCATION / BANK DETAILS
                        ============================================= */}

                        <div className="
                            rounded-xl
                            border
                            border-base-300
                            bg-base-100
                        ">

                            <div className="
                                border-b
                                border-base-300
                                px-4
                                py-3
                            ">

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-base-content
                                ">
                                    Bank Details
                                </p>

                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-base-content/45
                                ">
                                    Select the location, bank and loan type
                                </p>

                            </div>


                            <div className="
                                grid
                                grid-cols-1
                                gap-4
                                p-4
                                sm:grid-cols-2
                            ">

                                {/* STATE */}

                                <SearchDropdown
                                    type="state"
                                    label="State"
                                    value={
                                        form.state
                                    }
                                    placeholder="Select state"
                                    searchValue={
                                        stateSearch
                                    }
                                    onSearchChange={
                                        setStateSearch
                                    }
                                    options={
                                        filteredStates
                                    }
                                    onSelect={
                                        handleStateSelect
                                    }
                                    error={
                                        errors.state
                                    }
                                />


                                {/* CITY */}

                                <SearchDropdown
                                    type="city"
                                    label="City"
                                    value={
                                        form.city
                                    }
                                    placeholder={
                                        form.state
                                            ? 'Select city'
                                            : 'Select state first'
                                    }
                                    searchValue={
                                        citySearch
                                    }
                                    onSearchChange={
                                        setCitySearch
                                    }
                                    options={
                                        filteredCities
                                    }
                                    onSelect={
                                        handleCitySelect
                                    }
                                    disabled={
                                        !form.state
                                    }
                                    error={
                                        errors.city
                                    }
                                />


                                {/* BANK */}

                                <SearchDropdown
                                    type="bank"
                                    label="Bank"
                                    value={
                                        form.bank
                                    }
                                    placeholder={
                                        form.state
                                            ? 'Select bank'
                                            : 'Select state first'
                                    }
                                    searchValue={
                                        bankSearch
                                    }
                                    onSearchChange={
                                        setBankSearch
                                    }
                                    options={
                                        filteredBanks
                                    }
                                    onSelect={
                                        handleBankSelect
                                    }
                                    disabled={
                                        !form.state
                                    }
                                    error={
                                        errors.bank
                                    }
                                />


                                {/* LOAN TYPE */}

                                <div>

                                    <label className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-medium
                                        text-base-content/70
                                    ">

                                        Loan Type

                                        <span className="text-error">
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
                                            (
                                                loanType
                                            ) => (

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


                                {/* STATUS */}

                                <div className="
                                    sm:col-span-2
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
                                            sm:max-w-[240px]
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

                            </div>

                        </div>


                        {/* =================================================
                            SM
                        ================================================= */}

                        <div className="mt-4">

                            <PersonSection
                                title="Sales Managers"
                                role="SM"
                                people={
                                    form.sms
                                }
                                onAdd={
                                    handleAddSM
                                }
                                onRemove={
                                    handleRemoveSM
                                }
                                onChange={
                                    handleSMChange
                                }
                            />

                        </div>


                        {/* =================================================
                            ASM
                        ================================================= */}

                        <div className="mt-4">

                            <PersonSection
                                title="Area Sales Managers"
                                role="ASM"
                                people={
                                    form.asms
                                }
                                onAdd={
                                    handleAddASM
                                }
                                onRemove={
                                    handleRemoveASM
                                }
                                onChange={
                                    handleASMChange
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        shrink-0
                        flex-col-reverse
                        gap-2
                        border-t
                        border-base-300
                        bg-base-100
                        px-5
                        py-4
                        sm:flex-row
                        sm:justify-end
                        sm:px-6
                    ">

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            className="
                                btn
                                btn-ghost
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
                                w-full
                                border-none
                                bg-[#8BCF00]
                                text-white
                                shadow-none
                                hover:bg-[#78B300]
                                sm:w-auto
                            "
                        >
                            {entry
                                ? 'Update Entry'
                                : 'Add Entry'}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    )
}


export default BankerModal