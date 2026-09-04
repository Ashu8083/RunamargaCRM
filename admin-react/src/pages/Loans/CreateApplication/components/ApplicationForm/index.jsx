// admin-react/src/pages/Loans/CreateApplication/components/ApplicationForm/index.jsx

import { useEffect, useState } from 'react'

import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import CurrencyRupeeIcon from '@heroicons/react/24/outline/CurrencyRupeeIcon'
import ChatBubbleBottomCenterTextIcon from '@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon'

import RmDropdown from '../../../../../components/GlobalModels/Filters/RmDropdown'
import StateCityDropdown from '../../../../../components/GlobalModels/Filters/StateCityDropdown'
import LoanTypeDropdown from '../../../../../components/GlobalModels/Filters/LoanTypeDropdown'

import { createLoanApplication } from './API'

// =============================================================
// INITIAL FORM
// =============================================================

const INITIAL_FORM = {
  rm_id: '',
  state_id: '',
  city_id: '',
  loan_type_id: '',
  name: '',
  phone: '',
  loan_amount: '',
  credit_score: '',
  reference_name: '',
  loan_purpose: '',
  remarks: '',
  gender: '',
}

// =============================================================
// GENDER OPTIONS
// =============================================================

const GENDER_OPTIONS = [
  {
    value: 'MALE',
    label: 'Male',
  },
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'OTHER',
    label: 'Other',
  },
  {
    value: 'PREFER_NOT_TO_SAY',
    label: 'Prefer not to say',
  },
]

// =============================================================
// COMPONENT
// =============================================================

function ApplicationForm({
  onExistingLoan,
}) {

  const [formData, setFormData] = useState(INITIAL_FORM)

  const [errors, setErrors] = useState({})

  const [touched, setTouched] = useState({})

  const [submitting, setSubmitting] = useState(false)

  const [notification, setNotification] = useState(null)

  // ===========================================================
  // CLEAR NOTIFICATION
  // ===========================================================

  useEffect(() => {

    if (!notification) {
      return undefined
    }

    const timer = setTimeout(() => {
      setNotification(null)
    }, 4000)

    return () => clearTimeout(timer)

  }, [notification])

  // ===========================================================
  // VALIDATE SINGLE FIELD
  // ===========================================================

  const validateField = (field, value) => {

    const trimmedValue =
      typeof value === 'string'
        ? value.trim()
        : value

    switch (field) {

      // -------------------------------------------------------
      // RM
      // -------------------------------------------------------

      case 'rm_id':

        if (!trimmedValue) {
          return 'Please select a Relationship Manager.'
        }

        return ''

      // -------------------------------------------------------
      // LOAN TYPE
      // -------------------------------------------------------

      case 'loan_type_id':

        if (!trimmedValue) {
          return 'Please select a loan type.'
        }

        return ''

      // -------------------------------------------------------
      // NAME
      // -------------------------------------------------------

      case 'name':

        if (!trimmedValue) {
          return 'Applicant name is required.'
        }

        if (trimmedValue.length < 2) {
          return 'Applicant name must contain at least 2 characters.'
        }

        if (trimmedValue.length > 100) {
          return 'Applicant name cannot exceed 100 characters.'
        }

        if (!/^[a-zA-Z\s.'-]+$/.test(trimmedValue)) {
          return 'Applicant name can contain only letters and spaces.'
        }

        return ''

      // -------------------------------------------------------
      // PHONE
      // -------------------------------------------------------

      case 'phone':

        if (!trimmedValue) {
          return 'Phone number is required.'
        }

        if (!/^[0-9]+$/.test(trimmedValue)) {
          return 'Phone number can contain only digits.'
        }

        if (trimmedValue.length !== 10) {
          return 'Phone number must contain exactly 10 digits.'
        }

        if (!/^[6-9][0-9]{9}$/.test(trimmedValue)) {
          return 'Enter a valid 10-digit Indian phone number.'
        }

        return ''

      // -------------------------------------------------------
      // GENDER
      // -------------------------------------------------------

      case 'gender':

        if (!trimmedValue) {
          return 'Please select gender.'
        }

        return ''

      // -------------------------------------------------------
      // LOAN AMOUNT
      // -------------------------------------------------------

      case 'loan_amount':

        if (!trimmedValue) {
          return 'Loan amount is required.'
        }

        if (!/^[0-9]+$/.test(trimmedValue)) {
          return 'Loan amount can contain only digits.'
        }

        if (Number(trimmedValue) <= 0) {
          return 'Enter a valid loan amount.'
        }

        return ''

      // -------------------------------------------------------
      // CREDIT SCORE
      // -------------------------------------------------------

      case 'credit_score':

        if (!trimmedValue) {
          return ''
        }

        if (!/^[0-9]+$/.test(trimmedValue)) {
          return 'Credit score can contain only digits.'
        }

        if (
          Number(trimmedValue) < 300 ||
          Number(trimmedValue) > 900
        ) {
          return 'Credit score must be between 300 and 900.'
        }

        return ''

      // -------------------------------------------------------
      // REFERENCE NAME
      // -------------------------------------------------------

      case 'reference_name':

        if (!trimmedValue) {
          return 'Reference name is required.'
        }

        if (trimmedValue.length < 2) {
          return 'Reference name must contain at least 2 characters.'
        }

        if (trimmedValue.length > 100) {
          return 'Reference name cannot exceed 100 characters.'
        }

        return ''

      // -------------------------------------------------------
      // LOAN PURPOSE
      // -------------------------------------------------------

      case 'loan_purpose':

        if (!trimmedValue) {
          return 'Loan purpose is required.'
        }

        if (trimmedValue.length < 3) {
          return 'Loan purpose must contain at least 3 characters.'
        }

        if (trimmedValue.length > 200) {
          return 'Loan purpose cannot exceed 200 characters.'
        }

        return ''

      // -------------------------------------------------------
      // REMARKS
      // -------------------------------------------------------

      case 'remarks':

        if (trimmedValue.length > 500) {
          return 'Remarks cannot exceed 500 characters.'
        }

        return ''

      default:

        return ''
    }
  }

  // ===========================================================
  // UPDATE ERROR
  // ===========================================================

  const updateFieldError = (field, value) => {

    const error = validateField(field, value)

    setErrors((previous) => {

      const updated = {
        ...previous,
      }

      if (error) {
        updated[field] = error
      } else {
        delete updated[field]
      }

      return updated

    })

    return error
  }

  // ===========================================================
  // HANDLE TEXT INPUT
  // ===========================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }))

    updateFieldError(name, value)
  }

  // ===========================================================
  // HANDLE RM CHANGE
  // ===========================================================

  const handleRmChange = (value) => {

    setFormData((previous) => ({
      ...previous,
      rm_id: value,
    }))

    setTouched((previous) => ({
      ...previous,
      rm_id: true,
    }))

    updateFieldError(
      'rm_id',
      value
    )
  }

  // ===========================================================
  // HANDLE STATE CHANGE
  // ===========================================================

  const handleStateChange = (value) => {

    setFormData((previous) => ({
      ...previous,
      state_id: value,
      city_id: '',
    }))

    setTouched((previous) => ({
      ...previous,
      state_id: true,
      city_id: false,
    }))

    setErrors((previous) => {

      const updated = {
        ...previous,
      }

      delete updated.state_id
      delete updated.city_id

      return updated
    })
  }

  // ===========================================================
  // HANDLE CITY CHANGE
  // ===========================================================

  const handleCityChange = (value) => {

    setFormData((previous) => ({
      ...previous,
      city_id: value,
    }))

    setTouched((previous) => ({
      ...previous,
      city_id: true,
    }))

    setErrors((previous) => {

      const updated = {
        ...previous,
      }

      delete updated.city_id

      return updated
    })
  }

  // ===========================================================
  // HANDLE LOAN TYPE CHANGE
  // ===========================================================

  const handleLoanTypeChange = (value) => {

    setFormData((previous) => ({
      ...previous,
      loan_type_id: value,
    }))

    setTouched((previous) => ({
      ...previous,
      loan_type_id: true,
    }))

    updateFieldError(
      'loan_type_id',
      value
    )
  }

  // ===========================================================
  // PHONE CHANGE
  // ===========================================================

  const handlePhoneChange = (event) => {

    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 10)

    setFormData((previous) => ({
      ...previous,
      phone: value,
    }))

    setTouched((previous) => ({
      ...previous,
      phone: true,
    }))

    updateFieldError(
      'phone',
      value
    )
  }

  // ===========================================================
  // LOAN AMOUNT CHANGE
  // ===========================================================

  const handleLoanAmountChange = (event) => {

    const value = event.target.value
      .replace(/\D/g, '')

    setFormData((previous) => ({
      ...previous,
      loan_amount: value,
    }))

    setTouched((previous) => ({
      ...previous,
      loan_amount: true,
    }))

    updateFieldError(
      'loan_amount',
      value
    )
  }

  // ===========================================================
  // CREDIT SCORE CHANGE
  // ===========================================================

  const handleCreditScoreChange = (event) => {

    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 3)

    setFormData((previous) => ({
      ...previous,
      credit_score: value,
    }))

    setTouched((previous) => ({
      ...previous,
      credit_score: true,
    }))

    updateFieldError(
      'credit_score',
      value
    )
  }

  // ===========================================================
  // REMARKS CHANGE
  // ===========================================================

  const handleRemarksChange = (event) => {

    const value = event.target.value
      .slice(0, 500)

    setFormData((previous) => ({
      ...previous,
      remarks: value,
    }))

    setTouched((previous) => ({
      ...previous,
      remarks: true,
    }))

    updateFieldError(
      'remarks',
      value
    )
  }

  // ===========================================================
  // HANDLE BLUR
  // ===========================================================

  const handleBlur = (event) => {

    const {
      name,
      value,
    } = event.target

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }))

    updateFieldError(
      name,
      value
    )
  }

  // ===========================================================
  // VALIDATE FORM
  // ===========================================================

  const validateForm = () => {

    const nextErrors = {}

    Object.keys(INITIAL_FORM).forEach((field) => {

      const error = validateField(
        field,
        formData[field]
      )

      if (error) {
        nextErrors[field] = error
      }

    })

    setErrors(nextErrors)

    setTouched(
      Object.keys(INITIAL_FORM).reduce(
        (result, field) => ({
          ...result,
          [field]: true,
        }),
        {}
      )
    )

    return Object.keys(nextErrors).length === 0
  }

  // ===========================================================
  // RESET FORM
  // ===========================================================

  const handleReset = () => {

    if (submitting) {
      return
    }

    setFormData({
      ...INITIAL_FORM,
    })

    setErrors({})

    setTouched({})

    setNotification(null)
  }

  // ===========================================================
  // SUBMIT FORM
  // ===========================================================

  const handleSubmit = async (event) => {

    event.preventDefault()

    setNotification(null)

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setSubmitting(true)

    try {

      // -------------------------------------------------------
      // ORIGINAL APPLICATION DATA
      // -------------------------------------------------------
      //
      // Keep this object intact because if an existing loan
      // is found, the same data will be sent to the final
      // ExistingLoan API.
      //
      // -------------------------------------------------------

      const applicationData = {

        rm_id:
          formData.rm_id,

        state_id:
          formData.state_id || null,

        city_id:
          formData.city_id || null,

        loan_type_id:
          formData.loan_type_id,

        name:
          formData.name.trim(),

        phone:
          formData.phone.trim(),

        loan_amount:
          Number(formData.loan_amount),

        credit_score:
          formData.credit_score
            ? Number(formData.credit_score)
            : null,

        reference_name:
          formData.reference_name.trim(),

        loan_purpose:
          formData.loan_purpose.trim(),

        remarks:
          formData.remarks.trim(),

        gender:
          formData.gender,

      }

      // -------------------------------------------------------
      // INITIAL APPLICATION API
      // -------------------------------------------------------

      const response =
        await createLoanApplication(
          applicationData
        )

      // -------------------------------------------------------
      // EXISTING LOAN FOUND
      // -------------------------------------------------------
      //
      // Do NOT reset the form here.
      //
      // The original application data must remain available
      // because ExistingLoan will use it when the user clicks
      // "Submit Application".
      //
      // -------------------------------------------------------

      if (
        response?.existing_loan === true
      ) {

        if (
          typeof onExistingLoan === 'function'
        ) {

          onExistingLoan({

            existingLoanData:
              response.data,

            originalApplicationData:
              applicationData,

          })

        }

        setSubmitting(false)

        return
      }

      // -------------------------------------------------------
      // NORMAL NEW APPLICATION
      // -------------------------------------------------------

      setNotification({

        type: 'success',

        message:
          response?.message ||
          'Loan application submitted successfully.',

      })

      setFormData({
        ...INITIAL_FORM,
      })

      setErrors({})

      setTouched({})

    } catch (error) {

      console.error(
        'Create loan application failed:',
        error
      )

      setNotification({

        type: 'error',

        message:
          error?.message ||
          'Unable to submit the loan application. Please try again.',

      })

    } finally {

      setSubmitting(false)

    }
  }

  // ===========================================================
  // FIELD CLASS
  // ===========================================================

  const getInputClass = (field) => {

    return `
      input
      input-bordered
      h-10
      min-h-10
      w-full
      rounded-md
      bg-base-100
      text-sm
      placeholder:text-base-content/35
      focus:border-[#8BCF00]
      focus:outline-none
      focus:ring-1
      focus:ring-[#8BCF00]/30
      ${
        errors[field] && touched[field]
          ? `
            border-error
            focus:border-error
            focus:ring-error/20
          `
          : ''
      }
    `
  }

  // ===========================================================
  // SELECT CLASS
  // ===========================================================

  const selectClass = (field) => {

    return `
      select
      select-bordered
      h-10
      min-h-10
      w-full
      rounded-md
      bg-base-100
      text-sm
      focus:border-[#8BCF00]
      focus:outline-none
      focus:ring-1
      focus:ring-[#8BCF00]/30
      ${
        errors[field] && touched[field]
          ? `
            border-error
            focus:border-error
            focus:ring-error/20
          `
          : ''
      }
    `
  }

  // ===========================================================
  // SECTION HEADER
  // ===========================================================

  const SectionHeader = ({
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
          mt-0.5
          h-5
          w-1
          shrink-0
          rounded-full
          bg-[#8BCF00]
        "
      />

      <div>

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

  // ===========================================================
  // FIELD ERROR
  // ===========================================================

  const FieldError = ({
    field,
  }) => {

    if (
      !errors[field] ||
      !touched[field]
    ) {
      return null
    }

    return (

      <p
        className="
          mt-1
          flex
          items-center
          gap-1
          text-[11px]
          text-error
        "
      >

        <ExclamationCircleIcon
          className="
            h-3.5
            w-3.5
            shrink-0
          "
        />

        {errors[field]}

      </p>

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
            ${
              notification.type === 'success'
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
          MAIN WORKSPACE
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

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div
            className="
              space-y-6
              p-4
              sm:p-5
              lg:p-6
            "
          >

            {/* =================================================
                SECTION 1 — APPLICATION DETAILS
            ================================================= */}

            <section>

              <SectionHeader
                title="Application Details"
                description="Assign the application and specify the applicant's location."
              />

              <div
                className="
                  grid
                  grid-cols-1
                  gap-x-5
                  gap-y-4
                  lg:grid-cols-2
                "
              >

                {/* RM */}

                <div className="min-w-0">

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Relationship Manager (RM)

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <RmDropdown
                    label=""
                    value={formData.rm_id}
                    onChange={handleRmChange}
                  />

                  <FieldError
                    field="rm_id"
                  />

                </div>

                {/* Loan Type */}

                <div className="min-w-0">

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Loan Type

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <LoanTypeDropdown
                    label=""
                    value={formData.loan_type_id}
                    onChange={handleLoanTypeChange}
                  />

                  <FieldError
                    field="loan_type_id"
                  />

                </div>

                {/* State + City */}

                <div
                  className="
                    min-w-0
                    lg:col-span-2
                  "
                >

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Location
                  </label>

                  <div
                    className="
                      w-full
                      overflow-x-auto
                    "
                  >

                    <StateCityDropdown
                      stateValue={formData.state_id}
                      cityValue={formData.city_id}
                      onStateChange={handleStateChange}
                      onCityChange={handleCityChange}
                      stateLabel=""
                      cityLabel=""
                      allStatesLabel="All States"
                      allCitiesLabel="All Cities"
                      statePlaceholder="Select State"
                      cityPlaceholder="Select City"
                      stateSearchPlaceholder="Search State"
                      citySearchPlaceholder="Search City"
                      disabled={submitting}
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SECTION 2 — CUSTOMER INFORMATION
            ================================================= */}

            <section>

              <SectionHeader
                title="Customer Information"
                description="Enter the applicant's basic contact and identity details."
              />

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  lg:grid-cols-3
                "
              >

                {/* Full Name */}

                <div className="min-w-0">

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Full Name of Applicant

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <div className="relative">

                    <UserIcon
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-base-content/35
                      "
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                      placeholder="Enter full name"
                      className={`
                        ${getInputClass('name')}
                        pl-9
                      `}
                    />

                  </div>

                  <FieldError
                    field="name"
                  />

                </div>

                {/* Phone */}

                <div className="min-w-0">

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Phone Number

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={handleBlur}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    className={getInputClass('phone')}
                  />

                  <FieldError
                    field="phone"
                  />

                </div>

                {/* Gender */}

                <div className="min-w-0">

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Gender

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={selectClass('gender')}
                  >

                    <option value="">
                      Select Gender
                    </option>

                    {GENDER_OPTIONS.map(
                      (option) => (

                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>

                      )
                    )}

                  </select>

                  <FieldError
                    field="gender"
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                SECTION 3 — LOAN DETAILS
            ================================================= */}

            <section>

              <SectionHeader
                title="Loan Details"
                description="Provide the requested amount, credit information and purpose."
              />

              <div
                className="
                  grid
                  grid-cols-1
                  gap-x-5
                  gap-y-4
                  lg:grid-cols-2
                "
              >

                {/* Loan Amount */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Loan Amount (₹)

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <div className="relative">

                    <CurrencyRupeeIcon
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-base-content/35
                      "
                    />

                    <input
                      type="text"
                      name="loan_amount"
                      value={formData.loan_amount}
                      onChange={handleLoanAmountChange}
                      onBlur={handleBlur}
                      placeholder="Enter loan amount"
                      inputMode="numeric"
                      className={`
                        ${getInputClass('loan_amount')}
                        pl-9
                      `}
                    />

                  </div>

                  <FieldError
                    field="loan_amount"
                  />

                </div>

                {/* Credit Score */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Credit Score
                  </label>

                  <input
                    type="text"
                    name="credit_score"
                    value={formData.credit_score}
                    onChange={handleCreditScoreChange}
                    onBlur={handleBlur}
                    placeholder="Enter credit score (e.g. 750)"
                    inputMode="numeric"
                    maxLength={3}
                    className={getInputClass('credit_score')}
                  />

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-base-content/45
                    "
                  >
                    Optional · Valid range: 300–900
                  </p>

                  <FieldError
                    field="credit_score"
                  />

                </div>

                {/* Reference Name */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Reference Name

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <input
                    type="text"
                    name="reference_name"
                    value={formData.reference_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    placeholder="Enter reference name"
                    className={getInputClass('reference_name')}
                  />

                  <FieldError
                    field="reference_name"
                  />

                </div>

                {/* Loan Purpose */}

                <div>

                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-base-content
                    "
                  >
                    Loan Purpose

                    <span
                      className="
                        ml-1
                        text-error
                      "
                    >
                      *
                    </span>

                  </label>

                  <input
                    type="text"
                    name="loan_purpose"
                    value={formData.loan_purpose}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={200}
                    placeholder="Enter loan purpose"
                    className={getInputClass('loan_purpose')}
                  />

                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <FieldError
                      field="loan_purpose"
                    />

                    <span
                      className="
                        ml-auto
                        text-[10px]
                        text-base-content/40
                      "
                    >
                      {formData.loan_purpose.length}/200
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SECTION 4 — REMARKS
            ================================================= */}

            <section>

              <SectionHeader
                title="Remarks"
                description="Add any additional information relevant to this application."
              />

              <div>

                <label
                  className="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-base-content
                  "
                >
                  Remarks / Notes

                  <span
                    className="
                      ml-1
                      font-normal
                      text-base-content/45
                    "
                  >
                    (Optional)
                  </span>

                </label>

                <div className="relative">

                  <ChatBubbleBottomCenterTextIcon
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-3
                      h-4
                      w-4
                      text-base-content/35
                    "
                  />

                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleRemarksChange}
                    onBlur={handleBlur}
                    maxLength={500}
                    rows={4}
                    placeholder="Enter any additional remarks or notes"
                    className={`
                      textarea
                      textarea-bordered
                      min-h-[100px]
                      w-full
                      resize-y
                      rounded-md
                      bg-base-100
                      pl-9
                      pr-16
                      text-sm
                      placeholder:text-base-content/35
                      focus:border-[#8BCF00]
                      focus:outline-none
                      focus:ring-1
                      focus:ring-[#8BCF00]/30
                      ${
                        errors.remarks &&
                        touched.remarks
                          ? `
                            border-error
                            focus:border-error
                            focus:ring-error/20
                          `
                          : ''
                      }
                    `}
                  />

                  <span
                    className="
                      pointer-events-none
                      absolute
                      bottom-3
                      right-3
                      text-[10px]
                      text-base-content/40
                    "
                  >
                    {formData.remarks.length} / 500
                  </span>

                </div>

                <FieldError
                  field="remarks"
                />

              </div>

            </section>

          </div>

          {/* =================================================
              FORM ACTIONS
          ================================================= */}

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

            {/* Reset */}

            <button
              type="button"
              onClick={handleReset}
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

              <ArrowPathIcon
                className="
                  h-4
                  w-4
                "
              />

              Reset

            </button>

            {/* Submit */}

            <button
              type="submit"
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

                  Submit Application

                  <ArrowRightIcon
                    className="
                      h-4
                      w-4
                    "
                  />

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default ApplicationForm