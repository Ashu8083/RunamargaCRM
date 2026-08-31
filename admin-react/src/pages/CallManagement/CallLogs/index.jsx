// admin-react/src/pages/CallManagement/CallLogs/index.jsx

import { useMemo, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import RmDropdown from '../../../components/GlobalModels/Filters/RmDropdown'

import CallLogsTable from './components/CallLogsTable'
import CallHistoryModal from './components/CallHistoryModal'


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
// MOCK CALL LOGS
// =============================================================

const INITIAL_CALL_LOGS = [

    {
        id: 'CALL001',

        name: 'Rahul Kumar',

        phone: '+91 98765 43210',

        contactNumber: '+91 98765 43210',

        agentId: 'AG001',

        agentName: 'Aravind Kumar',

        callType: 'incoming',

        status: 'received',

        date: '2026-08-27',

        time: '10:42 AM',

        duration: '04:32',

    },


    {
        id: 'CALL002',

        name: 'Sneha Reddy',

        phone: '+91 99887 66554',

        contactNumber: '+91 99887 66554',

        agentId: 'AG002',

        agentName: 'Suresh Kumar',

        callType: 'outgoing',

        status: 'received',

        date: '2026-08-27',

        time: '10:15 AM',

        duration: '07:18',

    },


    {
        id: 'CALL003',

        name: 'Vijay Sharma',

        phone: '+91 98761 23456',

        contactNumber: '+91 98761 23456',

        agentId: 'AG001',

        agentName: 'Aravind Kumar',

        callType: 'missed',

        status: 'missed',

        date: '2026-08-27',

        time: '09:48 AM',

        duration: '00:00',

    },


    {
        id: 'CALL004',

        name: 'Anjali Nair',

        phone: '+91 91234 56789',

        contactNumber: '+91 91234 56789',

        agentId: 'AG003',

        agentName: 'Nayana Rao',

        callType: 'outgoing',

        status: 'rejected',

        date: '2026-08-26',

        time: '05:36 PM',

        duration: '00:12',

    },


    {
        id: 'CALL005',

        name: 'Manoj Verma',

        phone: '+91 90123 45678',

        contactNumber: '+91 90123 45678',

        agentId: 'AG002',

        agentName: 'Suresh Kumar',

        callType: 'incoming',

        status: 'received',

        date: '2026-08-26',

        time: '04:22 PM',

        duration: '11:05',

    },


    {
        id: 'CALL006',

        name: 'Pooja Banu',

        phone: '+91 93456 78901',

        contactNumber: '+91 93456 78901',

        agentId: 'AG003',

        agentName: 'Nayana Rao',

        callType: 'outgoing',

        status: 'received',

        date: '2026-08-26',

        time: '03:14 PM',

        duration: '05:46',

    },


    {
        id: 'CALL007',

        name: 'Kiran Gowda',

        phone: '+91 99876 54321',

        contactNumber: '+91 99876 54321',

        agentId: 'AG001',

        agentName: 'Aravind Kumar',

        callType: 'missed',

        status: 'missed',

        date: '2026-08-25',

        time: '02:58 PM',

        duration: '00:00',

    },


    {
        id: 'CALL008',

        name: 'Divya Menon',

        phone: '+91 97654 32109',

        contactNumber: '+91 97654 32109',

        agentId: 'AG002',

        agentName: 'Suresh Kumar',

        callType: 'incoming',

        status: 'received',

        date: '2026-08-25',

        time: '11:26 AM',

        duration: '08:21',

    },


    {
        id: 'CALL009',

        name: 'Ramesh Kumar',

        phone: '+91 91234 67890',

        contactNumber: '+91 91234 67890',

        agentId: 'AG003',

        agentName: 'Nayana Rao',

        callType: 'outgoing',

        status: 'received',

        date: '2026-08-24',

        time: '04:46 PM',

        duration: '03:52',

    },


    {
        id: 'CALL010',

        name: 'Meena Joshi',

        phone: '+91 90909 12345',

        contactNumber: '+91 90909 12345',

        agentId: 'AG001',

        agentName: 'Aravind Kumar',

        callType: 'incoming',

        status: 'received',

        date: '2026-08-23',

        time: '01:18 PM',

        duration: '06:14',

    },

]


// =============================================================
// MOCK CALL HISTORY
// =============================================================

const generateCallHistory = (call) => {

    const histories = [

        {
            id: 1,
            name: call.name,
            phone: call.phone,
            callType: 'incoming',
            callDate: '2026-08-27',
            callTime: '10:42 AM',
            duration: '04:32',
            status: 'received',
        },

        {
            id: 2,
            name: call.name,
            phone: call.phone,
            callType: 'outgoing',
            callDate: '2026-08-26',
            callTime: '04:15 PM',
            duration: '07:18',
            status: 'received',
        },

        {
            id: 3,
            name: call.name,
            phone: call.phone,
            callType: 'missed',
            callDate: '2026-08-25',
            callTime: '02:58 PM',
            duration: '00:00',
            status: 'missed',
        },

        {
            id: 4,
            name: call.name,
            phone: call.phone,
            callType: 'outgoing',
            callDate: '2026-08-23',
            callTime: '11:35 AM',
            duration: '03:44',
            status: 'received',
        },

    ]


    return histories

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

                        {/* SEARCH */}

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


                        {/* OPTIONS */}

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

                                                setSearchValue('')

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
        useState(
            INITIAL_CALL_LOGS
        )


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
    // AGENT OPTIONS
    // =========================================================

    const agentOptions =
        useMemo(() => {

            const uniqueAgents =
                Array.from(
                    new Map(
                        callLogs.map(
                            (call) => [
                                call.agentId,
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
                        call.agentId !== agent
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

        setCallLogs(
            [...INITIAL_CALL_LOGS]
        )

    }


    // =========================================================
    // VIEW HISTORY
    // =========================================================

    const handleViewHistory = (
        call
    ) => {

        setSelectedCall(
            call
        )

        setCallHistory(
            generateCallHistory(
                call
            )
        )

        setShowHistoryModal(
            true
        )

    }


    // =========================================================
    // CLOSE HISTORY
    // =========================================================

    const handleCloseHistory = () => {

        setShowHistoryModal(
            false
        )

        setSelectedCall(
            null
        )

        setCallHistory([])

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
                        "
                    >

                        <ArrowPathIcon className="
                            h-4
                            w-4
                        " />

                        Refresh

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
