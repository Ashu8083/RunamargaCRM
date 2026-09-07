import { API_BASE_URL } from '../../../config/url'


/*
|--------------------------------------------------------------------------
| Roles API
|--------------------------------------------------------------------------
|
| Frontend terminology:
|   Role
|
| Backend terminology:
|   Context
|
| Backend endpoints:
|
| GET    /contexts
| POST   /contexts
| PATCH  /contexts/:id
| DELETE /contexts/:id
|
|--------------------------------------------------------------------------
*/


/**
 * Extract a useful error message from a FastAPI response.
 *
 * FastAPI validation errors normally look like:
 *
 * {
 *   "detail": [
 *     {
 *       "loc": ["body", "name"],
 *       "msg": "Role name is required.",
 *       "type": "value_error"
 *     }
 *   ]
 * }
 *
 * Other backend errors may look like:
 *
 * {
 *   "detail": "Role code already exists."
 * }
 */
const extractErrorMessage = (data, status) => {

    if (!data) {
        return `Request failed (${status})`
    }


    /*
     * FastAPI validation error array
     */
    if (Array.isArray(data.detail)) {

        const messages = data.detail
            .map((error) => {

                if (typeof error === 'string') {
                    return error
                }

                if (error?.msg) {
                    return error.msg
                }

                return null
            })
            .filter(Boolean)


        if (messages.length > 0) {
            return messages.join(' ')
        }
    }


    /*
     * Normal FastAPI detail message
     */
    if (typeof data.detail === 'string') {
        return data.detail
    }


    /*
     * Generic API message
     */
    if (typeof data.message === 'string') {
        return data.message
    }


    /*
     * Generic API error
     */
    if (typeof data.error === 'string') {
        return data.error
    }


    return `Request failed (${status})`
}


/**
 * Common request helper.
 */
const request = async (url, options = {}) => {

    let response


    try {

        response = await fetch(url, {
            credentials: 'include',

            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },

            ...options,
        })

    } catch (error) {

        /*
         * Network / server unreachable error.
         */
        throw new Error(
            'Unable to connect to the server. Please check that the backend is running.'
        )
    }


    let data = null


    try {

        data = await response.json()

    } catch (error) {

        /*
         * Some successful responses may not contain JSON.
         */
        data = null
    }


    if (!response.ok) {

        throw new Error(
            extractErrorMessage(
                data,
                response.status
            )
        )
    }


    return data
}


/**
|--------------------------------------------------------------------------
| Normalize Role Response
|--------------------------------------------------------------------------
|
| Converts backend Context response into the frontend Role format.
|
| Backend:
|
| {
|   id,
|   name,
|   code,
|   description,
|   is_active,
|   created_at,
|   updated_at
| }
|
| Frontend:
|
| {
|   id,
|   name,
|   code,
|   description,
|   active,
|   createdAt,
|   updatedAt,
|   deleted
| }
|
|--------------------------------------------------------------------------
*/

const normalizeRole = (role = {}) => {

    return {
        id: role.id,

        name: role.name || '',

        code: role.code || '',

        description: role.description || '',

        active:
            role.is_active !== undefined
                ? Boolean(role.is_active)
                : role.active !== undefined
                    ? Boolean(role.active)
                    : true,

        createdAt:
            role.created_at ||
            role.createdAt ||
            'N/A',

        updatedAt:
            role.updated_at ||
            role.updatedAt ||
            'N/A',

        /*
         * Current backend Context model does NOT have
         * deleted / is_deleted fields.
         *
         * Keep this property so existing frontend
         * components continue to work safely.
         */
        deleted:
            role.deleted !== undefined
                ? Boolean(role.deleted)
                : role.is_deleted !== undefined
                    ? Boolean(role.is_deleted)
                    : false,
    }
}


/**
|--------------------------------------------------------------------------
| Normalize Role List
|--------------------------------------------------------------------------
|
| Supports:
|
| [
|   {...},
|   {...}
| ]
|
| {
|   data: [...]
| }
|
| {
|   roles: [...]
| }
|
| {
|   contexts: [...]
| }
|
|--------------------------------------------------------------------------
*/

const normalizeRoleList = (data) => {

    const roles = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.roles)
                ? data.roles
                : Array.isArray(data?.contexts)
                    ? data.contexts
                    : []


    return roles.map(normalizeRole)
}


/**
|--------------------------------------------------------------------------
| Build Role Payload
|--------------------------------------------------------------------------
|
| Converts frontend Role data into backend Context data.
|
| Frontend:
|
| {
|   name,
|   code,
|   description,
|   active
| }
|
| Backend:
|
| {
|   name,
|   code,
|   description,
|   is_active
| }
|
|--------------------------------------------------------------------------
*/

const buildRolePayload = (roleData = {}) => {

    return {
        name: String(roleData.name || '').trim(),

        code: String(roleData.code || '')
            .trim()
            .toUpperCase(),

        description:
            roleData.description &&
            String(roleData.description).trim()
                ? String(roleData.description).trim()
                : null,

        is_active:
            roleData.active !== undefined
                ? Boolean(roleData.active)
                : true,
    }
}


/**
|--------------------------------------------------------------------------
| Get Roles
|--------------------------------------------------------------------------
|
| GET /contexts
|
| Backend uses "contexts".
| Frontend continues calling them "roles".
|
|--------------------------------------------------------------------------
*/

export const getRoles = async () => {

    const data = await request(
        `${API_BASE_URL}/contexts`,
        {
            method: 'GET',
        }
    )


    return normalizeRoleList(data)
}


/**
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
|
| POST /contexts
|
|--------------------------------------------------------------------------
*/

export const createRole = async (roleData) => {

    const payload = buildRolePayload(roleData)


    const data = await request(
        `${API_BASE_URL}/contexts`,
        {
            method: 'POST',

            body: JSON.stringify(payload),
        }
    )


    /*
     * Backend currently returns the created Context
     * directly.
     *
     * Also supports wrapped responses for future
     * compatibility.
     */
    const role =
        data?.data ||
        data?.context ||
        data


    return normalizeRole(role)
}


/**
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
|
| PATCH /contexts/:id
|
| Backend ContextUpdate supports partial updates.
|
|--------------------------------------------------------------------------
*/

export const updateRole = async (id, roleData) => {

    if (id === undefined || id === null) {

        throw new Error(
            'Role ID is required.'
        )
    }


    const payload = buildRolePayload(roleData)


    const data = await request(
        `${API_BASE_URL}/contexts/${id}`,
        {
            method: 'PATCH',

            body: JSON.stringify(payload),
        }
    )


    const role =
        data?.data ||
        data?.context ||
        data


    return normalizeRole(role)
}


/**
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
|
| DELETE /contexts/:id
|
| IMPORTANT:
|
| The current backend Context model does not have
| soft-delete fields.
|
| Therefore this performs a real database delete.
|
|--------------------------------------------------------------------------
*/

export const deleteRole = async (id) => {

    if (id === undefined || id === null) {

        throw new Error(
            'Role ID is required.'
        )
    }


    const data = await request(
        `${API_BASE_URL}/contexts/${id}`,
        {
            method: 'DELETE',
        }
    )


    /*
     * Current backend returns:
     *
     * {
     *   "message": "Context deleted successfully."
     * }
     *
     * Return it directly because it is not a Role object.
     */
    return data
}


/**
|--------------------------------------------------------------------------
| Role Code Helpers
|--------------------------------------------------------------------------
*/


/*
 * These prefixes are FIXED.
 *
 * A role code must always start with one of these values.
 */
export const ROLE_CODE_PREFIXES = [
    'GLOBAL',
    'AGENT',
    'TEAMLEAD',
    'MANAGER',
    'RM',
]


/**
|--------------------------------------------------------------------------
| Generate Role Code
|--------------------------------------------------------------------------
|
| Examples:
|
| Agent
|       -> AGENT
|
| Agent Personal
|       -> AGENT_PERSONAL
|
| Agent Business
|       -> AGENT_BUSINESS
|
| Team Lead
|       -> TEAMLEAD
|
| Team Lead Personal
|       -> TEAMLEAD_PERSONAL
|
| Manager Operations
|       -> MANAGER_OPERATIONS
|
| RM Senior
|       -> RM_SENIOR
|
|--------------------------------------------------------------------------
*/

export const generateRoleCode = (name = '') => {

    const cleanedName = String(name)
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')


    if (!cleanedName) {
        return ''
    }


    /*
     * Convert:
     *
     * TEAM_LEAD
     *
     * into:
     *
     * TEAMLEAD
     */
    const normalizedName = cleanedName
        .replace(/^TEAM_LEAD/, 'TEAMLEAD')


    /*
     * Return the normalized value.
     *
     * Validation is handled separately by
     * validateRoleCode().
     */
    return normalizedName
}


/**
|--------------------------------------------------------------------------
| Validate Role Code
|--------------------------------------------------------------------------
|
| Returns:
|
| {
|   valid: true,
|   error: ''
| }
|
| or:
|
| {
|   valid: false,
|   error: '...'
| }
|
|--------------------------------------------------------------------------
*/

export const validateRoleCode = (code = '') => {

    const normalizedCode = String(code)
        .trim()
        .toUpperCase()


    /*
     * Required
     */
    if (!normalizedCode) {

        return {
            valid: false,

            error:
                'Role code is required.',
        }
    }


    /*
     * Check allowed role prefix.
     */
    const validPrefix = ROLE_CODE_PREFIXES.some(
        (prefix) =>
            normalizedCode === prefix ||
            normalizedCode.startsWith(`${prefix}_`)
    )


    if (!validPrefix) {

        return {
            valid: false,

            error:
                'Role code must start with AGENT, TEAMLEAD, MANAGER, or RM.',
        }
    }


    /*
     * Only:
     *
     * A-Z
     * 0-9
     * _
     */
    if (!/^[A-Z][A-Z0-9_]*$/.test(normalizedCode)) {

        return {
            valid: false,

            error:
                'Role code can contain only uppercase letters, numbers, and underscores.',
        }
    }


    /*
     * Prevent:
     *
     * AGENT_
     * AGENT__PERSONAL
     */
    if (
        normalizedCode.endsWith('_') ||
        normalizedCode.includes('__')
    ) {

        return {
            valid: false,

            error:
                'Role code cannot end with an underscore or contain consecutive underscores.',
        }
    }


    return {
        valid: true,

        error: '',
    }
}


/**
|--------------------------------------------------------------------------
| Validate Complete Role Form
|--------------------------------------------------------------------------
*/

export const validateRole = ({
    name = '',
    code = '',
    description = '',
} = {}) => {

    const errors = {}


    const trimmedName = String(name).trim()

    const trimmedCode = String(code)
        .trim()
        .toUpperCase()

    const trimmedDescription =
        String(description).trim()


    /*
     * Name validation
     */
    if (!trimmedName) {

        errors.name =
            'Role name is required.'

    } else if (trimmedName.length < 2) {

        errors.name =
            'Role name must contain at least 2 characters.'

    } else if (trimmedName.length > 100) {

        errors.name =
            'Role name cannot exceed 100 characters.'
    }


    /*
     * Code validation
     */
    const codeValidation =
        validateRoleCode(trimmedCode)


    if (!codeValidation.valid) {

        errors.code =
            codeValidation.error
    }


    /*
     * Description validation
     */
    if (trimmedDescription.length > 500) {

        errors.description =
            'Description cannot exceed 500 characters.'
    }


    return {
        valid:
            Object.keys(errors).length === 0,

        errors,
    }
}


/**
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
    getRoles,

    createRole,

    updateRole,

    deleteRole,

    generateRoleCode,

    validateRoleCode,

    validateRole,

    ROLE_CODE_PREFIXES,
}