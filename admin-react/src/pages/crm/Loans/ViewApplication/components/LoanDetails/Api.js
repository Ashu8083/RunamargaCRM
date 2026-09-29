// admin-react/src/pages/Loans/ViewApplication/components/LoanDetails/Api.js


import apiClient from '../../../../../../app/apiClient'


export const updateApplicationLoanDetails = async (
    applicationId,
    data
) => {

    const response = await apiClient.patch(
        `/applications/${applicationId}/loan-details`,
        data
    )

    return response.data
}