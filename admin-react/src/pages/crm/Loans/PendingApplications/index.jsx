// admin-react/src/pages/crm/Loans/PendingApplications/index.jsx

import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { getActiveContext } from '../../../../app/auth'
import {
    getApplications,
    updateApplicationLoanType,
} from '../CombinedApplications/Api'

import PendingApplicationsTable from './components/PendingApplicationsTable'

import { useToast } from '../../../../components/Toast/ToastProvider'


// =============================================================
// LAZY-LOADED MODALS
// =============================================================

const LoanTypeModal = lazy(
    () =>
        import(
            '../../../../components/GlobalModels/Loans/LoanTypeModal'
        )
)

const StatusModal = lazy(
    () =>
        import(
            '../../../../components/GlobalModels/Loans/StatusModal'
        )
)

const ReminderModal = lazy(
    () =>
        import(
            '../../../../components/GlobalModels/Loans/ReminderModal'
        )
)


// =============================================================
// STATUS OPTIONS
// =============================================================

const STATUS_OPTIONS = [
    {
        value: 'revert rejected',
        label: 'Revert Rejected',
    },
    {
        value: 'rejected',
        label: 'Rejected',
    },
    {
        value: 'inprocess',
        label: 'In Process',
    },
    {
        value: 'docspending',
        label: 'Docs Pending',
    },
    {
        value: 'sanctioned',
        label: 'Sanctioned',
    },
    {
        value: 'disbursed',
        label: 'Disbursed',
    },
]


// =============================================================
// NORMALIZE STATUS
// =============================================================

const normalizeStatus = (status) => {
    if (!status) {
        return ''
    }

    return String(status)
        .trim()
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
}


// =============================================================
// NORMALIZE APPLICATION
// =============================================================

const normalizeApplication = (application) => ({
    ...application,

    // BASIC
    id: application.id,

    loanId:
        application.unique_id ??
        application.uniqueId ??
        application.loanId ??
        application.loan_id ??
        application.id,

    unique_id:
        application.unique_id ??
        application.uniqueId ??
        null,

    uniqueId:
        application.uniqueId ??
        application.unique_id ??
        '',

    name: application.name ?? '',
    email: application.email ?? '',
    phone: application.phone ?? '',

    // PERSONAL DETAILS
    gender: application.gender ?? '',

    alternatePhone:
        application.alternatePhone ??
        application.alternate_phone ??
        '',

    alternateEmail:
        application.alternateEmail ??
        application.alternate_email ??
        '',

    maritalStatus:
        application.maritalStatus ??
        application.marital_status ??
        '',

    dob: application.dob ?? '',

    pancardNo:
        application.pancardNo ??
        application.pancard_no ??
        '',

    aadharNo:
        application.aadharNo ??
        application.aadhar_no ??
        '',

    // BANK DETAILS
    bankAccNo:
        application.bankAccNo ??
        application.bank_acc_no ??
        '',

    ifscCode:
        application.ifscCode ??
        application.ifsc_code ??
        '',

    // LOAN DETAILS
    loanTypeId:
        application.loanTypeId ??
        application.loan_type_id ??
        null,

    loan_type_id:
        application.loan_type_id ??
        application.loanTypeId ??
        null,

    loanType:
        application.loanType ??
        application.loan_type ??
        null,

    loanAmt:
        application.loanAmt ??
        application.loan_amt ??
        application.loanAmount ??
        application.amount ??
        null,

    loan_amt:
        application.loan_amt ??
        application.loanAmt ??
        null,

    amount:
        application.amount ??
        application.loanAmount ??
        application.loan_amt ??
        application.loanAmt ??
        null,

    loanTenure:
        application.loanTenure ??
        application.loan_tenure ??
        null,

    loanPurpose:
        application.loanPurpose ??
        application.loan_purpose ??
        '',

    creditScore:
        application.creditScore ??
        application.credit_score ??
        null,

    // REFERRAL / APPLIED BY
    referral: application.referral ?? '',

    appliedById:
        application.appliedById ??
        application.applied_by_id ??
        null,

    appliedBy:
        application.appliedBy ??
        application.applied_by ??
        null,

    // AGENT
    agentId:
        application.agentId ??
        application.agent_id ??
        application.agent_context_id ??
        application.processingAgentId ??
        application.processing_agent_id ??
        null,

    agent_id:
        application.agent_id ??
        application.agentId ??
        application.agent_context_id ??
        null,

    agent_context_id:
        application.agent_context_id ??
        application.agent_id ??
        application.agentId ??
        null,

    agent: application.agent ?? null,

    agentName:
        application.agentName ??
        application.agent_name ??
        application.agent?.name ??
        application.processingAgent?.name ??
        '',

    agent_name:
        application.agent_name ??
        application.agentName ??
        application.agent?.name ??
        '',

    // RM
    rmId:
        application.rmId ??
        application.rm_id ??
        application.rm_context_id ??
        null,

    rm_id:
        application.rm_id ??
        application.rmId ??
        application.rm_context_id ??
        null,

    rm_context_id:
        application.rm_context_id ??
        application.rm_id ??
        application.rmId ??
        null,

    rm: application.rm ?? null,

    rmName:
        application.rmName ??
        application.rm_name ??
        application.rm?.name ??
        '',

    rm_name:
        application.rm_name ??
        application.rmName ??
        application.rm?.name ??
        '',

    // TEAM LEAD
    teamLeadId:
        application.teamLeadId ??
        application.team_lead_id ??
        null,

    team_lead_id:
        application.team_lead_id ??
        application.teamLeadId ??
        null,

    teamLeadName:
        application.teamLeadName ??
        application.team_lead_name ??
        application.teamLead?.name ??
        application.team_lead?.name ??
        '',

    team_lead_name:
        application.team_lead_name ??
        application.teamLeadName ??
        application.teamLead?.name ??
        application.team_lead?.name ??
        '',

    // STATUS
    status: application.status ?? '',

    appliedDate:
        application.appliedDate ??
        application.applied_date ??
        null,

    sanctionDate:
        application.sanctionDate ??
        application.sanction_date ??
        null,

    rejectionDate:
        application.rejectionDate ??
        application.rejection_date ??
        null,

    loggedinDate:
        application.loggedinDate ??
        application.loggedin_date ??
        null,

    docsPendingDate:
        application.docsPendingDate ??
        application.docspendingDate ??
        application.docs_pending_date ??
        application.docspending_date ??
        null,

    docspendingDate:
        application.docspendingDate ??
        application.docsPendingDate ??
        application.docspending_date ??
        null,

    revertedStatus:
        application.revertedStatus ??
        application.reverted_status ??
        '',

    revertedReason:
        application.revertedReason ??
        application.reverted_reason ??
        '',

    revertedDate:
        application.revertedDate ??
        application.reverted_date ??
        null,

    revertedByName:
        application.revertedByName ??
        application.reverted_by_name ??
        '',

    revertedByRole:
        application.revertedByRole ??
        application.reverted_by_role ??
        '',

    rejectionReason:
        application.rejectionReason ??
        application.rejected_remarks ??
        application.rejection_reason ??
        '',

    rejectedRemarks:
        application.rejectedRemarks ??
        application.rejected_remarks ??
        '',

    // LOCATION / OTHER
    stateId:
        application.stateId ??
        application.state_id ??
        null,

    cityId:
        application.cityId ??
        application.city_id ??
        null,

    languageId:
        application.languageId ??
        application.language_id ??
        null,

    ivrId:
        application.ivrId ??
        application.ivr_id ??
        null,

    // TIMESTAMPS
    createdAt:
        application.createdAt ??
        application.created_at ??
        null,

    updatedAt:
        application.updatedAt ??
        application.updated_at ??
        null,
})


// =============================================================
// COMPONENT
// =============================================================

const PendingApplications = () => {
    const {
        showSuccess,
        showError,
    } = useToast()

    // APPLICATION DATA
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)

    // SEARCH / FILTERS
    const [search, setSearch] = useState('')
    const [selectedLoanType, setSelectedLoanType] = useState('')
    const [selectedRM, setSelectedRM] = useState('')
    const [selectedTeamLead, setSelectedTeamLead] = useState('')
    const [selectedAgent, setSelectedAgent] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalApplications, setTotalApplications] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    // SELECTED APPLICATION
    const [selectedApplication, setSelectedApplication] = useState(null)

    // MODALS
    const [showLoanTypeModal, setShowLoanTypeModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showReminderModal, setShowReminderModal] = useState(false)

    // ACTIVE CONTEXT
    const [activeContext, setActiveContext] = useState(
        getActiveContext()
    )


    // =========================================================
    // FETCH PENDING APPLICATIONS
    // =========================================================

    const fetchApplications = useCallback(async () => {
        const context = getActiveContext()

        if (!context?.id) {
            setApplications([])
            setTotalApplications(0)
            setTotalPages(1)
            return
        }

        try {
            setLoading(true)

            const response = await getApplications(
                context.id,
                currentPage,
                pageSize,
                4,
            )

            const data = Array.isArray(response?.data)
                ? response.data
                : []

            setApplications(data.map(normalizeApplication))
            setTotalApplications(Number(response?.count ?? 0))
            setTotalPages(
                Math.max(1, Number(response?.total_pages ?? 1))
            )
        } catch (error) {
            console.error(
                'Failed to fetch pending applications:',
                error,
            )

            setApplications([])
            setTotalApplications(0)
            setTotalPages(1)

            showError(
                error?.response?.data?.detail ||
                    'Failed to load applications',
                'error',
            )
        } finally {
            setLoading(false)
        }
    }, [
        currentPage,
        pageSize,
        showError,
    ])


    // =========================================================
    // FETCH WHEN PAGE / PAGE SIZE / CONTEXT CHANGES
    // =========================================================

    useEffect(() => {
        if (!activeContext?.id) {
            return
        }

        fetchApplications()
    }, [
        activeContext?.id,
        fetchApplications,
    ])


    // =========================================================
    // ACTIVE CONTEXT CHANGE
    // =========================================================

    useEffect(() => {
        const handleAuthChange = () => {
            setActiveContext(getActiveContext())
            setCurrentPage(1)
            setSearch('')
            setSelectedLoanType('')
            setSelectedRM('')
            setSelectedTeamLead('')
            setSelectedAgent('')
            setSelectedStatus('')
            setSelectedApplication(null)
            setShowLoanTypeModal(false)
            setShowStatusModal(false)
            setShowReminderModal(false)
        }

        window.addEventListener(
            'auth:changed',
            handleAuthChange,
        )

        return () => {
            window.removeEventListener(
                'auth:changed',
                handleAuthChange,
            )
        }
    }, [])


    // =========================================================
    // FILTER CURRENT PAGE
    // =========================================================

    const filteredApplications = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase()

        return applications.filter((application) => {
            if (searchValue) {
                const searchableValues = [
                    application.name,
                    application.phone,
                    application.email,
                    application.uniqueId,
                    application.unique_id,
                    application.loanId,
                    application.id,
                    application.referral,
                    application.appliedBy,
                    application.appliedBy?.name,
                    application.applied_by,
                    application.applied_by?.name,
                    application.agentName,
                    application.agent_name,
                    application.agent?.name,
                    application.rmName,
                    application.rm_name,
                    application.rm?.name,
                    application.teamLeadName,
                    application.team_lead_name,
                    application.teamLead?.name,
                    application.team_lead?.name,
                ]

                const matchesSearch = searchableValues.some(
                    (value) =>
                        value !== null &&
                        value !== undefined &&
                        String(value)
                            .toLowerCase()
                            .includes(searchValue),
                )

                if (!matchesSearch) {
                    return false
                }
            }

            if (selectedLoanType) {
                const applicationLoanType =
                    application.loanTypeId ??
                    application.loan_type_id ??
                    application.loanType?.id ??
                    application.loanType

                if (
                    String(applicationLoanType) !==
                    String(selectedLoanType)
                ) {
                    return false
                }
            }

            if (selectedRM) {
                const applicationRM =
                    application.rmId ??
                    application.rm_id ??
                    application.rm_context_id ??
                    application.rm?.id ??
                    application.rmName ??
                    application.rm_name

                if (
                    String(applicationRM) !==
                    String(selectedRM)
                ) {
                    return false
                }
            }

            if (selectedTeamLead) {
                const applicationTeamLead =
                    application.teamLeadId ??
                    application.team_lead_id ??
                    application.teamLead?.id ??
                    application.teamLeadName ??
                    application.team_lead_name

                if (
                    String(applicationTeamLead) !==
                    String(selectedTeamLead)
                ) {
                    return false
                }
            }

            if (selectedAgent) {
                const applicationAgent =
                    application.agentId ??
                    application.agent_id ??
                    application.agent_context_id ??
                    application.agent?.id ??
                    application.agentName ??
                    application.agent_name

                if (
                    String(applicationAgent) !==
                    String(selectedAgent)
                ) {
                    return false
                }
            }

            if (selectedStatus) {
                const normalizedApplicationStatus =
                    normalizeStatus(application.status)

                const normalizedSelectedStatus =
                    normalizeStatus(selectedStatus)

                const applicationStatus =
                    normalizedApplicationStatus === 'rejected' &&
                    application.revertedReason
                        ? 'revert rejected'
                        : normalizedApplicationStatus

                if (
                    applicationStatus !==
                    normalizedSelectedStatus
                ) {
                    return false
                }
            }

            return true
        })
    }, [
        applications,
        search,
        selectedLoanType,
        selectedRM,
        selectedTeamLead,
        selectedAgent,
        selectedStatus,
    ])


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = useCallback(() => {
        setSearch('')
        setSelectedLoanType('')
        setSelectedRM('')
        setSelectedTeamLead('')
        setSelectedAgent('')
        setSelectedStatus('')
        setCurrentPage(1)
    }, [])


    // =========================================================
    // RESET PAGE WHEN FILTERS / PAGE SIZE CHANGE
    // =========================================================

    useEffect(() => {
        setCurrentPage(1)
    }, [
        search,
        selectedLoanType,
        selectedRM,
        selectedTeamLead,
        selectedAgent,
        selectedStatus,
        pageSize,
    ])


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = useCallback(() => {
        fetchApplications()
    }, [fetchApplications])


    // =========================================================
    // LOAN TYPE MODAL
    // =========================================================

    const handleLoanTypeChange = useCallback((application) => {
        setSelectedApplication(application)
        setShowLoanTypeModal(true)
    }, [])

    const handleCloseLoanTypeModal = useCallback(() => {
        setShowLoanTypeModal(false)
        setSelectedApplication(null)
    }, [])

    const handleLoanTypeSubmit = useCallback(
        async ({ applicationId, loanTypeId }) => {
            if (!applicationId || !loanTypeId) {
                return
            }

            try {
                const response =
                    await updateApplicationLoanType(
                        applicationId,
                        loanTypeId,
                    )

                const updatedApplication = response?.data

                setApplications((currentApplications) =>
                    currentApplications.map((application) => {
                        if (
                            application.id !==
                            applicationId
                        ) {
                            return application
                        }

                        return {
                            ...application,
                            loanTypeId:
                                updatedApplication?.loan_type_id ??
                                updatedApplication?.loanTypeId ??
                                loanTypeId,
                            loan_type_id:
                                updatedApplication?.loan_type_id ??
                                updatedApplication?.loanTypeId ??
                                loanTypeId,
                            updatedAt:
                                updatedApplication?.updated_at ??
                                updatedApplication?.updatedAt ??
                                new Date().toISOString(),
                        }
                    }),
                )

                handleCloseLoanTypeModal()

                showSuccess(
                    'Loan type updated successfully',
                )
            } catch (error) {
                console.error(
                    'Failed to update loan type:',
                    error,
                )

                const detail =
                    error?.response?.data?.detail

                const errorMessage = Array.isArray(detail)
                    ? detail
                        .map((item) => item?.msg)
                        .filter(Boolean)
                        .join(', ')
                    : typeof detail === 'string'
                        ? detail
                        : 'Failed to update loan type'

                showError(errorMessage, 'error')
            }
        },
        [
            handleCloseLoanTypeModal,
            showError,
            showSuccess,
        ],
    )


    // =========================================================
    // STATUS MODAL
    // =========================================================

    const handleStatusChange = useCallback((application) => {
        setSelectedApplication(application)
        setShowStatusModal(true)
    }, [])

    const handleCloseStatusModal = useCallback(() => {
        setShowStatusModal(false)
        setSelectedApplication(null)
    }, [])

    const handleStatusSubmit = useCallback(
        (data) => {
            console.log(
                'Status update requested:',
                selectedApplication,
                data,
            )

            handleCloseStatusModal()
        },
        [
            selectedApplication,
            handleCloseStatusModal,
        ],
    )


    // =========================================================
    // REMINDER MODAL
    // =========================================================

    const handleReminder = useCallback((application) => {
        setSelectedApplication(application)
        setShowReminderModal(true)
    }, [])

    const handleCloseReminderModal = useCallback(() => {
        setShowReminderModal(false)
        setSelectedApplication(null)
    }, [])

    const handleReminderSubmit = useCallback((reminder) => {
        console.log(
            'Reminder created successfully:',
            reminder,
        )
    }, [])


    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication = useCallback((application) => {
        const uniqueId =
            application.unique_id ??
            application.uniqueId

        if (!uniqueId) {
            return
        }

        window.location.href =
            `/crm/view-application/${uniqueId}`
    }, [])


    // =========================================================
    // CHAT
    // =========================================================

    const handleChat = useCallback((application) => {
        console.log(
            'Open Application Chat:',
            {
                loanId:
                    application.unique_id ??
                    application.uniqueId ??
                    application.id,

                agentId:
                    application.agentId ??
                    application.agent_id ??
                    application.agent_context_id,
            },
        )
    }, [])


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            <PendingApplicationsTable
                applications={filteredApplications}
                currentPage={currentPage}
                pageSize={pageSize}
                totalApplications={totalApplications}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                loading={loading}

                search={search}
                setSearch={setSearch}

                statuses={STATUS_OPTIONS}

                selectedLoanType={selectedLoanType}
                setSelectedLoanType={setSelectedLoanType}

                selectedRM={selectedRM}
                setSelectedRM={setSelectedRM}

                selectedTeamLead={selectedTeamLead}
                setSelectedTeamLead={setSelectedTeamLead}

                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}

                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}

                onLoanTypeChange={handleLoanTypeChange}
                onStatusChange={handleStatusChange}
                onReminder={handleReminder}
                onClearFilters={handleClearFilters}
                onRefresh={handleRefresh}
                onViewApplication={handleViewApplication}
                onChat={handleChat}
            />

            <Suspense fallback={null}>
                {showLoanTypeModal && (
                    <LoanTypeModal
                        open={showLoanTypeModal}
                        application={selectedApplication}
                        onClose={handleCloseLoanTypeModal}
                        onSubmit={handleLoanTypeSubmit}
                    />
                )}

                {showStatusModal && (
                    <StatusModal
                        open={showStatusModal}
                        application={selectedApplication}
                        onClose={handleCloseStatusModal}
                        onSubmit={handleStatusSubmit}
                    />
                )}

                {showReminderModal && (
                    <ReminderModal
                        open={showReminderModal}
                        applicationId={
                            selectedApplication?.id ?? null
                        }
                        application={selectedApplication}
                        onClose={handleCloseReminderModal}
                        onSubmit={handleReminderSubmit}
                    />
                )}
            </Suspense>
        </>
    )
}


export default PendingApplications