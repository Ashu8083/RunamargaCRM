// admin-react/src/pages/crm/Loans/CombinedApplications/index.jsx

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActiveContext, getStoredUser } from '../../../../app/auth'

import ApplicationsTable from './components/ApplicationsTable'

import LoanTypeModal from '../../../../components/GlobalModels/Loans/LoanTypeModal'
import StatusModal from '../../../../components/GlobalModels/Loans/StatusModal'
import ReminderModal from '../../../../components/GlobalModels/Loans/ReminderModal'
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'
import {
    getApplications,
    updateApplicationLoanType,
    updateApplicationStatus, deleteApplication
} from './Api'

const INITIAL_FEEDBACK = {
    open: false,
    type: 'success',
    title: '',
    message: '',
}

const getOperationErrorMessage = (
    error,
    fallbackMessage
) => {
    const detail = error?.response?.data?.detail

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.msg || item?.message
            )
            .filter(Boolean)

        if (messages.length) {
            return messages.join(', ')
        }
    }

    if (typeof detail === 'string' && detail) {
        return detail
    }

    if (detail && typeof detail === 'object') {
        const detailMessage =
            detail.message || detail.msg

        if (typeof detailMessage === 'string' && detailMessage) {
            return detailMessage
        }
    }

    const message = error?.response?.data?.message

    return typeof message === 'string' && message
        ? message
        : fallbackMessage
}

function Applications() {
    const navigate = useNavigate()

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

    const [feedback, setFeedback] =
        useState(INITIAL_FEEDBACK)

    const closeFeedback = () => {
        setFeedback(INITIAL_FEEDBACK)
    }

    const openSuccessFeedback = (
        title,
        message
    ) => {
        setFeedback({
            open: true,
            type: 'success',
            title,
            message,
        })
    }

    const openErrorFeedback = (
        title,
        error,
        fallbackMessage
    ) => {
        setFeedback({
            open: true,
            type: 'error',
            title,
            message: getOperationErrorMessage(
                error,
                fallbackMessage
            ),
        })
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

                // Keep the database primary key explicit for reminder creation.
                applicationId: application.id,

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
                    application.processing_agent_id ??
                    application.agent?.id ??
                    application.processingAgent?.id ??
                    application.processing_agent?.id,

                agent_id:
                    application.agent_id ??
                    application.agentId ??
                    application.agent_context_id ??
                    application.processingAgentId ??
                    application.processing_agent_id ??
                    application.agent?.id ??
                    application.processingAgent?.id ??
                    application.processing_agent?.id,

                agent_context_id:
                    application.agent_context_id ??
                    application.agent_id ??
                    application.agentId ??
                    application.processingAgentId ??
                    application.processing_agent_id ??
                    application.agent?.id ??
                    application.processingAgent?.id ??
                    application.processing_agent?.id,

                agent:
                    application.agent ??
                    application.processingAgent ??
                    application.processing_agent ??
                    null,

                processingAgent:
                    application.processingAgent ??
                    application.agent ??
                    null,

                processing_agent:
                    application.processing_agent ??
                    application.processingAgent ??
                    null,

                agentName:
                    application.agent_name ??
                    application.agentName ??
                    application.agent?.name ??
                    application.processingAgent?.name ??
                    application.processing_agent?.name ??
                    (typeof application.processingAgent === 'string'
                        ? application.processingAgent
                        : null) ??
                    (typeof application.processing_agent === 'string'
                        ? application.processing_agent
                        : null) ??
                    '',

                agent_name:
                    application.agent_name ??
                    application.agentName ??
                    application.agent?.name ??
                    application.processingAgent?.name ??
                    application.processing_agent?.name ??
                    (typeof application.processingAgent === 'string'
                        ? application.processingAgent
                        : null) ??
                    (typeof application.processing_agent === 'string'
                        ? application.processing_agent
                        : null) ??
                    '',

                rmId:
                    application.rm_id ??
                    application.rmId ??
                    application.rm_context_id ??
                    application.rm?.id,

                rm_id:
                    application.rm_id ??
                    application.rmId ??
                    application.rm_context_id ??
                    application.rm?.id,

                rm_context_id:
                    application.rm_context_id ??
                    application.rm_id ??
                    application.rmId ??
                    application.rm?.id,

                rm:
                    application.rm ?? null,

                rmName:
                    application.rm_name ??
                    application.rmName ??
                    application.rm?.name ??
                    (typeof application.rm === 'string'
                        ? application.rm
                        : null) ??
                    '',

                rm_name:
                    application.rm_name ??
                    application.rmName ??
                    application.rm?.name ??
                    (typeof application.rm === 'string'
                        ? application.rm
                        : null) ??
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
    // DISPLAY DATA
    // =========================================================

    // The API is paginated, so only the current server page is in
    // memory. Local filtering can therefore only filter that page.
    // Server-side filtering should be added to the API before using
    // these filters for cross-page searching.
    const displayApplications = applications

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

    const handleDeleteApplication = async (application) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the application for ${application.name || "this customer"
            }?`
        );

        if (!confirmed) return;

        try {
            await deleteApplication(
                application.unique_id ?? application.id
            );

            openSuccessFeedback(
                'Application deleted',
                'The application was deleted successfully.'
            )

            // Refresh the current applications page.
            await fetchApplications(currentPage, pageSize, search);
        } catch (error) {
            console.error("Failed to delete application:", error);

            openErrorFeedback(
                'Unable to delete application',
                error,
                'Failed to delete application.'
            );
        }
    };
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
            openSuccessFeedback(
                'Loan type updated',
                'The loan type was updated successfully.'
            )

        } catch (error) {

            console.error(
                'Failed to update loan type:',
                error
            )

            openErrorFeedback(
                'Unable to update loan type',
                error,
                'Failed to update loan type.'
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

            openSuccessFeedback(
                isRevertRejected
                    ? 'Application rejection reverted'
                    : 'Application status updated',
                isRevertRejected
                    ? 'The application rejection was reverted successfully.'
                    : 'The application status was updated successfully.'
            )

        } catch (error) {

            console.error(
                'Failed to update application status:',
                error
            )

            openErrorFeedback(
                'Unable to update application status',
                error,
                'Failed to update application status.'
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

                if (
                    application.id !== applicationId
                ) {
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

    const handleAssignmentSuccess = (
        label = 'Assignment'
    ) => {
        openSuccessFeedback(
            `${label} updated`,
            `${label} was updated successfully.`
        )
    }

    const handleAssignmentError = (
        error,
        label = 'Assignment'
    ) => {
        openErrorFeedback(
            `Unable to update ${label}`,
            error,
            `Failed to update ${label.toLowerCase()}.`
        )
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

                onAssignmentChange={
                    handleAssignmentChange
                }
                onAssignmentSuccess={
                    handleAssignmentSuccess
                }
                onAssignmentError={
                    handleAssignmentError
                }
                onDeleteApplication={handleDeleteApplication}
                onRefresh={fetchApplications}
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

                applicationId={
                    selectedApplication?.applicationId ??
                    null
                }

                onClose={
                    handleCloseReminderModal
                }

                onSubmit={
                    handleReminderSubmit
                }

            />

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                autoClose={feedback.type === 'success'}
                onClose={closeFeedback}
            />

        </div>

    )
}


export default Applications
