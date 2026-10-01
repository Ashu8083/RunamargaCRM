import apiClient from '../../../../../../app/apiClient'

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