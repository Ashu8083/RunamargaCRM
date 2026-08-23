import React from 'react'
import { COLORS } from '../../../../constants/colors'

function DocumentsSection({ application }) {

    const documents = application?.documents || []


    return (

        <div className="card bg-base-100 border border-base-300 shadow-sm">

            <div className="card-body">


                {/* -------------------------------------------------
                    HEADER
                -------------------------------------------------- */}

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-semibold">
                            Documents
                        </h2>

                        <p className="text-xs text-base-content/50 mt-1">
                            {documents.length} document
                            {documents.length !== 1 ? 's' : ''}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn btn-sm btn-outline"
                    >
                        + Upload Document
                    </button>

                </div>


                {/* -------------------------------------------------
                    EMPTY STATE
                -------------------------------------------------- */}

                {documents.length === 0 && (

                    <div className="border border-dashed border-base-300 rounded-xl mt-4 py-10 text-center">

                        <div className="text-3xl text-base-content/20">
                            📄
                        </div>

                        <p className="mt-3 text-sm text-base-content/60">
                            No documents uploaded yet
                        </p>

                        <button
                            type="button"
                            className="btn btn-sm btn-ghost mt-2"
                            style={{
                                color: COLORS.GREEN,
                            }}
                        >
                            UPLOAD FIRST DOCUMENT
                        </button>

                    </div>

                )}


                {/* -------------------------------------------------
                    DOCUMENT LIST
                -------------------------------------------------- */}

                {documents.length > 0 && (

                    <div className="mt-4 overflow-x-auto">

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>
                                        Document
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Uploaded By
                                    </th>

                                    <th>
                                        Uploaded Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {documents.map((document, index) => (

                                    <tr key={document.id || index}>

                                        {/* Document */}

                                        <td>

                                            <div className="flex items-center gap-3">

                                                <div className="
                                                    w-9
                                                    h-9
                                                    rounded-lg
                                                    bg-base-200
                                                    flex
                                                    items-center
                                                    justify-center
                                                ">
                                                    📄
                                                </div>


                                                <div>

                                                    <p className="text-sm font-medium">
                                                        {document.file_name || '-'}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Type */}

                                        <td>

                                            <span className="text-sm">
                                                {document.document_type || '-'}
                                            </span>

                                        </td>


                                        {/* Uploaded By */}

                                        <td>

                                            <span className="text-sm">
                                                {document.uploaded_by || '-'}
                                            </span>

                                        </td>


                                        {/* Date */}

                                        <td>

                                            <span className="text-sm">
                                                {document.uploaded_at || '-'}
                                            </span>

                                        </td>


                                        {/* Status */}

                                        <td>

                                            <span className="badge badge-success badge-outline badge-sm">
                                                {document.status || 'Uploaded'}
                                            </span>

                                        </td>


                                        {/* Action */}

                                        <td>

                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => {
                                                    // Document preview/download
                                                    // will be connected later.
                                                }}
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    )
}

export default DocumentsSection