import React, { useMemo, useState } from "react";

import ApplicationStepper from "./components/ApplicationStepper";
import LoanTypeSelection from "./components/LoanTypeSelection";
import FormSection from "./components/FormSection";
import AddressSection from "./components/AddressSection";
import ReferencesSection from "./components/ReferencesSection";
import CoApplicantsSection from "./components/CoApplicantsSection";
import DocumentsSection from "./components/DocumentsSection";
import {
    LOAN_TYPES,
    getLoanFormConfig,
} from "./config/loanForms";


function CreateApplication() {

    const [selectedLoanType, setSelectedLoanType] = useState("");

    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({});
    const [addresses, setAddresses] = useState([
        {
            type: "",
            address: "",
        },
    ]);
    const [references, setReferences] = useState([
        {
            name: "",
            phone: "",
            relation: "",
            address: "",
        },
    ]);
    const [coApplicants, setCoApplicants] = useState([
        {
            name: "",
            phone: "",
            email: "",
            pan: "",
            relation: "",
        },
    ]);
    const [documentFiles, setDocumentFiles] = useState({});
    /*
    |--------------------------------------------------------------------------
    | Get selected loan configuration
    |--------------------------------------------------------------------------
    */

    const loanConfig = useMemo(() => {

        if (!selectedLoanType) {
            return null;
        }

        return getLoanFormConfig(selectedLoanType);

    }, [selectedLoanType]);


    /*
    |--------------------------------------------------------------------------
    | Loan Type Selection
    |--------------------------------------------------------------------------
    */

    const handleLoanTypeChange = (loanType) => {

        setSelectedLoanType(loanType);

        setCurrentStep(2);

        setFormData({});

        setAddresses([
            {
                type: "",
                address: "",
            },
        ]);
        setReferences([
            {
                name: "",
                phone: "",
                relation: "",
                address: "",
            },
        ]);

    };


    /*
    |--------------------------------------------------------------------------
    | Field Change
    |--------------------------------------------------------------------------
    */

    const handleFieldChange = (name, value) => {

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    /*
    |--------------------------------------------------------------------------
    | Next
    |--------------------------------------------------------------------------
    */

    const handleNext = () => {

        setCurrentStep((previous) => previous + 1);

    };


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        setCurrentStep((previous) =>
            Math.max(1, previous - 1)
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Change Loan Type
    |--------------------------------------------------------------------------
    */

    const changeLoanType = () => {

        setSelectedLoanType("");

        setFormData({});

        setCurrentStep(1);

    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault();

        console.log("Application Data:", {
            loanType: selectedLoanType,
            ...formData,
        });

        /*
        API submission will be added later.
        */

    };
    const handleAddressChange = (index, field, value) => {

        setAddresses((previous) =>
            previous.map((address, addressIndex) =>
                addressIndex === index
                    ? {
                        ...address,
                        [field]: value,
                    }
                    : address
            )
        );

    };
    /*
       |--------------------------------------------------------------------------
       | Address
       |--------------------------------------------------------------------------
       */

    const addAddress = () => {

        const addressSection = loanConfig?.sections?.find(
            (section) => section.key === "addresses"
        );

        const maxAddresses =
            addressSection?.maxAddresses || 3;

        if (addresses.length >= maxAddresses) {
            return;
        }

        setAddresses((previous) => [
            ...previous,
            {
                type: "",
                address: "",
            },
        ]);

    };


    const removeAddress = (index) => {

        if (addresses.length === 1) {
            return;
        }

        setAddresses((previous) =>
            previous.filter(
                (_, addressIndex) =>
                    addressIndex !== index
            )
        );

    };
    /*
       |--------------------------------------------------------------------------
       | References
       |--------------------------------------------------------------------------
       */
    const handleReferenceChange = (
        index,
        field,
        value
    ) => {

        setReferences((previous) =>
            previous.map((reference, referenceIndex) =>
                referenceIndex === index
                    ? {
                        ...reference,
                        [field]: value,
                    }
                    : reference
            )
        );

    };


    const addReference = () => {

        const maxReferences =
            loanConfig?.maxReferences || 5;

        if (references.length >= maxReferences) {
            return;
        }

        setReferences((previous) => [
            ...previous,
            {
                name: "",
                phone: "",
                relation: "",
                address: "",
            },
        ]);

    };


    const removeReference = (index) => {

        if (references.length === 1) {
            return;
        }

        setReferences((previous) =>
            previous.filter(
                (_, referenceIndex) =>
                    referenceIndex !== index
            )
        );

    };
    /*
     |--------------------------------------------------------------------------
     | Co-Applicant
     |--------------------------------------------------------------------------
     */
    const handleCoApplicantChange = (
        index,
        field,
        value
    ) => {

        setCoApplicants((previous) =>
            previous.map((applicant, applicantIndex) =>
                applicantIndex === index
                    ? {
                        ...applicant,
                        [field]: value,
                    }
                    : applicant
            )
        );

    };


    const addCoApplicant = () => {

        const maxCoApplicants =
            loanConfig?.maxCoApplicants || 5;

        if (coApplicants.length >= maxCoApplicants) {
            return;
        }

        setCoApplicants((previous) => [
            ...previous,
            {
                name: "",
                phone: "",
                email: "",
                pan: "",
                relation: "",
            },
        ]);

    };


    const removeCoApplicant = (index) => {

        if (coApplicants.length === 1) {
            return;
        }

        setCoApplicants((previous) =>
            previous.filter(
                (_, applicantIndex) =>
                    applicantIndex !== index
            )
        );

    };
    /*
     |--------------------------------------------------------------------------
     | Documents
     |--------------------------------------------------------------------------
     */
    const handleDocumentChange = (documentKey, file) => {

        setDocumentFiles((previous) => ({
            ...previous,
            [documentKey]: file,
        }));

    };
    return (

        <div className="w-full py-5 px-10">

            {/* -------------------------------------------------
                STEP INDICATOR
            -------------------------------------------------- */}

            <ApplicationStepper
                currentStep={currentStep}
            />


            {/* -------------------------------------------------
                STEP 1
            -------------------------------------------------- */}

            {currentStep === 1 && (

                <LoanTypeSelection
                    loanTypes={LOAN_TYPES}
                    selectedLoanType={selectedLoanType}
                    onLoanTypeChange={handleLoanTypeChange}
                />

            )}


            {/* -------------------------------------------------
                SELECTED LOAN
            -------------------------------------------------- */}

            {currentStep === 2 && loanConfig && (

                <>

                    {/* Selected Loan Header */}

                    <div className="card bg-base-100 shadow-md mb-5">

                        <div className="card-body">

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="text-sm text-base-content/60">
                                        Selected Loan Type
                                    </p>

                                    <h1 className="text-xl font-semibold">
                                        {loanConfig.label}
                                    </h1>

                                </div>


                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={changeLoanType}
                                >
                                    Change Loan Type
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* -------------------------------------------------
    FORM
-------------------------------------------------- */}

                    <form onSubmit={handleSubmit}>

                        {loanConfig.sections.map((section) => {

                            if (section.type === "addresses") {

                                return (
                                    <AddressSection
                                        key={section.key}
                                        section={section}
                                        addresses={addresses}
                                        onAddressChange={handleAddressChange}
                                        onAddAddress={addAddress}
                                        onRemoveAddress={removeAddress}
                                    />
                                );
                            }


                            if (
                                section.type === "references" ||
                                section.type === "referencesAgriculture"
                            ) {

                                return (
                                    <ReferencesSection
                                        key={section.key}
                                        section={{
                                            ...section,
                                            maxReferences:
                                                loanConfig.maxReferences || 5,
                                        }}
                                        references={references}
                                        onReferenceChange={handleReferenceChange}
                                        onAddReference={addReference}
                                        onRemoveReference={removeReference}
                                    />
                                );
                            }


                            if (
                                section.type === "coApplicants" ||
                                section.type === "coApplicantsAgriculture"
                            ) {

                                return (
                                    <CoApplicantsSection
                                        key={section.key}
                                        section={{
                                            ...section,
                                            maxCoApplicants:
                                                loanConfig.maxCoApplicants || 5,
                                        }}
                                        coApplicants={coApplicants}
                                        onCoApplicantChange={handleCoApplicantChange}
                                        onAddCoApplicant={addCoApplicant}
                                        onRemoveCoApplicant={removeCoApplicant}
                                    />
                                );
                            }


                            if (section.type === "documents") {

                                return (
                                    <DocumentsSection
                                        key={section.key}
                                        section={section}
                                        documents={loanConfig.documents}
                                        documentFiles={documentFiles}
                                        onDocumentChange={handleDocumentChange}
                                    />
                                );
                            }


                            if (!section.type) {

                                return (
                                    <FormSection
                                        key={section.key}
                                        section={section}
                                        formData={formData}
                                        onFieldChange={handleFieldChange}
                                    />
                                );
                            }


                            return null;

                        })}


                        {/* -------------------------------------------------
        ACTIONS
    -------------------------------------------------- */}

                        <div className="flex justify-between items-center mt-6 mb-8">

                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleBack}
                            >
                                ← Back
                            </button>


                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleNext}
                            >
                                Next →
                            </button>

                        </div>

                    </form>

                </>

            )}
            {/* -------------------------------------------------
    STEP 3 - REVIEW & SUBMIT
-------------------------------------------------- */}

            {currentStep === 3 && loanConfig && (

                <div className="space-y-5">

                    {/* Selected Loan */}

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h2 className="text-lg font-semibold">
                                Review Application
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Please review the application details before submitting.
                            </p>

                        </div>

                    </div>


                    {/* Loan Type */}

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h3 className="font-semibold mb-4">
                                Loan Type
                            </h3>

                            <div className="text-base-content">
                                {loanConfig.label}
                            </div>

                        </div>

                    </div>


                    {/* Form Data */}

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h3 className="font-semibold mb-4">
                                Application Details
                            </h3>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {Object.entries(formData).map(
                                    ([key, value]) => (

                                        <div
                                            key={key}
                                            className="border border-base-300 rounded-lg p-3"
                                        >

                                            <p className="text-xs text-base-content/50">
                                                {key}
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {value || "-"}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* Addresses */}

                    <div className="card bg-base-100 shadow-md">

                        <div className="card-body">

                            <h3 className="font-semibold mb-4">
                                Addresses
                            </h3>

                            {addresses.map((address, index) => (

                                <div
                                    key={index}
                                    className="border border-base-300 rounded-lg p-4 mb-3"
                                >

                                    <p>
                                        <span className="text-base-content/50">
                                            Type:
                                        </span>{" "}
                                        {address.type || "-"}
                                    </p>

                                    <p className="mt-1">
                                        <span className="text-base-content/50">
                                            Address:
                                        </span>{" "}
                                        {address.address || "-"}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="flex justify-between items-center mt-6 mb-8">

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleBack}
                        >
                            ← Back
                        </button>


                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSubmit}
                        >
                            Review & Submit
                        </button>

                    </div>

                </div>

            )}
        </div>
    );
}


export default CreateApplication;