// admin-react/src/pages/Logs/CallReassignmentLogs/index.jsx

import { useCallback, useEffect, useMemo, useState } from 'react'
import CallReassignmentLogTable from './components/CallReassignmentLogTable'
import { getCallReassignmentAuditLogs } from './Api'

import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import EmployeeDropdown from '../../../../components/GlobalModels/Filters/EmployeeDropdown'
import RmDropdown from '../../../../components/GlobalModels/Filters/RmDropdown'

function CallReassignmentLogs() {

    const [logs, setLogs] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState('')


    const [fromRmId, setFromRmId] =
        useState('')


    const [toRmId, setToRmId] =
        useState('')


    const [reassignedById, setReassignedById] =
        useState('')


    const [fromDate, setFromDate] =
        useState('')


    const [toDate, setToDate] =
        useState('')


    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1)


    const pageSize = 10
    // Build dropdown options from the logs currently returned by the API.
    const rms = useMemo(() => {
        const options = new Map();

        logs.forEach((log) => {
            [
                {
                    id: log.fromRmId,
                    name: log.fromRmName,
                },
                {
                    id: log.toRmId,
                    name: log.toRmName,
                },
            ].forEach(({ id, name }) => {
                if (id === null || id === undefined || id === "") {
                    return;
                }

                const key = String(id);

                if (!options.has(key)) {
                    options.set(key, {
                        id: key,
                        employeeId: key,
                        name: name || `Context ${key}`,
                        role: "rm",
                    });
                }
            });
        });

        return Array.from(options.values());
    }, [logs]);

    // Populate the Reassigned By dropdown from the audit records.
    const employees = useMemo(() => {
        const options = new Map();

        logs.forEach((log) => {
            const id = log.reassignedById;

            if (id === null || id === undefined || id === "") {
                return;
            }

            const key = String(id);

            if (!options.has(key)) {
                options.set(key, {
                    id: key,
                    employeeId: key,
                    name: log.reassignedByName || `Context ${key}`,
                    role: "",
                });
            }
        });

        return Array.from(options.values());
    }, [logs]);
    const fetchCallReassignmentLogs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getCallReassignmentAuditLogs({
                skip: 0,
                limit: 500,
            });

            // Support common API response formats.
            const records = Array.isArray(response)
                ? response
                : Array.isArray(response?.items)
                    ? response.items
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.data?.items)
                            ? response.data.items
                            : Array.isArray(response?.data?.data)
                                ? response.data.data
                                : Array.isArray(response?.logs)
                                    ? response.logs
                                    : [];

            console.log("Call reassignment API response:", response);
            console.log("Parsed call reassignment records:", records);

            const mappedLogs = records.map((log) => ({
                id: log.id,

                customerPhone: String(
                    log.customer_phone ?? log.customerPhone ?? ""
                ),

                fromRmId:
                    log.from_assigned_to_id ??
                    log.from_assigned_to ??
                    log.fromRmId ??
                    null,

                fromRmName:
                    log.from_assigned_to_name ??
                    log.from_rm_name ??
                    log.fromRmName ??
                    "",

                fromPhone:
                    log.assigned_from_phone ??
                    log.from_phone ??
                    log.fromPhone ??
                    "",

                toRmId:
                    log.to_assigned_to_id ??
                    log.to_assigned_to ??
                    log.toRmId ??
                    null,

                toRmName:
                    log.to_assigned_to_name ??
                    log.to_rm_name ??
                    log.toRmName ??
                    "",

                toPhone:
                    log.assigned_to_phone ??
                    log.to_phone ??
                    log.toPhone ??
                    "",

                reassignedById:
                    log.reassigned_by_id ??
                    log.action_by_id ??
                    log.reassignedById ??
                    null,

                reassignedByName:
                    log.reassigned_by_name ??
                    log.action_by_name ??
                    log.reassignedByName ??
                    "",

                action: log.action ?? "",

                createdAt:
                    log.date_and_time ??
                    log.created_at ??
                    log.createdAt ??
                    "",
            }));

            setLogs(mappedLogs);
            setCurrentPage(1);

            setLogs(mappedLogs);
            setCurrentPage(1);
        } catch (err) {
            console.error(
                "Failed to fetch call reassignment logs:",
                err
            );

            setLogs([]);

            setError(
                err.response?.data?.detail ||
                "Failed to load call reassignment logs."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCallReassignmentLogs()
    }, [fetchCallReassignmentLogs])
    // =========================================================
    // FILTER LOGS
    // =========================================================

    const filteredLogs = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return logs.filter((log) => {
            // Search customer phone, RM names, RM phone numbers,
            // and the name of the employee who reassigned the call.
            const searchableValues = [
                log.customerPhone,
                log.fromRmName,
                log.fromPhone,
                log.toRmName,
                log.toPhone,
                log.reassignedByName,
                log.action,
            ];

            const matchesSearch =
                !searchValue ||
                searchableValues.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(searchValue)
                );

            // Filter by previous RM.
            const matchesFromRm =
                !fromRmId ||
                String(log.fromRmId) === String(fromRmId);

            // Filter by new RM.
            const matchesToRm =
                !toRmId ||
                String(log.toRmId) === String(toRmId);

            // Filter by employee who reassigned the call.
            const matchesReassignedBy =
                !reassignedById ||
                String(log.reassignedById) === String(reassignedById);

            // Parse the log date safely.
            const logDate = log.createdAt
                ? new Date(log.createdAt)
                : null;

            const validLogDate =
                logDate && !Number.isNaN(logDate.getTime());

            // Start date: beginning of the selected day.
            const startDate = fromDate
                ? new Date(`${fromDate}T00:00:00`)
                : null;

            // End date: end of the selected day.
            const endDate = toDate
                ? new Date(`${toDate}T23:59:59.999`)
                : null;

            const matchesFromDate =
                !fromDate ||
                (
                    validLogDate &&
                    logDate >= startDate
                );

            const matchesToDate =
                !toDate ||
                (
                    validLogDate &&
                    logDate <= endDate
                );

            return (
                matchesSearch &&
                matchesFromRm &&
                matchesToRm &&
                matchesReassignedBy &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [
        logs,
        search,
        fromRmId,
        toRmId,
        reassignedById,
        fromDate,
        toDate,
    ]);


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
    // SAFE CURRENT PAGE
    // =========================================================

    const safeCurrentPage =
        Math.min(
            currentPage,
            totalPages
        )


    // =========================================================
    // PAGINATED DATA
    // =========================================================

    const paginatedLogs =
        filteredLogs.slice(
            (safeCurrentPage - 1) *
            pageSize,

            safeCurrentPage *
            pageSize
        )


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch('')

        setFromRmId('')

        setToRmId('')

        setReassignedById('')

        setFromDate('')

        setToDate('')

        setCurrentPage(1)

    }


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange = (
        value
    ) => {

        setSearch(value)

        setCurrentPage(1)

    }


    // =========================================================
    // FROM RM
    // =========================================================

    const handleFromRmChange = (
        value
    ) => {

        setFromRmId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // TO RM
    // =========================================================

    const handleToRmChange = (
        value
    ) => {

        setToRmId(value)

        setCurrentPage(1)

    }


    // =========================================================
    // REASSIGNED BY
    // =========================================================

    const handleReassignedByChange = (
        value
    ) => {

        setReassignedById(value)

        setCurrentPage(1)

    }


    // =========================================================
    // FROM DATE
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
    // TO DATE
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
            'Refresh call reassignment logs'
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
                FILTER CARD
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


                    {/* =================================================
                        FIRST ROW — MAIN FILTERS
                    ================================================= */}

                    <div className="
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        md:grid-cols-2
                        xl:grid-cols-12
                    ">


                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <div className="
                            min-w-0
                            xl:col-span-3
                        ">

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
                                    placeholder="Search customer phone..."
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =========================================
                            FROM RM
                        ========================================= */}

                        {/* <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={fromRmId}
                                onChange={
                                    handleFromRmChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder="From RM"
                            />

                        </div> */}


                        {/* =========================================
                            TO RM
                        ========================================= */}

                        {/* <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <RmDropdown
                                label=""
                                value={toRmId}
                                onChange={
                                    handleToRmChange
                                }
                                options={rms}
                                allLabel="All RMs"
                                placeholder="To RM"
                            />

                        </div> */}


                        {/* =========================================
                            REASSIGNED BY
                        ========================================= */}
                        {/* 
                        <div className="
                            min-w-0
                            xl:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={reassignedById}
                                onChange={
                                    handleReassignedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Reassigned By"
                            />

                        </div> */}
                        {/* =========================================
                            FROM DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

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

                        </div>


                        {/* =========================================
                            TO DATE
                        ========================================= */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

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
                            min-w-0
                            items-center
                            lg:col-span-2
                        ">

                            <div className="
                                flex
                                w-full
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                                lg:w-auto
                            ">


                                {/* =================================
                                    RESET
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                    "
                                >
                                    Reset
                                </button>


                                {/* =================================
                                    DIVIDER
                                ================================= */}

                                <div className="
                                    h-6
                                    w-px
                                    bg-base-300
                                " />


                                {/* =================================
                                    REFRESH
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
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


                    {/* =================================================
                        SECOND ROW — DATES + ACTIONS
                    ================================================= */}

                    <div className="
                        mt-3
                        grid
                        w-full
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-12
                    ">






                    </div>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ===================================================== */}

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            {loading && logs.length === 0 ? (
                <div className="py-10 text-center text-sm text-base-content/60">
                    Loading call reassignment logs...
                </div>
            ) : (
                <CallReassignmentLogTable logs={paginatedLogs} />
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
                            {(safeCurrentPage - 1) *
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
                                safeCurrentPage *
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
                                safeCurrentPage === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage - 1
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
                                        ${safeCurrentPage ===
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
                                safeCurrentPage ===
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    safeCurrentPage + 1
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


export default CallReassignmentLogs