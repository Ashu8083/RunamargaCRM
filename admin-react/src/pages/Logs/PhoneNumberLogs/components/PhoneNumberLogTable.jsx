// admin-react/src/pages/Logs/PhoneNumberLogs/components/PhoneNumberLogTable.jsx

function PhoneNumberLogTable({
    logs = [],
}) {

    // =========================================================
    // ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        if (!role) {
            return '—'
        }

        const roleLabels = {
            admin: 'Admin',
            rm: 'RM',
            agent: 'Agent',
            teamlead_agent_business: 'TL',
            teamlead_agent_personal: 'TL',
        }

        return (
            roleLabels[role] ||
            role
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        )

    }


    // =========================================================
    // EVENT LABEL
    // =========================================================

    const getEventLabel = (event) => {

        if (!event) {
            return '—'
        }

        const eventLabels = {
            CREATED: 'Created',
            ASSIGNED: 'Assigned',
            REASSIGNED: 'Reassigned',
            UNASSIGNED: 'Unassigned',
            UPDATED: 'Updated',
            ACTIVATED: 'Activated',
            DEACTIVATED: 'Deactivated',
            TRACKABLE_ENABLED: 'Trackable Enabled',
            TRACKABLE_DISABLED: 'Trackable Disabled',
            DELETED: 'Deleted',
        }

        return (
            eventLabels[event] ||
            event
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        )

    }


    // =========================================================
    // STATUS LABEL
    // =========================================================

    const getStatusLabel = (status) => {

        if (!status) {
            return '—'
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1).toLowerCase()
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
        employeeId
    ) => {

        if (!name) {
            return (
                <span className="
                    text-base-content/40
                ">
                    —
                </span>
            )
        }


        return (
            <div className="
                flex
                flex-col
            ">

                <span className="
                    whitespace-nowrap
                    font-medium
                    text-base-content
                ">
                    {name}
                </span>


                {employeeId && (

                    <span className="
                        text-xs
                        text-base-content/50
                    ">
                        {employeeId}
                    </span>

                )}

            </div>
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
                    min-h-[180px]
                    items-center
                    justify-center
                    px-4
                    py-8
                ">

                    <div className="
                        text-center
                    ">

                        <p className="
                            text-sm
                            font-medium
                            text-base-content
                        ">
                            No phone number logs found
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
            card
            overflow-hidden
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
                ">
                    Phone Number Logs
                </h2>


                <p className="
                    mt-0.5
                    text-xs
                    text-base-content/50
                ">
                    Phone number assignment and activity history.
                </p>

            </div>


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
                                Phone Number
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
                                Status
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Trackable
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

                                    {/* =========================
                                        ID
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                        text-sm
                                        font-medium
                                    ">
                                        {log.id}
                                    </td>


                                    {/* =========================
                                        PHONE NUMBER
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        <span className="
                                            font-medium
                                        ">
                                            {log.phoneNumber || '—'}
                                        </span>

                                    </td>


                                    {/* =========================
                                        ASSIGNED TO
                                    ========================= */}

                                    <td>

                                        {renderEmployee(
                                            log.assignedToName,
                                            log.assignedToId
                                        )}

                                    </td>


                                    {/* =========================
                                        ROLE
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        {getRoleLabel(
                                            log.assignedToRole
                                        )}

                                    </td>


                                    {/* =========================
                                        REPORTS TO
                                    ========================= */}

                                    <td>

                                        {renderEmployee(
                                            log.reportsToName,
                                            log.reportsToId
                                        )}

                                    </td>


                                    {/* =========================
                                        ACTION BY
                                    ========================= */}

                                    <td>

                                        {renderEmployee(
                                            log.actionByName,
                                            log.actionById
                                        )}

                                    </td>


                                    {/* =========================
                                        ACTION ROLE
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        {getRoleLabel(
                                            log.actionByRole
                                        )}

                                    </td>


                                    {/* =========================
                                        EVENT
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        <span className="
                                            inline-flex
                                            items-center
                                            rounded-full
                                            border
                                            border-base-300
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                        ">
                                            {getEventLabel(
                                                log.event
                                            )}
                                        </span>

                                    </td>


                                    {/* =========================
                                        STATUS
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        <span className={`
                                            inline-flex
                                            items-center
                                            rounded-full
                                            border
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            ${
                                                log.status ===
                                                'ACTIVE'
                                                    ? `
                                                        border-success/30
                                                        bg-success/10
                                                        text-success
                                                    `
                                                    : `
                                                        border-base-300
                                                        bg-base-200
                                                        text-base-content/60
                                                    `
                                            }
                                        `}>

                                            {getStatusLabel(
                                                log.status
                                            )}

                                        </span>

                                    </td>


                                    {/* =========================
                                        TRACKABLE
                                    ========================= */}

                                    <td className="
                                        whitespace-nowrap
                                    ">

                                        {log.trackable ? (

                                            <span className="
                                                font-medium
                                            ">
                                                Yes
                                            </span>

                                        ) : (

                                            <span className="
                                                text-base-content/60
                                            ">
                                                No
                                            </span>

                                        )}

                                    </td>


                                    {/* =========================
                                        DATE
                                    ========================= */}

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

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default PhoneNumberLogTable