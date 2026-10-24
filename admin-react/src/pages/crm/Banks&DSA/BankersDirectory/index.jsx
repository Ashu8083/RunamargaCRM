// admin-react/src/pages/crm/Banks&DSA/BankersDirectory/index.jsx

import {
    lazy,
    Suspense,
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

import { getBanks } from '../Banks/Api'

import BankersDirectoryTable from './components/BankersDirectoryTable'


const BankerModal = lazy(
    () => import('./components/BankerModal')
)

const BankerViewModal = lazy(
    () => import('./components/BankerViewModal')
)


// =============================================================
// MAIN PAGE
// =============================================================

function BankersDirectory() {

    // =========================================================
    // DATA
    // =========================================================

    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(false)

    const [banks, setBanks] = useState([])

    const [page, setPage] = useState(1)
    const [limit] = useState(15)
    const [total, setTotal] = useState(0)


    // =========================================================
    // CURRENT FILTERS
    // Filter state is owned by BankersDirectoryTable.jsx.
    // This ref only lets API calls reuse the latest filter values.
    // =========================================================

    const filtersRef = useRef({
        search: '',
        state_id: null,
        city_id: null,
        bank_id: null,
        loan_type_id: null,
    })


    // =========================================================
    // MODALS
    // =========================================================

    const [showBankerModal, setShowBankerModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState(null)


    // =========================================================
    // GET FIELD VALUE
    // =========================================================

    const getStateName = (entry) =>
        entry?.state ?? entry?.state_name ?? ''

    const getCityName = (entry) =>
        entry?.city ?? entry?.city_name ?? ''


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
    // LOAD BANKS
    // =========================================================

    const loadBanks = useCallback(async () => {
        try {
            const response = await getBanks({
                is_active: true,
            })

            const responseData = response?.data

            const bankData = Array.isArray(responseData)
                ? responseData
                : responseData?.data ??
                  (Array.isArray(response) ? response : [])

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
                .sort((a, b) =>
                    a.name.localeCompare(b.name)
                )

            setBanks(formattedBanks)
        } catch (error) {
            console.error('Failed to load banks:', error)
            setBanks([])
        }
    }, [])


    // =========================================================
    // LOAD BANKER DIRECTORY
    // =========================================================

    const loadBankerDirectory = useCallback(
        async (
            pageNumber = 1,
            filters = filtersRef.current
        ) => {
            try {
                setLoading(true)

                const response = await searchBankerDirectory({
                    search: filters.search?.trim() || null,
                    state_id: filters.state_id || null,
                    city_id: filters.city_id || null,
                    bank_id: filters.bank_id || null,
                    loan_type_id: filters.loan_type_id || null,
                    page: pageNumber,
                    limit,
                })

                const resData = response?.data || response

                const rawItems =
                    resData?.items ||
                    resData?.data ||
                    (Array.isArray(resData) ? resData : [])

                const totalCount =
                    resData?.total ??
                    resData?.count ??
                    (Array.isArray(rawItems)
                        ? rawItems.length
                        : 0)

                const formattedEntries = rawItems.map((entry) => ({
                    id:
                        entry.banker_directory_id ||
                        entry.id,

                    banker_directory_id:
                        entry.banker_directory_id ||
                        entry.id,

                    bank_id: entry.bank_id,

                    bank:
                        entry.bank_name ||
                        entry.bank ||
                        '',

                    bank_name:
                        entry.bank_name ||
                        entry.bank ||
                        '',

                    loan_type_id: entry.loan_type_id,

                    loanType:
                        entry.loan_type_name ||
                        entry.loanType ||
                        '',

                    loan_type_name:
                        entry.loan_type_name ||
                        entry.loanType ||
                        '',

                    state_id: entry.state_id,

                    state:
                        entry.state_name ||
                        entry.state ||
                        '',

                    state_name:
                        entry.state_name ||
                        entry.state ||
                        '',

                    city_id: entry.city_id,

                    city:
                        entry.city_name ||
                        entry.city ||
                        '',

                    city_name:
                        entry.city_name ||
                        entry.city ||
                        '',

                    status:
                        entry.status === '1' ||
                        entry.status === 'active'
                            ? 'active'
                            : 'inactive',

                    asms: (entry.asms || []).map((asm) => ({
                        id: asm.id || Math.random(),
                        name: asm.name || '',
                        contact:
                            asm.contact ||
                            asm.phone ||
                            '',
                        phone:
                            asm.contact ||
                            asm.phone ||
                            '',
                        email: asm.email || '',
                    })),

                    sms: (entry.sms || []).map((sm) => ({
                        id: sm.id || Math.random(),
                        name: sm.name || '',
                        contact:
                            sm.contact ||
                            sm.phone ||
                            '',
                        phone:
                            sm.contact ||
                            sm.phone ||
                            '',
                        email: sm.email || '',
                    })),
                }))

                setEntries(formattedEntries)
                setTotal(totalCount)
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
        [limit]
    )


    // =========================================================
    // LOAD INITIAL DATA
    // =========================================================

    useEffect(() => {
        loadBanks()
    }, [loadBanks])


    // =========================================================
    // FILTER CHANGE
    // Called by BankersDirectoryTable.jsx.
    // =========================================================

    const handleFiltersChange = useCallback(
        (filters) => {
            filtersRef.current = {
                search: filters.search || '',
                state_id: filters.state_id || null,
                city_id: filters.city_id || null,
                bank_id: filters.bank_id || null,
                loan_type_id: filters.loan_type_id || null,
            }

            loadBankerDirectory(
                1,
                filtersRef.current
            )
        },
        [loadBankerDirectory]
    )


    // =========================================================
    // ADD ENTRY
    // Permission-controlled button is in the table.
    // =========================================================

    const handleAddEntry = () => {
        setSelectedEntry(null)
        setShowViewModal(false)
        setShowBankerModal(true)
    }


    // =========================================================
    // EDIT ENTRY
    // Permission-controlled button is in the table.
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
    // Permission-controlled button is in the table.
    // =========================================================

    const handleDeleteEntry = async (entry) => {
        const bankerId =
            entry?.id ||
            entry?.banker_directory_id

        if (!bankerId) {
            return
        }

        if (
            !window.confirm(
                'Are you sure you want to delete this banker directory entry?'
            )
        ) {
            return
        }

        try {
            setLoading(true)

            await deleteBankerDirectory(bankerId)

            // If the last row on the current page was deleted,
            // move back to the previous valid page.
            const remainingTotal = Math.max(0, total - 1)

            const lastPage = Math.max(
                1,
                Math.ceil(remainingTotal / limit)
            )

            const nextPage = Math.min(page, lastPage)

            await loadBankerDirectory(
                nextPage,
                filtersRef.current
            )
        } catch (error) {
            console.error(
                'Failed to delete banker entry:',
                error
            )

            alert(
                error?.response?.data?.detail ||
                'Failed to delete banker entry.'
            )
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
    // SAVE ENTRY — CREATE / UPDATE
    // =========================================================

    const handleSaveEntry = async (payload) => {
        try {
            setLoading(true)

            const bankerId =
                payload.banker_directory_id ||
                payload.id

            const apiData = {
                bank_id: Number(payload.bank_id),
                loan_type_id: Number(payload.loan_type_id),
                state_id: Number(payload.state_id),
                city_id: Number(payload.city_id),

                status:
                    payload.status === 'active' ||
                    payload.status === '1'
                        ? '1'
                        : '0',

                asms: (payload.asms || []).map((asm) => ({
                    name: asm.name?.trim() || '',
                    contact:
                        (asm.contact || asm.phone || '')
                            .trim() || null,
                    email:
                        (asm.email || '').trim() ||
                        null,
                })),

                sms: (payload.sms || []).map((sm) => ({
                    name: sm.name?.trim() || '',
                    contact:
                        (sm.contact || sm.phone || '')
                            .trim() || null,
                    email:
                        (sm.email || '').trim() ||
                        null,
                })),
            }

            if (bankerId) {
                await updateBankerDirectory(
                    bankerId,
                    apiData
                )
            } else {
                await createBankerDirectory(apiData)
            }

            handleCloseBankerModal()

            await loadBankerDirectory(
                page,
                filtersRef.current
            )
        } catch (error) {
            console.error(
                'Failed to save banker entry:',
                error
            )

            alert(
                error?.response?.data?.detail ||
                'Failed to save banker directory entry.'
            )
        } finally {
            setLoading(false)
        }
    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {
        await loadBankerDirectory(
            page,
            filtersRef.current
        )
    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = async (nextPage) => {
        if (
            nextPage < 1 ||
            (
                total > 0 &&
                nextPage > Math.ceil(total / limit)
            )
        ) {
            return
        }

        await loadBankerDirectory(
            nextPage,
            filtersRef.current
        )
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="space-y-5 p-4 sm:p-6">

            {/* FILTERS, PERMISSIONS, AND TABLE */}
            <BankersDirectoryTable
                entries={entries}
                banks={banks}
                loading={loading}

                onView={handleViewEntry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onRefresh={handleRefresh}
                onAdd={handleAddEntry}

                onFiltersChange={handleFiltersChange}

                page={page}
                limit={limit}
                total={total}
                onPageChange={handlePageChange}
            />


            {/* MODALS */}
            <Suspense fallback={null}>

                {/* ADD / EDIT MODAL */}
                {showBankerModal && (
                    <BankerModal
                        open={showBankerModal}
                        entry={selectedEntry}
                        states={states}
                        cities={allCities}
                        banks={banks}
                        onClose={handleCloseBankerModal}
                        onSubmit={handleSaveEntry}
                    />
                )}


                {/* VIEW MODAL */}
                {showViewModal && (
                    <BankerViewModal
                        open={showViewModal}
                        entry={selectedEntry}
                        onClose={handleCloseViewModal}
                        onEdit={handleEditEntry}
                    />
                )}

            </Suspense>
        </div>
    )
}

export default BankersDirectory