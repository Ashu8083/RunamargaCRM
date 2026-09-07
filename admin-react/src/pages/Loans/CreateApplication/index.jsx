
// admin-react/src/pages/Loans/CreateApplication/index.jsx

import { useState } from 'react'

import ApplicationForm from './components/ApplicationForm'
import ExistingLoan from './components/ExistingLoan'


function CreateApplication() {

  // ===========================================================
  // EXISTING APPLICATION MODAL STATE
  // ===========================================================

  const [
    existingLoan,
    setExistingLoan,
  ] = useState(null)


  // ===========================================================
  // OPEN EXISTING APPLICATION POPUP
  // ===========================================================

  const handleExistingLoan = ({
    existingLoanData,
    originalApplicationData,
  }) => {

    setExistingLoan({
      existingLoanData,
      originalApplicationData,
    })
  }


  // ===========================================================
  // CLOSE EXISTING APPLICATION POPUP
  // ===========================================================

  const handleCancelExistingLoan = () => {

    setExistingLoan(null)
  }


  // ===========================================================
  // REQUEST APPROVAL SUCCESS
  // ===========================================================

  const handleExistingLoanSubmitSuccess = () => {

    setExistingLoan(null)
  }


  // ===========================================================
  // RENDER
  // ===========================================================

  return (

    <div className="relative w-full">

      {/* =====================================================
          CREATE APPLICATION FORM
      ===================================================== */}

      <ApplicationForm
        onExistingLoan={
          handleExistingLoan
        }
      />


      {/* =====================================================
          EXISTING APPLICATION MODAL
      ===================================================== */}

      {existingLoan && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-[1px]
          "
          role="dialog"
          aria-modal="true"
          aria-label="Existing loan application"
        >

          {/* =================================================
              MODAL CONTAINER
          ================================================= */}

          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-5xl
              overflow-y-auto
              rounded-xl
              bg-base-100
              shadow-2xl
            "
          >

            <ExistingLoan

              existingLoanData={
                existingLoan.existingLoanData
              }

              originalApplicationData={
                existingLoan.originalApplicationData
              }

              onCancel={
                handleCancelExistingLoan
              }

              onSubmitSuccess={
                handleExistingLoanSubmitSuccess
              }

            />

          </div>

        </div>

      )}

    </div>
  )
}


export default CreateApplication
