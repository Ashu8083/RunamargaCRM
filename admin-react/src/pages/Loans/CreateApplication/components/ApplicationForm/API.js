import apiClient from '../../../../../app/apiClient'

// =============================================================
// CREATE LOAN APPLICATION
// =============================================================

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
      'Failed to create loan application:',
      error
    )

    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to create loan application.'
    )
  }
}