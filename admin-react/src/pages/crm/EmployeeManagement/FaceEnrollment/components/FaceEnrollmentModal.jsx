// admin-react/src/pages/EmployeeManagement/FaceEnrollment/components/FaceEnrollmentModal.jsx

import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    STATIC_BASE_URL,
} from '../../../../../config/url'


const CAPTURE_TYPES = [
    {
        key: 'FRONT',
        label: 'Front',
        description: 'Straight-facing photo',
    },
    {
        key: 'LEFT',
        label: 'Left',
        description: 'Slightly turned to the left',
    },
    {
        key: 'RIGHT',
        label: 'Right',
        description: 'Slightly turned to the right',
    },
]


// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return ''
    }

    let normalizedPath = String(imagePath)
        .trim()
        .replace(/\\/g, '/')

    normalizedPath = normalizedPath.replace(
        /^\/+/,
        '',
    )

    normalizedPath = normalizedPath.replace(
        /^uploads\/+/i,
        '',
    )

    if (!normalizedPath) {
        return ''
    }

    return `${STATIC_BASE_URL}/uploads/${normalizedPath}`
}


// =========================================================
// COMPONENT
// =========================================================

function FaceEnrollmentModal({
    open = false,
    employee = null,
    onClose,
    onDelete,
    loading = false,
    deletingType = null,
}) {

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null)

    const [
        imageErrors,
        setImageErrors,
    ] = useState({})


    // =====================================================
    // NORMALIZE ENROLLMENTS
    // =====================================================

    const enrollments = useMemo(() => {
        if (
            !employee ||
            !Array.isArray(employee.enrollments)
        ) {
            return []
        }

        return employee.enrollments
    }, [employee])


    // =====================================================
    // FIND ENROLLMENT
    // =====================================================

    const getEnrollment = (captureType) => {
        return (
            enrollments.find(
                (enrollment) =>
                    String(
                        enrollment?.captureType || '',
                    ).toUpperCase() === captureType,
            ) || null
        )
    }


    // =====================================================
    // RESET STATE WHEN MODAL CLOSES / EMPLOYEE CHANGES
    // =====================================================

    useEffect(() => {
        if (!open) {
            setDeleteTarget(null)
            setImageErrors({})
        }
    }, [open])


    useEffect(() => {
        setDeleteTarget(null)
        setImageErrors({})
    }, [employee?.employeeId])


    // =====================================================
    // ESCAPE KEY
    // =====================================================

    useEffect(() => {
        if (!open) {
            return
        }

        const handleKeyDown = (event) => {
            if (
                event.key === 'Escape' &&
                !loading &&
                !deleteTarget
            ) {
                onClose()
            }
        }

        document.addEventListener(
            'keydown',
            handleKeyDown,
        )

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [
        open,
        loading,
        deleteTarget,
        onClose,
    ])


    // =====================================================
    // DELETE REQUEST
    // =====================================================

    const handleDeleteRequest = (enrollment) => {
        if (loading) {
            return
        }

        const captureType = String(
            enrollment?.captureType || '',
        ).toUpperCase()

        if (!captureType) {
            return
        }

        setDeleteTarget({
            captureType,
            enrollment,
        })
    }


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirmDelete = async () => {
        if (!deleteTarget || loading) {
            return
        }

        try {
            await onDelete(
                deleteTarget.enrollment,
            )
        } finally {
            setDeleteTarget(null)
        }
    }


    // =====================================================
    // CANCEL DELETE
    // =====================================================

    const handleCancelDelete = () => {
        if (loading) {
            return
        }

        setDeleteTarget(null)
    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const handleClose = () => {
        if (loading || deleteTarget) {
            return
        }

        onClose()
    }


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (captureType) => {
        setImageErrors((previous) => ({
            ...previous,
            [captureType]: true,
        }))
    }


    // =====================================================
    // DON'T RENDER
    // =====================================================

    if (!open || !employee) {
        return null
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
                backdrop-blur-[2px]
                dark:bg-black/70
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="face-enrollment-modal-title"
        >

            {/* =================================================
                MAIN MODAL
            ================================================= */}

            <div
                className="
                    relative
                    flex
                    max-h-[90vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-2xl

                    dark:border-gray-700
                    dark:bg-gray-900
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        px-6
                        py-5

                        dark:border-gray-700
                    "
                >

                    <div className="min-w-0">

                        <h2
                            id="face-enrollment-modal-title"
                            className="
                                text-lg
                                font-semibold
                                text-gray-900

                                dark:text-white
                            "
                        >
                            Face Enrollment
                        </h2>

                        <div
                            className="
                                mt-1
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-gray-500

                                dark:text-gray-400
                            "
                        >
                            <span className="truncate">
                                {employee.employeeName ||
                                    'Unnamed Employee'}
                            </span>

                            <span aria-hidden="true">
                                •
                            </span>

                            <span className="shrink-0">
                                ID #{employee.employeeId}
                            </span>
                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            ml-4
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-400
                            transition

                            hover:bg-gray-100
                            hover:text-gray-700

                            focus:outline-none
                            focus:ring-2
                            focus:ring-gray-300

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:text-gray-500
                            dark:hover:bg-gray-800
                            dark:hover:text-gray-200
                            dark:focus:ring-gray-600
                        "
                        aria-label="Close face enrollment modal"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12" />
                            <path d="M18 6 6 18" />
                        </svg>
                    </button>

                </div>


                {/* =================================================
                    BODY

                    IMPORTANT:
                    pt-0 removes the unwanted top gap.
                ================================================= */}

                <div
                    className="
                        min-h-0
                        overflow-y-auto
                        px-6
                        pb-6
                        pt-0
                    "
                >

                    {/* =================================================
                        ENROLLMENT SUMMARY
                    ================================================= */}

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3

                            dark:border-gray-700
                            dark:bg-gray-800/60
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-gray-800

                                    dark:text-gray-100
                                "
                            >
                                Face enrollment
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Front, left, and right face
                                images are stored separately.
                            </p>

                        </div>


                        <div
                            className="
                                shrink-0
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-lg
                                    font-semibold
                                    text-gray-900

                                    dark:text-white
                                "
                            >
                                {enrollments.length}

                                <span
                                    className="
                                        text-gray-400
                                        dark:text-gray-500
                                    "
                                >
                                    /3
                                </span>
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                Enrolled
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        CAPTURE CARDS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            lg:grid-cols-3
                        "
                    >

                        {CAPTURE_TYPES.map((capture) => {

                            const enrollment =
                                getEnrollment(
                                    capture.key,
                                )

                            const hasExisting =
                                Boolean(enrollment)

                            const imageUrl =
                                hasExisting
                                    ? getImageUrl(
                                        enrollment.imagePath,
                                    )
                                    : ''

                            const hasImageError =
                                Boolean(
                                    imageErrors[
                                        capture.key
                                    ],
                                )

                            const isDeleting =
                                deletingType ===
                                capture.key


                            return (
                                <div
                                    key={capture.key}
                                    className="
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white

                                        dark:border-gray-700
                                        dark:bg-gray-900
                                    "
                                >

                                    {/* =================================
                                        CARD HEADER
                                    ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-b
                                            border-gray-200
                                            px-4
                                            py-3

                                            dark:border-gray-700
                                        "
                                    >

                                        <div className="min-w-0">

                                            <h3
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-900

                                                    dark:text-white
                                                "
                                            >
                                                {capture.label}
                                            </h3>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    text-gray-500

                                                    dark:text-gray-400
                                                "
                                            >
                                                {capture.description}
                                            </p>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`
                                                ml-3
                                                shrink-0
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium

                                                ${
                                                    hasExisting
                                                        ? `
                                                            bg-green-50
                                                            text-green-700
                                                            dark:bg-green-950/40
                                                            dark:text-green-400
                                                        `
                                                        : `
                                                            bg-gray-100
                                                            text-gray-500
                                                            dark:bg-gray-800
                                                            dark:text-gray-400
                                                        `
                                                }
                                            `}
                                        >
                                            {hasExisting
                                                ? 'Enrolled'
                                                : 'Not Enrolled'}
                                        </span>

                                    </div>


                                    {/* =================================
                                        IMAGE
                                    ================================= */}

                                    <div
                                        className="
                                            aspect-[4/3]
                                            overflow-hidden
                                            bg-gray-100

                                            dark:bg-gray-800
                                        "
                                    >

                                        {imageUrl &&
                                        !hasImageError ? (
                                            <img
                                                src={imageUrl}
                                                alt={`${capture.label} face enrollment`}
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                                loading="lazy"
                                                onError={() =>
                                                    handleImageError(
                                                        capture.key,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <div
                                                className="
                                                    flex
                                                    h-full
                                                    flex-col
                                                    items-center
                                                    justify-center
                                                    px-4
                                                    text-center
                                                "
                                            >

                                                {/* USER ICON */}

                                                <div
                                                    className="
                                                        mb-3
                                                        flex
                                                        h-12
                                                        w-12
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-white
                                                        shadow-sm

                                                        dark:bg-gray-700
                                                    "
                                                >
                                                    <svg
                                                        className="
                                                            h-6
                                                            w-6
                                                            text-gray-400

                                                            dark:text-gray-500
                                                        "
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        aria-hidden="true"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="8"
                                                            r="3.5"
                                                        />

                                                        <path
                                                            d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6"
                                                        />
                                                    </svg>
                                                </div>


                                                <p
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-600

                                                        dark:text-gray-300
                                                    "
                                                >
                                                    {hasImageError
                                                        ? 'Image unavailable'
                                                        : 'No image enrolled'}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-400

                                                        dark:text-gray-500
                                                    "
                                                >
                                                    {hasImageError
                                                        ? 'The enrolled image could not be loaded.'
                                                        : 'This capture angle has not been enrolled.'}
                                                </p>

                                            </div>
                                        )}

                                    </div>


                                    {/* =================================
                                        DELETE ACTION
                                    ================================= */}

                                    {hasExisting && (
                                        <div
                                            className="
                                                border-t
                                                border-gray-200
                                                p-4

                                                dark:border-gray-700
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteRequest(
                                                        enrollment,
                                                    )
                                                }
                                                disabled={loading}
                                                className="
                                                    flex
                                                    h-10
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-lg
                                                    border
                                                    border-red-200
                                                    bg-white
                                                    px-4
                                                    text-sm
                                                    font-medium
                                                    text-red-600
                                                    transition

                                                    hover:border-red-300
                                                    hover:bg-red-50

                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-red-200

                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50

                                                    dark:border-red-900/60
                                                    dark:bg-gray-900
                                                    dark:text-red-400
                                                    dark:hover:border-red-800
                                                    dark:hover:bg-red-950/30
                                                    dark:focus:ring-red-900
                                                "
                                            >

                                                {isDeleting ? (
                                                    <span
                                                        className="
                                                            h-4
                                                            w-4
                                                            animate-spin
                                                            rounded-full
                                                            border-2
                                                            border-red-200
                                                            border-t-red-600

                                                            dark:border-red-900
                                                            dark:border-t-red-400
                                                        "
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <svg
                                                        className="h-4 w-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M4 7h16" />
                                                        <path d="M10 11v6" />
                                                        <path d="M14 11v6" />
                                                        <path d="M6 7l1 13h10l1-13" />
                                                        <path d="M9 7V4h6v3" />
                                                    </svg>
                                                )}

                                                {isDeleting
                                                    ? 'Deleting...'
                                                    : 'Delete Enrollment'}

                                            </button>

                                        </div>
                                    )}

                                </div>
                            )
                        })}

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-end
                        border-t
                        border-gray-200
                        bg-gray-50
                        px-6
                        py-4

                        dark:border-gray-700
                        dark:bg-gray-800/60
                    "
                >

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-gray-700
                            transition

                            hover:bg-gray-50

                            focus:outline-none
                            focus:ring-2
                            focus:ring-gray-300

                            disabled:cursor-not-allowed
                            disabled:opacity-50

                            dark:border-gray-600
                            dark:bg-gray-800
                            dark:text-gray-200
                            dark:hover:bg-gray-700
                            dark:focus:ring-gray-600
                        "
                    >
                        Close
                    </button>

                </div>


                {/* =================================================
                    DELETE CONFIRMATION
                ================================================= */}

                {deleteTarget && (
                    <div
                        className="
                            absolute
                            inset-0
                            z-10
                            flex
                            items-center
                            justify-center
                            bg-black/40
                            p-4
                            backdrop-blur-[2px]

                            dark:bg-black/60
                        "
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-enrollment-title"
                    >

                        <div
                            className="
                                w-full
                                max-w-md
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                p-6
                                shadow-2xl

                                dark:border-gray-700
                                dark:bg-gray-900
                            "
                        >

                            {/* WARNING ICON */}

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-50

                                    dark:bg-red-950/40
                                "
                            >
                                <svg
                                    className="
                                        h-5
                                        w-5
                                        text-red-600

                                        dark:text-red-400
                                    "
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                >
                                    <path d="M12 9v4" />
                                    <path d="M12 17h.01" />
                                    <path d="M10.3 4.7 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z" />
                                </svg>
                            </div>


                            {/* TITLE */}

                            <h3
                                id="delete-enrollment-title"
                                className="
                                    mt-4
                                    text-base
                                    font-semibold
                                    text-gray-900

                                    dark:text-white
                                "
                            >
                                Delete {
                                    deleteTarget.captureType
                                } enrollment?
                            </h3>


                            {/* DESCRIPTION */}

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-gray-500

                                    dark:text-gray-400
                                "
                            >
                                This will remove the enrolled face
                                image for this capture angle. The
                                enrollment will no longer be available
                                for face verification.
                            </p>


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    justify-end
                                    gap-3
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelDelete
                                    }
                                    disabled={loading}
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        transition

                                        hover:bg-gray-50

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-gray-300

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50

                                        dark:border-gray-600
                                        dark:bg-gray-800
                                        dark:text-gray-200
                                        dark:hover:bg-gray-700
                                        dark:focus:ring-gray-600
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmDelete
                                    }
                                    disabled={loading}
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-red-600
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition

                                        hover:bg-red-700

                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-red-300

                                        disabled:cursor-not-allowed
                                        disabled:opacity-60

                                        dark:bg-red-600
                                        dark:hover:bg-red-700
                                        dark:focus:ring-red-900
                                    "
                                >

                                    {deletingType && (
                                        <span
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-white/30
                                                border-t-white
                                            "
                                            aria-hidden="true"
                                        />
                                    )}

                                    {deletingType
                                        ? 'Deleting...'
                                        : 'Delete'}

                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}


export default FaceEnrollmentModal