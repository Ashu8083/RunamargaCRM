// admin-react/src/pages/Logs/AgentLogs/components/AgentLogTable.jsx

function AgentLogTable({
    logs = [],
}) {

    // =========================================================
    // ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        const roleLabels = {
            admin:
                'Admin',

            agent:
                'Agent',

            rm:
                'RM',

            teamlead_agent_business:
                'TL',

            teamlead_agent_personal:
                'TL',
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
            CREATED:
                'Created',

            UPDATED:
                'Updated',

            DELETED:
                'Deleted',

            ACTIVATED:
                'Activated',

            INACTIVE:
                'Inactive',

            ABSENT:
                'Absent',

            DEACTIVATED:
                'Deactivated',

            PERMISSIONS_ADDED:
                'Permissions Added',

            PERMISSIONS_UPDATED:
                'Permissions Updated',

            PERMISSIONS_REMOVED:
                'Permissions Removed',

            REPORTS_TO_CHANGED:
                'Reports To Changed',
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
                min-w-0
            ">

                <div className="
                    truncate
                    font-medium
                    text-base-content
                ">
                    {name}
                </div>


                {id !== null &&
                    id !== undefined && (

                    <div className="
                        text-xs
                        text-base-content/50
                    ">
                        {id}
                    </div>

                )}

            </div>

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
                ">

                    <div className="
                        text-center
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content/70
                        ">
                            No agent logs found
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
            w-full
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
                    min-w-[1000px]
                ">

                    {/* =============================================
                        TABLE HEADER
                    ============================================= */}

                    <thead>

                        <tr className="
                            border-b
                            border-base-300
                            bg-base-200/50
                        ">

                            {/* ID */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                ID
                            </th>


                            {/* AGENT */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Agent
                            </th>


                            {/* ROLE */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Role
                            </th>


                            {/* REPORTS TO */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Reports To
                            </th>


                            {/* ACTION BY */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Action By
                            </th>


                            {/* ACTION ROLE */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Action Role
                            </th>


                            {/* EVENT */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Event
                            </th>


                            {/* DATE */}

                            <th className="
                                whitespace-nowrap
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-base-content/70
                            ">
                                Date
                            </th>

                        </tr>

                    </thead>


                    {/* =============================================
                        TABLE BODY
                    ============================================= */}

                    <tbody>

                        {logs.map(
                            (log) => (

                            <tr
                                key={log.id}
                                className="
                                    border-b
                                    border-base-200
                                    last:border-b-0
                                    hover:bg-base-200/30
                                "
                            >

                                {/* =================================
                                    ID
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                    text-sm
                                    font-medium
                                ">
                                    {log.id}
                                </td>


                                {/* =================================
                                    AGENT
                                ================================= */}

                                <td className="
                                    max-w-[190px]
                                ">

                                    {renderEmployee(
                                        log.agentName,
                                        log.agentId
                                    )}

                                </td>


                                {/* =================================
                                    ROLE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">

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
                                    ">
                                        {getRoleLabel(
                                            log.agentRole
                                        )}
                                    </span>

                                </td>


                                {/* =================================
                                    REPORTS TO
                                ================================= */}

                                <td className="
                                    max-w-[180px]
                                ">

                                    {renderEmployee(
                                        log.reportsToName,
                                        log.reportsToId
                                    )}

                                </td>


                                {/* =================================
                                    ACTION BY
                                ================================= */}

                                <td className="
                                    max-w-[180px]
                                ">

                                    {renderEmployee(
                                        log.actionByName,
                                        log.actionById
                                    )}

                                </td>


                                {/* =================================
                                    ACTION ROLE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">

                                    {getRoleLabel(
                                        log.actionByRole
                                    )}

                                </td>


                                {/* =================================
                                    EVENT
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">

                                    <span className="
                                        text-sm
                                        font-medium
                                    ">
                                        {getEventLabel(
                                            log.event
                                        )}
                                    </span>

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


export default AgentLogTable