// admin-react/src/pages/Dashboard/components/MonthlyTrend/API.js

import apiClient from "../../../../../app/apiClient";

export const getMonthlyTrendData = async ({
    contextId,
    period = 3,
} = {}) => {
    const params = {
        period,
    };

    if (contextId) {
        params.context_id = Number(contextId);
    }

    const response = await apiClient.get(
        "/dashboard/monthly-trend",
        {
            params,
        }
    );

    return response.data;
};