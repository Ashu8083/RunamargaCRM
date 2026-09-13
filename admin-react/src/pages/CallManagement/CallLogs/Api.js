// admin-react/src/pages/CallManagement/CallLogs/Api.js

import apiClient from '../../../app/apiClient'

export const getCallLogs = async () => {
    const response = await apiClient.get('/call-logs')
    return response.data
}

export const getCallHistory = async (phoneNumber) => {
    const response = await apiClient.get(
        `/call-logs/${encodeURIComponent(phoneNumber)}/history`
    )
    return response.data
}