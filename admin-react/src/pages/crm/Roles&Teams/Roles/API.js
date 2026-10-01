// admin-react/src/components/GlobalModels/Filters/rolesApi.js

import apiClient from '../../../../app/apiClient'


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
| Authentication
|--------------------------------------------------------------------------
|
| Authentication is handled centrally by apiClient.
|
| apiClient:
|
| - Sends HttpOnly cookies automatically
| - Handles access-token expiration
| - Calls refresh endpoint when required
| - Retries the original request
| - Redirects to /login when refresh fails
|
| Therefore this file does NOT:
|
| - use fetch()
| - read tokens from localStorage
| - create Authorization headers
| - manually refresh tokens
|
|--------------------------------------------------------------------------
*/


/**
 * Extract a useful error message from an Axios error.
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
const extractErrorMessage = (error) => {

    const response = error?.response

    const data = response?.data

    const status = response?.status


    /*
     * FastAPI validation error array
     */
    if (Array.isArray(data?.detail)) {

        const messages = data.detail
            .map((item) => {

                if (typeof item === 'string') {
                    return item
                }

                if (item?.msg) {
                    return item.msg
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
    if (typeof data?.detail === 'string') {

        return data.detail
    }


    /*
     * Generic API message
     */
    if (typeof data?.message === 'string') {

        return data.message
    }


    /*
     * Generic API error
     */
    if (typeof data?.error === 'string') {

        return data.error
    }


    /*
     * Axios network error
     */
    if (!response) {

        return (
            'Unable to connect to the server. Please check that the backend is running.'
        )
    }


    /*
     * Fallback HTTP error
     */
    return `Request failed (${status})`
}


/**
|--------------------------------------------------------------------------
| Common Request Helper
|--------------------------------------------------------------------------
|
| apiClient already handles:
|
| - baseURL
| - withCredentials
| - authentication cookies
| - access token refresh
| - retry after 401
| - global loading indicator
|
| This helper only converts Axios errors
| into normal JavaScript Error objects.
|
|--------------------------------------------------------------------------
*/

const request = async (config = {}) => {

    try {

        const response = await apiClient(config)

        return response.data

    } catch (error) {

        throw new Error(
            extractErrorMessage(error)
        )
    }
}


/**
|--------------------------------------------------------------------------
| Normalize Role Response
|--------------------------------------------------------------------------
|
| Converts backend Context response into
| the frontend Role format.
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

        name:
            role.name || '',

        code:
            role.code || '',

        description:
            role.description || '',

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

    const roles =
        Array.isArray(data)
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

        name:
            String(roleData.name || '')
                .trim(),

        code:
            String(roleData.code || '')
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
| Authentication:
|
| apiClient sends the HttpOnly access_token
| cookie automatically.
|
| If access token is expired:
|
| 1. Backend returns 401
| 2. apiClient calls refreshAccessToken()
| 3. Backend sets a new access_token cookie
| 4. apiClient retries GET /contexts
|
|--------------------------------------------------------------------------
*/

export const getRoles = async () => {

    const data = await request({

        method: 'GET',

        url: '/contexts',
    })


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

    const payload =
        buildRolePayload(roleData)


    const data = await request({

        method: 'POST',

        url: '/contexts',

        data: payload,
    })


    /*
     * Backend currently returns the created Context
     * directly.
     *
     * Also supports wrapped responses.
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

export const updateRole = async (
    id,
    roleData
) => {

    if (
        id === undefined ||
        id === null
    ) {

        throw new Error(
            'Role ID is required.'
        )
    }


    const payload =
        buildRolePayload(roleData)


    const data = await request({

        method: 'PATCH',

        url: `/contexts/${id}`,

        data: payload,
    })


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

    if (
        id === undefined ||
        id === null
    ) {

        throw new Error(
            'Role ID is required.'
        )
    }


    const data = await request({

        method: 'DELETE',

        url: `/contexts/${id}`,
    })


    /*
     * Current backend returns:
     *
     * {
     *   "message": "Context deleted successfully."
     * }
     *
     * Return it directly because it is not
     * a Role object.
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
 * A role code must always start with one
 * of these values.
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

export const generateRoleCode = (
    name = ''
) => {

    const cleanedName =
        String(name)

            .trim()

            .toUpperCase()

            .replace(
                /[^A-Z0-9]+/g,
                '_'
            )

            .replace(
                /^_+|_+$/g,
                ''
            )


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
    const normalizedName =
        cleanedName.replace(
            /^TEAM_LEAD/,
            'TEAMLEAD'
        )


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

export const validateRoleCode = (
    code = ''
) => {

    const normalizedCode =
        String(code)

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
    const validPrefix =
        ROLE_CODE_PREFIXES.some(
            (prefix) =>
                normalizedCode === prefix ||
                normalizedCode.startsWith(
                    `${prefix}_`
                )
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
    if (
        !/^[A-Z][A-Z0-9_]*$/
            .test(normalizedCode)
    ) {

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


    const trimmedName =
        String(name).trim()


    const trimmedCode =
        String(code)

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

    } else if (
        trimmedName.length < 2
    ) {

        errors.name =
            'Role name must contain at least 2 characters.'

    } else if (
        trimmedName.length > 100
    ) {

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
    if (
        trimmedDescription.length > 500
    ) {

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
