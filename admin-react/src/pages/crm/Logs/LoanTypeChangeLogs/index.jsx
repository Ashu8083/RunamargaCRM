// admin-react/src/pages/Logs/LoanTypeChangeLogs/index.jsx

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";

import LoanTypeChangeLogTable from "./components/LoanTypeChangeLogTable";

import EmployeeDropdown from "../../../../components/GlobalModels/Filters/EmployeeDropdown";
import TeamLeadDropdown from "../../../../components/GlobalModels/Filters/TeamLeadDropdown";
import LoanTypeDropdown from "../../../../components/GlobalModels/Filters/LoanTypeDropdown";

import {
    getLoanTypeChangeLogs,
} from "./Api";
// =========================================================
// COMPONENT
// =========================================================

function LoanTypeChangeLogs() {

    // =====================================================
    // PAGE SIZE
    // =====================================================

    const pageSize = 10;


    // =====================================================
    // LOG DATA
    // =====================================================

    const [logs, setLogs] = useState([]);

    const [totalLogs, setTotalLogs] = useState(0);

    const [totalPages, setTotalPages] = useState(1);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(false);


    // =====================================================
    // ERROR
    // =====================================================

    const [error, setError] = useState("");


    // =====================================================
    // FILTER STATE
    // =====================================================

    const [search, setSearch] = useState("");

    const [changedById, setChangedById] = useState("");

    const [reportsToId, setReportsToId] = useState("");

    const [fromLoanType, setFromLoanType] = useState("");

    const [toLoanType, setToLoanType] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);


    // =====================================================
    // DROPDOWN DATA
    // =====================================================
    //
    // IMPORTANT:
    //
    // These must contain EmployeeContext IDs.
    //
    // Do NOT use Employee.id here.
    //
    // Your backend filters:
    //
    // changed_by_id   -> employee_contexts.id
    // reports_to_id   -> employee_contexts.id
    //
    // Replace these with your existing real
    // EmployeeContext dropdown data/API.
    //
    // =====================================================

    const [employees, setEmployees] = useState([]);

    const [teamLeads, setTeamLeads] = useState([]);


    // =====================================================
    // LOAN TYPES
    // =====================================================
    //
    // IMPORTANT:
    //
    // These IDs must be the actual loan_types.id values.
    //
    // Do NOT use PERSONAL/BUSINESS/etc as IDs if your
    // backend expects loan_type_id.
    //
    // =====================================================

    const [loanTypeOptions, setLoanTypeOptions] = useState([]);


    // =====================================================
    // CONTEXT ID
    // =====================================================
    //
    // If your application already stores the currently
    // selected EmployeeContext ID in Redux/localStorage,
    // replace this with that value.
    //
    // If context_id is not required for your current user,
    // this remains empty.
    //
    // =====================================================

    const [contextId] = useState("");


    // =====================================================
    // FETCH LOGS
    // =====================================================

    const fetchLogs = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getLoanTypeChangeLogs({

                    contextId,

                    search,

                    changedById,

                    reportsToId,

                    fromLoanType,

                    toLoanType,

                    fromDate,

                    toDate,

                    page: currentPage,

                    pageSize,

                });


            // =================================================
            // LOG ITEMS
            // =================================================

            setLogs(
                response?.items || []
            );


            // =================================================
            // TOTAL
            // =================================================

            setTotalLogs(
                Number(response?.total || 0)
            );


            // =================================================
            // TOTAL PAGES
            // =================================================

            setTotalPages(
                Math.max(
                    Number(response?.totalPages || 1),
                    1
                )
            );


        } catch (err) {

            console.error(
                "Failed to fetch loan type change logs:",
                err
            );


            setLogs([]);

            setTotalLogs(0);

            setTotalPages(1);


            setError(
                err?.response?.data?.detail ||
                "Failed to load loan type change logs."
            );


        } finally {

            setLoading(false);

        }

    }, [
        contextId,
        search,
        changedById,
        reportsToId,
        fromLoanType,
        toLoanType,
        fromDate,
        toDate,
        currentPage,
    ]);


    // =====================================================
    // INITIAL / FILTER FETCH
    // =====================================================

    useEffect(() => {

        fetchLogs();

    }, [fetchLogs]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearchChange = (value) => {

        setSearch(value);

        setCurrentPage(1);

    };


    // =====================================================
    // CHANGED BY
    // =====================================================

    const handleChangedByChange = (value) => {

        setChangedById(value);

        setCurrentPage(1);

    };


    // =====================================================
    // REPORTS TO
    // =====================================================

    const handleReportsToChange = (value) => {

        setReportsToId(value);

        setCurrentPage(1);

    };


    // =====================================================
    // FROM LOAN TYPE
    // =====================================================

    const handleFromLoanTypeChange = (value) => {

        setFromLoanType(value);

        setCurrentPage(1);

    };

    // =====================================================
    // TO LOAN TYPE
    // =====================================================

    const handleToLoanTypeChange = (value) => {

        setToLoanType(value);

        setCurrentPage(1);

    };


    // =====================================================
    // FROM DATE
    // =====================================================

    const handleFromDateChange = (event) => {

        setFromDate(
            event.target.value
        );

        setCurrentPage(1);

    };


    // =====================================================
    // TO DATE
    // =====================================================

    const handleToDateChange = (event) => {

        setToDate(
            event.target.value
        );

        setCurrentPage(1);

    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        setSearch("");

        setChangedById("");

        setReportsToId("");

        setFromLoanType("");

        setToLoanType("");

        setFromDate("");

        setToDate("");

        setCurrentPage(1);

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        fetchLogs();

    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }


        setCurrentPage(page);

    };


    // =====================================================
    // PAGE RANGE
    // =====================================================

    const getPageNumbers = () => {

        const pages = [];

        const maxVisiblePages = 5;


        let startPage = Math.max(
            1,
            currentPage - 2
        );


        let endPage = Math.min(
            totalPages,
            startPage + maxVisiblePages - 1
        );


        if (
            endPage - startPage <
            maxVisiblePages - 1
        ) {

            startPage = Math.max(
                1,
                endPage - maxVisiblePages + 1
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


    // =====================================================
    // DISPLAY RANGE
    // =====================================================

    const showingFrom =
        totalLogs === 0
            ? 0
            : (currentPage - 1) *
            pageSize +
            1;


    const showingTo =
        Math.min(
            currentPage * pageSize,
            totalLogs
        );


    // =====================================================
    // RENDER
    // =====================================================

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
                                    placeholder="
                                        Search loan ID / employee...
                                    "
                                    className="
                                        min-w-0
                                        grow
                                    "
                                />

                            </label>

                        </div>


                        {/* =====================================
                            CHANGED BY
                        ===================================== */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <EmployeeDropdown
                                label=""
                                value={changedById}
                                onChange={
                                    handleChangedByChange
                                }
                                options={employees}
                                allLabel="All Employees"
                                placeholder="Changed By"
                            />

                        </div>


                        {/* =====================================
                            REPORTS TO
                        ===================================== */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <TeamLeadDropdown
                                label=""
                                value={reportsToId}
                                onChange={
                                    handleReportsToChange
                                }
                                options={teamLeads}
                                allLabel="All Team Leads"
                                placeholder="Reports To"
                            />

                        </div>


                        {/* =====================================
                            FROM LOAN TYPE
                        ===================================== */}

                        <div className="
    min-w-0
    lg:col-span-2
">

                            <LoanTypeDropdown
                                value={fromLoanType}
                                onChange={handleFromLoanTypeChange}
                                placeholder="From Loan Type"
                            />

                        </div>


                        {/* =====================================
                            TO LOAN TYPE
                        ===================================== */}

                        <div className="
                            min-w-0
                            lg:col-span-2
                        ">

                            <LoanTypeDropdown
                                value={toLoanType}
                                onChange={handleToLoanTypeChange}
                                placeholder="To Loan Type"
                            />

                        </div>

                        {/* =====================================
                            DATE + ACTIONS
                        ===================================== */}

                        <div className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                            lg:col-span-3
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
                                    min-w-0
                                    w-full
                                "
                                title="From date"
                            />


                            <input
                                type="date"
                                value={toDate}
                                onChange={
                                    handleToDateChange
                                }
                                className="
                                    input
                                    input-bordered
                                    min-w-0
                                    w-full
                                "
                                title="To date"
                            />


                            <div className="
                                flex
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
                                    disabled={loading}
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
                                            ${loading
                                                ? "animate-spin"
                                                : ""
                                            }
                                        `}
                                    />


                                    <span className="
                                        hidden
                                        xl:inline
                                    ">
                                        Refresh
                                    </span>

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
                LOADING
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

                <LoanTypeChangeLogTable
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

                        {/* =====================================
                            COUNT
                        ===================================== */}

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


                        {/* =====================================
                            PAGINATION
                        ===================================== */}

                        <div className="
                            flex
                            items-center
                            gap-1
                        ">

                            {/* PREVIOUS */}

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


                            {/* PAGE NUMBERS */}

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


                            {/* NEXT */}

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


export default LoanTypeChangeLogs;