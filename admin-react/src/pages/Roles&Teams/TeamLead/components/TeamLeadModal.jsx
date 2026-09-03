// admin-react/src/pages/Role-management/TeamLead/components/TeamLeadModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import { getRoles } from '../../../../../src/services/commonservice'


function TeamLeadModal({
    open,
    teamLead,
    employees = [],
    assignedEmployeeIds = [],
    onClose,
    onSubmit,
}) {
    const [formData, setFormData] = useState({
        employeeId: '',
        roleId: '',
        status: 'Active',
    })

    const [error, setError] = useState('')

    const [roles, setRoles] = useState([])


    // =========================================================
    // LOAD FORM
    // =========================================================

    useEffect(() => {

        if (!open) {

            setFormData({
                employeeId: '',
                roleId: '',
                status: 'Active',
            })

            setError('')

            return
        }
        const loadRoles = async () => {
            try {
                const data = await getRoles()
                setRoles(data)
            } catch (error) {
                console.error('Failed to load roles:', error)
                setRoles([])
            }
        }

        loadRoles()


        if (teamLead) {

            setFormData({
                employeeId: String(
                    teamLead.employeeId || teamLead.id || ''
                ),

                status: teamLead.status || 'Active',
            })

        } else {

            setFormData({
                employeeId: '',
                roleId: '',
                status: 'Active',
            })

        }


        setError('')

    }, [open, teamLead])


    // =========================================================
    // CHANGE
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
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        const employeeId =
            formData.employeeId


        if (!employeeId) {

            setError(
                'Please select an employee.'
            )

            return
        }


        const selectedEmployee =
            employees.find(
                (employee) =>
                    String(employee.id) ===
                    String(employeeId)
            )


        if (!selectedEmployee) {

            setError(
                'Selected employee could not be found.'
            )

            return
        }


        onSubmit?.({

            employeeId:
                selectedEmployee.id,

            employee:
                selectedEmployee,
            roleId:
                formData.roleId,
            status:
                formData.status,

        })

    }


    if (!open) {
        return null
    }


    // =========================================================
    // AVAILABLE EMPLOYEES
    // =========================================================

    const availableEmployees =
        employees.filter((employee) => {

            /*
             * While editing, the currently selected employee
             * must remain available in the dropdown.
             */

            if (
                teamLead &&
                String(employee.id) ===
                String(teamLead.employeeId)
            ) {
                return true
            }


            return !assignedEmployeeIds.some(
                (id) =>
                    String(id) ===
                    String(employee.id)
            )

        })


    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div className="
                modal-box
                w-11/12
                max-w-lg
                border
                border-base-300
                bg-base-100
                p-0
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
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#8BCF00]/10
                        ">

                            <UserGroupIcon className="
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
                                {teamLead
                                    ? 'Team Lead Details'
                                    : 'Add Team Lead'
                                }
                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                {teamLead
                                    ? 'Update the team lead status.'
                                    : 'Select an existing employee as a team lead.'
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

                <form onSubmit={handleSubmit}>

                    <div className="
                        space-y-5
                        p-5
                    ">

                        {/* =============================================
                            EMPLOYEE
                        ============================================= */}

                        <div>

                            <label className="
                                label
                                px-0
                            ">

                                <span className="
                                    label-text
                                    text-sm
                                    font-medium
                                ">
                                    Employee
                                </span>

                            </label>


                            <select
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                disabled={Boolean(teamLead)}
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-70
                                "
                            >

                                <option value="">
                                    Select employee
                                </option>


                                {availableEmployees.map(
                                    (employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.name}
                                            {employee.employeeId
                                                ? ` (${employee.employeeId})`
                                                : ''
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            {teamLead && (

                                <p className="
                                    mt-1.5
                                    text-xs
                                    text-base-content/45
                                ">
                                    Employee cannot be changed after
                                    the team lead is created.
                                </p>

                            )}


                            {!teamLead &&
                                availableEmployees.length === 0 && (

                                    <p className="
                                        mt-1.5
                                        text-xs
                                        text-warning
                                    ">
                                        No employees are available
                                        to assign as a team lead.
                                    </p>

                                )}

                        </div>


                        {/* =============================================
                            SELECTED EMPLOYEE DETAILS
                        ============================================= */}

                        {formData.employeeId && (

                            <div className="
                                rounded-lg
                                border
                                border-base-300
                                bg-base-200/30
                                p-4
                            ">

                                {(() => {

                                    const employee =
                                        employees.find(
                                            (item) =>
                                                String(item.id) ===
                                                String(
                                                    formData.employeeId
                                                )
                                        )


                                    if (!employee) {
                                        return null
                                    }


                                    return (

                                        <div>

                                            <p className="
                                                text-sm
                                                font-semibold
                                            ">
                                                {employee.name}
                                            </p>


                                            <div className="
                                                mt-2
                                                grid
                                                grid-cols-1
                                                gap-2
                                                sm:grid-cols-2
                                            ">

                                                <div>

                                                    <span className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-wide
                                                        text-base-content/40
                                                    ">
                                                        Employee ID
                                                    </span>

                                                    <p className="
                                                        mt-0.5
                                                        text-xs
                                                    ">
                                                        {employee.employeeId ||
                                                            employee.id ||
                                                            'N/A'
                                                        }
                                                    </p>

                                                </div>


                                                <div>

                                                    <span className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-wide
                                                        text-base-content/40
                                                    ">
                                                        Phone
                                                    </span>

                                                    <p className="
                                                        mt-0.5
                                                        text-xs
                                                    ">
                                                        {employee.phone ||
                                                            'N/A'
                                                        }
                                                    </p>

                                                </div>


                                                <div className="
                                                    sm:col-span-2
                                                ">

                                                    <span className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-wide
                                                        text-base-content/40
                                                    ">
                                                        Email
                                                    </span>

                                                    <p className="
                                                        mt-0.5
                                                        text-xs
                                                    ">
                                                        {employee.email ||
                                                            'N/A'
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )

                                })()}

                            </div>

                        )}
                        {/* =================================================
                                ROLE
                            ================================================= */}

                        <div>

                            <label className="
                                label
                                px-0
                            ">

                                <span className="
                                    label-text
                                    text-sm
                                    font-medium
                                ">
                                    Role
                                </span>

                            </label>


                            <select
                                name="roleId"
                                value={formData.roleId}
                                onChange={(event) => {
                                    setFormData((previous) => ({
                                        ...previous,
                                        roleId: event.target.value,
                                    }))

                                    setError('')
                                }}
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                    focus:outline-[#8BCF00]
                                "
                            >

                                <option value="">
                                    Select Role
                                </option>

                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.id}
                                    >
                                        {role.name}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* =============================================
                            STATUS
                        ============================================= */}

                        <div>

                            <label className="
                                label
                                px-0
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
                                value={formData.status}
                                onChange={handleChange}
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


                        {/* =============================================
                            ERROR
                        ============================================= */}

                        {error && (

                            <div className="
                                rounded-lg
                                border
                                border-error/20
                                bg-error/5
                                px-3
                                py-2
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
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        p-4
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
                            {teamLead
                                ? 'Save Status'
                                : 'Add Team Lead'
                            }
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


export default TeamLeadModal