import React from "react";

function AddressSection({
    section,
    addresses,
    onAddressChange,
    onAddAddress,
    onRemoveAddress,
}) {

    const maxAddresses = section.maxAddresses || 3;

    const canAddAddress = addresses.length < maxAddresses;


    return (
        <div className="card bg-base-100 shadow-md mb-5">

            <div className="card-body">

                {/* Header */}

                <div className="flex items-start justify-between gap-4 mb-4">

                    <div>

                        <h2 className="card-title text-base font-semibold">
                            {section.title}
                        </h2>

                        <p className="text-sm text-base-content/60 mt-1">
                            Add your address details.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={onAddAddress}
                        disabled={!canAddAddress}
                    >
                        + Add Address
                    </button>

                </div>


                {/* Addresses */}

                <div className="space-y-4">

                    {addresses.map((address, index) => (

                        <div
                            key={index}
                            className="border border-base-300 rounded-lg p-4"
                        >

                            {/* Address Header */}

                            <div className="flex items-center justify-between mb-4">

                                <h3 className="font-medium text-sm">
                                    Address {index + 1}
                                </h3>


                                {addresses.length > 1 && (

                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs text-error"
                                        onClick={() =>
                                            onRemoveAddress(index)
                                        }
                                    >
                                        Remove
                                    </button>

                                )}

                            </div>


                            {/* Address Fields */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Address Type */}

                                <div className="form-control w-full">

                                    <label className="label">

                                        <span className="label-text">
                                            Address Type
                                        </span>

                                    </label>


                                    <select
                                        className="select select-bordered w-full"
                                        value={address.type || ""}
                                        onChange={(event) =>
                                            onAddressChange(
                                                index,
                                                "type",
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select Address Type
                                        </option>

                                        <option value="Permanent">
                                            Permanent
                                        </option>

                                        <option value="Current">
                                            Current
                                        </option>

                                        <option value="Office">
                                            Office
                                        </option>

                                    </select>

                                </div>


                                {/* Address */}

                                <div className="form-control w-full md:col-span-2">

                                    <label className="label">

                                        <span className="label-text">
                                            Address
                                        </span>

                                    </label>


                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        rows={3}
                                        value={address.address || ""}
                                        placeholder="Enter full address"
                                        onChange={(event) =>
                                            onAddressChange(
                                                index,
                                                "address",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* Limit message */}

                {!canAddAddress && (

                    <p className="text-xs text-base-content/50 mt-3">
                        Maximum {maxAddresses} addresses allowed.
                    </p>

                )}

            </div>

        </div>
    );
}

export default AddressSection;