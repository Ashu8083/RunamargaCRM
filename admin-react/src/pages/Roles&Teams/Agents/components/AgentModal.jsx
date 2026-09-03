// admin-react/src/pages/Roles&Teams/Agents/components/AgentModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'

import AgentDropdown from '../../../../components/GlobalModels/Filters/AgentDropdown'

import { getRoles } from '../../../../../src/services/commonservice'
// =============================================================
// COMPONENT
// =============================================================

function AgentModal({
    open,
    agent,
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
    // INITIALIZE
    // =========================================================

    useEffect(() => {
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

        if (!open) {
            return
        }


        if (agent) {

            /*
             * Editing an existing agent:
             *
             * Only status can be changed.
             */

            setFormData({
                employeeId:
                    agent.employeeId ??
                    agent.id ??
                    '',

                roleId:
                    agent.roleId ??
                    '',

                status:
                    agent.status ||
                    'Active',
            })

        } else {

            /*
             * Creating an agent:
             *
             * Select an existing employee.
             */

            setFormData({
                employeeId: '',
                roleId: '',
                status: 'Active',
            })

        }


        setError('')

    }, [agent, open])


    // =========================================================
    // CLOSE
    // =========================================================

    if (!open) {
        return null
    }


    // =========================================================
    // CHANGE
    // =========================================================

    const handleEmployeeChange = (value) => {

        setFormData((previous) => ({
            ...previous,
            employeeId: value,
        }))

        setError('')

    }


    const handleStatusChange = (event) => {

        setFormData((previous) => ({
            ...previous,
            status: event.target.value,
        }))

        setError('')

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (event) => {

        event.preventDefault()


        if (!agent && !formData.employeeId) {

            setError(
                'Please select an employee.'
            )

            return
        }


        onSubmit?.({
            employeeId:
                formData.employeeId,

            roleId:
                formData.roleId,

            status:
                formData.status,
        })

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <dialog
            open
            className="
                modal
                modal-bottom
                sm:modal-middle
            "
        >

            <div
                className="
                    modal-box
                    w-11/12
                    max-w-lg
                    p-0
                    bg-base-100
                    border
                    border-base-300
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-5
                        border-b
                        border-base-300
                    "
                >

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div
                            className="
                                w-9
                                h-9
                                rounded-lg
                                bg-[#8BCF00]/10
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <UserIcon
                                className="
                                    w-5
                                    h-5
                                    text-[#78B300]
                                "
                            />

                        </div>


                        <div>

                            <h3 className="
                                text-lg
                                font-semibold
                            ">

                                {agent
                                    ? 'Edit Agent'
                                    : 'Add Agent'}

                            </h3>


                            <p className="
                                text-xs
                                text-base-content/50
                                mt-1
                            ">

                                {agent
                                    ? 'Update agent status.'
                                    : 'Select an existing employee as an agent.'}

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

                        <XMarkIcon
                            className="
                                w-5
                                h-5
                            "
                        />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="
                        p-5
                        space-y-5
                    ">

                        {/* =================================================
                            EMPLOYEE
                        ================================================= */}

                        {!agent && (

                            <div>

                                <AgentDropdown
                                    label="Employee"
                                    value={
                                        formData.employeeId
                                    }
                                    onChange={
                                        handleEmployeeChange
                                    }
                                    allLabel="Select Employee"
                                    placeholder="Select Employee"
                                    searchPlaceholder="Search employee"
                                    emptyMessage="No employees found"
                                />

                            </div>

                        )}


                        {/* =================================================
                            EXISTING AGENT
                        ================================================= */}

                        {agent && (

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-base-300
                                    bg-base-200/30
                                    px-4
                                    py-3
                                "
                            >

                                <p className="
                                    text-[10px]
                                    uppercase
                                    tracking-wide
                                    text-base-content/40
                                ">
                                    Employee
                                </p>


                                <p className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                ">
                                    {agent.name}
                                </p>


                                <p className="
                                    mt-0.5
                                    text-xs
                                    text-base-content/50
                                ">
                                    {agent.phone || 'N/A'}
                                    {' · '}
                                    {agent.email || 'N/A'}
                                </p>

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

                        {/* =================================================
                            STATUS
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
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-error/20
                                    bg-error/5
                                    px-3
                                    py-2
                                "
                            >

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

                    <div
                        className="
                            flex
                            justify-end
                            gap-2
                            p-4
                            border-t
                            border-base-300
                        "
                    >

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
                                hover:bg-[#6FA800]
                                hover:border-[#6FA800]
                            "
                        >

                            {agent
                                ? 'Update Status'
                                : 'Add Agent'}

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


export default AgentModal