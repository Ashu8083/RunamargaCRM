// admin-react/src/pages/CallManagement/CallAssignment/components/AssignNumbersModal.jsx

import { useEffect, useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'


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
    rms = [],
    onClose,
    onAssign,
}) {

    const [selectedRm, setSelectedRm] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const [dateRange, setDateRange] = useState('all')

    const [fromDate, setFromDate] = useState('')

    const [toDate, setToDate] = useState('')

    const [count, setCount] = useState(1)

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

        const list =
            Array.isArray(employees) &&
                employees.length
                ? employees
                : Array.isArray(rms)
                    ? rms
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

    }, [
        employees,
        rms,
    ])


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
    // ASSIGN
    // =========================================================

    const handleAssign = () => {

        if (
            !selectedEmployee ||
            safeCount <= 0
        ) {
            return
        }

        const selectedEntries =
            entries.slice(
                0,
                safeCount
            )


        onAssign?.(
            selectedEntries.map(
                (entry) => entry.id
            ),
            selectedRm,
            {
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
                    selectedEntries,

            }
        )

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

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

                    <RmDropdown
                        label="Agent / RM *"
                        value={selectedRm}
                        onChange={(value, option) => {
                            setSelectedRm(value)
                            setSelectedEmployee(option)
                        }}
                        options={rmList}
                        placeholder="Search agent / RM..."
                        searchPlaceholder="Search agent / RM"
                        emptyMessage="No agents / RMs found"
                        includeAllOption={false}
                        className="mb-6 min-w-0"
                        buttonClassName="h-14 min-h-14 rounded-xl px-4 text-base"
                        getOptionValue={(employee) =>
                            employee.id ??
                            employee.employeeId ??
                            employee.name ??
                            ''
                        }
                    />


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
