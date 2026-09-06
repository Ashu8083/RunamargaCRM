// admin-react\src\pages\Roles&Teams\TeamLead\components\TeamLeadModal.jsx
import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'

import {
    getTeamLeadRoles,
} from '../API'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'


function TeamLeadModal({
    open,
    teamLead,
    employees = [],
    onClose,
    onSubmit,
}) {

    const isEdit = Boolean(teamLead)


    const [formData, setFormData] = useState({
        employeeId: '',
        roleId: '',
        status: 'Active',
    })


    const [employeeOptions, setEmployeeOptions] =
        useState([])

    const [error, setError] =
        useState('')

    const [roles, setRoles] =
        useState([])

    const [rolesLoading, setRolesLoading] =
        useState(false)


    // ========================================================================
    // EMPLOYEE OPTIONS
    // ========================================================================

    const handleEmployeesLoaded = useCallback(
        (loadedEmployees) => {
            setEmployeeOptions(
                Array.isArray(loadedEmployees)
                    ? loadedEmployees
                    : []
            )
        },
        []
    )


    // ========================================================================
    // LOAD FORM + ROLES
    // ========================================================================

    useEffect(() => {

        if (!open) {

            setFormData({
                employeeId: '',
                roleId: '',
                status: 'Active',
            })

            setEmployeeOptions([])
            setRoles([])
            setError('')
            setRolesLoading(false)

            return
        }


        let isMounted = true


        const loadRoles = async () => {

            setRolesLoading(true)

            try {

                const data =
                    await getTeamLeadRoles()

                const formattedRoles =
                    Array.isArray(data)
                        ? data
                            .filter(
                                (role) =>
                                    role &&
                                    role.value !== undefined &&
                                    role.value !== null &&
                                    role.name
                            )
                            .map((role) => ({
                                name: role.name,
                                value: role.value,
                            }))
                        : []

                if (isMounted) {
                    setRoles(formattedRoles)
                }

            } catch (error) {

                console.error(
                    'Failed to load team lead roles:',
                    error
                )

                if (isMounted) {
                    setRoles([])
                }

            } finally {

                if (isMounted) {
                    setRolesLoading(false)
                }

            }
        }


        loadRoles()


        if (teamLead) {

            const employeeId =
                teamLead.employeeId ??
                teamLead.employee_id ??
                teamLead.employee?.id ??
                ''

            const roleId =
                teamLead.roleId ??
                teamLead.contextId ??
                teamLead.context_id ??
                teamLead.role?.value ??
                teamLead.role?.id ??
                ''

            setFormData({
                employeeId:
                    employeeId !== null &&
                    employeeId !== undefined
                        ? String(employeeId)
                        : '',

                roleId:
                    roleId !== null &&
                    roleId !== undefined
                        ? String(roleId)
                        : '',

                status:
                    teamLead.status === 'Inactive'
                        ? 'Inactive'
                        : 'Active',
            })

        } else {

            setFormData({
                employeeId: '',
                roleId: '',
                status: 'Active',
            })

        }


        setError('')


        return () => {
            isMounted = false
        }

    }, [open, teamLead])


    // ========================================================================
    // EMPLOYEE CHANGE
    // ========================================================================

    const handleEmployeeChange = useCallback(
        (selectedValue) => {

            if (isEdit) {
                return
            }

            setFormData((previous) => ({
                ...previous,
                employeeId:
                    selectedValue === undefined ||
                    selectedValue === null ||
                    selectedValue === ''
                        ? ''
                        : String(selectedValue),
            }))

            setError('')
        },
        [isEdit]
    )


    // ========================================================================
    // ROLE CHANGE
    // ========================================================================

    const handleRoleChange = (event) => {

        setFormData((previous) => ({
            ...previous,
            roleId: event.target.value,
        }))

        setError('')
    }


    // ========================================================================
    // STATUS CHANGE
    // ========================================================================

    const handleStatusChange = (event) => {

        setFormData((previous) => ({
            ...previous,
            status: event.target.value,
        }))

        setError('')
    }


    // ========================================================================
    // SUBMIT
    // ========================================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        if (!formData.employeeId) {

            setError('Please select an employee.')
            return
        }


        if (!formData.roleId) {

            setError('Please select a role.')
            return
        }


        const selectedEmployee =
            employeeOptions.find(
                (employee) =>
                    String(employee.id) ===
                    String(formData.employeeId)
            ) ||
            teamLead?.employee ||
            employees.find(
                (employee) =>
                    String(employee.id) ===
                    String(formData.employeeId)
            ) ||
            null


        if (!selectedEmployee) {

            setError(
                'Selected employee could not be found.'
            )

            return
        }


        const employeeId =
            Number(selectedEmployee.id)


        if (
            !Number.isFinite(employeeId) ||
            employeeId <= 0
        ) {

            setError('Invalid employee ID.')
            return
        }


        const selectedRole =
            roles.find(
                (role) =>
                    String(role.value) ===
                    String(formData.roleId)
            )


        if (!selectedRole) {

            setError(
                'Selected role could not be found.'
            )

            return
        }


        onSubmit?.({

            employeeId,

            employee: selectedEmployee,

            roleId:
                Number(selectedRole.value),

            role:
                selectedRole,

            status:
                isEdit
                    ? teamLead.status
                    : formData.status,

            isEdit,

            teamLeadId:
                teamLead?.id || null,

        })

    }


    if (!open) {
        return null
    }


    const selectedEmployee =
        employeeOptions.find(
            (employee) =>
                String(employee.id) ===
                String(formData.employeeId)
        ) ||
        teamLead?.employee ||
        employees.find(
            (employee) =>
                String(employee.id) ===
                String(formData.employeeId)
        ) ||
        null


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

                {/* HEADER */}

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
                                {isEdit
                                    ? 'Edit Team Lead'
                                    : 'Add Team Lead'
                                }
                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                {isEdit
                                    ? 'Change the team lead role.'
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


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        space-y-5
                        p-5
                    ">

                        {/* EMPLOYEE */}

                        <EmployeeDropdown
                            value={formData.employeeId}
                            onChange={handleEmployeeChange}
                            onOptionsLoaded={
                                handleEmployeesLoaded
                            }
                            label="Employee"
                            placeholder="Select Employee"
                            disabled={isEdit}
                            required
                            error={
                                !formData.employeeId
                                    ? error
                                    : ''
                            }
                        />


                        {isEdit && (

                            <p className="
                                -mt-3
                                text-xs
                                text-base-content/45
                            ">
                                Employee cannot be changed after
                                the team lead is created.
                            </p>

                        )}


                        {/* EMPLOYEE DETAILS */}

                        {formData.employeeId &&
                            selectedEmployee && (

                                <div className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-200/30
                                    p-4
                                ">

                                    <p className="
                                        text-sm
                                        font-semibold
                                    ">
                                        {selectedEmployee.name}
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
                                                {selectedEmployee.employeeId ||
                                                    selectedEmployee.id ||
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
                                                {selectedEmployee.phone ||
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
                                                {selectedEmployee.email ||
                                                    'N/A'
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                        {/* ROLE */}

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
                                onChange={handleRoleChange}
                                disabled={rolesLoading}
                                className="
                                    select
                                    select-bordered
                                    w-full
                                    focus:border-[#8BCF00]
                                "
                            >

                                <option value="">
                                    {rolesLoading
                                        ? 'Loading roles...'
                                        : 'Select Role'
                                    }
                                </option>


                                {roles.map((role) => (

                                    <option
                                        key={role.value}
                                        value={role.value}
                                    >
                                        {role.name}
                                    </option>

                                ))}

                            </select>


                            {!formData.roleId &&
                                error && (

                                    <p className="
                                        mt-1
                                        text-xs
                                        text-error
                                    ">
                                        {error}
                                    </p>

                                )}

                        </div>


                        {/* STATUS - CREATE ONLY */}

                        {!isEdit && (

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
                                    onChange={handleStatusChange}
                                    className="
                                        select
                                        select-bordered
                                        w-full
                                        focus:border-[#8BCF00]
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

                        )}

                    </div>


                    {/* FOOTER */}

                    <div className="
                        flex
                        justify-end
                        gap-2
                        border-t
                        border-base-300
                        p-5
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                btn
                                btn-ghost
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="
                                btn
                                border-[#8BCF00]
                                bg-[#8BCF00]
                                text-white
                                hover:border-[#6FA800]
                                hover:bg-[#6FA800]
                            "
                        >
                            {isEdit
                                ? 'Update Team Lead'
                                : 'Create Team Lead'
                            }
                        </button>

                    </div>

                </form>

            </div>

        </dialog>

    )
}


export default TeamLeadModal