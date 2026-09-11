import apiClient from '../../../../../app/apiClient'

export const uploadApplicationDocument = async (
    applicationId,
    formData
) => {
    const response = await apiClient.post(
        `/applications/${applicationId}/documents`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return response.data
}