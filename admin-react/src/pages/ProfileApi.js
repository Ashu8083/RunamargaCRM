import apiClient from '../app/apiClient'


// =============================================================
// GET MY PROFILE
// =============================================================

export const getMyProfile = async () => {

    const response = await apiClient.get(
        '/profile/employee_profile'
    )

    return response.data
}