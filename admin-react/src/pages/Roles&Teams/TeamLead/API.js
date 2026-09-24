// admin-react/src/pages/Role-management/TeamLead/API.js

import apiClient from '../../../app/apiClient'


// ============================================================================
// NORMALIZE TEAM LEAD
// ============================================================================
//
// Backend response:
//
// {
//     id: 8,
//     employee_id: 1,
//     context_id: 7,
//     name: "Test Admin 1",
//     email: "...",
//     phone: "...",
//     role: "teamlead_personal",
//     status: "Active",
//     is_active: true,
//     ...
// }
//
// IMPORTANT:
//
// id
//     = EmployeeContext.id
//
// employee_id
//     = employees.id
//
// context_id
//     = contexts.id
//
// role
//     = Context.code / role code
//
// ============================================================================

const normalizeTeamLead = (teamLead) => {

    if (!teamLead) {
        return null
    }


    const employeeId =
        teamLead.employee_id !== null &&
        teamLead.employee_id !== undefined
            ? Number(teamLead.employee_id)
            : null


    const contextId =
        teamLead.context_id !== null &&
        teamLead.context_id !== undefined
            ? Number(teamLead.context_id)
            : null


    const employeeContextId =
        teamLead.id !== null &&
        teamLead.id !== undefined
            ? Number(teamLead.id)
            : null


    return {
        ...teamLead,

        // --------------------------------------------------------------------
        // EmployeeContext ID
        // --------------------------------------------------------------------

        id: employeeContextId,


        // --------------------------------------------------------------------
        // Employee
        // --------------------------------------------------------------------

        employee_id: employeeId,

        employeeId: employeeId,


        // --------------------------------------------------------------------
        // Context / Role
        // --------------------------------------------------------------------

        context_id: contextId,

        contextId: contextId,


        role:
            teamLead.role ||
            '',


        roleId:
            contextId,


        // --------------------------------------------------------------------
        // Status
        // --------------------------------------------------------------------

        is_active:
            Boolean(teamLead.is_active),

        status:
            teamLead.status === 'Inactive'
                ? 'Inactive'
                : 'Active',


        // --------------------------------------------------------------------
        // Display fields
        // --------------------------------------------------------------------

        name:
            teamLead.name ||
            'N/A',

        email:
            teamLead.email ||
            'N/A',

        phone:
            teamLead.phone ||
            'N/A',


        // --------------------------------------------------------------------
        // Dates
        // --------------------------------------------------------------------

        created_at:
            teamLead.created_at ||
            null,

        updated_at:
            teamLead.updated_at ||
            null,

        createdAt:
            teamLead.created_at ||
            teamLead.createdAt ||
            'N/A',

        updatedAt:
            teamLead.updated_at ||
            teamLead.updatedAt ||
            'N/A',
    }
}


// ============================================================================
// NORMALIZE ASSIGNED EMPLOYEE
// ============================================================================
//
// Backend response:
//
// [
//     {
//         id: 73,
//         employee_id: 33,
//         context_id: 3,
//         name: "Lokesh A",
//         email: "...",
//         phone: "...",
//         role: "Relationship Manager",
//         status: "Active",
//         reports_to_id: 89
//     }
// ]
//
// IMPORTANT:
//
// id
//     = EmployeeContext.id
//
// employee_id
//     = employees.id
//
// context_id
//     = contexts.id
//
// reports_to_id
//     = Team Lead / reporting EmployeeContext ID
//
// We preserve the original backend fields and also provide
// camelCase aliases for the frontend.
//
// ============================================================================

const normalizeAssignedEmployee = (
    employee
) => {

    if (!employee) {
        return null
    }


    const employeeContextId =
        employee.id !== null &&
        employee.id !== undefined
            ? Number(employee.id)
            : null


    const employeeId =
        employee.employee_id !== null &&
        employee.employee_id !== undefined
            ? Number(employee.employee_id)
            : null


    const contextId =
        employee.context_id !== null &&
        employee.context_id !== undefined
            ? Number(employee.context_id)
            : null


    const reportsToId =
        employee.reports_to_id !== null &&
        employee.reports_to_id !== undefined
            ? Number(employee.reports_to_id)
            : null


    return {
        ...employee,


        // --------------------------------------------------------------------
        // EmployeeContext ID
        // --------------------------------------------------------------------

        id:
            employeeContextId,


        employeeContextId:
            employeeContextId,


        // --------------------------------------------------------------------
        // Employee ID
        // --------------------------------------------------------------------

        employee_id:
            employeeId,


        employeeId:
            employeeId,


        // --------------------------------------------------------------------
        // Context
        // --------------------------------------------------------------------

        context_id:
            contextId,


        contextId:
            contextId,


        // --------------------------------------------------------------------
        // Reporting Team Lead
        // --------------------------------------------------------------------

        reports_to_id:
            reportsToId,


        reportsToId:
            reportsToId,


        // --------------------------------------------------------------------
        // Display fields
        // --------------------------------------------------------------------

        name:
            employee.name ||
            'N/A',


        email:
            employee.email ||
            'N/A',


        phone:
            employee.phone ||
            employee.mobile ||
            employee.phone_number ||
            'N/A',


        role:
            employee.role ||
            '',


        // --------------------------------------------------------------------
        // Status
        // --------------------------------------------------------------------

        is_active:
            employee.is_active !== undefined
                ? Boolean(employee.is_active)
                : employee.status !== 'Inactive',


        status:
            employee.status === 'Inactive'
                ? 'Inactive'
                : 'Active',
    }
}


// ============================================================================
// TEAM LEADS
// ============================================================================

export const getTeamLeads = async () => {

    const response = await apiClient.get(
        '/team-leads'
    )


    const data = Array.isArray(response.data)
        ? response.data
        : []


    return data
        .map(normalizeTeamLead)
        .filter(Boolean)
}


// ============================================================================
// CREATE TEAM LEAD
// ============================================================================

export const createTeamLead = async (
    payload
) => {

    const response = await apiClient.post(
        '/team-leads',
        payload
    )


    return response.data
}


// ============================================================================
// UPDATE TEAM LEAD
// ============================================================================

export const updateTeamLead = async (
    teamLeadId,
    payload
) => {

    const response = await apiClient.put(
        `/team-leads/${teamLeadId}`,
        payload
    )


    return response.data
}


// ============================================================================
// DELETE TEAM LEAD
// ============================================================================

export const deleteTeamLead = async (
    teamLeadId
) => {

    const response = await apiClient.delete(
        `/team-leads/${teamLeadId}`
    )


    return response.data
}


// ============================================================================
// TEAM LEAD STATUS
// ============================================================================

export const updateTeamLeadStatus = async (
    teamLeadId,
    status
) => {

    const response = await apiClient.patch(
        `/team-leads/${teamLeadId}/status`,
        {
            status,
        }
    )


    return response.data
}


// ============================================================================
// ASSIGNED AGENTS - VIEW ONLY
// ============================================================================
//
// GET
// /team-leads/{teamLeadId}/agents
//
// The backend returns the employees assigned to the selected Team Lead.
//
// Example:
//
// [
//     {
//         id: 73,
//         employee_id: 33,
//         context_id: 3,
//         name: "Lokesh A",
//         email: "...",
//         phone: "...",
//         role: "Relationship Manager",
//         status: "Active",
//         reports_to_id: 89
//     }
// ]
//
// ============================================================================

export const getAssignedAgents = async (
    teamLeadId
) => {

    if (
        teamLeadId === null ||
        teamLeadId === undefined ||
        teamLeadId === ''
    ) {
        return []
    }


    const response = await apiClient.get(
        `/team-leads/${teamLeadId}/agents`
    )


    const data = response.data


    // ------------------------------------------------------------------------
    // Support direct array response
    // ------------------------------------------------------------------------

    if (Array.isArray(data)) {

        return data
            .map(normalizeAssignedEmployee)
            .filter(Boolean)

    }


    // ------------------------------------------------------------------------
    // Support wrapped response
    //
    // In case backend later returns:
    //
    // {
    //     employees: [...]
    // }
    // ------------------------------------------------------------------------

    if (
        data &&
        Array.isArray(data.employees)
    ) {

        return data.employees
            .map(normalizeAssignedEmployee)
            .filter(Boolean)

    }


    // ------------------------------------------------------------------------
    // Support assigned_agents response
    //
    // In case backend later returns:
    //
    // {
    //     assigned_agents: [...]
    // }
    // ------------------------------------------------------------------------

    if (
        data &&
        Array.isArray(data.assigned_agents)
    ) {

        return data.assigned_agents
            .map(normalizeAssignedEmployee)
            .filter(Boolean)

    }


    return []
}


// ============================================================================
// EMPLOYEES
// ============================================================================

export const getEmployees = async () => {

    const response = await apiClient.get(
        '/employees'
    )


    return response.data
}


// ============================================================================
// TEAM LEAD ROLES / CONTEXTS
// ============================================================================

export const getTeamLeadRoles = async () => {

    const response = await apiClient.get(
        '/common/team-lead-roles'
    )


    return response.data
}


// ============================================================================
// PERMISSIONS
// ============================================================================

export const getPermissions = async () => {

    const response = await apiClient.get(
        '/permissions'
    )


    return response.data
}


// ============================================================================
// TEAM LEAD PERMISSIONS
// ============================================================================
//
// NOTE:
//
// This function is kept for compatibility with existing code.
//
// The global PermissionsModal uses:
//     employeeId
//     contextId
//
// It does NOT use teamLeadId for permission assignment.
//
// ============================================================================

export const updateTeamLeadPermissions = async (
    teamLeadId,
    permissionIds
) => {

    const response = await apiClient.put(
        `/team-leads/${teamLeadId}/permissions`,
        {
            permission_ids: permissionIds,
        }
    )


    return response.data
}