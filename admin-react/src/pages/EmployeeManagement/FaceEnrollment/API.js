// admin-react/src/pages/EmployeeManagement/FaceEnrollment/API.js


import apiClient from '../../../app/apiClient'


// =============================================================
// FACE CAPTURE TYPES
// =============================================================

export const FACE_CAPTURE_TYPES = {
    FRONT: 'FRONT',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
}


const VALID_CAPTURE_TYPES = new Set(
    Object.values(FACE_CAPTURE_TYPES)
)


// =============================================================
// EXTRACT API ERROR MESSAGE
// =============================================================

const extractErrorMessage = (error) => {

    const response = error?.response
    const data = response?.data
    const status = response?.status


    // ---------------------------------------------------------
    // FastAPI validation errors
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // FastAPI normal detail
    // ---------------------------------------------------------

    if (typeof data?.detail === 'string') {
        return data.detail
    }


    // ---------------------------------------------------------
    // Generic message
    // ---------------------------------------------------------

    if (typeof data?.message === 'string') {
        return data.message
    }


    // ---------------------------------------------------------
    // Generic error
    // ---------------------------------------------------------

    if (typeof data?.error === 'string') {
        return data.error
    }


    // ---------------------------------------------------------
    // Network error
    // ---------------------------------------------------------

    if (!response) {

        return (
            'Unable to connect to the server. Please check that the backend is running.'
        )
    }


    // ---------------------------------------------------------
    // HTTP fallback
    // ---------------------------------------------------------

    return `Request failed (${status || 'unknown'})`
}


// =============================================================
// COMMON REQUEST
// =============================================================

const request = async (config = {}) => {

    try {

        const response = await apiClient(
            config
        )

        return response.data

    } catch (error) {

        throw new Error(
            extractErrorMessage(error)
        )
    }
}


// =============================================================
// NORMALIZE FACE ENROLLMENT
// =============================================================

export const normalizeFaceEnrollment = (
    enrollment = {}
) => {

    return {

        captureType:
            enrollment.capture_type ??
            enrollment.captureType ??
            '',

        imagePath:
            enrollment.image_path ??
            enrollment.imagePath ??
            '',

        createdAt:
            enrollment.created_at ??
            enrollment.createdAt ??
            null,

        updatedAt:
            enrollment.updated_at ??
            enrollment.updatedAt ??
            null,

    }
}


// =============================================================
// NORMALIZE EMPLOYEE ENROLLMENT
// =============================================================

export const normalizeEmployeeEnrollment = (
    employee = {}
) => {

    const rawEnrollments =
        Array.isArray(employee.enrollments)
            ? employee.enrollments
            : []


    const enrollments =
        rawEnrollments
            .map(normalizeFaceEnrollment)
            .filter((enrollment) =>
                VALID_CAPTURE_TYPES.has(
                    String(
                        enrollment.captureType
                    ).toUpperCase()
                )
            )


    return {

        employeeId:
            employee.employee_id ??
            employee.employeeId ??
            null,

        employeeName:
            employee.employee_name ??
            employee.employeeName ??
            employee.name ??
            '',

        enrollmentCount:
            typeof employee.enrollment_count === 'number'
                ? employee.enrollment_count
                : enrollments.length,

        enrollments,

    }
}


// =============================================================
// NORMALIZE EMPLOYEE LIST
// =============================================================

export const normalizeFaceEnrollmentList = (
    response = {}
) => {

    const rawEmployees =
        Array.isArray(response.employees)
            ? response.employees
            : []


    return rawEmployees
        .map(normalizeEmployeeEnrollment)
        .filter(
            (employee) =>
                employee.employeeId !== null
        )
}


// =============================================================
// GET ALL EMPLOYEES + FACE ENROLLMENTS
// =============================================================

export const getFaceEnrollments = async () => {

    const data = await request({

        method: 'GET',

        url: '/face-enrollment',

    })


    return normalizeFaceEnrollmentList(
        data
    )
}


// =============================================================
// UPLOAD / RE-REGISTER FACE
// =============================================================

export const uploadFaceEnrollment = async (
    employeeId,
    captureType,
    imageFile
) => {

    // ---------------------------------------------------------
    // Employee validation
    // ---------------------------------------------------------

    if (
        employeeId === undefined ||
        employeeId === null
    ) {

        throw new Error(
            'Employee ID is required.'
        )
    }


    // ---------------------------------------------------------
    // Capture type validation
    // ---------------------------------------------------------

    const normalizedCaptureType =
        String(
            captureType || ''
        ).toUpperCase()


    if (
        !VALID_CAPTURE_TYPES.has(
            normalizedCaptureType
        )
    ) {

        throw new Error(
            'Invalid face capture type.'
        )
    }


    // ---------------------------------------------------------
    // File validation
    // ---------------------------------------------------------

    if (!imageFile) {

        throw new Error(
            'Face image is required.'
        )
    }


    if (
        !imageFile.type ||
        !imageFile.type.startsWith('image/')
    ) {

        throw new Error(
            'Please select a valid image file.'
        )
    }


    // ---------------------------------------------------------
    // Multipart form
    // ---------------------------------------------------------

    const formData = new FormData()

    formData.append(
        'image',
        imageFile
    )


    // ---------------------------------------------------------
    // API request
    // ---------------------------------------------------------

    const data = await request({

        method: 'POST',

        url:
            `/face-enrollment/${employeeId}`,

        params: {

            capture_type:
                normalizedCaptureType,

        },

        data: formData,

    })


    return normalizeFaceEnrollmentList(
        data
    )
}


// =============================================================
// DELETE FACE ENROLLMENT
// =============================================================

export const deleteFaceEnrollment = async (
    employeeId,
    captureType
) => {

    if (
        employeeId === undefined ||
        employeeId === null
    ) {

        throw new Error(
            'Employee ID is required.'
        )
    }


    const normalizedCaptureType =
        String(
            captureType || ''
        ).toUpperCase()


    if (
        !VALID_CAPTURE_TYPES.has(
            normalizedCaptureType
        )
    ) {

        throw new Error(
            'Invalid face capture type.'
        )
    }


    const data = await request({

        method: 'DELETE',

        url:
            `/face-enrollment/${employeeId}/${normalizedCaptureType}`,

    })


    return data
}


// =============================================================
// GET FACE IMAGE URL
// =============================================================

export const getFaceImageUrl = (
    imagePath = ''
) => {

    if (!imagePath) {
        return ''
    }


    const value =
        String(imagePath).trim()


    if (!value) {
        return ''
    }


    // ---------------------------------------------------------
    // Already an absolute URL
    // ---------------------------------------------------------

    if (
        value.startsWith('http://') ||
        value.startsWith('https://')
    ) {

        return value
    }


    // ---------------------------------------------------------
    // Normalize path
    // ---------------------------------------------------------

    const normalizedPath =
        value
            .replace(/^\/+/, '')
            .replace(/^uploads\/+/i, '')


    return `/uploads/${normalizedPath}`
}


// =============================================================
// DEFAULT EXPORT
// =============================================================

export default {

    getFaceEnrollments,

    uploadFaceEnrollment,

    deleteFaceEnrollment,

    normalizeFaceEnrollment,

    normalizeEmployeeEnrollment,

    normalizeFaceEnrollmentList,

    getFaceImageUrl,

    FACE_CAPTURE_TYPES,

}