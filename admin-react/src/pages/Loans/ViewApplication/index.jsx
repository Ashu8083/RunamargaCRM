import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import ApplicationHeader from './components/ApplicationHeader'
import LoanDetails from './components/LoanDetails'
import AddressSection from './components/AddressSection'
import ReferenceSection from './components/ReferenceSection'
import DocumentsSection from './components/DocumentsSection'
import CoApplicantSection from './components/CoApplicantsSection'
import BankProcessing from './components/BankProcessingSection'
import { viewApplication } from '../Api'

function ViewApplication() {

    const { uniqueId } = useParams()

    const [application, setApplication] = useState(null)
    const [loading, setLoading] = useState(false)
    const handleHeaderSave = (updatedData) => {

        setApplication((previous) => ({
            ...previous,
            ...updatedData,
        }))

    }
    const handleLoanDetailsSave = (updatedData) => {

        setApplication((previous) => ({
            ...previous,

            ...updatedData,

            common_fields: {
                ...(previous?.common_fields || {}),
                email: updatedData?.email,
                gender: updatedData?.gender,
                marital_status: updatedData?.marital_status,
                date_of_birth: updatedData?.dob,
                pan_number: updatedData?.pancard_no,
                aadhaar_number: updatedData?.aadhar_no,
                loan_amount: updatedData?.loan_amt,
                loan_tenure: updatedData?.loan_tenure,
                bank_account_number: updatedData?.bank_acc_no,
                ifsc_code: updatedData?.ifsc_code,
            },
        }))

    }

    const fetchApplication = async () => {

        try {

            setLoading(true)

            const response =
                await viewApplication(uniqueId)

            console.log('VIEW APPLICATION RESPONSE:', response)

            setApplication(response?.data)

        } catch (error) {

            console.error('API ERROR:', error)
            console.error('ERROR RESPONSE:', error?.response)
            console.error('ERROR DATA:', error?.response?.data)

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {

        if (uniqueId) {
            fetchApplication()
        }

    }, [uniqueId])
    return (

        <div className="w-full space-y-5">
            {loading && <div>Loading application...</div>}

            {!loading && !application && (
                <div>Application not found</div>
            )}
            <ApplicationHeader
                application={application}
                onSave={(updatedData) => {

                    setApplication((previous) => ({
                        ...previous,
                        ...updatedData,
                    }))

                }}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* LEFT */}

                <div className="xl:col-span-2 space-y-5">

                    <LoanDetails
                        application={application}
                        onSave={handleLoanDetailsSave}
                    />

                    <CoApplicantSection
                        application={application}
                        onRefresh={fetchApplication}
                    />

                </div>


                {/* RIGHT */}

                <div className="space-y-5">

                    <AddressSection
                        application={application}
                        onRefresh={fetchApplication}
                    />

                    <ReferenceSection
                        application={application}
                        onRefresh={fetchApplication}
                    />

                    <DocumentsSection
                        application={application}
                    />

                </div>

            </div>


            {/* BANK PROCESSING */}

            <BankProcessing
                application={application}
            />

        </div>
    )
}


export default ViewApplication