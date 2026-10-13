// admin-react/src/pages/crm/Logs/TeamLeadLogs/Api.js

import apiClient from "../../../../app/apiClient";

export const getTeamLeadAuditLogs = async ({
    skip = 0,
    limit = 100,
    action = "",
    actionBy = "",
    actionOn = "",
    reportTo = "",
} = {}) => {
    const params = {
        skip,
        limit,
    };

    if (action) {
        params.action = action;
    }

    if (actionBy !== "") {
        params.action_by = actionBy;
    }

    if (actionOn !== "") {
        params.action_on = actionOn;
    }

    if (reportTo !== "") {
        params.report_to = reportTo;
    }

    const response = await apiClient.get(
        "/team-lead-audit-logs",
        { params }
    );

    return response.data;
};

export const getTeamLeadAuditLogById = async (logId) => {
    const response = await apiClient.get(
        `/team-lead-audit-logs/${logId}`
    );

    return response.data;
};