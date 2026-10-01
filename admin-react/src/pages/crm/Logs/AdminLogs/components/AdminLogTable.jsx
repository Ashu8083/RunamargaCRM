// admin-react/src/pages/Logs/AdminLogs/components/AdminLogTable.jsx

function AdminLogTable({
    logs = [],
}) {

    // =========================================================
    // EVENT CLASS
    // =========================================================

    const getEventClass = (event) => {

        switch (event) {

            case 'CREATED':

                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                `


            case 'UPDATED':

                return `
                    text-info
                    border-info/30
                    bg-info/10
                `


            case 'DELETED':

                return `
                    text-error
                    border-error/30
                    bg-error/10
                `


            case 'ACTIVE':

                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                `


            case 'ABSENT':

                return `
                    text-warning
                    border-warning/30
                    bg-warning/10
                `


            case 'DEACTIVATED':

                return `
                    text-error
                    border-error/30
                    bg-error/10
                `


            case 'PERMISSIONS_UPDATED':

                return `
                    text-secondary
                    border-secondary/30
                    bg-secondary/10
                `


            default:

                return `
                    text-base-content/60
                    border-base-300
                    bg-base-200
                `

        }

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

            ACTIVE:
                'Active',

            ABSENT:
                'Absent',

            DEACTIVATED:
                'Deactivated',

            PERMISSIONS_UPDATED:
                'Permissions Updated',

        }


        return (
            eventLabels[event] ||
            event ||
            'Unknown'
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
                    py-16
                    text-center
                ">

                    <p className="
                        text-sm
                        font-medium
                    ">
                        No admin logs found
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
                ">

                    <thead>

                        <tr>

                            {/* =================================
                                ID
                            ================================= */}

                            <th className="
                                w-20
                            ">
                                ID
                            </th>


                            {/* =================================
                                EMPLOYEE
                            ================================= */}

                            <th>
                                Employee
                            </th>


                            {/* =================================
                                PERFORMED BY
                            ================================= */}

                            <th>
                                Performed By
                            </th>


                            {/* =================================
                                EVENT
                            ================================= */}

                            <th>
                                Event
                            </th>


                            {/* =================================
                                CREATED AT
                            ================================= */}

                            <th>
                                Created At
                            </th>


                            {/* =================================
                                DELETED AT
                            ================================= */}

                            <th>
                                Deleted At
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
                                        EMPLOYEE
                                        
                                        Display name, not employee ID.
                                    ================================= */}

                                    <td>

                                        <div>

                                            <p className="
                                                text-sm
                                                font-medium
                                            ">
                                                {log.employeeName ||
                                                    log.employee?.name ||
                                                    '—'
                                                }
                                            </p>

                                        </div>

                                    </td>


                                    {/* =================================
                                        PERFORMED BY
                                        
                                        Display admin name, not admin ID.
                                    ================================= */}

                                    <td>

                                        <div>

                                            <p className="
                                                text-sm
                                                font-medium
                                            ">
                                                {log.performedByName ||
                                                    log.performedBy?.name ||
                                                    '—'
                                                }
                                            </p>

                                        </div>

                                    </td>


                                    {/* =================================
                                        EVENT
                                    ================================= */}

                                    <td>

                                        <span className={`
                                            inline-flex
                                            items-center
                                            rounded-full
                                            border
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            ${getEventClass(
                                                log.event
                                            )}
                                        `}>

                                            <span className="
                                                mr-1.5
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-current
                                            " />

                                            {getEventLabel(
                                                log.event
                                            )}

                                        </span>

                                    </td>


                                    {/* =================================
                                        CREATED AT
                                        
                                        Only one date column is shown.
                                        This represents created_at.
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                            text-base-content/70
                                        ">
                                            {log.createdAt ||
                                                log.created_at ||
                                                '—'
                                            }
                                        </span>

                                    </td>


                                    {/* =================================
                                        DELETED AT
                                        
                                        Normally NULL / empty.
                                    ================================= */}

                                    <td>

                                        {log.deletedAt ||
                                        log.deleted_at ? (

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-error
                                            ">
                                                {log.deletedAt ||
                                                    log.deleted_at
                                                }
                                            </span>

                                        ) : (

                                            <span className="
                                                text-sm
                                                text-base-content/40
                                            ">
                                                —
                                            </span>

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


export default AdminLogTable