// admin-react/src/pages/CallManagement/CallAssignment/components/AssignNumbersModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'


// =============================================================
// DATE RANGE OPTIONS
// =============================================================

const DATE_RANGES = [
    { value: 'all', label: 'All Data' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' },
]


// =============================================================
// MODAL
// =============================================================

function AssignNumbersModal({
    open = false,
    entries = [],
    employees = [],
    onClose,
    onAssign,
}) {

    const [selectedRm, setSelectedRm] = useState('')

    const [dateRange, setDateRange] = useState('all')

    const [fromDate, setFromDate] = useState('')

    const [toDate, setToDate] = useState('')

    const [count, setCount] = useState(1)

    const [rmSearch, setRmSearch] = useState('')

    const [showRmDropdown, setShowRmDropdown] = useState(false)

    const [showDateDropdown, setShowDateDropdown] = useState(false)


    // =========================================================
    // AVAILABLE NUMBERS
    // =========================================================

    const availableCount = useMemo(() => {

        if (Array.isArray(entries)) {
            return entries.length
        }

        return 0

    }, [entries])


    // =========================================================
    // EMPLOYEE / RM LIST
    // =========================================================

    const rmList = useMemo(() => {

        const list = Array.isArray(employees)
            ? employees
            : []

        return list.filter((employee) => {

            const role =
                String(employee.role || '')
                    .toLowerCase()

            return (
                role === 'rm' ||
                role === 'relationship manager' ||
                !role
            )

        })

    }, [employees])


    const filteredRms = useMemo(() => {

        const value =
            rmSearch
                .trim()
                .toLowerCase()

        if (!value) {
            return rmList
        }

        return rmList.filter((employee) => {

            return [
                employee.name,
                employee.email,
                employee.employeeId,
                employee.id,
            ]
                .filter(Boolean)
                .some((field) =>
                    String(field)
                        .toLowerCase()
                        .includes(value)
                )

        })

    }, [rmList, rmSearch])


    // =========================================================
    // RESET WHEN OPENING
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }

        setSelectedRm('')
        setDateRange('all')
        setFromDate('')
        setToDate('')
        setCount(
            availableCount > 0
                ? 1
                : 0
        )
        setRmSearch('')
        setShowRmDropdown(false)
        setShowDateDropdown(false)

    }, [
        open,
        availableCount,
    ])


    // =========================================================
    // COUNT
    // =========================================================

    const safeCount =
        Math.min(
            Math.max(
                Number(count) || 0,
                0
            ),
            availableCount
        )


    const exceedsAvailable =
        Number(count) > availableCount


    // =========================================================
    // SELECT RM
    // =========================================================

    const handleSelectRm = (employee) => {

        setSelectedRm(
            employee.id ??
            employee.employeeId ??
            employee.name
        )

        setRmSearch(
            employee.name || ''
        )

        setShowRmDropdown(false)

    }


    // =========================================================
    // SELECT DATE RANGE
    // =========================================================

    const handleSelectDateRange = (value) => {

        setDateRange(value)

        setShowDateDropdown(false)

        if (value !== 'custom') {

            setFromDate('')
            setToDate('')

        }

    }


    // =========================================================
    // SELECTED RM
    // =========================================================

    const selectedEmployee =
        rmList.find((employee) => {

            const id =
                employee.id ??
                employee.employeeId ??
                employee.name

            return String(id) === String(selectedRm)

        }) || null


    // =========================================================
    // ASSIGN
    // =========================================================

    const handleAssign = () => {

        if (
            !selectedEmployee ||
            safeCount <= 0
        ) {
            return
        }

        onAssign?.({

            rm:
                selectedEmployee,

            rmId:
                selectedRm,

            dateRange,

            fromDate:
                dateRange === 'custom'
                    ? fromDate
                    : null,

            toDate:
                dateRange === 'custom'
                    ? toDate
                    : null,

            count:
                safeCount,

            entries:
                entries.slice(
                    0,
                    safeCount
                ),

        })

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setShowRmDropdown(false)
        setShowDateDropdown(false)

        onClose?.()

    }


    // =========================================================
    // VALIDATION
    // =========================================================

    const customRangeValid =
        dateRange !== 'custom' ||
        (
            Boolean(fromDate) &&
            Boolean(toDate)
        )


    const canAssign =
        Boolean(selectedEmployee) &&
        safeCount > 0 &&
        customRangeValid


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
                max-w-xl
                flex-col
                overflow-hidden
                rounded-2xl
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
                    px-7
                    py-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <h2 className="
                            text-2xl
                            font-semibold
                            text-base-content
                        ">
                            Assign Numbers
                        </h2>


                        <span className="
                            rounded-full
                            bg-[#8BCF00]
                            px-3
                            py-1.5
                            text-sm
                            font-medium
                            text-base-content
                        ">
                            {availableCount} Available
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-base-300
                            text-base-content/50
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="
                            h-6
                            w-6
                        " />

                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    min-h-0
                    overflow-y-auto
                    px-7
                    pb-6
                ">

                    {/* AVAILABLE MESSAGE */}

                    <div className="
                        mb-7
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        bg-sky-50
                        px-5
                        py-5
                        text-sky-700
                    ">

                        <ExclamationTriangleIcon className="
                            h-7
                            w-7
                            shrink-0
                            text-sky-600
                        " />

                        <p className="
                            text-base
                            font-medium
                        ">
                            {availableCount} missed call(s)
                            available for assignment
                        </p>

                    </div>


                    {/* =================================================
                        RM
                    ================================================= */}

                    <div className="relative mb-6">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            Agent / RM *
                        </label>


                        <div className="relative">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-4
                                top-1/2
                                z-10
                                h-5
                                w-5
                                -translate-y-1/2
                                text-base-content/40
                            " />


                            <input
                                type="text"
                                value={rmSearch}
                                onChange={(event) => {

                                    setRmSearch(
                                        event.target.value
                                    )

                                    setSelectedRm('')

                                    setShowRmDropdown(true)

                                }}
                                onFocus={() =>
                                    setShowRmDropdown(true)
                                }
                                placeholder="Search agent / RM..."
                                className="
                                    input
                                    input-bordered
                                    h-14
                                    min-h-14
                                    w-full
                                    pl-12
                                    pr-12
                                    text-base
                                "
                            />


                            <ChevronDownIcon className="
                                pointer-events-none
                                absolute
                                right-4
                                top-1/2
                                h-5
                                w-5
                                -translate-y-1/2
                                text-base-content/50
                            " />

                        </div>


                        {showRmDropdown && (

                            <div className="
                                absolute
                                left-0
                                right-0
                                top-[88px]
                                z-30
                                max-h-52
                                overflow-y-auto
                                rounded-xl
                                border
                                border-base-300
                                bg-base-100
                                shadow-xl
                            ">

                                {filteredRms.length ? (

                                    filteredRms.map(
                                        (employee) => {

                                            const employeeId =
                                                employee.id ??
                                                employee.employeeId ??
                                                employee.name

                                            return (

                                                <button
                                                    key={
                                                        employeeId
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectRm(
                                                            employee
                                                        )
                                                    }
                                                    className="
                                                        block
                                                        w-full
                                                        px-4
                                                        py-3
                                                        text-left
                                                        transition
                                                        hover:bg-base-200
                                                    "
                                                >

                                                    <p className="
                                                        text-sm
                                                        font-medium
                                                        text-base-content
                                                    ">
                                                        {
                                                            employee.name ||
                                                            'Unnamed'
                                                        }
                                                    </p>


                                                    {employee.email && (

                                                        <p className="
                                                            mt-0.5
                                                            text-xs
                                                            text-base-content/45
                                                        ">
                                                            {
                                                                employee.email
                                                            }
                                                        </p>

                                                    )}

                                                </button>

                                            )

                                        }
                                    )

                                ) : (

                                    <p className="
                                        px-4
                                        py-4
                                        text-sm
                                        text-base-content/45
                                    ">
                                        No agents / RMs found
                                    </p>

                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        DATE RANGE
                    ================================================= */}

                    <div className="mb-6">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            Data Range
                        </label>


                        <div className="relative">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDateDropdown(
                                        (value) => !value
                                    )
                                }
                                className="
                                    flex
                                    h-14
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-4
                                    text-left
                                    text-base
                                    text-base-content
                                    transition
                                    hover:border-[#8BCF00]
                                "
                            >

                                <span>
                                    {
                                        DATE_RANGES.find(
                                            (item) =>
                                                item.value ===
                                                dateRange
                                        )?.label ||
                                        'All Data'
                                    }
                                </span>


                                <ChevronDownIcon className="
                                    h-5
                                    w-5
                                    text-base-content/50
                                " />

                            </button>


                            {showDateDropdown && (

                                <div className="
                                    absolute
                                    left-0
                                    right-0
                                    top-[62px]
                                    z-20
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    shadow-xl
                                ">

                                    {DATE_RANGES.map(
                                        (item) => (

                                            <button
                                                key={
                                                    item.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSelectDateRange(
                                                        item.value
                                                    )
                                                }
                                                className={[
                                                    'block',
                                                    'w-full',
                                                    'px-5',
                                                    'py-3',
                                                    'text-left',
                                                    'text-sm',
                                                    'transition',
                                                    dateRange ===
                                                    item.value
                                                        ? 'bg-[#8BCF00]/10 text-[#6FA800]'
                                                        : 'text-base-content hover:bg-base-200',
                                                ].join(' ')}
                                            >
                                                {item.label}
                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        <p className="
                            mt-2
                            px-2
                            text-sm
                            text-base-content/50
                        ">
                            Filter calls by date range
                        </p>

                    </div>


                    {/* =================================================
                        CUSTOM RANGE
                    ================================================= */}

                    {dateRange === 'custom' && (

                        <div className="
                            mb-6
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        ">

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-base-content/70
                                ">
                                    From Date
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
                                        h-12
                                        min-h-12
                                        w-full
                                    "
                                />

                            </div>


                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-base-content/70
                                ">
                                    To Date
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
                                        h-12
                                        min-h-12
                                        w-full
                                    "
                                />

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        COUNT
                    ================================================= */}

                    <div className="mb-5">

                        <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            Count
                        </label>


                        <input
                            type="number"
                            min="1"
                            max={
                                availableCount || 1
                            }
                            value={count}
                            onChange={(event) =>
                                setCount(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="
                                input
                                input-bordered
                                h-14
                                min-h-14
                                w-full
                                text-base
                            "
                        />


                        <p className="
                            mt-2
                            px-2
                            text-sm
                            text-base-content/50
                        ">
                            Enter number of missed calls
                            to assign.
                        </p>

                    </div>


                    {/* =================================================
                        EXCEEDS AVAILABLE
                    ================================================= */}

                    {exceedsAvailable && (

                        <div className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-amber-50
                            px-5
                            py-4
                            text-amber-700
                        ">

                            <ExclamationTriangleIcon className="
                                h-6
                                w-6
                                shrink-0
                            " />


                            <p className="
                                text-sm
                                font-medium
                            ">
                                Count exceeds available numbers.
                                Only {availableCount} numbers
                                will be assigned.
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
                    gap-3
                    border-t
                    border-base-300
                    px-7
                    py-4
                ">

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            h-11
                            rounded-lg
                            px-5
                            text-sm
                            font-medium
                            text-base-content
                            transition
                            hover:bg-base-200
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        disabled={!canAssign}
                        onClick={handleAssign}
                        className="
                            inline-flex
                            h-11
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#8BCF00]
                            px-5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            disabled:cursor-not-allowed
                            disabled:bg-base-300
                            disabled:text-base-content/35
                        "
                    >

                        {canAssign && (

                            <CheckCircleIcon className="
                                h-5
                                w-5
                            " />

                        )}

                        Assign

                    </button>

                </div>

            </div>

        </div>

    )

}


export default AssignNumbersModal