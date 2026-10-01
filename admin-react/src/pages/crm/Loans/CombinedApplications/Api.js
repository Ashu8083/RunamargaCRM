// admin-react/src/pages/Loans/Api.js

import apiClient from '../../../../app/apiClient'


// =============================================================
// GET APPLICATIONS
// =============================================================

export const getApplications = async (
    contextId,
    page = 1,
    pageSize = 10,
    noChatForDays = null,
    search = '',
    loanTypeId = '',
    rmId = '',
    teamLeadId = '',
    agentId = '',
    status = '',
) => {
    const response = await apiClient.get("/applications", {
        params: {
            context_id: contextId,
            page,
            page_size: pageSize,

            ...(noChatForDays !== null && {
                no_chat_for_days: noChatForDays,
            }),

            ...(search.trim() && {
                search: search.trim(),
            }),

            ...(loanTypeId && {
                loan_type_id: loanTypeId,
            }),

            ...(rmId && {
                rm_id: rmId,
            }),

            ...(teamLeadId && {
                team_lead_id: teamLeadId,
            }),

            ...(agentId && {
                agent_id: agentId,
            }),

            ...(status && {
                status,
            }),
        },
    });

    return response.data;
};
// =============================================================
// GET SINGLE APPLICATION
// =============================================================

export const viewApplication = async (
    applicationId
) => {

    const response = await apiClient.get(
        `/applications/${applicationId}`
    )

    return response.data
}


// =============================================================
// UPDATE LOAN TYPE
// =============================================================

export const updateApplicationLoanType = async (
    applicationId,
    loanTypeId
) => {

    const response = await apiClient.patch(
        `/applications/${applicationId}/loan-type`,
        {
            loan_type_id: loanTypeId,
        }
    )

    return response.data
}
// =============================================================
// UPDATE APPLICATION STATUS
// =============================================================

export const updateApplicationStatus = async (
    applicationId,
    status,
    rejectedRemarks = null,
    revertRejectionDate = null
) => {

    const response = await apiClient.patch(
        `/applications/${applicationId}/status`,
        {
            status,
            rejected_remarks: rejectedRemarks,
            revert_rejection_date: revertRejectionDate,
        }
    )

    return response.data
}
