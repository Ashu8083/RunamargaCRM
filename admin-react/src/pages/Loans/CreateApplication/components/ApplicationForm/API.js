// admin-react/src/pages/Loans/CreateApplication/components/ApplicationForm/API.js


// =============================================================
// CREATE LOAN APPLICATION
// =============================================================
//
// API used when the user initially submits the application form.
//
// Possible backend responses:
//
// 1. New application
//    {
//      success: true,
//      existing_loan: false,
//      data: {...}
//    }
//
// 2. Existing loan found
//    {
//      success: true,
//      existing_loan: true,
//      data: {
//        ...existing application details
//      }
//    }
//
// The ApplicationForm will pass the complete original form
// payload. If an existing loan is found, the response is passed
// to CreateApplication/index.jsx, which will open ExistingLoan.
// =============================================================

export const createLoanApplication = (data) => {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            try {

                // -------------------------------------------------
                // Basic validation
                // -------------------------------------------------

                if (!data) {

                    throw new Error(
                        'Application data is required.'
                    )

                }


                // -------------------------------------------------
                // Existing Loan Check
                // -------------------------------------------------
                //
                // Replace this mock condition with the actual
                // backend response.
                //
                // Example real backend response:
                //
                // {
                //     success: true,
                //     existing_loan: true,
                //     data: {...}
                // }
                //
                // For now, keep this false so normal application
                // creation continues to work.
                //
                // You can temporarily change this to true while
                // testing the ExistingLoan component.
                // -------------------------------------------------

                const existingLoan = false


                // -------------------------------------------------
                // Existing Loan Response
                // -------------------------------------------------

                if (existingLoan) {

                    const response = {

                        success: true,

                        existing_loan: true,

                        message:
                            'An existing loan application was found.',

                        data: {

                            application_id:
                                `APP-${Date.now()}`,

                            applicant_name:
                                data.name,

                            phone:
                                data.phone,

                            loan_type:
                                data.loan_type_id,

                            loan_amount:
                                data.loan_amount,

                            credit_score:
                                data.credit_score,

                            rm_name:
                                'Rajesh Kumar',

                            agent_name:
                                'Manoj Kumar',

                            applied_by:
                                'Rajesh Kumar',

                            applied_at:
                                new Date().toISOString(),

                            status:
                                'IN_PROCESS',

                        },

                    }


                    resolve(response)

                    return

                }


                // -------------------------------------------------
                // New Application Response
                // -------------------------------------------------

                const response = {

                    success: true,

                    existing_loan: false,

                    message:
                        'Loan application created successfully.',

                    data: {

                        id:
                            `LA-${Date.now()}`,

                        ...data,

                        created_at:
                            new Date().toISOString(),

                    },

                }


                resolve(response)

            } catch (error) {

                reject(error)

            }

        }, 1200)

    })

}