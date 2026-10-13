// admin-react/src/pages/crm/Logs/LoanAssignmentLogs/Api.js


import apiClient from "../../../../app/apiClient";

export const getLoanAssignments = async (contextId = null) => {
    const params = {};

    if (contextId) {
        params.context_id = contextId;
    }

    const response = await apiClient.get("/loans-assignment", {
        params,
    });

    return response.data;
};