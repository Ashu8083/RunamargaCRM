import React from "react";

function DocumentsSection({
    section,
    documents = [],
    documentFiles,
    onDocumentChange,
}) {

    return (
        <div className="card bg-base-100 shadow-md mb-5">

            <div className="card-body">

                {/* Header */}

                <div className="mb-5">

                    <h2 className="card-title text-base font-semibold">
                        {section.title}
                    </h2>

                    <p className="text-sm text-base-content/60 mt-1">
                        Upload the required documents for this loan application.
                    </p>

                </div>


                {/* Documents */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {documents.map((document) => {

                        const selectedFile =
                            documentFiles?.[document.key];

                        return (

                            <div
                                key={document.key}
                                className="border border-base-300 rounded-lg p-4"
                            >

                                <div className="flex items-start justify-between gap-3">

                                    <div className="min-w-0">

                                        <p className="font-medium text-sm">
                                            {document.label}
                                        </p>

                                        {selectedFile && (
                                            <p className="text-xs text-base-content/60 mt-1 truncate">
                                                {selectedFile.name}
                                            </p>
                                        )}

                                    </div>


                                    <label className="btn btn-outline btn-sm shrink-0">

                                        {selectedFile
                                            ? "Change"
                                            : "Upload"
                                        }

                                        <input
                                            type="file"
                                            className="hidden"
                                            accept={document.accept || "*/*"}
                                            onChange={(event) => {

                                                const file =
                                                    event.target.files?.[0] || null;

                                                onDocumentChange(
                                                    document.key,
                                                    file
                                                );

                                                /*
                                                Allow selecting the same
                                                file again after removing
                                                or replacing it.
                                                */

                                                event.target.value = "";
                                            }}
                                        />

                                    </label>

                                </div>


                                {/* Selected file */}

                                {selectedFile && (

                                    <div className="flex items-center justify-between mt-3 p-2 rounded-md bg-base-200">

                                        <div className="flex items-center gap-2 min-w-0">

                                            <span className="text-success">
                                                ✓
                                            </span>

                                            <span className="text-xs truncate">
                                                Document selected
                                            </span>

                                        </div>

                                    </div>

                                )}

                            </div>

                        );

                    })}

                </div>


                {/* No documents */}

                {documents.length === 0 && (

                    <div className="text-center py-8 text-sm text-base-content/50">
                        No documents configured for this loan type.
                    </div>

                )}

            </div>

        </div>
    );
}

export default DocumentsSection;