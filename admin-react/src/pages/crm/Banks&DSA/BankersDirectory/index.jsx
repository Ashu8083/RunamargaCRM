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
    createBankerDirectory,
    updateBankerDirectory,
    deleteBankerDirectory,
} from './API'

import {
    getBanks,
} from '../Banks/Api'

import BankersDirectoryTable from './components/BankersDirectoryTable'
import BankerModal from './components/BankerModal'
import BankerViewModal from './components/BankerViewModal'
import LoanTypeDropdown from '../../../../components/GlobalModels/Filters/LoanTypeDropdown'
import StateCityDropdown  from '../../../../components/GlobalModels/Filters/StateCityDropdown'


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

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])


    // =========================================================
    // FILTER OPTIONS
    // =========================================================

    const filteredOptions = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase()

        if (!normalizedSearch) {
            return options
        }

        return options.filter((option) => {
            const label = typeof option === 'object' ? option.name : option

            return String(label)
                .toLowerCase()
                .includes(normalizedSearch)
        })
    }, [options, searchValue])


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
                    <span>{placeholder}</span>
                    <span className="text-base-content/30">▾</span>
                </button>
            </div>
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
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
                    {value
                        ? options.find((option) => option.id === Number(value))?.name ?? placeholder
                        : placeholder}
                </span>

                <span className="ml-2 shrink-0 text-xs text-base-content/45">
                    ▾
                </span>
            </button>

            {open && (
                <div
                    className="
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
                    "
                >
                    <div className="border-b border-base-300 p-2">
                        <input
                            type="text"
                            autoFocus
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            onClick={(event) => event.stopPropagation()}
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

                    <div className="max-h-56 overflow-y-auto p-1">
                        <button
                            type="button"
                            onClick={() => handleSelect('')}
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

                        {filteredOptions.map((option) => {
                            const optionId = option.id
                            const optionName = option.name

                            return (
                                <button
                                    type="button"
                                    key={optionId}
                                    onClick={() => handleSelect(option)}
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
                                        Number(value) === optionId
                                            ? 'bg-[#8BCF00]/10 font-medium text-[#6FA800]'
                                            : 'text-base-content hover:bg-base-200',
                                    ].join(' ')}
                                >
                                    {optionName}
                                </button>
                            )
                        })}

                        {!filteredOptions.length && (
                            <div className="px-3 py-5 text-center">
                                <p className="text-xs text-base-content/45">
                                    No options found
                                </p>
                            </div>
                        )}
                    </div>

                    {value && (
                        <div className="border-t border-base-300 p-1">
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
    const [search, setSearch] = useState('')

    const [banks, setBanks] = useState([])
    const [, setBanksLoading] = useState(false)

    const [page, setPage] = useState(1)
    const [limit] = useState(15)
    const [total, setTotal] = useState(0)

    // =========================================================
    // FILTER VALUES
    // =========================================================
    const [selectedStateId, setSelectedStateId] = useState(null)
    const [selectedCityId, setSelectedCityId] = useState(null)
    const [selectedBankId, setSelectedBankId] = useState(null)
    const [selectedLoanTypeId, setSelectedLoanTypeId] = useState(null)

    // =========================================================
    // MODALS
    // =========================================================
    const [showBankerModal, setShowBankerModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState(null)


    // =========================================================
    // GET FIELD VALUE
    // =========================================================
    const getStateName = (entry) => entry?.state ?? entry?.state_name ?? ''
    const getCityName = (entry) => entry?.city ?? entry?.city_name ?? ''


    // =========================================================
    // UNIQUE STATES
    // =========================================================
    const states = useMemo(() => {
        return [...new Set(entries.map(getStateName).filter(Boolean))].sort()
    }, [entries])


    // =========================================================
    // CITIES
    // =========================================================
    const allCities = useMemo(() => {
        return [...new Set(entries.map(getCityName).filter(Boolean))].sort()
    }, [entries])


    // =========================================================
    // BANKS
    // =========================================================
    const loadBanks = useCallback(async () => {
        try {
            setBanksLoading(true)
            const response = await getBanks({ is_active: true })
            const responseData = response?.data

            const bankData = Array.isArray(responseData)
                ? responseData
                : responseData?.data ?? (Array.isArray(response) ? response : [])

            const formattedBanks = bankData
                .map((bank) => ({
                    id: bank.id,
                    name: bank.name,
                }))
                .filter(
                    (bank) =>
                        bank.id !== null &&
                        bank.id !== undefined &&
                        bank.name
                )
                .sort((a, b) => a.name.localeCompare(b.name))

            setBanks(formattedBanks)
        } catch (error) {
            console.error('Failed to load banks:', error)
            setBanks([])
        } finally {
            setBanksLoading(false)
        }
    }, [])


    // =========================================================
    // LOAD DATA FROM SERVER
    // =========================================================
    const loadBankerDirectory = useCallback(
        async (pageNumber = 1) => {
            try {
                setLoading(true)

                const response = await searchBankerDirectory({
                    search: search.trim() || null,
                    state_id: selectedStateId || null,
                    city_id: selectedCityId || null,
                    bank_id: selectedBankId || null,
                    loan_type_id: selectedLoanTypeId || null,
                    page: pageNumber,
                    limit,
                })

                const resData = response?.data || response

                const rawItems = resData?.items || resData?.data || (Array.isArray(resData) ? resData : [])
                const totalCount = resData?.total ?? resData?.count ?? (Array.isArray(rawItems) ? rawItems.length : 0)

                const formattedEntries = rawItems.map((entry) => ({
                    id: entry.banker_directory_id || entry.id,
                    banker_directory_id: entry.banker_directory_id || entry.id,
                    bank_id: entry.bank_id,
                    bank: entry.bank_name || entry.bank || '',
                    bank_name: entry.bank_name || entry.bank || '',
                    loan_type_id: entry.loan_type_id,
                    loanType: entry.loan_type_name || entry.loanType || '',
                    loan_type_name: entry.loan_type_name || entry.loanType || '',
                    state_id: entry.state_id,
                    state: entry.state_name || entry.state || '',
                    state_name: entry.state_name || entry.state || '',
                    city_id: entry.city_id,
                    city: entry.city_name || entry.city || '',
                    city_name: entry.city_name || entry.city || '',
                    status: entry.status === '1' || entry.status === 'active' ? 'active' : 'inactive',
                    asms: (entry.asms || []).map((asm) => ({
                        id: asm.id || Math.random(),
                        name: asm.name || '',
                        contact: asm.contact || asm.phone || '',
                        phone: asm.contact || asm.phone || '',
                        email: asm.email || '',
                    })),
                    sms: (entry.sms || []).map((sm) => ({
                        id: sm.id || Math.random(),
                        name: sm.name || '',
                        contact: sm.contact || sm.phone || '',
                        phone: sm.contact || sm.phone || '',
                        email: sm.email || '',
                    })),
                }))

                setEntries(formattedEntries)
                setTotal(totalCount)
                setPage(pageNumber)
            } catch (error) {
                console.error('Failed to load banker directory:', error)
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


    // =========================================================
    // LOAD / FILTER DATA
    // =========================================================
    useEffect(() => {
        loadBanks()
    }, [loadBanks])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadBankerDirectory(1)
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [loadBankerDirectory])


    // =========================================================
    // STATE CHANGE
    // =========================================================
    const handleStateChange = (value) => {
        setSelectedStateId(value ? Number(value) : null)
        setSelectedCityId(null)
    }


    // =========================================================
    // CITY CHANGE
    // =========================================================
    const handleCityChange = (value) => {
        setSelectedCityId(value ? Number(value) : null)
    }


    // =========================================================
    // BANK CHANGE
    // =========================================================
    const handleBankChange = (bank) => {
        if (typeof bank === 'object' && bank !== null) {
            setSelectedBankId(bank.id ? Number(bank.id) : null)
        } else if (bank) {
            setSelectedBankId(Number(bank))
        } else {
            setSelectedBankId(null)
        }
    }


    // =========================================================
    // LOAN TYPE CHANGE
    // =========================================================
    const handleLoanTypeChange = (value) => {
        setSelectedLoanTypeId(value ? Number(value) : null)
    }


    // =========================================================
    // CLEAR FILTERS
    // =========================================================
    const handleClearFilters = () => {
        setSearch('')
        setSelectedStateId(null)
        setSelectedCityId(null)
        setSelectedBankId(null)
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
    // DELETE ENTRY
    // =========================================================
    const handleDeleteEntry = async (entry) => {
        const bankerId = entry?.id || entry?.banker_directory_id
        if (!bankerId) return

        if (!window.confirm('Are you sure you want to delete this banker directory entry?')) {
            return
        }

        try {
            setLoading(true)
            await deleteBankerDirectory(bankerId)
            await loadBankerDirectory(page)
        } catch (error) {
            console.error('Failed to delete banker entry:', error)
            alert(error?.response?.data?.detail || 'Failed to delete banker entry.')
        } finally {
            setLoading(false)
        }
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
    // SAVE ENTRY (CREATE / UPDATE)
    // =========================================================
    const handleSaveEntry = async (payload) => {
        try {
            setLoading(true)

            const bankerId = payload.banker_directory_id || payload.id

            const apiData = {
                bank_id: Number(payload.bank_id),
                loan_type_id: Number(payload.loan_type_id),
                state_id: Number(payload.state_id),
                city_id: Number(payload.city_id),
                status: payload.status === 'active' || payload.status === '1' ? '1' : '0',
                asms: (payload.asms || []).map((asm) => ({
                    name: asm.name?.trim() || '',
                    contact: (asm.contact || asm.phone || '').trim() || null,
                    email: (asm.email || '').trim() || null,
                })),
                sms: (payload.sms || []).map((sm) => ({
                    name: sm.name?.trim() || '',
                    contact: (sm.contact || sm.phone || '').trim() || null,
                    email: (sm.email || '').trim() || null,
                })),
            }

            if (bankerId) {
                await updateBankerDirectory(bankerId, apiData)
            } else {
                await createBankerDirectory(apiData)
            }

            handleCloseBankerModal()
            await loadBankerDirectory(page)
        } catch (error) {
            console.error('Failed to save banker entry:', error)
            alert(error?.response?.data?.detail || 'Failed to save banker directory entry.')
        } finally {
            setLoading(false)
        }
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
    const handlePageChange = async (nextPage) => {
        if (
            nextPage < 1 ||
            (total > 0 && nextPage > Math.ceil(total / limit))
        ) {
            return
        }

        await loadBankerDirectory(nextPage)
    }


    // =========================================================
    // ACTIVE FILTER
    // =========================================================
    const hasActiveFilters = Boolean(
        search.trim() ||
        selectedStateId ||
        selectedCityId ||
        selectedBankId ||
        selectedLoanTypeId
    )


    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div className="space-y-5 p-4 sm:p-6">
            {/* =====================================================
                FILTER CARD
            ===================================================== */}
            <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm">
                <div className="p-4 sm:p-5">
                    {/* =================================================
                        FILTER HEADER
                    ================================================= */}
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                            Filter Banker Directory
                        </h3>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="text-xs font-medium text-error hover:underline transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* =================================================
                        FILTERS GRID (5 COLUMNS)
                    ================================================= */}
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                        {/* SEARCH */}
                        <div className="lg:col-span-1">
                            <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                                Search
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search bank, SM, ASM..."
                                className="input input-bordered h-10 min-h-10 w-full text-sm"
                            />
                        </div>

                        {/* STATE & CITY */}
                        <div className="lg:col-span-2">
                            <StateCityDropdown
                                stateValue={selectedStateId}
                                cityValue={selectedCityId}
                                onStateChange={handleStateChange}
                                onCityChange={handleCityChange}
                                stateLabel="State"
                                cityLabel="City"
                                allStatesLabel="All States"
                                allCitiesLabel="All Cities"
                                statePlaceholder="Select State"
                                cityPlaceholder="Select City"
                                stateSearchPlaceholder="Search State"
                                citySearchPlaceholder="Search City"
                            />
                        </div>

                        {/* BANK */}
                        <div className="lg:col-span-1">
                            <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                                Bank
                            </label>

                            <SearchableFilterDropdown
                                value={selectedBankId}
                                options={banks}
                                placeholder="All Banks"
                                searchPlaceholder="Search bank..."
                                onChange={handleBankChange}
                            />
                        </div>

                        {/* LOAN TYPE */}
                        <div className="lg:col-span-1">
                            <LoanTypeDropdown
                                label="Loan Type"
                                value={selectedLoanTypeId}
                                onChange={handleLoanTypeChange}
                                className="min-w-0"
                            />
                        </div>
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
                        <p className="text-xs font-medium text-base-content/55">
                            Showing{' '}
                            <span className="font-semibold text-base-content/75">
                                {entries.length}
                            </span>
                            {' '}of{' '}
                            <span className="font-semibold text-base-content/75">
                                {total}
                            </span>
                            {' '}
                            {total === 1 ? 'entry' : 'entries'}
                        </p>

                        <button
                            type="button"
                            onClick={handleAddEntry}
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
                onDelete={handleDeleteEntry}
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
                banks={banks}
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