// admin-react/src/pages/Logs/TeamLeadLogs/components/TeamLeadLogTable.jsx

import ClipboardDocumentListIcon from '@heroicons/react/24/outline/ClipboardDocumentListIcon'


function TeamLeadLogTable({
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


            case 'ACTIVATED':
            case 'ACTIVE':

                return `
                    text-[#78B300]
                    border-[#8BCF00]/40
                    bg-[#8BCF00]/10
                `


            case 'INACTIVE':
            case 'ABSENT':

                return `
                    text-warning
                    border-warning/30
                    bg-warning/10
                `


            case 'DEACTIVATED':
            case 'DELETED':

                return `
                    text-error
                    border-error/30
                    bg-error/10
                `


            case 'PERMISSIONS_ADDED':
            case 'PERMISSIONS_UPDATED':
            case 'PERMISSIONS_REMOVED':

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

        const eventOptionMap = {

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

        }


        return (
            eventOptionMap[event] ||
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

                    <ClipboardDocumentListIcon className="
                        h-9
                        w-9
                        text-base-content/30
                    " />


                    <p className="
                        mt-3
                        text-sm
                        font-medium
                    ">
                        No team lead logs found
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        text-base-content/50
                    ">
                        Try changing your filters and search again.
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
                TABLE HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-base-300
                p-4
            ">

                

                <span className="
                    rounded-full
                    bg-base-200
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-base-content/60
                ">
                    {logs.length} logs
                </span>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

                <table className="table">

                    <thead>

                        <tr>

                            {/* ID */}

                            <th className="
                                w-20
                                text-center
                            ">
                                ID
                            </th>


                            {/* TEAM LEAD */}

                            <th>
                                Team Lead
                            </th>


                            {/* ROLE */}

                            <th>
                                Role
                            </th>


                            {/* ACTION BY */}

                            <th>
                                Action By
                            </th>


                            {/* ACTION ROLE */}

                            <th>
                                Action Role
                            </th>


                            {/* EVENT */}

                            <th>
                                Event
                            </th>


                            {/* DATE */}

                            <th>
                                Date
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {logs.map(
                            (log) => {

                                return (

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
                                                text-base-content/70
                                            ">
                                                {log.id}
                                            </span>

                                        </td>


                                        {/* =================================
                                            TEAM LEAD
                                        ================================= */}

                                        <td>

                                            <div>

                                                <p className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    font-semibold
                                                ">
                                                    {log.teamLeadName ||
                                                        'Unknown'
                                                    }
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.teamLeadEmployeeId ||
                                                        log.teamLeadId ||
                                                        'N/A'
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================
                                            ROLE
                                        ================================= */}

                                        <td>

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/70
                                            ">
                                                {log.teamLeadRole ||
                                                    'Team Lead'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            ACTION BY
                                        ================================= */}

                                        <td>

                                            <div>

                                                <p className="
                                                    whitespace-nowrap
                                                    text-sm
                                                    font-medium
                                                ">
                                                    {log.actionByName ||
                                                        'Unknown'
                                                    }
                                                </p>


                                                <p className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.actionByEmployeeId ||
                                                        log.actionById ||
                                                        'N/A'
                                                    }
                                                </p>

                                            </div>

                                        </td>


                                        {/* =================================
                                            ACTION ROLE
                                        ================================= */}

                                        <td>

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/70
                                            ">
                                                {log.actionByRole ||
                                                    'Admin'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            EVENT
                                        ================================= */}

                                        <td>

                                            <span className={`
                                                inline-flex
                                                items-center
                                                whitespace-nowrap
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
                                            DATE
                                        ================================= */}

                                        <td>

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                text-base-content/70
                                            ">
                                                {log.createdAt ||
                                                    'N/A'
                                                }
                                            </span>

                                        </td>

                                    </tr>

                                )

                            }
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default TeamLeadLogTable