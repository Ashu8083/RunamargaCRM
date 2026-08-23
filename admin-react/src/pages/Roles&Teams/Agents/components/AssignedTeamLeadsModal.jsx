// admin-react/src/pages/Roles&Teams/Agents/components/AssignedTeamLeadsModal.jsx

import { useEffect, useState } from 'react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'


function AssignedTeamLeadsModal({
    open,
    agent,
    onClose,
    onAssignmentChange,
}) {

    const [teamLeads, setTeamLeads] = useState({
        rm: [],
        agent: [],
    })


    const [selectedRM, setSelectedRM] = useState([])
    const [selectedAgent, setSelectedAgent] = useState([])


    useEffect(() => {

        if (!open || !agent) {

            setTeamLeads({
                rm: [],
                agent: [],
            })

            setSelectedRM([])
            setSelectedAgent([])

            return
        }


        /*
         * Later replace this with API call.
         *
         * GET /team-leads/available
         *
         * Expected:
         *
         * {
         *     rm: [
         *         {
         *             id: 1,
         *             name: 'John Doe',
         *             loanTypes: ['Personal Loan', 'Home Loan']
         *         }
         *     ],
         *
         *     agent: [
         *         {
         *             id: 2,
         *             name: 'Rahul Kumar',
         *             loanTypes: ['Business Loan']
         *         }
         *     ]
         * }
         */


        const rmTeamLeads = agent.availableRMTeamLeads || [
            {
                id: 1,
                name: 'RM Team Lead One',
                loanTypes: ['Personal Loan', 'Home Loan'],
            },
            {
                id: 2,
                name: 'RM Team Lead Two',
                loanTypes: ['Business Loan'],
            },
        ]


        const agentTeamLeads = agent.availableAgentTeamLeads || [
            {
                id: 3,
                name: 'Agent Team Lead One',
                loanTypes: ['Personal Loan'],
            },
            {
                id: 4,
                name: 'Agent Team Lead Two',
                loanTypes: ['Business Loan', 'Personal Loan'],
            },
        ]


        setTeamLeads({
            rm: rmTeamLeads,
            agent: agentTeamLeads,
        })


        /*
         * Existing assignments from backend.
         *
         * Example:
         *
         * rmTeamLeads:
         * [
         *     {
         *         id: 1,
         *         loanType: 'Personal Loan'
         *     }
         * ]
         */


        setSelectedRM(
            (agent.rmTeamLeads || []).map(
                (item) => ({
                    id: item.id,
                    loanType: item.loanType,
                })
            )
        )


        setSelectedAgent(
            (agent.agentTeamLeads || []).map(
                (item) => ({
                    id: item.id,
                    loanType: item.loanType,
                })
            )
        )

    }, [open, agent])


    if (!open || !agent) {
        return null
    }


    // =========================================================
    // TOGGLE RM TEAM LEAD
    // =========================================================

    const handleRMToggle = (teamLead, loanType) => {

        setSelectedRM((previous) => {

            const exists = previous.some(
                (item) =>
                    item.id === teamLead.id &&
                    item.loanType === loanType
            )


            let updated


            if (exists) {

                updated = previous.filter(
                    (item) =>
                        !(
                            item.id === teamLead.id &&
                            item.loanType === loanType
                        )
                )

            } else {

                updated = [
                    ...previous,
                    {
                        id: teamLead.id,
                        loanType,
                    },
                ]
            }


            onAssignmentChange?.({
                type: 'rm',
                assignments: updated,
            })


            return updated
        })
    }


    // =========================================================
    // TOGGLE AGENT TEAM LEAD
    // =========================================================

    const handleAgentToggle = (teamLead, loanType) => {

        setSelectedAgent((previous) => {

            const exists = previous.some(
                (item) =>
                    item.id === teamLead.id &&
                    item.loanType === loanType
            )


            let updated


            if (exists) {

                updated = previous.filter(
                    (item) =>
                        !(
                            item.id === teamLead.id &&
                            item.loanType === loanType
                        )
                )

            } else {

                updated = [
                    ...previous,
                    {
                        id: teamLead.id,
                        loanType,
                    },
                ]
            }


            onAssignmentChange?.({
                type: 'agent',
                assignments: updated,
            })


            return updated
        })
    }


    // =========================================================
    // CHECK STATE
    // =========================================================

    const isRMSelected = (teamLeadId, loanType) => {

        return selectedRM.some(
            (item) =>
                item.id === teamLeadId &&
                item.loanType === loanType
        )
    }


    const isAgentSelected = (teamLeadId, loanType) => {

        return selectedAgent.some(
            (item) =>
                item.id === teamLeadId &&
                item.loanType === loanType
        )
    }


    // =========================================================
    // TEAM LEAD LIST
    // =========================================================

    const renderTeamLeads = (
        items,
        type,
        selected,
        onToggle
    ) => {

        if (items.length === 0) {

            return (
                <div className="rounded-lg border border-base-300 py-8 text-center">

                    <UserGroupIcon className="w-8 h-8 mx-auto text-base-content/30" />

                    <p className="text-sm font-medium mt-3">
                        No team leads available
                    </p>

                    <p className="text-xs text-base-content/50 mt-1">
                        Available team leads will appear here.
                    </p>

                </div>
            )
        }


        return (
            <div className="border border-base-300 rounded-lg overflow-hidden">

                {items.map((teamLead, index) => (

                    <div
                        key={teamLead.id}
                        className={`
                            px-4
                            py-3
                            ${
                                index !== items.length - 1
                                    ? 'border-b border-base-300'
                                    : ''
                            }
                        `}
                    >

                        {/* Team Lead */}

                        <div className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                checked={teamLead.loanTypes.some(
                                    (loanType) =>
                                        selected.some(
                                            (item) =>
                                                item.id === teamLead.id &&
                                                item.loanType === loanType
                                        )
                                )}
                                onChange={() => {

                                    /*
                                     * This checkbox represents the
                                     * team lead as a whole.
                                     *
                                     * If any loan type is selected,
                                     * remove all.
                                     *
                                     * Otherwise select the first
                                     * available loan type.
                                     */

                                    const hasSelection =
                                        teamLead.loanTypes.some(
                                            (loanType) =>
                                                selected.some(
                                                    (item) =>
                                                        item.id === teamLead.id &&
                                                        item.loanType === loanType
                                                )
                                        )


                                    if (hasSelection) {

                                        teamLead.loanTypes.forEach(
                                            (loanType) => {

                                                if (
                                                    selected.some(
                                                        (item) =>
                                                            item.id === teamLead.id &&
                                                            item.loanType === loanType
                                                    )
                                                ) {
                                                    onToggle(
                                                        teamLead,
                                                        loanType
                                                    )
                                                }

                                            }
                                        )

                                    } else {

                                        onToggle(
                                            teamLead,
                                            teamLead.loanTypes[0]
                                        )
                                    }
                                }}
                                className="
                                    checkbox
                                    checkbox-sm
                                    border-base-300
                                    checked:border-[#8BCF00]
                                    checked:bg-[#8BCF00]
                                    shrink-0
                                "
                            />


                            <div className="flex-1 min-w-0">

                                <p className="text-sm font-semibold">
                                    {teamLead.name}
                                </p>

                                <p className="text-xs text-base-content/50 mt-0.5">
                                    Select loan type below
                                </p>

                            </div>

                        </div>


                        {/* Loan Types */}

                        <div className="ml-8 mt-3 flex flex-wrap gap-2">

                            {teamLead.loanTypes.map(
                                (loanType) => {

                                    const checked =
                                        selected.some(
                                            (item) =>
                                                item.id === teamLead.id &&
                                                item.loanType === loanType
                                        )


                                    return (
                                        <label
                                            key={loanType}
                                            className={`
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-1.5
                                                rounded-lg
                                                border
                                                cursor-pointer
                                                transition
                                                ${
                                                    checked
                                                        ? 'border-[#8BCF00] bg-[#8BCF00]/10'
                                                        : 'border-base-300 hover:bg-base-200'
                                                }
                                            `}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    onToggle(
                                                        teamLead,
                                                        loanType
                                                    )
                                                }
                                                className="
                                                    checkbox
                                                    checkbox-xs
                                                    border-base-300
                                                    checked:border-[#8BCF00]
                                                    checked:bg-[#8BCF00]
                                                "
                                            />

                                            <span
                                                className={`
                                                    text-xs
                                                    ${
                                                        checked
                                                            ? 'text-[#78B300] font-medium'
                                                            : 'text-base-content/70'
                                                    }
                                                `}
                                            >
                                                {loanType}
                                            </span>

                                        </label>
                                    )
                                }
                            )}

                        </div>

                    </div>

                ))}

            </div>
        )
    }


    return (
        <dialog
            open
            className="modal modal-bottom sm:modal-middle"
        >

            <div className="modal-box w-11/12 max-w-3xl p-0 bg-base-100 border border-base-300">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-[#8BCF00]/10 flex items-center justify-center">

                            <UserGroupIcon className="w-5 h-5 text-[#78B300]" />

                        </div>


                        <div>

                            <h3 className="text-lg font-semibold">
                                Assign Team Leads
                            </h3>

                            <p className="text-xs text-base-content/50 mt-1">
                                Manage team lead assignments for {agent.name}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                        aria-label="Close"
                    >

                        <XMarkIcon className="w-5 h-5" />

                    </button>

                </div>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="p-5 space-y-6">

                    {/* =================================================
                        RM TEAM LEADS
                    ================================================= */}

                    <section>

                        <div className="mb-3">

                            <h4 className="text-sm font-semibold">
                                RM Team Leads
                            </h4>

                            <p className="text-xs text-base-content/50 mt-1">
                                Assign RM team leads and their applicable loan types.
                            </p>

                        </div>


                        {renderTeamLeads(
                            teamLeads.rm,
                            'rm',
                            selectedRM,
                            handleRMToggle
                        )}

                    </section>


                    {/* =================================================
                        AGENT TEAM LEADS
                    ================================================= */}

                    <section>

                        <div className="mb-3">

                            <h4 className="text-sm font-semibold">
                                Agent Team Leads
                            </h4>

                            <p className="text-xs text-base-content/50 mt-1">
                                Assign agent team leads and their applicable loan types.
                            </p>

                        </div>


                        {renderTeamLeads(
                            teamLeads.agent,
                            'agent',
                            selectedAgent,
                            handleAgentToggle
                        )}

                    </section>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="flex justify-end p-4 border-t border-base-300">

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost"
                    >
                        Close
                    </button>

                </div>

            </div>


            {/* =====================================================
                BACKDROP
            ===================================================== */}

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


export default AssignedTeamLeadsModal