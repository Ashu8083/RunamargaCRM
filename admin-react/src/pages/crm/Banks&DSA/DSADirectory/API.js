// admin-react/src/pages/Banks&DSA/DSADirectory/API.js

import apiClient from '../../../../app/apiClient'

// =============================================================
// GET / SEARCH DSA DIRECTORY LIST
// =============================================================

export const getDSADirectoryList = async (filters = {}) => {
    const params = {}
    if (filters.search) params.search = filters.search.trim()
    if (filters.status) params.status = filters.status === 'active' ? '1' : filters.status === 'inactive' ? '0' : filters.status
    if (filters.is_default !== undefined && filters.is_default !== null && filters.is_default !== '') {
        params.is_default = filters.is_default === 'default' ? true : filters.is_default === 'non-default' ? false : Boolean(filters.is_default)
    }
    if (filters.bank_id) params.bank_id = filters.bank_id
    if (filters.loan_type_id) params.loan_type_id = filters.loan_type_id
    if (filters.page) params.page = filters.page || 1
    if (filters.limit) params.limit = filters.limit || 20

    const response = await apiClient.get('/dsa/dsa-list', { params })
    return response.data
}

// =============================================================
// CREATE DSA
// =============================================================

export const createDSA = async (dsaData) => {
    const response = await apiClient.post('/dsa/create-dsa', dsaData)
    return response.data
}

// =============================================================
// UPDATE DSA
// =============================================================

export const updateDSA = async (dsaId, dsaData) => {
    const response = await apiClient.put(`/dsa/${dsaId}`, dsaData)
    return response.data
}

// =============================================================
// DELETE DSA
// =============================================================

export const deleteDSA = async (dsaId) => {
    const response = await apiClient.delete(`/dsa/${dsaId}`)
    return response.data
}
