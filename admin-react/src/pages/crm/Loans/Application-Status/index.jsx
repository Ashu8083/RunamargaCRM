// admin-react/src/pages/crm/Loans/Application-Status/index.jsx

import {
    lazy,
    Suspense,
    useEffect,
    useMemo,
    useRef,
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
    getApplicationStatusApplications
} from "./API";
import { deleteApplication
} from '../CombinedApplications/Api'
import ApplicationsTable from "./components/ApplicationsTable";
import FeedbackModal from '../../../../components/GlobalModels/FeedbackModal'

const INITIAL_FEEDBACK = {
    open: false,
    type: 'success',
    title: '',
    message: '',
};

const getOperationErrorMessage = (
    error,
    fallbackMessage
) => {
    const detail = error?.response?.data?.detail;

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.msg || item?.message
            )
            .filter(Boolean);

        if (messages.length) {
            return messages.join(', ');
        }
    }

    if (typeof detail === 'string' && detail) {
        return detail;
    }

    if (detail && typeof detail === 'object') {
        const detailMessage =
            detail.message || detail.msg;

        if (typeof detailMessage === 'string' && detailMessage) {
            return detailMessage;
        }
    }

    const message = error?.response?.data?.message;

    return typeof message === 'string' && message
        ? message
        : fallbackMessage;
};

// =============================================================
// NORMALIZE APPLICATION
// =============================================================
// The dashboard API returns raw snake_case rows. The
// ApplicationsTable component expects camelCase aliases
// (rmId, agentId, agent_context_id, rm_context_id, ...).
// This mapping ensures both shapes exist on every row.
// =============================================================

const mapApplication = (application) => ({
    // ---------------------------------------------------------
    // IDENTITY
    // ---------------------------------------------------------
    id: application.id,

    // Keep the database primary key explicit for reminder creation.
    applicationId: application.id,

    loanId:
        application.unique_id ??
        application.uniqueId ??
        application.loanId ??
        application.loan_id ??
        application.id,

    unique_id:
        application.unique_id ??
        application.uniqueId ??
        null,

    // ---------------------------------------------------------
    // BASIC
    // ---------------------------------------------------------
    name: application.name ?? "",
    phone: application.phone ?? "",
    email: application.email ?? "",

    gender: application.gender,
    alternatePhone:
        application.alternate_phone ??
        application.alternatePhone,
    alternateEmail:
        application.alternate_email ??
        application.alternateEmail,
    maritalStatus:
        application.marital_status ??
        application.maritalStatus,
    dob: application.dob,

    // ---------------------------------------------------------
    // LOAN TYPE
    // ---------------------------------------------------------
    loanTypeId:
        application.loan_type_id ??
        application.loanTypeId,

    loan_type_id:
        application.loan_type_id ??
        application.loanTypeId,

    loanType:
        application.loan_type ??
        application.loanType,

    loan_type:
        application.loan_type ??
        application.loanType,

    // ---------------------------------------------------------
    // AMOUNT / TENURE / PURPOSE
    // ---------------------------------------------------------
    amount:
        application.display_amount ??
        application.loan_amt ??
        application.loanAmount ??
        application.loan_amount ??
        application.amount,

    loan_amt:
        application.loan_amt ??
        application.loanAmount,

    loanTenure:
        application.loan_tenure ??
        application.loanTenure,

    loan_tenure:
        application.loan_tenure ??
        application.loanTenure,

    loanPurpose:
        application.loan_purpose ??
        application.loanPurpose,

    loan_purpose:
        application.loan_purpose ??
        application.loanPurpose,

    creditScore:
        application.credit_score ??
        application.creditScore,

    // ---------------------------------------------------------
    // REFERRAL / APPLIED BY
    // ---------------------------------------------------------
    referral: application.referral ?? "",

    appliedById:
        application.applied_by_id ??
        application.appliedById,

    appliedBy:
        application.applied_by ??
        application.appliedBy,

    // ---------------------------------------------------------
    // AGENT  (all aliases so ApplicationsTable + dropdowns work)
    // ---------------------------------------------------------
    agentId:
        application.agent_id ??
        application.agentId ??
        application.agent_context_id ??
        application.processingAgentId ??
        application.processing_agent_id,

    agent_id:
        application.agent_id ??
        application.agentId ??
        application.agent_context_id,

    agent_context_id:
        application.agent_context_id ??
        application.agent_id ??
        application.agentId,

    agent:
        application.agent ?? null,

    agentName:
        application.agent_name ??
        application.agentName ??
        application.agent?.name ??
        application.processingAgent?.name ??
        "",

    agent_name:
        application.agent_name ??
        application.agentName ??
        application.agent?.name ??
        "",

    // ---------------------------------------------------------
    // RM
    // ---------------------------------------------------------
    rmId:
        application.rm_id ??
        application.rmId,

    rm_id:
        application.rm_id ??
        application.rmId,

    rm:
        application.rm ?? null,

    rm_context_id:
        application.rm_context_id ??
        application.rm_id ??
        application.rmId,

    rmName:
        application.rm_name ??
        application.rmName ??
        application.rm?.name ??
        "",

    rm_name:
        application.rm_name ??
        application.rmName ??
        application.rm?.name ??
        "",

    // ---------------------------------------------------------
    // TEAM LEAD
    // ---------------------------------------------------------
    teamLeadId:
        application.team_lead_id ??
        application.teamLeadId,

    team_lead_id:
        application.team_lead_id ??
        application.teamLeadId,

    teamLeadName:
        application.team_lead_name ??
        application.teamLeadName,

    team_lead_name:
        application.team_lead_name ??
        application.teamLeadName,

    // ---------------------------------------------------------
    // STATUS
    // ---------------------------------------------------------
    status:
        application.status ?? "",

    sanctionDate:
        application.sanction_date ??
        application.sanctionDate,

    rejectionDate:
        application.rejection_date ??
        application.rejectionDate,

    loggedinDate:
        application.loggedin_date ??
        application.loggedinDate,

    docsPendingDate:
        application.docspending_date ??
        application.docsPendingDate,

    // ---------------------------------------------------------
    // REVERTED
    // ---------------------------------------------------------
    revertedStatus:
        application.reverted_status ??
        application.revertedStatus,

    revertedReason:
        application.reverted_reason ??
        application.revertedReason ??
        "",

    revertedDate:
        application.reverted_date ??
        application.revertedDate ??
        null,

    revertedByName:
        application.reverted_by_name ??
        application.revertedByName ??
        "",

    revertedByRole:
        application.reverted_by_role ??
        application.revertedByRole ??
        "",

    // ---------------------------------------------------------
    // REJECTED
    // ---------------------------------------------------------
    rejectionReason:
        application.rejected_remarks ??
        application.rejection_reason ??
        application.rejectionReason ??
        "",

    rejectedRemarks:
        application.rejected_remarks ??
        application.rejectedRemarks ??
        "",

    // ---------------------------------------------------------
    // LOCATION / MISC
    // ---------------------------------------------------------
    stateId:
        application.state_id ??
        application.stateId,

    cityId:
        application.city_id ??
        application.cityId,

    languageId:
        application.language_id ??
        application.languageId,

    ivrId:
        application.ivr_id ??
        application.ivrId,

    appliedDate:
        application.applied_date ??
        application.appliedDate ??
        "",

    createdAt:
        application.created_at ??
        application.createdAt,

    updatedAt:
        application.updated_at ??
        application.updatedAt,
});


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

    const navigate = useNavigate();

    const [selectedLoanType, setSelectedLoanType] =
        useState('')

    const [selectedRM, setSelectedRM] =
        useState('')

    const [selectedTeamLead, setSelectedTeamLead] =
        useState('')

    const [selectedAgent, setSelectedAgent] =
        useState('')

    const [selectedStatus, setSelectedStatus] =
        useState('')
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

    const [feedback, setFeedback] = useState(
        INITIAL_FEEDBACK
    );

    const requestSequence = useRef(0);

    const closeFeedback = () => {
        setFeedback(INITIAL_FEEDBACK);
    };

    const openSuccessFeedback = (
        title,
        message
    ) => {
        setFeedback({
            open: true,
            type: 'success',
            title,
            message,
        });
    };

    const openErrorFeedback = (
        title,
        error,
        fallbackMessage
    ) => {
        setFeedback({
            open: true,
            type: 'error',
            title,
            message: getOperationErrorMessage(
                error,
                fallbackMessage
            ),
        });
    };


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

        const requestId =
            ++requestSequence.current;

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

            if (
                requestId !==
                requestSequence.current
            ) {
                return;
            }


            // =================================================
            // APPLICATIONS  →  MAP INTO TABLE SHAPE
            // =================================================

            const rawData =
                Array.isArray(response?.data)
                    ? response.data
                    : [];

            const mappedApplications =
                rawData.map(mapApplication);


            setApplications(
                mappedApplications
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

            if (
                requestId !==
                requestSequence.current
            ) {
                return;
            }

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

            if (
                requestId ===
                requestSequence.current
            ) {
                setLoading(false);
            }

        }

    };




    const handleDeleteApplication = async (application) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the application for ${application.name || "this customer"
            }?`
        );

        if (!confirmed) return;

        try {
            await deleteApplication(
                application.unique_id ?? application.id
            );

            openSuccessFeedback(
                'Application deleted',
                'The application was deleted successfully.'
            );

            // Refresh the current applications page.
            await fetchApplications(
                currentPage,
                tableFilters
            );
        } catch (error) {
            console.error("Failed to delete application:", error);

            openErrorFeedback(
                'Unable to delete application',
                error,
                'Failed to delete application.'
            );
        }
    };

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

        requestSequence.current += 1;

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

        setSelectedLoanType(
            loanType || ""
        );

        setSelectedRM('');

        setSelectedTeamLead('');

        setSelectedAgent('');

        setSelectedStatus(
            dashboardStatus || ""
        );


        setCurrentPage(1);

    }, [
        loanType,
        dashboardStatus,
    ]);


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {

        requestSequence.current += 1;

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

        setSelectedLoanType(
            clearedFilters.selectedLoanType
        );

        setSelectedRM('');

        setSelectedTeamLead('');

        setSelectedAgent('');

        setSelectedStatus(
            clearedFilters.selectedStatus
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
    // LOAN TYPE CHANGE (filter dropdown)
    // =========================================================

    const handleLoanTypeChange = (
        value
    ) => {

        const nextValue = value || "";

        setSelectedLoanType(
            nextValue
        );

        setTableFilters((previous) => ({
            ...previous,
            selectedLoanType: nextValue,
        }));

        requestSequence.current += 1;

        setCurrentPage(
            1
        );

    };


    // =========================================================
    // STATUS CHANGE (filter dropdown)
    // =========================================================

    const handleStatusChange = (
        value
    ) => {

        const nextValue = value || "";

        setSelectedStatus(
            nextValue
        );

        setTableFilters((previous) => ({
            ...previous,
            selectedStatus: nextValue,
        }));

        requestSequence.current += 1;

        setCurrentPage(
            1
        );

    };


    // =========================================================
    // RM CHANGE
    // =========================================================

    const handleRMChange = (
        value
    ) => {

        const nextValue = value || "";

        setSelectedRM(
            nextValue
        );

        setTableFilters((previous) => ({
            ...previous,
            selectedRM: nextValue,
        }));

        requestSequence.current += 1;

        setCurrentPage(
            1
        );

    };


    // =========================================================
    // TEAM LEAD CHANGE
    // =========================================================

    const handleTeamLeadChange = (
        value
    ) => {

        const nextValue = value || "";

        setSelectedTeamLead(
            nextValue
        );

        setTableFilters((previous) => ({
            ...previous,
            selectedTeamLead: nextValue,
        }));

        requestSequence.current += 1;

        setCurrentPage(
            1
        );

    };


    // =========================================================
    // AGENT CHANGE
    // =========================================================

    const handleAgentChange = (
        value
    ) => {

        const nextValue = value || "";

        setSelectedAgent(
            nextValue
        );

        setTableFilters((previous) => ({
            ...previous,
            selectedAgent: nextValue,
        }));

        requestSequence.current += 1;

        setCurrentPage(
            1
        );

    };


    // =========================================================
    // SEARCH CHANGE
    // =========================================================

    const handleSearchChange = (
        value
    ) => {

        requestSequence.current += 1;

        setTableFilters((previous) => ({
            ...previous,
            search: value || "",
        }));

        setCurrentPage(1);

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

        requestSequence.current += 1;

        setCurrentPage(
            page
        );

    };


    // =========================================================
    // ASSIGNMENT CHANGE
    // =========================================================
    // Normalizes the response from /shuffle-loans/assign
    // so the row dropdown `value` stays in sync after an
    // RM / Agent change.
    // =========================================================

    const handleAssignmentChange = (
        applicationId,
        updatedApplication
    ) => {

        setApplications(
            (previous) =>
                previous.map(
                    (application) => {

                        if (
                            application.id !==
                            applicationId
                        ) {
                            return application;
                        }

                        return {
                            ...application,
                            ...updatedApplication,

                            // ---- RM ----
                            rmId:
                                updatedApplication?.rmId ??
                                updatedApplication?.rm_id ??
                                application.rmId,

                            rm_id:
                                updatedApplication?.rm_id ??
                                updatedApplication?.rmId ??
                                application.rm_id,

                            rm_context_id:
                                updatedApplication?.rm_context_id ??
                                updatedApplication?.rm_id ??
                                updatedApplication?.rmId ??
                                application.rm_context_id,

                            rm:
                                updatedApplication?.rm ??
                                application.rm,

                            rmName:
                                updatedApplication?.rmName ??
                                updatedApplication?.rm_name ??
                                application.rmName,

                            rm_name:
                                updatedApplication?.rm_name ??
                                updatedApplication?.rmName ??
                                application.rm_name,

                            // ---- AGENT ----
                            agentId:
                                updatedApplication?.agentId ??
                                updatedApplication?.agent_id ??
                                updatedApplication?.agent_context_id ??
                                application.agentId,

                            agent_id:
                                updatedApplication?.agent_id ??
                                updatedApplication?.agentId ??
                                updatedApplication?.agent_context_id ??
                                application.agent_id,

                            agent_context_id:
                                updatedApplication?.agent_context_id ??
                                updatedApplication?.agent_id ??
                                updatedApplication?.agentId ??
                                application.agent_context_id,

                            agent:
                                updatedApplication?.agent ??
                                application.agent,

                            agentName:
                                updatedApplication?.agentName ??
                                updatedApplication?.agent_name ??
                                application.agentName,

                            agent_name:
                                updatedApplication?.agent_name ??
                                updatedApplication?.agentName ??
                                application.agent_name,
                        };
                    }
                )
        );

    };

    const handleAssignmentSuccess = (
        label = 'Assignment'
    ) => {
        openSuccessFeedback(
            `${label} updated`,
            `${label} was updated successfully.`
        );
    };

    const handleAssignmentError = (
        error,
        label = 'Assignment'
    ) => {
        openErrorFeedback(
            `Unable to update ${label}`,
            error,
            `Failed to update ${label.toLowerCase()}.`
        );
    };


    // =========================================================
    // STATUS / LOAN TYPE MODALS (row cell actions)
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
            `/crm/view-application/${uniqueId}`
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

                            : `${totalApplications} application${totalApplications === 1
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


            <ApplicationsTable
                applications={applications}

                currentPage={currentPage}
                totalPages={totalPages}
                totalApplications={totalApplications}
                pageSize={pageSize}
                loading={loading}

                search={tableFilters.search}
                setSearch={handleSearchChange}

                selectedLoanType={selectedLoanType}
                setSelectedLoanType={handleLoanTypeChange}

                selectedRM={selectedRM}
                setSelectedRM={handleRMChange}

                selectedTeamLead={selectedTeamLead}
                setSelectedTeamLead={handleTeamLeadChange}

                selectedAgent={selectedAgent}
                setSelectedAgent={handleAgentChange}

                selectedStatus={selectedStatus}
                setSelectedStatus={handleStatusChange}

                onClearFilters={handleClearFilters}

                onLoanTypeChange={handleLoanTypeAction}
                onStatusChange={handleStatusAction}

                onReminder={handleReminder}
                onChat={handleChat}
                onViewApplication={handleViewApplication}

                onRefresh={fetchApplications}

                onAssignmentChange={handleAssignmentChange}
                onAssignmentSuccess={handleAssignmentSuccess}
                onAssignmentError={handleAssignmentError}
                onDeleteApplication={handleDeleteApplication}
                onPageChange={handlePageChange}
            />


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
                            selectedApplication?.applicationId ??
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

            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                autoClose={feedback.type === 'success'}
                onClose={closeFeedback}
            />

        </div>

    );

};


export default ApplicationStatus;
