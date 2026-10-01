// admin-react/src/pages/Logs/EmployeeLogs/components/EmployeeLogTable.jsx

function EmployeeLogTable({
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
                'Team Lead',
            teamlead_agent_personal:
                'Team Lead',
            teamlead_rm_business:
                'Team Lead',
            teamlead_rm_personal:
                'Team Lead',
            admin: 'Admin',
        }

        return (
            roleMap[role] ||
            role
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        )

    }


    // =========================================================
    // FORMAT EVENT
    // =========================================================

    const formatEvent = (event) => {

        if (!event) {
            return '—'
        }

        const eventMap = {
            CREATED: 'Created',
            UPDATED: 'Updated',
            DELETED: 'Deleted',
            ACTIVATED: 'Activated',
            ABSENT: 'Absent',
            DEACTIVATED: 'Deactivated',
            PERMISSIONS_UPDATED:
                'Permissions Updated',
        }

        return (
            eventMap[event] ||
            event
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        )

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
                min-w-0
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
                            No employee logs found
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
                                Employee
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
                                Action By
                            </th>

                            <th className="
                                whitespace-nowrap
                            ">
                                Action Role
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
                                    EMPLOYEE
                                ================================= */}

                                <td>

                                    {renderEmployee(
                                        log.employeeName,
                                        log.employeeId
                                    )}

                                </td>


                                {/* =================================
                                    ROLE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
                                ">

                                    {formatRole(
                                        log.employeeRole
                                    )}

                                </td>


                                {/* =================================
                                    REPORTS TO
                                ================================= */}

                                <td>

                                    {renderEmployee(
                                        log.reportsToName,
                                        log.reportsToId
                                    )}

                                </td>


                                {/* =================================
                                    ACTION BY
                                ================================= */}

                                <td>

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

                                    {formatRole(
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
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-base-200
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                    ">
                                        {formatEvent(
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


export default EmployeeLogTable