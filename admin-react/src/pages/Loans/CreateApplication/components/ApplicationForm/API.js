import apiClient from '../../../../../app/apiClient'


// =============================================================
// GET APPLICATION FILTERS
// =============================================================

export const getApplicationFilters = async (
    contextId = null
) => {

    try {

        const response =
            await apiClient.get(
                '/common/application-filters',
                {
                    params: {
                        context_id: contextId,
                    },
                }
            )

        return response.data

    } catch (error) {

        console.error(
            'Failed to fetch application filters:',
            error
        )

        const detail =
            error.response?.data?.detail

        throw new Error(
            Array.isArray(detail)
                ? detail
                    .map(
                        (item) =>
                            item?.msg ||
                            'Validation error'
                    )
                    .join(', ')
                : detail ||
                  error.response?.data?.message ||
                  'Failed to load application filters.'
        )
    }
}

export const createLoanApplication = async (data) => {
  if (!data) {
    throw new Error('Application data is required.')
  }

  try {
    const response = await apiClient.post(
      '/applications/create',
      data
    )

    return response.data
  } catch (error) {
    console.error(
      'CREATE APPLICATION ERROR RESPONSE:',
      error.response?.data
    )

    const detail = error.response?.data?.detail

    let message = error.response?.data?.message

    if (Array.isArray(detail)) {
      message = detail
        .map((item) => item?.msg || 'Validation error')
        .join(', ')
    } else if (typeof detail === 'string') {
      message = detail
    }

    throw new Error(
      message ||
      'Failed to create loan application.'
    )
  }
}