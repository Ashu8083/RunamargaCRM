// admin-react/src/pages/crm/Analytics/CallAnalytics/Trends/api/MonthlyCallTrend.js

import apiClient from '../../../../../../app/apiClient'


const hasValue = (value) => (
    value !== '' &&
    value !== null &&
    value !== undefined
)


export const fetchMonthlyCallOverview = async ({
    year,
    month,
    contextId = '',
} = {}) => {

    const params = {}

    if (hasValue(year)) {
        params.year = year
    }

    if (hasValue(month)) {
        params.month = month
    }

    if (hasValue(contextId)) {
        params.context_id = contextId
    }

    const response = await apiClient.get(
        '/call-analytics/monthly-call-overview',
        {
            params,
        }
    )

    return response.data
}