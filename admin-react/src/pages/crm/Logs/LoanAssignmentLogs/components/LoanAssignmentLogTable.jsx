// admin-react/src/pages/Logs/LoanAssignmentLogs/components/LoanAssignmentLogTable.jsx

function LoanAssignmentLogTable({
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
    // FORMAT LOAN TYPE
    // =========================================================

    const formatLoanType = (loanType) => {

        if (!loanType) {
            return '—'
        }


        const loanTypeMap = {
            PERSONAL: 'Personal Loan',
            BUSINESS: 'Business Loan',
            HOME: 'Home Loan',
            CAR: 'Car Loan',
            EDUCATION: 'Education Loan',
        }


        return (
            loanTypeMap[loanType] ||
            loanType
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
    // EVENT CLASS
    // =========================================================

    const getEventClass = (event) => {

        if (
            event ===
            'Auto-assignment enabled'
        ) {

            return `
                text-[#78B300]
                border-[#8BCF00]/40
                bg-[#8BCF00]/10
            `

        }


        if (
            event ===
            'Auto-assignment disabled'
        ) {

            return `
                text-error
                border-error/30
                bg-error/10
            `

        }


        return `
            text-base-content/70
            border-base-300
            bg-base-200
        `

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
                                Employee
                            </th>


                            <th>
                                Role
                            </th>


                            <th>
                                Reports To
                            </th>


                            <th>
                                Loan Type
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
                                        No loan assignment logs found
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
                                        REPORTS TO
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            min-w-[150px]
                                            flex-col
                                        ">

                                            <span className="
                                                text-sm
                                                font-medium
                                            ">
                                                {log.reportsToName || '—'}
                                            </span>


                                            {log.reportsToId && (

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
                                        LOAN TYPE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                        ">
                                            {formatLoanType(
                                                log.loanType
                                            )}
                                        </span>

                                    </td>


                                    {/* =================================
                                        EVENT
                                    ================================= */}

                                    <td>

                                        <span className={`
                                            inline-flex
                                            whitespace-nowrap
                                            rounded-md
                                            border
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            ${getEventClass(
                                                log.event
                                            )}
                                        `}>
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


export default LoanAssignmentLogTable