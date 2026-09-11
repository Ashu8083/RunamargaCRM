import { useState } from 'react'


const DuplicateApprovalModal = ({
    applications = [],
    onClose,
    onSubmit,
}) => {

    const [action, setAction] =
        useState('approve')

    const [remarks, setRemarks] =
        useState('')


    const handleSubmit = () => {

        if (
            action === 'reject' &&
            !remarks.trim()
        ) {
            return
        }

        onSubmit(
            action,
            remarks.trim()
        )
    }


    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-3xl rounded-xl bg-base-100 shadow-xl">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">

                    <div>

                        <h3 className="text-lg font-semibold">
                            Duplicate Application Approval
                        </h3>

                        <p className="mt-1 text-xs text-base-content/60">
                            Review the selected duplicate applications
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


                {/* ================================= */}
                {/* BODY */}
                {/* ================================= */}

                <div className="max-h-[70vh] overflow-y-auto px-5 py-4">

                    {/* Selected count */}

                    <div className="mb-3">

                        <span className="text-sm font-semibold">
                            Selected Applications
                        </span>

                        <span className="ml-2 text-sm text-base-content/50">
                            ({applications.length})
                        </span>

                    </div>


                    {/* Applications */}

                    <div className="mb-5 overflow-x-auto rounded-lg border border-base-200">

                        <table className="table table-sm">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Loan Type
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Applied By
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {applications.map(
                                    (application) => {

                                        const amount =
                                            application.loanAmount ??
                                            application.loan_amount

                                        return (
                                            <tr
                                                key={
                                                    application.id
                                                }
                                            >

                                                <td>
                                                    {application.applicantName ||
                                                        application.name ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {application.phone ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {application.loanType ||
                                                        application.loan_type ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {amount !==
                                                    null &&
                                                    amount !==
                                                    undefined
                                                        ? `₹${Number(
                                                              amount
                                                          ).toLocaleString(
                                                              'en-IN'
                                                          )}`
                                                        : '-'}
                                                </td>

                                                <td>
                                                    {application.appliedBy ||
                                                        application.applied_by ||
                                                        '-'}
                                                </td>

                                            </tr>
                                        )
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* Action */}

                    <div className="mb-4">

                        <label className="mb-2 block text-sm font-medium">
                            Action
                        </label>


                        <div className="flex gap-5">

                            <label className="flex cursor-pointer items-center gap-2">

                                <input
                                    type="radio"
                                    name="duplicateApprovalAction"
                                    className="radio radio-success radio-sm"
                                    value="approve"
                                    checked={
                                        action ===
                                        'approve'
                                    }
                                    onChange={() =>
                                        setAction(
                                            'approve'
                                        )
                                    }
                                />

                                <span className="text-sm">
                                    Approve
                                </span>

                            </label>


                            <label className="flex cursor-pointer items-center gap-2">

                                <input
                                    type="radio"
                                    name="duplicateApprovalAction"
                                    className="radio radio-error radio-sm"
                                    value="reject"
                                    checked={
                                        action ===
                                        'reject'
                                    }
                                    onChange={() =>
                                        setAction(
                                            'reject'
                                        )
                                    }
                                />

                                <span className="text-sm">
                                    Reject
                                </span>

                            </label>

                        </div>

                    </div>


                    {/* Rejection remarks */}

                    {action === 'reject' && (

                        <div className="mb-2">

                            <label
                                htmlFor="rejectedRemarks"
                                className="mb-2 block text-sm font-medium"
                            >
                                Rejection Remarks
                                <span className="ml-1 text-error">
                                    *
                                </span>
                            </label>

                            <textarea
                                id="rejectedRemarks"
                                className="textarea textarea-bordered min-h-24 w-full"
                                rows="3"
                                placeholder="Enter reason for rejection"
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    )}

                </div>


                {/* ================================= */}
                {/* FOOTER */}
                {/* ================================= */}

                <div className="flex justify-end gap-2 border-t border-base-200 px-5 py-4">

                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className={
                            action === 'approve'
                                ? 'btn btn-success btn-sm'
                                : 'btn btn-error btn-sm'
                        }
                        disabled={
                            action === 'reject' &&
                            !remarks.trim()
                        }
                        onClick={
                            handleSubmit
                        }
                    >
                        {action === 'approve'
                            ? 'Approve'
                            : 'Reject'}
                    </button>

                </div>

            </div>

        </div>
    )
}


export default DuplicateApprovalModal