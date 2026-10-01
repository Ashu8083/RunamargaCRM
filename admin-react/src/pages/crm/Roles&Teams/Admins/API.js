// admin-react/src/pages/Roles&Teams/Admins/API.js

import apiClient from '../../../../app/apiClient'


// ============================================================================
// ERROR MESSAGE
// ============================================================================

export const getApiErrorMessage = (
    error,
    fallback = 'Something went wrong.'
) => {

    const data = error?.response?.data

    if (
        typeof data?.detail === 'string' &&
        data.detail.trim()
    ) {
        return data.detail.trim()
    }

    if (
        Array.isArray(data?.detail)
    ) {
        const messages = data.detail
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.msg
            )
            .filter(Boolean)

        if (messages.length) {
            return messages.join(', ')
        }
    }

    if (
        typeof data?.message === 'string' &&
        data.message.trim()
    ) {
        return data.message.trim()
    }

    if (
        typeof data?.error === 'string' &&
        data.error.trim()
    ) {
        return data.error.trim()
    }

    if (
        typeof error?.message === 'string' &&
        error.message.trim()
    ) {
        return error.message.trim()
    }

    return fallback
}


// ============================================================================
// NORMALIZE ADMIN
// ============================================================================
//
// id
//     = EmployeeContext.id
//
// employee_id
//     = Employee.id
//
// context_id
//     = GLOBAL Context.id
//
// role
//     = Always "Admin"
//
// role_code
//     = GLOBAL
//
// ============================================================================

const normalizeAdmin = (admin) => {

    if (!admin) {
        return null
    }

    const id =
        admin.id != null
            ? Number(admin.id)
            : null

    const employeeId =
        admin.employee_id != null
            ? Number(admin.employee_id)
            : null

    const contextId =
        admin.context_id != null
            ? Number(admin.context_id)
            : null

    const isActive =
        Boolean(admin.is_active)

    return {
        ...admin,

        // IDs
        id,
        employee_id: employeeId,
        employeeId,

        context_id: contextId,
        contextId,

        // Fixed Admin role
        role: 'Admin',
        role_code: 'GLOBAL',

        // Status
        is_active: isActive,
        status: isActive
            ? 'Active'
            : 'Inactive',

        // Display
        name: admin.name || 'N/A',
        email: admin.email || 'N/A',
        phone: admin.phone || 'N/A',

        // Admin has no assignment
        reports_to_id: null,
        reportsToId: null,

        // Date / time
        created_at:
            admin.created_at || null,

        updated_at:
            admin.updated_at || null,

        createdAt:
            admin.created_at ||
            admin.createdAt ||
            'N/A',

        updatedAt:
            admin.updated_at ||
            admin.updatedAt ||
            'N/A',
    }
}


// ============================================================================
// GET ADMINS
// ============================================================================

export const getAdmins = async () => {

    const response = await apiClient.get(
        '/admins'
    )

    const data =
        Array.isArray(response.data)
            ? response.data
            : []

    return data
        .map(normalizeAdmin)
        .filter(Boolean)
}


// ============================================================================
// CREATE ADMIN
// ============================================================================
//
// Backend resolves context_id automatically using:
//
//     Context.code == "GLOBAL"
//
// Payload:
//
// {
//     employee_id,
//     status
// }
//
// ============================================================================

export const createAdmin = async (
    payload
) => {

    const response = await apiClient.post(
        '/admins',
        {
            employee_id: Number(
                payload.employee_id ??
                payload.employeeId
            ),

            status:
                payload.status || 'Active',
        }
    )

    return response.data
}


// ============================================================================
// UPDATE ADMIN
// ============================================================================
//
// Admin role/context is fixed to GLOBAL.
// No employee/context change is sent.
//
// ============================================================================

export const updateAdmin = async (
    adminId,
    payload = {}
) => {

    if (
        adminId === null ||
        adminId === undefined ||
        adminId === ''
    ) {
        throw new Error(
            'Admin ID is required.'
        )
    }

    const response = await apiClient.put(
        `/admins/${Number(adminId)}`,
        {}
    )

    return response.data
}


// ============================================================================
// DELETE ADMIN
// ============================================================================

export const deleteAdmin = async (
    adminId
) => {

    if (
        adminId === null ||
        adminId === undefined ||
        adminId === ''
    ) {
        throw new Error(
            'Admin ID is required.'
        )
    }

    const response = await apiClient.delete(
        `/admins/${Number(adminId)}`
    )

    return response.data
}


// ============================================================================
// UPDATE ADMIN STATUS
// ============================================================================

export const updateAdminStatus = async (
    adminId,
    status
) => {

    if (
        adminId === null ||
        adminId === undefined ||
        adminId === ''
    ) {
        throw new Error(
            'Admin ID is required.'
        )
    }

    const normalizedStatus =
        status === 'Inactive'
            ? 'Inactive'
            : 'Active'

    const response = await apiClient.patch(
        `/admins/${Number(adminId)}/status`,
        {
            status: normalizedStatus,
        }
    )

    return response.data
}


// ============================================================================
// GET EMPLOYEES
// ============================================================================
//
// Used by AdminModal when creating an Admin.
//
// ============================================================================

export const getEmployees = async () => {

    const response = await apiClient.get(
        '/employees'
    )

    return Array.isArray(response.data)
        ? response.data
        : []
}