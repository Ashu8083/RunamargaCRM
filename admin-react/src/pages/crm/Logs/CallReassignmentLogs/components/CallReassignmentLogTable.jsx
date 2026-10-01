// admin-react/src/pages/Logs/CallReassignmentLogs/components/CallReassignmentLogTable.jsx

function CallReassignmentLogTable({
    logs = [],
}) {

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateString) => {

        if (!dateString) {
            return '—'
        }

        const date = new Date(dateString)

        if (Number.isNaN(date.getTime())) {
            return '—'
        }

        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })

    }


    // =========================================================
    // EMPLOYEE DISPLAY
    // =========================================================

    const renderEmployee = (
        name,
        employeeId
    ) => {

        return (

            <div className="
                flex
                flex-col
            ">

                <span className="
                    whitespace-nowrap
                    font-medium
                ">
                    {name || '—'}
                </span>

                {employeeId !== undefined &&
                    employeeId !== null && (

                        <span className="
                            text-xs
                            text-base-content/50
                        ">
                            {employeeId}
                        </span>

                    )
                }

            </div>

        )

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (logs.length === 0) {

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
                            text-base-content/70
                        ">
                            No call reassignment logs found
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
                RESPONSIVE TABLE
            ================================================= */}

            <div className="
                w-full
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
                                Customer Phone
                            </th>

                            <th className="
                                whitespace-nowrap
                            ">
                                From RM
                            </th>

                            <th className="
                                whitespace-nowrap
                            ">
                                From Phone
                            </th>

                            <th className="
                                whitespace-nowrap
                            ">
                                To RM
                            </th>

                            <th className="
                                whitespace-nowrap
                            ">
                                To Phone
                            </th>

                            <th className="
                                whitespace-nowrap
                            ">
                                Reassigned By
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

                        {logs.map((log) => (

                            <tr
                                key={log.id}
                                className="
                                    hover:bg-base-200/50
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
                                    CUSTOMER PHONE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">
                                    {log.customerPhone || '—'}
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
                                    FROM PHONE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">
                                    {log.fromPhone || '—'}
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
                                    TO PHONE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">
                                    {log.toPhone || '—'}
                                </td>


                                {/* =================================
                                    REASSIGNED BY
                                ================================= */}

                                <td>

                                    {renderEmployee(
                                        log.reassignedByName,
                                        log.reassignedById
                                    )}

                                </td>


                                {/* =================================
                                    DATE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                    text-sm
                                    text-base-content/70
                                ">
                                    {formatDate(
                                        log.createdAt
                                    )}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default CallReassignmentLogTable