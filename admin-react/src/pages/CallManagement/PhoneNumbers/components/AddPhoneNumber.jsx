import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'


function AddPhoneNumber({
    open,
    phoneNumber = null,
    EmployeeDropdown,
    onClose,
    onSubmit,
}) {

    const [formData, setFormData] = useState({
        number: '',
        employeeId: '',
        trackable: false,
        status: 'Active',
    })

    const [error, setError] = useState('')

    const [saving, setSaving] = useState(false)

    const isEditMode =
        Boolean(phoneNumber)


    // =========================================================
    // INITIALIZE FORM
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }

        if (phoneNumber) {

            setFormData({

                number:
                    phoneNumber.number ||
                    phoneNumber.phone ||
                    '',

                employeeId:
                    phoneNumber.employeeId !==
                        null &&
                    phoneNumber.employeeId !==
                        undefined
                        ? String(
                            phoneNumber.employeeId
                        )
                        : '',

                trackable:
                    phoneNumber.trackable === true ||
                    phoneNumber.trackable === 'Yes',

                status:
                    phoneNumber.status ||
                    'Active',

            })

        } else {

            setFormData({

                number: '',

                employeeId: '',

                trackable: false,

                status: 'Active',

            })

        }

        setError('')

    }, [
        open,
        phoneNumber,
    ])


    // =========================================================
    // LOCK BACKGROUND
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }

        const originalOverflow =
            document.body.style.overflow

        document.body.style.overflow =
            'hidden'

        return () => {

            document.body.style.overflow =
                originalOverflow

        }

    }, [open])


    // =========================================================
    // CHANGE
    // =========================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        )

        setError('')

    }


    // =========================================================
    // EMPLOYEE CHANGE
    // =========================================================

    const handleEmployeeChange = (
        value
    ) => {

        setFormData(
            (previous) => ({
                ...previous,

                employeeId:
                    value,
            })
        )

        setError('')

    }


    // =========================================================
    // TRACKABLE
    // =========================================================

    const handleTrackableChange = (
        event
    ) => {

        setFormData(
            (previous) => ({
                ...previous,

                trackable:
                    event.target.value ===
                    'Yes',
            })
        )

        setError('')

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault()

        const number =
            formData.number.trim()

        if (!number) {

            setError(
                'Phone number is required.'
            )

            return

        }

        if (
            !/^[0-9]{10}$/.test(
                number
            )
        ) {

            setError(
                'Please enter a valid 10-digit phone number.'
            )

            return

        }

        if (
            !formData.employeeId
        ) {

            setError(
                'Please select an employee.'
            )

            return

        }

        try {

            setSaving(true)

            setError('')

            await onSubmit?.({

                number,

                employeeId:
                    formData.employeeId,

                trackable:
                    formData.trackable,

                status:
                    formData.status,

            })

        } catch (error) {

            console.error(
                'Failed to submit phone number:',
                error
            )

            setError(
                error?.response?.data?.detail ||
                error?.message ||
                'Failed to save phone number.'
            )

        } finally {

            setSaving(false)

        }

    }


    if (!open) {
        return null
    }


    return createPortal(

        <>

            {/* =================================================
                BACKDROP
            ================================================= */}

            <div
                className="
                    fixed
                    inset-0
                    z-[9999]
                    bg-black/30
                "
                aria-hidden="true"
            >

                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        cursor-default
                        bg-transparent
                    "
                />

            </div>


            {/* =================================================
                DRAWER
            ================================================= */}

            <aside
                className="
                    fixed
                    inset-y-0
                    right-0
                    z-[10000]
                    flex
                    h-screen
                    w-full
                    max-w-[520px]
                    flex-col
                    overflow-hidden
                    border-l
                    border-base-300
                    bg-base-100
                    shadow-2xl
                "
                role="dialog"
                aria-modal="true"
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
                    min-h-[88px]
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-base-300
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
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
                        ">

                            <PhoneIcon className="
                                h-5
                                w-5
                                text-[#78B300]
                            " />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">

                                {isEditMode
                                    ? 'Edit Phone Number'
                                    : 'Add Phone Number'
                                }

                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">

                                {isEditMode
                                    ? 'Update the phone number assignment details.'
                                    : 'Add a phone number and assign an employee.'
                                }

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                        "
                    >

                        <XMarkIcon className="
                            h-5
                            w-5
                        " />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                    "
                >

                    <div className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-5
                    ">

                        <div className="
                            space-y-5
                        ">

                            {/* PHONE */}

                            <div>

                                <label
                                    htmlFor="phone-number"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="phone-number"
                                    type="tel"
                                    name="number"
                                    value={
                                        formData.number
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="10-digit phone number"
                                    maxLength={10}
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    className="
                                        input
                                        input-bordered
                                        h-12
                                        w-full
                                    "
                                    autoFocus
                                />

                            </div>


                            {/* EMPLOYEE */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                ">
                                    Employee
                                </label>

                                {EmployeeDropdown ? (

                                    <EmployeeDropdown
                                        value={
                                            formData.employeeId
                                        }
                                        onChange={
                                            handleEmployeeChange
                                        }
                                        showLabel={false}
                                        className="w-full"
                                    />

                                ) : (

                                    <p className="
                                        text-xs
                                        text-error
                                    ">
                                        Employee selector is unavailable.
                                    </p>

                                )}

                            </div>


                            {/* TEAM */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                ">
                                    Team
                                </label>

                                <div className="
                                    flex
                                    min-h-12
                                    items-center
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-200/40
                                    px-3
                                ">

                                    <span className="
                                        text-sm
                                        text-base-content/60
                                    ">
                                        Team is assigned automatically.
                                    </span>

                                </div>

                            </div>


                            {/* TRACKABLE */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                ">
                                    Trackable
                                </label>

                                <select
                                    value={
                                        formData.trackable
                                            ? 'Yes'
                                            : 'No'
                                    }
                                    onChange={
                                        handleTrackableChange
                                    }
                                    className="
                                        select
                                        select-bordered
                                        h-12
                                        w-full
                                    "
                                >

                                    <option value="Yes">
                                        Yes
                                    </option>

                                    <option value="No">
                                        No
                                    </option>

                                </select>

                            </div>


                            {/* STATUS */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                ">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        select
                                        select-bordered
                                        h-12
                                        w-full
                                    "
                                >

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div className="
                                    rounded-lg
                                    border
                                    border-error/20
                                    bg-error/5
                                    px-3
                                    py-3
                                ">

                                    <p className="
                                        text-xs
                                        text-error
                                    ">
                                        {error}
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="
                        flex
                        shrink-0
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        px-5
                        py-4
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                btn
                                btn-sm
                                min-w-32
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                            "
                        >

                            {saving
                                ? 'Saving...'
                                : isEditMode
                                    ? 'Update Number'
                                    : 'Add Number'
                            }

                        </button>

                    </div>

                </form>

            </aside>

        </>,

        document.body

    )

}


export default AddPhoneNumber