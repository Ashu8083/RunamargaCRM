// admin-react/src/pages/Loans/ApplicationStatus/API.js

import apiClient from "../../../../app/apiClient";

export const getApplicationStatusApplications = async ({
    contextId,
    fromDate = "",
    toDate = "",
    loanType = "",
    status = "",
    search = "",
    rmId = "",
    agentId = "",
    teamLeadId = "",
    page = 1,
    pageSize = 10,
} = {}) => {
    const params = {
        page: Number(page),
        page_size: Number(pageSize),
    };

    if (contextId) {
        params.context_id = Number(contextId);
    }

    if (fromDate) {
        params.from_date = fromDate;
    }

    if (toDate) {
        params.to_date = toDate;
    }

    if (loanType) {
        params.loan_type_id = Number(loanType);
    }

    if (status) {
        params.status = status;
    }

    if (search?.trim()) {
        params.search = search.trim();
    }

    if (rmId) {
        params.rm_id = Number(rmId);
    }

    if (agentId) {
        params.agent_id = Number(agentId);
    }

    if (teamLeadId) {
        params.team_lead_id = Number(teamLeadId);
    }

    const response = await apiClient.get(
        "/dashboard/application-status/applications",
        {
            params,
        }
    );

    return response.data;
};