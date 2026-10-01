import React from "react";

function ReferencesSection({
    section,
    references,
    onReferenceChange,
    onAddReference,
    onRemoveReference,
}) {
    const maxReferences = section.maxReferences || 5;

    const canAddReference =
        references.length < maxReferences;

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
                            Add reference details.
                            Maximum {maxReferences} references allowed.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={onAddReference}
                        disabled={!canAddReference}
                    >
                        + Add Reference
                    </button>

                </div>


                {/* References */}

                <div className="space-y-4">

                    {references.map((reference, index) => (

                        <div
                            key={index}
                            className="border border-base-300 rounded-lg p-4"
                        >

                            {/* Reference Header */}

                            <div className="flex items-center justify-between mb-4">

                                <h3 className="font-medium text-sm">
                                    Reference {index + 1}
                                </h3>


                                {references.length > 1 && (

                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs text-error"
                                        onClick={() =>
                                            onRemoveReference(index)
                                        }
                                    >
                                        Remove
                                    </button>

                                )}

                            </div>


                            {/* Fields */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Name */}

                                <div className="form-control w-full">

                                    <label className="label">
                                        <span className="label-text">
                                            Reference Name
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={reference.name || ""}
                                        placeholder="Enter reference name"
                                        onChange={(event) =>
                                            onReferenceChange(
                                                index,
                                                "name",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* Phone */}

                                <div className="form-control w-full">

                                    <label className="label">
                                        <span className="label-text">
                                            Reference Phone
                                        </span>
                                    </label>

                                    <input
                                        type="tel"
                                        className="input input-bordered w-full"
                                        value={reference.phone || ""}
                                        placeholder="Enter phone number"
                                        onChange={(event) =>
                                            onReferenceChange(
                                                index,
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* Relation */}

                                <div className="form-control w-full">

                                    <label className="label">
                                        <span className="label-text">
                                            Relation with Reference
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={reference.relation || ""}
                                        placeholder="Enter relation"
                                        onChange={(event) =>
                                            onReferenceChange(
                                                index,
                                                "relation",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* Address */}

                                <div className="form-control w-full md:col-span-2">

                                    <label className="label">
                                        <span className="label-text">
                                            Reference Address
                                        </span>
                                    </label>

                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        rows={3}
                                        value={reference.address || ""}
                                        placeholder="Enter reference address"
                                        onChange={(event) =>
                                            onReferenceChange(
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


                {/* Maximum message */}

                {!canAddReference && (

                    <p className="text-xs text-base-content/50 mt-3">
                        Maximum {maxReferences} references reached.
                    </p>

                )}

            </div>

        </div>
    );
}

export default ReferencesSection;