import { useEffect, useMemo, useState } from 'react'

import apiClient from '../../../app/apiClient'
import { getActiveContext } from '../../../app/auth'

import ApplicationsTable from './components/ApplicationsTable'

import LoanTypeModal from '../../../components/GlobalModels/Loans/LoanTypeModal'
import StatusModal from '../../../components/GlobalModels/Loans/StatusModal'
import ReminderModal from '../../../components/GlobalModels/Loans/ReminderModal'
import {
    getLoanTypes,
    getEmployeesByContext,
} from '../../../services/commonservice'

function Applications() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchApplications = async () => {
        const activeContext = getActiveContext()

        if (!activeContext?.id) {
            setApplications([])
            return
        }

        try {
            setLoading(true)

            const response = await apiClient.get(
                '/applications',
                {
                    params: {
                        context_id: activeContext.id,
                    },
                }
            )

            const data = response.data?.data || []

            const mappedApplications = data.map(
                (application) => ({
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

                    status:
                        application.status || '',

                    appliedDate:
                        application.applied_date || '',

                    appliedById:
                        application.applied_by_id,

                    referral:
                        application.referral || '',

                    agentId:
                        application.agent_id,

                    rmId:
                        application.rm_id,
                })
            )

            setApplications(mappedApplications)

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
    useEffect(() => {
        fetchApplications()
        fetchDropdownData()

        const handleContextChange = () => {
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
    // FILTER STATE
    // =========================================================
    const [loanTypes, setLoanTypes] =
        useState([])

    const [rms, setRms] =
        useState([])

    const [agents, setAgents] =
        useState([])

    const [teamLeads, setTeamLeads] =
        useState([])
    const [search, setSearch] = useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedTeamLead, setSelectedTeamLead] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')
    // =========================================================
    // SELECTED APPLICATION
    // =========================================================

    const [selectedApplication, setSelectedApplication] =
        useState(null)


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const value = search.trim().toLowerCase()

        return applications.filter((application) => {

            if (
                value &&
                ![
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


            if (
                selectedLoanType &&
                application.loanType !== selectedLoanType
            ) {
                return false
            }


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
                    application.processing_agent ??
                    application.agent?.name

                if (
                    String(applicationAgent) !==
                    String(selectedAgent)
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
        selectedAgent,
    ])

    const fetchDropdownData = async () => {
        try {
            const activeContext = getActiveContext()

            if (!activeContext?.id) {
                return
            }

            const [loanTypesData, rmData, agentData] =
                await Promise.all([
                    getLoanTypes(),
                    getEmployeesByContext(3),
                    getEmployeesByContext(2),
                ])

            setLoanTypes(loanTypesData || [])
            setRms(rmData || [])
            setAgents(agentData || [])
        } catch (error) {
            console.error(
                'Failed to fetch application dropdown data:',
                error
            )

            setLoanTypes([])
            setRms([])
            setAgents([])
        }
    }
    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        setSearch('')
        setSelectedLoanType('')
        setSelectedAgent('')

    }


    // =========================================================
    // LOAN TYPE MODAL
    // =========================================================

    const [showLoanTypeModal, setShowLoanTypeModal] =
        useState(false)

    const handleLoanTypeChange = (application) => {

        setSelectedApplication(application)
        setShowLoanTypeModal(true)

    }

    const handleCloseLoanTypeModal = () => {

        setShowLoanTypeModal(false)
        setSelectedApplication(null)

    }

    const handleLoanTypeSubmit = (data) => {

        setApplications((previous) =>
            previous.map((application) =>
                application.id === data.id
                    ? {
                        ...application,
                        loanType: data.loanType,
                        updatedAt: new Date().toISOString(),
                    }
                    : application
            )
        )

        handleCloseLoanTypeModal()

    }


    // =========================================================
    // STATUS MODAL
    // =========================================================

    const [showStatusModal, setShowStatusModal] =
        useState(false)

    const handleStatusChange = (application) => {

        setSelectedApplication(application)
        setShowStatusModal(true)

    }

    const handleCloseStatusModal = () => {

        setShowStatusModal(false)
        setSelectedApplication(null)

    }

    const handleStatusSubmit = (data) => {

        setApplications((previous) =>
            previous.map((application) =>
                application.id === data.id
                    ? {
                        ...application,
                        status: data.status,
                        rejectionReason:
                            data.rejectionReason || '',
                        updatedAt: new Date().toISOString(),
                    }
                    : application
            )
        )

        handleCloseStatusModal()

    }


    // =========================================================
    // REMINDER MODAL
    // =========================================================

    const [showReminderModal, setShowReminderModal] =
        useState(false)

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

        console.log(
            'View Application:',
            application
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
                    application.loanId ||
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

        <div className="
            p-4
            sm:p-6
            space-y-5
        ">

            <ApplicationsTable

                applications={
                    filteredApplications
                }

                search={search}
                setSearch={setSearch}

                loanTypes={loanTypes}

                agents={agents}

                selectedLoanType={
                    selectedLoanType
                }

                setSelectedLoanType={
                    setSelectedLoanType
                }

                selectedAgent={
                    selectedAgent
                }

                setSelectedAgent={
                    setSelectedAgent
                }

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


            <LoanTypeModal
                open={showLoanTypeModal}
                application={selectedApplication}
                onClose={
                    handleCloseLoanTypeModal
                }
                onSubmit={
                    handleLoanTypeSubmit
                }
            />


            <StatusModal
                open={showStatusModal}
                application={selectedApplication}
                onClose={
                    handleCloseStatusModal
                }
                onSubmit={
                    handleStatusSubmit
                }
            />


            <ReminderModal
                open={showReminderModal}
                application={selectedApplication}
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