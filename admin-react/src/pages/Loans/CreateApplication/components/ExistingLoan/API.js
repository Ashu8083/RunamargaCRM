// admin-react/src/pages/Loans/CreateApplication/components/ExistingLoan/API.js

// =============================================================
// EXISTING LOAN — FINAL SUBMISSION API
// =============================================================
//
// This API is called ONLY after the initial application API
// detects that the customer already has an existing loan.
//
// IMPORTANT:
// The API receives the ORIGINAL APPLICATION FORM DATA.
//
// Example payload:
//
// {
//   rm_id,
//   state_id,
//   city_id,
//   loan_type_id,
//   name,
//   phone,
//   loan_amount,
//   credit_score,
//   reference_name,
//   loan_purpose,
//   remarks,
//   gender
// }
//
// Replace the mock implementation below with the actual
// backend API call once the endpoint is available.
// =============================================================

export const submitExistingLoan = (data) => {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      try {

        // -------------------------------------------------------
        // BASIC VALIDATION
        // -------------------------------------------------------

        if (!data) {

          throw new Error(
            'Application data is required.'
          )

        }

        if (!data.name) {

          throw new Error(
            'Applicant name is required.'
          )

        }

        if (!data.phone) {

          throw new Error(
            'Applicant phone number is required.'
          )

        }

        if (!data.loan_type_id) {

          throw new Error(
            'Loan type is required.'
          )

        }

        if (!data.loan_amount) {

          throw new Error(
            'Loan amount is required.'
          )

        }

        // -------------------------------------------------------
        // FINAL EXISTING LOAN SUBMISSION
        // -------------------------------------------------------
        //
        // In the real application, replace this section with
        // your backend request.
        //
        // Example:
        //
        // const response = await axios.post(
        //   '/api/loans/existing/submit',
        //   data
        // )
        //
        // return response.data
        //
        // -------------------------------------------------------

        const response = {

          success: true,

          message:
            'Existing loan application submitted successfully.',

          data: {

            application_id:
              `LA-${Date.now()}`,

            status:
              'IN_PROCESS',

            submitted_at:
              new Date().toISOString(),

            ...data,

          },

        }

        resolve(response)

      } catch (error) {

        reject(error)

      }

    }, 1200)

  })

}