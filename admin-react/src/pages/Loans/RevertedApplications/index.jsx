// admin-react/src/pages/Loans/RevertedApplications/index.jsx

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'

import AgentDropdown from '../../../components/GlobalModels/Filters/AgentDropdown'
import LoanTypeDropdown from '../../../components/GlobalModels/Filters/LoanTypeDropdown'

import RevertedApplicationsTable from './components/RevertedApplicationsTable'
import RevertDateModal from './components/RevertDateModal'
import RevertHistoryModal from './components/RevertHistoryModal'

import {
    getRevertedApplications,
    getRevertHistory,
    getApiErrorMessage,
} from './API'

function RevertedApplications() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] =
        useState([])

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')
    // =========================================================
    // PAGINATION
    // =========================================================

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        })

    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedDate, setSelectedDate] =
        useState('')


    // =========================================================
    // MODAL STATE
    // =========================================================

    const [selectedApplication, setSelectedApplication] =
        useState(null)

    const [showRevertDateModal, setShowRevertDateModal] =
        useState(false)

    const [showRevertHistoryModal, setShowRevertHistoryModal] =
        useState(false)


    // =========================================================
    // LOAN TYPES
    // =========================================================

    const loanTypes = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.loanType ??
                            application.loan_type
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // REVERTED BY / AGENTS
    // =========================================================

    const agents = useMemo(() => {

        const map = new Map()


        applications.forEach((application) => {

            const id =
                application.revertedById ??
                application.reverted_by_id ??
                application.revertedBy ??
                application.reverted_by


            const name =
                application.revertedBy ??
                application.reverted_by ??
                'Unknown User'


            if (!id && !name) {
                return
            }


            const key =
                String(id ?? name)


            if (!map.has(key)) {

                map.set(key, {
                    id: id ?? name,
                    name,
                })

            }

        })


        return [...map.values()]

    }, [applications])


    // =========================================================
    // DATE FORMATTER
    // =========================================================

    const formatDateForFilter = (value) => {

        if (!value) {
            return ''
        }


        const date =
            new Date(value)


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return ''
        }


        const year =
            date.getFullYear()


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, '0')


        const day =
            String(
                date.getDate()
            ).padStart(2, '0')


        return `${year}-${month}-${day}`

    }

    // =========================================================
    // FETCH REVERTED APPLICATIONS
    // =========================================================

    const fetchApplications = useCallback(
        async (
            page = pagination.page
        ) => {

            try {

                setLoading(true)
                setError('')


                const result =
                    await getRevertedApplications({
                        search,
                        loanTypeId:
                            selectedLoanType,
                        revertedById:
                            selectedAgent,
                        revertedDate:
                            selectedDate,
                        page,
                        limit:
                            pagination.limit,
                    })


                setApplications(
                    result.items
                )


                setPagination({
                    page:
                        result.page,

                    limit:
                        result.limit,

                    total:
                        result.total,

                    totalPages:
                        result.totalPages,
                })

            } catch (error) {

                console.error(
                    'Failed to fetch reverted applications:',
                    error
                )


                setApplications([])


                setError(
                    getApiErrorMessage(
                        error,
                        'Failed to load reverted applications.'
                    )
                )

            } finally {

                setLoading(false)

            }

        },
        [
            search,
            selectedLoanType,
            selectedAgent,
            selectedDate,
            pagination.limit,
        ]
    )

    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')

        setSelectedLoanType('')

        setSelectedAgent('')

        setSelectedDate('')

    }


    // =========================================================
    // CHANGE REVERTED DATE
    // =========================================================

    const handleChangeDate = (application) => {

        setSelectedApplication(application)

        setShowRevertDateModal(true)

    }


    const handleCloseDateModal = () => {

        setShowRevertDateModal(false)

        setSelectedApplication(null)

    }


    const handleDateSubmit = (data) => {

        setApplications((previous) =>
            previous.map((application) => {

                if (
                    application.id !==
                    data.id
                ) {

                    return application

                }


                const previousDate =
                    application.revertedDate


                const newDate =
                    data.revertedDate


                const historyEntry = {

                    id: Date.now(),

                    changedBy:
                        data.changedBy ||
                        'Current User',

                    changedAt:
                        new Date().toISOString(),

                    fromDate:
                        previousDate,

                    toDate:
                        newDate,

                    remarks:
                        data.remarks ||
                        '',
                }


                return {

                    ...application,

                    revertedDate:
                        newDate,

                    remarks:
                        data.remarks ||
                        application.remarks,

                    changeHistory: [
                        ...(application.changeHistory ||
                            []),
                        historyEntry,
                    ],

                }

            })
        )


        handleCloseDateModal()

    }


    // =========================================================
    // VIEW CHANGE HISTORY
    // =========================================================

    const handleViewHistory = async (
        application
    ) => {

        try {

            setLoading(true)
            setError('')


            const history =
                await getRevertHistory(
                    application.loanId
                )


            setSelectedApplication({
                ...application,
                changeHistory:
                    history,
            })


            setShowRevertHistoryModal(
                true
            )

        } catch (error) {

            console.error(
                'Failed to fetch revert history:',
                error
            )


            setError(
                getApiErrorMessage(
                    error,
                    'Failed to load revert history.'
                )
            )

        } finally {

            setLoading(false)

        }

    }


    const handleCloseHistoryModal = () => {

        setShowRevertHistoryModal(
            false
        )

        setSelectedApplication(
            null
        )

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        fetchApplications(
            pagination.page
        )

    }
    // =========================================================
    // PAGINATION
    // =========================================================

    const handlePreviousPage = () => {

        if (
            pagination.page <= 1 ||
            loading
        ) {
            return
        }


        fetchApplications(
            pagination.page - 1
        )

    }


    const handleNextPage = () => {

        if (
            pagination.page >=
            pagination.totalPages ||
            loading
        ) {
            return
        }


        fetchApplications(
            pagination.page + 1
        )

    }


    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > pagination.totalPages ||
            page === pagination.page ||
            loading
        ) {
            return
        }


        fetchApplications(page)

    }
    // Filter changes
    useEffect(() => {

        fetchApplications(1)

    }, [
        selectedLoanType,
        selectedAgent,
        selectedDate,
    ])
    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            p-4
            sm:p-6
            space-y-5
        ">

            {/* =====================================================
                FILTER SECTION
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    px-5
                    pt-5
                    pb-4
                ">

                    {/* FILTER HEADER */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            Filter Options
                        </p>


                        {(search ||
                            selectedLoanType ||
                            selectedAgent ||
                            selectedDate) && (

                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="
                                    flex
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-[#78B300]
                                    hover:text-[#5f9000]
                                "
                                >

                                    <XMarkIcon className="
                                    h-3.5
                                    w-3.5
                                " />

                                    Clear Filters

                                </button>

                            )}

                    </div>


                    {/* FILTER CONTROLS */}

                    <div className="
                        mt-4
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-4
                    ">

                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-5
                                w-5
                                -translate-y-1/2
                                text-base-content/45
                            " />


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by name, phone, loan ID..."
                                className="
                                    input
                                    input-bordered
                                    w-full
                                    pl-10
                                "
                            />

                        </div>


                        {/* =================================================
                            LOAN TYPE
                        ================================================= */}

                        <LoanTypeDropdown
                            value={
                                selectedLoanType
                            }
                            onChange={
                                setSelectedLoanType
                            }
                            options={loanTypes}
                            showLabel={false}
                            className="min-w-0"
                            buttonClassName="h-12 min-h-12 px-4"
                        />


                        {/* =================================================
                            AGENT SEARCH DROPDOWN
                        ================================================= */}

                        <AgentDropdown
                            value={selectedAgent}
                            onChange={setSelectedAgent}
                            options={agents}
                            showLabel={false}
                            className="min-w-0"
                            buttonClassName="h-12 min-h-12 px-4"
                        />


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <input
                                type="date"
                                value={
                                    selectedDate
                                }
                                onChange={(event) =>
                                    setSelectedDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        RESULT COUNT
                    ================================================= */}

                    <p className="
                        mt-4
                        text-xs
                        font-medium
                        text-base-content/60
                    ">

                        {applications.length}{' '}

                        {applications.length === 1
                            ? 'result'
                            : 'results'}{' '}

                        found

                    </p>

                </div>

            </div>


            {/* =====================================================
                TABLE SECTION
            ===================================================== */}

            {loading ? (

                <div className="
        flex
        min-h-[280px]
        items-center
        justify-center
        rounded-xl
        border
        border-base-300
        bg-base-100
        shadow-sm
    ">

                    <span className="
            loading
            loading-spinner
            loading-md
            text-[#78B300]
        " />

                </div>

            ) : (

                <RevertedApplicationsTable
                    applications={
                        applications
                    }
                    onChangeDate={
                        handleChangeDate
                    }
                    onViewHistory={
                        handleViewHistory
                    }
                    onRefresh={
                        handleRefresh
                    }
                />

            )}
            {pagination.totalPages > 0 && (
                <div className="
        flex
        flex-col
        items-center
        justify-between
        gap-3
        rounded-xl
        border
        border-base-300
        bg-base-100
        px-4
        py-3
        sm:flex-row
    ">

                    <p className="
            text-xs
            text-base-content/60
        ">
                        Page {pagination.page} of{' '}
                        {pagination.totalPages}
                    </p>


                    <div className="
            flex
            items-center
            gap-1
        ">

                        <button
                            type="button"
                            onClick={
                                handlePreviousPage
                            }
                            disabled={
                                pagination.page <= 1 ||
                                loading
                            }
                            className="
                    btn
                    btn-sm
                    btn-ghost
                    disabled:opacity-40
                "
                        >
                            Previous
                        </button>


                        {Array.from(
                            {
                                length:
                                    pagination.totalPages,
                            },
                            (_, index) =>
                                index + 1
                        )
                            .filter((page) => {

                                if (
                                    pagination.totalPages <= 7
                                ) {
                                    return true
                                }

                                return (
                                    page === 1 ||
                                    page ===
                                    pagination.totalPages ||
                                    Math.abs(
                                        page -
                                        pagination.page
                                    ) <= 1
                                )

                            })
                            .map((page) => (

                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                    disabled={loading}
                                    className={`
                            btn
                            btn-sm
                            ${page ===
                                            pagination.page
                                            ? 'bg-[#8BCF00] text-white hover:bg-[#6FA800]'
                                            : 'btn-ghost'
                                        }
                        `}
                                >
                                    {page}
                                </button>

                            ))}


                        <button
                            type="button"
                            onClick={
                                handleNextPage
                            }
                            disabled={
                                pagination.page >=
                                pagination.totalPages ||
                                loading
                            }
                            className="
                    btn
                    btn-sm
                    btn-ghost
                    disabled:opacity-40
                "
                        >
                            Next
                        </button>

                    </div>

                </div>
            )}
            {/* =====================================================
                CHANGE DATE MODAL
            ===================================================== */}

            <RevertDateModal
                open={
                    showRevertDateModal
                }
                application={
                    selectedApplication
                }
                onClose={
                    handleCloseDateModal
                }
                onSubmit={
                    handleDateSubmit
                }
            />


            {/* =====================================================
                CHANGE HISTORY MODAL
            ===================================================== */}

            <RevertHistoryModal
                open={
                    showRevertHistoryModal
                }
                application={
                    selectedApplication
                }
                onClose={
                    handleCloseHistoryModal
                }
            />

        </div>

    )

}


export default RevertedApplications
