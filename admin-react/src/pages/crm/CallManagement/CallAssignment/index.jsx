// admin-react/src/pages/crm/CallManagement/CallAssignment/index.jsx

import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useState,
} from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import ExistingLoan from '../../Loans/CreateApplication/components/ExistingLoan'
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'
import CallAssignmentTable from './components/CallAssignmentTable'
import {    
    getCallAssignments,
    getAvailableCallNumbers,
    createCallAssignment,
    getCallHistory,
    createApplication,
    deleteCallAssignment,
} from './Api'
import { PERMISSIONS, hasPermission } from '../../../../app/permissions'


const AssignNumbersModal = lazy(
    () => import('./components/AssignNumbersModal')
)

const CallHistoryModal = lazy(
    () => import('./components/CallHistoryModal')
)

const CreateLeadModal = lazy(
    () => import('./components/CreateLeadModal')
)

const LoanApplicationModal = lazy(
    () => import('./components/LoanApplicationModal')
)

const ExchangeNumberModal = lazy(
    () => import('./components/ExchangeNumberModal')
)

const canAssign = hasPermission(PERMISSIONS.CALL_ASSIGNMENT_ASSIGN)
// =============================================================
// STATUS OPTIONS
// =============================================================

const STATUS_OPTIONS = [
    'unassigned',
    'pending',
    'assigned',
    'contacted',
]

// =============================================================
// DATE OPTIONS
// =============================================================

const DATE_OPTIONS = [
    {
        value: 'today',
        label: 'Today',
    },
    {
        value: 'yesterday',
        label: 'Yesterday',
    },
    {
        value: 'this-week',
        label: 'This Week',
    },
    {
        value: 'last-week',
        label: 'Last Week',
    },
    {
        value: 'this-month',
        label: 'This Month',
    },
    {
        value: 'last-month',
        label: 'Last Month',
    },
    {
        value: 'custom',
        label: 'Custom Range',
    },
]

// =============================================================
// ASSIGNMENT REQUEST
// =============================================================

const fetchAssignments = async (params) => {
    return getCallAssignments(params)
}

// =============================================================
// COMPONENT
// =============================================================

function CallAssignment() {

    // =========================================================
    // DATA
    // =========================================================

    const [existingLoan, setExistingLoan] =
        useState(null)

    const [feedback, setFeedback] =
        useState({
            open: false,
            type: 'success',
            title: '',
            message: '',
        })

    const [entries, setEntries] =
        useState([])

    const [availableNumbers, setAvailableNumbers] =
        useState([])

    const [showAssignModal, setShowAssignModal] =
        useState(false)

    const [, setLoading] =
        useState(false)

    const [loadingAssignments, setLoadingAssignments] =
        useState(true)

    const [loadingAvailableNumbers, setLoadingAvailableNumbers] =
        useState(false)

    // =========================================================
    // FILTERS
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [status, setStatus] =
        useState('')

    const [dateFilter, setDateFilter] =
        useState('')

    const [rm, setRM] =
        useState('')

    const [fromDate, setFromDate] =
        useState('')

    const [toDate, setToDate] =
        useState('')

    const [currentPage, setCurrentPage] =
        useState(1)

    const [pageSize, setPageSize] =
        useState(10)

    const [pagination, setPagination] =
        useState({
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
        })

    // =========================================================
    // MODALS
    // =========================================================

    const [selectedEntry, setSelectedEntry] =
        useState(null)

    const [showHistoryModal, setShowHistoryModal] =
        useState(false)

    const [showApplicationModal, setShowApplicationModal] =
        useState(false)

    const [showCreateLeadModal, setShowCreateLeadModal] =
        useState(false)

    const [showExchangeModal, setShowExchangeModal] =
        useState(false)

    const [callHistory, setCallHistory] =
        useState([])

    // =========================================================
    // FEEDBACK
    // =========================================================

    const closeFeedback = () => {
        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))
    }

    const showFeedback = useCallback(({
        type = 'success',
        title = '',
        message = '',
    }) => {
        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }, [])

    // =========================================================
    // LOAD AVAILABLE NUMBERS
    // =========================================================

    const openAssignModal = async () => {
        try {
            setLoadingAvailableNumbers(true)

            const response =
                await getAvailableCallNumbers()

            const numbers =
                response?.success &&
                    Array.isArray(response.data)
                    ? response.data
                    : []

            setAvailableNumbers(numbers)
            setShowAssignModal(true)

        } catch (err) {

            showFeedback({
                type: 'error',
                title: 'Unable to Load Numbers',
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    'Unable to load available call numbers.',
            })

        } finally {
            setLoadingAvailableNumbers(false)
        }
    }

    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadAssignments = useCallback(async (params = {}) => {
        const requestPage =
            params.page ?? currentPage

        const requestPageSize =
            params.pageSize ?? pageSize

        const requestFilters = {
            search:
                params.search ?? search,
            status:
                params.status ?? status,
            rm:
                params.rm ?? rm,
            dateFilter:
                params.dateFilter ?? dateFilter,
            fromDate:
                params.fromDate ?? fromDate,
            toDate:
                params.toDate ?? toDate,
        }

        try {
            setLoadingAssignments(true)

            const response =
                await fetchAssignments({
                    page: requestPage,
                    pageSize: requestPageSize,
                    ...requestFilters,
                })

            const assignments =
                response?.success &&
                    Array.isArray(response.data)
                    ? response.data
                    : []

            const normalizedAssignments =
                assignments.map(
                    (assignment) => ({
                        ...assignment,

                        phone:
                            assignment.phone_number,

                        contact:
                            assignment.phone_number,

                        assignedBy:
                            assignment.assigned_by_name ||
                            '—',

                        assignedTo:
                            assignment.assigned_to_id,

                        assignedToName:
                            assignment.assigned_to_name ||
                            '—',

                        assignedDate:
                            assignment.created_at,

                        attempts:
                            assignment.attempts ?? 0,

                        lastCalled:
                            assignment.last_called ??
                            null,

                        callStatus:
                            assignment.call_status ??
                            null,
                    })
                )

            setEntries(
                normalizedAssignments
            )

            const responsePagination =
                response?.pagination || {}

            setPagination({
                page:
                    Number(
                        responsePagination.page
                    ) || requestPage,

                pageSize:
                    Number(
                        responsePagination.page_size
                    ) || requestPageSize,

                total:
                    Number(
                        responsePagination.total
                    ) || 0,

                totalPages:
                    Number(
                        responsePagination.total_pages
                    ) || 0,
            })

            return {
                data: assignments,
                pagination: responsePagination,
            }

        } catch (err) {

            showFeedback({
                type: 'error',
                title: 'Unable to Load Assignments',
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    'Unable to load call assignments.',
            })

        } finally {
            setLoadingAssignments(false)
        }
    }, [
        currentPage,
        pageSize,
        search,
        status,
        rm,
        dateFilter,
        fromDate,
        toDate,
        showFeedback,
    ])

    useEffect(() => {
        loadAssignments({
            page: currentPage,
            pageSize,
            search,
            status,
            rm,
            dateFilter,
            fromDate,
            toDate,
        })
    }, [
        loadAssignments,
        currentPage,
        pageSize,
        search,
        status,
        rm,
        dateFilter,
        fromDate,
        toDate,
    ])

    // =========================================================
    // SERVER PAGINATION
    // =========================================================

    const totalRecords = pagination.total

    const totalPages = Math.max(
        1,
        pagination.totalPages
    )

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    }, [currentPage, totalPages])

    const handlePageChange = (page) => {
        setCurrentPage(
            Math.min(
                Math.max(page, 1),
                totalPages
            )
        )
    }

    const handlePageSizeChange = (size) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {
        setSearch('')
        setStatus('')
        setDateFilter('')
        setRM('')
        setFromDate('')
        setToDate('')
        setCurrentPage(1)
    }

    // =========================================================
    // ASSIGN
    // =========================================================

    const handleAssign = async (
        selectedNumbers,
        selectedRM,
    ) => {

        if (
            !selectedRM ||
            !selectedNumbers?.length
        ) {
            return
        }

        try {
            setLoading(true)

            for (
                const entryId
                of selectedNumbers
            ) {

                const entry =
                    availableNumbers.find(
                        (item) =>
                            item.id === entryId
                    )

                if (!entry) {
                    continue
                }

                await createCallAssignment({
                    phoneNumber:
                        entry.phone_number ||
                        entry.phone,

                    assignedToId:
                        Number(selectedRM),
                })
            }

            if (currentPage === 1) {
                await loadAssignments()
            } else {
                setCurrentPage(1)
            }

            setShowAssignModal(false)

            showFeedback({
                type: 'success',
                title: 'Numbers Assigned',
                message:
                    'The selected call numbers were assigned successfully.',
            })

        } catch (err) {

            showFeedback({
                type: 'error',
                title: 'Unable to Assign Numbers',
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    'Unable to assign call numbers.',
            })

        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // VIEW CALL HISTORY
    // =========================================================

    const handleViewHistory = async (entry) => {

        setSelectedEntry(entry)

        try {
            setLoading(true)

            const phoneNumber =
                entry?.phone ||
                entry?.phone_number ||
                entry?.contact

            if (!phoneNumber) {
                setCallHistory([])
                setShowHistoryModal(true)

                showFeedback({
                    type: 'error',
                    title: 'Call History Unavailable',
                    message:
                        'No phone number is available for this assignment.',
                })

                return
            }

            const response =
                await getCallHistory(
                    phoneNumber
                )

            const history =
                response?.success &&
                    Array.isArray(response.data)
                    ? response.data.map(
                        (call) => {

                            const startedAt =
                                call.call_started_at
                                    ? new Date(
                                        call.call_started_at
                                    )
                                    : null

                            const durationSeconds =
                                Number(
                                    call.duration_seconds ||
                                    0
                                )

                            const minutes =
                                Math.floor(
                                    durationSeconds /
                                    60
                                )

                            const seconds =
                                durationSeconds %
                                60

                            return {
                                ...call,

                                phone:
                                    call.phone_number ||
                                    phoneNumber,

                                type:
                                    call.call_type,

                                status:
                                    call.mobile_status,

                                date:
                                    startedAt
                                        ? startedAt.toLocaleDateString(
                                            'en-IN',
                                            {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            }
                                        )
                                        : '—',

                                time:
                                    startedAt
                                        ? startedAt.toLocaleTimeString(
                                            'en-IN',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            }
                                        )
                                        : '—',

                                duration:
                                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,

                                name:
                                    entry?.assignedToName ||
                                    entry?.name ||
                                    entry?.customerName ||
                                    'Unknown',
                            }
                        }
                    )
                    : []

            setCallHistory(history)
            setShowHistoryModal(true)

        } catch (err) {

            setCallHistory([])

            setShowHistoryModal(true)

            showFeedback({
                type: 'error',
                title: 'Unable to Load Call History',
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    'Unable to load call history.',
            })

        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication = (entry) => {

        if (!entry?.hasApplication) {
            return
        }

        setSelectedEntry(entry)

        setShowApplicationModal(true)
    }

    // =========================================================
    // CREATE LEAD
    // =========================================================

    const handleCreateLead = (entry) => {

        setSelectedEntry(entry)

        setShowCreateLeadModal(true)
    }

    const handleLeadCreated = async (leadData) => {

        try {
            setLoading(true)

            const response =
                await createApplication({
                    name:
                        leadData.name,

                    phone:
                        leadData.phone,

                    gender:
                        leadData.gender,

                    loan_type_id:
                        Number(
                            leadData.loanType
                        ),

                    loan_amount:
                        leadData.loanAmount
                            ? Number(
                                leadData.loanAmount
                            )
                            : null,

                    loan_purpose:
                        leadData.loanPurpose ||
                        null,

                    state_id:
                        leadData.stateId
                            ? Number(
                                leadData.stateId
                            )
                            : null,

                    city_id:
                        leadData.cityId
                            ? Number(
                                leadData.cityId
                            )
                            : null,

                    reference_name:
                        leadData.remarks ||
                        null,
                })

            if (
                response?.existing_loan === true
            ) {

                setExistingLoan({
                    existingLoanData:
                        response.data,

                    originalApplicationData: {
                        name:
                            leadData.name,

                        phone:
                            leadData.phone,

                        loan_type_id:
                            Number(
                                leadData.loanType
                            ),

                        loan_amount:
                            leadData.loanAmount
                                ? Number(
                                    leadData.loanAmount
                                )
                                : null,

                        reference_name:
                            leadData.remarks,
                    },
                })

                return
            }

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    'Unable to create lead.'
                )
            }

            await loadAssignments()

            setShowCreateLeadModal(false)
            setSelectedEntry(null)

            showFeedback({
                type: 'success',
                title: 'Lead Created',
                message:
                    'The lead was created successfully.',
            })

        } catch (err) {

            const detail =
                err?.response?.data?.detail

            const message =
                Array.isArray(detail)
                    ? detail
                        .map(
                            (item) =>
                                item?.msg ||
                                'Validation error'
                        )
                        .join(', ')
                    : detail ||
                    err?.message ||
                    'Unable to create lead.'

            showFeedback({
                type: 'error',
                title: 'Unable to Create Lead',
                message,
            })

        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // EXCHANGE
    // =========================================================

    const handleExchange = (entry) => {

        setSelectedEntry(entry)

        setShowExchangeModal(true)
    }

    const handleExchangeComplete = async () => {

        try {

            setLoading(true)

            await loadAssignments()

            setShowExchangeModal(false)
            setSelectedEntry(null)

            showFeedback({
                type: 'success',
                title: 'Number Exchanged',
                message:
                    'The call number was exchanged successfully.',
            })

        } catch (err) {

            showFeedback({
                type: 'error',
                title: 'Unable to Exchange Number',
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    'Unable to refresh call assignments after exchange.',
            })

        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (entry) => {

        const confirmed =
            window.confirm(
                `Delete ${entry.name || entry.phone}?`
            )

        if (!confirmed) {
            return
        }

        try {

            setLoading(true)

            const response =
                await deleteCallAssignment(
                    entry.id
                )

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    'Failed to delete assignment.'
                )
            }

            await loadAssignments()

            showFeedback({
                type: 'success',
                title: 'Assignment Deleted',
                message:
                    'The call assignment was deleted successfully.',
            })

        } catch (err) {

            showFeedback({
                type: 'error',
                title: 'Unable to Delete Assignment',
                message:
                    err?.response?.data?.detail ||
                    err?.message ||
                    'Unable to delete assignment.',
            })

        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="
            p-4
            sm:p-6
        ">

            {/* =====================================================
                FILTER
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                p-4
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    xl:flex-row
                    xl:items-end
                ">

                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Search
                        </label>

                        <div className="relative">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/35
                            " />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    setSearch(
                                        event.target.value
                                    )
                                    setCurrentPage(1)
                                }}
                                placeholder="Search name, phone or contact..."
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    pl-9
                                "
                            />

                        </div>

                    </div>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="w-full xl:w-44">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) => {
                                setStatus(
                                    event.target.value
                                )
                                setCurrentPage(1)
                            }}
                            className="
                                select
                                select-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        >

                            <option value="">
                                All Status
                            </option>

                            {STATUS_OPTIONS.map(
                                (item) => (

                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item
                                            .charAt(0)
                                            .toUpperCase() +
                                            item.slice(1)}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* =================================================
                        DATE
                    ================================================= */}

                    <div className="w-full xl:w-44">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Date
                        </label>

                        <select
                            value={dateFilter}
                            onChange={(event) => {

                                setDateFilter(
                                    event.target.value
                                )

                                if (
                                    event.target.value !==
                                    'custom'
                                ) {
                                    setFromDate('')
                                    setToDate('')
                                }

                                setCurrentPage(1)

                            }}
                            className="
                                select
                                select-bordered
                                h-10
                                min-h-10
                                w-full
                            "
                        >

                            <option value="">
                                All Dates
                            </option>

                            {DATE_OPTIONS.map(
                                (item) => (

                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* =================================================
                        RM
                    ================================================= */}

                    <RmDropdown
                        value={rm}
                        onChange={(value) => {
                            setRM(value)
                            setCurrentPage(1)
                        }}
                        className="w-full xl:w-48"
                    />

                    {/* =================================================
                        RESET
                    ================================================= */}

                    <button
                        type="button"
                        onClick={handleReset}
                        className="
                            inline-flex
                            h-10
                            shrink-0
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            px-4
                            text-xs
                            font-medium
                            text-base-content/70
                            transition
                            hover:bg-base-200
                        "
                    >

                        <ArrowPathIcon className="
                            h-4
                            w-4
                        " />

                        Reset

                    </button>

                    {/* =================================================
                        ASSIGN
                    ================================================= */}

                    <button
                        type="button"
                        onClick={openAssignModal}
                        disabled={
                            !canAssign ||
                            loadingAvailableNumbers
                        }
                        className="
                            inline-flex
                            h-10
                            shrink-0
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                        "
                    >

                        <PlusIcon className="
                            h-4
                            w-4
                        " />

                        Assign

                    </button>

                </div>

                {/* =================================================
                    CUSTOM DATE
                ================================================= */}

                {dateFilter === 'custom' && (

                    <div className="
                        mt-3
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-base-300
                        pt-3
                        sm:flex-row
                    ">

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                From
                            </label>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(event) => {
                                    setFromDate(
                                        event.target.value
                                    )
                                    setCurrentPage(1)
                                }}
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                "
                            />

                        </div>

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                To
                            </label>

                            <input
                                type="date"
                                value={toDate}
                                min={
                                    fromDate ||
                                    undefined
                                }
                                onChange={(event) =>
                                    {
                                        setToDate(
                                            event.target.value
                                        )
                                        setCurrentPage(1)
                                    }
                                }
                                className="
                                    input
                                    input-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                "
                            />

                        </div>

                    </div>

                )}

            </div>

            {/* =====================================================
                RESULT COUNT
            ===================================================== */}

            <div className="
                flex
                items-center
                justify-between
            ">

                <p className="
                    text-xs
                    font-medium
                    text-base-content/50
                ">
                    {totalRecords}{' '}
                    {totalRecords === 1
                        ? 'number'
                        : 'numbers'}{' '}
                    found
                </p>

            </div>

            {/* =====================================================
                TABLE
            ===================================================== */}

            <CallAssignmentTable
                entries={entries}
                currentPage={currentPage}
                pageSize={pageSize}
                totalRecords={totalRecords}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loadingAssignments}
                onViewHistory={
                    handleViewHistory
                }
                onViewApplication={
                    handleViewApplication
                }
                onCreateLead={
                    handleCreateLead
                }
                onExchange={
                    handleExchange
                }
                onDelete={
                    handleDelete
                }
            />

            <Suspense fallback={null}>
                {/* =====================================================
                    ASSIGN MODAL
                ===================================================== */}

                {showAssignModal && (
                    <AssignNumbersModal
                        open={
                            showAssignModal
                        }

                        entries={
                            availableNumbers
                        }

                        onClose={() =>
                            setShowAssignModal(
                                false
                            )
                        }

                        onAssign={
                            handleAssign
                        }
                    />
                )}

                {/* =====================================================
                    CALL HISTORY
                ===================================================== */}

                {showHistoryModal && (
                    <CallHistoryModal
                        open={
                            showHistoryModal
                        }

                        entry={
                            selectedEntry
                        }

                        history={
                            callHistory
                        }

                        onClose={() => {

                            setShowHistoryModal(
                                false
                            )

                            setSelectedEntry(
                                null
                            )

                        }}
                    />
                )}

                {/* =====================================================
                    LOAN APPLICATION
                ===================================================== */}

                {showApplicationModal && (
                    <LoanApplicationModal
                        open={
                            showApplicationModal
                        }

                        entry={
                            selectedEntry
                        }

                        application={
                            selectedEntry?.application
                        }

                        onClose={() => {

                            setShowApplicationModal(
                                false
                            )

                            setSelectedEntry(
                                null
                            )

                        }}
                    />
                )}

                {/* =====================================================
                    CREATE LEAD
                ===================================================== */}

                {showCreateLeadModal && (
                    <CreateLeadModal
                        open={
                            showCreateLeadModal
                        }

                        entry={
                            selectedEntry
                        }

                        onClose={() => {

                            setShowCreateLeadModal(
                                false
                            )

                            setSelectedEntry(
                                null
                            )

                        }}

                        onCreate={
                            handleLeadCreated
                        }
                    />
                )}

                {/* =====================================================
                    EXCHANGE
                ===================================================== */}

                {showExchangeModal && (
                    <ExchangeNumberModal
                        open={
                            showExchangeModal
                        }

                        entry={
                            selectedEntry
                        }

                        onClose={() => {

                            setShowExchangeModal(
                                false
                            )

                            setSelectedEntry(
                                null
                            )

                        }}

                        onExchange={
                            handleExchangeComplete
                        }
                    />
                )}
            </Suspense>

            {/* =====================================================
                FEEDBACK MODAL
            ===================================================== */}

            <FeedbackModal
                open={
                    feedback.open
                }

                type={
                    feedback.type
                }

                title={
                    feedback.title
                }

                message={
                    feedback.message
                }

                onClose={
                    closeFeedback
                }
            />

            {/* =====================================================
                EXISTING LOAN
            ===================================================== */}

            {existingLoan && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-[1px]
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-label="Existing loan application"
                >

                    <div className="
                        relative
                        max-h-[90vh]
                        w-full
                        max-w-5xl
                        overflow-y-auto
                        rounded-xl
                        bg-base-100
                        shadow-2xl
                    ">

                        <ExistingLoan
                            existingLoanData={
                                existingLoan.existingLoanData
                            }

                            originalApplicationData={
                                existingLoan.originalApplicationData
                            }

                            onCancel={() =>
                                setExistingLoan(
                                    null
                                )
                            }

                            onSubmitSuccess={() =>
                                setExistingLoan(
                                    null
                                )
                            }
                        />

                    </div>

                </div>

            )}

        </div>
    )
}

export default CallAssignment
