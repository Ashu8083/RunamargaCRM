// admin-react/src/pages/CallManagement/PhoneNumbers/components/AddPhoneNumber.jsx

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import PhoneIcon from '@heroicons/react/24/outline/PhoneIcon'


function AddPhoneNumber({
    open,
    phoneNumber = null,
    employees = [],
    EmployeeDropdown,
    onClose,
    onSubmit,
}) {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        number: '',
        employeeId: '',
        trackable: false,
        status: 'Active',
    })


    const [error, setError] = useState('')


    // =========================================================
    // MODE
    // =========================================================

    const isEditMode =
        Boolean(phoneNumber)


    // =========================================================
    // INITIALIZE FORM
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        // -----------------------------------------------------
        // EDIT MODE
        // -----------------------------------------------------

        if (phoneNumber) {

            setFormData({

                number:
                    phoneNumber.number ||
                    phoneNumber.phone ||
                    '',

                employeeId:
                    phoneNumber.employeeId !== null &&
                    phoneNumber.employeeId !== undefined
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

        }

        // -----------------------------------------------------
        // ADD MODE
        // -----------------------------------------------------

        else {

            setFormData({

                number: '',

                employeeId: '',

                trackable: false,

                status: 'Active',

            })

        }


        setError('')

    }, [open, phoneNumber])


    // =========================================================
    // LOCK BACKGROUND SCROLL WHEN DRAWER IS OPEN
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        const originalOverflow =
            document.body.style.overflow


        document.body.style.overflow = 'hidden'


        return () => {

            document.body.style.overflow =
                originalOverflow

        }

    }, [open])


    // =========================================================
    // SELECTED EMPLOYEE
    // =========================================================

    const selectedEmployee =
        employees.find(
            (employee) =>
                String(employee.id) ===
                String(formData.employeeId)
        )


    // =========================================================
    // NORMAL FIELD CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target


        setFormData((previous) => ({

            ...previous,

            [name]: value,

        }))


        setError('')

    }


    // =========================================================
    // EMPLOYEE CHANGE
    // =========================================================

    const handleEmployeeChange = (value) => {

        setFormData((previous) => ({

            ...previous,

            employeeId:
                value,

        }))


        setError('')

    }


    // =========================================================
    // TRACKABLE CHANGE
    // =========================================================

    const handleTrackableChange = (event) => {

        setFormData((previous) => ({

            ...previous,

            trackable:
                event.target.value === 'Yes',

        }))


        setError('')

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        const number =
            formData.number.trim()


        // -----------------------------------------------------
        // PHONE VALIDATION
        // -----------------------------------------------------

        if (!number) {

            setError(
                'Phone number is required.'
            )

            return

        }


        if (!/^[0-9]{10}$/.test(number)) {

            setError(
                'Please enter a valid 10-digit phone number.'
            )

            return

        }


        // -----------------------------------------------------
        // EMPLOYEE VALIDATION
        // -----------------------------------------------------

        if (!formData.employeeId) {

            setError(
                'Please select an employee.'
            )

            return

        }


        // -----------------------------------------------------
        // SUBMIT
        // -----------------------------------------------------

        onSubmit?.({

            number,

            employeeId:
                formData.employeeId,

            employeeName:
                selectedEmployee?.name ||
                '',

            teamId:
                selectedEmployee?.teamId ||
                null,

            teamName:
                selectedEmployee?.teamName ||
                '',

            trackable:
                formData.trackable,

            status:
                formData.status,

        })

    }


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // DRAWER
    //
    // IMPORTANT:
    //
    // The entire drawer is rendered into document.body
    // using createPortal().
    //
    // This prevents parent layout CSS from affecting
    // position: fixed.
    // =========================================================

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
                aria-labelledby="add-phone-number-title"
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
                    bg-base-100
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    ">

                        {/* =================================================
                            ICON
                        ================================================= */}

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


                        {/* =================================================
                            TITLE
                        ================================================= */}

                        <div className="
                            min-w-0
                        ">

                            <h3
                                id="add-phone-number-title"
                                className="
                                    text-lg
                                    font-semibold
                                    leading-tight
                                    text-base-content
                                "
                            >

                                {isEditMode
                                    ? 'Edit Phone Number'
                                    : 'Add Phone Number'
                                }

                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                leading-5
                                text-base-content/50
                            ">

                                {isEditMode
                                    ? 'Update the phone number assignment details.'
                                    : 'Add a phone number and assign an employee.'
                                }

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        CLOSE BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                            ml-3
                            shrink-0
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

                    {/* =================================================
                        CONTENT
                    ================================================= */}

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


                            {/* =================================================
                                PHONE NUMBER
                            ================================================= */}

                            <div>

                                <label
                                    htmlFor="phone-number"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-base-content
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
                                        bg-base-100
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
                                    "
                                    autoFocus
                                />

                            </div>


                            {/* =================================================
                                EMPLOYEE
                            ================================================= */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-base-content
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
                                        options={
                                            employees
                                        }
                                        showLabel={false}
                                        className="w-full"
                                    />

                                ) : (

                                    <div className="
                                        rounded-lg
                                        border
                                        border-error/30
                                        bg-error/5
                                        px-3
                                        py-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-error
                                        ">
                                            Employee selector is unavailable.
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                TEAM
                            ================================================= */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-base-content
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
                                        text-base-content/70
                                    ">

                                        {selectedEmployee?.teamName ||
                                            'Team will be assigned automatically'
                                        }

                                    </span>

                                </div>

                            </div>


                            {/* =================================================
                                TRACKABLE
                            ================================================= */}

                            <div>

                                <label
                                    htmlFor="phone-trackable"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-base-content
                                    "
                                >
                                    Trackable
                                </label>


                                <select
                                    id="phone-trackable"
                                    name="trackable"
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
                                        bg-base-100
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
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


                            {/* =================================================
                                STATUS
                            ================================================= */}

                            <div>

                                <label
                                    htmlFor="phone-status"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-base-content
                                    "
                                >
                                    Status
                                </label>


                                <select
                                    id="phone-status"
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
                                        bg-base-100
                                        focus:border-[#8BCF00]
                                        focus:outline-[#8BCF00]
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


                            {/* =================================================
                                ERROR
                            ================================================= */}

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
                                        leading-5
                                        text-error
                                    ">
                                        {error}
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        shrink-0
                        items-center
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        bg-base-100
                        px-5
                        py-4
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                btn
                                btn-sm
                                min-w-20
                                btn-ghost
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
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

                            {isEditMode
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