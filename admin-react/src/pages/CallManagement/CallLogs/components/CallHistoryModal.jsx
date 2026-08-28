// admin-react/src/pages/CallManagement/CallLogs/components/CallHistoryModal.jsx

import { useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import PhoneArrowDownLeftIcon from '@heroicons/react/24/outline/PhoneArrowDownLeftIcon'
import PhoneArrowUpRightIcon from '@heroicons/react/24/outline/PhoneArrowUpRightIcon'
import PhoneXMarkIcon from '@heroicons/react/24/outline/PhoneXMarkIcon'


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


    const selectedOption =
        options.find(
            (option) =>
                option.value === value
        )


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
                    text-xs
                    text-base-content
                    transition
                    hover:border-base-content/20
                "
            >

                <span className="
                    truncate
                ">
                    {
                        selectedOption?.label ||
                        placeholder
                    }
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
                            z-[110]
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
                        z-[120]
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
                            max-h-48
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
// FORMAT CALL TYPE
// =============================================================

const formatCallType = (
    type
) => {

    const normalized =
        String(type || '')
            .trim()
            .toLowerCase()


    if (normalized === 'incoming') {
        return 'Incoming'
    }


    if (normalized === 'outgoing') {
        return 'Outgoing'
    }


    if (normalized === 'missed') {
        return 'Missed'
    }


    return 'Unknown'

}


// =============================================================
// CALL TYPE ICON
// =============================================================

const CallTypeIcon = ({
    type,
}) => {

    const normalized =
        String(type || '')
            .trim()
            .toLowerCase()


    if (normalized === 'incoming') {

        return (
            <PhoneArrowDownLeftIcon className="
                h-4
                w-4
                text-[#6FA800]
            " />
        )

    }


    if (normalized === 'outgoing') {

        return (
            <PhoneArrowUpRightIcon className="
                h-4
                w-4
                text-blue-500
            " />
        )

    }


    if (normalized === 'missed') {

        return (
            <PhoneXMarkIcon className="
                h-4
                w-4
                text-red-500
            " />
        )

    }


    return (
        <PhoneIcon className="
            h-4
            w-4
            text-base-content/40
        " />
    )

}


// =============================================================
// CALL TYPE CLASSES
// =============================================================

const getCallTypeClasses = (
    type
) => {

    const normalized =
        String(type || '')
            .trim()
            .toLowerCase()


    if (normalized === 'incoming') {

        return [
            'border-[#8BCF00]/30',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalized === 'outgoing') {

        return [
            'border-blue-200',
            'bg-blue-50',
            'text-blue-600',
        ].join(' ')

    }


    if (normalized === 'missed') {

        return [
            'border-red-200',
            'bg-red-50',
            'text-red-600',
        ].join(' ')

    }


    return [
        'border-base-300',
        'bg-base-200',
        'text-base-content/50',
    ].join(' ')

}


// =============================================================
// FORMAT STATUS
// =============================================================

const formatStatus = (
    status
) => {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalized === 'received') {
        return 'Received'
    }


    if (normalized === 'missed') {
        return 'Missed'
    }


    if (normalized === 'rejected') {
        return 'Rejected'
    }


    return 'Unknown'

}


// =============================================================
// STATUS CLASSES
// =============================================================

const getStatusClasses = (
    status
) => {

    const normalized =
        String(status || '')
            .trim()
            .toLowerCase()


    if (normalized === 'received') {

        return [
            'border-[#8BCF00]/30',
            'bg-[#8BCF00]/10',
            'text-[#6FA800]',
        ].join(' ')

    }


    if (normalized === 'missed') {

        return [
            'border-amber-300',
            'bg-amber-50',
            'text-amber-600',
        ].join(' ')

    }


    if (normalized === 'rejected') {

        return [
            'border-red-200',
            'bg-red-50',
            'text-red-600',
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
    call = null,
    history = [],
    onClose,
}) {

    // =========================================================
    // FILTERS
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [mobileStatus, setMobileStatus] =
        useState('')


    const [callType, setCallType] =
        useState('')


    const [selectedDate, setSelectedDate] =
        useState('')


    // =========================================================
    // FILTER HISTORY
    // =========================================================

    const filteredHistory =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()


            return history.filter(
                (item) => {

                    // -----------------------------------------
                    // SEARCH
                    // -----------------------------------------

                    if (searchValue) {

                        const values = [

                            item.name,

                            item.phone,

                            item.callType,

                            item.status,

                            item.callDate,

                            item.callTime,

                            item.duration,

                        ]


                        const matches =
                            values.some(
                                (value) =>
                                    value !== null &&
                                    value !== undefined &&
                                    String(value)
                                        .toLowerCase()
                                        .includes(
                                            searchValue
                                        )
                            )


                        if (!matches) {
                            return false
                        }

                    }


                    // -----------------------------------------
                    // MOBILE STATUS
                    // -----------------------------------------

                    if (
                        mobileStatus &&
                        item.status !== mobileStatus
                    ) {

                        return false

                    }


                    // -----------------------------------------
                    // CALL TYPE
                    // -----------------------------------------

                    if (
                        callType &&
                        item.callType !== callType
                    ) {

                        return false

                    }


                    // -----------------------------------------
                    // DATE
                    // -----------------------------------------

                    if (
                        selectedDate &&
                        item.callDate !== selectedDate
                    ) {

                        return false

                    }


                    return true

                }
            )

        }, [
            history,
            search,
            mobileStatus,
            callType,
            selectedDate,
        ])


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setMobileStatus('')

        setCallType('')

        setSelectedDate('')

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
                bg-black/40
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    onClose?.()

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
                ">

                    <div className="
                        min-w-0
                    ">

                        <h2 className="
                            truncate
                            text-base
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
                            gap-x-2
                            gap-y-1
                        ">

                            <span className="
                                text-sm
                                font-medium
                                text-base-content/80
                            ">
                                {
                                    call?.name ||
                                    'Unknown'
                                }
                            </span>


                            <span className="
                                text-xs
                                text-base-content/30
                            ">
                                •
                            </span>


                            <span className="
                                text-xs
                                text-base-content/50
                            ">
                                {
                                    call?.phone ||
                                    '—'
                                }
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        title="Close"
                        className="
                            ml-3
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
                    p-4
                ">

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-5
                    ">


                        {/* SEARCH */}

                        <div className="
                            min-w-0
                            lg:col-span-2
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
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
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
                                        text-xs
                                    "
                                />

                            </div>

                        </div>


                        {/* MOBILE STATUS */}

                        <SearchableDropdown
                            label="Mobile Status"
                            value={
                                mobileStatus
                            }
                            options={
                                MOBILE_STATUSES
                            }
                            placeholder="All Statuses"
                            onChange={
                                setMobileStatus
                            }
                        />


                        {/* CALL TYPE */}

                        <SearchableDropdown
                            label="Call Type"
                            value={
                                callType
                            }
                            options={
                                CALL_TYPES
                            }
                            placeholder="All Call Types"
                            onChange={
                                setCallType
                            }
                        />


                        {/* DATE */}

                        <div>

                            <label className="
                                mb-1.5
                                block
                                text-xs
                                font-medium
                                text-base-content/60
                            ">
                                Date
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
                                        selectedDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSelectedDate(
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

                    </div>


                    {/* FILTER FOOTER */}

                    <div className="
                        mt-3
                        flex
                        items-center
                        justify-between
                    ">

                        <p className="
                            text-xs
                            text-base-content/40
                        ">

                            {
                                filteredHistory.length
                            }{' '}

                            {
                                filteredHistory.length === 1
                                    ? 'call'
                                    : 'calls'
                            }{' '}

                            found

                        </p>


                        <button
                            type="button"
                            onClick={
                                handleReset
                            }
                            className="
                                text-xs
                                font-medium
                                text-base-content/55
                                transition
                                hover:text-[#6FA800]
                            "
                        >
                            Reset Filters
                        </button>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    p-4
                ">

                    {filteredHistory.length ? (

                        <div className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-base-300
                        ">

                            <div className="
                                w-full
                                overflow-x-auto
                            ">

                                <table className="
                                    w-full
                                    min-w-[750px]
                                    border-collapse
                                ">

                                    {/* HEADER */}

                                    <thead>

                                        <tr className="
                                            border-b
                                            border-base-300
                                            bg-base-200/40
                                        ">

                                            <th className="
                                                px-4
                                                py-3.5
                                                text-left
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                Name
                                            </th>


                                            <th className="
                                                px-4
                                                py-3.5
                                                text-left
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                Call Type
                                            </th>


                                            <th className="
                                                px-4
                                                py-3.5
                                                text-left
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                Call Date
                                            </th>


                                            <th className="
                                                px-4
                                                py-3.5
                                                text-left
                                                text-xs
                                                font-semibold
                                                text-base-content/70
                                            ">
                                                Duration
                                            </th>


                                            <th className="
                                                px-4
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


                                    {/* BODY */}

                                    <tbody>

                                        {filteredHistory.map(
                                            (item, index) => {

                                                return (

                                                    <tr
                                                        key={
                                                            item.id ??
                                                            index
                                                        }
                                                        className="
                                                            border-b
                                                            border-base-300
                                                            last:border-b-0
                                                            transition-colors
                                                            hover:bg-base-200/30
                                                        "
                                                    >

                                                        {/* NAME */}

                                                        <td className="
                                                            px-4
                                                            py-4
                                                        ">

                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-base-content
                                                                ">
                                                                    {
                                                                        item.name ||
                                                                        call?.name ||
                                                                        'Unknown'
                                                                    }
                                                                </p>


                                                                <p className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-base-content/45
                                                                ">
                                                                    {
                                                                        item.phone ||
                                                                        call?.phone ||
                                                                        '—'
                                                                    }
                                                                </p>

                                                            </div>

                                                        </td>


                                                        {/* CALL TYPE */}

                                                        <td className="
                                                            px-4
                                                            py-4
                                                        ">

                                                            <span className={[
                                                                'inline-flex',
                                                                'items-center',
                                                                'gap-1.5',
                                                                'rounded-full',
                                                                'border',
                                                                'px-2.5',
                                                                'py-1.5',
                                                                'text-xs',
                                                                'font-medium',
                                                                getCallTypeClasses(
                                                                    item.callType
                                                                ),
                                                            ].join(' ')}>

                                                                <CallTypeIcon
                                                                    type={
                                                                        item.callType
                                                                    }
                                                                />

                                                                {
                                                                    formatCallType(
                                                                        item.callType
                                                                    )
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* DATE */}

                                                        <td className="
                                                            whitespace-nowrap
                                                            px-4
                                                            py-4
                                                        ">

                                                            <div>

                                                                <p className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-base-content
                                                                ">
                                                                    {
                                                                        item.callDate ||
                                                                        '—'
                                                                    }
                                                                </p>


                                                                <p className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-base-content/45
                                                                ">
                                                                    {
                                                                        item.callTime ||
                                                                        '—'
                                                                    }
                                                                </p>

                                                            </div>

                                                        </td>


                                                        {/* DURATION */}

                                                        <td className="
                                                            whitespace-nowrap
                                                            px-4
                                                            py-4
                                                        ">

                                                            <span className="
                                                                font-mono
                                                                text-sm
                                                                text-base-content/70
                                                            ">
                                                                {
                                                                    item.duration ||
                                                                    '00:00'
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="
                                                            px-4
                                                            py-4
                                                        ">

                                                            <span className={[
                                                                'inline-flex',
                                                                'rounded-full',
                                                                'border',
                                                                'px-2.5',
                                                                'py-1.5',
                                                                'text-xs',
                                                                'font-medium',
                                                                getStatusClasses(
                                                                    item.status
                                                                ),
                                                            ].join(' ')}>

                                                                {
                                                                    formatStatus(
                                                                        item.status
                                                                    )
                                                                }

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    ) : (

                        <div className="
                            flex
                            min-h-[260px]
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-base-300
                            text-center
                        ">

                            <div className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-base-200
                            ">

                                <PhoneIcon className="
                                    h-6
                                    w-6
                                    text-base-content/25
                                " />

                            </div>


                            <p className="
                                mt-4
                                text-sm
                                font-semibold
                                text-base-content/70
                            ">
                                No call history found
                            </p>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/40
                            ">
                                Try changing your filters.
                            </p>

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-end
                    border-t
                    border-base-300
                    px-5
                    py-3
                ">

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
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
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#8BCF00]/30
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