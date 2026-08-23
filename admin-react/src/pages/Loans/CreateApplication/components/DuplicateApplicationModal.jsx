import React from "react";

function DuplicateApplicationModal({
    isOpen,
    applications = [],
    onClose,
    onRequestApproval,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-7xl rounded-2xl bg-base-100 shadow-xl">

                {/* -------------------------------------------------
                    HEADER
                -------------------------------------------------- */}

                <div className="flex items-start justify-between border-b border-base-300 px-6 py-5">

                    <div>

                        <h2 className="text-lg font-semibold">
                            Existing Applications Found
                        </h2>

                        <p className="mt-1 text-sm text-base-content/60">
                            This customer has existing application records.
                            A superior's approval is required to create another application.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-circle"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>


                {/* -------------------------------------------------
                    TABLE
                -------------------------------------------------- */}

                <div className="px-6 py-5">

                    <div className="overflow-x-auto rounded-xl border border-base-300">

                        <table className="table table-zebra">

                            <thead>

                                <tr>

                                    <th>
                                        Customer Name
                                    </th>

                                    <th>
                                        Phone Number
                                    </th>

                                    <th className="text-center">
                                        In Process
                                    </th>

                                    <th className="text-center">
                                        Login
                                    </th>

                                    <th className="text-center">
                                        Rejected
                                    </th>

                                    <th className="text-center">
                                        Sanctioned
                                    </th>

                                    <th className="text-center">
                                        Disbursed
                                    </th>

                                    <th>
                                        Applied Date
                                    </th>

                                    <th>
                                        Agent
                                    </th>

                                    <th>
                                        RM Name
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {applications.map((application) => (

                                    <tr key={application.id}>

                                        {/* Customer */}

                                        <td>
                                            <span className="font-medium">
                                                {application.customerName || "-"}
                                            </span>
                                        </td>


                                        {/* Phone */}

                                        <td>
                                            {application.phoneNumber || "-"}
                                        </td>


                                        {/* In Process */}

                                        <td className="text-center">

                                            <span className="badge badge-warning badge-sm">
                                                {application.inProcess ?? 0}
                                            </span>

                                        </td>


                                        {/* Login */}

                                        <td className="text-center">

                                            <span className="badge badge-info badge-sm">
                                                {application.login ?? 0}
                                            </span>

                                        </td>


                                        {/* Rejected */}

                                        <td className="text-center">

                                            <span className="badge badge-error badge-sm">
                                                {application.rejected ?? 0}
                                            </span>

                                        </td>


                                        {/* Sanctioned */}

                                        <td className="text-center">

                                            <span className="badge badge-success badge-sm">
                                                {application.sanctioned ?? 0}
                                            </span>

                                        </td>


                                        {/* Disbursed */}

                                        <td className="text-center">

                                            <span className="badge badge-success badge-sm">
                                                {application.disbursed ?? 0}
                                            </span>

                                        </td>


                                        {/* Applied Date */}

                                        <td>
                                            {application.appliedDate || "-"}
                                        </td>


                                        {/* Agent */}

                                        <td>
                                            {application.agentName || "-"}
                                        </td>


                                        {/* RM */}

                                        <td>
                                            {application.rmName || "-"}
                                        </td>

                                    </tr>

                                ))}


                                {/* Empty */}

                                {applications.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="text-center py-8 text-base-content/50"
                                        >
                                            No existing applications found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* -------------------------------------------------
                        WARNING
                    -------------------------------------------------- */}

                    <div className="mt-5 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3">

                        <p className="text-sm text-base-content/70">

                            <span className="font-semibold">
                                Important:
                            </span>{" "}
                            Creating another application for this customer
                            requires approval from your superior.

                        </p>

                    </div>


                    {/* -------------------------------------------------
                        ACTIONS
                    -------------------------------------------------- */}

                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onRequestApproval}
                        >
                            Request Approval
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DuplicateApplicationModal;