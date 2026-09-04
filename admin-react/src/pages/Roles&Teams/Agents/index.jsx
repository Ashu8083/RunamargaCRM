// admin-react/src/pages/Roles&Teams/Agents/index.jsx

import { useMemo, useState } from 'react'

import AgentTable from './components/AgentTable'
import AgentModal from './components/AgentModal'
import AssignedTeamLeadsModal from './components/AssignedTeamLeadsModal'

import PermissionsModal from '../../../components/GlobalModels/PermissionsModal'


// =============================================================
// MOCK API
// Replace this function with the backend API later.
// =============================================================

const fetchAgents = async () => {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve([
                {
                    id: 1,

                    employeeId: 1001,

                    name: 'Agent One',

                    phone: '9876543210',

                    email: 'agent1@example.com',

                    status: 'Active',

                    createdAt: 'Apr 7, 2026, 3:13:50 PM',

                    updatedAt: 'N/A',

                    rmTeamLeads: [
                        {
                            id: 1,
                            name: 'RM Team Lead One',
                            loanType: 'Personal Loan',
                        },
                    ],

                    agentTeamLeads: [
                        {
                            id: 2,
                            name: 'Agent Team Lead One',
                            loanType: 'Business Loan',
                        },
                    ],

                    permissions: [],

                    availablePermissionGroups: undefined,

                    availableRMTeamLeads: [
                        {
                            id: 1,
                            name: 'RM Team Lead One',
                            loanTypes: [
                                'Personal Loan',
                                'Home Loan',
                            ],
                        },
                        {
                            id: 2,
                            name: 'RM Team Lead Two',
                            loanTypes: [
                                'Business Loan',
                            ],
                        },
                    ],

                    availableAgentTeamLeads: [
                        {
                            id: 3,
                            name: 'Agent Team Lead One',
                            loanTypes: [
                                'Personal Loan',
                            ],
                        },
                        {
                            id: 4,
                            name: 'Agent Team Lead Two',
                            loanTypes: [
                                'Business Loan',
                                'Personal Loan',
                            ],
                        },
                    ],
                },

                {
                    id: 2,

                    employeeId: 1002,

                    name: 'Agent Two',

                    phone: '9876543211',

                    email: 'agent2@example.com',

                    status: 'Absent',

                    createdAt: 'Apr 8, 2026, 10:20:15 AM',

                    updatedAt: 'Apr 10, 2026, 2:30:10 PM',

                    rmTeamLeads: [],

                    agentTeamLeads: [],

                    permissions: [],

                    availablePermissionGroups: undefined,

                    availableRMTeamLeads: [
                        {
                            id: 1,
                            name: 'RM Team Lead One',
                            loanTypes: [
                                'Personal Loan',
                                'Home Loan',
                            ],
                        },
                    ],

                    availableAgentTeamLeads: [
                        {
                            id: 3,
                            name: 'Agent Team Lead One',
                            loanTypes: [
                                'Personal Loan',
                            ],
                        },
                    ],
                },
            ])

        }, 400)

    })

}


// =============================================================
// DATE FORMAT
// =============================================================

const getCurrentDateTime = () => {

    return new Date().toLocaleString(
        'en-IN',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
        }
    )

}


// =============================================================
// PAGE
// =============================================================

function Agents() {

    // =========================================================
    // DATA
    // =========================================================

    const [agents, setAgents] = useState([
        {
            id: 1,
            employeeId: 1001,
            name: 'Agent One',
            phone: '9876543210',
            email: 'agent1@example.com',
            status: 'Active',
            createdAt: 'Apr 7, 2026, 3:13:50 PM',
            updatedAt: 'N/A',

            rmTeamLeads: [
                {
                    id: 1,
                    name: 'RM Team Lead One',
                    loanType: 'Personal Loan',
                },
            ],

            agentTeamLeads: [
                {
                    id: 2,
                    name: 'Agent Team Lead One',
                    loanType: 'Business Loan',
                },
            ],

            permissions: [],
        },

        {
            id: 2,
            employeeId: 1002,
            name: 'Agent Two',
            phone: '9876543211',
            email: 'agent2@example.com',
            status: 'Absent',
            createdAt: 'Apr 8, 2026, 10:20:15 AM',
            updatedAt: 'Apr 10, 2026, 2:30:10 PM',

            rmTeamLeads: [],

            agentTeamLeads: [],

            permissions: [],
        },
    ])


    const [loading, setLoading] = useState(false)


    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] = useState('')


    // =========================================================
    // ADD / EDIT MODAL
    //
    // Only status can be edited for an existing agent.
    // =========================================================

    const [showModal, setShowModal] = useState(false)

    const [editingAgent, setEditingAgent] = useState(null)


    // =========================================================
    // TEAM LEADS MODAL
    // =========================================================

    const [showTeamLeadsModal, setShowTeamLeadsModal] =
        useState(false)

    const [selectedAgent, setSelectedAgent] =
        useState(null)


    // =========================================================
    // GLOBAL PERMISSIONS MODAL
    // =========================================================

    const [showPermissionsModal, setShowPermissionsModal] =
        useState(false)


    // =========================================================
    // FILTERED DATA
    // =========================================================

    const filteredAgents = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        if (!searchValue) {
            return agents
        }


        return agents.filter((agent) => {

            return (

                agent.name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                agent.phone
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                agent.email
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                agent.status
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                String(
                    agent.employeeId || ''
                )
                    .toLowerCase()
                    .includes(searchValue)

            )

        })

    }, [
        agents,
        search,
    ])


    // =========================================================
    // LOAD / REFRESH
    // =========================================================

    const handleRefresh = async () => {

        try {

            setLoading(true)

            const response =
                await fetchAgents()

            if (Array.isArray(response)) {

                setAgents(response)

            }

        } catch (error) {

            console.error(
                'Failed to load agents:',
                error
            )

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // CREATE
    //
    // New agent is selected from employees.
    // AgentModal handles employee selection.
    // =========================================================

    const handleCreate = () => {

        setEditingAgent(null)

        setShowModal(true)

    }


    // =========================================================
    // EDIT
    //
    // Existing agent:
    // Only status should be changed.
    // =========================================================

    const handleEdit = (agent) => {

        setEditingAgent(agent)

        setShowModal(true)

    }


    // =========================================================
    // CLOSE ADD / EDIT
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setEditingAgent(null)

    }


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = (data) => {

        // =====================================================
        // UPDATE EXISTING AGENT
        //
        // Only status is accepted.
        // =====================================================

        if (editingAgent) {

            setAgents((previous) =>
                previous.map((agent) => {

                    if (
                        agent.id !==
                        editingAgent.id
                    ) {
                        return agent
                    }


                    return {

                        ...agent,

                        status:
                            data.status ||
                            agent.status,

                        updatedAt:
                            getCurrentDateTime(),

                    }

                })
            )

            handleCloseModal()

            return

        }


        // =====================================================
        // CREATE AGENT
        //
        // Employee information comes from selected employee.
        // =====================================================

        if (!data.employee) {

            return

        }


        const employee =
            data.employee


        const newAgent = {

            id: Date.now(),

            employeeId:
                employee.id ??
                employee.employeeId ??
                Date.now(),

            name:
                employee.name ??
                employee.fullName ??
                employee.label ??
                '',

            phone:
                employee.phone ??
                employee.mobile ??
                employee.phoneNumber ??
                '',

            email:
                employee.email ??
                '',

            status:
                data.status ||
                'Active',

            createdAt:
                getCurrentDateTime(),

            updatedAt:
                'N/A',

            rmTeamLeads: [],

            agentTeamLeads: [],

            permissions: [],

        }


        setAgents((previous) => [
            ...previous,
            newAgent,
        ])


        handleCloseModal()

    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (agent) => {

        const confirmed =
            window.confirm(
                `Delete agent "${agent.name}"?`
            )


        if (!confirmed) {
            return
        }


        setAgents((previous) =>
            previous.filter(
                (item) =>
                    item.id !== agent.id
            )
        )

    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (
        agent,
        status
    ) => {

        setAgents((previous) =>
            previous.map((item) => {

                if (
                    item.id !==
                    agent.id
                ) {
                    return item
                }


                return {

                    ...item,

                    status,

                    updatedAt:
                        getCurrentDateTime(),

                }

            })
        )

    }


    // =========================================================
    // VIEW TEAM LEADS
    // =========================================================

    const handleViewTeamLeads = (
        agent
    ) => {

        setSelectedAgent(agent)

        setShowTeamLeadsModal(true)

    }


    // =========================================================
    // CLOSE TEAM LEADS
    // =========================================================

    const handleCloseTeamLeads = () => {

        setShowTeamLeadsModal(false)

        setSelectedAgent(null)

    }


    // =========================================================
    // TEAM LEAD ASSIGNMENT CHANGE
    // =========================================================

    const handleAssignmentChange = (
        assignment
    ) => {

        if (!selectedAgent) {
            return
        }


        setAgents((previous) =>
            previous.map((agent) => {

                if (
                    agent.id !==
                    selectedAgent.id
                ) {
                    return agent
                }


                if (
                    assignment.type ===
                    'rm'
                ) {

                    return {

                        ...agent,

                        rmTeamLeads:
                            assignment.assignments,

                    }

                }


                if (
                    assignment.type ===
                    'agent'
                ) {

                    return {

                        ...agent,

                        agentTeamLeads:
                            assignment.assignments,

                    }

                }


                return agent

            })
        )


        /*
         * Keep selectedAgent synchronized
         * with the latest assignment.
         */

        setSelectedAgent((previous) => {

            if (!previous) {
                return previous
            }


            if (
                assignment.type ===
                'rm'
            ) {

                return {

                    ...previous,

                    rmTeamLeads:
                        assignment.assignments,

                }

            }


            if (
                assignment.type ===
                'agent'
            ) {

                return {

                    ...previous,

                    agentTeamLeads:
                        assignment.assignments,

                }

            }


            return previous

        })

    }


    // =========================================================
    // MANAGE PERMISSIONS
    //
    // Uses the GLOBAL PermissionsModal.
    //
    // Global component expects:
    //
    // <PermissionsModal
    //     open={...}
    //     admin={...}
    //     onClose={...}
    // />
    // =========================================================

    const handleManagePermissions = (
        agent
    ) => {

        setSelectedAgent(agent)

        setShowPermissionsModal(true)

    }


    // =========================================================
    // CLOSE PERMISSIONS
    // =========================================================

    const handleClosePermissions = () => {

        setShowPermissionsModal(false)

        setSelectedAgent(null)

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
                AGENT TABLE
            ================================================= */}

            <AgentTable
                agents={filteredAgents}
                search={search}
                setSearch={setSearch}

                onCreate={handleCreate}

                onEdit={handleEdit}

                onDelete={handleDelete}

                onRefresh={handleRefresh}

                onViewTeamLeads={
                    handleViewTeamLeads
                }

                onManagePermissions={
                    handleManagePermissions
                }

                onStatusChange={
                    handleStatusChange
                }

                loading={loading}
            />


            {/* =================================================
                ADD / EDIT
            ================================================= */}

            <AgentModal
                open={showModal}
                agent={editingAgent}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />


            {/* =================================================
                ASSIGNED TEAM LEADS
            ================================================= */}

            <AssignedTeamLeadsModal
                open={showTeamLeadsModal}
                agent={selectedAgent}
                onClose={handleCloseTeamLeads}
                onAssignmentChange={
                    handleAssignmentChange
                }
            />


            {/* =================================================
                GLOBAL PERMISSIONS MODAL
            ================================================= */}

            <PermissionsModal
                open={showPermissionsModal}
                admin={selectedAgent}
                onClose={handleClosePermissions}
            />

        </div>

    )

}


export default Agents