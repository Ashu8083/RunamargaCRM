// admin-react/src/pages/Logs/LeadCreationLogs/components/LeadCreationLogTable.jsx

function LeadCreationLogTable({
    logs = [],
}) {

    // =========================================================
    // ROLE DISPLAY
    // =========================================================

    const getRoleLabel = (role) => {

        if (!role) {
            return '—'
        }


        const roleMap = {

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
            roleMap[
                String(role).toLowerCase()
            ] ||
            role
        )

    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return '—'
        }


        const date =
            new Date(value)


        if (Number.isNaN(date.getTime())) {
            return value
        }


        return date.toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )

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
                    px-4
                    py-12
                    text-center
                ">

                    <p className="
                        text-sm
                        font-medium
                    ">
                        No lead creation logs found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        Try changing your filters or search criteria.
                    </p>

                </div>

            </div>

        )

    }


    return (

        <div className="
            card
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

          

            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="
                overflow-x-auto
            ">

                <table className="
                    table
                    w-full
                ">

                    <thead>

                        <tr>

                            {/* ID */}

                            <th className="
                                w-16
                                text-center
                            ">
                                ID
                            </th>


                            {/* LEAD ID */}

                            <th>
                                Lead ID
                            </th>


                            {/* CREATED BY */}

                            <th>
                                Created By
                            </th>


                            {/* ROLE */}

                            <th>
                                Role
                            </th>


                            {/* REPORTS TO */}

                            <th>
                                Reports To
                            </th>


                            {/* DATE */}

                            <th>
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

                                    <td className="
                                        text-center
                                    ">

                                        <span className="
                                            text-sm
                                            text-base-content/60
                                        ">
                                            {log.id}
                                        </span>

                                    </td>


                                    {/* =================================
                                        LEAD ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            font-medium
                                        ">
                                            {log.leadId || '—'}
                                        </span>

                                    </td>


                                    {/* =================================
                                        CREATED BY
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            flex-col
                                        ">

                                            <span className="
                                                text-sm
                                                font-medium
                                            ">
                                                {log.createdByName || '—'}
                                            </span>


                                            {log.createdById !==
                                                null &&
                                                log.createdById !==
                                                undefined && (

                                                    <span className="
                                                        mt-0.5
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        {log.createdById}
                                                    </span>

                                                )}

                                        </div>

                                    </td>


                                    {/* =================================
                                        ROLE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            inline-flex
                                            items-center
                                            rounded-full
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
                                                log.createdByRole
                                            )}
                                        </span>

                                    </td>


                                    {/* =================================
                                        REPORTS TO
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            flex-col
                                        ">

                                            <span className="
                                                text-sm
                                                font-medium
                                            ">
                                                {log.reportsToName || '—'}
                                            </span>


                                            {log.reportsToId !==
                                                null &&
                                                log.reportsToId !==
                                                undefined && (

                                                    <span className="
                                                        mt-0.5
                                                        text-xs
                                                        text-base-content/50
                                                    ">
                                                        {log.reportsToId}
                                                    </span>

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

export default LeadCreationLogTable