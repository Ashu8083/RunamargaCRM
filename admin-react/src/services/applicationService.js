// src/services/applicationService.js

import apiClient from '../app/apiClient'


// =============================================================
// GET APPLICATIONS
// =============================================================

export const getApplications = async (contextId) => {

    const response = await apiClient.get(
        '/applications',
        {
            params: {
                context_id: contextId,
            },
        }
    )

    return response.data
}


// =============================================================
// GET SINGLE APPLICATION
// =============================================================

export const getApplication = async (
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