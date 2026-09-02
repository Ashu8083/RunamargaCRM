// admin-react/src/pages/Logs/RevertedHistoryLogs/components/RevertedHistoryLogTable.jsx

function RevertedHistoryLogTable({
    logs = [],
}) {

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return '—'
        }

        const date = new Date(value)

        if (Number.isNaN(date.getTime())) {
            return value
        }

        return date.toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
            }
        )

    }


    // =========================================================
    // RENDER
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

            {/* =====================================================
                TABLE HEADER
            ===================================================== */}

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
                    Reverted History Logs
                </h2>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            <div className="
                w-full
                overflow-x-auto
            ">

                <table className="
                    table
                    w-full
                ">

                    {/* =================================================
                        TABLE HEAD
                    ================================================= */}

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Reverted ID
                            </th>

                            <th>
                                Changed Date
                            </th>

                            <th>
                                Previous Reverted Date
                            </th>

                            <th>
                                New Reverted Date
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

                        {logs.length > 0 ? (

                            logs.map((log) => (

                                <tr
                                    key={log.id}
                                    className="
                                        hover:bg-base-200/50
                                    "
                                >

                                    {/* =================================
                                        ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            font-medium
                                        ">
                                            {log.id}
                                        </span>

                                    </td>


                                    {/* =================================
                                        REVERTED ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            font-medium
                                        ">
                                            {log.revertedId || '—'}
                                        </span>

                                    </td>


                                    {/* =================================
                                        CHANGED DATE
                                    ================================= */}

                                    <td>

                                        {formatDate(
                                            log.changedDate
                                        )}

                                    </td>


                                    {/* =================================
                                        PREVIOUS REVERTED DATE
                                    ================================= */}

                                    <td>

                                        {formatDate(
                                            log.previousRevertedDate
                                        )}

                                    </td>


                                    {/* =================================
                                        NEW REVERTED DATE
                                    ================================= */}

                                    <td>

                                        {formatDate(
                                            log.newRevertedDate
                                        )}

                                    </td>


                                    {/* =================================
                                        DATE
                                    ================================= */}

                                    <td>

                                        {formatDate(
                                            log.createdAt
                                        )}

                                    </td>

                                </tr>

                            ))

                        ) : (

                            /* =========================================
                               EMPTY STATE
                            ========================================= */

                            <tr>

                                <td
                                    colSpan={6}
                                    className="
                                        py-10
                                        text-center
                                        text-sm
                                        text-base-content/50
                                    "
                                >
                                    No reverted history logs found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    )

}


export default RevertedHistoryLogTable