// admin-react/src/pages/Banks&DSA/DSADirectory/index.jsx

import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useState,
} from 'react'

import apiClient from '../../../../app/apiClient'
import { getBanks } from '../Banks/Api'

import {
    getDSADirectoryList,
    createDSA,
    updateDSA,
    deleteDSA,
} from './API'

import DSADirectoryTable from './components/DSADirectoryTable'

const DSAModal = lazy(() => import('./components/DSADirectoryModal'))

function DSADirectory() {
    // =========================================================
    // DATA STATE
    // =========================================================

    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(false)

    // =========================================================
    // DROPDOWN OPTIONS
    // =========================================================

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
    // FETCH BANKS AND LOAN TYPES
    // =========================================================

    const loadDropdownData = useCallback(async () => {
        try {
            const [banksRes, loanTypesRes] = await Promise.allSettled([
                getBanks({ is_active: true }),
                apiClient.get('/common/loan-types'),
            ])

            if (banksRes.status === 'fulfilled') {
                const resData = banksRes.value?.data || banksRes.value

                const bList = Array.isArray(resData)
                    ? resData
                    : resData?.data || []

                setApiBanks(
                    bList
                        .map((bank) => ({
                            id: bank.id,
                            name: bank.name,
                        }))
                        .filter((bank) => bank.id && bank.name)
                        .sort((a, b) => a.name.localeCompare(b.name))
                )
            }

            if (loanTypesRes.status === 'fulfilled') {
                const lData = loanTypesRes.value?.data

                setApiLoanTypes(Array.isArray(lData) ? lData : [])
            }
        } catch (error) {
            console.error(
                'Failed to load DSA dropdown options:',
                error
            )
        }
    }, [])

    // =========================================================
    // LOAD DSA DIRECTORY
    // =========================================================

    const loadDSADirectory = useCallback(async () => {
        try {
            setLoading(true)

            const rawData = await getDSADirectoryList({
                search: search.trim() || undefined,
                status: selectedStatus || undefined,
                is_default: selectedDefault || undefined,
                bank_id: selectedBankId
                    ? Number(selectedBankId)
                    : undefined,
                loan_type_id: selectedLoanTypeId
                    ? Number(selectedLoanTypeId)
                    : undefined,
            })

            const list = Array.isArray(rawData)
                ? rawData
                : rawData?.items || rawData?.data || []

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
                loan_type_name:
                    item.loan_type_name || item.loanType || '',

                status:
                    item.status === '1' || item.status === 'active'
                        ? 'active'
                        : 'inactive',

                isDefault: Boolean(
                    item.is_default ?? item.isDefault
                ),

                is_default: Boolean(
                    item.is_default ?? item.isDefault
                ),
            }))

            setEntries(formattedEntries)
        } catch (error) {
            console.error('Failed to load DSA directory:', error)
            setEntries([])
        } finally {
            setLoading(false)
        }
    }, [
        search,
        selectedStatus,
        selectedDefault,
        selectedBankId,
        selectedLoanTypeId,
    ])

    // =========================================================
    // INITIAL DATA LOAD
    // =========================================================

    useEffect(() => {
        loadDropdownData()
    }, [loadDropdownData])

    // =========================================================
    // DEBOUNCED FILTERING
    // =========================================================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDSADirectory()
        }, 300)

        return () => clearTimeout(timer)
    }, [loadDSADirectory])

    // =========================================================
    // FILTER HANDLERS
    // =========================================================

    const handleSearchChange = (value) => {
        setSearch(value)
    }

    const handleStatusChange = (value) => {
        setSelectedStatus(value)
    }

    const handleDefaultChange = (value) => {
        setSelectedDefault(value)
    }

    const handleBankChange = (value) => {
        setSelectedBankId(value)
    }

    const handleLoanTypeChange = (value) => {
        setSelectedLoanTypeId(value)
    }

    const handleReset = () => {
        setSearch('')
        setSelectedStatus('')
        setSelectedDefault('')
        setSelectedBankId('')
        setSelectedLoanTypeId('')
    }

    const handleRefresh = () => {
        loadDSADirectory()
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
    // SAVE DSA — CREATE / UPDATE
    // =========================================================

    const handleSaveDSA = async (entryData) => {
        try {
            setLoading(true)

            // Resolve bank ID if the modal supplies only the bank name.
            let bankId = Number(entryData.bank_id)

            if (!bankId && entryData.bank) {
                const foundBank = apiBanks.find(
                    (bank) =>
                        String(bank.name).toLowerCase() ===
                        String(entryData.bank).toLowerCase()
                )

                if (foundBank) {
                    bankId = foundBank.id
                }
            }

            // Resolve loan type ID if the modal supplies only its name.
            let loanTypeId = Number(entryData.loan_type_id)

            if (!loanTypeId && entryData.loanType) {
                const foundLoanType = apiLoanTypes.find(
                    (loanType) =>
                        String(loanType.name).toLowerCase() ===
                        String(entryData.loanType).toLowerCase()
                )

                if (foundLoanType) {
                    loanTypeId = foundLoanType.id
                }
            }

            const payload = {
                dsa_name: (
                    entryData.dsaName ||
                    entryData.dsa_name ||
                    ''
                ).trim(),

                dsa_code: (
                    entryData.dsaCode ||
                    entryData.dsa_code ||
                    ''
                ).trim(),

                bank_id: bankId || 0,
                loan_type_id: loanTypeId || 0,

                status:
                    entryData.status === 'active' ||
                    entryData.status === '1'
                        ? '1'
                        : '0',

                is_default: Boolean(
                    entryData.isDefault ?? entryData.is_default
                ),
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

            alert(
                error?.response?.data?.detail ||
                'Failed to save DSA entry.'
            )
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

        const confirmed = window.confirm(
            `Are you sure you want to delete ${
                entry.dsaName || entry.dsa_name
            }?`
        )

        if (!confirmed) return

        try {
            setLoading(true)

            await deleteDSA(dsaId)

            await loadDSADirectory()
        } catch (error) {
            console.error('Failed to delete DSA entry:', error)

            alert(
                error?.response?.data?.detail ||
                'Failed to delete DSA entry.'
            )
        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // MODAL OPTIONS
    // =========================================================

    const bankOptionsForModal = apiBanks.length
        ? apiBanks.map((bank) => bank.name)
        : []

    const loanTypeOptionsForModal = apiLoanTypes.length
        ? apiLoanTypes.map((loanType) => loanType.name)
        : []

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="space-y-5 p-4 sm:p-6">
            {/* DSA TABLE, FILTERS AND PERMISSION-GATED ACTIONS */}

            <DSADirectoryTable
                entries={entries}
                loading={loading}
                banks={apiBanks}
                loanTypes={apiLoanTypes}
                search={search}
                selectedStatus={selectedStatus}
                selectedDefault={selectedDefault}
                selectedBankId={selectedBankId}
                selectedLoanTypeId={selectedLoanTypeId}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusChange}
                onDefaultChange={handleDefaultChange}
                onBankChange={handleBankChange}
                onLoanTypeChange={handleLoanTypeChange}
                onReset={handleReset}
                onRefresh={handleRefresh}
                onAdd={handleAddDSA}
                onEdit={handleEditDSA}
                onDelete={handleDeleteDSA}
            />

            {/* ADD / EDIT MODAL */}

            <Suspense fallback={null}>
                {showDSAModal && (
                    <DSAModal
                        open={showDSAModal}
                        entry={selectedEntry}
                        banks={bankOptionsForModal}
                        loanTypes={loanTypeOptionsForModal}
                        existingEntries={entries}
                        onClose={handleCloseModal}
                        onSubmit={handleSaveDSA}
                    />
                )}
            </Suspense>
        </div>
    )
}

export default DSADirectory