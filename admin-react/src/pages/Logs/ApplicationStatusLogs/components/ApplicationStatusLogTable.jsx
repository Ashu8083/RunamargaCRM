// admin-react/src/pages/Logs/ApplicationStatusLogs/components/ApplicationStatusLogTable.jsx

function ApplicationStatusLogTable({
    logs = [],
}) {

    // =========================================================
    // STATUS LABEL
    // =========================================================

    const getStatusLabel = (status) => {

        const labels = {
            IN_PROCESS: 'In Process',
            LOGIN: 'Login',
            SANCTIONED: 'Sanctioned',
            DISBURSED: 'Disbursed',
            REJECTED: 'Rejected',
        }

        return (
            labels[status] ||
            status ||
            'N/A'
        )
    }


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === 'IN_PROCESS') {

            return `
                border-info/30
                bg-info/10
                text-info
            `
        }


        if (status === 'LOGIN') {

            return `
                border-warning/30
                bg-warning/10
                text-warning
            `
        }


        if (status === 'SANCTIONED') {

            return `
                border-[#8BCF00]/50
                bg-[#8BCF00]/10
                text-[#78B300]
            `
        }


        if (status === 'DISBURSED') {

            return `
                border-success/30
                bg-success/10
                text-success
            `
        }


        if (status === 'REJECTED') {

            return `
                border-error/30
                bg-error/10
                text-error
            `
        }


        return `
            border-base-300
            bg-base-200
            text-base-content/60
        `
    }


    // =========================================================
    // EMPLOYEE ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        const labels = {

            agent:
                'Agent',

            rm:
                'RM',

            teamlead_rm_business:
                'Team Lead RM Business',

            teamlead_agent_business:
                'Team Lead Agent Business',

            teamlead_agent_personal:
                'Team Lead Agent Personal',

        }


        return (
            labels[role] ||
            role ||
            'N/A'
        )
    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateString) => {

        if (!dateString) {
            return '—'
        }


        /*
         * createdAt contains the complete timestamp.
         *
         * Only the date should be displayed in this table.
         *
         * Example:
         *
         * 31 Aug 2026
         */

        const datePart =
            dateString.split(',')[0]


        return datePart || '—'
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


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="
                overflow-x-auto
            ">

                <table className="
                    table
                    w-full
                ">

                    <thead>

                        <tr>

                            {/* ID */}

                            <th className="
                                w-20
                                whitespace-nowrap
                            ">
                                ID
                            </th>


                            {/* LOAN ID */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Loan ID
                            </th>


                            {/* CHANGED BY */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Changed By
                            </th>


                            {/* EMP ROLE */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Emp Role
                            </th>


                            {/* STATUS */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Status
                            </th>


                            {/* DATE */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Date
                            </th>


                            {/* DELETED AT */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Deleted At
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {/* =================================================
                            EMPTY STATE
                        ================================================= */}

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
                                        No application status logs found
                                    </p>


                                    <p className="
                                        mt-1
                                        text-xs
                                        text-base-content/50
                                    ">
                                        Try changing your filters.
                                    </p>

                                </td>

                            </tr>

                        ) : (

                            /* =================================================
                               LOG ROWS
                            ================================================= */

                            logs.map(
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
                                            LOAN ID
                                        ================================= */}

                                        <td>

                                            <span className="
                                                text-sm
                                                font-semibold
                                            ">
                                                {log.loanId}
                                            </span>

                                        </td>


                                        {/* =================================
                                            CHANGED BY
                                        ================================= */}

                                        <td>

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                            ">
                                                {log.changedByName ||
                                                    'N/A'
                                                }
                                            </span>

                                        </td>


                                        {/* =================================
                                            EMP ROLE
                                        ================================= */}

                                        <td>

                                            <span className="
                                                inline-flex
                                                whitespace-nowrap
                                                rounded-md
                                                border
                                                border-base-300
                                                bg-base-200/60
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-base-content/70
                                            ">
                                                {getRoleLabel(
                                                    log.empRole
                                                )}
                                            </span>

                                        </td>


                                        {/* =================================
                                            STATUS
                                        ================================= */}

                                        <td>

                                            <span className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                whitespace-nowrap
                                                rounded-md
                                                border
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                ${getStatusClass(
                                                    log.status
                                                )}
                                            `}>

                                                <span className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-current
                                                " />

                                                {getStatusLabel(
                                                    log.status
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
                                                {formatDate(
                                                    log.createdAt
                                                )}
                                            </span>

                                        </td>


                                        {/* =================================
                                            DELETED AT
                                        ================================= */}

                                        <td>

                                            <span className={`
                                                whitespace-nowrap
                                                text-sm
                                                ${
                                                    log.deletedAt
                                                        ? 'text-error'
                                                        : 'text-base-content/40'
                                                }
                                            `}>
                                                {log.deletedAt
                                                    ? formatDate(
                                                        log.deletedAt
                                                    )
                                                    : '—'
                                                }
                                            </span>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )
}


export default ApplicationStatusLogTable