// admin-react\src\components\GlobalModels\PermissionsModal.jsx
import { useEffect, useMemo, useState } from "react";

import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ShieldCheckIcon from "@heroicons/react/24/outline/ShieldCheckIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { getPermissions } from "../../services/commonservice";
function PermissionsModal({ open, admin, onClose }) {
  const [permissions, setPermissions] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState([]);

  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD PERMISSIONS
  // =========================================================

  useEffect(() => {
    if (!open || !admin) {
      setPermissions([]);
      setAssignedPermissions([]);
      setSearch("");
      return;
    }

    const loadPermissions = async () => {
      try {
        const data = await getPermissions();

        setPermissions(data);
      } catch (error) {
        console.error("Failed to load permissions:", error);
        setPermissions([]);
      }
    };

    loadPermissions();

    setAssignedPermissions(admin.permissions || []);
    setSearch("");
  }, [open, admin]);
  // =========================================================
  // FILTER PERMISSIONS
  // =========================================================

  const filteredPermissions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return permissions;
    }

    return permissions.filter((permission) =>
      permission.name?.toLowerCase().includes(searchValue),
    );
  }, [permissions, search]);
  // =========================================================
  // CHECK PERMISSION
  // =========================================================

  const isPermissionAssigned = (permissionId) => {
    return assignedPermissions.some(
      (permission) => String(permission.id) === String(permissionId),
    );
  };

  // =========================================================
  // TOGGLE PERMISSION
  // =========================================================

  const togglePermission = (permission) => {
    setAssignedPermissions((previous) => {
      const alreadyAssigned = previous.some(
        (item) => String(item.id) === String(permission.id),
      );

      if (alreadyAssigned) {
        return previous.filter(
          (item) => String(item.id) !== String(permission.id),
        );
      }

      return [
        ...previous,
        {
          ...permission
        },
      ];
    });
  };

  // =========================================================
  // COUNTS
  // =========================================================
  const totalPermissions = permissions.length;
  const assignedCount = assignedPermissions.length;

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = () => {
    /*
     * Replace with API call later.
     *
     * PUT /admins/{admin.id}/permissions
     *
     * Body:
     *
     * {
     *     permission_ids: [
     *         1,
     *         2,
     *         7
     *     ]
     * }
     */

    const permissionIds = assignedPermissions.map(
      (permission) => permission.id,
    );

    console.log("Admin:", admin.id);

    console.log("Assigned permission IDs:", permissionIds);

    onClose?.();
  };

  // =========================================================
  // MODAL
  // =========================================================

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
        {/* =================================================
                    HEADER
                ================================================= */}

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
                Manage permissions for {admin.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
                            btn
                            btn-sm
                            btn-ghost
                            btn-circle
                        "
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* =================================================
                    SUMMARY
                ================================================= */}

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
                {totalPermissions}
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

        {/* =================================================
                    SEARCH
                ================================================= */}

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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search permissions..."
              className="grow"
            />
          </label>
        </div>

        {/* =================================================
                    PERMISSIONS
                ================================================= */}

        <div className="border border-base-300 rounded-lg overflow-hidden">
          {filteredPermissions.map((permission) => {
            const isAssigned = isPermissionAssigned(permission.id);

            return (
              <button
                key={permission.id}
                type="button"
                onClick={() => togglePermission(permission)}
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
                    ${isAssigned
                    ? "bg-[#8BCF00]/10"
                    : "hover:bg-base-200/50"
                  }
                `}
              >
                {/* permission name */}

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            shrink-0
                            ${isAssigned
                        ? "bg-[#8BCF00]/15"
                        : "bg-base-200"
                      }
                        `}
                  >
                    <ShieldCheckIcon
                      className={`
                                w-4
                                h-4
                                ${isAssigned
                          ? "text-[#78B300]"
                          : "text-base-content/50"
                        }
                            `}
                    />
                  </div>

                  <span
                    className={`
                            text-sm
                            truncate
                            ${isAssigned
                        ? "font-semibold"
                        : "font-medium"
                      }
                        `}
                  >
                    {permission.name}
                  </span>
                </div>

                {/* checkbox */}

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
                        ${isAssigned
                      ? "bg-[#8BCF00] border-[#8BCF00]"
                      : "border-base-300"
                    }
                    `}
                >
                  {isAssigned && (
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* =================================================
                    FOOTER
                ================================================= */}

        <div
          className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-4
                    border-t
                    border-base-300
                "
        >
          <p
            className="
                        text-xs
                        text-base-content/50
                    "
          >
            {assignedCount} permission
            {assignedCount !== 1 ? "s" : ""} selected
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
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
              Save Permissions
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
                BACKDROP
            ================================================= */}

      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
    </dialog>
  );
}

export default PermissionsModal;
