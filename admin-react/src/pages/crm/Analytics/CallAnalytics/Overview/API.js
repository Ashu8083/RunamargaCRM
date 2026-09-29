// admin-react/src/pages/Analytics/CallAnalytics/Overview/API.js

import apiClient from '../../../../../app/apiClient'


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
// NORMALIZE CALL
// ============================================================================
//
// Backend:
//
// {
//     id,
//     employee_id,
//     employee,
//     phone_number,
//     call_type,
//     mobile_status,
//     call_started_at,
//     call_ended_at,
//     duration_seconds
// }
//
// Frontend:
//
// {
//     id,
//     employee_id,
//     employeeId,
//     employee,
//     phone,
//     phone_number,
//     type,
//     call_type,
//     status,
//     mobile_status,
//     date,
//     call_started_at,
//     callStartedAt,
//     call_ended_at,
//     callEndedAt,
//     duration_seconds,
//     durationSeconds
// }
//
// ============================================================================

const normalizeCall = (call) => {

    if (!call) {
        return null
    }


    // ------------------------------------------------------------
    // ID
    // ------------------------------------------------------------

    const id =
        call.id != null
            ? Number(call.id)
            : null


    // ------------------------------------------------------------
    // EMPLOYEE ID
    // ------------------------------------------------------------

    const employeeId =
        call.employee_id != null
            ? Number(call.employee_id)
            : call.employeeId != null
                ? Number(call.employeeId)
                : null


    // ------------------------------------------------------------
    // CALL START TIME
    // ------------------------------------------------------------

    const callStartedAt =
        call.call_started_at ||
        call.callStartedAt ||
        null


    // ------------------------------------------------------------
    // CALL END TIME
    // ------------------------------------------------------------

    const callEndedAt =
        call.call_ended_at ||
        call.callEndedAt ||
        null


    // ------------------------------------------------------------
    // PHONE
    // ------------------------------------------------------------

    const phoneNumber =
        call.phone_number ||
        call.phone ||
        ''


    // ------------------------------------------------------------
    // CALL TYPE
    // ------------------------------------------------------------

    const callType =
        call.call_type ||
        call.type ||
        ''


    // ------------------------------------------------------------
    // CALL STATUS
    // ------------------------------------------------------------

    const mobileStatus =
        call.mobile_status ||
        call.status ||
        ''


    // ------------------------------------------------------------
    // DURATION
    // ------------------------------------------------------------

    const durationSeconds =
        call.duration_seconds != null
            ? Number(
                call.duration_seconds
            )
            : call.durationSeconds != null
                ? Number(
                    call.durationSeconds
                )
                : null


    // ------------------------------------------------------------
    // NORMALIZED OBJECT
    // ------------------------------------------------------------

    return {

        ...call,


        // --------------------------------------------------------
        // IDs
        // --------------------------------------------------------

        id,

        employee_id:
            employeeId,

        employeeId,


        // --------------------------------------------------------
        // EMPLOYEE
        // --------------------------------------------------------

        employee:
            call.employee ||
            'Unknown Employee',


        // --------------------------------------------------------
        // PHONE
        // --------------------------------------------------------

        phone:
            phoneNumber,

        phone_number:
            phoneNumber,


        // --------------------------------------------------------
        // CALL TYPE
        // --------------------------------------------------------

        type:
            callType,

        call_type:
            callType,


        // --------------------------------------------------------
        // CALL STATUS
        // --------------------------------------------------------

        status:
            mobileStatus,

        mobile_status:
            mobileStatus,


        // --------------------------------------------------------
        // DATE
        // --------------------------------------------------------

        date:
            callStartedAt
                ? String(
                    callStartedAt
                ).slice(0, 10)
                : '',


        // --------------------------------------------------------
        // DATE / TIME
        // --------------------------------------------------------

        call_started_at:
            callStartedAt,

        callStartedAt,


        call_ended_at:
            callEndedAt,

        callEndedAt,


        // --------------------------------------------------------
        // DURATION
        // --------------------------------------------------------

        duration_seconds:
            durationSeconds,

        durationSeconds,

    }

}


// ============================================================================
// NORMALIZE SUMMARY
// ============================================================================

const normalizeSummary = (
    summary = {}
) => {

    return {

        total:
            Number(
                summary.total || 0
            ),

        answered:
            Number(
                summary.answered || 0
            ),

        missed:
            Number(
                summary.missed || 0
            ),

        unknown:
            Number(
                summary.unknown || 0
            ),

        assigned:
            Number(
                summary.assigned || 0
            ),

        converted:
            Number(
                summary.converted || 0
            ),

    }

}


// ============================================================================
// NORMALIZE OVERVIEW
// ============================================================================

const normalizeOverview = (
    data
) => {

    if (!data) {

        return {

            summary:
                normalizeSummary(),

            calls: [],

        }

    }


    const calls =
        Array.isArray(
            data.calls
        )
            ? data.calls
                .map(
                    normalizeCall
                )
                .filter(Boolean)
            : []


    return {

        summary:
            normalizeSummary(
                data.summary
            ),

        calls,

    }

}


// ============================================================================
// GET CALL ANALYTICS OVERVIEW
// ============================================================================
//
// Backend:
//
// GET /call-analytics/overview
//
// Supported query parameters:
//
// employee_id
// from_date
// to_date
// call_type
// status
// context_id
//
// ============================================================================

export const getCallAnalyticsOverview = async (
    filters = {}
) => {

    const params = {}


    // ------------------------------------------------------------
    // EMPLOYEE
    // ------------------------------------------------------------
    //
    // EmployeeDropdown returns the selected employee ID.
    //
    // Do not send an empty employee_id.
    //
    // ------------------------------------------------------------

    if (
        filters.employeeId !== undefined &&
        filters.employeeId !== null &&
        filters.employeeId !== ''
    ) {

        const employeeId =
            Number(
                filters.employeeId
            )


        if (
            Number.isFinite(
                employeeId
            )
        ) {

            params.employee_id =
                employeeId

        }

    }


    // ------------------------------------------------------------
    // FROM DATE
    // ------------------------------------------------------------

    if (
        filters.fromDate
    ) {

        params.from_date =
            filters.fromDate

    }


    // ------------------------------------------------------------
    // TO DATE
    // ------------------------------------------------------------

    if (
        filters.toDate
    ) {

        params.to_date =
            filters.toDate

    }


    // ------------------------------------------------------------
    // CALL TYPE
    // ------------------------------------------------------------

    if (
        filters.callType
    ) {

        params.call_type =
            filters.callType

    }


    // ------------------------------------------------------------
    // STATUS
    // ------------------------------------------------------------

    if (
        filters.status
    ) {

        params.status =
            filters.status

    }


    // ------------------------------------------------------------
    // CONTEXT ID
    // ------------------------------------------------------------
    //
    // Optional.
    //
    // Overview/index.jsx currently does not send this value,
    // so it will normally remain absent.
    //
    // It is supported here so the API layer matches the backend
    // route without forcing a frontend context selector.
    //
    // ------------------------------------------------------------

    if (
        filters.contextId !== undefined &&
        filters.contextId !== null &&
        filters.contextId !== ''
    ) {

        const contextId =
            Number(
                filters.contextId
            )


        if (
            Number.isFinite(
                contextId
            )
        ) {

            params.context_id =
                contextId

        }

    }


    // ------------------------------------------------------------
    // REQUEST
    // ------------------------------------------------------------

    const response =
        await apiClient.get(
            '/call-analytics/overview',
            {
                params,
            }
        )


    // ------------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------------

    return normalizeOverview(
        response.data
    )

}