// admin-react/src/pages/Logs/LoanShuffleLogs/components/LoanShuffleLogTable.jsx

function LoanShuffleLogTable({
    logs = [],
}) {

    // =========================================================
    // ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        const roleMap = {
            admin: 'Admin',

            agent: 'Agent',

            rm: 'RM',

            teamlead_agent_business:
                'TL',

            teamlead_agent_personal:
                'TL',
        }


        return (
            roleMap[role] ||
            role ||
            '—'
        )

    }


    // =========================================================
    // EMPLOYEE DISPLAY
    // =========================================================

    const renderEmployee = (
        name,
        id
    ) => {

        if (!name) {
            return '—'
        }


        return (
            <div className="
                flex
                flex-col
                leading-tight
            ">

                <span className="
                    font-medium
                    text-base-content
                ">
                    {name}
                </span>


                {id && (

                    <span className="
                        text-xs
                        text-base-content/50
                    ">
                        {id}
                    </span>

                )}

            </div>
        )

    }


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (
        date
    ) => {

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
            return date
        }


        return parsedDate.toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
            }
        )

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!logs.length) {

        return (

            <div className="
                overflow-hidden
                rounded-lg
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    flex
                    min-h-[220px]
                    items-center
                    justify-center
                    px-4
                    py-10
                ">

                    <div className="
                        text-center
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content
                        ">
                            No loan shuffle logs found
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            text-base-content/50
                        ">
                            Try changing the filters.
                        </p>

                    </div>

                </div>

            </div>

        )

    }


    // =========================================================
    // TABLE
    // =========================================================

    return (

        <div className="
            overflow-hidden
            rounded-lg
            border
            border-base-300
            bg-base-100
            shadow-sm
        ">

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="
                border-b
                border-base-300
                px-4
                py-3
            ">

                <h2 className="
                    text-base
                    font-semibold
                    text-base-content
                ">
                    Loan Shuffle Logs
                </h2>


                <p className="
                    mt-0.5
                    text-xs
                    text-base-content/50
                ">
                    History of loan movement between agents and RMs.
                </p>

            </div>


            {/* =================================================
                RESPONSIVE TABLE
            ================================================= */}

            <div className="
                overflow-x-auto
            ">

                <table className="
                    table
                    w-full
                ">

                    {/* =========================================
                        TABLE HEAD
                    ========================================= */}

                    <thead>

                        <tr>

                            <th className="
                                whitespace-nowrap
                            ">
                                ID
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Loan ID
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Shuffled By
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                From Agent
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                To Agent
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                From RM
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                To RM
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Date
                            </th>

                        </tr>

                    </thead>


                    {/* =========================================
                        TABLE BODY
                    ========================================= */}

                    <tbody>

                        {logs.map(
                            (log) => (

                                <tr
                                    key={log.id}
                                    className="
                                        hover
                                    "
                                >

                                    {/* =================================
                                        ID
                                    ================================= */}

                                    <td className="
                                        whitespace-nowrap
                                        font-medium
                                    ">
                                        {log.id}
                                    </td>


                                    {/* =================================
                                        LOAN ID
                                    ================================= */}

                                    <td className="
                                        whitespace-nowrap
                                        font-medium
                                    ">
                                        {log.loanId}
                                    </td>


                                    {/* =================================
                                        SHUFFLED BY
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            flex-col
                                            leading-tight
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                font-medium
                                            ">
                                                {log.shuffledByName ||
                                                    '—'}
                                            </span>


                                            {log.shuffledById && (

                                                <span className="
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.shuffledById}
                                                </span>

                                            )}


                                            {log.shuffledByRole && (

                                                <span className="
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {getRoleLabel(
                                                        log.shuffledByRole
                                                    )}
                                                </span>

                                            )}

                                        </div>

                                    </td>


                                    {/* =================================
                                        FROM AGENT
                                    ================================= */}

                                    <td>

                                        {renderEmployee(
                                            log.fromAgentName,
                                            log.fromAgentId
                                        )}

                                    </td>


                                    {/* =================================
                                        TO AGENT
                                    ================================= */}

                                    <td>

                                        {renderEmployee(
                                            log.toAgentName,
                                            log.toAgentId
                                        )}

                                    </td>


                                    {/* =================================
                                        FROM RM
                                    ================================= */}

                                    <td>

                                        {renderEmployee(
                                            log.fromRmName,
                                            log.fromRmId
                                        )}

                                    </td>


                                    {/* =================================
                                        TO RM
                                    ================================= */}

                                    <td>

                                        {renderEmployee(
                                            log.toRmName,
                                            log.toRmId
                                        )}

                                    </td>


                                    {/* =================================
                                        DATE
                                    ================================= */}

                                    <td className="
                                        whitespace-nowrap
                                        text-sm
                                    ">
                                        {formatDate(
                                            log.createdAt
                                        )}
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


export default LoanShuffleLogTable