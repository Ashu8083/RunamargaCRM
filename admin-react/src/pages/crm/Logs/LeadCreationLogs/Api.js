// admin-react/src/pages/crm/Logs/LeadCreationLogs/Api.js

import apiClient from "../../../../app/apiClient";

export const getLoanApplicationAuditLogs = async ({
    skip = 0,
    limit = 100,
    action = "",
    actionBy = "",
    actionOn = "",
    reportTo = "",
} = {}) => {
    const params = { skip, limit };

    if (action) params.action = action;
    if (actionBy !== "") params.action_by = actionBy;
    if (actionOn !== "") params.action_on = actionOn;
    if (reportTo !== "") params.report_to = reportTo;

    const response = await apiClient.get(
        "/loan-application-audit-logs",
        { params }
    );

    return response.data;
};