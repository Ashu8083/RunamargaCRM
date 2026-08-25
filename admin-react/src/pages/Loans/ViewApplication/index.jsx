import React from 'react'

import ApplicationHeader from './components/ApplicationHeader'
import LoanDetails from './components/LoanDetails'
import AddressSection from './components/AddressSection'
import ReferenceSection from './components/ReferenceSection'
import DocumentsSection from './components/DocumentsSection'
import CoApplicantSection from './components/CoApplicantsSection'
import BankProcessing from './components/BankProcessingSection'


function ViewApplication({ application }) {

    console.log('VIEW APPLICATION DATA:', application)

    return (

        <div className="w-full space-y-5">

            <ApplicationHeader
                application={application}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* LEFT */}

                <div className="xl:col-span-2 space-y-5">

                    <LoanDetails
                        application={application}
                    />

                    <CoApplicantSection
                        application={application}
                    />

                </div>


                {/* RIGHT */}

                <div className="space-y-5">

                    <AddressSection
                        application={application}
                    />

                    <ReferenceSection
                        application={application}
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