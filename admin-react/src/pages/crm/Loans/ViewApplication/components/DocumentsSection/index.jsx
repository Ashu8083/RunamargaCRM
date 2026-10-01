import React, { useState } from 'react'

import {
    ArrowPathIcon,
    ArrowUpTrayIcon,
    FolderIcon,
    PlusIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'

import UploadDocumentModal from '../../modals/UploadDocumentModal'
import {
    uploadApplicationDocument,
    deleteApplicationDocument,
} from './Api'
import { COLORS } from '../../../../../../constants/colors'

import {
    getLoanFormConfig,
} from '../../../CreateApplication/config/loanForms'

function DocumentsSection({ application, onRefresh }) {

    const [selectedDocument, setSelectedDocument] = useState(null)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [deletingDocumentId, setDeletingDocumentId] = useState(null)
    /*
    ============================================================
    LOAN TYPE
    ============================================================
    */

    const loanTypeName =
        application?.loan_type?.name

    const loanTypeKey = loanTypeName
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\s+loan$/, '')
        ?.replace(/\s+/g, '_')

    const loanConfig =
        getLoanFormConfig(loanTypeKey)

    const documents =
        loanConfig?.documents || []

    /*
    ============================================================
    UPLOADED DOCUMENTS
    ============================================================
    */

    const uploadedDocuments =
        application?.documents || []

    const isUploaded = (documentKey) => {
        return uploadedDocuments.some(
            (document) =>
                document?.document_key === documentKey
        )
    }

    const getUploadedDocument = (documentKey) => {
        return uploadedDocuments.find(
            (document) =>
                document?.document_key === documentKey
        )
    }

    const uploadedCount =
        documents.filter(
            (document) =>
                isUploaded(document.key)
        ).length

    /*
    ============================================================
    SELECT DOCUMENT
    ============================================================
    */

    const handleDocumentChange = (event) => {

        const documentKey =
            event.target.value

        if (!documentKey) {
            setSelectedDocument(null)
            return
        }

        const document =
            documents.find(
                (item) =>
                    item.key === documentKey
            )

        setSelectedDocument(
            document || null
        )
    }

    /*
    ============================================================
    OPEN UPLOAD MODAL
    ============================================================
    */

    const handleUpload = () => {

        if (!selectedDocument) {
            alert('Please select a document type')
            return
        }

        setShowUploadModal(true)
    }

    /*
    ============================================================
    UPLOAD DOCUMENT
    ============================================================
    */

    const handleDocumentSubmit = async (
        formData
    ) => {

       try {
            setUploading(true)

            await uploadApplicationDocument(
                application?.unique_id,
                formData
            )

            setShowUploadModal(false)

            if (onRefresh) {
                await onRefresh()
            }
        } catch (error) {
            console.error('DOCUMENT UPLOAD ERROR:', error)
            console.error('ERROR RESPONSE:', error?.response)
            console.error('ERROR DATA:', error?.response?.data)

            alert(
                error?.response?.data?.detail ||
                'Failed to upload document'
            )
        } finally {
            setUploading(false)
        }
    }
    const handleDelete = async (document) => {
        if (!document?.id) {
            return
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${document.name || document.doc_type}?`
        )

        if (!confirmed) {
            return
        }

        try {
            setDeletingDocumentId(document.id)

            await deleteApplicationDocument(
                application?.unique_id,
                document.id
            )

            if (onRefresh) {
                await onRefresh()
            }

        } catch (error) {
            console.error(
                'DOCUMENT DELETE ERROR:',
                error
            )

            console.error(
                'ERROR RESPONSE:',
                error?.response
            )

            console.error(
                'ERROR DATA:',
                error?.response?.data
            )

            alert(
                error?.response?.data?.detail ||
                'Failed to delete document'
            )

        } finally {
            setDeletingDocumentId(null)
        }
    }
    /*
    ============================================================
    REFRESH
    ============================================================
    */

    const handleRefresh = async () => {

        if (onRefresh) {
            await onRefresh()
        }

    }

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (

        <div
            className="
                card
                bg-base-100
                border
                border-base-300
                shadow-sm
                m-5
            "
        >

            <div className="card-body p-6">

                {/* =================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                            "
                        >
                            Documents
                        </h2>

                        <p
                            className="
                                text-sm
                                text-base-content/60
                                mt-1
                            "
                        >
                            {uploadedCount} of {documents.length} uploaded
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="
                            btn
                            btn-circle
                            btn-ghost
                        "
                        title="Refresh documents"
                    >

                        <ArrowPathIcon
                            className="w-5 h-5"
                        />

                    </button>

                </div>


                {/* =================================================
                    SINGLE UPLOAD AREA
                ================================================== */}

                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/30
                        p-5
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-[1fr_auto]
                            gap-4
                            items-end
                        "
                    >

                        {/* DOCUMENT DROPDOWN */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2
                                "
                            >
                                Select Document
                            </label>

                            <select
                                value={
                                    selectedDocument?.key || ''
                                }
                                onChange={
                                    handleDocumentChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    bg-base-100
                                "
                                disabled={
                                    documents.length === 0 ||
                                    uploading
                                }
                            >

                                <option value="">
                                    Select document type
                                </option>

                                {documents.map(
                                    (document) => {

                                        const uploaded =
                                            isUploaded(
                                                document.key
                                            )

                                        return (
                                            <option
                                                key={document.key}
                                                value={document.key}
                                            >
                                                {document.label}
                                                {uploaded
                                                    ? ' — Uploaded'
                                                    : ''}
                                            </option>
                                        )

                                    }
                                )}

                            </select>

                        </div>


                        {/* SINGLE UPLOAD BUTTON */}

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={
                                !selectedDocument ||
                                uploading
                            }
                            className="
                                btn
                                text-black
                                border-none
                                min-w-[180px]
                            "
                            style={{
                                backgroundColor:
                                    COLORS.GREEN,
                            }}
                        >

                            <ArrowUpTrayIcon
                                className="w-4 h-4"
                            />

                            {selectedDocument &&
                                isUploaded(
                                    selectedDocument.key
                                )
                                ? 'REPLACE DOCUMENT'
                                : 'UPLOAD DOCUMENT'}

                        </button>

                    </div>


                    {/* SELECTED DOCUMENT */}

                    {selectedDocument && (

                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-base-content/60
                            "
                        >

                            <FolderIcon
                                className="w-4 h-4"
                            />

                            <span>
                                Selected:
                            </span>

                            <span
                                className="
                                    font-medium
                                    text-base-content
                                "
                            >
                                {selectedDocument.label}
                            </span>

                            {isUploaded(
                                selectedDocument.key
                            ) && (

                                    <span
                                        className="
                                        text-base-content/50
                                    "
                                    >
                                        — uploading again will replace
                                        the existing document
                                    </span>

                                )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    DOCUMENT LIST
                ================================================== */}

                <div className="mt-6">

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-3
                        "
                    >

                        <h3
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            Required Documents
                        </h3>

                    </div>


                    {documents.length === 0 ? (

                        <div
                            className="
                                rounded-xl
                                border
                                border-base-300
                                px-5
                                py-6
                                text-center
                            "
                        >

                            <FolderIcon
                                className="
                                    w-7
                                    h-7
                                    mx-auto
                                    text-base-content/40
                                "
                            />

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-base-content/60
                                "
                            >
                                No document requirements configured
                                for this loan type.
                            </p>

                        </div>

                    ) : (

                        <div
                            className="
                                border
                                border-base-300
                                rounded-xl
                                overflow-hidden
                            "
                        >

                            {documents.map(
                                (document, index) => {

                                    const uploaded =
                                        isUploaded(
                                            document.key
                                        )

                                    const uploadedDocument =
                                        getUploadedDocument(
                                            document.key
                                        )

                                    return (

                                        <div
                                            key={document.key}
                                            className={`
                                                flex
                                                items-center
                                                gap-4
                                                px-4
                                                py-3
                                                ${index !==
                                                    documents.length - 1
                                                    ? 'border-b border-base-300'
                                                    : ''
                                                }
                                            `}
                                        >

                                            {/* DOCUMENT INFO */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    min-w-0
                                                "
                                            >

                                                <div
                                                    className="
                                                        w-9
                                                        h-9
                                                        rounded-lg
                                                        bg-base-200
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                    "
                                                >

                                                    {uploaded ? (

                                                        <CheckCircleIcon
                                                            className="w-5 h-5"
                                                            style={{
                                                                color:
                                                                    COLORS.GREEN,
                                                            }}
                                                        />

                                                    ) : (

                                                        <FolderIcon
                                                            className="
                                                                w-5
                                                                h-5
                                                                text-base-content/40
                                                            "
                                                        />

                                                    )}

                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            flex-wrap
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-medium
                                                            "
                                                        >
                                                            {document.label}
                                                        </p>

                                                    </div>


                                                    {uploaded ? (

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-base-content/50
                                                                mt-1
                                                                truncate
                                                            "
                                                        >
                                                            {
                                                                uploadedDocument?.file_name ||
                                                                uploadedDocument?.path ||
                                                                'Document uploaded'
                                                            }
                                                        </p>

                                                    ) : (

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-base-content/40
                                                                mt-1
                                                            "
                                                        >
                                                            Not uploaded
                                                        </p>

                                                    )}

                                                </div>

                                            </div>
                                            {uploaded && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(uploadedDocument)
                                                    }
                                                    disabled={
                                                        uploading ||
                                                        deletingDocumentId === uploadedDocument?.id
                                                    }
                                                    className="
            btn
            btn-sm
            btn-error
            btn-outline
            shrink-0
        "
                                                >
                                                    {deletingDocumentId === uploadedDocument?.id
                                                        ? 'DELETING...'
                                                        : 'DELETE'}
                                                </button>
                                            )}
                                        </div>

                                    )

                                }
                            )}

                        </div>

                    )}

                </div>



                {/* =================================================
                    FILE INFORMATION
                ================================================== */}

                <div
                    className="
                        mt-5
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/30
                        px-4
                        py-3
                    "
                >

                    <p
                        className="
                            text-xs
                            text-base-content/50
                        "
                    >
                        Max 10 MB · PDF, JPG, PNG ·
                        Password protection for PDF
                    </p>

                </div>

            </div>


            {/* =================================================
                UPLOAD MODAL
            ================================================== */}

            <UploadDocumentModal
                isOpen={showUploadModal}

                onClose={() => {

                    if (!uploading) {

                        setShowUploadModal(false)
                        setSelectedDocument(null)

                    }

                }}

                document={selectedDocument}

                onSubmit={handleDocumentSubmit}

                loading={uploading}
            />

        </div>

    )
}

export default DocumentsSection