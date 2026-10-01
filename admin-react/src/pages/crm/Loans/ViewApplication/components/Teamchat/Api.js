import apiClient from '../../../../../../app/apiClient'


export const getTeamChat = async (applicationId) => {
    try {
        const response = await apiClient.get(
            `/applications/${applicationId}/chat`
        )

        return response.data
    } catch (error) {
        console.error(
            'Failed to load team chat:',
            error
        )

        throw error
    }
}

export const sendTeamChat = async (
    applicationId,
    data
) => {
    try {
        const response = await apiClient.post(
            `/applications/${applicationId}/chat`,
            data
        )

        return response.data
    } catch (error) {
        console.error(
            'Failed to send team chat message:',
            error
        )

        throw error
    }
}
export const deleteTeamChat = async (
    applicationId,
    chatId
) => {
    try {
        const response = await apiClient.delete(
            `/applications/${applicationId}/chat/${chatId}`
        )

        return response.data
    } catch (error) {
        console.error(
            'Failed to delete team chat message:',
            error
        )

        throw error
    }
}