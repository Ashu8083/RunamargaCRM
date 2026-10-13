// admin-react\src\pages\Logs\ApplicationStatusLogs\index.jsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import ApplicationStatusLogTable from './components/ApplicationStatusLogTable'

import { getApplicationStatusAuditLogs } from './Api'

function ApplicationStatusLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // STATUS OPTIONS
    // =========================================================

    const statusOptions = [
        { label: 'In Process', value: 'inprocess' },
        { label: 'Docs Pending', value: 'docspending' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Sanctioned', value: 'sanctioned' },
        { label: 'Disbursed', value: 'disbursed' },
        { label: 'Login', value: 'login' },
        { label: 'Revert Rejected', value: 'revert_rejected' },
    ]



    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [changedById, setChangedById] =
        useState('')


    const [status, setStatus] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // PAGINATION STATE
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)


    const pageSize = 10


    // =========================================================
    // DATE PARSER
    // =========================================================

    const parseLogDate = (dateString) => {

        if (!dateString) {
            return null
        }


        const datePart =
            dateString.split(',')[0]


        const parsedDate =
            new Date(datePart)


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return null
        }


        return parsedDate
    }
    const fetchApplicationStatusLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getApplicationStatusAuditLogs({
                skip: 0,
                limit: 500,
            });

            const records = Array.isArray(response)
                ? response
                : [];

            const mappedLogs = records.map((log) => ({
                id: log.id,

                // Loan application information
                loanId: log.loan_application_id ?? "N/A",

                // Employee information
                changedById: log.action_by_id ?? null,
                changedByName: log.performer_name ?? "N/A",
                phone: log.performer_phone ?? "N/A",

                reportToName: log.report_to_name ?? "N/A",

                empRole: log.action_by_role ?? "N/A",

                // Status information
                status: String(
                    log.to_status ?? log.action ?? ""
                ).toUpperCase(),

                fromStatus: log.from_status ?? null,
                toStatus: log.to_status ?? null,

                // Timestamps
                createdAt: log.date_and_time ?? null,
                deletedAt: log.deleted_at ?? null,
            }));

            setLogs(mappedLogs);
        } catch (err) {
            console.error(
                "Failed to fetch application status logs:",
                err
            );

            setError(
                err?.response?.data?.detail ??
                err?.message ??
                "Failed to load application status logs."
            );

            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplicationStatusLogs();
    }, [fetchApplicationStatusLogs]);
    const employeeOptions = useMemo(() => {
        const uniqueEmployees = new Map();

        logs.forEach((log) => {
            if (log.changedById == null) return;

            const id = String(log.changedById);

            if (!uniqueEmployees.has(id)) {
                uniqueEmployees.set(id, {
                    value: id,
                    label: log.changedByName || "Unknown Employee",
                });
            }
        });

        return Array.from(uniqueEmployees.values());
    }, [logs]);
    // =========================================================
    // FILTER LOGS
    // =========================================================

    const filteredLogs = useMemo(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase()


        return logs.filter(
            (log) => {

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                const matchesSearch =
                    !searchValue ||
                    String(log.loanId ?? "")
                        .toLowerCase()
                        .includes(searchValue) ||
                    String(log.changedByName ?? "")
                        .toLowerCase()
                        .includes(searchValue) ||
                    String(log.phone ?? "")
                        .toLowerCase()
                        .includes(searchValue) ||
                    String(log.status ?? "")
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .includes(searchValue) ||
                    String(log.reportToName ?? "")
                        .toLowerCase()
                        .includes(searchValue);


                // -------------------------------------------------
                // CHANGED BY
                // -------------------------------------------------

                const matchesChangedBy =
                    !changedById ||
                    String(log.changedById) ===
                    String(changedById)


                // -------------------------------------------------
                // STATUS
                // -------------------------------------------------

                const normalizeStatus = (value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "");

                const matchesStatus =
                    !status ||
                    normalizeStatus(log.status) === normalizeStatus(status);

                // -------------------------------------------------
                // LOG DATE
                // -------------------------------------------------

                const logDate =
                    parseLogDate(
                        log.createdAt
                    )


                // -------------------------------------------------
                // FROM DATE
                // -------------------------------------------------

                const matchesFromDate =
                    !fromDate ||
                    (
                        logDate &&
                        logDate >=
                        new Date(
                            `${fromDate}T00:00:00`
                        )
                    )


                // -------------------------------------------------
                // TO DATE
                // -------------------------------------------------

                const matchesToDate =
                    !toDate ||
                    (
                        logDate &&
                        logDate <=
                        new Date(
                            `${toDate}T23:59:59`
                        )
                    )


                return (
                    matchesSearch &&
                    matchesChangedBy &&
                    matchesStatus &&
                    matchesFromDate &&
                    matchesToDate
                )

            }
        )

    }, [
        logs,
        search,
        changedById,
        status,
        fromDate,
        toDate,
    ])


    // =========================================================
    // TOTAL PAGES
    // =========================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredLogs.length /
                pageSize
            )
        )


    // =========================================================
    // PAGINATED DATA
    // =========================================================

    const paginatedLogs =
        filteredLogs.slice(
            (currentPage - 1) *
            pageSize,

            currentPage *
            pageSize
        )


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setChangedById('')

        setStatus('')

        setFromDate('')

        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH CHANGE
    // =========================================================

    const handleSearchChange = (
        value
    ) => {

        setSearch(value)

        setCurrentPage(1)

    }


    // =========================================================
    // CHANGED BY CHANGE
    // =========================================================

    const handleChangedByChange = (
        value
    ) => {

        setChangedById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange = (
        event
    ) => {

        setStatus(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // FROM DATE CHANGE
    // =========================================================

    const handleFromDateChange = (
        event
    ) => {

        setFromDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // TO DATE CHANGE
    // =========================================================

    const handleToDateChange = (
        event
    ) => {

        setToDate(
            event.target.value
        )

        setCurrentPage(1)

    }


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        /*
         * Replace with API call later.
         */

        console.log(
            'Refresh application status logs'
        )

    }


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return
        }


        setCurrentPage(page)

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">



            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="
                card
                border
                border-base-300
                bg-base-100
                shadow-sm
            ">

                <div className="
                    card-body
                    p-4
                ">

                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        lg:grid-cols-[minmax(220px,1.5fr)_minmax(180px,1fr)_minmax(160px,1fr)_minmax(260px,1.2fr)_auto]
                    ">

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div>

                            <label className="
                                input
                                input-bordered
                                flex
                                w-full
                                items-center
                                gap-3
                            ">

                                <SearchIcon className="
                                    h-4
                                    w-4
                                    shrink-0
                                    text-base-content/40
                                " />


                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        handleSearchChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search loan ID..."
                                    className="grow"
                                />

                            </label>

                        </div>




                        {/* =========================================
                            STATUS
                        ========================================= */}

                        <div>

                            <select
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >
                                <option value="">All Statuses</option>
                                {statusOptions.map(
                                    (option) => (

                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>
                        {/* CHANGED BY EMPLOYEE */}
                        <div>
                            <label
                                htmlFor="changedByFilter"
                                className="mb-1 block text-sm font-medium"
                            >
                            </label>

                            <select
                                id="changedByFilter"
                                value={changedById}
                                onChange={(event) => {
                                    setChangedById(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="">All Employees</option>

                                {employeeOptions.map((employee) => (
                                    <option
                                        key={employee.value}
                                        value={employee.value}
                                    >
                                        {employee.label}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* =========================================
                            DATE RANGE
                        ========================================= */}

                        <div className="
                            grid
                            grid-cols-2
                            gap-2
                        ">

                            {/* From */}

                            <input
                                type="date"
                                value={fromDate}
                                onChange={
                                    handleFromDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                title="From date"
                            />


                            {/* To */}

                            <input
                                type="date"
                                value={toDate}
                                onChange={
                                    handleToDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    w-full
                                "
                                title="To date"
                            />

                        </div>


                        {/* =========================================
                            RESET + REFRESH
                        ========================================= */}

                        <div className="
                            flex
                            items-center
                            justify-end
                            gap-2
                        ">

                            {/* Reset */}

                            <button
                                type="button"
                                onClick={handleReset}
                                className="
                                    btn
                                    btn-ghost
                                "
                            >
                                Reset
                            </button>


                            {/* Refresh */}

                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="
                                    btn
                                    btn-ghost
                                    gap-2
                                "
                                title="Refresh logs"
                            >

                                <ArrowPathIcon className="
                                    h-4
                                    w-4
                                " />

                                <span>
                                    Refresh
                                </span>

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
                    Loading application status logs...
                </div>
            ) : (
                <ApplicationStatusLogTable logs={paginatedLogs} />
            )}

            {/* =====================================================
                PAGINATION
            ===================================================== */}

            {filteredLogs.length > 0 && (

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    border
                    border-base-300
                    bg-base-100
                    px-4
                    py-3
                    sm:flex-row
                ">

                    {/* =============================================
                        RESULT INFO
                    ============================================= */}

                    <p className="
                        text-xs
                        text-base-content/60
                    ">

                        Showing{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {(currentPage - 1) *
                                pageSize +
                                1
                            }
                        </span>

                        {' '}to{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {Math.min(
                                currentPage *
                                pageSize,
                                filteredLogs.length
                            )}
                        </span>

                        {' '}of{' '}

                        <span className="
                            font-medium
                            text-base-content
                        ">
                            {filteredLogs.length}
                        </span>

                        {' '}logs

                    </p>


                    {/* =============================================
                        PAGINATION CONTROLS
                    ============================================= */}

                    <div className="
                        flex
                        items-center
                        gap-1
                    ">

                        {/* Previous */}

                        <button
                            type="button"
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage - 1
                                )
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Previous
                        </button>


                        {/* Page Numbers */}

                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (_, index) =>
                                index + 1
                        ).map(
                            (page) => (

                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                    className={`
                                        btn
                                        btn-sm
                                        ${currentPage ===
                                            page
                                            ? `
                                                    border-[#8BCF00]
                                                    bg-[#8BCF00]
                                                    text-white
                                                    hover:border-[#6FA800]
                                                    hover:bg-[#6FA800]
                                                `
                                            : `
                                                    btn-ghost
                                                `
                                        }
                                    `}
                                >
                                    {page}
                                </button>

                            )
                        )}


                        {/* Next */}

                        <button
                            type="button"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage + 1
                                )
                            }
                            className="
                                btn
                                btn-sm
                                btn-ghost
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </div>

    )

}


export default ApplicationStatusLogs