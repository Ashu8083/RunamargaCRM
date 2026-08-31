// admin-react/src/pages/Roles&Teams/Admins/components/AdminModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'


function AdminModal({
    open,
    admin = null,
    employees = [],
    onClose,
    onSubmit,
}) {

    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        employeeId: '',
        status: 'Active',
    })


    const [error, setError] = useState('')


    // =========================================================
    // MODE
    // =========================================================

    const isEditMode =
        Boolean(admin)


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
    // INITIALIZE FORM
    // =========================================================

    useEffect(() => {

        if (!open) {
            return
        }


        // -----------------------------------------------------
        // EDIT EXISTING ADMIN
        // -----------------------------------------------------

        if (admin) {

            setFormData({

                employeeId:
                    admin.employeeId !== null &&
                    admin.employeeId !== undefined
                        ? String(admin.employeeId)
                        : '',

                status:
                    admin.status ||
                    'Active',

            })

        }

        // -----------------------------------------------------
        // CREATE ADMIN
        // -----------------------------------------------------

        else {

            setFormData({

                employeeId: '',

                status: 'Active',

            })

        }


        setError('')

    }, [open, admin])


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
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (event) => {

        setFormData((previous) => ({

            ...previous,

            status:
                event.target.value,

        }))


        setError('')

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        // -----------------------------------------------------
        // CREATE VALIDATION
        // -----------------------------------------------------

        if (!isEditMode && !formData.employeeId) {

            setError(
                'Please select an employee.'
            )

            return

        }


        // -----------------------------------------------------
        // EDIT VALIDATION
        // -----------------------------------------------------

        if (isEditMode && !admin) {

            setError(
                'Unable to update admin.'
            )

            return

        }


        // -----------------------------------------------------
        // CREATE
        // -----------------------------------------------------

        if (!isEditMode) {

            if (!selectedEmployee) {

                setError(
                    'Selected employee could not be found.'
                )

                return

            }


            onSubmit?.({

                employeeId:
                    selectedEmployee.id,

                name:
                    selectedEmployee.name ||
                    '',

                phone:
                    selectedEmployee.phone ||
                    '',

                email:
                    selectedEmployee.email ||
                    '',

                status:
                    formData.status,

            })

            return

        }


        // -----------------------------------------------------
        // EDIT
        //
        // Only status is submitted.
        // Employee details cannot be changed.
        // -----------------------------------------------------

        onSubmit?.({

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
    // DISPLAY EMPLOYEE DATA
    // =========================================================

    const displayName =
        isEditMode
            ? admin?.name || 'N/A'
            : selectedEmployee?.name || 'Select an employee'


    const displayPhone =
        isEditMode
            ? admin?.phone || 'N/A'
            : selectedEmployee?.phone || 'N/A'


    const displayEmail =
        isEditMode
            ? admin?.email || 'N/A'
            : selectedEmployee?.email || 'N/A'


    // =========================================================
    // MODAL
    // =========================================================

    return (

        <div className="
            fixed
            inset-0
            z-[999]
        ">

            {/* =================================================
                BACKDROP
            ================================================= */}

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
                    bg-black/30
                "
            />


            {/* =================================================
                MODAL
            ================================================= */}

            <div className="
                absolute
                left-1/2
                top-1/2
                flex
                max-h-[90vh]
                w-[calc(100%-2rem)]
                max-w-lg
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-base-300
                bg-base-100
                shadow-2xl
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    flex
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

                        {/* Icon */}

                        <div className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#8BCF00]/10
                        ">

                            <ShieldCheckIcon className="
                                h-5
                                w-5
                                text-[#78B300]
                            " />

                        </div>


                        {/* Title */}

                        <div className="
                            min-w-0
                        ">

                            <h3 className="
                                text-lg
                                font-semibold
                                leading-tight
                            ">
                                {isEditMode
                                    ? 'Edit Admin'
                                    : 'Create Admin'
                                }
                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                {isEditMode
                                    ? 'Update the admin account status.'
                                    : 'Select an employee to create an admin account.'
                                }
                            </p>

                        </div>

                    </div>


                    {/* Close */}

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
                        space-y-5
                        overflow-y-auto
                        px-5
                        py-5
                    ">

                        {/* =================================================
                            EMPLOYEE
                        ================================================= */}

                        {!isEditMode && (

                            <div>

                                <label className="
                                    label
                                    px-0
                                    pb-2
                                ">

                                    <span className="
                                        label-text
                                        text-sm
                                        font-medium
                                    ">
                                        Employee
                                    </span>

                                </label>


                                <EmployeeDropdown
                                    value={
                                        formData.employeeId
                                    }
                                    onChange={
                                        handleEmployeeChange
                                    }
                                    employees={
                                        employees
                                    }
                                    allLabel="Select Employee"
                                    placeholder="Select Employee"
                                    searchPlaceholder="Search employee"
                                />

                            </div>

                        )}


                        {/* =================================================
                            EMPLOYEE DETAILS
                        ================================================= */}

                        <div>

                            <div className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            ">

                                <h4 className="
                                    text-sm
                                    font-semibold
                                ">
                                    Employee Details
                                </h4>


                                {!isEditMode && selectedEmployee && (

                                    <span className="
                                        rounded-full
                                        bg-[#8BCF00]/10
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                        text-[#78B300]
                                    ">
                                        Selected
                                    </span>

                                )}

                            </div>


                            <div className="
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                            ">

                                {/* =================================================
                                    NAME
                                ================================================= */}

                                <div className="
                                    border-b
                                    border-base-300
                                    px-4
                                    py-3
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Name
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-medium
                                    ">
                                        {displayName}
                                    </p>

                                </div>


                                {/* =================================================
                                    PHONE
                                ================================================= */}

                                <div className="
                                    border-b
                                    border-base-300
                                    px-4
                                    py-3
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Phone
                                    </p>


                                    <p className="
                                        mt-1
                                        text-sm
                                        font-medium
                                    ">
                                        {displayPhone}
                                    </p>

                                </div>


                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <div className="
                                    px-4
                                    py-3
                                ">

                                    <p className="
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Email
                                    </p>


                                    <p className="
                                        mt-1
                                        break-all
                                        text-sm
                                        font-medium
                                    ">
                                        {displayEmail}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div>

                            <label className="
                                label
                                px-0
                                pb-2
                            ">

                                <span className="
                                    label-text
                                    text-sm
                                    font-medium
                                ">
                                    Status
                                </span>

                            </label>


                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleStatusChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Absent">
                                    Absent
                                </option>

                                <option value="Deactivated">
                                    Deactivated
                                </option>

                            </select>

                        </div>


                        {/* =================================================
                            EDIT MODE INFORMATION
                        ================================================= */}

                        {isEditMode && (

                            <div className="
                                rounded-lg
                                border
                                border-base-300
                                bg-base-200/30
                                px-3
                                py-2.5
                            ">

                                <p className="
                                    text-xs
                                    text-base-content/60
                                ">
                                    Employee details cannot be changed from
                                    the admin screen. Only the account status
                                    can be updated.
                                </p>

                            </div>

                        )}


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
                                py-2.5
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


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        shrink-0
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
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                            "
                        >
                            {isEditMode
                                ? 'Update Status'
                                : 'Create Admin'
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    )

}


export default AdminModal