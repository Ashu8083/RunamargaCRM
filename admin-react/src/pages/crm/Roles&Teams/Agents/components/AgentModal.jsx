// admin-react/src/pages/Roles&Teams/Agents/components/AgentModal.jsx

import { useEffect, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'

import EmployeeDropdown from '../../../../../components/GlobalModels/Filters/EmployeeDropdown'

const AgentModal = ({
    open,
    agent,
    employees = [],
    roles = [],
    loading = false,
    onClose,
    onSubmit,
}) => {
    const isEdit = Boolean(agent)

    const [employeeId, setEmployeeId] = useState('')
    const [roleId, setRoleId] = useState('')
    const [status, setStatus] = useState('Active')

    // ============================================================
    // RESET / POPULATE FORM
    // ============================================================

    useEffect(() => {
        if (!open) {
            return
        }

        if (agent) {
            setEmployeeId(
                agent.employee_id != null
                    ? String(agent.employee_id)
                    : agent.employeeId != null
                        ? String(agent.employeeId)
                        : ''
            )

            setRoleId(
                agent.context_id != null
                    ? String(agent.context_id)
                    : agent.contextId != null
                        ? String(agent.contextId)
                        : agent.roleId != null
                            ? String(agent.roleId)
                            : ''
            )

            setStatus(
                agent.is_active === false ||
                agent.status === 'Inactive'
                    ? 'Inactive'
                    : 'Active'
            )
        } else {
            setEmployeeId('')
            setRoleId('')
            setStatus('Active')
        }
    }, [open, agent])

    // ============================================================
    // CLOSE
    // ============================================================

    const handleClose = () => {
        if (loading) return

        onClose?.()
    }

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!employeeId && !isEdit) {
            return
        }

        if (!roleId) {
            return
        }

        onSubmit?.({
            employeeId: Number(employeeId),
            employee: employees.find(
                (employee) =>
                    Number(
                        employee.id ??
                        employee.employee_id
                    ) === Number(employeeId)
            ),

            roleId: Number(roleId),
            role: roles.find(
                (role) =>
                    Number(role.id) === Number(roleId)
            ),

            status,

            isEdit,

            agentId: agent?.id ?? null,
        })
    }

    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* MODAL */}
            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {isEdit ? 'Edit Agent' : 'Add Agent'}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {isEdit
                                ? 'Update the agent role and status.'
                                : 'Create a new agent by assigning an employee and role.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* ================================================== */}
                {/* FORM */}
                {/* ================================================== */}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        {/* ================================================== */}
                        {/* EMPLOYEE */}
                        {/* ================================================== */}

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                <UserIcon className="h-4 w-4" />
                                Employee
                                <span className="text-red-500">*</span>
                            </label>

                            <EmployeeDropdown
                                employees={employees}
                                value={employeeId}
                                onChange={(value) => {
                                    if (isEdit) return

                                    const selectedValue =
                                        typeof value === 'object'
                                            ? value?.id ??
                                              value?.employee_id ??
                                              ''
                                            : value

                                    setEmployeeId(
                                        selectedValue
                                            ? String(selectedValue)
                                            : ''
                                    )
                                }}
                                disabled={isEdit || loading}
                            />

                            {isEdit && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Employee cannot be changed while
                                    editing an agent.
                                </p>
                            )}
                        </div>

                        {/* ================================================== */}
                        {/* ROLE */}
                        {/* ================================================== */}

                        <div>
                            <label
                                htmlFor="agent-role"
                                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                <BriefcaseIcon className="h-4 w-4" />
                                Agent Role
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="agent-role"
                                value={roleId}
                                onChange={(event) =>
                                    setRoleId(event.target.value)
                                }
                                disabled={loading}
                                required
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:disabled:bg-gray-800"
                            >
                                <option value="">
                                    Select Agent Role
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

                            {roles.length === 0 && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    No active agent roles available.
                                </p>
                            )}
                        </div>

                        {/* ================================================== */}
                        {/* STATUS */}
                        {/* ================================================== */}

                        <div>
                            <label
                                htmlFor="agent-status"
                                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                <CheckCircleIcon className="h-4 w-4" />
                                Status
                            </label>

                            <select
                                id="agent-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                disabled={loading}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:disabled:bg-gray-800"
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* FOOTER */}
                    {/* ================================================== */}

                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !roleId ||
                                (!isEdit && !employeeId)
                            }
                            className="inline-flex min-w-[110px] items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? 'Saving...'
                                : isEdit
                                    ? 'Update Agent'
                                    : 'Create Agent'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AgentModal