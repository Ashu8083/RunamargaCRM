import { useCallback, useEffect, useMemo, useState } from "react";

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

import TeamLeadLogTable from "./components/TeamLeadLogTable";
import EmployeeDropdown from "../../../../components/GlobalModels/Filters/EmployeeDropdown";
import TeamLeadDropdown from "../../../../components/GlobalModels/Filters/TeamLeadDropdown";
import { getTeamLeadAuditLogs } from "./Api";

function TeamLeadLogs() {
    const [logs, setLogs] = useState([]);
    const [teamLeads, setTeamLeads] = useState([]);
    const [actionByUsers, setActionByUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const [search, setSearch] = useState("");
    const [teamLeadId, setTeamLeadId] = useState("");
    const [actionById, setActionById] = useState("");
    const [event, setEvent] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchTeamLeadLogs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getTeamLeadAuditLogs({ skip: 0, limit: 500 });
            const records = Array.isArray(response)
                ? response
                : Array.isArray(response?.items)
                    ? response.items
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

            const mappedLogs = records.map((log) => ({
                id: log.id,
                teamLeadId: log.team_lead_id ?? log.teamLeadId ?? null,
                teamLeadName:
                    log.team_lead_name ?? log.agent_name ?? log.teamLeadName ?? "",
                teamLeadEmployeeId:
                    log.team_lead_employee_id ?? log.teamLeadEmployeeId ??
                    (log.team_lead_id ?? log.teamLeadId ?? ""),
                teamLeadRole: log.team_lead_role ?? log.teamLeadRole ?? "Team Lead",
                actionById: log.action_by_id ?? log.actionById ?? null,
                actionByName:
                    log.performer_name ?? log.action_by_name ?? log.actionByName ?? "",
                actionByEmployeeId:
                    log.action_by_employee_id ?? log.actionByEmployeeId ??
                    (log.action_by_id ?? log.actionById ?? ""),
                actionByRole: log.action_by_role ?? log.actionByRole ?? "",
                reportToId: log.report_to_id ?? log.reportToId ?? null,
                reportToName: log.report_to_name ?? log.reportToName ?? "",
                event: normalizeEvent(log.action),
                createdAt: log.date_and_time
                    ? new Date(log.date_and_time).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })
                    : "N/A",
                deletedAt: log.deleted_at ?? null,
            }));

            // Build filter dropdowns from real API records rather than mock data.
            const teamLeadMap = new Map();
            const actionByMap = new Map();

            mappedLogs.forEach((log) => {
                if (log.teamLeadId !== null && log.teamLeadId !== undefined && log.teamLeadId !== "") {
                    const id = String(log.teamLeadId);
                    const name = String(log.teamLeadName ?? "").trim();
                    teamLeadMap.set(id, {
                        id: log.teamLeadId,
                        name: name || `Team Lead #${id}`,
                        employeeId: String(log.teamLeadEmployeeId || id),
                        role: log.teamLeadRole || "Team Lead",
                    });
                }

                if (log.actionById !== null && log.actionById !== undefined && log.actionById !== "") {
                    const id = String(log.actionById);
                    const name = String(log.actionByName ?? "").trim();
                    actionByMap.set(id, {
                        id: log.actionById,
                        name: name || `Employee #${id}`,
                        employeeId: String(log.actionByEmployeeId || id),
                        role: log.actionByRole || "Employee",
                    });
                }
            });

            setLogs(mappedLogs);
            setTeamLeads(Array.from(teamLeadMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
            setActionByUsers(Array.from(actionByMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
        } catch (err) {
            console.error("Failed to fetch team lead audit logs:", err);
            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to load team lead audit logs."
            );
            setLogs([]);
            setTeamLeads([]);
            setActionByUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeamLeadLogs();
    }, [fetchTeamLeadLogs]);

    const filteredLogs = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return logs.filter((log) => {
            const matchesSearch =
                !searchValue ||
                [
                    log.teamLeadName,
                    log.teamLeadEmployeeId,
                    log.teamLeadId,
                    log.actionByName,
                    log.actionByEmployeeId,
                    log.actionById,
                    log.reportToName,
                    log.reportToId,
                    log.id,
                    log.event,
                    log.teamLeadRole,
                    log.actionByRole,
                ].some((value) => String(value ?? "").toLowerCase().includes(searchValue));

            const matchesTeamLead = !teamLeadId || String(log.teamLeadId ?? "") === String(teamLeadId);
            const matchesActionBy = !actionById || String(log.actionById ?? "") === String(actionById);
            const matchesEvent = !event || log.event === event;

            const logDate = log.createdAt ? new Date(log.createdAt) : null;
            const hasValidDate = logDate && !Number.isNaN(logDate.getTime());
            const startDate = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
            const endDate = toDate ? new Date(`${toDate}T23:59:59.999`) : null;
            const matchesFromDate = !startDate || (hasValidDate && logDate >= startDate);
            const matchesToDate = !endDate || (hasValidDate && logDate <= endDate);

            return (
                matchesSearch &&
                matchesTeamLead &&
                matchesActionBy &&
                matchesEvent &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [logs, search, teamLeadId, actionById, event, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedLogs = filteredLogs.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    );

    const handleReset = () => {
        setSearch("");
        setTeamLeadId("");
        setActionById("");
        setEvent("");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchTeamLeadLogs();
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="space-y-5 p-4 sm:p-6">
            <div>
                <h1 className="text-2xl font-semibold">Team Lead Logs</h1>
                <p className="mt-1 text-sm text-base-content/60">
                    View team lead activity and account history.
                </p>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body p-4">
                    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">
                        <div className="min-w-0 xl:col-span-4">
                            <label className="input input-bordered flex w-full items-center gap-3">
                                <SearchIcon className="h-4 w-4 shrink-0 text-base-content/40" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                    placeholder="Search team lead / ID..."
                                    className="min-w-0 grow"
                                />
                            </label>
                        </div>

                        <div className="relative z-30 min-w-0 xl:col-span-2">
                            <TeamLeadDropdown
                                label=""
                                value={teamLeadId}
                                onChange={(value) => { setTeamLeadId(value ?? ""); setCurrentPage(1); }}
                                options={teamLeads}
                                allLabel="All Team Leads"
                                placeholder="All Team Leads"
                            />
                        </div>

                        <div className="relative z-20 min-w-0 xl:col-span-2">
                            <EmployeeDropdown
                                label=""
                                value={actionById}
                                onChange={(value) => { setActionById(value ?? ""); setCurrentPage(1); }}
                                options={actionByUsers}
                                allLabel="All Action By"
                                placeholder="All Action By"
                            />
                        </div>

                        <div className="min-w-0 xl:col-span-2">
                            <select
                                value={event}
                                onChange={(e) => { setEvent(e.target.value); setCurrentPage(1); }}
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
                                        <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="min-w-0 xl:col-span-1">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                                max={toDate || undefined}
                                className="input input-bordered w-full"
                                title="From date"
                                aria-label="From date"
                            />
                        </div>

                        <div className="min-w-0 xl:col-span-1">
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
                                min={fromDate || undefined}
                                className="input input-bordered w-full"
                                title="To date"
                                aria-label="To date"
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row">
                        <div className="flex w-full items-center overflow-hidden rounded-lg border border-base-300 sm:w-auto">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="btn btn-ghost flex-1 rounded-none border-0 sm:flex-none"
                            >
                                Reset
                            </button>
                            <div className="h-6 w-px shrink-0 bg-base-300" />
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

            {error && (
                <div role="alert" className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {loading && logs.length === 0 ? (
                <div className="py-8 text-center text-sm text-base-content/60">
                    Loading team lead audit logs...
                </div>
            ) : (
                <TeamLeadLogTable logs={paginatedLogs} />
            )}

            {filteredLogs.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-4 py-3 sm:flex-row">
                    <p className="text-xs text-base-content/60">
                        Showing <span className="font-medium text-base-content">{(safeCurrentPage - 1) * pageSize + 1}</span>{" "}
                        to <span className="font-medium text-base-content">{Math.min(safeCurrentPage * pageSize, filteredLogs.length)}</span>{" "}
                        of <span className="font-medium text-base-content">{filteredLogs.length}</span> logs
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            disabled={safeCurrentPage === 1}
                            onClick={() => handlePageChange(safeCurrentPage - 1)}
                            className="btn btn-sm btn-ghost"
                        >Previous</button>
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`btn btn-sm ${safeCurrentPage === page ? "border-[#8BCF00] bg-[#8BCF00] text-white hover:border-[#6FA800] hover:bg-[#6FA800]" : "btn-ghost"}`}
                            >{page}</button>
                        ))}
                        <button
                            type="button"
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => handlePageChange(safeCurrentPage + 1)}
                            className="btn btn-sm btn-ghost"
                        >Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamLeadLogs;
