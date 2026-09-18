// admin-react/src/pages/Loans/ApplicationStatus/API.js

import apiClient from "../../../app/apiClient";
export const getApplicationStatusApplications = async ({
    contextId,
    fromDate = "",
    toDate = "",
    loanType = "",
    status = "",
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
        params.loan_type_id = loanType;
    }

    if (status) {
        params.status = status;
    }

    const response = await apiClient.get(
        "/dashboard/application-status/applications",
        {
            params,
        }
    );

    return response.data;
};