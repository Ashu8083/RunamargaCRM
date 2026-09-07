// admin-react/src/pages/Loans/CreateApplication/components/ApplicationForm/API.js

import { API_BASE_URL } from '../../../../../config/url'

// =============================================================
// CREATE LOAN APPLICATION
// =============================================================
//
// This API receives the complete application payload.
//
// Common fields:
//   rm_id
//   state_id
//   city_id
//   loan_type_id
//   name
//   phone
//   loan_amount
//   credit_score
//   reference_name
//   loan_purpose
//   remarks
//   gender
//
// Dynamic loan-type fields are also accepted.
// Example:
//   business_name
//
// Future loan-type-specific fields do NOT need any changes here.
// They are forwarded as part of the payload received from
// ApplicationForm/index.jsx.
// =============================================================

export const createLoanApplication = async (data) => {
  if (!data) {
    throw new Error('Application data is required.')
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/loan-applications`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    let responseData = null

    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }

    if (!response.ok) {
      throw new Error(
        responseData?.detail ||
          responseData?.message ||
          `Failed to create loan application (${response.status})`
      )
    }

    return responseData
  } catch (error) {
    console.error(
      'Failed to create loan application:',
      error
    )

    throw error
  }
}