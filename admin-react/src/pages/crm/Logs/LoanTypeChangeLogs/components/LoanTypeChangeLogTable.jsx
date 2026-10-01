// admin-react/src/pages/Logs/LoanTypeChangeLogs/components/LoanTypeChangeLogTable.jsx


function LoanTypeChangeLogTable({
    logs = [],
}) {


    // =========================================================
    // LOAN TYPE LABEL
    // =========================================================

    const getLoanTypeLabel = (loanType) => {

        const labels = {

            PERSONAL:
                "Personal Loan",

            BUSINESS:
                "Business Loan",

            HOME:
                "Home Loan",

            CAR:
                "Car Loan",

            EDUCATION:
                "Education Loan",

        };


        return (
            labels[loanType] ||
            loanType ||
            "N/A"
        );

    };


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!logs.length) {

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
                    min-h-60
                    flex-col
                    items-center
                    justify-center
                    px-4
                    py-12
                    text-center
                ">

                    <p className="
                        text-sm
                        font-medium
                    ">
                        No loan type change logs found
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

        );

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
                    w-full
                ">

                    <thead>

                        <tr>

                            {/* ID */}

                            <th className="
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


                            {/* ROLE */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Role
                            </th>


                            {/* REPORTS TO */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Reports To
                            </th>


                            {/* FROM */}

                            <th className="
                                whitespace-nowrap
                            ">
                                From Loan Type
                            </th>


                            {/* TO */}

                            <th className="
                                whitespace-nowrap
                            ">
                                To Loan Type
                            </th>


                            {/* DATE */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Date
                            </th>


                            {/* DELETED */}

                            <th className="
                                whitespace-nowrap
                            ">
                                Deleted At
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {logs.map(
                            (log) => (

                                <tr
                                    key={log.id}
                                    className="
                                        hover:bg-base-200/40
                                    "
                                >

                                    {/* =================================
                                        ID
                                    ================================= */}

                                    <td>

                                        <span className="
                                            text-sm
                                            font-medium
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
                                            font-medium
                                        ">
                                            {log.loanId}
                                        </span>

                                    </td>


                                    {/* =================================
                                        CHANGED BY
                                    ================================= */}

                                    <td>

                                        <div className="
                                            flex
                                            min-w-[150px]
                                            flex-col
                                        ">

                                            <span className="
                                                text-sm
                                                font-medium
                                            ">
                                                {
                                                    log.changedByName ||
                                                    "N/A"
                                                }
                                            </span>


                                            {log.changedById && (

                                                <span className="
                                                    text-xs
                                                    text-base-content/50
                                                ">
                                                    ID:{" "}
                                                    {
                                                        log.changedById
                                                    }
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
                                            rounded-full
                                            border
                                            border-base-300
                                            bg-base-200
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            capitalize
                                        ">

                                            {
                                                log.changedByRole ||
                                                "N/A"
                                            }

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
                                                text-sm
                                                font-medium
                                            ">

                                                {
                                                    log.reportsToName ||
                                                    "N/A"
                                                }

                                            </span>


                                            {log.reportsToId && (

                                                <span className="
                                                    text-xs
                                                    text-base-content/50
                                                ">

                                                    ID:{" "}
                                                    {
                                                        log.reportsToId
                                                    }

                                                </span>

                                            )}

                                        </div>

                                    </td>


                                    {/* =================================
                                        FROM LOAN TYPE
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

                                            {
                                                getLoanTypeLabel(
                                                    log.fromLoanType
                                                )
                                            }

                                        </span>

                                    </td>


                                    {/* =================================
                                        TO LOAN TYPE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            inline-flex
                                            whitespace-nowrap
                                            rounded-full
                                            border
                                            border-[#8BCF00]/40
                                            bg-[#8BCF00]/10
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-medium
                                            text-[#78B300]
                                        ">

                                            {
                                                getLoanTypeLabel(
                                                    log.toLoanType
                                                )
                                            }

                                        </span>

                                    </td>


                                    {/* =================================
                                        DATE
                                    ================================= */}

                                    <td>

                                        <span className="
                                            whitespace-nowrap
                                            text-sm
                                        ">

                                            {
                                                formatDate(
                                                    log.createdAt
                                                )
                                            }

                                        </span>

                                    </td>


                                    {/* =================================
                                        DELETED AT
                                    ================================= */}

                                    <td>

                                        <span
                                            className={`
                                                whitespace-nowrap
                                                text-sm
                                                ${
                                                    log.deletedAt
                                                        ? "text-error"
                                                        : "text-base-content/40"
                                                }
                                            `}
                                        >

                                            {
                                                log.deletedAt
                                                    ? formatDate(
                                                        log.deletedAt
                                                    )
                                                    : "—"
                                            }

                                        </span>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}


export default LoanTypeChangeLogTable;