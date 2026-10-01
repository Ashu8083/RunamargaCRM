// admin-react/src/pages/Loans/ViewApplication/modals/UploadDocumentModal.jsx

import React, { useEffect, useRef, useState } from 'react'
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { COLORS } from '../../../../../constants/colors'

function UploadDocumentModal({
    isOpen,
    onClose,
    document,
    onSubmit,
    loading = false,
}) {
    const fileInputRef = useRef(null)

    const [file, setFile] = useState(null)
    const [bankStmtPass, setBankStmtPass] = useState('')

    useEffect(() => {
        if (isOpen) {
            setFile(null)
            setBankStmtPass('')
        }
    }, [isOpen])

    if (!isOpen) {
        return null
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0]

        if (!selectedFile) {
            return
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10 MB')
            event.target.value = ''
            return
        }

        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
        ]

        if (!allowedTypes.includes(selectedFile.type)) {
            alert('Only PDF, JPG and PNG files are allowed')
            event.target.value = ''
            return
        }

        setFile(selectedFile)
    }

    const handleSubmit = async () => {
        if (!file) {
            alert('Please select a file')
            return
        }

        const formData = new FormData()

        formData.append('doc_type', document.key)
        formData.append('file', file)

        if (bankStmtPass) {
            formData.append('bank_stmt_pass', bankStmtPass)
        }

        await onSubmit(formData)
    }

    const isBankStatement =
        document?.key?.includes('bank_statement') ||
        document?.key?.includes('account_statement')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-base-100 shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-semibold">
                            {document?.label || 'Upload Document'}
                        </h3>

                        <p className="mt-1 text-xs text-base-content/60">
                            Upload PDF, JPG or PNG
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 px-5 py-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Document
                        </label>

                        <div className="rounded-lg border border-base-300 bg-base-200 px-4 py-3 text-sm">
                            {document?.label}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Select File
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered w-full"
                            disabled={loading}
                        />

                        {file && (
                            <p className="mt-2 text-xs text-base-content/60">
                                Selected: {file.name}
                            </p>
                        )}
                    </div>

                    {isBankStatement && (
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                PDF Password
                                <span className="ml-1 font-normal text-base-content/50">
                                    (optional)
                                </span>
                            </label>

                            <input
                                type="password"
                                value={bankStmtPass}
                                onChange={(event) =>
                                    setBankStmtPass(event.target.value)
                                }
                                placeholder="Enter PDF password"
                                className="input input-bordered w-full"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="rounded-lg border border-base-300 px-4 py-3 text-xs text-base-content/60">
                        Maximum file size: 10 MB
                        <br />
                        Allowed formats: PDF, JPG, JPEG, PNG
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-base-300 px-5 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="btn btn-ghost"
                    >
                        CANCEL
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className="btn text-black"
                        style={{
                            backgroundColor: COLORS.GREEN,
                        }}
                    >
                        <ArrowUpTrayIcon className="h-4 w-4" />

                        {loading ? 'UPLOADING...' : 'UPLOAD'}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default UploadDocumentModal