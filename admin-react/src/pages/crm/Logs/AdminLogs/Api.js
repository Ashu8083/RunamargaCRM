// admin-react/src/pages/crm/Logs/AdminLogs/Api.js


import apiClient from "../../../../app/apiClient";

export const getAdminLogs = async ({
    skip = 0,
    limit = 100,
    action = "",
    actionBy = "",
    actionOn = "",
} = {}) => {
    const params = {
        skip: Number(skip),
        limit: Number(limit),
    };

    if (action) {
        params.action = action;
    }

    if (actionBy !== "") {
        params.action_by = Number(actionBy);
    }

    if (actionOn !== "") {
        params.action_on = Number(actionOn);
    }

    const response = await apiClient.get(
        "/admin-logs",
        {
            params,
        }
    );
    console.log(response)
    return response.data;
};

export const getAdminLogById = async (logId) => {
    const response = await apiClient.get(
        `/admin-logs/${Number(logId)}`
    );

    return response.data;
};