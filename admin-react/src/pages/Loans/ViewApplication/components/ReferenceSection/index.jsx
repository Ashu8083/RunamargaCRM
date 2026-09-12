import React, { useState } from 'react'
import { COLORS } from '../../../../../constants/colors'
import AddAddressReference from '../../modals/AddReferenceModal'
import { addApplicationReference } from './Api'

function ReferenceSection({ application, onRefresh }) {

    const references = application?.references || []
    const [showAddReference, setShowAddReference] =
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
                            References
                        </h2>

                        <p className="text-xs text-base-content/50 mt-1">
                            {references.length} reference
                            {references.length !== 1 ? 's' : ''}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-sm btn-outline" onClick={() => setShowAddReference(true)} style={{
                            borderColor: COLORS.GREEN,
                            color: COLORS.GREEN,
                        }}
                    >
                        + Add Reference
                    </button>

                </div>


                {/* -------------------------------------------------
                    EMPTY STATE
                -------------------------------------------------- */}

                {references.length === 0 && (

                    <div className="border border-dashed border-base-300 rounded-xl mt-4 py-10 text-center">

                        <div className="text-3xl text-base-content/20">
                            👤
                        </div>

                        <p className="mt-3 text-sm text-base-content/60">
                            No references added yet
                        </p>

                        <button
                            type="button"
                            className="btn btn-sm btn-ghost mt-2"
                            style={{
                                color: COLORS.GREEN,
                            }}
                            onClick={() => setShowAddReference(true)}
                        >
                            ADD YOUR FIRST REFERENCE
                        </button>

                    </div>

                )}


                {/* -------------------------------------------------
                    REFERENCES
                -------------------------------------------------- */}

                {references.length > 0 && (

                    <div className="space-y-3 mt-4">

                        {references.map((reference, index) => (

                            <div
                                key={reference.id || index}
                                className="border border-base-300 rounded-xl p-4"
                            >

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Name */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Name
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {reference.name || '-'}
                                        </p>

                                    </div>


                                    {/* Phone */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Phone Number
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {reference.phone || '-'}
                                        </p>

                                    </div>


                                    {/* Relation */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Relation
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {reference.relation || '-'}
                                        </p>

                                    </div>


                                    {/* Address */}

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Address
                                        </p>

                                        <p className="text-sm font-medium mt-1">
                                            {reference.address || '-'}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            <AddAddressReference
                isOpen={showAddReference}
                onClose={() => setShowAddReference(false)}
                onSubmit={async (referenceData) => {
                    try {
                        const response = await addApplicationReference(
                            application?.unique_id,
                            referenceData
                        )

                        console.log('Reference added:', response)

                        setShowAddReference(false)

                        if (onRefresh) {
                            await onRefresh()
                        }
                    } catch (error) {
                        console.error(
                            'Failed to add reference:',
                            error
                        )
                    }
                }}
            />
        </div>
    )
}

export default ReferenceSection