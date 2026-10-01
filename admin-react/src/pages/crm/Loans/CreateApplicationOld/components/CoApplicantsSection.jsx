import React from "react";

function CoApplicantsSection({
    section,
    coApplicants,
    onCoApplicantChange,
    onAddCoApplicant,
    onRemoveCoApplicant,
}) {

    const maxCoApplicants =
        section.maxCoApplicants || 5;

    const canAddCoApplicant =
        coApplicants.length < maxCoApplicants;


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
                            Add co-applicant details.
                            Maximum {maxCoApplicants} co-applicants allowed.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={onAddCoApplicant}
                        disabled={!canAddCoApplicant}
                    >
                        + Add Co-Applicant
                    </button>

                </div>


                {/* Co-Applicants */}

                <div className="space-y-4">

                    {coApplicants.map((applicant, index) => (

                        <div
                            key={index}
                            className="border border-base-300 rounded-lg p-4"
                        >

                            {/* Header */}

                            <div className="flex items-center justify-between mb-4">

                                <h3 className="font-medium text-sm">
                                    Co-Applicant {index + 1}
                                </h3>


                                {coApplicants.length > 1 && (

                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs text-error"
                                        onClick={() =>
                                            onRemoveCoApplicant(index)
                                        }
                                    >
                                        Remove
                                    </button>

                                )}

                            </div>


                            {/* Fields */}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Name */}

                                <div className="form-control w-full">

                                    <label className="label">

                                        <span className="label-text">
                                            Name
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={applicant.name || ""}
                                        placeholder="Enter name"
                                        onChange={(event) =>
                                            onCoApplicantChange(
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
                                            Phone
                                        </span>

                                    </label>

                                    <input
                                        type="tel"
                                        className="input input-bordered w-full"
                                        value={applicant.phone || ""}
                                        placeholder="Enter phone number"
                                        onChange={(event) =>
                                            onCoApplicantChange(
                                                index,
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* Email */}

                                <div className="form-control w-full">

                                    <label className="label">

                                        <span className="label-text">
                                            Email
                                        </span>

                                    </label>

                                    <input
                                        type="email"
                                        className="input input-bordered w-full"
                                        value={applicant.email || ""}
                                        placeholder="Enter email"
                                        onChange={(event) =>
                                            onCoApplicantChange(
                                                index,
                                                "email",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* PAN */}

                                <div className="form-control w-full">

                                    <label className="label">

                                        <span className="label-text">
                                            PAN
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full uppercase"
                                        value={applicant.pan || ""}
                                        placeholder="Enter PAN"
                                        onChange={(event) =>
                                            onCoApplicantChange(
                                                index,
                                                "pan",
                                                event.target.value.toUpperCase()
                                            )
                                        }
                                    />

                                </div>


                                {/* Relation */}

                                <div className="form-control w-full">

                                    <label className="label">

                                        <span className="label-text">
                                            Relation
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={applicant.relation || ""}
                                        placeholder="Enter relation"
                                        onChange={(event) =>
                                            onCoApplicantChange(
                                                index,
                                                "relation",
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

                {!canAddCoApplicant && (

                    <p className="text-xs text-base-content/50 mt-3">
                        Maximum {maxCoApplicants} co-applicants reached.
                    </p>

                )}

            </div>

        </div>
    );
}

export default CoApplicantsSection;