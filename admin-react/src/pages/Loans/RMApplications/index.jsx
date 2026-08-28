// admin-react/src/pages/Loans/RMApplications/index.jsx

import { useState, useMemo } from "react";

import RMApplicationsTable from "./components/RMApplicationsTable";
import LoanTypeModal from "../../../components/GlobalModels/Loans/LoanTypeModal";
import StatusModal from "../../../components/GlobalModels/Loans/StatusModal";
import ReminderModal from "../../../components/GlobalModels/Loans/ReminderModal";

function RMApplications() {
  const [search, setSearch] = useState("");

  const [selectedLoanType, setSelectedLoanType] = useState("");

  const [selectedRM, setSelectedRM] = useState("");

  const [applications, setApplications] = useState([
    {
      id: 1,
      loanId: "RM-2026-0001",
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh@example.com",
      loanType: "Personal Loan",
      amount: "500000",
      status: "Inprocess",
      appliedDate: "2026-08-20",
      appliedBy: "Premalatha N",
      referral: "Deepa",
      rmName: "Premalatha N",
      rmId: 201,
      processingAgent: "Prashanth",
      agentId: 101,
    },
    {
      id: 2,
      loanId: "RM-2026-0002",
      name: "Priya Sharma",
      phone: "9876543211",
      email: "priya@example.com",
      loanType: "Business Loan",
      amount: "1000000",
      status: "Docs Pending",
      appliedDate: "2026-08-20",
      appliedBy: "Premalatha N",
      referral: "Suresh",
      rmName: "Premalatha N",
      rmId: 201,
      processingAgent: "Kasturi",
      agentId: 102,
    },
    {
      id: 3,
      loanId: "RM-2026-0003",
      name: "Arun Kumar",
      phone: "9876543212",
      email: "arun@example.com",
      loanType: "Home Loan",
      amount: "2500000",
      status: "Rejected",
      appliedDate: "2026-08-19",
      appliedBy: "Shubha",
      referral: "Mahesh",
      rmName: "Shubha",
      rmId: 202,
      processingAgent: "Kasturi",
      agentId: 103,
    },
    {
      id: 4,
      loanId: "RM-2026-0004",
      name: "Sneha Reddy",
      phone: "9876543213",
      email: "sneha@example.com",
      loanType: "Personal Loan",
      amount: "300000",
      status: "Inprocess",
      appliedDate: "2026-08-18",
      appliedBy: "Prasanna Y R",
      referral: "Deepa",
      rmName: "Prasanna Y R",
      rmId: 203,
      processingAgent: "Nayana",
      agentId: 104,
    },
  ]);

  // =========================================================
  // SELECTED APPLICATION
  // =========================================================

  const [selectedApplication, setSelectedApplication] = useState(null);

  // =========================================================
  // LOAN TYPE MODAL
  // =========================================================

  const [showLoanTypeModal, setShowLoanTypeModal] = useState(false);
  const filteredApplications = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (!searchValue) {
        return true;
      }

      const searchableValues = [
        application.name,
        application.phone,
        application.email,
        application.loanType,
        application.loanId,
        application.appliedBy,
        application.referral,
        application.rmName,
        application.processingAgent,
      ];

      return searchableValues.some(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(searchValue),
      );
    });
  }, [applications, search]);

  const handleLoanTypeChange = (application) => {
    setSelectedApplication(application);

    setShowLoanTypeModal(true);
  };

  const handleCloseLoanTypeModal = () => {
    setShowLoanTypeModal(false);

    setSelectedApplication(null);
  };

  const handleLoanTypeSubmit = (data) => {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === data.id
          ? {
              ...application,
              loanType: data.loanType,
              updatedAt: new Date().toLocaleString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              }),
            }
          : application,
      ),
    );

    handleCloseLoanTypeModal();
  };

  // =========================================================
  // STATUS MODAL
  // =========================================================

  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusChange = (application) => {
    setSelectedApplication(application);

    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);

    setSelectedApplication(null);
  };

  const handleStatusSubmit = (data) => {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === data.id
          ? {
              ...application,
              status: data.status,
              rejectionReason: data.rejectionReason || "",
              updatedAt: new Date().toLocaleString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              }),
            }
          : application,
      ),
    );

    handleCloseStatusModal();
  };

  // =========================================================
  // REMINDER MODAL
  // =========================================================

  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleReminder = (application) => {
    setSelectedApplication(application);

    setShowReminderModal(true);
  };

  const handleCloseReminderModal = () => {
    setShowReminderModal(false);

    setSelectedApplication(null);
  };

  const handleReminderSubmit = (data) => {
    /*
     * API integration will be added later.
     *
     * Example:
     *
     * POST /applications/{applicationId}/reminders
     */

    console.log("Reminder:", data);

    handleCloseReminderModal();
  };

  // =========================================================
  // VIEW APPLICATION
  // =========================================================

  const handleViewApplication = (application) => {
    /*
     * Application details/view page will be connected later.
     */

    console.log("View RM Application:", application);
  };

  // =========================================================
  // CHAT
  // =========================================================

  const handleChat = (application) => {
    /*
     * GlobalChat is handled inside RMApplicationsTable.
     *
     * loanId and agentId are passed there.
     */

    console.log("Open RM Application Chat:", {
      loanId: application.loanId || application.loan_id || application.id,

      agentId: application.agentId || application.agent_id,
    });
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    /*
     * API refresh will be added later.
     */

    console.log("Refresh RM applications");
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {
    setSearch("");

    setSelectedLoanType("");

    setSelectedRM("");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
            p-4
            sm:p-6
            space-y-5
        "
    >
      <RMApplicationsTable
        applications={filteredApplications}
        search={search}
        setSearch={setSearch}
        selectedLoanType={selectedLoanType}
        setSelectedLoanType={setSelectedLoanType}
        selectedRM={selectedRM}
        setSelectedRM={setSelectedRM}
        onClearFilters={handleClearFilters}
        onLoanTypeChange={handleLoanTypeChange}
        onStatusChange={handleStatusChange}
        onReminder={handleReminder}
        onChat={handleChat}
        onViewApplication={handleViewApplication}
        onRefresh={handleRefresh}
      />

      {/* =====================================================
                LOAN TYPE MODAL
            ===================================================== */}

      <LoanTypeModal
        open={showLoanTypeModal}
        application={selectedApplication}
        onClose={handleCloseLoanTypeModal}
        onSubmit={handleLoanTypeSubmit}
      />

      {/* =====================================================
                STATUS MODAL
            ===================================================== */}

      <StatusModal
        open={showStatusModal}
        application={selectedApplication}
        onClose={handleCloseStatusModal}
        onSubmit={handleStatusSubmit}
      />

      {/* =====================================================
                REMINDER MODAL
            ===================================================== */}

      <ReminderModal
        open={showReminderModal}
        application={selectedApplication}
        onClose={handleCloseReminderModal}
        onSubmit={handleReminderSubmit}
      />
    </div>
  );
}

export default RMApplications;
