// ============================================================================
// admin-react/src/components/GlobalModels/Filters/PermissionsModal/API.js
// ============================================================================

import apiClient from "../../../app/apiClient";


// ============================================================================
// GET ALL ACTIVE PERMISSIONS
// ============================================================================

export const getPermissions = async () => {
  const response = await apiClient.get("/common/permissions");

  return Array.isArray(response.data)
    ? response.data
    : [];
};


// ============================================================================
// GET ALL PERMISSIONS + ASSIGNMENT STATUS
// ============================================================================

export const getEmployeeContextPermissions = async (
  employeeId,
  contextId
) => {
  if (
    employeeId === null ||
    employeeId === undefined ||
    employeeId === ""
  ) {
    throw new Error("Employee ID is required");
  }

  if (
    contextId === null ||
    contextId === undefined ||
    contextId === ""
  ) {
    throw new Error("Context ID is required");
  }

  const response = await apiClient.get(
    "/common/employee-context-permissions",
    {
      params: {
        employee_id: Number(employeeId),
        context_id: Number(contextId),
      },
    }
  );

  return Array.isArray(response.data)
    ? response.data
    : [];
};


// ============================================================================
// SAVE / SYNCHRONIZE PERMISSIONS
// ============================================================================

export const updateEmployeeContextPermissions = async ({
  employeeId,
  contextId,
  permissionIds = [],
}) => {
  if (
    employeeId === null ||
    employeeId === undefined ||
    employeeId === ""
  ) {
    throw new Error("Employee ID is required");
  }

  if (
    contextId === null ||
    contextId === undefined ||
    contextId === ""
  ) {
    throw new Error("Context ID is required");
  }

  const normalizedIds = [
    ...new Set(
      (Array.isArray(permissionIds)
        ? permissionIds
        : []
      )
        .map(Number)
        .filter(Number.isInteger)
    ),
  ];

  const response = await apiClient.put(
    "/common/employee-context-permissions",
    {
      employee_id: Number(employeeId),
      context_id: Number(contextId),
      permission_ids: normalizedIds,
    }
  );

  return response.data;
};


// ============================================================================
// DELETE ONE PERMISSION
// ============================================================================

export const deleteEmployeeContextPermission = async ({
  employeeId,
  contextId,
  permissionId,
}) => {
  if (
    employeeId === null ||
    employeeId === undefined ||
    employeeId === ""
  ) {
    throw new Error("Employee ID is required");
  }

  if (
    contextId === null ||
    contextId === undefined ||
    contextId === ""
  ) {
    throw new Error("Context ID is required");
  }

  if (
    permissionId === null ||
    permissionId === undefined ||
    permissionId === ""
  ) {
    throw new Error("Permission ID is required");
  }

  const response = await apiClient.delete(
    "/common/employee-context-permissions",
    {
      params: {
        employee_id: Number(employeeId),
        context_id: Number(contextId),
        permission_id: Number(permissionId),
      },
    }
  );

  return response.data;
};


// ============================================================================
// NORMALIZE PERMISSION
// ============================================================================

export const normalizePermission = (permission) => {
  if (!permission) {
    return null;
  }

  const description =
    permission.description !== null &&
    permission.description !== undefined
      ? String(permission.description).trim()
      : null;

  return {
    ...permission,
    id: Number(permission.id),
    name: permission.name || "",
    code: permission.code || "",
    description,
    category:
      permission.category ||
      (
        description?.toLowerCase() === "common"
          ? "common"
          : "business"
      ),
    is_assigned: Boolean(
      permission.is_assigned
    ),
  };
};


// ============================================================================
// NORMALIZE PERMISSIONS
// ============================================================================

export const normalizePermissions = (
  permissions
) => {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return permissions
    .map(normalizePermission)
    .filter(Boolean);
};


// ============================================================================
// GROUP PERMISSIONS
// ============================================================================

export const groupPermissionsByCategory = (
  permissions
) => {
  const groups = {
    common: [],
    business: [],
  };

  normalizePermissions(
    permissions
  ).forEach((permission) => {
    const category =
      permission.category === "common"
        ? "common"
        : "business";

    groups[category].push(permission);
  });

  return groups;
};