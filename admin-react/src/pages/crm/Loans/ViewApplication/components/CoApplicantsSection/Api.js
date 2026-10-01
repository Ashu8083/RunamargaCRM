import apiClient from '../../../../../../app/apiClient'

export const addApplicationCoApplicant = async (
    applicationId,
    data
) => {
    const response = await apiClient.post(
        `/applications/${applicationId}/co-applicants`,
        data
    )

    return response.data
}