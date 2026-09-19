// admin-react/src/pages/Applicationfilter/Api.js

import apiClient from '../../app/apiClient'


// =============================================================
// GET APPLICATION FILTER
// =============================================================

export const getApplicationFilter = async (params = {}) => {

    const response = await apiClient.get(
        '/application-filter',
        {
            params,
        }
    )

    return response.data
}