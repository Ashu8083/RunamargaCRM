
/*
 * admin-react/src/pages/crm/EmployeeManagement/LeaveManagement/API.js
 */

import apiClient from '../../../../app/apiClient'


// ============================================================================
// GET LEAVE REQUESTS
// ============================================================================

export const getLeaveRequests = async () => {
    const response = await apiClient.get(
        '/leave-management'
    )

    return Array.isArray(response?.data)
        ? response.data
        : []
}


// ============================================================================
// CREATE LEAVE REQUEST
// ============================================================================

export const createLeaveRequest = async (
    leaveData
) => {
    const response = await apiClient.post(
        '/leave-management',
        {
            from_date: leaveData.from_date,
            to_date: leaveData.to_date,
            leave_type: leaveData.leave_type,
            reason: leaveData.reason,
        }
    )

    return response?.data
}


// ============================================================================
// REVIEW LEAVE REQUEST
// ============================================================================

export const reviewLeaveRequest = async (
    leaveId,
    reviewData
) => {
    const response = await apiClient.patch(
        `/leave-management/${leaveId}/review`,
        {
            status: reviewData.status,
            review_remarks:
                reviewData.review_remarks?.trim() || null,
        }
    )

    return response?.data
}


// ============================================================================
// API ERROR MESSAGE
// ============================================================================

export const getLeaveApiErrorMessage = (
    error,
    fallback = 'Something went wrong. Please try again.'
) => {
    const detail = error?.response?.data?.detail

    if (Array.isArray(detail)) {
        return detail
            .map(
                (item) => item?.msg || String(item)
            )
            .join(', ')
    }

    if (detail) {
        return typeof detail === 'string'
            ? detail
            : JSON.stringify(detail)
    }

    if (error?.message) {
        return error.message
    }

    return fallback
}
