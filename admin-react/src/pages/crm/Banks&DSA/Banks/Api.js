import apiClient from '../../../../app/apiClient'


// =============================================================
// GET / SEARCH BANKS
// =============================================================

export const getBanks = async (filters = {}) => {

    const params = {}
    if (filters.name) {
        params.name = filters.name
    }
    if (
        filters.is_active !== undefined &&
        filters.is_active !== null &&
        filters.is_active !== ''
    ) {
        params.is_active = filters.is_active
    }
    const response = await apiClient.get(
        '/admin/banks/',
        {
            params,
        }
    )
    return response.data
}


// =============================================================
// CREATE BANK
// =============================================================

export const createBank = async (bankData) => {
    const response = await apiClient.post(
        '/admin/banks/',
        {
            name: bankData.name,
            is_active: bankData.is_active,
        }
    )
    return response.data
}


// =============================================================
// UPDATE BANK
// =============================================================

export const updateBank = async (bankData) => {
    const response = await apiClient.put(
        '/admin/banks/',
        {
            id: bankData.id,
            name: bankData.name,
            is_active: bankData.is_active,
        }
    )
    return response.data
}

// =============================================================
// DELETE BANK
// =============================================================
export const deleteBank = async (bankId) => {
    const response = await apiClient.delete(
        `/admin/banks/${bankId}`
    )
    return response.data
}