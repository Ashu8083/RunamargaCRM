// admin-react/src/components/GlobalModels/FeedbackModal.jsx

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'


// =============================================================
// USAGE
// =============================================================
//
// Success:
//
// <FeedbackModal
//     open={feedback.open}
//     type="success"
//     title="Role Created"
//     message="The role was created successfully."
//     onClose={closeFeedback}
// />
//
// Error:
//
// <FeedbackModal
//     open={feedback.open}
//     type="error"
//     title="Unable to Create Role"
//     message="A role with this code already exists."
//     onClose={closeFeedback}
// />
//
// Warning:
//
// <FeedbackModal
//     open={feedback.open}
//     type="warning"
//     title="Role Inactive"
//     message="This role is currently inactive."
//     onClose={closeFeedback}
// />
//
// Information:
//
// <FeedbackModal
//     open={feedback.open}
//     type="info"
//     title="Information"
//     message="The changes will take effect after the employee logs in again."
//     onClose={closeFeedback}
// />
//
// Auto-close:
//
// <FeedbackModal
//     open={feedback.open}
//     type="success"
//     title="Saved"
//     message="Changes saved successfully."
//     autoClose
//     autoCloseDuration={2500}
//     showCloseButton={false}
//     onClose={closeFeedback}
// />


// =============================================================
// COMPONENT
// =============================================================

function FeedbackModal({
    open = false,

    type = 'success',

    title = '',

    message = '',

    onClose,

    autoClose = false,

    autoCloseDuration = 3000,

    closeOnBackdrop = true,

    showCloseButton = true,

    confirmText = 'OK',
}) {

    // =========================================================
    // ANIMATION STATE
    // =========================================================

    const [visible, setVisible] = useState(false)


    // =========================================================
    // OPEN ANIMATION
    // =========================================================

    useEffect(() => {

        if (!open) {
            setVisible(false)
            return
        }

        /*
         * Wait one frame before enabling the visible state.
         * This allows the browser to animate from the initial
         * opacity / scale state.
         */
        const animationFrame = requestAnimationFrame(() => {
            setVisible(true)
        })

        return () => {
            cancelAnimationFrame(animationFrame)
        }

    }, [open])


    // =========================================================
    // AUTO CLOSE
    // =========================================================

    useEffect(() => {

        if (!open || !autoClose) {
            return
        }

        const timer = setTimeout(() => {

            handleClose()

        }, autoCloseDuration)

        return () => {
            clearTimeout(timer)
        }

    }, [
        open,
        autoClose,
        autoCloseDuration,
    ])


    // =========================================================
    // ESCAPE KEY
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }

        const handleKeyDown = (event) => {

            if (event.key === 'Escape') {
                handleClose()
            }

        }

        document.addEventListener(
            'keydown',
            handleKeyDown
        )

        return () => {

            document.removeEventListener(
                'keydown',
                handleKeyDown
            )

        }

    }, [open])


    // =========================================================
    // CLOSE
    // =========================================================

    const handleClose = () => {

        /*
         * Start closing animation.
         */
        setVisible(false)

        /*
         * Wait for animation to finish before
         * notifying the parent component.
         */
        setTimeout(() => {

            onClose?.()

        }, 180)

    }


    // =========================================================
    // DON'T RENDER
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // CONFIGURATION
    // =========================================================

    const feedbackConfig = {

        success: {

            icon: CheckCircleIcon,

            iconClass:
                'text-[#78B300]',

            iconBackground:
                'bg-[#8BCF00]/10',

            accent:
                'bg-[#8BCF00]',

            title:
                title || 'Success',

            defaultMessage:
                'The operation was completed successfully.',
        },


        error: {

            icon: XCircleIcon,

            iconClass:
                'text-error',

            iconBackground:
                'bg-error/10',

            accent:
                'bg-error',

            title:
                title || 'Something went wrong',

            defaultMessage:
                'The operation could not be completed. Please try again.',
        },


        warning: {

            icon: ExclamationTriangleIcon,

            iconClass:
                'text-warning',

            iconBackground:
                'bg-warning/10',

            accent:
                'bg-warning',

            title:
                title || 'Warning',

            defaultMessage:
                'Please review the information and try again.',
        },


        info: {

            icon: InformationCircleIcon,

            iconClass:
                'text-info',

            iconBackground:
                'bg-info/10',

            accent:
                'bg-info',

            title:
                title || 'Information',

            defaultMessage:
                'Here is some information for you.',
        },

    }


    // =========================================================
    // RESOLVE CONFIGURATION
    // =========================================================

    const config =
        feedbackConfig[type] ||
        feedbackConfig.info


    const Icon = config.icon


    // =============================================================
    // MODAL CONTENT
    // =============================================================

    const modalContent = (

        <div
            className="
                fixed
                inset-0
                top-0
                right-0
                bottom-0
                left-0
                z-[99999]
                flex
                min-h-screen
                w-screen
                items-center
                justify-center
                p-4
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
        >

            {/* =================================================
                FULL SCREEN BACKDROP
            ================================================= */}

            <div
                className={`
                    fixed
                    inset-0
                    top-0
                    right-0
                    bottom-0
                    left-0
                    z-0
                    bg-black/40
                    backdrop-blur-[2px]
                    transition-opacity
                    duration-200
                    ease-out

                    ${
                        visible
                            ? 'opacity-100'
                            : 'opacity-0'
                    }
                `}
                onClick={() => {

                    if (closeOnBackdrop) {
                        handleClose()
                    }

                }}
            />


            {/* =================================================
                POPUP
            ================================================= */}

            <div
                className={`
                    relative
                    z-10
                    w-full
                    max-w-md
                    overflow-hidden
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-2xl

                    transform
                    transition-all
                    duration-200
                    ease-out

                    ${
                        visible
                            ? 'translate-y-0 scale-100 opacity-100'
                            : 'translate-y-2 scale-95 opacity-0'
                    }
                `}
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >

                {/* =================================================
                    TOP ACCENT
                ================================================= */}

                <div
                    className={`
                        h-1
                        w-full
                        ${config.accent}
                    `}
                />


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="p-6">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-start gap-4">


                        {/* =================================================
                            ICON
                        ================================================= */}

                        <div
                            className={`
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                ${config.iconBackground}
                            `}
                        >

                            <Icon
                                className={`
                                    h-7
                                    w-7
                                    ${config.iconClass}
                                `}
                            />

                        </div>


                        {/* =================================================
                            TITLE / MESSAGE
                        ================================================= */}

                        <div
                            className="
                                min-w-0
                                flex-1
                                pt-0.5
                            "
                        >

                            <h3
                                id="feedback-modal-title"
                                className="
                                    text-lg
                                    font-semibold
                                    text-base-content
                                "
                            >

                                {config.title}

                            </h3>


                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    leading-6
                                    text-base-content/60
                                "
                            >

                                {message || config.defaultMessage}

                            </p>

                        </div>


                        {/* =================================================
                            CLOSE BUTTON
                        ================================================= */}

                        {showCloseButton && (

                            <button
                                type="button"
                                onClick={handleClose}
                                className="
                                    btn
                                    btn-sm
                                    btn-ghost
                                    btn-circle
                                    shrink-0
                                    -mr-1
                                    -mt-1
                                "
                                aria-label="Close"
                            >

                                <XMarkIcon
                                    className="
                                        h-5
                                        w-5
                                    "
                                />

                            </button>

                        )}

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            mt-6
                            flex
                            justify-end
                        "
                    >

                        <button
                            type="button"
                            onClick={handleClose}
                            className={`
                                btn
                                btn-sm
                                min-w-20
                                border-transparent
                                text-white
                                transition-all
                                duration-150
                                hover:opacity-90
                                active:scale-95
                                ${config.accent}
                            `}
                        >

                            {confirmText}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    )


    // =============================================================
    // RENDER THROUGH PORTAL
    // =============================================================

    /*
     * IMPORTANT:
     *
     * Render directly under <body>.
     *
     * This prevents parent containers, transforms,
     * overflow settings, or stacking contexts from
     * creating the gap at the top of the screen.
     */

    return createPortal(
        modalContent,
        document.body
    )
}


export default FeedbackModal