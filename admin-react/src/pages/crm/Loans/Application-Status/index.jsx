// admin-react/src/pages/crm/Loans/Application-Status/index.jsx

import {
    lazy,
    Suspense,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    getActiveContext,
} from "../../../../app/auth";

import {
    getApplicationStatusApplications,
} from "./API";

import ApplicationsTable from "./components/ApplicationsTable";


// =============================================================
// LAZY-LOADED REMINDER MODAL
// =============================================================

const ReminderModal = lazy(
    () =>
        import(
            "../../../../components/GlobalModels/Loans/ReminderModal"
        )
);


// =============================================================
// APPLICATION STATUS PAGE
// =============================================================

const ApplicationStatus = () => {

    const activeContext =
        getActiveContext();

    const contextId =
        activeContext?.id;

    const location =
        useLocation();

    const navigate =
        useNavigate();


    // =========================================================
    // URL PARAMETERS
    // =========================================================

    const searchParams = useMemo(
        () =>
            new URLSearchParams(
                location.search
            ),
        [location.search]
    );


    const fromDate =
        searchParams.get("fromDate") || "";


    const toDate =
        searchParams.get("toDate") || "";


    const loanType =
        searchParams.get("loanType") || "";


    const dashboardStatus =
        searchParams.get("status") || "";


    // =========================================================
    // APPLICATION DATA
    // =========================================================

    const [
        applications,
        setApplications,
    ] = useState([]);


    // =========================================================
    // SERVER PAGINATION
    // =========================================================

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);


    const pageSize = 10;


    const [
        totalApplications,
        setTotalApplications,
    ] = useState(0);


    const [
        totalPages,
        setTotalPages,
    ] = useState(0);


    // =========================================================
    // LOADING / ERROR
    // =========================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState(null);


    // =========================================================
    // TABLE FILTERS
    // =========================================================

    const [
        tableFilters,
        setTableFilters,
    ] = useState({
        search: "",

        selectedLoanType:
            loanType || "",

        selectedRM: "",

        selectedTeamLead: "",

        selectedAgent: "",

        selectedStatus:
            dashboardStatus || "",
    });


    // =========================================================
    // SELECTED APPLICATION
    //
    // Used by ReminderModal.
    // =========================================================

    const [
        selectedApplication,
        setSelectedApplication,
    ] = useState(null);


    // =========================================================
    // REMINDER MODAL
    // =========================================================

    const [
        showReminderModal,
        setShowReminderModal,
    ] = useState(false);


    // =========================================================
    // FETCH APPLICATIONS
    // =========================================================

    const fetchApplications = async (
        page = currentPage,
        filters = tableFilters
    ) => {

        try {

            setLoading(true);

            setError(null);


            const response =
                await getApplicationStatusApplications({

                    fromDate,

                    toDate,

                    loanType:
                        filters?.selectedLoanType ||
                        loanType ||
                        "",

                    status:
                        filters?.selectedStatus ||
                        dashboardStatus ||
                        "",

                    search:
                        filters?.search || "",

                    rmId:
                        filters?.selectedRM || "",

                    agentId:
                        filters?.selectedAgent || "",

                    teamLeadId:
                        filters?.selectedTeamLead || "",

                    contextId,

                    page,

                    pageSize,

                });


            // =================================================
            // APPLICATIONS
            // =================================================

            setApplications(
                response?.data || []
            );


            // =================================================
            // TOTAL COUNT
            // =================================================

            setTotalApplications(
                Number(
                    response?.count || 0
                )
            );


            // =================================================
            // TOTAL PAGES
            // =================================================

            setTotalPages(
                Number(
                    response?.total_pages || 0
                )
            );


        } catch (err) {

            console.error(
                "Failed to load Application Status applications:",
                err
            );


            setError(
                err?.response?.data?.detail ||
                "Failed to load applications."
            );


            setApplications([]);

            setTotalApplications(0);

            setTotalPages(0);


        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // TABLE FILTER CHANGE
    // =========================================================

    const handleTableFiltersChange = (
        filters
    ) => {

        setTableFilters(
            filters
        );

        setCurrentPage(1);

    };


    // =========================================================
    // RESET PAGE WHEN URL / CONTEXT CHANGES
    // =========================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        fromDate,
        toDate,
        loanType,
        dashboardStatus,
        contextId,
    ]);


    // =========================================================
    // FETCH WHEN PAGE / FILTER CHANGES
    // =========================================================

    useEffect(() => {

        if (!contextId) {
            return;
        }


        // -----------------------------------------------------
        // Small debounce for search.
        // -----------------------------------------------------

        const timer = setTimeout(() => {

            fetchApplications(
                currentPage,
                tableFilters
            );

        }, 300);


        return () => {

            clearTimeout(timer);

        };

    }, [
        contextId,
        fromDate,
        toDate,
        loanType,
        dashboardStatus,
        currentPage,
        tableFilters,
    ]);


    // =========================================================
    // RESET TABLE FILTERS WHEN URL CHANGES
    // =========================================================

    useEffect(() => {

        setTableFilters({
            search: "",

            selectedLoanType:
                loanType || "",

            selectedRM: "",

            selectedTeamLead: "",

            selectedAgent: "",

            selectedStatus:
                dashboardStatus || "",
        });


        setCurrentPage(1);

    }, [
        loanType,
        dashboardStatus,
    ]);


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        const clearedFilters = {

            search: "",

            selectedLoanType:
                loanType || "",

            selectedRM: "",

            selectedTeamLead: "",

            selectedAgent: "",

            selectedStatus:
                dashboardStatus || "",
        };


        setTableFilters(
            clearedFilters
        );

        setCurrentPage(1);

    };


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        fetchApplications(
            currentPage,
            tableFilters
        );

    };


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            (
                totalPages > 0 &&
                page > totalPages
            )
        ) {
            return;
        }


        setCurrentPage(
            page
        );

    };


    // =========================================================
    // ASSIGNMENT CHANGE
    // =========================================================

    const handleAssignmentChange = (
        applicationId,
        updatedApplication
    ) => {

        setApplications(
            (currentApplications) =>
                currentApplications.map(
                    (application) =>
                        application.id ===
                            applicationId
                            ? {
                                ...application,
                                ...updatedApplication,
                            }
                            : application
                )
        );

    };


    // =========================================================
    // STATUS / LOAN TYPE ACTIONS
    // =========================================================

    const handleLoanTypeAction = (
        application
    ) => {

        console.log(
            "Loan type action:",
            application
        );

    };


    const handleStatusAction = (
        application
    ) => {

        console.log(
            "Status action:",
            application
        );

    };


    // =========================================================
    // REMINDER
    // =========================================================

    const handleReminder = (
        application
    ) => {

        /*
         * Store the complete application object.
         *
         * ReminderModal can therefore access:
         *
         * application.id
         * application.unique_id
         * application.name
         * application.phone
         * application.agent
         * application.rm
         * etc.
         */

        setSelectedApplication(
            application
        );

        setShowReminderModal(
            true
        );

    };


    // =========================================================
    // CLOSE REMINDER MODAL
    // =========================================================

    const handleCloseReminderModal = () => {

        setShowReminderModal(
            false
        );

        setSelectedApplication(
            null
        );

    };


    // =========================================================
    // REMINDER SUBMIT
    // =========================================================

    const handleReminderSubmit = (
        reminder
    ) => {

        /*
         * ReminderModal handles the actual
         * reminder creation.
         *
         * This callback runs after success.
         */

        console.log(
            "Reminder created successfully:",
            reminder
        );

    };


    // =========================================================
    // CHAT
    // =========================================================

    const handleChat = (
        application
    ) => {

        console.log(
            "Chat:",
            application
        );

    };


    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication = (
        application
    ) => {

        const uniqueId =
            application.unique_id ??
            application.uniqueId ??
            application.id;


        if (!uniqueId) {
            return;
        }


        navigate(
            `/view-application/${uniqueId}`
        );

    };


    // =========================================================
    // PAGE TITLE
    // =========================================================

    const getPageTitle = () => {

        if (
            dashboardStatus ===
            "Pending"
        ) {

            return "Pending Applications";

        }


        if (dashboardStatus) {

            return `${dashboardStatus} Applications`;

        }


        return "Application Status";

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="
                w-full
                p-4
                md:p-6
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                    mb-5
                "
            >

                <div>

                    <h1
                        className="
                            text-2xl
                            font-semibold
                            text-base-content
                        "
                    >
                        {
                            getPageTitle()
                        }
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-base-content/60
                        "
                    >

                        {loading

                            ? "Loading applications..."

                            : `${totalApplications} application${
                                totalApplications === 1
                                    ? ""
                                    : "s"
                            }`

                        }

                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        btn
                        btn-sm
                        btn-outline
                        self-start
                        md:self-auto
                    "
                >
                    ← Back
                </button>

            </div>


            {/* =================================================
                DASHBOARD FILTER INFORMATION
            ================================================= */}

            {(fromDate ||
                toDate ||
                loanType ||
                dashboardStatus) && (

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        mb-4
                    "
                >

                    {fromDate && (

                        <span
                            className="
                                badge
                                badge-ghost
                                h-8
                                px-3
                            "
                        >
                            From: {fromDate}
                        </span>

                    )}


                    {toDate && (

                        <span
                            className="
                                badge
                                badge-ghost
                                h-8
                                px-3
                            "
                        >
                            To: {toDate}
                        </span>

                    )}


                    {loanType && (

                        <span
                            className="
                                badge
                                badge-ghost
                                h-8
                                px-3
                            "
                        >
                            Loan Type: {loanType}
                        </span>

                    )}


                    {dashboardStatus && (

                        <span
                            className="
                                badge
                                badge-primary
                                h-8
                                px-3
                            "
                        >
                            Status: {
                                dashboardStatus
                            }
                        </span>

                    )}

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    className="
                        alert
                        alert-error
                        mb-4
                    "
                >

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        min-h-[250px]
                        rounded-xl
                        border
                        border-base-300
                        bg-base-100
                    "
                >

                    <span
                        className="
                            loading
                            loading-spinner
                            loading-md
                        "
                    />

                    <span className="ml-3">
                        Loading applications...
                    </span>

                </div>

            ) : (

                /* =================================================
                   APPLICATION TABLE
                ================================================= */

                <ApplicationsTable

                    applications={
                        applications
                    }


                    // =================================================
                    // FILTER VALUES
                    // =================================================

                    filters={
                        tableFilters
                    }

                    onFiltersChange={
                        handleTableFiltersChange
                    }


                    onClearFilters={
                        handleClearFilters
                    }


                    // =================================================
                    // ACTIONS
                    // =================================================

                    onLoanTypeChange={
                        handleLoanTypeAction
                    }


                    onStatusChange={
                        handleStatusAction
                    }


                    onReminder={
                        handleReminder
                    }


                    onChat={
                        handleChat
                    }


                    onViewApplication={
                        handleViewApplication
                    }


                    onRefresh={
                        handleRefresh
                    }


                    onAssignmentChange={
                        handleAssignmentChange
                    }


                    // =================================================
                    // SERVER PAGINATION
                    // =================================================

                    currentPage={
                        currentPage
                    }

                    totalPages={
                        totalPages
                    }

                    totalApplications={
                        totalApplications
                    }

                    pageSize={
                        pageSize
                    }

                    onPageChange={
                        handlePageChange
                    }

                />

            )}


            {/* =================================================
                REMINDER MODAL
            ================================================= */}

            <Suspense fallback={null}>
                {showReminderModal && (
                    <ReminderModal
                        open={
                            showReminderModal
                        }

                        applicationId={
                            selectedApplication?.id ??
                            null
                        }

                        application={
                            selectedApplication
                        }

                        onClose={
                            handleCloseReminderModal
                        }

                        onSubmit={
                            handleReminderSubmit
                        }
                    />
                )}
            </Suspense>

        </div>

    );

};


export default ApplicationStatus;