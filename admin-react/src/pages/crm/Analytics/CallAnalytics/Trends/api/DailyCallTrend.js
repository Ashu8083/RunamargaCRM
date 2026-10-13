// admin-react/src/pages/crm/Analytics/CallAnalytics/Trends/api/DailyCallTrend.js

import apiClient from '../../../../../../app/apiClient'


const hasValue = (value) => (
    value !== '' &&
    value !== null &&
    value !== undefined
)


// =============================================================
// GET DAILY CALL TREND
// =============================================================

export const fetchDailyCallTrend = async ({
    fromDate = '',
    toDate = '',
    contextId = '',
} = {}) => {

    const params = {}

    if (hasValue(fromDate)) {
        params.from_date = fromDate
    }

    if (hasValue(toDate)) {
        params.to_date = toDate
    }

    if (hasValue(contextId)) {
        params.context_id = contextId
    }

    const response = await apiClient.get(
        '/call-analytics/daily-call-trend',
        {
            params,
        }
    )

    return response.data
}