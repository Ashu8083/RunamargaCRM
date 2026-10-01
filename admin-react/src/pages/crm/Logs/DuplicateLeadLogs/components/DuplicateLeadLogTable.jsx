// admin-react/src/pages/Logs/DuplicateLeadLogs/components/DuplicateLeadLogTable.jsx

function DuplicateLeadLogTable({
    logs = [],
}) {

    // =========================================================
    // ROLE LABEL
    // =========================================================

    const getRoleLabel = (role) => {

        const roleLabels = {
            agent: 'Agent',
            rm: 'RM',
            teamlead_agent_business: 'TL',
            teamlead_agent_personal: 'TL',
            teamlead_rm_business: 'TL',
            teamlead_rm_personal: 'TL',
            teamlead: 'TL',
        }

        return (
            roleLabels[role] ||
            role ||
            'N/A'
        )
    }


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (status === 'APPROVED') {
            return `
                text-[#78B300]
                border-[#8BCF00]/50
                bg-[#8BCF00]/10
            `
        }

        if (status === 'REJECTED') {
            return `
                text-error
                border-error/30
                bg-error/10
            `
        }

        return `
            text-base-content/60
            border-base-300
            bg-base-200
        `
    }


    // =========================================================
    // STATUS LABEL
    // =========================================================

    const getStatusLabel = (status) => {

        if (status === 'APPROVED') {
            return 'Approved'
        }

        if (status === 'REJECTED') {
            return 'Rejected'
        }

        return status || 'N/A'
    }


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return 'N/A'
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
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )
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
                        TABLE HEADER
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
                                Lead ID
                            </th>

                            <th>
                                Submitted By
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Reviewed By
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Date
                            </th>

                        </tr>

                    </thead>


                    {/* =================================================
                        TABLE BODY
                    ================================================= */}

                    <tbody>

                        {logs.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="
                                        py-12
                                        text-center
                                    "
                                >

                                    <p className="
                                        text-sm
                                        font-medium
                                    ">
                                        No duplicate lead logs found
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

                            logs.map((log) => (

                                <tr key={log.id}>

                                    {/* =================================
                                        ID
                                    ================================= */}

                                    <td className="
                                        text-center
                                    ">

                                        <span className="
                                            text-sm
                                            text-base-content/70
                                        ">
                                            {log.id}
                                        </span>

                                    </td>


                                    {/* =================================
                                        LEAD ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                            font-medium
                                        ">
                                            {log.leadId}
                                        </span>

                                    </td>


                                    {/* =================================
                                        SUBMITTED BY
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            flex-col
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                            ">
                                                {log.submittedByName ||
                                                    'N/A'}
                                            </span>

                                            <span className="
                                                text-xs
                                                text-base-content/50
                                            ">
                                                {log.submittedById
                                                    ? `(${log.submittedById})`
                                                    : ''}
                                            </span>

                                        </div>

                                    </td>


                                    {/* =================================
                                        SUBMITTED BY ROLE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                        ">
                                            {getRoleLabel(
                                                log.submittedByRole
                                            )}
                                        </span>

                                    </td>


                                    {/* =================================
                                        REVIEWED BY
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            flex-col
                                        ">

                                            <span className="
                                                whitespace-nowrap
                                                text-sm
                                                font-medium
                                            ">
                                                {log.reviewedByName ||
                                                    'N/A'}
                                            </span>

                                            <span className="
                                                text-xs
                                                text-base-content/50
                                            ">
                                                {log.reviewedById
                                                    ? `(${log.reviewedById})`
                                                    : ''}
                                            </span>

                                        </div>

                                    </td>


                                    {/* =================================
                                        REVIEWED BY ROLE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                        ">
                                            {getRoleLabel(
                                                log.reviewedByRole
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
                                            rounded-full
                                            border
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            whitespace-nowrap
                                            ${getStatusClass(
                                                log.status
                                            )}
                                        `}>
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

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default DuplicateLeadLogTable