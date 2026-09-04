import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveContext } from '../../../app/auth'

import ApplicationsTable from './components/ApplicationsTable'

import LoanTypeModal from '../../../components/GlobalModels/Loans/LoanTypeModal'
import StatusModal from '../../../components/GlobalModels/Loans/StatusModal'
import ReminderModal from '../../../components/GlobalModels/Loans/ReminderModal'
import {
    getApplications,
    updateApplicationLoanType,
    updateApplicationStatus,
} from '../../../services/applicationService'
import { useToast } from '../../../components/Toast/ToastProvider'
import {
    getLoanTypes,
    getEmployeesByContext,
} from '../../../services/commonservice'

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
        'Revert Rejected',
        'Rejected',
        'In Process',
        'Docs Pending',
        'Sanctioned',
        'Disbursed',
    ]


    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)


    // =========================================================
    // FILTER DATA
    // =========================================================

    const [loanTypes, setLoanTypes] = useState([])
    const [rms, setRms] = useState([])
    const [agents, setAgents] = useState([])
    const [teamLeads, setTeamLeads] = useState([])


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

    const fetchApplications = async () => {

        const activeContext = getActiveContext()

        if (!activeContext?.id) {
            setApplications([])
            return
        }

        try {

            setLoading(true)

            const response =
                await getApplications(
                    activeContext.id
                )

            const data =
                response?.data || []

            const mappedApplications =
                data.map((application) => ({
                    id: application.id,

                    loanId:
                        application.unique_id ||
                        application.id,

                    name:
                        application.name || '',

                    phone:
                        application.phone || '',

                    email:
                        application.email || '',

                    gender:
                        application.gender,

                    alternatePhone:
                        application.alternate_phone,

                    alternateEmail:
                        application.alternate_email,

                    maritalStatus:
                        application.marital_status,

                    dob:
                        application.dob,

                    loanTypeId:
                        application.loan_type_id,

                    amount:
                        application.loan_amt,

                    loanTenure:
                        application.loan_tenure,

                    loanPurpose:
                        application.loan_purpose,

                    creditScore:
                        application.credit_score,

                    referral:
                        application.referral || '',

                    appliedById:
                        application.applied_by_id,

                    appliedBy:
                        application.applied_by,

                    agentId:
                        application.agent_id,

                    agent:
                        application.agent,

                    agentName:
                        application.agent_name ??
                        application.agent?.name,

                    rmId:
                        application.rm_id,

                    rm:
                        application.rm,

                    rmName:
                        application.rm_name ??
                        application.rm?.name,

                    teamLeadId:
                        application.team_lead_id ??
                        application.teamLeadId,

                    teamLeadName:
                        application.team_lead_name ??
                        application.teamLeadName,

                    loanType:
                        application.loan_type ??
                        application.loanType,

                    status:
                        application.reverted_reason
                            ? 'Revert Rejected'
                            : application.status || '',
                    appliedDate:
                        application.applied_date || '',

                    sanctionDate:
                        application.sanction_date,

                    rejectionDate:
                        application.rejection_date,

                    loggedinDate:
                        application.loggedin_date,

                    docsPendingDate:
                        application.docspending_date,
                    revertedStatus:
                        application.reverted_status,

                    revertedReason:
                        application.reverted_reason ?? '',

                    revertedDate:
                        application.reverted_date ?? null,

                    revertedByName:
                        application.reverted_by_name ?? '',

                    revertedByRole:
                        application.reverted_by_role ?? '',

                    stateId:
                        application.state_id,

                    cityId:
                        application.city_id,

                    languageId:
                        application.language_id,

                    ivrId:
                        application.ivr_id,

                    createdAt:
                        application.created_at,

                    updatedAt:
                        application.updated_at,

                    rejectionReason:
                        application.rejected_remarks ??
                        application.rejection_reason ??
                        application.rejectionReason,

                    rejectedRemarks:
                        application.rejected_remarks ??
                        '',
                }))

            setApplications(
                mappedApplications
            )

        } catch (error) {

            console.error(
                'Failed to fetch applications:',
                error
            )

            setApplications([])

        } finally {

            setLoading(false)

        }
    }

    // =========================================================
    // FETCH DROPDOWN DATA
    // =========================================================

    const fetchDropdownData = async () => {

        try {

            const activeContext =
                getActiveContext()

            if (!activeContext?.id) {
                return
            }

            const [
                loanTypesData,
                rmData,
                agentData,
            ] = await Promise.all([
                getLoanTypes(),
                getEmployeesByContext(3),
                getEmployeesByContext(2),
            ])

            setLoanTypes(
                loanTypesData || []
            )

            setRms(
                rmData || []
            )

            setAgents(
                agentData || []
            )

            // Team Lead context does not currently
            // exist in the database.
            setTeamLeads([])

        } catch (error) {

            console.error(
                'Failed to fetch application dropdown data:',
                error
            )

            setLoanTypes([])
            setRms([])
            setAgents([])
            setTeamLeads([])

        }
    }


    // =========================================================
    // INITIAL LOAD + CONTEXT CHANGE
    // =========================================================

    useEffect(() => {

        fetchApplications()
        fetchDropdownData()

        const handleContextChange = () => {

            // Clear filters when switching context.
            setSearch('')
            setSelectedLoanType('')
            setSelectedRM('')
            setSelectedTeamLead('')
            setSelectedAgent('')
            setSelectedStatus('')

            fetchApplications()
            fetchDropdownData()
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

            const response =
                await updateApplicationLoanType(
                    data.applicationId,
                    data.loanTypeId
                )

            const updatedApplication =
                response?.data

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

            const response =
                await updateApplicationStatus(
                    data.id,
                    data.status,
                    rejectedRemarks,
                    revertRejectionDate
                )

            const updatedApplication =
                response?.data

            setApplications((previous) =>
                previous.map((application) =>
                    application.id === data.id
                        ? {
                            ...application,

                            // Revert Rejected is stored
                            // as rejected in DB.
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

            const detail =
                error?.response?.data?.detail

            const errorMessage =
                Array.isArray(detail)
                    ? detail
                        .map((item) => item?.msg)
                        .filter(Boolean)
                        .join(', ')
                    : typeof detail === 'string'
                        ? detail
                        : 'Failed to update application status'

            showError(
                errorMessage,
                'error'
            )
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


    const handleReminderSubmit = (data) => {

        /*
         * Later:
         *
         * POST /applications/{applicationId}/reminders
         */

        console.log(
            'Application Reminder:',
            data
        )

        handleCloseReminderModal()

    }


    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication = (application) => {

        navigate(
            `/crm/view-application/${application.id}`
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

        fetchApplications()

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                p-4
                sm:p-6
                space-y-5
            "
        >

            <ApplicationsTable

                applications={
                    filteredApplications
                }

                loading={loading}

                search={search}
                setSearch={setSearch}

                loanTypes={loanTypes}

                rms={rms}

                teamLeads={teamLeads}

                agents={agents}

                statuses={
                    STATUS_OPTIONS
                }


                // =============================================
                // LOAN TYPE
                // =============================================

                selectedLoanType={
                    selectedLoanType
                }

                setSelectedLoanType={
                    setSelectedLoanType
                }


                // =============================================
                // RM
                // =============================================

                selectedRM={
                    selectedRM
                }

                setSelectedRM={
                    setSelectedRM
                }


                // =============================================
                // TEAM LEAD
                // =============================================

                selectedTeamLead={
                    selectedTeamLead
                }

                setSelectedTeamLead={
                    setSelectedTeamLead
                }


                // =============================================
                // AGENT
                // =============================================

                selectedAgent={
                    selectedAgent
                }

                setSelectedAgent={
                    setSelectedAgent
                }


                // =============================================
                // STATUS
                // =============================================

                selectedStatus={
                    selectedStatus
                }

                setSelectedStatus={
                    setSelectedStatus
                }


                // =============================================
                // ACTIONS
                // =============================================

                onClearFilters={
                    handleClearFilters
                }

                onLoanTypeChange={
                    handleLoanTypeChange
                }

                onStatusChange={
                    handleStatusChange
                }

                onReminder={
                    handleReminder
                }

                onChat={
                    handleChat
                }

                onViewApplication={
                    handleViewApplication
                }

                onRefresh={
                    handleRefresh
                }

            />


            {/* =================================================
                LOAN TYPE MODAL
            ================================================= */}

            <LoanTypeModal
                open={showLoanTypeModal}
                application={selectedApplication}
                loanTypes={loanTypes}
                onClose={handleCloseLoanTypeModal}
                onSubmit={handleLoanTypeSubmit}
            />


            {/* =================================================
                STATUS MODAL
            ================================================= */}

            <StatusModal

                open={
                    showStatusModal
                }

                application={
                    selectedApplication
                }

                onClose={
                    handleCloseStatusModal
                }

                onSubmit={
                    handleStatusSubmit
                }

            />


            {/* =================================================
                REMINDER MODAL
            ================================================= */}

            <ReminderModal

                open={
                    showReminderModal
                }

                application={
                    selectedApplication
                }

                onClose={
                    handleCloseReminderModal
                }

                onSubmit={
                    handleReminderSubmit
                }

            />

        </div>

    )
}


export default Applications