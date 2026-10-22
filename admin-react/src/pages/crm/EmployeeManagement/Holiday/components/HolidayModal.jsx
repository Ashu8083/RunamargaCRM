
 // admin-react/src/pages/crm/EmployeeManagement/Holiday/components/HolidayModal.jsx

import {
    useEffect,
    useState,
} from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'


// ============================================================================
// EMPTY FORM
// ============================================================================

const getEmptyForm = (date = '') => ({
    name: '',
    date,
    description: '',
    is_active: true,
})


// ============================================================================
// HOLIDAY MODAL
// ============================================================================

function HolidayModal({
    open = false,
    holiday = null,
    selectedDate = '',
    onClose,
    onSave,
    onDelete,
    saving = false,
    deleting = false,
    error = '',
}) {

    // =========================================================================
    // FORM STATE
    // =========================================================================

    const [
        form,
        setForm,
    ] = useState(
        getEmptyForm(selectedDate)
    )


    const [
        validationError,
        setValidationError,
    ] = useState('')


    const isEditing = Boolean(
        holiday?.id
    )


    const isBusy =
        saving || deleting


    // =========================================================================
    // INITIALIZE FORM WHEN MODAL OPENS
    // =========================================================================

    useEffect(() => {
        if (!open) {
            return
        }

        setForm(
            holiday
                ? {
                    name: holiday.name || '',
                    date: String(
                        holiday.date || ''
                    ).slice(0, 10),
                    description:
                        holiday.description || '',
                    is_active:
                        holiday.is_active !== false,
                }
                : getEmptyForm(selectedDate)
        )

        setValidationError('')
    }, [
        open,
        holiday,
        selectedDate,
    ])


    // =========================================================================
    // CLOSE ON ESCAPE
    // =========================================================================

    useEffect(() => {
        if (!open) {
            return
        }

        const handleKeyDown = (event) => {
            if (
                event.key === 'Escape' &&
                !saving &&
                !deleting
            ) {
                onClose?.()
            }
        }

        window.addEventListener(
            'keydown',
            handleKeyDown
        )

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown
            )
        }
    }, [
        open,
        saving,
        deleting,
        onClose,
    ])


    // =========================================================================
    // FORM FIELD CHANGE
    // =========================================================================

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target

        setForm((current) => ({
            ...current,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }))

        setValidationError('')
    }


    // =========================================================================
    // SAVE
    // =========================================================================

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (isBusy) {
            return
        }

        const name = form.name.trim()

        if (!name) {
            setValidationError(
                'Please enter a holiday name.'
            )
            return
        }

        if (!form.date) {
            setValidationError(
                'Please select a holiday date.'
            )
            return
        }

        if (name.length > 150) {
            setValidationError(
                'Holiday name cannot exceed 150 characters.'
            )
            return
        }

        if (
            typeof onSave !== 'function'
        ) {
            return
        }

        setValidationError('')

        await onSave({
            ...(isEditing
                ? { id: holiday.id }
                : {}),
            name,
            date: form.date,
            description:
                form.description.trim() || null,
            is_active: form.is_active,
        })
    }


    // =========================================================================
    // DELETE
    // =========================================================================

    const handleDelete = async () => {
        if (
            !isEditing ||
            isBusy ||
            typeof onDelete !== 'function'
        ) {
            return
        }

        const confirmed = window.confirm(
            `Deactivate "${holiday.name}"? It will no longer appear as an active holiday.`
        )

        if (!confirmed) {
            return
        }

        await onDelete(holiday.id)
    }


    // =========================================================================
    // MODAL VISIBILITY
    // =========================================================================

    if (!open) {
        return null
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/40
                p-3
                backdrop-blur-[2px]
                sm:p-5
            "
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isBusy
                ) {
                    onClose?.()
                }
            }}
        >

            {/* ================================================================
                MODAL PANEL
            ================================================================ */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="holiday-modal-title"
                className="
                    my-auto
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-100
                    shadow-2xl
                "
            >

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    border-b
                    border-base-300
                    px-5
                    py-4
                    sm:px-6
                    sm:py-5
                ">

                    <div className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#8BCF00]/10
                            text-[#6FA800]
                        ">
                            <CalendarDaysIcon className="
                                h-5
                                w-5
                            " />
                        </div>


                        <div className="min-w-0">

                            <h2
                                id="holiday-modal-title"
                                className="
                                    text-lg
                                    font-semibold
                                    text-base-content
                                "
                            >
                                {isEditing
                                    ? 'Edit Holiday'
                                    : 'Add Holiday'}
                            </h2>


                            <p className="
                                mt-1
                                text-xs
                                leading-5
                                text-base-content/50
                            ">
                                {isEditing
                                    ? 'Update the holiday details below.'
                                    : 'Add a holiday to your calendar.'}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isBusy}
                        className="
                            inline-flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-base-content/50
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                            disabled:opacity-40
                        "
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="
                            h-5
                            w-5
                        " />
                    </button>

                </div>


                {/* ============================================================
                    FORM
                ============================================================ */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        space-y-5
                        px-5
                        py-5
                        sm:px-6
                    ">

                        {/* ====================================================
                            API ERROR
                        ==================================================== */}

                        {(error || validationError) && (
                            <div
                                role="alert"
                                className="
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-3
                                    py-2.5
                                    text-xs
                                    leading-5
                                    text-red-600
                                "
                            >
                                {validationError || error}
                            </div>
                        )}


                        {/* ====================================================
                            HOLIDAY NAME
                        ==================================================== */}

                        <div>

                            <label
                                htmlFor="holiday-name"
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                "
                            >
                                Holiday Name
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>


                            <input
                                id="holiday-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Independence Day"
                                maxLength={150}
                                required
                                disabled={isBusy}
                                autoFocus
                                className="
                                    input
                                    input-bordered
                                    h-11
                                    min-h-11
                                    w-full
                                    text-sm
                                    focus:border-[#8BCF00]
                                    focus:outline-none
                                "
                            />

                            <p className="
                                mt-1
                                text-right
                                text-[10px]
                                text-base-content/40
                            ">
                                {form.name.length}/150
                            </p>

                        </div>


                        {/* ====================================================
                            HOLIDAY DATE
                        ==================================================== */}

                        <div>

                            <label
                                htmlFor="holiday-date"
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                "
                            >
                                Date
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>


                            <input
                                id="holiday-date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                disabled={isBusy}
                                className="
                                    input
                                    input-bordered
                                    h-11
                                    min-h-11
                                    w-full
                                    text-sm
                                    focus:border-[#8BCF00]
                                    focus:outline-none
                                "
                            />

                        </div>


                        {/* ====================================================
                            DESCRIPTION
                        ==================================================== */}

                        <div>

                            <label
                                htmlFor="holiday-description"
                                className="
                                    mb-1.5
                                    block
                                    text-xs
                                    font-semibold
                                    text-base-content/70
                                "
                            >
                                Description
                                <span className="
                                    ml-1
                                    font-normal
                                    text-base-content/40
                                ">
                                    (Optional)
                                </span>
                            </label>


                            <textarea
                                id="holiday-description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Add any additional details..."
                                rows={3}
                                disabled={isBusy}
                                className="
                                    textarea
                                    textarea-bordered
                                    min-h-[90px]
                                    w-full
                                    resize-y
                                    text-sm
                                    focus:border-[#8BCF00]
                                    focus:outline-none
                                "
                            />

                        </div>


                        {/* ====================================================
                            ACTIVE STATUS
                        ==================================================== */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-xl
                            border
                            border-base-300
                            bg-base-200/30
                            p-3.5
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    font-semibold
                                    text-base-content
                                ">
                                    Active Holiday
                                </p>


                                <p className="
                                    mt-1
                                    text-[11px]
                                    leading-4
                                    text-base-content/50
                                ">
                                    Inactive holidays remain saved but are excluded from active holiday listings.
                                </p>

                            </div>


                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                disabled={isBusy}
                                className="
                                    toggle
                                    toggle-success
                                    shrink-0
                                "
                                aria-label="Active holiday"
                            />

                        </div>

                    </div>


                    {/* ========================================================
                        FOOTER ACTIONS
                    ======================================================== */}

                    <div className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-base-300
                        bg-base-200/20
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-6
                    ">

                        {/* ====================================================
                            DELETE / DEACTIVATE
                        ==================================================== */}

                        <div>

                            {isEditing &&
                                holiday.is_active !== false && (

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isBusy}
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        px-3
                                        text-xs
                                        font-medium
                                        text-red-600
                                        transition
                                        hover:bg-red-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {deleting ? (
                                        <span className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-red-200
                                            border-t-red-600
                                        " />
                                    ) : (
                                        <TrashIcon className="
                                            h-4
                                            w-4
                                        " />
                                    )}

                                    Deactivate

                                </button>

                            )}

                        </div>


                        {/* ====================================================
                            CANCEL AND SAVE
                        ==================================================== */}

                        <div className="
                            flex
                            items-center
                            justify-end
                            gap-2
                        ">

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isBusy}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-100
                                    px-4
                                    text-xs
                                    font-medium
                                    text-base-content/70
                                    transition
                                    hover:bg-base-200
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={isBusy}
                                className="
                                    inline-flex
                                    h-10
                                    min-w-[110px]
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    bg-[#8BCF00]
                                    px-4
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-[#78B300]
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#8BCF00]/30
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {saving && (
                                    <span className="
                                        h-4
                                        w-4
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-white/40
                                        border-t-white
                                    " />
                                )}

                                {saving
                                    ? 'Saving...'
                                    : isEditing
                                        ? 'Save Changes'
                                        : 'Add Holiday'}

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    )
}


export default HolidayModal
