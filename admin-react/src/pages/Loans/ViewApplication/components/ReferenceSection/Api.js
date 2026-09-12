// admin-react/src/pages/Loans/ViewApplication/components/ReferenceSection/Api.js


import apiClient from '../../../../../app/apiClient'

export const addApplicationReference = async (
    applicationId,
    data
) => {
    const response = await apiClient.post(
        `/applications/${applicationId}/references`,
        data
    )

    return response.data
}