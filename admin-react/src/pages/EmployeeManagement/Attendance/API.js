// admin-react/src/pages/EmployeeManagement/Attendance/API.js

import apiClient from '../../../app/apiClient'

import {
    STATIC_BASE_URL,
} from '../../../config/url'

// ============================================================================
// GET ATTENDANCE IMAGE URL
// ============================================================================
//
// Supported backend image path formats:
//
// 1. uploads/attendance/punch in/2026-09-11/example.jpg
// 2. static/uploads/attendance/punch in/2026-09-11/example.jpg
// 3. backend/static/uploads/attendance/punch in/2026-09-11/example.jpg
// 4. Full absolute URL
//
// New database format:
//
// uploads/attendance/punch in/YYYY-MM-DD/file.jpg
//
// Generated frontend URL:
//
// ${STATIC_BASE_URL}/uploads/attendance/punch in/YYYY-MM-DD/file.jpg
//
// IMPORTANT:
//
// Do not add /static/ for the new uploads/... format.
//
// ============================================================================

export const getAttendanceImageUrl = (
    imagePath
) => {

    if (
        !imagePath
    ) {
        return null
    }

    const value = String(
        imagePath
    ).trim()

    if (
        !value
    ) {
        return null
    }

    // ------------------------------------------------------------------------
    // Absolute URL
    // ------------------------------------------------------------------------

    if (
        /^https?:\/\/+/i.test(
            value
        )
    ) {
        return value
    }

    // ------------------------------------------------------------------------
    // Normalize Windows paths
    // ------------------------------------------------------------------------

    let normalizedPath = value.replace(
        /\\/g,
        '/'
    )

    // Remove duplicate leading slashes
    normalizedPath = normalizedPath.replace(
        /^\/+/,
        ''
    )

    // ------------------------------------------------------------------------
    // backend/static/...
    //
    // Example:
    // backend/static/uploads/attendance/file.jpg
    //
    // Result:
    // STATIC_BASE_URL/uploads/attendance/file.jpg
    // ------------------------------------------------------------------------

    if (
        normalizedPath.startsWith(
            'backend/static/'
        )
    ) {
        normalizedPath = normalizedPath.slice(
            'backend/static/'.length
        )

        return `${STATIC_BASE_URL}/${normalizedPath}`
    }

    // ------------------------------------------------------------------------
    // app/static/...
    //
    // Example:
    // app/static/uploads/attendance/file.jpg
    //
    // Result:
    // STATIC_BASE_URL/uploads/attendance/file.jpg
    // ------------------------------------------------------------------------

    if (
        normalizedPath.startsWith(
            'app/static/'
        )
    ) {
        normalizedPath = normalizedPath.slice(
            'app/static/'.length
        )

        return `${STATIC_BASE_URL}/${normalizedPath}`
    }

    // ------------------------------------------------------------------------
    // static/...
    //
    // Example:
    // static/uploads/attendance/file.jpg
    //
    // Result:
    // STATIC_BASE_URL/uploads/attendance/file.jpg
    // ------------------------------------------------------------------------

    if (
        normalizedPath.startsWith(
            'static/'
        )
    ) {
        normalizedPath = normalizedPath.slice(
            'static/'.length
        )

        return `${STATIC_BASE_URL}/${normalizedPath}`
    }

    // ------------------------------------------------------------------------
    // /static/...
    //
    // This handles paths that may have been stored with a leading slash.
    // ------------------------------------------------------------------------

    if (
        normalizedPath.startsWith(
            '/static/'
        )
    ) {
        normalizedPath = normalizedPath.slice(
            '/static/'.length
        )

        return `${STATIC_BASE_URL}/${normalizedPath}`
    }

    // ------------------------------------------------------------------------
    // uploads/...
    //
    // New preferred format.
    //
    // Example:
    // uploads/attendance/punch in/2026-09-11/example.jpg
    //
    // Result:
    // STATIC_BASE_URL/uploads/attendance/punch in/2026-09-11/example.jpg
    // ------------------------------------------------------------------------

    if (
        normalizedPath.startsWith(
            'uploads/'
        )
    ) {
        return `${STATIC_BASE_URL}/${normalizedPath}`
    }

    // ------------------------------------------------------------------------
    // Fallback
    //
    // Any other relative path is treated as relative to STATIC_BASE_URL.
    // No /static/ is added.
    // ------------------------------------------------------------------------

    return `${STATIC_BASE_URL}/${normalizedPath}`
}

// ============================================================================
// NORMALIZE PUNCH
// ============================================================================

export const normalizePunch = (
    punch
) => {

    if (
        !punch
    ) {
        return null
    }

    const location =
        punch.location
            ? {
                address:
                    punch.location.address ??
                    null,

                latitude:
                    punch.location.latitude ??
                    null,

                longitude:
                    punch.location.longitude ??
                    null,

                accuracy:
                    punch.location.accuracy ??
                    null,

                isOffice:
                    Boolean(
                        punch.location.isOffice
                    ),
            }
            : null

    return {
        time:
            punch.time ??
            null,

        location,

        image:
            getAttendanceImageUrl(
                punch.image
            ),

        confidence:
            punch.confidence ??
            null,
    }
}

// ============================================================================
// NORMALIZE ATTENDANCE
// ============================================================================

export const normalizeAttendance = (
    entry
) => {

    if (
        !entry
    ) {
        return null
    }

    return {
        ...entry,

        id:
            entry.id ??
            null,

        employeeId:
            entry.employeeId ??
            entry.employee_id ??
            null,

        name:
            entry.name ??
            '',

        email:
            entry.email ??
            null,

        gender:
            entry.gender ??
            null,

        profileImage:
            getAttendanceImageUrl(
                entry.profileImage ??
                entry.profile_image
            ),

        date:
            entry.date ??
            null,

        checkIn:
            normalizePunch(
                entry.checkIn ??
                entry.check_in
            ),

        checkOut:
            normalizePunch(
                entry.checkOut ??
                entry.check_out
            ),

        status:
            String(
                entry.status ??
                ''
            ).toLowerCase(),
    }
}

// ============================================================================
// NORMALIZE TODAY ATTENDANCE
// ============================================================================

export const normalizeTodayAttendance = (
    entry
) => {

    if (
        !entry
    ) {
        return null
    }

    return {
        ...entry,

        id:
            entry.id ??
            null,

        employeeId:
            entry.employeeId ??
            entry.employee_id ??
            null,

        name:
            entry.name ??
            '',

        email:
            entry.email ??
            null,

        gender:
            entry.gender ??
            null,

        profileImage:
            getAttendanceImageUrl(
                entry.profileImage ??
                entry.profile_image
            ),

        date:
            entry.date ??
            null,

        punchIn:
            entry.punchIn ??
            entry.punch_in ??
            null,

        lunchOut:
            entry.lunchOut ??
            entry.lunch_out ??
            null,

        lunchIn:
            entry.lunchIn ??
            entry.lunch_in ??
            null,

        punchOut:
            entry.punchOut ??
            entry.punch_out ??
            null,

        status:
            String(
                entry.status ??
                ''
            ).toLowerCase(),
    }
}

// ============================================================================
// NORMALIZE HISTORY DAY
// ============================================================================

export const normalizeHistoryDay = (
    item
) => {

    if (
        !item
    ) {
        return null
    }

    let month =
        item.month ??
        ''

    // ------------------------------------------------------------------------
    // If backend already returns YYYY-MM
    // ------------------------------------------------------------------------

    if (
        /^\d{4}-\d{2}$/.test(
            String(month)
        )
    ) {
        month =
            String(month)
    }

    // ------------------------------------------------------------------------
    // Otherwise derive YYYY-MM from date
    // ------------------------------------------------------------------------

    else if (
        item.date &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            String(item.date)
        )
    ) {
        month =
            String(
                item.date
            ).slice(
                0,
                7
            )
    }

    return {
        ...item,

        id:
            item.id ??
            null,

        date:
            item.date ??
            null,

        day:
            item.day ??
            (
                item.date
                    ? Number(
                        String(
                            item.date
                        ).slice(
                            8,
                            10
                        )
                    )
                    : null
            ),

        month,

        status:
            String(
                item.status ??
                ''
            ).toLowerCase(),

        checkIn:
            normalizePunch(
                item.checkIn ??
                item.check_in
            ),

        checkOut:
            normalizePunch(
                item.checkOut ??
                item.check_out
            ),
    }
}

// ============================================================================
// NORMALIZE HISTORY RESPONSE
// ============================================================================

export const normalizeHistoryResponse = (
    response
) => {

    if (
        !response
    ) {
        return null
    }

    return {
        ...response,

        employeeId:
            response.employeeId ??
            response.employee_id ??
            null,

        name:
            response.name ??
            '',

        email:
            response.email ??
            null,

        gender:
            response.gender ??
            null,

        profileImage:
            getAttendanceImageUrl(
                response.profileImage ??
                response.profile_image
            ),

        currentStatus:
            String(
                response.currentStatus ??
                response.current_status ??
                ''
            ).toLowerCase(),

        currentCheckIn:
            normalizePunch(
                response.currentCheckIn ??
                response.current_check_in
            ),

        currentCheckOut:
            normalizePunch(
                response.currentCheckOut ??
                response.current_check_out
            ),

        history:
            Array.isArray(
                response.history
            )
                ? response.history
                    .map(
                        normalizeHistoryDay
                    )
                    .filter(Boolean)
                : [],
    }
}

// ============================================================================
// GET API ERROR MESSAGE
// ============================================================================

export const getApiErrorMessage = (
    error,
    fallback = 'Something went wrong.'
) => {

    if (
        error?.response?.data?.detail
    ) {

        if (
            Array.isArray(
                error.response.data.detail
            )
        ) {
            return error.response.data.detail
                .map(
                    (item) =>
                        item?.msg ||
                        String(item)
                )
                .join(', ')
        }

        return String(
            error.response.data.detail
        )
    }

    if (
        error?.message
    ) {
        return error.message
    }

    return fallback
}

// ============================================================================
// GET ATTENDANCE
// ============================================================================
//
// Search is sent to the backend.
//
// Backend performs:
//
//     search entire database
//     → filters
//     → count
//     → pagination
//
// The frontend does NOT search only the currently loaded page.
//
// IMPORTANT:
//
// This request uses apiClient instead of raw axios.
//
// Therefore:
//
//     Attendance request
//             ↓
//         401 response
//             ↓
//       apiClient interceptor
//             ↓
//       POST /auth/refresh
//             ↓
//       new access_token cookie
//             ↓
//       original request automatically retried
//
// ============================================================================

export const getAttendance = async ({
    search = '',
    employeeId = '',
    fromDate = '',
    toDate = '',
    status = '',
    page = 1,
    limit = 30,
} = {}) => {

    const params = {
        page,
        limit,
    }

    // ------------------------------------------------------------------------
    // Search
    // ------------------------------------------------------------------------

    if (
        String(
            search
        ).trim()
    ) {
        params.search =
            String(
                search
            ).trim()
    }

    // ------------------------------------------------------------------------
    // Employee
    // ------------------------------------------------------------------------

    if (
        employeeId !== '' &&
        employeeId !== null &&
        employeeId !== undefined
    ) {
        params.employee_id =
            employeeId
    }

    // ------------------------------------------------------------------------
    // From Date
    // ------------------------------------------------------------------------

    if (
        fromDate
    ) {
        params.from_date =
            fromDate
    }

    // ------------------------------------------------------------------------
    // To Date
    // ------------------------------------------------------------------------

    if (
        toDate
    ) {
        params.to_date =
            toDate
    }

    // ------------------------------------------------------------------------
    // Status
    // ------------------------------------------------------------------------

    if (
        status
    ) {
        params.status =
            String(
                status
            ).toLowerCase()
    }

    const response =
        await apiClient.get(
            '/employee-management/attendance',
            {
                params,
            }
        )

    const data =
        response?.data ||
        {}

    return {
        ...data,

        items:
            Array.isArray(
                data.items
            )
                ? data.items
                    .map(
                        normalizeAttendance
                    )
                    .filter(Boolean)
                : [],

        total:
            Number(
                data.total ||
                0
            ),

        page:
            Number(
                data.page ||
                page
            ),

        limit:
            Number(
                data.limit ||
                limit
            ),

        totalPages:
            Number(
                data.totalPages ||
                0
            ),
    }
}

// ============================================================================
// GET ATTENDANCE FOR SELECTED DATE
// ============================================================================
//
// No selectedDate:
//
//     backend uses today.
//
// selectedDate:
//
//     backend returns attendance for that exact date.
//
// IMPORTANT:
//
// This request also uses apiClient so expired access tokens are
// automatically refreshed and the original request is retried.
//
// ============================================================================

export const getTodayAttendance = async (
    selectedDate = ''
) => {

    const params = {}

    if (
        selectedDate
    ) {
        params.selected_date =
            selectedDate
    }

    const response =
        await apiClient.get(
            '/employee-management/attendance/today',
            {
                params,
            }
        )

    const data =
        response?.data

    return Array.isArray(
        data
    )
        ? data
            .map(
                normalizeTodayAttendance
            )
            .filter(Boolean)
        : []
}

// ============================================================================
// GET EMPLOYEE HISTORY
// ============================================================================
//
// IMPORTANT:
//
// This request uses apiClient so the shared authentication interceptor
// handles expired access tokens automatically.
//
// ============================================================================

export const getEmployeeHistory = async (
    employeeId,
    {
        fromDate = '',
        toDate = '',
    } = {}
) => {

    const params = {}

    if (
        fromDate
    ) {
        params.from_date =
            fromDate
    }

    if (
        toDate
    ) {
        params.to_date =
            toDate
    }

    const response =
        await apiClient.get(
            `/employee-management/attendance/employee/${employeeId}/history`,
            {
                params,
            }
        )

    return normalizeHistoryResponse(
        response?.data
    )
}