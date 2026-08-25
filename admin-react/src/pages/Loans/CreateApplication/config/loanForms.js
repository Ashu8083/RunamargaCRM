// Loans/CreateApplication/config/loanForms.js

export const LOAN_TYPES = [
  {
    key: "personal",
    label: "Personal Loan",
  },
  {
    key: "business",
    label: "Business Loan",
  },
  {
    key: "home",
    label: "Home Loan",
  },
  {
    key: "lap",
    label: "LAP",
  },
  {
    key: "education",
    label: "Education Loan",
  },
  {
    key: "car",
    label: "Car Loan",
  },
  {
    key: "gold",
    label: "Gold Loan",
  },
  {
    key: "credit_card",
    label: "Credit Card",
  },
  {
    key: "agriculture",
    label: "Agricultural Loan",
  },
];

/*
|--------------------------------------------------------------------------
| Common Fields
|--------------------------------------------------------------------------
*/

export const COMMON_BASIC_FIELDS = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "loan_amt",
    label: "Loan Amount",
    type: "currency",
    required: true,
  },
  {
    name: "credit_score",
    label: "Credit Score",
    type: "number",
  },
  {
    name: "reference_name",
    label: "Reference Name",
    type: "text",
  },
  {
    name: "loan_purpose",
    label: "Loan Purpose",
    type: "text",
  },
  {
    name: "remarks",
    label: "Remarks",
    type: "textarea",
  },
];

export const COMMON_PERSONAL_FIELDS = [
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  {
    name: "marital_status",
    label: "Marital Status",
    type: "select",
    options: ["Single", "Married", "Divorced", "Widowed"],
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "pan",
    label: "PAN Number",
    type: "text",
  },
  {
    name: "aadhaar",
    label: "Aadhaar Number",
    type: "text",
  },
  {
    name: "loan_tenure",
    label: "Loan Tenure (months)",
    type: "number",
  },
  {
    name: "bank_account",
    label: "Bank Account Number",
    type: "text",
  },
  {
    name: "ifsc",
    label: "IFSC Code",
    type: "text",
  },
];

/*
|--------------------------------------------------------------------------
| Address
|--------------------------------------------------------------------------
*/

export const ADDRESS_FIELDS = [
  {
    name: "type",
    label: "Address Type",
    type: "select",
    options: ["Permanent", "Current", "Office"],
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
  },
];

/*
|--------------------------------------------------------------------------
| References
|--------------------------------------------------------------------------
*/

export const REFERENCE_FIELDS = [
  {
    name: "name",
    label: "Reference Name",
    type: "text",
  },
  {
    name: "phone",
    label: "Reference Phone",
    type: "tel",
  },
  {
    name: "relation",
    label: "Relation with Reference",
    type: "text",
  },
  {
    name: "address",
    label: "Reference Address",
    type: "textarea",
  },
];

/*
|--------------------------------------------------------------------------
| Co-Applicants
|--------------------------------------------------------------------------
*/

export const CO_APPLICANT_FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "pan",
    label: "PAN",
    type: "text",
  },
  {
    name: "relation",
    label: "Relation",
    type: "text",
  },
];

/*
|--------------------------------------------------------------------------
| Business Loan
|--------------------------------------------------------------------------
*/

const BUSINESS_FIELDS = [
  {
    name: "gst_number",
    label: "GST Number",
    type: "text",
  },
  {
    name: "nature_of_business",
    label: "Nature of Business",
    type: "text",
  },
  {
    name: "total_existing_emi",
    label: "Total Existing EMI",
    type: "currency",
  },
  {
    name: "present_loan_amount",
    label: "Present Loan Amount",
    type: "currency",
  },
  {
    name: "house_proof",
    label: "House Proof",
    type: "text",
  },
];

/*
|--------------------------------------------------------------------------
| Home / LAP
|--------------------------------------------------------------------------
*/

const PROPERTY_LOAN_FIELDS = [
  {
    name: "katha_type",
    label: "Katha Type",
    type: "text",
    required: true,
  },
  {
    name: "construction_type",
    label: "Construction Type",
    type: "text",
  },
  {
    name: "total_existing_emi",
    label: "Total Existing EMI",
    type: "currency",
  },
];

/*
|--------------------------------------------------------------------------
| Education Loan
|--------------------------------------------------------------------------
*/

const EDUCATION_FIELDS = [
  {
    name: "student_name",
    label: "Student Full Name",
    type: "text",
    required: true,
  },
  {
    name: "institute_name",
    label: "Institute Name",
    type: "text",
  },
  {
    name: "course_name",
    label: "Course Name",
    type: "text",
  },
  {
    name: "course_type",
    label: "Course Type",
    type: "select",
    options: [],
  },
  {
    name: "course_duration",
    label: "Course Duration (years)",
    type: "number",
  },
  {
    name: "admission_status",
    label: "Admission Status",
    type: "select",
    options: [],
  },
  {
    name: "total_course_fee",
    label: "Total Course Fee",
    type: "currency",
  },
  {
    name: "loan_amount_required",
    label: "Loan Amount Required",
    type: "currency",
  },
  {
    name: "credit_score",
    label: "Credit Score",
    type: "number",
  },
  {
    name: "co_applicant_name",
    label: "Co-Applicant Name",
    type: "text",
  },
  {
    name: "co_applicant_relation",
    label: "Co-Applicant Relation",
    type: "text",
  },
];

/*
|--------------------------------------------------------------------------
| Car Loan
|--------------------------------------------------------------------------
*/

const CAR_FIELDS = [
  {
    name: "car_type",
    label: "Car Type",
    type: "radio",
    options: ["New Car", "Used Car"],
  },
];

/*
|--------------------------------------------------------------------------
| Gold Loan
|--------------------------------------------------------------------------
*/

const AGRICULTURE_FIELDS = [
  {
    name: "applicant_name",
    label: "Applicant Name",
    type: "text",
    required: true,
  },
  {
    name: "pan_card_no",
    label: "PAN Card No",
    type: "text",
  },
  {
    name: "aadhaar_no",
    label: "Aadhaar No",
    type: "text",
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "loan_amount",
    label: "Loan Amount",
    type: "number",
    required: true,
  },
  {
    name: "loan_tenure_months",
    label: "Loan Tenure (Months)",
    type: "number",
  },
  {
    name: "loan_purpose",
    label: "Loan Purpose",
    type: "text",
  },
  {
    name: "bank_account_number",
    label: "Bank Account Number",
    type: "text",
  },
  {
    name: "ifsc_code",
    label: "IFSC Code",
    type: "text",
  },
];

/*
|--------------------------------------------------------------------------
| Documents
|--------------------------------------------------------------------------
*/

const COMMON_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "other_docs",
    label: "Other Docs",
  },
];

const BANK_STATEMENT_DOCUMENTS = [
  {
    key: "savings_statements",
    label: "Savings Statements",
  },
  {
    key: "current_statements",
    label: "Current Statements",
  },
  {
    key: "od_statements",
    label: "OD Statements",
  },
];

const BUSINESS_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "AADHAAR",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "gstr_3b",
    label: "GSTR 3B",
  },
  {
    key: "itr",
    label: "ITR",
  },
  {
    key: "registration_proof",
    label: "Registration Proof",
  },
  {
    key: "co_applicant_pan",
    label: "Co-Applicant PAN",
  },
  {
    key: "co_applicant_aadhaar",
    label: "Co-Applicant Aadhaar",
  },
  {
    key: "savings_statements",
    label: "Savings Statements",
  },
  {
    key: "current_statements",
    label: "Current Statements",
  },
  {
    key: "od_statements",
    label: "OD Statements",
  },
  {
    key: "other_docs",
    label: "Other Docs",
  },
];

const PROPERTY_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar Card",
  },
  {
    key: "pan",
    label: "PAN Card",
  },
  {
    key: "itr",
    label: "ITR",
  },
  {
    key: "form_16",
    label: "Form 16",
  },
  {
    key: "sale_deed",
    label: "Sale Deed",
  },
  {
    key: "mother_deed",
    label: "Mother Deed",
  },
  {
    key: "encumbrance_certificate",
    label: "Encumbrance Certificate",
  },
  {
    key: "katha",
    label: "Katha",
  },
  {
    key: "co_applicant_pan",
    label: "Co-Applicant PAN",
  },
  {
    key: "co_applicant_aadhaar",
    label: "Co-Applicant Aadhaar",
  },
  {
    key: "salary_slips",
    label: "Salary Slips (3 Months)",
  },
  {
    key: "savings_account_statements",
    label: "Savings Account Statements",
  },
  {
    key: "current_account_statements",
    label: "Current Account Statements",
  },
  {
    key: "od_account_statements",
    label: "OD Account Statements",
  },
  {
    key: "other_documents",
    label: "Other Documents",
  },
];

const EDUCATION_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "AADHAAR",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "course_admission_letter",
    label: "Course Admission Letter",
  },
  {
    key: "fee_structure",
    label: "Fee Structure",
  },
  {
    key: "marksheets",
    label: "Marksheets",
  },
  {
    key: "quota_certificate",
    label: "Quota Certificate",
  },
  {
    key: "other_docs",
    label: "Other Docs",
  },
];

const CAR_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "insurance",
    label: "Insurance",
  },
  {
    key: "salary_slips",
    label: "Salary Slips (3 Months)",
  },
  ...BANK_STATEMENT_DOCUMENTS,
  {
    key: "other_docs",
    label: "Other Docs",
  },
];

const GOLD_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "jewellery_photo",
    label: "Jewellery Photo",
  },
  ...BANK_STATEMENT_DOCUMENTS,
  {
    key: "other_docs",
    label: "Other Docs",
  },
];

const CREDIT_CARD_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "card_statement",
    label: "Card Statement",
  },
];

const AGRICULTURE_DOCUMENTS = [
  {
    key: "aadhaar",
    label: "Aadhaar",
  },
  {
    key: "pan",
    label: "PAN",
  },
  {
    key: "salary_slips",
    label: "Salary Slips",
  },
  {
    key: "itr",
    label: "ITR",
  },
  {
    key: "form_16",
    label: "Form 16",
  },
  {
    key: "sale_deed",
    label: "Sale Deed",
  },
  {
    key: "mother_deed",
    label: "Mother Deed",
  },
  {
    key: "ec",
    label: "EC",
  },
  {
    key: "katha",
    label: "Katha",
  },
  {
    key: "co_pan",
    label: "Co PAN",
  },
  {
    key: "co_aadhaar",
    label: "Co Aadhaar",
  },
  {
    key: "savings_statements",
    label: "Savings Statements",
  },
  {
    key: "current_statements",
    label: "Current Statements",
  },
  {
    key: "od_statements",
    label: "OD Statements",
  },
  {
    key: "other_docs",
    label: "Other Docs",
  },
  {
    key: "property_docs",
    label: "Property Docs",
  },
];

/*
|--------------------------------------------------------------------------
| Final Loan Configuration
|--------------------------------------------------------------------------
*/

export const LOAN_FORM_CONFIG = {
  personal: {
    label: "Personal Loan",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: COMMON_BASIC_FIELDS,
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: [
      ...COMMON_DOCUMENTS,
      ...BANK_STATEMENT_DOCUMENTS,
    ],

    maxReferences: 5,
  },

  business: {
    label: "Business Loan",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: COMMON_BASIC_FIELDS,
      },
      {
        key: "business",
        title: "Business Details",
        fields: BUSINESS_FIELDS,
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "family",
        title: "Family Details",
        fields: [
          {
            name: "mother_name",
            label: "Mother's Name",
            type: "text",
          },
          {
            name: "father_name",
            label: "Father's Name",
            type: "text",
          },
          {
            name: "spouse_name",
            label: "Spouse Name",
            type: "text",
          },
        ],
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
        maxAddresses: 2,
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "co_applicants",
        title: "Co-Applicants",
        type: "coApplicants",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: BUSINESS_DOCUMENTS,

    maxReferences: 5,
    maxCoApplicants: 5,
  },

  home: {
    label: "Home Loan",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: COMMON_BASIC_FIELDS,
      },
      {
        key: "loan",
        title: "Loan Details",
        fields: PROPERTY_LOAN_FIELDS,
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "family",
        title: "Family Details",
        fields: [
          {
            name: "mother_name",
            label: "Mother's Name",
            type: "text",
          },
          {
            name: "father_name",
            label: "Father's Name",
            type: "text",
          },
          {
            name: "spouse_name",
            label: "Spouse Name",
            type: "text",
          },
        ],
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
        maxAddresses: 2,
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "co_applicants",
        title: "Co-Applicants",
        type: "coApplicants",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: PROPERTY_DOCUMENTS,

    maxReferences: 5,
    maxCoApplicants: 5,
  },

  lap: {
    label: "LAP",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: COMMON_BASIC_FIELDS,
      },
      {
        key: "loan",
        title: "Loan Details",
        fields: PROPERTY_LOAN_FIELDS,
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "family",
        title: "Family Details",
        fields: [
          {
            name: "mother_name",
            label: "Mother's Name",
            type: "text",
          },
          {
            name: "father_name",
            label: "Father's Name",
            type: "text",
          },
          {
            name: "spouse_name",
            label: "Spouse Name",
            type: "text",
          },
        ],
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
        maxAddresses: 2,
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "co_applicants",
        title: "Co-Applicants",
        type: "coApplicants",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: PROPERTY_DOCUMENTS,

    maxReferences: 5,
    maxCoApplicants: 5,
  },

  education: {
    label: "Education Loan",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: [
          {
            name: "student_name",
            label: "Student Full Name",
            type: "text",
            required: true,
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
          },
          {
            name: "reference_name",
            label: "Reference Name",
            type: "text",
          },
        ],
      },
      {
        key: "loan",
        title: "Loan Details",
        fields: EDUCATION_FIELDS.slice(1),
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
      },
      {
        key: "documents",
        title: "Documents (KYC + Course + Quota)",
        type: "documents",
      },
    ],

    documents: EDUCATION_DOCUMENTS,

    maxReferences: 5,
  },

  car: {
    label: "Car Loan",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
          },
          {
            name: "loan_amt",
            label: "Loan Amount",
            type: "currency",
          },
          {
            name: "credit_score",
            label: "Credit Score",
            type: "number",
          },
          {
            name: "reference_name",
            label: "Reference Name",
            type: "text",
          },
          {
            ...CAR_FIELDS[0],
          },
          {
            name: "remarks",
            label: "Remarks",
            type: "textarea",
          },
        ],
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: CAR_DOCUMENTS,

    maxReferences: 5,
  },

  gold: {
    label: "Gold Loan",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: COMMON_BASIC_FIELDS.filter(
          (field) => field.name !== "loan_purpose"
        ),
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: GOLD_DOCUMENTS,

    maxReferences: 5,
  },

  credit_card: {
    label: "Credit Card",

    sections: [
      {
        key: "basic",
        title: "Basic Information",
        fields: COMMON_BASIC_FIELDS.filter(
          (field) =>
            !["loan_purpose", "loan_amt"].includes(field.name)
        ),
      },
      {
        key: "personal",
        title: "Personal Details",
        fields: COMMON_PERSONAL_FIELDS,
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
      },
      {
        key: "references",
        title: "References",
        type: "references",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: CREDIT_CARD_DOCUMENTS,

    maxReferences: 5,
  },

  agriculture: {
    label: "Agricultural Loan",

    sections: [
      {
        key: "personal_information",
        title: "Personal Information",
        fields: AGRICULTURE_FIELDS.slice(0, 5).concat([
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
            required: true,
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
          },
          {
            name: "remarks",
            label: "Remarks",
            type: "textarea",
          },
        ]),
      },
      {
        key: "loan_property",
        title: "Loan & Agriculture/Property Details",
        fields: AGRICULTURE_FIELDS.slice(5, 8),
      },
      {
        key: "financial",
        title: "Financial Information",
        fields: AGRICULTURE_FIELDS.slice(8),
      },
      {
        key: "addresses",
        title: "Addresses",
        type: "addresses",
      },
      {
        key: "co_applicants",
        title: "Co-Applicants",
        type: "coApplicantsAgriculture",
      },
      {
        key: "references",
        title: "References",
        type: "referencesAgriculture",
      },
      {
        key: "documents",
        title: "Documents",
        type: "documents",
      },
    ],

    documents: AGRICULTURE_DOCUMENTS,

    maxReferences: 5,
    maxCoApplicants: 5,
  },
};

export const getLoanFormConfig = (loanType) => {
  return LOAN_FORM_CONFIG[loanType] || null;
};
