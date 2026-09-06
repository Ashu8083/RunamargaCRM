// admin-react\src\components\GlobalModels\PermissionsModal\index.jsx
import { useEffect, useMemo, useState } from "react";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ShieldCheckIcon from "@heroicons/react/24/outline/ShieldCheckIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import {
  getEmployeeContextPermissions,
  updateEmployeeContextPermissions,
  normalizePermissions,
} from "./API";


// ============================================================================
// CATEGORY LABEL
// ============================================================================

const getCategoryLabel = (category) => {
  if (!category) return "BUSINESS";

  return String(category)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
};


// ============================================================================
// PERMISSIONS MODAL
// ============================================================================

function PermissionsModal({
  open,
  admin,
  employeeId,
  contextId,
  onClose,
  onSave,
}) {
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // ==========================================================================
  // EMPLOYEE / CONTEXT
  // ==========================================================================

  const resolvedEmployeeId =
    employeeId ??
    admin?.employeeId ??
    admin?.employee_id ??
    admin?.id ??
    null;

  const resolvedContextId =
    contextId ??
    admin?.contextId ??
    admin?.context_id ??
    null;


  // ==========================================================================
  // LOAD PERMISSIONS
  // ==========================================================================

  useEffect(() => {
    if (
      !open ||
      !resolvedEmployeeId ||
      !resolvedContextId
    ) {
      setPermissions([]);
      setSearch("");
      setError("");
      return;
    }

    let cancelled = false;

    const loadPermissions = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await getEmployeeContextPermissions(
            resolvedEmployeeId,
            resolvedContextId
          );

        if (cancelled) return;

        setPermissions(
          normalizePermissions(response)
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load permissions:",
          err
        );

        setPermissions([]);

        setError(
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load permissions."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPermissions();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    resolvedEmployeeId,
    resolvedContextId,
  ]);


  // ==========================================================================
  // FILTER
  // ==========================================================================

  const filteredPermissions = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return permissions;
    }

    return permissions.filter(
      (permission) =>
        permission.name
          ?.toLowerCase()
          .includes(value) ||
        permission.code
          ?.toLowerCase()
          .includes(value) ||
        permission.description
          ?.toLowerCase()
          .includes(value) ||
        permission.category
          ?.toLowerCase()
          .includes(value)
    );
  }, [
    permissions,
    search,
  ]);


  // ==========================================================================
  // GROUP
  // ==========================================================================

  const groupedPermissions = useMemo(() => {
    const groups = {};

    filteredPermissions.forEach(
      (permission) => {
        const category =
          permission.category === "common"
            ? "common"
            : "business";

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(
          permission
        );
      }
    );

    return groups;
  }, [
    filteredPermissions,
  ]);


  // ==========================================================================
  // CATEGORY ORDER
  // ==========================================================================

  const categories = useMemo(() => {
    return Object.keys(
      groupedPermissions
    ).sort((a, b) => {
      if (a === "common") return -1;
      if (b === "common") return 1;

      return a.localeCompare(b);
    });
  }, [
    groupedPermissions,
  ]);


  // ==========================================================================
  // ASSIGNED COUNT
  // ==========================================================================

  const assignedCount = useMemo(
    () =>
      permissions.filter(
        (permission) =>
          permission.is_assigned
      ).length,
    [permissions]
  );


  // ==========================================================================
  // TOGGLE
  // ==========================================================================

  const togglePermission = (
    permissionId
  ) => {
    setPermissions((previous) =>
      previous.map((permission) =>
        Number(permission.id) ===
        Number(permissionId)
          ? {
              ...permission,
              is_assigned:
                !permission.is_assigned,
            }
          : permission
      )
    );
  };


  // ==========================================================================
  // SAVE
  // ==========================================================================

  const handleSave = async () => {
    if (!resolvedEmployeeId) {
      setError("Employee ID is required.");
      return;
    }

    if (!resolvedContextId) {
      setError("Context ID is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const permissionIds =
        permissions
          .filter(
            (permission) =>
              permission.is_assigned
          )
          .map(
            (permission) =>
              Number(permission.id)
          );

      const response =
        await updateEmployeeContextPermissions(
          {
            employeeId:
              resolvedEmployeeId,
            contextId:
              resolvedContextId,
            permissionIds,
          }
        );

      if (
        Array.isArray(
          response?.permissions
        )
      ) {
        const savedIds = new Set(
          response.permissions.map(
            (permission) =>
              Number(permission.id)
          )
        );

        setPermissions(
          (previous) =>
            previous.map(
              (permission) => ({
                ...permission,
                is_assigned:
                  savedIds.has(
                    Number(
                      permission.id
                    )
                  ),
              })
            )
        );
      }

      onSave?.(
        response,
        permissionIds
      );

      onClose?.();
    } catch (err) {
      console.error(
        "Failed to save permissions:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to save permissions."
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!open || !admin) {
    return null;
  }


  return (
    <dialog
      open
      className="
        modal
        modal-bottom
        sm:modal-middle
      "
    >
      <div
        className="
          modal-box
          w-11/12
          max-w-2xl
          p-0
          bg-base-100
          border
          border-base-300
        "
      >

        {/* ==================================================================
            HEADER
        ================================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            p-5
            border-b
            border-base-300
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-9
                h-9
                rounded-lg
                bg-[#8BCF00]/10
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheckIcon
                className="
                  w-5
                  h-5
                  text-[#78B300]
                "
              />
            </div>

            <div>
              <h3
                className="
                  text-lg
                  font-semibold
                "
              >
                Manage Permissions
              </h3>

              <p
                className="
                  text-xs
                  text-base-content/50
                  mt-1
                "
              >
                Manage permissions for{" "}
                {admin.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              btn
              btn-sm
              btn-ghost
              btn-circle
            "
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>


        {/* ==================================================================
            SUMMARY
        ================================================================== */}

        <div className="px-5 pt-5">
          <div
            className="
              grid
              grid-cols-2
              gap-3
            "
          >
            <div
              className="
                rounded-lg
                border
                border-base-300
                bg-base-200/30
                px-4
                py-3
              "
            >
              <p
                className="
                  text-xs
                  text-base-content/50
                "
              >
                Available Permissions
              </p>

              <p
                className="
                  text-lg
                  font-semibold
                  mt-1
                "
              >
                {permissions.length}
              </p>
            </div>

            <div
              className="
                rounded-lg
                border
                border-[#8BCF00]/20
                bg-[#8BCF00]/5
                px-4
                py-3
              "
            >
              <p
                className="
                  text-xs
                  text-base-content/50
                "
              >
                Assigned
              </p>

              <p
                className="
                  text-lg
                  font-semibold
                  text-[#78B300]
                  mt-1
                "
              >
                {assignedCount}
              </p>
            </div>
          </div>
        </div>


        {/* ==================================================================
            SEARCH
        ================================================================== */}

        <div className="px-5 pt-4">
          <label
            className="
              input
              input-bordered
              flex
              items-center
              gap-3
            "
          >
            <MagnifyingGlassIcon
              className="
                w-4
                h-4
                text-base-content/40
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search permissions..."
              className="grow"
              disabled={
                loading || saving
              }
            />
          </label>
        </div>


        {/* ==================================================================
            ERROR
        ================================================================== */}

        {error && (
          <div className="px-5 pt-4">
            <div
              className="
                alert
                alert-error
                text-sm
              "
            >
              <span>{error}</span>
            </div>
          </div>
        )}


        {/* ==================================================================
            PERMISSIONS
        ================================================================== */}

        <div
          className="
            px-5
            pt-4
            max-h-[420px]
            overflow-y-auto
          "
        >
          {loading ? (
            <div
              className="
                border
                border-base-300
                rounded-lg
                p-8
                flex
                items-center
                justify-center
              "
            >
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : categories.length === 0 ? (
            <div
              className="
                border
                border-base-300
                rounded-lg
                p-8
                text-center
                text-sm
                text-base-content/50
              "
            >
              {search
                ? "No permissions found."
                : "No permissions available."}
            </div>
          ) : (
            <div className="space-y-4">

              {categories.map(
                (category) => (
                  <div
                    key={category}
                    className="
                      border
                      border-base-300
                      rounded-lg
                      overflow-hidden
                    "
                  >

                    {/* ======================================================
                        CATEGORY
                    ====================================================== */}

                    <div
                      className="
                        px-4
                        py-2.5
                        bg-base-200/50
                        border-b
                        border-base-300
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-base-content/60
                        "
                      >
                        {getCategoryLabel(
                          category
                        )}
                      </p>
                    </div>


                    {/* ======================================================
                        PERMISSIONS
                    ====================================================== */}

                    {groupedPermissions[
                      category
                    ].map(
                      (permission) => (
                        <button
                          key={
                            permission.id
                          }
                          type="button"
                          onClick={() =>
                            togglePermission(
                              permission.id
                            )
                          }
                          disabled={saving}
                          className={`
                            w-full
                            flex
                            items-center
                            justify-between
                            gap-3
                            px-4
                            py-3
                            text-left
                            transition-colors
                            border-b
                            last:border-b-0
                            border-base-300
                            ${
                              permission.is_assigned
                                ? "bg-[#8BCF00]/10"
                                : "hover:bg-base-200/50"
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                              min-w-0
                            "
                          >
                            <div
                              className={`
                                w-8
                                h-8
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                shrink-0
                                ${
                                  permission.is_assigned
                                    ? "bg-[#8BCF00]/15"
                                    : "bg-base-200"
                                }
                              `}
                            >
                              <ShieldCheckIcon
                                className={`
                                  w-4
                                  h-4
                                  ${
                                    permission.is_assigned
                                      ? "text-[#78B300]"
                                      : "text-base-content/50"
                                  }
                                `}
                              />
                            </div>

                            <div className="min-w-0">
                              <span
                                className={`
                                  block
                                  text-sm
                                  truncate
                                  ${
                                    permission.is_assigned
                                      ? "font-semibold"
                                      : "font-medium"
                                  }
                                `}
                              >
                                {
                                  permission.name
                                }
                              </span>

                              {permission.code && (
                                <span
                                  className="
                                    block
                                    text-[11px]
                                    text-base-content/40
                                    truncate
                                    mt-0.5
                                  "
                                >
                                  {
                                    permission.code
                                  }
                                </span>
                              )}
                            </div>
                          </div>


                          <div
                            className={`
                              w-5
                              h-5
                              rounded
                              border
                              flex
                              items-center
                              justify-center
                              shrink-0
                              ${
                                permission.is_assigned
                                  ? "bg-[#8BCF00] border-[#8BCF00]"
                                  : "border-base-300"
                              }
                            `}
                          >
                            {permission.is_assigned && (
                              <CheckIcon className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>

                        </button>
                      )
                    )}

                  </div>
                )
              )}

            </div>
          )}
        </div>


        {/* ==================================================================
            FOOTER
        ================================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            p-4
            border-t
            border-base-300
            mt-4
          "
        >
          <p
            className="
              text-xs
              text-base-content/50
            "
          >
            {assignedCount} permission
            {assignedCount !== 1
              ? "s"
              : ""}{" "}
            selected
          </p>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                btn
                btn-sm
                btn-ghost
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={
                loading ||
                saving ||
                !resolvedEmployeeId ||
                !resolvedContextId
              }
              className="
                btn
                btn-sm
                border-[#8BCF00]
                bg-[#8BCF00]
                text-white
                hover:bg-[#6FA800]
                hover:border-[#6FA800]
              "
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Saving...
                </>
              ) : (
                "Save Permissions"
              )}
            </button>

          </div>
        </div>

      </div>


      {/* ======================================================================
          BACKDROP
      ====================================================================== */}

      <div
        className="modal-backdrop"
        onClick={
          saving
            ? undefined
            : onClose
        }
        aria-hidden="true"
      />

    </dialog>
  );
}


export default PermissionsModal;