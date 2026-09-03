// admin-react/src/pages/Loans/CreateApplication/index.jsx

import { useState } from 'react'

import ApplicationForm from './components/ApplicationForm'
import ExistingLoan from './components/ExistingLoan'

// =============================================================
// CREATE APPLICATION
// =============================================================
//
// Flow:
//
// ApplicationForm
//      ↓
// createLoanApplication()
//      ↓
// existing_loan === true
//      ↓
// ExistingLoan
//      ├── Cancel
//      │     ↓
//      │   Back to fresh ApplicationForm
//      │
//      └── Submit Application
//            ↓
//        submitExistingLoan()
//            ↓
//        Final submission
//
// =============================================================

function CreateApplication() {

  // ===========================================================
  // EXISTING LOAN STATE
  // ===========================================================

  const [
    existingLoanState,
    setExistingLoanState,
  ] = useState(null)

  // ===========================================================
  // FINAL SUBMISSION SUCCESS
  // ===========================================================

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('')

  // ===========================================================
  // EXISTING LOAN DETECTED
  // ===========================================================
  //
  // ApplicationForm sends both:
  //
  // 1. existingLoanData
  // 2. originalApplicationData
  //
  // ===========================================================

  const handleExistingLoan = ({
    existingLoanData,
    originalApplicationData,
  }) => {

    setSuccessMessage('')

    setExistingLoanState({

      existingLoanData,

      originalApplicationData,

    })

  }

  // ===========================================================
  // CANCEL EXISTING LOAN
  // ===========================================================
  //
  // No API call.
  //
  // Removing ExistingLoan from the DOM causes ApplicationForm
  // to mount again with its INITIAL_FORM values.
  //
  // ===========================================================

  const handleCancelExistingLoan = () => {

    setExistingLoanState(null)

  }

  // ===========================================================
  // FINAL EXISTING LOAN SUBMISSION SUCCESS
  // ===========================================================

  const handleExistingLoanSubmitSuccess = (
    response
  ) => {

    setExistingLoanState(null)

    setSuccessMessage(
      response?.message ||
      'Existing loan application submitted successfully.'
    )

  }

  // ===========================================================
  // RENDER
  // ===========================================================

  return (

    <div
      className="
        w-full
        min-w-0
      "
    >

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {successMessage && (

        <div
          className="
            mx-3
            mb-3
            flex
            items-start
            gap-3
            rounded-lg
            border
            border-[#8BCF00]/30
            bg-[#8BCF00]/10
            px-4
            py-3
            text-[#5E8F00]
            sm:mx-5
            lg:mx-6
          "
        >

          <div
            className="
              mt-0.5
              h-2
              w-2
              shrink-0
              rounded-full
              bg-[#8BCF00]
            "
          />

          <p
            className="
              text-sm
              font-medium
            "
          >
            {successMessage}
          </p>

          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="
              ml-auto
              shrink-0
              text-xs
              font-medium
              text-[#5E8F00]
              opacity-70
              hover:opacity-100
            "
          >
            Dismiss
          </button>

        </div>

      )}

      {/* =====================================================
          APPLICATION FLOW
      ===================================================== */}

      {existingLoanState ? (

        <ExistingLoan

          existingLoanData={
            existingLoanState.existingLoanData
          }

          originalApplicationData={
            existingLoanState.originalApplicationData
          }

          onCancel={
            handleCancelExistingLoan
          }

          onSubmitSuccess={
            handleExistingLoanSubmitSuccess
          }

        />

      ) : (

        <ApplicationForm
          onExistingLoan={
            handleExistingLoan
          }
        />

      )}

    </div>

  )
}

export default CreateApplication