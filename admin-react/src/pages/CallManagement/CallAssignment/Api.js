// admin-react/src/pages/CallManagement/CallAssignment/Api.js

import apiClient from '../../../app/apiClient'

export const getCallAssignments = async () => {
    const response = await apiClient.get('/call-assignments')
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