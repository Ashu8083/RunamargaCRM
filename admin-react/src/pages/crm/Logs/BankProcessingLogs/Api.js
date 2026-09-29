// admin-react/src/pages/Logs/BankProcessingLogs/Api.js

import apiClient from "../../../../app/apiClient";


export const getBankProcessingLogs = async ({
    contextId = "",
    search = "",
    loanId = "",
    bpId = "",
    employeeContextId = "",
    event = "",
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
        params.context_id =
            Number(contextId);
    }


    if (search?.trim()) {
        params.search =
            search.trim();
    }


    if (loanId) {
        params.loan_id =
            Number(loanId);
    }


    if (bpId) {
        params.bp_id =
            Number(bpId);
    }


    if (employeeContextId) {
        params.employee_context_id =
            Number(employeeContextId);
    }


    if (event) {
        params.event = event;
    }


    if (fromDate) {
        params.from_date =
            fromDate;
    }


    if (toDate) {
        params.to_date =
            toDate;
    }


    const response =
        await apiClient.get(
            "/bank-processing-logs",
            {
                params,
            }
        );


    return response.data;
};