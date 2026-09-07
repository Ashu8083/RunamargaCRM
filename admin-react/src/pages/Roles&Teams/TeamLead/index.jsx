// admin-react/src/pages/Role-management/TeamLead/index.jsx

import { useCallback, useEffect, useState } from "react";

import TeamLeadTable from "./components/TeamLeadTable";
import TeamLeadModal from "./components/TeamLeadModal";
import AssignedAgentsModal from "./components/AssignedAgentsModal";

import PermissionsModal from "../../../components/GlobalModels/PermissionsModal";
import FeedbackModal from "../../../components/GlobalModels/FeedbackModal";

import {
  getTeamLeads,
  createTeamLead,
  updateTeamLead,
  deleteTeamLead,
  updateTeamLeadStatus,
  getEmployees,
} from "./API";


function TeamLead() {
  const [search, setSearch] = useState("");

  const [employees, setEmployees] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showAgentsModal, setShowAgentsModal] = useState(false);

  const [selectedTeamLead, setSelectedTeamLead] = useState(null);

  const [showPermissionsModal, setShowPermissionsModal] =
    useState(false);

  const [feedback, setFeedback] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });


  // ========================================================================
  // FEEDBACK
  // ========================================================================

  const showFeedback = (type, title, message) => {
    setFeedback({
      open: true,
      type,
      title,
      message,
    });
  };


  const closeFeedback = () => {
    setFeedback((previous) => ({
      ...previous,
      open: false,
    }));
  };


  // ========================================================================
  // FORMAT TEAM LEAD
  // ========================================================================

  const formatTeamLead = useCallback((teamLead) => {

    if (!teamLead) {
      return null;
    }

    const employee = teamLead.employee || {};


    /*
     * Backend is the source of truth.
     *
     * employee_id = employees.id
     * context_id  = contexts.id
     *
     * id = EmployeeContext.id
     *
     * IMPORTANT:
     * Permissions must NEVER use teamLead.id as employee ID.
     */

    const rawEmployeeId =
      teamLead.employee_id ??
      teamLead.employeeId ??
      employee.id ??
      null;


    const rawContextId =
      teamLead.context_id ??
      teamLead.contextId ??
      null;


    const employeeId =
      rawEmployeeId !== null &&
      rawEmployeeId !== undefined &&
      rawEmployeeId !== ""
        ? Number(rawEmployeeId)
        : null;


    const contextId =
      rawContextId !== null &&
      rawContextId !== undefined &&
      rawContextId !== ""
        ? Number(rawContextId)
        : null;


    const isActive =
      teamLead.is_active !== undefined &&
      teamLead.is_active !== null
        ? Boolean(teamLead.is_active)
        : String(
            teamLead.status || "Active"
          ).toLowerCase() === "active";


    return {
      ...teamLead,

      /*
       * EmployeeContext primary key.
       */
      id:
        teamLead.id !== undefined &&
        teamLead.id !== null
          ? Number(teamLead.id)
          : null,


      /*
       * Actual employee ID.
       *
       * This is employees.id.
       */
      employeeId,
      employee_id: employeeId,


      name:
        teamLead.name ??
        employee.name ??
        "N/A",


      phone:
        teamLead.phone ??
        employee.phone ??
        "N/A",


      email:
        teamLead.email ??
        employee.email ??
        "N/A",


      /*
       * Actual Context ID.
       *
       * This is contexts.id.
       */
      contextId,
      context_id: contextId,


      contextName:
        teamLead.contextName ??
        teamLead.context_name ??
        teamLead.role?.name ??
        "Team Lead",


      /*
       * roleId is only a frontend alias for context_id.
       */
      roleId: contextId,


      role:
        teamLead.role ??
        (
          teamLead.contextName ||
          teamLead.context_name
            ? {
                name:
                  teamLead.contextName ??
                  teamLead.context_name ??
                  "Team Lead",

                value: contextId,
              }
            : null
        ),


      is_active: isActive,

      status:
        isActive
          ? "Active"
          : "Inactive",


      createdAt:
        teamLead.createdAt ??
        teamLead.created_at ??
        "N/A",


      updatedAt:
        teamLead.updatedAt ??
        teamLead.updated_at ??
        "N/A",
    };

  }, []);


  // ========================================================================
  // LOAD TEAM LEADS
  // ========================================================================

  const loadTeamLeads = useCallback(async () => {

    setLoading(true);
    setError("");

    try {

      const data = await getTeamLeads();

      const formattedTeamLeads =
        Array.isArray(data)
          ? data
              .map(formatTeamLead)
              .filter(Boolean)
          : [];

      setTeamLeads(formattedTeamLeads);

    } catch (error) {

      console.error(
        "Failed to load team leads:",
        error
      );

      setTeamLeads([]);

      setError(
        error?.response?.data?.detail ||
        "Unable to load team leads."
      );

    } finally {

      setLoading(false);

    }

  }, [formatTeamLead]);


  // ========================================================================
  // LOAD EMPLOYEES
  // ========================================================================

  const loadEmployees = useCallback(async () => {

    try {

      const data = await getEmployees();

      const formattedEmployees =
        Array.isArray(data)
          ? data
              .filter(
                (employee) =>
                  employee &&
                  employee.id !== undefined &&
                  employee.id !== null &&
                  employee.name
              )
              .map((employee) => ({
                ...employee,
                id: Number(employee.id),
                name: employee.name,
              }))
          : [];

      setEmployees(formattedEmployees);

    } catch (error) {

      console.error(
        "Failed to load employees:",
        error
      );

      setEmployees([]);

    }

  }, []);


  // ========================================================================
  // INITIAL LOAD
  // ========================================================================

  useEffect(() => {

    loadTeamLeads();
    loadEmployees();

  }, [
    loadTeamLeads,
    loadEmployees,
  ]);


  // ========================================================================
  // CREATE
  // ========================================================================

  const handleCreate = () => {

    setError("");
    setSelectedTeamLead(null);
    setShowModal(true);

  };


  // ========================================================================
  // EDIT
  // ========================================================================

  const handleEdit = (teamLead) => {

    setError("");

    /*
     * Always normalize before opening edit.
     *
     * This guarantees the modal gets the actual
     * employee/context IDs returned by backend.
     */
    const normalizedTeamLead =
      formatTeamLead(teamLead);

    setSelectedTeamLead(
      normalizedTeamLead
    );

    setShowModal(true);

  };


  // ========================================================================
  // CLOSE TEAM LEAD MODAL
  // ========================================================================

  const handleCloseModal = () => {

    setShowModal(false);
    setSelectedTeamLead(null);

  };


  // ========================================================================
  // CREATE / UPDATE
  // ========================================================================

  const handleSubmit = async (data) => {

    setError("");

    try {

      // --------------------------------------------------------------------
      // EDIT
      // --------------------------------------------------------------------

      if (data.isEdit) {

        /*
         * IMPORTANT:
         *
         * Employee cannot change during edit.
         * Status cannot change during edit.
         *
         * Only context_id is sent.
         */
        await updateTeamLead(
          data.teamLeadId,
          {
            context_id: Number(data.roleId),
          }
        );


        handleCloseModal();

        await loadTeamLeads();


        showFeedback(
          "success",
          "Team Lead Updated",
          "The Team Lead role was updated successfully."
        );

        return;
      }


      // --------------------------------------------------------------------
      // CREATE
      // --------------------------------------------------------------------

      await createTeamLead({
        employee_id:
          Number(data.employeeId),

        context_id:
          Number(data.roleId),

        status:
          data.status === "Inactive"
            ? "Inactive"
            : "Active",
      });


      handleCloseModal();

      await loadTeamLeads();


      showFeedback(
        "success",
        "Team Lead Created",
        "The Team Lead was created successfully."
      );

    } catch (error) {

      console.error(
        data.isEdit
          ? "Failed to update team lead:"
          : "Failed to create team lead:",
        error
      );


      showFeedback(
        "error",

        data.isEdit
          ? "Unable to Update Team Lead"
          : "Unable to Create Team Lead",

        error?.response?.data?.detail ||
          (
            data.isEdit
              ? "The Team Lead could not be updated. Please try again."
              : "The Team Lead could not be created. Please try again."
          )
      );

    }

  };


  // ========================================================================
  // DELETE
  // ========================================================================

  const handleDelete = async (teamLead) => {

    const confirmed =
      window.confirm(
        `Delete team lead "${teamLead.name}"?`
      );


    if (!confirmed) {
      return;
    }


    setError("");


    try {

      await deleteTeamLead(
        teamLead.id
      );


      setTeamLeads(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== teamLead.id
          )
      );


      if (
        selectedTeamLead?.id ===
        teamLead.id
      ) {

        setSelectedTeamLead(null);

      }


      showFeedback(
        "success",
        "Team Lead Deleted",
        "The Team Lead was deleted successfully."
      );

    } catch (error) {

      console.error(
        "Failed to delete team lead:",
        error
      );


      showFeedback(
        "error",
        "Unable to Delete Team Lead",
        error?.response?.data?.detail ||
          "The Team Lead could not be deleted. Please try again."
      );

    }

  };


  // ========================================================================
  // STATUS CHANGE
  // ========================================================================

  const handleStatusChange = async (
    teamLead,
    status
  ) => {

    if (
      status !== "Active" &&
      status !== "Inactive"
    ) {
      return;
    }


    setError("");


    try {

      const response =
        await updateTeamLeadStatus(
          teamLead.id,
          status
        );


      const updatedTeamLead =
        response
          ? formatTeamLead(response)
          : null;


      setTeamLeads(
        (previous) =>
          previous.map((item) => {

            if (
              item.id !==
              teamLead.id
            ) {
              return item;
            }


            return (
              updatedTeamLead || {
                ...item,

                is_active:
                  status === "Active",

                status,
              }
            );

          })
      );


      setSelectedTeamLead(
        (previous) => {

          if (
            !previous ||
            previous.id !==
              teamLead.id
          ) {
            return previous;
          }


          return (
            updatedTeamLead || {
              ...previous,

              is_active:
                status === "Active",

              status,
            }
          );

        }
      );


      showFeedback(
        "success",
        "Status Updated",
        `Team Lead status changed to ${status}.`
      );

    } catch (error) {

      console.error(
        "Failed to update team lead status:",
        error
      );


      showFeedback(
        "error",
        "Unable to Update Status",
        error?.response?.data?.detail ||
          "The Team Lead status could not be updated. Please try again."
      );

    }

  };


  // ========================================================================
  // VIEW ASSIGNED AGENTS
  // ========================================================================

  const handleViewAgents = (
    teamLead
  ) => {

    const normalizedTeamLead =
      formatTeamLead(teamLead);


    setSelectedTeamLead(
      normalizedTeamLead
    );

    setShowAgentsModal(true);

  };


  // ========================================================================
  // CLOSE AGENTS MODAL
  // ========================================================================

  const handleCloseAgents = () => {

    setShowAgentsModal(false);
    setSelectedTeamLead(null);

  };


  // ========================================================================
  // MANAGE PERMISSIONS
  // ========================================================================

  const handleManagePermissions = (
    teamLead
  ) => {

    if (!teamLead) {
      return;
    }


    /*
     * IMPORTANT:
     *
     * teamLead.id
     *     = EmployeeContext.id
     *
     * teamLead.employee_id
     *     = employees.id
     *
     * teamLead.context_id
     *     = contexts.id
     *
     * PermissionsModal MUST receive
     * employee_id + context_id.
     */


    const normalizedTeamLead =
      formatTeamLead(teamLead);


    if (!normalizedTeamLead) {

      showFeedback(
        "error",
        "Unable to Manage Permissions",
        "Invalid Team Lead data."
      );

      return;

    }


    const employeeId =
      normalizedTeamLead.employee_id;


    const contextId =
      normalizedTeamLead.context_id;


    const employeeContextId =
      normalizedTeamLead.id;


    /*
     * Validate IDs before opening modal.
     */

    if (
      !Number.isInteger(employeeId) ||
      employeeId <= 0
    ) {

      showFeedback(
        "error",
        "Invalid Employee",
        "The Team Lead employee ID is invalid."
      );

      return;

    }


    if (
      !Number.isInteger(contextId) ||
      contextId <= 0
    ) {

      showFeedback(
        "error",
        "Invalid Context",
        "The Team Lead context ID is invalid."
      );

      return;

    }


    if (
      !Number.isInteger(employeeContextId) ||
      employeeContextId <= 0
    ) {

      showFeedback(
        "error",
        "Invalid Team Lead",
        "The Team Lead EmployeeContext ID is invalid."
      );

      return;

    }


    /*
     * The existing Permissions backend requires
     * the EmployeeContext to be active when saving.
     *
     * Therefore do not open the permissions editor
     * for an inactive Team Lead.
     *
     * User can change the Team Lead status to Active
     * first and then manage permissions.
     */

    if (
      normalizedTeamLead.is_active !== true
    ) {

      showFeedback(
        "warning",
        "Team Lead Is Inactive",
        "Activate this Team Lead before managing permissions."
      );

      return;

    }


    /*
     * Keep both naming formats so the existing
     * global PermissionsModal receives the exact
     * same IDs regardless of its fallback logic.
     */

    const permissionsTeamLead = {
      ...normalizedTeamLead,

      employee_id:
        employeeId,

      employeeId:
        employeeId,

      context_id:
        contextId,

      contextId:
        contextId,
    };


    console.log(
      "Team Lead Permissions Payload:",
      {
        employeeContextId,
        employeeId,
        contextId,
      }
    );


    setSelectedTeamLead(
      permissionsTeamLead
    );

    setShowPermissionsModal(true);

  };


  // ========================================================================
  // CLOSE PERMISSIONS
  // ========================================================================

  const handleClosePermissions = () => {

    setShowPermissionsModal(false);
    setSelectedTeamLead(null);

  };


  // ========================================================================
  // REFRESH
  // ========================================================================

  const handleRefresh = async () => {

    setError("");

    await loadTeamLeads();
    await loadEmployees();

  };


  // ========================================================================
  // RENDER
  // ========================================================================

  return (

    <div
      className="
        space-y-5
        p-4
        sm:p-6
      "
    >


      {error && (

        <div
          className="
            rounded-lg
            border
            border-error/20
            bg-error/5
            px-4
            py-3
          "
        >

          <p
            className="
              text-sm
              text-error
            "
          >
            {error}
          </p>

        </div>

      )}


      <TeamLeadTable
        teamLeads={teamLeads}
        search={search}
        setSearch={setSearch}

        onCreate={
          handleCreate
        }

        onEdit={
          handleEdit
        }

        onDelete={
          handleDelete
        }

        onRefresh={
          handleRefresh
        }

        onViewAgents={
          handleViewAgents
        }

        onManagePermissions={
          handleManagePermissions
        }

        onStatusChange={
          handleStatusChange
        }
      />


      <TeamLeadModal
        open={showModal}
        teamLead={selectedTeamLead}
        employees={employees}

        onClose={
          handleCloseModal
        }

        onSubmit={
          handleSubmit
        }
      />


      <AssignedAgentsModal
        open={showAgentsModal}
        teamLead={selectedTeamLead}

        onClose={
          handleCloseAgents
        }
      />


      <PermissionsModal
        open={
          showPermissionsModal
        }

        admin={
          selectedTeamLead
        }

        employeeId={
          selectedTeamLead?.employee_id
        }

        contextId={
          selectedTeamLead?.context_id
        }

        onClose={
          handleClosePermissions
        }
      />


      <FeedbackModal
        open={
          feedback.open
        }

        type={
          feedback.type
        }

        title={
          feedback.title
        }

        message={
          feedback.message
        }

        onClose={
          closeFeedback
        }
      />

    </div>

  );

}


export default TeamLead;