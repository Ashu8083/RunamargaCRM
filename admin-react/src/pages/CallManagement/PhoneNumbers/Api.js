import apiClient from '../../../app/apiClient'


// =============================================================
// GET PHONE NUMBERS
// =============================================================

export const getPhoneNumbers = async (
    contextId = null
) => {

    const params = {}

    if (contextId) {
        params.context_id = contextId
    }

    const response = await apiClient.get(
        '/phone-numbers',
        {
            params,
        }
    )

    return response.data
}


// =============================================================
// ADD PHONE NUMBER
// =============================================================

export const createPhoneNumber = async (
    data
) => {

    const response = await apiClient.post(
        '/phone-numbers',
        data
    )

    return response.data
}


// =============================================================
// UPDATE PHONE NUMBER
// =============================================================

export const updatePhoneNumber = async (
    id,
    data
) => {

    const response = await apiClient.put(
        `/phone-numbers/${id}`,
        data
    )

    return response.data
}