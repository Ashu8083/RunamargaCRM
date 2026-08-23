// admin-react/src/pages/Role-management/TeamLead/components/AssignedAgentsModal.jsx
import { useEffect, useState } from 'react'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'


function AssignedAgentsModal({
    open,
    teamLead,
    onClose,
}) {

    const [agents, setAgents] = useState([])


    useEffect(() => {

        if (!open || !teamLead) {
            setAgents([])
            return
        }


        /*
         * Temporary local data.
         *
         * Later replace this with the API call:
         *
         * GET /team-leads/{teamLead.id}/agents
         */

        setAgents(
            teamLead.assignedAgents || [
                {
                    id: 1,
                    name: 'Agent One',
                    phone: '9876543210',
                    email: 'agent1@example.com',
                    loanType: 'Personal Loan',
                },
                {
                    id: 2,
                    name: 'Agent Two',
                    phone: '9876543211',
                    email: 'agent2@example.com',
                    loanType: 'Business Loan',
                },
            ]
        )

    }, [open, teamLead])


    if (!open || !teamLead) {
        return null
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
                                Assigned Agents
                            </h3>

                            <p className="text-xs text-base-content/50 mt-1">
                                Agents assigned to {teamLead.name}
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
                    AGENTS
                ===================================================== */}

                <div className="p-5">

                    {agents.length === 0 ? (

                        <div className="text-center py-12">

                            <UserGroupIcon className="w-9 h-9 mx-auto text-base-content/30" />

                            <p className="text-sm font-medium mt-3">
                                No agents assigned
                            </p>

                            <p className="text-xs text-base-content/50 mt-1">
                                Agents assigned to this team lead will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th className="w-14 text-center">
                                            #
                                        </th>

                                        <th>
                                            Agent
                                        </th>

                                        <th>
                                            Contact Info
                                        </th>

                                        <th>
                                            Loan Type
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {agents.map((agent, index) => (

                                        <tr key={agent.id}>

                                            {/* Index */}

                                            <td className="text-center">

                                                <span className="text-sm text-base-content/60">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* Agent */}

                                            <td>

                                                <span className="font-semibold">
                                                    {agent.name}
                                                </span>

                                            </td>


                                            {/* Contact */}

                                            <td>

                                                <div className="space-y-0.5">

                                                    <p className="text-sm">
                                                        {agent.phone || 'N/A'}
                                                    </p>

                                                    <p className="text-xs text-base-content/50">
                                                        {agent.email || 'N/A'}
                                                    </p>

                                                </div>

                                            </td>


                                            {/* Loan Type */}

                                            <td>

                                                <span className="
                                                    inline-flex
                                                    items-center
                                                    px-2.5
                                                    py-1
                                                    rounded-full
                                                    border
                                                    border-[#8BCF00]/40
                                                    bg-[#8BCF00]/10
                                                    text-[#78B300]
                                                    text-xs
                                                    font-medium
                                                ">
                                                    {agent.loanType || 'N/A'}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

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


export default AssignedAgentsModal