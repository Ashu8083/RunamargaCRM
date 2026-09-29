// admin-react/src/pages/Loans/ViewApplication/components/CoApplicantsSection/index.jsx

import React, { useState } from 'react'
import { COLORS } from '../../../../../../constants/colors'
import AddCoApplicantModal from '../../modals/AddCoApplicantModal'
import { addApplicationCoApplicant } from './Api'


function CoApplicantsSection({ application, onRefresh }) {

    const coApplicants = application?.co_applicants || []
    const [showCoApplicantModal, setShowCoApplicantModal] =
        useState(false)
    return (

        <div className="card bg-base-100 border border-base-300 shadow-sm m-5">

            <div className="card-body">

                {/* -------------------------------------------------
                    HEADER
                -------------------------------------------------- */}

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-semibold">
                            Co-Applicants
                        </h2>

                        <p className="text-xs text-base-content/50 mt-1">
                            {coApplicants.length} co-applicant
                            {coApplicants.length !== 1 ? 's' : ''}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        style={{
                            borderColor: COLORS.GREEN,
                            color: COLORS.GREEN,
                        }}
                        onClick={() =>
                            setShowCoApplicantModal(true)
                        }
                    >
                        + ADD CO-APPLICANT
                    </button>

                </div>


                {/* -------------------------------------------------
                    EMPTY STATE
                -------------------------------------------------- */}

                {coApplicants.length === 0 && (

                    <div className="border border-dashed border-base-300 rounded-xl mt-4 py-10 text-center">

                        <div className="text-3xl text-base-content/20">
                            👥
                        </div>

                        <p className="mt-3 text-sm text-base-content/60">
                            No co-applicants added
                        </p>

                        <button
                            type="button"
                            className="btn btn-sm btn-ghost mt-2"
                            style={{
                                color: COLORS.GREEN,
                            }}
                            onClick={() =>
                                setShowCoApplicantModal(true)
                            }
                        >
                            + ADD CO-APPLICANT
                        </button>

                    </div>

                )}


                {/* -------------------------------------------------
                    CO-APPLICANTS
                -------------------------------------------------- */}

                {coApplicants.length > 0 && (

                    <div className="space-y-3 mt-4">

                        {coApplicants.map((coApplicant, index) => (

                            <div
                                key={coApplicant.id || index}
                                className="border border-base-300 rounded-xl p-4"
                            >

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                    {/* Name */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Name
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {coApplicant.name || '-'}
                                        </p>

                                    </div>


                                    {/* Phone */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Phone Number
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {coApplicant.phone || '-'}
                                        </p>

                                    </div>





                                    {/* PAN */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            PAN Number
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {coApplicant.pan_number || '-'}
                                        </p>

                                    </div>


                                    {/* Aadhaar */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Aadhaar Number
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {coApplicant.aadhaar_number || '-'}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            <AddCoApplicantModal
                isOpen={showCoApplicantModal}
                onClose={() =>
                    setShowCoApplicantModal(false)
                }
                onSubmit={async (coApplicantData) => {
                    try {
                        console.log('APPLICATION:', application)
                        console.log('UNIQUE ID:', application?.unique_id)
                        console.log('CO-APPLICANT DATA:', coApplicantData)

                        const response = await addApplicationCoApplicant(
                            application?.unique_id,
                            coApplicantData
                        )

                        console.log('Co-applicant added:', response)

                        setShowCoApplicantModal(false)

                        if (onRefresh) {
                            await onRefresh()
                        }
                    } catch (error) {
                        console.error('Failed to add co-applicant:', error)
                    }
                }}
            />

        </div>
    )
}

export default CoApplicantsSection