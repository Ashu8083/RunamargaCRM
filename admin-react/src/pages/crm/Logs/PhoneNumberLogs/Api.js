import apiClient from '../../../../app/apiClient'

export const getPhoneNumberAuditLogs = async ({
    skip = 0,
    limit = 100,
    action = '',
    actionBy = '',
    actionOn = '',
    reportTo = '',
    phoneNumberId = '',
} = {}) => {
    const params = { skip, limit }

    if (action) params.action = action
    if (actionBy !== '') params.action_by = actionBy
    if (actionOn !== '') params.action_on = actionOn
    if (reportTo !== '') params.report_to = reportTo
    if (phoneNumberId !== '') params.phone_number_id = phoneNumberId

    const response = await apiClient.get(
        '/phone-number-audit-logs',
        { params }
    )

    return response.data
}

export const getPhoneNumberAuditLogById = async (logId) => {
    const response = await apiClient.get(
        `/phone-number-audit-logs/${logId}`
    )

    return response.data
}