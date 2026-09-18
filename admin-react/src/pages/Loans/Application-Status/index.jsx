import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import { getActiveContext, getStoredUser } from '../../../app/auth'
import {
    getApplicationStatusApplications,
} from "./API";

import ApplicationsTable from "./components/ApplicationsTable";


// =============================================================
// APPLICATION STATUS PAGE
// =============================================================

const ApplicationStatus = () => {
    // console.log("🔥 APPLICATION STATUS COMPONENT LOADED");
    const activeContext = getActiveContext();
    const contextId = activeContext?.id;
    // console.log("Application Status activeContext:", activeContext);
    // console.log("Application Status contextId:", contextId);
    const location = useLocation();

    const navigate = useNavigate();


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
        search,
        setSearch,
    ] = useState("");


    const [
        selectedLoanType,
        setSelectedLoanType,
    ] = useState(
        loanType || ""
    );


    const [
        selectedRM,
        setSelectedRM,
    ] = useState("");


    const [
        selectedTeamLead,
        setSelectedTeamLead,
    ] = useState("");


    const [
        selectedAgent,
        setSelectedAgent,
    ] = useState("");


    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState(
        dashboardStatus || ""
    );


    // =========================================================
    // FETCH APPLICATIONS
    // =========================================================

    const fetchApplications =
        async () => {

            try {

                setLoading(true);

                setError(null);

                const response =
                    await getApplicationStatusApplications({
                        fromDate,
                        toDate,
                        loanType:
                            selectedLoanType ||
                            loanType ||
                            "",
                        status:
                            dashboardStatus ||
                            selectedStatus ||
                            "",
                        contextId,
                    });


                setApplications(
                    response?.data || []
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

            } finally {

                setLoading(false);

            }
        };


    // =========================================================
    // INITIAL / URL FILTER FETCH
    // =========================================================

    useEffect(() => {

        if (!contextId) {
            return;
        }

        fetchApplications();

    }, [
        contextId,
        fromDate,
        toDate,
        loanType,
        dashboardStatus,
    ]);


    // =========================================================
    // RESET LOCAL FILTERS WHEN URL CHANGES
    // =========================================================

    useEffect(() => {

        setSelectedLoanType(
            loanType || ""
        );

        setSelectedStatus(
            dashboardStatus || ""
        );

        setSelectedRM("");

        setSelectedTeamLead("");

        setSelectedAgent("");

        setSearch("");

    }, [
        loanType,
        dashboardStatus,
    ]);


    // =========================================================
    // SEARCH + LOCAL FILTERING
    // =========================================================

    const filteredApplications =
        useMemo(() => {

            let data = [
                ...applications,
            ];


            // =================================================
            // SEARCH
            // =================================================

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            if (searchValue) {

                data = data.filter(
                    (application) => {

                        const name =
                            String(
                                application.name ||
                                ""
                            ).toLowerCase();


                        const phone =
                            String(
                                application.phone ||
                                ""
                            ).toLowerCase();


                        const email =
                            String(
                                application.email ||
                                ""
                            ).toLowerCase();


                        const uniqueId =
                            String(
                                application.unique_id ||
                                ""
                            ).toLowerCase();


                        const id =
                            String(
                                application.id ||
                                ""
                            ).toLowerCase();


                        const agent =
                            String(
                                application.agent?.name ||
                                application.agent_name ||
                                application.agentName ||
                                ""
                            ).toLowerCase();


                        return (
                            name.includes(
                                searchValue
                            ) ||
                            phone.includes(
                                searchValue
                            ) ||
                            email.includes(
                                searchValue
                            ) ||
                            uniqueId.includes(
                                searchValue
                            ) ||
                            id.includes(
                                searchValue
                            ) ||
                            agent.includes(
                                searchValue
                            )
                        );

                    }
                );

            }


            // =================================================
            // LOAN TYPE
            // =================================================

            if (
                selectedLoanType
            ) {

                data = data.filter(
                    (application) => {

                        const applicationLoanType =
                            application.loan_type_id ??
                            application.loanTypeId ??
                            application.loan_type?.id ??
                            application.loanType?.id ??
                            "";


                        return (
                            String(
                                applicationLoanType
                            ) ===
                            String(
                                selectedLoanType
                            )
                        );

                    }
                );

            }


            // =================================================
            // RM
            // =================================================

            if (
                selectedRM
            ) {

                data = data.filter(
                    (application) => {

                        const applicationRM =
                            application.rm_id ??
                            application.rmId ??
                            application.rm?.id ??
                            "";


                        return (
                            String(
                                applicationRM
                            ) ===
                            String(
                                selectedRM
                            )
                        );

                    }
                );

            }


            // =================================================
            // TEAM LEAD
            // =================================================

            if (
                selectedTeamLead
            ) {

                data = data.filter(
                    (application) => {

                        const teamLeadId =
                            application.team_lead_id ??
                            application.teamLeadId ??
                            application.team_lead?.id ??
                            application.teamLead?.id ??
                            application.rm?.reports_to_id ??
                            application.rm?.reportsToId ??
                            "";


                        return (
                            String(
                                teamLeadId
                            ) ===
                            String(
                                selectedTeamLead
                            )
                        );

                    }
                );

            }


            // =================================================
            // AGENT
            // =================================================

            if (
                selectedAgent
            ) {

                data = data.filter(
                    (application) => {

                        const applicationAgent =
                            application.agent_id ??
                            application.agentId ??
                            application.agent?.id ??
                            "";


                        return (
                            String(
                                applicationAgent
                            ) ===
                            String(
                                selectedAgent
                            )
                        );

                    }
                );

            }


            // =================================================
            // STATUS
            // =================================================

            /*
             * Dashboard status is already applied by the
             * backend.
             *
             * We only apply a local status filter when the
             * user changes the table status dropdown.
             */
            // =========================================================
            // STATUS
            // =========================================================

            /*
             * Dashboard status MUST always be respected.
             *
             * In Process  -> only In Process
             * Login       -> only Login
             * Sanctioned  -> only Sanctioned
             * Disbursed   -> only Disbursed
             * Rejected    -> only Rejected
             *
             * Pending is the only combined status:
             * In Process + Login + Sanctioned
             */

            const statusToFilter =
                selectedStatus ||
                dashboardStatus ||
                "";

            if (statusToFilter) {

                if (
                    statusToFilter ===
                    "Pending"
                ) {

                    data = data.filter(
                        (application) =>
                            [
                                "In Process",
                                "Login",
                                "Sanctioned",
                            ].includes(
                                application.status
                            )
                    );

                } else {

                    data = data.filter(
                        (application) =>
                            String(
                                application.status ||
                                ""
                            ).trim().toLowerCase() ===
                            String(
                                statusToFilter
                            ).trim().toLowerCase()
                    );

                }
            }

            return data;

        }, [
            applications,
            search,
            selectedLoanType,
            selectedRM,
            selectedTeamLead,
            selectedAgent,
            selectedStatus,
            dashboardStatus,
        ]);


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters =
        () => {

            setSearch("");

            setSelectedLoanType(
                loanType || ""
            );

            setSelectedRM("");

            setSelectedTeamLead("");

            setSelectedAgent("");

            setSelectedStatus(
                dashboardStatus || ""
            );
        };


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh =
        () => {

            fetchApplications();

        };


    // =========================================================
    // LOAN TYPE CHANGE
    // =========================================================

    const handleLoanTypeChange =
        (value) => {

            /*
             * If this is the dashboard-selected loan type,
             * keep it.
             *
             * Otherwise the table applies the selected
             * loan-type filter locally.
             */

            setSelectedLoanType(
                value || ""
            );

        };


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange =
        (value) => {

            setSelectedStatus(
                value || ""
            );

        };


    // =========================================================
    // ASSIGNMENT CHANGE
    // =========================================================

    const handleAssignmentChange =
        (
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
    // STATUS / LOAN TYPE MODALS
    // =========================================================

    /*
     * These callbacks are intentionally kept available for
     * ApplicationsTable.
     *
     * The Application Status drill-down is primarily a
     * read/drill-down page, so changes are not automatically
     * pushed into the dashboard URL.
     */


    const handleLoanTypeAction =
        (application) => {

            console.log(
                "Loan type action:",
                application
            );

        };


    const handleStatusAction =
        (application) => {

            console.log(
                "Status action:",
                application
            );

        };


    // =========================================================
    // REMINDER
    // =========================================================

    const handleReminder =
        (application) => {

            console.log(
                "Reminder:",
                application
            );

        };


    // =========================================================
    // CHAT
    // =========================================================

    const handleChat =
        (application) => {

            console.log(
                "Chat:",
                application
            );

        };


    // =========================================================
    // VIEW APPLICATION
    // =========================================================

    const handleViewApplication =
        (application) => {

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

    const getPageTitle =
        () => {

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
                            : `${filteredApplications.length} application${filteredApplications.length ===
                                1
                                ? ""
                                : "s"
                            }`}
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
                        filteredApplications
                    }


                    search={
                        search
                    }

                    setSearch={
                        setSearch
                    }


                    selectedLoanType={
                        selectedLoanType
                    }

                    setSelectedLoanType={
                        handleLoanTypeChange
                    }


                    selectedRM={
                        selectedRM
                    }

                    setSelectedRM={
                        setSelectedRM
                    }


                    selectedTeamLead={
                        selectedTeamLead
                    }

                    setSelectedTeamLead={
                        setSelectedTeamLead
                    }


                    selectedAgent={
                        selectedAgent
                    }

                    setSelectedAgent={
                        setSelectedAgent
                    }


                    selectedStatus={
                        selectedStatus
                    }

                    setSelectedStatus={
                        handleStatusChange
                    }


                    onClearFilters={
                        handleClearFilters
                    }


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

                />

            )}

        </div>

    );
};


export default ApplicationStatus;