
// admin-react/src/pages/crm/EmployeeManagement/Holiday/API.js

import apiClient from '../../../../app/apiClient'

// ============================================================================
// GET HOLIDAYS
// ============================================================================
//
// month:
//     Optional month in YYYY-MM format.
//     Example: '2026-10'
//
// isActive:
//     true  -> Fetch active holidays.
//     false -> Fetch inactive holidays.
//
// Examples:
//     getHolidays('2026-10', true)
//     getHolidays('2026-10', false)
//
// ============================================================================

export const getHolidays = async (
    month = '',
    isActive = true
) => {
    const params = {
        is_active: isActive,
    }

    if (month) {
        params.month = month
    }

    const response = await apiClient.get(
        '/holidays/',
        {
            params,
        }
    )

    const data = response?.data

    return Array.isArray(data)
        ? data
        : []
}


// ============================================================================
// CREATE HOLIDAY
// ============================================================================

export const createHoliday = async (
    holidayData
) => {
    const response = await apiClient.post(
        '/holidays/',
        {
            name: holidayData.name,
            date: holidayData.date,
            description: holidayData.description || null,
            is_active: holidayData.is_active ?? true,
        }
    )

    return response?.data
}


// ============================================================================
// UPDATE HOLIDAY
// ============================================================================

export const updateHoliday = async (
    holidayData
) => {
    const response = await apiClient.put(
        '/holidays/',
        {
            id: holidayData.id,
            name: holidayData.name,
            date: holidayData.date,
            description: holidayData.description || null,
            is_active: holidayData.is_active ?? true,
        }
    )

    return response?.data
}


// ============================================================================
// DELETE / DEACTIVATE HOLIDAY
// ============================================================================
//
// The backend performs a soft delete by setting is_active = false.
// The record remains in the database.
//
// ============================================================================

export const deleteHoliday = async (
    holidayId
) => {
    const response = await apiClient.delete(
        `/holidays/${holidayId}`
    )

    return response?.data
}


// ============================================================================
// API ERROR MESSAGE
// ============================================================================

export const getHolidayApiErrorMessage = (
    error,
    fallback = 'Something went wrong.'
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
        return String(detail)
    }

    if (error?.message) {
        return error.message
    }

    return fallback
}
