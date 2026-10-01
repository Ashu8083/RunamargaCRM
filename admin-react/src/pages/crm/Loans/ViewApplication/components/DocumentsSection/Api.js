import apiClient from '../../../../../../app/apiClient'

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
export const deleteApplicationDocument = async (
    applicationId,
    documentId
) => {
    const response = await apiClient.delete(
        `/applications/${applicationId}/documents/${documentId}`
    )

    return response.data
}