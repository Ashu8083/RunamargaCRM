// admin-react/src/pages/Banks&DSA/BankersDirectory/index.jsx

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import BankersDirectoryTable from './components/BankersDirectoryTable'
import BankerModal from './components/BankerModal'
import BankerViewModal from './components/BankerViewModal'
import LoanTypeDropdown from '../../../components/GlobalModels/Filters/LoanTypeDropdown'


// =============================================================
// INITIAL DATA
// =============================================================

const INITIAL_ENTRIES = [
    {
        id: 1,
        state: 'Andhra Pradesh',
        city: 'Vijayawada',
        bank: 'IDFC',
        loanType: 'Education Loan',
        status: 'active',

        asms: [
            {
                id: 101,
                name: 'Ramesh Kumar',
                phone: '9876543210',
                email: 'ramesh@example.com',
            },
            {
                id: 102,
                name: 'Priya Sharma',
                phone: '9876543211',
                email: 'priya@example.com',
            },
        ],

        sms: [
            {
                id: 201,
                name: 'Suresh Kumar',
                phone: '9876543220',
                email: 'suresh@example.com',
            },
            {
                id: 202,
                name: 'Manoj Rao',
                phone: '9876543221',
                email: 'manoj@example.com',
            },
        ],
    },

    {
        id: 2,
        state: 'Andhra Pradesh',
        city: 'Vijayawada',
        bank: 'Incred',
        loanType: 'Education Loan',
        status: 'active',

        asms: [
            {
                id: 103,
                name: 'Nayana',
                phone: '9876543230',
                email: 'nayana@example.com',
            },
            {
                id: 104,
                name: 'Kasturi',
                phone: '9876543231',
                email: 'kasturi@example.com',
            },
        ],

        sms: [
            {
                id: 203,
                name: 'Prashanth',
                phone: '9876543240',
                email: 'prashanth@example.com',
            },
        ],
    },

    {
        id: 3,
        state: 'Karnataka',
        city: 'Bengaluru',
        bank: 'Propelld Finance',
        loanType: 'Personal Loan',
        status: 'active',

        asms: [
            {
                id: 105,
                name: 'Asma Banu',
                phone: '9876543250',
                email: 'asma@example.com',
            },
        ],

        sms: [
            {
                id: 204,
                name: 'Lokesh A',
                phone: '9876543260',
                email: 'lokesh@example.com',
            },
            {
                id: 205,
                name: 'Nayana',
                phone: '9876543261',
                email: 'nayana.sm@example.com',
            },
        ],
    },

    {
        id: 4,
        state: 'Karnataka',
        city: 'Mysuru',
        bank: 'Poonawalla',
        loanType: 'Home Loan',
        status: 'inactive',

        asms: [
            {
                id: 106,
                name: 'Arun Kumar',
                phone: '9876543270',
                email: 'arun@example.com',
            },
        ],

        sms: [
            {
                id: 206,
                name: 'Prasanna Y R',
                phone: '9876543280',
                email: 'prasanna@example.com',
            },
        ],
    },
]


// =============================================================
// FILTER OPTIONS
// =============================================================

const LOAN_TYPES = [
    'Personal Loan',
    'Business Loan',
    'Home Loan',
    'Loan Against Property',
    'Car Loan',
    'Education Loan',
    'Gold Loan',
    'Agricultural Loan',
    'Credit Card',
]


// =============================================================
// SEARCHABLE FILTER DROPDOWN
//
// Used for:
// State
// City
// Bank
//
// =============================================================

function SearchableFilterDropdown({
    value = '',
    options = [],
    placeholder = 'Select',
    searchPlaceholder = 'Search...',
    onChange,
    disabled = false,
}) {

    const [open, setOpen] =
        useState(false)

    const [searchValue, setSearchValue] =
        useState('')

    const dropdownRef =
        useRef(null)


    // =========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setOpen(false)
                setSearchValue('')
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
    // RESET SEARCH WHEN CLOSED
    // =========================================================

    useEffect(() => {

        if (!open) {
            setSearchValue('')
        }

    }, [open])


    // =========================================================
    // FILTER OPTIONS
    // =========================================================

    const filteredOptions = useMemo(() => {

        const search =
            searchValue
                .trim()
                .toLowerCase()


        if (!search) {
            return options
        }


        return options.filter(
            (option) =>
                String(option)
                    .toLowerCase()
                    .includes(search)
        )

    }, [
        options,
        searchValue,
    ])


    // =========================================================
    // SELECT OPTION
    // =========================================================

    const handleSelect = (option) => {

        onChange?.(option)

        setOpen(false)
        setSearchValue('')

    }


    // =========================================================
    // CLEAR SELECTION
    // =========================================================

    const handleClear = (event) => {

        event.stopPropagation()

        onChange?.('')

        setOpen(false)
        setSearchValue('')

    }


    // =========================================================
    // DISABLED
    // =========================================================

    if (disabled) {

        return (
            <div className="
                relative
                w-full
            ">

                <button
                    type="button"
                    disabled
                    className="
                        flex
                        h-10
                        w-full
                        cursor-not-allowed
                        items-center
                        justify-between
                        rounded-lg
                        border
                        border-base-300
                        bg-base-200/50
                        px-3
                        text-left
                        text-sm
                        text-base-content/35
                    "
                >

                    <span>
                        {placeholder}
                    </span>

                    <span className="
                        text-base-content/30
                    ">
                        ▾
                    </span>

                </button>

            </div>
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            ref={dropdownRef}
            className="
                relative
                w-full
            "
        >

            {/* =================================================
                TRIGGER
            ================================================= */}

            <button
                type="button"
                onClick={() =>
                    setOpen(
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

                    open
                        ? 'border-[#8BCF00] ring-2 ring-[#8BCF00]/15'
                        : 'border-base-300 hover:border-base-content/25',
                ].join(' ')}
            >

                <span
                    className={
                        value
                            ? 'truncate text-base-content'
                            : 'truncate text-base-content/45'
                    }
                >
                    {value || placeholder}
                </span>


                <span className="
                    ml-2
                    shrink-0
                    text-xs
                    text-base-content/45
                ">
                    ▾
                </span>

            </button>


            {/* =================================================
                DROPDOWN
            ================================================= */}

            {open && (

                <div className="
                    absolute
                    left-0
                    right-0
                    z-[80]
                    mt-1.5
                    overflow-hidden
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-xl
                ">

                    {/* =========================================
                        SEARCH
                    ========================================= */}

                    <div className="
                        border-b
                        border-base-300
                        p-2
                    ">

                        <input
                            type="text"
                            autoFocus
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(
                                    event.target.value
                                )
                            }
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            placeholder={
                                searchPlaceholder
                            }
                            className="
                                h-9
                                w-full
                                rounded-lg
                                border
                                border-base-300
                                bg-base-100
                                px-3
                                text-sm
                                text-base-content
                                outline-none
                                placeholder:text-base-content/40
                                focus:border-[#8BCF00]
                                focus:ring-2
                                focus:ring-[#8BCF00]/10
                            "
                        />

                    </div>


                    {/* =========================================
                        OPTIONS
                    ========================================= */}

                    <div className="
                        max-h-56
                        overflow-y-auto
                        p-1
                    ">

                        {/* ALL OPTION */}

                        <button
                            type="button"
                            onClick={() =>
                                handleSelect('')
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

                                !value
                                    ? 'bg-[#8BCF00]/10 font-medium text-[#6FA800]'
                                    : 'text-base-content/70 hover:bg-base-200',
                            ].join(' ')}
                        >
                            {placeholder}
                        </button>


                        {/* OPTIONS */}

                        {filteredOptions.map(
                            (option) => (

                                <button
                                    type="button"
                                    key={option}
                                    onClick={() =>
                                        handleSelect(
                                            option
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

                                        value === option
                                            ? 'bg-[#8BCF00]/10 font-medium text-[#6FA800]'
                                            : 'text-base-content hover:bg-base-200',
                                    ].join(' ')}
                                >
                                    {option}
                                </button>

                            )
                        )}


                        {/* NO RESULTS */}

                        {!filteredOptions.length && (

                            <div className="
                                px-3
                                py-5
                                text-center
                            ">

                                <p className="
                                    text-xs
                                    text-base-content/45
                                ">
                                    No options found
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =========================================
                        CLEAR SELECTED VALUE
                    ========================================= */}

                    {value && (

                        <div className="
                            border-t
                            border-base-300
                            p-1
                        ">

                            <button
                                type="button"
                                onClick={
                                    handleClear
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-left
                                    text-xs
                                    font-medium
                                    text-base-content/55
                                    transition
                                    hover:bg-base-200
                                    hover:text-base-content
                                "
                            >
                                Clear selection
                            </button>

                        </div>

                    )}

                </div>

            )}

        </div>
    )
}


// =============================================================
// MAIN PAGE
// =============================================================

function BankersDirectory() {

    // =========================================================
    // DATA
    // =========================================================

    const [entries, setEntries] =
        useState(INITIAL_ENTRIES)


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [selectedState, setSelectedState] =
        useState('')

    const [selectedCity, setSelectedCity] =
        useState('')

    const [selectedBank, setSelectedBank] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')


    // =========================================================
    // MODAL STATE
    // =========================================================

    const [showBankerModal, setShowBankerModal] =
        useState(false)

    const [showViewModal, setShowViewModal] =
        useState(false)

    const [selectedEntry, setSelectedEntry] =
        useState(null)


    // =========================================================
    // GET UNIQUE STATES
    // =========================================================

    const states = useMemo(() => {

        return [
            ...new Set(
                entries
                    .map(
                        (entry) =>
                            entry.state
                    )
                    .filter(Boolean)
            ),
        ].sort()

    }, [entries])


    // =========================================================
    // GET CITIES
    //
    // City options depend on selected state.
    // =========================================================

    const cities = useMemo(() => {

        const source =
            selectedState
                ? entries.filter(
                    (entry) =>
                        entry.state ===
                        selectedState
                )
                : entries


        return [
            ...new Set(
                source
                    .map(
                        (entry) =>
                            entry.city
                    )
                    .filter(Boolean)
            ),
        ].sort()

    }, [
        entries,
        selectedState,
    ])


    // =========================================================
    // GET ALL CITIES FOR MODAL
    //
    // The add/edit modal needs access to city options.
    // =========================================================

    const allCities = useMemo(() => {

        return [
            ...new Set(
                entries
                    .map(
                        (entry) =>
                            entry.city
                    )
                    .filter(Boolean)
            ),
        ].sort()

    }, [entries])


    // =========================================================
    // GET BANKS
    //
    // Bank options depend on selected state and city.
    // =========================================================

    const banks = useMemo(() => {

        const source =
            entries.filter(
                (entry) => {

                    if (
                        selectedState &&
                        entry.state !==
                            selectedState
                    ) {
                        return false
                    }


                    if (
                        selectedCity &&
                        entry.city !==
                            selectedCity
                    ) {
                        return false
                    }


                    return true

                }
            )


        return [
            ...new Set(
                source
                    .map(
                        (entry) =>
                            entry.bank
                    )
                    .filter(Boolean)
            ),
        ].sort()

    }, [
        entries,
        selectedState,
        selectedCity,
    ])


    // =========================================================
    // ALL BANKS FOR MODAL
    // =========================================================

    const allBanks = useMemo(() => {

        return [
            ...new Set(
                entries
                    .map(
                        (entry) =>
                            entry.bank
                    )
                    .filter(Boolean)
            ),
        ].sort()

    }, [entries])


    // =========================================================
    // FILTER ENTRIES
    // =========================================================

    const filteredEntries = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        return entries.filter(
            (entry) => {

                // ---------------------------------------------
                // STATE
                // ---------------------------------------------

                if (
                    selectedState &&
                    entry.state !==
                        selectedState
                ) {
                    return false
                }


                // ---------------------------------------------
                // CITY
                // ---------------------------------------------

                if (
                    selectedCity &&
                    entry.city !==
                        selectedCity
                ) {
                    return false
                }


                // ---------------------------------------------
                // BANK
                // ---------------------------------------------

                if (
                    selectedBank &&
                    entry.bank !==
                        selectedBank
                ) {
                    return false
                }


                // ---------------------------------------------
                // LOAN TYPE
                // ---------------------------------------------

                if (
                    selectedLoanType &&
                    entry.loanType !==
                        selectedLoanType
                ) {
                    return false
                }


                // ---------------------------------------------
                // GENERAL SEARCH
                //
                // Searches:
                // Bank
                // SM name
                // SM phone
                // SM email
                // ASM name
                // ASM phone
                // ASM email
                // ---------------------------------------------

                if (searchValue) {

                    const values = [

                        entry.bank,

                        ...(entry.sms || [])
                            .flatMap(
                                (sm) => [
                                    sm.name,
                                    sm.phone,
                                    sm.email,
                                ]
                            ),

                        ...(entry.asms || [])
                            .flatMap(
                                (asm) => [
                                    asm.name,
                                    asm.phone,
                                    asm.email,
                                ]
                            ),

                    ]


                    const matchesSearch =
                        values.some(
                            (value) =>
                                value !==
                                    null &&
                                value !==
                                    undefined &&
                                String(value)
                                    .toLowerCase()
                                    .includes(
                                        searchValue
                                    )
                        )


                    if (!matchesSearch) {
                        return false
                    }

                }


                return true

            }
        )

    }, [
        entries,
        search,
        selectedState,
        selectedCity,
        selectedBank,
        selectedLoanType,
    ])


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')
        setSelectedState('')
        setSelectedCity('')
        setSelectedBank('')
        setSelectedLoanType('')

    }


    // =========================================================
    // STATE CHANGE
    // =========================================================

    const handleStateChange = (
        value
    ) => {

        setSelectedState(value)

        // State changes invalidate city and bank.

        setSelectedCity('')
        setSelectedBank('')

    }


    // =========================================================
    // CITY CHANGE
    // =========================================================

    const handleCityChange = (
        value
    ) => {

        setSelectedCity(value)

        // City changes invalidate bank.

        setSelectedBank('')

    }


    // =========================================================
    // ADD ENTRY
    // =========================================================

    const handleAddEntry = () => {

        setSelectedEntry(null)

        setShowViewModal(false)
        setShowBankerModal(true)

    }


    // =========================================================
    // EDIT ENTRY
    // =========================================================

    const handleEditEntry = (
        entry
    ) => {

        setSelectedEntry(entry)

        setShowViewModal(false)
        setShowBankerModal(true)

    }


    // =========================================================
    // VIEW ENTRY
    // =========================================================

    const handleViewEntry = (
        entry
    ) => {

        setSelectedEntry(entry)

        setShowBankerModal(false)
        setShowViewModal(true)

    }


    // =========================================================
    // CLOSE ADD / EDIT MODAL
    // =========================================================

    const handleCloseBankerModal = () => {

        setShowBankerModal(false)

        setSelectedEntry(null)

    }


    // =========================================================
    // CLOSE VIEW MODAL
    // =========================================================

    const handleCloseViewModal = () => {

        setShowViewModal(false)

        setSelectedEntry(null)

    }


    // =========================================================
    // SAVE ENTRY
    // ADD / EDIT
    // =========================================================

    const handleSaveEntry = (
        entryData
    ) => {

        // ---------------------------------------------
        // EDIT
        // ---------------------------------------------

        if (entryData.id) {

            setEntries(
                (previous) =>
                    previous.map(
                        (entry) =>
                            entry.id ===
                            entryData.id
                                ? {
                                    ...entry,
                                    ...entryData,
                                }
                                : entry
                    )
            )

        }

        // ---------------------------------------------
        // ADD
        // ---------------------------------------------

        else {

            const newEntry = {
                ...entryData,
                id: Date.now(),
            }


            setEntries(
                (previous) => [
                    ...previous,
                    newEntry,
                ]
            )

        }


        handleCloseBankerModal()

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * API refresh will be connected later.
         */

        console.log(
            'Refresh Bankers Directory'
        )

    }


    // =========================================================
    // ACTIVE FILTER CHECK
    // =========================================================

    const hasActiveFilters =
        Boolean(
            search ||
            selectedState ||
            selectedCity ||
            selectedBank ||
            selectedLoanType
        )


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">

            {/* =====================================================
                FILTER CARD
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    p-4
                    sm:p-5
                ">

                    {/* =================================================
                        FIRST FILTER ROW
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        lg:grid-cols-[minmax(260px,1.7fr)_minmax(170px,1fr)_minmax(170px,1fr)_auto]
                    ">

                        {/* GENERAL SEARCH */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Search
                            </label>


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search bank, SM, ASM, phone or email..."
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                "
                            />

                        </div>


                        {/* STATE */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                State
                            </label>


                            <SearchableFilterDropdown
                                value={
                                    selectedState
                                }
                                options={states}
                                placeholder="All States"
                                searchPlaceholder="Search state..."
                                onChange={
                                    handleStateChange
                                }
                            />

                        </div>


                        {/* CITY */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                City
                            </label>


                            <SearchableFilterDropdown
                                value={
                                    selectedCity
                                }
                                options={cities}
                                placeholder="All Cities"
                                searchPlaceholder="Search city..."
                                onChange={
                                    handleCityChange
                                }
                                disabled={
                                    !selectedState &&
                                    !cities.length
                                }
                            />

                        </div>


                        {/* CLEAR */}

                        <div className="
                            flex
                            items-end
                        ">

                            {hasActiveFilters && (

                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="
                                        h-10
                                        w-full
                                        rounded-lg
                                        border
                                        border-base-300
                                        bg-base-100
                                        px-4
                                        text-sm
                                        font-medium
                                        text-base-content/60
                                        transition
                                        hover:bg-base-200
                                        hover:text-base-content
                                    "
                                >
                                    Clear Filters
                                </button>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        SECOND FILTER ROW
                    ================================================= */}

                    <div className="
                        mt-3
                        grid
                        grid-cols-1
                        gap-3
                        lg:grid-cols-2
                    ">

                        {/* BANK */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Bank
                            </label>


                            <SearchableFilterDropdown
                                value={
                                    selectedBank
                                }
                                options={banks}
                                placeholder="All Banks"
                                searchPlaceholder="Search bank..."
                                onChange={
                                    setSelectedBank
                                }
                            />

                        </div>


                        {/* LOAN TYPE */}

                        <LoanTypeDropdown
                            value={
                                selectedLoanType
                            }
                            onChange={
                                setSelectedLoanType
                            }
                            options={LOAN_TYPES}
                            className="min-w-0"
                        />

                    </div>


                    {/* =================================================
                        FILTER FOOTER
                    ================================================= */}

                    <div className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-base-300
                        pt-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        {/* RESULT COUNT */}

                        <p className="
                            text-xs
                            font-medium
                            text-base-content/55
                        ">

                            Showing{' '}

                            <span className="
                                font-semibold
                                text-base-content/75
                            ">
                                {filteredEntries.length}
                            </span>

                            {' '}

                            {filteredEntries.length === 1
                                ? 'entry'
                                : 'entries'}

                        </p>


                        {/* ADD BUTTON */}

                        <button
                            type="button"
                            onClick={
                                handleAddEntry
                            }
                            className="
                                h-10
                                rounded-lg
                                bg-[#8BCF00]
                                px-5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-[#78B300]
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#8BCF00]/30
                            "
                        >
                            Add Banker Entry
                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <BankersDirectoryTable
                entries={
                    filteredEntries
                }
                onView={
                    handleViewEntry
                }
                onEdit={
                    handleEditEntry
                }
                onRefresh={
                    handleRefresh
                }
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <BankerModal
                open={
                    showBankerModal
                }
                entry={
                    selectedEntry
                }
                states={
                    states
                }
                cities={
                    allCities
                }
                banks={
                    allBanks
                }
                loanTypes={
                    LOAN_TYPES
                }
                onClose={
                    handleCloseBankerModal
                }
                onSubmit={
                    handleSaveEntry
                }
            />


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            <BankerViewModal
                open={
                    showViewModal
                }
                entry={
                    selectedEntry
                }
                onClose={
                    handleCloseViewModal
                }
                onEdit={
                    handleEditEntry
                }
            />

        </div>

    )
}


export default BankersDirectory
