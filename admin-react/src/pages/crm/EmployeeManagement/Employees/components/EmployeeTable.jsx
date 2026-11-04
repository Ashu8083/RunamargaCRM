// admin-react/src/pages/EmployeeManagement/Employees/components/EmployeeTable.jsx

import { useMemo } from "react";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import NoSymbolIcon from "@heroicons/react/24/outline/NoSymbolIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { PERMISSIONS, hasPermission } from '../../../../../app/permissions'

const canCreateEmployee = hasPermission(PERMISSIONS.EMPLOYEES_CREATE)
const canEditEmployee = hasPermission(PERMISSIONS.EMPLOYEES_EDIT)
const canDeleteEmployee = hasPermission(PERMISSIONS.EMPLOYEES_DELETE)
const canBlockEmployee = hasPermission(PERMISSIONS.EMPLOYEES_BLOCK)


function EmployeeTable({
  employees = [],
  search = "",
  setSearch,
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
  onBlockChange,
}) {
  // =========================================================
  // FILTER
  // =========================================================

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(value) ||
        employee.email?.toLowerCase().includes(value) ||
        employee.phone?.toLowerCase().includes(value) ||
        employee.employeeId?.toLowerCase().includes(value) ||
        employee.role?.name?.toLowerCase().includes(value),
    );
  }, [employees, search]);

  // =========================================================
  // BLOCK / UNBLOCK
  // =========================================================

  const handleBlockClick = (employee) => {
    onBlockChange?.(employee, !employee.blocked);
  };

  const handleClear = () => {
    setSearch("");
  };

  // =========================================================
  // STATUS STYLING
  // =========================================================

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase();

    if (normalizedStatus === "active") {
      return "border-green-300 bg-green-50 text-green-700";
    }

    if (normalizedStatus === "inactive") {
      return "border-red-300 bg-red-50 text-red-700";
    }

    if (normalizedStatus === "wfh") {
      return "border-blue-300 bg-blue-50 text-blue-700";
    }

    return "border-base-300 bg-base-200 text-base-content/70";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-4">
      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
            {/* SEARCH */}

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                Search
              </label>

              <div className="relative">
                <MagnifyingGlassIcon
                  className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    h-4 w-4 -translate-y-1/2
                    text-base-content/35
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name, employee ID, email or date..."
                  className="
                    input input-bordered
                    h-10 min-h-10 w-full pl-9
                  "
                />
              </div>
            </div>

            {/* CLEAR */}

            <button
              type="button"
              onClick={handleClear}
              className="btn btn-ghost h-10 min-h-10"
            >
              Clear
            </button>

            {/* DIVIDER */}

            <div className="hidden h-8 border-l border-base-300 xl:block" />

            {/* ADD EMPLOYEE */}

            <button
              type="button"
              onClick={onCreate}
              disabled={!canCreateEmployee}
              className="
                btn h-10 min-h-10
                border-[#8BCF00]
                bg-[#8BCF00] text-white
                hover:border-[#6FA800]
                hover:bg-[#6FA800]
              "
            >
              <PlusIcon className="h-5 w-5" />
              Add Employee
            </button>

            {/* REFRESH */}

            <button
              type="button"
              onClick={onRefresh}
              className="
                btn h-10 min-h-10
                border-[#8BCF00]
                text-[#78B300]
                hover:bg-[#8BCF00]
                hover:text-white
              "
            >
              <ArrowPathIcon className="h-5 w-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            {/* HEADER */}

            <thead>
              <tr className="border-b border-base-300">
                {[
                  "Name",
                  "Employee Code",
                  "Email",
                  "Phone",
                  "Role",
                  "Status",
                  "Blocked",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`
                      px-5 py-5
                      text-sm font-semibold
                      text-base-content
                      ${
                        heading === "Actions"
                          ? "text-center"
                          : "text-left"
                      }
                    `}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="
                      border-b border-base-300
                      transition hover:bg-base-200/20
                      last:border-b-0
                    "
                  >
                    {/* NAME */}

                    <td className="px-5 py-5">
                      <div>
                        <p className="whitespace-nowrap text-sm font-medium text-base-content">
                          {employee.name}
                        </p>

                        {employee.employeeId && (
                          <p className="mt-0.5 font-mono text-[10px] text-base-content/40">
                            {employee.employeeId}
                          </p>
                        )}
                      </div>
                    </td>
                    {/* EMPLOYEE CODE */}

                    <td className="px-5 py-5">
                      <div>
                        <p className="whitespace-nowrap text-sm font-medium text-base-content">
                          {employee.employee_code || "—"}
                        </p>
                      </div>
                    </td>
                    {/* EMAIL */}

                    <td className="px-5 py-5">
                      <span className="whitespace-nowrap text-sm text-base-content">
                        {employee.email || "—"}
                      </span>
                    </td>

                    {/* PHONE */}

                    <td className="px-5 py-5">
                      <span className="whitespace-nowrap text-sm text-base-content">
                        {employee.phone || "—"}
                      </span>
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-5">
                      <span className="text-sm text-base-content">
                        {employee.role?.name || "—"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-5">
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          border
                          px-3 py-1
                          text-xs font-semibold
                          ${getStatusClass(employee.status)}
                        `}
                      >
                        {employee.status || "Unknown"}
                      </span>
                    </td>

                    {/* BLOCKED */}

                    <td className="px-5 py-5">
                      <button
                        type="button"
                        onClick={() =>
                          handleBlockClick(employee)
                        }
                        disabled={!canBlockEmployee}
                        title={
                          employee.blocked
                            ? "Unblock Employee"
                            : "Block Employee"
                        }
                        className={`
                          inline-flex min-w-[42px]
                          items-center justify-center
                          rounded-full px-3 py-1
                          text-xs font-semibold text-white
                          transition
                          ${
                            employee.blocked
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-[#2d8036] hover:bg-[#24682b]"
                          }
                        `}
                      >
                        {employee.blocked ? "Yes" : "No"}
                      </button>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-5">
                      <div className="flex items-center justify-center gap-1">
                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            onEdit?.(employee)
                          }
                          title="Edit Employee"
                          className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full border border-base-300
                            bg-base-100
                            text-base-content/55
                            transition
                            hover:bg-base-200
                            hover:text-base-content
                          "
                          disabled={!canEditEmployee}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>

                        {/* BLOCK / UNBLOCK */}

                        <button
                          type="button"
                          onClick={() =>
                            handleBlockClick(employee)
                          }
                          disabled={!canBlockEmployee}
                          title={
                            employee.blocked
                              ? "Unblock Employee"
                              : "Block Employee"
                          }
                          className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full border border-base-300
                            bg-base-100
                            text-orange-500
                            transition hover:bg-orange-50
                          "
                        >
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            onDelete?.(employee)
                          }
                          disabled={!canDeleteEmployee}
                          title="Delete Employee"
                          className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full border border-base-300
                            bg-base-100
                            text-red-500
                            transition hover:bg-red-50
                          "
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <p className="text-sm font-medium text-base-content/60">
                      No employees found
                    </p>

                    <p className="mt-1 text-xs text-base-content/40">
                      Try changing your search.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeTable;