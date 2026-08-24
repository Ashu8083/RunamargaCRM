import React from 'react'

import {
    ArrowPathIcon,
    ArrowUpTrayIcon,
    FolderIcon,
    PlusIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'

import { COLORS } from '../../../../constants/colors'

import {
    getLoanFormConfig,
} from '../../CreateApplication/config/loanForms'


function DocumentsSection({ application }) {

    const loanConfig =
        getLoanFormConfig(
            application?.loan_type
        )


    const documents =
        loanConfig?.documents || []


    /*
        Later this will come from the backend.

        Example:

        application.documents = [
            {
                id: 1,
                document_key: 'aadhaar',
                file_name: 'aadhaar.pdf',
                uploaded_at: '...'
            }
        ]
    */

    const uploadedDocuments =
        application?.documents || []


    const isUploaded = (documentKey) => {

        return uploadedDocuments.some(
            (document) =>
                document?.document_key === documentKey
        )

    }


    const uploadedCount =
        documents.filter(
            (document) =>
                isUploaded(document.key)
        ).length


    const handleUpload = (document) => {

        /*
            We will connect this to the backend
            upload API later.

            For now this only identifies which
            document the user wants to upload.
        */

        console.log(
            'Upload document:',
            document
        )

    }


    return (

        <div className="
            card
            bg-base-100
            border
            border-base-300
            shadow-sm
        ">

            <div className="card-body">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="
                    flex
                    items-start
                    justify-between
                    gap-4
                ">

                    <div>

                        <h2 className="
                            text-xl
                            font-semibold
                        ">
                            Documents
                        </h2>


                        <p className="
                            text-sm
                            text-base-content/60
                            mt-1
                        ">
                            {uploadedCount} of {documents.length} uploaded
                        </p>

                    </div>


                    <button
                        type="button"
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
                    DOCUMENT LIST
                ================================================== */}

                <div className="
                    mt-5
                    space-y-3
                ">

                    {documents.length === 0 ? (

                        <div className="
                            border
                            border-base-300
                            rounded-xl
                            p-8
                            text-center
                        ">

                            <FolderIcon
                                className="
                                    w-8
                                    h-8
                                    mx-auto
                                    text-base-content/40
                                "
                            />


                            <p className="
                                text-sm
                                text-base-content/50
                                mt-3
                            ">
                                No document requirements configured
                                for this loan type.
                            </p>

                        </div>

                    ) : (

                        documents.map((document) => {

                            const uploaded =
                                isUploaded(
                                    document.key
                                )


                            return (

                                <div
                                    key={document.key}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        border
                                        border-base-300
                                        rounded-xl
                                        px-4
                                        py-3
                                        bg-base-100
                                    "
                                >

                                    {/* ---------------------------------
                                        DOCUMENT INFORMATION
                                    ---------------------------------- */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        min-w-0
                                    ">

                                        <div className="
                                            w-9
                                            h-9
                                            rounded-lg
                                            bg-base-200
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        ">

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
                                                        text-base-content/50
                                                    "
                                                />

                                            )}

                                        </div>


                                        <div className="min-w-0">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                                flex-wrap
                                            ">

                                                <p className="
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {document.label}
                                                </p>


                                                {document.required && (

                                                    <span className="
                                                        badge
                                                        badge-error
                                                        badge-sm
                                                    ">
                                                        Required
                                                    </span>

                                                )}

                                            </div>


                                            {uploaded && (

                                                <p className="
                                                    text-xs
                                                    mt-1
                                                "
                                                style={{
                                                    color:
                                                        COLORS.GREEN,
                                                }}
                                                >
                                                    Uploaded
                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    {/* ---------------------------------
                                        ACTION
                                    ---------------------------------- */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleUpload(
                                                document
                                            )
                                        }
                                        className="
                                            btn
                                            btn-sm
                                            shrink-0
                                            text-black
                                            border-none
                                        "
                                        style={{
                                            backgroundColor:
                                                COLORS.GREEN,
                                        }}
                                    >

                                        <ArrowUpTrayIcon
                                            className="w-4 h-4"
                                        />

                                        {uploaded
                                            ? 'REPLACE'
                                            : 'UPLOAD'}

                                    </button>

                                </div>

                            )

                        })

                    )}

                </div>


                {/* =================================================
                    OTHER DOCUMENTS
                ================================================== */}

                <div className="mt-5">

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    ">


                        <button
                            type="button"
                            className="
                                btn
                                btn-ghost
                                btn-sm
                                px-1
                            "
                            style={{
                                color:
                                    COLORS.GREEN,
                            }}
                        >

                            <span>
                                ▾
                            </span>

                            Other Documents (0)

                        </button>


                        <button
                            type="button"
                            className="
                                btn
                                btn-sm
                                btn-outline
                            "
                            style={{
                                borderColor:
                                    COLORS.GREEN,

                                color:
                                    COLORS.GREEN,
                            }}
                        >

                            <PlusIcon
                                className="w-4 h-4"
                            />

                            ADD

                        </button>

                    </div>

                </div>


                {/* =================================================
                    FILE INFORMATION
                ================================================== */}

                <div className="
                    mt-4
                    border
                    border-base-300
                    rounded-xl
                    px-4
                    py-3
                    text-xs
                    text-base-content/50
                ">

                    Max 10 MB · PDF, JPG, PNG ·
                    Password protection for PDF

                </div>

            </div>

        </div>
    )
}


export default DocumentsSection