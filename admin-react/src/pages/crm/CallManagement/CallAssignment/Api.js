// admin-react/src/pages/CallManagement/CallAssignment/Api.js

import apiClient from '../../../../app/apiClient'

export const getCallAssignments = async ({
    page = 1,
    pageSize = 10,
    page_size,
    search = '',
    status = '',
    rm = '',
    dateFilter = '',
    fromDate = '',
    toDate = '',
} = {}) => {
    const response = await apiClient.get('/call-assignments', {
        params: {
            page,
            page_size: page_size ?? pageSize,
            search,
            status,
            rm,
            dateFilter,
            fromDate,
            toDate,
        },
    })

    return response.data
}

export const createCallAssignment = async ({
    phoneNumber,
    assignedToId,
}) => {
    const response = await apiClient.post('/call-assignments', null, {
        params: {
            phone_number: phoneNumber,
            assigned_to_id: assignedToId,
        },
    })

    return response.data
}


export const getAvailableCallNumbers = async () => {
    const response = await apiClient.get(
        '/call-assignments/available'
    )

    return response.data
}


export const getCallHistory = async (phoneNumber) => {
    const response = await apiClient.get(
        `/call-logs/${encodeURIComponent(phoneNumber)}/history`
    )

    return response.data
}


export const createApplication = async (payload) => {
    const response = await apiClient.post(
        '/applications/create',
        payload
    )
    
    return response.data
}


export const exchangeCallAssignment = async ({
    assignmentId,
    newAgentId,
}) => {
    const response = await apiClient.post(
        '/call-assignments/exchange',
        {
            assignmentId,
            newAgentId,
        }
    )

    return response.data
}

// =============================================================
// DELETE CALL ASSIGNMENT
// =============================================================

export const deleteCallAssignment = async (assignmentId) => {
    const response = await apiClient.delete(
        `/call-assignments/${assignmentId}`
    )

    return response.data
}
