import {
    useEffect,
    useMemo,
    useState,
} from 'react'
import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import DuplicateApprovalTable from '../DuplicateApproval/components/DuplicateApprovalTable'
import LoanTypeDropdown from "../../../components/GlobalModels/Filters/LoanTypeDropdown";
import DuplicateApprovalModal from '../DuplicateApproval/components/DuplicateApprovalModal'
import {
    getDuplicateApprovals,
    approveDuplicateApproval,
} from '../DuplicateApproval/Api';

import { getStoredUser,getActiveContext } from '../../../app/auth'

const DuplicateApproval = () => {

    const [applications, setApplications] =
        useState([])

    const [selectedApplications, setSelectedApplications] =
        useState([])

    const [searchTerm, setSearchTerm] =
        useState('')

    const [statusFilter, setStatusFilter] =
        useState('all')

    const [loanTypeFilter, setLoanTypeFilter] =
        useState('all')

    const [showModal, setShowModal] =
        useState(false)

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')


    // --------------------------------------------------
    // Load data
    // --------------------------------------------------

    const loadApplications = async () => {

        setLoading(true)
        setError('')

        try {

            const response =
                await getDuplicateApprovals()

            if (response?.success === false) {
                throw new Error(
                    response?.message ||
                    'Unable to load duplicate approvals.'
                )
            }

            setApplications(
                response?.data || []
            )

        } catch (error) {

            console.error(
                'Failed to load duplicate approvals:',
                error
            )

            setError(
                error?.message ||
                'Unable to load duplicate approvals.'
            )

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        loadApplications()
    }, [])


    // --------------------------------------------------
    // Filter data
    // --------------------------------------------------

    const filteredApplications = useMemo(() => {

        let filtered = [...applications]


        if (searchTerm.trim()) {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase()

            filtered =
                filtered.filter(
                    (application) => {

                        const name =
                            (
                                application.applicantName ||
                                application.name ||
                                ''
                            ).toLowerCase()

                        const phone =
                            String(
                                application.phone || ''
                            ).toLowerCase()

                        return (
                            name.includes(search) ||
                            phone.includes(search)
                        )
                    }
                )
        }


        if (statusFilter !== 'all') {

            filtered =
                filtered.filter(
                    (application) =>
                        application.status ===
                        statusFilter
                )
        }


        if (loanTypeFilter !== 'all') {

            filtered =
                filtered.filter(
                    (application) =>
                        String(
                            application.loan_type_id
                        ) ===
                        String(
                            loanTypeFilter
                        )
                )
        }


        return filtered

    }, [
        applications,
        searchTerm,
        statusFilter,
        loanTypeFilter,
    ])


    // --------------------------------------------------
    // Pending applications
    // --------------------------------------------------

    const pendingApplications =
        useMemo(() => {

            return filteredApplications.filter(
                (application) =>
                    application.status === 'pending'
            )

        }, [filteredApplications])


    // --------------------------------------------------
    // Loan types
    // --------------------------------------------------

    const loanTypes =
        useMemo(() => {

            const map = new Map()

            applications.forEach(
                (application) => {

                    if (
                        application.loan_type_id &&
                        application.loanType
                    ) {

                        map.set(
                            application.loan_type_id,
                            application.loanType
                        )
                    }

                }
            )

            return Array.from(
                map.entries()
            )

        }, [applications])


    // --------------------------------------------------
    // Selection
    // --------------------------------------------------

    const handleSelectApplication = (
        application
    ) => {

        if (
            application.status !== 'pending'
        ) {
            return
        }

        setSelectedApplications(
            (previous) => {

                const exists =
                    previous.some(
                        (item) =>
                            item.id ===
                            application.id
                    )

                if (exists) {

                    return previous.filter(
                        (item) =>
                            item.id !==
                            application.id
                    )

                }

                return [
                    ...previous,
                    application,
                ]
            }
        )
    }


    const handleSelectAll = () => {

        if (
            selectedApplications.length ===
            pendingApplications.length
        ) {

            setSelectedApplications([])

            return
        }

        setSelectedApplications(
            pendingApplications
        )
    }


    // --------------------------------------------------
    // Modal
    // --------------------------------------------------

    const handleOpenModal = () => {

        if (
            selectedApplications.length === 0
        ) {
            return
        }

        setShowModal(true)
    }


    const handleCloseModal = () => {
        setShowModal(false)
    }


    const handleApprovalSubmit = async (action, remarks) => {
        try {
            setLoading(true);

            const user = getStoredUser();
            const activeContext = getActiveContext(user);

            const contextId = activeContext?.id;

            if (!contextId) {
                throw new Error(
                    'Active context not found.'
                );
            }

            if (action === 'approve') {
                for (const application of selectedApplications) {
                    await approveDuplicateApproval(
                        application.id,
                        contextId
                    );
                }
            }

            setShowModal(false);
            setSelectedApplications([]);

            await loadApplications();

        } catch (error) {
            console.error(
                'Duplicate approval action failed:',
                error
            );

            setError(
                error.message ||
                'Unable to process approval.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-4">

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="mb-4 flex items-center justify-between">

                <div>

                    <h1 className="text-xl font-semibold">
                        Duplicate Approvals
                    </h1>

                    <p className="mt-1 text-sm text-base-content/60">
                        Review duplicate application requests
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-ghost btn-sm h-10 min-h-10"
                    onClick={loadApplications}
                    disabled={loading}
                >

                    {loading ? (

                        <>
                            <span className="loading loading-spinner loading-xs" />
                            Loading
                        </>

                    ) : (

                        <>
                            ↻
                            Refresh
                        </>

                    )}

                </button>

            </div>


            {/* ========================================= */}
            {/* ERROR */}
            {/* ========================================= */}

            {error && (

                <div className="mb-4 flex items-center justify-between rounded-lg border border-error/20 bg-error/5 px-4 py-3">

                    <span className="text-sm text-error">
                        {error}
                    </span>

                    <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={loadApplications}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =================================================
    FILTERS
================================================= */}

            <div
                className="
        card
        bg-base-100
        border
        border-base-300
        shadow-sm
    "
            >

                <div
                    className="
            p-3
            flex
            items-center
            gap-2
            w-full
        "
                >

                    {/* SEARCH */}

                    <div className="flex-1 min-w-0">

                        <div className="relative">

                            <SearchIcon
                                className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-base-content/35
                    "
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="
                        Search name or phone...
                    "
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


                    {/* LOAN TYPE */}

                    <div className="w-44 shrink-0">
                        <label className="mb-1 block text-xs font-medium text-base-content/70">
                            Loan Type
                        </label>

                        <LoanTypeDropdown
                            label=""
                            value={loanTypeFilter}
                            onChange={setLoanTypeFilter}
                            allLabel="All Loan Types"
                            placeholder="All Loan Types"
                            searchPlaceholder="Search loan type"
                            emptyMessage="No loan types found"
                        />

                    </div>


                    {/* STATUS */}

                    <div className="w-40 shrink-0">

                        <label className="mb-1 block text-xs font-medium text-base-content/70">
                            Status
                        </label>

                        <select
                            className="
                    select
                    select-bordered
                    h-10
                    min-h-10
                    w-full
                "
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                All
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                        </select>

                    </div>


                    {/* CLEAR */}

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm('')
                            setLoanTypeFilter('all')
                            setStatusFilter('all')
                        }}
                        className="
                btn
                btn-ghost
                btn-sm
                h-10
                min-h-10
                shrink-0
            "
                    >
                        Clear
                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={loadApplications}
                        title="Refresh duplicate approvals"
                        disabled={loading}
                        className="
                btn
                btn-sm
                btn-square
                h-10
                min-h-10
                shrink-0
                border-[#8BCF00]
                text-[#78B300]
                hover:bg-[#8BCF00]
                hover:text-white
            "
                    >

                        {loading ? (

                            <span className="loading loading-spinner loading-xs" />

                        ) : (

                            <ArrowPathIcon
                                className="w-4 h-4"
                            />

                        )}

                    </button>

                </div>

            </div>
            {/* ========================================= */}
            {/* SELECTED ACTION BAR */}
            {/* ========================================= */}

            {selectedApplications.length > 0 && (

                <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">

                    <span className="text-sm">

                        <span className="font-semibold">
                            {selectedApplications.length}
                        </span>

                        {' '}
                        application
                        {selectedApplications.length !== 1
                            ? 's'
                            : ''}{' '}
                        selected

                    </span>


                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleOpenModal}
                    >
                        Review Selected
                    </button>

                </div>

            )}


            {/* ========================================= */}
            {/* TABLE */}
            {/* ========================================= */}

            {loading &&
                applications.length === 0 ? (

                <div className="flex min-h-48 items-center justify-center rounded-xl border border-base-200 bg-base-100">

                    <div className="flex items-center gap-2 text-sm text-base-content/60">

                        <span className="loading loading-spinner loading-sm" />

                        Loading duplicate approvals...

                    </div>

                </div>

            ) : (

                <DuplicateApprovalTable
                    applications={
                        filteredApplications
                    }
                    selectedApplications={
                        selectedApplications
                    }
                    onSelectApplication={
                        handleSelectApplication
                    }
                />

            )}


            {/* ========================================= */}
            {/* MODAL */}
            {/* ========================================= */}

            {showModal && (

                <DuplicateApprovalModal
                    applications={
                        selectedApplications
                    }
                    onClose={
                        handleCloseModal
                    }
                    onSubmit={
                        handleApprovalSubmit
                    }
                />

            )}

        </div>
    )
}


export default DuplicateApproval