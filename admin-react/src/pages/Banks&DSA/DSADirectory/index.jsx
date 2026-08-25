// admin-react/src/pages/Banks&DSA/DSADirectory/index.jsx

import { useMemo, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import DSADirectoryTable from './components/DSADirectoryTable'
import DSAModal from './components/DSADirectoryModal'

// =============================================================
// INITIAL DATA
// =============================================================

const INITIAL_DSA_ENTRIES = [
    {
        id: 1,
        dsaName: 'ABC Financial Services',
        dsaCode: 'ABC001',
        bank: 'HDFC Bank',
        loanType: 'Personal Loan',
        status: 'active',
        isDefault: true,
    },
    {
        id: 2,
        dsaName: 'Prime Loan Associates',
        dsaCode: 'PLA001',
        bank: 'HDFC Bank',
        loanType: 'Personal Loan',
        status: 'active',
        isDefault: false,
    },
    {
        id: 3,
        dsaName: 'Capital Connect',
        dsaCode: 'CC001',
        bank: 'ICICI Bank',
        loanType: 'Home Loan',
        status: 'active',
        isDefault: true,
    },
    {
        id: 4,
        dsaName: 'Loan Point India',
        dsaCode: '',
        bank: 'Axis Bank',
        loanType: 'Business Loan',
        status: 'inactive',
        isDefault: false,
    },
    {
        id: 5,
        dsaName: 'Smart Finance',
        dsaCode: 'SF001',
        bank: 'State Bank of India',
        loanType: 'Education Loan',
        status: 'active',
        isDefault: true,
    },
]

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
// BANK OPTIONS
// =============================================================

const BANKS = [
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'State Bank of India',
    'Kotak Mahindra Bank',
    'IndusInd Bank',
    'IDFC FIRST Bank',
    'Federal Bank',
    'Yes Bank',
]

// =============================================================
// COMPONENT
// =============================================================

function DSADirectory() {

    // =========================================================
    // DATA
    // =========================================================

    const [entries, setEntries] =
        useState(INITIAL_DSA_ENTRIES)

    // =========================================================
    // FILTER
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')

    const [selectedDefault, setSelectedDefault] =
        useState('')

    // =========================================================
    // MODAL
    // =========================================================

    const [showDSAModal, setShowDSAModal] =
        useState(false)

    const [selectedEntry, setSelectedEntry] =
        useState(null)

    // =========================================================
    // FILTERED ENTRIES
    // =========================================================

    const filteredEntries = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase()

        return entries.filter((entry) => {

            // SEARCH

            if (searchValue) {

                const searchableValues = [
                    entry.dsaName,
                    entry.dsaCode,
                    entry.bank,
                    entry.loanType,
                ]

                const matchesSearch =
                    searchableValues.some(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            String(value)
                                .toLowerCase()
                                .includes(searchValue)
                    )

                if (!matchesSearch) {
                    return false
                }

            }

            // STATUS FILTER

            if (
                selectedStatus &&
                entry.status !== selectedStatus
            ) {
                return false
            }

            // DEFAULT FILTER

            if (
                selectedDefault === 'default' &&
                !entry.isDefault
            ) {
                return false
            }

            if (
                selectedDefault === 'non-default' &&
                entry.isDefault
            ) {
                return false
            }

            return true

        })

    }, [
        entries,
        search,
        selectedStatus,
        selectedDefault,
    ])

    // =========================================================
    // RESET FILTER
    // =========================================================

    const handleReset = () => {

        setSearch('')
        setSelectedStatus('')
        setSelectedDefault('')

    }

    // =========================================================
    // ADD DSA
    // =========================================================

    const handleAddDSA = () => {

        setSelectedEntry(null)
        setShowDSAModal(true)

    }

    // =========================================================
    // EDIT DSA
    // =========================================================

    const handleEditDSA = (entry) => {

        setSelectedEntry(entry)
        setShowDSAModal(true)

    }

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowDSAModal(false)
        setSelectedEntry(null)

    }

    // =========================================================
    // SAVE DSA
    // =========================================================

    const handleSaveDSA = (entryData) => {

        if (entryData.id) {

            setEntries((previous) => {

                if (entryData.isDefault) {

                    return previous.map((entry) => {

                        if (
                            entry.id !== entryData.id &&
                            entry.bank === entryData.bank &&
                            entry.loanType === entryData.loanType
                        ) {
                            return {
                                ...entry,
                                isDefault: false,
                            }
                        }

                        if (entry.id === entryData.id) {
                            return {
                                ...entry,
                                ...entryData,
                            }
                        }

                        return entry

                    })

                }

                return previous.map((entry) =>
                    entry.id === entryData.id
                        ? {
                            ...entry,
                            ...entryData,
                        }
                        : entry
                )

            })

        } else {

            const newEntry = {
                ...entryData,
                id: Date.now(),
            }

            setEntries((previous) => {

                let updated = previous

                if (newEntry.isDefault) {

                    updated = previous.map((entry) => {

                        if (
                            entry.bank === newEntry.bank &&
                            entry.loanType === newEntry.loanType
                        ) {
                            return {
                                ...entry,
                                isDefault: false,
                            }
                        }

                        return entry

                    })

                }

                return [
                    ...updated,
                    newEntry,
                ]

            })

        }

        handleCloseModal()

    }

    // =========================================================
    // DELETE DSA
    // =========================================================

    const handleDeleteDSA = (entry) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${entry.dsaName}?`
            )

        if (!confirmed) {
            return
        }

        setEntries((previous) =>
            previous.filter(
                (item) => item.id !== entry.id
            )
        )

    }

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {
        console.log('Refresh DSA Directory')
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="space-y-5 p-4 sm:p-6">

            {/* =====================================================
                FILTER CARD
            ===================================================== */}

            <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm">

                <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end lg:px-5 lg:py-4">

                    {/* SEARCH */}

                    <div className="min-w-0 flex-1">

                        <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                            Search
                        </label>

                        <div className="relative">

                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/35" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search DSA name, code, bank or loan type..."
                                className="input input-bordered h-10 min-h-10 w-full pl-9"
                            />

                        </div>

                    </div>

                    {/* STATUS */}

                    <div className="w-full lg:w-[170px]">

                        <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                            Status
                        </label>

                        <select
                            value={selectedStatus}
                            onChange={(event) =>
                                setSelectedStatus(event.target.value)
                            }
                            className="select select-bordered h-10 min-h-10 w-full"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                    </div>

                    {/* DEFAULT */}

                    <div className="w-full lg:w-[170px]">

                        <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                            Default
                        </label>

                        <select
                            value={selectedDefault}
                            onChange={(event) =>
                                setSelectedDefault(event.target.value)
                            }
                            className="select select-bordered h-10 min-h-10 w-full"
                        >
                            <option value="">All</option>
                            <option value="default">Default</option>
                            <option value="non-default">Non Default</option>
                        </select>

                    </div>

                    {/* RESULT COUNT */}

                    <div className="shrink-0 lg:pb-1">

                        <p className="whitespace-nowrap text-xs font-medium text-base-content/50">
                            {filteredEntries.length}{' '}
                            {filteredEntries.length === 1
                                ? 'DSA'
                                : 'DSAs'}{' '}
                            found
                        </p>

                    </div>

                    {/* RESET */}

                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-base-300 bg-base-100 px-4 text-sm font-medium text-base-content/65 transition hover:bg-base-200 hover:text-base-content"
                    >

                        <ArrowPathIcon className="h-4 w-4" />

                        Reset

                    </button>

                    {/* ADD */}

                    <button
                        type="button"
                        onClick={handleAddDSA}
                        className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#8BCF00] px-4 text-sm font-medium text-white transition hover:bg-[#78B300] focus:outline-none focus:ring-2 focus:ring-[#8BCF00]/30"
                    >

                        <PlusIcon className="h-4 w-4" />

                        Add DSA

                    </button>

                </div>

            </div>

            {/* =====================================================
                TABLE
            ===================================================== */}

            <DSADirectoryTable
                entries={filteredEntries}
                onEdit={handleEditDSA}
                onDelete={handleDeleteDSA}
                onRefresh={handleRefresh}
            />

            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <DSAModal
                open={showDSAModal}
                entry={selectedEntry}
                banks={BANKS}
                loanTypes={LOAN_TYPES}
                existingEntries={entries}
                onClose={handleCloseModal}
                onSubmit={handleSaveDSA}
            />

        </div>

    )

}

export default DSADirectory