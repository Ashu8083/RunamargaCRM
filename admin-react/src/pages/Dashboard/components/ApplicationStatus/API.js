// admin-react/src/pages/Dashboard/components/ApplicationStatus/API.js
import apiClient from "../../../../app/apiClient";


export const getApplicationStatusData = async ({
    fromDate = "",
    toDate = "",
    loanType = "",
} = {}) => {
    const params = {};

    if (fromDate) {
        params.from_date = fromDate;
    }

    if (toDate) {
        params.to_date = toDate;
    }

    if (loanType) {
        params.loan_type_id = loanType;
    }

    const response = await apiClient.get(
        "/dashboard/application-status",
        {
            params,
        }
    );

    return response.data;
};