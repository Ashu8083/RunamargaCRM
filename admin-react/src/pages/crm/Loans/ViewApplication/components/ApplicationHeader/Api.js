// admin-react/src/pages/Loans/ViewApplication/components/ApplicationHeader/Api.js

import apiClient from '../../../../../../app/apiClient'
// header update
export const updateApplicationHeader = async (
    applicationId,
    data
) => {

    const response = await apiClient.patch(
        `/applications/${applicationId}/header`,
        data
    )

    return response.data
}