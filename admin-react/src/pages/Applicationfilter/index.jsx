// admin-react/src/pages/Applicationfilter/index.jsx

import { useEffect, useMemo, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'

import AgentDropdown from '../../components/GlobalModels/Filters/AgentDropdown'
import LoanTypeDropdown from '../../components/GlobalModels/Filters/LoanTypeDropdown'
import RmDropdown from '../../components/GlobalModels/Filters/RmDropdown'

import ApplicationFilterTable from './components/ApplicationFilterTable'
import ApplicationDisbursementModal from './components/ApplicationDisbursementModal'

import { getApplicationFilter } from './Api'
import { getActiveContext } from '../../app/auth'

// =============================================================
// STATUS
// =============================================================

const STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'inprocess', label: 'In Process' },
    { value: 'login', label: 'Login' },
    { value: 'sanctioned', label: 'Sanctioned' },
    { value: 'disbursed', label: 'Disbursed' },
    { value: 'rejected', label: 'Rejected' },
]


// =============================================================
// MONTHS
// =============================================================

const MONTHS = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
]


// =============================================================
// YEARS
// =============================================================

const YEARS = [
    { value: '', label: 'All Years' },
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
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

    const [open, setOpen] = useState(false)

    const [search, setSearch] = useState('')


    const filteredOptions =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()


            if (!searchValue) {
                return options
            }


            return options.filter(
                (option) =>
                    String(option.label)
                        .toLowerCase()
                        .includes(searchValue)
            )

        }, [
            options,
            search,
        ])


    const selectedOption =
        options.find(
            (option) =>
                String(option.value) === String(value)
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

                    setSearch('')

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
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder={`Search ${label.toLowerCase()}...`}
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
                                            key={option.value}
                                            type="button"
                                            onClick={() => {

                                                onChange(
                                                    option.value
                                                )

                                                setOpen(false)

                                                setSearch('')

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
                                                String(option.value) === String(value)
                                                    ? 'bg-[#8BCF00]/10 text-[#6FA800]'
                                                    : 'text-base-content/70 hover:bg-base-200',
                                            ].join(' ')}
                                        >
                                            {option.label}
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

function ApplicationFilter() {

    const activeContext = getActiveContext()
    const contextId = activeContext?.id

    // =========================================================
    // DATA
    // =========================================================

    const [applications, setApplications] =
        useState([])

    const [loading, setLoading] =
        useState(false)

    const [total, setTotal] =
        useState(0)


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [agent, setAgent] =
        useState('')


    const [rm, setRm] =
        useState('')


    const [loanType, setLoanType] =
        useState('')


    const [status, setStatus] =
        useState('')


    const [month, setMonth] =
        useState('')


    const [year, setYear] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)

    const [rowsPerPage, setRowsPerPage] =
        useState(20)


    // =========================================================
    // MODAL
    // =========================================================

    const [showModal, setShowModal] =
        useState(false)


    const [selectedApplication, setSelectedApplication] =
        useState(null)


    // =========================================================
    // FILTER OPTIONS
    // =========================================================

    /*
     * These are intentionally kept compatible with the existing
     * dropdown components.
     *
     * If these options are already supplied elsewhere in your
     * actual file/project, keep those values instead.
     */

    const [agentOptions, setAgentOptions] =
        useState([])

    const [rmOptions, setRmOptions] =
        useState([])

    const [loanTypeOptions, setLoanTypeOptions] =
        useState([])


    // =========================================================
    // FETCH APPLICATIONS
    // =========================================================

    const fetchApplications = async () => {

        try {

            setLoading(true)


            const params = {

                search:
                    search.trim() ||
                    undefined,

                agent_context_id:
                    agent ||
                    undefined,

                rm_context_id:
                    rm ||
                    undefined,

                loan_type_id:
                    loanType ||
                    undefined,

                status:
                    status ||
                    undefined,

                month:
                    month ||
                    undefined,

                year:
                    year ||
                    undefined,

                from_date:
                    fromDate ||
                    undefined,

                to_date:
                    toDate ||
                    undefined,

                page:
                    currentPage,

                limit:
                    rowsPerPage,

            }


            const data =
                await getApplicationFilter(
                    params
                )


            /*
             * Backend response is expected to be:
             *
             * {
             *     items: [],
             *     total: number,
             *     page: number,
             *     limit: number
             * }
             */

            setApplications(
                data?.items || []
            )


            setTotal(
                Number(data?.total || 0)
            )


        } catch (error) {

            console.error(
                'Failed to fetch applications:',
                error
            )

            setApplications([])

            setTotal(0)

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // FETCH WHEN FILTERS / PAGINATION CHANGE
    // =========================================================

    useEffect(() => {

        if (!contextId) {
            return
        }

        fetchApplications()

    }, [
        contextId,
        search,
        agent,
        rm,
        loanType,
        status,
        month,
        year,
        fromDate,
        toDate,
        currentPage,
        rowsPerPage,
    ])

    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch('')
        setAgent('')
        setRm('')
        setLoanType('')
        setStatus('')
        setMonth('')
        setYear('')
        setFromDate('')
        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        fetchApplications()

    }


    // =========================================================
    // VIEW DISBURSEMENT
    // =========================================================

    const handleView = (
        application
    ) => {

        setSelectedApplication(
            application
        )

        setShowModal(true)

    }


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setSelectedApplication(
            null
        )

    }


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                total /
                rowsPerPage
            )
        )


    const handlePreviousPage = () => {

        setCurrentPage(
            (previous) =>
                Math.max(
                    1,
                    previous - 1
                )
        )

    }


    const handleNextPage = () => {

        setCurrentPage(
            (previous) =>
                Math.min(
                    totalPages,
                    previous + 1
                )
        )

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
                                onChange={(event) => {

                                    setSearch(
                                        event.target.value
                                    )

                                    setCurrentPage(1)

                                }}
                                placeholder="Search ID, name, phone, email..."
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

                    <AgentDropdown
                        value={agent}
                        options={agentOptions}
                        onChange={(value) => {

                            setAgent(value)
                            setCurrentPage(1)

                        }}
                        className="min-w-0"
                    />


                    {/* =================================================
                        RM
                    ================================================= */}

                    <RmDropdown
                        value={rm}
                        options={rmOptions}
                        onChange={(value) => {

                            setRm(value)
                            setCurrentPage(1)

                        }}
                        className="min-w-0"
                    />


                    {/* =================================================
                        LOAN TYPE
                    ================================================= */}

                    <LoanTypeDropdown
                        value={loanType}
                        options={loanTypeOptions}
                        onChange={(value) => {

                            setLoanType(value)
                            setCurrentPage(1)

                        }}
                        className="min-w-0"
                    />


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <SearchableDropdown
                        label="Status"
                        value={status}
                        options={STATUSES}
                        placeholder="All Statuses"
                        onChange={(value) => {

                            setStatus(value)
                            setCurrentPage(1)

                        }}
                    />


                    {/* =================================================
                        MONTH
                    ================================================= */}

                    <SearchableDropdown
                        label="Month"
                        value={month}
                        options={MONTHS}
                        placeholder="All Months"
                        onChange={(value) => {

                            setMonth(value)
                            setCurrentPage(1)

                        }}
                    />


                    {/* =================================================
                        YEAR
                    ================================================= */}

                    <SearchableDropdown
                        label="Year"
                        value={year}
                        options={YEARS}
                        placeholder="All Years"
                        onChange={(value) => {

                            setYear(value)
                            setCurrentPage(1)

                        }}
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
                                value={toDate}
                                min={
                                    fromDate ||
                                    undefined
                                }
                                onChange={(event) => {

                                    setToDate(
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
                    FILTER FOOTER
                ===================================================== */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-base-300
                    px-4
                    py-3
                ">

                    <p className="
                        text-xs
                        text-base-content/45
                    ">

                        {total}{' '}

                        {total === 1
                            ? 'application'
                            : 'applications'}{' '}

                        found

                    </p>


                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-xs
                            font-medium
                            text-base-content/60
                            transition
                            hover:text-base-content
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        <ArrowPathIcon
                            className={[
                                'h-4',
                                'w-4',
                                loading
                                    ? 'animate-spin'
                                    : '',
                            ].join(' ')}
                        />

                        Refresh

                    </button>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <ApplicationFilterTable
                entries={
                    applications
                }
                loading={
                    loading
                }
                onView={
                    handleView
                }
            />


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {total > 0 && (

                <div className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-base-300
                    bg-base-100
                    px-4
                    py-3
                ">

                    <p className="
                        text-xs
                        text-base-content/50
                    ">

                        Page {currentPage} of {totalPages}

                    </p>


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <button
                            type="button"
                            disabled={
                                loading ||
                                currentPage <= 1
                            }
                            onClick={
                                handlePreviousPage
                            }
                            className="
                                rounded-lg
                                border
                                border-base-300
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                transition
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Previous
                        </button>


                        <button
                            type="button"
                            disabled={
                                loading ||
                                currentPage >= totalPages
                            }
                            onClick={
                                handleNextPage
                            }
                            className="
                                rounded-lg
                                border
                                border-base-300
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                transition
                                hover:bg-base-200
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}


            {/* =====================================================
                DISBURSEMENT MODAL
            ===================================================== */}

            <ApplicationDisbursementModal
                open={
                    showModal
                }
                application={
                    selectedApplication
                }
                onClose={
                    handleCloseModal
                }
            />

        </div>

    )

}


export default ApplicationFilter