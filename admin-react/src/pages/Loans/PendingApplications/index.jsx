// src/pages/Applications/PendingApplications/index.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'

import { getActiveContext } from '../../../app/auth'
import {
    getApplications,
    updateApplicationLoanType,
} from '../Api'

import PendingApplicationsTable from './components/PendingApplicationsTable'

import LoanTypeModal from '../../../components/GlobalModels/Loans/LoanTypeModal'
import StatusModal from '../../../components/GlobalModels/Loans/StatusModal'
import ReminderModal from '../../../components/GlobalModels/Loans/ReminderModal'
import { useToast } from '../../../components/Toast/ToastProvider'
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


const normalizeStatus = (status) => {
    if (!status) {
        return ''
    }

    return String(status)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
}


const normalizeApplication = (application) => {
    return {
        ...application,

        id: application.id,

        uniqueId:
            application.uniqueId ??
            application.unique_id ??
            '',

        name:
            application.name ??
            '',

        email:
            application.email ??
            '',

        phone:
            application.phone ??
            '',

        gender:
            application.gender ??
            '',

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

        dob:
            application.dob ??
            '',

        pancardNo:
            application.pancardNo ??
            application.pancard_no ??
            '',

        aadharNo:
            application.aadharNo ??
            application.aadhar_no ??
            '',

        bankAccNo:
            application.bankAccNo ??
            application.bank_acc_no ??
            '',

        ifscCode:
            application.ifscCode ??
            application.ifsc_code ??
            '',

        loanTypeId:
            application.loanTypeId ??
            application.loan_type_id ??
            null,

        loanType:
            application.loanType ??
            application.loan_type ??
            null,

        loanAmt:
            application.loanAmt ??
            application.loan_amt ??
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

        referral:
            application.referral ??
            '',

        appliedById:
            application.appliedById ??
            application.applied_by_id ??
            null,

        appliedBy:
            application.appliedBy ??
            application.applied_by ??
            null,

        agentId:
            application.agentId ??
            application.agent_id ??
            null,

        agent:
            application.agent ??
            null,

        rmId:
            application.rmId ??
            application.rm_id ??
            null,

        rm:
            application.rm ??
            null,

        status:
            application.status ??
            '',

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

        docspendingDate:
            application.docspendingDate ??
            application.docspending_date ??
            null,

        revertedStatus:
            application.revertedStatus ??
            application.reverted_status ??
            '',

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

        createdAt:
            application.createdAt ??
            application.created_at ??
            null,

        updatedAt:
            application.updatedAt ??
            application.updated_at ??
            null,
    }
}


const PendingApplications = () => {
    const {
        showSuccess,
        showError,
    } = useToast()

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState('')

    const [selectedLoanType, setSelectedLoanType] = useState('')
    const [selectedRM, setSelectedRM] = useState('')
    const [selectedTeamLead, setSelectedTeamLead] = useState('')
    const [selectedAgent, setSelectedAgent] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    const [selectedApplication, setSelectedApplication] = useState(null)

    const [showLoanTypeModal, setShowLoanTypeModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showReminderModal, setShowReminderModal] = useState(false)

    const [activeContext, setActiveContext] = useState(
        getActiveContext()
    )

   
    /*
     * FETCH APPLICATIONS
     */

    const fetchApplications = useCallback(async () => {
        const context = getActiveContext()

        if (!context?.id) {
            setApplications([])
            return
        }

        try {
            setLoading(true)

            const response = await getApplications(context.id)

            const data =
                response?.data ??
                response ??
                []

            const normalizedApplications = Array.isArray(data)
                ? data.map(normalizeApplication)
                : []

            setApplications(normalizedApplications)
        } catch (error) {
            console.error(
                'Failed to fetch pending applications:',
                error
            )

            setApplications([])

            showError(
                error?.response?.data?.detail ||
                'Failed to load applications',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }, [showError])




    /*
     * INITIAL LOAD
     */

    useEffect(() => {
        fetchApplications()
    }, [
        fetchApplications
    ])


    /*
     * ACTIVE CONTEXT CHANGE
     */

    useEffect(() => {
        const handleAuthChange = () => {
            const context = getActiveContext()

            setActiveContext(context)

            setSearch('')
            setSelectedLoanType('')
            setSelectedRM('')
            setSelectedTeamLead('')
            setSelectedAgent('')
            setSelectedStatus('')

            setSelectedApplication(null)
        }

        window.addEventListener(
            'auth:changed',
            handleAuthChange
        )

        return () => {
            window.removeEventListener(
                'auth:changed',
                handleAuthChange
            )
        }
    }, [])


    /*
     * REFETCH WHEN CONTEXT CHANGES
     */

    useEffect(() => {
        if (!activeContext?.id) {
            return
        }

        fetchApplications()
    }, [
        activeContext?.id,
        fetchApplications
    ])


    /*
     * FILTER APPLICATIONS
     */

    const filteredApplications = useMemo(() => {
        const searchValue = search
            .trim()
            .toLowerCase()

        return applications.filter((application) => {
            /*
             * SEARCH
             */

            if (searchValue) {
                const searchableValues = [
                    application.name,
                    application.phone,
                    application.email,
                    application.uniqueId,
                    application.referral,
                    application.agent?.name,
                    application.rm?.name,
                    application.appliedBy?.name,
                ]

                const matchesSearch =
                    searchableValues.some(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            String(value)
                                .toLowerCase()
                                .includes(searchValue)
                    )

                if (!matchesSearch) {
                    return false
                }
            }


            /*
             * LOAN TYPE
             */

            if (selectedLoanType) {
                const applicationLoanTypeId =
                    application.loanTypeId

                if (
                    String(applicationLoanTypeId) !==
                    String(selectedLoanType)
                ) {
                    return false
                }
            }


            /*
             * RM
             */

            if (selectedRM) {
                const applicationRMId =
                    application.rmId

                if (
                    String(applicationRMId) !==
                    String(selectedRM)
                ) {
                    return false
                }
            }


            /*
             * TEAM LEAD
             */

            if (selectedTeamLead) {
                const teamLeadId =
                    application.teamLeadId ??
                    application.team_lead_id

                if (
                    String(teamLeadId) !==
                    String(selectedTeamLead)
                ) {
                    return false
                }
            }


            /*
             * AGENT
             */

            if (selectedAgent) {
                const applicationAgentId =
                    application.agentId

                if (
                    String(applicationAgentId) !==
                    String(selectedAgent)
                ) {
                    return false
                }
            }


            /*
             * STATUS
             */

            if (selectedStatus) {
                const applicationStatus =
                    normalizeStatus(
                        application.status
                    )

                if (
                    applicationStatus !==
                    normalizeStatus(selectedStatus)
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


    /*
     * CLEAR FILTERS
     */

    const handleClearFilters = () => {
        setSearch('')
        setSelectedLoanType('')
        setSelectedRM('')
        setSelectedTeamLead('')
        setSelectedAgent('')
        setSelectedStatus('')
    }


    /*
     * REFRESH
     */

    const handleRefresh = () => {
        fetchApplications()
    }


    /*
     * LOAN TYPE MODAL
     */

    const handleLoanTypeChange = (application) => {
        setSelectedApplication(application)
        setShowLoanTypeModal(true)
    }


    const handleCloseLoanTypeModal = () => {
        setShowLoanTypeModal(false)
        setSelectedApplication(null)
    }


    const handleLoanTypeSubmit = async ({
        applicationId,
        loanTypeId,
    }) => {
        if (!applicationId || !loanTypeId) {
            return
        }

        try {
            await updateApplicationLoanType(
                applicationId,
                loanTypeId
            )

            setApplications((currentApplications) =>
                currentApplications.map(
                    (application) => {
                        if (
                            application.id !==
                            applicationId
                        ) {
                            return application
                        }

                        return {
                            ...application,
                            loanTypeId: loanTypeId,
                            loan_type_id: loanTypeId,
                        }
                    }
                )
            )

            showSuccess(
                'Loan type updated successfully'
            )

            handleCloseLoanTypeModal()
        } catch (error) {
            console.error(
                'Failed to update loan type:',
                error
            )

            const detail =
                error?.response?.data?.detail

            const errorMessage =
                Array.isArray(detail)
                    ? detail
                        .map(
                            (item) => item?.msg
                        )
                        .filter(Boolean)
                        .join(', ')
                    : typeof detail === 'string'
                        ? detail
                        : 'Failed to update loan type'

            showError(
                errorMessage,
                'error'
            )
        }
    }


    /*
     * STATUS MODAL
     */

    const handleStatusChange = (application) => {
        setSelectedApplication(application)
        setShowStatusModal(true)
    }


    const handleCloseStatusModal = () => {
        setShowStatusModal(false)
        setSelectedApplication(null)
    }


    const handleStatusSubmit = async (status) => {
        /*
         * Status update API is not implemented yet.
         *
         * Keep the modal flow ready, but do not
         * pretend that an API update happened.
         */

        console.log(
            'Status update requested:',
            selectedApplication,
            status
        )

        handleCloseStatusModal()
    }


    /*
     * REMINDER MODAL
     */

    const handleReminder = (application) => {
        setSelectedApplication(application)
        setShowReminderModal(true)
    }


    const handleCloseReminderModal = () => {
        setShowReminderModal(false)
        setSelectedApplication(null)
    }


    const handleReminderSubmit = async (data) => {
        /*
         * Reminder API is not implemented yet.
         */

        console.log(
            'Reminder requested:',
            selectedApplication,
            data
        )

        handleCloseReminderModal()
    }


    /*
     * RENDER
     */

    return (
        <>
            <PendingApplicationsTable
                applications={filteredApplications}
                loading={loading}

                search={search}
                setSearch={setSearch}


                statuses={STATUS_OPTIONS}

                selectedLoanType={
                    selectedLoanType
                }
                setSelectedLoanType={
                    setSelectedLoanType
                }

                selectedRM={selectedRM}
                setSelectedRM={setSelectedRM}

                selectedTeamLead={
                    selectedTeamLead
                }
                setSelectedTeamLead={
                    setSelectedTeamLead
                }

                selectedAgent={selectedAgent}
                setSelectedAgent={
                    setSelectedAgent
                }

                selectedStatus={
                    selectedStatus
                }
                setSelectedStatus={
                    setSelectedStatus
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

                onClearFilters={
                    handleClearFilters
                }

                onRefresh={
                    handleRefresh
                }
            />


            <LoanTypeModal
                open={showLoanTypeModal}
                application={
                    selectedApplication
                }
                onClose={
                    handleCloseLoanTypeModal
                }
                onSubmit={
                    handleLoanTypeSubmit
                }
            />


            <StatusModal
                open={showStatusModal}
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


            <ReminderModal
                open={showReminderModal}
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
        </>
    )
}


export default PendingApplications