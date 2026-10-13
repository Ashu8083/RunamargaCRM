// admin-react/src/pages/crm/Logs/AgentLogs/index.jsx

import { useEffect, useMemo, useState, useCallback } from "react";
import { getAgentAuditLogs } from "./Api";

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

import AgentLogTable from "./components/AgentLogTable";
import EmployeeDropdown from "../../../../components/GlobalModels/Filters/EmployeeDropdown";

function AgentLogs() {
    const [logs, setLogs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // EVENT OPTIONS
    // =========================================================
    const eventOptions = [
        { id: "", name: "All Events" },
        { id: "CREATED", name: "Created" },
        { id: "UPDATED", name: "Updated" },
        { id: "DELETED", name: "Deleted" },
        { id: "ACTIVATED", name: "Activated" },
        { id: "ACTIVE", name: "Active" },
        { id: "INACTIVE", name: "Inactive" },
        { id: "ABSENT", name: "Absent" },
        { id: "DEACTIVATED", name: "Deactivated" },
        { id: "PERMISSIONS_ADDED", name: "Permissions Added" },
        { id: "PERMISSIONS_UPDATED", name: "Permissions Updated" },
        { id: "PERMISSIONS_REMOVED", name: "Permissions Removed" },
        { id: "REPORTS_TO_CHANGED", name: "Reports To Changed" },
    ];

    const eventMap = {
        create: "CREATED",
        created: "CREATED",
        update: "UPDATED",
        updated: "UPDATED",
        delete: "DELETED",
        deleted: "DELETED",
        activate: "ACTIVATED",
        activated: "ACTIVATED",
        active: "ACTIVE",
        inactive: "INACTIVE",
        absent: "ABSENT",
        deactivated: "DEACTIVATED",
        permissions_added: "PERMISSIONS_ADDED",
        permission_added: "PERMISSIONS_ADDED",
        permissions_updated: "PERMISSIONS_UPDATED",
        permission_updated: "PERMISSIONS_UPDATED",
        permissions_removed: "PERMISSIONS_REMOVED",
        permission_removed: "PERMISSIONS_REMOVED",
        reports_to_changed: "REPORTS_TO_CHANGED",
    };

    const normalizeEvent = (action) => {
        const value = String(action ?? "").trim().toLowerCase();
        return eventMap[value] || value.toUpperCase() || "UNKNOWN";
    };

    // =========================================================
    // FETCH LOGS
    // =========================================================
    const fetchAgentLogs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getAgentAuditLogs({
                skip: 0,
                limit: 500,
            });

            const records = Array.isArray(response)
                ? response
                : Array.isArray(response?.items)
                    ? response.items
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

            const mappedLogs = records.map((log) => ({
                id: log.id,
                agentId: log.agent_id ?? log.agentId ?? null,
                agentName: log.agent_name ?? log.agentName ?? "",
                agentRole: log.agent_role ?? log.agentRole ?? "",
                reportsToId: log.report_to_id ?? log.reports_to_id ?? null,
                reportsToName: log.report_to_name ?? log.reports_to_name ?? "",
                actionById: log.action_by_id ?? log.actionById ?? null,
                actionByName: log.performer_name ?? log.action_by_name ?? log.actionByName ?? "",
                actionByRole: log.action_by_role ?? log.actionByRole ?? "",
                event: normalizeEvent(log.action),
                createdAt: log.date_and_time ?? log.created_at ?? null,
                deletedAt: log.deleted_at ?? null,
            }));

            // Build dropdown options from actual log data. Keep IDs available
            // even if the API has not returned a corresponding name.
            const employeeMap = new Map();
            mappedLogs.forEach((log) => {
                [
                    { id: log.agentId, name: log.agentName, prefix: "Agent" },
                    { id: log.actionById, name: log.actionByName, prefix: "Employee" },
                    { id: log.reportsToId, name: log.reportsToName, prefix: "Employee" },
                ].forEach(({ id, name, prefix }) => {
                    if (id === null || id === undefined || id === "") return;
                    const key = String(id);
                    const cleanName = String(name ?? "").trim();
                    const displayName =
                        cleanName && cleanName !== "—"
                            ? cleanName
                            : `${prefix} #${key}`;

                    if (!employeeMap.has(key) || displayName !== `${prefix} #${key}`) {
                        employeeMap.set(key, {
                            id,
                            employeeId: key,
                            name: displayName,
                        });
                    }
                });
            });

            setLogs(mappedLogs);
            setEmployees(
                Array.from(employeeMap.values()).sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
            );
        } catch (err) {
            console.error("Failed to fetch agent audit logs:", err);
            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to load agent audit logs."
            );
            setLogs([]);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgentLogs();
    }, [fetchAgentLogs]);

    // =========================================================
    // FILTER STATE
    // =========================================================
    const [search, setSearch] = useState("");
    const [agentId, setAgentId] = useState("");
    const [actionById, setActionById] = useState("");
    const [event, setEvent] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // =========================================================
    // PAGINATION
    // =========================================================
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // =========================================================
    // FILTER LOGS
    // =========================================================
    const filteredLogs = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return logs.filter((log) => {
            const matchesSearch =
                !searchValue ||
                [
                    log.agentName,
                    log.agentId,
                    log.actionByName,
                    log.actionById,
                    log.reportsToName,
                    log.reportsToId,
                    log.id,
                    log.event,
                    log.agentRole,
                    log.actionByRole,
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(searchValue)
                );

            const matchesAgent =
                !agentId || String(log.agentId ?? "") === String(agentId);

            const matchesActionBy =
                !actionById || String(log.actionById ?? "") === String(actionById);

            const matchesEvent = !event || log.event === event;

            const logDate = log.createdAt ? new Date(log.createdAt) : null;
            const hasValidDate = logDate && !Number.isNaN(logDate.getTime());

            const startDate = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
            const endDate = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

            const matchesFromDate =
                !startDate || (hasValidDate && logDate >= startDate);

            const matchesToDate =
                !endDate || (hasValidDate && logDate <= endDate);

            return (
                matchesSearch &&
                matchesAgent &&
                matchesActionBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [logs, search, agentId, actionById, event, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedLogs = filteredLogs.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    );

    // =========================================================
    // RESET FILTERS
    // =========================================================
    const handleReset = () => {
        setSearch("");
        setAgentId("");
        setActionById("");
        setEvent("");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleAgentChange = (value) => {
        setAgentId(value ?? "");
        setCurrentPage(1);
    };

    const handleActionByChange = (value) => {
        setActionById(value ?? "");
        setCurrentPage(1);
    };

    const handleEventChange = (event) => {
        setEvent(event.target.value);
        setCurrentPage(1);
    };

    const handleFromDateChange = (event) => {
        setFromDate(event.target.value);
        setCurrentPage(1);
    };

    const handleToDateChange = (event) => {
        setToDate(event.target.value);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchAgentLogs();
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // =========================================================
    // RENDER — original Agent Logs design preserved
    // =========================================================
    return (
        <div className="space-y-5 p-4 sm:p-6">
            {/* PAGE HEADER */}
            <div>
                <h1 className="text-2xl font-semibold">Agent Logs</h1>
                <p className="mt-1 text-sm text-base-content/60">
                    View agent activity and account history.
                </p>
            </div>

            {/* FILTER CARD */}
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-4">
                    {/* FIRST ROW — SEARCH + DROPDOWNS */}
                    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">
                        {/* SEARCH */}
                        <div className="min-w-0 xl:col-span-4">
                            <label className="input input-bordered flex w-full items-center gap-3">
                                <SearchIcon className="h-4 w-4 shrink-0 text-base-content/40" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => handleSearchChange(event.target.value)}
                                    placeholder="Search agent / ID..."
                                    className="min-w-0 grow"
                                />
                            </label>
                        </div>

                        {/* EVENT */}
                        <div className="min-w-0 xl:col-span-3">
                            <select
                                value={event}
                                onChange={handleEventChange}
                                className="select select-bordered w-full"
                            >
                                {eventOptions.map((option) => (
                                    <option key={option.id || "all-events"} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                                {[...new Set(logs.map((log) => log.event))]
                                    .filter((value) => value && !eventOptions.some((option) => option.id === value))
                                    .sort()
                                    .map((value) => (
                                        <option key={value} value={value}>
                                            {value.replaceAll("_", " ")}
                                        </option>
                                    ))}
                            </select>
                        </div>
                         {/* FROM DATE */}
                        <div className="min-w-0 sm:col-span-1 lg:col-span-2">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                max={toDate || undefined}
                                className="input input-bordered w-full"
                                title="From date"
                            />
                        </div>
                          {/* TO DATE */}
                        <div className="min-w-0 sm:col-span-1 lg:col-span-2">
                            <input
                                type="date"
                                value={toDate}
                                onChange={handleToDateChange}
                                min={fromDate || undefined}
                                className="input input-bordered w-full"
                                title="To date"
                            />
                        </div>
                    </div>

                    {/* SECOND ROW — DATES + ACTIONS */}
                    <div className="mt-3 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                       

                      

                        {/* ACTIONS */}
                        <div className="flex min-w-0 sm:col-span-2 lg:col-span-3">
                            <div className="flex w-full items-center overflow-hidden rounded-lg border border-base-300 lg:w-auto">
                                {/* RESET */}
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn btn-ghost flex-1 rounded-none border-0 sm:flex-none"
                                >
                                    Reset
                                </button>

                                <div className="h-6 w-px shrink-0 bg-base-300" />

                                {/* REFRESH */}
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="btn btn-ghost flex-1 rounded-none border-0 sm:flex-none"
                                    title="Refresh logs"
                                >
                                    <ArrowPathIcon className="h-4 w-4" />
                                    <span>{loading ? "Loading..." : "Refresh"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div role="alert" className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {/* TABLE */}
            {loading && logs.length === 0 ? (
                <div className="py-8 text-center text-sm text-base-content/60">
                    Loading agent audit logs...
                </div>
            ) : (
                <AgentLogTable logs={paginatedLogs} />
            )}

            {/* PAGINATION */}
            {filteredLogs.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-4 py-3 sm:flex-row">
                    {/* RESULT INFO */}
                    <p className="text-xs text-base-content/60">
                        Showing{" "}
                        <span className="font-medium text-base-content">
                            {(safeCurrentPage - 1) * pageSize + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-base-content">
                            {Math.min(safeCurrentPage * pageSize, filteredLogs.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-base-content">
                            {filteredLogs.length}
                        </span>{" "}
                        logs
                    </p>

                    {/* PAGINATION CONTROLS */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={safeCurrentPage === 1}
                            onClick={() => handlePageChange(safeCurrentPage - 1)}
                            className="btn btn-sm btn-ghost"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`btn btn-sm ${
                                    safeCurrentPage === page
                                        ? "border-[#8BCF00] bg-[#8BCF00] text-white hover:border-[#6FA800] hover:bg-[#6FA800]"
                                        : "btn-ghost"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => handlePageChange(safeCurrentPage + 1)}
                            className="btn btn-sm btn-ghost"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AgentLogs;
