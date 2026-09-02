// admin-react/src/pages/CallManagement/CallAssignment/index.jsx

import { useEffect, useMemo, useState } from 'react'

import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

import RmDropdown from '../../../components/GlobalModels/Filters/RmDropdown'

import AssignNumbersModal from './components/AssignNumbersModal'
import CallAssignmentTable from './components/CallAssignmentTable'
import CallHistoryModal from './components/CallHistoryModal'
import CreateLeadModal from './components/CreateLeadModal'
import LoanApplicationModal from './components/LoanApplicationModal'
import ExchangeNumberModal from './components/ExchangeNumberModal'


// =============================================================
// MOCK RM DATA
// =============================================================

const RM_OPTIONS = [
    {
        id: 'RM001',
        name: 'Aravind Kumar',
    },
    {
        id: 'RM002',
        name: 'Priya Sharma',
    },
    {
        id: 'RM003',
        name: 'Suresh Kumar',
    },
    {
        id: 'RM004',
        name: 'Nayana Rao',
    },
    {
        id: 'RM005',
        name: 'Manoj Rao',
    },
]


// =============================================================
// MOCK ASSIGNMENT DATA
// =============================================================

const INITIAL_ENTRIES = [
    {
        id: 1,
        phone: '+91 98765 43210',
        contact: '+91 98765 43210',
        name: 'Rahul Sharma',

        assignedBy: 'Admin',
        assignedTo: 'RM001',
        assignedToName: 'Aravind Kumar',

        assignedDate: '2026-08-25',

        status: 'pending',

        attempts: 3,

        lastCalled: '2026-08-26 04:35 PM',

        callStatus: 'Missed',

        hasApplication: true,

        application: {
            name: 'Rahul Sharma',
            rm: 'Aravind Kumar',
            agent: 'Priya Agent',
            appliedDate: '2026-08-26',
            assignedDate: '2026-08-25',
            callStatus: 'Missed',
            attempts: 3,
            lastCalled: '2026-08-26 04:35 PM',
        },
    },

    {
        id: 2,
        phone: '+91 99887 66554',
        contact: '+91 99887 66554',
        name: 'Sneha Reddy',

        assignedBy: 'Admin',
        assignedTo: 'RM002',
        assignedToName: 'Priya Sharma',

        assignedDate: '2026-08-24',

        status: 'assigned',

        attempts: 2,

        lastCalled: '2026-08-26 11:20 AM',

        callStatus: 'Missed',

        hasApplication: false,

        application: null,
    },

    {
        id: 3,
        phone: '+91 91234 56789',
        contact: '+91 91234 56789',
        name: 'Kiran Kumar',

        assignedBy: 'Admin',
        assignedTo: 'RM003',
        assignedToName: 'Suresh Kumar',

        assignedDate: '2026-08-22',

        status: 'pending',

        attempts: 5,

        lastCalled: '2026-08-27 10:05 AM',

        callStatus: 'Missed',

        hasApplication: true,

        application: {
            name: 'Kiran Kumar',
            rm: 'Suresh Kumar',
            agent: 'Arun Agent',
            appliedDate: '2026-08-27',
            assignedDate: '2026-08-22',
            callStatus: 'Missed',
            attempts: 5,
            lastCalled: '2026-08-27 10:05 AM',
        },
    },

    {
        id: 4,
        phone: '+91 93456 78901',
        contact: '+91 93456 78901',
        name: 'Meena Joshi',

        assignedBy: 'Admin',
        assignedTo: 'RM004',
        assignedToName: 'Nayana Rao',

        assignedDate: '2026-08-20',

        status: 'contacted',

        attempts: 4,

        lastCalled: '2026-08-27 02:10 PM',

        callStatus: 'Missed',

        hasApplication: false,

        application: null,
    },

    {
        id: 5,
        phone: '+91 87654 32109',
        contact: '+91 87654 32109',
        name: 'Vikram Singh',

        assignedBy: 'Admin',
        assignedTo: 'RM005',
        assignedToName: 'Manoj Rao',

        assignedDate: '2026-08-18',

        status: 'pending',

        attempts: 1,

        lastCalled: '2026-08-25 09:45 AM',

        callStatus: 'Missed',

        hasApplication: false,

        application: null,
    },

    {
        id: 6,
        phone: '+91 90909 80808',
        contact: '+91 90909 80808',
        name: 'Anjali Rao',

        assignedBy: 'Admin',
        assignedTo: '',

        assignedToName: '',

        assignedDate: '',

        status: 'unassigned',

        attempts: 0,

        lastCalled: '',

        callStatus: 'Missed',

        hasApplication: false,

        application: null,
    },
]


// =============================================================
// MOCK CALL HISTORY
// =============================================================

const MOCK_CALL_HISTORY = [

    {
        id: 1,
        type: 'incoming',
        date: '2026-08-27',
        time: '10:35 AM',
        duration: '00:00',
        status: 'missed',
    },

    {
        id: 2,
        type: 'outgoing',
        date: '2026-08-26',
        time: '04:35 PM',
        duration: '00:00',
        status: 'missed',
    },

    {
        id: 3,
        type: 'outgoing',
        date: '2026-08-25',
        time: '03:20 PM',
        duration: '00:00',
        status: 'rejected',
    },

    {
        id: 4,
        type: 'incoming',
        date: '2026-08-24',
        time: '01:15 PM',
        duration: '04:32',
        status: 'received',
    },

]


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


// =============================================================
// MOCK API
// =============================================================

const fetchAssignments = async () => {

    return new Promise(
        (resolve) => {

            setTimeout(
                () =>
                    resolve(
                        INITIAL_ENTRIES
                    ),
                400
            )

        }
    )

}


// =============================================================
// COMPONENT
// =============================================================

function CallAssignment() {

    // =========================================================
    // DATA
    // =========================================================

    const [entries, setEntries] =
        useState([])


    const [loading, setLoading] =
        useState(true)


    const [error, setError] =
        useState('')


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


    const [showAssignModal, setShowAssignModal] =
        useState(false)


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
    // LOAD DATA
    // =========================================================

    const loadAssignments = async () => {

        try {

            setLoading(true)

            setError('')


            const response =
                await fetchAssignments()


            setEntries(
                Array.isArray(response)
                    ? response
                    : []
            )

        } catch (err) {

            setError(
                err?.message ||
                'Unable to load call assignments.'
            )

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

    const handleAssign = (selectedNumbers, selectedRM) => {

        if (!selectedRM) {
            return
        }


        setEntries(
            (previous) =>
                previous.map(
                    (entry) => {

                        if (
                            !selectedNumbers.includes(
                                entry.id
                            )
                        ) {
                            return entry
                        }


                        const rmData =
                            RM_OPTIONS.find(
                                (item) =>
                                    item.id ===
                                    selectedRM
                            )


                        return {
                            ...entry,

                            assignedTo:
                                selectedRM,

                            assignedToName:
                                rmData?.name ||
                                '',

                            assignedDate:
                                new Date()
                                    .toISOString()
                                    .slice(0, 10),

                            status:
                                'assigned',
                        }

                    }
                )
        )


        setShowAssignModal(false)

    }


    // =========================================================
    // VIEW CALL HISTORY
    // =========================================================

    const handleViewHistory = (entry) => {

        setSelectedEntry(entry)

        setCallHistory(
            MOCK_CALL_HISTORY
        )

        setShowHistoryModal(true)

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


    const handleLeadCreated = (leadData) => {

        console.log(
            'Lead created:',
            leadData
        )

    }


    // =========================================================
    // EXCHANGE
    // =========================================================

    const handleExchange = (entry) => {

        setSelectedEntry(entry)

        setShowExchangeModal(true)

    }


    const handleExchangeComplete = (
        updatedEntry
    ) => {

        setEntries(
            (previous) =>
                previous.map(
                    (entry) =>
                        entry.id ===
                        updatedEntry.id
                            ? {
                                ...entry,
                                ...updatedEntry,
                                status:
                                    'assigned',
                            }
                            : entry
                )
        )

    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (entry) => {

        const confirmed =
            window.confirm(
                `Delete ${entry.name || entry.phone}?`
            )


        if (!confirmed) {
            return
        }


        setEntries(
            (previous) =>
                previous.filter(
                    (item) =>
                        item.id !== entry.id
                )
        )

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (
        error &&
        !loading
    ) {

        return (

            <div className="
                p-4
                sm:p-6
            ">

                <div className="
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    p-8
                    text-center
                    shadow-sm
                ">

                    <p className="
                        text-sm
                        font-semibold
                    ">
                        Unable to load call assignments
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={loadAssignments}
                        className="
                            mt-4
                            h-9
                            rounded-lg
                            bg-[#8BCF00]
                            px-4
                            text-xs
                            font-medium
                            text-white
                        "
                    >
                        Try Again
                    </button>

                </div>

            </div>

        )

    }


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
                        options={RM_OPTIONS}
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
                        onClick={() =>
                            setShowAssignModal(true)
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
                                min={fromDate || undefined}
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
                    entries.filter(
                        (entry) =>
                            !entry.assignedTo
                    )
                }
                rms={
                    RM_OPTIONS
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

        </div>

    )

}


export default CallAssignment
