// admin-react/src/pages/Loans/CreateApplication/components/ExistingLoan/index.jsx

import { useState } from 'react'

import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon'
import CurrencyRupeeIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon'
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon'

import { submitExistingLoan } from './API'

// =============================================================
// HELPERS
// =============================================================

const getValue = (...values) => {

  for (const value of values) {

    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      return value
    }

  }

  return '—'
}

// =============================================================
// DATE FORMATTER
// =============================================================

const formatDateTime = (value) => {

  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// =============================================================
// CURRENCY FORMATTER
// =============================================================

const formatCurrency = (value) => {

  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return '—'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return value
  }

  return `₹${number.toLocaleString('en-IN')}`
}

// =============================================================
// STATUS CONFIG
// =============================================================

const getStatusConfig = (status) => {

  const normalizedStatus =
    String(status || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')

  switch (normalizedStatus) {

    case 'IN_PROCESS':
    case 'INPROCESS':
      return {
        label: 'In Process',
        className:
          'border-blue-200 bg-blue-50 text-blue-700',
      }

    case 'LOGIN':
      return {
        label: 'Login',
        className:
          'border-violet-200 bg-violet-50 text-violet-700',
      }

    case 'SANCTIONED':
      return {
        label: 'Sanctioned',
        className:
          'border-amber-200 bg-amber-50 text-amber-700',
      }

    case 'DISBURSED':
      return {
        label: 'Disbursed',
        className:
          'border-emerald-200 bg-emerald-50 text-emerald-700',
      }

    case 'REJECTED':
      return {
        label: 'Rejected',
        className:
          'border-red-200 bg-red-50 text-red-700',
      }

    default:
      return {
        label:
          status
            ? String(status)
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )
            : '—',
        className:
          'border-base-300 bg-base-200 text-base-content/70',
      }

  }
}

// =============================================================
// DETAIL ITEM
// =============================================================

const DetailItem = ({
  label,
  value,
}) => (

  <div
    className="
      min-w-0
      rounded-lg
      border
      border-base-300
      bg-base-50/40
      px-3
      py-2.5
    "
  >

    <p
      className="
        mb-1
        text-[10px]
        font-medium
        uppercase
        tracking-wide
        text-base-content/45
      "
    >
      {label}
    </p>

    <p
      className="
        truncate
        text-sm
        font-medium
        text-base-content
      "
      title={String(value)}
    >
      {value}
    </p>

  </div>

)

// =============================================================
// SECTION HEADER
// =============================================================

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => (

  <div
    className="
      mb-4
      flex
      items-start
      gap-3
      border-b
      border-base-300
      pb-3
    "
  >

    <div
      className="
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-lg
        bg-[#8BCF00]/10
        text-[#6FA800]
      "
    >

      <Icon
        className="
          h-4
          w-4
        "
      />

    </div>

    <div className="min-w-0">

      <h2
        className="
          text-sm
          font-semibold
          text-base-content
        "
      >
        {title}
      </h2>

      {description && (

        <p
          className="
            mt-0.5
            text-[11px]
            text-base-content/50
          "
        >
          {description}
        </p>

      )}

    </div>

  </div>

)

// =============================================================
// COMPONENT
// =============================================================

function ExistingLoan({
  existingLoanData,
  originalApplicationData,
  onCancel,
  onSubmitSuccess,
}) {

  const [submitting, setSubmitting] = useState(false)

  const [notification, setNotification] = useState(null)

  // ===========================================================
  // DATA
  // ===========================================================

  const applicationId = getValue(
    existingLoanData?.application_id,
    existingLoanData?.applicationId,
    existingLoanData?.id
  )

  const applicantName = getValue(
    existingLoanData?.applicant_name,
    existingLoanData?.applicantName,
    existingLoanData?.name,
    originalApplicationData?.name
  )

  const phone = getValue(
    existingLoanData?.phone,
    existingLoanData?.phone_number,
    existingLoanData?.phoneNumber,
    originalApplicationData?.phone
  )

  const loanType = getValue(
    existingLoanData?.loan_type,
    existingLoanData?.loanType,
    existingLoanData?.loan_type_name,
    existingLoanData?.loanTypeName,
    originalApplicationData?.loan_type_id
  )

  const loanAmount = getValue(
    existingLoanData?.loan_amount,
    existingLoanData?.loanAmount,
    originalApplicationData?.loan_amount
  )

  const creditScore = getValue(
    existingLoanData?.credit_score,
    existingLoanData?.creditScore,
    originalApplicationData?.credit_score
  )

  const appliedBy = getValue(
    existingLoanData?.applied_by_name ||
    existingLoanData?.applied_by ||
    '—'
  )

  const rmName = getValue(
    existingLoanData?.rm_name,
    existingLoanData?.rmName,
    existingLoanData?.relationship_manager,
    existingLoanData?.relationshipManager
  )

  const agentName = getValue(
    existingLoanData?.agent_name,
    existingLoanData?.agentName,
    existingLoanData?.agent
  )

  const appliedAt = getValue(
    existingLoanData?.applied_at,
    existingLoanData?.appliedAt,
    existingLoanData?.created_at,
    existingLoanData?.createdAt
  )

  const status = getStatusConfig(
    getValue(
      existingLoanData?.status,
      existingLoanData?.application_status,
      existingLoanData?.applicationStatus
    )
  )

  // ===========================================================
  // HANDLE CANCEL
  // ===========================================================
  //
  // No API call is made.
  //
  // Parent will remove ExistingLoan and mount
  // ApplicationForm again, which gives a fresh form.
  //
  // ===========================================================

  const handleCancel = () => {

    if (submitting) {
      return
    }

    if (typeof onCancel === 'function') {
      onCancel()
    }

  }

  // ===========================================================
  // HANDLE FINAL SUBMIT
  // ===========================================================

  const handleSubmit = async () => {

    if (submitting) {
      return
    }

    setNotification(null)
    setSubmitting(true)

    try {

      const existingApplicationId =
        existingLoanData?.application_id ||
        existingLoanData?.applicationId ||
        existingLoanData?.id

      if (!existingApplicationId) {
        throw new Error(
          'Existing application ID is missing.'
        )
      }

      const response =
        await submitExistingLoan({

          loan_application_id:
            Number(existingApplicationId),

          name:
            originalApplicationData?.name,

          phone:
            originalApplicationData?.phone,

          loan_type_id:
            originalApplicationData?.loan_type_id
              ? Number(
                originalApplicationData.loan_type_id
              )
              : null,

          loan_amount:
            originalApplicationData?.loan_amount
              ? Number(
                originalApplicationData.loan_amount
              )
              : null,

          loan_purpose:
            originalApplicationData?.loan_purpose,

          reference_name:
            originalApplicationData?.reference_name,
        })

      if (response?.success === false) {
        throw new Error(
          response?.message ||
          'Unable to submit approval request.'
        )
      }

      setNotification({
        type: 'success',
        message:
          response?.message ||
          'Approval request submitted successfully.',
      })

      if (
        typeof onSubmitSuccess === 'function'
      ) {
        onSubmitSuccess(response)
      }

    } catch (error) {

      console.error(
        'Duplicate approval request failed:',
        error
      )

      setNotification({
        type: 'error',
        message:
          error?.message ||
          'Unable to request approval. Please try again.',
      })

    } finally {

      setSubmitting(false)

    }
  }
  // ===========================================================
  // RENDER
  // ===========================================================

  return (

    <div
      className="
        w-full
        min-w-0
        px-3
        py-4
        sm:px-5
        sm:py-5
        lg:px-6
      "
    >

      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      {notification && (

        <div
          role="alert"
          className={`
            mb-4
            flex
            items-start
            gap-3
            rounded-lg
            border
            px-4
            py-3
            ${notification.type === 'success'
              ? `
                  border-[#8BCF00]/30
                  bg-[#8BCF00]/10
                  text-[#5E8F00]
                `
              : `
                  border-error/20
                  bg-error/5
                  text-error
                `
            }
          `}
        >

          {notification.type === 'success' ? (

            <CheckCircleIcon
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

          ) : (

            <ExclamationCircleIcon
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

          )}

          <p
            className="
              text-sm
              font-medium
            "
          >
            {notification.message}
          </p>

        </div>

      )}

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-xl
          border
          border-base-300
          bg-base-100
          shadow-sm
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            border-b
            border-base-300
            px-4
            py-4
            sm:px-5
            lg:px-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#8BCF00]/10
                  text-[#6FA800]
                "
              >

                <ExclamationCircleIcon
                  className="
                    h-5
                    w-5
                  "
                />

              </div>

              <div className="min-w-0">

                <h1
                  className="
                    text-base
                    font-semibold
                    text-base-content
                    sm:text-lg
                  "
                >
                  Existing Loan Application
                </h1>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-base-content/50
                  "
                >
                  An existing application was found for this customer.
                  Review the details before continuing.
                </p>

              </div>

            </div>

            {/* Status */}

            <div
              className={`
                inline-flex
                w-fit
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-semibold
                ${status.className}
              `}
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-current
                "
              />

              {status.label}

            </div>

          </div>

        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className="
            space-y-6
            p-4
            sm:p-5
            lg:p-6
          "
        >

          {/* =================================================
              APPLICATION SUMMARY
          ================================================= */}

          <section>

            <SectionHeader
              icon={CreditCardIcon}
              title="Application Summary"
              description="Existing application reference and current status."
            />

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-3
              "
            >

              <DetailItem
                label="Application ID"
                value={applicationId}
              />

              <DetailItem
                label="Applied On"
                value={formatDateTime(appliedAt)}
              />

              <DetailItem
                label="Current Status"
                value={status.label}
              />

            </div>

          </section>

          {/* =================================================
              CUSTOMER DETAILS
          ================================================= */}

          <section>

            <SectionHeader
              icon={UserIcon}
              title="Customer Details"
              description="Information associated with the existing application."
            />

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              <DetailItem
                label="Applicant Name"
                value={applicantName}
              />

              <DetailItem
                label="Phone Number"
                value={phone}
              />

              <DetailItem
                label="Credit Score"
                value={creditScore}
              />

            </div>

          </section>

          {/* =================================================
              LOAN DETAILS
          ================================================= */}

          <section>

            <SectionHeader
              icon={CurrencyRupeeIcon}
              title="Loan Details"
              description="Loan information from the existing application."
            />

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              <DetailItem
                label="Loan Type"
                value={loanType}
              />

              <DetailItem
                label="Loan Amount"
                value={formatCurrency(loanAmount)}
              />

              <DetailItem
                label="Applied Date"
                value={formatDateTime(appliedAt)}
              />

            </div>

          </section>

          {/* =================================================
              ASSIGNMENT DETAILS
          ================================================= */}

          <section>

            <SectionHeader
              icon={UserIcon}
              title="Assignment Details"
              description="Users associated with the existing application."
            />

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              <DetailItem
                label="Applied By"
                value={appliedBy}
              />

              <DetailItem
                label="Relationship Manager"
                value={rmName}
              />

              <DetailItem
                label="Agent"
                value={agentName}
              />

            </div>

          </section>

          {/* =================================================
              INFORMATION MESSAGE
          ================================================= */}

          <div
            className="
              flex
              items-start
              gap-3
              rounded-lg
              border
              border-amber-200
              bg-amber-50
              px-4
              py-3
              text-amber-800
            "
          >

            <ExclamationCircleIcon
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                "
              >
                Existing application detected
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  leading-5
                  text-amber-700
                "
              >
                Please verify the application details before
                submitting this application for further processing.
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-2
            border-t
            border-base-300
            bg-base-50/50
            px-4
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-end
            sm:px-5
            lg:px-6
          "
        >

          {/* Cancel */}

          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="
              btn
              btn-sm
              h-10
              min-h-10
              border-base-300
              bg-base-100
              px-5
              text-base-content/70
              hover:bg-base-200
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <ArrowLeftIcon
              className="
                h-4
                w-4
              "
            />

            Cancel

          </button>

          {/* Submit Application */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="
              btn
              btn-sm
              h-10
              min-h-10
              border-[#8BCF00]
              bg-[#8BCF00]
              px-5
              text-white
              hover:border-[#6FA800]
              hover:bg-[#6FA800]
              disabled:cursor-not-allowed
              disabled:border-[#8BCF00]
              disabled:bg-[#8BCF00]
              disabled:opacity-60
            "
          >

            {submitting ? (

              <>

                <span
                  className="
                    loading
                    loading-spinner
                    loading-xs
                  "
                />

                Submitting...

              </>

            ) : (

              <>

                <PaperAirplaneIcon
                  className="
                    h-4
                    w-4
                  "
                />

                Submit Application

              </>

            )}

          </button>

        </div>

      </div>

    </div>

  )
}

export default ExistingLoan