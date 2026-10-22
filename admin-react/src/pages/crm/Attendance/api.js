
 // admin-react\src\pages\crm\Attendance\api.js

import apiClient from '../../../app/apiClient'


// =============================================================
// GET MY ATTENDANCE
// GET /attendance
// GET /attendance?month=YYYY-MM
// =============================================================

export const getMyAttendance = async (month = null) => {
    const config = month
        ? { params: { month } }
        : {}

    const response = await apiClient.get(
        '/attendance',
        config
    )

    // Preserve the complete response from the controller:
    // success, selected_month, data, daily_summary,
    // monthly_summary, leave_data, and leave_balance.
    return response.data
}


// =============================================================
// APPLY FOR LEAVE
// POST /attendance/apply/leave
// =============================================================

export const applyForLeave = async (data) => {
    const response = await apiClient.post(
        '/attendance/apply/leave',
        {
            from_date: data.fromDate,
            to_date: data.toDate,
            leave_type: data.category,
            reason: data.reason,
        }
    )

    return response.data
}


// =============================================================
// VIEW MY LEAVE REQUESTS AND BALANCE
// GET /attendance/view/leave
// =============================================================

export const getMyLeaveRequests = async () => {
    const response = await apiClient.get(
        '/attendance/view/leave'
    )

    return response.data
}


// =============================================================
// UPDATE MY LEAVE REQUEST
// PUT /attendance/update/leave/{leave_id}
// =============================================================

export const updateMyLeaveRequest = async (leaveId, data) => {
    const response = await apiClient.put(
        `/attendance/update/leave/${leaveId}`,
        {
            from_date: data.fromDate,
            to_date: data.toDate,
            leave_type: data.category,
            reason: data.reason,
        }
    )

    return response.data
}


// =============================================================
// CANCEL MY LEAVE REQUEST
// PATCH /attendance/cancel/leave/{leave_id}
// =============================================================

export const cancelMyLeaveRequest = async (leaveId) => {
    const response = await apiClient.patch(
        `/attendance/cancel/leave/${leaveId}`
    )

    return response.data
}
