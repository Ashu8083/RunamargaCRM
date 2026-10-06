import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActiveContext, getStoredUser } from '../../../../app/auth'

import ApplicationsTable from './components/ApplicationsTable'

import LoanTypeModal from '../../../../components/GlobalModels/Loans/LoanTypeModal'
import StatusModal from '../../../../components/GlobalModels/Loans/StatusModal'
import ReminderModal from '../../../../components/GlobalModels/Loans/ReminderModal'

import {
    getApplications,
    updateApplicationLoanType,
    updateApplicationStatus,
} from './Api'

import { useToast } from '../../../../components/Toast/ToastProvider'

function Applications() {
    const navigate = useNavigate()

    const {
        showSuccess,
        showError,
    } = useToast()

    // =========================================================
    // CONSTANTS
    // =========================================================

    const STATUS_OPTIONS = [
        { label: 'In Process', value: 'inprocess' },
        { label: 'Docs Pending', value: 'docspending' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Sanctioned', value: 'sanctioned' },
        { label: 'Disbursed', value: 'disbursed' },
        { label: 'Login', value: 'login' },
        { label: 'Revert Rejected', value: 'revert_rejected' },
    ]

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [totalApplications, setTotalApplications] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedTeamLead, setSelectedTeamLead] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')

    // =========================================================
    // SELECTED APPLICATION
    // =========================================================

    const [selectedApplication, setSelectedApplication] =
        useState(null)

    // =========================================================
    // MODAL STATE
    // =========================================================

    const [showLoanTypeModal, setShowLoanTypeModal] =
        useState(false)

    const [showStatusModal, setShowStatusModal] =
        useState(false)

    const [showReminderModal, setShowReminderModal] =
        useState(false)

    // =========================================================
    // STATUS NORMALIZER
    // =========================================================

    const normalizeStatus = (status) => {
        const value = String(status || '')
            .trim()
            .toLowerCase()
            .replace(/[_-]/g, ' ')

        if (
            value === 'revert rejected' ||
            value === 'reverted rejected' ||
            value === 'revert reject'
        ) {
            return 'Revert Rejected'
        }

        if (
            value === 'rejected' ||
            value === 'reject'
        ) {
            return 'Rejected'
        }

        if (
            value === 'inprocess' ||
            value === 'in process' ||
            value === 'in progress' ||
            value === 'processing'
        ) {
            return 'In Process'
        }

        if (
            value === 'docspending' ||
            value === 'docs pending' ||
            value === 'documents pending' ||
            value === 'document pending'
        ) {
            return 'Docs Pending'
        }

        if (
            value === 'sanctioned' ||
            value === 'sanction'
        ) {
            return 'Sanctioned'
        }

        if (
            value === 'disbursed' ||
            value === 'disbursement'
        ) {
            return 'Disbursed'
        }

        return String(status || '')
    }

    // =========================================================
    // FETCH APPLICATIONS
    // =========================================================

    const fetchApplications = async (
        page = currentPage,
        size = pageSize,
        searchValue = search,
    ) => {
        const activeContext = getActiveContext()

        if (!activeContext?.id) {
            setApplications([])
            setTotalApplications(0)
            setTotalPages(1)
            return
        }

        try {
            setLoading(true)

            const response = await getApplications(
                activeContext.id,
                page,
                size,
                null,
                searchValue,
                selectedLoanType,
                selectedRM,
                selectedTeamLead,
                selectedAgent,
                selectedStatus,
            );

            const data = Array.isArray(response?.data)
                ? response.data
                : []

            const mappedApplications = data.map((application) => ({
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

                name: application.name ?? '',
                phone: application.phone ?? '',
                email: application.email ?? '',

                gender: application.gender,

                alternatePhone:
                    application.alternate_phone ??
                    application.alternatePhone,

                alternateEmail:
                    application.alternate_email ??
                    application.alternateEmail,

                maritalStatus:
                    application.marital_status ??
                    application.maritalStatus,

                dob: application.dob,

                loanTypeId:
                    application.loan_type_id ??
                    application.loanTypeId,

                loan_type_id:
                    application.loan_type_id ??
                    application.loanTypeId,

                amount:
                    application.loan_amt ??
                    application.loanAmount ??
                    application.amount,

                loan_amt: application.loan_amt,

                loanTenure:
                    application.loan_tenure ??
                    application.loanTenure,

                loanPurpose:
                    application.loan_purpose ??
                    application.loanPurpose,

                creditScore:
                    application.credit_score ??
                    application.creditScore,

                referral: application.referral ?? '',

                appliedById:
                    application.applied_by_id ??
                    application.appliedById,

                appliedBy:
                    application.applied_by ??
                    application.appliedBy,

                agentId:
                    application.agent_id ??
                    application.agentId ??
                    application.agent_context_id ??
                    application.processingAgentId ??
                    application.processing_agent_id,

                agent_id:
                    application.agent_id ??
                    application.agentId ??
                    application.agent_context_id,

                agent_context_id:
                    application.agent_context_id ??
                    application.agent_id ??
                    application.agentId,

                agent:
                    application.agent ?? null,

                agentName:
                    application.agent_name ??
                    application.agentName ??
                    application.agent?.name ??
                    application.processingAgent?.name ??
                    '',

                agent_name:
                    application.agent_name ??
                    application.agentName ??
                    application.agent?.name ??
                    '',

                rmId:
                    application.rm_id ??
                    application.rmId,

                rm_id:
                    application.rm_id ??
                    application.rmId,

                rm:
                    application.rm ?? null,

                rmName:
                    application.rm_name ??
                    application.rmName ??
                    application.rm?.name ??
                    '',

                rm_name:
                    application.rm_name ??
                    application.rmName ??
                    application.rm?.name ??
                    '',

                teamLeadId:
                    application.team_lead_id ??
                    application.teamLeadId,

                team_lead_id:
                    application.team_lead_id ??
                    application.teamLeadId,

                teamLeadName:
                    application.team_lead_name ??
                    application.teamLeadName,

                team_lead_name:
                    application.team_lead_name ??
                    application.teamLeadName,

                loanType:
                    application.loan_type ??
                    application.loanType,

                status:
                    application.status ??
                    '',

                appliedDate:
                    application.applied_date ??
                    application.appliedDate ??
                    '',

                sanctionDate:
                    application.sanction_date ??
                    application.sanctionDate,

                rejectionDate:
                    application.rejection_date ??
                    application.rejectionDate,

                loggedinDate:
                    application.loggedin_date ??
                    application.loggedinDate,

                docsPendingDate:
                    application.docspending_date ??
                    application.docsPendingDate,

                revertedStatus:
                    application.reverted_status ??
                    application.revertedStatus,

                revertedReason:
                    application.reverted_reason ??
                    application.revertedReason ??
                    '',

                revertedDate:
                    application.reverted_date ??
                    application.revertedDate ??
                    null,

                revertedByName:
                    application.reverted_by_name ??
                    application.revertedByName ??
                    '',

                revertedByRole:
                    application.reverted_by_role ??
                    application.revertedByRole ??
                    '',

                rejectionReason:
                    application.rejected_remarks ??
                    application.rejection_reason ??
                    application.rejectionReason ??
                    '',

                rejectedRemarks:
                    application.rejected_remarks ??
                    application.rejectedRemarks ??
                    '',

                stateId:
                    application.state_id ??
                    application.stateId,

                cityId:
                    application.city_id ??
                    application.cityId,

                languageId:
                    application.language_id ??
                    application.languageId,

                ivrId:
                    application.ivr_id ??
                    application.ivrId,

                createdAt:
                    application.created_at ??
                    application.createdAt,

                updatedAt:
                    application.updated_at ??
                    application.updatedAt,
            }))

            setApplications(mappedApplications)

            setTotalApplications(
                Number(response?.count ?? 0)
            )

            setTotalPages(
                Number(response?.total_pages ?? 1)
            )
        } catch (error) {
            console.error(
                'Failed to fetch applications:',
                error
            )

            setApplications([])
            setTotalApplications(0)
            setTotalPages(1)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1)

            fetchApplications(
                1,
                pageSize,
                search,
            )
        }, 400)

        return () => clearTimeout(timer)
    }, [
        search,
        selectedLoanType,
        selectedRM,
        selectedTeamLead,
        selectedAgent,
        selectedStatus,
    ])
    // =========================================================
    // PAGE CONTROLS
    // =========================================================

    const handlePageChange = (page) => {
        const nextPage = Math.max(
            1,
            Math.min(Number(page), totalPages || 1),
        )

        setCurrentPage(nextPage)
        fetchApplications(nextPage, pageSize)
    }

    const handlePageSizeChange = (size) => {
        const nextSize = Number(size) || 10

        setPageSize(nextSize)
        setCurrentPage(1)
        fetchApplications(1, nextSize)
    }

    // =========================================================
    // INITIAL LOAD + CONTEXT CHANGE
    // =========================================================

    useEffect(() => {

        const handleContextChange = () => {
            setSearch('')
            setSelectedLoanType('')
            setSelectedRM('')
            setSelectedTeamLead('')
            setSelectedAgent('')
            setSelectedStatus('')
            setCurrentPage(1)

            fetchApplications(1, pageSize)
        }

        window.addEventListener(
            'auth:changed',
            handleContextChange
        )

        return () => {
            window.removeEventListener(
                'auth:changed',
                handleContextChange
            )
        }
    }, [])

    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()

        return applications.filter(
            (application) => {

                // =================================================
                // SEARCH
                // =================================================

                if (searchValue) {

                    const searchableFields = [

                        application.name,

                        application.phone,

                        application.email,

                        application.loanType,

                        application.status,

                        application.loanId,

                        application.id,

                        application.appliedBy,

                        application.applied_by,

                        application.referral,

                        application.referralName,

                        application.referral_name,

                        application.referredBy,

                        application.referred_by,

                        application.rmName,

                        application.rm_name,

                        application.rm?.name,

                        application.processingAgent,

                        application.processing_agent,

                        application.agentName,

                        application.agent_name,

                        application.agent?.name,

                        application.teamLeadName,

                        application.team_lead_name,

                        application.teamLead?.name,

                        application.team_lead?.name,
                    ]

                    const matchesSearch =
                        searchableFields.some(
                            (field) =>
                                field !== null &&
                                field !== undefined &&
                                String(field)
                                    .toLowerCase()
                                    .includes(searchValue)
                        )

                    if (!matchesSearch) {
                        return false
                    }
                }


                // =================================================
                // LOAN TYPE
                // =================================================

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


                // =================================================
                // RM
                // =================================================

                if (selectedRM) {

                    const applicationRM =
                        application.rmId ??
                        application.rm_id ??
                        application.rm?.id ??
                        application.rmName ??
                        application.rm_name ??
                        application.rm

                    if (
                        String(applicationRM) !==
                        String(selectedRM)
                    ) {
                        return false
                    }
                }


                // =================================================
                // TEAM LEAD
                // =================================================

                if (selectedTeamLead) {

                    const applicationTeamLead =
                        application.teamLeadId ??
                        application.team_lead_id ??
                        application.teamLead?.id ??
                        application.teamLeadName ??
                        application.team_lead_name ??
                        application.team_lead

                    if (
                        String(applicationTeamLead) !==
                        String(selectedTeamLead)
                    ) {
                        return false
                    }
                }


                // =================================================
                // AGENT
                // =================================================

                if (selectedAgent) {

                    const applicationAgent =
                        application.agentId ??
                        application.agent_id ??
                        application.processingAgentId ??
                        application.processing_agent_id ??
                        application.agent?.id ??
                        application.processingAgent?.id ??
                        application.agentName ??
                        application.agent_name ??
                        application.processingAgent ??
                        application.processing_agent

                    if (
                        String(applicationAgent) !==
                        String(selectedAgent)
                    ) {
                        return false
                    }
                }


                // =================================================
                // STATUS
                // =================================================

                if (selectedStatus) {
                    const applicationStatus =
                        normalizeStatus(
                            application.status
                        ) === 'Rejected' &&
                            application.revertedReason
                            ? 'Revert Rejected'
                            : normalizeStatus(
                                application.status
                            )
                    if (
                        applicationStatus !==
                        selectedStatus
                    ) {
                        return false
                    }
                }


                // =================================================
                // MATCH
                // =================================================

                return true
            }
        )

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
    // DISPLAY DATA
    // =========================================================

    // The API is paginated, so only the current server page is in
    // memory. Local filtering can therefore only filter that page.
    // Server-side filtering should be added to the API before using
    // these filters for cross-page searching.
    const displayApplications = filteredApplications

    const hasLocalFilters =
        Boolean(search.trim()) ||
        Boolean(selectedLoanType) ||
        Boolean(selectedRM) ||
        Boolean(selectedTeamLead) ||
        Boolean(selectedAgent) ||
        Boolean(selectedStatus)

    const displayTotalApplications = totalApplications

    const displayTotalPages = totalPages
    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {
        setSearch('')
        setSelectedLoanType('')
        setSelectedRM('')
        setSelectedTeamLead('')
        setSelectedAgent('')
        setSelectedStatus('')
    }

    // =========================================================
    // LOAN TYPE MODAL
    // =========================================================

    const handleLoanTypeChange = (application) => {
        setSelectedApplication(application)
        setShowLoanTypeModal(true)
    }

    const handleCloseLoanTypeModal = () => {
        setShowLoanTypeModal(false)
        setSelectedApplication(null)
    }

    const handleLoanTypeSubmit = async (data) => {
        try {
            const response = await updateApplicationLoanType(
                data.applicationId,
                data.loanTypeId
            )

            const updatedApplication = response?.data

            setApplications((previous) =>
                previous.map((application) =>
                    application.id === data.applicationId
                        ? {
                            ...application,
                            loanTypeId:
                                updatedApplication?.loan_type_id ??
                                data.loanTypeId,
                            updatedAt:
                                updatedApplication?.updated_at ??
                                new Date().toISOString(),
                        }
                        : application
                )
            )

            handleCloseLoanTypeModal()

            showSuccess(
                'Loan type updated successfully'
            )
        } catch (error) {
            console.error(
                'Failed to update loan type:',
                error
            )

            showError(
                error?.response?.data?.detail ||
                'Failed to update loan type',
                'error'
            )
        }
    }

    // =========================================================
    // STATUS MODAL
    // =========================================================

    const handleStatusChange = (application) => {
        setSelectedApplication(application)
        setShowStatusModal(true)
    }

    const handleCloseStatusModal = () => {
        setShowStatusModal(false)
        setSelectedApplication(null)
    }

    const handleStatusSubmit = async (data) => {
        try {
            const isRevertRejected =
                data.status === 'Revert Rejected'

            const rejectedRemarks =
                data.status === 'Rejected'
                    ? data.rejectionReason
                    : isRevertRejected
                        ? data.revertRejectedReason
                        : null

            const revertRejectionDate =
                isRevertRejected
                    ? data.revertRejectedDate
                    : null

            const response = await updateApplicationStatus(
                data.id,
                data.status,
                rejectedRemarks,
                revertRejectionDate
            )

            const updatedApplication = response?.data

            setApplications((previous) =>
                previous.map((application) =>
                    application.id === data.id
                        ? {
                            ...application,

                            // Revert Rejected is stored
                            // as rejected in the database.
                            status:
                                updatedApplication?.status ??
                                (
                                    isRevertRejected
                                        ? 'rejected'
                                        : data.status
                                ),

                            rejectionReason:
                                updatedApplication?.rejected_remarks ??
                                rejectedRemarks ??
                                '',

                            rejected_remarks:
                                updatedApplication?.rejected_remarks ??
                                rejectedRemarks ??
                                '',

                            rejectionDate:
                                updatedApplication?.rejection_date ??
                                application.rejectionDate,

                            updatedAt:
                                updatedApplication?.updated_at ??
                                new Date().toISOString(),
                        }
                        : application
                )
            )

            handleCloseStatusModal()

            await fetchApplications()

            showSuccess(
                isRevertRejected
                    ? 'Application rejection reverted successfully'
                    : 'Application status updated successfully'
            )
        } catch (error) {
            console.error(
                'Failed to update application status:',
                error
            )

            const detail = error?.response?.data?.detail

            const errorMessage =
                Array.isArray(detail)
                    ? detail
                        .map((item) => item?.msg)
                        .filter(Boolean)
                        .join(', ')
                    : typeof detail === 'string'
                        ? detail
                        : 'Failed to update application status'

            showError(errorMessage, 'error')
        }
    }

    // =========================================================
    // REMINDER MODAL
    // =========================================================

    const handleReminder = (application) => {
        setSelectedApplication(application)
        setShowReminderModal(true)
    }

    const handleCloseReminderModal = () => {
        setShowReminderModal(false)
        setSelectedApplication(null)
    }

    const handleReminderSubmit = (reminder) => {
        // Reminder creation is handled directly inside
        // ReminderModal.jsx. This callback runs after success.
        console.log(
            'Reminder created successfully:',
            reminder
        )
    }

    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication = (application) => {
        navigate(
            `/crm/view-application/${application.unique_id}`
        )
    }

    // =========================================================
    // CHAT
    // =========================================================

    const handleChat = (application) => {
        console.log(
            'Open Application Chat:',
            {
                loanId:
                    application.unique_id ||
                    application.id,

                agentId:
                    application.agentId ||
                    application.agent_id,
            }
        )
    }

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {
        fetchApplications(currentPage, pageSize)
    }

    // =========================================================
    // ASSIGNMENT CHANGE
    // =========================================================

    const handleAssignmentChange = (
        applicationId,
        updatedApplication
    ) => {
        setApplications((previous) =>
            previous.map((application) => {
                if (application.id !== applicationId) {
                    return application
                }

                return {
                    ...application,
                    ...updatedApplication,

                    rmId:
                        updatedApplication?.rmId ??
                        updatedApplication?.rm_id ??
                        application.rmId,

                    rm_id:
                        updatedApplication?.rm_id ??
                        updatedApplication?.rmId ??
                        application.rm_id,

                    rm:
                        updatedApplication?.rm ??
                        application.rm,

                    rmName:
                        updatedApplication?.rmName ??
                        updatedApplication?.rm_name ??
                        application.rmName,

                    agentId:
                        updatedApplication?.agentId ??
                        updatedApplication?.agent_id ??
                        application.agentId,

                    agent_id:
                        updatedApplication?.agent_id ??
                        updatedApplication?.agentId ??
                        application.agent_id,

                    agent:
                        updatedApplication?.agent ??
                        application.agent,

                    agentName:
                        updatedApplication?.agentName ??
                        updatedApplication?.agent_name ??
                        application.agentName,
                }
            })
        )
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="p-4 sm:p-6 space-y-5">
            <ApplicationsTable
                applications={displayApplications}

                currentPage={currentPage}
                pageSize={pageSize}
                totalApplications={displayTotalApplications}
                totalPages={displayTotalPages}

                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}

                search={search}
                setSearch={setSearch}

                statuses={STATUS_OPTIONS}

                // LOAN TYPE

                selectedLoanType={selectedLoanType}
                setSelectedLoanType={setSelectedLoanType}

                // RM

                selectedRM={selectedRM}
                setSelectedRM={setSelectedRM}

                // TEAM LEAD

                selectedTeamLead={selectedTeamLead}
                setSelectedTeamLead={setSelectedTeamLead}

                // AGENT

                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}

                // STATUS

                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}

                // ACTIONS

                onClearFilters={handleClearFilters}
                onLoanTypeChange={handleLoanTypeChange}
                onStatusChange={handleStatusChange}
                onReminder={handleReminder}
                onChat={handleChat}
                onViewApplication={handleViewApplication}
                onRefresh={handleRefresh}
                onAssignmentChange={handleAssignmentChange}
            />

            {/* =================================================
                LOAN TYPE MODAL
            ================================================= */}

            <LoanTypeModal
                open={showLoanTypeModal}
                application={selectedApplication}
                onClose={handleCloseLoanTypeModal}
                onSubmit={handleLoanTypeSubmit}
            />

            {/* =================================================
                STATUS MODAL
            ================================================= */}

            <StatusModal
                open={showStatusModal}
                application={selectedApplication}
                onClose={handleCloseStatusModal}
                onSubmit={handleStatusSubmit}
            />

            {/* =================================================
                REMINDER MODAL
            ================================================= */}

            <ReminderModal
                open={showReminderModal}

                applicationId={
                    selectedApplication?.id ?? null
                }

                application={selectedApplication}

                onClose={handleCloseReminderModal}
                onSubmit={handleReminderSubmit}
            />
        </div>
    )
}

export default Applications