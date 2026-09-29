// admin-react/src/pages/Banks&DSA/BankersDirectory/components/BankerModal.jsx

import { useEffect, useMemo, useState } from 'react'
import apiClient from '../../../../../app/apiClient'


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
    state_id: '',
    state: '',
    city_id: '',
    city: '',
    bank_id: '',
    bank: '',
    loan_type_id: '',
    loanType: '',
    status: 'active',
    sms: [],
    asms: [],
}


// =============================================================
// SEARCH DROPDOWN COMPONENT (MODULE SCOPE)
// =============================================================

const SearchDropdown = ({
    label,
    value,
    placeholder,
    searchValue,
    onSearchChange,
    options = [],
    onSelect,
    disabled = false,
    error,
    isOpen = false,
    onToggle,
}) => {
    return (
        <div className="relative">
            <label className="mb-1.5 block text-xs font-medium text-base-content/70">
                {label}
                <span className="text-error"> *</span>
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={onToggle}
                className={[
                    'flex h-10 w-full items-center justify-between rounded-lg border bg-base-100 px-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-[#8BCF00]/20',
                    error ? 'border-error' : 'border-base-300',
                    disabled ? 'cursor-not-allowed bg-base-200 text-base-content/35' : 'text-base-content',
                ].join(' ')}
            >
                <span className="truncate">
                    {value || placeholder}
                </span>

                <span className="ml-2 shrink-0 text-xs text-base-content/40">
                    {isOpen ? '▲' : '▼'}
                </span>
            </button>

            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[120] overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xl">
                    <div className="border-b border-base-300 p-2">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            onClick={(event) => event.stopPropagation()}
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="input input-bordered h-9 min-h-9 w-full text-sm"
                            autoFocus
                        />
                    </div>

                    <div className="max-h-52 overflow-y-auto p-1">
                        {options.length > 0 ? (
                            options.map((option, idx) => {
                                const optionId = typeof option === 'object' ? (option.id ?? idx) : option
                                const optionName = typeof option === 'object' ? (option.name ?? String(option)) : String(option)

                                return (
                                    <button
                                        key={`${optionId}-${idx}`}
                                        type="button"
                                        onClick={() => onSelect(option)}
                                        className={[
                                            'flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition hover:bg-base-200',
                                            String(value) === String(optionName) || String(value) === String(optionId)
                                                ? 'bg-[#8BCF00]/10 font-medium text-[#6FA800]'
                                                : 'text-base-content/80',
                                        ].join(' ')}
                                    >
                                        {optionName}
                                    </button>
                                )
                            })
                        ) : (
                            <div className="px-3 py-3 text-center text-xs text-base-content/45">
                                No options found
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1 text-xs text-error">
                    {error}
                </p>
            )}
        </div>
    )
}


// =============================================================
// PERSON SECTION COMPONENT (MODULE SCOPE)
// =============================================================

const PersonSection = ({
    title,
    people = [],
    role,
    errors = {},
    onAdd,
    onRemove,
    onChange,
}) => {
    return (
        <div className="rounded-xl border border-base-300 bg-base-100">
            <div className="flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3">
                <div>
                    <p className="text-sm font-semibold text-base-content">{title}</p>
                    <p className="mt-0.5 text-xs text-base-content/45">
                        {people.length} {people.length === 1 ? 'person' : 'people'} added
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAdd}
                    className="h-9 rounded-lg border border-[#8BCF00]/40 bg-[#8BCF00]/10 px-3 text-xs font-semibold text-[#6FA800] transition hover:bg-[#8BCF00]/20"
                >
                    + Add {role}
                </button>
            </div>

            <div className="space-y-3 p-4">
                {people.length === 0 && (
                    <div className="rounded-lg border border-dashed border-base-300 px-4 py-6 text-center">
                        <p className="text-xs text-base-content/45">
                            No {role}s added yet.
                        </p>
                        <button
                            type="button"
                            onClick={onAdd}
                            className="mt-2 text-xs font-medium text-[#6FA800] hover:underline"
                        >
                            Add {role}
                        </button>
                    </div>
                )}

                {people.map((person, index) => {
                    const personErrors = errors[`${role.toLowerCase()}_${person.id}`] || {}

                    return (
                        <div
                            key={person.id}
                            className="rounded-lg border border-base-300 bg-base-200/20 p-3"
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold text-base-content/65">
                                    {role} {index + 1}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => onRemove(person.id)}
                                    className="text-xs font-medium text-error/70 transition hover:text-error"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-[11px] font-medium text-base-content/55">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={(event) => onChange(person.id, 'name', event.target.value)}
                                        placeholder={`${role} name`}
                                        className={[
                                            'input input-bordered h-10 min-h-10 w-full text-sm',
                                            personErrors.name ? 'input-error' : '',
                                        ].join(' ')}
                                    />
                                    {personErrors.name && (
                                        <p className="mt-1 text-[11px] text-error">
                                            {personErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-medium text-base-content/55">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={person.phone}
                                        onChange={(event) =>
                                            onChange(
                                                person.id,
                                                'phone',
                                                event.target.value.replace(/\D/g, '').slice(0, 10)
                                            )
                                        }
                                        placeholder="10-digit phone"
                                        inputMode="numeric"
                                        maxLength={10}
                                        className={[
                                            'input input-bordered h-10 min-h-10 w-full text-sm',
                                            personErrors.phone ? 'input-error' : '',
                                        ].join(' ')}
                                    />
                                    {personErrors.phone && (
                                        <p className="mt-1 text-[11px] text-error">
                                            {personErrors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-medium text-base-content/55">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={person.email}
                                        onChange={(event) => onChange(person.id, 'email', event.target.value)}
                                        placeholder={`${role.toLowerCase()}@example.com`}
                                        className={[
                                            'input input-bordered h-10 min-h-10 w-full text-sm',
                                            personErrors.email ? 'input-error' : '',
                                        ].join(' ')}
                                    />
                                    {personErrors.email && (
                                        <p className="mt-1 text-[11px] text-error">
                                            {personErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
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

    const [form, setForm] = useState(EMPTY_FORM)
    const [errors, setErrors] = useState({})

    // API DROPDOWN DATA
    const [apiStates, setApiStates] = useState([])
    const [apiCities, setApiCities] = useState([])
    const [apiBanks, setApiBanks] = useState([])
    const [apiLoanTypes, setApiLoanTypes] = useState([])


    // =========================================================
    // DROPDOWN STATE
    // =========================================================

    const [openDropdown, setOpenDropdown] = useState(null)
    const [stateSearch, setStateSearch] = useState('')
    const [citySearch, setCitySearch] = useState('')
    const [bankSearch, setBankSearch] = useState('')


    // =========================================================
    // FETCH API DROPDOWNS
    // =========================================================

    useEffect(() => {
        if (!open) return

        let isMounted = true

        const fetchDropdowns = async () => {
            try {
                const [statesRes, loanTypesRes, banksRes] = await Promise.allSettled([
                    apiClient.get('/states'),
                    apiClient.get('/common/loan-types'),
                    apiClient.get('/admin/banks/'),
                ])

                if (!isMounted) return

                if (statesRes.status === 'fulfilled') {
                    const sData = statesRes.value.data
                    setApiStates(Array.isArray(sData) ? sData : [])
                }
                if (loanTypesRes.status === 'fulfilled') {
                    const lData = loanTypesRes.value.data
                    setApiLoanTypes(Array.isArray(lData) ? lData : [])
                }
                if (banksRes.status === 'fulfilled') {
                    const bData = banksRes.value.data?.data || banksRes.value.data
                    setApiBanks(Array.isArray(bData) ? bData.map((b) => ({ id: b.id, name: b.name })) : [])
                }
            } catch (error) {
                console.error('Failed to fetch modal dropdowns:', error)
            }
        }

        fetchDropdowns()

        return () => {
            isMounted = false
        }
    }, [open])


    // FETCH CITIES ON STATE CHANGE
    useEffect(() => {
        if (!open || !form.state_id) {
            setApiCities([])
            return
        }

        let isMounted = true

        const fetchCities = async () => {
            try {
                const res = await apiClient.get(`/cities?state_id=${form.state_id}`)
                if (isMounted) {
                    setApiCities(Array.isArray(res.data) ? res.data : [])
                }
            } catch (error) {
                console.error('Failed to fetch cities:', error)
                if (isMounted) setApiCities([])
            }
        }

        fetchCities()

        return () => {
            isMounted = false
        }
    }, [open, form.state_id])


    // =========================================================
    // EDIT / ADD INITIALIZATION
    // =========================================================

    useEffect(() => {
        if (!open) {
            return
        }

        if (entry) {
            setForm({
                state_id: entry.state_id || '',
                state: entry.state_name || entry.state || '',
                city_id: entry.city_id || '',
                city: entry.city_name || entry.city || '',
                bank_id: entry.bank_id || '',
                bank: entry.bank_name || entry.bank || '',
                loan_type_id: entry.loan_type_id || '',
                loanType: entry.loan_type_name || entry.loanType || '',
                status: entry.status === '1' || entry.status === 'active' ? 'active' : 'inactive',

                sms: Array.isArray(entry.sms)
                    ? entry.sms.map((person) => ({
                        id: person.id || Math.random(),
                        name: person.name || '',
                        phone: person.contact || person.phone || '',
                        contact: person.contact || person.phone || '',
                        email: person.email || '',
                    }))
                    : [],

                asms: Array.isArray(entry.asms)
                    ? entry.asms.map((person) => ({
                        id: person.id || Math.random(),
                        name: person.name || '',
                        phone: person.contact || person.phone || '',
                        contact: person.contact || person.phone || '',
                        email: person.email || '',
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
    // FILTER DROPDOWN OPTIONS
    // =========================================================

    const stateList = useMemo(() => {
        if (apiStates.length) return apiStates
        if (Array.isArray(states) && states.length && typeof states[0] === 'object') return states
        return states.map((s, idx) => ({ id: idx + 1, name: String(s) }))
    }, [apiStates, states])

    const cityList = useMemo(() => {
        return apiCities
    }, [apiCities])

    const bankList = useMemo(() => {
        if (Array.isArray(banks) && banks.length && typeof banks[0] === 'object') return banks
        if (apiBanks.length) return apiBanks
        return banks.map((b, idx) => ({ id: idx + 1, name: String(b) }))
    }, [banks, apiBanks])


    const filteredStates = useMemo(() => {
        const query = stateSearch.trim().toLowerCase()
        if (!query) return stateList
        return stateList.filter((item) =>
            String(item.name || item).toLowerCase().includes(query)
        )
    }, [stateList, stateSearch])


    const filteredCities = useMemo(() => {
        const query = citySearch.trim().toLowerCase()
        if (!query) return cityList
        return cityList.filter((item) =>
            String(item.name || item).toLowerCase().includes(query)
        )
    }, [cityList, citySearch])


    const filteredBanks = useMemo(() => {
        const query = bankSearch.trim().toLowerCase()
        if (!query) return bankList
        return bankList.filter((item) =>
            String(item.name || item).toLowerCase().includes(query)
        )
    }, [bankList, bankSearch])


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {
        const { name, value } = event.target

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

    const handleStateSelect = (selected) => {
        const isObj = typeof selected === 'object' && selected !== null
        const stateId = isObj ? selected.id : ''
        const stateName = isObj ? selected.name : String(selected)

        setForm((previous) => ({
            ...previous,
            state_id: stateId,
            state: stateName,
            city_id: '',
            city: '',
            bank_id: '',
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

    const handleCitySelect = (selected) => {
        const isObj = typeof selected === 'object' && selected !== null
        const cityId = isObj ? selected.id : ''
        const cityName = isObj ? selected.name : String(selected)

        setForm((previous) => ({
            ...previous,
            city_id: cityId,
            city: cityName,
            bank_id: '',
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

    const handleBankSelect = (selected) => {
        const isObj = typeof selected === 'object' && selected !== null
        const bankId = isObj ? selected.id : ''
        const bankName = isObj ? selected.name : String(selected)

        setForm((previous) => ({
            ...previous,
            bank_id: bankId,
            bank: bankName,
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

        if (!form.state_id && !form.state) {
            nextErrors.state = 'State is required.'
        }

        if (!form.city_id && !form.city) {
            nextErrors.city = 'City is required.'
        }

        if (!form.bank_id && !form.bank) {
            nextErrors.bank = 'Bank is required.'
        }

        if (!form.loan_type_id && !form.loanType) {
            nextErrors.loanType = 'Loan type is required.'
        }


        // -----------------------------------------------------
        // SM VALIDATION
        // -----------------------------------------------------

        form.sms.forEach((person, index) => {
            const personErrors = validatePerson(person, 'SM', index)

            if (Object.keys(personErrors).length) {
                nextErrors[`sm_${person.id}`] = personErrors
            }
        })


        // -----------------------------------------------------
        // ASM VALIDATION
        // -----------------------------------------------------

        form.asms.forEach((person, index) => {
            const personErrors = validatePerson(person, 'ASM', index)

            if (Object.keys(personErrors).length) {
                nextErrors[`asm_${person.id}`] = personErrors
            }
        })


        setErrors(nextErrors)

        return Object.keys(nextErrors).length === 0
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
            id: entry?.id || entry?.banker_directory_id,
            banker_directory_id: entry?.id || entry?.banker_directory_id,
            state_id: form.state_id,
            state: form.state,
            city_id: form.city_id,
            city: form.city,
            bank_id: form.bank_id,
            bank: form.bank,
            loan_type_id: form.loan_type_id,
            loanType: form.loanType,
            status: form.status === 'active' || form.status === '1' ? '1' : '0',

            sms: form.sms.map((person) => ({
                ...person,
                name: person.name.trim(),
                contact: (person.contact || person.phone || '').trim(),
                phone: (person.contact || person.phone || '').trim(),
                email: person.email.trim(),
            })),

            asms: form.asms.map((person) => ({
                ...person,
                name: person.name.trim(),
                contact: (person.contact || person.phone || '').trim(),
                phone: (person.contact || person.phone || '').trim(),
                email: person.email.trim(),
            })),
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
                                    value={form.state}
                                    placeholder="Select state"
                                    searchValue={stateSearch}
                                    onSearchChange={setStateSearch}
                                    options={filteredStates}
                                    onSelect={handleStateSelect}
                                    error={errors.state}
                                    isOpen={openDropdown === 'state'}
                                    onToggle={() => setOpenDropdown(openDropdown === 'state' ? null : 'state')}
                                />


                                {/* CITY */}

                                <SearchDropdown
                                    type="city"
                                    label="City"
                                    value={form.city}
                                    placeholder={
                                        form.state
                                            ? 'Select city'
                                            : 'Select state first'
                                    }
                                    searchValue={citySearch}
                                    onSearchChange={setCitySearch}
                                    options={filteredCities}
                                    onSelect={handleCitySelect}
                                    disabled={!form.state}
                                    error={errors.city}
                                    isOpen={openDropdown === 'city'}
                                    onToggle={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
                                />


                                {/* BANK */}

                                <SearchDropdown
                                    type="bank"
                                    label="Bank"
                                    value={form.bank}
                                    placeholder={
                                        form.state
                                            ? 'Select bank'
                                            : 'Select state first'
                                    }
                                    searchValue={bankSearch}
                                    onSearchChange={setBankSearch}
                                    options={filteredBanks}
                                    onSelect={handleBankSelect}
                                    disabled={!form.state}
                                    error={errors.bank}
                                    isOpen={openDropdown === 'bank'}
                                    onToggle={() => setOpenDropdown(openDropdown === 'bank' ? null : 'bank')}
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
                                        name="loan_type_id"
                                        value={form.loan_type_id || ''}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            const list = apiLoanTypes.length ? apiLoanTypes : (Array.isArray(loanTypes) ? loanTypes : [])
                                            const found = list.find((lt) => String(typeof lt === 'object' ? lt.id : lt) === String(val))
                                            const foundName = typeof found === 'object' ? found.name : (found || '')
                                            setForm((prev) => ({
                                                ...prev,
                                                loan_type_id: val ? Number(val) : '',
                                                loanType: foundName,
                                            }))
                                            setErrors((prev) => ({ ...prev, loanType: '' }))
                                        }}
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

                                        {(apiLoanTypes.length ? apiLoanTypes : (Array.isArray(loanTypes) ? loanTypes : [])).map((lt) => {
                                            const ltId = typeof lt === 'object' ? lt.id : lt
                                            const ltName = typeof lt === 'object' ? lt.name : lt
                                            return (
                                                <option key={ltId} value={ltId}>
                                                    {ltName}
                                                </option>
                                            )
                                        })}
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
                                people={form.sms}
                                errors={errors}
                                onAdd={handleAddSM}
                                onRemove={handleRemoveSM}
                                onChange={handleSMChange}
                            />

                        </div>


                        {/* =================================================
                            ASM
                        ================================================= */}

                        <div className="mt-4">

                            <PersonSection
                                title="Area Sales Managers"
                                role="ASM"
                                people={form.asms}
                                errors={errors}
                                onAdd={handleAddASM}
                                onRemove={handleRemoveASM}
                                onChange={handleASMChange}
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