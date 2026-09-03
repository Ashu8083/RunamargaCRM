// admin-react/src/pages/Logs/ApplicationEditLogs/components/ApplicationEditLogTable.jsx

function ApplicationEditLogTable({
    logs = [],
}) {

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return '—'
        }


        const date =
            new Date(dateValue)


        if (Number.isNaN(date.getTime())) {
            return '—'
        }


        return date.toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )

    }


    // =========================================================
    // FORMAT ROLE
    // =========================================================

    const formatRole = (role) => {

        if (!role) {
            return '—'
        }


        return role
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            )

    }


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!logs.length) {

        return (

            <div className="
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
                            No application edit logs found
                        </p>


                        <p className="
                            mt-1
                            text-xs
                            text-base-content/50
                        ">
                            Try changing your search or filters.
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
                                Loan ID
                            </th>


                            <th className="
                                whitespace-nowrap
                            ">
                                Edited By
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
                                min-w-[280px]
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
                                    hover:bg-base-200/40
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
                                ">

                                    {log.loanId}

                                </td>


                                {/* =================================
                                    EDITED BY
                                ================================= */}

                                <td>

                                    <div className="
                                        flex
                                        min-w-[150px]
                                        flex-col
                                    ">

                                        <span className="
                                            font-medium
                                            text-base-content
                                        ">
                                            {log.editedByName || '—'}
                                        </span>


                                        {log.editedById !==
                                            undefined &&
                                            log.editedById !==
                                            null && (

                                                <span className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.editedById}
                                                </span>

                                            )}

                                    </div>

                                </td>


                                {/* =================================
                                    ROLE
                                ================================= */}

                                <td>

                                    <span className="
                                        inline-flex
                                        whitespace-nowrap
                                        rounded-full
                                        border
                                        border-base-300
                                        bg-base-200
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                    ">

                                        {formatRole(
                                            log.editedByRole
                                        )}

                                    </span>

                                </td>


                                {/* =================================
                                    REPORTS TO
                                ================================= */}

                                <td>

                                    <div className="
                                        flex
                                        min-w-[150px]
                                        flex-col
                                    ">

                                        <span className="
                                            font-medium
                                            text-base-content
                                        ">
                                            {log.reportsToName || '—'}
                                        </span>


                                        {log.reportsToId !==
                                            undefined &&
                                            log.reportsToId !==
                                            null && (

                                                <span className="
                                                    mt-0.5
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    {log.reportsToId}
                                                </span>

                                            )}

                                    </div>

                                </td>


                                {/* =================================
                                    EVENT
                                ================================= */}

                                <td>

                                    <p className="
                                        min-w-[280px]
                                        max-w-[520px]
                                        text-sm
                                        leading-5
                                        text-base-content
                                    ">

                                        {log.event || '—'}

                                    </p>

                                </td>


                                {/* =================================
                                    DATE
                                ================================= */}

                                <td className="
                                    whitespace-nowrap
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


export default ApplicationEditLogTable