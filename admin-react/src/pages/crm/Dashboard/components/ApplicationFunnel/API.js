// admin-react/src/pages/Dashboard/components/ApplicationFunnel/API.js

import apiClient from "../../../../../app/apiClient";

export const getApplicationFunnelData = async ({
    contextId,
    fromDate = "",
    toDate = "",
    loanType = "",
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

    if (loanType) {
        params.loan_type = loanType;
    }

    const response = await apiClient.get(
        "/dashboard/application-funnel",
        {
            params,
        }
    );

    return response.data;
};