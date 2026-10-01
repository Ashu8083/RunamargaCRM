// admin-react/src/pages/Roles&Teams/Agents/API.js

import apiClient from '../../../../app/apiClient'


// ============================================================================
// BACKEND ERROR MESSAGE
// ============================================================================

export const getApiErrorMessage = (
    error,
    fallback = 'Something went wrong.'
) => {

    if (!error) {
        return fallback
    }

    const responseData =
        error?.response?.data

    // ------------------------------------------------------------------------
    // FastAPI detail string
    // ------------------------------------------------------------------------

    if (
        typeof responseData?.detail === 'string' &&
        responseData.detail.trim()
    ) {
        return responseData.detail.trim()
    }

    // ------------------------------------------------------------------------
    // Generic backend message
    // ------------------------------------------------------------------------

    if (
        typeof responseData?.message === 'string' &&
        responseData.message.trim()
    ) {
        return responseData.message.trim()
    }

    // ------------------------------------------------------------------------
    // Backend error
    // ------------------------------------------------------------------------

    if (
        typeof responseData?.error === 'string' &&
        responseData.error.trim()
    ) {
        return responseData.error.trim()
    }

    // ------------------------------------------------------------------------
    // FastAPI validation errors
    // ------------------------------------------------------------------------

    if (Array.isArray(responseData?.detail)) {

        const messages = responseData.detail
            .map((item) => {

                if (typeof item === 'string') {
                    return item
                }

                if (
                    typeof item?.msg === 'string'
                ) {
                    return item.msg
                }

                return null
            })
            .filter(Boolean)

        if (messages.length > 0) {
            return messages.join(', ')
        }
    }

    // ------------------------------------------------------------------------
    // Axios error message
    // ------------------------------------------------------------------------

    if (
        typeof error?.message === 'string' &&
        error.message.trim()
    ) {
        return error.message.trim()
    }

    return fallback
}


// ============================================================================
// NORMALIZE AGENT
// ============================================================================
//
// Backend:
//
// {
//     id,
//     employee_id,
//     context_id,
//     name,
//     email,
//     phone,
//     role,
//     role_code,
//     status,
//     is_active,
//     is_default,
//     reports_to_id,
//     created_at,
//     updated_at
// }
//
// ============================================================================

const normalizeAgent = (agent) => {

    if (!agent) {
        return null
    }

    const employeeId =
        agent.employee_id !== null &&
        agent.employee_id !== undefined
            ? Number(agent.employee_id)
            : null

    const contextId =
        agent.context_id !== null &&
        agent.context_id !== undefined
            ? Number(agent.context_id)
            : null

    const employeeContextId =
        agent.id !== null &&
        agent.id !== undefined
            ? Number(agent.id)
            : null

    const reportsToId =
        agent.reports_to_id !== null &&
        agent.reports_to_id !== undefined
            ? Number(agent.reports_to_id)
            : null

    return {
        ...agent,

        // --------------------------------------------------------------------
        // EmployeeContext.id
        // --------------------------------------------------------------------

        id: employeeContextId,

        // --------------------------------------------------------------------
        // Employee
        // --------------------------------------------------------------------

        employee_id: employeeId,
        employeeId: employeeId,

        // --------------------------------------------------------------------
        // Context
        // --------------------------------------------------------------------

        context_id: contextId,
        contextId: contextId,

        // --------------------------------------------------------------------
        // Role
        // --------------------------------------------------------------------

        role: agent.role || '',
        roleId: contextId,
        role_code: agent.role_code || '',

        // --------------------------------------------------------------------
        // Team Lead relationship
        // --------------------------------------------------------------------

        // reports_to_id is the Employee ID of the Team Lead.
        //
        reports_to_id: reportsToId,
        reportsToId: reportsToId,

        // --------------------------------------------------------------------
        // Status
        // --------------------------------------------------------------------

        is_active: Boolean(agent.is_active),

        status:
            Boolean(agent.is_active)
                ? 'Active'
                : 'Inactive',

        // --------------------------------------------------------------------
        // Display
        // --------------------------------------------------------------------

        name: agent.name || 'N/A',
        email: agent.email || 'N/A',
        phone: agent.phone || 'N/A',

        // --------------------------------------------------------------------
        // Date / Time
        // --------------------------------------------------------------------

        // Backend already returns formatted values such as:
        //
        // "06 Sep 2026, 01:55 PM"
        //
        // Keep the exact backend formatted value.

        created_at:
            agent.created_at ||
            null,

        updated_at:
            agent.updated_at ||
            null,

        createdAt:
            agent.created_at ||
            agent.createdAt ||
            'N/A',

        updatedAt:
            agent.updated_at ||
            agent.updatedAt ||
            'N/A',
    }
}


// ============================================================================
// NORMALIZE TEAM LEAD
// ============================================================================
//
// IMPORTANT:
//
// id
//     = Team Lead EmployeeContext.id
//
// employee_id
//     = Team Lead Employee.id
//
// context_id
//     = Team Lead Context.id
//
// ============================================================================

const normalizeTeamLead = (teamLead) => {

    if (!teamLead) {
        return null
    }

    const employeeContextId =
        teamLead.id !== null &&
        teamLead.id !== undefined
            ? Number(teamLead.id)
            : null

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

    const reportsToId =
        teamLead.reports_to_id !== null &&
        teamLead.reports_to_id !== undefined
            ? Number(teamLead.reports_to_id)
            : null

    return {
        ...teamLead,

        // --------------------------------------------------------------------
        // EmployeeContext.id
        // --------------------------------------------------------------------

        id: employeeContextId,

        // --------------------------------------------------------------------
        // Employee
        // --------------------------------------------------------------------

        employee_id: employeeId,
        employeeId: employeeId,

        // --------------------------------------------------------------------
        // Context
        // --------------------------------------------------------------------

        context_id: contextId,
        contextId: contextId,

        // --------------------------------------------------------------------
        // Role
        // --------------------------------------------------------------------

        role: teamLead.role || '',
        roleId: contextId,
        role_code: teamLead.role_code || '',

        // --------------------------------------------------------------------
        // Hierarchy
        // --------------------------------------------------------------------

        reports_to_id: reportsToId,
        reportsToId: reportsToId,

        // --------------------------------------------------------------------
        // Status
        // --------------------------------------------------------------------

        is_active: Boolean(teamLead.is_active),

        status:
            Boolean(teamLead.is_active)
                ? 'Active'
                : 'Inactive',

        // --------------------------------------------------------------------
        // Display
        // --------------------------------------------------------------------

        name: teamLead.name || 'N/A',
        email: teamLead.email || 'N/A',
        phone: teamLead.phone || 'N/A',

        // --------------------------------------------------------------------
        // Date / Time
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
// NORMALIZE AGENT ROLE
// ============================================================================

const normalizeAgentRole = (role) => {

    if (!role) {
        return null
    }

    const contextId =
        role.id !== null &&
        role.id !== undefined
            ? Number(role.id)
            : null

    return {
        ...role,

        id: contextId,

        context_id: contextId,
        contextId: contextId,

        name:
            role.name ||
            'N/A',

        label:
            role.name ||
            role.label ||
            role.code ||
            'N/A',

        code:
            role.code ||
            '',

        role:
            role.name ||
            role.code ||
            '',

        roleId:
            contextId,

        description:
            role.description ||
            '',

        is_active:
            Boolean(role.is_active),
    }
}


// ============================================================================
// GET AGENTS
// ============================================================================

export const getAgents = async () => {

    const response = await apiClient.get(
        '/agents'
    )

    const data =
        Array.isArray(response.data)
            ? response.data
            : []

    return data
        .map(normalizeAgent)
        .filter(Boolean)
}


// ============================================================================
// CREATE AGENT
// ============================================================================

export const createAgent = async (
    payload
) => {

    const response = await apiClient.post(
        '/agents',
        payload
    )

    return response.data
}


// ============================================================================
// UPDATE AGENT
// ============================================================================

export const updateAgent = async (
    agentId,
    payload
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    const response = await apiClient.put(
        `/agents/${agentId}`,
        payload
    )

    return response.data
}


// ============================================================================
// DELETE AGENT
// ============================================================================

export const deleteAgent = async (
    agentId
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    const response = await apiClient.delete(
        `/agents/${agentId}`
    )

    return response.data
}


// ============================================================================
// UPDATE AGENT STATUS
// ============================================================================

export const updateAgentStatus = async (
    agentId,
    status
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    const normalizedStatus =
        status === 'Inactive'
            ? 'Inactive'
            : 'Active'

    const response = await apiClient.patch(
        `/agents/${agentId}/status`,
        {
            status: normalizedStatus,
        }
    )

    return response.data
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
// AGENT / RM ROLES
// ============================================================================
//
// GET /agents/roles
//
// Backend dynamically returns:
//
//     AGENT
//     AGENT_*
//
//     RM
//     RM_*
//
// ============================================================================

export const getAgentRoles = async () => {

    const response = await apiClient.get(
        '/agents/roles'
    )

    const data =
        Array.isArray(response.data)
            ? response.data
            : []

    return data
        .map(normalizeAgentRole)
        .filter(
            (role) =>
                role &&
                role.is_active
        )
}


// ============================================================================
// AVAILABLE TEAM LEADS
// ============================================================================
//
// GET /agents/team-leads
//
// id = Team Lead EmployeeContext.id
//
// ============================================================================

export const getAvailableTeamLeads = async () => {

    const response = await apiClient.get(
        '/agents/team-leads'
    )

    const data =
        Array.isArray(response.data)
            ? response.data
            : []

    return data
        .map(normalizeTeamLead)
        .filter(Boolean)
}


// ============================================================================
// ASSIGNED TEAM LEAD
// ============================================================================
//
// GET /agents/{agent_id}/team-leads
//
// ============================================================================

export const getAssignedTeamLeads = async (
    agentId
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    const response = await apiClient.get(
        `/agents/${agentId}/team-leads`
    )

    const data =
        Array.isArray(response.data)
            ? response.data
            : []

    return data
        .map(normalizeTeamLead)
        .filter(Boolean)
}


// ============================================================================
// ASSIGN TEAM LEAD
// ============================================================================
//
// IMPORTANT:
//
// teamLeadId MUST be Team Lead EmployeeContext.id.
//
// Request:
//
// PUT /agents/{agent_id}/team-lead
//
// Body:
//
// {
//     "team_lead_id": 9
// }
//
// ============================================================================

export const assignTeamLead = async (
    agentId,
    teamLeadId
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    if (
        teamLeadId === null ||
        teamLeadId === undefined ||
        teamLeadId === ''
    ) {
        throw new Error(
            'Team Lead ID is required.'
        )
    }

    const normalizedAgentId =
        Number(agentId)

    const normalizedTeamLeadId =
        Number(teamLeadId)

    if (
        !Number.isInteger(normalizedAgentId) ||
        normalizedAgentId <= 0
    ) {
        throw new Error(
            'Invalid Agent ID.'
        )
    }

    if (
        !Number.isInteger(normalizedTeamLeadId) ||
        normalizedTeamLeadId <= 0
    ) {
        throw new Error(
            'Invalid Team Lead ID.'
        )
    }

    const requestBody = {
        team_lead_id: normalizedTeamLeadId,
    }

    const response = await apiClient.put(
        `/agents/${normalizedAgentId}/team-lead`,
        requestBody
    )

    return response.data
}


// ============================================================================
// REMOVE TEAM LEAD
// ============================================================================
//
// PUT /agents/{agent_id}/team-lead
//
// Body:
//
// {
//     "team_lead_id": null
// }
//
// ============================================================================

export const removeTeamLead = async (
    agentId
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    const normalizedAgentId =
        Number(agentId)

    if (
        !Number.isInteger(normalizedAgentId) ||
        normalizedAgentId <= 0
    ) {
        throw new Error(
            'Invalid Agent ID.'
        )
    }

    const requestBody = {
        team_lead_id: null,
    }

    const response = await apiClient.put(
        `/agents/${normalizedAgentId}/team-lead`,
        requestBody
    )

    return response.data
}


// ============================================================================
// PERMISSIONS
// ============================================================================
//
// Existing permissions functions preserved.
// ============================================================================

export const getPermissions = async () => {

    const response = await apiClient.get(
        '/permissions'
    )

    return response.data
}


export const updateAgentPermissions = async (
    agentId,
    permissionIds
) => {

    if (
        agentId === null ||
        agentId === undefined ||
        agentId === ''
    ) {
        throw new Error(
            'Agent ID is required.'
        )
    }

    const response = await apiClient.put(
        `/agents/${agentId}/permissions`,
        {
            permission_ids:
                permissionIds,
        }
    )

    return response.data
}