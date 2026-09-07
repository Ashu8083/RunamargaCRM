// admin-react/src/pages/Loans/CreateApplication/components/ApplicationForm/LoanApplicationFields.js


// =============================================================
// LOAN APPLICATION FIELD CONFIGURATION
// =============================================================
//
// This file controls:
//
// 1. Common application fields
// 2. Loan types
// 3. Extra fields required by specific loan types
//
// IMPORTANT:
//
// Do NOT hardcode loan-type-specific fields inside
// ApplicationForm/index.jsx.
//
// If a new loan type needs extra fields in the future,
// add them here only.
//
// Example:
//
// Business:
//   Business Name
//
// Personal:
//   No extra fields
//
// Home:
//   No extra fields
//
// Future example:
//
// Home:
//   [
//     {
//       name: 'property_type',
//       label: 'Property Type',
//       ...
//     }
//   ]
//
// ApplicationForm will automatically render the fields
// configured here.
// =============================================================


// =============================================================
// COMMON APPLICATION FIELDS
// =============================================================
//
// These fields are common to every loan type.
//
// These are metadata/configuration only.
// Existing ApplicationForm functionality remains unchanged.
//
// =============================================================

export const COMMON_APPLICATION_FIELDS = [
  {
    name: 'rm_id',
    label: 'Relationship Manager (RM)',
    type: 'rm_dropdown',
    required: true,
  },

  {
    name: 'loan_type_id',
    label: 'Loan Type',
    type: 'loan_type_dropdown',
    required: true,
  },

  {
    name: 'state_id',
    label: 'State',
    type: 'state_dropdown',
    required: false,
  },

  {
    name: 'city_id',
    label: 'City',
    type: 'city_dropdown',
    required: false,
  },

  {
    name: 'name',
    label: 'Full Name of Applicant',
    type: 'text',
    required: true,
  },

  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: true,
  },

  {
    name: 'gender',
    label: 'Gender',
    type: 'select',
    required: true,
  },

  {
    name: 'loan_amount',
    label: 'Loan Amount',
    type: 'number',
    required: true,
  },

  {
    name: 'credit_score',
    label: 'Credit Score',
    type: 'number',
    required: false,
  },

  {
    name: 'reference_name',
    label: 'Reference Name',
    type: 'text',
    required: true,
  },

  {
    name: 'loan_purpose',
    label: 'Loan Purpose',
    type: 'text',
    required: true,
  },

  {
    name: 'remarks',
    label: 'Remarks / Notes',
    type: 'textarea',
    required: false,
  },
]


// =============================================================
// LOAN TYPE CONFIGURATION
// =============================================================
//
// IMPORTANT:
//
// The "loanType" value must match the "name" returned by
// the backend /loan-types API.
//
// Current backend values:
//
// Personal
// Business
// Home
// LAP
// Education
// Car
// Gold
// Credit Card
// Agricultural
//
// Each loan type has an "extraFields" array.
//
// If there are no extra fields, keep:
//
// extraFields: []
//
// =============================================================

export const LOAN_TYPE_CONFIG = {

  Personal: {

    loanType: 'Personal',

    extraFields: [],

  },


  Business: {

    loanType: 'Business',

    extraFields: [

      {
        name: 'business_name',

        label: 'Business Name',

        type: 'text',

        required: true,

        placeholder: 'Enter business name',

        maxLength: 150,

      },

    ],

  },


  Home: {

    loanType: 'Home',

    extraFields: [],

  },


  LAP: {

    loanType: 'LAP',

    extraFields: [],

  },


  Education: {

    loanType: 'Education',

    extraFields: [],

  },


  Car: {

    loanType: 'Car',

    extraFields: [],

  },


  Gold: {

    loanType: 'Gold',

    extraFields: [],

  },


  'Credit Card': {

    loanType: 'Credit Card',

    extraFields: [],

  },


  Agricultural: {

    loanType: 'Agricultural',

    extraFields: [],

  },

}


// =============================================================
// GET LOAN TYPE CONFIGURATION
// =============================================================
//
// Pass the loan type name:
//
// getLoanTypeConfig('Business')
//
// Returns:
//
// {
//   loanType: 'Business',
//   extraFields: [...]
// }
//
// If a loan type does not exist in the configuration,
// it safely returns an empty extraFields array.
//
// =============================================================

export const getLoanTypeConfig = (loanTypeName) => {

  if (!loanTypeName) {

    return {
      loanType: '',
      extraFields: [],
    }

  }


  const normalizedName =
    String(loanTypeName)
      .trim()
      .toLowerCase()


  const configEntry =
    Object.values(LOAN_TYPE_CONFIG).find(
      (config) =>
        config.loanType
          .trim()
          .toLowerCase() === normalizedName
    )


  if (!configEntry) {

    return {
      loanType: loanTypeName,
      extraFields: [],
    }

  }


  return configEntry

}


// =============================================================
// GET EXTRA FIELDS FOR LOAN TYPE
// =============================================================
//
// Example:
//
// getExtraFieldsForLoanType('Business')
//
// Returns:
//
// [
//   {
//     name: 'business_name',
//     label: 'Business Name',
//     ...
//   }
// ]
//
// For Personal:
//
// []
//
// =============================================================

export const getExtraFieldsForLoanType = (
  loanTypeName
) => {

  const config =
    getLoanTypeConfig(loanTypeName)


  return config.extraFields || []

}


// =============================================================
// CHECK WHETHER A LOAN TYPE HAS EXTRA FIELDS
// =============================================================

export const hasExtraFieldsForLoanType = (
  loanTypeName
) => {

  return (
    getExtraFieldsForLoanType(
      loanTypeName
    ).length > 0
  )

}