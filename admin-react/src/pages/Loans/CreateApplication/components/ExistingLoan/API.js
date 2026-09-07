// admin-react/src/pages/Loans/CreateApplication/components/ExistingLoan/API.js

import apiClient from '../../../../../app/apiClient'

// =============================================================
// REQUEST DUPLICATE APPLICATION APPROVAL
// =============================================================

export const submitExistingLoan = async (data) => {

  if (!data) {
    throw new Error(
      'Application data is required.'
    )
  }

  if (!data.loan_application_id) {
    throw new Error(
      'Existing application ID is required.'
    )
  }

  try {

    const response = await apiClient.post(
      '/duplicate-approvals',
      data
    )

    return response.data

  } catch (error) {

    console.error(
      'Duplicate approval request failed:',
      error
    )

    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Unable to request approval.'
    )
  }
}