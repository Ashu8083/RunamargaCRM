// admin-react/src/pages/CallManagement/CallAssignment/components/CallHistoryModal.jsx

import { useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'


// =============================================================
// MOCK CALL HISTORY
// =============================================================

const MOCK_HISTORY = [
    {
        id: 1,
        name: 'Ramesh Kumar',
        phone: '+91 99450 41729',
        type: 'incoming',
        date: '27 Aug 2026',
        time: '10:42 AM',
        duration: '00:32',
        status: 'received',
    },
    {
        id: 2,
        name: 'Ramesh Kumar',
        phone: '+91 99450 41729',
        type: 'outgoing',
        date: '27 Aug 2026',
        time: '11:15 AM',
        duration: '01:48',
        status: 'received',
    },
    {
        id: 3,
        name: 'Ramesh Kumar',
        phone: '+91 99450 41729',
        type: 'outgoing',
        date: '26 Aug 2026',
        time: '04:20 PM',
        duration: '00:00',
        status: 'missed',
    },
    {
        id: 4,
        name: 'Ramesh Kumar',
        phone: '+91 99450 41729',
        type: 'incoming',
        date: '25 Aug 2026',
        time: '09:35 AM',
        duration: '02:14',
        status: 'received',
    },
    {
        id: 5,
        name: 'Ramesh Kumar',
        phone: '+91 99450 41729',
        type: 'outgoing',
        date: '24 Aug 2026',
        time: '03:12 PM',
        duration: '00:00',
        status: 'rejected',
    },
]


// =============================================================
// FORMATTERS
// =============================================================

const formatType = (type) => {

    const value =
        String(type || '').toLowerCase()

    if (value === 'incoming') {
        return 'Incoming'
    }

    if (value === 'outgoing') {
        return 'Outgoing'
    }

    if (value === 'missed') {
        return 'Missed'
    }

    return '—'
}


const formatStatus = (status) => {

    const value =
        String(status || '').toLowerCase()

    if (value === 'received') {
        return 'Received'
    }

    if (value === 'missed') {
        return 'Missed'
    }

    if (value === 'rejected') {
        return 'Rejected'
    }

    return '—'
}


// =============================================================
// STATUS STYLE
// =============================================================

const getStatusClass = (status) => {

    const value =
        String(status || '').toLowerCase()

    if (value === 'received') {

        return [
            'border-[#8BCF00]/40',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }

    if (value === 'missed') {

        return [
            'border-red-300',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }

    if (value === 'rejected') {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }

    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// CALL HISTORY MODAL
// =============================================================

function CallHistoryModal({
    open = false,
    entry = null,
    history = MOCK_HISTORY,
    onClose,
}) {

    const [search, setSearch] = useState('')

    const [status, setStatus] = useState('all')

    const [type, setType] = useState('all')


    // =========================================================
    // SELECTED PERSON
    // =========================================================

    const callerName =
        entry?.name ||
        history?.[0]?.name ||
        'Unknown'


    const callerPhone =
        entry?.phone ||
        entry?.contact ||
        entry?.number ||
        history?.[0]?.phone ||
        '—'


    // =========================================================
    // FILTER HISTORY
    // =========================================================

    const filteredHistory = useMemo(() => {

        const records =
            Array.isArray(history)
                ? history
                : []

        const searchValue =
            search
                .trim()
                .toLowerCase()

        return records.filter((call) => {

            const matchesSearch =
                !searchValue ||
                [
                    call.name,
                    call.phone,
                    call.date,
                    call.time,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchValue)
                    )


            const matchesStatus =
                status === 'all' ||
                String(call.status || '')
                    .toLowerCase() === status


            const matchesType =
                type === 'all' ||
                String(call.type || '')
                    .toLowerCase() === type


            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            )

        })

    }, [
        history,
        search,
        status,
        type,
    ])


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const handleReset = () => {

        setSearch('')
        setStatus('all')
        setType('all')

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        handleReset()
        onClose?.()

    }


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/45
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose()
                }

            }}
        >

            <div className="
                flex
                max-h-[92vh]
                w-full
                max-w-5xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-base-300
                bg-base-100
                shadow-2xl
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                    sm:px-6
                ">

                    <div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-base-content
                        ">
                            Call History
                        </h2>


                        <div className="
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">

                            <span className="
                                text-sm
                                font-medium
                                text-base-content/80
                            ">
                                {callerName}
                            </span>


                            <span className="
                                text-xs
                                text-base-content/40
                            ">
                                •
                            </span>


                            <span className="
                                font-mono
                                text-xs
                                text-base-content/50
                            ">
                                {callerPhone}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="
                    shrink-0
                    border-b
                    border-base-300
                    bg-base-100
                    px-5
                    py-4
                    sm:px-6
                ">

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-[minmax(220px,1fr)_180px_180px_auto]
                    ">

                        {/* SEARCH */}

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
                                placeholder="Search call history..."
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


                        {/* STATUS */}

                        <label className="
                            relative
                        ">

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
                                    appearance-none
                                    pr-9
                                    text-sm
                                "
                            >

                                <option value="all">
                                    All Mobile Status
                                </option>

                                <option value="received">
                                    Received
                                </option>

                                <option value="missed">
                                    Missed
                                </option>

                                <option value="rejected">
                                    Rejected
                                </option>

                            </select>


                            <ChevronDownIcon className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/40
                            " />

                        </label>


                        {/* CALL TYPE */}

                        <label className="
                            relative
                        ">

                            <select
                                value={type}
                                onChange={(event) =>
                                    setType(
                                        event.target.value
                                    )
                                }
                                className="
                                    select
                                    select-bordered
                                    h-10
                                    min-h-10
                                    w-full
                                    appearance-none
                                    pr-9
                                    text-sm
                                "
                            >

                                <option value="all">
                                    All Call Types
                                </option>

                                <option value="incoming">
                                    Incoming
                                </option>

                                <option value="outgoing">
                                    Outgoing
                                </option>

                                <option value="missed">
                                    Missed
                                </option>

                            </select>


                            <ChevronDownIcon className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-base-content/40
                            " />

                        </label>


                        {/* RESET */}

                        <button
                            type="button"
                            onClick={handleReset}
                            className="
                                h-10
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
                                hover:text-base-content
                            "
                        >
                            Reset
                        </button>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-auto
                ">

                    <table className="
                        w-full
                        min-w-[760px]
                        border-collapse
                    ">

                        <thead>

                            <tr className="
                                sticky
                                top-0
                                z-10
                                border-b
                                border-base-300
                                bg-base-200/60
                            ">

                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                ">
                                    Name
                                </th>


                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                ">
                                    Call Type
                                </th>


                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                ">
                                    Call Date
                                </th>


                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                ">
                                    Duration
                                </th>


                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                ">
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredHistory.length ? (

                                filteredHistory.map(
                                    (call, index) => (

                                        <tr
                                            key={
                                                call.id ??
                                                index
                                            }
                                            className="
                                                border-b
                                                border-base-300
                                                last:border-b-0
                                                transition
                                                hover:bg-base-200/30
                                            "
                                        >

                                            {/* NAME */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                    text-base-content
                                                ">
                                                    {
                                                        call.name ||
                                                        callerName
                                                    }
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    font-mono
                                                    text-[11px]
                                                    text-base-content/40
                                                ">
                                                    {
                                                        call.phone ||
                                                        callerPhone
                                                    }
                                                </p>

                                            </td>


                                            {/* TYPE */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        formatType(
                                                            call.type
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <p className="
                                                    text-sm
                                                    text-base-content/80
                                                ">
                                                    {
                                                        call.date ||
                                                        '—'
                                                    }
                                                </p>


                                                {call.time && (

                                                    <p className="
                                                        mt-0.5
                                                        text-xs
                                                        text-base-content/40
                                                    ">
                                                        {
                                                            call.time
                                                        }
                                                    </p>

                                                )}

                                            </td>


                                            {/* DURATION */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span className="
                                                    font-mono
                                                    text-sm
                                                    text-base-content/70
                                                ">
                                                    {
                                                        call.duration ||
                                                        '00:00'
                                                    }
                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td className="
                                                px-5
                                                py-4
                                            ">

                                                <span
                                                    className={[
                                                        'inline-flex',
                                                        'rounded-full',
                                                        'border',
                                                        'px-2.5',
                                                        'py-1',
                                                        'text-xs',
                                                        'font-medium',
                                                        getStatusClass(
                                                            call.status
                                                        ),
                                                    ].join(' ')}
                                                >
                                                    {
                                                        formatStatus(
                                                            call.status
                                                        )
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="
                                            px-5
                                            py-12
                                            text-center
                                        "
                                    >

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-base-content/60
                                        ">
                                            No call history found
                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-base-content/40
                                        ">
                                            Try changing the filters.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-t
                    border-base-300
                    px-5
                    py-3
                    sm:px-6
                ">

                    <p className="
                        text-xs
                        text-base-content/40
                    ">
                        {filteredHistory.length} call(s) found
                    </p>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            h-9
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
                        Close
                    </button>

                </div>

            </div>

        </div>

    )

}


export default CallHistoryModal