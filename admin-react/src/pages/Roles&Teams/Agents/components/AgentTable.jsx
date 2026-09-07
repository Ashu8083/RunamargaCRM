// admin-react/src/pages/Roles&Teams/Agents/components/AgentTable.jsx

import { useMemo, useState } from 'react'

import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'

const AgentTable = ({
    agents = [],
    loading = false,
    onEdit,
    onDelete,
    onStatusChange,
    onManageTeamLeads,
    onManagePermissions,
    onAdd,
    onRefresh,
}) => {
    const [search, setSearch] = useState('')

    // ============================================================
    // FILTER
    // ============================================================

    const filteredAgents = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) {
            return agents
        }

        return agents.filter((agent) => {
            const values = [
                agent.name,
                agent.email,
                agent.phone,
                agent.role,
                agent.role_code,
                agent.status,
            ]

            return values.some((value) =>
                String(value || '')
                    .toLowerCase()
                    .includes(query)
            )
        })
    }, [agents, search])

    // ============================================================
    // STATUS
    // ============================================================

    const getStatusClass = (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }

    // ============================================================
    // ROLE
    // ============================================================

    const getRoleDisplay = (agent) => {
        return (
            agent?.role ||
            agent?.context_name ||
            agent?.role_code ||
            'N/A'
        )
    }

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="w-full">

            {/* ================================================== */}
            {/* SEARCH + ADD + REFRESH CARD */}
            {/* ================================================== */}

            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">

                    {/* SEARCH */}
                    <div className="relative min-w-0 flex-1">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search agents..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                        />
                    </div>

                    {/* ADD AGENT */}
                    <button
                        type="button"
                        onClick={onAdd}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 lg:w-auto"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Agent</span>
                    </button>

                    {/* REFRESH */}
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loading}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        <ArrowPathIcon
                            className={`h-5 w-5 ${
                                loading ? 'animate-spin' : ''
                            }`}
                        />

                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* ================================================== */}
            {/* TABLE */}
            {/* ================================================== */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

                        {/* ================================================== */}
                        {/* TABLE HEADER */}
                        {/* ================================================== */}

                        <thead className="bg-gray-50 dark:bg-gray-900/40">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Employee
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Email
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Phone
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Role
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Status
                                </th>

                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* ================================================== */}
                        {/* TABLE BODY */}
                        {/* ================================================== */}

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        Loading agents...
                                    </td>
                                </tr>
                            ) : filteredAgents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        {search
                                            ? 'No agents found matching your search.'
                                            : 'No agents found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredAgents.map((agent) => {
                                    const isActive = Boolean(
                                        agent?.is_active
                                    )

                                    return (
                                        <tr
                                            key={agent.id}
                                            className="transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                        >

                                            {/* EMPLOYEE */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {agent.name || 'N/A'}
                                                </div>

                                                {agent.employee_code && (
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {agent.employee_code}
                                                    </div>
                                                )}
                                            </td>

                                            {/* EMAIL */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {agent.email || 'N/A'}
                                            </td>

                                            {/* PHONE */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {agent.phone || 'N/A'}
                                            </td>

                                            {/* ROLE */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {getRoleDisplay(agent)}
                                                </span>
                                            </td>

                                            {/* STATUS */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <select
                                                    value={
                                                        isActive
                                                            ? 'Active'
                                                            : 'Inactive'
                                                    }
                                                    onChange={(event) =>
                                                        onStatusChange(
                                                            agent,
                                                            event.target.value
                                                        )
                                                    }
                                                    className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${getStatusClass(
                                                        isActive
                                                    )}`}
                                                >
                                                    <option value="Active">
                                                        Active
                                                    </option>

                                                    <option value="Inactive">
                                                        Inactive
                                                    </option>
                                                </select>
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">

                                                    {/* EDIT */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit(agent)
                                                        }
                                                        title="Edit Agent"
                                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>

                                                    {/* TEAM LEAD */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onManageTeamLeads(
                                                                agent
                                                            )
                                                        }
                                                        title="Manage Team Lead"
                                                        className="rounded-lg p-2 text-purple-600 transition hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                                                    >
                                                        <UserGroupIcon className="h-5 w-5" />
                                                    </button>

                                                    {/* PERMISSIONS */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onManagePermissions(
                                                                agent
                                                            )
                                                        }
                                                        title="Manage Permissions"
                                                        disabled={!isActive}
                                                        className={`rounded-lg p-2 transition ${
                                                            isActive
                                                                ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                                                                : 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                                        }`}
                                                    >
                                                        <ShieldCheckIcon className="h-5 w-5" />
                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete(agent)
                                                        }
                                                        title="Delete Agent"
                                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AgentTable