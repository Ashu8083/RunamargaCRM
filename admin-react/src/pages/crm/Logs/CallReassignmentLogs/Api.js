// admin-react/src/pages/crm/Logs/CallReassignmentLogs/Api.js

import apiClient from "../../../../app/apiClient";

export const getCallReassignmentAuditLogs = async ({
    skip = 0,
    limit = 100,
    action = "",
    actionBy = "",
    actionOn = "",
    reportTo = "",
    fromAssignedTo = "",
    toAssignedTo = "",
} = {}) => {
    const params = { skip, limit };

    if (action) params.action = action;
    if (actionBy !== "") params.action_by = actionBy;
    if (actionOn !== "") params.action_on = actionOn;
    if (reportTo !== "") params.report_to = reportTo;
    if (fromAssignedTo !== "") {
        params.from_assigned_to = fromAssignedTo;
    }
    if (toAssignedTo !== "") {
        params.to_assigned_to = toAssignedTo;
    }

    const response = await apiClient.get(
        "/call-reassignment-audit-logs",
        { params }
    );

    return response.data;
};