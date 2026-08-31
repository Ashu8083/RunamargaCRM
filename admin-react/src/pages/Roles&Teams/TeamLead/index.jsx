// admin-react/src/pages/Role-management/TeamLead/index.jsx

import { useState } from 'react'

import TeamLeadTable from './components/TeamLeadTable'
import TeamLeadModal from './components/TeamLeadModal'
import AssignedAgentsModal from './components/AssignedAgentsModal'

import PermissionsModal from '../../../components/GlobalModels/PermissionsModal'


function TeamLead() {

    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] = useState('')


    // =========================================================
    // MOCK EMPLOYEES
    //
    // These are existing employees.
    //
    // Team Lead creation does NOT create an employee.
    // We only select existing employees while assigning them.
    // =========================================================

    const [employees] = useState([
        {
            id: 101,
            employeeId: 'EMP001',
            name: 'Agent One',
            phone: '9876543210',
            email: 'agent1@example.com',
            status: 'Active',
        },

        {
            id: 102,
            employeeId: 'EMP002',
            name: 'Agent Two',
            phone: '9876543211',
            email: 'agent2@example.com',
            status: 'Active',
        },

        {
            id: 103,
            employeeId: 'EMP003',
            name: 'Agent Three',
            phone: '9876543212',
            email: 'agent3@example.com',
            status: 'Active',
        },

        {
            id: 104,
            employeeId: 'EMP004',
            name: 'Agent Four',
            phone: '9876543213',
            email: 'agent4@example.com',
            status: 'Absent',
        },

        {
            id: 105,
            employeeId: 'EMP005',
            name: 'Agent Five',
            phone: '9876543214',
            email: 'agent5@example.com',
            status: 'Active',
        },
    ])


    // =========================================================
    // TEAM LEADS
    //
    // Team Lead data is managed here.
    //
    // assignedAgentIds contains IDs of existing employees.
    // =========================================================

    const [teamLeads, setTeamLeads] = useState([

        {
            id: 1,

            name: 'John Doe',

            phone: '9876543200',

            email: 'john@example.com',

            status: 'Active',

            createdAt: 'Apr 7, 2026, 3:13:50 PM',

            updatedAt: 'N/A',

            assignedAgentIds: [
                101,
            ],

            permissions: [],
        },

        {
            id: 2,

            name: 'Rahul Kumar',

            phone: '9876543201',

            email: 'rahul@example.com',

            status: 'Absent',

            createdAt: 'Apr 8, 2026, 10:20:15 AM',

            updatedAt: 'Apr 10, 2026, 2:30:10 PM',

            assignedAgentIds: [
                102,
                103,
            ],

            permissions: [],
        },

    ])


    // =========================================================
    // ADD TEAM LEAD MODAL
    //
    // This modal is only for creating a Team Lead record.
    //
    // No editing is supported.
    // Status is changed directly from the table.
    // =========================================================

    const [showModal, setShowModal] = useState(false)


    // =========================================================
    // ASSIGNED AGENTS MODAL
    // =========================================================

    const [showAgentsModal, setShowAgentsModal] = useState(false)

    const [selectedTeamLead, setSelectedTeamLead] = useState(null)


    // =========================================================
    // PERMISSIONS MODAL
    // =========================================================

    const [showPermissionsModal, setShowPermissionsModal] =
        useState(false)


    // =========================================================
    // CREATE TEAM LEAD
    // =========================================================

    const handleCreate = () => {

        setShowModal(true)

    }


    // =========================================================
    // CLOSE CREATE MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false)

    }


    // =========================================================
    // CREATE TEAM LEAD
    //
    // Only the Team Lead record is created.
    //
    // No employee information is entered here.
    // =========================================================

    const handleSubmit = (data) => {

        const now = new Date().toLocaleString(
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


        const newTeamLead = {

            id: Date.now(),

            name: data.name,

            phone: data.phone,

            email: data.email,

            status: data.status,

            createdAt: now,

            updatedAt: 'N/A',

            assignedAgentIds: [],

            permissions: [],

        }


        setTeamLeads((previous) => [

            ...previous,

            newTeamLead,

        ])


        handleCloseModal()

    }


    // =========================================================
    // DELETE TEAM LEAD
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
                (item) =>
                    item.id !== teamLead.id
            )
        )

    }


    // =========================================================
    // STATUS CHANGE
    //
    // Status is the only editable Team Lead field.
    // =========================================================

    const handleStatusChange = (
        teamLead,
        status
    ) => {

        setTeamLeads((previous) =>

            previous.map((item) => {

                if (item.id !== teamLead.id) {
                    return item
                }


                return {

                    ...item,

                    status,

                    updatedAt:
                        new Date().toLocaleString(
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

            })

        )

    }


    // =========================================================
    // VIEW / ASSIGN AGENTS
    // =========================================================

    const handleViewAgents = (teamLead) => {

        setSelectedTeamLead(teamLead)

        setShowAgentsModal(true)

    }


    // =========================================================
    // CLOSE AGENTS MODAL
    // =========================================================

    const handleCloseAgents = () => {

        setShowAgentsModal(false)

        setSelectedTeamLead(null)

    }


    // =========================================================
    // SAVE AGENT ASSIGNMENTS
    // =========================================================

    const handleAssignmentChange = ({
        teamLeadId,
        employeeIds,
    }) => {

        setTeamLeads((previous) =>

            previous.map((teamLead) => {

                if (
                    teamLead.id !== teamLeadId
                ) {
                    return teamLead
                }


                return {

                    ...teamLead,

                    assignedAgentIds:
                        employeeIds,

                }

            })

        )


        /*
         * Later replace with API call.
         *
         * PUT /team-leads/{teamLeadId}/agents
         *
         * Body:
         *
         * {
         *     employee_ids: employeeIds
         * }
         */


        console.log(
            'Team Lead:',
            teamLeadId
        )

        console.log(
            'Assigned Employee IDs:',
            employeeIds
        )

    }


    // =========================================================
    // MANAGE PERMISSIONS
    // =========================================================

    const handleManagePermissions = (
        teamLead
    ) => {

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
    // SAVE PERMISSIONS
    //
    // Global PermissionsModal currently closes itself after save.
    // The actual backend integration can be added there later.
    // =========================================================


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * Later:
         *
         * GET /team-leads
         *
         * GET /employees
         */

        console.log(
            'Refresh team leads'
        )

    }


    // =========================================================
    // RESOLVE ASSIGNED EMPLOYEES
    //
    // Convert assignedAgentIds into employee objects before
    // sending them to AssignedAgentsModal.
    // =========================================================

    const selectedTeamLeadWithEmployees =
        selectedTeamLead
            ? {
                ...selectedTeamLead,

                assignedAgents:
                    employees.filter(
                        (employee) =>
                            selectedTeamLead
                                .assignedAgentIds
                                ?.some(
                                    (id) =>
                                        String(id) ===
                                        String(employee.id)
                                )
                    ),

            }
            : null


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
                PAGE HEADER
            ================================================= */}

            <div>

                <h1 className="
                    text-2xl
                    font-semibold
                    sm:text-3xl
                ">
                    Team Leads
                </h1>


                <p className="
                    mt-1
                    text-sm
                    text-base-content/60
                ">
                    Manage team leads, assigned agents and permissions.
                </p>

            </div>


            {/* =================================================
                TEAM LEAD TABLE
            ================================================= */}

            <TeamLeadTable
                teamLeads={teamLeads}
                search={search}
                setSearch={setSearch}
                onCreate={handleCreate}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                onViewAgents={handleViewAgents}
                onManagePermissions={
                    handleManagePermissions
                }
                onStatusChange={handleStatusChange}
            />


            {/* =================================================
                CREATE TEAM LEAD MODAL
            ================================================= */}

            <TeamLeadModal
                open={showModal}
                teamLead={null}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />


            {/* =================================================
                ASSIGNED AGENTS MODAL
            ================================================= */}

            <AssignedAgentsModal
                open={showAgentsModal}
                teamLead={
                    selectedTeamLeadWithEmployees
                }
                employees={employees}
                onClose={handleCloseAgents}
                onAssignmentChange={
                    handleAssignmentChange
                }
            />


            {/* =================================================
                GLOBAL PERMISSIONS MODAL
            ================================================= */}

            <PermissionsModal
                open={showPermissionsModal}
                admin={selectedTeamLead}
                onClose={handleClosePermissions}
            />

        </div>

    )

}


export default TeamLead