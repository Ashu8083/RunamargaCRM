// admin-react/src/pages/CallManagement/CallAssignment/components/ExchangeNumberModal.jsx

import { useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ArrowsRightLeftIcon from '@heroicons/react/24/outline/ArrowsRightLeftIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'

import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'
import { exchangeCallAssignment } from '../Api'


// =============================================================
// EXCHANGE MODAL
// =============================================================

function ExchangeNumberModal({
    open = false,
    entry = null,
    onClose,
    onExchange,
}) {

    const [selectedRM, setSelectedRM] =
        useState('')

    const [remarks, setRemarks] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [error, setError] =
        useState('')


    // =========================================================
    // CURRENT RM
    // =========================================================

    const currentRM =
        entry?.assignedToName ||
        entry?.assignedTo ||
        entry?.rmName ||
        entry?.rm ||
        'Not assigned'


    // =========================================================
    // PHONE
    // =========================================================

    const phone =
        entry?.phone ||
        entry?.contact ||
        entry?.number ||
        '—'


    // =========================================================
    // EXCHANGE
    // =========================================================

    const handleExchange = async () => {

        if (!selectedRM) {
            setError('Please select an RM.')
            return
        }

        if (!entry?.id) {
            setError('Assignment ID is missing.')
            return
        }


        setLoading(true)
        setError('')


        try {

            const response =
                await exchangeCallAssignment({
                    assignmentId: entry.id,
                    newAgentId: Number(selectedRM),
                })


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    'Unable to exchange assignment.'
                )

            }


            const updatedData =
                response?.data || {}


            onExchange?.({

                ...entry,

                assignedTo:
                    updatedData.new_agent_id ??
                    Number(selectedRM),

                assignedToName:
                    updatedData.new_agent_name ??
                    entry.assignedToName,

                exchangedFrom:
                    updatedData.previous_agent_name ??
                    currentRM,

                remarks:
                    remarks.trim(),

            })


            handleClose()

        } catch (error) {

            console.error(
                'Exchange assignment failed:',
                error
            )


            setError(
                error?.response?.data?.detail ||
                error?.message ||
                'Unable to exchange assignment.'
            )

        } finally {

            setLoading(false)

        }

    }


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        setSelectedRM('')

        setRemarks('')

        setError('')

        setLoading(false)

        onClose?.()

    }


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[120]
                flex
                items-center
                justify-center
                bg-black/45
                p-3
                sm:p-5
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    handleClose()

                }

            }}
        >

            <div className="
                w-full
                max-w-lg
                overflow-hidden
                rounded-2xl
                bg-base-100
                shadow-2xl
            ">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-6
                    py-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <ArrowsRightLeftIcon className="
                            h-6
                            w-6
                            text-base-content
                        " />


                        <div>

                            <h2 className="
                                text-lg
                                font-semibold
                                text-base-content
                            ">
                                Exchange Contact
                            </h2>


                            <p className="
                                mt-0.5
                                text-xs
                                text-base-content/50
                            ">
                                Transfer this contact to another RM.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
                            transition
                            hover:bg-base-200
                        "
                        aria-label="Close"
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="
                    space-y-5
                    px-6
                    py-5
                ">


                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <div className="
                        rounded-xl
                        border
                        border-base-300
                        bg-base-200/30
                        p-4
                    ">

                        <p className="
                            text-[11px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-base-content/40
                        ">
                            Contact
                        </p>


                        <p className="
                            mt-1
                            text-sm
                            font-semibold
                            text-base-content
                        ">
                            {phone}
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            text-base-content/50
                        ">
                            Currently assigned to{' '}

                            <span className="
                                font-medium
                                text-base-content/70
                            ">
                                {currentRM}
                            </span>

                        </p>

                    </div>


                    {/* =================================================
                        EXCHANGE TO
                    ================================================= */}

                    <div>

                        <RmDropdown
                            value={selectedRM}
                            onChange={(value) => {

                                setSelectedRM(value)
                                setError('')

                            }}
                            placeholder="Select RM"
                            disabled={loading}
                            label="Exchange To"
                        />

                    </div>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-xs
                            font-medium
                            text-base-content/60
                        ">
                            Remarks
                        </label>


                        <textarea
                            value={remarks}
                            onChange={(event) =>
                                setRemarks(
                                    event.target.value
                                )
                            }
                            rows={3}
                            placeholder="Enter reason for exchange..."
                            disabled={loading}
                            className="
                                textarea
                                textarea-bordered
                                min-h-[90px]
                                w-full
                                resize-none
                            "
                        />

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <p className="
                            text-xs
                            font-medium
                            text-error
                        ">
                            {error}
                        </p>

                    )}


                    {/* =================================================
                        INFORMATION
                    ================================================= */}

                    <div className="
                        flex
                        items-start
                        gap-2.5
                        rounded-lg
                        bg-blue-50
                        px-4
                        py-3
                        text-blue-700
                    ">

                        <InformationCircleIcon className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                        " />


                        <p className="
                            text-xs
                            leading-5
                        ">
                            The contact will be removed from the
                            current RM and assigned to the selected RM.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-end
                    gap-2
                    border-t
                    border-base-300
                    px-6
                    py-4
                ">

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            h-10
                            rounded-lg
                            px-4
                            text-sm
                            font-medium
                            text-base-content/70
                            transition
                            hover:bg-base-200
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        disabled={
                            !selectedRM ||
                            loading
                        }
                        onClick={handleExchange}
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#8BCF00]
                            px-5
                            text-sm
                            font-medium
                            text-white
                            transition
                            hover:bg-[#78B300]
                            disabled:cursor-not-allowed
                            disabled:bg-base-300
                            disabled:text-base-content/35
                        "
                    >

                        <ArrowsRightLeftIcon className="
                            h-4
                            w-4
                        " />


                        {loading
                            ? 'Exchanging...'
                            : 'Exchange'}

                    </button>

                </div>

            </div>

        </div>

    )
}


export default ExchangeNumberModal