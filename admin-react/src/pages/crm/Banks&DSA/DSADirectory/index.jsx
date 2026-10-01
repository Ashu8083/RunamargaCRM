// admin-react/src/pages/Banks&DSA/DSADirectory/index.jsx

import { useCallback, useEffect, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import apiClient from '../../../../app/apiClient'
import { getBanks } from '../Banks/Api'
import {
    getDSADirectoryList,
    createDSA,
    updateDSA,
    deleteDSA,
} from './API'

import DSADirectoryTable from './components/DSADirectoryTable'
import DSAModal from './components/DSADirectoryModal'

function DSADirectory() {
    // =========================================================
    // DATA STATE
    // =========================================================
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(false)

    // DROPDOWN OPTIONS DATA
    const [apiBanks, setApiBanks] = useState([])
    const [apiLoanTypes, setApiLoanTypes] = useState([])

    // =========================================================
    // FILTER STATE
    // =========================================================
    const [search, setSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedDefault, setSelectedDefault] = useState('')
    const [selectedBankId, setSelectedBankId] = useState('')
    const [selectedLoanTypeId, setSelectedLoanTypeId] = useState('')

    // =========================================================
    // MODAL STATE
    // =========================================================
    const [showDSAModal, setShowDSAModal] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState(null)

    // =========================================================
    // FETCH DROPDOWNS (BANKS & LOAN TYPES)
    // =========================================================
    const loadDropdownData = useCallback(async () => {
        try {
            const [banksRes, loanTypesRes] = await Promise.allSettled([
                getBanks({ is_active: true }),
                apiClient.get('/common/loan-types'),
            ])

            if (banksRes.status === 'fulfilled') {
                const resData = banksRes.value?.data || banksRes.value
                const bList = Array.isArray(resData) ? resData : resData?.data || []
                setApiBanks(
                    bList
                        .map((b) => ({ id: b.id, name: b.name }))
                        .filter((b) => b.id && b.name)
                        .sort((a, b) => a.name.localeCompare(b.name))
                )
            }

            if (loanTypesRes.status === 'fulfilled') {
                const lData = loanTypesRes.value?.data
                setApiLoanTypes(Array.isArray(lData) ? lData : [])
            }
        } catch (error) {
            console.error('Failed to load DSA dropdown options:', error)
        }
    }, [])

    // =========================================================
    // LOAD DSA DIRECTORY DATA FROM SERVER
    // =========================================================
    const loadDSADirectory = useCallback(async () => {
        try {
            setLoading(true)
            const rawData = await getDSADirectoryList({
                search: search.trim() || undefined,
                status: selectedStatus || undefined,
                is_default: selectedDefault || undefined,
                bank_id: selectedBankId ? Number(selectedBankId) : undefined,
                loan_type_id: selectedLoanTypeId ? Number(selectedLoanTypeId) : undefined,
            })

            const list = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.data || []

            const formattedEntries = list.map((item) => ({
                id: item.id,
                dsaName: item.dsa_name || item.dsaName || '',
                dsa_name: item.dsa_name || item.dsaName || '',
                dsaCode: item.dsa_code || item.dsaCode || '',
                dsa_code: item.dsa_code || item.dsaCode || '',
                bank_id: item.bank_id,
                bank: item.bank_name || item.bank || '',
                bank_name: item.bank_name || item.bank || '',
                loan_type_id: item.loan_type_id,
                loanType: item.loan_type_name || item.loanType || '',
                loan_type_name: item.loan_type_name || item.loanType || '',
                status: item.status === '1' || item.status === 'active' ? 'active' : 'inactive',
                isDefault: Boolean(item.is_default ?? item.isDefault),
                is_default: Boolean(item.is_default ?? item.isDefault),
            }))

            setEntries(formattedEntries)
        } catch (error) {
            console.error('Failed to load DSA directory:', error)
            setEntries([])
        } finally {
            setLoading(false)
        }
    }, [search, selectedStatus, selectedDefault, selectedBankId, selectedLoanTypeId])

    useEffect(() => {
        loadDropdownData()
    }, [loadDropdownData])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDSADirectory()
        }, 300)

        return () => clearTimeout(timer)
    }, [loadDSADirectory])

    // =========================================================
    // RESET FILTERS
    // =========================================================
    const handleReset = () => {
        setSearch('')
        setSelectedStatus('')
        setSelectedDefault('')
        setSelectedBankId('')
        setSelectedLoanTypeId('')
    }

    // =========================================================
    // MODAL HANDLERS
    // =========================================================
    const handleAddDSA = () => {
        setSelectedEntry(null)
        setShowDSAModal(true)
    }

    const handleEditDSA = (entry) => {
        setSelectedEntry(entry)
        setShowDSAModal(true)
    }

    const handleCloseModal = () => {
        setShowDSAModal(false)
        setSelectedEntry(null)
    }

    // =========================================================
    // SAVE DSA (CREATE / UPDATE)
    // =========================================================
    const handleSaveDSA = async (entryData) => {
        try {
            setLoading(true)

            // Resolve bank_id and loan_type_id from options if needed
            let bankId = Number(entryData.bank_id)
            if (!bankId && entryData.bank) {
                const foundBank = apiBanks.find(
                    (b) => String(b.name).toLowerCase() === String(entryData.bank).toLowerCase()
                )
                if (foundBank) bankId = foundBank.id
            }

            let loanTypeId = Number(entryData.loan_type_id)
            if (!loanTypeId && entryData.loanType) {
                const foundLt = apiLoanTypes.find(
                    (lt) => String(lt.name).toLowerCase() === String(entryData.loanType).toLowerCase()
                )
                if (foundLt) loanTypeId = foundLt.id
            }

            const payload = {
                dsa_name: (entryData.dsaName || entryData.dsa_name || '').trim(),
                dsa_code: (entryData.dsaCode || entryData.dsa_code || '').trim(),
                bank_id: bankId || 0,
                loan_type_id: loanTypeId || 0,
                status: entryData.status === 'active' || entryData.status === '1' ? '1' : '0',
                is_default: Boolean(entryData.isDefault ?? entryData.is_default),
            }

            const dsaId = entryData.id || selectedEntry?.id

            if (dsaId) {
                await updateDSA(dsaId, payload)
            } else {
                await createDSA(payload)
            }

            handleCloseModal()
            await loadDSADirectory()
        } catch (error) {
            console.error('Failed to save DSA entry:', error)
            alert(error?.response?.data?.detail || 'Failed to save DSA entry.')
        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // DELETE DSA
    // =========================================================
    const handleDeleteDSA = async (entry) => {
        const dsaId = entry.id
        if (!dsaId) return

        const confirmed = window.confirm(`Are you sure you want to delete ${entry.dsaName || entry.dsa_name}?`)
        if (!confirmed) return

        try {
            setLoading(true)
            await deleteDSA(dsaId)
            await loadDSADirectory()
        } catch (error) {
            console.error('Failed to delete DSA entry:', error)
            alert(error?.response?.data?.detail || 'Failed to delete DSA entry.')
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        loadDSADirectory()
    }

    // Format options for modal
    const bankOptionsForModal = apiBanks.length ? apiBanks.map((b) => b.name) : []
    const loanTypeOptionsForModal = apiLoanTypes.length ? apiLoanTypes.map((l) => l.name) : []

    return (
        <div className="space-y-5 p-4 sm:p-6">
            {/* FILTER CARD */}
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
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search DSA name or code..."
                                className="input input-bordered h-10 min-h-10 w-full pl-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* STATUS */}
                    <div className="w-full lg:w-[150px]">
                        <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                            Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value)}
                            className="select select-bordered h-10 min-h-10 w-full text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* DEFAULT */}
                    <div className="w-full lg:w-[150px]">
                        <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                            Default
                        </label>
                        <select
                            value={selectedDefault}
                            onChange={(event) => setSelectedDefault(event.target.value)}
                            className="select select-bordered h-10 min-h-10 w-full text-sm"
                        >
                            <option value="">All</option>
                            <option value="default">Default</option>
                            <option value="non-default">Non Default</option>
                        </select>
                    </div>

                    {/* RESULT COUNT */}
                    <div className="shrink-0 lg:pb-1">
                        <p className="whitespace-nowrap text-xs font-medium text-base-content/50">
                            {entries.length} {entries.length === 1 ? 'DSA' : 'DSAs'} found
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

            {/* TABLE */}
            <DSADirectoryTable
                entries={entries}
                loading={loading}
                onEdit={handleEditDSA}
                onDelete={handleDeleteDSA}
                onRefresh={handleRefresh}
            />

            {/* ADD / EDIT MODAL */}
            <DSAModal
                open={showDSAModal}
                entry={selectedEntry}
                banks={bankOptionsForModal}
                loanTypes={loanTypeOptionsForModal}
                existingEntries={entries}
                onClose={handleCloseModal}
                onSubmit={handleSaveDSA}
            />
        </div>
    )
}

export default DSADirectory