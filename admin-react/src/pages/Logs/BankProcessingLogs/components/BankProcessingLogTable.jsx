// admin-react/src/pages/Logs/BankProcessingLogs/components/BankProcessingLogTable.jsx

function BankProcessingLogTable({
    logs = [],
}) {

    // =========================================================
    // FORMAT ROLE
    // =========================================================

    const formatRole = (role) => {

        if (!role) {
            return '—'
        }


        const roleMap = {
            agent: 'Agent',
            rm: 'RM',
            teamlead_agent_business:
                'Team Lead - Agent Business',
            teamlead_agent_personal:
                'Team Lead - Agent Personal',
            teamlead_rm_business:
                'Team Lead - RM Business',
            teamlead_rm_personal:
                'Team Lead - RM Personal',
        }


        return (
            roleMap[role] ||
            role
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (character) =>
                    character.toUpperCase()
                )
        )

    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return '—'
        }


        const parsedDate =
            new Date(date)


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return '—'
        }


        return parsedDate.toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

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

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <thead>

                        <tr>

                            <th className="
                                w-16
                                text-center
                            ">
                                ID
                            </th>


                            <th>
                                Loan ID
                            </th>


                            <th>
                                BP ID
                            </th>


                            <th>
                                Employee
                            </th>


                            <th>
                                Role
                            </th>


                            <th>
                                Event
                            </th>


                            <th>
                                Date
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <tbody>

                        {logs.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="
                                        py-12
                                        text-center
                                    "
                                >

                                    <p className="
                                        text-sm
                                        font-medium
                                    ">
                                        No bank processing logs found
                                    </p>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Try changing your filters or search criteria.
                                    </p>

                                </td>

                            </tr>

                        ) : (

                            logs.map((log) => (

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
                                            font-medium
                                        ">
                                            {log.id}
                                        </span>

                                    </td>


                                    {/* =================================
                                        LOAN ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                            font-medium
                                        ">
                                            {log.loanId || '—'}
                                        </span>

                                    </td>


                                    {/* =================================
                                        BP ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                            font-medium
                                        ">
                                            {log.bpId || '—'}
                                        </span>

                                    </td>


                                    {/* =================================
                                        EMPLOYEE
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            min-w-[160px]
                                            flex-col
                                        ">

                                            <span className="
                                                text-sm
                                                font-medium
                                            ">
                                                {log.employeeName || '—'}
                                            </span>


                                            {log.employeeId && (

                                                <span className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.employeeId}
                                                </span>

                                            )}

                                        </div>

                                    </td>


                                    {/* =================================
                                        ROLE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                        ">
                                            {formatRole(
                                                log.employeeRole
                                            )}
                                        </span>

                                    </td>


                                    {/* =================================
                                        EVENT
                                    ================================= */}

                                    <td>

                                        <span className="
                                            min-w-[180px]
                                            text-sm
                                        ">
                                            {log.event || '—'}
                                        </span>

                                    </td>


                                    {/* =================================
                                        DATE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                        ">
                                            {formatDate(
                                                log.createdAt
                                            )}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default BankProcessingLogTable