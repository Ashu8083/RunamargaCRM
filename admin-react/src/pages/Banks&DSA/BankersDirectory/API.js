// admin-react/src/pages/Banks&DSA/BankersDirectory/BankersDirectoryApi.js

import apiClient from '../../../app/apiClient'


// =============================================================
// GET BANKER DIRECTORY BY ID
// =============================================================

export const getBankerDirectory = async (
    bankerDirectoryId
) => {

    const response = await apiClient.get(
        `/banker-directory/${bankerDirectoryId}`
    )

    return response.data
}


// =============================================================
// CREATE BANKER DIRECTORY
// =============================================================

export const createBankerDirectory = async (
    bankerDirectoryData
) => {

    const response = await apiClient.post(
        '/banker-directory/create',
        bankerDirectoryData
    )

    return response.data
}


// =============================================================
// UPDATE BANKER DIRECTORY
// =============================================================

export const updateBankerDirectory = async (
    bankerDirectoryId,
    bankerDirectoryData
) => {

    const response = await apiClient.put(
        `/banker-directory/${bankerDirectoryId}`,
        bankerDirectoryData
    )

    return response.data
}


// =============================================================
// DELETE BANKER DIRECTORY
// =============================================================

export const deleteBankerDirectory = async (
    bankerDirectoryId
) => {

    const response = await apiClient.delete(
        `/banker-directory/${bankerDirectoryId}`
    )

    return response.data
}


// =============================================================
// SEARCH / FILTER BANKER DIRECTORY
// =============================================================
export const searchBankerDirectory = async (
    filterData = {}
) => {
    const response = await apiClient.post(

        '/banker-directory/search',
        {
            search:
                filterData.search?.trim() || null,
            state_id:
                filterData.state_id || null,
            city_id:
                filterData.city_id || null,
            bank_id:
                filterData.bank_id || null,
            loan_type_id:
                filterData.loan_type_id || null,
            page:
                filterData.page || 1,
            limit:
                filterData.limit || 15,
        }
    )
    return response.data
}