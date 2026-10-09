import apiClient from '../../../../../../app/apiClient'

export const fetchAdNumberCallTrend = async ({
    fromDate,
    toDate,
    phoneId = '',
    teamLeadId = '',
    rmId = '',
}) => {

    const params = {}

    if (fromDate) {
        params.from_date = fromDate
    }

    if (toDate) {
        params.to_date = toDate
    }

    if (phoneId) {
        params.phone_id = phoneId
    }

    if (teamLeadId) {
        params.team_lead_id = teamLeadId
    }

    if (rmId) {
        params.rm_id = rmId
    }

    const response = await apiClient.get(
        '/call-analytics/trends/ad-number',
        {
            params,
        }
    )

    return response.data
}