// admin-react/src/pages/Loans/PendingApplications/index.jsx

import { useMemo, useState } from 'react'

import PendingApplicationsTable from './components/PendingApplicationsTable'
import LoanTypeModal from '../../../components/Loans/LoanTypeModal'
import StatusModal from '../../../components/Loans/StatusModal'
import ReminderModal from '../../../components/Loans/ReminderModal'


function PendingApplications() {

    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [applications, setApplications] = useState([
        {
            id: 1,
            loanId: 'PA-2026-0001',
            name: 'Rajesh Kumar',
            phone: '9876543210',
            email: 'rajesh@example.com',
            loanType: 'Personal Loan',
            amount: '500000',
            status: 'Inprocess',
            appliedDate: '2026-08-20',
            appliedBy: 'Premalatha N',
            referral: 'Premalatha N',
            rmName: 'Premalatha N',
            processingAgent: 'Prashanth',
            agentId: 101,
            rmId: 201,
        },
        {
            id: 2,
            loanId: 'PA-2026-0002',
            name: 'Priya Sharma',
            phone: '9876543211',
            email: 'priya@example.com',
            loanType: 'Business Loan',
            amount: '1000000',
            status: 'Docs Pending',
            appliedDate: '2026-08-20',
            appliedBy: 'Premalatha N',
            referral: 'Premalatha N',
            rmName: 'Premalatha N',
            processingAgent: 'Kasturi',
            agentId: 102,
            rmId: 201,
        },
        {
            id: 3,
            loanId: 'PA-2026-0003',
            name: 'Arun Kumar',
            phone: '9876543212',
            email: 'arun@example.com',
            loanType: 'Home Loan',
            amount: '2500000',
            status: 'Rejected',
            appliedDate: '2026-08-19',
            appliedBy: 'Shubha',
            referral: 'Shubha',
            rmName: 'Shubha',
            processingAgent: 'Kasturi',
            agentId: 103,
            rmId: 202,
        },
        {
            id: 4,
            loanId: 'PA-2026-0004',
            name: 'Sneha Reddy',
            phone: '9876543213',
            email: 'sneha@example.com',
            loanType: 'Personal Loan',
            amount: '300000',
            status: 'Inprocess',
            appliedDate: '2026-08-18',
            appliedBy: 'Prasanna Y R',
            referral: 'Prasanna Y R',
            rmName: 'Prasanna Y R',
            processingAgent: 'Nayana',
            agentId: 104,
            rmId: 203,
        },
    ])


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState('')

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')


    // =========================================================
    // SELECTED APPLICATION
    // =========================================================

    const [selectedApplication, setSelectedApplication] =
        useState(null)


    // =========================================================
    // LOAN TYPES
    // =========================================================

    const loanTypes = useMemo(() => {

        return [
            ...new Set(
                applications
                    .map(
                        (application) =>
                            application.loanType
                    )
                    .filter(Boolean)
            ),
        ]

    }, [applications])


    // =========================================================
    // AGENTS
    // =========================================================

    const agents = useMemo(() => {

        const map = new Map()


        applications.forEach((application) => {

            const id =
                application.agentId ??
                application.agent_id ??
                application.processingAgentId ??
                application.processing_agent_id ??
                application.agent?.id ??
                application.processingAgent?.id


            const name =
                application.agentName ??
                application.agent_name ??
                application.processingAgent ??
                application.processing_agent ??
                application.agent?.name ??
                application.processingAgent?.name


            if (!id && !name) {
                return
            }


            const key = String(id ?? name)


            if (!map.has(key)) {

                map.set(key, {
                    id: id ?? name,
                    name: name || 'Unknown Agent',
                })

            }

        })


        return [...map.values()]

    }, [applications])


    // =========================================================
    // FILTER APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const value =
            search
                .trim()
                .toLowerCase()


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


            // -----------------------------------------------------
            // LOAN TYPE
            // -----------------------------------------------------

            if (
                selectedLoanType &&
                application.loanType !== selectedLoanType
            ) {

                return false

            }


            // -----------------------------------------------------
            // AGENT
            // -----------------------------------------------------

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
         * API integration later.
         *
         * POST /pending-applications/{applicationId}/reminders
         */

        console.log(
            'Pending Application Reminder:',
            data
        )


        handleCloseReminderModal()

    }


    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication = (application) => {

        /*
         * Application details/view page will be connected later.
         */

        console.log(
            'View Pending Application:',
            application
        )

    }


    // =========================================================
    // CHAT
    // =========================================================

    const handleChat = (application) => {

        console.log(
            'Open Pending Application Chat:',
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

        /*
         * API refresh will be added later.
         */

        console.log(
            'Refresh Pending Applications'
        )

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

            <PendingApplicationsTable
                applications={filteredApplications}

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


            {/* =====================================================
                LOAN TYPE MODAL
            ===================================================== */}

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


            {/* =====================================================
                STATUS MODAL
            ===================================================== */}

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


            {/* =====================================================
                REMINDER MODAL
            ===================================================== */}

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


export default PendingApplications