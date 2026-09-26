// admin-react/src/pages/Roles&Teams/Agents/index.jsx

import { useCallback, useEffect, useState } from 'react'

import AgentTable from './components/AgentTable'
import AgentModal from './components/AgentModal'
import AssignedTeamLeadsModal from './components/AssignedTeamLeadsModal'

import PermissionsModal from '../../../components/GlobalModels/PermissionsModal'
import FeedbackModal from '../../../components/GlobalModels/FeedbackModal'

import {
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    updateAgentStatus,
    getEmployees,
    getAgentRoles,
    getAvailableTeamLeads,
    getAssignedTeamLeads,
    assignTeamLead,
    removeTeamLead,
    getApiErrorMessage,
} from './API'


const Agents = () => {

    // ========================================================================
    // STATE
    // ========================================================================

    const [agents, setAgents] = useState([])
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])
    const [teamLeads, setTeamLeads] = useState([])

    const [loading, setLoading] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)

    const [showAgentModal, setShowAgentModal] = useState(false)
    const [showTeamLeadModal, setShowTeamLeadModal] = useState(false)
    const [showPermissionsModal, setShowPermissionsModal] =
        useState(false)

    const [selectedAgent, setSelectedAgent] = useState(null)
    const [assignedTeamLead, setAssignedTeamLead] = useState(null)

    const [feedback, setFeedback] = useState({
        open: false,
        type: 'success',
        title: '',
        message: '',
    })


    // ========================================================================
    // FEEDBACK
    // ========================================================================

    const showFeedback = useCallback(
        (
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
        },
        []
    )


    const closeFeedback = useCallback(() => {

        setFeedback((previous) => ({
            ...previous,
            open: false,
        }))

    }, [])


    // ========================================================================
    // LOAD AGENTS
    // ========================================================================

    const loadAgents = useCallback(
        async () => {

            try {

                setLoading(true)

                const response =
                    await getAgents()

                setAgents(
                    Array.isArray(response)
                        ? response
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load agents:',
                    error
                )

                showFeedback(
                    'error',
                    'Failed to Load Agents',
                    getApiErrorMessage(
                        error,
                        'Unable to load agents.'
                    )
                )

            } finally {

                setLoading(false)
            }

        },
        [showFeedback]
    )


    // ========================================================================
    // LOAD EMPLOYEES
    // ========================================================================

    const loadEmployees = useCallback(
        async () => {

            try {

                const response =
                    await getEmployees()

                setEmployees(
                    Array.isArray(response)
                        ? response
                        : []
                )

            } catch (error) {

                console.error('Failed to load employees:', error)

                console.error('Error message:', error.message)

                console.error('Response:', error.response)

                console.error('Response status:', error.response?.status)

                console.error('Response data:', error.response?.data)

                console.error('Request:', error.request)

                showFeedback(
                    'error',
                    'Failed to Load Employees',
                    getApiErrorMessage(
                        error,
                        'Unable to load employees.'
                    )
                )
            }

        },
        [showFeedback]
    )


    // ========================================================================
    // LOAD AGENT ROLES
    // ========================================================================

    const loadRoles = useCallback(
        async () => {

            try {

                const response =
                    await getAgentRoles()

                setRoles(
                    Array.isArray(response)
                        ? response
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load agent roles:',
                    error
                )

                showFeedback(
                    'error',
                    'Failed to Load Roles',
                    getApiErrorMessage(
                        error,
                        'Unable to load agent roles.'
                    )
                )
            }

        },
        [showFeedback]
    )


    // ========================================================================
    // LOAD TEAM LEADS
    // ========================================================================

    const loadTeamLeads = useCallback(
        async () => {

            try {

                const response =
                    await getAvailableTeamLeads()

                setTeamLeads(
                    Array.isArray(response)
                        ? response
                        : []
                )

            } catch (error) {

                console.error(
                    'Failed to load team leads:',
                    error
                )

                showFeedback(
                    'error',
                    'Failed to Load Team Leads',
                    getApiErrorMessage(
                        error,
                        'Unable to load team leads.'
                    )
                )
            }

        },
        [showFeedback]
    )


    // ========================================================================
    // INITIAL LOAD
    // ========================================================================

    useEffect(() => {

        const loadInitialData =
            async () => {

                await Promise.all([
                    loadAgents(),
                    loadEmployees(),
                    loadRoles(),
                    loadTeamLeads(),
                ])
            }

        loadInitialData()

    }, [
        loadAgents,
        loadEmployees,
        loadRoles,
        loadTeamLeads,
    ])


    // ========================================================================
    // REFRESH
    // ========================================================================

    const handleRefresh = async () => {

        await Promise.all([
            loadAgents(),
            loadTeamLeads(),
        ])
    }


    // ========================================================================
    // ADD AGENT
    // ========================================================================

    const handleAddAgent = () => {

        setSelectedAgent(null)

        setShowAgentModal(true)
    }


    // ========================================================================
    // EDIT AGENT
    // ========================================================================

    const handleEditAgent = (agent) => {

        setSelectedAgent(agent)

        setShowAgentModal(true)
    }


    // ========================================================================
    // CLOSE AGENT MODAL
    // ========================================================================

    const handleCloseAgentModal = () => {

        if (modalLoading) {
            return
        }

        setShowAgentModal(false)

        setSelectedAgent(null)
    }


    // ========================================================================
    // SAVE AGENT
    // ========================================================================

    const handleSaveAgent = async (data) => {

        try {

            setModalLoading(true)


            // ----------------------------------------------------------------
            // UPDATE
            // ----------------------------------------------------------------

            if (data.isEdit) {

                await updateAgent(
                    data.agentId,
                    {
                        context_id:
                            Number(data.roleId),
                    }
                )

                showFeedback(
                    'success',
                    'Agent Updated',
                    'Agent details have been updated successfully.'
                )

            }

            // ----------------------------------------------------------------
            // CREATE
            // ----------------------------------------------------------------

            else {

                await createAgent({
                    employee_id:
                        Number(data.employeeId),

                    context_id:
                        Number(data.roleId),

                    status:
                        data.status || 'Active',
                })

                showFeedback(
                    'success',
                    'Agent Created',
                    'Agent has been created successfully.'
                )
            }


            setShowAgentModal(false)

            setSelectedAgent(null)

            await loadAgents()

        } catch (error) {

            console.error(
                'Failed to save agent:',
                error
            )

            showFeedback(
                'error',
                data.isEdit
                    ? 'Failed to Update Agent'
                    : 'Failed to Create Agent',
                getApiErrorMessage(
                    error,
                    data.isEdit
                        ? 'Unable to update agent.'
                        : 'Unable to create agent.'
                )
            )

        } finally {

            setModalLoading(false)
        }
    }


    // ========================================================================
    // DELETE AGENT
    // ========================================================================

    const handleDeleteAgent = async (agent) => {

        if (!agent?.id) {
            return
        }


        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${agent.name || 'this agent'
                }?`
            )


        if (!confirmed) {
            return
        }


        try {

            setLoading(true)

            await deleteAgent(
                agent.id
            )

            showFeedback(
                'success',
                'Agent Deleted',
                'Agent has been deleted successfully.'
            )

            await loadAgents()

        } catch (error) {

            console.error(
                'Failed to delete agent:',
                error
            )

            showFeedback(
                'error',
                'Failed to Delete Agent',
                getApiErrorMessage(
                    error,
                    'Unable to delete agent.'
                )
            )

        } finally {

            setLoading(false)
        }
    }


    // ========================================================================
    // STATUS CHANGE
    // ========================================================================

    const handleStatusChange = async (
        agent,
        status
    ) => {

        if (!agent?.id) {
            return
        }


        try {

            setLoading(true)

            await updateAgentStatus(
                agent.id,
                status
            )

            showFeedback(
                'success',
                'Status Updated',
                `Agent status changed to ${status}.`
            )

            await loadAgents()

        } catch (error) {

            console.error(
                'Failed to update agent status:',
                error
            )

            showFeedback(
                'error',
                'Failed to Update Status',
                getApiErrorMessage(
                    error,
                    'Unable to update agent status.'
                )
            )

        } finally {

            setLoading(false)
        }
    }


    // ========================================================================
    // OPEN TEAM LEAD MODAL
    // ========================================================================

    const handleViewTeamLeads = async (
        agent
    ) => {

        if (!agent?.id) {
            return
        }


        try {

            setSelectedAgent(agent)

            setAssignedTeamLead(null)

            setModalLoading(true)

            setShowTeamLeadModal(true)


            const response =
                await getAssignedTeamLeads(
                    agent.id
                )


            const assigned =
                Array.isArray(response)
                    ? response
                    : []


            // Only one Team Lead is possible because:
            //
            // Agent EmployeeContext.reports_to_id
            //
            // is a single FK to Team Lead EmployeeContext.id.

            setAssignedTeamLead(
                assigned[0] || null
            )

        } catch (error) {

            console.error(
                'Failed to load assigned team lead:',
                error
            )

            setShowTeamLeadModal(false)

            showFeedback(
                'error',
                'Failed to Load Team Lead',
                getApiErrorMessage(
                    error,
                    'Unable to load assigned team lead.'
                )
            )

        } finally {

            setModalLoading(false)
        }
    }


    // ========================================================================
    // TEAM LEAD ASSIGNMENT
    // ========================================================================

    const handleAssignmentChange = async (
        teamLead
    ) => {

        if (!selectedAgent?.id) {
            return
        }


        try {

            setModalLoading(true)


            // ----------------------------------------------------------------
            // ASSIGN
            // ----------------------------------------------------------------

            if (teamLead) {

                const teamLeadId =
                    teamLead.id ??
                    teamLead.employee_context_id


                if (
                    teamLeadId === null ||
                    teamLeadId === undefined
                ) {

                    throw new Error(
                        'Team Lead EmployeeContext ID is missing.'
                    )
                }


                await assignTeamLead(
                    selectedAgent.id,
                    Number(teamLeadId)
                )


                // Update modal immediately.
                setAssignedTeamLead(
                    teamLead
                )


                showFeedback(
                    'success',
                    'Team Lead Assigned',
                    `${teamLead.name || 'Team Lead'} has been assigned successfully.`
                )

            }

            // ----------------------------------------------------------------
            // REMOVE
            // ----------------------------------------------------------------

            else {

                await removeTeamLead(
                    selectedAgent.id
                )


                setAssignedTeamLead(null)


                showFeedback(
                    'success',
                    'Team Lead Removed',
                    'Team Lead assignment has been removed successfully.'
                )
            }


            await loadAgents()

        } catch (error) {

            console.error(
                'Failed to update team lead assignment:',
                error
            )

            showFeedback(
                'error',
                teamLead
                    ? 'Failed to Assign Team Lead'
                    : 'Failed to Remove Team Lead',
                getApiErrorMessage(
                    error,
                    teamLead
                        ? 'Unable to assign Team Lead.'
                        : 'Unable to remove Team Lead.'
                )
            )

        } finally {

            setModalLoading(false)
        }
    }


    // ========================================================================
    // CLOSE TEAM LEAD MODAL
    // ========================================================================

    const handleCloseTeamLeadModal = () => {

        if (modalLoading) {
            return
        }

        setShowTeamLeadModal(false)

        setSelectedAgent(null)

        setAssignedTeamLead(null)
    }


    // ========================================================================
    // PERMISSIONS
    // ========================================================================

    const handlePermissions = (
        agent
    ) => {

        if (!agent) {
            return
        }


        if (
            agent.status === 'Inactive' ||
            !agent.is_active
        ) {

            showFeedback(
                'error',
                'Inactive Agent',
                'Permissions cannot be managed for an inactive agent.'
            )

            return
        }


        setSelectedAgent(agent)

        setShowPermissionsModal(true)
    }


    // ========================================================================
    // CLOSE PERMISSIONS
    // ========================================================================

    const handleClosePermissions = () => {

        setShowPermissionsModal(false)

        setSelectedAgent(null)
    }


    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="w-full p-4">

            {/* ================================================================ */}
            {/* AGENT TABLE */}
            {/* ================================================================ */}

            <AgentTable
                agents={agents}
                loading={loading}
                onEdit={handleEditAgent}
                onDelete={handleDeleteAgent}
                onStatusChange={handleStatusChange}
                onManageTeamLeads={
                    handleViewTeamLeads
                }
                onManagePermissions={
                    handlePermissions
                }
                onAdd={handleAddAgent}
                onRefresh={handleRefresh}
            />


            {/* ================================================================ */}
            {/* AGENT CREATE / EDIT MODAL */}
            {/* ================================================================ */}

            <AgentModal
                open={showAgentModal}
                agent={selectedAgent}
                employees={employees}
                roles={roles}
                loading={modalLoading}
                onClose={handleCloseAgentModal}
                onSubmit={handleSaveAgent}
            />


            {/* ================================================================ */}
            {/* TEAM LEAD MODAL */}
            {/* ================================================================ */}

            <AssignedTeamLeadsModal
                open={showTeamLeadModal}
                agent={selectedAgent}
                teamLeads={teamLeads}
                assignedTeamLead={
                    assignedTeamLead
                }
                loading={modalLoading}
                onClose={
                    handleCloseTeamLeadModal
                }
                onAssignmentChange={
                    handleAssignmentChange
                }
            />


            {/* ================================================================ */}
            {/* PERMISSIONS MODAL */}
            {/* ================================================================ */}

            <PermissionsModal
                open={showPermissionsModal}

                employeeId={
                    selectedAgent?.employee_id ??
                    selectedAgent?.employeeId ??
                    null
                }

                contextId={
                    selectedAgent?.context_id ??
                    selectedAgent?.contextId ??
                    null
                }

                admin={selectedAgent}

                onClose={
                    handleClosePermissions
                }
            />


            {/* ================================================================ */}
            {/* FEEDBACK MODAL */}
            {/* ================================================================ */}

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


export default Agents