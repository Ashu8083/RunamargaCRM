// admin-react/src/pages/crm/Logs/DuplicateLeadLogs/Api.js

import apiClient from "../../../../app/apiClient";

/**
 * Fetch duplicate lead approval logs.
 *
 * Supported filters:
 * - status: approved / rejected
 * - duplicate_approval_id: duplicate approval request ID
 * - loan_id: actual loan application ID
 * - skip: pagination offset
 * - limit: number of records to fetch
 */
export const getDuplicateLeadApprovalLogs = async ({
    skip = 0,
    limit = 50,
    status = "",
    duplicateApprovalId = "",
    loanId = "",
} = {}) => {
    const params = {
        skip,
        limit,
    };

    if (status) {
        params.status = status.toLowerCase();
    }

    if (duplicateApprovalId !== "") {
        params.duplicate_approval_id = duplicateApprovalId;
    }

    if (loanId !== "") {
        params.loan_id = loanId;
    }

    const response = await apiClient.get(
        "/duplicate-lead-approval-logs/",
        { params }
    );

    return response.data;
};