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


    // =========================================================
    // LOAD TEAM LEADS
    // =========================================================

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
         * Temporary data.
         *
         * Replace this section with API data later.
         *
         * Example:
         *
         * GET /agents/{agent.id}/team-leads
         *
         * Response:
         *
         * {
         *     rm: [],
         *     agent: []
         * }
         */


        const rmTeamLeads =
            agent.availableRMTeamLeads || [
                {
                    id: 1,
                    name: 'RM Team Lead One',
                    loanTypes: [
                        'Personal Loan',
                        'Home Loan',
                    ],
                },
                {
                    id: 2,
                    name: 'RM Team Lead Two',
                    loanTypes: [
                        'Business Loan',
                    ],
                },
            ]


        const agentTeamLeads =
            agent.availableAgentTeamLeads || [
                {
                    id: 3,
                    name: 'Agent Team Lead One',
                    loanTypes: [
                        'Personal Loan',
                    ],
                },
                {
                    id: 4,
                    name: 'Agent Team Lead Two',
                    loanTypes: [
                        'Business Loan',
                        'Personal Loan',
                    ],
                },
            ]


        setTeamLeads({
            rm: rmTeamLeads,
            agent: agentTeamLeads,
        })


        /*
         * Existing assignments.
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


    // =========================================================
    // RM TEAM LEAD TOGGLE
    // =========================================================

    const handleRMToggle = (
        teamLead,
        loanType
    ) => {

        setSelectedRM((previous) => {

            const exists =
                previous.some(
                    (item) =>
                        String(item.id) ===
                            String(teamLead.id) &&
                        item.loanType === loanType
                )


            const updated = exists

                ? previous.filter(
                    (item) =>
                        !(
                            String(item.id) ===
                                String(teamLead.id) &&
                            item.loanType === loanType
                        )
                )

                : [
                    ...previous,
                    {
                        id: teamLead.id,
                        loanType,
                    },
                ]


            onAssignmentChange?.({
                type: 'rm',
                assignments: updated,
            })


            return updated

        })

    }


    // =========================================================
    // AGENT TEAM LEAD TOGGLE
    // =========================================================

    const handleAgentToggle = (
        teamLead,
        loanType
    ) => {

        setSelectedAgent((previous) => {

            const exists =
                previous.some(
                    (item) =>
                        String(item.id) ===
                            String(teamLead.id) &&
                        item.loanType === loanType
                )


            const updated = exists

                ? previous.filter(
                    (item) =>
                        !(
                            String(item.id) ===
                                String(teamLead.id) &&
                            item.loanType === loanType
                        )
                )

                : [
                    ...previous,
                    {
                        id: teamLead.id,
                        loanType,
                    },
                ]


            onAssignmentChange?.({
                type: 'agent',
                assignments: updated,
            })


            return updated

        })

    }


    // =========================================================
    // CHECK SELECTION
    // =========================================================

    const isSelected = (
        selected,
        teamLeadId,
        loanType
    ) => {

        return selected.some(
            (item) =>
                String(item.id) ===
                    String(teamLeadId) &&
                item.loanType === loanType
        )

    }


    // =========================================================
    // TEAM LEAD GROUP
    // =========================================================

    const renderTeamLeads = (
        items,
        selected,
        onToggle
    ) => {

        if (!items.length) {

            return (

                <div className="
                    rounded-lg
                    border
                    border-base-300
                    py-8
                    text-center
                ">

                    <UserGroupIcon className="
                        mx-auto
                        h-8
                        w-8
                        text-base-content/30
                    " />


                    <p className="
                        mt-3
                        text-sm
                        font-medium
                    ">
                        No team leads available
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        Available team leads will appear here.
                    </p>

                </div>

            )

        }


        return (

            <div className="
                overflow-hidden
                rounded-lg
                border
                border-base-300
            ">

                {items.map(
                    (teamLead, index) => {

                        const hasSelection =
                            teamLead.loanTypes.some(
                                (loanType) =>
                                    isSelected(
                                        selected,
                                        teamLead.id,
                                        loanType
                                    )
                            )


                        return (

                            <div
                                key={teamLead.id}
                                className={`
                                    px-4
                                    py-3
                                    ${
                                        index !==
                                        items.length - 1
                                            ? 'border-b border-base-300'
                                            : ''
                                    }
                                `}
                            >

                                {/* =================================================
                                    TEAM LEAD
                                ================================================= */}

                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">

                                    <input
                                        type="checkbox"
                                        checked={hasSelection}
                                        onChange={() => {

                                            if (hasSelection) {

                                                teamLead.loanTypes.forEach(
                                                    (loanType) => {

                                                        if (
                                                            isSelected(
                                                                selected,
                                                                teamLead.id,
                                                                loanType
                                                            )
                                                        ) {

                                                            onToggle(
                                                                teamLead,
                                                                loanType
                                                            )

                                                        }

                                                    }
                                                )

                                            } else if (
                                                teamLead.loanTypes.length
                                            ) {

                                                onToggle(
                                                    teamLead,
                                                    teamLead.loanTypes[0]
                                                )

                                            }

                                        }}
                                        className="
                                            checkbox
                                            checkbox-sm
                                            shrink-0
                                            border-base-300
                                            checked:border-[#8BCF00]
                                            checked:bg-[#8BCF00]
                                        "
                                    />


                                    <div className="
                                        min-w-0
                                        flex-1
                                    ">

                                        <p className="
                                            text-sm
                                            font-semibold
                                        ">
                                            {teamLead.name}
                                        </p>


                                        <p className="
                                            mt-0.5
                                            text-xs
                                            text-base-content/50
                                        ">
                                            Select applicable loan types
                                        </p>

                                    </div>

                                </div>


                                {/* =================================================
                                    LOAN TYPES
                                ================================================= */}

                                {teamLead.loanTypes?.length > 0 && (

                                    <div className="
                                        ml-8
                                        mt-3
                                        flex
                                        flex-wrap
                                        gap-2
                                    ">

                                        {teamLead.loanTypes.map(
                                            (loanType) => {

                                                const checked =
                                                    isSelected(
                                                        selected,
                                                        teamLead.id,
                                                        loanType
                                                    )


                                                return (

                                                    <label
                                                        key={loanType}
                                                        className={`
                                                            inline-flex
                                                            cursor-pointer
                                                            items-center
                                                            gap-2
                                                            rounded-lg
                                                            border
                                                            px-3
                                                            py-1.5
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
                                                                        ? 'font-medium text-[#78B300]'
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

                                )}

                            </div>

                        )

                    }
                )}

            </div>

        )

    }


    // =========================================================
    // CLOSED
    // =========================================================

    if (!open || !agent) {
        return null
    }


    // =========================================================
    // MODAL
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

            <div className="
                modal-box
                w-11/12
                max-w-3xl
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
                                Assign Team Leads
                            </h3>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                Manage team lead assignments for{' '}
                                {agent.name}
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
                    CONTENT
                ================================================= */}

                <div className="
                    max-h-[65vh]
                    space-y-6
                    overflow-y-auto
                    p-5
                ">

                    {/* =================================================
                        RM TEAM LEADS
                    ================================================= */}

                    <section>

                        <div className="mb-3">

                            <h4 className="
                                text-sm
                                font-semibold
                            ">
                                RM Team Leads
                            </h4>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                Assign RM team leads and applicable loan types.
                            </p>

                        </div>


                        {renderTeamLeads(
                            teamLeads.rm,
                            selectedRM,
                            handleRMToggle
                        )}

                    </section>


                    {/* =================================================
                        AGENT TEAM LEADS
                    ================================================= */}

                    <section>

                        <div className="mb-3">

                            <h4 className="
                                text-sm
                                font-semibold
                            ">
                                Agent Team Leads
                            </h4>


                            <p className="
                                mt-1
                                text-xs
                                text-base-content/50
                            ">
                                Assign agent team leads and applicable loan types.
                            </p>

                        </div>


                        {renderTeamLeads(
                            teamLeads.agent,
                            selectedAgent,
                            handleAgentToggle
                        )}

                    </section>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="
                    flex
                    justify-end
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
                        Close
                    </button>

                </div>

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


export default AssignedTeamLeadsModal