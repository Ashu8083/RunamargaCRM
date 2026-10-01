// admin-react/src/pages/crm/Logs/LoanTypeChangeLogs/Api.js


import apiClient from "../../../../app/apiClient";

export const getLoanTypeChangeLogs = async ({
    contextId,
    search = "",
    changedById = "",
    reportsToId = "",
    fromLoanType = "",
    toLoanType = "",
    fromDate = "",
    toDate = "",
    page = 1,
    pageSize = 10,
} = {}) => {
    const params = {
        page: Number(page),
        limit: Number(pageSize),
    };

    if (contextId) {
        params.context_id = Number(contextId);
    }

    if (search?.trim()) {
        params.search = search.trim();
    }

    if (changedById) {
        params.changed_by_id = Number(changedById);
    }

    if (reportsToId) {
        params.reports_to_id = Number(reportsToId);
    }

    if (fromLoanType) {
        params.from_loan_type_id = Number(fromLoanType);
    }

    if (toLoanType) {
        params.to_loan_type_id = Number(toLoanType);
    }

    if (fromDate) {
        params.from_date = fromDate;
    }

    if (toDate) {
        params.to_date = toDate;
    }

    const response = await apiClient.get(
        "/loan-type-change-logs",
        {
            params,
        }
    );

    return response.data;
};