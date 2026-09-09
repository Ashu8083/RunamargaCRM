// admin-react/src/pages/Banks&DSA/BankersDirectory/index.jsx

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import {
    searchBankerDirectory,
} from './API'

import BankersDirectoryTable from './components/BankersDirectoryTable'
import BankerModal from './components/BankerModal'
import BankerViewModal from './components/BankerViewModal'
import LoanTypeDropdown from '../../../components/GlobalModels/Filters/LoanTypeDropdown'


// =============================================================
// LOAN TYPES
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
// =============================================================

function SearchableFilterDropdown({
    value = '',
    options = [],
    placeholder = 'Select',
    searchPlaceholder = 'Search...',
    onChange,
    disabled = false,
}) {

    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const dropdownRef = useRef(null)


    // =========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
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
    // FILTER OPTIONS
    // =========================================================

    const filteredOptions = useMemo(() => {

        const normalizedSearch =
            searchValue
                .trim()
                .toLowerCase()


        if (!normalizedSearch) {
            return options
        }


        return options.filter(
            (option) =>
                String(option)
                    .toLowerCase()
                    .includes(normalizedSearch)
        )

    }, [
        options,
        searchValue,
    ])


    // =========================================================
    // SELECT
    // =========================================================

    const handleSelect = (option) => {

        onChange?.(option)

        setOpen(false)
        setSearchValue('')

    }


    // =========================================================
    // CLEAR
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
            <div className="relative w-full">

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

                    <span className="text-base-content/30">
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
            className="relative w-full"
        >

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (previous) => !previous
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
                            placeholder={searchPlaceholder}
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


                    <div className="
                        max-h-56
                        overflow-y-auto
                        p-1
                    ">

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


                        {filteredOptions.map(
                            (option) => (

                                <button
                                    type="button"
                                    key={option}
                                    onClick={() =>
                                        handleSelect(option)
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


                    {value && (

                        <div className="
                            border-t
                            border-base-300
                            p-1
                        ">

                            <button
                                type="button"
                                onClick={handleClear}
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

    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)
    const [limit] = useState(15)
    const [total, setTotal] = useState(0)


    // =========================================================
    // FILTER VALUES
    //
    // These are the values displayed in the UI.
    // =========================================================

    const [search, setSearch] = useState('')

    const [selectedState, setSelectedState] =
        useState('')

    const [selectedCity, setSelectedCity] =
        useState('')

    const [selectedBank, setSelectedBank] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')


    // =========================================================
    // FILTER IDS
    //
    // These are the IDs sent to the backend.
    // =========================================================

    const [selectedStateId, setSelectedStateId] =
        useState(null)

    const [selectedCityId, setSelectedCityId] =
        useState(null)

    const [selectedBankId, setSelectedBankId] =
        useState(null)

    const [selectedLoanTypeId, setSelectedLoanTypeId] =
        useState(null)


    // =========================================================
    // MODALS
    // =========================================================

    const [showBankerModal, setShowBankerModal] =
        useState(false)

    const [showViewModal, setShowViewModal] =
        useState(false)

    const [selectedEntry, setSelectedEntry] =
        useState(null)


    // =========================================================
    // GET FIELD VALUE
    //
    // Supports both:
    // state / state_name
    // city / city_name
    // bank / bank_name
    // loanType / loan_type
    // =========================================================

    const getStateName = (entry) =>
        entry?.state ??
        entry?.state_name ??
        ''

    const getCityName = (entry) =>
        entry?.city ??
        entry?.city_name ??
        ''

    const getBankName = (entry) =>
        entry?.bank ??
        entry?.bank_name ??
        ''

    const getLoanTypeName = (entry) =>
        entry?.loanType ??
        entry?.loan_type ??
        entry?.loan_type_name ??
        ''


    // =========================================================
    // GET IDS
    //
    // Supports common backend naming conventions.
    // =========================================================

    const getStateId = (entry) =>
        entry?.state_id ??
        entry?.stateId ??
        entry?.state?.id ??
        null

    const getCityId = (entry) =>
        entry?.city_id ??
        entry?.cityId ??
        entry?.city?.id ??
        null

    const getBankId = (entry) =>
        entry?.bank_id ??
        entry?.bankId ??
        entry?.bank?.id ??
        null

    const getLoanTypeId = (entry) =>
        entry?.loan_type_id ??
        entry?.loanTypeId ??
        entry?.loan_type?.id ??
        null


    // =========================================================
    // UNIQUE STATES
    // =========================================================

    const states = useMemo(() => {

        return [
            ...new Set(
                entries
                    .map(getStateName)
                    .filter(Boolean)
            ),
        ].sort()

    }, [entries])


    // =========================================================
    // CITIES
    // =========================================================

    const cities = useMemo(() => {

        const source = selectedState
            ? entries.filter(
                (entry) =>
                    getStateName(entry) ===
                    selectedState
            )
            : entries


        return [
            ...new Set(
                source
                    .map(getCityName)
                    .filter(Boolean)
            ),
        ].sort()

    }, [
        entries,
        selectedState,
    ])


    // =========================================================
    // ALL CITIES
    // =========================================================

    const allCities = useMemo(() => {

        return [
            ...new Set(
                entries
                    .map(getCityName)
                    .filter(Boolean)
            ),
        ].sort()

    }, [entries])


    // =========================================================
    // BANKS
    // =========================================================

    const banks = useMemo(() => {

        const source = entries.filter(
            (entry) => {

                if (
                    selectedState &&
                    getStateName(entry) !==
                        selectedState
                ) {
                    return false
                }


                if (
                    selectedCity &&
                    getCityName(entry) !==
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
                    .map(getBankName)
                    .filter(Boolean)
            ),
        ].sort()

    }, [
        entries,
        selectedState,
        selectedCity,
    ])


    // =========================================================
    // ALL BANKS
    // =========================================================

    const allBanks = useMemo(() => {

        return [
            ...new Set(
                entries
                    .map(getBankName)
                    .filter(Boolean)
            ),
        ].sort()

    }, [entries])


    // =========================================================
    // LOAD DATA FROM SERVER
    // =========================================================

    const loadBankerDirectory = useCallback(

    async (pageNumber = 1) => {

        try {

            setLoading(true)

            const response =

                await searchBankerDirectory({

                    search:

                        search.trim() ||

                        null,

                    state_id:

                        selectedStateId ||

                        null,

                    city_id:

                        selectedCityId ||

                        null,

                    bank_id:

                        selectedBankId ||

                        null,

                    loan_type_id:

                        selectedLoanTypeId ||

                        null,

                    page:

                        pageNumber,

                    limit,

                })

            const responseData =

                response?.data

            // -------------------------------------------------

            // Backend response:

            //

            // {

            //     data: [...],

            //     total: 100

            // }

            //

            // OR

            //

            // {

            //     data: {

            //         data: [...],

            //         total: 100

            //     }

            // }

            // -------------------------------------------------

            if (Array.isArray(responseData)) {

                setEntries(responseData)

                setTotal(

                    response?.total ??

                    response?.count ??

                    responseData.length

                )

            } else {

                setEntries(

                    responseData?.data ??

                    []

                )

                setTotal(

                    responseData?.total ??

                    response?.total ??

                    responseData?.count ??

                    response?.count ??

                    0

                )

            }

            setPage(pageNumber)

        } catch (error) {

            console.error(

                'Failed to load banker directory:',

                error

            )

            setEntries([])

            setTotal(0)

        } finally {

            setLoading(false)

        }

    },

    [

        search,

        selectedStateId,

        selectedCityId,

        selectedBankId,

        selectedLoanTypeId,

        limit,

    ]

)
    // =============================================================
// LOAD / FILTER DATA
//
// Initial load + whenever server filter values change.
// =============================================================

useEffect(() => {

    const timer = setTimeout(() => {

        loadBankerDirectory(1)

    }, 300)

    return () => {
        clearTimeout(timer)
    }

}, [
    loadBankerDirectory,
])


    // =========================================================
    // STATE CHANGE
    // =========================================================

    const handleStateChange = (value) => {

        setSelectedState(value)

        const selectedEntry =
            entries.find(
                (entry) =>
                    getStateName(entry) ===
                    value
            )


        setSelectedStateId(
            value
                ? getStateId(selectedEntry)
                : null
        )


        // State changes invalidate city and bank.

        setSelectedCity('')
        setSelectedCityId(null)

        setSelectedBank('')
        setSelectedBankId(null)

    }


    // =========================================================
    // CITY CHANGE
    // =========================================================

    const handleCityChange = (value) => {

        setSelectedCity(value)

        const selectedEntry =
            entries.find(
                (entry) => {

                    if (
                        getCityName(entry) !==
                        value
                    ) {
                        return false
                    }


                    if (
                        selectedState &&
                        getStateName(entry) !==
                        selectedState
                    ) {
                        return false
                    }


                    return true
                }
            )


        setSelectedCityId(
            value
                ? getCityId(selectedEntry)
                : null
        )


        // City changes invalidate bank.

        setSelectedBank('')
        setSelectedBankId(null)

    }


    // =========================================================
    // BANK CHANGE
    // =========================================================

    const handleBankChange = (value) => {

        setSelectedBank(value)

        const selectedEntry =
            entries.find(
                (entry) => {

                    if (
                        getBankName(entry) !==
                        value
                    ) {
                        return false
                    }


                    if (
                        selectedState &&
                        getStateName(entry) !==
                        selectedState
                    ) {
                        return false
                    }


                    if (
                        selectedCity &&
                        getCityName(entry) !==
                        selectedCity
                    ) {
                        return false
                    }


                    return true
                }
            )


        setSelectedBankId(
            value
                ? getBankId(selectedEntry)
                : null
        )

    }


    // =========================================================
    // LOAN TYPE CHANGE
    // =========================================================

    const handleLoanTypeChange = (value) => {

        setSelectedLoanType(value)

        const selectedEntry =
            entries.find(
                (entry) =>
                    getLoanTypeName(entry) ===
                    value
            )


        setSelectedLoanTypeId(
            value
                ? getLoanTypeId(selectedEntry)
                : null
        )

    }


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')

        setSelectedState('')
        setSelectedStateId(null)

        setSelectedCity('')
        setSelectedCityId(null)

        setSelectedBank('')
        setSelectedBankId(null)

        setSelectedLoanType('')
        setSelectedLoanTypeId(null)

        setPage(1)

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

    const handleEditEntry = (entry) => {

        setSelectedEntry(entry)

        setShowViewModal(false)
        setShowBankerModal(true)

    }


    // =========================================================
    // VIEW ENTRY
    // =========================================================

    const handleViewEntry = (entry) => {

        setSelectedEntry(entry)

        setShowBankerModal(false)
        setShowViewModal(true)

    }


    // =========================================================
    // CLOSE BANKER MODAL
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
    //
    // IMPORTANT:
    // This reloads the server instead of pretending that
    // the local array is the database.
    // =========================================================

    const handleSaveEntry = async () => {

        handleCloseBankerModal()

        await loadBankerDirectory(page)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        await loadBankerDirectory(page)

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = async (
        nextPage
    ) => {

        if (
            nextPage < 1 ||
            (
                total > 0 &&
                nextPage >
                    Math.ceil(
                        total / limit
                    )
            )
        ) {
            return
        }


        await loadBankerDirectory(
            nextPage
        )

    }


    // =========================================================
    // ACTIVE FILTER
    // =========================================================

    const hasActiveFilters =
        Boolean(
            search.trim() ||
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
                        FIRST ROW
                    ================================================= */}

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        lg:grid-cols-[minmax(260px,1.7fr)_minmax(170px,1fr)_minmax(170px,1fr)_auto]
                    ">

                        {/* SEARCH */}

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
                                placeholder="
                                    Search bank, SM, ASM,
                                    phone or email...
                                "
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
                                value={selectedState}
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
                                value={selectedCity}
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
                        SECOND ROW
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
                                value={selectedBank}
                                options={banks}
                                placeholder="All Banks"
                                searchPlaceholder="Search bank..."
                                onChange={
                                    handleBankChange
                                }
                            />

                        </div>


                        {/* LOAN TYPE */}

                        <LoanTypeDropdown
                            value={
                                selectedLoanType
                            }
                            onChange={
                                handleLoanTypeChange
                            }
                            options={LOAN_TYPES}
                            className="min-w-0"
                        />

                    </div>


                    {/* =================================================
                        FOOTER
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
                                {entries.length}
                            </span>

                            {' '}of{' '}

                            <span className="
                                font-semibold
                                text-base-content/75
                            ">
                                {total}
                            </span>

                            {' '}

                            {total === 1
                                ? 'entry'
                                : 'entries'}

                        </p>


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
                entries={entries}
                loading={loading}
                onView={handleViewEntry}
                onEdit={handleEditEntry}
                onRefresh={handleRefresh}
                page={page}
                limit={limit}
                total={total}
                onPageChange={handlePageChange}
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <BankerModal
                open={showBankerModal}
                entry={selectedEntry}
                states={states}
                cities={allCities}
                banks={allBanks}
                loanTypes={LOAN_TYPES}
                onClose={handleCloseBankerModal}
                onSubmit={handleSaveEntry}
            />


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            <BankerViewModal
                open={showViewModal}
                entry={selectedEntry}
                onClose={handleCloseViewModal}
                onEdit={handleEditEntry}
            />

        </div>
    )
}


export default BankersDirectory