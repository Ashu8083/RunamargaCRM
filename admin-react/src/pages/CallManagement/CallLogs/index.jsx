// admin-react/src/pages/CallManagement/CallLogs/index.jsx

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import RmDropdown from '../../../components/GlobalModels/Filters/RmDropdown'

import CallLogsTable from './components/CallLogsTable'
import CallHistoryModal from './components/CallHistoryModal'

import {
    getCallLogs,
    getCallHistory,
} from './Api'


// =============================================================
// CALL TYPES
// =============================================================

const CALL_TYPES = [
    {
        value: '',
        label: 'All Call Types',
    },
    {
        value: 'incoming',
        label: 'Incoming',
    },
    {
        value: 'outgoing',
        label: 'Outgoing',
    },
    {
        value: 'missed',
        label: 'Missed',
    },
]


// =============================================================
// MOBILE STATUS
// =============================================================

const MOBILE_STATUSES = [
    {
        value: '',
        label: 'All Statuses',
    },
    {
        value: 'received',
        label: 'Received',
    },
    {
        value: 'missed',
        label: 'Missed',
    },
    {
        value: 'rejected',
        label: 'Rejected',
    },
]


// =============================================================
// HELPERS
// =============================================================

const formatDuration = (seconds) => {
    if (
        seconds === null ||
        seconds === undefined ||
        seconds === ''
    ) {
        return '00:00'
    }

    const totalSeconds = Number(seconds)

    if (Number.isNaN(totalSeconds)) {
        return '00:00'
    }

    const hours = Math.floor(
        totalSeconds / 3600
    )

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    )

    const remainingSeconds =
        totalSeconds % 60

    if (hours > 0) {
        return [
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(remainingSeconds).padStart(2, '0'),
        ].join(':')
    }

    return [
        String(minutes).padStart(2, '0'),
        String(remainingSeconds).padStart(2, '0'),
    ].join(':')
}


const formatDate = (value) => {
    if (!value) {
        return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-')
}


const formatTime = (value) => {
    if (!value) {
        return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return date.toLocaleTimeString(
        'en-IN',
        {
            hour: '2-digit',
            minute: '2-digit',
        }
    )
}


// =============================================================
// SEARCHABLE DROPDOWN
// =============================================================

function SearchableDropdown({
    label,
    value,
    options = [],
    placeholder = 'Select',
    onChange,
}) {
    const [open, setOpen] =
        useState(false)

    const [searchValue, setSearchValue] =
        useState('')

    const filteredOptions =
        useMemo(() => {
            const search =
                searchValue
                    .trim()
                    .toLowerCase()

            if (!search) {
                return options
            }

            return options.filter(
                (option) =>
                    String(option.label)
                        .toLowerCase()
                        .includes(search)
            )
        }, [
            options,
            searchValue,
        ])

    const selectedOption =
        options.find(
            (option) =>
                option.value === value
        )

    const displayValue =
        selectedOption?.label ||
        placeholder

    return (
        <div className="
            relative
            min-w-0
        ">

            <label className="
                mb-1.5
                block
                text-xs
                font-medium
                text-base-content/60
            ">
                {label}
            </label>

            <button
                type="button"
                onClick={() => {
                    setOpen(
                        (previous) =>
                            !previous
                    )

                    setSearchValue('')
                }}
                className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-3
                    text-left
                    text-sm
                    text-base-content
                    transition
                    hover:border-base-content/20
                "
            >

                <span className="
                    truncate
                ">
                    {displayValue}
                </span>

                <ChevronDownIcon className="
                    h-4
                    w-4
                    shrink-0
                    text-base-content/40
                " />

            </button>

            {open && (
                <>

                    <div
                        className="
                            fixed
                            inset-0
                            z-40
                        "
                        onClick={() =>
                            setOpen(false)
                        }
                    />

                    <div className="
                        absolute
                        left-0
                        right-0
                        top-[calc(100%+4px)]
                        z-50
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

                            <div className="
                                relative
                            ">

                                <MagnifyingGlassIcon className="
                                    pointer-events-none
                                    absolute
                                    left-2.5
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-base-content/35
                                " />

                                <input
                                    autoFocus
                                    type="text"
                                    value={
                                        searchValue
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchValue(
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        `Search ${label.toLowerCase()}...`
                                    }
                                    className="
                                        h-9
                                        w-full
                                        rounded-lg
                                        border
                                        border-base-300
                                        bg-base-100
                                        pl-8
                                        pr-2
                                        text-xs
                                        outline-none
                                        focus:border-[#8BCF00]
                                    "
                                />

                            </div>

                        </div>

                        <div className="
                            max-h-52
                            overflow-y-auto
                            p-1
                        ">

                            {filteredOptions.length ? (

                                filteredOptions.map(
                                    (option) => (

                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            onClick={() => {

                                                onChange(
                                                    option.value
                                                )

                                                setOpen(
                                                    false
                                                )

                                                setSearchValue(
                                                    ''
                                                )

                                            }}
                                            className={[
                                                'flex',
                                                'w-full',
                                                'items-center',
                                                'rounded-lg',
                                                'px-3',
                                                'py-2',
                                                'text-left',
                                                'text-xs',
                                                'transition',
                                                option.value === value
                                                    ? 'bg-[#8BCF00]/10 text-[#6FA800]'
                                                    : 'text-base-content/70 hover:bg-base-200',
                                            ].join(' ')}
                                        >
                                            {
                                                option.label
                                            }
                                        </button>

                                    )
                                )

                            ) : (

                                <div className="
                                    px-3
                                    py-4
                                    text-center
                                    text-xs
                                    text-base-content/40
                                ">
                                    No results found
                                </div>

                            )}

                        </div>

                    </div>

                </>
            )}

        </div>
    )
}


// =============================================================
// MAIN COMPONENT
// =============================================================

function CallLogs() {

    // =========================================================
    // DATA
    // =========================================================

    const [callLogs, setCallLogs] =
        useState([])

    const [loading, setLoading] =
        useState(false)


    // =========================================================
    // FILTERS
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [agent, setAgent] =
        useState('')

    const [callType, setCallType] =
        useState('')

    const [mobileStatus, setMobileStatus] =
        useState('')

    const [fromDate, setFromDate] =
        useState('')

    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // MODAL
    // =========================================================

    const [showHistoryModal, setShowHistoryModal] =
        useState(false)

    const [selectedCall, setSelectedCall] =
        useState(null)

    const [callHistory, setCallHistory] =
        useState([])


    // =========================================================
    // FETCH CALL LOGS
    // =========================================================

    const fetchCallLogs = async () => {
        try {
            setLoading(true)

            const response =
                await getCallLogs()

            console.log(
                'CALL LOGS RESPONSE:',
                response
            )

            const backendLogs =
                response?.data || []

            const formattedLogs =
                backendLogs.map(
                    (call) => {

                        const startedAt =
                            call.call_started_at

                        return {
                            ...call,

                            // Existing table/filter fields
                            id: call.id,

                            name:
                                call.employee_name ||
                                call.name ||
                                'Unknown',

                            phone:
                                call.phone_number ||
                                '',

                            contactNumber:
                                call.phone_number ||
                                '',

                            agentId:
                                call.employee_id,

                            agentName:
                                call.employee_name ||
                                call.name ||
                                `Employee ${call.employee_id}`,

                            callType:
                                call.call_type ||
                                '',

                            status:
                                call.mobile_status ||
                                '',

                            date:
                                formatDate(
                                    startedAt
                                ),

                            time:
                                formatTime(
                                    startedAt
                                ),

                            duration:
                                formatDuration(
                                    call.duration_seconds
                                ),
                        }
                    }
                )

            setCallLogs(
                formattedLogs
            )

        } catch (error) {

            console.error(
                'CALL LOGS FETCH ERROR:',
                error
            )

            setCallLogs([])

        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchCallLogs()
    }, [])


    // =========================================================
    // AGENT OPTIONS
    // =========================================================

    const agentOptions =
        useMemo(() => {

            const uniqueAgents =
                Array.from(
                    new Map(
                        callLogs.map(
                            (call) => [
                                String(
                                    call.agentId
                                ),
                                call.agentName,
                            ]
                        )
                    ).entries()
                )

            return [
                {
                    value: '',
                    label: 'All Agents',
                },

                ...uniqueAgents.map(
                    ([value, label]) => ({
                        value,
                        label,
                    })
                ),
            ]

        }, [
            callLogs,
        ])


    // =========================================================
    // FILTERED CALL LOGS
    // =========================================================

    const filteredCallLogs =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()

            return callLogs.filter(
                (call) => {

                    // ---------------------------------------------
                    // SEARCH
                    // ---------------------------------------------

                    if (searchValue) {

                        const searchableValues = [

                            call.id,

                            call.name,

                            call.phone,

                            call.contactNumber,

                            call.agentName,

                            call.callType,

                            call.status,

                            call.date,

                            call.time,

                            call.duration,

                        ]

                        const matchesSearch =
                            searchableValues.some(
                                (value) =>
                                    value !== null &&
                                    value !== undefined &&
                                    String(value)
                                        .toLowerCase()
                                        .includes(
                                            searchValue
                                        )
                            )

                        if (!matchesSearch) {
                            return false
                        }

                    }


                    // ---------------------------------------------
                    // AGENT
                    // ---------------------------------------------

                    if (
                        agent &&
                        String(
                            call.agentId
                        ) !== String(agent)
                    ) {
                        return false
                    }


                    // ---------------------------------------------
                    // CALL TYPE
                    // ---------------------------------------------

                    if (
                        callType &&
                        call.callType !== callType
                    ) {
                        return false
                    }


                    // ---------------------------------------------
                    // MOBILE STATUS
                    // ---------------------------------------------

                    if (
                        mobileStatus &&
                        call.status !== mobileStatus
                    ) {
                        return false
                    }


                    // ---------------------------------------------
                    // FROM DATE
                    // ---------------------------------------------

                    if (
                        fromDate &&
                        call.date < fromDate
                    ) {
                        return false
                    }


                    // ---------------------------------------------
                    // TO DATE
                    // ---------------------------------------------

                    if (
                        toDate &&
                        call.date > toDate
                    ) {
                        return false
                    }


                    return true

                }
            )

        }, [
            callLogs,
            search,
            agent,
            callType,
            mobileStatus,
            fromDate,
            toDate,
        ])


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch('')
        setAgent('')
        setCallType('')
        setMobileStatus('')
        setFromDate('')
        setToDate('')

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {
        fetchCallLogs()
    }


    // =========================================================
    // VIEW HISTORY
    // =========================================================

    const handleViewHistory = async (
        call
    ) => {

        try {

            setSelectedCall(call)

            setShowHistoryModal(
                true
            )

            setCallHistory([])

            const response =
                await getCallHistory(
                    call.phone_number ||
                    call.phone
                )

            console.log(
                'CALL HISTORY RESPONSE:',
                response
            )

            const backendHistory =
                response?.data || []

            const formattedHistory =
                backendHistory.map(
                    (item) => {

                        const startedAt =
                            item.call_started_at

                        return {
                            id: item.id,

                            name:
                                item.employee_name ||
                                item.name ||
                                call.name ||
                                'Unknown',

                            phone:
                                item.phone_number ||
                                call.phone ||
                                '',

                            callType:
                                item.call_type ||
                                '',

                            callDate:
                                formatDate(
                                    startedAt
                                ),

                            callTime:
                                formatTime(
                                    startedAt
                                ),

                            duration:
                                formatDuration(
                                    item.duration_seconds
                                ),

                            status:
                                item.mobile_status ||
                                '',
                        }
                    }
                )

            setCallHistory(
                formattedHistory
            )

        } catch (error) {

            console.error(
                'CALL HISTORY FETCH ERROR:',
                error
            )

            setCallHistory([])

        }

    }


    // =========================================================
    // CLOSE HISTORY
    // =========================================================

    const handleCloseHistory = () => {

        setShowHistoryModal(false)

        setSelectedCall(null)

        setCallHistory([])

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
                    grid
                    grid-cols-1
                    gap-3
                    p-4
                    md:grid-cols-2
                    xl:grid-cols-4
                    2xl:grid-cols-5
                ">

                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="
                        min-w-0
                        xl:col-span-2
                        2xl:col-span-2
                    ">

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Search
                        </label>

                        <div className="
                            relative
                        ">

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
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search ID, name, phone or agent..."
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
                        AGENT
                    ================================================= */}

                    <RmDropdown
                        label="Select RM"
                        value={agent}
                        options={agentOptions}
                        onChange={setAgent}
                        className="min-w-0"
                    />


                    {/* =================================================
                        CALL TYPE
                    ================================================= */}

                    <SearchableDropdown
                        label="Call Type"
                        value={callType}
                        options={CALL_TYPES}
                        placeholder="All Call Types"
                        onChange={setCallType}
                    />


                    {/* =================================================
                        MOBILE STATUS
                    ================================================= */}

                    <SearchableDropdown
                        label="Mobile Status"
                        value={mobileStatus}
                        options={
                            MOBILE_STATUSES
                        }
                        placeholder="All Statuses"
                        onChange={
                            setMobileStatus
                        }
                    />


                    {/* =================================================
                        FROM DATE
                    ================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            From Date
                        </label>

                        <div className="
                            relative
                        ">

                            <CalendarDaysIcon className="
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
                                type="date"
                                value={
                                    fromDate
                                }
                                onChange={(
                                    event
                                ) =>
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
                                    pl-9
                                    text-xs
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        TO DATE
                    ================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            To Date
                        </label>

                        <div className="
                            relative
                        ">

                            <CalendarDaysIcon className="
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
                                type="date"
                                value={
                                    toDate
                                }
                                min={
                                    fromDate ||
                                    undefined
                                }
                                onChange={(
                                    event
                                ) =>
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
                                    pl-9
                                    text-xs
                                "
                            />

                        </div>

                    </div>


                    {/* =================================================
                        RESET
                    ================================================= */}

                    <div className="
                        flex
                        items-end
                    ">

                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            className="
                                inline-flex
                                h-10
                                w-full
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
                                text-base-content/65
                                transition
                                hover:bg-base-200
                                hover:text-base-content
                            "
                        >

                            <ArrowPathIcon className="
                                h-4
                                w-4
                            " />

                            Reset

                        </button>

                    </div>

                </div>


                {/* =====================================================
                    RESULT COUNT / REFRESH
                ===================================================== */}

                <div className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-base-300
                    px-4
                    py-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <p className="
                        text-xs
                        text-base-content/45
                    ">

                        {filteredCallLogs.length}{' '}

                        {filteredCallLogs.length === 1
                            ? 'call'
                            : 'calls'}{' '}

                        found

                    </p>

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                        disabled={loading}
                        className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            border
                            border-base-300
                            bg-base-100
                            px-3.5
                            text-xs
                            font-medium
                            text-base-content/65
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <ArrowPathIcon className="
                            h-4
                            w-4
                        " />

                        {loading
                            ? 'Refreshing...'
                            : 'Refresh'}

                    </button>

                </div>

            </div>


            {/* =====================================================
                CALL LOG TABLE
            ===================================================== */}

            <CallLogsTable
                entries={
                    filteredCallLogs
                }
                onView={
                    handleViewHistory
                }
            />


            {/* =====================================================
                CALL HISTORY MODAL
            ===================================================== */}

            <CallHistoryModal
                open={
                    showHistoryModal
                }
                call={
                    selectedCall
                }
                history={
                    callHistory
                }
                onClose={
                    handleCloseHistory
                }
            />

        </div>

    )
}


export default CallLogs