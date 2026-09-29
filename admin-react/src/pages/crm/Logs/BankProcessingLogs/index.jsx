// admin-react/src/pages/Logs/BankProcessingLogs/index.jsx

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

import BankProcessingLogTable from "./components/BankProcessingLogTable";

import EmployeeDropdown from "../../../../components/GlobalModels/Filters/EmployeeDropdown";

import {
    getBankProcessingLogs,
} from "./Api";


function BankProcessingLogs() {

    // =========================================================
    // PAGE SIZE
    // =========================================================

    const pageSize = 10;


    // =========================================================
    // LOG DATA
    // =========================================================

    const [logs, setLogs] =
        useState([]);

    const [totalLogs, setTotalLogs] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(1);


    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // ERROR
    // =========================================================

    const [error, setError] =
        useState("");


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] =
        useState("");

    const [employeeContextId, setEmployeeContextId] =
        useState("");

    const [event, setEvent] =
        useState("");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] =
        useState(1);


    // =========================================================
    // CONTEXT
    // =========================================================

    const [contextId] =
        useState("");


    // =========================================================
    // FETCH LOGS
    // =========================================================

    const fetchLogs = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getBankProcessingLogs({

                        contextId,

                        search,

                        employeeContextId,

                        event,

                        fromDate,

                        toDate,

                        page:
                            currentPage,

                        pageSize,
                    });


                setLogs(
                    response?.items || []
                );


                setTotalLogs(
                    Number(
                        response?.total || 0
                    )
                );


                setTotalPages(
                    Math.max(
                        Number(
                            response?.totalPages || 1
                        ),
                        1
                    )
                );

            } catch (err) {

                console.error(
                    "Failed to fetch bank processing logs:",
                    err
                );


                setLogs([]);

                setTotalLogs(0);

                setTotalPages(1);


                setError(
                    err?.response?.data?.detail ||
                    "Failed to load bank processing logs."
                );

            } finally {

                setLoading(false);

            }

        },
        [
            contextId,
            search,
            employeeContextId,
            event,
            fromDate,
            toDate,
            currentPage,
        ]
    );


    // =========================================================
    // INITIAL / FILTER FETCH
    // =========================================================

    useEffect(
        () => {

            fetchLogs();

        },
        [fetchLogs]
    );


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchChange =
        (value) => {

            setSearch(value);

            setCurrentPage(1);

        };


    // =========================================================
    // EMPLOYEE
    // =========================================================

    const handleEmployeeChange =
        (value) => {

            setEmployeeContextId(
                value
            );

            setCurrentPage(1);

        };


    // =========================================================
    // EVENT
    // =========================================================

    const handleEventChange =
        (event) => {

            setEvent(
                event.target.value
            );

            setCurrentPage(1);

        };


    // =========================================================
    // FROM DATE
    // =========================================================

    const handleFromDateChange =
        (event) => {

            setFromDate(
                event.target.value
            );

            setCurrentPage(1);

        };


    // =========================================================
    // TO DATE
    // =========================================================

    const handleToDateChange =
        (event) => {

            setToDate(
                event.target.value
            );

            setCurrentPage(1);

        };


    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSearch("");

        setEmployeeContextId("");

        setEvent("");

        setFromDate("");

        setToDate("");

        setCurrentPage(1);

    };


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        fetchLogs();

    };


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange =
        (page) => {

            if (
                page < 1 ||
                page > totalPages
            ) {
                return;
            }


            setCurrentPage(page);

        };


    // =========================================================
    // PAGE NUMBERS
    // =========================================================

    const getPageNumbers = () => {

        const pages = [];

        const maxVisiblePages = 5;


        let startPage =
            Math.max(
                1,
                currentPage - 2
            );


        let endPage =
            Math.min(
                totalPages,
                startPage +
                    maxVisiblePages -
                    1
            );


        if (
            endPage -
                startPage <
            maxVisiblePages - 1
        ) {

            startPage =
                Math.max(
                    1,
                    endPage -
                        maxVisiblePages +
                        1
                );

        }


        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {

            pages.push(page);

        }


        return pages;

    };


    // =========================================================
    // DISPLAY RANGE
    // =========================================================

    const showingFrom =
        totalLogs === 0
            ? 0
            : (
                (currentPage - 1) *
                    pageSize
            ) + 1;


    const showingTo =
        Math.min(
            currentPage *
                pageSize,
            totalLogs
        );


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            space-y-5
            p-4
            sm:p-6
        ">

            {/* =================================================
                FILTER CARD
            ================================================= */}

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
                        w-full
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-12
                    ">

                        {/* =====================================
                            SEARCH
                        ===================================== */}

                        <div className="
                            min-w-0
                            lg:col-span-3
                        ">

                            <label className="
                                input
                                input-bordered
                                flex
                                w-full
                                items-center
                                gap-3
                            ">

                                <SearchIcon
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
                                        text-base-content/40
                                    "
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        handleSearchChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="
                                        Search loan ID / BP ID / employee...
                                    "
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =====================================
                            EMPLOYEE
                        ===================================== */}

                        {/*<div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={
                                    employeeContextId
                                }
                                onChange={
                                    handleEmployeeChange
                                }
                                allLabel="All Employees"
                                placeholder="Employee"
                            />

                        </div> */}


                        {/* =====================================
                            EVENT
                        ===================================== */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <select
                                value={event}
                                onChange={
                                    handleEventChange
                                }
                                className="
                                    select
                                    select-bordered
                                    w-full
                                "
                            >

                                <option value="">
                                    All Events
                                </option>

                                <option value="LOGIN">
                                    Login
                                </option>

                                <option value="SANCTIONED">
                                    Sanctioned
                                </option>

                                <option value="REJECTED">
                                    Rejected
                                </option>

                                <option value="DISBURSED">
                                    Disbursed
                                </option>

                            </select>

                        </div>


                        {/* =====================================
                            FROM DATE
                        ===================================== */}

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


                        {/* =====================================
                            TO DATE
                        ===================================== */}

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


                        {/* =====================================
                            ACTIONS
                        ===================================== */}

                        <div className="
                            flex
                            min-w-0
                            items-center
                            lg:col-span-1
                        ">

                            <div className="
                                flex
                                w-full
                                shrink-0
                                items-center
                                overflow-hidden
                                rounded-lg
                                border
                                border-base-300
                            ">

                                <button
                                    type="button"
                                    onClick={
                                        handleReset
                                    }
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                        px-3
                                    "
                                >
                                    Reset
                                </button>


                                <div className="
                                    h-6
                                    w-px
                                    bg-base-300
                                " />


                                <button
                                    type="button"
                                    onClick={
                                        handleRefresh
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                        btn
                                        btn-ghost
                                        rounded-none
                                        border-0
                                        px-3
                                    "
                                    title="Refresh logs"
                                >

                                    <ArrowPathIcon
                                        className={`
                                            h-4
                                            w-4
                                            ${
                                                loading
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        `}
                                    />

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="
                    alert
                    alert-error
                    border
                    border-error/20
                ">

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            {loading ? (

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
                        items-center
                        justify-center
                    ">

                        <span className="
                            loading
                            loading-spinner
                            loading-md
                        " />

                    </div>

                </div>

            ) : (

                <BankProcessingLogTable
                    logs={logs}
                />

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading &&
                totalLogs > 0 && (

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

                        <p className="
                            text-xs
                            text-base-content/60
                        ">

                            Showing{" "}

                            <span className="
                                font-medium
                                text-base-content
                            ">
                                {showingFrom}
                            </span>

                            {" "}to{" "}

                            <span className="
                                font-medium
                                text-base-content
                            ">
                                {showingTo}
                            </span>

                            {" "}of{" "}

                            <span className="
                                font-medium
                                text-base-content
                            ">
                                {totalLogs}
                            </span>

                            {" "}logs

                        </p>


                        <div className="
                            flex
                            items-center
                            gap-1
                        ">

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


                            {getPageNumbers().map(
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
                                            ${
                                                currentPage ===
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

    );

}


export default BankProcessingLogs;