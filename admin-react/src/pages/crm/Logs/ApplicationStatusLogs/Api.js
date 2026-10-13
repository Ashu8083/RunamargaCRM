// admin-react/src/pages/crm/Logs/ApplicationStatusLogs/Api.js

import apiClient from "../../../../app/apiClient";

export const getApplicationStatusAuditLogs = async ({
    skip = 0,
    limit = 100,
    action = "",
    actionBy = "",
    actionOn = "",
    reportTo = "",
    fromStatus = "",
    toStatus = "",
} = {}) => {
    const params = { skip, limit };

    if (action) params.action = action;
    if (actionBy !== "") params.action_by = actionBy;
    if (actionOn !== "") params.action_on = actionOn;
    if (reportTo !== "") params.report_to = reportTo;
    if (fromStatus) params.from_status = fromStatus;
    if (toStatus) params.to_status = toStatus;

    const response = await apiClient.get(
        "/loan-application-status-audit-logs",
        { params }
    );

    return response.data;
};