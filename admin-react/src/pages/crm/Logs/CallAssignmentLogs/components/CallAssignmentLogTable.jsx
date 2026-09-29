// admin-react/src/pages/Logs/CallAssignmentLogs/components/CallAssignmentLogTable.jsx

function CallAssignmentLogTable({
    logs,
}) {

    // =========================================================
    // ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        const roleLabels = {
            agent: 'Agent',
            rm: 'RM',
            teamlead_agent_business:
                'TL - Agent Business',
            teamlead_agent_personal:
                'TL - Agent Personal',
            teamlead_rm_business:
                'TL - RM Business',
            teamlead_rm_personal:
                'TL - RM Personal',
        }


        return (
            roleLabels[role] ||
            role ||
            '—'
        )

    }


    // =========================================================
    // EVENT LABEL
    // =========================================================

    const getEventLabel = (event) => {

        const eventLabels = {
            ASSIGNED: 'Assigned',
            DELETED: 'Deleted',
        }


        return (
            eventLabels[event] ||
            event ||
            '—'
        )

    }


    // =========================================================
    // DATE FORMAT
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
    // EMPTY STATE
    // =========================================================

    if (!logs || logs.length === 0) {

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
                    border-b
                    border-base-300
                    px-4
                    py-4
                ">

                    <h2 className="
                        text-base
                        font-semibold
                    ">
                        Call Assignment Logs
                    </h2>

                </div>


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
                            No call assignment logs found
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            text-base-content/50
                        ">
                            Try changing or resetting your filters.
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
                RESPONSIVE TABLE WRAPPER
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
                                Assigned To
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Role
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Reports To
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Assigned Phone
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Assigned By
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Event
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
                                        hover:bg-base-200/50
                                    "
                                >

                                    {/* =============================
                                        ID
                                    ============================= */}

                                    <td className="
                                        whitespace-nowrap
                                        font-medium
                                    ">
                                        {log.id}
                                    </td>


                                    {/* =============================
                                        CUSTOMER PHONE
                                    ============================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">
                                        {log.customerPhone || '—'}
                                    </td>


                                    {/* =============================
                                        ASSIGNED TO
                                    ============================= */}

                                    <td>

                                        <div className="
                                            min-w-[150px]
                                        ">

                                            <div className="
                                                font-medium
                                                text-base-content
                                            ">
                                                {log.assignedToName ||
                                                    '—'}
                                            </div>


                                            {log.assignedToId && (

                                                <div className="
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.assignedToId}
                                                </div>

                                            )}

                                        </div>

                                    </td>


                                    {/* =============================
                                        ROLE
                                    ============================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">
                                        {getRoleLabel(
                                            log.assignedToRole
                                        )}
                                    </td>


                                    {/* =============================
                                        REPORTS TO
                                    ============================= */}

                                    <td>

                                        <div className="
                                            min-w-[140px]
                                        ">

                                            <div className="
                                                font-medium
                                                text-base-content
                                            ">
                                                {log.reportsToName ||
                                                    '—'}
                                            </div>


                                            {log.reportsToId && (

                                                <div className="
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.reportsToId}
                                                </div>

                                            )}

                                        </div>

                                    </td>


                                    {/* =============================
                                        ASSIGNED PHONE
                                    ============================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">
                                        {log.assignedPhone || '—'}
                                    </td>


                                    {/* =============================
                                        ASSIGNED BY
                                    ============================= */}

                                    <td>

                                        <div className="
                                            min-w-[140px]
                                        ">

                                            <div className="
                                                font-medium
                                                text-base-content
                                            ">
                                                {log.assignedByName ||
                                                    '—'}
                                            </div>


                                            {log.assignedById && (

                                                <div className="
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.assignedById}
                                                </div>

                                            )}

                                        </div>

                                    </td>


                                    {/* =============================
                                        EVENT
                                    ============================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                ${
                                                    log.event ===
                                                    'ASSIGNED'
                                                        ? `
                                                            bg-success/10
                                                            text-success
                                                        `
                                                        : `
                                                            bg-error/10
                                                            text-error
                                                        `
                                                }
                                            `}
                                        >
                                            {getEventLabel(
                                                log.event
                                            )}
                                        </span>

                                    </td>


                                    {/* =============================
                                        DATE
                                    ============================= */}

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


export default CallAssignmentLogTable