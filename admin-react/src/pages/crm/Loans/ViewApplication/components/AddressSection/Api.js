// admin-react/src/pages/Loans/ViewApplication/components/AddressSection/Api.js

import apiClient from '../../../../../../app/apiClient'

export const addApplicationAddress = async (
    applicationId,
    data
) => {
    const response = await apiClient.post(
        `/applications/${applicationId}/addresses`,
        data
    )

    return response.data
}