// admin-react/src/pages/Dashboard/components/LoanTypeDistribution/API.js

import apiClient from "../../../../../app/apiClient";

export const getLoanTypeDistributionData = async ({
    contextId,
    fromDate = "",
    toDate = "",
    status = "In Process",
} = {}) => {
    const params = {};

    if (contextId) {
        params.context_id = Number(contextId);
    }

    if (fromDate) {
        params.from_date = fromDate;
    }

    if (toDate) {
        params.to_date = toDate;
    }

    if (status) {
        params.status = status;
    }

    const response = await apiClient.get(
        "/dashboard/loan-type-distribution",
        {
            params,
        }
    );

    return response.data;
};