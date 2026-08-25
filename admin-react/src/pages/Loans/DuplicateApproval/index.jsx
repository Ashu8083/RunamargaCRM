// admin-react/src/pages/Loans/DuplicateApproval/index.jsx

import { useMemo, useState } from 'react'

import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import DuplicateApprovalTable from './components/DuplicateApprovalTable'
import DuplicateApprovalModal from './components/DuplicateApprovalModal'


function DuplicateApproval() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([
        {
            id: 1,

            applicantName: 'Rajesh Kumar',

            phone: '9876543210',

            loanType: 'Personal Loan',

            loanAmount: 500000,

            appliedDate: '2026-08-20T10:30:00',

            appliedBy: 'Premalatha N',

            status: 'active',

            approvedDate: null,

            rejectedDate: null,

            loanId: null,
        },

        {
            id: 2,

            applicantName: 'Priya Sharma',

            phone: '9876543211',

            loanType: 'Business Loan',

            loanAmount: 1000000,

            appliedDate: '2026-08-20T11:15:00',

            appliedBy: 'Premalatha N',

            status: 'active',

            approvedDate: null,

            rejectedDate: null,

            loanId: null,
        },

        {
            id: 3,

            applicantName: 'Arun Kumar',

            phone: '9876543212',

            loanType: 'Home Loan',

            loanAmount: 2500000,

            appliedDate: '2026-08-19T09:45:00',

            appliedBy: 'Shubha',

            status: 'approved',

            approvedDate: '2026-08-20T14:20:00',

            rejectedDate: null,

            loanId: 'LN20260820001',
        },

        {
            id: 4,

            applicantName: 'Sneha Reddy',

            phone: '9876543213',

            loanType: 'Personal Loan',

            loanAmount: 300000,

            appliedDate: '2026-08-18T16:10:00',

            appliedBy: 'Prasanna Y R',

            status: 'rejected',

            approvedDate: null,

            rejectedDate: '2026-08-19T10:15:00',

            loanId: null,
        },

        {
            id: 5,

            applicantName: 'Kiran Kumar',

            phone: '9876543214',

            loanType: 'Loan Against Property',

            loanAmount: 1500000,

            appliedDate: '2026-08-21T09:20:00',

            appliedBy: 'Nayana',

            status: 'active',

            approvedDate: null,

            rejectedDate: null,

            loanId: null,
        },

        {
            id: 6,

            applicantName: 'Manoj Kumar',

            phone: '9876543215',

            loanType: 'Vehicle Loan',

            loanAmount: 750000,

            appliedDate: '2026-08-21T12:40:00',

            appliedBy: 'Kasturi',

            status: 'active',

            approvedDate: null,

            rejectedDate: null,

            loanId: null,
        },

        {
            id: 7,

            applicantName: 'Deepa',

            phone: '9876543216',

            loanType: 'Education Loan',

            loanAmount: 400000,

            appliedDate: '2026-08-22T10:05:00',

            appliedBy: 'Prashanth',

            status: 'approved',

            approvedDate: '2026-08-22T15:30:00',

            rejectedDate: null,

            loanId: 'LN20260822002',
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')


    // =========================================================
    // AGENT DROPDOWN STATE
    // =========================================================

    const [agentSearch, setAgentSearch] =
        useState('')

    const [showAgentDropdown, setShowAgentDropdown] =
        useState(false)


    // =========================================================
    // SELECTION STATE
    // =========================================================

    const [selectedIds, setSelectedIds] =
        useState([])


    // =========================================================
    // MODAL STATE
    // =========================================================

    const [showApprovalModal, setShowApprovalModal] =
        useState(false)


    // =========================================================
    // LOAN TYPES
    // =========================================================

    const loanTypes = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.loanType ??
                            application.loan_type
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // AGENTS
    // =========================================================

    const agents = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.appliedBy ??
                            application.applied_by
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // FILTERED AGENTS
    // =========================================================

    const filteredAgents = useMemo(() => {

        const value =
            agentSearch
                .trim()
                .toLowerCase()


        if (!value) {
            return agents
        }


        return agents.filter(
            (agent) =>
                String(agent)
                    .toLowerCase()
                    .includes(value)
        )

    }, [
        agents,
        agentSearch,
    ])


    // =========================================================
    // SELECTED AGENT NAME
    // =========================================================

    const selectedAgentName = useMemo(() => {

        if (!selectedAgent) {
            return 'All Agents'
        }


        return selectedAgent

    }, [
        selectedAgent,
    ])


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const value =
            search
                .trim()
                .toLowerCase()


        return applications.filter(
            (application) => {

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                if (value) {

                    const searchableFields = [

                        application.applicantName,

                        application.phone,

                        application.loanType,

                        application.appliedBy,

                        application.loanId,

                        application.id,

                    ]


                    const matchesSearch =
                        searchableFields.some(
                            (field) =>
                                field !== null &&
                                field !== undefined &&
                                String(field)
                                    .toLowerCase()
                                    .includes(value)
                        )


                    if (!matchesSearch) {
                        return false
                    }

                }


                // -------------------------------------------------
                // LOAN TYPE
                // -------------------------------------------------

                if (
                    selectedLoanType &&
                    application.loanType !==
                        selectedLoanType
                ) {

                    return false

                }


                // -------------------------------------------------
                // AGENT
                // -------------------------------------------------

                if (
                    selectedAgent &&
                    application.appliedBy !==
                        selectedAgent
                ) {

                    return false

                }


                // -------------------------------------------------
                // STATUS
                // -------------------------------------------------

                if (
                    selectedStatus &&
                    application.status !==
                        selectedStatus
                ) {

                    return false

                }


                return true

            }
        )

    }, [
        applications,
        search,
        selectedLoanType,
        selectedAgent,
        selectedStatus,
    ])


    // =========================================================
    // ACTIVE FILTERED APPLICATIONS
    // =========================================================

    const activeFilteredApplications =
        useMemo(() => {

            return filteredApplications.filter(
                (application) =>
                    application.status ===
                    'active'
            )

        }, [
            filteredApplications,
        ])


    // =========================================================
    // SELECTED APPLICATIONS
    // =========================================================

    const selectedApplications =
        useMemo(() => {

            return applications.filter(
                (application) =>
                    selectedIds.includes(
                        application.id
                    ) &&
                    application.status ===
                        'active'
            )

        }, [
            applications,
            selectedIds,
        ])


    // =========================================================
    // SELECTION COUNT
    // =========================================================

    const selectedCount =
        selectedApplications.length


    // =========================================================
    // ALL FILTERED ACTIVE SELECTED
    // =========================================================

    const allFilteredActiveSelected =
        activeFilteredApplications.length > 0 &&
        activeFilteredApplications.every(
            (application) =>
                selectedIds.includes(
                    application.id
                )
        )


    // =========================================================
    // HANDLE INDIVIDUAL SELECTION
    // =========================================================

    const handleSelectApplication = (
        applicationId
    ) => {

        const application =
            applications.find(
                (item) =>
                    item.id ===
                    applicationId
            )


        if (
            !application ||
            application.status !==
                'active'
        ) {

            return

        }


        setSelectedIds((previous) => {

            if (
                previous.includes(
                    applicationId
                )
            ) {

                return previous.filter(
                    (id) =>
                        id !==
                        applicationId
                )

            }


            return [
                ...previous,
                applicationId,
            ]

        })

    }


    // =========================================================
    // HANDLE SELECT ALL
    // =========================================================

    const handleSelectAll = () => {

        if (
            allFilteredActiveSelected
        ) {

            const visibleActiveIds =
                activeFilteredApplications.map(
                    (application) =>
                        application.id
                )


            setSelectedIds(
                (previous) =>
                    previous.filter(
                        (id) =>
                            !visibleActiveIds.includes(
                                id
                            )
                    )
            )

            return

        }


        const visibleActiveIds =
            activeFilteredApplications.map(
                (application) =>
                    application.id
            )


        setSelectedIds(
            (previous) => {

                return [
                    ...new Set([
                        ...previous,
                        ...visibleActiveIds,
                    ]),
                ]

            }
        )

    }


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')

        setSelectedLoanType('')

        setSelectedAgent('')

        setSelectedStatus('')

        setAgentSearch('')

        setShowAgentDropdown(false)

    }


    // =========================================================
    // AGENT SELECTION
    // =========================================================

    const handleAgentSelect = (
        agent
    ) => {

        setSelectedAgent(agent)

        setAgentSearch('')

        setShowAgentDropdown(false)

    }


    // =========================================================
    // OPEN APPROVAL MODAL
    // =========================================================

    const handleOpenApprovalModal = () => {

        if (!selectedCount) {
            return
        }


        setShowApprovalModal(true)

    }


    // =========================================================
    // CLOSE APPROVAL MODAL
    // =========================================================

    const handleCloseApprovalModal = () => {

        setShowApprovalModal(false)

    }


    // =========================================================
    // APPROVE / REJECT
    // =========================================================
    //
    // The actual modal will call this function.
    //
    // action:
    //     'approve'
    //     'reject'
    //
    // selected IDs are processed together.
    // =========================================================

    const handleApprovalSubmit = (
        action
    ) => {

        const changedAt =
            new Date().toISOString()


        setApplications(
            (previous) =>
                previous.map(
                    (application) => {

                        if (
                            !selectedIds.includes(
                                application.id
                            ) ||
                            application.status !==
                                'active'
                        ) {

                            return application

                        }


                        if (
                            action ===
                            'approve'
                        ) {

                            return {
                                ...application,

                                status:
                                    'approved',

                                approvedDate:
                                    changedAt,

                                rejectedDate:
                                    null,

                                loanId:
                                    `LN${Date.now()}${application.id}`,
                            }

                        }


                        if (
                            action ===
                            'reject'
                        ) {

                            return {
                                ...application,

                                status:
                                    'rejected',

                                approvedDate:
                                    null,

                                rejectedDate:
                                    changedAt,

                                loanId:
                                    null,
                            }

                        }


                        return application

                    }
                )
        )


        // ---------------------------------------------------------
        // Remove processed applications from selection
        // ---------------------------------------------------------

        setSelectedIds([])

        setShowApprovalModal(false)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * API refresh will be connected later.
         */

        console.log(
            'Refresh Duplicate Approval'
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-4
            p-3
            sm:p-5
        ">

            {/* =====================================================
                FILTER SECTION
            ===================================================== */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    px-4
                    py-4
                    sm:px-5
                ">

                    {/* =================================================
                        FILTER HEADER
                    ================================================= */}

                    <div className="
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            Filter Options
                        </p>


                        <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        ">

                            {/* SELECTED COUNT */}

                            {selectedCount > 0 && (

                                <span className="
                                    rounded-full
                                    bg-[#8BCF00]/10
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-[#78B300]
                                ">
                                    {selectedCount}{' '}
                                    Selected
                                </span>

                            )}


                            {/* APPROVE SELECTED */}

                            <button
                                type="button"
                                onClick={
                                    handleOpenApprovalModal
                                }
                                disabled={
                                    selectedCount ===
                                    0
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    bg-[#8BCF00]
                                    px-3
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[#78B300]
                                    disabled:cursor-not-allowed
                                    disabled:bg-base-300
                                    disabled:text-base-content/40
                                "
                            >

                                <CheckIcon className="
                                    h-4
                                    w-4
                                " />

                                Review Selected

                            </button>


                            {/* CLEAR */}

                            {(search ||
                                selectedLoanType ||
                                selectedAgent ||
                                selectedStatus) && (

                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        text-xs
                                        font-medium
                                        text-base-content/60
                                        hover:text-base-content
                                    "
                                >

                                    <XMarkIcon className="
                                        h-4
                                        w-4
                                    " />

                                    Clear

                                </button>

                            )}


                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                title="Refresh"
                                aria-label="Refresh duplicate approval"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    transition
                                    hover:bg-base-200
                                "
                            >

                                <ArrowPathIcon className="
                                    h-4.5
                                    w-4.5
                                    text-base-content/60
                                " />

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <div className="
                        mt-4
                        grid
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-4
                    ">

                        {/* SEARCH */}

                        <div className="
                            relative
                        ">

                            <MagnifyingGlassIcon className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-5
                                w-5
                                -translate-y-1/2
                                text-base-content/40
                            " />


                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="
                                    Search name, phone, loan ID...
                                "
                                className="
                                    input
                                    input-bordered
                                    w-full
                                    pl-10
                                "
                            />

                        </div>


                        {/* LOAN TYPE */}

                        <select
                            value={
                                selectedLoanType
                            }
                            onChange={(event) =>
                                setSelectedLoanType(
                                    event.target.value
                                )
                            }
                            className="
                                select
                                select-bordered
                                w-full
                            "
                        >

                            <option value="">
                                All Loan Types
                            </option>

                            {loanTypes.map(
                                (loanType) => (

                                    <option
                                        key={
                                            loanType
                                        }
                                        value={
                                            loanType
                                        }
                                    >
                                        {loanType}
                                    </option>

                                )
                            )}

                        </select>


                        {/* =================================================
                            AGENT DROPDOWN
                        ================================================= */}

                        <div className="
                            relative
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAgentDropdown(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-4
                                    text-left
                                    text-sm
                                    transition
                                    hover:border-base-content/30
                                "
                            >

                                <span className="
                                    truncate
                                ">
                                    {
                                        selectedAgentName
                                    }
                                </span>


                                <ChevronDownIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/45
                                " />

                            </button>


                            {showAgentDropdown && (

                                <div className="
                                    absolute
                                    left-0
                                    right-0
                                    top-full
                                    z-50
                                    mt-1
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-base-300
                                    bg-base-100
                                    shadow-xl
                                ">

                                    {/* AGENT SEARCH */}

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
                                                left-3
                                                top-1/2
                                                h-4
                                                w-4
                                                -translate-y-1/2
                                                text-base-content/40
                                            " />


                                            <input
                                                type="text"
                                                value={
                                                    agentSearch
                                                }
                                                onChange={(event) =>
                                                    setAgentSearch(
                                                        event.target.value
                                                    )
                                                }
                                                autoFocus
                                                placeholder="
                                                    Search agent...
                                                "
                                                className="
                                                    input
                                                    input-sm
                                                    input-bordered
                                                    w-full
                                                    pl-9
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* AGENT LIST */}

                                    <div className="
                                        max-h-52
                                        overflow-y-auto
                                        p-1
                                    ">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAgentSelect(
                                                    ''
                                                )
                                            }
                                            className={[
                                                'w-full',
                                                'rounded-lg',
                                                'px-3',
                                                'py-2',
                                                'text-left',
                                                'text-sm',
                                                'hover:bg-base-200',
                                                !selectedAgent
                                                    ? 'bg-[#8BCF00]/10 font-medium text-[#78B300]'
                                                    : '',
                                            ].join(' ')}
                                        >
                                            All Agents
                                        </button>


                                        {filteredAgents.map(
                                            (agent) => (

                                                <button
                                                    key={
                                                        agent
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleAgentSelect(
                                                            agent
                                                        )
                                                    }
                                                    className={[
                                                        'w-full',
                                                        'rounded-lg',
                                                        'px-3',
                                                        'py-2',
                                                        'text-left',
                                                        'text-sm',
                                                        'hover:bg-base-200',
                                                        selectedAgent ===
                                                        agent
                                                            ? 'bg-[#8BCF00]/10 font-medium text-[#78B300]'
                                                            : '',
                                                    ].join(' ')}
                                                >
                                                    {
                                                        agent
                                                    }
                                                </button>

                                            )
                                        )}


                                        {!filteredAgents.length && (

                                            <div className="
                                                px-3
                                                py-4
                                                text-center
                                                text-xs
                                                text-base-content/50
                                            ">
                                                No agent found
                                            </div>

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* STATUS */}

                        <select
                            value={
                                selectedStatus
                            }
                            onChange={(event) =>
                                setSelectedStatus(
                                    event.target.value
                                )
                            }
                            className="
                                select
                                select-bordered
                                w-full
                            "
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        RESULT INFORMATION
                    ================================================= */}

                    <div className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    ">

                        <p className="
                            text-xs
                            font-medium
                            text-base-content/55
                        ">
                            {filteredApplications.length}{' '}
                            {filteredApplications.length === 1
                                ? 'application'
                                : 'applications'}{' '}
                            found
                        </p>


                        {activeFilteredApplications.length >
                            0 && (

                            <button
                                type="button"
                                onClick={
                                    handleSelectAll
                                }
                                className="
                                    text-xs
                                    font-medium
                                    text-[#78B300]
                                    hover:text-[#5f9000]
                                "
                            >
                                {allFilteredActiveSelected
                                    ? 'Unselect All'
                                    : 'Select All Active'}
                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <DuplicateApprovalTable
                applications={
                    filteredApplications
                }
                selectedIds={
                    selectedIds
                }
                onSelect={
                    handleSelectApplication
                }
                onSelectAll={
                    handleSelectAll
                }
                allSelected={
                    allFilteredActiveSelected
                }
            />


            {/* =====================================================
                APPROVAL MODAL
            ===================================================== */}

            <DuplicateApprovalModal
                open={
                    showApprovalModal
                }
                applications={
                    selectedApplications
                }
                onClose={
                    handleCloseApprovalModal
                }
                onSubmit={
                    handleApprovalSubmit
                }
            />

        </div>

    )

}


export default DuplicateApproval