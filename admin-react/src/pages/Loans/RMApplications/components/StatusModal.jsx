// admin-react/src/pages/Loans/RMApplications/components/StatusModal.jsx
import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'


function StatusModal({
    open,
    application,
    onClose,
    onSubmit,
}) {

    const [status, setStatus] = useState('')


    useEffect(() => {

        if (!open || !application) {

            setStatus('')

            return
        }


        setStatus(
            application.status || ''
        )

    }, [open, application])


    if (!open || !application) {
        return null
    }


    const handleSubmit = (event) => {

        event.preventDefault()

        if (!status) {
            return
        }


        if (status === application.status) {
            onClose?.()
            return
        }


        onSubmit?.({
            ...application,
            status,
        })
    }


    const statuses = [
        {
            value: 'Inprocess',
            title: 'Inprocess',
            description: 'Application is currently being processed.',
        },
        {
            value: 'Docs Pending',
            title: 'Docs Pending',
            description: 'Waiting for required customer documents.',
        },
        {
            value: 'Rejected',
            title: 'Rejected',
            description: 'Application cannot proceed.',
        },
    ]


    return (

        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="modal-box w-11/12 max-w-2xl p-0 bg-base-100 border border-base-300">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-3">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#8BCF00]/10
                            flex
                            items-center
                            justify-center
                        ">

                            <ArrowPathIcon className="w-5 h-5 text-[#78B300]" />

                        </div>


                        <div>

                            <h3 className="text-lg font-semibold">
                                Update Application Status
                            </h3>

                            <p className="text-xs text-base-content/50 mt-1">
                                Select the new status for this application.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >

                        <XMarkIcon className="w-5 h-5" />

                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="p-5 space-y-5">


                        {/* Assigned Lead */}

                        <div>

                            <p className="text-xs text-base-content/50">
                                Assigned Lead
                            </p>

                            <p className="text-sm font-semibold mt-1">
                                {application.name}
                                {' '}
                                ({application.phone})
                            </p>

                        </div>


                        {/* Current Status */}

                        <div>

                            <p className="text-xs text-base-content/50 mb-2">
                                Current Status
                            </p>


                            <span className="
                                inline-flex
                                items-center
                                px-3
                                py-1
                                rounded-full
                                border
                                border-orange-300
                                bg-orange-50
                                text-orange-600
                                text-xs
                                font-medium
                            ">
                                {application.status || 'N/A'}
                            </span>

                        </div>


                        {/* Select New Status */}

                        <div>

                            <p className="text-sm text-base-content/60 mb-3">
                                Select New Status
                            </p>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {statuses.map((item) => {

                                    const isSelected =
                                        status === item.value


                                    return (

                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() =>
                                                setStatus(item.value)
                                            }
                                            className={`
                                                text-left
                                                rounded-xl
                                                border
                                                px-4
                                                py-4
                                                transition-all
                                                ${
                                                    isSelected
                                                        ? 'border-[#8BCF00] bg-[#8BCF00]/10 ring-1 ring-[#8BCF00]'
                                                        : 'border-base-300 hover:border-[#8BCF00]/50 hover:bg-base-200/50'
                                                }
                                            `}
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div>

                                                    <p
                                                        className={`
                                                            text-sm
                                                            font-semibold
                                                            ${
                                                                item.value === 'Rejected'
                                                                    ? 'text-error'
                                                                    : item.value === 'Docs Pending'
                                                                        ? 'text-orange-600'
                                                                        : 'text-[#78B300]'
                                                            }
                                                        `}
                                                    >
                                                        {item.title}
                                                    </p>


                                                    <p className="text-xs text-base-content/60 mt-1">
                                                        {item.description}
                                                    </p>

                                                </div>


                                                <div
                                                    className={`
                                                        w-5
                                                        h-5
                                                        rounded-full
                                                        border
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                        ${
                                                            isSelected
                                                                ? 'border-[#8BCF00] bg-[#8BCF00]'
                                                                : 'border-base-300'
                                                        }
                                                    `}
                                                >

                                                    {isSelected && (

                                                        <div className="w-2 h-2 rounded-full bg-white" />

                                                    )}

                                                </div>

                                            </div>

                                        </button>

                                    )

                                })}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="flex justify-end gap-2 p-4 border-t border-base-300">

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-ghost"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                !status ||
                                status === application.status
                            }
                            className="
                                btn
                                btn-sm
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                                disabled:bg-base-300
                                disabled:border-base-300
                                disabled:text-base-content/40
                            "
                        >
                            Update Status
                        </button>

                    </div>

                </form>

            </div>


            {/* =================================================
                BACKDROP
            ================================================= */}

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={onClose}
            >

                <button type="button">
                    close
                </button>

            </form>

        </dialog>
    )
}


export default StatusModal