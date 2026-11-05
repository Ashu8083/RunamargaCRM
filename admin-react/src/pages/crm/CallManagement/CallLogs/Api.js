// admin-react/src/pages/CallManagement/CallLogs/Api.js

import apiClient from '../../../../app/apiClient'

const cleanParams = (params = {}) =>
    Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== '' &&
                value !== null &&
                value !== undefined
        )
    )

export const getCallLogs = async (params = {}) => {
    const response = await apiClient.get('/call-logs', {
        params: cleanParams(params),
    })
    return response.data
}

export const getCallHistory = async (
    phoneNumber,
    params = {}
) => {
    const response = await apiClient.get(
        `/call-logs/${encodeURIComponent(phoneNumber)}/history`,
        {
            params: cleanParams(params),
        }
    )
    return response.data
}
