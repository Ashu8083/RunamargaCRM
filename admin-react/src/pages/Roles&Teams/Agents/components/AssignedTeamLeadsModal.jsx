// admin-react/src/pages/Roles&Teams/Agents/components/AssignedTeamLeadsModal.jsx

import { useMemo, useState } from 'react'

import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon'

const AssignedTeamLeadsModal = ({
    open,
    agent,
    teamLeads = [],
    assignedTeamLead = null,
    loading = false,
    onClose,
    onAssignmentChange,
}) => {
    const [search, setSearch] = useState('')

    // ============================================================
    // FILTER TEAM LEADS
    // ============================================================

    const filteredTeamLeads = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) {
            return teamLeads
        }

        return teamLeads.filter((teamLead) => {
            const values = [
                teamLead.name,
                teamLead.email,
                teamLead.phone,
                teamLead.role,
                teamLead.role_code,
                teamLead.employee_code,
            ]

            return values.some((value) =>
                String(value || '')
                    .toLowerCase()
                    .includes(query)
            )
        })
    }, [teamLeads, search])

    // ============================================================
    // TEAM LEAD ID
    // ============================================================

    const getTeamLeadId = (teamLead) => {
        if (!teamLead) return null

        return (
            teamLead.id ??
            teamLead.employee_context_id ??
            teamLead.context_id ??
            null
        )
    }

    const assignedTeamLeadId = getTeamLeadId(assignedTeamLead)

    // ============================================================
    // SELECT TEAM LEAD
    // ============================================================

    const handleSelect = (teamLead) => {
        if (loading) return

        const teamLeadId = getTeamLeadId(teamLead)

        if (!teamLeadId) return

        // Clicking the already selected Team Lead does nothing.
        if (Number(teamLeadId) === Number(assignedTeamLeadId)) {
            return
        }

        onAssignmentChange?.(teamLead)
    }

    // ============================================================
    // REMOVE TEAM LEAD
    // ============================================================

    const handleRemove = () => {
        if (loading || !assignedTeamLead) return

        onAssignmentChange?.(null)
    }

    // ============================================================
    // CLOSE
    // ============================================================

    const handleClose = () => {
        if (loading) return

        setSearch('')
        onClose?.()
    }

    // ============================================================
    // RESET SEARCH WHEN MODAL CLOSES
    // ============================================================

    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* ================================================== */}
            {/* BACKDROP */}
            {/* ================================================== */}

            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* ================================================== */}
            {/* MODAL */}
            {/* ================================================== */}

            <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                            <UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Assign Team Lead
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {agent?.name
                                    ? `Select a Team Lead for ${agent.name}`
                                    : 'Select a Team Lead for this agent'}
                            </p>
                        </div>
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
                {/* CURRENT ASSIGNMENT */}
                {/* ================================================== */}

                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Current Team Lead
                    </div>

                    {assignedTeamLead ? (
                        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-900/20">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                                    <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>

                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                                        {assignedTeamLead.name || 'N/A'}
                                    </div>

                                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {assignedTeamLead.role ||
                                            assignedTeamLead.role_code ||
                                            'Team Lead'}
                                    </div>
                                </div>

                                <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Assigned
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={loading}
                                className="ml-3 shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                title="Remove Team Lead"
                            >
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-400">
                            No Team Lead assigned.
                        </div>
                    )}
                </div>

                {/* ================================================== */}
                {/* SEARCH */}
                {/* ================================================== */}

                <div className="px-6 py-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search Team Leads..."
                            disabled={loading}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* ================================================== */}
                {/* TEAM LEAD LIST */}
                {/* ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-sm text-gray-500 dark:text-gray-400">
                            Loading Team Leads...
                        </div>
                    ) : filteredTeamLeads.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                            {search
                                ? 'No Team Leads found matching your search.'
                                : 'No active Team Leads available.'}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTeamLeads.map((teamLead) => {
                                const teamLeadId =
                                    getTeamLeadId(teamLead)

                                const isSelected =
                                    Number(teamLeadId) ===
                                    Number(assignedTeamLeadId)

                                return (
                                    <button
                                        key={teamLeadId}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(teamLead)
                                        }
                                        disabled={loading}
                                        className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                                            isSelected
                                                ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                                                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/10'
                                        } disabled:cursor-not-allowed disabled:opacity-60`}
                                    >
                                        {/* AVATAR */}
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                isSelected
                                                    ? 'bg-green-100 dark:bg-green-900/40'
                                                    : 'bg-purple-100 dark:bg-purple-900/30'
                                            }`}
                                        >
                                            <UserIcon
                                                className={`h-5 w-5 ${
                                                    isSelected
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-purple-600 dark:text-purple-400'
                                                }`}
                                            />
                                        </div>

                                        {/* DETAILS */}
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                {teamLead.name ||
                                                    'N/A'}
                                            </div>

                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                                {teamLead.email && (
                                                    <span>
                                                        {
                                                            teamLead.email
                                                        }
                                                    </span>
                                                )}

                                                {teamLead.phone && (
                                                    <span>
                                                        {
                                                            teamLead.phone
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                                                {teamLead.role ||
                                                    teamLead.role_code ||
                                                    'Team Lead'}
                                            </div>
                                        </div>

                                        {/* SELECTION */}
                                        <div className="shrink-0">
                                            {isSelected ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    Selected
                                                </span>
                                            ) : (
                                                <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">
                                                    Select
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* ================================================== */}
                {/* FOOTER */}
                {/* ================================================== */}

                <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AssignedTeamLeadsModal