// admin-react/src/pages/Logs/AgentAssignmentLogs/components/AgentAssignmentLogTable.jsx


function AgentAssignmentLogTable({
    logs = [],
}) {

    // =========================================================
    // ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        const labels = {

            agent:
                'Agent',

            rm:
                'RM',

            teamlead:
                'Team Lead',

            teamlead_rm_business:
                'Team Lead RM Business',

            teamlead_agent_business:
                'Team Lead Agent Business',

            teamlead_agent_personal:
                'Team Lead Agent Personal',

        }


        return (
            labels[role] ||
            role ||
            'N/A'
        )
    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateString) => {

        if (!dateString) {
            return '—'
        }


        /*
         * createdAt contains the complete timestamp.
         *
         * Only the date is displayed in the table.
         *
         * Example:
         * 01 Sep 2026
         */

        const datePart =
            dateString.split(',')[0]


        return datePart || '—'
    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (logs.length === 0) {

        return (

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-16
                    text-center
                ">

                    <p className="
                        text-sm
                        font-medium
                    ">
                        No agent assignment logs found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        Try changing your filters.
                    </p>

                </div>

            </div>

        )
    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <div className="
            card
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

          

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="
                overflow-x-auto
            ">

                <table className="
                    table
                    w-full
                ">

                    <thead>

                        <tr>

                            {/* =================================
                                ID
                            ================================= */}

                            <th className="
                                w-20
                                whitespace-nowrap
                            ">
                                ID
                            </th>


                            {/* =================================
                                LOAN ID
                            ================================= */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Loan ID
                            </th>


                            {/* =================================
                                ASSIGNED TO
                            ================================= */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Assigned To
                            </th>


                            {/* =================================
                                ROLE
                            ================================= */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Role
                            </th>


                            {/* =================================
                                REPORTS TO
                            ================================= */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Reports To
                            </th>


                            {/* =================================
                                DATE
                            ================================= */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Date
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {logs.map(
                            (log) => (

                                <tr
                                    key={log.id}
                                >

                                    {/* =================================
                                        ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            text-sm
                                            font-medium
                                            text-base-content/70
                                        ">
                                            {log.id}
                                        </span>

                                    </td>


                                    {/* =================================
                                        LOAN ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            text-sm
                                            font-semibold
                                        ">
                                            {log.loanId ||
                                                'N/A'
                                            }
                                        </span>

                                    </td>


                                    {/* =================================
                                        ASSIGNED TO
                                    ================================= */}

                                    <td>

                                        <div className="
                                            min-w-[150px]
                                        ">

                                            <p className="
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                            ">
                                                {log.assignedToName ||
                                                    'N/A'
                                                }
                                            </p>


                                            {log.assignedToId !==
                                                undefined &&
                                                log.assignedToId !==
                                                    null && (

                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.assignedToId}
                                                </p>

                                            )}

                                        </div>

                                    </td>


                                    {/* =================================
                                        ROLE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            inline-flex
                                            whitespace-nowrap
                                            rounded-md
                                            border
                                            border-base-300
                                            bg-base-200/60
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            text-base-content/70
                                        ">
                                            {getRoleLabel(
                                                log.assignedToRole
                                            )}
                                        </span>

                                    </td>


                                    {/* =================================
                                        REPORTS TO
                                    ================================= */}

                                    <td>

                                        <div className="
                                            min-w-[150px]
                                        ">

                                            <p className="
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                            ">
                                                {log.reportsToName ||
                                                    'N/A'
                                                }
                                            </p>


                                            {log.reportsToId !==
                                                undefined &&
                                                log.reportsToId !==
                                                    null && (

                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.reportsToId}
                                                </p>

                                            )}

                                        </div>

                                    </td>


                                    {/* =================================
                                        DATE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                            text-base-content/70
                                        ">
                                            {formatDate(
                                                log.createdAt
                                            )}
                                        </span>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )
}


export default AgentAssignmentLogTable