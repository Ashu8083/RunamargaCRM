// admin-react\src\pages\Roles&Teams\TeamLead\index.jsx
import { useState } from 'react'

import TeamLeadTable from './components/TeamLeadTable'
import TeamLeadModal from './components/TeamLeadModal'
import AssignedAgentsModal from './components/AssignedAgentsModal'
import PermissionsModal from './components/PermissionsModal'


function TeamLead() {

    const [search, setSearch] = useState('')

    const [teamLeads, setTeamLeads] = useState([
        {
            id: 1,
            name: 'John Doe',
            phone: '9876543210',
            email: 'john@example.com',
            status: 'Active',
            createdAt: 'Apr 7, 2026, 3:13:50 PM',
            updatedAt: 'N/A',
            assignedAgents: [],
            permissions: [],
        },
        {
            id: 2,
            name: 'Rahul Kumar',
            phone: '9876543211',
            email: 'rahul@example.com',
            status: 'Absent',
            createdAt: 'Apr 8, 2026, 10:20:15 AM',
            updatedAt: 'Apr 10, 2026, 2:30:10 PM',
            assignedAgents: [],
            permissions: [],
        },
    ])


    const [showModal, setShowModal] = useState(false)

    const [editingTeamLead, setEditingTeamLead] = useState(null)


    const [showAgentsModal, setShowAgentsModal] = useState(false)

    const [selectedTeamLead, setSelectedTeamLead] = useState(null)


    const [showPermissionsModal, setShowPermissionsModal] = useState(false)


    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = () => {

        setEditingTeamLead(null)

        setShowModal(true)
    }


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (teamLead) => {

        setEditingTeamLead(teamLead)

        setShowModal(true)
    }


    // =========================================================
    // CLOSE ADD / EDIT MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

        setEditingTeamLead(null)
    }


    // =========================================================
    // CREATE / UPDATE
    // =========================================================

    const handleSubmit = (data) => {

        if (editingTeamLead) {

            setTeamLeads((previous) =>
                previous.map((teamLead) =>
                    teamLead.id === editingTeamLead.id
                        ? {
                            ...teamLead,
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
                        : teamLead
                )
            )

        } else {

            const newTeamLead = {

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

                assignedAgents: [],

                permissions: [],

            }


            setTeamLeads((previous) => [
                ...previous,
                newTeamLead,
            ])
        }


        handleCloseModal()
    }


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (teamLead) => {

        const confirmed = window.confirm(
            `Delete team lead "${teamLead.name}"?`
        )


        if (!confirmed) {
            return
        }


        setTeamLeads((previous) =>
            previous.filter(
                (item) => item.id !== teamLead.id
            )
        )
    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (teamLead, status) => {

        setTeamLeads((previous) =>
            previous.map((item) =>
                item.id === teamLead.id
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
    // VIEW ASSIGNED AGENTS
    // =========================================================

    const handleViewAgents = (teamLead) => {

        setSelectedTeamLead(teamLead)

        setShowAgentsModal(true)
    }


    // =========================================================
    // CLOSE ASSIGNED AGENTS
    // =========================================================

    const handleCloseAgents = () => {

        setShowAgentsModal(false)

        setSelectedTeamLead(null)
    }


    // =========================================================
    // MANAGE PERMISSIONS
    // =========================================================

    const handleManagePermissions = (teamLead) => {

        setSelectedTeamLead(teamLead)

        setShowPermissionsModal(true)
    }


    // =========================================================
    // CLOSE PERMISSIONS
    // =========================================================

    const handleClosePermissions = () => {

        setShowPermissionsModal(false)

        setSelectedTeamLead(null)
    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        // API refresh will be added later.

        console.log('Refresh team leads')
    }


    return (
        <div className="p-4 sm:p-6 space-y-5">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div>

                <h1 className="text-2xl sm:text-3xl font-semibold">
                    Team Leads
                </h1>

                <p className="text-sm text-base-content/60 mt-1">
                    Manage team leads, assigned agents and permissions.
                </p>

            </div>


            {/* =====================================================
                TEAM LEAD TABLE
            ===================================================== */}

            <TeamLeadTable
                teamLeads={teamLeads}
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                onViewAgents={handleViewAgents}
                onManagePermissions={handleManagePermissions}
                onStatusChange={handleStatusChange}
            />


            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <TeamLeadModal
                open={showModal}
                teamLead={editingTeamLead}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />


            {/* =====================================================
                ASSIGNED AGENTS MODAL
            ===================================================== */}

            <AssignedAgentsModal
                open={showAgentsModal}
                teamLead={selectedTeamLead}
                onClose={handleCloseAgents}
            />


            {/* =====================================================
                PERMISSIONS MODAL
            ===================================================== */}

            <PermissionsModal
                open={showPermissionsModal}
                teamLead={selectedTeamLead}
                onClose={handleClosePermissions}
            />

        </div>
    )
}


export default TeamLead