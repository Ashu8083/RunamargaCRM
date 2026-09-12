// admin-react/src/pages/Loans/ViewApplication/modals/BankProcessingWorkflowModal.jsx


import React, { useEffect, useState } from 'react'

function BankProcessingWorkflowModal({
    isOpen,
    onClose,
    action,
    bank,
    onSubmit,
}) {
    const [offeredAmount, setOfferedAmount] = useState('')
    const [remarks, setRemarks] = useState('')
    const [disbursementAmount, setDisbursementAmount] = useState('')
    const [processingFees, setProcessingFees] = useState('')
    const [insurance, setInsurance] = useState('')
    const [disbursedAt, setDisbursedAt] = useState('')
    const [applicationReferenceId, setApplicationReferenceId] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setOfferedAmount('')
            setRemarks('')
            setDisbursementAmount('')
            setProcessingFees('')
            setInsurance('')
            setDisbursedAt('')
            setApplicationReferenceId('')
        }
    }, [isOpen, action])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setIsSaving(true)

            let data = {}

            if (action === 'sanction') {
                if (!offeredAmount) {
                    alert('Please enter sanction amount')
                    return
                }

                data = {
                    offered_amount: Number(offeredAmount),
                }
            }

            if (action === 'reject') {
                if (!remarks.trim()) {
                    alert('Please enter rejection reason')
                    return
                }

                data = {
                    remarks: remarks.trim(),
                }
            }

            if (action === 'disburse') {
                if (!disbursementAmount) {
                    alert('Please enter disbursement amount')
                    return
                }

                data = {
                    disbursement_amount: Number(disbursementAmount),
                    processing_fees: processingFees
                        ? Number(processingFees)
                        : null,
                    insurance: insurance || null,
                    disbursed_at: disbursedAt || null,
                    application_reference_id:
                        applicationReferenceId.trim() || null,
                }
            }

            await onSubmit({
                action,
                data,
            })

            onClose()
        } catch (error) {
            console.error('WORKFLOW ERROR:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const title =
        action === 'sanction'
            ? 'Sanction Loan'
            : action === 'reject'
              ? 'Reject Loan'
              : 'Disburse Loan'

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    {title}
                </h3>

                <p className="text-sm text-base-content/60 mt-1">
                    {bank?.bank_name || 'Bank'}
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-4"
                >
                    {action === 'sanction' && (
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Sanction Amount
                                </span>
                            </label>

                            <input
                                type="number"
                                className="input input-bordered w-full"
                                value={offeredAmount}
                                onChange={(e) =>
                                    setOfferedAmount(e.target.value)
                                }
                                placeholder="Enter sanction amount"
                            />
                        </div>
                    )}

                    {action === 'reject' && (
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Rejection Reason
                                </span>
                            </label>

                            <textarea
                                className="textarea textarea-bordered w-full"
                                value={remarks}
                                onChange={(e) =>
                                    setRemarks(e.target.value)
                                }
                                placeholder="Enter rejection reason"
                                rows={4}
                            />
                        </div>
                    )}

                    {action === 'disburse' && (
                        <>
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Disbursement Amount
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={disbursementAmount}
                                    onChange={(e) =>
                                        setDisbursementAmount(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter disbursement amount"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Processing Fees
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={processingFees}
                                    onChange={(e) =>
                                        setProcessingFees(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter processing fees"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Insurance
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={insurance}
                                    onChange={(e) =>
                                        setInsurance(e.target.value)
                                    }
                                    placeholder="Enter insurance"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Disbursement Date
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={disbursedAt}
                                    onChange={(e) =>
                                        setDisbursedAt(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Application Reference ID
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={applicationReferenceId}
                                    onChange={(e) =>
                                        setApplicationReferenceId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter reference ID"
                                />
                            </div>
                        </>
                    )}

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BankProcessingWorkflowModal