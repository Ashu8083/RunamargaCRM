// admin-react/src/pages/Roles&Teams/Agents/index.jsx
import { useState } from 'react'

import AgentTable from './components/AgentTable'
import AgentModal from './components/AgentModal'
import AssignedTeamLeadsModal from './components/AssignedTeamLeadsModal'
import PermissionsModal from './components/PermissionsModal'


function Agents() {

    const [search, setSearch] = useState('')

    const [agents, setAgents] = useState([
        {
            id: 1,
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


    // =========================================================
    // ADD / EDIT MODAL
    // =========================================================

    const [showModal, setShowModal] = useState(false)

    const [editingAgent, setEditingAgent] = useState(null)


    // =========================================================
    // TEAM LEADS MODAL
    // =========================================================

    const [showTeamLeadsModal, setShowTeamLeadsModal] = useState(false)

    const [selectedAgent, setSelectedAgent] = useState(null)


    // =========================================================
    // PERMISSIONS MODAL
    // =========================================================

    const [showPermissionsModal, setShowPermissionsModal] = useState(false)


    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = () => {

        setEditingAgent(null)

        setShowModal(true)
    }


    // =========================================================
    // EDIT
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

        if (editingAgent) {

            setAgents((previous) =>
                previous.map((agent) =>
                    agent.id === editingAgent.id
                        ? {
                            ...agent,

                            name: data.name,

                            phone: data.phone,

                            email: data.email,

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
                        : agent
                )
            )

        } else {

            const newAgent = {

                id: Date.now(),

                name: data.name,

                phone: data.phone,

                email: data.email,

                status: data.status,

                createdAt: new Date().toLocaleString(
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

                updatedAt: 'N/A',

                rmTeamLeads: [],

                agentTeamLeads: [],

                permissions: [],
            }


            setAgents((previous) => [
                ...previous,
                newAgent,
            ])
        }


        handleCloseModal()
    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (agent) => {

        const confirmed = window.confirm(
            `Delete agent "${agent.name}"?`
        )


        if (!confirmed) {
            return
        }


        setAgents((previous) =>
            previous.filter(
                (item) => item.id !== agent.id
            )
        )
    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (agent, status) => {

        setAgents((previous) =>
            previous.map((item) =>
                item.id === agent.id
                    ? {
                        ...item,

                        status,

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
                    : item
            )
        )
    }


    // =========================================================
    // VIEW TEAM LEADS
    // =========================================================

    const handleViewTeamLeads = (agent) => {

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
    // MANAGE PERMISSIONS
    // =========================================================

    const handleManagePermissions = (agent) => {

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
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        // API refresh will be added later.

        console.log('Refresh agents')
    }


    return (
        <div className="p-4 sm:p-6 space-y-5">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="text-2xl sm:text-3xl font-semibold">
                    Agents
                </h1>

                <p className="text-sm text-base-content/60 mt-1">
                    Manage agents, team lead assignments and permissions.
                </p>

            </div>


            {/* =====================================================
                AGENT TABLE
            ===================================================== */}

            <AgentTable
                agents={agents}
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                onViewTeamLeads={handleViewTeamLeads}
                onManagePermissions={handleManagePermissions}
                onStatusChange={handleStatusChange}
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <AgentModal
                open={showModal}
                agent={editingAgent}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />


            {/* =====================================================
                ASSIGNED TEAM LEADS MODAL
            ===================================================== */}

            <AssignedTeamLeadsModal
                open={showTeamLeadsModal}
                agent={selectedAgent}
                onClose={handleCloseTeamLeads}
            />


            {/* =====================================================
                PERMISSIONS MODAL
            ===================================================== */}

            <PermissionsModal
                open={showPermissionsModal}
                agent={selectedAgent}
                onClose={handleClosePermissions}
            />

        </div>
    )
}


export default Agents