// admin-react/src/pages/crm/Logs/LoanShuffleLogs/Api.js

import apiClient from "../../../../app/apiClient";

export const getLoanShuffleLogs = async ({
    contextId,
    search = "",
    shuffledById = "",
    fromAgentId = "",
    toAgentId = "",
    fromRmId = "",
    toRmId = "",
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

    if (shuffledById) {
        params.shuffled_by_context_id = Number(shuffledById);
    }

    if (fromAgentId) {
        params.from_agent_context_id = Number(fromAgentId);
    }

    if (toAgentId) {
        params.to_agent_context_id = Number(toAgentId);
    }

    if (fromRmId) {
        params.from_rm_context_id = Number(fromRmId);
    }

    if (toRmId) {
        params.to_rm_context_id = Number(toRmId);
    }

    if (fromDate) {
        params.from_date = fromDate;
    }

    if (toDate) {
        params.to_date = toDate;
    }

    const response = await apiClient.get(
        "/loan-shuffle-logs",
        {
            params,
        }
    );

    return response.data;
};