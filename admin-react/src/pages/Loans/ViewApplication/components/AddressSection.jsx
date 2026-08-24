

import React, { useState } from 'react'
import { COLORS } from '../../../../constants/colors'
import AddAddressModal from '../modals/AddAddressModal'

function AddressSection({ application }) {

    const addresses = application?.addresses || []
    const [showAddAddress, setShowAddAddress] =
        useState(false)

    return (

        <div className="card bg-base-100 border border-base-300 shadow-sm">

            <div className="card-body">


                {/* -------------------------------------------------
                    HEADER
                -------------------------------------------------- */}

                <div className="flex items-center justify-between">

                    <h2 className="text-lg font-semibold">
                        Addresses
                        <span className="text-sm font-normal text-base-content/50 ml-2">
                            ({addresses.length})
                        </span>
                    </h2>


                    <button
                        type="button"
                        className="btn btn-sm btn-outline" onClick={() => setShowAddAddress(true)} style={{
                            borderColor: COLORS.GREEN,
                            color: COLORS.GREEN,
                        }}
                    >
                        + Add Address
                    </button>

                </div>


                {/* -------------------------------------------------
                    EMPTY STATE
                -------------------------------------------------- */}

                {addresses.length === 0 && (

                    <div className="border border-dashed border-base-300 rounded-xl mt-4 py-10 text-center">

                        <div className="text-4xl text-base-content/20">
                            📍
                        </div>

                        <p className="mt-3 text-sm text-base-content/60">
                            No addresses added yet
                        </p>

                        <button
                            type="button"
                            className="btn btn-sm btn-ghost mt-2"
                            style={{
                                color: COLORS.GREEN,
                            }}
                            onClick={() => setShowAddAddress(true)}
                        >
                            ADD YOUR FIRST ADDRESS
                        </button>
                    </div>

                )}


                {/* -------------------------------------------------
                    ADDRESSES
                -------------------------------------------------- */}

                {addresses.length > 0 && (

                    <div className="space-y-3 mt-4">

                        {addresses.map((address, index) => (

                            <div
                                key={address.id || index}
                                className="border border-base-300 rounded-xl p-4"
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs text-base-content/50">
                                            Address Type
                                        </p>

                                        <p className="text-sm font-semibold mt-1">
                                            {address.type || 'Address'}
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-3">

                                    <p className="text-xs text-base-content/50">
                                        Address
                                    </p>

                                    <p className="text-sm mt-1">
                                        {address.address || 'Not provided'}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
            <AddAddressModal
                isOpen={showAddAddress}
                onClose={() => setShowAddAddress(false)}
                onSubmit={async (addressData) => {

                    console.log(
                        'Address to save:',
                        addressData
                    )

                    /*
                        Backend connection will go here.
            
                        application.id
                        +
                        addressData
            
                        Then refresh application addresses.
                    */

                    setShowAddAddress(false)
                }}
            />
        </div>

    )
}

export default AddressSection