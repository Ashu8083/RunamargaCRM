// admin-react/src/pages/Dashboard/components/MonthlyTrend/API.js

import apiClient from "../../../../app/apiClient";

export const getMonthlyTrendData = async ({
    period = 3,
} = {}) => {
    const params = {
        period,
    };

    const response = await apiClient.get(
        "/dashboard/monthly-trend",
        {
            params,
        }
    );

    return response.data;
};