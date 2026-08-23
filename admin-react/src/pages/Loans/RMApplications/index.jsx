// admin-react/src/pages/Loans/RMApplications/index.jsx
import { useState } from 'react'

import RMApplicationsTable from './components/RMApplicationsTable'
import LoanTypeModal from './components/LoanTypeModal'
import StatusModal from './components/StatusModal'
import ReminderModal from './components/ReminderModal'


function RMApplications() {

    const [search, setSearch] = useState('')


    const [applications, setApplications] = useState([
        {
            id: 1,
            loanId: 'RM-2026-0001',
            name: 'Rajesh Kumar',
            phone: '9876543210',
            email: 'rajesh@example.com',
            loanType: 'Personal Loan',
            amount: '500000',
            status: 'Inprocess',
            createdAt: 'Aug 20, 2026, 10:30 AM',
            updatedAt: 'Aug 21, 2026, 2:15 PM',
            agentId: 101,
        },
        {
            id: 2,
            loanId: 'RM-2026-0002',
            name: 'Priya Sharma',
            phone: '9876543211',
            email: 'priya@example.com',
            loanType: 'Business Loan',
            amount: '1000000',
            status: 'Docs Pending',
            createdAt: 'Aug 20, 2026, 11:45 AM',
            updatedAt: 'Aug 22, 2026, 9:20 AM',
            agentId: 102,
        },
        {
            id: 3,
            loanId: 'RM-2026-0003',
            name: 'Arun Kumar',
            phone: '9876543212',
            email: 'arun@example.com',
            loanType: 'Home Loan',
            amount: '2500000',
            status: 'Rejected',
            createdAt: 'Aug 19, 2026, 3:10 PM',
            updatedAt: 'Aug 21, 2026, 4:30 PM',
            agentId: 103,
        },
        {
            id: 4,
            loanId: 'RM-2026-0004',
            name: 'Sneha Reddy',
            phone: '9876543213',
            email: 'sneha@example.com',
            loanType: 'Personal Loan',
            amount: '300000',
            status: 'Inprocess',
            createdAt: 'Aug 18, 2026, 9:15 AM',
            updatedAt: 'Aug 20, 2026, 1:45 PM',
            agentId: 104,
        },
    ])


    // =========================================================
    // LOAN TYPE MODAL
    // =========================================================

    const [showLoanTypeModal, setShowLoanTypeModal] =
        useState(false)

    const [selectedApplication, setSelectedApplication] =
        useState(null)


    // =========================================================
    // STATUS MODAL
    // =========================================================

    const [showStatusModal, setShowStatusModal] =
        useState(false)


    // =========================================================
    // REMINDER MODAL
    // =========================================================

    const [showReminderModal, setShowReminderModal] =
        useState(false)


    // =========================================================
    // LOAN TYPE
    // =========================================================

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
                        updatedAt: new Date().toLocaleString(
                            'en-IN',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                            }
                        ),
                    }
                    : application
            )
        )


        handleCloseLoanTypeModal()
    }


    // =========================================================
    // STATUS
    // =========================================================

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
                        updatedAt: new Date().toLocaleString(
                            'en-IN',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                            }
                        ),
                    }
                    : application
            )
        )


        handleCloseStatusModal()
    }


    // =========================================================
    // REMINDER
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
         * API integration will be added later.
         *
         * Example:
         *
         * POST /applications/{applicationId}/reminders
         */

        console.log('Reminder:', data)


        handleCloseReminderModal()
    }


    // =========================================================
    // CHAT
    // =========================================================

    const handleChat = (application) => {

        /*
         * Global ChatModal will be connected here.
         *
         * It will receive:
         *
         * loanId
         * agentId
         */

        console.log(
            'Open chat',
            {
                loanId: application.loanId || application.id,
                agentId: application.agentId,
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

        console.log('Refresh RM applications')
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="p-4 sm:p-6 space-y-5">


            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            {/* <div>

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    font-semibold
                ">
                    RM Applications
                </h1>


                <p className="
                    text-sm
                    text-base-content/60
                    mt-1
                ">
                    Manage and track applications assigned to relationship managers.
                </p>

            </div> */}


            {/* =====================================================
                APPLICATION TABLE
            ===================================================== */}

            <RMApplicationsTable
                applications={applications}
                search={search}
                setSearch={setSearch}
                onLoanTypeChange={handleLoanTypeChange}
                onStatusChange={handleStatusChange}
                onReminder={handleReminder}
                onChat={handleChat}
                onRefresh={handleRefresh}
            />


            {/* =====================================================
                LOAN TYPE MODAL
            ===================================================== */}

            <LoanTypeModal
                open={showLoanTypeModal}
                application={selectedApplication}
                onClose={handleCloseLoanTypeModal}
                onSubmit={handleLoanTypeSubmit}
            />


            {/* =====================================================
                STATUS MODAL
            ===================================================== */}

            <StatusModal
                open={showStatusModal}
                application={selectedApplication}
                onClose={handleCloseStatusModal}
                onSubmit={handleStatusSubmit}
            />


            {/* =====================================================
                REMINDER MODAL
            ===================================================== */}

            <ReminderModal
                open={showReminderModal}
                application={selectedApplication}
                onClose={handleCloseReminderModal}
                onSubmit={handleReminderSubmit}
            />

        </div>
    )
}


export default RMApplications