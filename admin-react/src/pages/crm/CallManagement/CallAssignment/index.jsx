// admin-react/src/pages/CallManagement/CallAssignment/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import ExistingLoan from '../../Loans/CreateApplication/components/ExistingLoan'
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'
import AssignNumbersModal from './components/AssignNumbersModal'
import CallAssignmentTable from './components/CallAssignmentTable'
import CallHistoryModal from './components/CallHistoryModal'
import CreateLeadModal from './components/CreateLeadModal'
import LoanApplicationModal from './components/LoanApplicationModal'
import ExchangeNumberModal from './components/ExchangeNumberModal'
import {    
    getCallAssignments,
    getAvailableCallNumbers,
    createCallAssignment,
    getCallHistory,
    createApplication,
    deleteCallAssignment,
} from './Api'

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
// DATE HELPERS
// =============================================================

const parseDate = (value) => {
    if (!value) {
        return null
    }

    const date =
        new Date(
            value.includes(' ')
                ? value.replace(' ', 'T')
                : value
        )

    return Number.isNaN(
        date.getTime()
    )
        ? null
        : date
}

const startOfDay = (date) => {
    const result =
        new Date(date)

    result.setHours(
        0,
        0,
        0,
        0
    )

    return result
}

const endOfDay = (date) => {
    const result =
        new Date(date)

    result.setHours(
        23,
        59,
        59,
        999
    )

    return result
}

const getDateRange = (value) => {
    const today =
        startOfDay(
            new Date()
        )

    if (value === 'today') {
        return {
            from: today,
            to: endOfDay(today),
        }
    }

    if (value === 'yesterday') {
        const yesterday =
            new Date(today)

        yesterday.setDate(
            yesterday.getDate() - 1
        )

        return {
            from: yesterday,
            to: endOfDay(yesterday),
        }
    }

    if (value === 'this-week') {
        const from =
            new Date(today)

        const day =
            from.getDay()

        const difference =
            day === 0
                ? 6
                : day - 1

        from.setDate(
            from.getDate() -
            difference
        )

        return {
            from,
            to: endOfDay(today),
        }
    }

    if (value === 'last-week') {
        const from =
            new Date(today)

        const day =
            from.getDay()

        const difference =
            day === 0
                ? 6
                : day - 1

        from.setDate(
            from.getDate() -
            difference -
            7
        )

        const to =
            new Date(from)

        to.setDate(
            to.getDate() + 6
        )

        return {
            from,
            to: endOfDay(to),
        }
    }

    if (value === 'this-month') {
        return {
            from: new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            ),
            to: endOfDay(today),
        }
    }

    if (value === 'last-month') {
        const from =
            new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            )

        const to =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            )

        return {
            from,
            to: endOfDay(to),
        }
    }

    return null
}

const fetchAssignments = async () => {
    const response = await getCallAssignments()

    return response?.success &&
        Array.isArray(response.data)
        ? response.data
        : []
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

    const [loading, setLoading] =
        useState(true)

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

    const showFeedback = ({
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
    }

    // =========================================================
    // LOAD AVAILABLE NUMBERS
    // =========================================================

    const openAssignModal = async () => {
        try {
            setLoading(true)

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
            setLoading(false)
        }
    }

    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadAssignments = async () => {
        try {
            setLoading(true)

            const assignments =
                await fetchAssignments()

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
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAssignments()
    }, [])

    // =========================================================
    // FILTER DATA
    // =========================================================

    const filteredEntries =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()

            let result =
                entries

            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            if (searchValue) {
                result =
                    result.filter(
                        (entry) => {

                            const values = [
                                entry.name,
                                entry.phone,
                                entry.contact,
                                entry.assignedToName,
                            ]

                            return values.some(
                                (value) =>
                                    String(
                                        value || ''
                                    )
                                        .toLowerCase()
                                        .includes(
                                            searchValue
                                        )
                            )
                        }
                    )
            }

            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            if (status) {
                result =
                    result.filter(
                        (entry) =>
                            String(
                                entry.status ||
                                ''
                            ).toLowerCase() ===
                            status.toLowerCase()
                    )
            }

            // -------------------------------------------------
            // RM
            // -------------------------------------------------

            if (rm) {
                result =
                    result.filter(
                        (entry) =>
                            entry.assignedTo === rm
                    )
            }

            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            if (
                dateFilter &&
                dateFilter !== 'custom'
            ) {

                const range =
                    getDateRange(
                        dateFilter
                    )

                if (range) {
                    result =
                        result.filter(
                            (entry) => {

                                const date =
                                    parseDate(
                                        entry.assignedDate
                                    )

                                if (!date) {
                                    return false
                                }

                                return (
                                    date >=
                                    range.from &&
                                    date <=
                                    range.to
                                )
                            }
                        )
                }
            }

            // -------------------------------------------------
            // CUSTOM DATE
            // -------------------------------------------------

            if (
                dateFilter === 'custom' &&
                (fromDate || toDate)
            ) {

                const from =
                    fromDate
                        ? startOfDay(
                            new Date(fromDate)
                        )
                        : null

                const to =
                    toDate
                        ? endOfDay(
                            new Date(toDate)
                        )
                        : null

                result =
                    result.filter(
                        (entry) => {

                            const date =
                                parseDate(
                                    entry.assignedDate
                                )

                            if (!date) {
                                return false
                            }

                            if (
                                from &&
                                date < from
                            ) {
                                return false
                            }

                            if (
                                to &&
                                date > to
                            ) {
                                return false
                            }

                            return true
                        }
                    )
            }

            return result

        }, [
            entries,
            search,
            status,
            rm,
            dateFilter,
            fromDate,
            toDate,
        ])

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

            await loadAssignments()

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

            const response =
                await getCallAssignments()

            if (
                !response?.success ||
                !Array.isArray(
                    response.data
                )
            ) {
                throw new Error(
                    response?.message ||
                    'Unable to refresh call assignments.'
                )
            }

            const assignments =
                response.data

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
                            assignment.attempts ??
                            0,

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

            setEntries(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !== entry.id
                    )
            )

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
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
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
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
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
                        onChange={setRM}
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
                                onChange={(event) =>
                                    setFromDate(
                                        event.target.value
                                    )
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
                                    setToDate(
                                        event.target.value
                                    )
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
                    {filteredEntries.length}{' '}
                    {filteredEntries.length === 1
                        ? 'number'
                        : 'numbers'}{' '}
                    found
                </p>

            </div>

            {/* =====================================================
                TABLE
            ===================================================== */}

            <CallAssignmentTable
                entries={filteredEntries}
                loading={loading}
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

            {/* =====================================================
                ASSIGN MODAL
            ===================================================== */}

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

            {/* =====================================================
                CALL HISTORY
            ===================================================== */}

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

            {/* =====================================================
                LOAN APPLICATION
            ===================================================== */}

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

            {/* =====================================================
                CREATE LEAD
            ===================================================== */}

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

            {/* =====================================================
                EXCHANGE
            ===================================================== */}

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