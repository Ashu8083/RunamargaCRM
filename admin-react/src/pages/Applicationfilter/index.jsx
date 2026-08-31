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
// STATUS
// =============================================================

const STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'disbursed', label: 'Disbursed' },
]


// =============================================================
// LOAN TYPES
// =============================================================

const LOAN_TYPES = [
    'Personal Loan',
    'Business Loan',
    'Home Loan',
    'Loan Against Property',
    'Car Loan',
    'Education Loan',
    'Gold Loan',
]


// =============================================================
// MOCK APPLICATION DATA
// =============================================================

const INITIAL_APPLICATIONS = [

    {
        id: 'APP001',
        name: 'Rahul Kumar',
        phone: '+91 98765 43210',
        email: 'rahul.kumar@gmail.com',
        appliedDate: '2026-08-25',
        agentName: 'Aravind Kumar',
        agentId: 'AG001',
        rmName: 'Priya Sharma',
        rmId: 'RM001',
        loanType: 'Personal Loan',
        loanStatus: 'disbursed',

        disbursements: [

            {
                id: 1,
                bank: 'HDFC Bank',
                disbursedDate: '25/08/2026',
                disbursedAmount: 500000,
                dsaCode: 'HDFC001',
                pf: 5900,
                insurance: 12500,
            },

            {
                id: 2,
                bank: 'ICICI Bank',
                disbursedDate: '26/08/2026',
                disbursedAmount: 250000,
                dsaCode: 'ICICI009',
                pf: 2950,
                insurance: 6800,
            },

        ],
    },


    {
        id: 'APP002',
        name: 'Sneha Reddy',
        phone: '+91 99887 66554',
        email: 'sneha.reddy@gmail.com',
        appliedDate: '2026-08-24',
        agentName: 'Suresh Kumar',
        agentId: 'AG002',
        rmName: 'Nayana Rao',
        rmId: 'RM002',
        loanType: 'Home Loan',
        loanStatus: 'approved',

        disbursements: [],
    },


    {
        id: 'APP003',
        name: 'Vijay Sharma',
        phone: '+91 98761 23456',
        email: 'vijay.sharma@gmail.com',
        appliedDate: '2026-08-22',
        agentName: 'Aravind Kumar',
        agentId: 'AG001',
        rmName: 'Priya Sharma',
        rmId: 'RM001',
        loanType: 'Business Loan',
        loanStatus: 'processing',

        disbursements: [],
    },


    {
        id: 'APP004',
        name: 'Anjali Nair',
        phone: '+91 91234 56789',
        email: 'anjali.nair@gmail.com',
        appliedDate: '2026-08-20',
        agentName: 'Suresh Kumar',
        agentId: 'AG002',
        rmName: 'Nayana Rao',
        rmId: 'RM002',
        loanType: 'Personal Loan',
        loanStatus: 'pending',

        disbursements: [],
    },


    {
        id: 'APP005',
        name: 'Manoj Verma',
        phone: '+91 90123 45678',
        email: 'manoj.verma@gmail.com',
        appliedDate: '2026-08-18',
        agentName: 'Aravind Kumar',
        agentId: 'AG001',
        rmName: 'Priya Sharma',
        rmId: 'RM001',
        loanType: 'Car Loan',
        loanStatus: 'rejected',

        disbursements: [],
    },


    {
        id: 'APP006',
        name: 'Pooja Banu',
        phone: '+91 93456 78901',
        email: 'pooja.banu@gmail.com',
        appliedDate: '2026-07-28',
        agentName: 'Suresh Kumar',
        agentId: 'AG002',
        rmName: 'Nayana Rao',
        rmId: 'RM002',
        loanType: 'Education Loan',
        loanStatus: 'disbursed',

        disbursements: [

            {
                id: 1,
                bank: 'State Bank of India',
                disbursedDate: '30/07/2026',
                disbursedAmount: 350000,
                dsaCode: 'SBI005',
                pf: 3500,
                insurance: 6200,
            },

        ],
    },


    {
        id: 'APP007',
        name: 'Kiran Gowda',
        phone: '+91 99876 54321',
        email: 'kiran.gowda@gmail.com',
        appliedDate: '2026-07-22',
        agentName: 'Aravind Kumar',
        agentId: 'AG001',
        rmName: 'Priya Sharma',
        rmId: 'RM001',
        loanType: 'Loan Against Property',
        loanStatus: 'approved',

        disbursements: [],
    },


    {
        id: 'APP008',
        name: 'Divya Menon',
        phone: '+91 97654 32109',
        email: 'divya.menon@gmail.com',
        appliedDate: '2026-06-15',
        agentName: 'Suresh Kumar',
        agentId: 'AG002',
        rmName: 'Nayana Rao',
        rmId: 'RM002',
        loanType: 'Personal Loan',
        loanStatus: 'disbursed',

        disbursements: [

            {
                id: 1,
                bank: 'Axis Bank',
                disbursedDate: '18/06/2026',
                disbursedAmount: 400000,
                dsaCode: 'AXIS012',
                pf: 4720,
                insurance: 9800,
            },

        ],
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


    const [search, setSearch] =
        useState('')


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
                    String(
                        option.label
                    )
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
                                    value={
                                        search
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
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
                                                option.value === value
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

    // =========================================================
    // DATA
    // =========================================================

    const [applications, setApplications] =
        useState(
            INITIAL_APPLICATIONS
        )


    const [loading, setLoading] =
        useState(false)


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
    // MODAL
    // =========================================================

    const [showModal, setShowModal] =
        useState(false)


    const [selectedApplication, setSelectedApplication] =
        useState(null)


    // =========================================================
    // DROPDOWN OPTIONS
    // =========================================================

    const agentOptions =
        useMemo(() => {

            const uniqueAgents =
                Array.from(
                    new Map(
                        applications.map(
                            (application) => [
                                application.agentId ||
                                application.agentName,
                                application.agentName,
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
            applications,
        ])


    const rmOptions =
        useMemo(() => {

            const uniqueRms =
                Array.from(
                    new Map(
                        applications.map(
                            (application) => [
                                application.rmId ||
                                application.rmName,
                                application.rmName,
                            ]
                        )
                    ).entries()
                )


            return [
                {
                    value: '',
                    label: 'All RMs',
                },

                ...uniqueRms.map(
                    ([value, label]) => ({
                        value,
                        label,
                    })
                ),
            ]

        }, [
            applications,
        ])


    const loanTypeOptions =
        useMemo(() => {

            return [
                {
                    value: '',
                    label: 'All Loan Types',
                },

                ...LOAN_TYPES.map(
                    (item) => ({
                        value: item,
                        label: item,
                    })
                ),
            ]

        }, [])


    // =========================================================
    // FILTERED APPLICATIONS
    // =========================================================

    const filteredApplications =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase()


            return applications.filter(
                (application) => {

                    // ---------------------------------------------
                    // SEARCH
                    // ---------------------------------------------

                    if (searchValue) {

                        const searchableValues = [

                            application.id,

                            application.name,

                            application.phone,

                            application.email,

                            application.agentName,

                            application.rmName,

                            application.loanType,

                            application.loanStatus,

                            application.appliedDate,

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
                        application.agentId !== agent
                    ) {

                        return false

                    }


                    // ---------------------------------------------
                    // RM
                    // ---------------------------------------------

                    if (
                        rm &&
                        application.rmId !== rm
                    ) {

                        return false

                    }


                    // ---------------------------------------------
                    // LOAN TYPE
                    // ---------------------------------------------

                    if (
                        loanType &&
                        application.loanType !== loanType
                    ) {

                        return false

                    }


                    // ---------------------------------------------
                    // STATUS
                    // ---------------------------------------------

                    if (
                        status &&
                        String(
                            application.loanStatus
                        )
                            .toLowerCase() !==
                        status.toLowerCase()
                    ) {

                        return false

                    }


                    // ---------------------------------------------
                    // MONTH
                    // ---------------------------------------------

                    if (month) {

                        const applicationMonth =
                            application.appliedDate
                                ?.split('-')[1]


                        if (
                            applicationMonth !==
                            month
                        ) {

                            return false

                        }

                    }


                    // ---------------------------------------------
                    // YEAR
                    // ---------------------------------------------

                    if (year) {

                        const applicationYear =
                            application.appliedDate
                                ?.split('-')[0]


                        if (
                            applicationYear !==
                            year
                        ) {

                            return false

                        }

                    }


                    // ---------------------------------------------
                    // FROM DATE
                    // ---------------------------------------------

                    if (
                        fromDate &&
                        application.appliedDate <
                        fromDate
                    ) {

                        return false

                    }


                    // ---------------------------------------------
                    // TO DATE
                    // ---------------------------------------------

                    if (
                        toDate &&
                        application.appliedDate >
                        toDate
                    ) {

                        return false

                    }


                    return true

                }
            )

        }, [
            applications,
            search,
            agent,
            rm,
            loanType,
            status,
            month,
            year,
            fromDate,
            toDate,
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

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        setLoading(true)


        setTimeout(() => {

            setApplications(
                [...INITIAL_APPLICATIONS]
            )

            setLoading(false)

        }, 400)

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
                        onChange={setAgent}
                        className="min-w-0"
                    />


                    {/* =================================================
                        RM
                    ================================================= */}

                    <RmDropdown
                        value={rm}
                        options={rmOptions}
                        onChange={setRm}
                        className="min-w-0"
                    />


                    {/* =================================================
                        LOAN TYPE
                    ================================================= */}

                    <LoanTypeDropdown
                        value={loanType}
                        options={
                            loanTypeOptions
                        }
                        onChange={setLoanType}
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
                        onChange={setStatus}
                    />


                    {/* =================================================
                        MONTH
                    ================================================= */}

                    <SearchableDropdown
                        label="Month"
                        value={month}
                        options={MONTHS}
                        placeholder="All Months"
                        onChange={setMonth}
                    />


                    {/* =================================================
                        YEAR
                    ================================================= */}

                    <SearchableDropdown
                        label="Year"
                        value={year}
                        options={YEARS}
                        placeholder="All Years"
                        onChange={setYear}
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
                        {filteredApplications.length}{' '}

                        {filteredApplications.length === 1
                            ? 'application'
                            : 'applications'}{' '}

                        found
                    </p>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <ApplicationFilterTable
                entries={
                    filteredApplications
                }
                loading={loading}
                onView={
                    handleView
                }
            />


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
