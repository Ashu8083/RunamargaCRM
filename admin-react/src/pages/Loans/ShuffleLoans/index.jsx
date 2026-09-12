// admin-react/src/pages/Loans/ShuffleLoans/index.jsx

import { useEffect, useMemo, useState } from 'react'

import AgentDropdown from '../../../components/GlobalModels/Filters/AgentDropdown'
import LoanTypeDropdown from '../../../components/GlobalModels/Filters/LoanTypeDropdown'
import RmDropdown from '../../../components/GlobalModels/Filters/RmDropdown'
import FeedbackModal from '../../../components/GlobalModels/FeedbackModal'

import ShuffleLoansTable from './components/ShuffleLoansTable'
import AssignShuffleLoansModal from './components/AssignShuffleLoansModal'

import {
    getShuffleLoans,
    assignShuffleLoans,
    getApiErrorMessage,
} from './API'


function ShuffleLoans() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [assigning, setAssigning] =
        useState(false)


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')


    // =========================================================
    // SELECTED APPLICATIONS
    // =========================================================

    const [
        selectedApplicationIds,
        setSelectedApplicationIds,
    ] = useState([])


    // =========================================================
    // ASSIGN MODAL
    // =========================================================

    const [showAssignModal, setShowAssignModal] =
        useState(false)


    // =========================================================
    // FEEDBACK
    // =========================================================

    const [feedback, setFeedback] = useState({
        open: false,
        type: 'info',
        title: '',
        message: '',
    })


    const showFeedback = (
        type,
        title,
        message
    ) => {

        setFeedback({
            open: true,
            type,
            title,
            message,
        })
    }


    const closeFeedback = () => {

        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))
    }


    // =========================================================
    // LOAD APPLICATIONS
    // =========================================================

    const loadApplications = async () => {

        try {

            setLoading(true)

            const data =
                await getShuffleLoans()

            setApplications(
                Array.isArray(data)
                    ? data
                    : []
            )

        } catch (error) {

            showFeedback(
                'error',
                'Failed to Load Applications',
                getApiErrorMessage(
                    error,
                    'Unable to load shuffle applications.'
                )
            )

        } finally {

            setLoading(false)

        }
    }


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadApplications()

    }, [])


    // =========================================================
    // AGENTS
    // =========================================================
    //
    // These are derived only from loaded applications.
    // The AgentDropdown itself continues to use its own API.
    //
    // =========================================================

    const agents = useMemo(() => {

        const map = new Map()

        applications.forEach((application) => {

            const id =
                application.agentId ??
                application.agent_id

            const name =
                application.agentName ??
                application.agent_name

            if (!id || !name) {
                return
            }

            const key = String(id)

            if (!map.has(key)) {

                map.set(key, {
                    id,
                    name,
                })
            }

        })

        return [...map.values()]

    }, [applications])


    // =========================================================
    // RMS
    // =========================================================

    const rms = useMemo(() => {

        const map = new Map()

        applications.forEach((application) => {

            const id =
                application.rmId ??
                application.rm_id

            const name =
                application.rmName ??
                application.rm_name

            if (!id || !name) {
                return
            }

            const key = String(id)

            if (!map.has(key)) {

                map.set(key, {
                    id,
                    name,
                })
            }

        })

        return [...map.values()]

    }, [applications])


    // =========================================================
    // LOAN TYPES
    // =========================================================

    const loanTypes = useMemo(() => {

        const map = new Map()

        applications.forEach((application) => {

            const id =
                application.loanTypeId ??
                application.loan_type_id

            const name =
                application.loanType ??
                application.loan_type

            if (!id || !name) {
                return
            }

            const key = String(id)

            if (!map.has(key)) {

                map.set(key, {
                    id,
                    name,
                })
            }

        })

        return [...map.values()]

    }, [applications])


    // =========================================================
    // STATUSES
    // =========================================================

    const statuses = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.status
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const value =
            search.trim().toLowerCase()

        return applications.filter((application) => {

            // -----------------------------------------------------
            // SEARCH
            // -----------------------------------------------------

            if (
                value &&
                ![
                    application.name,
                    application.phone,
                    application.email,
                    application.loanId,
                    application.unique_id,
                    application.id,
                    application.loanType,
                    application.status,
                    application.agentName,
                    application.agent_name,
                    application.rmName,
                    application.rm_name,
                ].some(
                    (field) =>
                        field !== null &&
                        field !== undefined &&
                        String(field)
                            .toLowerCase()
                            .includes(value)
                )
            ) {
                return false
            }


            // -----------------------------------------------------
            // AGENT
            // -----------------------------------------------------

            if (selectedAgent) {

                const applicationAgent =
                    application.agentId ??
                    application.agent_id

                if (
                    String(applicationAgent) !==
                    String(selectedAgent)
                ) {
                    return false
                }
            }


            // -----------------------------------------------------
            // RM
            // -----------------------------------------------------

            if (selectedRM) {

                const applicationRM =
                    application.rmId ??
                    application.rm_id

                if (
                    String(applicationRM) !==
                    String(selectedRM)
                ) {
                    return false
                }
            }


            // -----------------------------------------------------
            // LOAN TYPE
            // -----------------------------------------------------

            if (selectedLoanType) {

                const applicationLoanType =
                    application.loanTypeId ??
                    application.loan_type_id

                if (
                    String(applicationLoanType) !==
                    String(selectedLoanType)
                ) {
                    return false
                }
            }


            // -----------------------------------------------------
            // STATUS
            // -----------------------------------------------------

            if (
                selectedStatus &&
                application.status !== selectedStatus
            ) {
                return false
            }


            return true

        })

    }, [
        applications,
        search,
        selectedAgent,
        selectedRM,
        selectedLoanType,
        selectedStatus,
    ])


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')
        setSelectedAgent('')
        setSelectedRM('')
        setSelectedLoanType('')
        setSelectedStatus('')
        setSelectedApplicationIds([])

    }


    // =========================================================
    // SELECT APPLICATION
    // =========================================================

    const handleSelectApplication = (
        applicationId
    ) => {

        setSelectedApplicationIds((previous) => {

            if (
                previous.includes(applicationId)
            ) {

                return previous.filter(
                    (id) =>
                        id !== applicationId
                )
            }

            return [
                ...previous,
                applicationId,
            ]
        })
    }


    // =========================================================
    // SELECT ALL
    // =========================================================

    const handleSelectAll = () => {

        const filteredIds =
            filteredApplications.map(
                (application) =>
                    application.id
            )

        const allSelected =
            filteredIds.length > 0 &&
            filteredIds.every(
                (id) =>
                    selectedApplicationIds.includes(id)
            )

        if (allSelected) {

            setSelectedApplicationIds(
                (previous) =>
                    previous.filter(
                        (id) =>
                            !filteredIds.includes(id)
                    )
            )

            return
        }

        setSelectedApplicationIds(
            (previous) => [
                ...new Set([
                    ...previous,
                    ...filteredIds,
                ]),
            ]
        )
    }


    // =========================================================
    // OPEN ASSIGN MODAL
    // =========================================================

    const handleOpenAssignModal = () => {

        if (
            selectedApplicationIds.length === 0
        ) {

            showFeedback(
                'warning',
                'No Applications Selected',
                'Select at least one application before assigning.'
            )

            return
        }

        setShowAssignModal(true)
    }


    // =========================================================
    // CLOSE ASSIGN MODAL
    // =========================================================

    const handleCloseAssignModal = () => {

        if (assigning) {
            return
        }

        setShowAssignModal(false)
    }


    // =========================================================
    // ASSIGN / SHUFFLE
    // =========================================================

    const handleAssignSubmit = async (data) => {

        if (
            !selectedApplicationIds.length
        ) {
            return
        }

        try {

            setAssigning(true)

            const updatedApplications =
                await assignShuffleLoans({
                    applicationIds:
                        selectedApplicationIds,

                    agentId:
                        data.agentId,

                    rmId:
                        data.rmId,

                    loanTypeId:
                        data.loanTypeId,
                })


            // -------------------------------------------------
            // Replace only the updated applications returned
            // by the backend.
            // -------------------------------------------------

            if (
                Array.isArray(
                    updatedApplications
                ) &&
                updatedApplications.length
            ) {

                const updatedMap =
                    new Map(
                        updatedApplications.map(
                            (application) => [
                                application.id,
                                application,
                            ]
                        )
                    )

                setApplications(
                    (previous) =>
                        previous.map(
                            (application) =>
                                updatedMap.get(
                                    application.id
                                ) || application
                        )
                )

            } else {

                await loadApplications()
            }


            setSelectedApplicationIds([])

            setShowAssignModal(false)

            showFeedback(
                'success',
                'Applications Updated',
                `${selectedApplicationIds.length} application${
                    selectedApplicationIds.length !== 1
                        ? 's'
                        : ''
                } updated successfully.`
            )

        } catch (error) {

            showFeedback(
                'error',
                'Assignment Failed',
                getApiErrorMessage(
                    error,
                    'Unable to update selected applications.'
                )
            )

        } finally {

            setAssigning(false)

        }
    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        setSelectedApplicationIds([])

        await loadApplications()

        showFeedback(
            'success',
            'Applications Refreshed',
            'Shuffle loan data refreshed successfully.'
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

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="
                rounded-xl
                border
                border-base-300
                bg-base-100
                p-3
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                    lg:items-center
                ">

                    {/* SEARCH */}

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search"
                        className="
                            input
                            input-bordered
                            w-full
                            lg:flex-1
                            focus:border-[#8BCF00]
                            focus:outline-[#8BCF00]
                        "
                    />


                    {/* AGENT */}

                    <AgentDropdown
                        value={selectedAgent}
                        onChange={setSelectedAgent}
                        showLabel={false}
                        placeholder="Select Agent"
                        searchPlaceholder="Search agent"
                        emptyMessage="No agents found"
                        includeAllOption={false}
                        className="
                            w-full
                            lg:w-44
                            lg:flex-none
                        "
                    />


                    {/* RM */}

                    <RmDropdown
                        value={selectedRM}
                        onChange={setSelectedRM}
                        showLabel={false}
                        placeholder="Select RM"
                        searchPlaceholder="Search RM"
                        emptyMessage="No RMs found"
                        includeAllOption={false}
                        className="
                            w-full
                            lg:w-44
                            lg:flex-none
                        "
                    />


                    {/* LOAN TYPE */}

                    <LoanTypeDropdown
                        value={selectedLoanType}
                        onChange={setSelectedLoanType}
                        showLabel={false}
                        placeholder="Select Loan Type"
                        searchPlaceholder="Search loan type"
                        emptyMessage="No loan types found"
                        includeAllOption={false}
                        className="
                            w-full
                            lg:w-44
                            lg:flex-none
                        "
                    />


                    {/* ASSIGN */}

                    <button
                        type="button"
                        onClick={
                            handleOpenAssignModal
                        }
                        disabled={
                            assigning ||
                            selectedApplicationIds.length === 0
                        }
                        className="
                            btn
                            w-full
                            border-[#8BCF00]
                            bg-[#8BCF00]
                            text-white
                            hover:border-[#6FA800]
                            hover:bg-[#6FA800]
                            disabled:border-base-300
                            disabled:bg-base-300
                            disabled:text-base-content/40
                            lg:w-auto
                        "
                    >

                        Assign

                        {selectedApplicationIds.length > 0 && (
                            <>
                                {' '}
                                ({selectedApplicationIds.length})
                            </>
                        )}

                    </button>

                </div>


                {/* CLEAR FILTERS */}

                {(search ||
                    selectedAgent ||
                    selectedRM ||
                    selectedLoanType ||
                    selectedStatus) && (

                    <div className="
                        mt-3
                        flex
                        justify-end
                    ">

                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                                text-base-content/60
                                hover:bg-base-200
                            "
                        >
                            Clear Filters
                        </button>

                    </div>

                )}

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <ShuffleLoansTable
                applications={
                    filteredApplications
                }
                selectedApplicationIds={
                    selectedApplicationIds
                }
                onSelectApplication={
                    handleSelectApplication
                }
                onSelectAll={
                    handleSelectAll
                }
                onRefresh={
                    handleRefresh
                }
            />


            {/* =================================================
                ASSIGN MODAL
            ================================================= */}

            <AssignShuffleLoansModal
                open={showAssignModal}
                applications={
                    applications.filter(
                        (application) =>
                            selectedApplicationIds.includes(
                                application.id
                            )
                    )
                }
                agents={agents}
                rms={rms}
                loanTypes={loanTypes}
                onClose={
                    handleCloseAssignModal
                }
                onSubmit={
                    handleAssignSubmit
                }
            />


            {/* =================================================
                FEEDBACK
            ================================================= */}

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={closeFeedback}
            />

        </div>
    )
}


export default ShuffleLoans