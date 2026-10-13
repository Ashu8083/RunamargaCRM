function CallReassignmentLogTable({ logs = [] }) {
    // ---------------------------------------------------------
    // FORMAT DATE
    // ---------------------------------------------------------
    const formatDate = (dateString) => {
        if (!dateString) return "—";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) return "—";

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // ---------------------------------------------------------
    // EMPLOYEE DISPLAY
    // Shows employee name when available, otherwise employee ID.
    // ---------------------------------------------------------
    const renderEmployee = (name, employeeId) => {
        const displayName =
            name && String(name).trim() !== ""
                ? name
                : employeeId !== null && employeeId !== undefined
                  ? `Employee ${employeeId}`
                  : "—";

        return (
            <div className="flex flex-col">
                <span className="whitespace-nowrap font-medium">
                    {displayName}
                </span>

                {employeeId !== null &&
                    employeeId !== undefined &&
                    employeeId !== "" && (
                        <span className="text-xs text-base-content/50">
                            ID: {employeeId}
                        </span>
                    )}
            </div>
        );
    };

    // ---------------------------------------------------------
    // GET FIELD VALUE
    // Supports both snake_case API fields and camelCase fields.
    // ---------------------------------------------------------
    const getValue = (...values) => {
        return values.find(
            (value) =>
                value !== null &&
                value !== undefined &&
                value !== ""
        ) ?? "—";
    };

    // ---------------------------------------------------------
    // EMPTY STATE
    // ---------------------------------------------------------
    if (!Array.isArray(logs) || logs.length === 0) {
        return (
            <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
                <div className="flex min-h-[220px] items-center justify-center px-4 py-10">
                    <div className="text-center">
                        <p className="text-sm font-medium text-base-content/70">
                            No call reassignment logs found
                        </p>

                        <p className="mt-1 text-xs text-base-content/50">
                            Try changing your filters.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------
    // TABLE
    // ---------------------------------------------------------
    return (
        <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
            <div className="w-full overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="whitespace-nowrap">
                                ID
                            </th>

                            <th className="whitespace-nowrap">
                                Customer Phone
                            </th>

                            <th className="whitespace-nowrap">
                                From RM
                            </th>

                            <th className="whitespace-nowrap">
                                From Phone
                            </th>

                            <th className="whitespace-nowrap">
                                To RM
                            </th>

                            <th className="whitespace-nowrap">
                                To Phone
                            </th>

                            <th className="whitespace-nowrap">
                                Reassigned By
                            </th>

                            <th className="whitespace-nowrap">
                                Action
                            </th>

                            <th className="whitespace-nowrap">
                                Date & Time
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {logs.map((log) => {
                            // -----------------------------------------
                            // CUSTOMER
                            // -----------------------------------------
                            const customerPhone = getValue(
                                log.customer_phone,
                                log.customerPhone
                            );

                            // -----------------------------------------
                            // PREVIOUS ASSIGNEE
                            // -----------------------------------------
                            const fromRmId = getValue(
                                log.from_assigned_to_id,
                                log.from_assigned_to,
                                log.fromRmId
                            );

                            const fromRmName = getValue(
                                log.from_assigned_to_name,
                                log.from_rm_name,
                                log.fromRmName
                            );

                            const fromPhone = getValue(
                                log.assigned_from_phone,
                                log.assignedFromPhone,
                                log.fromPhone,
                                log.from_phone
                            );

                            // -----------------------------------------
                            // NEW ASSIGNEE
                            // -----------------------------------------
                            const toRmId = getValue(
                                log.to_assigned_to_id,
                                log.to_assigned_to,
                                log.toRmId
                            );

                            const toRmName = getValue(
                                log.to_assigned_to_name,
                                log.to_rm_name,
                                log.toRmName
                            );

                            const toPhone = getValue(
                                log.assigned_to_phone,
                                log.assignedToPhone,
                                log.toPhone,
                                log.to_phone
                            );

                            // -----------------------------------------
                            // PERSON WHO PERFORMED REASSIGNMENT
                            // -----------------------------------------
                            const reassignedById = getValue(
                                log.reassigned_by_id,
                                log.reassignedById
                            );

                            const reassignedByName = getValue(
                                log.reassigned_by_name,
                                log.reassignedByName
                            );

                            // -----------------------------------------
                            // DATE & ACTION
                            // -----------------------------------------
                            const action = getValue(log.action);

                            const dateTime =
                                log.date_and_time ??
                                log.createdAt ??
                                log.created_at;

                            return (
                                <tr
                                    key={log.id}
                                    className="hover:bg-base-200/50"
                                >
                                    {/* ID */}
                                    <td className="whitespace-nowrap font-medium">
                                        {getValue(log.id)}
                                    </td>

                                    {/* CUSTOMER PHONE */}
                                    <td className="whitespace-nowrap">
                                        {customerPhone}
                                    </td>

                                    {/* FROM RM */}
                                    <td>
                                        {renderEmployee(
                                            fromRmName !== "—"
                                                ? fromRmName
                                                : null,
                                            fromRmId !== "—"
                                                ? fromRmId
                                                : null
                                        )}
                                    </td>

                                    {/* FROM PHONE */}
                                    <td className="whitespace-nowrap">
                                        {fromPhone}
                                    </td>

                                    {/* TO RM */}
                                    <td>
                                        {renderEmployee(
                                            toRmName !== "—"
                                                ? toRmName
                                                : null,
                                            toRmId !== "—"
                                                ? toRmId
                                                : null
                                        )}
                                    </td>

                                    {/* TO PHONE */}
                                    <td className="whitespace-nowrap">
                                        {toPhone}
                                    </td>

                                    {/* REASSIGNED BY */}
                                    <td>
                                        {renderEmployee(
                                            reassignedByName !== "—"
                                                ? reassignedByName
                                                : null,
                                            reassignedById !== "—"
                                                ? reassignedById
                                                : null
                                        )}
                                    </td>

                                    {/* ACTION */}
                                    <td className="whitespace-nowrap">
                                        {action}
                                    </td>

                                    {/* DATE & TIME */}
                                    <td className="whitespace-nowrap text-sm text-base-content/70">
                                        {formatDate(dateTime)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CallReassignmentLogTable;